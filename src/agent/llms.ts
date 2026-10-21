// Índices para agentes: /llms.txt (llmstxt.org), /llms-full.txt y la versión Markdown
// de la raíz (/index.md).

import { markdownHref, PAGE_IDS, pageHref } from '../data/pages';
import { CONTACT, PERSON_NAME } from '../data/profile';
import { DEFAULT_LANG, getDictionary, LANGS } from '../i18n';
import { absoluteUrl } from '../lib/text';
import { renderPageBody, renderPageFooter } from './markdown';

/** Recursos para agentes que se enumeran en llms.txt, la raíz y la documentación de la API. */
export const AGENT_RESOURCES = [
  {
    path: '/.well-known/mcp/server-card.json',
    name: 'MCP server',
    note: 'Remote MCP server (Streamable HTTP, OAuth 2.1) with read tools for this portfolio and a tool to send Daniel a message.',
  },
  {
    path: '/api/v1/openapi.json',
    name: 'Portfolio JSON API',
    note: 'OpenAPI 3.1 description of the read-only JSON API (profile, projects, skills, achievements, contact) in es, en and fr.',
  },
  {
    path: '/.well-known/agent-skills/index.json',
    name: 'Agent skills',
    note: 'Agent Skills discovery index with instructions for using this portfolio.',
  },
  {
    path: '/.well-known/ai-catalog.json',
    name: 'AI catalog',
    note: 'ARD catalog of every agent-facing resource on this site.',
  },
  { path: '/.well-known/api-catalog', name: 'API catalog', note: 'RFC 9727 API catalog (application/linkset+json).' },
  { path: '/auth.md', name: 'auth.md', note: 'How agents obtain OAuth access to the MCP server.' },
  { path: '/sitemap.xml', name: 'Sitemap', note: 'Every HTML page with its language alternates.' },
] as const;

export const SITE_SUMMARY =
  'Personal portfolio of Daniel Carrasco García, a Computer Engineering student at the University of Málaga (UMA) working across software, hardware (PCB design, embedded systems, RF and LoRa links) and aerospace technology (CubeSat, CanSat, stratospheric balloons). The site is available in Spanish (default), English and French.';

const resourceList = (origin: string): string[] =>
  AGENT_RESOURCES.map((r) => `- [${r.name}](${absoluteUrl(origin, r.path)}): ${r.note}`);

/** /llms.txt */
export function renderLlmsTxt(origin: string): string {
  const out = [`# ${PERSON_NAME}`, '', `> ${SITE_SUMMARY}`, ''];
  out.push(
    'Every HTML page has a Markdown version: request it with `Accept: text/markdown` or use the `.md` URLs below. The same content is available as JSON and through an MCP server.',
    '',
  );
  for (const lang of LANGS) {
    const t = getDictionary(lang);
    out.push(`## ${t.languageName}`, '');
    for (const page of PAGE_IDS) {
      out.push(
        `- [${t.nav.pages[page]}](${absoluteUrl(origin, markdownHref(lang, page))}): ${t.pages[page].description}`,
      );
    }
    out.push('');
  }
  out.push(`## ${getDictionary('en').markdown.agentResources}`, '', ...resourceList(origin));
  out.push('', '## Optional', '');
  out.push(
    `- [Full content](${absoluteUrl(origin, '/llms-full.txt')}): every page in all three languages in one file.`,
  );
  out.push(`- [CV (PDF)](${absoluteUrl(origin, CONTACT.cvPath)}): Daniel's full résumé.`);
  return out.join('\n') + '\n';
}

/** /llms-full.txt: todas las páginas en los tres idiomas. */
export function renderLlmsFullTxt(origin: string): string {
  const parts = [`# ${PERSON_NAME} — full portfolio content`, '', `> ${SITE_SUMMARY}`, ''];
  for (const lang of LANGS) {
    for (const page of PAGE_IDS) {
      parts.push('', `<!-- ${absoluteUrl(origin, pageHref(lang, page))} -->`, '');
      parts.push(...renderPageBody(lang, page, origin), '');
    }
  }
  return parts.join('\n') + '\n';
}

/**
 * Markdown de la raíz (/). La raíz muestra la portada en el idioma por defecto, así que
 * su versión Markdown es la de /es/ más un índice de recursos para agentes.
 */
export function renderRootMarkdown(origin: string): string {
  const t = getDictionary(DEFAULT_LANG);
  const front = [
    '---',
    `title: ${JSON.stringify(t.pages.index.title)}`,
    `description: ${JSON.stringify(SITE_SUMMARY)}`,
    `lang: ${DEFAULT_LANG}`,
    `url: ${absoluteUrl(origin, '/')}`,
    `canonical: ${absoluteUrl(origin, pageHref(DEFAULT_LANG, 'index'))}`,
    '---',
    '',
  ];
  const resources = [
    '',
    `## ${t.markdown.agentResources} · ${getDictionary('en').markdown.agentResources}`,
    '',
    ...resourceList(origin),
    `- [llms.txt](${absoluteUrl(origin, '/llms.txt')}): index of every page in es, en and fr.`,
  ];
  return (
    [
      ...front,
      ...renderPageBody(DEFAULT_LANG, 'index', origin),
      ...resources,
      ...renderPageFooter(DEFAULT_LANG, 'index', origin),
    ].join('\n') + '\n'
  );
}
