import { describe, expect, it } from 'vitest';
import { WebBotAuth } from '../security/web-bot-auth';

async function newKey(): Promise<{ privateJwk: string; publicKey: CryptoKey }> {
  const pair = (await crypto.subtle.generateKey({ name: 'Ed25519' }, true, ['sign', 'verify'])) as CryptoKeyPair;
  const jwk = (await crypto.subtle.exportKey('jwk', pair.privateKey)) as JsonWebKey;
  return { privateJwk: JSON.stringify({ kty: jwk.kty, crv: jwk.crv, x: jwk.x, d: jwk.d }), publicKey: pair.publicKey };
}

const fromBase64 = (value: string) => Uint8Array.from(atob(value), (c) => c.charCodeAt(0));

describe('Web Bot Auth', () => {
  it('sin clave no publica directorio', async () => {
    const response = await new WebBotAuth(undefined, 'https://example.test').directory(
      new Request('https://example.test/'),
    );
    expect(response.status).toBe(404);
  });

  it('el directorio publica la clave pública y una firma válida', async () => {
    const { privateJwk, publicKey } = await newKey();
    const response = await new WebBotAuth(privateJwk, 'https://example.test').directory(
      new Request('https://example.test/.well-known/http-message-signatures-directory'),
    );
    expect(response.headers.get('Content-Type')).toBe('application/http-message-signatures-directory+json');
    const { keys } = (await response.json()) as { keys: { kid: string; x: string }[] };
    expect(keys).toHaveLength(1);
    const params = response.headers.get('Signature-Input')?.replace(/^binding0=/, '') ?? '';
    const signature = /^binding0=:(.+):$/.exec(response.headers.get('Signature') ?? '')?.[1] ?? '';
    const base = `"@authority";req: example.test\n"@signature-params": ${params}`;
    expect(params).toContain(`keyid="${keys[0]?.kid}"`);
    expect(params).toContain('tag="http-message-signatures-directory"');
    expect(
      await crypto.subtle.verify('Ed25519', publicKey, fromBase64(signature), new TextEncoder().encode(base)),
    ).toBe(true);
  });
});
