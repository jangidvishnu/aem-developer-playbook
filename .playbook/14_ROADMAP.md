# Roadmap

## Purpose

This document is the single source of truth for what gets built, in what order, and how each unit of work is
verified as done. It exists so that any contributor — human or AI — can resume work without re-deriving scope from
scratch, and so that no milestone starts before the previous one is reviewed and accepted.

## Release discipline

Per `MASTER_BOOTSTRAP_PROMPT.md`'s Release Philosophy, each milestone below is a **release**: independently
testable, deployable, and reviewable, and not started until the previous one is accepted. From Milestone 3 onward,
closing a milestone requires the full checklist in `15_RELEASE_PROCESS.md` (Architecture, Documentation,
Accessibility, and Performance reviews, plus PR summary, commit message, and changelog update) — not just a
self-review.

## Why milestones instead of a backlog

A flat backlog invites partial, overlapping work across many files at once, which is how this repository ended up
with duplicate constitutions, dead references, and stub documentation in a single commit (see
`12_DECISIONS.md` and `13_CHANGELOG.md`). Milestones enforce:

- **One responsibility at a time** — a milestone has a single theme and a closed set of files it touches.
- **Independent testability** — each milestone ships something a reader or reviewer can verify without needing the
  next milestone to exist.
- **A hard stop for review** — work does not continue into the next milestone until the current one is explicitly
  reviewed and accepted by the project owner.

## Milestone Sequence

| # | Milestone | Theme | Status |
|---|-----------|-------|--------|
| 1 | Repository Foundation | Fix broken state, real governance docs, folder skeleton | **Implemented — all review follow-ups resolved** |
| 2 | Render Function Extraction | Extract `renderSidebar` / `renderChapter` / `renderCompanyTable` as pure functions; data stays inline in `index.html` | **Implemented, remediated, and fully reviewed — pending final acceptance** |
| 3 | Data Model | Populate `data/*.json` per `09_DATA_MODEL.md`, including migrating `PLAYBOOK.chapters`/`PLAYBOOK.companies` out of `index.html` and updating Milestone 2's render functions to consume fetched data instead of inline data | Not started |
| 4 | Renderer | Extend the render-function set to the remaining content types (hero, roadmap, dashboard, footer, search) once Milestone 3 gives them a data source | Not started |
| 5 | Search | Ranked, multi-source search per `07_RESEARCH_GUIDE.md` / `08_UI_GUIDELINES.md` search spec | Not started |
| 6 | Company Intelligence Database | Verify and merge `md/deep-research-report*.md` into `data/companies.json` | Not started |
| 7 | Learning System | Roadmaps, glossary, career paths, interview prep content | Not started |
| 8 | Publishing | GitHub Pages, print handbook, PDF export pipeline | Not started |

**Revision note:** Milestones 2 and 4 were re-scoped from the original plan per `12_DECISIONS.md` DR-003, splitting
one overloaded "Architecture Refactor" milestone into a small render-function-extraction step (2), the data
migration work absorbed into Data Model (3), and a narrowed Renderer milestone (4) for the content types Milestone
2 deliberately leaves out.

## Milestone 1 — Repository Foundation

### Goal

Bring the working tree back to a single, consistent, authoritative state and replace every missing or one-line stub
governance document with real, useful foundational content — without touching the behavior of `index.html`.

### Scope (in)

- Restore `.github/copilot-instructions.md` and `README.md` with accurate, working references.
- Write real content for all 25 `.playbook/` topic documents (`00`–`24`).
- Create the `data/`, `assets/`, `assets/js/` folder skeleton so later milestones have somewhere to write to.
- Remove the duplicated project constitution embedded as an HTML comment in `index.html`, replacing it with a short
  pointer to `MASTER_BOOTSTRAP_PROMPT.md`; fix the version-number mismatch in the same file.
- Record this roadmap and the incident that made it necessary (see `12_DECISIONS.md`, `13_CHANGELOG.md`).

### Scope (out — deferred to later milestones)

- Extracting `PLAYBOOK.chapters` / `PLAYBOOK.companies` out of `index.html` into JSON (→ Milestone 3).
- Building the named render functions (→ Milestone 2, done; the remaining ones → Milestone 4).
- Verifying and merging the `md/` research reports into a real company database (→ Milestone 6).
- Any change to the visible UI, search behavior, or dark-mode logic in `index.html`.

### Acceptance criteria (independently testable)

1. `git status --short` shows no files that a tracked reference (README, copilot-instructions, cross-links between
   `.playbook` docs) points to as missing.
2. Every file in `.playbook/00_*.md` through `24_*.md` contains real, topic-specific content — no file is a single
   line or an empty placeholder.
3. `data/`, `assets/`, and `assets/js/` exist and are tracked (via `.gitkeep` or real seed files).
4. `index.html` contains exactly one project-constitution reference (a pointer, not a duplicate ruleset), and its
   visible version number and header comment version agree.
5. `index.html` renders identically to before this milestone — no data, markup, or behavior change.

### Explicitly not done in Milestone 1

Milestone 1 produces *foundational* documentation, not the final, exhaustive version of every document. Docs that
describe systems not yet built (`09_DATA_MODEL.md`, `10_COMPONENT_LIBRARY.md`, `11_COMPANY_SCHEMA.md`) describe the
target design taken directly from `MASTER_BOOTSTRAP_PROMPT.md` — they will be revisited and expanded once the
corresponding milestone actually builds that system, so they stay accurate rather than speculative.

### Follow-ups required before formal acceptance — all resolved

A Lead-Architect PR review of this milestone found two blocking items. Both are now resolved:

- **Content preservation gap** (resolved): the old `index.html` constitution comment's `FUTURE ROADMAP` /
  `VERSION HISTORY` content was removed without being fully archived. "Salary intelligence" and "Mermaid diagrams"
  are now recorded in `02_PROJECT_MEMORY.md`'s "Archived" section with candidate future homes, and the 2.1.0
  version-history note is preserved there too.
- **Stale status docs** (resolved earlier): `19_CURRENT_SPRINT.md` and `README.md` were brought in sync with actual
  progress during the Milestone 2 documentation-synchronization pass.

Milestone 1 is now formally clear of blocking review items.

## Milestone 2 — Render Function Extraction

### Goal

Replace the single inline `forEach` + string-concatenation block in `index.html` with named, pure render functions,
with zero change to visual output, data location, or behavior. See `12_DECISIONS.md` DR-003 for why this milestone
is scoped narrower than the original roadmap draft.

### Scope (in)

- Add `renderSidebar(chapters)` — builds the table-of-contents links.
- Add `renderChapter(chapter, index)` — builds one chapter `<section>`, delegating the company-table branch to
  `renderCompanyTable`.
- Add `renderCompanyTable(companies)` (and a row-level helper) — replaces the inline conditional branch.
- Replace the existing `forEach` body with calls to these three functions.
- Update `10_COMPONENT_LIBRARY.md` to mark these three functions "Implemented" instead of "Planned" once the code
  lands.

*(As implemented, these functions were namespaced as `Render.sidebar`/`Render.chapter`/`Render.companyTable` rather
than separate bare globals — see the "Technical debt carried forward" table below and `10_COMPONENT_LIBRARY.md`'s
"Module boundary" rule, both added during post-review remediation.)*

### Scope (out — deferred to later milestones)

- Moving `PLAYBOOK` data to `data/*.json` or adding `fetch()` — Milestone 3 (Data Model).
- `renderHero`, `renderRoadmap`, `renderDashboard`, `renderFooter`, `renderSearch` — no data source or existing
  markup pattern for these yet; deferred to Milestone 4.
- Any visible or behavioral change, including the `aria-label` accessibility fix noted in the Milestone 1 review —
  that is a one-line, unrelated fix and belongs in its own small patch, not this milestone.
- Search and theme-toggle logic — untouched, unrelated concern.

### Estimates

| Category | Estimate | Reasoning |
|---|---|---|
| Difficulty | Low–Medium | Mechanical "extract function" refactor with an objective pass/fail bar (identical output), but requires care around template-literal escaping and the closure over loop index `i` → `id`. |
| Risk | Low | Blast radius confined to one `<script>` block in one file. `PLAYBOOK` data itself is never touched, only how it is consumed. No network, no async, no data loss possible. |
| Time | ~45–60 minutes (implementation + verification) | Small, single-file, mechanical change with a fast verification loop. |
| Files affected | `index.html` (code); `10_COMPONENT_LIBRARY.md`, `13_CHANGELOG.md`, `19_CURRENT_SPRINT.md` (doc sync) | One code file; docs updated in the same change, not left stale. |
| Dependencies | The Milestone 1 content-preservation follow-up above should land first. Depends on the function contract already defined in `10_COMPONENT_LIBRARY.md`. No dependency on Milestone 3. | |

### Acceptance criteria (independently testable)

1. `index.html` defines `renderSidebar`, `renderChapter`, `renderCompanyTable` as named top-level functions, not
   inline anonymous closures.
2. Calling them against the existing `PLAYBOOK.chapters` / `PLAYBOOK.companies` produces DOM output byte-identical
   to pre-refactor — verified by diffing `toc.innerHTML` and `main.innerHTML` snapshots taken before and after.
3. No function performs a `fetch()` or mutates `PLAYBOOK` — pure with respect to data, per
   `10_COMPONENT_LIBRARY.md`'s contract.
4. Manual smoke test (`17_TESTING_GUIDE.md`) passes unchanged: dark mode, print mode, search, and keyboard tab order
   all identical to before.
5. `git diff` on `PLAYBOOK`'s object literal shows zero changes — data untouched.

### Definition of Done

- All 5 acceptance criteria pass.
- `git diff index.html` shows changes confined to the rendering logic inside `<script>` — no changes to `<head>`,
  markup structure, the data object, or search/theme-toggle code.
- `10_COMPONENT_LIBRARY.md`, `13_CHANGELOG.md`, and `19_CURRENT_SPRINT.md` updated in the same change.
- Milestone presented for review; Milestone 3 not started until this is explicitly accepted.

### Status: implemented, fully remediated, release checklist complete

Milestone 2 was implemented and self-reviewed before `MASTER_BOOTSTRAP_PROMPT.md`'s Release Philosophy section
existed, so it initially shipped without a dedicated Accessibility Review or Performance Review. Both were
completed in a follow-up remediation pass:

- **Accessibility Review** — see `20_ACCESSIBILITY.md`. Fixed: `aria-label`s on the theme toggle and search input,
  a skip-to-content link, and a newly-discovered Critical dark-mode contrast bug (header/sidebar/chapter-card text
  inheriting a toggling color while sitting on fixed white backgrounds).
- **Performance Review** — see `23_PERFORMANCE.md`. No regression; one real improvement (`+=` accumulation →
  `.map().join()`, removing an O(n²) pattern).

Milestone 2, including this remediation, now satisfies the full `15_RELEASE_PROCESS.md` checklist. Every milestone
from Milestone 3 onward follows it from the start rather than retrofitting it afterward.

### Technical debt carried forward (from the pre-Milestone-2 report) — remediation complete

| Item | Severity | Final status |
|---|---|---|
| `14_ROADMAP.md` self-contradiction in the Milestone 1 section | Critical | **Resolved** — Milestone 1's "Scope (out)" bullets corrected |
| No HTML-escaping utility | High | **Resolved** — `Render.escapeHtml()` added, applied to every interpolated text/attribute value except the documented raw-HTML `body` exception |
| `renderCompanyTable`/`renderCompanyCard` naming ambiguity | High | **Resolved** — implemented as `Render.companyRow`, distinct from the still-unbuilt `Render.companyCard` |
| `renderChapter` coupling to `PLAYBOOK.companies` | High | **Resolved** — `Render.chapter` now receives `companies` as an explicit parameter |
| Global `PLAYBOOK` read instead of parameter (purity) | High | **Resolved** — all four implemented functions are now pure with respect to their arguments |
| No committed snapshot/diff tooling | Medium | **Resolved** — `scripts/verify-render.js` committed, documented in `17_TESTING_GUIDE.md` |
| Bare global functions, no module boundary | Medium | **Resolved** — all render functions moved onto a single `Render` namespace object |
| `id` duplication risk between sidebar/chapter | Medium | **Resolved** |
| `innerHTML +=` O(n²) accumulation pattern | Medium | **Resolved** |
| `01_AI_CONSTITUTION.md` missing the Architecture Workflow | Medium | **Resolved** |
| `renderCompanyTable` has no scalability note for 100+ rows | Low | **Resolved** — inline code comment added in `Render.companyTable` |
| `assets/js/` folder has no owning milestone | Low | **Resolved** — assigned to Milestone 4 (moving the `Render` namespace out of `index.html`), see `03_ARCHITECTURE.md` and `10_COMPONENT_LIBRARY.md` |

All 12 items from the pre-Milestone-2 technical debt report are now resolved. The escaping, parameter-passing, and
namespace changes were verified byte-identical to the pre-Milestone-1 rendering baseline via
`node scripts/verify-render.js` before being accepted.

---

*Milestones 3–8 will be scoped in detail immediately before they start, per the "one milestone at a time" rule in
`MASTER_BOOTSTRAP_PROMPT.md`.*
