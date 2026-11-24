---
paths:
  - "data/companies.json"
  - "archive/research/**"
  - "archive/companies/**"
  - "scripts/data/**"
---

# Company data and research

Full detail (field-pass table, priority rubric): `.playbook/07_RESEARCH_GUIDE.md`, `11_COMPANY_SCHEMA.md`.

- **Evidence only, never guess** — employer > Adobe case study > secondary > inference (label inference). Applies
  to `products`, `remote`, `noticePolicy`, `hiringActive`, `locations`. Omit unknown optional keys.
- **Complete field pass** on every new/refreshed row — no partial publish.
- Public rows need AEM usage in `evidence` + http `hiringEvidence`.
- **`careersUrl`** employer-owned (site or its ATS) — never job boards (Naukri, Cutshort, Indeed, LinkedIn `/jobs`…);
  boards are fine in `hiringEvidence`/`jobSearchUrl`. No careers page → don't publish; park for owner.
- **M&A/rebrand:** keep only the surviving parent row; old name can go in `notes`.
- `verifiedAt` = date evidence/hiring was checked. `ownerVerified: false` on added or materially rewritten rows; only
  the owner sets `true`. `ownerPreferred` only if the owner marks it.
- `hiringActive` = frequent (~monthly) AEM hiring, not "open now"; never from one posting.
- `priority` from the hiring-cadence rubric; tech-detection-only rows cap at 6. `products` = Adobe short codes, all
  evidenced, none unevidenced. `roles` = titles this employer uses. `locations` = hire countries + major hubs, not
  just `hq`. `signals` only with `source` + `asOf`.
- `notes` are shown to job seekers — no `DR-xxx` or research jargon.
- Live DB is `data/companies.json` only; archive research is historical — re-verify before use.
- Workday/SuccessFactors/Phenom careers pages render client-side — check them in the browser (Claude in Chrome)
  before calling them dead.
- After edits: `node scripts/verify-companies.js`; `npm run check-links` after batches; `npm run prerender`.
