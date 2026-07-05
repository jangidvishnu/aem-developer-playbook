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
| 1 | Repository Foundation | Fix broken state, real governance docs, folder skeleton | **Implemented — 1 required follow-up open before formal acceptance** |
| 2 | Render Function Extraction | Extract `renderSidebar` / `renderChapter` / `renderCompanyTable` as pure functions; data stays inline in `index.html` | **Implemented — pending review** |
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

- Extracting `PLAYBOOK.chapters` / `PLAYBOOK.companies` out of `index.html` into JSON (→ Milestone 2 and 3).
- Building the named render functions (→ Milestone 4).
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

### Follow-ups required before formal acceptance

A Lead-Architect PR review of this milestone found that all 5 acceptance criteria above pass, but identified one
blocking item not yet resolved as of this writing:

- **Content preservation gap:** the old `index.html` constitution comment's `FUTURE ROADMAP` / `VERSION HISTORY`
  content was removed without being fully archived. "Salary intelligence" and "Mermaid diagrams" (two items from
  that list) are not yet referenced anywhere in `.playbook/`, and the 2.1.0 version-history note is not reflected in
  `13_CHANGELOG.md`. This is a direct violation of `01_AI_CONSTITUTION.md` rule 1 ("never delete information") and
  must be fixed before Milestone 1 is considered formally reviewed and accepted.

(The review's second blocking item — stale status in `19_CURRENT_SPRINT.md` and `README.md` — was resolved in the
same documentation-synchronization pass that added this note.)

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

### Status: implemented, with a release-checklist gap

Milestone 2 was implemented and self-reviewed before `MASTER_BOOTSTRAP_PROMPT.md`'s Release Philosophy section
existed. It included a self-review, PR summary, commit message, and changelog update, but **not** a dedicated
Accessibility Review or Performance Review as that section now requires for every release. Rather than backfill
these retroactively without being asked, this is logged as an explicit open item in `19_CURRENT_SPRINT.md`. Every
milestone from Milestone 3 onward follows the full `15_RELEASE_PROCESS.md` checklist from the start.

### Technical debt carried forward (from the pre-Milestone-2 report)

| Item | Severity | Status after Milestone 2 |
|---|---|---|
| `14_ROADMAP.md` self-contradiction in the Milestone 1 section | Critical | **Still open** — deliberately not fixed, per "do not expand scope" |
| No HTML-escaping utility | High | **Still open** — deliberately deferred |
| `renderCompanyTable`/`renderCompanyCard` naming ambiguity | High | **Resolved** — implemented as `renderCompanyRow`, distinct from the still-unbuilt `renderCompanyCard` |
| `renderChapter` coupling to `PLAYBOOK.companies` | High | **Still open** — preserved as pre-existing behavior, not fixed |
| Global `PLAYBOOK` read instead of parameter (purity) | High | **Partially resolved** — `renderSidebar`/`renderCompanyTable`/`renderCompanyRow` are pure; `renderChapter` still reads `PLAYBOOK.companies` directly |
| No committed snapshot/diff tooling | Medium | **Partially resolved** — a verification harness was built and run, but deleted after use rather than committed for reuse |
| Bare global functions, no module boundary | Medium | **Still open** |
| `id` duplication risk between sidebar/chapter | Medium | **Resolved** — both now derive from the same `.map()` index over the same array |
| `innerHTML +=` O(n²) accumulation pattern | Medium | **Resolved as a side effect** — new functions build via `.map().join('')` and assign/append once |
| `01_AI_CONSTITUTION.md` missing the Architecture Workflow | Medium | **Resolved** in this pass (see below) |
| `renderCompanyTable` has no scalability note for 100+ rows | Low | Still open |
| `assets/js/` folder has no owning milestone | Low | Still open |

---

*Milestones 3–8 will be scoped in detail immediately before they start, per the "one milestone at a time" rule in
`MASTER_BOOTSTRAP_PROMPT.md`.*
