# Enterprise Digital Experience Engineering Playbook

A long-term, publication-quality knowledge base for Enterprise Digital Experience Engineers, with an initial focus
on Adobe Experience Manager (AEM), enterprise CMS/DXP platforms, Edge Delivery Services, and career development in
this space. Read `index.html` in a browser to view the handbook — it is a single self-contained file with no build
step.

## Start here

If you are a contributor (human or AI), read these in order before making any change:

1. [`.playbook/MASTER_BOOTSTRAP_PROMPT.md`](.playbook/MASTER_BOOTSTRAP_PROMPT.md) — the project's operating
   constitution: goals, non-negotiable rules, and data/documentation architecture.
2. [`.playbook/00_PROJECT_OVERVIEW.md`](.playbook/00_PROJECT_OVERVIEW.md) — what this project is, the AI
   constitution every session must follow, and the current-state living memory, all in one file.
3. [`.playbook/14_ROADMAP.md`](.playbook/14_ROADMAP.md) — the milestone plan and what is in progress right now
   (completed milestones' full history is in [`.playbook/25_ROADMAP_ARCHIVE.md`](.playbook/25_ROADMAP_ARCHIVE.md)).
4. [`.playbook/19_CURRENT_SPRINT.md`](.playbook/19_CURRENT_SPRINT.md) — what is actively being worked on.

If you're using Cursor, `.cursor/rules/` loads the constitution and current-state pointers automatically, plus
topic-specific rules that auto-attach based on which files you're editing — see `12_DECISIONS.md` DR-004.

The full index of governance and reference documents lives in [`.playbook/`](.playbook/); each file is numbered and
covers one topic (architecture, coding standard, style guide, data model, security, accessibility, and more).

## Repository layout

```
index.html          Single-file application: markup, styles, and rendering (see 03_ARCHITECTURE.md)
scripts/            Dev-only tooling, never shipped (e.g. verify-render.js — a rendering regression check)
data/               JSON content sources — populated starting Milestone 3 (see 09_DATA_MODEL.md)
assets/             Static assets (images, non-inline styles)
assets/js/          Extracted JavaScript modules — populated starting Milestone 4
md/                 Raw research inputs (e.g. AEM employer research) awaiting verification and integration
.playbook/          The AI operating system: governance, architecture, and process documentation
.cursor/rules/      Cursor project rules — auto-loaded context, replacing a manual "read these files" instruction
.github/            Repository automation and AI-agent instructions
```

## Status

Milestones 1 (Repository Foundation) and 2 (Render Function Extraction) are both complete, fully reviewed, and
committed. See `.playbook/14_ROADMAP.md` for the full plan and `.playbook/19_CURRENT_SPRINT.md` for current status.
Milestone 3 (Data Model) has not started.
