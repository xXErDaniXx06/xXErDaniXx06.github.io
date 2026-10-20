// Servido de la web estática (dist/) con lo que GitHub Pages no permite:
// negociación de Markdown (Accept: text/markdown), cabeceras Link para agentes,
// cabeceras de seguridad y tipos de contenido correctos en los ficheros de descubrimiento.

import { estimateTokens } from '../src/agent/content.js';
import { DEFAULT_LANG, LANGS } from '../src/data/profile.js';
import { DIRECTORY_PATH, serveDirectory } from './web-bot-auth.js';

// Recursos que se anuncian en la cabecera Link de cada página (RFC 8288).
const DISCOVERY_LINKS = [
  '</.well-known/api-catalog>; rel="api-catalog"; type="application/linkset+json"',
  '</api/v1/openapi.json>; rel="service-desc"; type="application/vnd.oai.openapi+json"',
  '</api/v1/docs.md>; rel="service-doc"; type="text/markdown"',
  '</llms.txt>; rel="describedby"; type="text/plain"',
  '</.well-known/mcp/server-card.json>; rel="mcp-server-card"; type="application/json"',
  '</.well-known/ai-catalog.json>; rel="ai-catalog"; type="application/json"',
  '</.well-known/agent-skills/index.json>; rel="agent-skills"; type="application/json"',
  '</sitemap.xml>; rel="sitemap"; type="application/xml"',
];

// Las mismas políticas que ya tenían netlify.toml y vercel.json.
const SECURITY_HEADERS = {
  'Content-Security-Policy':
    "default-src 'self'; script-src 'self' 'unsafe-inline' https://cdn.jsdelivr.net https://www.google.com/recaptcha/ https://www.gstatic.com/recaptcha/; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; img-src 'self' data:; media-src 'self'; font-src 'self' https://fonts.gstatic.com; connect-src 'self' https://api.emailjs.com https://www.google.com/recaptcha/; frame-ancestors 'none';",
  'X-Frame-Options': 'DENY',
  'X-Content-Type-Options': 'nosniff',
  'Referrer-Policy': 'strict-origin-when-cross-origin',
  'X-XSS-Protection': '1; mode=block',
  'Permissions-Policy': 'geolocation=(), microphone=(), camera=()',
};

// Tipos de contenido que el servidor de ficheros no deduce bien por la extensión.
const CONTENT_TYPES = [
  [/^\/\.well-known\/api-catalog$/, 'application/linkset+json; profile="https://www.rfc-editor.org/info/rfc9727"'],
  [/\.md$/, 'text/markdown; charset=utf-8'],
  [/\.txt$/, 'text/plain; charset=utf-8'],
  [/\.json$/, 'application/json; charset=utf-8'],
];

// Ficheros públicos para agentes que deben poder leerse desde cualquier origen (CORS).
const isPublicData = (path) =>
  path.startsWith('/.well-known/') || path.startsWith('/api/') || /\.(md|txt|xml)$/.test(path);

/** ¿Prefiere el cliente Markdown a HTML? (Accept: text/markdown, con pesos q) */
export function prefersMarkdown(request) {
  const accept = request.headers.get('Accept') || '';
  let markdown = 0;
  let html = 0;
  for (const part of accept.split(',')) {
    const [type, ...params] = part.trim().toLowerCase().split(';');
    const qParam = params.map((p) => p.trim()).find((p) => p.startsWith('q='));
    const q = qParam ? Number.parseFloat(qParam.slice(2)) || 0 : 1;
    if (type.trim() === 'text/markdown') markdown = Math.max(markdown, q);
    if (type.trim() === 'text/html' || type.trim() === 'application/xhtml+xml') html = Math.max(html, q);
  }
  return markdown > 0 && markdown >= html;
}

/** Ruta del Markdown equivalente a una ruta HTML, o null si no es una página. */
export function markdownPathFor(pathname) {
  const path = pathname.replace(/\/index\.html$/, '/').replace(/\/+$/, '');
  if (path === '') return '/index.md';
  const [lang, slug, ...rest] = path.split('/').filter(Boolean);
  if (!LANGS.includes(lang) || rest.length) return null;
  return slug ? `/${lang}/${slug}.md` : `/${lang}/index.md`;
}

const withHeaders = (response, headers) => {
  const out = new Response(response.body, response);
  for (const [key, value] of Object.entries(headers)) out.headers.set(key, value);
  return out;
};

function pageHeaders(extra = {}) {
  return { Link: DISCOVERY_LINKS.join(', '), Vary: 'Accept', ...SECURITY_HEADERS, ...extra };
}

async function serveMarkdown(request, env, mdPath, htmlPath) {
  const url = new URL(request.url);
  const asset = await env.ASSETS.fetch(new Request(new URL(mdPath, url), { headers: request.headers }));
  if (!asset.ok) return null;
  const text = await asset.text();
  return new Response(request.method === 'HEAD' ? null : text, {
    status: 200,
    headers: {
      'Content-Type': 'text/markdown; charset=utf-8',
      'Content-Location': mdPath,
      'x-markdown-tokens': String(estimateTokens(text)),
      'Cache-Control': 'public, max-age=600',
      'Access-Control-Allow-Origin': '*',
      ...pageHeaders({
        Link: [`<${htmlPath}>; rel="alternate"; type="text/html"`, ...DISCOVERY_LINKS].join(', '),
      }),
    },
  });
}

// Documentos de descubrimiento que se sirven con caché, ETag y CORS completos
// (MCP Server Card y catálogo de IA, según SEP-2127).
const DISCOVERY_DOCUMENTS = {
  '/mcp/server-card': { asset: '/.well-known/mcp/server-card.json', type: () => 'application/mcp-server-card+json' },
  '/.well-known/mcp/server-card.json': { asset: '/.well-known/mcp/server-card.json', type: () => 'application/json' },
  '/.well-known/ai-catalog.json': {
    asset: '/.well-known/ai-catalog.json',
    type: (request) =>
      (request.headers.get('Accept') || '').includes('application/ai-catalog+json') ? 'application/ai-catalog+json' : 'application/json',
  },
};

async function sha256Hex(text) {
  const digest = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(text));
  return [...new Uint8Array(digest)].map((b) => b.toString(16).padStart(2, '0')).join('');
}

/** Sirve un documento de descubrimiento; null si la ruta no es uno de ellos. */
export async function serveDiscoveryDocument(request, env) {
  const url = new URL(request.url);
  const doc = DISCOVERY_DOCUMENTS[url.pathname];
  if (!doc) return null;
  const cors = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET',
    'Access-Control-Allow-Headers': 'Content-Type, If-None-Match',
    'Access-Control-Expose-Headers': 'ETag',
  };
  if (request.method === 'OPTIONS') return new Response(null, { status: 204, headers: cors });
  if (request.method !== 'GET' && request.method !== 'HEAD') {
    return new Response('Method Not Allowed', { status: 405, headers: { Allow: 'GET, HEAD', ...cors } });
  }
  const asset = await env.ASSETS.fetch(new Request(new URL(doc.asset, url)));
  if (!asset.ok) return asset;
  const body = await asset.text();
  const etag = `"${(await sha256Hex(body)).slice(0, 32)}"`;
  const headers = {
    ...cors,
    'Content-Type': doc.type(request),
    'Cache-Control': 'public, max-age=3600',
    ETag: etag,
    Vary: 'Accept',
    'X-Content-Type-Options': 'nosniff',
  };
  if (request.headers.get('If-None-Match') === etag) return new Response(null, { status: 304, headers });
  return new Response(request.method === 'HEAD' ? null : body, { status: 200, headers });
}

/** Manejador de todo lo que no es OAuth ni MCP. */
export async function handleSite(request, env) {
  const discovery = await serveDiscoveryDocument(request, env);
  if (discovery) return discovery;

  if (new URL(request.url).pathname === DIRECTORY_PATH) return serveDirectory(request, env);

  const url = new URL(request.url);
  const path = url.pathname;

  if (request.method !== 'GET' && request.method !== 'HEAD') {
    return new Response('Method Not Allowed', { status: 405, headers: { Allow: 'GET, HEAD' } });
  }

  if (path === '/api/v1/status') {
    return Response.json(
      { status: 'ok', time: new Date().toISOString(), services: { site: 'ok', api: 'ok', mcp: 'ok' } },
      { headers: { 'Cache-Control': 'no-store', 'Access-Control-Allow-Origin': '*' } }
    );
  }

  // Páginas HTML: Markdown si el agente lo pide; si no, la página con cabeceras Link.
  const mdPath = markdownPathFor(path);
  if (mdPath && prefersMarkdown(request)) {
    const md = await serveMarkdown(request, env, mdPath, path === '/' ? `/${DEFAULT_LANG}/` : path);
    if (md) return md;
  }

  // La raíz muestra la portada en el idioma por defecto (el mismo HTML que /es/, cuya URL
  // canónica declara). Antes redirigía con <meta http-equiv="refresh">; servirla directamente
  // evita que agentes y navegadores automatizados pierdan la página durante la redirección.
  if (path === '/') {
    const home = await env.ASSETS.fetch(new Request(new URL(`/${DEFAULT_LANG}/`, url), request));
    return withHeaders(home, pageHeaders());
  }

  const response = await env.ASSETS.fetch(request);
  const contentType = response.headers.get('Content-Type') || '';

  if (contentType.includes('text/html')) {
    return withHeaders(response, pageHeaders());
  }

  const extra = {};
  const fixedType = CONTENT_TYPES.find(([pattern]) => pattern.test(path));
  if (fixedType && response.ok) extra['Content-Type'] = fixedType[1];
  if (isPublicData(path)) extra['Access-Control-Allow-Origin'] = '*';
  if (path.endsWith('.md')) extra['Vary'] = 'Accept';
  extra['X-Content-Type-Options'] = 'nosniff';
  return withHeaders(response, extra);
}
