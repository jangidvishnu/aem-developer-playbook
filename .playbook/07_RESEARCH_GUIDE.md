# Research Guide

Standards for adding factual claims about companies, technologies, or the job market to this repository — most
directly relevant to populating `data/companies.json` (Milestone 6) from the raw reports in `md/`.

## Core principle

Evidence over assumption. Every factual claim should be traceable to a public, checkable source. Where no source
exists, say so explicitly rather than presenting an inference as fact.

## Source tiers (use the highest available)

1. **Primary** — the company's own careers page, official case study, SEC filing, or engineering blog.
2. **Vendor-confirmed** — Adobe's own customer stories/case studies naming the company as an AEM user.
3. **Reputable secondary** — established tech press, analyst reports, conference talk recordings.
4. **Inference** — job posting language, tech-stack detection tools (BuiltWith public profiles, W3Techs), or
   pattern-matching. Always label inference explicitly. See DR-008 and **DR-011** for promotion rules. **No paid BuiltWith
   API** (DR-012) — only curated seeds and optional manual `builtwith.com/{domain}` reference links.

## md/ research reports — reference only (Milestone 8)

The four reports in `md/` remain useful for **candidate names** and research angles. Do **not** copy prose into
`companies.json` as confirmed fact. Re-verify every field against current careers pages, job postings, or Adobe case
studies before promotion.

## Verification workflow

1. For each candidate company, check for a primary or vendor-confirmed source of AEM/DXP usage.
2. Confirm **hiring** — careers search or job URL with AEM/DXP keywords; record in `AEMHiringEvidence`.
3. If found, record source URLs in `Evidence` / `References` (`11_COMPANY_SCHEMA.md`).
4. If not found within reasonable effort, archive to `data/manifests/company-candidates.json` — do not publish.
5. Record `LastVerified` (AEM usage) and `LastHiringVerified` (hiring evidence).

## What counts as "hidden" AEM usage

Some companies use AEM but hire under generic titles ("Software Engineer," "Web Engineer") rather than "AEM
Developer." This is legitimate research value (see the Phase 1 report's "hidden AEM users" section) but raises the
evidence bar — a generic job title alone is not sufficient evidence; pair it with a case study, tech-detection
result, or an explicit AEM/Adobe mention in the posting.

## Occasional AEM hirers (watchlist employers)

Some strong product employers post AEM-titled roles **infrequently** (roughly once a year or when a requisition
reopens). Include them when:

- There is credible evidence the org runs AEM on at least one digital property (official job text, Adobe case study,
  or vendor-confirmed story), and
- A stable careers or job-search URL exists to monitor (`directJobSearch`).

Mark `HiringIntensity: Low` and note in `Notes` that openings are sporadic. These are worth keeping for "if luck
works" applications — not steady pipeline employers.

## BuiltWith-style watchlist workflow (DR-011, seed-only per DR-012)

1. Add or edit employers in `data/company-sources.json` (`records` array and optional `builtwithSeeds`).
2. Run `node scripts/ingest-builtwith-candidates.js` to refresh `data/manifests/builtwith-candidates.json`.
3. Run `node scripts/build-companies.js`.
4. Filter table by **Low** intensity to separate watchlist employers from Tier 1–2 confirmed hirers.
5. Optionally cite `https://builtwith.com/{domain}` as Tier-4 reference (manual lookup — no API).

## Top service-based AEM employers

India GCCs and global agencies (Deloitte, Publicis Sapient, Virtusa, EPAM, IBM Adobe practice, Tech Mahindra, plus
existing Accenture/Cognizant/TCS/Wipro/HCL/Infosys/Capgemini) hire AEM talent for **client delivery**. Evidence is
typically the firm's Adobe alliance/partner page plus careers search URLs with active or recent AEM requisitions.

## Anti-patterns

- Treating a research report's own confidence language ("Priority: 9/10") as if it were sourced fact rather than
  the report author's judgment.
- Merging duplicate company entries across the four `md/` reports without reconciling conflicting details (e.g.
  different priority scores or India-presence claims for the same company).
- Citing a source that no longer resolves (link rot) without noting the retrieval date.

## Checklist for adding a company to `data/companies.json`

- [ ] At least one Tier 1 or Tier 2 source for AEM usage (`Evidence`).
- [ ] Official `careersUrl` (http).
- [ ] `HiringAEM: true` with `AEMHiringEvidence` URL(s).
- [ ] `LastVerified` and `LastHiringVerified` dates set.
- [ ] No unresolved conflict with an existing entry for the same company.
- [ ] Inference-based fields are phrased as such, not stated as confirmed fact.
