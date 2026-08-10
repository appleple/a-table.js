import js from '@eslint/js';
import globals from 'globals';

export default [
  {
    ignores: ['lib/**', 'build/**', 'node_modules/**', 'coverage/**', 'examples/**']
  },
  js.configs.recommended,
  {
    files: ['**/*.js', '**/*.mjs'],
    languageOptions: {
      ecmaVersion: 2022,
      sourceType: 'module',
      globals: {
        ...globals.browser,
        ...globals.node
      }
    }
  },
  {
    files: ['test/**/*.js'],
    languageOptions: {
      ecmaVersion: 'latest',
      globals: {
        ...globals.node
      }
    }
  }
];
