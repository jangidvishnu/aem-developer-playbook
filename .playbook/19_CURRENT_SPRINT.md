# Current Sprint

## Active objective

Milestone 3 (Data Model) is implemented and fully reviewed under the complete `15_RELEASE_PROCESS.md` checklist —
the first milestone to follow it from the start rather than retrofitting it afterward. **Do not start Milestone 4**
until this is explicitly reviewed and accepted by the project owner.

## Milestone 3 — Data Model: status

**Implemented, fully reviewed, pending final acceptance.**

- [x] `data/chapters.json` and `data/companies.json` created — faithful transcription of the former inline
      `PLAYBOOK` object, plus a stable `id` per record (not full schema conformance — deliberately deferred, see
      `09_DATA_MODEL.md`)
- [x] `index.html` now contains zero content data — fetches both files in parallel via `Promise.all` and passes
      results into the unchanged `Render` functions
- [x] Loading state added (`role="status"`, screen-reader announced) and error state (`role="alert"`) for the
      `file://`/CORS failure case
- [x] `scripts/verify-render.js` rewritten to read the real `data/*.json` files from disk (not a hardcoded copy),
      proving they're a faithful transcription — confirmed the only diff from the pre-Milestone-1 baseline is the
      already-known Milestone 2 accessibility fix; the new `id` fields don't leak into rendered output
      (byte-verified)
- [x] Architecture Review, Accessibility Review, and Performance Review all completed (`03_ARCHITECTURE.md`,
      `20_ACCESSIBILITY.md`, `23_PERFORMANCE.md`) — Performance Review honestly documents a small, deliberate
      time-to-first-content cost in exchange for maintainability/scalability gains
- [x] `17_TESTING_GUIDE.md` updated: smoke test now requires a local server, not a direct `file://` open
- [x] `12_DECISIONS.md` DR-005 records the `fetch()`/CORS trade-off, flagged to and accepted by the project owner
      before implementation began
- [ ] Presented for review — **do not start Milestone 4 until this is explicitly accepted**

## Milestone 1 & 2: status

Both complete, fully reviewed, and committed. See `14_ROADMAP.md` and `25_ROADMAP_ARCHIVE.md` for full detail.

## Explicitly not started

Milestone 4 and everything after it.

## Blockers / open questions for the project owner

- Was another agent session or IDE window open against this same working directory during the Milestone 1
  investigation? Still unresolved (informational only — no further symptoms observed since).
- **Local viewing now requires a server.** Double-clicking `index.html` will show the error state, not the site —
  this is expected per `12_DECISIONS.md` DR-005, not a bug. Use `npx serve`, `python -m http.server`, or an
  editor's Live Preview feature.
- A real, in-browser manual smoke test (per the updated `17_TESTING_GUIDE.md`) has not yet been performed by a
  human — everything so far has been verified programmatically (`scripts/verify-render.js`) or by careful code
  reading. Recommended before treating Milestone 3 as fully accepted.
