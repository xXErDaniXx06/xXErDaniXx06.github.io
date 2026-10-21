import { describe, expect, it } from 'vitest';
import { pickLang } from '../oauth/consent-handler';
import { COMMON_SECURITY_HEADERS } from '../http/headers';
import { consentFormBody, consentPageHeaders, consentPagePolicy, createNonce, escapeHtml } from '../oauth/consent-page';
import { authorizationServerExtras, normalizeResource, originResourceMetadata } from '../oauth/metadata';
import { withNormalizedResource } from '../oauth/resource-normalizer';
import { getDictionary } from '../../src/i18n';

const ORIGIN = 'https://example.test';

describe('recursos OAuth', () => {
  it('un token para el origen es un token para el servidor MCP', () => {
    expect(normalizeResource(ORIGIN, ORIGIN)).toBe(`${ORIGIN}/mcp`);
    expect(normalizeResource(`${ORIGIN}/`, ORIGIN)).toBe(`${ORIGIN}/mcp`);
    expect(normalizeResource(`${ORIGIN}/mcp`, ORIGIN)).toBe(`${ORIGIN}/mcp`);
    expect(normalizeResource('https://other.test', ORIGIN)).toBe('https://other.test');
  });

  it('normaliza el recurso en /authorize', async () => {
    const request = await withNormalizedResource(
      new Request(`${ORIGIN}/authorize?client_id=c&resource=${encodeURIComponent(ORIGIN)}`),
      ORIGIN,
    );
    expect(new URL(request.url).searchParams.getAll('resource')).toEqual([`${ORIGIN}/mcp`]);
  });

  it('normaliza el recurso en /oauth/token', async () => {
    const request = await withNormalizedResource(
      new Request(`${ORIGIN}/oauth/token`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: `grant_type=authorization_code&resource=${encodeURIComponent(ORIGIN)}`,
      }),
      ORIGIN,
    );
    expect(new URLSearchParams(await request.text()).get('resource')).toBe(`${ORIGIN}/mcp`);
  });

  it('metadatos del origen y bloque agent_auth', () => {
    expect(originResourceMetadata(ORIGIN)).toMatchObject({ resource: ORIGIN, authorization_servers: [ORIGIN] });
    expect(authorizationServerExtras(ORIGIN).agent_auth).toMatchObject({
      register_uri: `${ORIGIN}/oauth/register`,
      claim_uri: `${ORIGIN}/authorize`,
      identity_types_supported: ['anonymous'],
    });
  });
});

describe('página de autorización', () => {
  it('elige el idioma por Accept-Language', () => {
    const withLanguage = (value: string) => new Request(ORIGIN, { headers: { 'Accept-Language': value } });
    expect(pickLang(withLanguage('fr-FR,fr;q=0.9'))).toBe('fr');
    expect(pickLang(withLanguage('de-DE,en;q=0.8'))).toBe('en');
    expect(pickLang(withLanguage('de-DE'))).toBe('es');
  });

  it('escapa todo lo que viene del cliente OAuth', () => {
    expect(escapeHtml('<script>"x"&\'')).toBe('&#60;script&#62;&#34;x&#34;&#38;&#39;');
    const html = consentFormBody({
      t: getDictionary('en').consent,
      lang: 'en',
      clientName: '<img src=x onerror=alert(1)>',
      clientDomain: 'evil.test"><script>',
      redirectHost: 'host"<b>',
      redirectIsLoopback: true,
      scopes: [{ value: 'portfolio:read', label: 'Read', required: true }],
      handle: 'h"x',
      siteKey: 'k',
      nonce: 'n0nce',
    });
    expect(html).not.toContain('<img');
    expect(html).not.toContain('<script>');
    expect(html).not.toContain('"<b>');
    expect(html).toContain('&#60;img src=x onerror=alert(1)&#62; wants to connect');
    expect(html).toContain('value="h&#34;x"');
  });

  it('solo ejecuta el script de Turnstile con el nonce de la respuesta', () => {
    const nonce = createNonce();
    expect(nonce).toMatch(/^[A-Za-z0-9+/]{22}==$/);
    expect(createNonce()).not.toBe(nonce);
    const policy = consentPagePolicy(nonce);
    expect(policy).toContain(`script-src 'nonce-${nonce}' 'strict-dynamic'`);
    expect(policy).toContain("frame-ancestors 'none'");
    const html = consentFormBody({
      t: getDictionary('es').consent,
      lang: 'es',
      clientName: 'Agente',
      redirectHost: 'localhost',
      redirectIsLoopback: false,
      scopes: [],
      handle: 'h',
      siteKey: 'k',
      nonce,
    });
    expect(html).toContain(`<script nonce="${nonce}" src="https://challenges.cloudflare.com/turnstile/v0/api.js"`);
  });

  it('lleva las cabeceras de seguridad del dominio, sin Cross-Origin-Opener-Policy', () => {
    const headers = consentPageHeaders('n0nce');
    for (const [name, value] of Object.entries(COMMON_SECURITY_HEADERS)) expect(headers[name]).toBe(value);
    expect(headers['Content-Security-Policy']).toBe(consentPagePolicy('n0nce'));
    expect(headers['Cache-Control']).toBe('no-store');
    // Con COOP, el cliente que abre la autorización en una ventana emergente la perdería
    expect(headers['Cross-Origin-Opener-Policy']).toBeUndefined();
  });
});
