# CLAUDE.md

Porfolio de Daniel Carrasco García (Astro 6 + Tailwind, en español, inglés y francés). Se sirve en <https://danielcarrascogarcia.me> desde un Worker de Cloudflare. La migración está explicada en [DEPLOY-CLOUDFLARE.md](DEPLOY-CLOUDFLARE.md).

## Regla principal: siempre al máximo en isitagentready.com

- La web tiene que estar **siempre en 100/100 y nivel 5 (Agent-Native)** en [isitagentready.com](https://isitagentready.com). Ningún cambio está terminado si baja la puntuación o el nivel.
- Si el escáner añade comprobaciones o cambia un estándar (MCP, auth.md, ARD, WebMCP, DNS-AID…), se adapta la web hasta volver al máximo.
- El máximo se alcanza con implementaciones reales. Nada de metadatos falsos ni de endpoints que no hagan lo que anuncian.
- Comprueba con este comando después de cada despliegue. Sale con error si la puntuación no es 100 o el nivel no es 5:

  ```bash
  npm run score
  ```

- Fallos conocidos que no dependen de la web: repite el escaneo antes de tocar código.
  - WebMCP en `unableToCheck` con «Browser session timed out»: el navegador del escáner no llegó a abrir la página.
  - DNS-AID con «DNSSEC was not validated» justo después de cambiar DNSSEC o los registros DNS: es la caché de 1.1.1.1. Dura hasta 1 hora o hasta que se purgue en <https://one.one.one.one/purge-cache/>.

## Sin perder contenido ni funcionalidad

- Todo el texto visible de las páginas debe seguir presente después de cualquier refactorización. Las versiones para agentes (Markdown, API JSON, MCP) deben recoger toda la información visible.
- **Una sola fuente de datos.** Los textos están en `src/utils/i18n.js`. Los datos de contacto, las imágenes o vídeos de los proyectos y la lista de páginas (`PAGES`) están en `src/data/profile.js`. Todo lo que hay en `src/agent/` se genera a partir de ahí: no dupliques datos.
- Una página nueva se añade a `PAGES`. Así aparece en el Markdown, el sitemap, `llms.txt`, la API, los recursos MCP y WebMCP.

## Arquitectura

- `src/pages/`: páginas HTML y endpoints estáticos: `robots.txt`, `sitemap.xml`, `llms.txt`, `llms-full.txt`, las versiones `.md`, `api/v1/` con OpenAPI, `.well-known/` (catálogo de APIs, catálogo de IA, Server Card MCP, Agent Skills) y `auth.md`.
- `src/components/agent/AgentDiscovery.astro`: enlaces de descubrimiento y JSON-LD en el `<head>`, y carga de `src/scripts/webmcp.js`, que registra las herramientas WebMCP.
- `worker/`:
  - `site.js`: negociación de Markdown, cabeceras `Link` y de seguridad, tipos de contenido y documentos de descubrimiento.
  - `mcp.js`: servidor MCP en `/mcp`.
  - `index.js` y `consent.js`: OAuth 2.1 con `@cloudflare/workers-oauth-provider`, con `/authorize` protegido por Turnstile.
  - `contact.js`: envío de mensajes por EmailJS.
  - `web-bot-auth.js`: firma de las peticiones salientes.
- `wrangler.jsonc`: configuración del Worker. Los secretos no van en el repositorio: `TURNSTILE_SECRET_KEY`, `EMAILJS_PRIVATE_KEY` y `WEB_BOT_AUTH_PRIVATE_KEY`.

## Comandos

- `npm run build`: comprueba los tipos y compila. El CI (`.github/workflows/ci.yml`) lo ejecuta y además empaqueta el Worker.
- `npm run worker:dev`: Worker en local en <http://localhost:8787>. Antes hay que copiar `.dev.vars.example` a `.dev.vars`.
- `npm run deploy`: compila y publica en Cloudflare. Necesita `npx wrangler login`.
- `npm run score`: escanea la web publicada y comprueba que está al máximo.

## Cuidado con

- `/mcp` y todo lo que cuelga de él exige token OAuth. Lo público bajo esa ruta, como `/mcp/server-card`, tiene que servirse en `worker/index.js` antes de pasar por la librería OAuth.
- En el `<head>` del layout solo pueden ir elementos válidos de cabecera. Un `<svg>` ahí hace que Astro descarte la etiqueta `<body>` y sus clases.
- Ajustes de la zona en Cloudflare que hay que mantener:
  - Bot Preference Sync **desactivado**, porque reescribiría `robots.txt`.
  - Bots de IA permitidos.
  - Always Use HTTPS activado.
  - DNSSEC activo.
  - Registros SVCB `_index._agents` y `_mcp._agents`.
- Para probar con el escáner real antes de publicar, usa un túnel de localhost.run. El de trycloudflare.com bloquea la petición de Markdown y el navegador del escáner.
