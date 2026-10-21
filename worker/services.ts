// Raíz de composición: crea los servicios del Worker a partir de env (bindings, variables
// y secretos). Los módulos reciben lo que necesitan; ninguno lee env por su cuenta.

import { TURNSTILE_SITE_KEY } from '../src/config/turnstile';
import { ContactService } from './contact/contact-service';
import { EmailJsSender } from './contact/emailjs-sender';
import { KvMessageLimits } from './contact/message-limits';
import { TurnstileVerifier } from './contact/turnstile';
import type { HttpClient } from './http/client';
import { WebBotAuth } from './security/web-bot-auth';

export interface Services {
  origin: string;
  assets: Fetcher;
  botAuth: WebBotAuth;
  /** fetch() saliente, firmado con Web Bot Auth si hay clave. */
  http: HttpClient;
  /** null si falta TURNSTILE_SECRET_KEY. */
  turnstile: TurnstileVerifier | null;
  turnstileSiteKey: string;
  contact: ContactService;
  /** Seudónimo estable de una IP (HMAC con un secreto), para no guardar IPs. */
  pseudonymize: (value: string) => Promise<string>;
}

function emailSender(env: Env, http: HttpClient): EmailJsSender | null {
  const { EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, EMAILJS_PUBLIC_KEY, EMAILJS_PRIVATE_KEY } = env;
  if (!EMAILJS_SERVICE_ID || !EMAILJS_TEMPLATE_ID || !EMAILJS_PUBLIC_KEY || !EMAILJS_PRIVATE_KEY) return null;
  return new EmailJsSender(
    {
      serviceId: EMAILJS_SERVICE_ID,
      templateId: EMAILJS_TEMPLATE_ID,
      publicKey: EMAILJS_PUBLIC_KEY,
      privateKey: EMAILJS_PRIVATE_KEY,
    },
    http,
  );
}

function hmacPseudonymizer(secret: string | undefined): (value: string) => Promise<string> {
  const key = secret
    ? crypto.subtle.importKey('raw', new TextEncoder().encode(secret), { name: 'HMAC', hash: 'SHA-256' }, false, [
        'sign',
      ])
    : undefined;
  return async (value) => {
    if (!key) return 'anonymous';
    const signature = await crypto.subtle.sign('HMAC', await key, new TextEncoder().encode(value));
    return [...new Uint8Array(signature).slice(0, 16)].map((b) => b.toString(16).padStart(2, '0')).join('');
  };
}

export function createServices(env: Env): Services {
  const origin = env.SITE_ORIGIN;
  const botAuth = new WebBotAuth(env.WEB_BOT_AUTH_PRIVATE_KEY, origin);
  const http = botAuth.fetch;
  return {
    origin,
    assets: env.ASSETS,
    botAuth,
    http,
    turnstile: env.TURNSTILE_SECRET_KEY ? new TurnstileVerifier(env.TURNSTILE_SECRET_KEY, http) : null,
    turnstileSiteKey: env.TURNSTILE_SITE_KEY || TURNSTILE_SITE_KEY,
    contact: new ContactService(emailSender(env, http), new KvMessageLimits(env.OAUTH_KV)),
    pseudonymize: hmacPseudonymizer(env.TURNSTILE_SECRET_KEY),
  };
}
