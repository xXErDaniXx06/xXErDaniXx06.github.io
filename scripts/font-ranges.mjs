// Caracteres que incluye la fuente de la web (scripts/subset-font.mjs) y que declara su
// @font-face (astro.config.mjs). Cubre todo el contenido en español, inglés y francés.

/** @type {readonly (readonly [number, number])[]} */
export const UNICODE_RANGES = [
  [0x20, 0x7e], // ASCII
  [0xa0, 0xff], // Latin-1: acentos del español y del francés, ¿ ¡ « » ° ·
  [0x152, 0x153], // Œ œ
  [0x2010, 0x2027], // guiones, comillas tipográficas, …
  [0x2030, 0x203a], // ‰ ‹ ›
  [0x20ac, 0x20ac], // €
  [0x2122, 0x2122], // ™
  [0x2190, 0x2193], // flechas
  [0x2212, 0x2212], // signo menos
];

const hex = (code) => code.toString(16).toUpperCase().padStart(4, '0');

/** Valor de la propiedad unicode-range de @font-face. */
export const unicodeRange = () =>
  UNICODE_RANGES.map(([from, to]) => (from === to ? `U+${hex(from)}` : `U+${hex(from)}-${hex(to)}`)).join(',');

/** Todos los caracteres del subconjunto. */
export const characters = () =>
  UNICODE_RANGES.flatMap(([from, to]) =>
    Array.from({ length: to - from + 1 }, (_, i) => String.fromCodePoint(from + i)),
  ).join('');
