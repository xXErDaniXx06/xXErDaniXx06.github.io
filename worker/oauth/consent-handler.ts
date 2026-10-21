// /authorize: muestra qué cliente pide acceso, a dónde irán los tokens y qué permisos,
// con Turnstile contra el abuso. No hay cuentas: cada autorización crea una identidad anónima.

import { AuthorizationError, CimdFetchError, type OAuthHelpers } from '@cloudflare/workers-oauth-provider';
import { MCP_SCOPES } from '../../src/agent/mcp-info';
import { DEFAULT_LANG, getDictionary, isLang, type Lang } from '../../src/i18n';
import type { TurnstileVerifier } from '../contact/turnstile';
import { consentDocument, consentFormBody, consentPagePolicy, createNonce, messageBody } from './consent-page';

export interface ConsentDependencies {
  oauth: OAuthHelpers;
  /** null si falta la clave secreta de Turnstile. */
  turnstile: TurnstileVerifier | null;
  siteKey: string;
}

/** Datos que la librería guarda con cada autorización y pasa al servidor MCP (ctx.props). */
export interface GrantProps {
  userId: string;
  clientId: string;
  clientName: string;
}

/** Idioma de la página según Accept-Language. */
export function pickLang(request: Request): Lang {
  const accept = (request.headers.get('Accept-Language') ?? '').toLowerCase();
  const found = accept
    .split(',')
    .map((part) => part.trim().slice(0, 2))
    .find(isLang);
  return found ?? DEFAULT_LANG;
}

function html(
  lang: Lang,
  title: string,
  body: string,
  status = 200,
  headers = new Headers(),
  nonce = createNonce(),
): Response {
  headers.set('Content-Type', 'text/html; charset=utf-8');
  headers.set('Content-Security-Policy', consentPagePolicy(nonce));
  headers.set('X-Frame-Options', 'DENY');
  headers.set('Referrer-Policy', 'no-referrer');
  headers.set('Cache-Control', 'no-store');
  headers.set('X-Content-Type-Options', 'nosniff');
  return new Response(consentDocument(lang, title, body), { status, headers });
}

async function renderConsent(
  request: Request,
  deps: ConsentDependencies,
  lang: Lang,
  error?: string,
): Promise<Response> {
  const t = getDictionary(lang).consent;
  const labels: Record<string, string> = {
    [MCP_SCOPES.read]: t.scopes.read,
    [MCP_SCOPES.contact]: t.scopes.contact,
    [MCP_SCOPES.offlineAccess]: t.scopes.offlineAccess,
  };
  const authRequest = await deps.oauth.parseAuthRequest(request);
  const details = await deps.oauth.describeConsent(authRequest);
  const consent = await deps.oauth.beginConsent(authRequest);

  // portfolio:read es imprescindible; los demás permisos se piden solo si el cliente los solicitó.
  const requested = new Set([MCP_SCOPES.read, ...details.scope]);
  const scopes = [...requested].flatMap((scope) => {
    const label = labels[scope];
    return label ? [{ value: scope, label, required: scope === MCP_SCOPES.read }] : [];
  });

  const nonce = createNonce();
  const body = consentFormBody({
    t,
    nonce,
    lang,
    clientName: details.clientName,
    clientDomain: details.clientDomain,
    redirectHost: details.redirectHost,
    redirectIsLoopback: details.redirectIsLoopback,
    scopes,
    handle: consent.handle,
    siteKey: deps.siteKey,
    error,
  });
  return html(lang, t.title, body, 200, consent.headers, nonce);
}

async function approve(request: Request, deps: ConsentDependencies, form: FormData, lang: Lang): Promise<Response> {
  const handle = String(form.get('handle') ?? '');
  const scope = [...new Set([MCP_SCOPES.read, ...form.getAll('scope').map(String)])];
  const approved = await deps.oauth.approveConsent(request, handle, { scope });
  const client = await deps.oauth.lookupClient(approved.request.clientId).catch(() => null);
  const userId = `anon-${crypto.randomUUID()}`;
  const props: GrantProps = {
    userId,
    clientId: approved.request.clientId,
    clientName: client?.clientName || approved.request.clientId,
  };
  const { redirectTo } = await deps.oauth.completeAuthorization({
    request: approved.request,
    userId,
    metadata: { identity: 'anonymous', approvedAt: new Date().toISOString(), lang },
    scope: approved.request.scope,
    props,
  });
  approved.headers.set('Location', redirectTo);
  return new Response(null, { status: 302, headers: approved.headers });
}

/** GET y POST de /authorize. */
export async function handleAuthorize(request: Request, deps: ConsentDependencies): Promise<Response> {
  const lang = pickLang(request);
  const t = getDictionary(lang).consent;
  if (!deps.turnstile) return html(lang, t.title, messageBody(t, t.notConfigured), 503);

  try {
    if (request.method === 'GET') return await renderConsent(request, deps, lang);
    if (request.method !== 'POST') {
      return new Response('Method Not Allowed', { status: 405, headers: { Allow: 'GET, POST' } });
    }

    const form = await request.formData();
    if (form.get('decision') !== 'approve') {
      const denied = await deps.oauth.denyConsent(request, String(form.get('handle') ?? ''));
      return new Response(null, { status: 302, headers: denied.headers });
    }

    const token = String(form.get('cf-turnstile-response') ?? '');
    const human = await deps.turnstile.verify({ token, remoteIp: request.headers.get('CF-Connecting-IP') });
    if (!human) return await renderConsent(request, deps, lang, t.captchaFailed);

    return await approve(request, deps, form, lang);
  } catch (error) {
    if (error instanceof AuthorizationError && error.redirectTo) return Response.redirect(error.redirectTo, 302);
    if (error instanceof AuthorizationError) {
      return html(lang, t.title, messageBody(t, error.description || t.expired), 400);
    }
    if (error instanceof CimdFetchError) return html(lang, t.title, messageBody(t, t.invalidClient), 400);
    throw error;
  }
}
