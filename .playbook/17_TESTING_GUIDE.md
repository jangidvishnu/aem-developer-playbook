# Testing Guide

## Current state

No formal test suite exists yet. Committed verification scripts (Node, no dependencies):

- `node scripts/verify-render.js` — chapter/sidebar regression vs. Milestone 3 golden snapshot.
- `node scripts/verify-search.js` — ranked search assertions over real `data/*.json` (Milestone 5).

Run both after changes to `assets/js/render.js`, `assets/js/search.js`, or `data/*.json`.

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
node scripts/build-companies-m6.js   # optional — regenerates data/companies.json from seeds
node scripts/verify-companies.js
node scripts/verify-search.js
node scripts/verify-render.js
```

Expected: schema validation passes with **25+ Verified** companies; search and render scripts exit 0.

**Browser — company table and pagination:**

1. Serve the site over HTTP and open the home page with no console errors.
2. Scroll to **Target Companies** — table shows **Status** column; **Adobe** and **Cisco** appear as Verified.
3. With 40+ rows, confirm **pagination** controls appear (25 rows per page); **Next** loads page 2 without full-page reload hang.
4. Search **`HDFC`** or **`Spark`** — company results appear; activating scrolls to the company table section.
5. Search **`Philips`** — Verified company with AEM evidence in data.
6. Re-run baseline smoke checks (dark mode, print preview, keyboard tab to search).

**Sign-off:** Accepted by project owner after browser verification. See `25_ROADMAP_ARCHIVE.md`.

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
