# Performance

## Priority

Performance is explicitly priority #7 of 8 in `MASTER_BOOTSTRAP_PROMPT.md` — real, but subordinate to
maintainability, scalability, documentation quality, information architecture, developer experience, and reader
experience. Do not trade any of those away for a performance micro-optimization.

## Current state (as of Milestone 13)

- No CSS framework or CDN — `assets/css/site.css` is a single hand-written stylesheet, parsed once, no runtime
  utility-class compilation. This replaced the Tailwind CDN in Milestone 11 (`12_DECISIONS.md` DR-015); the
  Milestone 2/3 reviews below that discuss the Tailwind CDN's render-blocking cost describe a since-removed
  constraint, kept for historical record rather than rewritten.
- Content is fetched from all `data/*.json` files in parallel (`Promise.all` in `assets/js/app.js`'s `App.boot()`)
  rather than inlined — see the Milestone 3 review below for the trade-off this introduces; unchanged since M3.
- Search is a real ranked index (`assets/js/search.js`, `Search.buildIndex`) built once at load over `data/*.json`,
  not a DOM scan — resolved the Milestone 5 concern noted below.
- **Milestone 13:** the company-filter toolbar's search input and the site-wide search input are both debounced
  (`UI.debounce`, 200ms) so free-text typing triggers at most one filter+sort+re-render per 200ms of typing pause,
  not one per keystroke. Only free-text typing is debounced — chip/select/checkbox interactions stay immediate.
- **Milestone 13:** `data/companies.json` (119 companies / ~222KB) is still fetched as one file with no chunking.
  `scripts/verify-companies.js` now warns once the dataset crosses ~400 companies / ~800KB — see `12_DECISIONS.md`
  DR-020 for the threshold and the chunked-fetch strategy planned if/when that happens.
- **Milestone 14:** `index.html` now ships with the full product-mode markup baked in (see DR-022), so its file size
  grows with `data/companies.json` and the chapter content — a few hundred KB, not a performance concern at current
  volume (still a single static-file GET, no extra round trip). `assets/js/app.js` then re-renders the same content
  once `fetch()` resolves; that redundant re-render is the accepted trade-off documented in DR-022, not an
  oversight — it avoids hydration-mismatch bug surface at the cost of one imperceptible extra render pass.

## Performance review (post-Milestone-2)

Measured directly against the file, since no deployed instance or browser profiling tooling exists yet:

- **`index.html` size:** 10,455 bytes (~10.2 KB) as of this review — trivial by any web-performance standard;
  download time is negligible on any connection.
- **External requests:** 3 — the Tailwind CDN script, a Google Fonts preconnect, and the Google Fonts stylesheet
  (which triggers further font-file requests). This is unchanged by Milestone 2's work and remains the dominant
  cost on a cold load; no new requests were added.
- **Render-blocking script (known, accepted trade-off):** the Tailwind CDN `<script>` tag in `<head>` has no
  `defer`/`async` and blocks first paint until it downloads and JIT-compiles the page's utility classes. This is
  inherent to using the CDN build rather than a precompiled stylesheet, and is an explicit, already-documented
  trade-off for staying build-step-free — not a regression from this milestone, and not something to "fix" without
  a decision record, since the alternative (a precompiled Tailwind build) requires a build step.
- **Rendering algorithm — improved this milestone:** the pre-Milestone-1 code built markup via repeated
  `main.innerHTML += ...` inside a loop (each `+=` re-parses the accumulated string — effectively O(n²) for n
  chapters). Milestone 2's `Render.chapter` functions build via `.map().join('')` and assign/append once, which is
  O(n). Not measurable as a user-facing win at 8 chapters, but removes a pattern that would have degraded
  noticeably once Milestone 6+ grows the content volume.
- **Escaping overhead:** `Render.escapeHtml()` (added in this remediation pass) runs one regex replace per
  interpolated field. At today's volume (8 chapters, 4 companies) this is unmeasurably fast; worth re-profiling
  once Milestone 6 populates 100+ companies, though a per-field regex is unlikely to be the bottleneck even then.

**Verdict:** no performance regression from Milestone 2 or its remediation; one real algorithmic improvement
(`+=` → `.map().join()`); the dominant cost (Tailwind CDN, ~un-optimized by design) is unchanged and explicitly
accepted per the no-build-step constraint.

## Performance review — Milestone 3 (Data Model)

Measured directly against the files:

- **`index.html` shrank:** 10,455 → 8,330 bytes, since content moved out into `data/*.json`.
- **Two new requests added:** `data/chapters.json` (2,585 bytes) and `data/companies.json` (1,026 bytes), fetched
  in parallel via `Promise.all`. Combined payload across all three files (11,941 bytes) is marginally larger than
  the old single-file total (10,455 bytes) due to JSON syntax overhead — negligible in absolute terms at this
  content volume, but worth knowing this trade doesn't shrink total bytes, it trades a single larger inline
  payload for smaller, independently-cacheable, independently-editable files.
- **Real, honest trade-off: slower time-to-first-content.** Inline data rendered synchronously the instant the
  script ran — no network round trip. Fetched data now requires: HTML parse → script execute → two parallel HTTP
  requests → JSON parse → render. On any reasonable connection this is small in absolute terms (kilobyte-sized
  local files), but it is objectively slower than before, and worth stating plainly rather than glossing over. This
  is accepted because the project's own priority order (`MASTER_BOOTSTRAP_PROMPT.md`) ranks Maintainability and
  Scalability above Performance — this change serves both of the former at a small, honest cost to the latter.
- **User-visible mitigation:** the loading state (`20_ACCESSIBILITY.md`) means the delay is never a blank,
  unexplained pause — there's always something rendered immediately (header, hero, loading message).
- **Fetches run in parallel, not sequentially** (`Promise.all`, not two chained `.then()`s) — avoids doubling the
  network wait unnecessarily.

**Verdict:** a small, deliberate, honestly-documented performance cost in exchange for real maintainability and
scalability gains (data now editable independent of code, cacheable independent of markup). No regression beyond
what's inherent to the fetch-based architecture the constitution mandates.

## Budgets (targets, to be measured once tooling exists)

- Initial render should not visibly block on anything beyond the Google Fonts request and the `data/*.json` fetches.
- Search-as-you-type interactions should feel instant (sub-300ms including the Milestone 13 debounce window) —
  met today via `Search.buildIndex` (Milestone 5) plus `UI.debounce` (Milestone 13).
- `data/*.json` files should be small enough to fetch without a visible loading state at expected content volumes;
  if a single file grows large enough to need pagination or lazy loading, that's a decision (`12_DECISIONS.md`),
  not a silent change.

## Practices

- Prefer native browser capability (native `<details>`, native form controls) over hand-rolled JS equivalents —
  less JS to parse and execute.
- Debounce free-text input handlers (`UI.debounce`, Milestone 13) rather than re-rendering on every keystroke;
  keep clicks/changes (chips, selects, checkboxes, pagination) immediate.
- Defer/avoid loading anything not needed for first paint (no eager-loading of content types the current view
  doesn't show).

## Anti-patterns

- Adding a heavy client-side library to solve a problem vanilla JS/CSS already solves adequately (violates both
  this document and `04_CODING_STANDARD.md`).
- Premature optimization that sacrifices readability or maintainability for a performance gain that hasn't been
  measured as necessary.
- Ignoring performance entirely because it's a low-numbered priority — "low priority" means "don't sacrifice
  higher priorities for it," not "ignore it."

## Measurement (target state)

The site has been live on GitHub Pages since Milestone 12 (see `25_ROADMAP_ARCHIVE.md`), but no Lighthouse (or
equivalent) run has been recorded yet — this remains an open action item, not something already done. Once run,
record the baseline in `13_CHANGELOG.md`.
