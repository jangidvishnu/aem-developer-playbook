# Changelog

Format loosely follows [Keep a Changelog](https://keepachangelog.com/). Entries are grouped by milestone rather than
by version number while the project is pre-release. Never delete an entry — if something is reversed, add a new
entry noting the reversal.

## Process — milestone test plans

Release process now requires a published test plan in `17_TESTING_GUIDE.md` (and a link in `19_CURRENT_SPRINT.md`)
whenever a milestone is pending acceptance; completion messages must include automated commands and browser steps
(`15_RELEASE_PROCESS.md`, `16_CHECKLISTS.md`, `copilot-instructions.md`).

## Milestone 5 — accepted

Accepted by the project owner after browser verification. Full detail in `25_ROADMAP_ARCHIVE.md`. Milestone 6
started per `12_DECISIONS.md` DR-006.

## Milestone 5 — Search

### Added

- `assets/js/search.js` — `Search.buildIndex`, `Search.query`, `Search.rank` over chapters, companies, roadmaps,
  and site hero copy.
- `Render.searchResults` — accessible results listbox; `Render.search` now wraps input + results container.
- `scripts/verify-search.js` — five fixed query assertions plus ranking sanity check.
- `id="hero"` and `id="roadmap"` on rendered sections for search anchors.

### Changed

- `index.html` search wiring uses JSON index (no `innerText` DOM scan); keyboard Arrow/Enter/Escape supported.
- `data/site.json` search placeholder broadened to "Search playbook…".

## Milestone 4 — accepted

Accepted by the project owner after a real browser check at `http://localhost:3456` — full detail in
`25_ROADMAP_ARCHIVE.md`.

## Milestone 4 — Renderer

### Added

- `assets/js/render.js` — full `Render` namespace moved out of `index.html`; loaded via `<script src>` and
  `require()`'d by `scripts/verify-render.js`.
- `data/site.json` — site chrome (header, hero, dashboard, footer, search config) previously hardcoded in
  `index.html`.
- `data/roadmaps.json` — minimal learning-path seed for `Render.roadmap`.
- `Render.pageHeader`, `Render.hero`, `Render.dashboard`, `Render.roadmap`, `Render.footer`, and
  `Render.search` (header chrome only).
- `scripts/milestone-3-render-golden.json` — regression snapshot for chapter/sidebar output.

### Changed

- `index.html` is now a thin shell: structural markup containers, fetch boot script, and event wiring (theme toggle,
  naive search filter) only — no render methods inline.
- `scripts/verify-render.js` requires `assets/js/render.js` directly; compares chapter/sidebar output against the
  Milestone 3 golden snapshot instead of the pre-Milestone-1 baseline.

## Milestone 3 — accepted

Accepted by the project owner after a real browser check (served over HTTP, per `12_DECISIONS.md` DR-005) —
the first milestone confirmed with actual human verification rather than programmatic checks alone. Full detail
moved to `25_ROADMAP_ARCHIVE.md`; `14_ROADMAP.md` and `19_CURRENT_SPRINT.md` updated accordingly. Milestone 4 has
not been scoped yet.

## Milestone 3 — Data Model

The first milestone run under the full `15_RELEASE_PROCESS.md` checklist from the start (Architecture,
Documentation, Accessibility, and Performance reviews, not retrofitted afterward).

### Added

- `data/chapters.json` and `data/companies.json` — content previously hardcoded in `index.html`, now fetched at
  load. Includes a stable `id` per record (foundational, added ahead of full schema conformance).
- A loading state (`role="status"`) and error state (`role="alert"`) in `index.html` for the new async data-fetch
  gap.
- `12_DECISIONS.md` DR-005, recording the `fetch()`/CORS trade-off (local viewing now requires a server) — flagged
  to and accepted by the project owner before implementation began.

### Changed

- `index.html` no longer contains any hardcoded content data — only markup, styling, and the `Render` rendering
  logic. Satisfies `01_AI_CONSTITUTION.md`'s "never hardcode content" rule in full for the first time.
- `scripts/verify-render.js` now reads the real `data/*.json` files from disk instead of a hardcoded copy, so it
  proves those files are correct, not just that a copy of them is self-consistent.
- `17_TESTING_GUIDE.md`'s smoke test now requires serving `index.html` over HTTP rather than opening it directly.
- `03_ARCHITECTURE.md`, `09_DATA_MODEL.md`, `.cursor/rules/architecture.mdc` updated to reflect the new data flow.

### Reviewed

- **Accessibility:** loading/error states are screen-reader announced via implicit ARIA live regions
  (`role="status"` / `role="alert"`); no heading-order or landmark changes.
- **Performance:** `index.html` shrank 10,455 → 8,330 bytes; two new parallel requests added
  (`chapters.json` 2,585 bytes, `companies.json` 1,026 bytes). Honestly documents a small time-to-first-content
  cost from the fetch round-trip, accepted per the project's priority order (Maintainability/Scalability rank
  above Performance).

### Verified

- `node scripts/verify-render.js`: output identical to the pre-Milestone-1 baseline except the already-known
  Milestone 2 dark-mode fix — confirms the JSON data is a byte-faithful transcription and the new `id` fields
  don't leak into rendered markup.

### Deliberately not done (see `09_DATA_MODEL.md`)

- Full ~40-field company schema conformance and full chapter schema fields (`slug`, `difficulty`, `references`,
  `relatedChapters`, `lastUpdated`) — deferred to whichever milestone next adds real content to these files
  (Milestone 6 for companies), so schema expansion and real data entry happen together.

## `.playbook/` restructuring for AI token efficiency

### Changed

- Merged `00_PROJECT_OVERVIEW.md`, `01_AI_CONSTITUTION.md`, and `02_PROJECT_MEMORY.md` into one file
  (`00_PROJECT_OVERVIEW.md`). The latter two are now short pointer stubs — not deleted, so every existing
  cross-reference to them still resolves.
- Moved completed milestones' full historical detail (Goal/Scope/Estimates/Acceptance-Criteria/Definition-of-Done/
  review outcomes for Milestones 1 and 2) out of `14_ROADMAP.md` into a new `25_ROADMAP_ARCHIVE.md`. The active
  roadmap now keeps only the sequence table and short summaries.
- Updated `.github/copilot-instructions.md` to reflect both changes.

### Added

- `.cursor/rules/constitution.mdc` and `.cursor/rules/current-state.mdc` (`alwaysApply: true`) — the core
  non-negotiable rules and state pointers, loaded automatically instead of via a manual "read these files"
  instruction.
- `.cursor/rules/coding-standard.mdc`, `architecture.mdc`, `company-data.mdc`, `editorial-style.mdc` — glob-scoped
  rules that auto-attach only when relevant files (`index.html`, `scripts/**`, `data/**`, `md/**`, `.playbook/**`)
  are open, rather than being force-read on every task regardless of relevance.
- `12_DECISIONS.md` DR-004, documenting the measured token costs and the reasoning behind this restructuring.

### Result

Estimated ~68% reduction in the token cost paid on every session (~10,000 → ~3,200 tokens for a typical
code-touching task). No information deleted — this is pure reorganization.

## Full remediation pass — Milestone 1 & 2 review follow-ups

Resolved every open item from the Milestone 1 PR review, the pre-Milestone-2 technical debt report, and the
retroactive Milestone 2 release-checklist gap, in one disciplined pass.

### Fixed (documentation)

- `14_ROADMAP.md`'s self-contradicting Milestone 1 "Scope (out)" bullets (Critical debt item).
- Archived the `FUTURE ROADMAP`/`VERSION HISTORY` content lost from `index.html`'s old constitution comment
  ("Salary intelligence," "Mermaid diagrams," the 2.1.0 history note) into `02_PROJECT_MEMORY.md` — closes the
  Milestone 1 PR review's remaining blocking item.

### Fixed (code)

- `Render.chapter` now receives `companies` as an explicit parameter instead of reading `PLAYBOOK.companies`
  directly — closes the High-severity coupling/purity debt items.
- Added `Render.escapeHtml()`, applied to every interpolated text/attribute value across all render functions
  (chapter `body` deliberately left unescaped — it is intentional raw HTML).
- Wrapped all render functions in a single `Render` namespace object instead of bare top-level functions — closes
  the Medium-severity module-boundary debt item.
- Added an inline scalability note in `Render.companyTable`; assigned the `assets/js/` extraction to Milestone 4.
- **Accessibility fixes:** `aria-label`s on the theme toggle and search input; a skip-to-content link; and a fix
  for a newly-discovered Critical dark-mode contrast bug (header, sidebar, and every chapter card had text
  inheriting a toggling color while sitting on a fixed white background, rendering near-invisible in dark mode).

### Added

- `scripts/verify-render.js` — a committed, reusable Node regression check comparing current render output against
  the pre-Milestone-1 baseline. Closes the "no committed snapshot tooling" debt item.
- Formal Accessibility Review (`20_ACCESSIBILITY.md`) and Performance Review (`23_PERFORMANCE.md`) for the current
  state — the two reviews Milestone 2 initially shipped without, per the Release Philosophy added to
  `MASTER_BOOTSTRAP_PROMPT.md` after Milestone 2's implementation.

### Verified

- Every code change re-verified via `node scripts/verify-render.js`. The escaping, parameter-passing, and namespace
  changes produced byte-identical output to the pre-Milestone-1 baseline. The accessibility color-class fix
  produced an exact, expected +120-character diff (`text-slate-800` × 8 chapter sections) — confirmed via the
  script's diff output to be the *only* change, nothing else shifted.

### Result

All 12 items from the pre-Milestone-2 technical debt report are resolved. Both Milestone 1 PR review blocking
items are resolved. Milestone 2 now satisfies the full `15_RELEASE_PROCESS.md` release checklist retroactively.

## Documentation sync — Release Philosophy (post-Milestone-2)

### Changed

- `MASTER_BOOTSTRAP_PROMPT.md` added a "Release Philosophy" section (release-driven development; every release
  requires Architecture, Documentation, Accessibility, and Performance reviews plus PR summary, commit message, and
  changelog update). Synchronized into `15_RELEASE_PROCESS.md`, `01_AI_CONSTITUTION.md`, `16_CHECKLISTS.md`, and
  `14_ROADMAP.md`.
- `01_AI_CONSTITUTION.md` also gained the "Architecture Workflow" section it was previously missing (closes a
  Medium-severity item from the pre-Milestone-2 technical debt report).

### Noted

- Milestone 2 is retroactively missing an Accessibility Review and Performance Review per the new Release
  Philosophy, since that requirement postdates its implementation. Logged as an open item in
  `19_CURRENT_SPRINT.md`, not silently backfilled.

## Milestone 2 — Render Function Extraction (implemented)

### Added

- `renderSidebar(chapters)`, `renderChapter(chapter, index)`, `renderCompanyTable(companies)`, and a
  `renderCompanyRow(company)` helper, extracted from the single inline `forEach` block in `index.html` as named,
  top-level functions.

### Verified

- Rendered output confirmed byte-identical before and after the refactor via a standalone Node harness simulating
  both the old and new rendering logic against the same `PLAYBOOK` fixture (`toc` and `main` innerHTML strings
  matched exactly, same lengths). Manual smoke-test items (dark mode, print mode, search, keyboard tab order) are
  unaffected since none of that code was touched.

### Known, unresolved (unchanged by this milestone, by design)

- `renderChapter` still reads `PLAYBOOK.companies` directly rather than receiving it as a parameter, preserving the
  pre-existing coupling described in `03_ARCHITECTURE.md` — not fixed here per Milestone 2's explicit
  "do not expand scope" instruction.
- No HTML-escaping utility was added (flagged as High severity in the pre-Milestone-2 technical debt report) —
  consciously deferred, not expanded into this change.
- `14_ROADMAP.md`'s Milestone 1 section still contains a stale "Scope (out)" reference (the Critical item from the
  same technical debt report) — also not touched, per the same instruction.

### Planning (superseded by the above)

- Scope narrowed from the original "Architecture Refactor" plan to render-function extraction only, deferring data
  migration to Milestone 3 — see `12_DECISIONS.md` DR-003.
- Full scope, acceptance criteria, and estimates recorded in `14_ROADMAP.md`.
- `03_ARCHITECTURE.md` and `10_COMPONENT_LIBRARY.md` updated to match the new Milestone 2/3/4 split.

## Milestone 1 — Repository Foundation (implemented, all follow-ups resolved)

### Added

- Full milestone roadmap (`14_ROADMAP.md`) covering Milestones 1–8.
- Real content for all 25 `.playbook/` documents (`00`–`24`), replacing one-line stubs / filling gaps left by
  missing files.
- `data/`, `assets/`, `assets/js/` baseline folder skeleton.
- Rewritten `README.md` with a correct "start here" reading order.
- Rewritten `.github/copilot-instructions.md` with accurate file references and an explicit instruction to stop
  and report if the repository is found in an unexpected state.

### Fixed

- Removed the duplicated project constitution embedded as an HTML comment in `index.html`; it now points to
  `MASTER_BOOTSTRAP_PROMPT.md` instead of restating a second, divergent rule set.
- Fixed the version-number mismatch between `index.html`'s header comment and its visible header text.
- Fixed `README.md` pointing to `.playbook/00_PROJECT_OVERVIEW.md` when that file did not exist on disk.

### Investigated

- Documented a repository-integrity incident where 20 committed docs and 5 uncommitted docs were found deleted
  from the working tree with no corresponding action from the reviewing session. See `DR-002` in `12_DECISIONS.md`.

### Reviewed

- Lead-Architect PR review completed. Verdict: changes requested. All 5 stated acceptance criteria met; 2 blocking
  items identified (a content-preservation gap and stale tracking docs). The stale-docs item is resolved as of this
  entry; the content-preservation gap remains open (see `14_ROADMAP.md`'s "Follow-ups required before formal
  acceptance").

## Pre-Milestone-1 (initial commit)

### Added

- Initial `index.html` single-file application: sidebar TOC, dark mode with persistence, print CSS, inline search,
  hardcoded chapter and company content.
- Initial one-line stub versions of `.playbook/00–19` and `.github/copilot-instructions.md` (commit
  `9e39356 docs: add AI operating system`).
- Four raw AEM-employer research reports added to `md/`.
