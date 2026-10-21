// Se ejecuta en línea en el <head>, antes de pintar, para aplicar las preferencias
// guardadas sin parpadeo. Es la versión mínima de parsePreferences + preferenceAttributes
// (src/lib/preferences.ts); tests/preferences.test.ts comprueba que hacen lo mismo.
(function () {
  var root = document.documentElement;
  var get = function (key) {
    try {
      return localStorage.getItem(key);
    } catch {
      return null;
    }
  };
  var theme = get('a11y-theme');
  var size = get('a11y-font');
  var filter = get('a11y-filter');
  if (theme === 'light' || theme === 'dark') root.setAttribute('data-theme', theme);
  if (size === 'small' || size === 'large') root.setAttribute('data-text-size', size);
  if (get('a11y-contrast') === 'true') root.setAttribute('data-contrast', 'high');
  if (filter === 'protanopia' || filter === 'deuteranopia' || filter === 'tritanopia') {
    root.setAttribute('data-color-filter', filter);
  }
})();
