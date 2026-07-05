# Style Guide (Editorial)

Governs the tone and structure of written content — chapters, company notes, roadmap descriptions, and every
`.playbook/` document itself.

## Voice

- Professional, timeless, vendor-neutral where possible, actionable, concise but complete.
- Write for a senior engineer's attention span: lead with the point, then support it. Avoid throat-clearing
  introductions ("In this section we will discuss...").
- Prefer active voice ("AEM renders the component") over passive ("the component is rendered by AEM").

## Fact vs. opinion

- Mark verified facts distinctly from opinion or inference. In prose, phrase inference explicitly ("likely uses,"
  "publicly unconfirmed") rather than stating it as fact — see `07_RESEARCH_GUIDE.md` for sourcing standards this
  supports.
- Every factual claim about a company, technology version, or salary figure should be traceable to a source,
  either inline (a link) or in a linked reference file.

## Structure conventions

- Headings are sentence case ("Company database schema", not "Company Database Schema").
- Use numbered lists for sequences (roadmaps, steps); bullet lists for unordered collections (features, examples).
- Tables for anything with more than 3 comparable attributes per item (e.g. company comparisons) — see
  `10_COMPONENT_LIBRARY.md`'s `renderCompanyTable`.
- Keep paragraphs short (2–4 sentences). Break up long explanations with sub-headings rather than long prose blocks.

## Terminology consistency

| Use this | Not this |
|---|---|
| Adobe Experience Manager (AEM) | Adobe AEM |
| AEM as a Cloud Service (AEMaaCS) | AEM Cloud, Cloud AEM |
| Edge Delivery Services (EDS) | Franklin, Helix (legacy internal names) |
| Enterprise Digital Experience Engineer | AEM Developer (when describing the target role broadly) |

Expand this table as new recurring terms appear — do not let the same concept get two names across documents.

## Chapter-writing conventions

Each chapter (see `09_DATA_MODEL.md` for the schema) should:

- State its purpose in the `summary` field in one sentence.
- Lead the `content` body with the single most important takeaway.
- Cross-link `relatedChapters` rather than repeating their content.
- Include a realistic `readingTime` — recalculate it if content changes substantially.

## Anti-patterns

- Padding a section to look thorough without adding information density.
- Mixing verified and speculative claims in the same sentence without distinguishing them.
- Introducing a new term for a concept that already has an entry in the terminology table.
- Writing a placeholder ("TODO: expand this") and leaving it unflagged in `19_CURRENT_SPRINT.md`.

## FAQ

**Q: Can I use first person ("I recommend...")?**
A: Sparingly, and only in clearly personal sections (e.g. career strategy notes). Reference and technical content
should stay in a neutral third person.

**Q: How opinionated can company notes be?**
A: Opinion is allowed but must be labeled as such and kept separate from the sourced/evidenced fields in the
company schema (`11_COMPANY_SCHEMA.md`).
