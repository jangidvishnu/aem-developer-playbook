# Architecture

## Current architecture (as of Milestone 1)

```
index.html   Markup + Tailwind (CDN) + inline <style> + inline <script>
             The <script> block defines a PLAYBOOK object (chapters + companies),
             then builds the sidebar TOC and main content sections directly as
             template-literal HTML strings assigned to innerHTML.
md/          Raw, unverified research markdown — not consumed by index.html today.
data/        Empty skeleton — target location for JSON content sources (Milestone 3+).
assets/      Empty skeleton — target location for static assets (Milestone 2+).
assets/js/   Empty skeleton — target location for extracted JS modules (Milestone 2+).
.playbook/   Documentation and governance (this directory).
.github/     Repository automation and AI-agent instructions.
```

## Known architecture violation (tracked, not yet fixed)

`index.html` currently hardcodes all content (chapters and companies) directly in JavaScript, and builds the DOM
with one inline loop rather than named render functions. This directly contradicts the target architecture below
and the "never hardcode content" rule in `01_AI_CONSTITUTION.md`. It is intentionally left as-is in Milestone 1.
Per `12_DECISIONS.md` DR-003, this is fixed in two separate steps rather than one: Milestone 2 replaces the inline
loop with named render functions while the data stays exactly where it is, and Milestone 3 moves that data out of
`index.html` into `data/*.json`. Doing both in one milestone would violate the "one milestone at a time" rule.

## Target architecture (Milestones 2–4)

```
data/*.json         Structured content: chapters, companies, technologies, roadmaps,
                     resources, career_paths, glossary, templates, interviews.
                     Schemas defined in 09_DATA_MODEL.md and 11_COMPANY_SCHEMA.md.
assets/js/render.js  Named render functions (renderSidebar, renderChapter, renderHero,
                     renderRoadmap, renderCompanyTable, renderCompanyCard, renderSearch,
                     renderFooter, renderDashboard). Contract defined in 10_COMPONENT_LIBRARY.md.
index.html           Thin shell: markup skeleton, fetch() calls into data/*.json,
                     calls into assets/js/render.js. No content, no business logic.
```

### Data flow (target state)

1. `index.html` loads and calls `fetch()` against the relevant `data/*.json` file(s) for the current view.
2. Fetched data is passed into the matching render function (e.g. `renderChapter(chapterData)`).
3. Render functions return or inject HTML into designated container elements — they do not own or mutate the
   underlying data.
4. Global search (`08_UI_GUIDELINES.md`, Milestone 5) indexes the same `data/*.json` sources directly, rather than
   scraping already-rendered DOM text as today's implementation does.

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
