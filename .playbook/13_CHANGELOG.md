# Changelog

Format loosely follows [Keep a Changelog](https://keepachangelog.com/). Entries are grouped by milestone rather than
by version number while the project is pre-release. Never delete an entry — if something is reversed, add a new
entry noting the reversal.

## Full remediation pass — Milestone 1 & 2 review follow-ups (this entry)

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
