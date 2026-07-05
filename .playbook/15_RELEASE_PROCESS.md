# Release Process

## Release philosophy (source: `MASTER_BOOTSTRAP_PROMPT.md`)

This repository is developed using **release-driven development** — think in versions, not tasks. In practice, each
milestone in `14_ROADMAP.md` *is* a release. Every release must be:

- Independently testable
- Independently deployable
- Independently reviewable

And every release must include, before it is considered accepted:

1. Architecture Review
2. Documentation Review
3. Accessibility Review
4. Performance Review
5. Pull Request Summary
6. Conventional Commit Message
7. Changelog Update
8. **Milestone test plan published** — see below and `17_TESTING_GUIDE.md`

**Never start the next release until the current one has been accepted.** This is a non-negotiable constraint, not
a suggestion — see the escalation rule in `01_AI_CONSTITUTION.md`.

## Current state

Milestone 2 (Render Function Extraction) shipped a self-review, a PR summary, a commit message, and a changelog
update — but this release-philosophy section was added to `MASTER_BOOTSTRAP_PROMPT.md` after that work was done, so
Milestone 2 did **not** include a dedicated Accessibility Review or Performance Review. This is logged as an open
gap in `19_CURRENT_SPRINT.md` rather than backfilled silently. From Milestone 3 onward, all 7 items above are
required before a milestone/release can be marked accepted. A real *published* release process (tagging, GitHub
Pages deploy) is still scheduled alongside Milestone 8 (Publishing) — this section governs the review discipline
around each milestone, which applies starting immediately.

## Target process (from Milestone 8 onward)

1. Work lands on the default branch only after its milestone is reviewed and accepted (see `14_ROADMAP.md`).
2. A release bumps the version shown in `index.html` and adds a dated entry to `13_CHANGELOG.md` summarizing what
   changed for readers (not just contributors).
3. GitHub Pages serves the default branch directly (no build step, per `04_CODING_STANDARD.md`), so publishing a
   release is effectively merging to default branch plus tagging.
4. Print/PDF exports (see `21_PUBLISHING.md`) are regenerated per release once that pipeline exists.

## Versioning scheme

Semantic-ish, not strict SemVer, since this is a content/documentation product rather than an API:

- **Major** — structural change (new architecture, new major content domain like the Company Database going live).
- **Minor** — new content domain, milestone completion, or notable feature (search, new render functions).
- **Patch** — content corrections, small fixes, copy edits.

## Rollback

Because content is never deleted (only archived, per `01_AI_CONSTITUTION.md`), rollback is primarily a git revert
of the offending commit(s). There is no database or external state to roll back — the entire product is the
repository contents.

## Pre-release checklist (applies to every milestone from Milestone 3 onward)

- [ ] All milestone acceptance criteria met (`14_ROADMAP.md`).
- [ ] Architecture Review — does the change match `03_ARCHITECTURE.md` and `MASTER_BOOTSTRAP_PROMPT.md`?
- [ ] Documentation Review — are all affected `.playbook/` docs synchronized (no stale cross-references)?
- [ ] Accessibility Review — keyboard, screen-reader, contrast per `20_ACCESSIBILITY.md`.
- [ ] Performance Review — against the budgets in `23_PERFORMANCE.md`.
- [ ] Pull Request Summary generated.
- [ ] Conventional Commit Message generated.
- [ ] `13_CHANGELOG.md` updated with a dated, reader-facing summary.
- [ ] Version number consistent everywhere it appears.
- [ ] **Milestone test plan** added or updated in `17_TESTING_GUIDE.md` (see "Milestone test plans" there).
- [ ] `19_CURRENT_SPRINT.md` links to that test plan and states what the project owner must verify.
- [ ] When reporting completion to the project owner, include the test steps inline (automated commands + browser
  checklist) — do not only say "run the smoke test."
- [ ] Manual smoke test per `17_TESTING_GUIDE.md` (baseline + milestone-specific steps).
- [ ] Explicitly presented for review — next release/milestone does not start until this one is accepted.

## Milestone test plan (required when implementation is complete)

When a milestone's code changes are done and the release is **pending acceptance**, the agent (human or AI) must
publish a concrete test plan before asking the project owner to sign off. This is separate from acceptance criteria
in `14_ROADMAP.md` — those define *what* must be true; the test plan defines *how to verify it*.

**Where it lives (one topic, one home):**

| What | Authoritative location |
|---|---|
| Full step-by-step test plan (automated + browser) | `17_TESTING_GUIDE.md` → **Milestone test plans** → subsection for that milestone |
| Pointer + owner action while pending | `19_CURRENT_SPRINT.md` → milestone section with link to the subsection above |
| Historical copy after acceptance | `25_ROADMAP_ARCHIVE.md` → milestone entry (add "Test plan" bullet summarizing what was run) |

**What every milestone test plan must include:**

1. **Automated checks** — exact shell commands (e.g. `node scripts/verify-search.js`) and expected pass output.
2. **How to serve locally** — HTTP only (`file://` fails after Milestone 3); list options that work on this machine
   (Cursor Live Preview, `npx serve`, `python -m http.server`, or a one-line Node static server).
3. **Browser checklist** — numbered steps the project owner can follow without reading the codebase, including at
   least one check per milestone-specific acceptance criterion that requires human verification.
4. **Regression checks** — baseline items from the manual smoke test in `17_TESTING_GUIDE.md` that still apply
   (dark mode, print preview, etc.).

**When presenting completion to the project owner**, paste or summarize sections 1–3 in the chat/PR — do not rely on
them discovering steps only in `.playbook/`.
