// POST /api/v1/contact: el formulario de contacto de la web. Exige un token de
// Cloudflare Turnstile y limita los envíos por IP.

import { validateMessage, type ContactError } from '../../src/lib/contact';
import { jsonNoStore, methodNotAllowed } from '../http/headers';
import type { ContactService } from './contact-service';
import type { TurnstileVerifier } from './turnstile';

export const CONTACT_API_PATH = '/api/v1/contact';

/** Mensajes por hora y IP desde el formulario de la web. */
export const WEB_MESSAGES_PER_HOUR = 5;

const MAX_BODY_BYTES = 16 * 1024;

export interface ContactApiDependencies {
  contact: ContactService;
  /** null si falta la clave secreta de Turnstile. */
  turnstile: TurnstileVerifier | null;
  /** Un envío por minuto e IP. */
  rateLimiter: RateLimit | undefined;
  siteOrigin: string;
  /** Seudónimo de la IP para los límites (no se guarda la IP). */
  pseudonymize: (ip: string) => Promise<string>;
}

const STATUS: Record<ContactError, number> = {
  required: 400,
  invalid_email: 400,
  too_long: 400,
  rate_limited: 429,
  hourly_limit: 429,
  daily_limit: 429,
  verification_failed: 403,
  unavailable: 503,
  send_failed: 502,
};

const failure = (
  error: ContactError | 'forbidden' | 'unsupported_media_type' | 'payload_too_large' | 'bad_request',
  status?: number,
) => jsonNoStore({ ok: false, error }, status ?? (error in STATUS ? STATUS[error as ContactError] : 400));

export async function handleContactApi(request: Request, deps: ContactApiDependencies): Promise<Response> {
  if (request.method !== 'POST') return methodNotAllowed('POST');

  // Solo desde la propia web: protege frente a envíos desde otras páginas (CSRF).
  const origin = request.headers.get('Origin');
  if (origin && origin !== deps.siteOrigin) return failure('forbidden', 403);
  if (!(request.headers.get('Content-Type') ?? '').includes('application/json')) {
    return failure('unsupported_media_type', 415);
  }
  if (Number(request.headers.get('Content-Length') ?? 0) > MAX_BODY_BYTES) return failure('payload_too_large', 413);

  const text = await request.text();
  if (text.length > MAX_BODY_BYTES) return failure('payload_too_large', 413);
  let body: Record<string, unknown>;
  try {
    const parsed: unknown = JSON.parse(text);
    if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) return failure('bad_request');
    body = parsed as Record<string, unknown>;
  } catch {
    return failure('bad_request');
  }

  const invalid = validateMessage(body);
  if (invalid) return jsonNoStore({ ok: false, error: invalid.error, field: invalid.field }, 400);
  if (!deps.turnstile) return failure('unavailable');

  const ip = request.headers.get('CF-Connecting-IP') ?? 'local';
  if (deps.rateLimiter && !(await deps.rateLimiter.limit({ key: `contact:${ip}` })).success) {
    return jsonNoStore({ ok: false, error: 'rate_limited' }, 429, { 'Retry-After': '60' });
  }

  const token = typeof body.token === 'string' ? body.token : '';
  if (!(await deps.turnstile.verify({ token, remoteIp: ip, action: 'contact' }))) {
    return failure('verification_failed');
  }

  const result = await deps.contact.send(body, {
    key: `web:${await deps.pseudonymize(ip)}`,
    perHour: WEB_MESSAGES_PER_HOUR,
  });
  return result.ok ? jsonNoStore({ ok: true }) : failure(result.error);
}
