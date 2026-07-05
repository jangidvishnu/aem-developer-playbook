# Architecture

## Current architecture (as of Milestone 4)

```
index.html          Thin shell: markup skeleton, Tailwind (CDN), inline <style>, boot <script>.
                    Fetches data/*.json in parallel, calls Render.* to populate containers.
                    Theme toggle and naive search filter are event wiring only — not render functions.
assets/js/render.js The Render namespace — all pure markup builders (see 10_COMPONENT_LIBRARY.md).
                    Loaded via <script src>; also require()'d by scripts/verify-render.js.
data/               data/chapters.json, data/companies.json — handbook content (Milestone 3).
                    data/site.json — site chrome: header, hero, dashboard, footer, search config (Milestone 4).
                    data/roadmaps.json — minimal learning-path seed (Milestone 4; full content → Milestone 7).
                    Chapters/companies not yet fully conformant to 09_DATA_MODEL.md/11_COMPANY_SCHEMA.md
                    (deferred to Milestone 6 — see 12_DECISIONS.md).
scripts/            Dev-only tooling (verify-render.js reads render.js + data/*.json directly).
md/                 Raw, unverified research markdown — not consumed by index.html today.
assets/             Static assets; js/render.js is the first real file in this tree.
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
