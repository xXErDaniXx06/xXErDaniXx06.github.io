// Genera los iconos de la web y las imágenes para compartir (Open Graph) con Chrome:
//   public/favicon.ico, apple-touch-icon.png, icon-192.png, icon-512.png, icon-maskable-512.png
//   public/og/{es,en,fr}.jpg
// El icono es public/favicon.svg (fuente única): el monograma «DC» con los contornos de
// Inter Bold (licencia SIL OFL) sobre un fondo de esquinas continuas. Los textos salen de src/.
// Uso: npm run brand-assets   (CHROME_PATH=/ruta/a/chrome si no está en la ruta habitual)
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import puppeteer from 'puppeteer-core';
import { AFFILIATION, PERSON_NAME } from '../src/data/profile.ts';
import { en } from '../src/i18n/en.ts';
import { es } from '../src/i18n/es.ts';
import { fr } from '../src/i18n/fr.ts';

const root = new URL('../', import.meta.url);
const file = (path) => new URL(path, root);
const CHROME =
  process.env.CHROME_PATH ??
  (process.platform === 'darwin'
    ? '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'
    : '/usr/bin/google-chrome');

const favicon = readFileSync(file('public/favicon.svg'), 'utf8');
const ACCENT = /id="background" fill="(#[0-9a-f]{6})"/i.exec(favicon)?.[1] ?? '#1d4ed8';
const sized = (svg, size) => svg.replace('<svg ', `<svg width="${size}" height="${size}" `);
// Fondo cuadrado (iOS y Android aplican su propia máscara); en la versión «maskable» el
// monograma se reduce para quedar dentro de la zona segura.
const square = favicon.replace(
  /<path id="background"[^>]*\/>/,
  `<rect id="background" width="32" height="32" fill="${ACCENT}"/>`,
);
const maskable = square.replace('<path id="monogram"', '<path transform="translate(4.8 4.8) scale(0.7)" id="monogram"');

const browser = await puppeteer.launch({ executablePath: CHROME, headless: true });
const page = await browser.newPage();

async function png(svg, size) {
  await page.setViewport({ width: size, height: size, deviceScaleFactor: 1 });
  await page.setContent(`<body style="margin:0">${sized(svg, size)}</body>`);
  return page.screenshot({ type: 'png', omitBackground: true, clip: { x: 0, y: 0, width: size, height: size } });
}

/** ICO con las imágenes PNG incrustadas. */
function ico(images) {
  const header = Buffer.alloc(6 + 16 * images.length);
  header.writeUInt16LE(1, 2);
  header.writeUInt16LE(images.length, 4);
  let offset = header.length;
  images.forEach(({ size, data }, i) => {
    const entry = 6 + 16 * i;
    header.writeUInt8(size, entry);
    header.writeUInt8(size, entry + 1);
    header.writeUInt16LE(1, entry + 4);
    header.writeUInt16LE(32, entry + 6);
    header.writeUInt32LE(data.length, entry + 8);
    header.writeUInt32LE(offset, entry + 12);
    offset += data.length;
  });
  return Buffer.concat([header, ...images.map(({ data }) => data)]);
}

const icoImages = [];
for (const size of [16, 32, 48]) icoImages.push({ size, data: await png(favicon, size) });
writeFileSync(file('public/favicon.ico'), ico(icoImages));
writeFileSync(file('public/icon-192.png'), await png(favicon, 192));
writeFileSync(file('public/icon-512.png'), await png(favicon, 512));
writeFileSync(file('public/icon-maskable-512.png'), await png(maskable, 512));
writeFileSync(file('public/apple-touch-icon.png'), await png(square, 180));

const font = readFileSync(file('node_modules/@fontsource-variable/inter/files/inter-latin-wght-normal.woff2')).toString(
  'base64',
);
const photo = readFileSync(file('src/assets/images/profile2.jpeg')).toString('base64');
const [firstName, ...lastNames] = PERSON_NAME.split(' ');
mkdirSync(file('public/og'), { recursive: true });
await page.setViewport({ width: 1200, height: 630, deviceScaleFactor: 1 });
for (const [lang, t] of Object.entries({ es, en, fr })) {
  await page.setContent(`<!doctype html><html lang="${lang}"><head><style>
    @font-face { font-family: Inter; src: url(data:font/woff2;base64,${font}) format('woff2'); font-weight: 100 900; }
    * { box-sizing: border-box; }
    body { margin: 0; width: 1200px; height: 630px; display: flex; background: #fff; color: #0f172a;
      font-family: Inter, sans-serif; font-feature-settings: 'cv11', 'ss01'; }
    .text { flex: 1; display: flex; flex-direction: column; padding: 64px 56px 60px 72px; border-top: 10px solid ${ACCENT}; }
    .brand { display: flex; align-items: center; gap: 16px; font-size: 24px; font-weight: 600; color: #475569; }
    h1 { margin: auto 0 0; font-size: 70px; line-height: 1.04; letter-spacing: -0.03em; font-weight: 650; }
    .role { margin-top: 26px; font-size: 31px; font-weight: 550; }
    .tagline { margin-top: 10px; font-size: 27px; color: #475569; }
    .place { margin-top: 34px; font-size: 22px; font-weight: 600; color: ${ACCENT}; letter-spacing: 0.02em; }
    img { width: 430px; height: 630px; object-fit: cover; object-position: 62% 50%; }
  </style></head><body>
    <div class="text">
      <div class="brand">${sized(favicon, 56)}<span>danielcarrascogarcia.me</span></div>
      <h1>${firstName}<br>${lastNames.join(' ')}</h1>
      <div class="role">${t.home.role}</div>
      <div class="tagline">${t.home.roleTagline.replace('&', '&amp;')}</div>
      <div class="place">${AFFILIATION}</div>
    </div>
    <img src="data:image/jpeg;base64,${photo}" alt="">
  </body></html>`);
  await page.evaluate('document.fonts.ready');
  writeFileSync(file(`public/og/${lang}.jpg`), await page.screenshot({ type: 'jpeg', quality: 86 }));
}

await browser.close();
console.log('Iconos e imágenes para compartir generados en public/.');
