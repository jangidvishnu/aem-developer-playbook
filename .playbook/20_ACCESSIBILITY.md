# Accessibility

## Principle

Accessible by default, not as a retrofit. This is a non-negotiable constraint from `MASTER_BOOTSTRAP_PROMPT.md`
("Accessible"), on equal footing with responsive and print-friendly.

## Current state

- Semantic landmarks exist (`<header>`, `<aside>`, `<main>`, `<section>`) — good foundation.
- Interactive elements today (search input, theme toggle) are real `<input>`/`<button>` elements — good, keep this
  pattern for every future control.
- Known gaps: no visible focus-order/skip-link strategy, no `aria-live` region for search result changes, the
  theme-toggle button uses an emoji with no accessible label, and color contrast has not been formally checked in
  dark mode.

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

## Backlog (tracked, not yet fixed)

- Add `aria-label="Toggle dark mode"` to the theme toggle button.
- Add a skip-to-content link before the header.
- Verify dark-mode contrast ratios formally once the color palette is touched in any future milestone.
