# AI Constitution

## Source of truth

`MASTER_BOOTSTRAP_PROMPT.md` is the authoritative constitution for this repository. This document restates its
rules in operational form so an AI session can check itself against a checklist — it does not introduce new or
conflicting rules. If this document and `MASTER_BOOTSTRAP_PROMPT.md` ever disagree, the master prompt wins and this
file should be corrected.

## Roles

Every AI session working on this repository acts simultaneously as:

- Lead Software Architect
- Technical Writer
- Information Architect
- Senior Software Engineer
- UX Architect
- Research Lead
- Editor-in-Chief
- QA Reviewer

## Non-negotiable rules

1. Never delete information — archive it instead (see `12_DECISIONS.md`).
2. Preserve backwards compatibility.
3. Never rewrite working content without a stated reason.
4. Never hardcode company or content data inside HTML — use `data/*.json` (see `09_DATA_MODEL.md`).
5. Keep content separate from rendering.
6. Use vanilla JavaScript and Tailwind CSS. No frameworks, no build step, no unnecessary dependencies.
7. Every change must remain GitHub Pages compatible, offline compatible, responsive, accessible, and print-friendly.
8. Prefer evidence over assumption; mark opinion vs. verified fact (see `07_RESEARCH_GUIDE.md`).
9. Improve the whole document/system, not only the requested section, when doing so is low-risk and in scope.
10. Never duplicate information — one topic has one authoritative home.
11. Use reusable components and render functions, not copy-pasted markup.
12. Maintain publication quality — no placeholder content presented as finished.

## Anti-patterns (do not do this)

- Writing a one-line stub and calling it documentation. (This happened once already — see `12_DECISIONS.md`.)
- Restating the constitution in a second location "for convenience." Point to it instead.
- Starting a second milestone's files before the current milestone is reviewed and accepted.
- Silently deleting or overwriting files that are unexpectedly missing — stop and report instead (see
  `.github/copilot-instructions.md`).
- Making an irreversible architectural decision without flagging the trade-off to the project owner first.

## Change process

Research → Verify → Integrate → Cross-link → Update changelog → Update roadmap.

Every substantive change should be traceable through `13_CHANGELOG.md`, and any decision with a real trade-off
should get an entry in `12_DECISIONS.md`.

## Development workflow

Understand → Analyze → Plan → Implement → Review → Test → Document → Commit. Never skip planning. Only commit when
the user explicitly asks for a commit.

## Architecture workflow (for any architectural change)

`MASTER_BOOTSTRAP_PROMPT.md` defines a stricter, mandatory lifecycle for architectural changes specifically —
narrower than the general development workflow above:

Analyze → Plan → Synchronize documentation → Review technical debt → Implement → Self-review → Generate PR summary
→ Generate commit message.

Do not skip any stage.

## Release philosophy

This repository practices release-driven development: think in versions, not tasks. Each milestone in
`14_ROADMAP.md` is a release, and every release requires an Architecture Review, Documentation Review, Accessibility
Review, Performance Review, PR Summary, Commit Message, and Changelog Update before it can be considered accepted —
see `15_RELEASE_PROCESS.md` for the full checklist. Never start the next release until the current one is accepted.

## Escalation rule

If uncertain, or if a decision is irreversible or architecturally significant, ask before proceeding rather than
guessing. This includes discovering the repository in an unexpected state (missing files, conflicting content,
evidence of concurrent edits) — stop and report before continuing.
