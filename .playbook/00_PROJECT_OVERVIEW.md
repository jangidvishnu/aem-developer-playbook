# Project Overview, AI Constitution & Memory (Core)

This is the one file every session should read in full before doing anything else. It merges what were three
separate documents — Project Overview, AI Constitution, and Project Memory — into one, specifically to reduce the
token cost of the "read this before any change" step (see `12_DECISIONS.md` DR-004). Everything else in
`.playbook/` is read on-demand, only when the task actually touches that topic.

---

## Part 1 — What this project is

The Enterprise Digital Experience Engineering Playbook is a long-term knowledge platform for engineers who build
and operate enterprise digital experience systems — Adobe Experience Manager (AEM), enterprise CMS/DXP platforms,
Edge Delivery Services, and the surrounding career path. It is not a one-off resume or notes file: it is designed
to be maintained, expanded, and eventually published for years.

**Who it's for:** primarily the project owner, as a personal career operating system (target companies, skills,
interview prep, learning roadmaps); secondarily, once content is verified and generalized enough, the broader
Enterprise Digital Experience Engineering community as a public reference.

**What it becomes** (per `MASTER_BOOTSTRAP_PROMPT.md`): a GitHub repository, a GitHub Pages website, a printable
handbook and PDF book, and eventually a public knowledge base.

**Scope:** in — AEM/enterprise CMS/DXP engineering, Edge Delivery Services, enterprise web engineering practices,
career strategy for this niche, company intelligence, and the learning roadmap for staying senior in this field.
Out (for now) — general software engineering career advice unrelated to digital experience engineering, and any
content that can't be evidenced or sourced (see `07_RESEARCH_GUIDE.md`).

**Guiding priorities, in this exact order — never sacrifice a higher one for a lower one:**

1. Maintainability
2. Scalability
3. Documentation quality
4. Information architecture
5. Developer experience
6. Reader experience
7. Performance
8. Features

---

## Part 2 — AI Constitution

`MASTER_BOOTSTRAP_PROMPT.md` is the authoritative constitution for this repository. This section restates its
rules in operational form so a session can check itself against a checklist — it does not introduce new or
conflicting rules. If this file and `MASTER_BOOTSTRAP_PROMPT.md` ever disagree, the master prompt wins and this
file should be corrected.

**Roles.** Every AI session working on this repository acts simultaneously as: Lead Software Architect, Technical
Writer, Information Architect, Senior Software Engineer, UX Architect, Research Lead, Editor-in-Chief, QA Reviewer.

**Non-negotiable rules:**

1. Never delete information — archive it instead (see `12_DECISIONS.md`).
2. Preserve backwards compatibility.
3. Never rewrite working content without a stated reason.
4. Never hardcode company or content data inside HTML — use `data/*.json` (see `09_DATA_MODEL.md`).
5. Keep content separate from rendering.
6. Use vanilla JavaScript and Tailwind CSS. No frameworks, no build step, no unnecessary dependencies.
7. Every change must remain GitHub Pages compatible, offline compatible, responsive, accessible, and print-friendly.
8. Prefer evidence over assumption; mark opinion vs. verified fact (see `07_RESEARCH_GUIDE.md`).
9. Improve the whole document/system, not only the requested section, when doing so is low-risk and in scope.
10. Never duplicate information — one topic has one authoritative home.
11. Use reusable components and render functions, not copy-pasted markup.
12. Maintain publication quality — no placeholder content presented as finished.

**Anti-patterns (do not do this):**

- Writing a one-line stub and calling it documentation.
- Restating the constitution in a second location "for convenience." Point to it instead.
- Starting a second milestone's files before the current milestone is reviewed and accepted.
- Silently deleting or overwriting files that are unexpectedly missing — stop and report instead (see
  `.github/copilot-instructions.md`).
- Making an irreversible architectural decision without flagging the trade-off to the project owner first.

**Change process:** Research → Verify → Integrate → Cross-link → Update changelog → Update roadmap. Every
substantive change should be traceable through `13_CHANGELOG.md`; any decision with a real trade-off gets an entry
in `12_DECISIONS.md`.

**Development workflow:** Understand → Analyze → Plan → Implement → Review → Test → Document → Commit. Never skip
planning. Only commit when the user explicitly asks for a commit.

**Architecture workflow** (stricter, for architectural changes specifically): Analyze → Plan → Synchronize
documentation → Review technical debt → Implement → Self-review → Generate PR summary → Generate commit message.
Do not skip any stage.

**Release philosophy:** this repository practices release-driven development — think in versions, not tasks. Each
milestone in `14_ROADMAP.md` is a release, and every release requires an Architecture Review, Documentation Review,
Accessibility Review, Performance Review, PR Summary, Commit Message, and Changelog Update before it can be
considered accepted — see `15_RELEASE_PROCESS.md` for the full checklist. Never start the next release until the
current one is accepted.

**Escalation rule:** if uncertain, or if a decision is irreversible or architecturally significant, ask before
proceeding rather than guessing. This includes discovering the repository in an unexpected state (missing files,
conflicting content, evidence of concurrent edits) — stop and report before continuing.

---

## Part 3 — Project Memory (living state — keep this current)

A living snapshot of what is true right now. Update this section whenever the state of the project changes
materially — it exists so a new session never has to reconstruct context from scratch.

**Current state:** `index.html` is a thin shell (Tailwind CDN + `assets/css/site.css`, vanilla JS boot script).
Default **product mode** (`data/site.json` `mode: "product"`) renders jobs-first IA: hero → Target Companies → How I Apply
→ learning chapters. Mobile drawer nav and company cards ship in Milestone 11. Append `?mode=dev` for full handbook
chrome. Regression: `scripts/verify-render.js`, `verify-search.js`, `verify-filters.js`.

**Key incident on record:** early on, 20 previously-committed `.playbook` documents and `.github/copilot-instructions.md`
were found deleted from the working tree with no corresponding action from the reviewing session; circumstantial
evidence pointed to a separate, concurrent AI coding session. See `12_DECISIONS.md` DR-002 for the full record.
**Lesson carried forward:** do not run two agent sessions against the same working tree at once.

**What is authoritative where:**

| Question | Authoritative document |
|---|---|
| What are the rules? | This file (Part 2), backed by `MASTER_BOOTSTRAP_PROMPT.md` |
| What's being built next? | `14_ROADMAP.md` (active milestone) / `25_ROADMAP_ARCHIVE.md` (completed ones) |
| What's being worked on today? | `19_CURRENT_SPRINT.md` |
| Why was X decided? | `12_DECISIONS.md` |
| What changed, and when? | `13_CHANGELOG.md` |

**Open threads carried into future milestones:**

- Ranked multi-source search (Milestone 5).
- The `md/` research reports contain unverified claims that must be checked before becoming part of the published
  company database (Milestone 6).
- No automated tests or CI exist yet (`17_TESTING_GUIDE.md`, `18_GITHUB_WORKFLOW.md` define the target state).

**Archived ideas** (from a pre-Milestone-1 `index.html` comment that was removed — most map onto the current
roadmap already; two didn't yet have a home):

- **Salary intelligence** — a planned content domain (compensation per company/role), no dedicated milestone yet.
  Candidate home: expand `11_COMPANY_SCHEMA.md`'s `Compensation` field, or a future `data/salary.json` if it
  outgrows that — scope as a decision record if/when prioritized, likely alongside Milestone 6 or 7.
- **Mermaid diagrams** — visual diagrams somewhere in the handbook or its docs. No milestone owns this; candidate
  home is `08_UI_GUIDELINES.md` or `.playbook/` documentation itself. Recorded here so it resurfaces during
  Milestone 7 planning.

For the historical record, the removed comment's version history also noted: *"2.1.0 — Switched from Word-first
architecture to HTML-first. Introduced project constitution. Added editorial governance. Added reusable UI
sections. Single-file offline-friendly architecture."* Preserved here since it predates this repository's git
history.
