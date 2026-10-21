// Comprueba la accesibilidad con axe-core en todas las páginas, en los temas claro y oscuro,
// con y sin alto contraste (que además debe llegar al nivel AAA de contraste), en escritorio
// y en móvil, y con el menú de accesibilidad y el menú móvil abiertos. Lighthouse solo mide
// el tema por defecto con los menús cerrados. Falla si hay alguna infracción.
// Uso: npm run a11y [-- <origen>]
//   Por defecto mide https://danielcarrascogarcia.me. Necesita Chrome instalado
//   (CHROME_PATH si no está en la ruta habitual).
import { readFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import { Launcher } from 'chrome-launcher';
import puppeteer from 'puppeteer-core';
import { PAGE_IDS, pageHref } from '../src/data/pages.ts';
import { LANGS } from '../src/i18n/langs.ts';
import { STORAGE_KEYS } from '../src/lib/preferences.ts';

const AXE = readFileSync(createRequire(import.meta.url).resolve('axe-core/axe.min.js'), 'utf8');
const TAGS = ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa', 'best-practice'];
const origin = (process.argv.slice(2).find((a) => !a.startsWith('--')) ?? 'https://danielcarrascogarcia.me').replace(
  /\/$/,
  '',
);
const paths = ['/', ...LANGS.flatMap((lang) => PAGE_IDS.map((page) => pageHref(lang, page)))];
const DESKTOP = { width: 1366, height: 900 };
const MOBILE = { width: 390, height: 844, isMobile: true, hasTouch: true, deviceScaleFactor: 2 };
const THEMES = ['light', 'dark'];

const pause = () => new Promise((resolve) => setTimeout(resolve, 300));
const OPEN = {
  preferences: async (page) => {
    await page.click('button[popovertarget="preferences-panel"]');
    await pause();
  },
  menu: async (page) => {
    await page.tap('button[popovertarget="mobile-menu"]');
    await pause();
  },
};

const states = [
  ...paths.flatMap((path) =>
    THEMES.flatMap((theme) =>
      [false, true].flatMap((highContrast) =>
        [DESKTOP, MOBILE].map((viewport) => ({ path, theme, highContrast, viewport })),
      ),
    ),
  ),
  ...THEMES.flatMap((theme) =>
    [false, true].flatMap((highContrast) => [
      { path: pageHref('es', 'index'), theme, highContrast, viewport: DESKTOP, open: 'preferences' },
      { path: pageHref('en', 'proyectos'), theme, highContrast, viewport: MOBILE, open: 'menu' },
      { path: pageHref('fr', 'contacto'), theme, highContrast, viewport: MOBILE, textSize: 'large' },
    ]),
  ),
];

const browser = await puppeteer.launch({
  executablePath: process.env.CHROME_PATH ?? Launcher.getFirstInstallation(),
  args: ['--no-first-run', '--no-default-browser-check'],
});
let failures = 0;
try {
  for (const state of states) {
    const page = await browser.newPage();
    const errors = [];
    page.on('pageerror', (error) => errors.push(error.message));
    // axe se inyecta en la página: la política de seguridad de la web no lo permitiría.
    await page.setBypassCSP(true);
    await page.setViewport(state.viewport);
    await page.evaluateOnNewDocument(
      (keys, values) => {
        for (const [key, value] of Object.entries(values)) localStorage.setItem(keys[key], value);
      },
      STORAGE_KEYS,
      { theme: state.theme, highContrast: String(state.highContrast), textSize: state.textSize ?? 'normal' },
    );
    await page.goto(origin + state.path, { waitUntil: 'networkidle0' });
    if (state.open) await OPEN[state.open](page);
    await page.addScriptTag({ content: AXE });
    const violations = await page.evaluate(
      async (tags, enhanced) => {
        const result = await globalThis.axe.run(globalThis.document, {
          runOnly: { type: 'tag', values: enhanced ? [...tags, 'wcag2aaa'] : tags },
          rules: enhanced ? { 'color-contrast-enhanced': { enabled: true } } : {},
        });
        return result.violations.map((v) => `${v.id} (${v.nodes.length}): ${v.nodes[0]?.target.join(' ')}`);
      },
      TAGS,
      state.highContrast,
    );
    await page.close();
    const label = [
      state.path,
      state.theme,
      state.highContrast && 'alto contraste',
      state.viewport.isMobile ? 'móvil' : 'escritorio',
      state.open,
      state.textSize,
    ]
      .filter(Boolean)
      .join(' · ');
    if (violations.length || errors.length) {
      failures++;
      console.log(`✗ ${label}`);
      for (const line of [...violations, ...errors.map((e) => `error: ${e}`)]) console.log(`    ${line}`);
    }
  }
} finally {
  await browser.close();
}
console.log(`${states.length - failures}/${states.length} estados sin infracciones`);
process.exit(failures ? 1 : 0);
