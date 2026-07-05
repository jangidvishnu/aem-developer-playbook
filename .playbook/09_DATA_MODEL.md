# Data Model

## Status

This document specifies the **target** data model per `MASTER_BOOTSTRAP_PROMPT.md`. None of the `data/*.json` files
exist yet — they are created in Milestone 3. `index.html` currently hardcodes an early, partial version of the
chapter and company shapes directly in JavaScript; those in-code shapes should converge toward this spec when
extracted.

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

## Migration note (Milestone 3)

When `PLAYBOOK.chapters` and `PLAYBOOK.companies` are extracted from `index.html` into these JSON files, field names
should be normalized to match this schema exactly, even where the current inline object uses shorthand (e.g.
today's `reading` field becomes `readingTime`).
