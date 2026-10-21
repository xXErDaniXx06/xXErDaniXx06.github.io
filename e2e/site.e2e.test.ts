import { describe, expect, it } from 'vitest';
import { BASE, get } from './base';

const PAGES = ['/', '/es/', '/es/proyectos', '/es/habilidades', '/es/logros', '/es/contacto', '/en/', '/fr/contacto'];

describe('web', () => {
  it.each(PAGES)('%s responde con cabeceras de seguridad y de descubrimiento', async (path) => {
    const response = await get(path);
    expect(response.status).toBe(200);
    expect(response.headers.get('content-type')).toBe('text/html; charset=utf-8');
    const policy = response.headers.get('content-security-policy') ?? '';
    expect(policy).toContain("frame-ancestors 'none'");
    expect(policy).toContain("'strict-dynamic'");
    expect(policy).toContain("require-trusted-types-for 'script'");
    expect(response.headers.get('strict-transport-security')).toContain('max-age=');
    expect(response.headers.get('link')).toContain('rel="api-catalog"');
    const html = await response.text();
    expect(html).toContain('<meta http-equiv="content-security-policy"');
    expect(html).toMatch(/<html lang="(es|en|fr)">/);
    // Cada script externo lleva integrity y su hash está en la política
    for (const [, integrity] of html.matchAll(/<script[^>]* src="\/_astro\/[^"]+"[^>]* integrity="([^"]+)"/g)) {
      expect(policy).toContain(`'${integrity}'`);
    }
  });

  it('HEAD lleva la misma política que GET', async () => {
    const head = await fetch(`${BASE}/es/logros`, { method: 'HEAD' });
    const page = await get('/es/logros');
    expect(head.headers.get('content-security-policy')).toBe(page.headers.get('content-security-policy'));
    expect(head.headers.get('etag')).toBe(page.headers.get('etag'));
  });

  it('una página sin cambios responde 304 sin sustituir su política', async () => {
    const etag = (await get('/es/')).headers.get('etag') ?? '';
    expect(etag).not.toBe('');
    const response = await get('/es/', { 'If-None-Match': etag });
    expect(response.status).toBe(304);
    expect(response.headers.get('content-security-policy')).toBeNull();
  });

  it('la URL base de la API devuelve su índice', async () => {
    const response = await get('/api/v1/');
    expect(response.headers.get('content-type')).toBe('application/json; charset=utf-8');
    expect(response.headers.get('link')).toContain('rel="service-desc"');
    const index = (await response.json()) as { resources: { urls: Record<string, string> }[] };
    for (const url of index.resources.flatMap((resource) => Object.values(resource.urls))) {
      expect((await get(new URL(url).pathname)).status).toBe(200);
    }
    const redirect = await get('/api/v1');
    expect(redirect.status).toBe(308);
    expect(redirect.headers.get('location')).toBe(`${BASE}/api/v1/`);
  });

  it('security.txt (RFC 9116) con contacto y caducidad futura', async () => {
    const response = await get('/.well-known/security.txt');
    expect(response.headers.get('content-type')).toBe('text/plain; charset=utf-8');
    const text = await response.text();
    expect(text).toMatch(/^Contact: mailto:/m);
    const expires = Date.parse(/^Expires: (.+)$/m.exec(text)?.[1] ?? '');
    expect(expires).toBeGreaterThan(Date.now());
  });

  it('las rutas con barra final redirigen a la canónica', async () => {
    const response = await get('/es/proyectos/');
    expect([301, 307, 308]).toContain(response.status);
    expect(new URL(response.headers.get('location') ?? '', BASE).pathname).toBe('/es/proyectos');
  });

  it.each([
    ['/es/no-existe', 'es'],
    ['/en/missing', 'en'],
    ['/fr/manquant', 'fr'],
    ['/no-existe', 'es'],
  ])('%s devuelve la página 404 en su idioma', async (path, lang) => {
    const response = await get(path);
    expect(response.status).toBe(404);
    expect(await response.text()).toContain(`<html lang="${lang}">`);
  });

  it('negocia Markdown', async () => {
    const response = await get('/en/logros', { Accept: 'text/markdown' });
    expect(response.headers.get('content-type')).toBe('text/markdown; charset=utf-8');
    expect(Number(response.headers.get('x-markdown-tokens'))).toBeGreaterThan(0);
    expect(await response.text()).toMatch(/^---\ntitle: "Achievements \| Daniel Carrasco García"/);
  });

  it.each([
    ['/robots.txt', 'text/plain'],
    ['/sitemap.xml', 'application/xml'],
    ['/llms.txt', 'text/plain'],
    ['/api/v1/es/portfolio.json', 'application/json'],
    ['/api/v1/openapi.json', 'application/json'],
    ['/.well-known/api-catalog', 'application/linkset+json'],
    ['/.well-known/ai-catalog.json', 'application/ai-catalog+json'],
    ['/mcp/server-card', 'application/mcp-server-card+json'],
    ['/.well-known/agent-skills/index.json', 'application/json'],
    ['/images/MST_Imagen.jpg', 'image/jpeg'],
  ])('%s se publica como %s', async (path, type) => {
    const response = await get(path);
    expect(response.status).toBe(200);
    expect(response.headers.get('content-type')).toContain(type);
  });

  it('robots.txt solo usa directivas estándar y señales de contenido', async () => {
    const lines = (await (await get('/robots.txt')).text()).split('\n').filter((l) => l && !l.startsWith('#'));
    for (const line of lines) expect(line).toMatch(/^(User-agent|Allow|Disallow|Content-Signal|Sitemap): /);
  });
});
