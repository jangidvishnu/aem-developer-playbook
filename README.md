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
node scripts/verify-companies.js
npm run ui-smoke
```

## Contributing

`master` is intended to be **protected**. Please open a **pull request** instead of pushing to `master`.

See [CONTRIBUTING.md](CONTRIBUTING.md) and [CODE_OF_CONDUCT.md](CODE_OF_CONDUCT.md).

## License

[MIT](LICENSE)

## Repository layout

```
index.html          App shell
data/               Runtime JSON only (companies, chapters, site, learning, …)
assets/             CSS, JS, icons
scripts/            Dev verify / UI smoke (not loaded by the site)
archive/            Historical research + legacy company pipeline (not fetched)
.playbook/          Governance and milestone docs
.github/            CI, PR/issue templates
.cursor/rules/      Cursor agent rules
```

Published company DB: **`data/companies.json` only**. Historical seeds and research: [`archive/README.md`](archive/README.md).

## Maintainers — branch protection (GitHub)

**Settings → Branches** for `master`:

- Require a pull request before merging
- **Do not** require approvals while you are the only maintainer (you cannot approve your own PRs)
- Require status checks once they appear: `Verify scripts` and `UI smoke (Playwright search)`
- Optionally later: require 1 approval after adding a second collaborator

Pages: **Settings → Pages** → Deploy from branch → `master` / root (`/`). Root [`.nojekyll`](.nojekyll) disables Jekyll processing.
