// Worker de Cloudflare que sirve danielcarrascogarcia.me:
// - la web estática compilada por Astro (dist/), con Markdown para agentes y cabeceras Link;
// - el servidor MCP en /mcp, protegido con OAuth 2.1;
// - el servidor de autorización OAuth (metadatos, registro de clientes, tokens y /authorize).

import { OAuthProvider } from '@cloudflare/workers-oauth-provider';
import { handleSite, serveDiscoveryDocument } from './site.js';
import { handleAuthorize } from './consent.js';
import { mcpHandler, SCOPES } from './mcp.js';
import { augmentAuthorizationServerMetadata, normalizeResource, originResourceMetadata } from './discovery.js';

const providers = new Map();

// La librería necesita el origen público al construirse, así que se crea una vez por origen
// (en producción siempre el mismo; en pruebas, el del túnel o localhost).
function getProvider(origin) {
  let provider = providers.get(origin);
  if (!provider) {
    provider = new OAuthProvider({
      apiRoute: '/mcp',
      apiHandler: mcpHandler,
      defaultHandler: {
        fetch(request, env) {
          return new URL(request.url).pathname === '/authorize' ? handleAuthorize(request, env) : handleSite(request, env);
        },
      },
      authorizeEndpoint: '/authorize',
      tokenEndpoint: '/oauth/token',
      clientRegistrationEndpoint: '/oauth/register',
      clientIdMetadataDocumentEnabled: true,
      scopesSupported: [SCOPES.read, SCOPES.contact, 'offline_access'],
      requiredScopes: [SCOPES.read],
      resourceMetadata: {
        resource: `${origin}/mcp`,
        authorization_servers: [origin],
        bearer_methods_supported: ['header'],
        resource_name: 'Daniel Carrasco García — Portfolio MCP server',
      },
    });
    providers.set(origin, provider);
  }
  return provider;
}

// Rutas OAuth que escriben en KV: se limitan por IP para que nadie agote la cuota gratuita.
const RATE_LIMITED_PATHS = new Set(['/oauth/register', '/oauth/token', '/authorize']);

const PRM_PATH = '/.well-known/oauth-protected-resource';
const AS_METADATA_PATH = '/.well-known/oauth-authorization-server';

async function addFields(response, fields) {
  if (!response.ok) return response;
  const body = { ...(await response.json()), ...fields };
  const headers = new Headers(response.headers);
  headers.delete('Content-Length');
  return new Response(JSON.stringify(body, null, 2), { status: response.status, headers });
}

// Peticiones de token para el origen → token del servidor MCP (único recurso protegido).
async function withNormalizedResource(request, origin) {
  const url = new URL(request.url);
  if (url.pathname === '/authorize' && url.searchParams.has('resource')) {
    const resources = url.searchParams.getAll('resource').map((r) => normalizeResource(r, origin));
    url.searchParams.delete('resource');
    for (const r of resources) url.searchParams.append('resource', r);
    return new Request(url, request);
  }
  if (url.pathname === '/oauth/token' && request.method === 'POST' &&
      (request.headers.get('Content-Type') || '').includes('application/x-www-form-urlencoded')) {
    const form = new URLSearchParams(await request.clone().text());
    if (!form.has('resource')) return request;
    const resources = form.getAll('resource').map((r) => normalizeResource(r, origin));
    form.delete('resource');
    for (const r of resources) form.append('resource', r);
    const headers = new Headers(request.headers);
    headers.delete('Content-Length');
    return new Request(url, { method: 'POST', headers, body: form.toString() });
  }
  return request;
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
    if (url.pathname === PRM_PATH) {
      return Response.json(originResourceMetadata(origin), {
        headers: { 'Access-Control-Allow-Origin': '*', 'Cache-Control': 'public, max-age=3600' },
      });
    }

    // La Server Card vive en /mcp/server-card (SEP-2127), dentro de la ruta que protege
    // OAuth, pero es pública: se sirve antes de que la librería exija un token.
    if (url.pathname === '/mcp/server-card') {
      return serveDiscoveryDocument(request, env);
    }

    if (request.method === 'POST' && RATE_LIMITED_PATHS.has(url.pathname) && env.OAUTH_RATE_LIMITER) {
      const ip = request.headers.get('CF-Connecting-IP') || 'local';
      const { success } = await env.OAUTH_RATE_LIMITER.limit({ key: `${url.pathname}:${ip}` });
      if (!success) {
        return Response.json(
          { error: 'temporarily_unavailable', error_description: 'Too many requests. Try again in a minute.' },
          { status: 429, headers: { 'Retry-After': '60' } }
        );
      }
    }

    const provider = getProvider(origin);
    const response = await provider.fetch(await withNormalizedResource(request, origin), env, ctx);

    if (request.method === 'GET' && url.pathname === `${PRM_PATH}/mcp`) {
      return addFields(response, { resource_documentation: `${origin}/auth.md` });
    }
    if (request.method === 'GET' && url.pathname === AS_METADATA_PATH) {
      return addFields(response, augmentAuthorizationServerMetadata(origin));
    }
    return response;
  },
};
