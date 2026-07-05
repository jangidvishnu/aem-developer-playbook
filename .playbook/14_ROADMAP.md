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
| 6 | Company Intelligence Database | Verify and merge `md/deep-research-report*.md` into `data/companies.json` | **In progress** — see detail below |
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

## Milestone 5 — Search: complete, accepted

Data-indexed ranked search via `assets/js/search.js`, results panel with clear/dismiss UX, page-order sorting.
Accepted by the project owner after browser verification. **Full detail:** `25_ROADMAP_ARCHIVE.md`.

---

## Milestone 6 — Company Intelligence Database (in progress)

### Goal

Migrate `data/companies.json` from today's informal 4-row shape onto the full `11_COMPANY_SCHEMA.md`, verify and
merge the candidate companies from the four `md/deep-research-report*.md` files per `07_RESEARCH_GUIDE.md`, and
update `Render.companyTable` / `Render.companyRow` to consume the new schema — including table scalability for
100+ rows.

### Scope (in)

**Schema migration**

- Rewrite `data/companies.json` records to conform to `11_COMPANY_SCHEMA.md`: every field present as specified
  (`"Unknown"` / `null` where not researched — never omitted).
- Migrate the existing 4 companies (`adobe`, `workday`, `servicenow`, `cisco`) field-for-field:
  - `company` → `name`, `type` → `companyType`, `india` → `indiaPresence`, `aem` → notes under `usesAEM` /
    `AdobeProducts` / `Notes` as appropriate, `careers` → `careersUrl`, `search` → `directJobSearch`, `visa` →
    `VisaSupport`, star `priority` → numeric `priority` (0–10).
- Set `Status`, `LastVerified`, `Evidence`, `References` on all 4 per the verification workflow.

**Research ingest and deduplication**

- Parse all four `md/deep-research-report*.md` files to extract candidate company entries (tables, lists, prose
  mentions) into a deduplicated candidate set. A dev-only helper script (`scripts/ingest-company-candidates.js`) is
  in scope — it outputs a reviewable JSON manifest, not auto-written production data.
- Reconcile duplicates across reports (same company, conflicting priority/India claims) into one record per
  `id` — conflicts documented in `Notes`, not silently dropped.
- **Publish rule:** only companies passing `07_RESEARCH_GUIDE.md` verification (`Status: "Verified"`, `usesAEM: true`
  requires `Evidence`) are added to `data/companies.json` as verified entries. Candidates failing verification are
  either omitted or added with `Status: "Unverified"` and `usesAEM: false` — never promoted to verified without
  evidence.

**Verification target (default proposal — owner confirms)**

- Minimum **25 `Status: "Verified"` companies** in `data/companies.json` after migration (the Phase 1 report's
  Tier-1 list is the natural starting set; existing 4 count toward this if re-verified).
- Additional deduplicated candidates may be ingested as `Status: "Unverified"` up to a cap of **100 total records**
  if the owner wants search/table visibility before full verification — otherwise unverified candidates stay in `md/`
  only until individually verified.

**Renderer updates**

- Update `Render.companyRow` / `Render.companyTable` for `11_COMPANY_SCHEMA.md` field names.
- Add **client-side table pagination** (or equivalent) when row count exceeds a threshold (proposed: 25 rows per
  page) — addresses the scalability note already in `Render.companyTable` and `23_PERFORMANCE.md`.
- Update `scripts/verify-render.js` golden snapshot after intentional company-table markup change.

**Search integration (post–Milestone 5)**

- Ensure `Search.buildIndex` indexes the new `name` field (and any other high-value company fields: `industry`,
  `TypicalRoles`, `Notes`) — a small follow-on change within this milestone, not a Milestone 5 rework.

**Dev tooling**

- Add `scripts/verify-companies.js` — validates every `data/companies.json` record against `11_COMPANY_SCHEMA.md`
  rules: required keys present, no duplicate `id`, `usesAEM: true` implies non-empty `Evidence`, `LastVerified` set
  when `Status: "Verified"`.

**Documentation sync**

- `09_DATA_MODEL.md`, `11_COMPANY_SCHEMA.md` (status section), `07_RESEARCH_GUIDE.md` (note ingest script),
  `10_COMPONENT_LIBRARY.md`, `13_CHANGELOG.md`, `19_CURRENT_SPRINT.md`.
- Record any schema or verification-volume trade-offs in `12_DECISIONS.md`.

### Scope (out — deferred)

- `Render.companyCard` / grid/detail company views — no UI requirement for this milestone.
- Personal-tracking UI (Wishlist / Applied / Interview toggles in the browser) — schema fields yes, interactive UI no
  (→ future milestone or Milestone 7).
- Automated web scraping or API-based verification bots — manual/reasonable-effort checks per `07_RESEARCH_GUIDE.md`.
- Verifying **all** 100+ Phase 1 candidates in one milestone — unrealistic; capped by owner-agreed verified minimum.
- Deleting or modifying the `md/` source reports — archive only; never delete (`01_AI_CONSTITUTION.md`).
- Splitting `companies.json` into multiple files — only if a single file exceeds client-side comfort; requires
  `12_DECISIONS.md` entry first.
- Salary intelligence domain — still no dedicated milestone.

### Estimates

| Category | Estimate | Reasoning |
|---|---|---|
| Difficulty | High | Schema migration + manual verification at scale + renderer/pagination + dedup across four prose reports. Largest content milestone so far. |
| Risk | Medium | Data quality risk (unverified claims published as fact) mitigated by verification workflow and `verify-companies.js`. Breaking schema change affects render + search. |
| Time | ~8–12 hours | Spread across ingest script, verification passes, render/pagination, tests, docs — likely multiple sessions. |
| Files affected | `data/companies.json`, `assets/js/render.js`, `assets/js/search.js` (index fields), `scripts/ingest-company-candidates.js` (new), `scripts/verify-companies.js` (new), `scripts/verify-render.js`, playbook docs | |
| Dependencies | Milestone 5 accepted (search indexes companies). Milestone 4 render layer complete. | |

### Acceptance criteria (independently testable)

1. Every record in `data/companies.json` conforms to `11_COMPANY_SCHEMA.md` — `node scripts/verify-companies.js`
   passes.
2. The existing 4 companies are present under new field names with no data loss (names, careers URLs, visa notes
   preserved).
3. No duplicate `id` values; cross-report conflicts reconciled into single records.
4. At least the owner-agreed minimum of `Status: "Verified"` companies (default proposal: 25) with `Evidence` and
   `LastVerified` populated.
5. No `usesAEM: true` record lacks `Evidence` — enforced by verify script.
6. Company table renders correctly with pagination at 100+ rows without browser hang (smoke test).
7. `node scripts/verify-render.js` and `node scripts/verify-search.js` pass after schema migration.
8. `md/` reports remain unchanged; ingest is additive to `data/companies.json` only.

### Definition of Done

- All 8 acceptance criteria pass, including project-owner browser check on the paginated company table.
- Full `15_RELEASE_PROCESS.md` checklist.
- Milestone test plan published in `17_TESTING_GUIDE.md` and linked from `19_CURRENT_SPRINT.md`.
- `13_CHANGELOG.md`, `19_CURRENT_SPRINT.md`, and `12_DECISIONS.md` (if verification-volume cap decided) updated.

### Open questions for project owner (resolve before implementation)

Resolved when Milestone 5 was accepted and Milestone 6 started (`12_DECISIONS.md` DR-006):

1. **Verified minimum** — 25 verified companies (acceptance bar).
2. **Unverified ingest cap** — up to 100 total rows in `companies.json`.
3. **Pagination** — 25 rows per page.

*Milestone 6 implementation in progress — see `19_CURRENT_SPRINT.md`.*
