# Testing Guide

## Current state

No formal test suite exists yet (expected — there is no build tooling, and the product is a single static HTML
file). There is, however, one committed verification script: `scripts/verify-render.js` (Node, no dependencies).
Run it with `node scripts/verify-render.js` any time `index.html`'s `Render` namespace changes — it re-implements
the pre-Milestone-1 baseline rendering logic and diffs it against a manually-kept-in-sync copy of the current logic,
reporting a byte-for-byte match/mismatch on the `toc` and `main` output. It is a regression check, not a full test
suite, and it is dev-only tooling — never referenced by `index.html`, so it does not affect the shipped site.

**Keeping it useful:** the script contains its own copy of the current render logic (by design, so it has no
dependency on `index.html`'s file structure). Whenever `Render`'s methods change in `index.html`, update
`runCurrent()` in the script to match, or it will silently compare against stale logic.

Beyond this script, verification remains manual. Full automated unit tests become practical once render functions
move into standalone modules under `assets/js/` (planned for Milestone 4 — see `10_COMPONENT_LIBRARY.md`).

## Manual smoke test (run before any release, and after any structural change)

1. **Serve the site over HTTP** (e.g. `npx serve`, `python -m http.server`, or an editor's Live Preview) and open
   `index.html` — confirm it renders with no console errors. As of Milestone 3, opening the file directly via
   `file://` will fail: browsers block `fetch()` against local files, so `data/chapters.json`/`data/companies.json`
   won't load and the error state (`20_ACCESSIBILITY.md`) will show instead — see `12_DECISIONS.md` DR-005.
2. Toggle dark mode — confirm it persists after a page reload.
3. Type into the search box — confirm sections filter as expected and un-filter when cleared.
4. Use the browser's print preview — confirm the header, sidebar, search box, and theme toggle are hidden, and
   sections don't break awkwardly across page boundaries.
5. Resize the viewport to a typical mobile width — confirm the layout remains usable (this is a known gap; see
   `08_UI_GUIDELINES.md` — treat regressions as blocking even though the current baseline is imperfect).
6. Tab through the page with only the keyboard — confirm every interactive element (search, theme toggle, links,
   `<details>` summaries) is reachable and its focus state is visible.

## Content verification (for data/company changes)

- Confirm every new/changed company entry has the sourcing required by `07_RESEARCH_GUIDE.md`.
- Confirm no duplicate `id`/`slug` was introduced.
- Confirm cross-links (`relatedChapters`, etc.) resolve to entries that actually exist.

## Target automated testing (once render functions move to assets/js/)

Once render functions are extracted into `assets/js/`, they can be tested with a minimal, dependency-light approach
(e.g. Node's built-in test runner against exported functions) without violating the "no build step" rule for the
shipped site — test tooling is a dev-time dependency only, never shipped to `index.html`.

Planned coverage, once applicable:

- Render functions produce expected markup for representative sample data (including edge cases: missing optional
  fields, empty arrays).
- Search returns expected ranked results for representative queries across all indexed content types.
- Data files validate against their documented schema (`09_DATA_MODEL.md`, `11_COMPANY_SCHEMA.md`).

## Definition of done for a milestone

A milestone is not complete until its own acceptance criteria (`14_ROADMAP.md`) pass the manual smoke test above at
minimum, in addition to any milestone-specific verification it defines.
