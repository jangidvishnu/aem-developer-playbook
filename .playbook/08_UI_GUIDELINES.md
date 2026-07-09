# UI Guidelines

## Design inspiration

Professional, documentation-grade UI in the spirit of Microsoft Learn, GitBook, Stripe Docs, Notion, and Adobe
Experience League. **Product mode** (Milestone 11) shifts toward a fast utility: companies and apply steps first,
minimal chrome — still readable for long-form learning content below the fold.

**Presentation stack (DR-015):** `assets/css/site.css` design tokens (`data-theme` light/dark), Inter font, ~1700px
max content width, `assets/js/icons.js` inline SVGs, `assets/js/ui.js` behaviors. Tailwind CDN is not loaded in
`index.html`; utility-like classes in render output are styled via `site.css`.

## Required UI capabilities

| Capability | Status today |
|---|---|
| Dark mode (persisted) | Implemented (`data-theme` + `localStorage` + `UI.initTheme`) |
| Print mode | Implemented (`@media print` rules hide chrome, avoid page-break-inside) |
| Keyboard navigation | Search (Arrow/Enter/Escape); mobile nav drawer (Escape); command palette (Ctrl/Cmd+K) |
| Responsive design | Doc header with mobile search row; off-canvas nav; company cards &lt;768px; learning tables scroll horizontally on mobile (min-width) — **every UI change must be checked on desktop and mobile** |
| Sticky navigation | Sticky doc header; sticky sidebar on desktop |
| Active section highlight | Scroll-spy on grouped sidebar links (`UI.wireScrollSpy`) |
| Breadcrumbs | Not yet implemented |
| Collapsible sections | Dev mode: per-chapter `<details>`; product mode: roadmap accordions hide step status |
| Reading progress | Not yet implemented |
| Search | Ranked multi-source search; desktop header input + mobile row + command palette |
| Product vs dev mode | `site.json` `mode` + `?mode=dev` override (DR-014) |
| Custom filter selects | `Render.uiSelect` + `UI.wireSelects` (replaces native dropdowns in company explorer) |

## Layout conventions

- **Desktop + mobile required:** any design/CSS/render change must be verified at desktop (≥1024px) and mobile
  (≤767px). Do not land fixed table widths or chrome that only work on wide screens.
- **Doc header** — wordmark (`site.json` `shortTitle`), desktop search, theme toggle, optional GitHub link; mobile
  hamburger + dedicated search row below (`doc-header__row--search`).
- **Desktop:** grouped sidebar nav (`site.json` `navigation.groups`); Project Status only in dev mode.
- **Mobile:** off-canvas sidebar drawer; backdrop click and Escape close it. Learning `data-table`s keep readable
  column widths and scroll inside `.data-table-wrap` (do not crush with `width: 100%` + fixed %).
- Main content as a vertical stack. **Product mode order:** hero (stat cards + CTAs) → Target Companies → How I Apply
  → learning/reference chapters. Roadmap panels render inside **Learning Roadmap**, not above companies.
- **Company explorer** — single `.company-explorer` card: metrics strip, toolbar (chips + custom selects), table or
  cards, one pagination footer (10 rows/page, padded empty rows for stable height).

## Filter conventions (company discovery)

- **Row 1 — Quick filter chips** (product mode): Hiring AEM, India, Verified, AEM Cloud — toggle buttons with
  `aria-pressed`.
- **Row 2 — Essentials:** company name search + sort (default **hiring intensity** in product mode) via custom select.
- **Row 3 — More filters:** Type, Industry, Migration inside `<details>` with custom selects.
- Filter count uses `aria-live="polite"`. Shareable URLs unchanged (Milestone 9).
- **One** Prev/Next pagination bar in the explorer footer — never duplicate pagination on table and cards.

## Interaction conventions

- Every toggle (theme, filter chips, collapsible sections) must reflect and persist its state where persistence makes
  sense (theme does; per-session UI state like open/closed panels does not need to).
- Search should filter in place rather than navigating away, so users don't lose their scroll position unnecessarily.
- **Command palette** — Ctrl/Cmd+K opens modal search; same index as header search.
- Icon buttons (copy link, external careers) use `Icons.svg()` with `aria-label`; avoid text-only action links.
- All interactive elements must be reachable and operable via keyboard — see `20_ACCESSIBILITY.md`.
- Minimum touch target **44px** for primary actions on mobile (filter chips, card buttons, pagination).

## Visual conventions

- CSS variables in `site.css` for surfaces, borders, accent (`--accent`), and muted text — both themes must pass contrast.
- Callouts use a left accent border rather than a filled background.
- Tables: light header row, row hover; company table body has fixed min-height via pad rows.
- **Product mode** omits version label, Project Status, per-step roadmap status labels, and redundant Owner badges.
- Favicon: `assets/icons/favicon.svg`.

## Anti-patterns

- Adding a new color that isn't in the existing slate/blue palette without a reason.
- Building a UI element that only works in light mode or only in dark mode.
- Any interactive element that is a `<div>` with a click handler instead of a real button/link (breaks keyboard
  and screen-reader access).
- Non-responsive fixed-width layouts that break below typical tablet width.
- Deleting dev-only content from JSON instead of hiding it in product mode.

## Roadmap for this area

Keyboard navigation beyond search, breadcrumbs, and reading progress remain deferred. Milestone 12 adds print/PDF polish.
