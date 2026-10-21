// OAuth 2.1 de principio a fin: registro dinámico, consentimiento (Turnstile de prueba),
// token con PKCE y llamadas al servidor MCP, incluido el permiso adicional para enviar mensajes.
import { createHash, randomBytes } from 'node:crypto';
import { describe, expect, it } from 'vitest';
import { BASE } from './base';

const b64url = (buffer: Buffer) => buffer.toString('base64url');
const REDIRECT = 'http://localhost:9999/callback';

interface Metadata {
  issuer: string;
  registration_endpoint: string;
  authorization_endpoint: string;
  token_endpoint: string;
}

async function authorize(scope: string): Promise<string> {
  const meta = (await (await fetch(`${BASE}/.well-known/oauth-authorization-server`)).json()) as Metadata;
  const registration = await fetch(meta.registration_endpoint, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      client_name: 'E2E agent',
      redirect_uris: [REDIRECT],
      token_endpoint_auth_method: 'none',
      grant_types: ['authorization_code', 'refresh_token'],
      response_types: ['code'],
    }),
  });
  expect(registration.status).toBe(201);
  const { client_id } = (await registration.json()) as { client_id: string };

  const verifier = b64url(randomBytes(32));
  const url = new URL(meta.authorization_endpoint);
  for (const [key, value] of Object.entries({
    response_type: 'code',
    client_id,
    redirect_uri: REDIRECT,
    code_challenge: b64url(createHash('sha256').update(verifier).digest()),
    code_challenge_method: 'S256',
    state: 'e2e',
    scope,
    resource: BASE,
  })) {
    url.searchParams.set(key, value);
  }

  const page = await fetch(url, { headers: { 'Accept-Language': 'en' } });
  const html = await page.text();
  expect(page.status).toBe(200);
  expect(html).toContain('E2E agent wants to connect');
  const handle = /name="handle" value="([^"]+)"/.exec(html)?.[1] ?? '';
  const cookies = page.headers
    .getSetCookie()
    .map((c) => c.split(';')[0])
    .join('; ');
  const form = new URLSearchParams({ handle, decision: 'approve', 'cf-turnstile-response': 'XXXX.DUMMY.TOKEN.XXXX' });
  for (const extra of scope.split(' ').filter((s) => s !== 'portfolio:read')) form.append('scope', extra);
  const approved = await fetch(url, {
    method: 'POST',
    redirect: 'manual',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded', Cookie: cookies },
    body: form,
  });
  expect(approved.status).toBe(302);
  const code = new URL(approved.headers.get('location') ?? '').searchParams.get('code') ?? '';

  const token = await fetch(meta.token_endpoint, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      grant_type: 'authorization_code',
      code,
      redirect_uri: REDIRECT,
      client_id,
      code_verifier: verifier,
      resource: BASE,
    }),
  });
  expect(token.status).toBe(200);
  return ((await token.json()) as { access_token: string }).access_token;
}

async function rpc(token: string, method: string, params: Record<string, unknown> = {}) {
  const response = await fetch(`${BASE}/mcp`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json, text/event-stream',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ jsonrpc: '2.0', id: 1, method, params }),
  });
  const text = await response.text();
  return {
    status: response.status,
    challenge: response.headers.get('www-authenticate'),
    body: text ? JSON.parse(text) : null,
  };
}

describe('OAuth y MCP', () => {
  it('sin token, /mcp responde 401 con los metadatos del recurso', async () => {
    const response = await fetch(`${BASE}/mcp`, { method: 'POST', body: '{}' });
    expect(response.status).toBe(401);
    expect(response.headers.get('www-authenticate')).toContain(
      `resource_metadata="${BASE}/.well-known/oauth-protected-resource/mcp"`,
    );
  });

  it('la página de autorización lleva las cabeceras de seguridad del dominio, sin COOP', async () => {
    const response = await fetch(`${BASE}/authorize`);
    expect(response.headers.get('content-type')).toBe('text/html; charset=utf-8');
    expect(response.headers.get('strict-transport-security')).toBe('max-age=63072000; includeSubDomains');
    expect(response.headers.get('cross-origin-resource-policy')).toBe('same-origin');
    expect(response.headers.get('cross-origin-opener-policy')).toBeNull();
  });

  it('con portfolio:read se leen datos, pero enviar mensajes exige contact:send', async () => {
    const token = await authorize('portfolio:read');
    const tools = await rpc(token, 'tools/list');
    expect(tools.body.result.tools).toHaveLength(8);
    const profile = await rpc(token, 'tools/call', { name: 'get_profile', arguments: { lang: 'en' } });
    expect(JSON.parse(profile.body.result.content[0].text)).toMatchObject({ name: 'Daniel Carrasco García' });
    const send = await rpc(token, 'tools/call', {
      name: 'send_contact_message',
      arguments: { name: 'E2E', email: 'e2e@example.com', subject: 'Test', message: 'Test' },
    });
    expect(send.status).toBe(403);
    expect(send.challenge).toContain('error="insufficient_scope"');
  });

  it('con contact:send la herramienta de mensajes responde', async () => {
    const token = await authorize('portfolio:read contact:send');
    const send = await rpc(token, 'tools/call', {
      name: 'send_contact_message',
      arguments: { name: 'E2E', email: 'e2e@example.com', subject: 'Test', message: 'Test' },
    });
    expect(send.status).toBe(200);
    // En local no hay clave de EmailJS: el servidor lo explica en vez de enviar.
    expect(send.body.result.content[0].text).toMatch(/not configured|Message sent/);
  });
});
