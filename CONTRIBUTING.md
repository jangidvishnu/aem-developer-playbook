# Contributing

Thanks for helping improve the [AEM Developer Playbook](https://aemplaybook.pages.dev/).

## How we accept changes

`stage` and `master` are both protected. Do **not** push commits directly to either.

1. Fork the repository (or create a branch if you have write access).
2. Make your change on a feature branch.
3. Open a **pull request** into **`stage`** (default staging / GitHub Pages).
4. Wait for CI (verify + UI smoke) to pass and for a maintainer review.
5. Production (`master` / Cloudflare) is updated only when a maintainer promotes **`stage` → `master`**.

GitHub calls these *pull requests*; that is the same idea as a merge request.

## Local setup

Serve the site over HTTP (browsers block `fetch` of JSON on `file://`):

```bash
npx serve -p 3456
```

Open `http://localhost:3456`. On first paint you should see a short branded loader, then content.

**If you changed any `data/*.json` file, run `npm run prerender` first** — Milestone 14 bakes that data into
`index.html`/`sitemap.xml`/`robots.txt` for SEO (`.playbook/12_DECISIONS.md` DR-022), and `npm run verify` will fail
with a "STALE" error (naming the file and the first differing character) if you forget:

```bash
npm run prerender
```

Checks before you open a PR (`npm run verify` now includes render, search, filters, owner playbook, companies,
learning-data, and prerender-freshness validation — no separate command needed per data file):

```bash
npm install
npm run verify
npm run lint
# optional (needs: npx playwright install chromium)
npm run ui-smoke
```

`npm run lint` (ESLint + Prettier) and `npm run verify` (which includes the prerender freshness check) both also run
automatically via a local pre-commit hook once you've run `npm install` — see `.playbook/12_DECISIONS.md` DR-021 and
DR-022.

## What to change where

| Change | Prefer |
|--------|--------|
| Company / hiring facts | `data/companies.json` only (see `archive/` for historical research — DR-017) |
| Chapters / copy | `data/chapters.json`, `data/site.json`, `data/owner_playbook.json`, etc. |
| Community links (LinkedIn groups only — no public WhatsApp invites) | `data/site.json` → `community` |
| UI / layout | `assets/js/`, `assets/css/site.css`, `index.html` |
| Process / architecture | `.playbook/` (maintainers usually own this) |
| Prerendered content (`index.html`'s baked sections, `sitemap.xml`, `robots.txt`) | Never hand-edit — regenerate with `npm run prerender` after a `data/*.json` change (DR-022) |

### Adding or updating companies

Live employer data is **only** [`data/companies.json`](data/companies.json). Do not invent a second company file.

1. Read [`.playbook/11_COMPANY_SCHEMA.md`](.playbook/11_COMPANY_SCHEMA.md) for field shapes.
2. Follow [`.playbook/07_RESEARCH_GUIDE.md`](.playbook/07_RESEARCH_GUIDE.md) for the full field pass:
   - `careersUrl` must be **employer-owned** (not Naukri / LinkedIn Jobs / Cutshort / Foundit as the careers URL).
   - `evidence` should prove AEM usage (Adobe case study or company practice page when possible).
   - `notes` are **shown in the UI** — write for job seekers; no research jargon (`DR-xxx`, “Tier N BuiltWith”).
   - Check M&A / rebrand duplicates before adding a child brand.
3. Set `ownerVerified: false` and `verifiedAt` to today’s date on agent-added rows.
4. Run `node scripts/verify-companies.js`, then `npm run prerender` if counts/hero stats change.

### Pull requests

Open PRs against **`stage`** (GitHub Pages preview). Maintainers promote `stage` → `master` (Cloudflare) separately. Never push directly to `stage` or `master`.

Rules that matter most:

- Do not hardcode company or chapter content inside HTML — use `data/*.json`.
- Prefer evidence over assumption for company fields; mark unknowns honestly.
- Keep the site GitHub Pages compatible: no build step, relative asset paths.
- Never delete information silently — archive or document reversals when needed.

More detail: [`.playbook/06_EDITOR_GUIDE.md`](.playbook/06_EDITOR_GUIDE.md) and [`.playbook/07_RESEARCH_GUIDE.md`](.playbook/07_RESEARCH_GUIDE.md).

## Pull request checklist

- [ ] Change is scoped (one concern per PR when practical)
- [ ] Ran `npm run prerender` if any `data/*.json` file changed (DR-022)
- [ ] `npm run verify` passes
- [ ] `npm run lint` passes
- [ ] No secrets or credentials committed
- [ ] Company updates include sources / verification where applicable
- [ ] UX changes still work in light/dark mode and on a narrow viewport
- [ ] First-load / loader changes verified with a hard refresh over HTTP

## Maintainer note (local agents)

Do not push a branch or open a PR until the project owner has **explicitly approved** after local review
(`.cursor/rules/git-push-approval.mdc`).

## License and brand

By opening a pull request you agree that your contribution is licensed under the same
[Apache License 2.0](LICENSE) as the rest of the project (see [NOTICE](NOTICE)).

You may fork and improve this work under Apache-2.0. Please keep the copyright notice and
[NOTICE](NOTICE) when you redistribute.

## Code of conduct

See [CODE_OF_CONDUCT.md](CODE_OF_CONDUCT.md).
