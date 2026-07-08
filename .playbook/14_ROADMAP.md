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
| 12 | Publishing | GitHub Pages (print/PDF deferred) | **Complete** — see `25_ROADMAP_ARCHIVE.md` |
| 13 | Loader + Repo Cleanup | First-load UX; archive unused company research/pipeline | Implementation complete, **pending owner acceptance** — see below |
| 14 | SEO Prerendering | Bake product-mode HTML at commit time so crawlers/no-JS clients see real content | Implementation complete, **pending owner acceptance** — see below (DR-022) |
| 15 | Company capability filters | EDS and AEM Forms filter chips + shareable URL state | Not started — see DR-017 |

**Sequencing note:** Milestone 14 was implemented before Milestone 13 received explicit owner acceptance, at the
owner's explicit direction ("go" immediately following a full M14 plan) — a deliberate, acknowledged exception to
the "one milestone at a time, accept before starting the next" rule above, not an oversight. Both milestones are
pending the same acceptance/test-plan pass together; see `19_CURRENT_SPRINT.md`.

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

## Milestone 12 — Publishing: complete, accepted

GitHub Pages live (print/PDF deferred by owner). **Full detail:** `25_ROADMAP_ARCHIVE.md`.

---

## Milestone 13 — Loader + Repo Cleanup (active)

**Goal:** Professional first-load UX and a leaner repo — one published company JSON, historical research/pipeline
archived (not deleted).

**Scope (in):**

- Branded accessible page loader while the 11 runtime JSON files fetch.
- Archive `md/` deep-research reports, `data/company-sources.json`, `data/manifests/*`, and legacy company build /
  ingest scripts under `archive/` (DR-017).
- Sync playbook paths and `.cursor/rules/company-data.mdc`; README reflects live site + archive layout.
- Keep all learning/runtime JSON that chapters still embed.

**Scope (out):** EDS/Forms chips (M14); print polish; deleting archived history; new frameworks.

**Acceptance criteria:**

1. Hard refresh shows intentional loader, then full product content (not bare “Loading content…”).
2. Fetch failure still shows an accessible alert.
3. `data/companies.json` is the only company DB under `data/`; archived paths documented.
4. `npm run verify` and `npm run ui-smoke` pass and exit cleanly.

**Test plan:** `17_TESTING_GUIDE.md` → Milestone 13.

## Milestone 14 — SEO Prerendering (implementation complete, pending acceptance)

**Goal:** Crawlers and no-JS clients see the site's real content (companies, apply guide, learning chapters)
directly in `index.html`'s HTML, not only after `assets/js/app.js` runs. See `12_DECISIONS.md` DR-022.

**Scope (in):**

- `scripts/prerender.js` (+ shared `scripts/lib/prerender-core.js`) bakes product-mode `Render.*` output for the
  page header, both search shells, disclaimer, sidebar label, table of contents, `<main>` (hero + every chapter,
  including the full company table), and footer into fixed comment-marker regions in `index.html`.
- Static `<link rel="canonical">` and a JSON-LD `WebSite` `<script>` baked into `<head>` from `data/site.json`'s
  new `seo.siteUrl` field.
- Generated `sitemap.xml` and `robots.txt` (also from `seo.siteUrl`).
- `scripts/verify-prerender.js` — byte-compares regenerated output against what's committed; wired into
  `npm run verify` (and therefore CI and the local pre-commit hook) as one shared enforcement path.
- `npm run prerender` script to regenerate after any `data/*.json` edit.

**Scope (out):** True hydration (client skips re-rendering prerendered DOM) — `assets/js/app.js` still fully
re-renders on load; see DR-022's "Trade-off accepted." `?mode=dev` is never prerendered.

**Acceptance criteria:**

1. `curl`/view-source of `index.html` (no JS) shows the real company table, apply guide, and learning chapters —
   not empty containers.
2. `npm run prerender` followed immediately by `npm run verify` reports no staleness (idempotent).
3. Editing `data/companies.json` and running `npm run verify` without re-running `npm run prerender` fails with a
   clear "stale" message naming the file and the first differing character.
4. `npm run verify`, `npm run lint`, and `npm run ui-smoke` all still pass after prerendering is wired in.
5. Live site's search, filters, pagination, and sortable headers behave identically to before Milestone 14 (the
   client still fully re-renders; prerendering only changes what exists before JS runs).

**Test plan:** `17_TESTING_GUIDE.md` → Milestone 14.

## Milestone 15 — Company capability filters (planned)

**Goal:** Filter companies by **EDS** (`EdgeDeliveryServices`) and **AEM Forms** (`Forms`) — fields already on
records (`11_COMPANY_SCHEMA.md` / `data/companies.json`). See DR-017 (was M13 under DR-016; renumbered to M15 when
M14 was reassigned to SEO prerendering, DR-022).

**Scope (in):** Product chips (+ dev-mode checkboxes); `CompanyFilters` + `cf_*` URLs; `Render.companyFilterBar`;
search facet metadata if needed.

**Prerequisite:** Milestones 13 and 14 accepted. Data quality pass on EDS/Forms fields.

### Order rationale (revised per DR-009 / DR-017 / DR-022)

| Order | Why |
|---|---|
| 8–11 | Data, filters, owner playbook, product UI |
| 12 Publishing | Live Pages |
| 13 Loader + cleanup | First-load UX + archive dead weight |
| 14 SEO Prerendering | Crawlers/no-JS clients see real content |
| 15 Capability filters | EDS + AEM Forms chips |

**Immediate next step:** Owner verification and acceptance of **Milestones 13 and 14 together**.
