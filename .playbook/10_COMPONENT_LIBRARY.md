# Component Library

## Status

This document specifies the **target** rendering contract per `MASTER_BOOTSTRAP_PROMPT.md`. As of Milestone 2,
`renderSidebar`, `renderChapter`, and `renderCompanyTable` are **implemented** in `index.html` as named, top-level
functions (data still stays inline — see `12_DECISIONS.md` DR-003). A `renderCompanyRow(company)` helper was added
alongside `renderCompanyTable` for the per-row markup; it is distinct from `renderCompanyCard` below, which remains
unimplemented and reserved for a future compact card/grid view. The remaining functions (`renderHero`,
`renderRoadmap`, `renderDashboard`, `renderFooter`, `renderSearch`) are still planned for Milestone 4, once
Milestone 3 gives them a real data source to render.

## Principle

Every recurring piece of UI is a named, reusable render function that takes data in and returns/injects markup. No
duplicated HTML across the codebase — if two places need similar markup, they call the same function.

## Planned render functions

| Function | Input | Responsibility | Status |
|---|---|---|---|
| `renderSidebar(chapters)` | array of chapter summaries | Table of contents links + project status panel | **Implemented** |
| `renderDashboard(stats)` | summary stats object | Landing/overview panel (progress, counts) | Planned |
| `renderChapter(chapter, index)` | one chapter object, its index | Full chapter section: heading, metadata, summary, body | **Implemented** |
| `renderHero(content)` | hero copy | The welcome/intro banner section | Planned |
| `renderRoadmap(roadmap)` | one roadmap object | Ordered list/timeline of a learning roadmap | Planned |
| `renderCompanyTable(companies)` | array of company objects | Sortable/filterable table view of companies | **Implemented** |
| `renderCompanyRow(company)` | one company object | Single table row within `renderCompanyTable` | **Implemented** |
| `renderCompanyCard(company)` | one company object | Compact card view of a single company (for grid/detail views) | Planned |
| `renderSearch(index)` | search index | Search input + ranked result rendering | Planned |
| `renderFooter()` | — | Site footer | Planned |

## Function contract rules

- Pure with respect to data: a render function reads its input and returns/injects markup — it does not fetch data,
  mutate its input, or reach into unrelated global state.
- Each function owns exactly one visual concern. If a function starts handling two unrelated pieces of UI, split it.
- Functions that render a collection (`renderCompanyTable`) should call the corresponding single-item function
  (`renderCompanyCard` or a row-equivalent) internally rather than duplicating its markup inline.
- Every function must produce markup that is theme-aware (works in light and dark mode) and print-safe by default,
  not as an afterthought.

## Current state vs. target

As of Milestone 2, `index.html` calls `renderSidebar(PLAYBOOK.chapters)` once and `PLAYBOOK.chapters.map(renderChapter)`
once, rather than building both in a single inline `forEach`. `renderChapter` still reads `PLAYBOOK.companies`
directly (not as a parameter) when it encounters a `companyTable` chapter — this is the pre-existing coupling
described in `03_ARCHITECTURE.md`'s "known architecture violation" section, preserved as-is rather than fixed, per
Milestone 2's explicit "do not expand scope" constraint. This remains a known gap, not a regression.

## Anti-patterns

- A render function that also performs a `fetch()` — separate data loading from rendering.
- Two functions producing near-identical markup with minor differences instead of one parameterized function.
- Inline `onclick="..."` handlers in generated markup instead of attaching listeners after render (keeps content
  data free of behavior, and works whether content came from JSON or was hardcoded).

## Migration plan

1. ~~**Milestone 2:** extract the sidebar-building code into `renderSidebar()`.~~ Done.
2. ~~**Milestone 2:** extract the per-chapter block into `renderChapter()`, called once per item from a simple loop.~~ Done.
3. ~~**Milestone 2:** extract the company-table branch into `renderCompanyTable()` / a row-level helper
   (`renderCompanyRow()`).~~ Done.
4. **Milestone 4** (after Milestone 3 populates `data/*.json`): add render functions for content types that don't
   exist in the UI yet (hero, roadmap, dashboard, footer, search).
