import type { APIRoute, GetStaticPaths } from 'astro';
import { markdownResponse, siteOrigin } from '../../agent/endpoint';
import { renderPageMarkdown } from '../../agent/markdown';
import { PAGE_IDS, type PageId } from '../../data/pages';
import { LANGS, type Lang } from '../../i18n';

// Versión Markdown de cada página: /es/index.md, /es/proyectos.md, …
// El Worker la sirve también en la URL HTML cuando llega Accept: text/markdown.
export const getStaticPaths = (() =>
  LANGS.flatMap((lang) => PAGE_IDS.map((page) => ({ params: { lang, page } })))) satisfies GetStaticPaths;

export const GET: APIRoute = ({ params }) =>
  markdownResponse(renderPageMarkdown(params.lang as Lang, params.page as PageId, siteOrigin()));
