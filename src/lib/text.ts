// Conversión de los textos con HTML en línea (<strong>, <em>, <a href>) de src/i18n/
// a texto plano y a Markdown, para las versiones de la web para agentes.

const ENTITIES: Record<string, string> = {
  '&amp;': '&',
  '&lt;': '<',
  '&gt;': '>',
  '&quot;': '"',
  '&#39;': "'",
  '&nbsp;': ' ',
};

const decodeEntities = (text: string): string =>
  text.replace(/&(amp|lt|gt|quot|#39|nbsp);/g, (entity) => ENTITIES[entity] ?? entity);

/** Quita las etiquetas HTML. */
export const toPlainText = (html: string): string => decodeEntities(html.replace(/<[^>]+>/g, ''));

/** Convierte el HTML en línea a Markdown. */
export const toMarkdown = (html: string): string =>
  decodeEntities(
    html
      .replace(/<strong[^>]*>([\s\S]*?)<\/strong>/g, '**$1**')
      .replace(/<em[^>]*>([\s\S]*?)<\/em>/g, '*$1*')
      .replace(/<a\b[^>]*href="([^"]+)"[^>]*>([\s\S]*?)<\/a>/g, '[$2]($1)')
      .replace(/<[^>]+>/g, ''),
  );

/** Estimación de tokens para la cabecera `x-markdown-tokens` (unos 4 caracteres por token). */
export const estimateTokens = (text: string): number => Math.ceil(text.length / 4);

/** URL absoluta de una ruta del sitio. */
export const absoluteUrl = (origin: string, path: string): string => new URL(path, origin).href;
