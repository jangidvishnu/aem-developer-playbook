# Enterprise Digital Experience Engineering Playbook

A long-term, publication-quality knowledge base for Enterprise Digital Experience Engineers, with an initial focus
on Adobe Experience Manager (AEM), enterprise CMS/DXP platforms, Edge Delivery Services, and career development in
this space. Read `index.html` in a browser to view the handbook — it is a single self-contained file with no build
step.

## Start here

If you are a contributor (human or AI), read these in order before making any change:

1. [`.playbook/MASTER_BOOTSTRAP_PROMPT.md`](.playbook/MASTER_BOOTSTRAP_PROMPT.md) — the project's operating
   constitution: goals, non-negotiable rules, and data/documentation architecture.
2. [`.playbook/00_PROJECT_OVERVIEW.md`](.playbook/00_PROJECT_OVERVIEW.md) — what this project is and who it is for.
3. [`.playbook/01_AI_CONSTITUTION.md`](.playbook/01_AI_CONSTITUTION.md) — rules every AI session must follow.
4. [`.playbook/02_PROJECT_MEMORY.md`](.playbook/02_PROJECT_MEMORY.md) — current state, in one page.
5. [`.playbook/14_ROADMAP.md`](.playbook/14_ROADMAP.md) — the milestone plan and what is in progress right now.
6. [`.playbook/19_CURRENT_SPRINT.md`](.playbook/19_CURRENT_SPRINT.md) — what is actively being worked on.

The full index of governance and reference documents lives in [`.playbook/`](.playbook/); each file is numbered and
covers one topic (architecture, coding standard, style guide, data model, security, accessibility, and more).

## Repository layout

```
index.html          Single-file application: markup, styles, and rendering (see 03_ARCHITECTURE.md)
data/               JSON content sources — populated starting Milestone 3 (see 09_DATA_MODEL.md)
assets/             Static assets (images, non-inline styles)
assets/js/          Extracted JavaScript modules — populated starting Milestone 2
md/                 Raw research inputs (e.g. AEM employer research) awaiting verification and integration
.playbook/          The AI operating system: governance, architecture, and process documentation
.github/            Repository automation and AI-agent instructions
```

## Status

Milestone 1 (Repository Foundation) is implemented, with one required follow-up open before formal acceptance.
Milestone 2 (Render Function Extraction) is planned but not yet implemented. See `.playbook/14_ROADMAP.md` for the
full plan and `.playbook/19_CURRENT_SPRINT.md` for current status.
