# Prompt Library

Reusable prompts for common tasks in this repository, written so an AI session can execute them consistently
without re-deriving context each time. Each prompt assumes the reader has already read `MASTER_BOOTSTRAP_PROMPT.md`
and `01_AI_CONSTITUTION.md`.

## Start a new milestone

```
Read .playbook/14_ROADMAP.md and .playbook/19_CURRENT_SPRINT.md.
Confirm Milestone <N> is the next unstarted milestone and that the prior milestone's acceptance
criteria are all checked off. Do not begin implementation until this is confirmed. Then propose
the concrete task breakdown for Milestone <N> before writing any code.
```

## Add a verified company entry

```
Using .playbook/07_RESEARCH_GUIDE.md and .playbook/11_COMPANY_SCHEMA.md, add or update the entry
for <Company> in data/companies.json. Cite at least one Tier 1 or Tier 2 source for usesAEM. If no
such source is found, set Status to "Unverified" instead of asserting usesAEM: true. Set
LastVerified to today's date.
```

## Add a new chapter

```
Using .playbook/09_DATA_MODEL.md (chapter schema) and .playbook/05_STYLE_GUIDE.md (voice/structure),
draft a new chapter titled "<Title>". Include summary, tags, an accurate readingTime, and
cross-link relatedChapters in both directions. Do not hardcode it into index.html if data/chapters.json
already exists for this milestone — check .playbook/03_ARCHITECTURE.md for the current state first.
```

## Extract a render function (Milestone 2 work)

```
Using .playbook/10_COMPONENT_LIBRARY.md and 14_ROADMAP.md's Milestone 2 scope, extract <renderX> out
of the inline rendering code in index.html into its own named, top-level function within the same
script (do not move it to assets/js/ yet — that happens once the file-based architecture lands, in
a later milestone). Verify the rendered output is byte-for-byte equivalent before and after the
extraction. Do not add new UI behavior or touch the PLAYBOOK data object in the same change.
```

## Investigate an unexpected repository state

```
Before making any change, run a read-only check of the working tree (git status, directory listing)
and compare it against what README.md, .github/copilot-instructions.md, and .playbook/02_PROJECT_MEMORY.md
say should exist. If there is a discrepancy not explained by your own prior actions in this session,
stop, document it in .playbook/12_DECISIONS.md, and report it before proceeding.
```

## Run an architecture review

```
Read every file in the repository (markdown, HTML, JSON, JS, CSS). Do not modify anything. Produce
a report covering: project purpose, repository summary, folder structure, strengths, weaknesses,
technical debt, duplicate content, missing documentation, missing architecture, suggested
improvements, risks, and long-term opportunities. Stop there — do not create a roadmap or implement
anything until the review is discussed.
```

## Conventions for adding new prompts here

- Keep prompts task-scoped, not milestone-scoped (a milestone is many tasks; a prompt here should map to one).
- Reference the specific `.playbook/` documents the task depends on, so the prompt stays correct if those documents
  are revised.
- Prefer prompts that end in an explicit stopping point ("do not proceed until...") over open-ended ones, matching
  the project's "one milestone/task at a time, then review" discipline.
