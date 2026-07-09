# Research Guide

Standards for adding factual claims about companies, technologies, or the job market to this repository —
especially when editing the published employer list in `data/companies.json`.

## Core principle

Evidence over assumption. Every factual claim should be traceable to a public, checkable source. Where no source
exists, say so explicitly rather than presenting an inference as fact.

**Research each company once, completely.** Do not publish a row after only fixing careers URLs, then come back
later for products, then again for roles. Every add or material refresh must complete the **field pass** below so
we are not re-researching the same employer across sessions (DR-025).

## Source tiers (use the highest available)

1. **Primary** — the company's own careers page, official case study, SEC filing, or engineering blog.
2. **Vendor-confirmed** — Adobe's own customer stories/case studies naming the company as an AEM user.
3. **Reputable secondary** — established tech press, analyst reports, conference talk recordings.
4. **Inference** — job posting language, tech-stack detection tools (BuiltWith public profiles, W3Techs), or
   pattern-matching. Always label inference explicitly. See DR-008 and **DR-011**. **No paid BuiltWith API**
   (DR-012) — optional manual `builtwith.com/{domain}` reference links only.

## Published database (Milestone 13 / DR-017)

**Sole runtime / published company file:** `data/companies.json`.

Edit that file directly for additions and corrections. Historical research reports, seeds, and manifests live under
`archive/` (see `archive/README.md`) — reference only; do not treat them as a second live database.

## Historical research (archived)

`archive/research/md/deep-research-report*.md` remain useful for **candidate names** and research angles. Do **not**
copy prose into `companies.json` as confirmed fact. Re-verify every field against current careers pages, job
postings, or Adobe case studies before publishing.

## Complete field pass (required for every new or refreshed row)

Work top-to-bottom. Omit optional keys when unknown — never invent. Schema: `11_COMPANY_SCHEMA.md`.

| # | Field | What to verify |
|---|---|---|
| 1 | `id` / `name` | Stable id; correct legal/brand name |
| 2 | `industry` / `companyType` | Accurate; `Product` / `GCC` / `Agency` / `Enterprise` |
| 3 | `hq` | City, country if known |
| 4 | `indiaPresence` / `hiringIndia` | Booleans only when known; omit otherwise |
| 5 | `careersUrl` | Official careers page loads |
| 6 | `jobSearchUrl` | AEM/DXP deep link if useful; omit if same as `careersUrl` |
| 7 | `products` | Every evidenced Adobe/AEM code — not just `sites` when the case study lists more |
| 8 | `roles` | Titles **this employer** uses (AEM Engineer, DXP, Sr Software, …) — no shared boilerplate |
| 9 | `evidence` | Tier 1–2 AEM usage URLs (working links) |
| 10 | `hiringEvidence` | Job or careers search proving hire intent |
| 11 | `priority` | Hiring-cadence rubric below — not brand awards |
| 12 | `hiringActive` | Frequent/general hiring pattern only — not “open now”; omit unless owner confirms |
| 13 | `ownerPreferred` | Owner recommendation (pay/growth/quality) — omit unless owner explicitly marks; why in `notes` |
| 14 | `notes` | Cadence caveats, India hubs, inference labels, preferred why |
| 15 | `verifiedAt` | Today's ISO date when this pass finished |
| 16 | `ownerVerified` | **`false`** for agent-added/rewritten rows until the owner manually checks |
| 17 | `signals` | Omit unless sourced ratings exist |

After the pass: `node scripts/verify-companies.js`.

## Verification workflow

1. For each candidate company, run the **complete field pass** (table above) — not a partial careers-only edit.
2. Confirm **hiring** — careers search or job URL with AEM/DXP keywords; record in `hiringEvidence`.
3. If found, record source URLs in `evidence` / `hiringEvidence` (`11_COMPANY_SCHEMA.md`) and add/update the row in
   `data/companies.json` with `ownerVerified: false`.
4. If not found within reasonable effort, do **not** publish — optionally note the candidate in an issue or keep a
   personal note; archived manifests under `archive/companies/manifests/` are historical only.
5. Set `verifiedAt` to the pass date. Leave `ownerVerified` false for owner sign-off.
6. Run `node scripts/verify-companies.js`.

## What counts as "hidden" AEM usage

Some companies use AEM but hire under generic titles ("Software Engineer," "Web Engineer") rather than "AEM
Developer." This is legitimate research value but raises the evidence bar — a generic job title alone is not
sufficient evidence; pair it with a case study, tech-detection result, or an explicit AEM/Adobe mention in the
posting.

## Priority score (0–10)

`priority` ranks **job-search usefulness for an AEM/DXP engineer**, not brand prestige or Adobe award
status. Weight **hiring cadence and India-accessible AEM roles** highest.

| Band | Meaning | Typical signals |
|---|---|---|
| **10** | Continuous / flagship AEM hiring | Product owner (Adobe) or rare peers with ongoing AEM-titled India/global volume |
| **9** | Very strong, frequent hiring | Large SI Adobe practices, or product firms with recent AEMaaCS + regular India roles |
| **7–8** | Solid target | Credible AEM evidence + careers to monitor; openings monthly/quarterly or strong partner delivery |
| **5–6** | Watchlist / occasional | Tier-4 BuiltWith-only, staffing boutiques, or strong stack but rare AEM-titled posts (~yearly) |
| **≤4** | Do not publish | Insufficient evidence or no hiring signal |

Rules of thumb:

- Cap **BuiltWith-only** rows at **6** until a Tier-1/2 source upgrades `evidence`.
- An Adobe award or rich Experience Cloud stack does **not** justify 9–10 if AEM-titled hiring is rare
  (example: Air India — strong Adobe story, low AEM hiring cadence → mid band).
- Large India SI partners (Accenture, Deloitte, Cognizant, …) often outrank glamorous product brands on
  **practical** job-search priority because they hire AEM roles continuously.
- `hiringActive: true` usually aligns with bands **8–10**; do not set it from a single posting.

## Occasional AEM hirers (watchlist employers)

Some strong product employers post AEM-titled roles **infrequently**. Include them when:

- There is credible evidence the org runs AEM on at least one digital property, and
- A stable careers or job-search URL exists to monitor (`jobSearchUrl` / `careersUrl`).

Note in `notes` that openings are sporadic. Keep `priority` in the watchlist band (typically 5–7), not 9–10.
Leave `hiringActive` omitted (or `false` only if the owner explicitly marks non-active).

## Top service-based AEM employers

India GCCs and global agencies hire AEM talent for **client delivery**. Evidence is typically the firm's Adobe
alliance/partner page plus careers search URLs with active or recent AEM requisitions. These are the usual
candidates for `hiringActive: true` after owner confirmation.

## Anti-patterns

- Treating a research report's own confidence language ("Priority: 9/10") as if it were sourced fact.
- Maintaining a second company JSON or rebuilding `companies.json` from archived seeds as the default workflow.
- Citing a source that no longer resolves (link rot) without noting the retrieval date.
- Publishing after a **partial** field update and planning to "finish research later" on the same company.
- Setting `ownerVerified: true` without the project owner's explicit confirmation.
- Setting `hiringActive: true` from one job link without ongoing-cadence evidence / owner confirmation.
- Setting `ownerPreferred: true` without the project owner's explicit recommendation.

## Checklist for adding a company to `data/companies.json`

- [ ] **Complete field pass** finished (table above) — every required field intentional, optionals omitted if unknown.
- [ ] At least one Tier 1 or Tier 2 source for AEM usage (`evidence`).
- [ ] Official `careersUrl` (http).
- [ ] Non-empty `hiringEvidence` URL(s).
- [ ] Non-empty `products` codes (all evidenced codes, not a lazy `sites`-only default).
- [ ] `roles` reflect titles this employer actually uses (AEM / DXP / Software / Sr …) — not a shared
  boilerplate list. Watchlist employers may use generic titles; say so in `notes` when known.
- [ ] `priority` set from the hiring-cadence rubric.
- [ ] `hiringActive` omitted unless owner-confirmed ongoing hiring.
- [ ] `ownerPreferred` omitted unless the owner explicitly recommends the company (why in `notes`).
- [ ] `verifiedAt` date set; `ownerVerified` is **`false`** until the owner manually verifies.
- [ ] No unresolved conflict with an existing entry for the same company.
- [ ] Inference-based fields are phrased as such in `notes`, not stated as confirmed fact.
- [ ] `node scripts/verify-companies.js` passes.
