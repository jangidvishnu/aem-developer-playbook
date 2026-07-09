# Testing Guide

## Current state

`npm run verify` (Node, no dependencies) runs on every commit locally and in CI (`.github/workflows/ci.yml` →
`Verify scripts` job) — it is required to pass before merge once branch protection is configured (see `README.md`
→ Maintainers). It chains:

- `scripts/verify-render.js` — chapter/sidebar regression vs. Milestone 3 golden snapshot.
- `scripts/verify-search.js` — ranked search assertions over real `data/*.json` (Milestone 5+).
- `scripts/verify-filters.js` — company filter/sort/URL-state logic (Milestone 9).
- `scripts/verify-owner-playbook.js` — owner playbook schema (Milestone 10).
- `scripts/verify-companies.js` — `data/companies.json` schema + hiring gate (Milestone 6/13).
- `scripts/verify-learning.js` — learning data schema and minimum counts (Milestone 7).
- `scripts/verify-prerender.js` — regenerates prerendered `index.html`/`sitemap.xml`/`robots.txt` in memory and
  byte-compares against what's committed, failing if `data/*.json` changed without re-running `npm run prerender`
  (Milestone 14, DR-022).

`npm run ui-smoke` (Playwright, dev-time only) is a separate CI job (`UI smoke (Playwright search)`) that drives a
real headless browser against the search box, the Target Companies filter bar, search-then-filter, sortable column
headers, and pagination Prev/Next — not just static layout — so a wiring regression (e.g. a filter input that stops
updating the table) fails CI instead of only failing in the browser. Run it locally after any change to
`assets/js/app.js`'s company wiring or `assets/js/render.js`'s company markup.

`npm run lint` (ESLint + Prettier, Milestone 13, DR-021) runs as a step in the same CI `Verify scripts` job, and
locally via the pre-commit hook (`scripts/git-hooks/pre-commit`, installed by `npm install`). Requires `npm install`
once to fetch the ESLint/Prettier devDependencies. `npm run format` auto-fixes Prettier-only issues.

Run the full `npm run verify` after changes to `assets/js/render.js`, `assets/js/search.js`, `assets/js/filters.js`,
`assets/js/app.js`, `assets/js/ui.js`, or any `data/*.json`.

## Milestone test plans

When a milestone's implementation is complete and pending acceptance, a **milestone-specific test plan** must exist
here (required by `15_RELEASE_PROCESS.md`). Each subsection lists automated commands and a browser checklist the
project owner can run without reading the code. `19_CURRENT_SPRINT.md` links to the active milestone's subsection.

After acceptance, a short "Test plan" summary is archived in `25_ROADMAP_ARCHIVE.md`; this subsection stays as the
historical record of exact steps used.

### Baseline (run for every milestone acceptance)

Serve `index.html` over HTTP — `file://` will not load `data/*.json` (see `12_DECISIONS.md` DR-005).

**Serve options (use any one):**

- Cursor / VS Code **Live Preview** (configured in this repo's `.vscode/settings.json`)
- `npx serve` then open the URL shown
- `python -m http.server 3456` then `http://localhost:3456`
- One-line Node server: `node -e "require('http').createServer((q,r)=>{const f=require('fs'),p=require('path');let u=q.url==='/'?'/index.html':q.url;f.readFile(p.join('.',u.split('?')[0]),(e,d)=>{r.writeHead(e?404:200);r.end(e?'404':d);});}).listen(3456,()=>console.log('http://localhost:3456'))"`

**Baseline browser checks:**

1. Page loads with no console errors; chapters, hero, and sidebar render.
2. Dark mode toggles and persists after reload.
3. Print preview hides header, sidebar, search, and footer; sections do not break awkwardly.
4. Tab through search, theme toggle, TOC links, and `<details>` — focus visible on each.

---

### Milestone 5 — Search (accepted)

**Automated (run from repository root):**

```bash
node scripts/verify-search.js
node scripts/verify-render.js
```

Expected: `All search tests passed.` and `Chapter/sidebar output matches the Milestone 3 golden snapshot.` — both
exit code 0.

**Browser — search-specific:**

1. Open the served site. Confirm the search placeholder reads **Search playbook…**.
2. Type **`Adobe`** — results panel opens; top result is **Company · Adobe**; other chapters remain visible.
3. Press **Enter** (or click the result) — page scrolls to **Target Companies**; brief blue highlight on section.
4. Clear search. Type **`mission`** — **Chapter · Mission** is top result; **all chapter sections remain visible**
   in `<main>` (search does not hide page content).
5. Clear search — results panel hidden; page content unchanged.
6. Type **`Welcome`** — **Site · Welcome** result; activating scrolls to the hero banner.
7. Type **`AEM foundation`** — **Roadmap** result for the learning-path panel.
8. With results open: **Arrow Down** / **Arrow Up** changes the highlighted row; **Enter** activates and
   **closes** the panel; **Escape** or the **×** clear button clears the query.
9. Click outside the search box — results panel closes (query text remains until cleared).
10. Confirm results list follows **page order** (hero → roadmap → chapters top-to-bottom) when multiple sections match.
11. Re-run baseline checks 2–4 above (dark mode, print, keyboard tab order).

**Sign-off:** Accepted by project owner (`58644a9`). See `25_ROADMAP_ARCHIVE.md`.

---

### Milestone 6 — Company Intelligence Database (accepted)

**Automated (run from repository root):**

```bash
node scripts/verify-companies.js
node scripts/verify-search.js
node scripts/verify-render.js
```

Expected: schema validation passes; search and render scripts exit 0.
_(Historical note: optional `build-companies-m6.js` lived under `scripts/` and is now in `archive/scripts/`.)_

**Browser — company table and pagination:**

1. Serve the site over HTTP and open the home page with no console errors.
2. Scroll to **Target Companies** — table shows **Status** column; **Adobe** and **Cisco** appear as Verified.
3. With 40+ rows, confirm **pagination** controls appear (25 rows per page); **Next** loads page 2 without full-page reload hang.
4. Search **`HDFC`** or **`Spark`** — company results appear; activating scrolls to the company table section.
5. Search **`Philips`** — Verified company with AEM evidence in data.
6. Re-run baseline smoke checks (dark mode, print preview, keyboard tab to search).

**Sign-off:** Accepted by project owner after browser verification. See `25_ROADMAP_ARCHIVE.md`.

---

### Milestone 7 — Learning System (pending acceptance)

**Automated (run from repository root):**

```bash
node scripts/build-learning-m7.js   # optional — regenerates learning JSON from seeds
node scripts/verify-learning.js
node scripts/verify-search.js
node scripts/verify-render.js
node scripts/verify-companies.js
```

Expected: `All learning records pass schema validation and minimum counts.` and all other scripts exit 0.

**Browser — learning embeds:**

1. Serve at `http://localhost:3456` (or similar) — no console errors; **three roadmap panels** appear below the hero.
2. **Core Skills** — technology table with 15 rows (AEM Sites, HTL, Dispatcher, etc.).
3. **Career Strategy** — two career path cards (IC engineer + architect tracks).
4. **Professional Branding** — five template cards (resume, STAR, LinkedIn, outreach).
5. **Glossary** — 30 terms; page 2 pagination if visible; **Interview Prep** — 20 questions table.
6. **Living Roadmap** — curated Adobe documentation links list.
7. Search **`HTL`** → Glossary result; **`behavioral`** → Interview result; **`cloud-eds`** → scrolls to second roadmap panel.
8. Re-run baseline smoke checks (dark mode, print, search keyboard nav).

**Sign-off:** Accepted by project owner. See `25_ROADMAP_ARCHIVE.md`.

---

### Milestone 8 — Company Pipeline (accepted)

**Automated (run from repository root):**

```bash
node scripts/verify-companies.js
node scripts/verify-filters.js
node scripts/verify-search.js
node scripts/verify-render.js
node scripts/verify-learning.js
```

Expected: hire-verified companies validate; all scripts exit 0.
_(Historical note: `build-companies.js` is archived under `archive/scripts/` per DR-017.)_

**Browser — company filters and hiring columns:**

1. Serve at `http://localhost:3456` — **Target Companies** shows filter bar (type, sort, India hiring, AEM cloud).
2. Select **Agency** — Accenture, Cognizant appear; count updates ("N of M companies shown").
3. Table columns include **Hiring** and **Intensity**; **Careers** and **AEM Jobs** links open in new tab.
4. Search **`Accenture`** — company result; sections remain visible while typing.
5. Re-run baseline smoke checks.

**Sign-off:** Accepted by project owner. See `25_ROADMAP_ARCHIVE.md`.

---

### Milestone 9 — Discovery Filters (pending acceptance)

**Automated (run from repository root):**

```bash
node scripts/verify-filters.js
node scripts/verify-search.js
node scripts/verify-render.js
node scripts/verify-companies.js
node scripts/verify-learning.js
```

Expected: all scripts exit 0; filter tests include industry, migration band, URL round-trip, and search facet intersection.

**Browser — search facets and shareable URLs:**

1. Serve at `http://localhost:3456`.
2. **Target Companies** — confirm **Industry** and **Migration** dropdowns appear beside Type and Sort.
3. Select **Industry: Finance** — table count updates; only Finance employers remain.
4. Open search, type **`bank`** — results panel shows facet chips (All / Companies / Chapters / Learning).
5. Click **Companies** — non-company results hidden; status may read "N of M results".
6. Change table filter to **Type: Agency** while search is open — search results re-filter; facet hint shows active table filters.
7. Copy URL after filtering (e.g. `?cf_type=Agency&cf_industry=Finance&q=bank`) — open in new tab; table and search restore state.
8. Click **Copy link** on the company filter bar or in the search panel — confirm **Copied!** appears; paste URL restores the same view.
9. Re-run baseline smoke checks (keyboard nav, dark mode, print preview).

**Sign-off:** Accepted by project owner. See `25_ROADMAP_ARCHIVE.md`.

---

### Milestone 10 — Owner Playbook (accepted)

**Automated (run from repository root):**

```bash
node scripts/verify-owner-playbook.js
node scripts/verify-filters.js
node scripts/verify-search.js
node scripts/verify-render.js
node scripts/verify-companies.js
node scripts/verify-learning.js
```

Expected: owner playbook validation passes (5 sections, `how-i-apply` embed); search finds `outreach` as owner source.

**Browser — How I Apply chapter:**

1. Serve at `http://localhost:3456`.
2. Sidebar — **How I Apply** appears after **Target Companies**.
3. Chapter shows five sections with **Owner** badges and numbered steps.
4. Search **`outreach`** — **Apply · Outreach** result; activates scroll to How I Apply chapter.
5. Search facet **Apply** — narrows to owner sections only.
6. Re-run baseline smoke checks.

**Sign-off:** Accepted by project owner. See `25_ROADMAP_ARCHIVE.md`.

---

### Milestone 11 — Minimal Product UI (accepted)

**Automated (run from repository root):**

```bash
node scripts/verify-render.js
node scripts/verify-search.js
node scripts/verify-filters.js
node scripts/verify-owner-playbook.js
```

Expected: all exit code 0.

**Optional — automated UI smoke (Playwright, dev-time only):**

One-time setup:

```bash
npm install
npx playwright install chromium
```

Run (starts a local server, tests desktop search, then stops):

```bash
npm run ui-smoke
```

Expected: `run-ui-smoke: PASS` and `UI smoke search: PASS (Adobe + AEM with All filter)`.

With the site already running on port 3456:

```bash
npx serve -p 3456
# other terminal:
node scripts/ui-smoke-search.mjs
```

CI runs the same checks on push/PR via `.github/workflows/ci.yml` (`verify` + `ui-smoke` jobs).

**Browser — product mode (default):**

1. Serve at `http://localhost:3456` (no `?mode=dev`).
2. Favicon appears in tab; view source — `meta description`, `og:title`, `theme-color` present.
3. Hero shows stat cards, **Browse companies** and **How I apply** CTAs — no version label in header.
4. Sidebar — grouped nav (**Target Companies** first, **How I Apply** second); scroll a chapter — active link highlights.
5. Target Companies — unified explorer card (metrics + filters + table in one panel); **one** Prev/Next pagination bar.
6. Table shows **10 rows** (or fewer + empty pad rows); height stable when paging.
7. Custom dropdowns for Sort / Type / Industry / Migration — not native OS selects; keyboard operable.
8. Dark mode toggle — surfaces, table, and explorer readable; reload persists theme.
9. Copy-link icon on filters — paste in new tab; filters restore.
10. Resize to ~375px — hamburger nav; search in header second row (not colliding with title); company **cards** replace table.
11. **Data disclaimer** — slim banner below header states research-based data is not guaranteed; mentions pull requests.
12. **How I Apply** — sticky section nav; numbered steps without “Method 1/3/5” prefixes; no Owner badges.
13. **Ctrl+K** (Cmd+K on Mac) — command palette opens; search **`outreach`** scrolls to How I Apply.
14. Search **`researched AEM employers`** — scrolls to hero; **`Adobe`** with **All** selected shows company results (not **Apply** alone for short queries like `ad`).

**Browser — dev mode:**

15. Open `?mode=dev` — version label, Project Status, Mission, Living Roadmap, roadmap step status labels return.

**Accessibility spot-check:**

16. Tab to hamburger, filter chips, custom selects, card Careers buttons, command palette — visible focus.
17. Filter count updates announced (`aria-live` on company count).

**Sign-off:** Accepted by project owner (2026-07-08) after browser verification. See `25_ROADMAP_ARCHIVE.md`.

---

### Milestone 12 — Publishing (accepted)

**Live site:** https://jangidvishnu.github.io/aem-developer-playbook/

**Automated:** `npm run verify` (and optionally `npm run ui-smoke`).

**Browser:**

1. Live URL loads product mode (hero, companies, How to Apply) over HTTPS.
2. Relative assets and `data/*.json` load under the Pages subpath.
3. Shareable `?cf_*` filter links restore state.

**Deferred by owner:** Print/PDF polish beyond the basic `@media print` rules.

**Sign-off:** Accepted 2026-07-08 (Pages live; print deferred). See `25_ROADMAP_ARCHIVE.md`.

---

### Milestone 13 — Loader + Repo Cleanup + Audit Remediation (accepted 2026-07-08)

**Automated (run from repository root):**

```bash
npm install
npm run verify
npm run lint
npm run ui-smoke
```

Expected: verify scripts exit 0 (includes companies + learning data); lint reports no ESLint errors and "All
matched files use Prettier code style!"; ui-smoke PASS — including the search-filters-the-table,
focus-stays-in-search-box, pagination-changes-visible-rows, and sortable-Company-header checks — and the process exits.

**Browser:**

1. Serve at `http://localhost:3456` (or Live Preview over HTTP). Hard-refresh.
2. First paint shows branded **page loader** (title + progress bar + “Loading playbook…”) — not plain “Loading content…”.
3. After data loads, hero / Target Companies / How to Apply render normally.
4. Confirm only `data/companies.json` exists under `data/` for companies (no `company-sources` / `manifests`).
5. Confirm `archive/` contains research MD + archived company pipeline files (`archive/README.md`).
6. Optional dark-mode check: loader readable in both themes (brief flash) and content OK after load.
7. **Sortable headers:** click **Company** — rows re-sort A→Z, header shows an up arrow; click again — Z→A, down
   arrow; click **Priority** / **Type** / **India** — each re-sorts by that column; the **Sort** dropdown's
   displayed value updates to match whichever header was last clicked.
8. **Debounced search:** type quickly into the Target Companies search box — focus stays in the box the whole time
   (no flicker/blur), and the table updates shortly after you stop typing (not on every keystroke).

**Regression:**

9. Search still finds Adobe; filters still work; `?mode=dev` still restores handbook chrome.
10. `npm run lint` passes with zero errors (pre-existing files were reformatted once during this milestone to
    establish the baseline — see `13_CHANGELOG.md`).

**Sign-off:** Accepted by project owner 2026-07-08 (together with Milestone 14). See `25_ROADMAP_ARCHIVE.md`.

---

### Milestone 14 — SEO Prerendering (accepted 2026-07-08)

**Automated (run from repository root):**

```bash
npm run prerender
npm run verify
npm run lint
npm run ui-smoke
```

Expected: `npm run prerender` reports the three files it wrote; the immediately following `npm run verify` reports
`OK` (not `STALE`) for `index.html`, `sitemap.xml`, and `robots.txt`, proving the commit is up to date. `npm run
lint` and `npm run ui-smoke` pass.

**Staleness check (proves the guard actually works — run once, then revert):**

```bash
# Temporarily edit any value in data/companies.json (e.g. a company name), then:
npm run verify
# Expect: "STALE: index.html does not match..." with a first-differing-character diff, exit code 1.
# Revert the edit (or run `npm run prerender` then `git checkout -- data/companies.json` if you'd already baked it):
git checkout -- data/companies.json index.html sitemap.xml robots.txt
npm run verify   # back to all-OK
```

**Browser / view-source — no-JS content check:**

1. Serve at `http://localhost:3456`. **View source** (not DevTools Elements, which shows the post-JS DOM) — confirm
   `<main>` already contains the hero, the full Target Companies table (real company rows, not an empty
   `<div id="company-table-container">`), the How to Apply steps, and every learning chapter's content.
2. Confirm `<head>` contains a `<link rel="canonical" href="https://jangidvishnu.github.io/aem-developer-playbook/">`
   and a `<script type="application/ld+json" id="site-json-ld">` with the site name/description.
3. Disable JavaScript (or use a plain `curl http://localhost:3456/` / `curl` the live URL) — confirm the same real
   content is present in the raw HTML response, not just in a browser's live DOM.
4. Re-enable JavaScript, hard-refresh — confirm the real content is visible **immediately** with no loading-card
   flash (see DR-023: the loader is only shown when prerendered markup is absent), then search/filter/sort/
   pagination on Target Companies all work normally (the client re-render replaces the prerendered content with an
   identical-looking, fully interactive version).
5. Open `sitemap.xml` and `robots.txt` directly in the browser — confirm both list the live site URL.

**Regression:**

6. Re-run Milestone 13's browser checklist (sortable headers, debounced search) — unaffected by this milestone.

**Sign-off:** Accepted by project owner 2026-07-08 (together with Milestone 13). See `25_ROADMAP_ARCHIVE.md`.

---

### Milestone 14 follow-up — Lighthouse-driven fixes (DR-023)

**Automated:** same `npm run prerender && npm run verify && npm run lint && npm run ui-smoke` chain as above — all
must pass (re-run `npm run prerender` first since `role="searchbox"` → `role="combobox"` changed the baked search
markup).

**Browser checks:**

1. Hard-refresh the live site with DevTools Performance/Lighthouse panel open (or re-run Lighthouse). Confirm no
   visible "shrink then grow" flash on load — the page should look the same immediately after CSS loads as it does
   once JS finishes.
2. View source (or inspect): the search `<input>` should have `role="combobox"` (not `searchbox`), still with
   `aria-controls`, `aria-expanded`, and `aria-autocomplete="list"`.
3. Inspect a table header (e.g. "Technology" in Core Skills) or a hero stat label (e.g. "AEM employers") — text
   should read clearly against its background in both light and dark theme (toggle via the theme button).
4. Slow 3G throttle + disable cache in DevTools, hard-refresh: page text may render in the system font briefly
   before Inter loads (or may stay in the system font for that load — `display=optional`), but should **not**
   visibly reflow/jump once Inter does load.
5. Network panel: confirm the six `assets/js/*.js` requests show as non-render-blocking (Chrome DevTools' "Coverage"
   or the Lighthouse render-blocking-resources audit should no longer list them).

**Sign-off:** Accepted with Milestone 14 on 2026-07-08. Optional: re-run Lighthouse after this follow-up ships to confirm CLS/a11y scores.

---

## Manual smoke test (baseline — always run after structural change)

1. **Serve the site over HTTP** (e.g. `npx serve`, `python -m http.server`, or an editor's Live Preview) and open
   `index.html` — confirm it renders with no console errors. As of Milestone 3, opening the file directly via
   `file://` will fail: browsers block `fetch()` against local files, so `data/chapters.json`/`data/companies.json`
   won't load and the error state (`20_ACCESSIBILITY.md`) will show instead — see `12_DECISIONS.md` DR-005.
2. Toggle dark mode — confirm it persists after a page reload.
3. Type into the search box — confirm ranked results appear (e.g. "Adobe" → company), all page sections stay
   visible while typing, Arrow/Enter/Escape work, and clearing closes the results panel.
4. Use the browser's print preview — confirm the header, sidebar, search box, and theme toggle are hidden, and
   sections don't break awkwardly across page boundaries.
5. Resize the viewport to a typical mobile width — confirm the layout remains usable (this is a known gap; see
   `08_UI_GUIDELINES.md` — treat regressions as blocking even though the current baseline is imperfect).
6. Tab through the page with only the keyboard — confirm every interactive element (search, theme toggle, links,
   `<details>` summaries) is reachable and its focus state is visible.

## Content verification (for data/company changes)

- Confirm every new/changed company entry has the sourcing required by `07_RESEARCH_GUIDE.md`.
- Confirm no duplicate `id`/`slug` was introduced.
- Confirm cross-links (`relatedChapters`, etc.) resolve to entries that actually exist.

## Target automated testing (once render functions move to assets/js/)

Once render functions are extracted into `assets/js/`, they can be tested with a minimal, dependency-light approach
(e.g. Node's built-in test runner against exported functions) without violating the "no build step" rule for the
shipped site — test tooling is a dev-time dependency only, never shipped to `index.html`.

Planned coverage, once applicable:

- Render functions produce expected markup for representative sample data (including edge cases: missing optional
  fields, empty arrays).
- Search returns expected ranked results for representative queries across all indexed content types.
- Data files validate against their documented schema (`09_DATA_MODEL.md`, `11_COMPANY_SCHEMA.md`).

## Definition of done for a milestone

A milestone is not complete until:

1. Its acceptance criteria in `14_ROADMAP.md` pass.
2. A **milestone test plan** exists under [Milestone test plans](#milestone-test-plans) above (and is linked from
   `19_CURRENT_SPRINT.md`).
3. The project owner has run that plan (automated + browser) — programmatic checks alone are not sufficient from
   Milestone 3 onward (`12_DECISIONS.md` DR-005 pattern).
