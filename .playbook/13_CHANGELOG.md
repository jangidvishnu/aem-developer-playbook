# Changelog

Format loosely follows [Keep a Changelog](https://keepachangelog.com/). Entries are grouped by milestone rather than
by version number while the project is pre-release. Never delete an entry — if something is reversed, add a new
entry noting the reversal.

## Unreleased — editorial tone and AEM Career Playbook title

### Added

- `.playbook/EDITORIAL_REVIEW.md` — editorial tone spec for public copy.

### Changed

- Site brand renamed to **AEM Career Playbook** (`data/site.json`, prerendered `index.html`).
- Editorial tone pass on `site.json`, `chapters.json`, `owner_playbook.json`, and `templates.json` (evidence-based wording; fewer subjective claims).
- Hero employer count copy and search golden updated to **~298** employers (total list, not India-only) (`verify-search.js`).

## Unreleased — company data cleanup, BuiltWith discovery, tone pass (merged PR #15)

### Added

- BuiltWith AEM discovery links above the Companies table ([websitelist](https://trends.builtwith.com/websitelist/Adobe-Experience-Manager), [trends](https://trends.builtwith.com/joins/Adobe-Experience-Manager-using-Adobe-CQ)).
- Employers: Nissan (Adobe case study + nissan.nl), Align Techne, Espire Infolabs.
- Hiring-evidence batch tracker and cleanup/audit scripts under `scripts/data/`.

### Changed

- Company list deduped and hiring-evidence URLs tightened to gate-approved job postings; 32 rows without hiring proof set `ownerVerified: false`.
- Tone pass on `site.json`, chapters, career paths, roadmaps, and company notes.
- `hiring-gate.js`: allow empty `hiringEvidence` when `ownerVerified: false`.

### Fixed

- Companies chapter intro (BuiltWith blurb) now renders above the table (`render.js`).
- BuiltWith intro link color uses `--accent` (`site.css`).


### Added

- (Prior PR) Apply guide, Community chapter, Location filter, truth-pass tooling — see merged history.

### Changed

- Milestones **18–20** marked **Complete** / owner-accepted 2026-07-11; no active milestone (`14_ROADMAP.md`,
  `19_CURRENT_SPRINT.md`, `25_ROADMAP_ARCHIVE.md`). M18 closed at **320** live; M20 Location scope accepted;
  notice/contacts deferred.
- Always-on Cursor rules slimmed (~25KB → ~9KB); company research merged into `company-data.mdc`;
  desktop-mobile + company rules glob-scoped.

### Fixed

- Sticky apply-nav: auto-scroll active tab into view on mobile horizontal strip (`assets/js/ui.js`).

## Unreleased — workflow, LinkedIn, agent cost rules

### Changed

- Two-phase PR flow: feature → `stage` first; promote `stage` → `master` only when owner asks after stage merge
  (`git-push-approval.mdc`, `21_PUBLISHING.md`, DR-028).
- Agent cost optimization rule: soft model tips, less tooling on simple Q&A (`agent-cost-optimization.mdc`).
- Disclaimer contact links: LinkedIn profile (`data/site.json`, `render.js`).

## Unreleased — stage / master dual deploy (DR-028)

### Changed

- Default PR target is **`stage`** (GitHub Pages). **`master`** is production (Cloudflare); promote only when the
  owner asks. Both branches use the same required CI checks (`21_PUBLISHING.md`, `git-push-approval.mdc`).

## Unreleased — SEO title / description / keywords

### Changed

- Browser tab / Open Graph title: `AEM Developer Playbook — Jobs, Employers & Interview Prep (India)`
  (`documentTitle`); on-page brand stays **AEM Developer Playbook**.
- Meta description and keyword list expanded for AEM job / interview / AEMaaCS search intent
  (`data/site.json` `seo`).

## Unreleased — Apache-2.0 license + brand notice (DR-027)

### Changed

- Relicensed from MIT to Apache License 2.0; added `NOTICE` (copyright + project-name guidance).
- Site footer shows tagline + © / license line from `data/site.json` (no brand-policing line on the page).

## Unreleased — Canonical host Cloudflare Pages

### Changed

- Public canonical URL is https://aemplaybook.pages.dev/ (`data/site.json` `seo.siteUrl`, prerendered canonical /
  sitemap / robots / JSON-LD). GitHub Pages remains an automatic preview; Cloudflare production deploys are
  **manual** after checking GitHub Pages (`21_PUBLISHING.md`).

## Unreleased — Milestone 17 learning & career content

### Added

- Interview Prep framing (interviewer style, resume/projects, fundamentals; real project experience over AI-only
  answers) plus coach questions for JCR/Oak, ResourceResolver, replication, ACLs, workflow, and resume walkthrough.
- Glossary terms: ResourceResolver, replication, run modes, workflow.
- Naukri profile + Dispatcher resume templates; India-aware Career Strategy prose.
- Learning Roadmap / Core Skills now render official `resourceIds` links (Experience League, Sling, aem.live, WKND).
- Learning Roadmap: fixed GraphQL / EDS / Target / Analytics URLs; added Sling HTL docs; removed step hour
  estimates from the UI and data. Resource links stay on Experience League / Apache Sling / WKND only (no
  third-party Medium/YouTube links in product `resourceIds`).
- Core Skills Assets link → Experience League Assets overview; Experience League resource URLs drop trailing `.html`.

### Changed

- Chapter intros for Career Strategy, Professional Branding, Learning Roadmap, Core Skills, Glossary, Interview Prep,
  and Living Roadmap (removed stale M12 publishing note).
- Search facets renamed to match the sidebar: **All / Companies / Career / Learning / Interview** (legacy facet ids
  still accepted for old shared links).
- Learning tables: 5 rows per page; Prev/Next pagination shared with companies; empty-row pad so page changes do not
  jump the layout.
- Header/command-palette search: glossary/tech/interview hits open the right table page and flash the row; company
  hits fill Target Companies search; roadmap hits open the matching accordion then scroll; Docs/resources avoid
  flooding Adobe company results.
- Prerender now bakes SEO `<meta>` tags from `data/site.json` (description / Open Graph / Twitter) so crawlers see
  “researched” copy, not a stale “hire-verified” shell that JS would only rewrite after load.

### Fixed

- Core Skills resource links meet 44px mobile touch targets; Google Fonts load asynchronously (Lighthouse follow-up).

## Unreleased — Milestone 16 table layout + sticky sidebar (DR-026)

### Fixed

- Company explorer and learning tables use `table-layout: fixed` with stable column widths so filter/sort/page
  changes no longer shift Priority/Company/Type (and glossary/interview) column edges. Level column wide enough
  for “Intermediate” without breaking. Careers tip no longer clipped; removed needless horizontal scrollbar on the
  company table wrap. Sortable headers always show a sort affordance (idle dual-chevron). Header search uses a fixed
  width (no load-time expand) and shows **Ctrl K** / **⌘K** (opens the centered command palette). GitHub + theme
  icons are prerendered in the header tools row so they do not appear after boot and reflow the search field.
- Desktop left sidebar: `.site-shell` uses `align-items: flex-start` so sticky nav stays under the header at the
  bottom of long pages instead of riding upward.
- Learning data tables on mobile: min-width + horizontal scroll inside the wrap so fixed column widths no longer
  crush Technology/Category/Level into letter-by-letter wrapping.

### Added

- Company row / card **Details** expand: products (chips), roles, HQ, notes, evidence / hiring evidence links, and
  verified date (owner-checked when applicable).
- Company search results show human product labels as a comma-separated line (not raw codes). Expanded company
  detail includes a calm tip that careers/evidence links are snapshots from the verified date.
- Site disclaimer rewritten as two short lines: personal research (not a guaranteed guide / not a company
  ranking), not affiliated, Frequent & Preferred meanings, snapshot links, and “upgrade yourself / your own
  methods.” Hero/SEO softens “hire-verified” to “researched.” Filter **Clear filters** is a bordered pill
  aligned to the right of the chip row.

## Unreleased — slim company schema (DR-024)

### Changed

- `data/companies.json` migrated to the slim public schema (~229 KB → ~104 KB): `products` codes, `hiringIndia`,
  `jobSearchUrl`, `evidence` / `hiringEvidence`, `verifiedAt`; dropped always-Unknown soft fields, product booleans,
  `MigrationStatus`, personal tracking, and redundant `usesAEM` / `HiringAEM` flags.
- Optional `signals` object reserved on the schema for future sourced ratings (Glassdoor/AmbitionBox/etc.) — omit
  until filled; no scraping in this change.
- Company explorer: Product filter dropdown; Cloud chip uses `aem-cloud`; India filter/sort uses `hiringIndia`.
- Docs: `11_COMPANY_SCHEMA.md`, `09_DATA_MODEL.md`, `07_RESEARCH_GUIDE.md`, DR-024.
- Priority rubric documented in `07_RESEARCH_GUIDE.md` (hiring cadence weighted over brand awards). Owner audit:
  Adobe products expanded to full Experience Cloud codes; Air India 10→7; Cisco/Ford/Vi demoted from 10; BuiltWith-only
  rows capped at 6; Workday/E.ON/Spark NZ evidence+products upgraded; Bosch/ATCS removed again; HTC Global Services +
  BeansBit restored (PR #4 drift after slim migration).
- `roles` audit: replaced 47-company migration boilerplate
  (`AEM Developer` / `Digital Experience Engineer` / `Web Platform Engineer` / `MarTech Engineer`) with type-aware
  titles (watchlist → AEM + Software/Web; SI → AEM Developer/Architect; cloud → AEM Cloud Engineer). Filled empty
  Grundfos roles. Schema/research checklist now require employer-realistic titles.
- DR-025: required `ownerVerified` (all current rows `true` per owner; new agent rows start `false`); optional
  `hiringActive` for frequent/general AEM/DXP hiring pattern — not “hiring right now” (omit until owner confirms).
  Site disclaimer clarifies that distinction. Research guide requires a complete field pass so companies are not
  re-researched field-by-field across sessions.
- Optional `ownerPreferred` (owner recommendation for pay/growth/quality): Deloitte, Publicis Sapient, Hashout
  marked; Rightpoint left unmarked with a short note; Concentrix not in the public list. Disclaimer labels preferred
  as owner opinion.
- Company explorer UI: **Frequent hiring** and **Preferred** filter chips (shareable `cf_active` / `cf_preferred`);
  matching marks beside company names. Cloud is Product dropdown only (no duplicate Cloud chip). Compact toolbar with
  Search/Sort on top; desktop shows Type/Industry/Product + chips inline; mobile uses a **Filters** toggle that stacks
  those dropdowns (no horizontal scroll). Rail dropdowns clear via × (category label is not selectable). Tighter mobile
  section titles and body type. Dropdown search when options > 5. `ownerVerified` stays data-only.

## Process — milestone test plans

Release process now requires a published test plan in `17_TESTING_GUIDE.md` (and a link in `19_CURRENT_SPRINT.md`)
whenever a milestone is pending acceptance; completion messages must include automated commands and browser steps
(`15_RELEASE_PROCESS.md`, `16_CHECKLISTS.md`, `copilot-instructions.md`).

## Roadmap resequence (Milestones 8–12)

Publishing moved from Milestone 8 → **12**. New order: Company Pipeline (8), Discovery Filters (9), Owner Playbook
(10), Minimal Product UI (11), Publishing (12). See `12_DECISIONS.md` DR-009.

## Milestone 8 scope expanded (planning)

M8 now includes fresh evidence-based research (md reference-only), no company count cap, client-side company table
filter/sort, and curated domain seeds (paid BuiltWith API removed DR-012). Company table filters moved from M9 into M8. See `12_DECISIONS.md` DR-010
and `14_ROADMAP.md`.

## Milestone 13 — Loader + Repo Cleanup (accepted 2026-07-08)

### Added

- Branded accessible first-load `.page-loader` (replaces plain “Loading content…”).
- `archive/` tree for historical company research, seeds/manifests, and legacy build scripts (DR-017).
- Milestone 13 test plan in `17_TESTING_GUIDE.md`.
- `scripts/verify-companies.js` and `scripts/verify-learning.js` now run automatically in `npm run verify` and CI
  (previously documented as manual-only steps, so a broken `companies.json` or learning data file could pass CI).
- `scripts/ui-smoke-companies.mjs` now exercises real interaction (typing in the search box, checking focus stays,
  clicking pagination Next) instead of layout geometry only.

### Fixed

- Target Companies search/pagination regression: `index.html` referenced a `.company-table-wrap` selector removed
  in an earlier revert, so typing and Prev/Next silently stopped updating the visible table, and the "Clear
  filters" toggle triggered a full toolbar re-render that dropped keyboard focus out of the search box mid-type.
  `Render.companySection` now wraps the table/cards in a stable `.company-explorer__body`, and "Clear filters" is
  always rendered with a `hidden` class instead of conditionally added/removed markup.

### Changed

- Sole published company DB remains `data/companies.json`; day-to-day edits go there directly (no live rebuild pipeline).
- EDS / AEM Forms filter chips moved to Milestone 15 (was Milestone 14 under DR-017; renumbered again when Milestone
  14 was reassigned to SEO Prerendering, DR-022).

### Audit remediation (2026-07-08)

A Principal Engineer-style production-readiness audit was run against the full repository; every finding was
addressed in this same pass (folded into M13 rather than a new milestone):

- **Added** `assets/js/app.js` — `index.html`'s ~290-line inline bootstrap script (data fetch, company-table
  pagination/filter/sort wiring, copy-link) extracted into a real, lintable, `require()`-able module, following the
  existing `Render`/`Search`/`CompanyFilters`/`UI`/`Icons` namespace pattern (DR-019). `index.html` now contains a
  single `App.boot();` call and no other logic.
- **Added** click-to-sort table column headers (Priority, Company, Type, India) with `aria-sort` and a visual
  direction indicator, reusing the existing `CompanyFilters` sort ids — no new sorting logic, just a new entry
  point onto it (`CompanyFilters.COLUMN_SORTS` / `nextSortFor` / `sortDirectionFor`).
- **Added** `UI.debounce()` (200ms), applied to the company-filter toolbar's search input and the site-wide search
  input, so free-text typing no longer triggers a full filter+sort+re-render on every keystroke. Clicks/changes
  (chips, selects, checkboxes, pagination) remain immediate.
- **Added** ESLint + Prettier dev tooling (`eslint.config.js`, `.prettierrc.json`), `npm run lint` / `npm run
  format`, a `Lint (ESLint + Prettier)` CI step in the `Verify scripts` job, and a dependency-free pre-commit hook
  (`scripts/git-hooks/pre-commit`, installed via the `prepare` npm script) that runs `npm run verify && npm run
  lint` locally before every commit (DR-021). The existing `assets/js/**` and `scripts/**` files were reformatted
  once (`npm run format`) to establish a clean baseline enforced from here on.
- **Added** a scaling size-guard to `scripts/verify-companies.js`: warns (without failing the build) once
  `data/companies.json` crosses ~400 companies / ~800KB, alongside a recorded future chunked-fetch strategy for
  when that happens (DR-020) — avoiding both premature complexity today and silently-forgotten technical debt later.
- **Fixed** a dead/duplicated `product ? X : X` branch in `Render.companyFilterBar` (both arms were byte-for-byte
  identical) and deduplicated two independently-drifting copies of the sort-options list into one source of truth,
  `CompanyFilters.SORT_OPTIONS` (with a `devOnly` flag for the one dev-mode-only entry). `Render.companyFilterActive`
  now delegates to `CompanyFilters.hasActiveFilters` instead of re-implementing the same checks a second time.
- **Changed** `filterState` and `searchFacetState` (previously two separately-allocated objects manually kept in
  sync field-by-field across `assets/js/ui.js` and the old inline script) into a single shared state object, as
  part of the `app.js` extraction (DR-019).
- **Docs:** `03_ARCHITECTURE.md`, `04_CODING_STANDARD.md`, `23_PERFORMANCE.md`, `22_SECURITY.md`,
  `21_PUBLISHING.md`, and `00_PROJECT_OVERVIEW.md` updated to remove stale Tailwind-CDN and pre-M11/M13
  architecture descriptions that no longer matched the shipped site.
- **Verified:** `npm run verify`, `npm run lint`, and `npm run ui-smoke` all pass after every change in this pass;
  the Milestone 3 golden render snapshot (`scripts/milestone-3-render-golden.json`) was intentionally regenerated
  to reflect the new sortable-header markup (verified as the only diff before regenerating).

## Milestone 14 — SEO Prerendering (accepted 2026-07-08)

Implemented immediately after the Milestone 13 audit remediation pass, at the project owner's explicit direction,
in response to a raised concern that client-side-only rendering makes the site's real content invisible to crawlers
that don't execute JavaScript. See `12_DECISIONS.md` DR-022 for the full context and alternatives considered.

### Added

- `scripts/prerender.js` and shared `scripts/lib/prerender-core.js`: `require()` `assets/js/render.js` directly in
  Node (same pattern as `scripts/verify-render.js`) and bake the current `data/*.json` content — page header, both
  search shells, disclaimer, sidebar label, table of contents, `<main>` (hero + every chapter, including the full
  company table), and footer — into `index.html` between `<!-- PRERENDER:START:x --><!-- PRERENDER:END:x -->`
  comment markers. Product mode only; `?mode=dev` stays client-rendered-only.
- Static `<link rel="canonical">` and a JSON-LD `WebSite` `<script>` baked into `<head>`, both driven by a new
  `data/site.json` `seo.siteUrl` field.
- `sitemap.xml` and `robots.txt`, generated (not hand-written) by `scripts/prerender.js` from the same `siteUrl`.
- `scripts/verify-prerender.js`: regenerates the same output in memory and byte-compares it against what's on disk,
  failing with the first differing character if `data/*.json` was edited without re-running `npm run prerender`.
  Added as the final step of `npm run verify`, so it runs identically in CI and the local pre-commit hook (DR-021)
  — one shared enforcement path for both, per the owner's explicit request.
- `npm run prerender` script to regenerate `index.html`/`sitemap.xml`/`robots.txt` after any `data/*.json` edit.

### Changed

- `assets/js/app.js`'s render logic is unchanged at ship time — it still fully re-renders every container on load.
  Prerendering is a static first-paint/SEO baseline, not hydration; see DR-022 for why true hydration was considered
  and deferred. (A small, targeted follow-up fix to `App.boot()`'s *loading-state* handling — not its render logic —
  landed shortly after ship; see "Follow-up" below and DR-023.)
- `00_PROJECT_OVERVIEW.md` rule 6 and `.cursor/rules/constitution.mdc` rule 5 ("no build step") both updated to
  name this one narrow, documented exception: the *output* of `npm run prerender` is a committed static file, so
  GitHub Pages still serves everything with zero build step on its side.
- `14_ROADMAP.md`: the original Milestone 14 ("Company capability filters," DR-017) renumbered to Milestone 15 to
  make room for this milestone.

### Verified

`npm run verify` (including the new `verify-prerender.js` step), `npm run lint`, and `npm run ui-smoke` all pass.
Confirmed `npm run prerender` is idempotent (re-running with unchanged data produces byte-identical output) and that
`npm run verify` correctly fails with a clear message when `data/companies.json` is edited without re-running it.

### Follow-up — Lighthouse-driven fixes (2026-07-08)

The project owner ran Lighthouse against the live site right after this milestone shipped. See `12_DECISIONS.md`
DR-023 for full detail; summary:

- **Fixed:** `App.boot()` no longer blanks `#main` to a loading card when prerendered content is already present —
  it was destroying good, already-rendered content and shrinking the page before re-expanding it, causing a large
  Cumulative Layout Shift (mobile CLS 0.174) that did not exist before this milestone.
- **Fixed:** the six `assets/js/*.js` `<script>` tags now use `defer` (was flagged as ~1,420ms of render-blocking
  resources); `App.boot()` now runs from a `DOMContentLoaded` listener to match.
- **Fixed:** Google Fonts request now uses `display=optional` instead of `display=swap`, and `fonts.gstatic.com` is
  now preconnected — the previous `swap` behavior reflowed the now-much-larger prerendered page when Inter finished
  loading.
- **Fixed (accessibility):** search input `role="searchbox"` → `role="combobox"` (searchbox doesn't allow
  `aria-expanded`, which the combobox pattern this input actually implements requires) and `--text-muted` darkened/
  lightened in both themes to clear the 4.5:1 contrast minimum (was 4.34:1 in light mode; dark mode was ≈4.04:1 and
  not previously caught).
- `npm run prerender` re-run (picks up the `role="combobox"` change in baked search markup); full
  `npm run verify` / `npm run lint` / `npm run ui-smoke` chain re-confirmed green.
- **Fixed:** product-mode boot forced `filterState.sort = 'hiring-desc'` whenever the URL lacked `sort=`, then
  `serializeUrlState` wrote `?cf_sort=hiring-desc`; the next load ran `normalizeSort('hiring-desc')` →
  `priority-desc` and omitted the param — so every alternate reload appeared to add then remove the query string.
  Removed that force; default remains `priority-desc` (same visual sort as the Priority dropdown default).

## Milestone 12 — Publishing (accepted 2026-07-08)

### Added

- Live GitHub Pages: https://jangidvishnu.github.io/aem-developer-playbook/
- MIT license, collaboration docs, CI, `.nojekyll`, repo metadata URLs in `site.json`.

### Deferred

- Print/PDF polish — owner deferred; basic print CSS remains.

### Fixed

- `scripts/run-ui-smoke.mjs` exits after PASS so CI does not hang.

## Milestone 11 — Minimal Product UI (accepted 2026-07-08)

### Added

- `data/site.json` — `mode`, `seo`, `navigation`, product hero CTAs, updated search/footer copy.
- `assets/css/site.css` — token-driven layout, dark mode, doc header, grouped nav, company explorer, command palette.
- `assets/js/icons.js`, `assets/js/ui.js` — inline icons, theme, scroll-spy, custom selects, command palette (DR-015).
- `assets/icons/favicon.svg`.
- Product mode: jobs-first chapter order, unified company explorer, mobile cards, SEO meta + JSON-LD.
- `Render.applyHeadMeta`, `Render.chaptersForMode`, `Render.companySection`, `Render.sidebarGrouped`, `Render.uiSelect`.
- `?mode=dev` URL override for full handbook (DR-014).
- Search anchors use stable `chapter.id` (`#target-companies`, `#how-to-apply`, etc.).
- Company Careers header tip (search keywords vary); `scripts/ui-smoke-companies.mjs` layout checks.

### Changed

- Hero: softer purpose copy; stat cards + CTAs; roadmaps inside Learning Roadmap in product mode.
- Company table (product): **Priority, Company, Type, India, Careers** — auto column layout; Cloud badge only;
  single Careers URL; Intensity / AEM / Jobs columns removed from product UI; header/cell `text-align` matched.
- Filter bar: search + sort + type + industry; Clear filters; no migration / Hiring AEM / Verified chips in product
  (DR-016 defers EDS/Forms to M13).
- Owner playbook: How to Apply chapter; step timeline; Owner badge hidden in product mode.
- Doc shell: grouped sidebar with scroll-spy; mobile search row; icon action buttons; **Browse playbook** label.
- Top-of-page **data disclaimer**; Playwright UI smoke + CI; terminal hygiene rule.
- Learning tables: 10 rows/page with difficulty sort where applicable.

### Fixed

- Search panel wiring, search icon/clear-button polish, How to Apply sticky sub-nav, in-page scroll offset.
- Company table overlap/gap from fixed/`colgroup` width hacks — reset to simple full-width auto layout.

## Milestone 10 — Owner Playbook (accepted)

### Added

- `data/owner_playbook.json` — five owner-voice sections: apply workflow, outreach, learning sources, weekly rhythm, tools.
- **How I Apply** chapter (`how-i-apply`) after Target Companies with `ownerPlaybookEmbed`.
- `Render.ownerPlaybook`, search indexing (`source: 'owner'`), **Apply** search facet chip.
- `scripts/verify-owner-playbook.js`, `scripts/owner-playbook-schema.js`.

## Milestone 9 — Discovery Filters (accepted)

### Added

- Search-panel facet chips (All / Companies / Chapters / Learning) intersecting with ranked search results.
- Shareable filter URLs via query params (DR-013): `cf_*` company facets, `sf_source`, `q`.
- Company table: **Industry** and **Migration** dropdowns (deferred from M8).
- **Copy link** on company filter bar and search panel — discoverable sharing without using the address bar.
- `CompanyFilters.filterSearchResults`, `parseUrlState`, `serializeUrlState`; facet metadata on company search index entries.
- Extended `verify-filters.js` and `verify-search.js` for facet intersection and URL round-trip.

## Milestone 8 — Company Pipeline (accepted)

### Changed

- Consolidated nine `company-m8-*` / `builtwith-domain-map` scripts into `data/company-sources.json`,
  `scripts/company-records.js`, `scripts/company-overrides.js`, and `scripts/build-companies.js`.

### Added

- `scripts/hiring-gate.js`, `build-companies.js`, `company-records.js`, `company-overrides.js`,
  `verify-filters.js`; `assets/js/filters.js`.
- M8 schema fields: `HiringAEM`, `AEMHiringEvidence`, `AEMWorkFocus`, `HiringIntensity`, `AdobeSpend`,
  `LastHiringVerified`.
- `data/companies.json` — **119** hire-verified rows (product employers prioritized); **33** archived to `data/manifests/company-candidates.json`.
- Product batch 1: Ford, MG Motor India, CEAT, Volvo Group, Volkswagen, Sony, Under Armour, Best Buy, AkzoNobel, Signify, Boots.
- Product batch 2: Vodafone Idea (Vi), Lenovo, UPS, Prudential Financial, Dow, DICK'S Sporting Goods.
- Occasional hirer: Ericsson (incl. Vonage) — Low intensity, monitor Greenhouse AEM requisitions.
- Service batch: Deloitte Digital, Publicis Sapient, Virtusa, EPAM, IBM (Adobe Practice), Tech Mahindra.
- India agency/GCC batch: Accenture, Cognizant, TCS, Wipro, HCLTech, Infosys, Capgemini.
- Referral batch (user hire/approach list + airlines/banks): Persistent, Coforge, Mphasis, LTIMindtree, Hexaware, KPMG India, Perficient, Rightpoint, TO THE NEW, Photon, Wissen, ValueLabs, UST, Emids, Ranosys, Accion Labs; Air India, Malaysia Airlines; Maruti Suzuki; HDFC Bank, Standard Chartered; T-Mobile, Informatica, Optum (UHG), Micron.
- BuiltWith watchlist batch (DR-011): 50 employers in `data/company-sources.json` (`builtwithSeeds`).
- Company table: filter/sort bar, Hiring and Intensity columns.

BuiltWith seed map only (paid API removed per DR-012).

## Milestone 7 — Learning System (accepted)

### Added

- `data/glossary.json`, `technologies.json`, `career_paths.json`, `interviews.json`, `templates.json`,
  `resources.json`; `roadmaps.json` expanded to 3 paths.
- `scripts/learning-schema.js`, `learning-seed-data.js`, `build-learning-m7.js`, `verify-learning.js`.
- `Render.roadmapList`, learning table/list renderers; chapter embed flags; search indexes learning sources.
- Chapters: `glossary`, `interview-prep`; embeds on career-strategy, core-skills, professional-branding,
  living-roadmap.

Accepted by project owner. Full detail in `25_ROADMAP_ARCHIVE.md`.

## Milestone 6 — accepted

Accepted by the project owner after browser verification. Full detail in `25_ROADMAP_ARCHIVE.md`.

## Milestone 6 — Company Intelligence Database

### Added

- `scripts/company-schema.js`, `scripts/company-verified-records.js`, `scripts/build-companies-m6.js`,
  `scripts/verify-companies.js`, `scripts/ingest-company-candidates.js` (stdout manifest only).
- 25 `Status: "Verified"` companies in `data/companies.json` with Tier-2 Adobe case-study `Evidence` URLs (DR-006).
- Client-side company-table pagination (25 rows/page) and Status column in `Render.companyTable`.

### Changed

- `data/companies.json` migrated to `11_COMPANY_SCHEMA.md` shape (46 records total).
- `assets/js/search.js` indexes `name`, `industry`, `Status`, `Notes`, `TypicalRoles`.
- `scripts/milestone-3-render-golden.json` updated after intentional company-table markup change.
- Milestone 6 test plan in `17_TESTING_GUIDE.md`; search no longer hides chapter sections while typing.

## Milestone 5 — accepted

Accepted by the project owner after browser verification. Full detail in `25_ROADMAP_ARCHIVE.md`. Milestone 6
started per `12_DECISIONS.md` DR-006.

## Milestone 5 — Search

### Added

- `assets/js/search.js` — `Search.buildIndex`, `Search.query`, `Search.rank` over chapters, companies, roadmaps,
  and site hero copy.
- `Render.searchResults` — accessible results listbox; `Render.search` now wraps input + results container.
- `scripts/verify-search.js` — five fixed query assertions plus ranking sanity check.
- `id="hero"` and `id="roadmap"` on rendered sections for search anchors.

### Changed

- `index.html` search wiring uses JSON index (no `innerText` DOM scan); keyboard Arrow/Enter/Escape supported.
- `data/site.json` search placeholder broadened to "Search playbook…".

## Milestone 4 — accepted

Accepted by the project owner after a real browser check at `http://localhost:3456` — full detail in
`25_ROADMAP_ARCHIVE.md`.

## Milestone 4 — Renderer

### Added

- `assets/js/render.js` — full `Render` namespace moved out of `index.html`; loaded via `<script src>` and
  `require()`'d by `scripts/verify-render.js`.
- `data/site.json` — site chrome (header, hero, dashboard, footer, search config) previously hardcoded in
  `index.html`.
- `data/roadmaps.json` — minimal learning-path seed for `Render.roadmap`.
- `Render.pageHeader`, `Render.hero`, `Render.dashboard`, `Render.roadmap`, `Render.footer`, and
  `Render.search` (header chrome only).
- `scripts/milestone-3-render-golden.json` — regression snapshot for chapter/sidebar output.

### Changed

- `index.html` is now a thin shell: structural markup containers, fetch boot script, and event wiring (theme toggle,
  naive search filter) only — no render methods inline.
- `scripts/verify-render.js` requires `assets/js/render.js` directly; compares chapter/sidebar output against the
  Milestone 3 golden snapshot instead of the pre-Milestone-1 baseline.

## Milestone 3 — accepted

Accepted by the project owner after a real browser check (served over HTTP, per `12_DECISIONS.md` DR-005) —
the first milestone confirmed with actual human verification rather than programmatic checks alone. Full detail
moved to `25_ROADMAP_ARCHIVE.md`; `14_ROADMAP.md` and `19_CURRENT_SPRINT.md` updated accordingly. Milestone 4 has
not been scoped yet.

## Milestone 3 — Data Model

The first milestone run under the full `15_RELEASE_PROCESS.md` checklist from the start (Architecture,
Documentation, Accessibility, and Performance reviews, not retrofitted afterward).

### Added

- `data/chapters.json` and `data/companies.json` — content previously hardcoded in `index.html`, now fetched at
  load. Includes a stable `id` per record (foundational, added ahead of full schema conformance).
- A loading state (`role="status"`) and error state (`role="alert"`) in `index.html` for the new async data-fetch
  gap.
- `12_DECISIONS.md` DR-005, recording the `fetch()`/CORS trade-off (local viewing now requires a server) — flagged
  to and accepted by the project owner before implementation began.

### Changed

- `index.html` no longer contains any hardcoded content data — only markup, styling, and the `Render` rendering
  logic. Satisfies `01_AI_CONSTITUTION.md`'s "never hardcode content" rule in full for the first time.
- `scripts/verify-render.js` now reads the real `data/*.json` files from disk instead of a hardcoded copy, so it
  proves those files are correct, not just that a copy of them is self-consistent.
- `17_TESTING_GUIDE.md`'s smoke test now requires serving `index.html` over HTTP rather than opening it directly.
- `03_ARCHITECTURE.md`, `09_DATA_MODEL.md`, `.cursor/rules/architecture.mdc` updated to reflect the new data flow.

### Reviewed

- **Accessibility:** loading/error states are screen-reader announced via implicit ARIA live regions
  (`role="status"` / `role="alert"`); no heading-order or landmark changes.
- **Performance:** `index.html` shrank 10,455 → 8,330 bytes; two new parallel requests added
  (`chapters.json` 2,585 bytes, `companies.json` 1,026 bytes). Honestly documents a small time-to-first-content
  cost from the fetch round-trip, accepted per the project's priority order (Maintainability/Scalability rank
  above Performance).

### Verified

- `node scripts/verify-render.js`: output identical to the pre-Milestone-1 baseline except the already-known
  Milestone 2 dark-mode fix — confirms the JSON data is a byte-faithful transcription and the new `id` fields
  don't leak into rendered markup.

### Deliberately not done (see `09_DATA_MODEL.md`)

- Full ~40-field company schema conformance and full chapter schema fields (`slug`, `difficulty`, `references`,
  `relatedChapters`, `lastUpdated`) — deferred to whichever milestone next adds real content to these files
  (Milestone 6 for companies), so schema expansion and real data entry happen together.

## `.playbook/` restructuring for AI token efficiency

### Changed

- Merged `00_PROJECT_OVERVIEW.md`, `01_AI_CONSTITUTION.md`, and `02_PROJECT_MEMORY.md` into one file
  (`00_PROJECT_OVERVIEW.md`). The latter two are now short pointer stubs — not deleted, so every existing
  cross-reference to them still resolves.
- Moved completed milestones' full historical detail (Goal/Scope/Estimates/Acceptance-Criteria/Definition-of-Done/
  review outcomes for Milestones 1 and 2) out of `14_ROADMAP.md` into a new `25_ROADMAP_ARCHIVE.md`. The active
  roadmap now keeps only the sequence table and short summaries.
- Updated `.github/copilot-instructions.md` to reflect both changes.

### Added

- `.cursor/rules/constitution.mdc` and `.cursor/rules/current-state.mdc` (`alwaysApply: true`) — the core
  non-negotiable rules and state pointers, loaded automatically instead of via a manual "read these files"
  instruction.
- `.cursor/rules/coding-standard.mdc`, `architecture.mdc`, `company-data.mdc`, `editorial-style.mdc` — glob-scoped
  rules that auto-attach only when relevant files (`index.html`, `scripts/**`, `data/**`, `md/**`, `.playbook/**`)
  are open, rather than being force-read on every task regardless of relevance.
- `12_DECISIONS.md` DR-004, documenting the measured token costs and the reasoning behind this restructuring.

### Result

Estimated ~68% reduction in the token cost paid on every session (~10,000 → ~3,200 tokens for a typical
code-touching task). No information deleted — this is pure reorganization.

## Full remediation pass — Milestone 1 & 2 review follow-ups

Resolved every open item from the Milestone 1 PR review, the pre-Milestone-2 technical debt report, and the
retroactive Milestone 2 release-checklist gap, in one disciplined pass.

### Fixed (documentation)

- `14_ROADMAP.md`'s self-contradicting Milestone 1 "Scope (out)" bullets (Critical debt item).
- Archived the `FUTURE ROADMAP`/`VERSION HISTORY` content lost from `index.html`'s old constitution comment
  ("Salary intelligence," "Mermaid diagrams," the 2.1.0 history note) into `02_PROJECT_MEMORY.md` — closes the
  Milestone 1 PR review's remaining blocking item.

### Fixed (code)

- `Render.chapter` now receives `companies` as an explicit parameter instead of reading `PLAYBOOK.companies`
  directly — closes the High-severity coupling/purity debt items.
- Added `Render.escapeHtml()`, applied to every interpolated text/attribute value across all render functions
  (chapter `body` deliberately left unescaped — it is intentional raw HTML).
- Wrapped all render functions in a single `Render` namespace object instead of bare top-level functions — closes
  the Medium-severity module-boundary debt item.
- Added an inline scalability note in `Render.companyTable`; assigned the `assets/js/` extraction to Milestone 4.
- **Accessibility fixes:** `aria-label`s on the theme toggle and search input; a skip-to-content link; and a fix
  for a newly-discovered Critical dark-mode contrast bug (header, sidebar, and every chapter card had text
  inheriting a toggling color while sitting on a fixed white background, rendering near-invisible in dark mode).

### Added

- `scripts/verify-render.js` — a committed, reusable Node regression check comparing current render output against
  the pre-Milestone-1 baseline. Closes the "no committed snapshot tooling" debt item.
- Formal Accessibility Review (`20_ACCESSIBILITY.md`) and Performance Review (`23_PERFORMANCE.md`) for the current
  state — the two reviews Milestone 2 initially shipped without, per the Release Philosophy added to
  `MASTER_BOOTSTRAP_PROMPT.md` after Milestone 2's implementation.

### Verified

- Every code change re-verified via `node scripts/verify-render.js`. The escaping, parameter-passing, and namespace
  changes produced byte-identical output to the pre-Milestone-1 baseline. The accessibility color-class fix
  produced an exact, expected +120-character diff (`text-slate-800` × 8 chapter sections) — confirmed via the
  script's diff output to be the *only* change, nothing else shifted.

### Result

All 12 items from the pre-Milestone-2 technical debt report are resolved. Both Milestone 1 PR review blocking
items are resolved. Milestone 2 now satisfies the full `15_RELEASE_PROCESS.md` release checklist retroactively.

## Documentation sync — Release Philosophy (post-Milestone-2)

### Changed

- `MASTER_BOOTSTRAP_PROMPT.md` added a "Release Philosophy" section (release-driven development; every release
  requires Architecture, Documentation, Accessibility, and Performance reviews plus PR summary, commit message, and
  changelog update). Synchronized into `15_RELEASE_PROCESS.md`, `01_AI_CONSTITUTION.md`, `16_CHECKLISTS.md`, and
  `14_ROADMAP.md`.
- `01_AI_CONSTITUTION.md` also gained the "Architecture Workflow" section it was previously missing (closes a
  Medium-severity item from the pre-Milestone-2 technical debt report).

### Noted

- Milestone 2 is retroactively missing an Accessibility Review and Performance Review per the new Release
  Philosophy, since that requirement postdates its implementation. Logged as an open item in
  `19_CURRENT_SPRINT.md`, not silently backfilled.

## Milestone 2 — Render Function Extraction (implemented)

### Added

- `renderSidebar(chapters)`, `renderChapter(chapter, index)`, `renderCompanyTable(companies)`, and a
  `renderCompanyRow(company)` helper, extracted from the single inline `forEach` block in `index.html` as named,
  top-level functions.

### Verified

- Rendered output confirmed byte-identical before and after the refactor via a standalone Node harness simulating
  both the old and new rendering logic against the same `PLAYBOOK` fixture (`toc` and `main` innerHTML strings
  matched exactly, same lengths). Manual smoke-test items (dark mode, print mode, search, keyboard tab order) are
  unaffected since none of that code was touched.

### Known, unresolved (unchanged by this milestone, by design)

- `renderChapter` still reads `PLAYBOOK.companies` directly rather than receiving it as a parameter, preserving the
  pre-existing coupling described in `03_ARCHITECTURE.md` — not fixed here per Milestone 2's explicit
  "do not expand scope" instruction.
- No HTML-escaping utility was added (flagged as High severity in the pre-Milestone-2 technical debt report) —
  consciously deferred, not expanded into this change.
- `14_ROADMAP.md`'s Milestone 1 section still contains a stale "Scope (out)" reference (the Critical item from the
  same technical debt report) — also not touched, per the same instruction.

### Planning (superseded by the above)

- Scope narrowed from the original "Architecture Refactor" plan to render-function extraction only, deferring data
  migration to Milestone 3 — see `12_DECISIONS.md` DR-003.
- Full scope, acceptance criteria, and estimates recorded in `14_ROADMAP.md`.
- `03_ARCHITECTURE.md` and `10_COMPONENT_LIBRARY.md` updated to match the new Milestone 2/3/4 split.

## Milestone 1 — Repository Foundation (implemented, all follow-ups resolved)

### Added

- Full milestone roadmap (`14_ROADMAP.md`) covering Milestones 1–8.
- Real content for all 25 `.playbook/` documents (`00`–`24`), replacing one-line stubs / filling gaps left by
  missing files.
- `data/`, `assets/`, `assets/js/` baseline folder skeleton.
- Rewritten `README.md` with a correct "start here" reading order.
- Rewritten `.github/copilot-instructions.md` with accurate file references and an explicit instruction to stop
  and report if the repository is found in an unexpected state.

### Fixed

- Removed the duplicated project constitution embedded as an HTML comment in `index.html`; it now points to
  `MASTER_BOOTSTRAP_PROMPT.md` instead of restating a second, divergent rule set.
- Fixed the version-number mismatch between `index.html`'s header comment and its visible header text.
- Fixed `README.md` pointing to `.playbook/00_PROJECT_OVERVIEW.md` when that file did not exist on disk.

### Investigated

- Documented a repository-integrity incident where 20 committed docs and 5 uncommitted docs were found deleted
  from the working tree with no corresponding action from the reviewing session. See `DR-002` in `12_DECISIONS.md`.

### Reviewed

- Lead-Architect PR review completed. Verdict: changes requested. All 5 stated acceptance criteria met; 2 blocking
  items identified (a content-preservation gap and stale tracking docs). The stale-docs item is resolved as of this
  entry; the content-preservation gap remains open (see `14_ROADMAP.md`'s "Follow-ups required before formal
  acceptance").

## Pre-Milestone-1 (initial commit)

### Added

- Initial `index.html` single-file application: sidebar TOC, dark mode with persistence, print CSS, inline search,
  hardcoded chapter and company content.
- Initial one-line stub versions of `.playbook/00–19` and `.github/copilot-instructions.md` (commit
  `9e39356 docs: add AI operating system`).
- Four raw AEM-employer research reports added to `md/`.
