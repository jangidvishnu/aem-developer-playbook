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
| `Render.pageHeader(meta, options)` | `{ title, shortTitle, versionLabel }` | Header wordmark; version line in dev only | **Implemented** |
| `Render.disclaimer(content, header)` | disclaimer object + header | Research data notice + optional PR link | **Implemented** (M11) |
| `Render.search(config)` | `{ placeholder, ariaLabel }` | Search input, facet bar, and results panel wrapper | **Implemented** (M9 facets) |
| `Render.searchFacets(state)` | filter state object | Source-type chips + active table-filter hint in search panel | **Implemented** (M9) |
| `Render.searchResults(results, query, activeIndex)` | ranked results array, query string, active index | Accessible results listbox markup | **Implemented** |
| `Render.sidebar(chapters)` | array of chapter summaries | Table of contents links | **Implemented** |
| `Render.sidebarGrouped(chapters, groups)` | chapters + nav groups | Grouped sidebar with collapsible sections | **Implemented** (M11) |
| `Render.companyStats(companies)` | companies array | Hero stat card counts | **Implemented** (M11) |
| `Render.uiSelect(key, label, options, current)` | filter key, label, options | Custom dropdown markup + hidden input | **Implemented** (M11) |
| `Render.companySection(companies, options)` | filtered companies + opts | Unified explorer card (metrics, toolbar, body, pagination) | **Implemented** (M11) |
| `Render.companyDataBody(companies, options)` | page slice | Table + cards with pad rows | **Implemented** (M11) |
| `Render.paginationBar(page, total, pageSize, attr, label)` | page state | Shared Prev/Next bar (companies + learning) | **Implemented** (M17) |
| `Render.companyPagination(page, total, attr)` | page state | Company wrapper around `paginationBar` | **Implemented** (M11) |
| `Render.companyCard(company)` | one company object | Mobile card view | **Implemented** (M11) |
| `Render.icon(name)` | icon id | Delegates to `Icons.svg` when loaded | **Implemented** (M11) |
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
| `Render.ownerPlaybook(playbook)` | owner playbook object | Owner apply/workflow section cards | **Implemented** (M10) |
| `Render.resourcesList(resources)` | resources array | Curated link list | **Implemented** (M7) |
| `Render.chapter(chapter, index, ctx)` | chapter, index, `{ companies, learning }` | Full chapter section + embeds | **Implemented** |
| `Render.companyTable(companies)` | array of company objects | Table view, delegating rows to `companyRow` | **Implemented** |
| `Render.companyRow(company)` | one company object | Single table row | **Implemented** |
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

## Filter module (`assets/js/filters.js`)

| Function | Responsibility | Status |
|---|---|---|
| `CompanyFilters.defaultState()` | Empty filter state (table + search) | **Implemented** (M9 extended) |
| `CompanyFilters.matchesCompany(co, state)` | Single-company predicate | **Implemented** (M9) |
| `CompanyFilters.filter(companies, state)` | Filter company array | **Implemented** |
| `CompanyFilters.filterSearchResults(results, byId, state)` | Intersect ranked search with facets | **Implemented** (M9) |
| `CompanyFilters.parseUrlState(search)` / `serializeUrlState(state, q)` | Shareable URL round-trip | **Implemented** (M9) |
| `CompanyFilters.apply(companies, state)` | Filter + sort | **Implemented** |

## UI module (`assets/js/ui.js`)

| Function | Responsibility | Status |
|---|---|---|
| `UI.initTheme(toggleId)` | `data-theme` light/dark + `localStorage` | **Implemented** (M11) |
| `UI.wireScrollSpy()` | Active `.doc-nav__link` from section visibility | **Implemented** (M11) |
| `UI.wireSelects(root)` | Custom select open/close + hidden input sync | **Implemented** (M11) |
| `UI.wireNavDrawer()` | Mobile sidebar toggle + backdrop | **Implemented** (M11) |
| `UI.wireNavGroups()` | Collapsible sidebar groups | **Implemented** (M11) |
| `UI.wireCommandPalette(ctx)` | Ctrl/Cmd+K modal search | **Implemented** (M11) |

## Icons module (`assets/js/icons.js`)

| Function | Responsibility | Status |
|---|---|---|
| `Icons.svg(name, className)` | Inline Lucide-style SVG string | **Implemented** (M11) |

## Current state

`index.html` fetches JSON, builds a search index once via `Search.buildIndex`, and wires input/keyboard events to
`Search.query` + `CompanyFilters.filterSearchResults` + `Render.searchResults`. Desktop and mobile search instances use
distinct element IDs (`Render.search` optional `idSuffix`). `UI.wireCommandPalette` provides a second search surface.
A shared `filterState` drives both the company explorer toolbar and search-panel facets; changes sync to the URL via
`history.replaceState` (M9). Page sections stay visible while searching; activating a result scrolls to the target.
Verified via `scripts/verify-filters.js`, `scripts/verify-search.js`, and `scripts/verify-render.js`.

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
