// Genera la fuente de la web: Inter (variable) reducida a los caracteres latinos que usa
// el contenido en español, inglés y francés, a los pesos 400–700 y a las funciones
// tipográficas que se usan. Pasa de 48 KB a unos 26 KB: la página se pinta antes.
// Uso: npm run fonts   →   src/assets/fonts/inter-latin-400-700.woff2
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import subsetFont from 'subset-font';
import { characters } from './font-ranges.mjs';

const source = new URL(
  '../node_modules/@fontsource-variable/inter/files/inter-latin-wght-normal.woff2',
  import.meta.url,
);
const target = new URL('../src/assets/fonts/inter-latin-400-700.woff2', import.meta.url);

const font = await subsetFont(readFileSync(source), characters(), {
  targetFormat: 'woff2',
  variationAxes: { wght: { min: 400, max: 700, default: 400 } },
  // cv11 y ss01: las variantes de «a» y de los números que usa la hoja de estilos
  keepFeatures: ['kern', 'liga', 'calt', 'ccmp', 'locl', 'mark', 'mkmk', 'case', 'tnum', 'cv11', 'ss01'],
});
mkdirSync(new URL('.', target), { recursive: true });
writeFileSync(target, font);
console.log(`${target.pathname}: ${font.length} bytes`);
