import { describe, expect, it } from 'vitest';
import { BASE } from './base';

const send = (body: unknown, headers: Record<string, string> = {}) =>
  fetch(`${BASE}/api/v1/contact`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Origin: BASE, ...headers },
    body: JSON.stringify(body),
  });

describe('API del formulario de contacto', () => {
  it('valida los campos antes de nada', async () => {
    const response = await send({ name: '', email: 'x', subject: 's', message: 'm' });
    expect(response.status).toBe(400);
    expect(await response.json()).toEqual({ ok: false, error: 'required', field: 'name' });
  });

  it('rechaza peticiones desde otros sitios', async () => {
    const response = await send({}, { Origin: 'https://evil.example' });
    expect(response.status).toBe(403);
  });

  it('acepta un mensaje con un token de Turnstile válido', async () => {
    const response = await send({
      name: 'E2E',
      email: 'e2e@example.com',
      subject: 'Prueba',
      message: 'Mensaje de prueba',
      token: 'XXXX.DUMMY.TOKEN.XXXX',
    });
    // Sin clave de EmailJS (local y CI) el servicio responde que no está disponible;
    // si otra prueba acaba de enviar, el límite de un mensaje por minuto.
    expect([200, 429, 503]).toContain(response.status);
  });
});
