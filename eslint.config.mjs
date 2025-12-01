import js from '@eslint/js';
import globals from 'globals';
import { defineConfig } from 'eslint/config';
import eslintPluginUnicorn from 'eslint-plugin-unicorn';
import tsParser from '@typescript-eslint/parser';
import tsPlugin from '@typescript-eslint/eslint-plugin';

export default defineConfig([
  {
    files: ['**/*.{js,mjs,cjs,ts,tsx}'],
    ignores: ['node_modules/**', 'dist/**'],
    plugins: {
      js,
      unicorn: eslintPluginUnicorn,
      '@typescript-eslint': tsPlugin,
    },
    extends: ['js/recommended'],
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      parser: tsParser,
      parserOptions: { project: false },
      globals: {
        ...globals.browser,
        ...globals.node,
      },
    },
    rules: {
      // eslint base rules
      'no-lonely-if': 'error',
      eqeqeq: 'error',
      'prefer-const': 'error',
      'no-var': 'error',
      'prefer-template': 'error',
      'prefer-arrow-callback': 'error',
      'no-unused-vars': 'off',
      'consistent-return': 'off',

      // typescript-eslint
      '@typescript-eslint/no-unused-vars': [
        'warn',
        { argsIgnorePattern: '^_', varsIgnorePattern: '^_' },
      ],

      // unicorn
      'unicorn/consistent-destructuring': 'error',
      'unicorn/error-message': 'error',
      'unicorn/no-abusive-eslint-disable': 'error',
      'unicorn/no-lonely-if': 'error',
      'unicorn/prefer-ternary': 'error',
    },
  },
]);
