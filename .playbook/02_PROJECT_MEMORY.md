# Project Memory

A living, one-page snapshot of what is true right now. Update this file whenever the state of the project changes
materially — it exists so a new session (human or AI) never has to reconstruct context from scratch.

## Current state (as of Milestone 1)

- The product is a single self-contained `index.html` (Tailwind via CDN, vanilla JS, inline data). It renders a
  sidebar table of contents, a searchable set of content sections, dark mode with persistence, and print styling.
- Content (chapters, target companies) is currently hardcoded inside `index.html`'s inline `<script>` block. This is
  a known, tracked violation of the data-separation rule. Milestone 2 (Render Function Extraction) extracts the
  rendering logic into named functions first, without moving the data; Milestone 3 (Data Model) then moves the data
  itself into `data/*.json` — see `12_DECISIONS.md` DR-003 for why this is split into two steps.
- Four raw research reports exist in `md/` (`deep-research-report.md` and `-phase-2` through `-phase-4`) containing
  ~100+ candidate companies with AEM usage evidence. This is unverified source material, not yet merged into any
  data file. It is the seed for Milestone 6 (Company Intelligence Database).
- `data/`, `assets/`, and `assets/js/` exist as empty skeleton directories as of Milestone 1 — nothing has been
  extracted into them yet.

## Key incident on record

Early in Milestone 1, all 20 previously-committed `.playbook/00–19` documents and `.github/copilot-instructions.md`
were found deleted from the working tree, along with five newer uncommitted docs (`20`–`24`). The deletion was not
caused by the reviewing session — no write or delete command had been issued before the discrepancy was found.
Circumstantial evidence (`.git/refs/codex/...` checkpoint refs) indicates a separate AI coding session had operated
on this same working directory. See `12_DECISIONS.md` for the full record and the recovery approach taken.

**Lesson carried forward:** do not run two agent sessions against the same working tree at once.

## What is authoritative where

| Question | Authoritative document |
|---|---|
| What are the rules? | `MASTER_BOOTSTRAP_PROMPT.md`, restated in `01_AI_CONSTITUTION.md` |
| What's being built next? | `14_ROADMAP.md` |
| What's being worked on today? | `19_CURRENT_SPRINT.md` |
| Why was X decided? | `12_DECISIONS.md` |
| What changed, and when? | `13_CHANGELOG.md` |

## Open threads carried into future milestones

- `index.html` content is not yet data-driven (Milestone 3).
- The `md/` research reports contain unverified claims ("likely," "unclear") that must be checked before becoming
  part of the published company database (Milestone 6).
- No automated tests or CI exist yet (`17_TESTING_GUIDE.md`, `18_GITHUB_WORKFLOW.md` define the target state).

## Archived: ideas from the pre-Milestone-1 `index.html` constitution comment

Milestone 1 removed a `FUTURE ROADMAP` / `VERSION HISTORY` note that had been embedded as an HTML comment in
`index.html`. Most of its ideas already map onto the current roadmap (global company database → Milestone 6, search
index → Milestone 5, print optimization → `21_PUBLISHING.md`, interview repository → `data/interviews.json` in
`09_DATA_MODEL.md`, visa intelligence → the `VisaSupport` field in `11_COMPANY_SCHEMA.md`). Two ideas did not yet
have a home and are recorded here so they are not lost:

- **Salary intelligence** — a planned content domain (compensation data per company/role) that has no dedicated
  milestone yet. Candidate home: an addition to `11_COMPANY_SCHEMA.md`'s `Compensation` field (already exists) plus
  a possible future `data/salary.json` if it grows beyond a per-company field — to be scoped as a decision
  (`12_DECISIONS.md`) if and when it's prioritized, likely alongside Milestone 6 or 7.
- **Mermaid diagrams** — using Mermaid syntax for visual diagrams (e.g. architecture, roadmap timelines) somewhere
  in the handbook or its documentation. No milestone currently owns this; candidate home is `08_UI_GUIDELINES.md`
  (as a content-rendering capability) or `.playbook/` documentation itself (informational diagrams only, no
  rendering pipeline needed). Not scheduled; recorded here so it resurfaces during Milestone 7 (Learning System)
  planning rather than staying lost.

For the historical record, the removed comment's version history also noted: *"2.1.0 — Switched from Word-first
architecture to HTML-first. Introduced project constitution. Added editorial governance. Added reusable UI
sections. Single-file offline-friendly architecture."* This predates the single Git commit this repository started
from and is preserved here since it has no other home in `13_CHANGELOG.md`'s commit-based history.
