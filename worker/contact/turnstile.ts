// Verificación de los tokens de Cloudflare Turnstile (formulario de contacto y página
// de autorización OAuth).

import type { HttpClient } from '../http/client';

const SITEVERIFY = 'https://challenges.cloudflare.com/turnstile/v0/siteverify';

export interface TurnstileCheck {
  token: string;
  /** IP de la persona, si se conoce. */
  remoteIp?: string | null;
  /** Acción que debe declarar el widget (p. ej. "contact"). */
  action?: string;
}

export class TurnstileVerifier {
  constructor(
    private readonly secretKey: string,
    private readonly http: HttpClient,
  ) {}

  async verify({ token, remoteIp, action }: TurnstileCheck): Promise<boolean> {
    if (!token) return false;
    const form = new FormData();
    form.append('secret', this.secretKey);
    form.append('response', token);
    if (remoteIp) form.append('remoteip', remoteIp);
    const response = await this.http(SITEVERIFY, { method: 'POST', body: form });
    const outcome = (await response.json().catch(() => ({}))) as { success?: boolean; action?: string };
    return outcome.success === true && (!action || !outcome.action || outcome.action === action);
  }
}
