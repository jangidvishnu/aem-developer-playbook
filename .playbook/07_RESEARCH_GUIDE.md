# Research Guide

Standards for adding factual claims about companies, technologies, or the job market to this repository —
especially when editing the published employer list in `data/companies.json`.

## Core principle

Evidence over assumption. Every factual claim should be traceable to a public, checkable source. Where no source
exists, say so explicitly rather than presenting an inference as fact.

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

## Verification workflow

1. For each candidate company, check for a primary or vendor-confirmed source of AEM/DXP usage.
2. Confirm **hiring** — careers search or job URL with AEM/DXP keywords; record in `AEMHiringEvidence`.
3. If found, record source URLs in `Evidence` / `References` (`11_COMPANY_SCHEMA.md`) and add/update the row in
   `data/companies.json`.
4. If not found within reasonable effort, do **not** publish — optionally note the candidate in an issue or keep a
   personal note; archived manifests under `archive/companies/manifests/` are historical only.
5. Record `LastVerified` (AEM usage) and `LastHiringVerified` (hiring evidence).
6. Run `node scripts/verify-companies.js`.

## What counts as "hidden" AEM usage

Some companies use AEM but hire under generic titles ("Software Engineer," "Web Engineer") rather than "AEM
Developer." This is legitimate research value but raises the evidence bar — a generic job title alone is not
sufficient evidence; pair it with a case study, tech-detection result, or an explicit AEM/Adobe mention in the
posting.

## Occasional AEM hirers (watchlist employers)

Some strong product employers post AEM-titled roles **infrequently**. Include them when:

- There is credible evidence the org runs AEM on at least one digital property, and
- A stable careers or job-search URL exists to monitor (`directJobSearch` / `careersUrl`).

Mark `HiringIntensity: Low` and note in `Notes` that openings are sporadic.

## Top service-based AEM employers

India GCCs and global agencies hire AEM talent for **client delivery**. Evidence is typically the firm's Adobe
alliance/partner page plus careers search URLs with active or recent AEM requisitions.

## Anti-patterns

- Treating a research report's own confidence language ("Priority: 9/10") as if it were sourced fact.
- Maintaining a second company JSON or rebuilding `companies.json` from archived seeds as the default workflow.
- Citing a source that no longer resolves (link rot) without noting the retrieval date.

## Checklist for adding a company to `data/companies.json`

- [ ] At least one Tier 1 or Tier 2 source for AEM usage (`Evidence`).
- [ ] Official `careersUrl` (http).
- [ ] `HiringAEM: true` with `AEMHiringEvidence` URL(s).
- [ ] `LastVerified` and `LastHiringVerified` dates set.
- [ ] No unresolved conflict with an existing entry for the same company.
- [ ] Inference-based fields are phrased as such, not stated as confirmed fact.
- [ ] `node scripts/verify-companies.js` passes.
