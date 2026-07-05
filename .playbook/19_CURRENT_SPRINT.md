# Current Sprint

## Active objective

**Milestone 5 (Search)** — implementation complete. Awaiting project-owner browser check and formal acceptance.
Milestone 6 must not start until Milestone 5 is accepted.

## Milestone 5 — Search: pending acceptance

Replaced the naive DOM `innerText` scan with `assets/js/search.js` (data-indexed, ranked) and
`Render.searchResults` (accessible dropdown + keyboard nav).

**Test plan (authoritative):** `.playbook/17_TESTING_GUIDE.md` → **Milestone test plans → Milestone 5 — Search**

**Quick start for owner:**

```bash
node scripts/verify-search.js
node scripts/verify-render.js
```

Then serve `index.html` over HTTP and run the browser checklist in that section (Adobe, mission, Welcome, keyboard,
baseline dark mode / print / tab order).

## Milestone 6 — Company Intelligence Database: scoped, not started

Starts only after Milestone 5 is accepted. See `14_ROADMAP.md`.

## Milestones 1–4: accepted

See `14_ROADMAP.md` and `25_ROADMAP_ARCHIVE.md`.

## Explicitly not started

Milestone 6 implementation, Milestones 7–8.

## Blockers / open questions for the project owner

- Milestone 5: run test plan in `17_TESTING_GUIDE.md` and confirm acceptance.
