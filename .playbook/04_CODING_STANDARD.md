# Coding Standard

## Stack constraints (non-negotiable)

- Vanilla JavaScript only — no React, Vue, jQuery, or similar frameworks.
- Tailwind CSS (currently via CDN) for styling — avoid hand-rolled CSS except for the small print/behavior rules
  that Tailwind can't express (see the `<style>` block in `index.html`).
- No build step. No bundler, no transpiler, no package.json dependency tree required to run the site.
- No JavaScript imports from external CDNs beyond what already exists (Tailwind, the Inter font) unless a decision
  record (`12_DECISIONS.md`) justifies the addition.

## Why

These constraints exist to guarantee the site can always be opened as a static file, served unmodified from GitHub
Pages, and read offline — see `21_PUBLISHING.md`. Every dependency is a future maintenance and offline-compatibility
liability; the bar for adding one is high.

## JavaScript conventions

- Prefer small, named, pure functions over inline anonymous logic — especially for rendering (see
  `10_COMPONENT_LIBRARY.md` for the specific render function contract).
- Functions that build HTML should return a string or DOM node; they should not also fetch data or mutate global
  state. Keep "get data," "render data," and "wire up events" as separate steps.
- Use `const` by default; use `let` only for values that are genuinely reassigned. Avoid `var`.
- Name functions and variables for what they represent (`renderCompanyCard`, not `rc` or `doIt`).
- Avoid deeply nested template literals building HTML — once a template literal needs more than ~2 levels of
  nested `.map()`, extract a helper function per nested piece.

## HTML conventions

- Use semantic elements (`<section>`, `<nav>`, `<header>`, `<main>`, `<aside>`, `<table>`) — not `<div>` soup —
  both for accessibility and because print/PDF export depends on real document structure (see `21_PUBLISHING.md`).
- Every interactive control needs an accessible name (label, `aria-label`, or visible text) — see
  `20_ACCESSIBILITY.md`.
- IDs used for in-page navigation (`#ch0`, `#search`, etc.) must stay stable once published, since they may be
  bookmarked or linked externally.

## CSS / Tailwind conventions

- Prefer Tailwind utility classes over custom CSS.
- Reserve the inline `<style>` block for things Tailwind cannot express: print rules, scroll-behavior, and small
  global resets. Keep it short — if it grows large, that's a signal a real stylesheet in `assets/` is due (raise as
  a decision, not a silent change).
- Respect dark mode: any new visual element must have both light and dark styling before it ships.

## Anti-patterns

- Embedding content data (company names, chapter text) directly in JavaScript — see `09_DATA_MODEL.md`.
- Copy-pasting a block of markup to create a "variant" instead of parameterizing a render function.
- Adding a dependency "just this once" without a decision record.
- Writing JavaScript that only works after a build step (ES modules requiring bundling, JSX, etc.).

## Checklist before committing a code change

- [ ] No new external dependency without a decision record.
- [ ] No content hardcoded in JS that belongs in `data/*.json`.
- [ ] Works with no build step (open `index.html` directly).
- [ ] Dark mode and print mode both checked.
- [ ] Keyboard-navigable and screen-reader-labeled (see `20_ACCESSIBILITY.md`).
