# Current Sprint

## Active objective

**Milestones 13 (Loader + Repo Cleanup) and 14 (SEO Prerendering)** — implementation complete for both, pending a
single combined owner acceptance pass. Milestone 12 (Publishing) is **accepted** (Pages live; print/PDF deferred).

**Sequencing note:** M14 was implemented before M13's acceptance, at the owner's explicit direction ("go" right
after the M14 plan was presented) — a deliberate exception to "don't start the next milestone before the current one
is accepted," not an oversight. See `14_ROADMAP.md`'s sequencing note and `12_DECISIONS.md` DR-022.

## Live URLs

- Site: https://jangidvishnu.github.io/aem-developer-playbook/
- Repo: https://github.com/jangidvishnu/aem-developer-playbook

## Session progress (2026-07-08)

### Milestone 12 — accepted

GitHub Pages serving product mode from `master` / root. Print/PDF polish deferred by owner. Collaboration defaults
(MIT, CONTRIBUTING, CI) shipped earlier. **Full detail:** `25_ROADMAP_ARCHIVE.md`.

### M13 — implementation complete

Page loader, `archive/` cleanup, Target Companies fixes, and a full engineering-audit remediation pass (app.js
extraction, sortable headers, debounce, dedup, ESLint/Prettier tooling, docs sync) — see `13_CHANGELOG.md` for detail.

### M14 — implementation complete

Product-mode `index.html`/`sitemap.xml`/`robots.txt` prerendering from `data/*.json` (`scripts/prerender.js`,
`scripts/verify-prerender.js`) so crawlers and no-JS clients see real content — see `13_CHANGELOG.md` and
`12_DECISIONS.md` DR-022 for detail.

### Owner still needs

1. `npm install` (new devDependencies: ESLint, Prettier) before running lint/format locally.
2. Browser verification after hard refresh (loader, Target Companies search + pagination + sort headers).
3. View-source (or `curl`) check that `index.html` now contains real company/apply/learning content, not empty
   containers.
4. `npm run verify` / `npm run lint` / `npm run ui-smoke`.
5. Explicit acceptance of **M13 and M14 together**; push/PR only after owner approval (see
   `.cursor/rules/git-push-approval.mdc`).

## Milestone 11 — accepted

Product mode, mobile cards/drawer, SEO, company explorer polish. **Full detail:** `25_ROADMAP_ARCHIVE.md`.

## Milestones 1–10: accepted

See `14_ROADMAP.md` and `25_ROADMAP_ARCHIVE.md`.
