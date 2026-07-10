# Data Model

## Status

This document specifies the **target** data model per `MASTER_BOOTSTRAP_PROMPT.md`. As of Milestone 7,
`data/chapters.json`, `data/companies.json`, `data/site.json`, `data/roadmaps.json`, and six learning reference
files (`glossary`, `technologies`, `career_paths`, `interviews`, `templates`, `resources`) are live and fetched by
`index.html`. Companies conform to `11_COMPANY_SCHEMA.md` (Milestone 6). Chapters still use the Milestone 3 field
names (`reading`, not `readingTime`) — full chapter normalization deferred.

## Principle

All content is structured data. The renderer reads data; the UI never owns data. Every `data/*.json` file is
independently loadable and has one clear owner topic.

## Planned data files

| File | Purpose | Status |
|---|---|---|
| `data/site.json` | Site chrome: header meta, hero, sidebar labels, dashboard stats, footer, search config | **Live** (Milestone 4) |
| `data/companies.json` | Target-employer database — see `11_COMPANY_SCHEMA.md` for the full field list | **Live** (Milestone 3) |
| `data/chapters.json` | Handbook chapters/content — schema below | **Live** (Milestone 3) |
| `data/roadmaps.json` | Learning roadmaps (ordered skill/topic sequences) | **Live** (Milestone 7 — 3 paths) |
| `data/technologies.json` | Technology/skill reference entries (AEM, Sling, HTL, EDS, etc.) | **Live** (Milestone 7) |
| `data/resources.json` | External links, courses, docs worth referencing | **Live** (Milestone 7) |
| `data/career_paths.json` | Career progression tracks and milestones | **Live** (Milestone 7) |
| `data/glossary.json` | Term definitions, cross-linked from chapters | **Live** (Milestone 7) |
| `data/templates.json` | Reusable templates (resume bullets, interview answers, etc.) | **Live** (Milestone 7) |
| `data/interviews.json` | Interview questions/prep material, tagged by company/technology | **Live** (Milestone 7) |

## Site schema (`data/site.json`) — Milestones 4 + 11

```json
{
  "id": "site",
  "mode": "product | dev",
  "documentTitle": "string — <title> element and browser tab",
  "header": { "title": "string", "versionLabel": "string — hidden in product mode" },
  "hero": {
    "title": "string",
    "body": "string",
    "ctaCompanies": "string (optional, product mode)",
    "ctaApply": "string (optional, product mode)"
  },
  "sidebar": { "contentsLabel": "string" },
  "dashboard": { "title": "string", "items": ["string", "..."] },
  "search": { "placeholder": "string", "ariaLabel": "string", "clearLabel": "string" },
  "disclaimer": {
    "lines": ["string", "..."],
    "contributingLead": "string (optional)",
    "contributing": "string (optional)",
    "contributingUrl": "string (optional)",
    "contactEmail": "string (optional)",
    "linkedinUrl": "string (optional)",
    "linkedinLabel": "string (optional, default LinkedIn)"
  },
  "footer": { "text": "string", "copyright": "string (optional © / license line)" },
  "seo": {
    "siteUrl": "string — canonical origin (trailing slash)",
    "description": "string",
    "keywords": ["string", "..."],
    "ogType": "website",
    "ogLocale": "en_US",
    "twitterCard": "summary",
    "themeColor": "string (optional)",
    "ogImage": "string (optional absolute URL)"
  },
  "navigation": {
    "productChapterIds": ["chapter id", "..."],
    "devOnlyChapterIds": ["chapter id", "..."]
  }
}
```

Product mode chapter order follows `navigation.productChapterIds`. Dev-only chapters remain in `data/chapters.json`
but are not rendered when `mode` is `product` (unless `?mode=dev`).

## Roadmap schema (`data/roadmaps.json`) — Milestone 7

Array of roadmap objects.

```json
{
  "id": "string, stable unique identifier",
  "title": "string",
  "summary": "string",
  "steps": [
    {
      "id": "string",
      "title": "string",
      "status": "planned | in progress | complete",
      "description": "string (optional)",
      "technologyIds": ["technology id", "..."],
      "resourceIds": ["resource id", "..."],
      "estimatedHours": "number (optional)"
    }
  ]
}
```

Rendered via `Render.roadmapList` with anchors `#roadmap-{id}`.

## Glossary schema (`data/glossary.json`)

```json
{
  "id": "string",
  "term": "string",
  "definition": "string",
  "relatedTerms": ["glossary id", "..."],
  "chapterId": "chapter id or null"
}
```

## Technology schema (`data/technologies.json`)

```json
{
  "id": "string",
  "name": "string",
  "category": "string",
  "difficulty": "Beginner | Intermediate | Advanced",
  "summary": "string",
  "prerequisites": ["technology id", "..."],
  "resourceIds": ["resource id", "..."]
}
```

## Career path schema (`data/career_paths.json`)

```json
{
  "id": "string",
  "title": "string",
  "summary": "string",
  "milestones": [
    { "title": "string", "description": "string", "technologyIds": ["..."] }
  ]
}
```

## Interview schema (`data/interviews.json`)

```json
{
  "id": "string",
  "question": "string",
  "category": "technical | behavioral | system-design",
  "difficulty": "Beginner | Intermediate | Advanced",
  "technologies": ["technology id", "..."],
  "guidance": "string"
}
```

## Template schema (`data/templates.json`)

```json
{
  "id": "string",
  "title": "string",
  "category": "resume | interview | branding | networking",
  "body": "string"
}
```

## Resource schema (`data/resources.json`)

```json
{
  "id": "string",
  "title": "string",
  "url": "string (URL)",
  "type": "official-docs | course | ..."
}
```

## Chapter embed flags (`data/chapters.json`)

| Flag | Renders |
|---|---|
| `companyTable` | `Render.companyTable` |
| `glossaryEmbed` | `Render.glossaryTable` |
| `technologyEmbed` | `Render.technologyTable` |
| `careerPathEmbed` | `Render.careerPaths` |
| `interviewEmbed` | `Render.interviewList` |
| `templateEmbed` | `Render.templatesList` |
| `resourceEmbed` | `Render.resourcesList` |

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

See `11_COMPANY_SCHEMA.md` for the full field-by-field specification. Summary: identity (`id`, `name`, `priority`,
`industry`, `companyType`, optional `hq`), India signals (`indiaPresence`, `hiringIndia`), optional `hiringActive`
(ongoing AEM/DXP hiring cadence — owner-confirmed), careers (`careersUrl`, optional `jobSearchUrl`), Adobe stack as
a single `products` code array, short `roles`, `notes`, `evidence`, `hiringEvidence`, `verifiedAt`, required
`ownerVerified` (owner manual sign-off), optional `ownerPreferred` (owner recommendation), and optional sourced
`signals` (employer ratings). Personal application tracking stays out of the public file.

## Cross-cutting rules

- Every record has a stable `id` that does not change once referenced elsewhere (cross-links, bookmarks).
- Optional fields may be **omitted** when unknown (preferred for the slim company schema). Where a file still uses
  explicit `"Unknown"` / `null` placeholders, treat those as "not yet researched" — do not invent values.
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
