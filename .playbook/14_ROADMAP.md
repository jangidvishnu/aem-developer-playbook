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
| 9 | Discovery Filters | Search-panel facets, shareable filter state (company table filters → M8) | **Complete** — see `25_ROADMAP_ARCHIVE.md` |
| 10 | Owner Playbook | Your personal apply/learn methods (approaches, sources, workflow) | **Complete** — see `25_ROADMAP_ARCHIVE.md` |
| 11 | Minimal Product UI | Mobile-first, jobs-first IA; strip internal chrome for visitors | **Complete** — see `25_ROADMAP_ARCHIVE.md` |
| 12 | Publishing | GitHub Pages, print handbook, PDF export pipeline | **Active** — see below |
| 13 | Company capability filters | EDS and AEM Forms filter chips + shareable URL state | Not started — see DR-016 |

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

## Milestone 9 — Discovery Filters: complete, accepted

Search-panel facets, industry/migration filters, shareable URL state (DR-013), and **Copy link** affordance on filter
bar and search panel. **Full detail:** `25_ROADMAP_ARCHIVE.md`.

---

## Milestone 10 — Owner Playbook: complete, accepted

Personal apply strategy in `data/owner_playbook.json`, **How I Apply** chapter, search Apply facet.
Accepted by the project owner after browser verification (commit `46e45f6`). **Full detail:**
`25_ROADMAP_ARCHIVE.md`.

---

## Milestone 11 — Minimal Product UI: complete, accepted

Product mode, mobile drawer/cards, SEO, unified company explorer, presentation polish (DR-014/015). Owner browser
sign-off 2026-07-08. **Full detail:** `25_ROADMAP_ARCHIVE.md`.

---

## Milestone 12 — Publishing (active)

### Milestone 12 — Publishing

**Goal:** Ship the product-shaped site (Milestones 8–11) publicly — GitHub Pages, print-friendly handbook, and a
repeatable PDF/export path — rather than an interim handbook shell.

**Scope (in):**

- GitHub Pages (or equivalent static host) serving the default branch with no build step.
- Print stylesheet polish per `21_PUBLISHING.md` / `08_UI_GUIDELINES.md`.
- PDF or export pipeline documented and smoke-tested once.
- Version/changelog reader-facing notes for the published release.

**Scope (out):** New product features (filters, content domains); those wait for M13+ after publish.

**Acceptance criteria:**

1. Live URL loads product mode with companies and How to Apply working over HTTPS.
2. Print preview hides chrome (header/sidebar/search) and keeps readable chapter flow.
3. Export/PDF path documented in `21_PUBLISHING.md` and run at least once successfully.
4. `npm run verify` still passes against the published tree.

**Test plan:** Add to `17_TESTING_GUIDE.md` when implementation is complete (per `15_RELEASE_PROCESS.md`).

### Milestone 13 — Company capability filters (planned)

**Goal:** Let AEM developers narrow the company list by **Edge Delivery Services (EDS)** and **AEM Forms** hiring —
fields already exist on company records (`EdgeDeliveryServices`, `Forms` in `11_COMPANY_SCHEMA.md` / `data/companies.json`).

**Scope (in):**

- Product-mode quick-filter chips (and dev-mode checkboxes) for **EDS** and **AEM Forms**, alongside existing India / Cloud filters.
- Wire through `CompanyFilters` (`matchesCompany`, URL `cf_*` params, shareable links) and `Render.companyFilterBar`.
- Search facet metadata if company index needs EDS/Forms flags for filtered search.

**Scope (out):** Other Adobe products (Analytics-only, Target-only, etc.) unless added in a later milestone; no change to
the hire-verified gate (M8) — filters apply to the existing verified set only.

**Prerequisite:** Milestone 12 accepted. Data quality pass on `EdgeDeliveryServices` / `Forms` fields before shipping UI.

**Decision:** DR-016. M11 intentionally removed redundant **Hiring AEM** and **Verified** chips because the table is
hire-verified AEM-only; EDS/Forms are meaningful subdivisions worth adding later.

### Order rationale (revised per DR-009)

| Order | Why |
|---|---|
| 8 Company pipeline | Hire-verified data is the core product |
| 9 Filters | Makes a large company set usable |
| 10 Owner playbook | Your “how I apply / what to learn” story |
| 11 Product UI | Mobile, minimal, jobs-first before going public |
| 12 Publishing | Ship when data, filters, owner content, and UI are ready |
| 13 Capability filters | EDS + AEM Forms chips on top of hire-verified company data (DR-016) |

**Immediate next step:** Implement **Milestone 12 (Publishing)** — GitHub Pages + print/PDF path per this section
and `21_PUBLISHING.md`.
