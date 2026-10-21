import { en } from './en';
import { es } from './es';
import { fr } from './fr';
import type { Lang } from './langs';
import type { Dictionary } from './types';

export * from './langs';
export type * from './types';

const DICTIONARIES: Record<Lang, Dictionary> = { es, en, fr };

/** Textos de un idioma. */
export const getDictionary = (lang: Lang): Dictionary => DICTIONARIES[lang];

/** Sustituye los marcadores `{nombre}` de un texto. */
export const fillTemplate = (template: string, values: Record<string, string>): string =>
  template.replace(/\{(\w+)\}/g, (match, key: string) => values[key] ?? match);
