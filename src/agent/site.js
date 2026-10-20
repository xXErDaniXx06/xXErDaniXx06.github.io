// Origen público de la web (https://danielcarrascogarcia.me), tomado de `site`
// en astro.config.mjs. Se puede sobrescribir con SITE_URL al compilar (pruebas).
export const siteOrigin = () => new URL(import.meta.env.SITE).origin;

/** Respuesta de texto para los endpoints estáticos. */
export const textResponse = (body, contentType) =>
  new Response(body, { headers: { 'Content-Type': contentType } });

export const jsonResponse = (data, contentType = 'application/json; charset=utf-8') =>
  textResponse(JSON.stringify(data, null, 2) + '\n', contentType);
