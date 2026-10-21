// ESLint: TypeScript estricto en todo el código, reglas de Astro y de accesibilidad
// (jsx-a11y) en los componentes. Formato: Prettier (prettier.config.js).
import js from '@eslint/js';
import astro from 'eslint-plugin-astro';
import globals from 'globals';
import tseslint from 'typescript-eslint';

export default tseslint.config(
  {
    ignores: ['dist/', '.astro/', '.wrangler/', 'worker-bundle/', 'node_modules/', 'coverage/'],
  },
  js.configs.recommended,
  ...tseslint.configs.strict,
  ...tseslint.configs.stylistic,
  ...astro.configs['flat/recommended'],
  ...astro.configs['flat/jsx-a11y-strict'],
  {
    rules: {
      '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_', varsIgnorePattern: '^_' }],
      '@typescript-eslint/consistent-type-imports': ['error', { fixStyle: 'inline-type-imports' }],
      eqeqeq: ['error', 'always'],
      'no-console': ['error', { allow: ['warn', 'error'] }],
    },
  },
  {
    // Código que se ejecuta en el navegador
    files: ['src/scripts/**/*.{ts,js}'],
    languageOptions: { globals: globals.browser },
  },
  {
    // Worker de Cloudflare
    files: ['worker/**/*.ts'],
    languageOptions: { globals: globals.serviceworker },
  },
  {
    // Herramientas de Node (configuración, scripts y pruebas)
    files: ['*.{js,mjs,ts}', 'scripts/**/*.mjs', 'tests/**/*.ts', 'e2e/**/*.ts'],
    languageOptions: { globals: globals.node },
    rules: { 'no-console': 'off' },
  },
);
