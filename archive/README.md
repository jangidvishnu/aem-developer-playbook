# Archive

Historical research and company pipeline artifacts moved here in **Milestone 13** so the live site uses a single published company database: `data/companies.json`.

Nothing here is fetched by `index.html`. Do **not** delete this tree without a decision record — the constitution requires archiving over silent deletion.

## Layout

| Path | Contents |
|------|----------|
| `research/md/` | Pre-schema deep-research reports (phases 1–4) |
| `companies/company-sources.json` | Former seed input for `build-companies.js` |
| `companies/manifests/` | Archived candidates, BuiltWith watchlist, research queue |
| `scripts/` | Legacy M6/M8 builders and ingest helpers (`build-companies*.js`, seeds libs). `hiring-gate.js` remains under `scripts/` for `verify-companies.js`. |

## Editing companies today

Update `data/companies.json` directly. Keep evidence and schema rules in `.playbook/11_COMPANY_SCHEMA.md` and `.playbook/07_RESEARCH_GUIDE.md`. Run `node scripts/verify-companies.js` after substantial edits.

Rebuild-from-archive is intentionally out of day-to-day workflow (DR-017).
