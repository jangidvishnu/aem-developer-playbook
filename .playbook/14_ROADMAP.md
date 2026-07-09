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
| 7 | Learning System | Roadmaps, glossary, career paths, interview prep content | **Complete** — see `25_ROADMAP_ARCHIVE.md` (content depth in M17) |
| 8 | Company Pipeline & Hiring Gate | Fresh research, hiring gate, filter/sort, BuiltWith manifest; **hire-verified employers only** | **Complete** — see `25_ROADMAP_ARCHIVE.md` |
| 9 | Discovery Filters | Search-panel facets, shareable filter state (company table filters → M8) | **Complete** — see `25_ROADMAP_ARCHIVE.md` |
| 10 | Owner Playbook | Your personal apply/learn methods (approaches, sources, workflow) | **Complete** — see `25_ROADMAP_ARCHIVE.md` |
| 11 | Minimal Product UI | Mobile-first, jobs-first IA; strip internal chrome for visitors | **Complete** — see `25_ROADMAP_ARCHIVE.md` |
| 12 | Publishing | GitHub Pages (print/PDF deferred) | **Complete** — see `25_ROADMAP_ARCHIVE.md` |
| 13 | Loader + Repo Cleanup | First-load UX; archive unused company research/pipeline | **Complete** — see `25_ROADMAP_ARCHIVE.md` |
| 14 | SEO Prerendering | Bake product-mode HTML at commit time so crawlers/no-JS clients see real content | **Complete** — see `25_ROADMAP_ARCHIVE.md` (DR-022) |
| 15 | Company capability filters | EDS and AEM Forms filter chips + shareable URL state | Not started — queued after M17 |
| 16 | Table layout + sticky sidebar | Fixed column widths (no filter flicker); sidebar stays put at page end | **Complete** — merged PR #6 |
| 17 | Learning & career content | Interview framing + fundamentals; wire official resources; career/glossary depth | **Active** — see below |

**Sequencing note:** Milestone 14 was implemented before Milestone 13 received explicit owner acceptance, at the
owner's explicit direction ("go" immediately following a full M14 plan) — a deliberate, acknowledged exception to
the "one milestone at a time, accept before starting the next" rule. Owner accepted **both M13 and M14** on
2026-07-08 (including the DR-023 Lighthouse follow-up).

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

## Milestone 13 — Loader + Repo Cleanup: complete, accepted

Page loader, `archive/` cleanup, Target Companies wiring fixes, and M13 audit remediation (app.js extraction,
sortable headers, ESLint/Prettier). Accepted by the project owner 2026-07-08. **Full detail:**
`25_ROADMAP_ARCHIVE.md`.

## Milestone 14 — SEO Prerendering: complete, accepted

Product-mode prerender (`scripts/prerender.js` / `verify-prerender.js`), sitemap/robots/canonical/JSON-LD, plus
DR-023 Lighthouse follow-up (loader-vs-prerender CLS, `defer` scripts, font `display=optional`, combobox role,
contrast token). Accepted by the project owner 2026-07-08. **Full detail:** `25_ROADMAP_ARCHIVE.md`.

## Milestone 15 — Company capability filters (queued)

**Goal:** Filter companies by **EDS** (`EdgeDeliveryServices`) and **AEM Forms** (`Forms`) — fields already on
records (`11_COMPANY_SCHEMA.md` / `data/companies.json`). See DR-017 (was M13 under DR-016; renumbered to M15 when
M14 was reassigned to SEO prerendering, DR-022).

**Scope (in):** Product chips (+ dev-mode checkboxes); `CompanyFilters` + `cf_*` URLs; `Render.companyFilterBar`;
search facet metadata if needed.

**Prerequisite:** Milestones 13 and 14 accepted (done 2026-07-08). Data quality pass on EDS/Forms fields.
**Status:** Queued behind Milestone 17. Slim schema + Frequent/Preferred filter UI shipped in PR #6 (with M16).

## Milestone 16 — Table layout + sticky sidebar: complete (PR #6)

**Goal:** Stop table columns from jumping when filters/sort change row content, and keep the left nav sticky at the
bottom of long pages instead of riding up with the flex shell.

**Scope (in):**
- `table-layout: fixed` + explicit widths for company explorer columns (Priority / Company / Type / India / Careers)
- Same treatment for learning `data-table`s (glossary, technologies, interview)
- Stable min-heights on results head / table body so pagination padding does not reflow the page
- Desktop sidebar: `align-items: flex-start` on `.site-shell` + sticky top so the nav stays in the viewport while
  main content scrolls to the footer
- Header CLS: prerender GitHub link + theme toggle icon; fixed desktop search width + Ctrl/⌘K badge
- Company **row expand / card Details**: products, roles, hq, notes, evidence, hiringEvidence, verifiedAt

**Scope (out):** EDS/Forms capability chips (still Milestone 15); filter toolbar micro-animations beyond existing
open/close.

**Acceptance:** Met and merged in PR #6 (2026-07-09). **Full detail:** keep this section until archived to
`25_ROADMAP_ARCHIVE.md` after owner acceptance of the next milestone cycle.

## Milestone 17 — Learning & career content (active)

**Goal:** Upgrade Career Strategy, Professional Branding, Learning Roadmap, Core Skills, Glossary, and Interview Prep
with accurate, legally careful content — coach-style interview guidance, official Adobe/Apache resource links in the
product UI, and India-aware career framing.

**Scope (in):**
- Interview Prep framing + fundamentals (JCR, ResourceResolver, replication, ACL, workflow, resume/projects)
- Render `resourceIds` on roadmap steps and Core Skills rows (Experience League / Sling / aem.live / WKND only)
- Career Strategy + Professional Branding prose; Naukri + Dispatcher templates
- Glossary terms: ResourceResolver, replication, run modes, workflow
- Docs: changelog, current sprint; desktop + mobile check

**Scope (out):** EDS/Forms chips (M15); long verbatim interview answer keys; non-Adobe blog scraping.

**Acceptance:**
- Interview chapter states outcomes depend on knowledge, interviewer style, resume/projects, and fundamentals
- Roadmap steps and technology rows show clickable official docs where `resourceIds` exist
- New interview/glossary items are accurate coach talking points (no invented APIs)
- `npm run verify` passes

### Order rationale (revised per DR-009 / DR-017 / DR-022 / DR-026)

| Order | Why |
|---|---|
| 8–11 | Data, filters, owner playbook, product UI |
| 12 Publishing | Live Pages |
| 13 Loader + cleanup | First-load UX + archive dead weight |
| 14 SEO Prerendering | Crawlers/no-JS clients see real content |
| 16 Table layout + sticky sidebar | Layout stability before more filter chips |
| 17 Learning & career content | Depth for non-company sections after companies UX is solid |
| 15 Capability filters | EDS + AEM Forms chips |

**Immediate next step:** Ship Milestone 17 (this PR), then start Milestone 15.
