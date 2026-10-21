// @ts-check
import tailwindcss from '@tailwindcss/vite';
import { defineConfig, fontProviders } from 'astro/config';
import { unicodeRange } from './scripts/font-ranges.mjs';
import subresourceIntegrity from './scripts/subresource-integrity.mjs';

// https://docs.astro.build/en/reference/configuration-reference/
export default defineConfig({
  // SITE_URL permite compilar contra otro origen (p. ej. un túnel de pruebas)
  site: process.env.SITE_URL || 'https://danielcarrascogarcia.me',

  build: {
    // /es/proyectos.astro → /es/proyectos.html, servido en /es/proyectos (sin barra final),
    // y [lang]/404.astro → /es/404.html, la página de error de cada idioma.
    format: 'preserve',
    // El CSS va dentro de cada página: una petición menos antes del primer pintado.
    inlineStylesheets: 'always',
  },

  // Al pasar el ratón por un enlace se descarga la página de destino.
  prefetch: { prefetchAll: true, defaultStrategy: 'hover' },

  // Inter (variable, pesos 400–700) servida desde la propia web, reducida a los caracteres
  // que usa el contenido (npm run fonts), con métricas de respaldo para evitar saltos.
  fonts: [
    {
      provider: fontProviders.local(),
      name: 'Inter',
      cssVariable: '--font-inter',
      fallbacks: ['system-ui', 'sans-serif'],
      options: {
        variants: [
          {
            src: ['./src/assets/fonts/inter-latin-400-700.woff2'],
            weight: '400 700',
            style: 'normal',
            unicodeRange: [unicodeRange()],
          },
        ],
      },
    },
  ],

  security: {
    // Política de seguridad de contenidos con hashes de cada script y estilo en línea.
    // El Worker añade en la cabecera lo que una etiqueta <meta> no admite (frame-ancestors).
    csp: {
      directives: [
        "default-src 'self'",
        "img-src 'self' data:",
        "font-src 'self'",
        "media-src 'self'",
        "connect-src 'self'",
        // Cloudflare Turnstile en el formulario de contacto
        'frame-src https://challenges.cloudflare.com',
        "object-src 'none'",
        "base-uri 'self'",
        "form-action 'self'",
        // Trusted Types: el DOM no acepta cadenas de HTML ni de script sin pasar por una
        // política con nombre; la única es la de src/scripts/trusted-types.ts.
        "require-trusted-types-for 'script'",
        'trusted-types portfolio',
      ],
      // 'strict-dynamic': solo se ejecutan los scripts con hash (y con `integrity`, que añade
      // scripts/subresource-integrity.mjs) y los que estos carguen, como Turnstile.
      // 'self' y el dominio de Turnstile solo cuentan en navegadores sin CSP 3.
      scriptDirective: { resources: ["'self'", 'https://challenges.cloudflare.com'], strictDynamic: true },
    },
  },

  integrations: [subresourceIntegrity()],

  vite: { plugins: [tailwindcss()] },
});
