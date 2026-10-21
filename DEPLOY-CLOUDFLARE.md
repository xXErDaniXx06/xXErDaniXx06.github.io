# Despliegue en Cloudflare (web preparada para agentes de IA)

Esta guía mueve **danielcarrascogarcia.me** de GitHub Pages a un Worker de Cloudflare, que sirve la misma web y además todo lo que puntúa en [isitagentready.com](https://isitagentready.com):

- negociación de Markdown, cabeceras `Link` y cabeceras de seguridad, que GitHub Pages no permite;
- servidor MCP en `/mcp`, con OAuth 2.1, Turnstile y la herramienta para enviarte mensajes;
- la API del formulario de contacto (`POST /api/v1/contact`), que envía los correos desde el servidor;
- Web Bot Auth y los registros DNS para agentes (DNS-AID, con DNSSEC).

**Coste: 0 €.** Todo cabe en los planes gratuitos de Cloudflare (Workers, KV, Turnstile, DNS y DNSSEC) y de EmailJS. El dominio sigue registrado en Namecheap; solo cambia quién responde a su DNS.

**Resultado esperado: 16/16 comprobaciones y nivel 5 (Agent-Native).** Antes de esta migración, la web probada a través de un túnel temporal sacó 15/16 y nivel 5. La que faltaba es DNS-AID, que solo puede pasar en el dominio real (paso 6).

Tiempo: unos 45 minutos, más la espera a que Cloudflare active el dominio (de minutos a unas horas).

> **Estado (20-10-2026): migración hecha.** Zona activa en Cloudflare (nameservers `lennon` y `magdalena`), DNSSEC validado (DS `2371 13 2`), widget de Turnstile *Porfolio OAuth*, API de EmailJS para servidores activada, Worker `danielcarrascogarcia` desplegado con sus tres secretos y registros DNS-AID publicados. Esta guía sirve para repetirlo o revisarlo.

---

## 1. Añadir el dominio a Cloudflare

1. Crea una cuenta gratuita en <https://dash.cloudflare.com> (si no la tienes) y pulsa **Add a domain** → **Connect a domain** (no *Transfer*, que movería el registro del dominio) → `danielcarrascogarcia.me` → plan **Free**.
   - En *Configure AI training & search policies* deja **Allow (do not block)** en Search, Agent y Training.
   - **Desactiva Bot Preference Sync**. Si está activado, Cloudflare antepone sus reglas al `robots.txt` del Worker y se contradicen.
2. Cloudflare importa los registros DNS actuales. **Comprueba que están todos** y añade los que falten (todos con *Proxy status* **DNS only**, nube gris):

   | Tipo | Nombre | Contenido | Prioridad |
   |---|---|---|---|
   | MX | `@` | `mx.zoho.eu` | 10 |
   | MX | `@` | `mx2.zoho.eu` | 20 |
   | MX | `@` | `mx3.zoho.eu` | 50 |
   | TXT | `@` | `v=spf1 include:zohomail.eu ~all` | |
   | TXT | `@` | `zoho-verification=zb12826892.zmverify.zoho.eu` | |
   | TXT | `zmail._domainkey` | `v=DKIM1; k=rsa; p=MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQCZ2DcViDF7H5Y+6VNSDwy9258iIKJ8cXQkekXMjMZ3gEiIp2RCbvUbLG8duL3CjzSwmzLAl47x6iOoKaWqp22Fz8oOghtsqabQXogiQ7w9wLRGAVvLSwzIbAbMliPtEW4xYrn6ocTB2uuGfMs3KvZC4s/g0IkSLQ3cYWjO7GKu0wIDAQAB` | |

   El registro DKIM (`zmail._domainkey`) es el que más fácil se pierde en la importación: sin él, tus correos de Zoho pueden acabar en spam.
3. Los registros de GitHub Pages (4 registros `A` a `185.199.108-111.153` y el `CNAME` de `www` a `xxerdanixx06.github.io`) déjalos de momento en **DNS only**. Así la web sigue funcionando igual hasta el paso 5.

## 2. Cambiar los nameservers en Namecheap

1. Namecheap → **Domain List** → `danielcarrascogarcia.me` → **Manage** → **Nameservers** → **Custom DNS**.
2. Pon los dos nameservers que te indica Cloudflare (del tipo `xxx.ns.cloudflare.com`) y guarda.
3. Espera a que Cloudflare marque el dominio como **Active** (te avisa por email). El correo no se interrumpe porque los registros de Zoho ya están en Cloudflare.

## 3. Activar DNSSEC

1. Cloudflare → **DNS** → **Settings** → **DNSSEC** → **Enable DNSSEC**. Te muestra los datos del registro DS.
2. Namecheap → **Advanced DNS** → **DNSSEC** → **Add new DS record** con *Key Tag*, *Algorithm* (13), *Digest Type* (2) y *Digest* tal como los da Cloudflare.
3. En unas horas Cloudflare mostrará DNSSEC como activo.

## 4. Crear las claves

**Turnstile** (la comprobación de que hay una persona en la página de autorización y en el formulario de contacto):

1. Cloudflare → **Turnstile** → **Add widget**: nombre `Porfolio OAuth`, hostname `danielcarrascogarcia.me`, modo **Managed**.
2. Copia la **Site Key** en `src/config/turnstile.ts`; es pública y va en el repositorio. La usan el formulario de contacto y la página de autorización.
3. Guarda la **Secret Key** para el paso 5. Está en el widget → *Edit Widget* → *Widget Keys* → **Show**. Mide unos 35 caracteres; el *Site key*, que es fácil copiar por error, mide 24.

**EmailJS** (el Worker envía con él los mensajes del formulario de la web y de la herramienta MCP):

1. EmailJS → **Account** → **Security** → activa **Allow EmailJS API for non-browser applications**.
2. Copia la **Private Key** (Account → API keys) para el paso 5.
3. La plantilla `template_mkc43b2` no debe tener activado *Enable reCAPTCHA V2 verification* (en sus *Settings*), porque bloquearía los envíos desde el servidor. Las cabeceras de la plantilla (remitente, *Reply To* y asunto) usan `{{name}}`, `{{email}}` y `{{title}}`, y el Worker las rellena siempre.

**Web Bot Auth** (la clave con la que el Worker firma sus peticiones automáticas): ejecuta este comando y guarda la línea que imprime.

```bash
npm run wba:key
```

## 5. Desplegar el Worker

**Antes de nada:** en Cloudflare → **SSL/TLS** → **Edge Certificates**, comprueba que el certificado *Universal* está **Active**. Activa también **Always Use HTTPS**, que es lo que hacía GitHub Pages.

Así se hizo, con menos de un minuto sin web:

1. `npm run deploy` sube el código y los ficheros y crea el KV. Falla al conectar los dominios mientras existen los registros de GitHub (error 100117), y es lo esperado.
2. En **DNS**, borra los 4 registros `A` de `@` y el `CNAME` de `www`.
3. Justo después, conecta los dominios:

   ```bash
   npx wrangler triggers deploy
   ```

Para el día a día hay dos formas de desplegar:

- **Desde Cloudflare, con despliegue automático en cada push** (recomendado):
  1. Cloudflare → **Workers & Pages** → **Create** → **Import a repository** → autoriza GitHub y elige `xXErDaniXx06/xXErDaniXx06.github.io`.
  2. Build command: `npm run build`. Deploy command: `npx wrangler deploy`. (Compila siempre antes de desplegar: `dist/` puede contener una compilación para localhost si has usado `npm run worker:dev`.)
  3. Cuando termine el primer despliegue, ve a **Settings** → **Variables and Secrets** y añade tres secretos (tipo *Secret*): `TURNSTILE_SECRET_KEY`, `EMAILJS_PRIVATE_KEY` y `WEB_BOT_AUTH_PRIVATE_KEY`, con los valores del paso 4.
- **Desde tu terminal**, con estos comandos en orden:

  ```bash
  npx wrangler login
  ```

  ```bash
  npx wrangler secret put TURNSTILE_SECRET_KEY
  ```

  ```bash
  npx wrangler secret put EMAILJS_PRIVATE_KEY
  ```

  ```bash
  npx wrangler secret put WEB_BOT_AUTH_PRIVATE_KEY
  ```

  ```bash
  npm run deploy
  ```

  Wrangler pregunta si quieres crear el Worker la primera vez que guardas un secreto: responde que sí.

El primer despliegue crea solo el almacenamiento KV (`OAUTH_KV`), los dos limitadores (`OAUTH_RATE_LIMITER` y `CONTACT_RATE_LIMITER`) y conecta los dominios `danielcarrascogarcia.me` y `www.danielcarrascogarcia.me`.

## 6. Registros DNS para agentes (DNS-AID)

En Cloudflare → **DNS** → **Add record**, tipo **SVCB**:

| Nombre | Prioridad | Target | Value |
|---|---|---|---|
| `_index._agents` | 1 | `danielcarrascogarcia.me` | `alpn="h2,h3" port="443"` |
| `_mcp._agents` | 1 | `danielcarrascogarcia.me` | `alpn="mcp,h2,h3" port="443"` |

`_index._agents` es el punto de entrada que buscan los agentes (y el escáner): apunta al servidor que publica el catálogo `/.well-known/ai-catalog.json`. `_mcp._agents` anuncia el servidor MCP.

## 7. Retirar GitHub Pages

Hecho el 20-10-2026: Pages está desactivado en el repositorio y se han eliminado `public/CNAME` y el workflow que desplegaba a Pages. Lo sustituye `.github/workflows/ci.yml`, que solo compila y comprueba; el despliegue se hace con `npm run deploy`.

## 8. Comprobar

1. Escanea <https://danielcarrascogarcia.me> en [isitagentready.com](https://isitagentready.com).
2. Conecta el servidor MCP desde un cliente (por ejemplo, Claude → *Connectors* → URL `https://danielcarrascogarcia.me/mcp`): debe abrirse la página de autorización con Turnstile.
3. Envía un mensaje desde el formulario de `/es/contacto` (y, si quieres, con `send_contact_message`) para confirmar que llega el correo. Si EmailJS lo rechaza, revisa el paso 4: la plantilla no debe exigir reCAPTCHA para llamadas desde servidor.
4. Mide Lighthouse en todas las páginas (móvil y escritorio): `npm run lighthouse` y `npm run lighthouse -- --desktop`.

Comprobaciones rápidas desde la terminal:

```bash
curl -sI -H 'Accept: text/markdown' https://danielcarrascogarcia.me/ | grep -i content-type
```

```bash
dig +short SVCB _index._agents.danielcarrascogarcia.me
```

---

## Mantenimiento

- **Contenido**: los textos están en `src/i18n/` (`es.ts`, `en.ts`, `fr.ts`) y los datos que no dependen del idioma en `src/data/` (perfil, proyectos, logros, habilidades, imágenes). El Markdown, `llms.txt`, la API JSON, el servidor MCP y las skills se regeneran solos en cada compilación.
- **Probar el Worker en local**:

  ```bash
  cp .dev.vars.example .dev.vars
  ```

  ```bash
  npm run worker:dev
  ```

  Compila la web para <http://localhost:8787> y arranca el Worker. Las claves de Turnstile de `.dev.vars.example` son las de prueba de Cloudflare, que siempre aprueban; sin clave de EmailJS no se envía ningún correo. Las pruebas de extremo a extremo se lanzan contra él con `npm run test:e2e`.
- **Entrenamiento de modelos de IA**: `robots.txt` mantiene lo que había antes, es decir, todo permitido, y lo declara con Content Signals (`ai-train=yes`). Para excluir el entrenamiento, cambia `SIGNALS` y las reglas de `TRAINING_BOTS` en `src/pages/robots.txt.ts`.
- **Límites**: el formulario admite un mensaje por minuto y cinco por hora desde cada IP; el servidor MCP, 3 mensajes por hora y autorización; entre los dos, 20 al día en total. Las rutas OAuth admiten 10 peticiones por minuto y por IP.
