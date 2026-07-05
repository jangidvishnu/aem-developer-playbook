# Component Library

## Status

This document specifies the **target** rendering contract per `MASTER_BOOTSTRAP_PROMPT.md`. As of Milestone 2 (plus
its post-review debt remediation), `Render.sidebar`, `Render.chapter`, `Render.companyTable`, and `Render.companyRow`
are **implemented** in `index.html` as methods on a single `Render` namespace object — not bare global functions —
so the global scope only gains one new name as this set grows (see the "Module boundary" rule below). Data still
stays inline (see `12_DECISIONS.md` DR-003). The remaining functions (`Render.hero`, `Render.roadmap`,
`Render.dashboard`, `Render.footer`, `Render.search`) are still planned for Milestone 4, once Milestone 3 gives them
a real data source to render. Milestone 4 is also the point at which the whole `Render` namespace should move from
`index.html`'s inline `<script>` into `assets/js/render.js` (loaded via a plain `<script src>` tag — still no build
step), since that milestone already touches every render function.

## Principle

Every recurring piece of UI is a named, reusable render function that takes data in and returns/injects markup. No
duplicated HTML across the codebase — if two places need similar markup, they call the same function.

## Planned render functions

| Function | Input | Responsibility | Status |
|---|---|---|---|
| `Render.sidebar(chapters)` | array of chapter summaries | Table of contents links + project status panel | **Implemented** |
| `Render.dashboard(stats)` | summary stats object | Landing/overview panel (progress, counts) | Planned |
| `Render.chapter(chapter, index, companies)` | one chapter object, its index, the companies array (for the one chapter that embeds a company table) | Full chapter section: heading, metadata, summary, body | **Implemented** |
| `Render.hero(content)` | hero copy | The welcome/intro banner section | Planned |
| `Render.roadmap(roadmap)` | one roadmap object | Ordered list/timeline of a learning roadmap | Planned |
| `Render.companyTable(companies)` | array of company objects | Table view of companies, delegating each row to `companyRow` | **Implemented** |
| `Render.companyRow(company)` | one company object | Single table row within `companyTable` | **Implemented** |
| `Render.companyCard(company)` | one company object | Compact card view of a single company (for grid/detail views) | Planned |
| `Render.search(index)` | search index | Search input + ranked result rendering | Planned |
| `Render.footer()` | — | Site footer | Planned |
| `Render.escapeHtml(value)` | any value | Shared HTML-escaping helper — every other function must route interpolated text/attribute values through this | **Implemented** |

## Function contract rules

- Pure with respect to data: a render function reads its input and returns/injects markup — it does not fetch data,
  mutate its input, or reach into unrelated global state. `Render.chapter` receives `companies` as an explicit
  parameter rather than reading `PLAYBOOK.companies` itself, precisely so this rule holds.
- Each function owns exactly one visual concern. If a function starts handling two unrelated pieces of UI, split it.
- Functions that render a collection (`companyTable`) should call the corresponding single-item function
  (`companyCard` or a row-equivalent) internally rather than duplicating its markup inline.
- Every function must produce markup that is theme-aware (works in light and dark mode) and print-safe by default,
  not as an afterthought.
- **Escaping:** any interpolated value that is plain text or goes into an HTML attribute must be passed through
  `Render.escapeHtml()` first. The one documented exception is a chapter's `body` field, which is intentionally raw
  HTML content (see `09_DATA_MODEL.md`) and must never be escaped.
- **Module boundary:** all render functions live as methods on the single `Render` object — never as additional
  bare top-level functions/globals. This keeps the global scope from accumulating one new name per function as more
  are added in Milestone 4+.

## Current state vs. target

As of this remediation pass, `index.html` calls `Render.sidebar(PLAYBOOK.chapters)` once and
`PLAYBOOK.chapters.map((c, i) => Render.chapter(c, i, PLAYBOOK.companies))` once, rather than building both in a
single inline `forEach`. `Render.chapter` receives `companies` explicitly, so the previous coupling to
`PLAYBOOK.companies` (flagged in the pre-Milestone-2 technical debt report) is resolved. Verified byte-identical to
the pre-Milestone-1 baseline via `scripts/verify-render.js` (see `17_TESTING_GUIDE.md`).

## Anti-patterns

- A render function that also performs a `fetch()` — separate data loading from rendering.
- Two functions producing near-identical markup with minor differences instead of one parameterized function.
- Inline `onclick="..."` handlers in generated markup instead of attaching listeners after render (keeps content
  data free of behavior, and works whether content came from JSON or was hardcoded).
- Interpolating a value into markup without `Render.escapeHtml()` (except the documented raw-HTML `body` exception).
- Adding a new render function as a bare global instead of a `Render` method.

## Migration plan

1. ~~**Milestone 2:** extract the sidebar-building code into `Render.sidebar()`.~~ Done.
2. ~~**Milestone 2:** extract the per-chapter block into `Render.chapter()`, called once per item from a simple
   loop.~~ Done.
3. ~~**Milestone 2:** extract the company-table branch into `Render.companyTable()` / `Render.companyRow()`.~~ Done.
4. ~~**Post-Milestone-2 remediation:** pass `companies` into `Render.chapter()` explicitly; add `Render.escapeHtml()`
   and route all text/attribute interpolation through it; wrap every function in the `Render` namespace instead of
   bare globals.~~ Done.
5. **Milestone 4** (after Milestone 3 populates `data/*.json`): add render functions for content types that don't
   exist in the UI yet (hero, roadmap, dashboard, footer, search), and move the whole `Render` namespace into
   `assets/js/render.js`.
