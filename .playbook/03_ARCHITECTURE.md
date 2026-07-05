# Architecture

## Current architecture (as of Milestone 3)

```
index.html   Markup + Tailwind (CDN) + inline <style> + inline <script>
             The <script> block fetches data/chapters.json and data/companies.json in
             parallel, then passes the results into a Render namespace (Render.sidebar,
             Render.chapter, Render.companyTable, Render.companyRow, Render.escapeHtml)
             that builds the sidebar TOC and main content sections. No content data
             remains hardcoded in index.html.
data/        data/chapters.json, data/companies.json — real content, fetched at load.
             Not yet fully conformant to 09_DATA_MODEL.md/11_COMPANY_SCHEMA.md's full
             field set (deliberately deferred to Milestone 6 — see 12_DECISIONS.md).
scripts/     Dev-only tooling, never shipped to the site (e.g. verify-render.js — a
             regression check that reads the real data/*.json files; see 17_TESTING_GUIDE.md).
md/          Raw, unverified research markdown — not consumed by index.html today.
assets/      Empty skeleton — target location for static assets (Milestone 4+).
assets/js/   Empty skeleton — target location for the Render namespace once it moves out
             of index.html (Milestone 4, alongside the remaining render functions).
.playbook/   Documentation and governance (this directory).
.github/     Repository automation and AI-agent instructions.
```

**Note:** `index.html` must be served over HTTP for local viewing as of Milestone 3 — `fetch()` against `file://`
is blocked by browser CORS policy. See `12_DECISIONS.md` DR-005 and `17_TESTING_GUIDE.md`.

## Known architecture gap — resolved

`index.html` used to hardcode all content (chapters and companies) directly in JavaScript. The rendering half
(named functions instead of one inline loop, no function reading global state it wasn't given) was resolved in
Milestone 2. The data-separation half — moving `PLAYBOOK.chapters`/`PLAYBOOK.companies` into `data/*.json` — was
resolved in Milestone 3. `index.html` now contains no content data at all, only markup, styling, and rendering
logic, satisfying `01_AI_CONSTITUTION.md`'s "never hardcode content" rule in full.

## Target architecture (Milestone 4)

```
data/*.json         Structured content: chapters, companies, technologies, roadmaps,
                     resources, career_paths, glossary, templates, interviews.
                     Schemas defined in 09_DATA_MODEL.md and 11_COMPANY_SCHEMA.md.
assets/js/render.js  The Render namespace (Render.sidebar, Render.chapter, Render.hero,
                     Render.roadmap, Render.companyTable, Render.companyCard, Render.search,
                     Render.footer, Render.dashboard, Render.escapeHtml). Contract defined
                     in 10_COMPONENT_LIBRARY.md. Moves here from inline index.html in
                     Milestone 4.
index.html           Thin shell: markup skeleton, fetch() calls into data/*.json,
                     calls into assets/js/render.js. No content, no business logic.
```

### Data flow

1. `index.html` loads and calls `fetch()` against `data/chapters.json` and `data/companies.json` in parallel
   (`Promise.all`) — **implemented as of Milestone 3**.
2. Fetched data is passed into the matching render function (e.g. `Render.chapter(chapter, index, companies)`).
3. Render functions return or inject HTML into designated container elements — they do not own or mutate the
   underlying data.
4. Global search (`08_UI_GUIDELINES.md`, Milestone 5) will index the same `data/*.json` sources directly, rather
   than scraping already-rendered DOM text as today's implementation still does — **not yet implemented**.

## Constraints that shape every architectural decision

- No build step — the site must run by opening `index.html` directly or serving static files as-is.
- No frameworks — vanilla JS and Tailwind (CDN) only.
- GitHub Pages, offline, responsive, accessible, and print-friendly at all times.
- Renderer reads data; UI never owns data (data and presentation stay separable at every layer).

## Why a single HTML file is acceptable (for now)

A single-file, no-build architecture maximizes portability (works offline, works unmodified on GitHub Pages, easy
to fork) at the cost of scalability. This is an accepted trade-off while content volume is small. If/when the data
model and content volume genuinely outgrow a single file (tracked as a future decision, not a current one), that
change would go through `12_DECISIONS.md` before being implemented.
