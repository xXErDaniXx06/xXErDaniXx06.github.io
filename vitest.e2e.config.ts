import { defineConfig } from 'vitest/config';

// Pruebas de extremo a extremo contra el Worker en marcha (npm run worker:dev, o el de CI).
// Origen: E2E_BASE_URL (por defecto http://localhost:8787).
export default defineConfig({
  test: {
    include: ['e2e/**/*.e2e.test.ts'],
    environment: 'node',
    testTimeout: 30_000,
    // Comparten el límite de envíos del formulario: en serie.
    fileParallelism: false,
  },
});
