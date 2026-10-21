import { describe, expect, it } from 'vitest';
import { API_LINKS, DISCOVERY_LINKS, SECURITY_HEADERS } from '../http/headers';
import { serveDiscoveryDocument } from '../site/discovery-documents';
import { serveSecurityTxt } from '../site/security-txt';
import { serveStaticSite } from '../site/static-site';
import { serveStatus } from '../site/status';
import { memoryAssets } from './fakes';

const ORIGIN = 'https://example.test';
const assets = memoryAssets({
  // Como el servidor de ficheros de Cloudflare: text/html sin charset
  '/es/proyectos': { body: '<!doctype html><title>Proyectos</title>', type: 'text/html' },
  '/es/logros': {
    body: `<!doctype html><meta http-equiv="content-security-policy" content="default-src 'self'; script-src 'self' 'sha256-abc=' 'strict-dynamic';"><title>Logros</title>`,
    type: 'text/html; charset=utf-8',
  },
  '/es/proyectos.md': { body: '# Proyectos\n', type: 'text/plain' },
  '/_astro/app.abc123.js': { body: 'console.log(1)', type: 'text/javascript' },
  '/api/v1/es/projects.json': { body: '{}', type: 'application/octet-stream' },
  '/api/v1/index.json': { body: '{"name":"API"}', type: 'application/json' },
  '/.well-known/ai-catalog.json': { body: '{"specVersion":"1.0"}', type: 'application/json' },
  '/.well-known/mcp/server-card.json': { body: '{"name":"x"}', type: 'application/json' },
});
const get = (path: string, headers: Record<string, string> = {}) => new Request(`${ORIGIN}${path}`, { headers });

describe('web estática', () => {
  it('las páginas llevan cabeceras de seguridad y de descubrimiento', async () => {
    const response = await serveStaticSite(get('/es/proyectos'), assets);
    for (const [name, value] of Object.entries(SECURITY_HEADERS)) expect(response.headers.get(name)).toBe(value);
    expect(await response.text()).toBe('<!doctype html><title>Proyectos</title>');
    expect(response.headers.get('Link')).toBe(DISCOVERY_LINKS.join(', '));
    expect(response.headers.get('Vary')).toBe('Accept');
    expect(response.headers.get('Content-Type')).toBe('text/html; charset=utf-8');
  });

  it('la política de la página viaja también en la cabecera, con frame-ancestors', async () => {
    const response = await serveStaticSite(get('/es/logros'), assets);
    expect(response.headers.get('Content-Security-Policy')).toBe(
      "default-src 'self'; script-src 'self' 'sha256-abc=' 'strict-dynamic'; frame-ancestors 'none'",
    );
    expect(await response.text()).toContain('<title>Logros</title>');
  });

  it('HEAD lleva las mismas cabeceras que GET, también la política de la página', async () => {
    const head = await serveStaticSite(new Request(`${ORIGIN}/es/logros`, { method: 'HEAD' }), assets);
    const page = await serveStaticSite(get('/es/logros'), assets);
    expect(head.status).toBe(200);
    expect(await head.text()).toBe('');
    for (const name of ['Content-Security-Policy', 'Content-Type', 'ETag', 'Link', 'Vary']) {
      expect(head.headers.get(name)).toBe(page.headers.get(name));
    }
  });

  it('un 304 no sustituye la política guardada de la página por la mínima', async () => {
    const etag = (await serveStaticSite(get('/es/logros'), assets)).headers.get('ETag') ?? '';
    const response = await serveStaticSite(get('/es/logros', { 'If-None-Match': etag }), assets);
    expect(response.status).toBe(304);
    expect(response.headers.get('Content-Security-Policy')).toBeNull();
    expect(response.headers.get('Vary')).toBe('Accept');
  });

  it('sirve Markdown a quien lo pide', async () => {
    const response = await serveStaticSite(get('/es/proyectos', { Accept: 'text/markdown' }), assets);
    expect(response.headers.get('Content-Type')).toBe('text/markdown; charset=utf-8');
    expect(response.headers.get('Content-Location')).toBe('/es/proyectos.md');
    expect(response.headers.get('x-markdown-tokens')).toBe('3');
    expect(response.headers.get('Access-Control-Allow-Origin')).toBe('*');
    expect(response.headers.get('Link')).toContain('</es/proyectos>; rel="alternate"; type="text/html"');
    expect(await response.text()).toBe('# Proyectos\n');
  });

  it('el Markdown negociado tiene ETag y responde 304 si no ha cambiado', async () => {
    const markdown = { Accept: 'text/markdown' };
    const etag = (await serveStaticSite(get('/es/proyectos', markdown), assets)).headers.get('ETag') ?? '';
    expect(etag).not.toBe('');
    const response = await serveStaticSite(get('/es/proyectos', { ...markdown, 'If-None-Match': etag }), assets);
    expect(response.status).toBe(304);
    expect(response.headers.get('Content-Location')).toBe('/es/proyectos.md');
    expect(response.headers.get('Vary')).toBe('Accept');
  });

  it('si no hay versión Markdown devuelve el HTML', async () => {
    const response = await serveStaticSite(get('/es/nada', { Accept: 'text/markdown' }), assets);
    expect(response.status).toBe(404);
    expect(response.headers.get('Content-Type')).toContain('text/html');
  });

  it('los ficheros con huella se guardan en caché para siempre', async () => {
    const response = await serveStaticSite(get('/_astro/app.abc123.js'), assets);
    expect(response.headers.get('Cache-Control')).toBe('public, max-age=31536000, immutable');
    expect(response.headers.get('X-Content-Type-Options')).toBe('nosniff');
  });

  it('los datos para agentes tienen su tipo y CORS', async () => {
    const response = await serveStaticSite(get('/api/v1/es/projects.json'), assets);
    expect(response.headers.get('Content-Type')).toBe('application/json; charset=utf-8');
    expect(response.headers.get('Access-Control-Allow-Origin')).toBe('*');
  });

  it('la URL base de la API sirve su índice, con la descripción y la documentación enlazadas', async () => {
    const response = await serveStaticSite(get('/api/v1/'), assets);
    expect(await response.json()).toEqual({ name: 'API' });
    expect(response.headers.get('Content-Type')).toBe('application/json; charset=utf-8');
    expect(response.headers.get('Access-Control-Allow-Origin')).toBe('*');
    expect(response.headers.get('Link')).toBe(API_LINKS.join(', '));
  });

  it('la URL base de la API sin barra final redirige a la canónica', async () => {
    const response = await serveStaticSite(get('/api/v1?x=1'), assets);
    expect(response.status).toBe(308);
    expect(response.headers.get('Location')).toBe(`${ORIGIN}/api/v1/?x=1`);
  });

  it('solo admite GET y HEAD', async () => {
    const response = await serveStaticSite(new Request(`${ORIGIN}/es/`, { method: 'POST' }), assets);
    expect(response.status).toBe(405);
  });

  it('security.txt como texto plano, generado en cada petición', async () => {
    const response = serveSecurityTxt(get('/.well-known/security.txt'), ORIGIN);
    expect(response.headers.get('Content-Type')).toBe('text/plain; charset=utf-8');
    expect(await response.text()).toContain(`Canonical: ${ORIGIN}/.well-known/security.txt`);
    const head = serveSecurityTxt(new Request(`${ORIGIN}/.well-known/security.txt`, { method: 'HEAD' }), ORIGIN);
    expect(await head.text()).toBe('');
  });

  it('estado del servicio', async () => {
    const response = serveStatus();
    expect(await response.json()).toMatchObject({ status: 'ok', services: { site: 'ok', api: 'ok', mcp: 'ok' } });
    expect(response.headers.get('Cache-Control')).toBe('no-store');
  });
});

describe('documentos de descubrimiento', () => {
  it('catálogo de IA con su tipo, CORS y ETag', async () => {
    const response = await serveDiscoveryDocument(get('/.well-known/ai-catalog.json'), assets);
    expect(response.headers.get('Content-Type')).toBe('application/ai-catalog+json');
    expect(response.headers.get('Access-Control-Allow-Origin')).toBe('*');
    const etag = response.headers.get('ETag');
    expect(etag).toMatch(/^"[0-9a-f]{32}"$/);
    const cached = await serveDiscoveryDocument(
      get('/.well-known/ai-catalog.json', { 'If-None-Match': etag ?? '' }),
      assets,
    );
    expect(cached.status).toBe(304);
  });

  it('Server Card MCP en sus dos ubicaciones', async () => {
    const card = await serveDiscoveryDocument(get('/mcp/server-card'), assets);
    expect(card.headers.get('Content-Type')).toBe('application/mcp-server-card+json');
    expect(await card.json()).toEqual({ name: 'x' });
    const legacy = await serveDiscoveryDocument(get('/.well-known/mcp/server-card.json'), assets);
    expect(legacy.headers.get('Content-Type')).toBe('application/json');
  });

  it('responde a la comprobación previa de CORS y rechaza otros métodos', async () => {
    const options = await serveDiscoveryDocument(
      new Request(`${ORIGIN}/mcp/server-card`, { method: 'OPTIONS' }),
      assets,
    );
    expect(options.status).toBe(204);
    const post = await serveDiscoveryDocument(new Request(`${ORIGIN}/mcp/server-card`, { method: 'POST' }), assets);
    expect(post.status).toBe(405);
  });
});

describe('caché de imágenes e iconos', () => {
  const media = memoryAssets({
    '/images/profile.jpg': { body: 'jpg', type: 'image/jpeg' },
    '/favicon.svg': { body: '<svg/>', type: 'image/svg+xml' },
    '/docs/CV_Daniel.pdf': { body: '%PDF', type: 'application/pdf' },
  });

  it.each(['/images/profile.jpg', '/favicon.svg'])('%s se guarda un día', async (path) => {
    const response = await serveStaticSite(get(path), media);
    expect(response.headers.get('Cache-Control')).toBe('public, max-age=86400, stale-while-revalidate=604800');
  });

  it('el CV se revalida siempre (puede cambiar)', async () => {
    const response = await serveStaticSite(get('/docs/CV_Daniel.pdf'), media);
    expect(response.headers.get('Cache-Control')).toBe('public, max-age=0');
  });
});
