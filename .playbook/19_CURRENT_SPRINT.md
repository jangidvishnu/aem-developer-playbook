# Current Sprint

## Active objective

**Branching / hosting** — `stage` (GitHub Pages) + `master` (Cloudflare); default PRs to `stage`. Apache-2.0 +
brand notice in progress on `feat/apache-license-brand-notice`. Milestone 15 (EDS/Forms chips) is next after that.

## Live URLs

- **Production:** https://aemplaybook.pages.dev/ (`master` → Cloudflare)
- **Staging:** https://jangidvishnu.github.io/aem-developer-playbook/ (`stage` → GitHub Pages)
- **Repo:** https://github.com/jangidvishnu/aem-developer-playbook

## Session progress (2026-07-09)

### Hosting / PRs

- Default: feature → PR → **`stage`** → verify on GitHub Pages.
- Production: only when owner asks → promote **`stage` → `master`** → Cloudflare.
- Agent rule: `git-push-approval.mdc` (DR-028).

### Next

1. Finish creating protected `stage` + point GitHub Pages at it (if not done yet).
2. Land Apache-2.0 / NOTICE PR into **`stage`**.
3. Milestone 15 when ready.

## Milestones 1–14: accepted

See `14_ROADMAP.md` and `25_ROADMAP_ARCHIVE.md`.
