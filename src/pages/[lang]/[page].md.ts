import type { APIRoute, GetStaticPaths } from 'astro';
import { siteOrigin, textResponse } from '../../agent/site.js';
import { LANGS, PAGES, renderPageMarkdown } from '../../agent/content.js';

// Versión Markdown de cada página: /es/index.md, /es/proyectos.md, …
// El Worker la sirve también en la URL HTML cuando llega Accept: text/markdown.
export const getStaticPaths: GetStaticPaths = () =>
  LANGS.flatMap((lang) => PAGES.map((page) => ({ params: { lang, page: page.slug || 'index' } })));

export const GET: APIRoute = ({ params }) => {
  const page = PAGES.find((p) => (p.slug || 'index') === params.page)!;
  return textResponse(renderPageMarkdown(params.lang!, page.id, siteOrigin()), 'text/markdown; charset=utf-8');
};
