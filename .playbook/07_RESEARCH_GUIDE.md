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
4. **Inference** — job posting language, tech-stack detection tools, or pattern-matching against similar companies.
   Always label inference explicitly (see `05_STYLE_GUIDE.md`'s fact-vs-opinion rule).

## Status of current research inputs

The four reports in `md/` (`deep-research-report.md`, `-phase-2`, `-phase-3`, `-phase-4`) are **Tier 3/4** quality:
useful as a starting list, but they contain hedged language ("likely," "unclear," "Unverified") throughout and have
not been cross-checked against primary sources. They must not be copied directly into `data/companies.json` as
confirmed fact — see the verification workflow below, planned for Milestone 6.

## Verification workflow (for Milestone 6)

1. For each candidate company, check for a primary or vendor-confirmed source of AEM/DXP usage.
2. If found, record the source URL in the company's `Evidence`/`References` fields (`11_COMPANY_SCHEMA.md`).
3. If not found within reasonable effort, either mark `Status` as unverified or drop the entry — do not publish an
   unverified claim as confirmed.
4. Record `LastVerified` with the date the check was performed. Re-verify periodically; AEM adoption and hiring
   patterns change.

## What counts as "hidden" AEM usage

Some companies use AEM but hire under generic titles ("Software Engineer," "Web Engineer") rather than "AEM
Developer." This is legitimate research value (see the Phase 1 report's "hidden AEM users" section) but raises the
evidence bar — a generic job title alone is not sufficient evidence; pair it with a case study, tech-detection
result, or an explicit AEM/Adobe mention in the posting.

## Anti-patterns

- Treating a research report's own confidence language ("Priority: 9/10") as if it were sourced fact rather than
  the report author's judgment.
- Merging duplicate company entries across the four `md/` reports without reconciling conflicting details (e.g.
  different priority scores or India-presence claims for the same company).
- Citing a source that no longer resolves (link rot) without noting the retrieval date.

## Checklist for adding a company to `data/companies.json`

- [ ] At least one Tier 1 or Tier 2 source, or explicit `Status: Unverified`.
- [ ] `LastVerified` date set.
- [ ] No unresolved conflict with an existing entry for the same company.
- [ ] Inference-based fields (visa support, culture) are phrased as such, not stated as confirmed fact.
