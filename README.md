# Daniel Carrasco García — Portfolio

<p align="center">
  <img src="https://img.shields.io/badge/Astro-7-%23FF5D01?style=flat-square&logo=astro&logoColor=white" alt="Astro 7" />
  <img src="https://img.shields.io/badge/TypeScript-6-%233178C6?style=flat-square&logo=typescript&logoColor=white" alt="TypeScript 6" />
  <img src="https://img.shields.io/badge/Tailwind_CSS-4-%2338BDF8?style=flat-square&logo=tailwind-css&logoColor=white" alt="Tailwind CSS 4" />
  <img src="https://img.shields.io/badge/Cloudflare-Workers-%23F38020?style=flat-square&logo=cloudflare&logoColor=white" alt="Cloudflare Workers" />
  <img src="https://img.shields.io/badge/Lighthouse-100-%230CCE6B?style=flat-square&logo=lighthouse&logoColor=white" alt="Lighthouse 100" />
  <img src="https://img.shields.io/badge/isitagentready-nivel_5-%231D4ED8?style=flat-square" alt="isitagentready nivel 5" />
</p>

Porfolio profesional y académico de **Daniel Carrasco García**, estudiante de Ingeniería Informática en la Universidad de Málaga (UMA), con experiencia en software, sistemas embebidos, diseño de PCB, radiofrecuencia y tecnología aeroespacial.

Se publica en <https://danielcarrascogarcia.me> en **español, inglés y francés**, desde un Worker de Cloudflare que sirve la web estática, su versión para agentes de IA, un servidor MCP con OAuth 2.1 y la API del formulario de contacto.

## Características

- **Diseño sobrio y profesional**: tipografía Inter, una sola paleta con tema claro y oscuro (según el sistema o a elección), sin efectos superfluos. Contraste AA en todos los textos.
- **Rendimiento**: 100 en Lighthouse en las 16 páginas, en móvil y en escritorio. CSS en línea, una única fuente propia de 26 KB, imágenes AVIF/WebP con tamaños adaptados y nada de terceros al cargar.
- **Accesibilidad**: menú con tema, tamaño de texto, alto contraste (negro y amarillo, o negro sobre blanco con el tema claro, ambos con contraste AAA) y filtros de corrección para daltonismo. Las preferencias se recuerdan entre visitas y se aplican antes de pintar. Además: enlace para saltar al contenido, navegación completa con teclado y textos traducidos en los tres idiomas. Se comprueba con axe en todos los temas y estados, no solo en el que mide Lighthouse.
- **Seguridad** (A+ en [Mozilla Observatory](https://developer.mozilla.org/en-US/observatory/analyze?host=danielcarrascogarcia.me)):
  - Política de seguridad de contenidos estricta, enviada en la cabecera: hashes de cada script y estilo, `'strict-dynamic'`, integridad de subrecursos y Trusted Types.
  - HSTS de dos años que incluye los subdominios, `Cross-Origin-Opener-Policy`, `Cross-Origin-Resource-Policy` y protección contra el encuadre, también en la página de autorización OAuth (salvo COOP, que rompería las ventanas emergentes de los clientes).
  - Formulario protegido con Cloudflare Turnstile y límites de envío en el servidor.
  - `/.well-known/security.txt` (RFC 9116).
- **Preparado para agentes de IA** (nivel 5 en [isitagentready.com](https://isitagentready.com)): todo sale de los mismos datos que las páginas, así que nunca se desincroniza.
  - Versión Markdown de cada página (`/es/proyectos.md` o `Accept: text/markdown`), `llms.txt`, `llms-full.txt` y `sitemap.xml` con los idiomas alternativos.
  - API JSON con índice en `/api/v1/` y descrita con OpenAPI (`/api/v1/openapi.json`), catálogo de APIs (RFC 9727), catálogo de IA, Agent Skills y datos estructurados (JSON-LD).
  - Servidor MCP en `/mcp` con OAuth 2.1 (`/auth.md`, registro dinámico de clientes, PKCE y Turnstile; sin cuentas) y herramientas WebMCP en el navegador.
  - `robots.txt` con reglas para bots de IA y Content Signals, Web Bot Auth y registros DNS-AID.

## Arquitectura

```text
src/
├── data/          Datos que no dependen del idioma: perfil y contacto, proyectos, logros,
│                  habilidades, imágenes y lista de páginas
├── i18n/          Textos en es, en y fr, tipados: si falta un texto, no compila
├── portfolio/     Contenido de cada idioma (datos + textos), para las páginas y los agentes
├── agent/         Versiones para agentes: Markdown, llms.txt, API JSON, Agent Skills, MCP
├── components/    Componentes de la interfaz (layout, seo, home, projects, skills,
│                  achievements, contact, ui)
├── views/         Composición de cada página
├── pages/         Rutas: páginas por idioma ([lang]/…), 404 y endpoints estáticos
├── scripts/       Código del navegador: preferencias, formulario, vídeo y WebMCP
├── lib/           Utilidades compartidas (textos, imágenes, preferencias, reglas del formulario)
├── config/        Claves públicas (Turnstile)
├── assets/        Imágenes originales y fuente
└── styles/        Sistema de diseño (Tailwind 4 con colores semánticos)
worker/            Worker de Cloudflare, en módulos con una sola responsabilidad:
                   http/, site/, oauth/, mcp/, contact/, security/ y services.ts, que crea
                   las dependencias a partir de los bindings
tests/, worker/test/, e2e/
                   Pruebas unitarias (Vitest) y de extremo a extremo contra el Worker
scripts/           Lighthouse, puntuación para agentes, fuente, iconos y clave de Web Bot Auth
```

### Editar el contenido

- **Textos**: `src/i18n/es.ts`, `en.ts` y `fr.ts`. Los proyectos, logros y categorías de habilidades van indexados por su id, así que TypeScript avisa si a un idioma le falta alguno.
- **Proyectos, logros o habilidades nuevos**: se añaden en `src/data/` (fechas, estado, imagen, ámbito…) y sus textos en los tres diccionarios.
- **Imágenes**: los originales van en `src/assets/images/`. La web usa versiones optimizadas y el original se publica en `/images/<fichero>` para los agentes.
- **Páginas nuevas**: se añaden a `PAGE_IDS` en `src/data/pages.ts` y aparecen en la navegación, el Markdown, el sitemap, `llms.txt`, la API y los recursos MCP.

Las versiones para agentes (Markdown, API, MCP, `llms.txt`) se regeneran solas en cada compilación.

## Desarrollo

Requisitos: Node.js 22.22 o superior (el CI usa Node 24).

```bash
npm install
```

```bash
npm run dev
```

| Comando | Qué hace |
|---|---|
| `npm run dev` | Servidor de desarrollo de Astro en <http://localhost:4321> |
| `npm run worker:dev` | Compila para localhost y arranca el Worker en <http://localhost:8787> (antes: `cp .dev.vars.example .dev.vars`) |
| `npm run check` | Tipos (Astro y Worker), ESLint, Prettier y pruebas unitarias |
| `npm run test:e2e` | Pruebas de extremo a extremo contra el Worker en marcha |
| `npm run build` | Compila la web en `dist/` |
| `npm run validate:html` | Valida el HTML compilado |
| `npm run lighthouse` | Mide todas las páginas con Lighthouse (`-- --desktop` para escritorio, `-- http://localhost:8787` para el local) |
| `npm run a11y` | Pasa axe por todas las páginas en los temas claro y oscuro, con y sin alto contraste, en móvil y escritorio y con los menús abiertos (`-- http://localhost:8787` para el local) |
| `npm run score` | Comprueba que la web publicada sigue en 100/100 y nivel 5 en isitagentready.com |
| `npm run deploy` | Comprueba, compila, valida y publica en Cloudflare (`npx wrangler login` antes) |
| `npm run fonts` / `npm run brand-assets` | Regeneran la fuente reducida y los iconos e imágenes para compartir |

## Integración continua y despliegue

- **CI** (`.github/workflows/ci.yml`): en cada push a `main` y en cada pull request comprueba tipos, estilo y pruebas, compila, valida el HTML y empaqueta el Worker. Después arranca el Worker en local y pasa las pruebas de extremo a extremo, Lighthouse en móvil y escritorio y la comprobación de accesibilidad en todos los temas. No despliega.
- **Despliegue**: `npm run deploy`. La configuración de Cloudflare (dominio, DNSSEC, Turnstile, EmailJS, secretos y registros DNS-AID) está en [DEPLOY-CLOUDFLARE.md](DEPLOY-CLOUDFLARE.md).
- **Reglas del proyecto**: [CLAUDE.md](CLAUDE.md). La web debe estar siempre en 100 en Lighthouse y en 100/100 y nivel 5 en isitagentready.com.

## Misiones y proyectos destacados

- **Málaga Space Team (CubeSat 1U)**: plataforma de satélite experimental CubeSat 1U en la Universidad de Málaga (Mobilenet Lab). Daniel diseña la arquitectura del subsistema de RF y los enlaces de comunicación LoRa, y elabora los informes de Link Budget y la documentación técnica.
- **Kursaatélite (CanSat Esero y Proyecto Servet)**: investigación aeroespacial en entornos suborbitales. Diseño y construcción de una sonda que alcanzó 45.000 metros de altitud a bordo de un globo estratosférico, con enlaces de telemetría LoRa de largo alcance que soportaron −50 °C y condiciones de casi vacío. Daniel lideró el equipo de ingeniería.
- **Oracle AI y Machine Learning**: modelo predictivo en Python y scikit-learn para predecir el próximo éxito musical del verano de 2025. Tercer puesto nacional en el reto de Oracle.

## Logros y reconocimientos principales

Más de 6 años de trayectoria y excelencia académica:

- **Catch a Star (EAAE)**: 2.º premio internacional de la Asociación Europea para la Educación en Astronomía (2024).
- **Ciencia en Acción**: 1.er premio nacional en Astronomía (2023) y 2.º puesto en STEAM (2022).
- **Infomatrix Iberoamérica**: medallas de platino internacionales en Ciencia y Tecnología (2022 y 2023) y máximo galardón técnico de la competición (2021).
- **Talent 4 Cyber**: finalista nacional, puesto 12 en el campeonato de ciberseguridad del Ministerio de Defensa (2025).
- **Matrícula de Honor en Bachillerato**: IES Kursaal de Algeciras (2024).

## Licencia

Este portfolio es de código abierto. Siéntete libre de explorar el código para aprender cómo se estructura un sitio multilingüe, accesible y preparado para agentes con Astro y Cloudflare Workers.

Desarrollado por **Daniel Carrasco García**.
