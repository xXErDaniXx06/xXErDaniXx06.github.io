/**
 * Clave pública (site key) de Cloudflare Turnstile en producción, para el formulario de
 * contacto y la página de autorización OAuth. Para probar en local se sustituye por las
 * claves de prueba de Cloudflare: PUBLIC_TURNSTILE_SITE_KEY al compilar la web y
 * TURNSTILE_SITE_KEY en .dev.vars para el Worker.
 */
export const TURNSTILE_SITE_KEY = '0x4AAAAAAFdnyOR1yvU76cfj';

export const TURNSTILE_SCRIPT = 'https://challenges.cloudflare.com/turnstile/v0/api.js';
