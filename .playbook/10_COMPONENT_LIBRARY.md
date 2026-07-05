# Component Library

## Status

This document specifies the rendering contract per `MASTER_BOOTSTRAP_PROMPT.md`. As of Milestone 4, the full
`Render` namespace lives in `assets/js/render.js` (loaded via `<script src>` — still no build step) and is also
`require()`'d by `scripts/verify-render.js`. All site-chrome and content render functions listed below are
**implemented** except `Render.companyCard` (no UI or data source yet — Milestone 6 or later).

`Render.search` is implemented for **header chrome only** in Milestone 4 (the `<input>` markup). Ranked,
multi-source search results are Milestone 5 — see the `Render.search` row below.

## Principle

Every recurring piece of UI is a named, reusable render function that takes data in and returns/injects markup. No
duplicated HTML across the codebase — if two places need similar markup, they call the same function.

## Render functions

| Function | Input | Responsibility | Status |
|---|---|---|---|
| `Render.pageHeader(meta)` | `{ title, versionLabel }` | Header `<h1>` and version line | **Implemented** |
| `Render.search(config)` | `{ placeholder, ariaLabel }` | Search `<input>` markup only (Milestone 4); ranked results → Milestone 5 | **Implemented** (chrome) |
| `Render.sidebar(chapters)` | array of chapter summaries | Table of contents links | **Implemented** |
| `Render.dashboard(stats)` | `{ title, items[] }` | Sidebar project-status panel | **Implemented** |
| `Render.hero(content)` | `{ title, body }` | Welcome/intro banner section | **Implemented** |
| `Render.roadmap(roadmap)` | one roadmap object | Ordered learning-path panel | **Implemented** |
| `Render.chapter(chapter, index, companies)` | one chapter, its index, companies array | Full chapter section | **Implemented** |
| `Render.companyTable(companies)` | array of company objects | Table view, delegating rows to `companyRow` | **Implemented** |
| `Render.companyRow(company)` | one company object | Single table row | **Implemented** |
| `Render.companyCard(company)` | one company object | Compact card view (grid/detail) | Planned |
| `Render.footer(footer)` | `{ text }` | Site footer | **Implemented** |
| `Render.escapeHtml(value)` | any value | Shared HTML-escaping helper | **Implemented** |

## Function contract rules

- Pure with respect to data: a render function reads its input and returns/injects markup — it does not fetch data,
  mutate its input, or reach into unrelated global state. `Render.chapter` receives `companies` as an explicit
  parameter rather than reading a global companies array itself, precisely so this rule holds.
- Each function owns exactly one visual concern. If a function starts handling two unrelated pieces of UI, split it.
- Functions that render a collection (`companyTable`) should call the corresponding single-item function
  (`companyCard` or a row-equivalent) internally rather than duplicating its markup inline.
- Every function must produce markup that is theme-aware (works in light and dark mode) and print-safe by default,
  not as an afterthought.
- **Escaping:** any interpolated value that is plain text or goes into an HTML attribute must be passed through
  `Render.escapeHtml()` first. The one documented exception is a chapter's `body` field, which is intentionally raw
  HTML content (see `09_DATA_MODEL.md`) and must never be escaped.
- **Module boundary:** all render functions live as methods on the single `Render` object in `assets/js/render.js` —
  never as additional bare top-level functions/globals.

## Current state

`index.html` is a thin shell: it fetches `data/chapters.json`, `data/companies.json`, `data/site.json`, and
`data/roadmaps.json` in parallel, then calls the matching `Render` methods to populate header, sidebar, main, and
footer containers. Theme toggle and the naive search filter (`oninput` over `main section` text) remain event wiring
in `index.html` — not render functions. Chapter/sidebar output is verified against a Milestone 3 golden snapshot
via `scripts/verify-render.js` (see `17_TESTING_GUIDE.md`).

## Anti-patterns

- A render function that also performs a `fetch()` — separate data loading from rendering.
- Two functions producing near-identical markup with minor differences instead of one parameterized function.
- Inline `onclick="..."` handlers in generated markup instead of attaching listeners after render (keeps content
  data free of behavior, and works whether content came from JSON or was hardcoded).
- Interpolating a value into markup without `Render.escapeHtml()` (except the documented raw-HTML `body` exception).
- Adding a new render function as a bare global instead of a `Render` method.

## Migration plan

1. ~~**Milestone 2:** extract sidebar, chapter, company table into `Render.*`.~~ Done.
2. ~~**Post-Milestone-2 remediation:** `Render.escapeHtml`, explicit `companies` param, namespace wrapper.~~ Done.
3. ~~**Milestone 4:** hero, roadmap, dashboard, footer, search chrome, `pageHeader`; move namespace to
   `assets/js/render.js`.~~ Done.
4. **Milestone 5:** evolve `Render.search` to accept a search index and render ranked results.
