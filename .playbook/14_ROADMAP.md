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
| 15 | Company capability filters | EDS and AEM Forms via **Product** dropdown (no duplicate chips) | **Complete** — see `25_ROADMAP_ARCHIVE.md` |
| 16 | Table layout + sticky sidebar | Fixed column widths (no filter flicker); sidebar stays put at page end | **Complete** — see `25_ROADMAP_ARCHIVE.md` |
| 17 | Learning & career content | Interview framing + fundamentals; wire official resources; career/glossary depth | **Complete** — see `25_ROADMAP_ARCHIVE.md` |
| 18 | Company database expansion (123 → 500) | Strict, verified, India-first batches (B1–B8) growing `data/companies.json` to 500 AEM employers | **Active** — 320 live after truth-pass (see below) |
| 19 | Job search playbook & contributor docs | Agency apply, boards vs careers, community links, CONTRIBUTING depth | **Complete** — owner accepted 2026-07-11 |
| 20 | Company discovery at scale | `locations` filter (partial), `noticePolicy`, optional `contacts`, search | **Partial** — Location multi-select + search clear shipped; notice/contacts still planned |

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

## Milestones 1–17: complete

Milestones **1–17** are accepted and complete. Summary table above; full detail for 1–14 and 16 in
`25_ROADMAP_ARCHIVE.md`. **M15** — filter EDS / AEM Forms via the **Product** dropdown (`cf_product=eds` or
`cf_product=forms`); no separate quick-filter chips (duplicates Product). **M17** — learning/career content depth,
`resourceIds`, interview framing.

## Milestone 18 — Company database expansion (123 → 500) (active)

**Goal:** Grow `data/companies.json` from **123** to **500** AEM/Adobe-partner employers, India-first, with **zero
false or unverified data**. Every added row completes the `07_RESEARCH_GUIDE.md` field pass: ≥1 working Tier-1/2
`evidence` URL proving AEM usage, ≥1 `hiringEvidence` URL, employer-accurate `roles`, `priority` from the
hiring-cadence rubric, `verifiedAt` set, and **`ownerVerified: false`** on every agent-added row.

**Method (per batch):** gather candidate names → dedupe against live rows → verify AEM usage + hiring intent via
web → fill complete field pass → `node scripts/verify-companies.js` green → report adds (names + evidence links) for
owner spot-check → commit only on explicit owner approval (feature branch → PR to `stage`, per `git-push-approval.mdc`).
Anything that cannot clear the evidence bar is parked in a "needs owner review" note, **not** published.

**Sub-milestones (batches).** Say "start next milestone" (or "start Batch N") to run the next one:

| Batch | Target range | Focus | Est. net-new | Status |
|---|---|---|---|---|
| B1 | 123 → 165 | `comapnies-to-add.txt` names + top India Adobe SIs/partners | 42 | **Done (pending owner spot-check)** — 42 verified adds; schema + hiring gate pass. Parked: L'Oréal (Sitecore, not AEM), Tavant, Westcon-Comstor, Physical Insights, 7N, Material/iCrossing, Iksula, Apple |
| B2 | ~165 → ~212 | Remaining India Adobe partners + India product/GCC employers | 47 | **Done (pending owner spot-check)** — 47 verified adds; schema + hiring gate pass. Skipped (already live): JPMorgan Chase, Rockwell Automation, Xeliumtech, IndusInd Bank. Parked: Cybage, Apexon, Innominds, Flipkart, Axis Bank, Airtel, HUL, Kotak, R Systems, SLK/Altimetrik, Atos, PhonePe, Bosch, Dell, Intel, Fidelity, UBS, EXL, LTTS, Tata Elxsi, Langoor, Samsung SDS, Phygital Insights, Sonata Software, staffing-only Cutshort agencies (Wroots, Scaling Theory, XpertOntime, People First) |
| B3 | ~212 → ~233 | India job-board employers (Foundit/Shine/Cutshort "AEM"), verified | 21 | **Done (pending owner spot-check)** — 21 net adds in live file (233 total); **Ele1 Consultant** parked — HR staffing boutique, no employer-owned careers URL. Cutshort `careersUrl` fixes applied (Quest, Ekloud, Appriffy, BigStep, NLB). M&A dedup: Zorang/Lister not listed (`gspann`, `bounteous` only). Short of ~50 target — parked for follow-up: Marlabs, Pi Square, Orbion, Bosch/DXC/Sasken/Grid Dynamics/Luxoft/SoftServe/Nielsen/Cyient/HPE, Albertsons, WillWare/SWITS, EXL/LTTS/Tata Elxsi/Phygital, staffing-only (Wroots, Staffice, Scaling Theory, XpertOntime, People First, **Ele1**) |
| B4 | ~265 → ~315 | Adobe customer success-story directory (global, India presence) | ~50 | Not started |
| B5 | ~315 → ~365 | Adobe case-study directory, continued | ~50 | Not started |
| B6 | ~365 → ~415 | Global enterprises + archived candidate manifest re-verify | ~50 | Not started |
| B7 | ~415 → ~460 | Global + watchlist (BuiltWith Tier-4, priority capped ≤6, flagged in notes) | ~45 | Not started |
| B8 | ~460 → 500 | Fill, reconcile duplicates, normalize priorities | ~40 | Not started |

**Candidate sources (India-first):** Adobe Solution Partner Directory (India filter), `comapnies-to-add.txt`,
India job boards, Adobe customer success stories (Tier-2 backbone), archived manifests
(`archive/companies/manifests/`), BuiltWith seeds (Tier-4 watchlist only).

**Acceptance (per batch):** all new rows pass the field pass and `verify-companies.js`; no duplicate of an existing
row; inference-only rows labelled in `notes` and capped at priority 6; owner spot-checks before commit.
**Acceptance (milestone):** 500 rows, `npm run verify` + `npm run ui-smoke` green, one consolidated changelog entry.

## Milestone 19 — Job search playbook & contributor docs: complete

**Accepted:** 2026-07-11 (owner).

**Shipped:** Apply guide depth (agencies, LinkedIn feed training, careers vs boards, community);
Community chapter with LinkedIn groups only (WhatsApp invites archived — independent-group disclaimer);
`CONTRIBUTING.md` company-row + PR-to-`stage` guide; collapsible top disclaimer → About this data;
company expand UX + Location hierarchy UI polish.

## Milestone 20 — Company discovery at scale (partial)

**Goal:** Filter and search employers by location and notice fit; optional owner HR contacts.

**Shipped:** multi-select Location filter (country groups + cities), URL `cf_loc`, company search clear ×,
locations grouped in company detail. **Still planned:** `noticePolicy` filter, optional HR contacts.

### Order rationale (revised per DR-009 / DR-017 / DR-022 / DR-026)

| Order | Why |
|---|---|
| 8–11 | Data, filters, owner playbook, product UI |
| 12 Publishing | Live Pages |
| 13 Loader + cleanup | First-load UX + archive dead weight |
| 14 SEO Prerendering | Crawlers/no-JS clients see real content |
| 16 Table layout + sticky sidebar | Layout stability before more filter chips |
| 17 Learning & career content | Depth for non-company sections after companies UX is solid |
| 18 Company database expansion | Grow verified employer list to 500 in batches (320 live after truth-pass) |
| 19 Job search playbook | **Complete** — apply guide + community + CONTRIBUTING |
| 20 Company discovery | Partial — Location multi-select shipped; notice/contacts still planned |
| 15 Capability filters | EDS + AEM Forms via Product dropdown |

**Immediate next step:** Continue M18 toward 500 on demand ("start next milestone" / next batch), or finish M20 notice/contacts when owner asks.
