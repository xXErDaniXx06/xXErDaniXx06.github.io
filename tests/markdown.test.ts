import { describe, expect, it } from 'vitest';
import { renderLlmsFullTxt, renderLlmsTxt, renderRootMarkdown } from '../src/agent/llms';
import { renderPageMarkdown } from '../src/agent/markdown';
import { PAGE_IDS } from '../src/data/pages';
import { LANGS } from '../src/i18n';

const ORIGIN = 'https://example.test';

describe('versiones Markdown', () => {
  it.each(LANGS.flatMap((lang) => PAGE_IDS.map((page) => [lang, page] as const)))(
    '%s/%s: metadatos, navegación y otros idiomas',
    (lang, page) => {
      const md = renderPageMarkdown(lang, page, ORIGIN);
      expect(md).toMatch(/^---\ntitle: ".+"\ndescription: ".+"\nlang: (es|en|fr)\nurl: https:\/\/example\.test\//);
      expect(md).not.toContain('undefined');
      for (const other of PAGE_IDS) expect(md).toContain(`${ORIGIN}/${lang}/${other}.md`);
      for (const other of LANGS.filter((l) => l !== lang)) expect(md).toContain(`${ORIGIN}/${other}/${page}.md`);
      expect(md.endsWith('\n')).toBe(true);
    },
  );

  it('llms.txt enumera todas las páginas con su descripción', () => {
    const txt = renderLlmsTxt(ORIGIN);
    for (const lang of LANGS) for (const page of PAGE_IDS) expect(txt).toContain(`${ORIGIN}/${lang}/${page}.md): `);
    expect(txt).not.toContain('undefined');
  });

  it('llms-full.txt contiene las quince páginas', () => {
    expect(renderLlmsFullTxt(ORIGIN).match(/<!-- https:\/\/example\.test\/(es|en|fr)\//g)).toHaveLength(15);
  });

  it('la raíz declara su versión canónica y los recursos para agentes', () => {
    const md = renderRootMarkdown(ORIGIN);
    expect(md).toContain(`canonical: ${ORIGIN}/es/`);
    expect(md).toContain(`${ORIGIN}/.well-known/mcp/server-card.json`);
    expect(md).toContain(`${ORIGIN}/llms.txt`);
  });
});
