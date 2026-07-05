# Decision Records

Format: one entry per decision, newest first. Each entry states the context, the decision, and the trade-off
accepted. Decisions are never deleted — if a decision is later reversed, add a new entry that supersedes it and
mark the old one as superseded.

---

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
