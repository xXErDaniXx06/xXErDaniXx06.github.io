// Página de autorización OAuth (/authorize): muestra qué cliente pide acceso,
// a dónde irán los tokens y qué permisos, con Turnstile contra el abuso.
// No hay cuentas: cada autorización crea una identidad anónima.

import { AuthorizationError, CimdFetchError } from '@cloudflare/workers-oauth-provider';
import { SCOPES } from './mcp.js';
import { signedFetch } from './web-bot-auth.js';

const TEXT = {
  es: {
    title: 'Autorizar acceso',
    heading: (client) => `${client} quiere conectarse al porfolio de Daniel Carrasco García`,
    verified: (domain) => `Publicado por <strong>${domain}</strong>.`,
    unverified: 'Esta aplicación se registró sola: su nombre no está verificado.',
    redirect: (host) => `El acceso se enviará a <strong>${host}</strong>.`,
    loopback: 'El acceso irá a una aplicación de tu ordenador. Continúa solo si acabas de iniciar la conexión desde ella.',
    permissions: 'Permisos',
    scopes: {
      [SCOPES.read]: 'Leer la información pública del porfolio: perfil, proyectos, habilidades, logros y contacto.',
      [SCOPES.contact]: 'Enviar mensajes a Daniel en tu nombre (máximo 3 por hora).',
      offline_access: 'Mantener el acceso sin volver a preguntarte durante 30 días.',
    },
    anonymous: 'No necesitas cuenta: el acceso es anónimo y puedes revocarlo desde tu cliente.',
    allow: 'Permitir',
    deny: 'Denegar',
    captchaFailed: 'No se pudo verificar que eres una persona. Inténtalo de nuevo.',
    notConfigured: 'La autorización no está disponible ahora mismo.',
    expired: 'Esta solicitud ha caducado o ya se usó. Vuelve a conectar desde tu aplicación.',
    invalidClient: 'No se pudo verificar la aplicación que solicita el acceso.',
  },
  en: {
    title: 'Authorize access',
    heading: (client) => `${client} wants to connect to Daniel Carrasco García's portfolio`,
    verified: (domain) => `Published by <strong>${domain}</strong>.`,
    unverified: 'This app registered itself; its name is not verified.',
    redirect: (host) => `Access will be sent to <strong>${host}</strong>.`,
    loopback: 'Access goes to an app on your computer. Continue only if you just started connecting from it.',
    permissions: 'Permissions',
    scopes: {
      [SCOPES.read]: 'Read the public portfolio information: profile, projects, skills, achievements and contact.',
      [SCOPES.contact]: 'Send messages to Daniel on your behalf (at most 3 per hour).',
      offline_access: 'Keep access for 30 days without asking you again.',
    },
    anonymous: 'No account needed: access is anonymous and you can revoke it from your client.',
    allow: 'Allow',
    deny: 'Deny',
    captchaFailed: 'We could not verify that you are a person. Please try again.',
    notConfigured: 'Authorization is not available right now.',
    expired: 'This request has expired or was already used. Connect again from your app.',
    invalidClient: 'The app requesting access could not be verified.',
  },
  fr: {
    title: "Autoriser l'accès",
    heading: (client) => `${client} souhaite se connecter au portfolio de Daniel Carrasco García`,
    verified: (domain) => `Publié par <strong>${domain}</strong>.`,
    unverified: "Cette application s'est enregistrée elle-même : son nom n'est pas vérifié.",
    redirect: (host) => `L'accès sera envoyé à <strong>${host}</strong>.`,
    loopback: "L'accès ira à une application de votre ordinateur. Continuez seulement si vous venez de lancer la connexion depuis celle-ci.",
    permissions: 'Autorisations',
    scopes: {
      [SCOPES.read]: 'Lire les informations publiques du portfolio : profil, projets, compétences, réalisations et contact.',
      [SCOPES.contact]: 'Envoyer des messages à Daniel en votre nom (3 par heure au maximum).',
      offline_access: "Conserver l'accès pendant 30 jours sans vous redemander.",
    },
    anonymous: "Aucun compte requis : l'accès est anonyme et vous pouvez le révoquer depuis votre client.",
    allow: 'Autoriser',
    deny: 'Refuser',
    captchaFailed: "Impossible de vérifier que vous êtes une personne. Réessayez.",
    notConfigured: "L'autorisation n'est pas disponible pour le moment.",
    expired: 'Cette demande a expiré ou a déjà été utilisée. Reconnectez-vous depuis votre application.',
    invalidClient: "L'application qui demande l'accès n'a pas pu être vérifiée.",
  },
};

const escape = (value) => String(value).replace(/[&<>"']/g, (c) => `&#${c.charCodeAt(0)};`);

function pickLang(request) {
  const accept = (request.headers.get('Accept-Language') || '').toLowerCase();
  const found = accept
    .split(',')
    .map((part) => part.trim().slice(0, 2))
    .find((code) => code in TEXT);
  return found || 'es';
}

const PAGE_CSP =
  "default-src 'none'; script-src https://challenges.cloudflare.com; frame-src https://challenges.cloudflare.com; connect-src https://challenges.cloudflare.com; style-src 'unsafe-inline'; img-src 'self' data:; base-uri 'none'; frame-ancestors 'none'";

function htmlPage(lang, title, body, headers = new Headers(), status = 200) {
  headers.set('Content-Type', 'text/html; charset=utf-8');
  headers.set('Content-Security-Policy', PAGE_CSP);
  headers.set('X-Frame-Options', 'DENY');
  headers.set('Referrer-Policy', 'no-referrer');
  headers.set('Cache-Control', 'no-store');
  const html = `<!doctype html>
<html lang="${lang}">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="robots" content="noindex">
<title>${escape(title)} · Daniel Carrasco García</title>
<style>
  :root { color-scheme: dark; }
  body { margin: 0; min-height: 100vh; display: grid; place-items: center; padding: 16px;
         background: #0a0f1e; color: #e2e8f0; font: 15px/1.6 system-ui, -apple-system, "Segoe UI", sans-serif; }
  main { width: 100%; max-width: 480px; background: rgba(30, 41, 59, .4); border: 1px solid #334155;
         border-radius: 24px; padding: 28px; box-sizing: border-box; }
  h1 { font-size: 20px; line-height: 1.35; margin: 0 0 12px; color: #fff; }
  p { margin: 0 0 12px; color: #94a3b8; }
  strong { color: #e2e8f0; }
  .warn { color: #fcd34d; }
  .error { color: #fca5a5; }
  fieldset { border: 1px solid #334155; border-radius: 14px; padding: 12px 14px; margin: 16px 0; }
  legend { padding: 0 6px; font-size: 12px; text-transform: uppercase; letter-spacing: .12em; color: #64748b; }
  label { display: flex; gap: 10px; align-items: flex-start; margin: 8px 0; color: #cbd5e1; }
  input[type=checkbox] { margin-top: 4px; accent-color: #0ea5e9; }
  .actions { display: flex; gap: 10px; margin-top: 18px; }
  button { flex: 1; border: 0; border-radius: 12px; padding: 12px 16px; font: inherit; font-weight: 700; cursor: pointer; }
  .allow { background: #0ea5e9; color: #fff; }
  .deny { background: #1e293b; color: #cbd5e1; border: 1px solid #334155; }
  .cf-turnstile { margin-top: 12px; min-height: 65px; }
</style>
</head>
<body><main>${body}</main></body>
</html>`;
  return new Response(html, { status, headers });
}

async function renderConsent(request, env, oauth, lang, error) {
  const T = TEXT[lang];
  const authRequest = await oauth.parseAuthRequest(request);
  const details = await oauth.describeConsent(authRequest);
  const consent = await oauth.beginConsent(authRequest);

  // portfolio:read es imprescindible; los demás permisos se piden solo si el cliente los solicitó.
  const requested = new Set(details.scope);
  requested.add(SCOPES.read);
  const scopes = [...requested]
    .filter((scope) => scope in T.scopes)
    .map((scope) =>
      scope === SCOPES.read
        ? `<label><input type="checkbox" checked disabled> <span>${escape(T.scopes[scope])}</span></label><input type="hidden" name="scope" value="${scope}">`
        : `<label><input type="checkbox" name="scope" value="${escape(scope)}" checked> <span>${escape(T.scopes[scope])}</span></label>`
    )
    .join('');

  const body = `
<h1>${escape(T.heading(details.clientName))}</h1>
<p>${details.clientDomain ? T.verified(escape(details.clientDomain)) : escape(T.unverified)}</p>
<p>${T.redirect(escape(details.redirectHost))}</p>
${details.redirectIsLoopback ? `<p class="warn">${escape(T.loopback)}</p>` : ''}
${error ? `<p class="error" role="alert">${escape(error)}</p>` : ''}
<form method="post">
  <input type="hidden" name="handle" value="${escape(consent.handle)}">
  <fieldset><legend>${escape(T.permissions)}</legend>${scopes}</fieldset>
  <p>${escape(T.anonymous)}</p>
  <div class="cf-turnstile" data-sitekey="${escape(env.TURNSTILE_SITE_KEY)}" data-theme="dark" data-language="${lang}"></div>
  <div class="actions">
    <button class="deny" name="decision" value="deny" formnovalidate>${escape(T.deny)}</button>
    <button class="allow" name="decision" value="approve">${escape(T.allow)}</button>
  </div>
</form>
<script src="https://challenges.cloudflare.com/turnstile/v0/api.js" async defer></script>`;
  return htmlPage(lang, T.title, body, consent.headers);
}

async function verifyTurnstile(env, token, request) {
  if (!token) return false;
  const form = new FormData();
  form.append('secret', env.TURNSTILE_SECRET_KEY);
  form.append('response', token);
  const ip = request.headers.get('CF-Connecting-IP');
  if (ip) form.append('remoteip', ip);
  const result = await signedFetch(env, 'https://challenges.cloudflare.com/turnstile/v0/siteverify', { method: 'POST', body: form });
  const outcome = await result.json().catch(() => ({}));
  return outcome.success === true;
}

/** GET y POST de /authorize. */
export async function handleAuthorize(request, env) {
  const lang = pickLang(request);
  const T = TEXT[lang];
  const oauth = env.OAUTH_PROVIDER;

  if (!env.TURNSTILE_SITE_KEY || !env.TURNSTILE_SECRET_KEY) {
    return htmlPage(lang, T.title, `<h1>${escape(T.title)}</h1><p class="error">${escape(T.notConfigured)}</p>`, undefined, 503);
  }

  try {
    if (request.method === 'GET') return await renderConsent(request, env, oauth, lang);

    if (request.method !== 'POST') return new Response('Method Not Allowed', { status: 405, headers: { Allow: 'GET, POST' } });

    const form = await request.formData();
    const handle = String(form.get('handle') || '');

    if (form.get('decision') !== 'approve') {
      const denied = await oauth.denyConsent(request, handle);
      return new Response(null, { status: 302, headers: denied.headers });
    }

    if (!(await verifyTurnstile(env, String(form.get('cf-turnstile-response') || ''), request))) {
      return await renderConsent(request, env, oauth, lang, T.captchaFailed);
    }

    const scope = [...new Set([SCOPES.read, ...form.getAll('scope').map(String)])];
    const approved = await oauth.approveConsent(request, handle, { scope });
    const client = await oauth.lookupClient(approved.request.clientId).catch(() => null);
    const userId = `anon-${crypto.randomUUID()}`;
    const { redirectTo } = await oauth.completeAuthorization({
      request: approved.request,
      userId,
      metadata: { identity: 'anonymous', approvedAt: new Date().toISOString() },
      scope: approved.request.scope,
      props: { userId, clientId: approved.request.clientId, clientName: client?.clientName || approved.request.clientId },
    });
    approved.headers.set('Location', redirectTo);
    return new Response(null, { status: 302, headers: approved.headers });
  } catch (error) {
    if (error instanceof AuthorizationError && error.redirectTo) {
      return Response.redirect(error.redirectTo, 302);
    }
    if (error instanceof AuthorizationError) {
      return htmlPage(lang, T.title, `<h1>${escape(T.title)}</h1><p class="error">${escape(error.description || T.expired)}</p>`, undefined, 400);
    }
    if (error instanceof CimdFetchError) {
      return htmlPage(lang, T.title, `<h1>${escape(T.title)}</h1><p class="error">${escape(T.invalidClient)}</p>`, undefined, 400);
    }
    throw error;
  }
}
