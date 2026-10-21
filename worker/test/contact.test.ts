import { describe, expect, it } from 'vitest';
import { API_PATHS } from '../../src/agent/api-resources';
import { handleContactApi, type ContactApiDependencies } from '../contact/contact-api';
import { ContactService } from '../contact/contact-service';
import { EmailJsSender } from '../contact/emailjs-sender';
import { KvMessageLimits, MESSAGES_PER_DAY, type MessageLimits } from '../contact/message-limits';
import type { MessageSender, OutgoingMessage } from '../contact/message-sender';
import { TurnstileVerifier } from '../contact/turnstile';
import { countingLimiter, MemoryKv } from './fakes';

const ORIGIN = 'https://example.test';
const MESSAGE = { name: ' Ana ', email: 'ana@example.com', subject: 'Hola', message: 'Un mensaje' };

class RecordingSender implements MessageSender {
  readonly sent: OutgoingMessage[] = [];
  constructor(private readonly fail = false) {}
  send(message: OutgoingMessage): Promise<void> {
    if (this.fail) return Promise.reject(new Error('caído'));
    this.sent.push(message);
    return Promise.resolve();
  }
}

const noLimits: MessageLimits = { check: () => Promise.resolve(null), record: () => Promise.resolve() };
const silent = () => undefined;

describe('ContactService', () => {
  it('envía el mensaje normalizado con el pie del canal y lo cuenta', async () => {
    const sender = new RecordingSender();
    const kv = new MemoryKv();
    const service = new ContactService(sender, new KvMessageLimits(kv.asKv()), silent);
    await expect(service.send(MESSAGE, { key: 'mcp:u1', perHour: 3, footer: 'Por MCP' })).resolves.toEqual({
      ok: true,
    });
    expect(sender.sent).toEqual([{ ...MESSAGE, name: 'Ana', footer: 'Por MCP' }]);
    expect([...kv.data.values()]).toEqual(['1', '1']);
  });

  it('rechaza mensajes no válidos sin enviarlos', async () => {
    const sender = new RecordingSender();
    const service = new ContactService(sender, noLimits, silent);
    await expect(service.send({ ...MESSAGE, email: 'no' }, { key: 'k', perHour: 3 })).resolves.toEqual({
      ok: false,
      error: 'invalid_email',
      field: 'email',
    });
    expect(sender.sent).toHaveLength(0);
  });

  it('sin canal de envío responde que no está disponible', async () => {
    await expect(new ContactService(null, noLimits, silent).send(MESSAGE, { key: 'k', perHour: 3 })).resolves.toEqual({
      ok: false,
      error: 'unavailable',
    });
  });

  it('si el envío falla no cuenta el mensaje', async () => {
    const kv = new MemoryKv();
    const service = new ContactService(new RecordingSender(true), new KvMessageLimits(kv.asKv()), silent);
    await expect(service.send(MESSAGE, { key: 'k', perHour: 3 })).resolves.toEqual({ ok: false, error: 'send_failed' });
    expect(kv.data.size).toBe(0);
  });

  it('aplica el límite por remitente y hora y el diario', async () => {
    const kv = new MemoryKv();
    const now = () => new Date('2026-10-20T10:30:00Z');
    const service = new ContactService(
      new RecordingSender(),
      new KvMessageLimits(kv.asKv(), MESSAGES_PER_DAY, now),
      silent,
    );
    for (let i = 0; i < 2; i++) await service.send(MESSAGE, { key: 'web:a', perHour: 2 });
    await expect(service.send(MESSAGE, { key: 'web:a', perHour: 2 })).resolves.toEqual({
      ok: false,
      error: 'hourly_limit',
    });
    kv.data.set('contact-limit:day:2026-10-20', String(MESSAGES_PER_DAY));
    await expect(service.send(MESSAGE, { key: 'web:b', perHour: 2 })).resolves.toEqual({
      ok: false,
      error: 'daily_limit',
    });
    expect(kv.ttl.get('contact-limit:sender:web:a:2026-10-20T10')).toBe(7200);
  });
});

describe('EmailJsSender', () => {
  it('usa la plantilla del formulario y añade el pie', async () => {
    let body: Record<string, unknown> = {};
    const sender = new EmailJsSender(
      { serviceId: 's', templateId: 't', publicKey: 'p', privateKey: 'k' },
      (_url, init) => {
        body = JSON.parse(String(init?.body)) as Record<string, unknown>;
        return Promise.resolve(new Response('OK'));
      },
    );
    await sender.send({ name: 'Ana', email: 'a@b.c', subject: 'S', message: 'M', footer: 'Pie' });
    expect(body).toMatchObject({
      service_id: 's',
      template_id: 't',
      user_id: 'p',
      accessToken: 'k',
      template_params: { from_name: 'Ana', name: 'Ana', email: 'a@b.c', title: 'S', message: 'M\n\n—\nPie' },
    });
  });

  it('un error de EmailJS se propaga', async () => {
    const sender = new EmailJsSender({ serviceId: 's', templateId: 't', publicKey: 'p', privateKey: 'k' }, () =>
      Promise.resolve(new Response('Forbidden', { status: 403 })),
    );
    await expect(sender.send({ name: 'A', email: 'a@b.c', subject: 'S', message: 'M' })).rejects.toThrow('403');
  });
});

describe('TurnstileVerifier', () => {
  const verifier = (outcome: Record<string, unknown>) =>
    new TurnstileVerifier('secret', () => Promise.resolve(Response.json(outcome)));

  it('acepta un token válido con la acción esperada', async () => {
    await expect(
      verifier({ success: true, action: 'contact' }).verify({ token: 't', action: 'contact' }),
    ).resolves.toBe(true);
  });

  it('rechaza tokens vacíos, fallidos o de otra acción', async () => {
    await expect(verifier({ success: true }).verify({ token: '' })).resolves.toBe(false);
    await expect(verifier({ success: false }).verify({ token: 't' })).resolves.toBe(false);
    await expect(verifier({ success: true, action: 'login' }).verify({ token: 't', action: 'contact' })).resolves.toBe(
      false,
    );
  });
});

describe(`POST ${API_PATHS.contact}`, () => {
  function deps(overrides: Partial<ContactApiDependencies> = {}): ContactApiDependencies & { sender: RecordingSender } {
    const sender = new RecordingSender();
    return {
      sender,
      contact: new ContactService(sender, noLimits, silent),
      turnstile: new TurnstileVerifier('secret', () =>
        Promise.resolve(Response.json({ success: true, action: 'contact' })),
      ),
      rateLimiter: countingLimiter(10),
      siteOrigin: ORIGIN,
      pseudonymize: (ip) => Promise.resolve(`h-${ip}`),
      ...overrides,
    };
  }

  const post = (body: unknown, headers: Record<string, string> = {}) =>
    new Request(`${ORIGIN}${API_PATHS.contact}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Origin: ORIGIN, 'CF-Connecting-IP': '203.0.113.7', ...headers },
      body: typeof body === 'string' ? body : JSON.stringify(body),
    });

  it('envía un mensaje válido', async () => {
    const d = deps();
    const response = await handleContactApi(post({ ...MESSAGE, token: 'ok' }), d);
    expect(response.status).toBe(200);
    expect(await response.json()).toEqual({ ok: true });
    expect(response.headers.get('Cache-Control')).toBe('no-store');
    expect(d.sender.sent).toHaveLength(1);
  });

  it.each([
    ['otro origen', post(MESSAGE, { Origin: 'https://evil.test' }), 403, 'forbidden'],
    ['sin JSON', post('x', { 'Content-Type': 'text/plain' }), 415, 'unsupported_media_type'],
    ['JSON roto', post('{', {}), 400, 'bad_request'],
    ['un campo vacío', post({ ...MESSAGE, name: '' }), 400, 'required'],
  ])('rechaza %s', async (_case, request, status, error) => {
    const response = await handleContactApi(request, deps());
    expect(response.status).toBe(status);
    expect(await response.json()).toMatchObject({ ok: false, error });
  });

  it('rechaza el token de Turnstile no válido', async () => {
    const turnstile = new TurnstileVerifier('secret', () => Promise.resolve(Response.json({ success: false })));
    const response = await handleContactApi(post({ ...MESSAGE, token: 'x' }), deps({ turnstile }));
    expect(response.status).toBe(403);
    expect(await response.json()).toEqual({ ok: false, error: 'verification_failed' });
  });

  it('limita a un envío por minuto e IP', async () => {
    const d = deps({ rateLimiter: countingLimiter(1) });
    expect((await handleContactApi(post({ ...MESSAGE, token: 'ok' }), d)).status).toBe(200);
    const second = await handleContactApi(post({ ...MESSAGE, token: 'ok' }), d);
    expect(second.status).toBe(429);
    expect(second.headers.get('Retry-After')).toBe('60');
  });

  it('sin Turnstile configurado no está disponible', async () => {
    const response = await handleContactApi(post({ ...MESSAGE, token: 'ok' }), deps({ turnstile: null }));
    expect(response.status).toBe(503);
  });

  it('solo admite POST', async () => {
    const response = await handleContactApi(new Request(`${ORIGIN}${API_PATHS.contact}`), deps());
    expect(response.status).toBe(405);
    expect(response.headers.get('Allow')).toBe('POST');
  });
});
