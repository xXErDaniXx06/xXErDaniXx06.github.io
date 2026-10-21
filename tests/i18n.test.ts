import { describe, expect, it } from 'vitest';
import { ACHIEVEMENTS } from '../src/data/achievements';
import { PROJECTS } from '../src/data/projects';
import { SKILL_CATEGORY_IDS } from '../src/data/skills';
import { getDictionary, LANGS, type Dictionary } from '../src/i18n';

/** Rutas de todas las hojas de un objeto, con la longitud de las listas. */
function shape(value: unknown, path = ''): string[] {
  if (Array.isArray(value))
    return [`${path}[${value.length}]`, ...value.flatMap((item, i) => shape(item, `${path}[${i}]`))];
  if (value && typeof value === 'object') {
    return Object.entries(value).flatMap(([key, child]) => shape(child, path ? `${path}.${key}` : key));
  }
  return [path];
}

function strings(value: unknown): string[] {
  if (typeof value === 'string') return [value];
  if (Array.isArray(value)) return value.flatMap(strings);
  if (value && typeof value === 'object') return Object.values(value).flatMap(strings);
  return [];
}

// Listas cuya longitud puede variar entre idiomas sin perder información.
const VARIABLE_LENGTH: RegExp[] = [];

describe('diccionarios', () => {
  const reference = getDictionary('es');
  const others = LANGS.filter((lang) => lang !== 'es').map((lang) => [lang, getDictionary(lang)] as const);

  it.each(others)('%s tiene la misma estructura que el español', (_lang, dictionary) => {
    const expected = shape(reference).filter((p) => !VARIABLE_LENGTH.some((re) => re.test(p)));
    const actual = shape(dictionary).filter((p) => !VARIABLE_LENGTH.some((re) => re.test(p)));
    expect(actual).toEqual(expected);
  });

  it.each(LANGS)('%s: sin textos vacíos, «undefined» ni emojis decorativos', (lang) => {
    for (const text of strings(getDictionary(lang))) {
      expect(text.trim()).not.toBe('');
      expect(text).not.toContain('undefined');
      expect(text).not.toMatch(/[\u{1F300}-\u{1FAFF}✅✓]/u);
    }
  });

  it.each(LANGS)('%s: el HTML en línea solo usa <strong>, <em> y <a href>', (lang) => {
    for (const text of strings(getDictionary(lang))) {
      for (const tag of text.match(/<[^>]+>/g) ?? []) {
        expect(tag).toMatch(/^<\/?(strong|em)>$|^<a href="https:\/\/[^"]+">$|^<\/a>$/);
      }
    }
  });

  it.each(LANGS)('%s: textos para cada proyecto, logro y categoría', (lang) => {
    const t: Dictionary = getDictionary(lang);
    expect(Object.keys(t.projects.items)).toEqual(PROJECTS.map((p) => p.id));
    expect(Object.keys(t.achievements.items)).toEqual(ACHIEVEMENTS.map((a) => a.id));
    expect(Object.keys(t.skills.categories)).toEqual([...SKILL_CATEGORY_IDS]);
  });

  it('la página de contacto se describe con su texto de presentación', () => {
    for (const lang of LANGS) {
      const t = getDictionary(lang);
      expect(t.pages.contacto.description).toBe(t.contact.info.description);
    }
  });
});

describe('fuente de la web', () => {
  // Caracteres que se muestran con la fuente del sistema porque Inter (latín) no los tiene.
  const FALLBACK = new Set(['₂']);

  it('incluye todos los caracteres del contenido', async () => {
    const { characters } = await import('../scripts/font-ranges.mjs');
    const available = new Set(characters());
    const missing = new Set<string>();
    for (const lang of LANGS) {
      for (const text of strings(getDictionary(lang))) {
        for (const char of text.replace(/<[^>]+>/g, '')) {
          if (!available.has(char) && !FALLBACK.has(char) && !/\s/.test(char)) missing.add(char);
        }
      }
    }
    expect([...missing]).toEqual([]);
  });
});
