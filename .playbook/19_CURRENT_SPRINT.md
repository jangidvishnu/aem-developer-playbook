# Current Sprint

## Active objective

Milestone 2 (Render Function Extraction) has been implemented and verified. **Do not start Milestone 3** until
this milestone is explicitly reviewed and accepted by the project owner.

## Milestone 1 — Repository Foundation: status

Implemented. One blocking follow-up remains before this milestone is formally "reviewed and accepted" per
`01_AI_CONSTITUTION.md`'s escalation rule:

- [x] Record full roadmap (`14_ROADMAP.md`)
- [x] Record the repository-integrity incident (`12_DECISIONS.md`, `02_PROJECT_MEMORY.md`)
- [x] Rewrite `README.md` and `.github/copilot-instructions.md`
- [x] Create `data/`, `assets/`, `assets/js/` skeleton
- [x] Write real content for `.playbook/00`–`24`
- [x] Remove duplicated constitution from `index.html`; fix version mismatch
- [x] Final verification pass against Milestone 1 acceptance criteria
- [x] Present Milestone 1 for review (Lead-Architect PR review completed)
- [x] Synchronize `14_ROADMAP.md`, `19_CURRENT_SPRINT.md`, `13_CHANGELOG.md`, and add `12_DECISIONS.md` DR-003 for
      the Milestone 2 scope reduction (this pass)
- [ ] **Blocking:** archive the `FUTURE ROADMAP` / `VERSION HISTORY` content lost from `index.html`'s old comment
      block ("Salary intelligence," "Mermaid diagrams," and the 2.1.0 history note) — not yet done, out of scope
      for this documentation-sync pass

## Milestone 2 — Render Function Extraction: status

**Implemented, pending review.**

- [x] `renderSidebar`, `renderChapter`, `renderCompanyTable`, `renderCompanyRow` extracted as named functions in
      `index.html`
- [x] Rendered output verified byte-identical before/after (Node harness, `toc`/`main` innerHTML matched exactly)
- [x] `10_COMPONENT_LIBRARY.md`, `13_CHANGELOG.md` updated to reflect implementation
- [x] Self-review, PR summary, and commit message generated
- [ ] **Gap:** no dedicated Accessibility Review or Performance Review was done for this milestone —
      `MASTER_BOOTSTRAP_PROMPT.md`'s Release Philosophy section (requiring both for every release) was added after
      this milestone's implementation. Not backfilled without being asked; open pending a decision.
- [ ] Presented for review — **do not start Milestone 3 until this is explicitly accepted**

## Documentation sync — MASTER_BOOTSTRAP_PROMPT.md Release Philosophy (this pass)

`MASTER_BOOTSTRAP_PROMPT.md` gained a new "Release Philosophy" section (release-driven development; every release
needs Architecture/Documentation/Accessibility/Performance reviews + PR summary + commit message + changelog
update). Synchronized into:

- [x] `15_RELEASE_PROCESS.md` — full philosophy and updated pre-release checklist
- [x] `01_AI_CONSTITUTION.md` — added Architecture Workflow and Release Philosophy sections (also closes the
      previously-open Medium-severity debt item: this doc didn't reflect the Architecture Workflow at all)
- [x] `16_CHECKLISTS.md` — "before finishing a milestone" checklist expanded to the full release checklist
- [x] `14_ROADMAP.md` — added a "Release discipline" note and a technical-debt-carried-forward table for Milestone 2

## Explicitly not started

Milestone 3 and everything after it. No code changes for Milestone 3 should land until Milestone 2 is reviewed and
accepted.

## Blockers / open questions for the project owner

- Was another agent session or IDE window open against this same working directory during the Milestone 1
  investigation? Still unresolved.
- The Milestone 1 content-preservation follow-up (archiving the lost roadmap ideas) has not been scheduled.
- The Critical documentation self-contradiction in `14_ROADMAP.md` (stale Milestone 1 "Scope (out)" bullets) flagged
  in the pre-Milestone-2 technical debt report was intentionally left unfixed in this change, per "do not expand
  scope" — still open.
- Two High-severity technical debt items (no HTML-escaping utility; `renderChapter`'s coupling to
  `PLAYBOOK.companies`) were also intentionally left unaddressed, per the same instruction.
