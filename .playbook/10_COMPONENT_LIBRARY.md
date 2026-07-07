# Component Library

## Status

This document specifies the rendering contract per `MASTER_BOOTSTRAP_PROMPT.md`. As of Milestone 7, the `Render`
namespace lives in `assets/js/render.js` and ranked search lives in `assets/js/search.js` (both loaded via
`<script src>` — still no build step). `Render.companyCard` remains planned.

## Principle

Every recurring piece of UI is a named, reusable render function that takes data in and returns/injects markup. No
duplicated HTML across the codebase — if two places need similar markup, they call the same function.

## Render functions

| Function | Input | Responsibility | Status |
|---|---|---|---|
| `Render.pageHeader(meta)` | `{ title, versionLabel }` | Header `<h1>` and version line | **Implemented** |
| `Render.search(config)` | `{ placeholder, ariaLabel }` | Search input + results panel wrapper | **Implemented** |
| `Render.searchResults(results, query, activeIndex)` | ranked results array, query string, active index | Accessible results listbox markup | **Implemented** |
| `Render.sidebar(chapters)` | array of chapter summaries | Table of contents links | **Implemented** |
| `Render.dashboard(stats)` | `{ title, items[] }` | Sidebar project-status panel | **Implemented** |
| `Render.hero(content)` | `{ title, body }` | Welcome/intro banner section | **Implemented** |
| `Render.roadmap(roadmap)` | one roadmap object | Single learning-path panel (delegates to `roadmapPanel`) | **Implemented** |
| `Render.roadmapList(roadmaps)` | array of roadmap objects | All learning paths with `#roadmap-{id}` anchors | **Implemented** (M7) |
| `Render.roadmapPanel(roadmap)` | one roadmap object | One roadmap section markup | **Implemented** (M7) |
| `Render.glossaryTable(terms, options)` | glossary array | Paginated term table | **Implemented** (M7) |
| `Render.technologyTable(technologies, options)` | technologies array | Paginated technology reference | **Implemented** (M7) |
| `Render.careerPaths(paths)` | career_paths array | Career track cards | **Implemented** (M7) |
| `Render.interviewList(items, options)` | interviews array | Paginated interview prep table | **Implemented** (M7) |
| `Render.templatesList(templates)` | templates array | Template cards | **Implemented** (M7) |
| `Render.resourcesList(resources)` | resources array | Curated link list | **Implemented** (M7) |
| `Render.chapter(chapter, index, ctx)` | chapter, index, `{ companies, learning }` | Full chapter section + embeds | **Implemented** |
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
- **Module boundary:** render functions live on `Render` in `assets/js/render.js`; search indexing/querying lives
  on `Search` in `assets/js/search.js` — never as additional bare globals.

## Search module (`assets/js/search.js`)

| Function | Responsibility | Status |
|---|---|---|
| `Search.buildIndex(sources)` | Build in-memory index from fetched `data/*.json` | **Implemented** |
| `Search.query(index, query)` | Return ranked result objects with scores | **Implemented** |
| `Search.rank(tokens, entry)` | Score one index entry (title > summary/tags > body) | **Implemented** |

## Current state

`index.html` fetches JSON, builds a search index once via `Search.buildIndex`, and wires input/keyboard events to
`Search.query` + `Render.searchResults`. Page sections stay visible while searching; activating a result scrolls to
the target. Verified via `scripts/verify-search.js` and
`scripts/verify-render.js`.

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
4. ~~**Milestone 5:** `Search` module + `Render.searchResults`; ranked multi-source search.~~ Done.
5. **Milestone 7:** learning data files, chapter embeds, `verify-learning.js` — in progress.
