// Worker de Cloudflare que sirve danielcarrascogarcia.me:
// - la web estática compilada por Astro (dist/), con Markdown para agentes y cabeceras;
// - la API del formulario de contacto (POST /api/v1/contact);
// - el servidor MCP en /mcp, protegido con OAuth 2.1, y su servidor de autorización.

import { API_PATHS } from '../src/agent/api-resources';
import { SERVER_CARD_PATH } from '../src/agent/mcp-info';
import { handleContactApi } from './contact/contact-api';
import { jsonNoStore } from './http/headers';
import { addJsonFields } from './oauth/json-extras';
import {
  AUTHORIZATION_SERVER_PATH,
  authorizationServerExtras,
  originResourceMetadata,
  PROTECTED_RESOURCE_PATH,
} from './oauth/metadata';
import { AUTHORIZE_PATH, getOAuthProvider, REGISTER_PATH, TOKEN_PATH } from './oauth/provider';
import { withNormalizedResource } from './oauth/resource-normalizer';
import { createServices } from './services';
import { serveDiscoveryDocument } from './site/discovery-documents';

/** Rutas OAuth que escriben en KV: se limitan por IP para no agotar la cuota gratuita. */
const RATE_LIMITED_PATHS = new Set([REGISTER_PATH, TOKEN_PATH, AUTHORIZE_PATH]);

async function rateLimitOAuth(request: Request, env: Env, path: string): Promise<Response | null> {
  if (request.method !== 'POST' || !RATE_LIMITED_PATHS.has(path) || !env.OAUTH_RATE_LIMITER) return null;
  const ip = request.headers.get('CF-Connecting-IP') ?? 'local';
  const { success } = await env.OAUTH_RATE_LIMITER.limit({ key: `${path}:${ip}` });
  if (success) return null;
  return jsonNoStore(
    { error: 'temporarily_unavailable', error_description: 'Too many requests. Try again in a minute.' },
    429,
    { 'Retry-After': '60' },
  );
}

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    const origin = env.SITE_ORIGIN;

    // www.danielcarrascogarcia.me → danielcarrascogarcia.me
    if (url.hostname === `www.${new URL(origin).hostname}`) {
      return Response.redirect(`${origin}${url.pathname}${url.search}`, 301);
    }

    // RFC 9728 en el origen: lo que buscan los clientes sin desafío 401 y los escáneres.
    if (url.pathname === PROTECTED_RESOURCE_PATH) {
      return Response.json(originResourceMetadata(origin), {
        headers: { 'Access-Control-Allow-Origin': '*', 'Cache-Control': 'public, max-age=3600' },
      });
    }

    // La Server Card vive en /mcp/server-card (SEP-2127), dentro de la ruta que protege
    // OAuth, pero es pública: se sirve antes de que la librería exija un token.
    if (url.pathname === SERVER_CARD_PATH) return serveDiscoveryDocument(request, env.ASSETS);

    if (url.pathname === API_PATHS.contact) {
      const services = createServices(env);
      return handleContactApi(request, {
        contact: services.contact,
        turnstile: services.turnstile,
        rateLimiter: env.CONTACT_RATE_LIMITER,
        siteOrigin: origin,
        pseudonymize: services.pseudonymize,
      });
    }

    const limited = await rateLimitOAuth(request, env, url.pathname);
    if (limited) return limited;

    const response = await getOAuthProvider(origin).fetch(await withNormalizedResource(request, origin), env, ctx);

    if (request.method === 'GET' && url.pathname === `${PROTECTED_RESOURCE_PATH}/mcp`) {
      return addJsonFields(response, { resource_documentation: `${origin}/auth.md` });
    }
    if (request.method === 'GET' && url.pathname === AUTHORIZATION_SERVER_PATH) {
      return addJsonFields(response, authorizationServerExtras(origin));
    }
    return response;
  },
} satisfies ExportedHandler<Env>;
