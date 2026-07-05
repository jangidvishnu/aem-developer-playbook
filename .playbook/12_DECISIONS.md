# Decision Records

Format: one entry per decision, newest first. Each entry states the context, the decision, and the trade-off
accepted. Decisions are never deleted — if a decision is later reversed, add a new entry that supersedes it and
mark the old one as superseded.

---

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
