# CLAUDE.md

Porfolio de Daniel Carrasco García (Astro 7 + Tailwind 4 + TypeScript, en español, inglés y francés). Se sirve en <https://danielcarrascogarcia.me> desde un Worker de Cloudflare. La configuración de Cloudflare está en [DEPLOY-CLOUDFLARE.md](DEPLOY-CLOUDFLARE.md).

## Reglas principales: siempre al máximo en estas mediciones

Ningún cambio está terminado si baja alguna de ellas.

### isitagentready.com: 100/100 y nivel 5 (Agent-Native)

- Si el escáner añade comprobaciones o cambia un estándar (MCP, auth.md, ARD, WebMCP, DNS-AID…), se adapta la web hasta volver al máximo.
- El máximo se alcanza con implementaciones reales. Nada de metadatos falsos ni de endpoints que no hagan lo que anuncian.
- Comprueba con este comando después de cada despliegue. Sale con error si la puntuación no es 100 o el nivel no es 5:

  ```bash
  npm run score
  ```

- Fallos conocidos que no dependen de la web: repite el escaneo antes de tocar código.
  - WebMCP en `unableToCheck` con «Browser session timed out»: el navegador del escáner no llegó a abrir la página.
  - DNS-AID con «DNSSEC was not validated» justo después de cambiar DNSSEC o los registros DNS: es la caché de 1.1.1.1. Dura hasta 1 hora o hasta que se purgue en <https://one.one.one.one/purge-cache/>.

### Lighthouse: 100 en las cuatro categorías, en todas las páginas, en móvil y en escritorio

- Mide las 16 páginas (la raíz y las cinco de cada idioma). Sale con error si alguna categoría baja de 100:

  ```bash
  npm run lighthouse
  ```

  ```bash
  npm run lighthouse -- --desktop
  ```

- Sin argumentos mide la web publicada. Para medir antes de publicar: `npm run worker:dev` y `npm run lighthouse -- http://localhost:8787`.
- Cada página se mide hasta tres veces y vale la primera pasada que llega al mínimo. Antes hay una pasada de calentamiento que no cuenta: con Chrome recién abierto, la primera medición sale peor sin que la página tenga la culpa.
- El rendimiento depende sobre todo de no cargar nada que bloquee el primer pintado: CSS en línea, la fuente propia precargada (26 KB) y ningún script ni estilo de terceros al cargar (Turnstile se carga al empezar a rellenar el formulario). No añadas fuentes, CDNs ni scripts externos.
- El CI exige 100 en accesibilidad, buenas prácticas y SEO, y al menos 90 en rendimiento (las máquinas de CI miden peor). El 100 de rendimiento se comprueba con `npm run lighthouse` contra la web publicada.

## Sin perder contenido ni funcionalidad

- Todo el texto visible de las páginas debe seguir presente después de cualquier cambio. Las versiones para agentes (Markdown, API JSON, MCP) recogen toda la información visible.
- **Una sola fuente de datos.**
  - Textos: `src/i18n/es.ts`, `en.ts` y `fr.ts`, con el tipo `Dictionary` (`src/i18n/types.ts`). Las listas van indexadas por id: si a un idioma le falta un elemento, no compila.
  - Datos que no dependen del idioma: `src/data/` (perfil y contacto, proyectos, logros, habilidades, imágenes y páginas).
  - `src/portfolio/` combina datos y textos; las páginas (`src/components`, `src/views`) y las versiones para agentes (`src/agent/`) salen de ahí. No dupliques datos.
- Una página nueva se añade a `PAGE_IDS` (`src/data/pages.ts`). Así aparece en la navegación, el Markdown, el sitemap, `llms.txt`, la API, los recursos MCP y WebMCP.
- Los ids de página (`index`, `proyectos`…) son parámetros públicos de las herramientas MCP y WebMCP: no se cambian.
- `home.unpublished` guarda textos de versiones anteriores de la portada que hoy no se muestran. No se publican; no los borres sin preguntar.

## Calidad del código

- TypeScript estricto en todo (`astro/tsconfigs/strictest` y `worker/tsconfig.json`). Sin `any`, sin aserciones `!`.
- Principios SOLID: cada módulo hace una cosa. En el Worker, los módulos reciben sus dependencias (`worker/services.ts` las crea a partir de los bindings); ninguno lee `env` por su cuenta.
- Antes de dar algo por terminado:

  ```bash
  npm run check
  ```

  (tipos de Astro y del Worker, ESLint con reglas de accesibilidad, Prettier y pruebas unitarias), y con el Worker en marcha, `npm run test:e2e`. Tras compilar, `npm run validate:html`.
- Cada cambio de comportamiento lleva su prueba: `tests/` para `src/`, `worker/test/` para el Worker y `e2e/` para el sistema completo.

## Diseño

- Colores solo con los tokens semánticos de `src/styles/global.css` (`bg-surface`, `text-muted`, `border-line`, `text-accent`…). La paleta de Tailwind está desactivada a propósito: así funcionan el tema oscuro y el alto contraste en toda la web.
- Contraste AA como mínimo en los tres temas. Nada de degradados, brillos ni animaciones decorativas; respeta `prefers-reduced-motion`.
- Los textos que la interfaz muestra o lee un lector de pantalla van en los diccionarios, nunca escritos en los componentes.
- Si el contenido añade caracteres que no están en la fuente, la prueba `tests/i18n.test.ts` falla: amplía `scripts/font-ranges.mjs` y ejecuta `npm run fonts`.
- Los iconos y las imágenes para compartir se generan con `npm run brand-assets` a partir de `public/favicon.svg`.

## Arquitectura

- `src/pages/`: rutas. Las páginas de cada idioma son `[lang]/*.astro` (con `build.format: 'preserve'`: `/es/proyectos.html` se sirve en `/es/proyectos`) y `[lang]/404.astro`, la página de error de cada idioma. Endpoints estáticos: `robots.txt`, `sitemap.xml`, `llms.txt`, `llms-full.txt`, las versiones `.md`, `api/v1/` con OpenAPI, `.well-known/` (catálogo de APIs, catálogo de IA, Server Card MCP, Agent Skills), `auth.md` e `images/` (originales para los agentes).
- `src/layouts/BaseLayout.astro`: cabecera, pie, SEO, enlaces para agentes, JSON-LD y el script en línea que aplica las preferencias antes de pintar.
- `src/scripts/`: código del navegador (preferencias, formulario de contacto, vídeo y WebMCP).
- `worker/`:
  - `index.ts`: punto de entrada y enrutado.
  - `site/`: web estática, negociación de Markdown, cabeceras y documentos de descubrimiento.
  - `oauth/`: OAuth 2.1 con `@cloudflare/workers-oauth-provider` y la página de autorización con Turnstile.
  - `mcp/`: servidor MCP en `/mcp`.
  - `contact/`: envío de mensajes (validación, límites, Turnstile y EmailJS) para el formulario (`POST /api/v1/contact`) y la herramienta MCP.
  - `security/`: Web Bot Auth.
- `wrangler.jsonc`: configuración del Worker. Los secretos no van en el repositorio: `TURNSTILE_SECRET_KEY`, `EMAILJS_PRIVATE_KEY` y `WEB_BOT_AUTH_PRIVATE_KEY`.

## Comandos

- `npm run dev`: servidor de desarrollo de Astro.
- `npm run worker:dev`: compila para <http://localhost:8787> y arranca el Worker. Antes hay que copiar `.dev.vars.example` a `.dev.vars`.
- `npm run check`, `npm run test:e2e`, `npm run validate:html`: comprobaciones (ver arriba).
- `npm run deploy`: comprueba, compila, valida y publica en Cloudflare. Necesita `npx wrangler login`.
- `npm run lighthouse` y `npm run score`: las dos mediciones que deben estar al máximo.

## Cuidado con

- Despliega siempre con `npm run deploy`, nunca con `wrangler deploy` a secas: `npm run worker:dev` deja en `dist/` una compilación con las URL de localhost.
- Política de seguridad de contenidos estricta:
  - Astro la genera en una `<meta>` con los hashes de cada script y estilo (`security.csp` en `astro.config.mjs`), con `'strict-dynamic'` y Trusted Types. El Worker la copia en la cabecera HTTP y le añade `frame-ancestors`.
  - Con `'strict-dynamic'` un script externo solo se ejecuta si su hash está en la política y lleva `integrity`: lo añade `scripts/subresource-integrity.mjs` al compilar. Por eso todo el código del navegador entra por un único script (`src/scripts/main.ts`, en `BaseLayout.astro`): las importaciones entre trozos no heredan la confianza de un hash. No añadas `<script>` en otros componentes; importa el módulo en `main.ts`.
  - Un script en línea nuevo necesita su hash (`Astro.csp.insertScriptHash`, como en `PreferencesScript.astro`).
  - Trusted Types: el DOM no acepta cadenas en `innerHTML` ni URL de scripts sin pasar por la política `portfolio` (`src/scripts/trusted-types.ts`). Usa `textContent` y crea elementos con el DOM.
  - La página de autorización OAuth (la genera el Worker) usa un nonce por respuesta.
- `/mcp` y todo lo que cuelga de él exige token OAuth. Lo público bajo esa ruta, como `/mcp/server-card`, tiene que servirse en `worker/index.ts` antes de pasar por la librería OAuth.
- `wrangler dev` reescribe la URL de las peticiones con el dominio de producción: arráncalo con `--local-upstream` (ya lo hace `npm run worker:dev`) o la librería OAuth no encontrará sus metadatos.
- Ajustes de la zona en Cloudflare que hay que mantener:
  - Bot Preference Sync **desactivado**, porque reescribiría `robots.txt`.
  - Bots de IA permitidos.
  - Always Use HTTPS activado.
  - DNSSEC activo.
  - Registros SVCB `_index._agents` y `_mcp._agents`.
- Para probar con el escáner real antes de publicar, usa un túnel de localhost.run y arranca el Worker con `--local-upstream <host del túnel>` y `SITE_ORIGIN` con su URL. El de trycloudflare.com bloquea la petición de Markdown y el navegador del escáner. En el túnel, DNS-AID no puede pasar (el dominio del túnel no tiene esos registros).
