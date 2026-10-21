// Web Bot Auth (IETF webbotauth): el Worker se identifica en sus peticiones automáticas
// (EmailJS, Turnstile) firmándolas con HTTP Message Signatures (RFC 9421), y publica su
// clave pública en /.well-known/http-message-signatures-directory.
// La clave privada es el secreto WEB_BOT_AUTH_PRIVATE_KEY (JWK Ed25519, generado con
// `npm run wba:key`). Sin él no se publica el directorio y las peticiones van sin firmar.

import type { HttpClient } from '../http/client';

export const DIRECTORY_PATH = '/.well-known/http-message-signatures-directory';
const DIRECTORY_TYPE = 'application/http-message-signatures-directory+json';

interface SigningKey {
  raw: string;
  key: CryptoKey;
  /** Huella JWK SHA-256 (RFC 7638 / RFC 8037 A.3). */
  kid: string;
  publicJwk: { kty: 'OKP'; crv: 'Ed25519'; x: string };
}

const encoder = new TextEncoder();
const base64 = (bytes: Uint8Array): string => btoa(String.fromCharCode(...bytes));
const base64url = (bytes: Uint8Array): string =>
  base64(bytes).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');

// La importación de la clave se reutiliza entre peticiones de la misma instancia.
let cached: SigningKey | undefined;

async function loadKey(raw: string): Promise<SigningKey> {
  if (cached?.raw === raw) return cached;
  const jwk = JSON.parse(raw) as JsonWebKey & { x: string };
  const key = await crypto.subtle.importKey('jwk', jwk, { name: 'Ed25519' }, false, ['sign']);
  const thumbprint = await crypto.subtle.digest(
    'SHA-256',
    encoder.encode(JSON.stringify({ crv: 'Ed25519', kty: 'OKP', x: jwk.x })),
  );
  cached = {
    raw,
    key,
    kid: base64url(new Uint8Array(thumbprint)),
    publicJwk: { kty: 'OKP', crv: 'Ed25519', x: jwk.x },
  };
  return cached;
}

async function sign(key: CryptoKey, signatureBase: string): Promise<string> {
  return base64(new Uint8Array(await crypto.subtle.sign('Ed25519', key, encoder.encode(signatureBase))));
}

const nowInSeconds = (): number => Math.floor(Date.now() / 1000);

export class WebBotAuth {
  constructor(
    private readonly privateKey: string | undefined,
    /** Origen que se declara como agente firmante (Signature-Agent). */
    private readonly agentOrigin: string,
  ) {}

  /** fetch() firmado con la etiqueta web-bot-auth; sin clave es un fetch normal. */
  readonly fetch: HttpClient = async (url, init = {}) => {
    if (!this.privateKey) return fetch(url, init);
    const k = await loadKey(this.privateKey);
    const created = nowInSeconds();
    const nonce = base64(crypto.getRandomValues(new Uint8Array(32)));
    const agent = `"${this.agentOrigin}"`;
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
  };

  /** Directorio de claves, firmado con cada clave sobre @authority (sección 5.2 del borrador). */
  async directory(request: Request): Promise<Response> {
    if (!this.privateKey) return new Response('Not Found', { status: 404 });
    const k = await loadKey(this.privateKey);
    const created = nowInSeconds();
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
}
