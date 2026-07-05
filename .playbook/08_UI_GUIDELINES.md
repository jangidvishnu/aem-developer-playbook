# UI Guidelines

## Design inspiration

Professional, documentation-grade UI in the spirit of Microsoft Learn, GitBook, Stripe Docs, Notion, and Adobe
Experience League. Not marketing-site flashy — optimized for long-form reading and fast reference lookup.

## Required UI capabilities

| Capability | Status today |
|---|---|
| Dark mode (persisted) | Implemented (`localStorage` + toggle button) |
| Print mode | Implemented (`@media print` rules hide chrome, avoid page-break-inside) |
| Keyboard navigation | Not yet implemented — planned for Milestone 4/5 |
| Responsive design | Partially implemented (Tailwind responsive utilities used sparingly today) |
| Sticky navigation | Implemented (sticky header, sticky sidebar) |
| Breadcrumbs | Not yet implemented |
| Collapsible sections | Partially implemented (per-chapter `<details>` summary) |
| Reading progress | Not yet implemented |
| Search | Implemented as a naive `innerText` scan; ranked multi-source search is Milestone 5 |

## Layout conventions

- Sticky header with title, search box, and theme toggle.
- Fixed-width sidebar (table of contents + project status) that scrolls independently from content.
- Main content as a vertical stack of card-like sections, one per chapter, each with a heading, metadata line
  (reading time, tags), summary, body, and a collapsible detailed summary.

## Interaction conventions

- Every toggle (theme, collapsible sections) must reflect and persist its state where persistence makes sense
  (theme does; per-session UI state like open/closed panels does not need to).
- Search should filter in place rather than navigating away, so users don't lose their scroll position unnecessarily.
- All interactive elements must be reachable and operable via keyboard — see `20_ACCESSIBILITY.md`.

## Visual conventions

- Tailwind's slate palette for neutral surfaces; a blue accent (`blue-700`/`sky-600`) for primary emphasis (hero,
  links, callouts).
- Callouts (`.callout` class) use a left accent border rather than a filled background, to stay legible in both
  light and dark mode.
- Tables get a light header row and top border per row — avoid heavy borders/grid lines that fight print layout.

## Anti-patterns

- Adding a new color that isn't in the existing slate/blue palette without a reason.
- Building a UI element that only works in light mode or only in dark mode.
- Any interactive element that is a `<div>` with a click handler instead of a real button/link (breaks keyboard
  and screen-reader access).
- Non-responsive fixed-width layouts that break below typical tablet width.

## Roadmap for this area

Keyboard navigation, breadcrumbs, and reading progress are explicitly deferred to the milestones that introduce
the render-function architecture (`10_COMPONENT_LIBRARY.md`) and search (Milestone 5) — adding them piecemeal to
the current hardcoded renderer would create work that has to be redone.
