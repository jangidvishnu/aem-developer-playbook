# Accessibility

## Principle

Accessible by default, not as a retrofit. This is a non-negotiable constraint from `MASTER_BOOTSTRAP_PROMPT.md`
("Accessible"), on equal footing with responsive and print-friendly.

## Current state (post-Milestone-2 accessibility review)

- Semantic landmarks exist (`<header>`, `<aside>`, `<main>`, `<section>`) — good foundation.
- Interactive elements today (search input, theme toggle) are real `<input>`/`<button>` elements — good, keep this
  pattern for every future control.
- **Fixed in this review:** the theme-toggle button now has `aria-label="Toggle dark mode"`; the search input has
  `aria-label="Search chapters"`; a visually-hidden skip-to-content link (`sr-only focus:not-sr-only`) now precedes
  the header, becoming visible on keyboard focus and jumping to `#main`.
- **Fixed in this review (Critical, newly discovered):** dark mode had a real, severe contrast bug. The header,
  sidebar, and every chapter card have a fixed white background (`bg-white`, never toggled), but their headings
  (`h1`, sidebar `h2`/`h3`, sidebar TOC links, chapter `h2`, the collapsible `<summary>`) had no explicit text
  color and inherited from `<body>`, whose color *does* toggle to a near-white shade in dark mode. The practical
  effect: page title, sidebar contents, and every chapter heading rendered as near-invisible light text on a white
  background in dark mode. Fixed by pinning `text-slate-800` explicitly on the header's `h1`, the `<aside>`
  wrapper (which also fixes the JS-generated TOC links via inheritance, with no render-function change needed),
  and each chapter `<section>` (which does change `Render.chapter`'s output — verified via
  `scripts/verify-render.js` to be *only* that one class addition, nothing else). Light mode is visually unchanged
  since `text-slate-800` matches what those elements already rendered as before.
- **Still open:** no `aria-live` region for search result changes (tracked for Milestone 5, since it depends on the
  real search implementation). Formal contrast-ratio measurement in a browser dev tool has not been done — see
  below for a manual calculation instead.

## Contrast check (manual calculation, Tailwind default palette)

| Foreground | Background | Approx. ratio | WCAG AA (4.5:1 normal text) |
|---|---|---|---|
| `slate-800` (#1e293b) | `white` (#ffffff) / `slate-100` (#f1f5f9) | ~12.6:1 / ~11.7:1 | Pass |
| `slate-100` (#f1f5f9) | `slate-900` (#0f172a) | ~16.1:1 | Pass |
| `slate-500` (#64748b) | `white` (#ffffff) | ~4.6:1 | Pass (normal text), comfortable margin for the small text it's used for is thin — avoid darkening the background further without re-checking |
| `slate-600` (#475569) | `white` (#ffffff) | ~7.1:1 | Pass |

These are calculated from the documented Tailwind slate palette hex values, not measured with a live browser tool —
treat as a strong indicator, not a substitute for an eventual real device/browser check.

## Standards target

WCAG 2.1 AA as the baseline bar for any new or changed UI.

## Requirements for every UI change

- **Keyboard:** every interactive element reachable via Tab, operable via Enter/Space, with a visible focus state.
- **Screen readers:** every control has an accessible name (visible text, `aria-label`, or associated `<label>`).
  Icon-only or emoji-only controls (like the current theme toggle) need an `aria-label`.
- **Color contrast:** text and interactive elements meet WCAG AA contrast ratios in both light and dark mode.
- **Motion:** respect `prefers-reduced-motion` for any animation added in the future (none exists today beyond
  `scroll-behavior: smooth`, which should itself respect the media query once revisited).
- **Structure:** heading levels (`h1`–`h3`) must nest in order — do not skip levels for visual sizing reasons.
- **Dynamic content:** when search filters content, changes should be announced (e.g. via an `aria-live="polite"`
  results-count region) so screen-reader users know the list changed — tracked for Milestone 5 (Search).

## Testing approach

Manual: keyboard-only pass and a screen-reader spot-check (e.g. VoiceOver/NVDA) as part of the smoke test in
`17_TESTING_GUIDE.md`. Automated axe-core style checks are a candidate for the CI target state in
`18_GITHUB_WORKFLOW.md` once tooling is introduced, without adding a build-step dependency to the shipped site.

## Anti-patterns

- Clickable `<div>`/`<span>` instead of `<button>`/`<a>`.
- Relying on color alone to convey meaning (e.g. a red table row with no text label).
- Placeholder text used as a label substitute for form inputs.
- Emoji or icon-only buttons without an accessible name.

## Backlog (remaining)

- `aria-live` region for search result count changes — tracked for Milestone 5 (Search), since it depends on the
  real search implementation replacing today's naive `innerText` scan.
- A real, live-browser contrast measurement (dev tools or an automated axe-core-style check) to confirm the manual
  calculation above, once CI tooling exists (`18_GITHUB_WORKFLOW.md`).
