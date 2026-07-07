# Current Sprint

## Active objective

**Milestone 9 (Discovery Filters)** — not started. Search-panel facets and shareable filter state. See
`14_ROADMAP.md`.

## Milestone 8 — accepted

Commit `e201d00`. **119** hire-verified employers, hiring gate, company table filters/sort, BuiltWith seed
manifest (no paid API). **Full detail:** `25_ROADMAP_ARCHIVE.md`.

**Verify (regression):**

```bash
node scripts/build-companies.js
node scripts/verify-companies.js
node scripts/verify-filters.js
node scripts/verify-search.js
node scripts/verify-render.js
node scripts/verify-learning.js
```

**Ongoing (post-M8):** grow company list via fresh research + `data/company-sources.json` (no count cap per DR-010).

## Milestone 7 — accepted

Commit `7984ec4`. **Full detail:** `25_ROADMAP_ARCHIVE.md`.

## Milestones 1–6: accepted

See `14_ROADMAP.md` and `25_ROADMAP_ARCHIVE.md`.
