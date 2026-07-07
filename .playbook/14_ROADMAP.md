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
| 5 | Search | Ranked, multi-source search per `07_RESEARCH_GUIDE.md` / `08_UI_GUIDELINES.md` search spec | **Complete** — see `25_ROADMAP_ARCHIVE.md` |
| 6 | Company Intelligence Database | Verify and merge `md/deep-research-report*.md` into `data/companies.json` | **Complete** — see `25_ROADMAP_ARCHIVE.md` |
| 7 | Learning System | Roadmaps, glossary, career paths, interview prep content | **Complete** — see `25_ROADMAP_ARCHIVE.md` |
| 8 | Company Pipeline & Hiring Gate | Fresh research, hiring gate, filter/sort, BuiltWith manifest; **hire-verified employers only** | **Complete** — see `25_ROADMAP_ARCHIVE.md` |
| 9 | Discovery Filters | Search-panel facets, shareable filter state (company table filters → M8) | Not started |
| 10 | Owner Playbook | Your personal apply/learn methods (approaches, sources, workflow) | Not started |
| 11 | Minimal Product UI | Mobile-first, jobs-first IA; strip internal chrome for visitors | Not started |
| 12 | Publishing | GitHub Pages, print handbook, PDF export pipeline | Not started |

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

## Milestone 5 — Search: complete, accepted

Data-indexed ranked search via `assets/js/search.js`, results panel with clear/dismiss UX, page-order sorting.
Accepted by the project owner after browser verification. **Full detail:** `25_ROADMAP_ARCHIVE.md`.

---

## Milestone 6 — Company Intelligence Database: complete, accepted

Migrated `data/companies.json` to `11_COMPANY_SCHEMA.md` (46 records: 25 Verified with Adobe case-study evidence),
paginated company table, `verify-companies.js`, and search index updates. Accepted by the project owner after
browser verification. **Full detail:** `25_ROADMAP_ARCHIVE.md`.

---

## Milestone 7 — Learning System: complete, accepted

Six learning data files, three roadmap paths, glossary and interview-prep chapters, learning render embeds, search
indexing, and `verify-learning.js`. Accepted by the project owner after verification. **Full detail:**
`25_ROADMAP_ARCHIVE.md`.

---

## Milestone 8 — Company Pipeline, Hiring Gate & Table Discovery: complete, accepted

Hiring gate and build pipeline (`hiring-gate.js`, `build-companies.js`), **119** hire-verified employers in
`data/companies.json`, consolidated `data/company-sources.json`, manifests for archived/watchlist candidates, company
table filter/sort UI with Hiring and Intensity columns, and `verify-filters.js`. Accepted by the project owner after
browser verification. **Full detail:** `25_ROADMAP_ARCHIVE.md`.

---

## Milestones 9–12 (planned — M9 next)

Full detail for Milestone 9 is written here now that M8 is accepted (per DR-004). Order is fixed: finish and accept
the current milestone before starting the next.

### Milestone 9 — Discovery Filters (search integration)

**Goal:** Extend discovery beyond the company table — filter **search results** by the same facets and optional
shareable filter state.

**Scope (in):**

- Search-panel facet chips/dropdowns (intersect with ranked search results)
- URL hash or query params for shareable filtered views
- Remaining facets not in M8 table UI if any (e.g. `industry`, `MigrationStatus` bands)

**Scope (out):** Full-text search engine replacement; server-side query API. *(Company table filter/sort delivered in M8.)*

### Milestone 10 — Owner Playbook

**Goal:** Capture **your** methods — how you apply, what you learn, from where — separate from generic templates in
Milestone 7.

**Scope (in):**

- `data/owner_playbook.json` (or `data/playbook/owner.json`) — structured sections: apply workflow, outreach,
  learning sources, weekly rhythm, tools; **your voice**, marked `audience: "owner"` where opinion.
- Render as a dedicated **Apply** chapter or top-level section (not buried in governance chapters).
- Search indexes owner sections for you; public build (Milestone 12) may **hide** owner-only blocks via `audience`
  flag — requires owner decision before publish.

**Scope (out):** Recruiter CRM UI; automated job applications.

### Milestone 11 — Minimal Product UI

**Goal:** Product feel for **you and visitors**: mobile-friendly, minimal, **jobs-first** — who is hiring most, where
to apply, how to apply — without project-status noise.

**Scope (in):**

- **Mobile layout** — collapsible nav, readable tables (cards on narrow viewports), touch-friendly pagination/filters.
- **IA default** — landing emphasis: **Hiring companies** (sorted by `HiringIntensity` / priority) → **How I apply**
  (Owner Playbook) → Learn (roadmaps/glossary) — governance/mission de-emphasized or moved to footer/about.
- Remove or hide for public mode: sidebar “Project Status” dashboard, version draft labels (config in `site.json`:
  `mode: "product" | "dev"`).
- Accessibility + performance pass (`20_ACCESSIBILITY.md`, `23_PERFORMANCE.md`).

**Scope (out):** SPA framework; login/auth; company card grid (unless folded in here).

### Milestone 12 — Publishing

GitHub Pages deploy, print stylesheet polish, PDF/export path. **Last** — publish the product-shaped site (Milestones
8–11) rather than an interim handbook shell.

### Order rationale (revised per DR-009)

| Order | Why |
|---|---|
| 8 Company pipeline | Hire-verified data is the core product |
| 9 Filters | Makes a large company set usable |
| 10 Owner playbook | Your “how I apply / what to learn” story |
| 11 Product UI | Mobile, minimal, jobs-first before going public |
| 12 Publishing | Ship when data, filters, owner content, and UI are ready |

**Immediate next step:** Implement **Milestone 9** (Discovery Filters). M8 accepted.
