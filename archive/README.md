# Archive

Historical research and company pipeline artifacts moved here in **Milestone 13** so the live site uses a single published company database: `data/companies.json`.

Nothing here is fetched by `index.html`. Do **not** delete this tree without a decision record — the constitution requires archiving over silent deletion.

## Layout

| Path | Contents |
|------|----------|
| `research/md/` | Pre-schema deep-research reports (phases 1–4) |
| `companies/company-sources.json` | Former seed input for `build-companies.js` |
| `companies/manifests/` | Archived candidates, BuiltWith watchlist, research queue, truth-pass archives |
| `scripts/` | Legacy M6/M8 builders and ingest helpers (`build-companies*.js`, seeds libs). `hiring-gate.js` remains under `scripts/` for `verify-companies.js`. |
| `community/` | Removed public WhatsApp invite URLs (kept for history; live site uses LinkedIn groups only) |

## Editing companies today

Update `data/companies.json` directly. Keep evidence and schema rules in `.playbook/11_COMPANY_SCHEMA.md` and `.playbook/07_RESEARCH_GUIDE.md`. Run `node scripts/verify-companies.js` after substantial edits. Contributor how-to: `CONTRIBUTING.md`.

Rebuild-from-archive is intentionally out of day-to-day workflow (DR-017).

## Ideas still open (not shipped)

- Optional HR contacts on company rows (when owners share them)
- `noticePolicy` filter (immediate / 30d / 60d / 90d) once data coverage is strong
- Search/discovery improvements as the list grows further
