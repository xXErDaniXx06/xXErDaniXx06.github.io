import type { APIRoute } from 'astro';
import { siteOrigin, textResponse } from '../agent/endpoint';
import { PAGE_IDS, pageHref } from '../data/pages';
import { DEFAULT_LANG, LANGS } from '../i18n';

// Sitemap (sitemaps.org) con todas las páginas y sus alternativas de idioma.
export const GET: APIRoute = () => {
  const origin = siteOrigin();
  const urls = PAGE_IDS.flatMap((page) =>
    LANGS.map((lang) => {
      const alternates = [
        ...LANGS.map((l) => `    <xhtml:link rel="alternate" hreflang="${l}" href="${origin}${pageHref(l, page)}"/>`),
        `    <xhtml:link rel="alternate" hreflang="x-default" href="${origin}${pageHref(DEFAULT_LANG, page)}"/>`,
      ];
      return [
        '  <url>',
        `    <loc>${origin}${pageHref(lang, page)}</loc>`,
        ...alternates,
        `    <priority>${page === 'index' ? '1.0' : '0.8'}</priority>`,
        '  </url>',
      ].join('\n');
    }),
  );
  const body = [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">',
    ...urls,
    '</urlset>',
    '',
  ].join('\n');
  return textResponse(body, 'application/xml; charset=utf-8');
};
