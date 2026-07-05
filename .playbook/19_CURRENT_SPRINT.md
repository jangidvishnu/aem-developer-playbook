# Current Sprint

## Active objective

A full remediation pass has resolved every outstanding item from the Milestone 1 PR review and the pre-Milestone-2
technical debt report, plus completed the Accessibility and Performance reviews Milestone 2 was initially missing.
**Do not start Milestone 3** until this is explicitly reviewed and accepted by the project owner.

## Milestone 1 — Repository Foundation: status

**Implemented, all review follow-ups resolved.** Both blocking items from the Lead-Architect PR review are closed:
content-preservation gap (archived into `02_PROJECT_MEMORY.md`) and stale status docs (fixed earlier).

## Milestone 2 — Render Function Extraction: status

**Implemented, remediated, fully reviewed.**

- [x] `Render.sidebar`, `Render.chapter`, `Render.companyTable`, `Render.companyRow` implemented as methods on a
      single namespace (not bare globals)
- [x] All 12 items from the pre-Milestone-2 technical debt report resolved (see `14_ROADMAP.md`'s debt table)
- [x] `Render.chapter` now receives `companies` as an explicit parameter (fixes the `PLAYBOOK.companies` coupling)
- [x] `Render.escapeHtml()` added and applied to every interpolated text/attribute value (chapter `body` correctly
      left unescaped, since it's intentionally raw HTML)
- [x] `scripts/verify-render.js` committed — reusable regression check, not a throwaway
- [x] Accessibility Review completed (`20_ACCESSIBILITY.md`) — fixed `aria-label`s, a skip link, and a
      newly-discovered Critical dark-mode contrast bug across the header, sidebar, and every chapter card
- [x] Performance Review completed (`23_PERFORMANCE.md`) — no regression; one real algorithmic improvement
- [x] All fixes verified byte-identical (or precisely, intentionally different by only the documented amount)
      against the pre-Milestone-1 rendering baseline via `node scripts/verify-render.js`
- [ ] Presented for review — **do not start Milestone 3 until this is explicitly accepted**

## Explicitly not started

Milestone 3 and everything after it.

## Blockers / open questions for the project owner

- Was another agent session or IDE window open against this same working directory during the Milestone 1
  investigation? Still unresolved (informational only at this point — no further symptoms observed since).
- The dark-mode contrast bug fix changed `Render.chapter`'s output (added one CSS class per chapter section) and
  the static header/sidebar markup (added a skip link, `aria-label`s, and color classes). This is a visible-in-code
  but not visible-in-light-mode change — dark mode itself now looks meaningfully different (readable) where it was
  previously broken (illegible). Flagging explicitly since "no visual change" no longer strictly holds for dark
  mode, even though it was never usable there before.
