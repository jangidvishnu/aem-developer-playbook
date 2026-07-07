# Current Sprint

## Active objective

**Milestone 11 (Minimal Product UI)** — implementation, UI polish (Phases A–E, DR-015), and browser bug-fix pass
complete; **pending owner browser acceptance**. Next session: run `17_TESTING_GUIDE.md` → Milestone 11 checklist in
the browser, then accept or log remaining issues.

## Session progress (2026-07-08)

### Done this session

- **Search UI** — fixed DOM wiring (`UI.wireSiteSearch`), category auto-widen (`querySearch`), removed `sf_source`
  from shareable URLs; Playwright smoke (`npm run ui-smoke`) + CI job; search field icon/clear-button polish.
- **How I Apply** — sticky sub-nav (removed `overflow:hidden` blocker), unified card layout, active tab + scroll offset.
- **Header / chrome** — compact product wordmark, toolbar search styling, disclaimer, favicon.
- **Navigation** — sidebar label **Browse playbook**; unified in-page anchor scroll (`UI.wireInPageAnchors`) for header,
  sidebar, and hero CTAs (no double offset).
- **Dev hygiene** — `.cursor/rules/terminal-hygiene.mdc`; `package.json` dev tooling only.

### Automated checks (last run)

`npm run verify` and `npm run ui-smoke` — **PASS**.

### Still for owner

- Hard-refresh browser acceptance of M11 test plan (`17_TESTING_GUIDE.md`).
- Explicit milestone sign-off before M12 (Publishing).

## Milestone 10 — accepted

Commit `46e45f6`. Owner playbook with personal apply strategy. **Full detail:** `25_ROADMAP_ARCHIVE.md`.

## Milestone 9 — accepted

Commit `5d37fc2`. Discovery filters, shareable URLs, Copy link. **Full detail:** `25_ROADMAP_ARCHIVE.md`.

## Milestones 1–8: accepted

See `14_ROADMAP.md` and `25_ROADMAP_ARCHIVE.md`.
