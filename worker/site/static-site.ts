// La web estática (dist/): páginas con cabeceras de seguridad y de descubrimiento,
// Markdown para los agentes que lo piden y tipos de contenido correctos.

import { estimateTokens } from '../../src/lib/text';
import { DISCOVERY_LINKS, PUBLIC_CORS, methodNotAllowed, pageHeaders, pagePolicy, withHeaders } from '../http/headers';
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

/** Datos públicos para agentes, legibles desde cualquier origen (CORS). */
const isPublicData = (path: string): boolean =>
  path.startsWith('/.well-known/') ||
  path.startsWith('/api/') ||
  path.startsWith('/images/') ||
  /\.(md|txt|xml)$/.test(path);

async function serveMarkdown(request: Request, assets: Fetcher, markdownPath: string): Promise<Response | null> {
  const url = new URL(request.url);
  const asset = await assets.fetch(new Request(new URL(markdownPath, url), { headers: request.headers }));
  if (!asset.ok) return null;
  const text = await asset.text();
  const htmlPath = url.pathname;
  return new Response(request.method === 'HEAD' ? null : text, {
    headers: {
      ...pageHeaders([`<${htmlPath}>; rel="alternate"; type="text/html"`, ...DISCOVERY_LINKS]),
      ...PUBLIC_CORS,
      'Content-Type': 'text/markdown; charset=utf-8',
      'Content-Location': markdownPath,
      'x-markdown-tokens': String(estimateTokens(text)),
      'Cache-Control': 'public, max-age=600',
    },
  });
}

/** Página HTML con sus cabeceras y su política de seguridad en la cabecera. */
async function servePage(request: Request, response: Response): Promise<Response> {
  const headers = pageHeaders();
  if (request.method === 'HEAD' || !response.body) return withHeaders(response, headers);
  const html = await response.text();
  const policy = pagePolicy(html);
  if (policy) headers['Content-Security-Policy'] = policy;
  const page = new Response(html, response);
  for (const [name, value] of Object.entries(headers)) page.headers.set(name, value);
  return page;
}

/** Responde con un fichero de la web, una página o su versión Markdown. */
export async function serveStaticSite(request: Request, assets: Fetcher): Promise<Response> {
  if (request.method !== 'GET' && request.method !== 'HEAD') return methodNotAllowed('GET, HEAD');
  const path = new URL(request.url).pathname;

  const markdownPath = markdownPathFor(path);
  if (markdownPath && prefersMarkdown(request)) {
    const markdown = await serveMarkdown(request, assets, markdownPath);
    if (markdown) return markdown;
  }

  const response = await assets.fetch(request);
  if ((response.headers.get('Content-Type') ?? '').includes('text/html')) return servePage(request, response);

  const headers: Record<string, string> = { 'X-Content-Type-Options': 'nosniff' };
  const fixedType = CONTENT_TYPES.find(([pattern]) => pattern.test(path));
  if (fixedType && response.ok) headers['Content-Type'] = fixedType[1];
  if (isPublicData(path)) Object.assign(headers, PUBLIC_CORS);
  if (path.endsWith('.md')) headers.Vary = 'Accept';
  if (response.ok && IMMUTABLE.test(path)) headers['Cache-Control'] = 'public, max-age=31536000, immutable';
  else if (response.ok && STABLE_MEDIA.test(path)) {
    headers['Cache-Control'] = 'public, max-age=86400, stale-while-revalidate=604800';
  }
  return withHeaders(response, headers);
}
