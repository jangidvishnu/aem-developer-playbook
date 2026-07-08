# Coding Standard

## Stack constraints (non-negotiable)

- Vanilla JavaScript only — no React, Vue, jQuery, or similar frameworks.
- `assets/css/site.css` (design tokens + hand-written component styles) for styling — no CSS framework or CDN (the
  Tailwind CDN used through Milestone 10 was removed in Milestone 11; see `12_DECISIONS.md` DR-015).
- No build step for what ships to the browser. No bundler, no transpiler, no runtime dependency tree required to
  serve the site. (`package.json`'s `devDependencies` — ESLint, Prettier, Playwright, `serve` — are dev-time-only
  tooling; nothing under `node_modules/` is loaded by `index.html`. See DR-021.) The one narrow exception is
  `npm run prerender` (Milestone 14, DR-022): a pre-commit step that bakes `data/*.json` into `index.html` for SEO —
  its *output* is a plain static file committed to the repo, so GitHub Pages still serves everything with zero
  build step on its side.
- No JavaScript imports from external CDNs beyond what already exists (the Inter font) unless a decision record
  (`12_DECISIONS.md`) justifies the addition.

## Why

These constraints exist to guarantee the site can always be served unmodified from GitHub Pages and read offline —
see `21_PUBLISHING.md`. Every runtime dependency is a future maintenance and offline-compatibility liability; the
bar for adding one is high. Dev-time tooling (linting, testing) is held to a much lower bar since it never reaches
the browser, but should still stay minimal — see DR-021 for why ESLint/Prettier were added without extra plugin
dependencies.

## JavaScript conventions

- Prefer small, named, pure functions over inline anonymous logic — especially for rendering (see
  `10_COMPONENT_LIBRARY.md` for the specific render function contract).
- Functions that build HTML should return a string or DOM node; they should not also fetch data or mutate global
  state. Keep "get data," "render data," and "wire up events" as separate steps.
- Use `const` by default; use `let` only for values that are genuinely reassigned. Avoid `var`.
- Name functions and variables for what they represent (`companyCard`, not `rc` or `doIt`).
- Avoid deeply nested template literals building HTML — once a template literal needs more than ~2 levels of
  nested `.map()`, extract a helper function per nested piece.
- **Namespace, don't add bare globals.** Every file under `assets/js/` is a single object (`Render`, `Search`,
  `CompanyFilters`, `UI`, `Icons`, `App`) with methods, not separate top-level `function` declarations — see
  `10_COMPONENT_LIBRARY.md`'s "Module boundary" rule and `03_ARCHITECTURE.md`'s script-load-order section. If a new
  concern needs a home, add a method to the most relevant existing namespace, or introduce a new one following the
  same `const X = {...}` + `window.X` / `module.exports` guard pattern — never a bare top-level function or
  variable. ESLint (`eslint.config.js`) enforces this indirectly via `no-undef`: cross-file namespace references
  that aren't declared as globals there will fail `npm run lint`.
- **Escape interpolated values.** Any value interpolated into a template literal that is plain text or an HTML
  attribute must go through `Render.escapeHtml()` first. The one exception is content explicitly modeled as raw
  HTML (e.g. a chapter's `body` field, per `09_DATA_MODEL.md`) — never escape that, or it will render as literal
  text instead of formatted content.

## HTML conventions

- Use semantic elements (`<section>`, `<nav>`, `<header>`, `<main>`, `<aside>`, `<table>`) — not `<div>` soup —
  both for accessibility and because print/PDF export depends on real document structure (see `21_PUBLISHING.md`).
- Every interactive control needs an accessible name (label, `aria-label`, or visible text) — see
  `20_ACCESSIBILITY.md`.
- IDs used for in-page navigation (`#ch0`, `#search`, etc.) must stay stable once published, since they may be
  bookmarked or linked externally.

## CSS conventions

- All styling lives in `assets/css/site.css` — design tokens as CSS custom properties under `[data-theme="light"]`
  / `[data-theme="dark"]`, then component-scoped classes (`.company-table`, `.filter-chip`, etc.). No inline
  `<style>` blocks, no CSS framework or CDN.
- Prefer extending an existing token/class over inventing a new one-off value; check `08_UI_GUIDELINES.md` for the
  established spacing/color/radius scale before adding a new custom property.
- Respect dark mode: any new visual element must have both light and dark styling before it ships.

## Anti-patterns

- Embedding content data (company names, chapter text) directly in JavaScript — see `09_DATA_MODEL.md`.
- Copy-pasting a block of markup to create a "variant" instead of parameterizing a render function.
- Adding a dependency "just this once" without a decision record.
- Writing JavaScript that only works after a build step (ES modules requiring bundling, JSX, etc.).
- Adding a new top-level `function` or `var` instead of a method on an existing/new namespace object.
- Interpolating a value into markup without `Render.escapeHtml()` (outside the documented raw-HTML exception).
- Duplicating a list/lookup table that already exists on another namespace (e.g. re-typing sort options instead of
  reading `CompanyFilters.SORT_OPTIONS`) — this drifts silently; see DR-021 and the M13 `12_DECISIONS.md` entries
  for a real instance the audit caught.

## Checklist before committing a code change

- [ ] No new runtime dependency without a decision record (dev-only tooling in `devDependencies` is fine).
- [ ] No content hardcoded in JS that belongs in `data/*.json`.
- [ ] Works with no build step — served over plain HTTP (`npx serve` or similar; see `17_TESTING_GUIDE.md`). Opening
      `index.html` via `file://` will not fetch `data/*.json` due to browser CORS — that is expected, not a bug.
- [ ] Dark mode and print mode both checked.
- [ ] Keyboard-navigable and screen-reader-labeled (see `20_ACCESSIBILITY.md`).
- [ ] New render logic is a `Render` method, not a bare global function.
- [ ] Interpolated values are escaped via `Render.escapeHtml()` unless explicitly raw HTML content.
- [ ] `npm run lint` passes (ESLint + Prettier — also enforced by CI and the local pre-commit hook; see DR-021).
- [ ] If render logic changed, `node scripts/verify-render.js` still reports a match (or an intentional, understood
      difference) — see `17_TESTING_GUIDE.md`.
- [ ] If any `data/*.json` file or `index.html`'s static shell changed, ran `npm run prerender` and committed the
      regenerated `index.html`/`sitemap.xml`/`robots.txt` (`scripts/verify-prerender.js`, part of `npm run verify`
      and the pre-commit hook, fails the build otherwise — see DR-022).
