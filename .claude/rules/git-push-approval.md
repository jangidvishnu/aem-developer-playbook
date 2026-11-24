# Git / PR approval gate

## Hard rules

- **No `git commit`** unless the owner explicitly approved **that** commit in the current message.
  "Looks good" / "proceed" ≠ commit approval. Commit approval ≠ PR-open ≠ merge.
- **Never merge.** Never push to `master`/`main`/`stage` — push feature branches only.
- After opening a PR: report the URL and **stop**. Don't poll or wait for merge.
- If you committed/pushed without approval: stop, tell the owner, ask undo vs leave.

## Branches

| Branch | Host | Agent PRs |
|---|---|---|
| **`stage`** | GitHub Pages | Feature branch (off `stage`) → `stage` |
| **`master`** | Cloudflare (canonical) | `stage` → `master` promote only when the owner asks |

## Before asking for commit approval

1. Summarize changed files + why.
2. Say how to verify locally (serve + hard refresh; print CSS → Print Preview).
3. Add **one** Unreleased entry in `.playbook/13_CHANGELOG.md` for the whole PR (never mid-feature; merge into the
   branch's existing entry if there is one).

## After approval

1. Commit. 2. `npm run verify` + `npm run ui-smoke` green. 3. Push the feature branch.
4. If PR-open wasn't approved, ask once; then `gh pr create --base stage`.
5. `git checkout stage && git pull origin stage`. Report PR URL; stop.

New work always starts from freshly pulled `stage`.

## Promote (owner asks in a new message)

Confirm `stage` is ahead of `master`; reuse an open `stage`→`master` PR or `gh pr create --base master --head stage`.
Report URL; stop.
