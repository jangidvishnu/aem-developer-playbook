# Editor Guide

Practical steps for adding or changing content in the handbook. This describes the *target* workflow once
Milestone 3 (Data Model) lands; where the current, pre-Milestone-3 process differs, it is noted explicitly.

## Adding a new chapter (target workflow, post-Milestone 3)

1. Add an entry to `data/chapters.json` following the schema in `09_DATA_MODEL.md` (`id`, `title`, `slug`,
   `summary`, `readingTime`, `difficulty`, `tags`, `references`, `relatedChapters`, `lastUpdated`, `content`).
2. Cross-link `relatedChapters` in both directions — if chapter A references chapter B, add A to B's
   `relatedChapters` too.
3. Run the manual verification checklist in `17_TESTING_GUIDE.md` (renders correctly, appears in search, appears in
   the sidebar, respects dark mode and print mode).
4. Add a `13_CHANGELOG.md` entry.

## Adding a new chapter (current workflow, pre-Milestone 3)

Until `data/chapters.json` exists, chapters are added as objects inside the `PLAYBOOK.chapters` array directly in
`index.html`. This is a known, tracked limitation (see `03_ARCHITECTURE.md`) — follow the same field shape as the
target schema so migration in Milestone 3 is a mechanical data move, not a rewrite.

## Adding or updating a company entry

1. Confirm the company has real, sourced evidence per `07_RESEARCH_GUIDE.md` — do not add a company on inference
   alone.
2. Populate fields per `11_COMPANY_SCHEMA.md`. Leave unknown fields explicitly marked unknown rather than guessing.
3. Set `LastVerified` to the date the evidence was checked.
4. If the company already exists, update in place and note what changed rather than creating a duplicate entry.

## Editing an existing document

- Read the whole document first, not just the section being changed — see `01_AI_CONSTITUTION.md` rule 9.
- Preserve any existing cross-links unless they are now incorrect.
- If a rewrite changes meaning (not just wording), add a `12_DECISIONS.md` entry when the change reflects a real
  trade-off.

## Reviewing before merge/commit

Use the checklist in `16_CHECKLISTS.md`. At minimum: no hardcoded content added, no duplicate information created,
terminology matches `05_STYLE_GUIDE.md`, and the changelog is updated.

## Common mistakes to avoid

- Editing content directly in a rendered HTML string instead of the underlying data source once Milestone 3 lands.
- Forgetting to update `relatedChapters` on both sides of a new cross-link.
- Adding a company without a `careersUrl` or evidence, making it unverifiable later.
