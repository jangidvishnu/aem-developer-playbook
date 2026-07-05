# Checklists

Quick-reference checklists, collected from the more detailed guides they summarize. When a checklist here and its
source document disagree, the source document wins — update this file to match.

## Before starting any change

- [ ] Read `MASTER_BOOTSTRAP_PROMPT.md` and `01_AI_CONSTITUTION.md` if this is a new session.
- [ ] Read `14_ROADMAP.md` and `19_CURRENT_SPRINT.md` — confirm the change belongs to the active milestone.
- [ ] Confirm the repository is in the state you expect (`git status`) before editing — stop and report if not.

## Before adding or editing content

- [ ] Sourced per `07_RESEARCH_GUIDE.md` (for factual/company claims).
- [ ] Follows `05_STYLE_GUIDE.md` tone and terminology.
- [ ] Matches the schema in `09_DATA_MODEL.md` / `11_COMPANY_SCHEMA.md` (once those data files exist).
- [ ] Cross-links added both directions where relevant.

## Before adding or editing code

- [ ] No new dependency without a decision record (`12_DECISIONS.md`).
- [ ] No content hardcoded in JS (`04_CODING_STANDARD.md`).
- [ ] Reuses an existing render function instead of duplicating markup (`10_COMPONENT_LIBRARY.md`).
- [ ] Works with no build step; dark mode and print mode both checked.
- [ ] Keyboard and screen-reader accessible (`20_ACCESSIBILITY.md`).

## Before finishing a milestone (= a release — see `15_RELEASE_PROCESS.md`)

- [ ] Every acceptance criterion in `14_ROADMAP.md` for this milestone is met.
- [ ] Architecture Review completed.
- [ ] Documentation Review completed (no stale cross-references — grep for the milestone's old scope terms).
- [ ] Accessibility Review completed.
- [ ] Performance Review completed.
- [ ] Pull Request Summary generated.
- [ ] Conventional Commit Message generated.
- [ ] `13_CHANGELOG.md` updated.
- [ ] `19_CURRENT_SPRINT.md` updated to reflect completion.
- [ ] Explicitly stop and request review — do not start the next milestone/release unprompted.

## Before committing

- [ ] Change has a single, clear responsibility (Conventional Commits, small commits).
- [ ] Only commit when the user has explicitly asked for a commit.
