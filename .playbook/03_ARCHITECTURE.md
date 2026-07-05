# Architecture

## Current architecture (as of Milestone 5)

```
index.html          Thin shell: markup skeleton, Tailwind (CDN), inline <style>, boot <script>.
                    Fetches data/*.json in parallel, calls Render.* to populate containers.
                    Search index built once via Search.buildIndex; theme toggle is event wiring only.
assets/js/render.js The Render namespace — pure markup builders (see 10_COMPONENT_LIBRARY.md).
assets/js/search.js Search namespace — buildIndex, query, rank over data/*.json at load (Milestone 5).
data/               data/chapters.json, data/companies.json, data/site.json, data/roadmaps.json.
scripts/            verify-render.js, verify-search.js (dev-only; require render.js / search.js).
md/                 Raw, unverified research markdown — not consumed by index.html today.
.playbook/          Documentation and governance (this directory).
.github/            Repository automation and AI-agent instructions.
```

**Note:** `index.html` must be served over HTTP for local viewing — `fetch()` against `file://` is blocked by
browser CORS policy. See `12_DECISIONS.md` DR-005 and `17_TESTING_GUIDE.md`.

## Known architecture gaps — resolved

| Gap | Resolved in |
|---|---|
| Inline rendering loop | Milestone 2 — named `Render` functions |
| Hardcoded chapter/company data | Milestone 3 — `data/chapters.json`, `data/companies.json` |
| Hardcoded site chrome + inline `Render` namespace | Milestone 4 — `data/site.json`, `assets/js/render.js` |
| Naive DOM `innerText` search | Milestone 5 — `assets/js/search.js`, ranked JSON index |

## Target architecture (post-Milestone 4)

The renderer layer is complete for today's UI. Remaining target work is **search** (Milestone 5 — index
`data/*.json` directly instead of DOM scraping), **company intelligence** (Milestone 6), and **learning-system
content** (Milestone 7 — full `roadmaps.json`, `technologies.json`, etc.).

```
data/*.json         All structured content; schemas in 09_DATA_MODEL.md and 11_COMPANY_SCHEMA.md.
assets/js/render.js Render namespace — contract in 10_COMPONENT_LIBRARY.md.
index.html          Thin shell only: fetch + event wiring.
```

### Data flow

1. `index.html` loads `assets/js/render.js`, then `fetch()`es `data/chapters.json`, `data/companies.json`,
   `data/site.json`, and `data/roadmaps.json` in parallel (`Promise.all`).
2. Fetched data is passed into the matching `Render` method; returned markup is injected into container elements.
3. Render functions do not own or mutate the underlying data.
4. Global search (Milestone 5) will index `data/*.json` directly rather than scraping rendered DOM text.

## Constraints that shape every architectural decision

- No build step — static files served as-is (GitHub Pages compatible).
- No frameworks — vanilla JS and Tailwind (CDN) only.
- GitHub Pages, offline, responsive, accessible, and print-friendly at all times.
- Renderer reads data; UI never owns data (data and presentation stay separable at every layer).

## Why a single HTML file is acceptable (for now)

A single-file shell plus one JS module plus JSON data files maximizes portability (works offline when served,
works unmodified on GitHub Pages, easy to fork) at the cost of scalability. This is an accepted trade-off while
content volume is small. If/when the data model and content volume genuinely outgrow this layout, that change
would go through `12_DECISIONS.md` before being implemented.
