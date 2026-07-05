# GitHub Workflow

## Commit conventions

- Conventional Commits (`feat:`, `fix:`, `docs:`, `refactor:`, `chore:`, etc.).
- Small commits, one responsibility per commit — do not mix a documentation rewrite with a code refactor in the
  same commit.
- Commit messages explain *why*, not just *what*, where the reason isn't obvious from the diff.
- Only commit when explicitly asked to — an AI session should not commit proactively.

## Branching (target state)

Currently all work has landed on a single default branch via one initial commit. As collaboration grows, prefer:

- One branch per milestone or per well-scoped task within a milestone.
- Branch names describe the work (`milestone-1-repository-foundation`, not `fix-stuff`).

## Pull requests (target state)

- A PR should map to one milestone or one clearly-scoped slice of a milestone, never multiple milestones at once
  (see `14_ROADMAP.md`'s "one milestone at a time" rule).
- PR description should state which milestone/acceptance criteria it addresses and link the relevant
  `12_DECISIONS.md` entries if any trade-offs were made.
- Review against `16_CHECKLISTS.md` before merge.

## Issue tracking (target state)

Not yet in use. Once adopted, issues should map to specific `14_ROADMAP.md` milestone items rather than being
tracked ad hoc, so `19_CURRENT_SPRINT.md` and the issue tracker never drift out of sync — `19_CURRENT_SPRINT.md`
remains the single source of truth for "what's active right now."

## CI (target state)

No CI configured yet. Once automated tests exist (`17_TESTING_GUIDE.md`, once render functions move to `assets/js/`),
CI should at minimum:

- Validate any `data/*.json` file against its documented schema.
- Run the automated test suite for extracted render functions.
- Fail on any accidental introduction of a build-step dependency (`package.json` with a bundler, etc.), preserving
  the "no build step" constraint.

## Handling a repository found in an unexpected state

If `git status` shows unexpected deletions/modifications not caused by the current session (see the Milestone 1
incident in `12_DECISIONS.md`), stop before committing anything and surface the discrepancy for review — never
commit over an unexplained change without understanding its cause first.
