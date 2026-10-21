import type { Lang } from '../i18n/langs';

/**
 * Páginas de la web, en orden de navegación. El id es también la ruta de la página
 * (salvo `index`, que es la portada) y el nombre de su versión Markdown. Las
 * herramientas MCP y WebMCP lo aceptan como parámetro, así que no debe cambiar.
 * Una página nueva se añade aquí y aparece en la navegación, el Markdown, el sitemap,
 * llms.txt, la API y los recursos MCP.
 */
export const PAGE_IDS = ['index', 'proyectos', 'habilidades', 'logros', 'contacto'] as const;

export type PageId = (typeof PAGE_IDS)[number];

export const isPageId = (value: unknown): value is PageId => PAGE_IDS.includes(value as PageId);

/** Ruta de la página HTML: `/es/` o `/es/proyectos`. */
export const pageHref = (lang: Lang, page: PageId): string => (page === 'index' ? `/${lang}/` : `/${lang}/${page}`);

/** Ruta de la versión Markdown: `/es/index.md` o `/es/proyectos.md`. */
export const markdownHref = (lang: Lang, page: PageId): string => `/${lang}/${page}.md`;
