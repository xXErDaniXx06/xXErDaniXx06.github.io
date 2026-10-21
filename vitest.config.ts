import { fileURLToPath } from 'node:url';
import { defineConfig } from 'vitest/config';

export default defineConfig({
  resolve: {
    alias: {
      'cloudflare:workers': fileURLToPath(new URL('./worker/test/stubs/cloudflare-workers.ts', import.meta.url)),
    },
  },
  test: {
    // tests/: código de la web (src/). worker/test/: el Worker de Cloudflare.
    include: ['tests/**/*.test.ts', 'worker/test/**/*.test.ts'],
    environment: 'node',
    // La librería OAuth importa `cloudflare:workers`: se procesa con Vite para aplicar el alias.
    server: { deps: { inline: ['@cloudflare/workers-oauth-provider'] } },
  },
});
