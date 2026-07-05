# Performance

## Priority

Performance is explicitly priority #7 of 8 in `MASTER_BOOTSTRAP_PROMPT.md` — real, but subordinate to
maintainability, scalability, documentation quality, information architecture, developer experience, and reader
experience. Do not trade any of those away for a performance micro-optimization.

## Current state

- Single HTML file, Tailwind loaded from CDN (a full utility-class engine compiled at runtime in-browser — heavier
  than a purged/precompiled Tailwind build, but consistent with the "no build step" constraint).
- As of Milestone 3, content is fetched from `data/chapters.json` and `data/companies.json` in parallel rather than
  inlined — see the Milestone 3 review below for the specific trade-off this introduces.
- Search is a synchronous DOM scan (`innerText.includes()`) — fine at current content volume, will not scale
  past a few dozen sections without becoming noticeably slow (tracked for Milestone 5).

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

- Initial render should not visibly block on anything beyond the Tailwind CDN script and font load.
- Search-as-you-type interactions should feel instant (sub-100ms) up to the content volume expected through
  Milestone 6; if a real search index (Milestone 5) is needed to hit this, that's expected and planned.
- `data/*.json` files should be small enough to fetch without a visible loading state at expected content volumes;
  if a single file grows large enough to need pagination or lazy loading, that's a decision (`12_DECISIONS.md`),
  not a silent change.

## Practices

- Prefer native browser capability (native `<details>`, native form controls) over hand-rolled JS equivalents —
  less JS to parse and execute.
- Avoid re-rendering the entire content area on every keystroke in search; once a real search implementation lands
  (Milestone 5), scope DOM updates to the changed result set.
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

Once the site is deployed to GitHub Pages (Milestone 8), run it through a standard tool (e.g. Lighthouse) and
record a baseline in `13_CHANGELOG.md`. No baseline exists yet since there is no deployed instance.
