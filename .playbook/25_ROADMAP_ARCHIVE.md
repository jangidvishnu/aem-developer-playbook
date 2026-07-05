# Roadmap Archive

Full historical detail (Goal, Scope, Estimates, Acceptance Criteria, Definition of Done, review outcomes) for
completed milestones, moved out of `14_ROADMAP.md` to keep the actively-read roadmap small — see `12_DECISIONS.md`
DR-004. `14_ROADMAP.md` keeps the milestone sequence table and a one-line status/summary per completed milestone
that links here. Nothing here is deleted or shortened from the original; this is a pure relocation.

---

## Milestone 1 — Repository Foundation (complete)

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

### Acceptance criteria (independently testable) — all passed

1. `git status --short` shows no files that a tracked reference (README, copilot-instructions, cross-links between
   `.playbook` docs) points to as missing.
2. Every file in `.playbook/00_*.md` through `24_*.md` contains real, topic-specific content — no file is a single
   line or an empty placeholder.
3. `data/`, `assets/`, and `assets/js/` exist and are tracked (via `.gitkeep` or real seed files).
4. `index.html` contains exactly one project-constitution reference (a pointer, not a duplicate ruleset), and its
   visible version number and header comment version agree.
5. `index.html` renders identically to before this milestone — no data, markup, or behavior change.

### Follow-ups required before formal acceptance — all resolved

A Lead-Architect PR review of this milestone found two blocking items, both now resolved:

- **Content preservation gap** (resolved): the old `index.html` constitution comment's `FUTURE ROADMAP` /
  `VERSION HISTORY` content was removed without being fully archived. "Salary intelligence" and "Mermaid diagrams"
  are now recorded in `00_PROJECT_OVERVIEW.md`'s Project Memory section (Part 3) with candidate future homes, and
  the 2.1.0 version-history note is preserved there too.
- **Stale status docs** (resolved earlier): `19_CURRENT_SPRINT.md` and `README.md` were brought in sync with actual
  progress during the Milestone 2 documentation-synchronization pass.

## Milestone 2 — Render Function Extraction (complete)

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
than separate bare globals — see the technical debt table below and `10_COMPONENT_LIBRARY.md`'s "Module boundary"
rule, both added during post-review remediation.)*

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

### Acceptance criteria (independently testable) — all passed

1. `index.html` defines `renderSidebar`, `renderChapter`, `renderCompanyTable` as named top-level functions, not
   inline anonymous closures.
2. Calling them against the existing `PLAYBOOK.chapters` / `PLAYBOOK.companies` produces DOM output byte-identical
   to pre-refactor — verified by diffing `toc.innerHTML` and `main.innerHTML` snapshots taken before and after.
3. No function performs a `fetch()` or mutates `PLAYBOOK` — pure with respect to data, per
   `10_COMPONENT_LIBRARY.md`'s contract.
4. Manual smoke test (`17_TESTING_GUIDE.md`) passes unchanged: dark mode, print mode, search, and keyboard tab order
   all identical to before.
5. `git diff` on `PLAYBOOK`'s object literal shows zero changes — data untouched.

### Definition of Done — met

- All 5 acceptance criteria pass.
- `git diff index.html` shows changes confined to the rendering logic inside `<script>` — no changes to `<head>`,
  markup structure, the data object, or search/theme-toggle code.
- `10_COMPONENT_LIBRARY.md`, `13_CHANGELOG.md`, and `19_CURRENT_SPRINT.md` updated in the same change.

### Release checklist — completed via post-implementation remediation

Milestone 2 was implemented and self-reviewed before `MASTER_BOOTSTRAP_PROMPT.md`'s Release Philosophy section
existed, so it initially shipped without a dedicated Accessibility Review or Performance Review. Both were
completed in a follow-up remediation pass:

- **Accessibility Review** — see `20_ACCESSIBILITY.md`. Fixed: `aria-label`s on the theme toggle and search input,
  a skip-to-content link, and a newly-discovered Critical dark-mode contrast bug (header/sidebar/chapter-card text
  inheriting a toggling color while sitting on fixed white backgrounds).
- **Performance Review** — see `23_PERFORMANCE.md`. No regression; one real improvement (`+=` accumulation →
  `.map().join()`, removing an O(n²) pattern).

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
| `assets/js/` folder has no owning milestone | Low | **Resolved** — assigned to Milestone 4 |

All 12 items from the pre-Milestone-2 technical debt report were resolved. The escaping, parameter-passing, and
namespace changes were verified byte-identical to the pre-Milestone-1 rendering baseline via
`node scripts/verify-render.js` before being accepted.

## Milestone 3 — Data Model (complete, accepted)

### Goal

Move `PLAYBOOK.chapters` and `PLAYBOOK.companies` out of `index.html` into `data/chapters.json` and
`data/companies.json`, fetched at load and passed into Milestone 2's existing `Render` functions exactly as before
— same rendered output, same fields, just relocated. The first milestone run under the full `15_RELEASE_PROCESS.md`
checklist from the start — see `12_DECISIONS.md` DR-005 for the one significant trade-off this milestone introduced.

### Scope (in)

- Create `data/chapters.json` and `data/companies.json` — same fields as the former inline objects, moved as-is,
  plus a stable `id` per record.
- `index.html` fetches both files on load (in parallel) and passes the results into `Render.sidebar` /
  `Render.chapter` / `Render.companyTable` unchanged.
- A minimal, accessible loading state (`role="status"`) and error state (`role="alert"`) for the async gap.
- `17_TESTING_GUIDE.md`'s smoke test updated to require a local server (`fetch()` against `file://` is blocked by
  browser CORS policy — see `12_DECISIONS.md` DR-005).
- `scripts/verify-render.js` rewritten to read the real `data/*.json` files from disk, proving they're a faithful
  transcription of the original inline data.

### Scope (out — deferred to later milestones)

- Full ~40-field company schema (`11_COMPANY_SCHEMA.md`) or full chapter schema fields (`slug`, `difficulty`,
  `references`, `relatedChapters`, `lastUpdated`) — deferred to whichever milestone next adds real content
  (Milestone 6 for companies), so schema expansion and real data entry happen together rather than as two
  separate touches of the same file.
- Any visible/behavioral change beyond the data now loading asynchronously (plus the necessary loading state).
- Search and theme-toggle logic — untouched.
- Moving the `Render` namespace to `assets/js/render.js` — Milestone 4.

### Acceptance criteria (independently testable) — all passed

1. `data/chapters.json` and `data/companies.json` exist and are valid JSON containing the same data as the
   removed inline `PLAYBOOK` object (verified via `scripts/verify-render.js`).
2. `index.html` contains no hardcoded chapter or company content — only a `fetch()` call and the `Render` functions.
3. Rendered output identical to pre-Milestone-3 once served over HTTP — verified via `scripts/verify-render.js`
   feeding the real JSON files through the same `Render` functions and comparing against the pre-Milestone-1
   baseline (only known diff: the Milestone 2 dark-mode fix).
4. Loading state visible and screen-reader-announced during the fetch, removed once content renders.
5. Manual smoke test (`17_TESTING_GUIDE.md`, updated for a local server) passed, **confirmed by the project owner
   in an actual browser** — not just programmatic verification.

### Definition of Done — met

- All 5 acceptance criteria pass, including a real human browser check (not just `scripts/verify-render.js`).
- Architecture, Documentation, Accessibility, and Performance reviews all completed (`03_ARCHITECTURE.md`,
  `20_ACCESSIBILITY.md`, `23_PERFORMANCE.md`).
- `13_CHANGELOG.md` and `19_CURRENT_SPRINT.md` updated in the same change.
- PR summary and commit message generated; committed as `03f949e`.

### Trade-off accepted (see `12_DECISIONS.md` DR-005)

Local viewing now requires a server — `fetch()` against `file://` is blocked by browser CORS. Flagged to and
accepted by the project owner *before* implementation began. Production (GitHub Pages) is unaffected.

### Honest Performance Review outcome

`index.html` shrank 10,455 → 8,330 bytes; two new parallel requests added (2,585 + 1,026 bytes). Total payload is
marginally larger than before, and there is a genuine, small time-to-first-content cost from the fetch round trip.
Accepted because the project's priority order ranks Maintainability/Scalability above Performance — not glossed
over as a free win.

## Milestone 4 — Renderer (complete, accepted)

### Goal

Complete the render layer started in Milestone 2: every recurring UI region has a named, pure `Render` method backed
by `data/*.json`, the whole `Render` namespace lives in `assets/js/render.js`, and `index.html` becomes a thin shell
(fetch + event wiring only). Visual output for chapters, sidebar TOC, and company table must not regress; new regions
(hero, project-status panel, footer, roadmap seed) are data-driven for the first time.

### Scope (in) — all delivered

- `assets/js/render.js` — full `Render` namespace, loaded via `<script src>` and `require()`'d by verify script.
- `data/site.json`, `data/roadmaps.json` — site chrome and minimal learning-path seed.
- New render functions: `pageHeader`, `search` (chrome only), `hero`, `dashboard`, `roadmap`, `footer`.
- `index.html` thin shell; `scripts/verify-render.js` + `milestone-3-render-golden.json` for regression.

### Acceptance criteria — all passed

1. `assets/js/render.js` loaded by `index.html`; no inline render methods.
2. No hardcoded content strings in `index.html`.
3. Chapter/sidebar output byte-identical to Milestone 3 (`node scripts/verify-render.js`).
4. Hero, dashboard, header, footer, roadmap render from JSON — confirmed in browser at `http://localhost:3456`.
5. Search filter, dark mode, print layout unchanged.
6. Verify script requires `render.js` directly — no duplicate `Render` copy.

### Definition of Done — met

- All 6 acceptance criteria pass, including project-owner browser check.
- Architecture, Documentation, Accessibility, and Performance reviews completed.
- `13_CHANGELOG.md` and `19_CURRENT_SPRINT.md` updated.

### Owner decisions (pre-implementation)

1. `data/site.json` — approved as single home for site chrome.
2. Roadmap seed — approved in `data/roadmaps.json`.
3. `Render.pageHeader` — approved as separate render function.

### Performance Review outcome

Fetch fan-out grew from 2 → 4 parallel requests (`site.json`, `roadmaps.json` added). Payload remains small;
`index.html` shrank further by moving render logic to `assets/js/render.js`. No measurable regression in owner
browser check. Accepted per priority order (Maintainability/Scalability above Performance).

## Milestone 5 — Search (complete, accepted)

### Goal

Replace naive DOM `innerText` search with data-indexed, ranked search over `data/*.json`, with keyboard navigation
and accessible results UI.

### Scope (in) — all delivered

- `assets/js/search.js` — `Search.buildIndex`, `Search.query`, page-order sorting with relevance tiebreaker.
- `Render.searchResults`, search clear (×) button, dismiss on select/outside click.
- `scripts/verify-search.js`; milestone test plan in `17_TESTING_GUIDE.md`.

### Acceptance criteria — all passed

1.–7. Per `14_ROADMAP.md` (automated scripts + owner browser check).

### Test plan

Automated: `node scripts/verify-search.js`, `node scripts/verify-render.js`. Browser: see
`17_TESTING_GUIDE.md` → Milestone 5 — Search (owner confirmed).

### Definition of Done — met

Full `15_RELEASE_PROCESS.md` checklist; accepted by project owner after browser verification.
