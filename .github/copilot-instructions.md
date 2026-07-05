# Repository Instructions for AI Coding Agents

This repository is a long-term, publication-quality knowledge base, not a demo project. Follow these instructions
for every change, however small.

## Read before making ANY change

If you're working in Cursor, `.cursor/rules/` already loads the core constitution and current-state pointers
automatically, plus topic-specific rules that auto-attach based on which files you're editing — you don't need to
manually read the list below every time. For any other agent (including this file's primary audience, GitHub
Copilot, which doesn't use Cursor's rule system), read in order:

1. `.playbook/MASTER_BOOTSTRAP_PROMPT.md` — the operating constitution (goals, non-negotiable rules, data model).
2. `.playbook/00_PROJECT_OVERVIEW.md` — merged Project Overview, AI Constitution, and Project Memory (current state
   and key facts). This one file replaces what used to be three separate reads.
3. `.playbook/14_ROADMAP.md` — which milestone is active, and what is explicitly out of scope right now (full
   historical detail for completed milestones is in `.playbook/25_ROADMAP_ARCHIVE.md` — not needed for routine work).
4. `.playbook/19_CURRENT_SPRINT.md` — what is actively being worked on.

Read `.playbook/03_ARCHITECTURE.md` and `.playbook/09_DATA_MODEL.md` only when the task actually touches
`index.html`, `scripts/`, or `data/` — they're no longer mandatory for every change (see `12_DECISIONS.md` DR-004
for why this list was shortened).

## Non-negotiable rules

- Never delete content during refactoring — archive it instead (see `12_DECISIONS.md` for the archival pattern).
- Preserve backwards compatibility.
- Implement only the requested task or milestone; do not start the next milestone without explicit approval.
- Prefer reusable render functions over inline duplicated markup.
- Keep content data (`data/*.json`) separate from rendering (`index.html` / `assets/js/`).
- Use Vanilla JS + Tailwind CSS. No frameworks, no build step, no unnecessary dependencies.
- Every change must keep the site GitHub Pages compatible, offline compatible, responsive, accessible, and
  print-friendly.

## Workflow

Understand → Analyze → Plan → Implement → Review → Test → Document → Commit. Never skip planning. Use Conventional
Commits with small, single-responsibility commits — but only commit when the user explicitly asks you to.

## If you find the repository in an inconsistent state

If tracked files referenced by this document or by `README.md` are missing from disk, stop and report this before
making further changes — do not silently regenerate or delete content to "fix" the discrepancy. See
`12_DECISIONS.md` for the precedent (the Milestone 1 repository-integrity incident).
