// Preferencias de visualización en el navegador: las lee y guarda en localStorage y las
// aplica a <html>. Las usan el menú de accesibilidad y la herramienta WebMCP.

import {
  DEFAULT_PREFERENCES,
  parsePreferences,
  preferenceAttributes,
  serializePreferences,
  STORAGE_KEYS,
  type Preferences,
} from '../lib/preferences';

/** Evento que se emite en `document` cada vez que cambian las preferencias. */
export const PREFERENCES_CHANGE = 'preferences:change';

const keys = Object.keys(STORAGE_KEYS) as (keyof Preferences)[];

// localStorage puede no estar disponible (modo privado, cookies bloqueadas…).
const storage = {
  get(key: string): string | null {
    try {
      return localStorage.getItem(key);
    } catch {
      return null;
    }
  },
  set(key: string, value: string): void {
    try {
      localStorage.setItem(key, value);
    } catch {
      // Sin almacenamiento la preferencia dura hasta cambiar de página.
    }
  },
  remove(key: string): void {
    try {
      localStorage.removeItem(key);
    } catch {
      // Nada que borrar.
    }
  },
};

export function getPreferences(): Preferences {
  const stored = Object.fromEntries(keys.map((key) => [key, storage.get(STORAGE_KEYS[key])]));
  return parsePreferences(stored as Record<keyof Preferences, string | null>);
}

function apply(preferences: Preferences): void {
  const root = document.documentElement;
  for (const [name, value] of Object.entries(preferenceAttributes(preferences))) {
    if (value === null) root.removeAttribute(name);
    else root.setAttribute(name, value);
  }
  document.dispatchEvent(new CustomEvent<Preferences>(PREFERENCES_CHANGE, { detail: preferences }));
}

/** Cambia algunas preferencias, las guarda y las aplica. */
export function setPreferences(changes: Partial<Preferences>): Preferences {
  const next = { ...getPreferences(), ...changes };
  const values = serializePreferences(next);
  for (const key of keys) storage.set(STORAGE_KEYS[key], values[key]);
  apply(next);
  return next;
}

/** Vuelve a los valores por defecto y borra lo guardado. */
export function resetPreferences(): Preferences {
  for (const key of keys) storage.remove(STORAGE_KEYS[key]);
  apply({ ...DEFAULT_PREFERENCES });
  return { ...DEFAULT_PREFERENCES };
}
