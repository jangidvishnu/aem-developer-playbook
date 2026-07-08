# AEM Developer Playbook

Hire-verified AEM employers, apply guidance, and learning paths for Adobe Experience Manager developers — especially those targeting roles in India.

**Live site:** [https://jangidvishnu.github.io/aem-developer-playbook/](https://jangidvishnu.github.io/aem-developer-playbook/)

No build step. Static HTML + vanilla JS + JSON data, served as-is (GitHub Pages compatible).

## Quick start (local)

```bash
npx serve -p 3456
```

Open `http://localhost:3456`. Opening `index.html` via `file://` will fail because the app loads `data/*.json` with `fetch`.

Optional checks:

```bash
npm run verify
npm run ui-smoke
```

## Contributing

`master` is intended to be **protected**. Please open a **pull request** (merge request) instead of pushing to `master`.

See [CONTRIBUTING.md](CONTRIBUTING.md) and [CODE_OF_CONDUCT.md](CODE_OF_CONDUCT.md).

## License

[MIT](LICENSE)

## Repository layout

```
index.html          App shell
data/               JSON content (companies, chapters, site chrome, …)
assets/css/         Styles
assets/js/          Render, search, filters, UI
scripts/            Dev-only verify / smoke tools (not loaded by the site)
.playbook/          Project governance and milestone docs
.github/            CI, PR/issue templates
```

## Maintainers — branch protection (GitHub)

After the first push, in the GitHub UI:

**Settings → Branches → Add branch protection rule** for `master`:

- Require a pull request before merging
- Require approvals (at least 1 when you have collaborators)
- Require status checks to pass: `Verify scripts` and `UI smoke (Playwright search)` (from CI)
- Do not allow bypassing the above for administrators (recommended once CI is green)
- Optionally: restrict who can push / dismiss reviews

Pages: **Settings → Pages** → Deploy from branch → `master` / root (`/`). An empty [`.nojekyll`](.nojekyll) file is in the repo so GitHub does not process the site with Jekyll.
