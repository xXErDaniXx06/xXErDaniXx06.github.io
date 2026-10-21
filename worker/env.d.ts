// Bindings, variables y secretos del Worker (wrangler.jsonc). Los secretos no están en el
// repositorio: se configuran con `npx wrangler secret put` (y en .dev.vars para local).
import type { OAuthHelpers } from '@cloudflare/workers-oauth-provider';

declare global {
  namespace Cloudflare {
    interface Env {
      /** Ficheros estáticos compilados por Astro (dist/). */
      ASSETS: Fetcher;
      /** Clientes, autorizaciones y tokens OAuth, y contadores de mensajes. */
      OAUTH_KV: KVNamespace;
      /** Ayudas de la librería OAuth (las añade ella misma a env). */
      OAUTH_PROVIDER: OAuthHelpers;
      /** Peticiones POST a /oauth/register, /oauth/token y /authorize por IP. */
      OAUTH_RATE_LIMITER?: RateLimit;
      /** Mensajes del formulario de contacto por IP. */
      CONTACT_RATE_LIMITER?: RateLimit;

      /** Origen público (https://danielcarrascogarcia.me o el de pruebas). */
      SITE_ORIGIN: string;
      EMAILJS_PUBLIC_KEY?: string;
      EMAILJS_SERVICE_ID?: string;
      EMAILJS_TEMPLATE_ID?: string;
      /** Solo para pruebas en local: sustituye la clave pública de Turnstile de producción. */
      TURNSTILE_SITE_KEY?: string;

      // Secretos
      TURNSTILE_SECRET_KEY?: string;
      EMAILJS_PRIVATE_KEY?: string;
      WEB_BOT_AUTH_PRIVATE_KEY?: string;
    }
  }

  type Env = Cloudflare.Env;
}

export {};
