# Decision Records

Format: one entry per decision, newest first. Each entry states the context, the decision, and the trade-off
accepted. Decisions are never deleted — if a decision is later reversed, add a new entry that supersedes it and
mark the old one as superseded.

---

## DR-006 — Milestone 6 verification defaults (25 verified, 100-row cap, pagination 25)

**Date:** Milestone 6 (start)
**Context:** Milestone 6 open questions (verified minimum, unverified ingest cap, pagination size) were scoped with
default proposals. The project owner accepted Milestone 5 and directed work to proceed to Milestone 6 without
explicitly re-stating each default.
**Decision:** Adopt the scoped defaults: (1) acceptance requires **25 `Status: "Verified"`** companies with
`Evidence` and `LastVerified`; (2) additional candidates may be ingested as `Status: "Unverified"` up to **100
total rows** in `data/companies.json`; (3) company table pagination at **25 rows per page**.
**Trade-off accepted:** Verification work is front-loaded into Milestone 6 and may span multiple sessions; unverified
rows are visible in search/table but clearly marked and never `usesAEM: true` without evidence.
**Follow-up:** None open unless the owner overrides any of the three numbers.

## DR-005 — Accept that local viewing requires a server once Milestone 3 introduces `fetch()`

**Date:** Milestone 3
**Context:** Milestone 3 moves `PLAYBOOK.chapters`/`PLAYBOOK.companies` into `data/*.json`, fetched via
`fetch()` at load time. Browsers block `fetch()` against `file://` URLs under their default CORS policy, which
means `index.html` can no longer be viewed by double-clicking it locally — it must be served over HTTP (any static
server: `npx serve`, `python -m http.server`, the VS Code/Cursor Live Preview extension already configured in this
repo's `.vscode/settings.json`, etc.). This changes a workflow that has been true since the project's first commit.
**Decision:** Accept the trade-off rather than avoid it (e.g. via a `data/chapters.js` global-variable wrapper
instead of `.json` + `fetch()`), because `MASTER_BOOTSTRAP_PROMPT.md` explicitly mandates JSON as the primary data
source, and because the deployed site (GitHub Pages) is entirely unaffected — this only changes local development,
not production. `17_TESTING_GUIDE.md`'s smoke test is updated accordingly.
**Trade-off accepted:** Contributors must run one command (or use an editor's built-in live-preview feature) before
viewing local changes, instead of double-clicking `index.html`. In exchange, the data layer conforms to the
constitution's explicit JSON mandate and unlocks the same `fetch()`-based pattern for every future data file
(`technologies.json`, `roadmaps.json`, etc. in later milestones).
**Follow-up:** None open. Flagged to and accepted by the project owner before implementation began.

## DR-004 — Restructure `.playbook/` for AI token efficiency: merge core docs, archive roadmap history, add Cursor rules

**Date:** Post-Milestone-2
**Context:** Measuring every `.playbook/` file directly showed the 26 governance documents total ~28,000 tokens,
and `.github/copilot-instructions.md` mandated reading 7 of them in full (`MASTER_BOOTSTRAP_PROMPT.md`,
`01_AI_CONSTITUTION.md`, `02_PROJECT_MEMORY.md`, `03_ARCHITECTURE.md`, `09_DATA_MODEL.md`, `14_ROADMAP.md`,
`19_CURRENT_SPRINT.md`) before *any* change, regardless of relevance — roughly 10,000 tokens paid on every session
even for a trivial, unrelated task. `14_ROADMAP.md` alone had grown to ~3,400 tokens by keeping full historical
detail for every completed milestone forever.
**Decision:**
1. Merge `00_PROJECT_OVERVIEW.md`, `01_AI_CONSTITUTION.md`, and `02_PROJECT_MEMORY.md` into one file
   (`00_PROJECT_OVERVIEW.md`), deduplicating overlapping content. The other two are kept as short pointer stubs
   (not deleted) so every existing cross-reference across `.playbook/` continues to resolve.
2. Move completed milestones' full Goal/Scope/Estimates/Acceptance-Criteria/Definition-of-Done/review detail out of
   `14_ROADMAP.md` into a new `25_ROADMAP_ARCHIVE.md`. The active roadmap keeps only the milestone sequence table
   and a short summary + link per completed milestone.
3. Add `.cursor/rules/` (`constitution.mdc`, `current-state.mdc` — both `alwaysApply: true` — plus
   `coding-standard.mdc`, `architecture.mdc`, `company-data.mdc`, `editorial-style.mdc`, each scoped with `globs:`
   to only auto-attach when relevant files are open) so Cursor sessions get the right context automatically instead
   of a manual "read these N files" instruction.
4. Update `.github/copilot-instructions.md` to reflect the new structure and note that Cursor users get most of
   this automatically via rules.
**Trade-off accepted:** An extra indirection (stub files, an archive file) to navigate for anyone specifically
looking for the old `01_AI_CONSTITUTION.md`/`02_PROJECT_MEMORY.md` files or historical milestone detail, in
exchange for an estimated ~68% reduction in the token cost paid on every session (~10,000 → ~3,200 tokens for a
typical code-touching task, less for anything that doesn't touch code).
**Follow-up:** None open. No information was deleted — this is pure reorganization; full historical and
constitutional content still exists, just relocated and no longer force-read by default.

## DR-003 — Split Milestone 2 into a smaller "Render Function Extraction" step, deferring data migration to Milestone 3

**Date:** Post-Milestone-1 (pre-Milestone-2 planning)
**Context:** A Lead-Architect PR review of Milestone 1 found that the roadmap's original Milestone 2 description
("split `index.html`'s inline `PLAYBOOK` object and rendering loop into: a thin HTML shell, a `data/` fetch layer,
and named render functions") bundled two independently-testable concerns — extracting render functions, and
migrating data to `data/*.json` with `fetch()` — into a single milestone. It also silently overlapped with
Milestone 4 ("Renderer — implement the named render functions"), already planned as a separate, later step.
Combining both concerns violates the roadmap's own "one responsibility at a time" principle and the "small,
independently testable, reversible" requirement given for Milestone 2 specifically.
**Decision:** Narrow Milestone 2 to render-function extraction only: `renderSidebar`, `renderChapter`, and
`renderCompanyTable` are extracted as named, pure functions operating on `PLAYBOOK.chapters` / `PLAYBOOK.companies`
exactly where that data already lives in `index.html`. No data migration, no `fetch()`, no loading states in this
milestone — those move to Milestone 3 (Data Model), which now also absorbs the "move data out of `index.html`" work
previously implied by Milestone 2. Milestone 4 (Renderer) is narrowed in turn to extending the render-function set
to content types that don't exist in the UI yet (hero, roadmap, dashboard, footer, search), once Milestone 3 gives
them a data source.
**Trade-off accepted:** One more milestone-sequencing update to keep synchronized across `14_ROADMAP.md`,
`03_ARCHITECTURE.md`, and `10_COMPONENT_LIBRARY.md`, in exchange for a Milestone 2 that is genuinely small, has one
objective pass/fail test (byte-identical rendered output), and is trivially revertible (one file, one `<script>`
block, no data changes).
**Follow-up:** None open — `14_ROADMAP.md`, `03_ARCHITECTURE.md`, and `10_COMPONENT_LIBRARY.md` were updated in the
same pass that introduced this decision record.

## DR-002 — Recover from the Milestone 1 repository-integrity incident by rewriting, not restoring, the stub docs

**Date:** Milestone 1
**Context:** An Architecture Review found that all 20 committed `.playbook/00–19` files and
`.github/copilot-instructions.md` were missing from the working tree, while still present as one-line stubs in git
history (48–197 bytes each). Five newer, never-committed docs (`20`–`24`) were also missing. No delete command had
been run by the reviewing session; `.git/refs/codex/...` checkpoint refs indicate a separate AI coding session had
operated on this repository.
**Decision:** Do not `git checkout` the old stub content back from history. The stubs were themselves a violation
of the "publication quality, not placeholders" rule, so restoring them would restore a known problem. Instead,
Milestone 1 writes real, complete content for all 25 documents from scratch, using `MASTER_BOOTSTRAP_PROMPT.md` as
the source spec.
**Trade-off accepted:** Slightly more up-front writing effort in Milestone 1, in exchange for never having placeholder
documentation checked in again.
**Follow-up:** Confirm with the project owner whether another agent session/window was concurrently open on this
repository, and avoid running two sessions against the same working tree going forward (see `02_PROJECT_MEMORY.md`).

## DR-001 — Adopt milestone-based delivery instead of a flat task backlog

**Date:** Milestone 1
**Context:** `MASTER_BOOTSTRAP_PROMPT.md` requires an implementation roadmap split into independently testable
milestones, implemented one at a time, only after roadmap approval.
**Decision:** Roadmap recorded in `14_ROADMAP.md` with 8 milestones (Repository Foundation → Publishing). Each
milestone lists explicit in-scope and out-of-scope items and acceptance criteria before implementation starts.
**Trade-off accepted:** Slower to reach visible feature work, in exchange for avoiding the duplicated/contradictory
state that a flat backlog already produced once in this repository's short history.

---

## Template for new entries

```
## DR-00N — <short decision title>

**Date:** <milestone or date>
**Context:** <what prompted this decision>
**Decision:** <what was decided>
**Trade-off accepted:** <what was given up>
**Follow-up:** <any open action items, optional>
```
