# Company Schema

## Status

Target schema for `data/companies.json`, populated in Milestone 6 from the verified subset of `md/`'s research
reports (see `07_RESEARCH_GUIDE.md` for the verification workflow). `index.html` currently has a much smaller,
informal version of this shape hardcoded inline — it will be migrated onto this schema, not the other way around.

## Field reference

| Field | Type | Notes |
|---|---|---|
| `id` | string | Stable unique identifier |
| `name` | string | Company name |
| `priority` | number (0–10) | Relevance score for an AEM/DXP engineer's job search — see `07_RESEARCH_GUIDE.md` |
| `industry` | string | e.g. Finance, Retail, Healthcare |
| `companyType` | string | Product / GCC / Agency / Enterprise |
| `headquarters` | string | City, country |
| `indiaPresence` | boolean/string | Yes/No, with city if known |
| `careersUrl` | string (URL) | Official careers page |
| `careersLogin` | string | Notes on account/portal requirements, if any |
| `directJobSearch` | string (URL) | Deep link to a pre-filtered AEM/relevant job search, if available |
| `usesAEM` | boolean | Whether AEM usage is evidenced |
| `AdobeProducts` | array of strings | e.g. `["AEM Sites", "AEM Assets", "Adobe Target"]` |
| `AEMVersion` | string | e.g. "6.5", "Cloud Service", "Unknown" |
| `AEMaaCS` | boolean | Whether they use/are migrating to AEM as a Cloud Service |
| `EdgeDeliveryServices` | boolean | Whether EDS is in use |
| `UniversalEditor` | boolean | Whether Universal Editor is in use |
| `GraphQL` | boolean | Whether AEM GraphQL API is in use |
| `AEP` | boolean | Adobe Experience Platform usage |
| `Analytics` | boolean | Adobe Analytics usage |
| `Target` | boolean | Adobe Target usage |
| `Forms` | boolean | AEM Forms usage |
| `Assets` | boolean | AEM Assets usage |
| `Sites` | boolean | AEM Sites usage |
| `MigrationStatus` | string | e.g. "Migrating from 6.5", "Cloud-native", "Unknown" |
| `EngineeringCulture` | string | Notes, clearly marked as opinion/inference where applicable |
| `Compensation` | string | Notes, marked with source or "Unverified" |
| `WorkLifeBalance` | string | Notes, marked with source or "Unverified" |
| `VisaSupport` | string | Yes / Limited / No / Unknown, with source if available |
| `HiringIndia` | boolean/string | Active hiring status in India |
| `HiringGlobal` | boolean/string | Active hiring status globally |
| `InterviewDifficulty` | string | e.g. "Easy" / "Medium" / "Hard", with source if available |
| `TypicalRoles` | array of strings | e.g. `["AEM Developer", "Web Platform Engineer"]` |
| `Recruiters` | array of strings/objects | Known recruiter contacts, if tracked |
| `Notes` | string | Free-text notes, clearly separated from sourced fields |
| `Evidence` | array of strings (URLs) | Primary/vendor-confirmed sources supporting `usesAEM` and related fields |
| `References` | array of strings (URLs) | Supplementary sources |
| `LastVerified` | ISO date string | When evidence was last checked |
| `Status` | string | e.g. "Verified", "Unverified", "Needs review" |
| `Wishlist` | boolean | Personal tracking: interested |
| `Applied` | boolean | Personal tracking: application submitted |
| `Interview` | boolean | Personal tracking: in interview process |
| `Offer` | boolean | Personal tracking: offer received |
| `Rejected` | boolean | Personal tracking: rejected |

## Rules

- Unknown values are the explicit string `"Unknown"` or `null` (per the field's type) — never an omitted key.
- `usesAEM: true` requires at least one entry in `Evidence`, per `07_RESEARCH_GUIDE.md`. If evidence can't be found,
  set `Status: "Unverified"` rather than asserting `usesAEM: true` unsupported.
- The five personal-tracking booleans (`Wishlist` through `Rejected`) are mutually informative but not mutually
  exclusive over time (e.g. `Applied` and `Interview` can both be true) — they represent a progression, not a
  single enum, so do not collapse them into one `status` field.

## Relationship to the raw research in `md/`

The four `md/deep-research-report*.md` files use an informal, prose-and-table format with an overlapping but
inconsistent column set (see each file's own header table). Milestone 6's job is to map each report's fields onto
this schema, reconcile duplicate company entries across reports, and apply the verification workflow in
`07_RESEARCH_GUIDE.md` before anything is marked `Status: "Verified"`.
