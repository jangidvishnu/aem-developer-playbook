# Contributing

Thanks for helping improve the [AEM Developer Playbook](https://jangidvishnu.github.io/aem-developer-playbook/).

## How we accept changes

`master` is protected. Do **not** push commits directly to `master`.

1. Fork the repository (or create a branch if you have write access).
2. Make your change on a feature branch.
3. Open a **pull request** into `master`.
4. Wait for CI (verify + UI smoke) to pass and for a maintainer review.

GitHub calls these *pull requests*; that is the same idea as a merge request.

## Local setup

Serve the site over HTTP (browsers block `fetch` of JSON on `file://`):

```bash
npx serve -p 3456
```

Open `http://localhost:3456`.

Checks before you open a PR:

```bash
npm run verify
# optional (needs: npm install && npx playwright install chromium)
npm run ui-smoke
```

## What to change where

| Change | Prefer |
|--------|--------|
| Company / hiring facts | `data/companies.json` (and related pipeline files only if you know the M8 workflow) |
| Chapters / copy | `data/chapters.json`, `data/site.json`, `data/owner_playbook.json`, etc. |
| UI / layout | `assets/js/`, `assets/css/site.css`, `index.html` |
| Process / architecture | `.playbook/` (maintainers usually own this) |

Rules that matter most:

- Do not hardcode company or chapter content inside HTML — use `data/*.json`.
- Prefer evidence over assumption for company fields; mark unknowns honestly.
- Keep the site GitHub Pages compatible: no build step, relative asset paths.
- Never delete information silently — archive or document reversals when needed.

More detail for editors: [`.playbook/06_EDITOR_GUIDE.md`](.playbook/06_EDITOR_GUIDE.md) and [`.playbook/07_RESEARCH_GUIDE.md`](.playbook/07_RESEARCH_GUIDE.md).

## Pull request checklist

- [ ] Change is scoped (one concern per PR when practical)
- [ ] `npm run verify` passes
- [ ] No secrets or credentials committed
- [ ] Company updates include sources / verification where applicable
- [ ] UX changes still work in light/dark mode and on a narrow viewport

## Code of conduct

See [CODE_OF_CONDUCT.md](CODE_OF_CONDUCT.md).
