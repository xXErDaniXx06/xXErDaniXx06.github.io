/** Idiomas de la web. El primero es el idioma por defecto (el de la raíz `/`). */
export const LANGS = ['es', 'en', 'fr'] as const;

export type Lang = (typeof LANGS)[number];

export const DEFAULT_LANG: Lang = 'es';

export const isLang = (value: unknown): value is Lang => LANGS.includes(value as Lang);
