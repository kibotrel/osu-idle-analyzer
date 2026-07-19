import { defineConfig } from 'oxlint';

export default defineConfig({
  env: { es6: true },
  categories: { correctness: 'error', perf: 'error', suspicious: 'warn' },
  plugins: ['eslint', 'import', 'oxc', 'promise', 'typescript', 'unicorn', 'vitest', 'vue'],
  rules: {
    'eslint/no-unused-vars': 'error',
    'import/no-unassigned-import': ['error', { allow: ['**/*.css'] }],
  },
});
