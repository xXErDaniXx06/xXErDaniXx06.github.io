import { describe, expect, it } from 'vitest';
import { apiIndex } from '../src/agent/api-index';
import { API_PATHS, PORTFOLIO_RESOURCES } from '../src/agent/api-resources';
import { renderSecurityTxt, SECURITY_TXT_PATH } from '../src/agent/security-txt';
import { CONTACT } from '../src/data/profile';
import { LANGS } from '../src/i18n';

const ORIGIN = 'https://example.test';
const DAY = 24 * 60 * 60 * 1000;

describe('índice de la API', () => {
  const index = apiIndex(ORIGIN);

  it('enlaza la descripción OpenAPI, la documentación y el estado', () => {
    expect(index.openapi).toBe(`${ORIGIN}${API_PATHS.openapi}`);
    expect(index.documentation).toBe(`${ORIGIN}${API_PATHS.docs}`);
    expect(index.status).toBe(`${ORIGIN}${API_PATHS.status}`);
    expect(index.contact_form).toMatchObject({ method: 'POST', url: `${ORIGIN}${API_PATHS.contact}` });
  });

  it('enumera cada recurso en cada idioma', () => {
    expect(index.resources.map((r) => r.name)).toEqual([...PORTFOLIO_RESOURCES]);
    for (const resource of index.resources) {
      expect(resource.description).not.toBe('');
      expect(resource.urls).toEqual(
        Object.fromEntries(LANGS.map((lang) => [lang, `${ORIGIN}/api/v1/${lang}/${resource.name}.json`])),
      );
    }
  });
});

describe('security.txt (RFC 9116)', () => {
  const now = new Date('2026-10-21T12:00:00.000Z');
  const txt = renderSecurityTxt(ORIGIN, now);
  const fields = txt
    .trim()
    .split('\n')
    .map((line) => line.split(': ') as [string, string]);

  it('tiene los campos obligatorios y solo campos del RFC', () => {
    for (const [name] of fields) {
      expect(['Contact', 'Expires', 'Preferred-Languages', 'Canonical']).toContain(name);
    }
    expect(fields.filter(([name]) => name === 'Expires')).toHaveLength(1);
    expect(fields.find(([name]) => name === 'Contact')?.[1]).toBe(`mailto:${CONTACT.personalEmail}`);
    expect(txt).toContain(`Canonical: ${ORIGIN}${SECURITY_TXT_PATH}\n`);
    expect(txt.endsWith('\n')).toBe(true);
  });

  it('caduca antes de un año, en formato de RFC 3339', () => {
    const expires = fields.find(([name]) => name === 'Expires')?.[1] ?? '';
    expect(expires).toMatch(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}Z$/);
    const days = (Date.parse(expires) - now.getTime()) / DAY;
    expect(days).toBeGreaterThan(300);
    expect(days).toBeLessThan(365);
  });
});
