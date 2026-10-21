import { readFileSync } from 'node:fs';
import { runInNewContext } from 'node:vm';
import { describe, expect, it } from 'vitest';
import {
  COLOR_FILTERS,
  parsePreferences,
  preferenceAttributes,
  serializePreferences,
  STORAGE_KEYS,
  TEXT_SIZES,
  THEMES,
  type StoredValues,
} from '../src/lib/preferences';

const bootstrap = readFileSync('src/scripts/preferences-bootstrap.js', 'utf8');

/** Ejecuta el script en línea del <head> con un localStorage y un <html> de prueba. */
function runBootstrap(stored: Record<string, string | null>, storageThrows = false): Record<string, string> {
  const attributes: Record<string, string> = {};
  runInNewContext(bootstrap, {
    document: { documentElement: { setAttribute: (name: string, value: string) => (attributes[name] = value) } },
    localStorage: {
      getItem: (key: string) => {
        if (storageThrows) throw new Error('SecurityError');
        return stored[key] ?? null;
      },
    },
  });
  return attributes;
}

const expectedAttributes = (stored: StoredValues): Record<string, string> =>
  Object.fromEntries(
    Object.entries(preferenceAttributes(parsePreferences(stored))).filter(
      (entry): entry is [string, string] => entry[1] !== null,
    ),
  );

describe('preferencias', () => {
  it('los valores no válidos vuelven a los de por defecto', () => {
    expect(parsePreferences({ theme: 'neon', textSize: '99px', highContrast: 'yes', colorFilter: null })).toEqual({
      theme: 'system',
      textSize: 'normal',
      highContrast: false,
      colorFilter: 'none',
    });
  });

  it('las preferencias por defecto no añaden atributos', () => {
    expect(expectedAttributes({ theme: null, textSize: null, highContrast: null, colorFilter: null })).toEqual({});
  });

  it('el script en línea aplica lo mismo que el módulo, para todas las combinaciones', () => {
    for (const theme of [...THEMES, 'otro', null])
      for (const textSize of [...TEXT_SIZES, null])
        for (const highContrast of ['true', 'false', null])
          for (const colorFilter of [...COLOR_FILTERS, 'x', null]) {
            const stored: StoredValues = { theme, textSize, highContrast, colorFilter };
            const raw = Object.fromEntries(
              (Object.keys(STORAGE_KEYS) as (keyof StoredValues)[]).map((key) => [STORAGE_KEYS[key], stored[key]]),
            );
            expect(runBootstrap(raw)).toEqual(expectedAttributes(stored));
          }
  });

  it('el script en línea no falla sin localStorage', () => {
    expect(runBootstrap({}, true)).toEqual({});
  });

  it('se guardan los mismos valores que se leen', () => {
    const preferences = { theme: 'dark', textSize: 'large', highContrast: true, colorFilter: 'tritanopia' } as const;
    expect(parsePreferences(serializePreferences(preferences))).toEqual(preferences);
  });
});
