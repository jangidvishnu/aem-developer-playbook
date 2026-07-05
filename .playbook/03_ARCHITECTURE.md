# Architecture

## Current architecture (as of Milestone 2 + remediation)

```
index.html   Markup + Tailwind (CDN) + inline <style> + inline <script>
             The <script> block defines a PLAYBOOK object (chapters + companies) and a
             Render namespace (Render.sidebar, Render.chapter, Render.companyTable,
             Render.companyRow, Render.escapeHtml). index.html calls Render's functions
             to build the sidebar TOC and main content sections; data still lives inline.
scripts/     Dev-only tooling, never shipped to the site (e.g. verify-render.js — a
             regression check for the render functions above; see 17_TESTING_GUIDE.md).
md/          Raw, unverified research markdown — not consumed by index.html today.
data/        Empty skeleton — target location for JSON content sources (Milestone 3+).
assets/      Empty skeleton — target location for static assets (Milestone 4+).
assets/js/   Empty skeleton — target location for the Render namespace once it moves out
             of index.html (Milestone 4, alongside the remaining render functions).
.playbook/   Documentation and governance (this directory).
.github/     Repository automation and AI-agent instructions.
```

## Known architecture gap (tracked, not yet fixed)

`index.html` still hardcodes all content (chapters and companies) directly in JavaScript — the data-separation half
of the original "known architecture violation" here. The rendering half (named functions instead of one inline
loop, and no function reading global state it wasn't given) was resolved in Milestone 2 and its post-review
remediation: `Render.chapter` now receives `companies` as an explicit parameter rather than reading
`PLAYBOOK.companies` itself. Per `12_DECISIONS.md` DR-003, the data-separation half is Milestone 3's job — moving
`PLAYBOOK.chapters`/`PLAYBOOK.companies` into `data/*.json`. Doing both in one milestone would have violated the
"one milestone at a time" rule.

## Target architecture (Milestones 3–4)

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

### Data flow (target state)

1. `index.html` loads and calls `fetch()` against the relevant `data/*.json` file(s) for the current view.
2. Fetched data is passed into the matching render function (e.g. `Render.chapter(chapterData)`).
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
