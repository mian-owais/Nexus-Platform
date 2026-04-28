import js from '@eslint/js';
import globals from 'globals';
import reactHooks from 'eslint-plugin-react-hooks';
import reactRefresh from 'eslint-plugin-react-refresh';

export default [
  {
    ignores: ['dist', 'src', 'js-backend'],
  },
  js.configs.recommended,
  {
    files: ['src-js/**/*.{js,jsx}'],
    languageOptions: {
      ecmaVersion: 2020,
      sourceType: 'module',
      globals: globals.browser,
      parserOptions: {
        ecmaFeatures: {
          jsx: true,
        },
        jsxRuntime: 'automatic',
      },
    },
    plugins: {
      'react-hooks': reactHooks,
      'react-refresh': reactRefresh,
    },
    rules: {
      ...reactHooks.configs.recommended.rules,
      'react-refresh/only-export-components': ['warn', { allowConstantExport: true }],
      // allow automatic JSX runtime and avoid unused React import warnings
      'no-unused-vars': ['error', { "varsIgnorePattern": "^React$" }],
    },
  },
  // Node/server overrides for files that run in Node environment
  {
    files: ['src-js/server.js', 'src-js/**/controllers/**', 'src-js/**/utils/**', 'js-backend/**'],
    languageOptions: {
      globals: globals.node,
      parserOptions: {
        ecmaVersion: 2020,
        sourceType: 'module',
      },
    },
    rules: {
      // allow console and process in server-side code
      'no-console': 'off',
      'no-undef': 'off',
    },
  },
];
