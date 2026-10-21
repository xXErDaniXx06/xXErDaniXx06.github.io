// Preferencias de visualización de la persona (menú de accesibilidad y herramienta WebMCP
// set_accessibility_options): tema, tamaño de texto, alto contraste y filtro de color.
// Este módulo no toca el DOM: define las opciones, cómo se guardan y cómo se reflejan
// en atributos de <html>, que es lo que lee la hoja de estilos.

export const THEMES = ['system', 'light', 'dark'] as const;
export const TEXT_SIZES = ['small', 'normal', 'large'] as const;
export const COLOR_FILTERS = ['none', 'protanopia', 'deuteranopia', 'tritanopia'] as const;

export type Theme = (typeof THEMES)[number];
export type TextSize = (typeof TEXT_SIZES)[number];
export type ColorFilter = (typeof COLOR_FILTERS)[number];

export interface Preferences {
  theme: Theme;
  textSize: TextSize;
  highContrast: boolean;
  colorFilter: ColorFilter;
}

export const DEFAULT_PREFERENCES: Readonly<Preferences> = {
  theme: 'system',
  textSize: 'normal',
  highContrast: false,
  colorFilter: 'none',
};

/**
 * Claves de localStorage. Las tres primeras son las de la versión anterior de la web,
 * así que quien ya tenía preferencias guardadas las conserva.
 * Si cambian, hay que cambiarlas también en src/scripts/preferences-bootstrap.js.
 */
export const STORAGE_KEYS = {
  textSize: 'a11y-font',
  highContrast: 'a11y-contrast',
  colorFilter: 'a11y-filter',
  theme: 'a11y-theme',
} as const satisfies Record<keyof Preferences, string>;

export type StoredValues = Record<keyof Preferences, string | null>;

const pick = <T extends string>(value: string | null, allowed: readonly T[], fallback: T): T =>
  allowed.includes(value as T) ? (value as T) : fallback;

/** Preferencias a partir de lo guardado; lo que no sea válido toma el valor por defecto. */
export const parsePreferences = (stored: StoredValues): Preferences => ({
  theme: pick(stored.theme, THEMES, DEFAULT_PREFERENCES.theme),
  textSize: pick(stored.textSize, TEXT_SIZES, DEFAULT_PREFERENCES.textSize),
  highContrast: stored.highContrast === 'true',
  colorFilter: pick(stored.colorFilter, COLOR_FILTERS, DEFAULT_PREFERENCES.colorFilter),
});

/** Valores que se guardan para unas preferencias. */
export const serializePreferences = (preferences: Preferences): Record<keyof Preferences, string> => ({
  theme: preferences.theme,
  textSize: preferences.textSize,
  highContrast: String(preferences.highContrast),
  colorFilter: preferences.colorFilter,
});

/**
 * Atributos de <html> que aplican unas preferencias (null = quitar el atributo).
 * Los valores por defecto no ponen atributo.
 */
export const preferenceAttributes = (preferences: Preferences): Record<string, string | null> => ({
  'data-theme': preferences.theme === 'system' ? null : preferences.theme,
  'data-text-size': preferences.textSize === 'normal' ? null : preferences.textSize,
  'data-contrast': preferences.highContrast ? 'high' : null,
  'data-color-filter': preferences.colorFilter === 'none' ? null : preferences.colorFilter,
});
