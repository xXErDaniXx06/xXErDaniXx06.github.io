// Color de la barra del navegador (<meta name="theme-color">). Con el tema del sistema valen
// las dos etiquetas de BaseLayout, cada una con su media query; si la persona elige un tema
// o el alto contraste, las dos toman el color de fondo de la página.

import { PREFERENCES_CHANGE } from './preferences';

const metas = [...document.querySelectorAll<HTMLMetaElement>('meta[name="theme-color"]')].map((meta) => ({
  meta,
  original: meta.content,
}));

function syncThemeColor(): void {
  const root = document.documentElement;
  const chosen = root.hasAttribute('data-theme') || root.hasAttribute('data-contrast');
  const background = getComputedStyle(root).backgroundColor;
  for (const { meta, original } of metas) meta.content = chosen ? background : original;
}

syncThemeColor();
document.addEventListener(PREFERENCES_CHANGE, syncThemeColor);
