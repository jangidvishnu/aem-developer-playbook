# Decision Records

Format: one entry per decision, newest first. Each entry states the context, the decision, and the trade-off
accepted. Decisions are never deleted — if a decision is later reversed, add a new entry that supersedes it and
mark the old one as superseded.

---

---

---

---

---

## DR-026 — Milestone 16: fixed table columns + sticky sidebar (layout stability)

**Date:** 2026-07-09
**Context:** Filtering/sorting the company explorer (and paging learning tables) caused visible column-edge
flicker because auto table layout remeasured each row set. Separately, at the bottom of long pages the left
sidebar appeared to “go up” because `.site-shell` was a stretch-aligned flex row and sticky positioning lost its
intended viewport pin once the shell’s bottom entered view.
**Decision:**
1. Use `table-layout: fixed` with explicit widths for company explorer columns and learning `data-table`s.
2. Keep stable min-heights on the company results head / table body.
3. Set `.site-shell { align-items: flex-start }` and keep desktop `.site-sidebar` sticky with a viewport
   `max-height`, so the nav stays under the header while main content scrolls.
4. Prerender header GitHub link + theme toggle icon (`header-github` / `header-theme` markers) so the tools row
   does not gain a control after `site.json` loads (header CLS / search reflow).
5. Show slim-schema depth (products, roles, hq, notes, evidence, hiringEvidence, verifiedAt) via **row expand /
   card Details**, not extra table columns.
6. Insert **Milestone 16** ahead of Milestone 15 (EDS/Forms chips) so layout stability lands before more filter UI.
**Trade-off accepted:** Fixed widths may ellipsize very long company names; badges wrap under the name. Filter
toolbar height can still change when the mobile Filters panel opens — that is intentional expand/collapse, not
column flicker. Only one company detail panel open at a time (accordion). Print hides expand controls and closed
detail rows.
**Follow-up:** None outstanding for this decision; M15 remains queued.

## DR-025 — Owner verification + active-hiring flags; complete field-pass research

**Date:** 2026-07-09
**Context:** Company research was being re-run in partial passes (careers only, then products, then roles).
Owner wants each new/updated row researched **once across every schema field**, plus two owner-controlled
booleans: whether the row has been manually checked, and whether the employer generally hires AEM/DXP
actively most of the time.
**Decision:**
1. Required `ownerVerified` (boolean) — `false` for any new agent-added row until the project owner manually
   checks it; existing published rows may be set `true` when the owner confirms the current list.
2. Optional `hiringActive` (boolean) — omit when unknown; `true` only when the owner confirms the employer
   **generally** posts AEM/DXP roles frequently (pattern / cadence), **not** that a role is open today. Site
   disclaimer must state this. Owner will manually verify the flag over time.
3. Research guide requires a **complete field pass** checklist before publishing a row so we do not re-research
   the same company field-by-field across sessions.
4. Optional `ownerPreferred` (boolean) — owner recommendation for pay / career growth / company quality. Distinct
   from `hiringActive` and `priority`. Omit when not preferred; short why belongs in `notes`.
**Trade-off accepted:** `ownerVerified` is process metadata, not evidence of AEM usage. `ownerPreferred` is
subjective opinion published on a public site — disclaimer must label it as such. UI may ignore these flags until
a filter is added; agents must still set them correctly.
**Follow-up:** `11_COMPANY_SCHEMA.md`, `07_RESEARCH_GUIDE.md`, `scripts/company-schema.js`, company-data rule.

## DR-024 — Slim public company schema (products array, omit unknowns)

**Date:** 2026-07-09
**Context:** `data/companies.json` carried ~55 keys per row (~229 KB for 121 employers). Many fields were always
`"Unknown"`, always-true gates (`usesAEM`, `HiringAEM`), duplicated product booleans vs `AdobeProducts`, or personal
tracking flags that do not belong in a public payload. Owner wants a smaller, filter-ready schema for resume-based
Adobe product matching without losing future-useful facts we can actually source.
**Decision:** Public company rows use a slim schema documented in `11_COMPANY_SCHEMA.md`: identity + careers +
`products` (short codes) + `roles` + `notes` + `evidence` / `hiringEvidence` + `verifiedAt` + required
`ownerVerified`, with optional `hq`, `indiaPresence`, `hiringIndia`, `jobSearchUrl`, `hiringActive`, and optional
sourced `signals` (ratings — omit until filled; no scraping). Drop product booleans, `MigrationStatus`, soft people
fields, personal tracking, and redundant always-true gates from the public file. Cloud UI filter/badge = `aem-cloud`
in `products`. India filter uses `hiringIndia` (boolean). See also DR-025 for owner/hiring flags.
**Trade-off accepted:** Historical field names in archive/research docs remain as-is; public consumers and verify
scripts must use the new names. Soft fields can return later via a separate private/owner store if sourced.
**Follow-up:** `scripts/company-schema.js`, `scripts/hiring-gate.js`, filters/render/search UI, `07_RESEARCH_GUIDE.md`.

## DR-023 — Lighthouse-driven fixes: loader-vs-prerender CLS, font-display, script loading, ARIA role, contrast

**Date:** 2026-07-08
**Context:** The project owner ran Lighthouse (desktop + mobile) against the live GitHub Pages site right after
Milestone 14 (DR-022) shipped. Scores: desktop Performance 0.98 / Accessibility 0.91 / Best Practices 1.0 / SEO 1.0;
mobile Performance 0.84 / Accessibility 0.91 / Best Practices 1.0 / SEO 1.0. Four concrete, evidence-backed issues
were found in the reports (not opinion) and fixed in this pass:
1. **CLS regression from DR-022 itself (mobile CLS 0.174, "Web font loaded" / largest shift on `#site-footer`):**
   `App.boot()` unconditionally overwrote `#main` with a small loading-card, before fetching data, then overwrote it
   again with the full render once data arrived. Before prerendering, `#main` started empty, so this was a harmless
   empty→loader→content sequence. After DR-022 baked real, full-height content into `#main` at first paint, the same
   code now actively destroyed good content to shrink the page to loader height, then grew it back — a large,
   avoidable layout shift. **Fix:** `App.boot()` now checks `main.children.length > 0` and skips the loader entirely
   when prerendered markup is already present, going straight from "prerendered content visible" to "same content,
   freshly re-rendered" (same height, no shift). The `fetch` failure path also no longer clobbers working prerendered
   content with an error card when there's no loader element to replace — it now leaves the static content visible
   and only logs to console.
2. **Render-blocking resources (mobile: ~1,420ms estimated savings; 854ms of that is the Google Fonts CSS request):**
   the six `assets/js/*.js` files and the Google Fonts stylesheet were all synchronous. **Fix:** added `defer` to all
   six local `<script>` tags (execution order and "runs after DOM parse" behavior unchanged — they were already at
   the end of `<body>` for that exact reason) and moved the `App.boot()` call into a `DOMContentLoaded` listener so
   it still runs after all deferred scripts define their globals. Also added a `<link rel="preconnect">` for
   `fonts.gstatic.com` (the actual font-file host) — previously only `fonts.googleapis.com` was preconnected.
3. **Font-swap reflow feeding into the CLS above:** changed the Google Fonts request from `display=swap` to
   `display=optional`. With DR-022's baked content now filling the page at first paint, a mid-load font swap reflows
   every line of text on the page; `optional` keeps the system fallback for that page view unless Inter is already
   cached, trading brand-font fidelity on a cold first visit for zero font-driven layout shift.
4. **Accessibility, `aria-allowed-attr` (score 0):** the search `<input>` had `role="searchbox"` plus `aria-expanded`,
   `aria-controls`, and `aria-autocomplete="list"` — but `aria-expanded` is not a valid attribute on `searchbox` per
   the WAI-ARIA spec. The actual behavior (typing opens a live results popup) is the textbook ARIA 1.2 combobox
   pattern, so the correct fix was changing the role to `role="combobox"` (which requires `aria-expanded`) rather
   than deleting the attribute and losing that state information for assistive tech.
5. **Accessibility, `color-contrast` (score 0):** `--text-muted` (`#64748b` light / `#94a3b8` dark) measured 4.34:1
   against `--bg-muted` (`#f1f5f9`) — just under the 4.5:1 AA minimum for normal text — on stat-card labels and
   table headers. Darkened light-mode `--text-muted` to `#5b6b80` (≈4.96:1 against `--bg-muted`) and lightened
   dark-mode `--text-muted` to `#9fb0c4` (≈4.68:1 against dark `--bg-muted`, which was also failing at ≈4.04:1 even
   though Lighthouse only audited the light theme) — both single CSS variable changes, so every one of the ~29
   call sites gets fixed at once with no visual redesign.
**Decision:** Fix all four root causes now rather than filing them as future work, since they were concrete,
reproducible, and low-risk (no markup shape changes beyond one ARIA role and two CSS variable values). Re-ran
`npm run prerender` (picks up the `role="combobox"` change in the baked search markup) and the full
`npm run verify` / `npm run lint` / `npm run ui-smoke` chain after the changes — all pass.
**Trade-off accepted:** `display=optional` means a first-time visitor on a cold cache may see the system font
instead of Inter for that page view (it upgrades to Inter on the next navigation once cached) — accepted as the
standard, well-documented trade-off for eliminating font-driven CLS, and appropriate for a content/discovery site
where Core Web Vitals (an SEO ranking factor) matter more than exact brand-font fidelity on a first cold load.
**Follow-up:** None outstanding. Supersedes the "None outstanding" follow-up note on DR-022 — this *is* that
follow-up.

## DR-022 — Prerender product-mode HTML at commit time for SEO (bake, don't hydrate)

**Date:** 2026-07-08
**Context:** The site is a single `index.html` shell whose entire `<body>` is empty until `assets/js/app.js`'s
`App.boot()` runs — real content (the company table, apply guide, learning chapters) only exists in the DOM after a
client-side `fetch()` + render pass. Googlebot executes JavaScript, but many other crawlers, link-preview bots, and
some accessibility/archival tools do not, so they see an empty page. This directly conflicts with `00_PROJECT_OVERVIEW.md`'s
publication-quality goal for a jobs-discovery site whose entire value is being findable.
**Decision:** Add `scripts/prerender.js` (shared generation logic in `scripts/lib/prerender-core.js`, `require()`ing
`assets/js/render.js` directly in Node — the same pattern `scripts/verify-render.js` already established) to bake
the current `data/*.json` content into `index.html` between fixed `<!-- PRERENDER:START:x --><!-- PRERENDER:END:x -->`
comment markers, for the always-published **product mode** view only (`?mode=dev` stays client-rendered-only, out of
scope). It also generates `sitemap.xml` and `robots.txt` from `data/site.json`'s new `seo.siteUrl` field, and bakes a
static `<link rel="canonical">` and a JSON-LD `WebSite` `<script>` into `<head>`.
`assets/js/app.js` is deliberately **not** made hydration-aware — it still fully re-renders every container on load
exactly as it did before this change. Because the baked markup and the client re-render both come from the same
`Render.*` functions given the same data, they produce byte-identical output in the common case, so there is no
visible flash of *different* content — only an imperceptible, redundant re-render. A true hydration implementation
(skip re-rendering when server/build output is already correct in the DOM) was considered and rejected for now: it
would require `App.boot()`'s `wireCompanyPagination`/`wirePaginatedContainer` functions to detect and reuse existing
DOM instead of always calling `container.innerHTML = ...` once on init, which is real, bug-prone surface area (state
mismatches between "what's in the DOM" and "what the JS thinks is in the DOM") for a codebase that has already been
through one full audit remediation pass. Re-render-on-top is the safer trade-off until data/traffic volume justifies
the added complexity.
`scripts/verify-prerender.js` reruns the same generation function in memory and byte-compares it against
`index.html`/`sitemap.xml`/`robots.txt` on disk, and is the last step of `npm run verify` — so it's the same one
enforcement path locally (pre-commit hook, `12_DECISIONS.md` DR-021) and in CI, per the project owner's explicit
request for "one common strategy" across both.
**Constitution note:** `00_PROJECT_OVERVIEW.md` rule 6 and `.cursor/rules/constitution.mdc` rule 5 both state "no
build step" as non-negotiable. `npm run prerender` is, strictly, a build step — but its *output* is a committed
static file with no build step at request/deploy time (GitHub Pages still serves everything as-is), which is what
the original rule was protecting (portability, offline-friendliness, zero server-side moving parts). This was
flagged explicitly to the project owner before implementation, who approved proceeding; both rule documents were
updated in this same change to carve out this one narrow, named exception rather than leave a real contradiction on
record.
**Trade-off accepted:** `data/*.json` edits now require an extra `npm run prerender` step before committing (enforced,
not just documented, by `verify-prerender.js`) — a small amount of contributor friction in exchange for the site
actually being discoverable by search engines. `index.html`'s diff size increases substantially whenever data
changes (the full baked company table, chapters, etc. are now literally in the file), which is expected and
by design, not a regression.
**Follow-up:** See DR-023 — a post-ship Lighthouse audit found this decision's loader-vs-prerender interaction was
causing a real CLS regression, fixed there. If traffic/SEO metrics later justify true hydration (skip the redundant
client re-render), that is a separate new decision record, not a silent change to this one.

## DR-021 — Adopt ESLint + Prettier as dev-time tooling, enforced in CI and a local pre-commit hook

**Date:** 2026-07-08
**Context:** A full engineering audit (Principal Engineer review, 2026-07-08) found no automated enforcement of
code-quality rules (undeclared globals, unused variables, `==` vs `===`) or consistent formatting — one indentation
glitch had already shipped to `assets/js/render.js` undetected. `04_CODING_STANDARD.md`'s "no build step" and "no
unnecessary dependencies" rules apply to what ships to `index.html`, not to dev-only tooling that never loads in the
browser.
**Decision:** Add `eslint` and `prettier` as devDependencies only (no `eslint-config-prettier`, no `globals`
package — the flat config in `eslint.config.js` hand-declares the small, fixed set of browser/Node globals this
project actually uses, and no stylistic ESLint rules are enabled, so there is nothing for the two tools to
conflict on). `npm run lint` runs both and is now a required step in the CI `Verify scripts` job. A lightweight
`scripts/git-hooks/pre-commit` script (installed into `.git/hooks/` via the `prepare` npm script — no `husky`
dependency) runs `npm run verify && npm run lint` locally before every commit. The existing codebase was
reformatted once (`npm run format`) to establish a clean, enforceable baseline; `assets/js/render.js` gained a
small `Render._companyFilters()` accessor so `Render` can safely call the newly-shared `CompanyFilters` sort/filter
helpers in both the browser (classic-script shared scope) and Node (`scripts/verify-render.js`'s isolated
`require()`).
**Trade-off accepted:** Two new devDependencies (previously zero) and a one-time large-looking diff from the
formatting pass (whitespace/quote-style only, verified against the full `npm run verify` + `npm run ui-smoke`
suite both before and after) — `scripts/learning-seed-data.js` in particular grew substantially in line count
because Prettier wraps its long single-line, long-URL objects onto multiple lines.
**Follow-up:** None outstanding.

## DR-020 — `data/companies.json` scaling: warn at a threshold now, defer chunked fetching until needed

**Date:** 2026-07-08
**Context:** The audit flagged that `data/companies.json` (222KB / 119 companies) is fetched in full on every page
load with no chunking, and asked whether this is durable to "hundreds or thousands" of companies. Building actual
chunked/paginated-fetch infrastructure today would be premature complexity: GitHub Pages already gzips JSON
responses (materially reducing the real-world payload), and no near-term milestone adds enough companies to make
this a real user-facing problem.
**Decision:** Do not build chunked fetching now. Instead, record the threshold at which it becomes worth doing —
**~400 companies or ~800KB raw** — and the chosen future strategy if that threshold is crossed: split into
`data/companies/page-N.json` chunks plus a manifest, fetched on-demand as pagination advances. `scripts/verify-companies.js`
now warns (not fails) loudly once either threshold is crossed, so this doesn't silently become forgotten technical
debt.
**Trade-off accepted:** If growth is sudden rather than gradual, the chunking work will need to happen under time
pressure instead of being already in place — accepted because current growth rate (company-by-company manual
research) makes that scenario unlikely before the warning fires with plenty of lead time.
**Follow-up:** If `scripts/verify-companies.js` starts warning, scope the chunked-fetch implementation as its own
milestone rather than folding it into unrelated work.

## DR-019 — Extract `index.html`'s inline bootstrap script into `assets/js/app.js`

**Date:** 2026-07-08
**Context:** The audit's top architectural finding: `index.html` carried a ~290-line inline `<script>` (data
fetching, company-table pagination/filtering wiring, search-facet state, copy-link) that was invisible to
`eslint`/`prettier`, impossible to unit-test, and the single largest concentration of untested logic in the
codebase. It also duplicated company/search filter state across two separately-allocated objects
(`filterState` and `searchFacetState`) that were manually kept in sync field-by-field in `assets/js/ui.js`.
**Decision:** Move the inline script into `assets/js/app.js`, following the same plain-object namespace pattern as
`Render`/`Search`/`CompanyFilters`/`UI`/`Icons` (`App.boot()`, `App.wireCompanyPagination()`, etc., with the same
`window.App` / `module.exports` guard). `index.html`'s only remaining inline code is a one-line `App.boot();` call.
The two state objects were unified into a single shared object passed as both `filterState` and `searchFacetState`
into `UI.wireSiteSearch()` / `UI.wireCommandPalette()`, removing the manual dual-assignment sync points in
`assets/js/ui.js`.
**Trade-off accepted:** None meaningful — this is a pure code-location refactor (no DOM/CSS selector changes); confirmed
via `npm run verify` (Node-side logic tests, unaffected) and `npm run ui-smoke` (Playwright, confirms the browser
wiring still behaves identically) both passing unchanged.
**Follow-up:** None outstanding.

## DR-018 — Branch protection on `master` enforced for admins too; CI gains company/learning data validation

**Date:** 2026-07-08
**Context:** Branch protection with required status checks (`Verify scripts`, `UI smoke (Playwright search)`) was
already configured on `master` from an earlier session, but `enforce_admins` was `false` — the sole maintainer
(repo admin) could still see a bypass button to merge without checks passing. Separately, `verify-companies.js` and
`verify-learning.js` existed but were documented as manual-only steps, never actually run in CI, so a broken
`companies.json`/learning file could pass CI green.
**Decision:** Set `enforce_admins: true` via `gh api` (owner authenticated `gh` locally and confirmed this
explicitly) so no one, including the admin, can merge a PR into `master` without both required checks passing.
`npm run verify` and the CI `Verify scripts` job now also run `verify-companies.js` and `verify-learning.js`.
`scripts/ui-smoke-companies.mjs` now exercises real interaction (typing in search, focus retention, pagination
Next) instead of layout geometry only, per the Target Companies regression fixed the same day (see
`13_CHANGELOG.md`).
**Trade-off accepted:** The maintainer loses the emergency-bypass merge button; a hotfix now always needs a green
CI run first, even from the repo owner.
**Follow-up:** None outstanding; branch protection state verified via `gh api .../branches/master/protection`.

## DR-017 — Milestone 13 is loader + cleanup; EDS/Forms becomes Milestone 14

**Date:** 2026-07-08
**Context:** After Pages went live, the owner prioritized a better first-load experience and a thorough repo cleanup
(single published `companies.json`, archive unused research/pipeline) over new filter chips. DR-016 had scheduled
EDS/Forms as M13.
**Decision:** **M13 = branded page loader + archive cleanup** (move research MD, company seeds/manifests, and legacy
company build scripts under `archive/`; do not silent-delete). **Milestone 14** inherits EDS and AEM Forms filter chips
+ URL state. Day-to-day company edits update `data/companies.json` directly; rebuild-from-seeds is archived, not live.
Print/PDF remains deferred after M12.
**Trade-off accepted:** Capability filters slip one milestone; historical pipeline is archived rather than maintained.
**Follow-up:** M13 acceptance, then M14 data-quality pass on `EdgeDeliveryServices` / `Forms`.
**Supersedes scheduling in:** DR-016 (EDS/Forms milestone number only).

## DR-016 — Defer EDS and AEM Forms filters to Milestone 13

**Date:** 2026-07-08
**Context:** M11 product UI removed **Hiring AEM** and **Verified** quick filters because `data/companies.json` is
hire-verified AEM-only (M8 gate). Company records already carry `EdgeDeliveryServices` and `Forms` booleans per
`11_COMPANY_SCHEMA.md`, but filter UI was not needed for launch.
**Decision:** Add **Milestone 13 — Company capability filters** after Publishing (M12). Ship EDS and AEM Forms filter
chips, URL state, and search facet wiring in M13 — not during M11 acceptance or M12.
**Trade-off accepted:** Users cannot filter by EDS/Forms until M13; avoids scope creep while M11/M12 close out.
**Follow-up:** **Superseded for scheduling by DR-017** — capability filters are Milestone 14; M13 is loader + cleanup.
**Status:** Superseded (milestone number) by DR-017.

## DR-015 — Presentation polish without a build step (Milestone 11)

**Date:** 2026-07-07
**Context:** Post–M11 browser review surfaced duplicate pagination, native dropdown styling, text-only icon actions,
and inconsistent dark-mode tokens. Phases A–E aimed for GitBook/MS Learn–grade presentation while keeping vanilla JS
and GitHub Pages compatibility.
**Decision:** Add `assets/js/icons.js` (inline Lucide-style SVG helper), `assets/js/ui.js` (theme via `data-theme`,
custom `UI.select`, scroll-spy, command palette), and a token-driven `assets/css/site.css` layout (~1700px max width).
Company discovery uses a unified `.company-explorer` card, **10 rows/page** with padded tbody for stable height, and
custom selects instead of native `<select>` for filter dropdowns. Favicon at `assets/icons/favicon.svg`.
**Trade-off accepted:** More bespoke CSS/JS to maintain; no icon font or component framework. Glossary/interview tables
keep 25 rows/page (company table only uses 10).
**Follow-up:** Complete — Milestone 11 accepted 2026-07-08; Milestone 12 (Publishing) is next.

## DR-014 — Product vs dev visibility split (Milestone 11)

**Date:** 2026-07-07
**Context:** Milestone 11 ships a jobs-first public UI while the owner still needs the full handbook (Project Status,
Mission, version label, all chapters) for maintenance.
**Decision:** `data/site.json` field `mode: "product" | "dev"` controls visibility. Default **product** hides dev-only
chapters (`navigation.devOnlyChapterIds`), Project Status dashboard, version label, and roadmap panels above companies.
Append **`?mode=dev`** to the URL to restore the full handbook without a separate deployment. Custom layout/CSS in
`assets/css/site.css` supplements Tailwind; no build step.
**Trade-off accepted:** Two experiences share one `index.html`; chapter section anchors use stable `chapter.id` values
instead of `#ch0`…`#chN` (search index updated accordingly).
**Follow-up:** Complete — Milestone 11 accepted 2026-07-08.

## DR-013 — Shareable discovery filter URLs use query params (Milestone 9)

**Date:** 2026-07-07
**Context:** Milestone 9 adds shareable filter state for company table and search-panel facets. Chapter navigation
already uses `#ch0` hash anchors.
**Decision:** Serialize filter state as **query parameters** (`cf_type`, `cf_industry`, `cf_migration`, `cf_q`,
`cf_sort`, boolean flags `cf_india`/`cf_aem`/`cf_cloud`/`cf_verified`, search-only `sf_source`, global search `q`).
Use `history.replaceState` on filter changes — no full page reload. Hash reserved for in-page anchors only.
**Trade-off accepted:** URLs are longer than a single hash blob; params are human-readable and GitHub Pages compatible.
**Follow-up:** `CompanyFilters.parseUrlState` / `serializeUrlState` in `assets/js/filters.js`; browser steps in
`17_TESTING_GUIDE.md` Milestone 9.

## DR-009 — Resequence Milestones 8–12: product before publish

**Date:** Post–Milestone 7 planning
**Context:** Owner requested company pipeline, filters, owner playbook, and minimal product UI **before** GitHub
Pages / publishing. Original plan had Publishing as Milestone 8.
**Decision:** New order: **8** Company Pipeline & Hiring Gate → **9** Discovery Filters → **10** Owner Playbook →
**11** Minimal Product UI → **12** Publishing. Publish only after hire-focused data, filters, owner content, and
jobs-first mobile UI are in place.
**Trade-off accepted:** No public URL until Milestone 12; local serve remains the dev workflow until then.
**Follow-up:** Update `21_PUBLISHING.md` and `15_RELEASE_PROCESS.md` milestone references.

## DR-010 — Milestone 8 expanded: fresh research, no cap, table filters

**Date:** Milestone 8 planning (post–M7)
**Context:** Owner wants the fullest hire-verified company list possible, fresh evidence (not md copy-paste), India-first
priority, client-side filter/sort on the company table, and curated BuiltWith-style domain seeds (no paid API).
**Decision:** Expand Milestone 8 to include: (1) fresh research workflow with `md/` reference-only; (2) no row-count cap;
(3) `assets/js/filters.js` + company table filter/sort (folded from planned M9 table work); (4) curated domain-map
manifest (paid BuiltWith API removed per DR-012); (5) `LastHiringVerified` on schema. Milestone 9 retains search-panel facets and shareable
filter URLs only.
**Trade-off accepted:** M8 is larger and research-heavy; M9 scope reduced accordingly.
**Follow-up:** Implement per `14_ROADMAP.md` Milestone 8 section.

---

## DR-012 — No paid BuiltWith API (accepted — Milestone 8, owner-directed)

**Date:** 2026-07-07
**Context:** Owner will not purchase BuiltWith Lists API subscription.
**Decision:** Remove `scripts/builtwith-api.js` and all `BUILTWITH_API_KEY` / Lists API ingest paths. Keep curated
`data/company-sources.json` seed list and optional public `builtwith.com/{domain}` reference URLs in `Evidence` (manual
lookup only). Grow the company list via fresh research and expanding the domain map — not bulk API ingest.
**Trade-off accepted:** No automated discovery of thousands of AEM domains; seed map remains maintainable by hand.
**Supersedes (partial):** DR-010 item (4) optional paid API adapter; DR-011 API manifest merge path.
**Follow-up:** Archive `data/manifests/builtwith-input.json` config; seed-only `ingest-builtwith-candidates.js`.

## DR-011 — BuiltWith watchlist promotion (accepted — Milestone 8, owner-directed)

**Date:** 2026-07-07
**Context:** Owner noted many AEM employers are missed when requiring Tier 1–2 Adobe evidence only; service firms
have hundreds of AEM clients; product employers often hire AEM talent in low capacity but still offer viable roles.
BuiltWith Lists API can surface thousands of AEM CMS domains.
**Decision:** Add a **watchlist promotion path** alongside DR-008: rows may enter `companies.json` when (1) BuiltWith
or equivalent Tier-4 tech detection is recorded in `Evidence` with explicit tier labelling in `Notes`, (2) an official
`careersUrl` exists, and (3) `HiringIntensity` is `Low` (or `Medium` when Tier-2 evidence is also present). Tier-4-only
rows remain `Status: Verified` but must not be presented as Adobe case-study confirmed — upgrade `Evidence` when
Tier 1–2 is found. Curated seeds live in `data/company-sources.json` and `data/manifests/builtwith-candidates.json`
(paid API removed per DR-012).
**Trade-off accepted:** Larger public list with more inference-labelled rows; user filters by `HiringIntensity` to
separate steady vs sporadic employers.
**Supersedes (partial):** DR-008 “Tier 4 never sufficient for `usesAEM`” for **promotion** only — Tier 4 + careers is
now sufficient at Low intensity. DR-008 archive rules unchanged for rows without careers/hiring URLs.
**Follow-up:** `data/company-sources.json`, `scripts/company-records.js`, `ingest-builtwith-candidates.js`,
`scripts/build-companies.js`, `07_RESEARCH_GUIDE.md`.

## DR-008 — Company hiring gate + BuiltWith ingest (accepted — Milestone 8)

**Date:** Milestone 8 planning
**Context:** Owner wants hire-focused employers only; BuiltWith and similar sources are candidate ingest, not proof.
**Decision:** Ingest BuiltWith into review manifests only. Promote to `companies.json` when AEM usage is Tier 1–2 and
`HiringAEM` is true with `AEMHiringEvidence` URL(s). Non-hiring rows archived to `data/manifests/company-candidates.json`.
**Trade-off accepted:** Smaller public list than raw tech-detect lists; manual verification per promotion.
**Follow-up:** `scripts/hiring-gate.js`, `verify-companies.js`, `11_COMPANY_SCHEMA.md`.

## DR-007 — Milestone 7 learning content defaults

**Date:** Milestone 7 (start)
**Context:** Milestone 7 open questions (content minimums, roadmap titles, new chapters, templates tone, field
rename) were scoped with default proposals. The project owner directed work to start on Milestone 7.
**Decision:** Adopt scoped defaults: minimum counts (30 glossary, 15 technologies, 2 career paths, 20 interviews,
5 templates, 10 resources, 3 roadmaps); roadmap ids `aem-foundation`, `cloud-eds`, `experience-platform`; add
`glossary` and `interview-prep` chapters; generic templates only; defer `reading` → `readingTime` rename.
**Trade-off accepted:** Content is seed-quality reference material (official-doc sourced) — expandable in later
milestones without schema changes.
**Follow-up:** None open unless the owner overrides minimums or roadmap split.

## DR-006 — Milestone 6 verification defaults (25 verified, 100-row cap, pagination 25)

**Date:** Milestone 6 (start)
**Context:** Milestone 6 open questions (verified minimum, unverified ingest cap, pagination size) were scoped with
default proposals. The project owner accepted Milestone 5 and directed work to proceed to Milestone 6 without
explicitly re-stating each default.
**Decision:** Adopt the scoped defaults: (1) acceptance requires **25 `Status: "Verified"`** companies with
`Evidence` and `LastVerified`; (2) additional candidates may be ingested as `Status: "Unverified"` up to **100
total rows** in `data/companies.json`; (3) company table pagination at **25 rows per page**.
**Trade-off accepted:** Verification work is front-loaded into Milestone 6 and may span multiple sessions; unverified
rows are visible in search/table but clearly marked and never `usesAEM: true` without evidence.
**Follow-up:** None open unless the owner overrides any of the three numbers.

## DR-005 — Accept that local viewing requires a server once Milestone 3 introduces `fetch()`

**Date:** Milestone 3
**Context:** Milestone 3 moves `PLAYBOOK.chapters`/`PLAYBOOK.companies` into `data/*.json`, fetched via
`fetch()` at load time. Browsers block `fetch()` against `file://` URLs under their default CORS policy, which
means `index.html` can no longer be viewed by double-clicking it locally — it must be served over HTTP (any static
server: `npx serve`, `python -m http.server`, the VS Code/Cursor Live Preview extension already configured in this
repo's `.vscode/settings.json`, etc.). This changes a workflow that has been true since the project's first commit.
**Decision:** Accept the trade-off rather than avoid it (e.g. via a `data/chapters.js` global-variable wrapper
instead of `.json` + `fetch()`), because `MASTER_BOOTSTRAP_PROMPT.md` explicitly mandates JSON as the primary data
source, and because the deployed site (GitHub Pages) is entirely unaffected — this only changes local development,
not production. `17_TESTING_GUIDE.md`'s smoke test is updated accordingly.
**Trade-off accepted:** Contributors must run one command (or use an editor's built-in live-preview feature) before
viewing local changes, instead of double-clicking `index.html`. In exchange, the data layer conforms to the
constitution's explicit JSON mandate and unlocks the same `fetch()`-based pattern for every future data file
(`technologies.json`, `roadmaps.json`, etc. in later milestones).
**Follow-up:** None open. Flagged to and accepted by the project owner before implementation began.

## DR-004 — Restructure `.playbook/` for AI token efficiency: merge core docs, archive roadmap history, add Cursor rules

**Date:** Post-Milestone-2
**Context:** Measuring every `.playbook/` file directly showed the 26 governance documents total ~28,000 tokens,
and `.github/copilot-instructions.md` mandated reading 7 of them in full (`MASTER_BOOTSTRAP_PROMPT.md`,
`01_AI_CONSTITUTION.md`, `02_PROJECT_MEMORY.md`, `03_ARCHITECTURE.md`, `09_DATA_MODEL.md`, `14_ROADMAP.md`,
`19_CURRENT_SPRINT.md`) before *any* change, regardless of relevance — roughly 10,000 tokens paid on every session
even for a trivial, unrelated task. `14_ROADMAP.md` alone had grown to ~3,400 tokens by keeping full historical
detail for every completed milestone forever.
**Decision:**
1. Merge `00_PROJECT_OVERVIEW.md`, `01_AI_CONSTITUTION.md`, and `02_PROJECT_MEMORY.md` into one file
   (`00_PROJECT_OVERVIEW.md`), deduplicating overlapping content. The other two are kept as short pointer stubs
   (not deleted) so every existing cross-reference across `.playbook/` continues to resolve.
2. Move completed milestones' full Goal/Scope/Estimates/Acceptance-Criteria/Definition-of-Done/review detail out of
   `14_ROADMAP.md` into a new `25_ROADMAP_ARCHIVE.md`. The active roadmap keeps only the milestone sequence table
   and a short summary + link per completed milestone.
3. Add `.cursor/rules/` (`constitution.mdc`, `current-state.mdc` — both `alwaysApply: true` — plus
   `coding-standard.mdc`, `architecture.mdc`, `company-data.mdc`, `editorial-style.mdc`, each scoped with `globs:`
   to only auto-attach when relevant files are open) so Cursor sessions get the right context automatically instead
   of a manual "read these N files" instruction.
4. Update `.github/copilot-instructions.md` to reflect the new structure and note that Cursor users get most of
   this automatically via rules.
**Trade-off accepted:** An extra indirection (stub files, an archive file) to navigate for anyone specifically
looking for the old `01_AI_CONSTITUTION.md`/`02_PROJECT_MEMORY.md` files or historical milestone detail, in
exchange for an estimated ~68% reduction in the token cost paid on every session (~10,000 → ~3,200 tokens for a
typical code-touching task, less for anything that doesn't touch code).
**Follow-up:** None open. No information was deleted — this is pure reorganization; full historical and
constitutional content still exists, just relocated and no longer force-read by default.

## DR-003 — Split Milestone 2 into a smaller "Render Function Extraction" step, deferring data migration to Milestone 3

**Date:** Post-Milestone-1 (pre-Milestone-2 planning)
**Context:** A Lead-Architect PR review of Milestone 1 found that the roadmap's original Milestone 2 description
("split `index.html`'s inline `PLAYBOOK` object and rendering loop into: a thin HTML shell, a `data/` fetch layer,
and named render functions") bundled two independently-testable concerns — extracting render functions, and
migrating data to `data/*.json` with `fetch()` — into a single milestone. It also silently overlapped with
Milestone 4 ("Renderer — implement the named render functions"), already planned as a separate, later step.
Combining both concerns violates the roadmap's own "one responsibility at a time" principle and the "small,
independently testable, reversible" requirement given for Milestone 2 specifically.
**Decision:** Narrow Milestone 2 to render-function extraction only: `renderSidebar`, `renderChapter`, and
`renderCompanyTable` are extracted as named, pure functions operating on `PLAYBOOK.chapters` / `PLAYBOOK.companies`
exactly where that data already lives in `index.html`. No data migration, no `fetch()`, no loading states in this
milestone — those move to Milestone 3 (Data Model), which now also absorbs the "move data out of `index.html`" work
previously implied by Milestone 2. Milestone 4 (Renderer) is narrowed in turn to extending the render-function set
to content types that don't exist in the UI yet (hero, roadmap, dashboard, footer, search), once Milestone 3 gives
them a data source.
**Trade-off accepted:** One more milestone-sequencing update to keep synchronized across `14_ROADMAP.md`,
`03_ARCHITECTURE.md`, and `10_COMPONENT_LIBRARY.md`, in exchange for a Milestone 2 that is genuinely small, has one
objective pass/fail test (byte-identical rendered output), and is trivially revertible (one file, one `<script>`
block, no data changes).
**Follow-up:** None open — `14_ROADMAP.md`, `03_ARCHITECTURE.md`, and `10_COMPONENT_LIBRARY.md` were updated in the
same pass that introduced this decision record.

## DR-002 — Recover from the Milestone 1 repository-integrity incident by rewriting, not restoring, the stub docs

**Date:** Milestone 1
**Context:** An Architecture Review found that all 20 committed `.playbook/00–19` files and
`.github/copilot-instructions.md` were missing from the working tree, while still present as one-line stubs in git
history (48–197 bytes each). Five newer, never-committed docs (`20`–`24`) were also missing. No delete command had
been run by the reviewing session; `.git/refs/codex/...` checkpoint refs indicate a separate AI coding session had
operated on this repository.
**Decision:** Do not `git checkout` the old stub content back from history. The stubs were themselves a violation
of the "publication quality, not placeholders" rule, so restoring them would restore a known problem. Instead,
Milestone 1 writes real, complete content for all 25 documents from scratch, using `MASTER_BOOTSTRAP_PROMPT.md` as
the source spec.
**Trade-off accepted:** Slightly more up-front writing effort in Milestone 1, in exchange for never having placeholder
documentation checked in again.
**Follow-up:** Confirm with the project owner whether another agent session/window was concurrently open on this
repository, and avoid running two sessions against the same working tree going forward (see `02_PROJECT_MEMORY.md`).

## DR-001 — Adopt milestone-based delivery instead of a flat task backlog

**Date:** Milestone 1
**Context:** `MASTER_BOOTSTRAP_PROMPT.md` requires an implementation roadmap split into independently testable
milestones, implemented one at a time, only after roadmap approval.
**Decision:** Roadmap recorded in `14_ROADMAP.md` with 8 milestones (Repository Foundation → Publishing). Each
milestone lists explicit in-scope and out-of-scope items and acceptance criteria before implementation starts.
**Trade-off accepted:** Slower to reach visible feature work, in exchange for avoiding the duplicated/contradictory
state that a flat backlog already produced once in this repository's short history.

---

## Template for new entries

```
## DR-00N — <short decision title>

**Date:** <milestone or date>
**Context:** <what prompted this decision>
**Decision:** <what was decided>
**Trade-off accepted:** <what was given up>
**Follow-up:** <any open action items, optional>
```
