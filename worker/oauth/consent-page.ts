// HTML de la página de autorización OAuth (/authorize). Solo genera el documento: no
// toca la librería OAuth ni hace peticiones.

import { PERSON_NAME } from '../../src/data/profile';
import { fillTemplate, type Dictionary, type Lang } from '../../src/i18n';
import { TURNSTILE_SCRIPT } from '../../src/config/turnstile';
import { COMMON_SECURITY_HEADERS } from '../http/headers';

/** Escapa un texto para insertarlo en HTML (todo lo que viene del cliente OAuth). */
export const escapeHtml = (value: string): string => value.replace(/[&<>"']/g, (c) => `&#${c.charCodeAt(0)};`);

/**
 * Política de la página: solo se ejecuta el script de Turnstile con el nonce de esta
 * respuesta (y lo que él cargue). El dominio de Turnstile queda para navegadores sin CSP 3.
 */
export const consentPagePolicy = (nonce: string): string =>
  [
    "default-src 'none'",
    `script-src 'nonce-${nonce}' 'strict-dynamic' https://challenges.cloudflare.com`,
    'frame-src https://challenges.cloudflare.com',
    'connect-src https://challenges.cloudflare.com',
    "style-src 'unsafe-inline'",
    "img-src 'self' data:",
    "base-uri 'none'",
    "form-action 'self'",
    "frame-ancestors 'none'",
  ].join('; ');

/**
 * Cabeceras de la página: las comunes del dominio más su política con nonce. Sin
 * Cross-Origin-Opener-Policy a propósito: los clientes OAuth que abren la autorización en una
 * ventana emergente perderían la referencia a ella y no recibirían el código.
 */
export const consentPageHeaders = (nonce: string): Record<string, string> => ({
  ...COMMON_SECURITY_HEADERS,
  'Content-Type': 'text/html; charset=utf-8',
  'Content-Security-Policy': consentPagePolicy(nonce),
  'X-Frame-Options': 'DENY',
  'Referrer-Policy': 'no-referrer',
  'Cache-Control': 'no-store',
});

/** Nonce aleatorio para una respuesta. */
export const createNonce = (): string => btoa(String.fromCharCode(...crypto.getRandomValues(new Uint8Array(16))));

const STYLES = `
  :root { color-scheme: light dark; --bg: light-dark(#f6f8fa, #0b1120); --card: light-dark(#fff, #111a2c);
    --line: light-dark(#e3e8ef, #23304a); --fg: light-dark(#0f172a, #e6ebf2); --muted: light-dark(#475569, #a9b4c4);
    --accent: light-dark(#1d4ed8, #7cb0ff); --accent-fg: light-dark(#fff, #0b1120); --warn: light-dark(#92400e, #fcd34d);
    --danger: light-dark(#b91c1c, #fb8c8c); }
  * { box-sizing: border-box; }
  body { margin: 0; min-height: 100vh; display: grid; place-items: center; padding: 16px; background: var(--bg);
    color: var(--fg); font: 15px/1.6 system-ui, -apple-system, "Segoe UI", Roboto, sans-serif; }
  main { width: 100%; max-width: 480px; background: var(--card); border: 1px solid var(--line); border-radius: 12px; padding: 28px; }
  .brand { margin: 0 0 20px; font-size: 13px; font-weight: 600; color: var(--muted); }
  h1 { font-size: 20px; line-height: 1.35; margin: 0 0 12px; }
  p { margin: 0 0 12px; color: var(--muted); }
  strong { color: var(--fg); }
  .warn { color: var(--warn); }
  .error { color: var(--danger); }
  fieldset { border: 1px solid var(--line); border-radius: 8px; padding: 12px 14px; margin: 16px 0; }
  legend { padding: 0 6px; font-size: 12px; font-weight: 600; text-transform: uppercase; letter-spacing: .08em; color: var(--muted); }
  label { display: flex; gap: 10px; align-items: flex-start; margin: 8px 0; }
  input[type=checkbox] { margin-top: 4px; accent-color: var(--accent); }
  .actions { display: flex; gap: 10px; margin-top: 18px; }
  button { flex: 1; border-radius: 6px; padding: 11px 16px; font: inherit; font-weight: 600; cursor: pointer; }
  .allow { background: var(--accent); color: var(--accent-fg); border: 1px solid var(--accent); }
  .deny { background: transparent; color: var(--fg); border: 1px solid var(--line); }
  button:focus-visible, input:focus-visible { outline: 2px solid var(--accent); outline-offset: 2px; }
  .cf-turnstile { margin-top: 12px; min-height: 65px; }
`;

/** Documento HTML completo de la página de autorización. */
export function consentDocument(lang: Lang, title: string, body: string): string {
  return `<!doctype html>
<html lang="${lang}">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="robots" content="noindex">
<title>${escapeHtml(title)} · ${PERSON_NAME}</title>
<style>${STYLES}</style>
</head>
<body><main><p class="brand">${PERSON_NAME}</p>${body}</main></body>
</html>`;
}

/** Página con un único mensaje (error o aviso). */
export const messageBody = (t: Dictionary['consent'], message: string): string =>
  `<h1>${escapeHtml(t.title)}</h1><p class="error" role="alert">${escapeHtml(message)}</p>`;

export interface ConsentFormView {
  t: Dictionary['consent'];
  lang: Lang;
  clientName: string;
  clientDomain?: string | undefined;
  redirectHost: string;
  redirectIsLoopback: boolean;
  /** Permisos que se muestran: el obligatorio va marcado y bloqueado. */
  scopes: { value: string; label: string; required: boolean }[];
  handle: string;
  siteKey: string;
  /** Nonce del script de Turnstile (el de la política de esta respuesta). */
  nonce: string;
  error?: string | undefined;
}

/** Formulario de consentimiento: quién pide acceso, a dónde va y con qué permisos. */
export function consentFormBody(view: ConsentFormView): string {
  const { t } = view;
  const scopes = view.scopes
    .map((scope) =>
      scope.required
        ? `<label><input type="checkbox" checked disabled> <span>${escapeHtml(scope.label)}</span></label><input type="hidden" name="scope" value="${escapeHtml(scope.value)}">`
        : `<label><input type="checkbox" name="scope" value="${escapeHtml(scope.value)}" checked> <span>${escapeHtml(scope.label)}</span></label>`,
    )
    .join('');
  const publisher = view.clientDomain
    ? fillTemplate(t.verified, { domain: escapeHtml(view.clientDomain) })
    : escapeHtml(t.unverified);
  return `
<h1>${escapeHtml(fillTemplate(t.heading, { client: view.clientName }))}</h1>
<p>${publisher}</p>
<p>${fillTemplate(t.redirect, { host: escapeHtml(view.redirectHost) })}</p>
${view.redirectIsLoopback ? `<p class="warn">${escapeHtml(t.loopback)}</p>` : ''}
${view.error ? `<p class="error" role="alert">${escapeHtml(view.error)}</p>` : ''}
<form method="post">
  <input type="hidden" name="handle" value="${escapeHtml(view.handle)}">
  <fieldset><legend>${escapeHtml(t.permissions)}</legend>${scopes}</fieldset>
  <p>${escapeHtml(t.anonymous)}</p>
  <div class="cf-turnstile" data-sitekey="${escapeHtml(view.siteKey)}" data-theme="auto" data-language="${view.lang}"></div>
  <div class="actions">
    <button class="deny" name="decision" value="deny" formnovalidate>${escapeHtml(t.deny)}</button>
    <button class="allow" name="decision" value="approve">${escapeHtml(t.allow)}</button>
  </div>
</form>
<script nonce="${view.nonce}" src="${TURNSTILE_SCRIPT}" async defer></script>`;
}
