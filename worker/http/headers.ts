// Cabeceras HTTP comunes: seguridad, descubrimiento para agentes (Link) y CORS.

/** Recursos que se anuncian en la cabecera Link de cada página (RFC 8288). */
export const DISCOVERY_LINKS = [
  '</.well-known/api-catalog>; rel="api-catalog"; type="application/linkset+json"',
  '</api/v1/openapi.json>; rel="service-desc"; type="application/vnd.oai.openapi+json"',
  '</api/v1/docs.md>; rel="service-doc"; type="text/markdown"',
  '</llms.txt>; rel="describedby"; type="text/plain"',
  '</.well-known/mcp/server-card.json>; rel="mcp-server-card"; type="application/json"',
  '</.well-known/ai-catalog.json>; rel="ai-catalog"; type="application/json"',
  '</.well-known/agent-skills/index.json>; rel="agent-skills"; type="application/json"',
  '</sitemap.xml>; rel="sitemap"; type="application/xml"',
] as const;

/** Lo que una política en <meta> no puede declarar: se añade siempre en la cabecera. */
export const FRAME_ANCESTORS = "frame-ancestors 'none'";

/**
 * Cabeceras de seguridad de las páginas. Esta política es la mínima; para las páginas HTML
 * se envía la completa de cada una (ver pagePolicy).
 */
export const SECURITY_HEADERS: Readonly<Record<string, string>> = {
  'Content-Security-Policy': `${FRAME_ANCESTORS}; object-src 'none'; base-uri 'self'; form-action 'self'`,
  'Strict-Transport-Security': 'max-age=63072000; includeSubDomains; preload',
  'Cross-Origin-Opener-Policy': 'same-origin',
  'X-Frame-Options': 'DENY',
  'X-Content-Type-Options': 'nosniff',
  'Referrer-Policy': 'strict-origin-when-cross-origin',
  'Permissions-Policy': 'camera=(), microphone=(), geolocation=(), payment=(), usb=(), browsing-topics=()',
};

/** CORS para los datos públicos que pueden leer los agentes desde cualquier origen. */
export const PUBLIC_CORS: Readonly<Record<string, string>> = {
  'Access-Control-Allow-Origin': '*',
};

/** Cabeceras de una página HTML: seguridad, descubrimiento y negociación por Accept. */
export const pageHeaders = (links: readonly string[] = DISCOVERY_LINKS): Record<string, string> => ({
  Link: links.join(', '),
  Vary: 'Accept',
  ...SECURITY_HEADERS,
});

const CSP_META = /<meta http-equiv="content-security-policy" content="([^"]+)"/i;

/**
 * Política de seguridad de una página: la que Astro escribe en su <meta> (con el hash de
 * cada script y estilo) más frame-ancestors. En la cabecera protege el documento desde el
 * primer byte, también lo que va antes de la <meta>. null si la página no la tiene.
 */
export function pagePolicy(html: string): string | null {
  const policy = CSP_META.exec(html)?.[1]?.trim().replace(/;+$/, '');
  return policy ? `${policy}; ${FRAME_ANCESTORS}` : null;
}

/** Copia de la respuesta con cabeceras añadidas o sustituidas. */
export function withHeaders(response: Response, headers: Readonly<Record<string, string>>): Response {
  const copy = new Response(response.body, response);
  for (const [name, value] of Object.entries(headers)) copy.headers.set(name, value);
  return copy;
}

/** Respuesta JSON sin caché, para las API dinámicas. */
export const jsonNoStore = (body: unknown, status = 200, headers: Record<string, string> = {}): Response =>
  Response.json(body, { status, headers: { 'Cache-Control': 'no-store', ...headers } });

export const methodNotAllowed = (allow: string): Response =>
  new Response('Method Not Allowed', { status: 405, headers: { Allow: allow } });
