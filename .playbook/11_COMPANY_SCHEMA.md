# Company Schema

## Status

Authoritative schema for the published employer list in `data/companies.json`. Historical research that fed earlier
milestones lives under `archive/` (see `archive/README.md` and DR-017) — not a second live database.

Public rows are **hire-verified AEM employers only**. Listing implies AEM usage and active AEM/DXP hiring — do not
store redundant `usesAEM` / `HiringAEM` flags on every row.

## Field reference

| Field | Type | Required | Notes |
|---|---|---|---|
| `id` | string | yes | Stable unique identifier |
| `name` | string | yes | Company name |
| `priority` | number (0–10) | yes | Job-search usefulness (hiring cadence weighted) — rubric in `07_RESEARCH_GUIDE.md` |
| `industry` | string | yes | e.g. Finance, Retail, Healthcare |
| `companyType` | string | yes | `Product` / `GCC` / `Agency` / `Enterprise` |
| `hq` | string | no | City, country — omit when unknown (display string; `locations` is the filterable source) |
| `locations` | array of `{city?, country}` | no | Offices that actually hire — powers the (future) city + country filter. `country` required, `city` optional. Omit when unknown rather than guessing. |
| `remote` | boolean | no | Employer hires remote (India-eligible remote) — omit when unknown |
| `noticePolicy` | enum string | no | Accepted notice period: `immediate` \| `30d` \| `60d` \| `90d` \| `flexible-long`. Set **only when evidenced** (posting/careers text); omit otherwise |
| `indiaPresence` | boolean | no | Has India office/ops — omit when unknown |
| `hiringIndia` | boolean | no | Actively hiring in India — omit when unknown; used by the India filter |
| `hiringActive` | boolean | no | Set `true` when there is evidence the employer posts AEM/DXP roles **frequently (roughly monthly or more)** — **not** “hiring right now”. Omit when hiring looks occasional/one-off or is unknown |
| `ownerPreferred` | boolean | no | Owner recommends as a strong company (pay / growth / quality of work) — opinion, not evidence; omit when not preferred |
| `careersUrl` | string (URL) | yes | Official careers page (`http`/`https`) |
| `jobSearchUrl` | string (URL) | no | Deep link to AEM/relevant search — omit when identical to `careersUrl` |
| `products` | array of codes | yes | Adobe/AEM stack tags — **single source of truth** for product filters |
| `roles` | array of strings | yes | Typical titles this employer uses (1–4). Prefer real posting language over generic filler. |
| `notes` | string | yes | Free-text notes (may be empty string) |
| `evidence` | array of URLs | yes | Primary sources supporting AEM usage |
| `hiringEvidence` | array of URLs | yes | Job posting(s) or careers search proving hire |
| `verifiedAt` | ISO date string | yes | When evidence / hiring signal was last checked (agent or owner) |
| `ownerVerified` | boolean | yes | `true` only after the **project owner** manually checked the row; new agent rows start `false` |
| `signals` | object | no | Optional employer ratings for hover breakdown — **omit when unsourced** |

### Owner flags (`ownerVerified`, `hiringActive`, `ownerPreferred`)

| Flag | Who sets it | Meaning |
|---|---|---|
| `ownerVerified` | Project owner (required on every row) | Owner has manually reviewed this company's fields. Agents adding or materially rewriting a row must set **`false`** and leave it for the owner. Do not set `true` on the owner's behalf unless the owner explicitly said this batch is verified. |
| `hiringActive` | Agent (evidenced) or owner | Employer posts AEM/DXP roles **frequently — roughly monthly or more** (recurring cadence). Set `true` only from evidence (multiple distinct recent postings, or a careers page consistently showing AEM reqs). It does **not** mean there is an open req today — always check `careersUrl` / `jobSearchUrl`. Omit when hiring looks occasional/one-off or is unknown. Never guess. |
| `ownerPreferred` | Project owner (optional) | Owner **recommends** the company (compensation, career growth, delivery quality, etc.). Subjective — not the same as `hiringActive` or `priority`. Put a short “why” in `notes` when set. Omit when not preferred (do not store `false` for every non-pick). Agents must not invent this flag. |

`verifiedAt` ≠ `ownerVerified`. `verifiedAt` is the last research check date; `ownerVerified` is the owner's sign-off.

`hiringActive` ≠ `ownerPreferred`. Frequent hiring does not imply a recommendation (and the reverse).

Site disclaimer (`data/site.json` `disclaimer.lines`) must keep stating that this is personal research (not a
guaranteed guide / not a company ranking), not affiliated with Adobe or listed employers, that data may be
incomplete, that frequent-hiring markers are pattern signals (not open-job guarantees), that preferred markers
are owner opinion, that careers/evidence links are snapshots, and that readers should follow methods that work
for them.

### Product codes (`products`)

Use short codes only (not display labels). Allowed values:

`sites`, `assets`, `forms`, `aem-cloud`, `eds`, `headless`, `universal-editor`, `aep`, `analytics`, `target`,
`ajo`, `campaign`, `cja`, `workfront`, `commerce`, `launch`, `guides`, `creative-cloud`

UI labels live in `CompanyFilters.PRODUCT_LABELS`. Prefer adding a code here over inventing free-text product names.

Cloud filter / Cloud badge = `products` includes `aem-cloud`.

### Employer signals (`signals`) — optional

Use for a future score badge + hover breakdown (hiring / culture / benefits / work-life). **Do not invent values.**
Omit the whole object until a real source is recorded. Data may be filled later by hand (Glassdoor, AmbitionBox,
etc.) — scraping is out of scope until an explicit decision says otherwise.

```json
"signals": {
  "overall": 3.8,
  "hiring": 4.0,
  "culture": 3.5,
  "benefits": 4.2,
  "workLife": 3.2,
  "source": "ambitionbox",
  "sourceUrl": "https://www.ambitionbox.com/overview/example-reviews",
  "asOf": "2026-07-01",
  "sampleSize": "500+",
  "notes": "Optional caveat"
}
```

| Sub-field | Required if `signals` present | Notes |
|---|---|---|
| `overall` | yes | 0–5 headline score (platform overall or curated composite) |
| `hiring` | no | 0–5 |
| `culture` | no | 0–5 |
| `benefits` | no | 0–5 |
| `workLife` | no | 0–5 |
| `source` | yes | `glassdoor` \| `ambitionbox` \| `levels` \| `blind` \| `owner` \| `other` |
| `sourceUrl` | no | http(s) link to the review page used |
| `asOf` | yes | ISO date when the numbers were recorded |
| `sampleSize` | no | Review count or band (string or number) |
| `notes` | no | Caveats (e.g. India-only ratings) |

`priority` stays separate: job-search relevance for AEM roles. `signals` is candidate-experience signal from reviews.

### Locations, remote, notice period (filter data)

These three optional fields back upcoming filters (location by country **or** city, remote-friendly, notice
period). Data-only for now — no UI is wired to them yet. Accuracy rules (owner hard rule: filter data must be
correct):

```json
"locations": [
  { "city": "Bengaluru", "country": "India" },
  { "city": "Pune", "country": "India" },
  { "country": "United States" }
],
"remote": true,
"noticePolicy": "flexible-long"
```

- **`locations`** — cover **all countries the employer hires in + the major city hub(s) per country** (keep India
  cities complete since the audience is India-based; list main global hubs elsewhere). Not India-only, but also not
  every tiny satellite office. `country` is required per entry; `city` is optional. This is the filterable source
  of truth (country **and** city filters); `hq` remains a human-readable display string and may differ.
- **`remote`** — `true` only when there is evidence they hire remote roles relevant to India-based candidates.
  Omit when unknown (do not store `false` everywhere).
- **`noticePolicy`** — one of `immediate`, `30d`, `60d`, `90d`, `flexible-long`. Set **only when a posting or
  careers page states/implies it**. `flexible-long` = employer accepts long notice (e.g. 90d+) or the exact range
  is unclear but they are not immediate-only. Omit entirely when there is no evidence — never guess from company
  type.

## Rules

- Omit optional keys when unknown — do **not** write `"Unknown"` placeholders for dropped fields.
- Every public row must pass the hiring gate in `scripts/hiring-gate.js`: non-empty `evidence`, http `careersUrl`,
  non-empty `hiringEvidence`, non-empty `products`.
- Personal application tracking (`Wishlist` / `Applied` / …) does **not** belong in `companies.json` — use
  local/private owner state if needed later.
- Soft people fields without a source stay out of the public schema; use optional `signals` only when dated and
  attributed.
- `MigrationStatus` is not stored; use `aem-cloud` (and notes) when cloud migration is evidenced.
- Never invent `signals` to fill the table — missing ratings display as empty in the UI.
- New or rewritten public rows: set `ownerVerified: false` until the owner signs off. Do not flip existing
  `ownerVerified: true` to false for trivial typo fixes; do flip to `false` after material field rewrites so the
  owner re-checks.
- Set `hiringActive: true` when evidence shows a frequent (~monthly or more) AEM/DXP hiring cadence; omit when hiring is occasional/one-off or unknown (updates DR-025 per owner: agents may now set it from evidence, not owner-only).
- Omit `ownerPreferred` unless the owner explicitly recommends the company; put a short why in `notes`.

## Relationship to archived research

`archive/research/md/deep-research-report*.md` and `archive/companies/` are **reference-only**. Apply
`07_RESEARCH_GUIDE.md` before adding or refreshing a public row.
