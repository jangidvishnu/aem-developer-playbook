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
| 3 | Data Model | Populate `data/*.json` per `09_DATA_MODEL.md`, including migrating `PLAYBOOK.chapters`/`PLAYBOOK.companies` out of `index.html` and updating Milestone 2's render functions to consume fetched data instead of inline data | **Complete** — see `25_ROADMAP_ARCHIVE.md` |
| 4 | Renderer | Extend the render-function set to the remaining content types (hero, roadmap, dashboard, footer, search) once Milestone 3 gives them a data source; also move the `Render` namespace into `assets/js/render.js` | **Complete** — see `25_ROADMAP_ARCHIVE.md` |
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

## Milestone 3 — Data Model: complete, accepted

Moved `PLAYBOOK.chapters`/`PLAYBOOK.companies` out of `index.html` into `data/chapters.json`/`data/companies.json`,
fetched at load and passed into Milestone 2's `Render` functions unchanged. First milestone run under the full
`15_RELEASE_PROCESS.md` checklist from the start. Accepted by the project owner after a real browser check (not
just programmatic verification) — see `19_CURRENT_SPRINT.md`. **Full detail:** `25_ROADMAP_ARCHIVE.md`.

## Milestone 4 — Renderer: complete, accepted

Moved the full `Render` namespace to `assets/js/render.js`, added `data/site.json` and `data/roadmaps.json`, and
extracted all remaining hardcoded chrome into named render functions. Chapter/sidebar output verified byte-identical
to Milestone 3. Accepted by the project owner after a real browser check at `http://localhost:3456` — see
`19_CURRENT_SPRINT.md`. **Full detail:** `25_ROADMAP_ARCHIVE.md`.

---

*Milestone 5 will be scoped in detail immediately before it starts, per the "one milestone at a time" rule in
`MASTER_BOOTSTRAP_PROMPT.md`.*
