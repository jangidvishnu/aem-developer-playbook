# Roadmap

## Purpose

This document is the single source of truth for what gets built, in what order, and how each unit of work is
verified as done. It exists so that any contributor — human or AI — can resume work without re-deriving scope from
scratch, and so that no milestone starts before the previous one is reviewed and accepted.

Full historical detail for completed milestones (Goal, Scope, Estimates, Acceptance Criteria, Definition of Done,
review outcomes) lives in [`25_ROADMAP_ARCHIVE.md`](25_ROADMAP_ARCHIVE.md), not here — this file stays intentionally
short so it's cheap to read every session (see `12_DECISIONS.md` DR-004). Only the **active** milestone gets full
detail below.

## Release discipline

Per `MASTER_BOOTSTRAP_PROMPT.md`'s Release Philosophy, each milestone below is a **release**: independently
testable, deployable, and reviewable, and not started until the previous one is accepted. From Milestone 3 onward,
closing a milestone requires the full checklist in `15_RELEASE_PROCESS.md` (Architecture, Documentation,
Accessibility, and Performance reviews, plus PR summary, commit message, and changelog update) — not just a
self-review.

## Why milestones instead of a backlog

A flat backlog invites partial, overlapping work across many files at once, which is how this repository ended up
with duplicate constitutions, dead references, and stub documentation in a single commit (see `12_DECISIONS.md` and
`13_CHANGELOG.md`). Milestones enforce one responsibility at a time, independent testability, and a hard stop for
review before the next one starts.

## Milestone Sequence

| # | Milestone | Theme | Status |
|---|-----------|-------|--------|
| 1 | Repository Foundation | Fix broken state, real governance docs, folder skeleton | **Complete** — see `25_ROADMAP_ARCHIVE.md` |
| 2 | Render Function Extraction | Extract `Render.sidebar` / `Render.chapter` / `Render.companyTable` as pure functions; data stays inline in `index.html` | **Complete** — see `25_ROADMAP_ARCHIVE.md` |
| 3 | Data Model | Populate `data/*.json` per `09_DATA_MODEL.md`, including migrating `PLAYBOOK.chapters`/`PLAYBOOK.companies` out of `index.html` and updating Milestone 2's render functions to consume fetched data instead of inline data | **In progress** |
| 4 | Renderer | Extend the render-function set to the remaining content types (hero, roadmap, dashboard, footer, search) once Milestone 3 gives them a data source; also move the `Render` namespace into `assets/js/render.js` | Not started |
| 5 | Search | Ranked, multi-source search per `07_RESEARCH_GUIDE.md` / `08_UI_GUIDELINES.md` search spec | Not started |
| 6 | Company Intelligence Database | Verify and merge `md/deep-research-report*.md` into `data/companies.json` | Not started |
| 7 | Learning System | Roadmaps, glossary, career paths, interview prep content | Not started |
| 8 | Publishing | GitHub Pages, print handbook, PDF export pipeline | Not started |

**Revision note:** Milestones 2 and 4 were re-scoped from the original plan per `12_DECISIONS.md` DR-003, splitting
one overloaded "Architecture Refactor" milestone into a small render-function-extraction step (2), the data
migration work absorbed into Data Model (3), and a narrowed Renderer milestone (4) for the content types Milestone
2 deliberately leaves out.

## Milestone 1 — Repository Foundation: complete

Fixed the repository's broken/deleted-file state, wrote real content for all `.playbook/` topic documents, created
the `data/`/`assets/`/`assets/js/` skeleton, and removed the duplicated constitution from `index.html`. Reviewed via
a Lead-Architect PR review; both blocking items resolved. **Full detail:** `25_ROADMAP_ARCHIVE.md`.

## Milestone 2 — Render Function Extraction: complete

Extracted the inline rendering loop in `index.html` into named, pure functions on a `Render` namespace, with
verified byte-identical output. All 12 items from the pre-Milestone-2 technical debt report resolved, including a
newly-discovered Critical dark-mode contrast bug. Accessibility and Performance reviews completed retroactively;
Milestone 2 now satisfies the full `15_RELEASE_PROCESS.md` checklist. **Full detail:** `25_ROADMAP_ARCHIVE.md`.

## Milestone 3 — Data Model

### Goal

Move `PLAYBOOK.chapters` and `PLAYBOOK.companies` out of `index.html` into `data/chapters.json` and
`data/companies.json`, fetched at load and passed into Milestone 2's existing `Render` functions exactly as before
— same rendered output, same fields, just relocated. This is the first milestone run under the full
`15_RELEASE_PROCESS.md` checklist (Architecture, Documentation, Accessibility, and Performance reviews, not just a
self-review) — see `12_DECISIONS.md` DR-005 for the one significant trade-off this milestone introduces.

### Scope (in)

- Create `data/chapters.json` and `data/companies.json` — same fields as today's inline objects, moved as-is.
- `index.html` fetches both files on load and passes the results into `Render.sidebar` / `Render.chapter` /
  `Render.companyTable` unchanged.
- Add a minimal, accessible loading state for the async gap between page load and data arriving (see
  `20_ACCESSIBILITY.md`).
- Update `17_TESTING_GUIDE.md`'s smoke test to require a local server (`fetch()` against `file://` is blocked by
  browser CORS policy — see `12_DECISIONS.md` DR-005).
- Update `scripts/verify-render.js` to verify the JSON files are a faithful transcription of the original inline
  data (same rendered output when passed through the same `Render` functions).

### Scope (out — deferred to later milestones)

- Expanding to the full ~40-field company schema (`11_COMPANY_SCHEMA.md`) or full chapter schema
  (`09_DATA_MODEL.md`'s `id`/`slug`/`difficulty`/`references`/`relatedChapters`/`lastUpdated`). Fabricating
  "Unknown" values for ~30 fields per company now, only to overwrite them with real data in Milestone 6, means
  touching the same file twice for no benefit — schema expansion happens together with real data population.
- Any visible/behavioral change beyond the data now loading asynchronously (plus the new loading state, which is
  a direct, necessary consequence of that change, not scope creep).
- Search and theme-toggle logic — untouched, unrelated concern.
- Moving the `Render` namespace to `assets/js/render.js` — Milestone 4.

### Acceptance criteria (independently testable)

1. `data/chapters.json` and `data/companies.json` exist and are valid JSON containing the same data as the
   removed inline `PLAYBOOK` object (verified via `scripts/verify-render.js`).
2. `index.html` contains no hardcoded chapter or company content — only a `fetch()` call and the `Render` functions.
3. Once served over HTTP and loaded, rendered output is identical to pre-Milestone-3 (same sections, same company
   table, same text) — verified via `scripts/verify-render.js` feeding the JSON files through the same `Render`
   functions and comparing against the pre-Milestone-1 baseline.
4. A loading state is visible (and screen-reader-announced) during the fetch, and is removed once content renders.
5. Manual smoke test (`17_TESTING_GUIDE.md`, updated for a local server) passes: dark mode, print mode, search,
   and keyboard tab order all identical to before.

### Definition of Done

- All 5 acceptance criteria pass.
- Architecture Review, Documentation Review, Accessibility Review, and Performance Review all completed (see
  `20_ACCESSIBILITY.md` and `23_PERFORMANCE.md` for the latter two).
- `13_CHANGELOG.md` and `19_CURRENT_SPRINT.md` updated in the same change.
- PR summary and commit message generated.
- Milestone presented for review; Milestone 4 not started until this is explicitly accepted.

---

*Milestones 4–8 will be scoped in detail immediately before they start, per the "one milestone at a time" rule in
`MASTER_BOOTSTRAP_PROMPT.md`.*
