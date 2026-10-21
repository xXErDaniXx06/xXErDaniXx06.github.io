// Conecta los controles del menú de accesibilidad (components/layout/PreferencesMenu.astro)
// con las preferencias. Los controles son radios y un interruptor nativos: el navegador
// se encarga del teclado y de anunciar su estado.

import type { Preferences } from '../lib/preferences';
import { getPreferences, PREFERENCES_CHANGE, resetPreferences, setPreferences } from './preferences';

const form = document.querySelector<HTMLElement>('[data-preferences-form]');

function sync(preferences: Preferences): void {
  if (!form) return;
  for (const name of ['theme', 'textSize', 'colorFilter'] as const) {
    const input = form.querySelector<HTMLInputElement>(`input[name="${name}"][value="${preferences[name]}"]`);
    if (input) input.checked = true;
  }
  const contrast = form.querySelector<HTMLInputElement>('input[name="highContrast"]');
  if (contrast) contrast.checked = preferences.highContrast;
}

if (form) {
  sync(getPreferences());

  form.addEventListener('change', (event) => {
    const input = event.target as HTMLInputElement;
    if (input.name === 'highContrast') setPreferences({ highContrast: input.checked });
    else if (input.name) setPreferences({ [input.name]: input.value } as Partial<Preferences>);
  });

  form.querySelector('[data-preferences-reset]')?.addEventListener('click', () => resetPreferences());

  document.addEventListener(PREFERENCES_CHANGE, (event) => sync((event as CustomEvent<Preferences>).detail));
}
