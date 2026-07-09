'use strict';

/**
 * ESLint flat config (Milestone 13 tooling addition — see .playbook/12_DECISIONS.md).
 * Dev-time only; never loaded by index.html or shipped to production.
 *
 * Two source environments coexist in this repo:
 *  - assets/js/*.js — classic (non-module) <script> files that share one browser global scope
 *    (see .playbook/04_CODING_STANDARD.md, "namespace, don't add bare globals"). Render, Search,
 *    CompanyFilters, UI, Icons, and App are each declared once via `const X = {...}` in their own
 *    file and read as bare identifiers from every other file — declared as globals below so that
 *    cross-file namespace calls don't trigger no-undef.
 *  - scripts/**\/*.js|.mjs — Node dev tooling: CommonJS verify-*.js / build/schema helpers, and
 *    ESM ui-smoke-*.mjs / run-ui-smoke.mjs.
 *
 * Deliberately no stylistic/formatting rules here (indentation, quotes, etc.) — that's Prettier's
 * job (`npm run format`); ESLint is scoped to correctness (no-undef, no-unused-vars, eqeqeq, ...).
 */
const browserGlobals = {
  window: 'readonly',
  document: 'readonly',
  location: 'readonly',
  history: 'readonly',
  navigator: 'readonly',
  localStorage: 'readonly',
  fetch: 'readonly',
  console: 'readonly',
  setTimeout: 'writable',
  clearTimeout: 'writable',
  requestAnimationFrame: 'readonly',
  IntersectionObserver: 'readonly',
  URLSearchParams: 'readonly',
  Event: 'readonly',
  CSS: 'readonly',
  globalThis: 'readonly',
  // Node-compatible export/import guards used at the bottom of each assets/js/*.js file
  // (`if (typeof module !== 'undefined' && module.exports) {...}`) so scripts/verify-*.js can
  // require() these browser files directly.
  module: 'writable',
  require: 'readonly',
  // Cross-file namespaces — see file header comment.
  Render: 'writable',
  Search: 'writable',
  CompanyFilters: 'writable',
  UI: 'writable',
  Icons: 'writable',
  App: 'writable'
};

const nodeCommonJsGlobals = {
  require: 'readonly',
  module: 'writable',
  exports: 'writable',
  __dirname: 'readonly',
  __filename: 'readonly',
  process: 'readonly',
  console: 'readonly',
  Buffer: 'readonly',
  URLSearchParams: 'readonly'
};

const nodeEsmGlobals = {
  process: 'readonly',
  console: 'readonly'
};

// scripts/ui-smoke-*.mjs run in Node but pass callbacks into Playwright's page.evaluate(), which
// executes them in the *browser* page, not Node — so `document`/`window` are legitimately in
// scope there even though the surrounding file is a Node ESM script.
const playwrightPageEvaluateGlobals = {
  document: 'readonly',
  window: 'readonly'
};

const correctnessRules = {
  'no-undef': 'error',
  'no-unused-vars': ['warn', { argsIgnorePattern: '^_', varsIgnorePattern: '^_', caughtErrorsIgnorePattern: '^_' }],
  'no-var': 'error',
  'prefer-const': 'warn',
  eqeqeq: ['error', 'smart'],
  'no-dupe-keys': 'error',
  'no-unreachable': 'error'
};

module.exports = [
  {
    ignores: [
      'node_modules/**',
      'archive/**',
      'package-lock.json',
      'scripts/.ui-smoke-artifacts/**',
      'scripts/milestone-3-render-golden.json'
    ]
  },
  {
    files: ['assets/js/**/*.js'],
    languageOptions: {
      ecmaVersion: 2021,
      sourceType: 'script',
      globals: browserGlobals
    },
    rules: correctnessRules
  },
  {
    files: ['scripts/**/*.js'],
    languageOptions: {
      ecmaVersion: 2021,
      sourceType: 'commonjs',
      globals: nodeCommonJsGlobals
    },
    rules: correctnessRules
  },
  {
    files: ['scripts/**/*.mjs'],
    languageOptions: {
      ecmaVersion: 2022, // top-level await in run-ui-smoke.mjs
      sourceType: 'module',
      globals: nodeEsmGlobals
    },
    rules: correctnessRules
  },
  {
    files: ['scripts/ui-smoke-*.mjs'],
    languageOptions: {
      ecmaVersion: 2022,
      sourceType: 'module',
      globals: { ...nodeEsmGlobals, ...playwrightPageEvaluateGlobals }
    },
    rules: correctnessRules
  }
];
