# Performance

## Priority

Performance is explicitly priority #7 of 8 in `MASTER_BOOTSTRAP_PROMPT.md` — real, but subordinate to
maintainability, scalability, documentation quality, information architecture, developer experience, and reader
experience. Do not trade any of those away for a performance micro-optimization.

## Current state

- Single HTML file, Tailwind loaded from CDN (a full utility-class engine compiled at runtime in-browser — heavier
  than a purged/precompiled Tailwind build, but consistent with the "no build step" constraint).
- All content (small today) is inline in the JS bundle-equivalent (the `<script>` block), so there's no additional
  network request for content — this will change once `data/*.json` fetches are introduced (Milestone 3), trading
  a larger inline payload for smaller, cacheable, incremental requests.
- Search is a synchronous DOM scan (`innerText.includes()`) — fine at current content volume, will not scale
  past a few dozen sections without becoming noticeably slow (tracked for Milestone 5).

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
