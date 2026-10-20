import type { APIRoute } from 'astro';
import { siteOrigin, textResponse } from '../agent/site.js';
import { LANGS, DEFAULT_LANG, PAGES, pageHref } from '../data/profile.js';

// Sitemap (sitemaps.org) con las 15 páginas y sus alternativas de idioma.
export const GET: APIRoute = () => {
  const origin = siteOrigin();
  const urls = PAGES.flatMap((page) =>
    LANGS.map((lang) => {
      const alternates = [
        ...LANGS.map((l) => `    <xhtml:link rel="alternate" hreflang="${l}" href="${origin}${pageHref(l, page.slug)}"/>`),
        `    <xhtml:link rel="alternate" hreflang="x-default" href="${origin}${pageHref(DEFAULT_LANG, page.slug)}"/>`,
      ];
      return [
        '  <url>',
        `    <loc>${origin}${pageHref(lang, page.slug)}</loc>`,
        ...alternates,
        `    <priority>${page.slug ? '0.8' : '1.0'}</priority>`,
        '  </url>',
      ].join('\n');
    })
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
