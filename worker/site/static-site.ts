// La web estática (dist/): páginas con cabeceras de seguridad y de descubrimiento,
// Markdown para los agentes que lo piden y tipos de contenido correctos.

import { API_PATHS } from '../../src/agent/api-resources';
import { estimateTokens } from '../../src/lib/text';
import {
  API_LINKS,
  DISCOVERY_LINKS,
  PUBLIC_CORS,
  methodNotAllowed,
  pageHeaders,
  pagePolicy,
  withHeaders,
} from '../http/headers';
import { markdownPathFor, prefersMarkdown } from '../http/negotiation';

/** Tipos de contenido que el servidor de ficheros no deduce bien por la extensión. */
const CONTENT_TYPES: readonly (readonly [RegExp, string])[] = [
  [/^\/\.well-known\/api-catalog$/, 'application/linkset+json; profile="https://www.rfc-editor.org/info/rfc9727"'],
  [/\.md$/, 'text/markdown; charset=utf-8'],
  [/\.txt$/, 'text/plain; charset=utf-8'],
  [/\.json$/, 'application/json; charset=utf-8'],
];

/** Ficheros con nombre que cambia con su contenido: se pueden guardar en caché para siempre. */
const IMMUTABLE = /^\/_astro\//;

/** Imágenes e iconos con URL estable: un día en caché y revalidación en segundo plano. */
const STABLE_MEDIA =
  /^\/(images|og)\/|^\/(favicon\.(ico|svg)|apple-touch-icon\.png|icon-[\w-]+\.png|site\.webmanifest)$/;

/** URL base de la API: se sirve con su índice (src/pages/api/v1/index.json.ts). */
const API_INDEX_FILE = '/api/v1/index.json';

/** La URL base de la API sin la barra final redirige a la canónica. */
const API_ROOT_WITHOUT_SLASH = API_PATHS.root.slice(0, -1);

/** Datos públicos para agentes, legibles desde cualquier origen (CORS). */
const isPublicData = (path: string): boolean =>
  path.startsWith('/.well-known/') ||
  path.startsWith('/api/') ||
  path.startsWith('/images/') ||
  /\.(md|txt|xml)$/.test(path);

const isHtml = (response: Response): boolean => (response.headers.get('Content-Type') ?? '').includes('text/html');

async function serveMarkdown(request: Request, assets: Fetcher, markdownPath: string): Promise<Response | null> {
  const url = new URL(request.url);
  // Con las cabeceras de la petición: If-None-Match con el ETag del Markdown devuelve 304.
  const asset = await assets.fetch(new Request(new URL(markdownPath, url), { headers: request.headers }));
  if (!asset.ok && asset.status !== 304) return null;
  const headers: Record<string, string> = {
    ...pageHeaders([`<${url.pathname}>; rel="alternate"; type="text/html"`, ...DISCOVERY_LINKS]),
    ...PUBLIC_CORS,
    'Content-Type': 'text/markdown; charset=utf-8',
    'Content-Location': markdownPath,
    'Cache-Control': 'public, max-age=600',
  };
  const etag = asset.headers.get('ETag');
  if (etag) headers.ETag = etag;
  if (asset.status === 304) return new Response(null, { status: 304, headers });
  const text = await asset.text();
  headers['x-markdown-tokens'] = String(estimateTokens(text));
  return new Response(request.method === 'HEAD' ? null : text, { headers });
}

/** Página HTML con sus cabeceras y su política de seguridad en la cabecera. */
async function servePage(request: Request, response: Response, assets: Fetcher): Promise<Response> {
  const headers = pageHeaders();
  // En un 304 el navegador conserva las cabeceras guardadas que no se repiten (RFC 9111):
  // sin esto, la política mínima sustituiría a la de la página.
  if (response.status === 304) {
    delete headers['Content-Security-Policy'];
    return withHeaders(response, headers);
  }
  // HEAD lleva las mismas cabeceras que GET (RFC 9110), y la política sale del HTML.
  const page = request.method === 'HEAD' ? await assets.fetch(new Request(request.url)) : response;
  const html = await page.text();
  const policy = pagePolicy(html);
  if (policy) headers['Content-Security-Policy'] = policy;
  headers['Content-Type'] = 'text/html; charset=utf-8';
  return withHeaders(new Response(request.method === 'HEAD' ? null : html, page), headers);
}

/** Responde con un fichero de la web, una página o su versión Markdown. */
export async function serveStaticSite(request: Request, assets: Fetcher): Promise<Response> {
  if (request.method !== 'GET' && request.method !== 'HEAD') return methodNotAllowed('GET, HEAD');
  const url = new URL(request.url);
  if (url.pathname === API_ROOT_WITHOUT_SLASH) {
    return Response.redirect(new URL(`${API_PATHS.root}${url.search}`, url).href, 308);
  }

  const markdownPath = markdownPathFor(url.pathname);
  if (markdownPath && prefersMarkdown(request)) {
    const markdown = await serveMarkdown(request, assets, markdownPath);
    if (markdown) return markdown;
  }

  const apiIndex = url.pathname === API_PATHS.root;
  const path = apiIndex ? API_INDEX_FILE : url.pathname;
  const response = await assets.fetch(apiIndex ? new Request(new URL(path, url), request) : request);
  if (isHtml(response)) return servePage(request, response, assets);

  const headers: Record<string, string> = { 'X-Content-Type-Options': 'nosniff' };
  const fixedType = CONTENT_TYPES.find(([pattern]) => pattern.test(path));
  if (fixedType && response.ok) headers['Content-Type'] = fixedType[1];
  if (isPublicData(path)) Object.assign(headers, PUBLIC_CORS);
  if (apiIndex) headers.Link = API_LINKS.join(', ');
  if (path.endsWith('.md')) headers.Vary = 'Accept';
  if (response.ok && IMMUTABLE.test(path)) headers['Cache-Control'] = 'public, max-age=31536000, immutable';
  else if (response.ok && STABLE_MEDIA.test(path)) {
    headers['Cache-Control'] = 'public, max-age=86400, stale-while-revalidate=604800';
  }
  return withHeaders(response, headers);
}
