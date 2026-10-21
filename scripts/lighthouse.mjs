// Mide con Lighthouse todas las páginas de la web (móvil y escritorio) y falla si alguna
// categoría no llega al mínimo (100 por defecto).
// Uso: npm run lighthouse [-- <origen>] [--desktop] [--only=/es/,/en/proyectos] [--min=100]
//      [--min-performance=100] [--runs=3]
//   Por defecto mide https://danielcarrascogarcia.me en móvil. Necesita Chrome instalado
//   (CHROME_PATH si no está en la ruta habitual).
import { launch } from 'chrome-launcher';
import lighthouse from 'lighthouse';
import desktopConfig from 'lighthouse/core/config/desktop-config.js';
import { PAGE_IDS, pageHref } from '../src/data/pages.ts';
import { LANGS } from '../src/i18n/langs.ts';

const args = process.argv.slice(2);
const flag = (name) => args.find((a) => a.startsWith(`--${name}=`))?.split('=')[1];
const origin = (args.find((a) => !a.startsWith('--')) ?? 'https://danielcarrascogarcia.me').replace(/\/$/, '');
const desktop = args.includes('--desktop');
const minimum = Number(flag('min') ?? 100);
// El rendimiento varía con la máquina que mide (en CI se puede pedir algo menos).
const minimumPerformance = Number(flag('min-performance') ?? minimum);
// La medición también varía con la red y con lo que esté haciendo la máquina: cada página se
// mide hasta `runs` veces y vale la primera pasada que llega a los mínimos.
const runs = Number(flag('runs') ?? 3);
const paths = flag('only')?.split(',') ?? [
  '/',
  ...LANGS.flatMap((lang) => PAGE_IDS.map((page) => pageHref(lang, page))),
];
const CATEGORIES = ['performance', 'accessibility', 'best-practices', 'seo'];

const chrome = await launch({
  chromePath: process.env.CHROME_PATH,
  chromeFlags: ['--headless=new', '--no-first-run', '--no-default-browser-check'],
});
// Un fallo de la herramienta (p. ej. Chrome cierra la pestaña a mitad de medición) cuenta
// como una pasada sin resultado: se repite como las que no tienen métricas.
const audit = async (path) => {
  try {
    const result = await lighthouse(
      origin + path,
      { port: chrome.port, output: 'json', logLevel: 'error', onlyCategories: CATEGORIES },
      desktop ? desktopConfig : undefined,
    );
    return result?.lhr;
  } catch (error) {
    console.warn(`  (${path}: ${String(error?.message ?? error).split('\n')[0]}; se repite)`);
    return undefined;
  }
};
const scoresOf = (lhr) =>
  Object.fromEntries(CATEGORIES.map((c) => [c, Math.round((lhr?.categories[c]?.score ?? 0) * 100)]));
const meetsMinimums = (scores) =>
  Object.entries(scores).every(
    ([category, score]) => score >= (category === 'performance' ? minimumPerformance : minimum),
  );

let failed = false;
try {
  // Con Chrome recién abierto la primera medición sale peor sin que la página tenga la culpa
  // (en CI, cientos de milisegundos de bloqueo del hilo principal): esta pasada no cuenta.
  await audit(paths[0]);
  for (const path of paths) {
    // Si ninguna pasada llega a los mínimos, se informa de la de mejor rendimiento.
    let best;
    // Una pasada sin métricas (fallo de la medición, no de la página) se repite hasta dos veces.
    for (let run = 0, retries = 2; run < runs; run++) {
      const lhr = await audit(path);
      if ((!lhr || lhr.categories.performance.score === null) && retries-- > 0) {
        run--;
        continue;
      }
      if (lhr && meetsMinimums(scoresOf(lhr))) {
        best = lhr;
        break;
      }
      if (lhr && (!best || lhr.categories.performance.score > best.categories.performance.score)) best = lhr;
    }
    const scores = scoresOf(best);
    const failing = CATEGORIES.flatMap((c) =>
      (best?.categories[c]?.auditRefs ?? [])
        .filter((ref) => ref.weight > 0 && best.audits[ref.id].score !== null && best.audits[ref.id].score < 1)
        .map((ref) => `${ref.id}(${best.audits[ref.id].score})`),
    );
    const metrics = [
      'first-contentful-paint',
      'largest-contentful-paint',
      'total-blocking-time',
      'cumulative-layout-shift',
      'speed-index',
    ]
      .map(
        (id) =>
          `${id
            .split('-')
            .map((w) => w[0].toUpperCase())
            .join('')} ${best?.audits[id]?.displayValue ?? '?'}`,
      )
      .join(' · ');
    const ok = meetsMinimums(scores);
    failed ||= !ok;
    console.log(
      `${ok ? '✓' : '✗'} ${path.padEnd(18)} P${scores.performance} A${scores.accessibility} BP${scores['best-practices']} SEO${scores.seo} | ${metrics}`,
    );
    if (failing.length) console.log(`    ${[...new Set(failing)].join(' ')}`);
    // Por qué falla del todo una auditoría (p. ej. robots.txt que no se pudo descargar)
    for (const id of new Set(failing.map((f) => f.split('(')[0]))) {
      const result = best?.audits[id];
      if (result?.score === 0 && result.explanation) console.log(`      ${id}: ${result.explanation.slice(0, 200)}`);
    }
  }
} finally {
  chrome.kill();
}
process.exit(failed ? 1 : 0);
