// Utilidades de los endpoints estáticos de Astro (src/pages/**/*.ts).

/**
 * Origen público de la web (https://danielcarrascogarcia.me), tomado de `site` en
 * astro.config.mjs. Se puede cambiar con SITE_URL al compilar (pruebas con un túnel).
 */
export const siteOrigin = (): string => new URL(import.meta.env.SITE).origin;

export const textResponse = (body: string, contentType: string): Response =>
  new Response(body, { headers: { 'Content-Type': contentType } });

export const jsonResponse = (data: unknown, contentType = 'application/json; charset=utf-8'): Response =>
  textResponse(JSON.stringify(data, null, 2) + '\n', contentType);

export const markdownResponse = (body: string): Response => textResponse(body, 'text/markdown; charset=utf-8');

export const plainTextResponse = (body: string): Response => textResponse(body, 'text/plain; charset=utf-8');
