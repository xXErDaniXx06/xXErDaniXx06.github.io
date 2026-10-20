import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';

// https://astro.build/config
export default defineConfig({
  // SITE_URL permite compilar contra otro origen (p. ej. un túnel de pruebas)
  site: process.env.SITE_URL || 'https://danielcarrascogarcia.me',
  integrations: [tailwind()],
});
