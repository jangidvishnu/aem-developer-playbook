# Hiring evidence batch tracker

Tracks `ownerVerified: false` companies — which have a specific AEM job URL in `hiringEvidence` vs which still need batch search.

**Source of truth (machine):** `scripts/data/hiring-evidence-batch-tracker.json`  
**Updated:** 2026-07-11

## Summary

| Metric | Count |
|--------|------:|
| `ownerVerified: false` total | 72 |
| **Found** — specific job URL in `hiringEvidence` | 16 |
| **Empty** — need batch search (or re-search) | 56 |
| Batch size | 11 |
| Batches for empty rows | 6 |

### Status values

| Status | Meaning |
|--------|---------|
| `found` | Specific AEM `/job/` (or gate-approved) URL in `hiringEvidence` |
| `searched_no_url` | Searched; no qualifying URL — keep `hiringEvidence: []` |
| `pending` | Not yet searched in current batch pass |

---

## Already found (16) — no further search needed

| ID | Company | Job URL |
|----|---------|---------|
| capital-one | Capital One | https://builtin.com/job/lead-software-engineer-fullstack-enterprise-platforms-technology/9006201 |
| coca-cola | Coca-Cola | https://builtin.com/job/consumer-engagement-adtech-platforms-intern/3934916 |
| cyient | Cyient | https://www.foundit.in/job/web-content-analyst-cyient-pune-51727512 |
| digitas | Digitas | https://builtin.com/job/aem-architect-adobe-experience-manager/4698443 |
| fidelity | Fidelity | https://builtin.com/job/director-full-stack-engineering-lead-adobe-cms-and-java/4721622 |
| havas | Havas | https://builtin.com/job/senior-software-engineer/7704438 |
| isobar | Isobar | https://www.foundit.in/job/senior-aem-developer-backend-dentsu-pune-36340969 |
| johnson-johnson | Johnson & Johnson | https://www.careers.jnj.com/en/jobs/r-080474/associate-director-content-capabilities-innovation-dam-metadata-and-content-intelligence/ |
| kloudportal | Kloudportal | https://www.foundit.in/job/aem-developer-kloudportal-technology-solutions-pvt-ltd-pune-40074885 |
| navitas | Navitas | https://navitas.applytojob.com/apply/HfjPdG2EEG/262248-AEM-Website-Developer-HyderabadVijayawada |
| phygital-insights | Phygital Insights | https://www.foundit.in/job/aem-developer-phygital-insights-bengaluru-bangalore-35871774 |
| pi-square | Pi Square | https://www.linkedin.com/jobs/view/aem-developer-at-pi-square-technologies-4214418963 |
| stryker | Stryker | https://builtin.com/job/aem-front-end-developer-remote/3185429 |
| the-scalers | The Scalers | https://careers.thescalers.com/positions/senior-aem-developer-418 |
| thomson-reuters | Thomson Reuters | https://www.foundit.in/job/senior-software-engineer-aem-thomson-reuters-bengaluru-bangalore-31426712 |
| webologix | Webologix | https://www.hirist.tech/j/aem-consultant-osgi-1473225 |

---

## Batch 1 — `searched_no_url` (pass 2, 2026-07-11)

Portals checked: Foundit, BuiltIn, LinkedIn, Naukri, hirist.tech, official careers, Workday/Oracle/Greenhouse/CSOD.

| ID | Company | Status | Search notes |
|----|---------|--------|--------------|
| airtel | Bharti Airtel | searched_no_url | ML/SDE on Foundit/LinkedIn; Darwinbox careers — no AEM `/job/` |
| akamai | Akamai Technologies | searched_no_url | BuiltIn + akamai.com/careers — CDN/SRE/platform only |
| albertsons | Albertsons | searched_no_url | Oracle CX careers — no AEM req; India producer roles ≠ AEM developer |
| ariel | Ariel Corporation | searched_no_url | arielcorp.csod.com — IT/manufacturing; no AEM |
| bayer | Bayer | searched_no_url | careers.bayer.com AEM search empty; no Bayer AEM on boards |
| coditas | Coditas | searched_no_url | Foundit/hirist — .NET/DevOps; no Coditas AEM |
| daffodil-software | Daffodil Software | searched_no_url | daffodilsw.com/career + boards — no AEM posting |
| dxc | DXC Technology | searched_no_url | careers.dxc.com — SharePoint/SAP/UX; no AEM job |
| exl | EXL | searched_no_url | Foundit — Java/Optimizely; exlservice.com — no AEM req |
| ftd | FTD | searched_no_url | Greenhouse/Workday — IBM i/JDE only |
| genting-malaysia | Genting Malaysia | searched_no_url | careers.rwgenting.com — C#/ASP.NET; not AEM developer |

---

## Batch 2 — `searched_no_url` (2026-07-11)

Portals checked: Foundit, BuiltIn, LinkedIn, Naukri, hirist.tech, official careers, Workday/Oracle/Greenhouse.

| ID | Company | Status | Search notes |
|----|---------|--------|--------------|
| grid-dynamics | Grid Dynamics | searched_no_url | Foundit Python/Java; AEM delivery practice but no careers AEM req |
| henkel | Henkel | searched_no_url | Careers: CMS familiarity in marketing; India SAP API-M — no AEM dev |
| homedepot | Home Depot | searched_no_url | careers.homedepot.com/job/* — Java/React; Adobe Analytics only |
| hp | HP Inc. | searched_no_url | jobs.hp.com AEM search — no developer req |
| hpe | Hewlett Packard Enterprise | searched_no_url | careers.hpe.com AEM search empty |
| infogain | Infogain | searched_no_url | QA with basic AEM (rejected); Java/React open |
| innominds | Innominds | searched_no_url | careers.innominds.com — Java/Angular/QA only |
| intuit | Intuit | searched_no_url | jobs.intuit.com — no AEM developer |
| iqvia | IQVIA | searched_no_url | jobs.iqvia.com — Adobe in architect role, not AEM dev |
| ltts | L&T Technology Services | searched_no_url | Foundit Java/full-stack; no LTTS AEM |
| luxoft | Luxoft | searched_no_url | career.luxoft.com — Java/React; no AEM posting |

---

## Batch 3 — `searched_no_url` (2026-07-11)

Portals checked: Foundit, BuiltIn, LinkedIn, Naukri, official careers, SmartRecruiters/Globant.

| ID | Company | Status | Search notes |
|----|---------|--------|--------------|
| national-bank-of-canada | National Bank of Canada | searched_no_url | emplois.bnc.ca ECM Full Stack — Python/Java/React, not AEM |
| nestdigital | Nest Digital | searched_no_url | Foundit Java/AWS; nestdigital.com — no AEM |
| nestle | Nestlé | searched_no_url | jobdetails.nestle.com — Magento/Campaign/Creative Suite, not AEM dev |
| novartis | Novartis | searched_no_url | novartis.com careers — MarTech/content ops, not AEM developer |
| oracle | Oracle | searched_no_url | careers.oracle.com — Java/cloud; no AEM posting |
| pepsico | PepsiCo | searched_no_url | pepsicojobs.com — Digital Designer/UX only |
| pethealth | Pethealth | searched_no_url | trupanion.com/smartrecruiters — no AEM req |
| procter-gamble | Procter & Gamble | searched_no_url | pgcareers.com — Software/DevOps/MarTech, no AEM dev |
| qentelli | Qentelli | searched_no_url | qentelli.com — Java/automation only |
| r-systems | R Systems | searched_no_url | careers.rsystems.com — no AEM posting |
| real-madrid | Real Madrid | searched_no_url | No club careers AEM req; Globant Madrid = partner not employer |

---

## Batch 4 — `searched_no_url` (2026-07-11)

Portals checked: Foundit, BuiltIn, LinkedIn, Naukri, official careers, Workday/jobs.slalom.com.

| ID | Company | Status | Search notes |
|----|---------|--------|--------------|
| relx | RELX | searched_no_url | Workday — software/document/visual; no AEM dev |
| rga | R/GA | searched_no_url | BuiltIn — product/visual design only |
| royal-cyber | Royal Cyber | searched_no_url | Foundit ServiceNow/MDM; LinkedIn AEM 404 |
| saggezza | Saggezza | searched_no_url | saggezza.com + boards — no AEM posting |
| samsung-sds | Samsung SDS | searched_no_url | Email-based careers; no AEM job URL |
| sanofi | Sanofi | searched_no_url | SharePoint role lists AEM in CMS skills — not AEM dev |
| sasken | Sasken Technologies | searched_no_url | Full-stack/DevOps/UX — no AEM |
| schneider-electric | Schneider Electric | searched_no_url | Magento/FE; EAE = automation not AEM |
| siemens-healthineers | Siemens Healthineers | searched_no_url | .NET/Angular/PHP — no AEM dev |
| sika | Sika | searched_no_url | Tech Lead Web — AEM optional; URL fails gate |
| slalom | Slalom | searched_no_url | Workfront/Salesforce/GTM — no AEM developer |

---

## Batch 5 — `searched_no_url` (2026-07-11)

Portals checked: Foundit, BuiltIn, LinkedIn, Naukri, official careers, Thoughtworks careers.

| ID | Company | Status | Search notes |
|----|---------|--------|--------------|
| softserve | SoftServe | searched_no_url | DXP AI role cites Adobe Cloud — not AEM dev; `/vacancies/` fails gate |
| softtek | Softtek | searched_no_url | Foundit React/frontend only |
| srijan | Srijan Technologies | searched_no_url | Now Material; Drupal/Acquia — no AEM posting |
| tata-elxsi | Tata Elxsi | searched_no_url | Embedded/Python/Java — no AEM |
| tavant | Tavant | searched_no_url | TPM/QA/data science — no AEM `/job/` |
| thoughtworks | Thoughtworks | searched_no_url | Content Publishing PM uses AEM — not developer |
| tsb | TSB Bank | searched_no_url | tsbcareers.co.uk — no AEM listing |
| ubs | UBS | searched_no_url | Java/React/cloud — no AEM dev |
| unilever | Unilever | searched_no_url | Design/MarTech PM — AEM familiarity only |
| us-bank | U.S. Bank | searched_no_url | Digital/Salesforce — no AEM developer |
| valuebound | ValueBound | searched_no_url | Drupal-focused; Foundit Java/AI only |

---

## Batch 6 — `searched_no_url` (2026-07-11)

Portals checked: Foundit, BuiltIn, careers.wolterskluwer.com.

| ID | Company | Status | Search notes |
|----|---------|--------|--------------|
| wolters-kluwer | Wolters Kluwer | searched_no_url | BuiltIn Java/Angular/.NET; Foundit eCommerce marketing — no AEM developer |

---

## Pass 2 — unchecked portals (2026-07-11)

**Scope:** all 56 empty `hiringEvidence` companies.

**Portals not covered in pass 1 (batches 2–6):** hirist.tech. **Never checked before:** instahyre.com, shine.com, cutshort.io, indeed.com.

| Portal | Result |
|--------|--------|
| hirist.tech | Company career pages checked (Infogain, Innominds, Grid Dynamics, R Systems, NeST Digital, Coditas, Tata Elxsi) — no AEM developer `/j/` posting for target employers |
| instahyre.com | AEM roles at Infosys/Capgemini/Optum only — none for our 56 |
| shine.com | AEM at Infosys/NTT — Saggezza Core Java only |
| cutshort.io | AEM at Merkle/Invesco/VAYUZ — none for our 56 |
| indeed.com | Home Depot Sitecore/Java — confirms batch 2 rejection; no Slalom/RGA AEM |

**New URLs added:** 0. All 56 remain `searched_no_url`.

---

## How to update after each batch

1. Search Foundit / BuiltIn / careers / Workday for AEM developer roles (not search portals).
2. If found: add URL to `hiringEvidence` in `data/companies.json`.
3. If not found: leave `hiringEvidence: []`.
4. Set batch `status` to `searched_no_url` or mark individual rows `found` in `hiring-evidence-batch-tracker.json`.
5. Run `node scripts/verify-companies.js`.
