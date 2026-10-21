// Negociación de contenido: Markdown para los agentes que lo piden (Accept: text/markdown).

import { isLang } from '../../src/i18n/langs';

/** ¿Prefiere el cliente Markdown a HTML? (Accept: text/markdown, con pesos q). */
export function prefersMarkdown(request: Request): boolean {
  const accept = request.headers.get('Accept') ?? '';
  let markdown = 0;
  let html = 0;
  for (const part of accept.split(',')) {
    const [type = '', ...params] = part.trim().toLowerCase().split(';');
    const qParam = params.map((p) => p.trim()).find((p) => p.startsWith('q='));
    const q = qParam ? Number.parseFloat(qParam.slice(2)) || 0 : 1;
    const mediaType = type.trim();
    if (mediaType === 'text/markdown') markdown = Math.max(markdown, q);
    if (mediaType === 'text/html' || mediaType === 'application/xhtml+xml') html = Math.max(html, q);
  }
  return markdown > 0 && markdown >= html;
}

/** Ruta del Markdown equivalente a una ruta HTML, o null si no es una página. */
export function markdownPathFor(pathname: string): string | null {
  const path = pathname
    .replace(/\/index\.html$/, '/')
    .replace(/\.html$/, '')
    .replace(/\/+$/, '');
  if (path === '') return '/index.md';
  const [lang, page, ...rest] = path.split('/').filter(Boolean);
  if (!isLang(lang) || rest.length > 0) return null;
  return `/${lang}/${page ?? 'index'}.md`;
}
