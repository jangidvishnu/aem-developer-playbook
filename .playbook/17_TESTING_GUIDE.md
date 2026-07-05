# Testing Guide

## Current state

No automated tests exist yet (expected — there is no build tooling, and the product is a single static HTML file).
Verification today is manual. Milestone 2 introduces named, pure render functions (still inside `index.html`).
Automated unit tests become practical once those functions move into standalone modules under `assets/js/` — a
later milestone, not yet numbered — without violating the no-build-step rule for the shipped site.

## Manual smoke test (run before any release, and after any structural change)

1. Open `index.html` directly in a browser (double-click, no server) — confirm it renders with no console errors.
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
