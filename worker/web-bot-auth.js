// Web Bot Auth (IETF webbotauth): el Worker se identifica cuando hace peticiones
// automáticas (EmailJS, Turnstile) firmándolas con HTTP Message Signatures (RFC 9421),
// y publica su clave pública en /.well-known/http-message-signatures-directory.
// La clave privada es el secreto WEB_BOT_AUTH_PRIVATE_KEY (JWK Ed25519, generado con
// `npm run wba:key`). Si no está configurado no se publica nada y no se firma.

export const DIRECTORY_PATH = '/.well-known/http-message-signatures-directory';
const DIRECTORY_TYPE = 'application/http-message-signatures-directory+json';

const encoder = new TextEncoder();
const base64 = (bytes) => btoa(String.fromCharCode(...bytes));
const base64url = (bytes) => base64(bytes).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');

let cached = null;

async function loadKey(env) {
  const raw = env.WEB_BOT_AUTH_PRIVATE_KEY;
  if (!raw) return null;
  if (cached?.raw === raw) return cached;
  const jwk = JSON.parse(raw);
  const key = await crypto.subtle.importKey('jwk', jwk, { name: 'Ed25519' }, false, ['sign']);
  // keyid = huella JWK SHA-256 (RFC 7638 / RFC 8037 A.3)
  const thumbprint = await crypto.subtle.digest('SHA-256', encoder.encode(JSON.stringify({ crv: 'Ed25519', kty: 'OKP', x: jwk.x })));
  cached = { raw, key, kid: base64url(new Uint8Array(thumbprint)), publicJwk: { kty: 'OKP', crv: 'Ed25519', x: jwk.x } };
  return cached;
}

async function sign(key, signatureBase) {
  return base64(new Uint8Array(await crypto.subtle.sign('Ed25519', key, encoder.encode(signatureBase))));
}

/** Directorio de claves, firmado con cada clave sobre @authority (sección 5.2 del borrador). */
export async function serveDirectory(request, env) {
  const k = await loadKey(env);
  if (!k) return new Response('Not Found', { status: 404 });
  const created = Math.floor(Date.now() / 1000);
  const params = `("@authority";req);created=${created};keyid="${k.kid}";alg="ed25519";expires=${created + 300};tag="http-message-signatures-directory"`;
  const signatureBase = `"@authority";req: ${new URL(request.url).host}\n"@signature-params": ${params}`;
  const body = JSON.stringify({ keys: [{ ...k.publicJwk, kid: k.kid, use: 'sig' }] });
  return new Response(request.method === 'HEAD' ? null : body, {
    headers: {
      'Content-Type': DIRECTORY_TYPE,
      'Cache-Control': 'public, max-age=300',
      'Access-Control-Allow-Origin': '*',
      'Signature-Input': `binding0=${params}`,
      Signature: `binding0=:${await sign(k.key, signatureBase)}:`,
    },
  });
}

/** fetch() firmado con la etiqueta web-bot-auth; sin clave configurada es un fetch normal. */
export async function signedFetch(env, url, init = {}) {
  const k = await loadKey(env);
  if (!k) return fetch(url, init);
  const created = Math.floor(Date.now() / 1000);
  const nonce = base64(crypto.getRandomValues(new Uint8Array(32)));
  const agent = `"${env.SITE_ORIGIN}"`;
  const params = `("@authority" "signature-agent";key="sig1");created=${created};keyid="${k.kid}";alg="ed25519";expires=${created + 60};nonce="${nonce}";tag="web-bot-auth"`;
  const signatureBase = [
    `"@authority": ${new URL(url).host}`,
    `"signature-agent";key="sig1": ${agent}`,
    `"@signature-params": ${params}`,
  ].join('\n');
  const headers = new Headers(init.headers);
  headers.set('Signature-Agent', `sig1=${agent}`);
  headers.set('Signature-Input', `sig1=${params}`);
  headers.set('Signature', `sig1=:${await sign(k.key, signatureBase)}:`);
  return fetch(url, { ...init, headers });
}
