# Data Model

## Status

This document specifies the **target** data model per `MASTER_BOOTSTRAP_PROMPT.md`. As of Milestone 3,
`data/chapters.json` and `data/companies.json` exist and are fetched by `index.html`, but deliberately do **not**
yet conform to the full field sets below — they're a faithful, as-is migration of the previous inline data (plus a
stable `id` per record, added because it's foundational rather than research-dependent). Fabricating ~30 "Unknown"
company fields now, only to overwrite them with real data in Milestone 6, would mean touching the same file twice
for no benefit — full schema conformance happens together with real data population in Milestone 6. See
`12_DECISIONS.md` and `14_ROADMAP.md`'s Milestone 3 scope for the reasoning.

## Principle

All content is structured data. The renderer reads data; the UI never owns data. Every `data/*.json` file is
independently loadable and has one clear owner topic.

## Planned data files

| File | Purpose |
|---|---|
| `data/companies.json` | Target-employer database — see `11_COMPANY_SCHEMA.md` for the full field list |
| `data/chapters.json` | Handbook chapters/content — schema below |
| `data/technologies.json` | Technology/skill reference entries (AEM, Sling, HTL, EDS, etc.) |
| `data/roadmaps.json` | Learning roadmaps (ordered skill/topic sequences) |
| `data/resources.json` | External links, courses, docs worth referencing |
| `data/career_paths.json` | Career progression tracks and milestones |
| `data/glossary.json` | Term definitions, cross-linked from chapters |
| `data/templates.json` | Reusable templates (resume bullets, interview answers, etc.) |
| `data/interviews.json` | Interview questions/prep material, tagged by company/technology |

## Chapter schema (`data/chapters.json`)

```json
{
  "id": "string, stable unique identifier",
  "title": "string",
  "slug": "string, URL-safe, stable once published",
  "summary": "string, one sentence",
  "readingTime": "string, e.g. '4 min'",
  "difficulty": "string, e.g. 'Beginner' | 'Intermediate' | 'Advanced'",
  "tags": ["string", "..."],
  "references": ["string (URL or citation)", "..."],
  "relatedChapters": ["chapter id", "..."],
  "lastUpdated": "ISO date string",
  "content": "string or structured content block, rendered by Render.chapter()"
}
```

## Company schema (`data/companies.json`)

See `11_COMPANY_SCHEMA.md` for the full field-by-field specification. Summary: identity fields (id, name, industry,
headquarters), AEM/Adobe-stack fields (usesAEM, AEMVersion, AEMaaCS, EdgeDeliveryServices, etc.), hiring fields
(careersUrl, HiringIndia, VisaSupport, InterviewDifficulty), and tracking fields for personal application status
(Wishlist, Applied, Interview, Offer, Rejected).

## Cross-cutting rules

- Every record has a stable `id` that does not change once referenced elsewhere (cross-links, bookmarks).
- Optional/unknown fields are present but explicitly `null` or `"Unknown"` — never omitted silently, so consumers
  can distinguish "not yet researched" from "field doesn't apply."
- Dates are ISO 8601 strings (`YYYY-MM-DD`) for sortability.
- No file should exceed a size that makes it awkward to load client-side without pagination; if a file grows large
  (particularly `companies.json` or `interviews.json`), splitting strategy is a decision for `12_DECISIONS.md`, not
  a silent change.

## Renderer contract

Renderer functions (`10_COMPONENT_LIBRARY.md`) take a data object or array in this shape and return/inject markup.
They must not fetch data themselves and must not mutate the input.

## Migration note — Milestone 3, completed with a deliberate scope limit

`PLAYBOOK.chapters` and `PLAYBOOK.companies` were extracted from `index.html` into `data/chapters.json` and
`data/companies.json` in Milestone 3, but field names were **not** normalized to this schema yet (e.g. `reading`
was kept as-is rather than renamed to `readingTime`, and `slug`/`difficulty`/`references`/`relatedChapters`/
`lastUpdated` were not added). Full normalization is deferred to whichever milestone next touches this data with
real content (`06_EDITOR_GUIDE.md`/Milestone 7 for chapters, Milestone 6 for companies), so field renames and real
content additions happen together rather than as two separate touches of the same file.
