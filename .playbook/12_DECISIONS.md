# Decision Records

Format: one entry per decision, newest first. Each entry states the context, the decision, and the trade-off
accepted. Decisions are never deleted — if a decision is later reversed, add a new entry that supersedes it and
mark the old one as superseded.

---

---

---

## DR-015 — Presentation polish without a build step (Milestone 11)

**Date:** 2026-07-07
**Context:** Post–M11 browser review surfaced duplicate pagination, native dropdown styling, text-only icon actions,
and inconsistent dark-mode tokens. Phases A–E aimed for GitBook/MS Learn–grade presentation while keeping vanilla JS
and GitHub Pages compatibility.
**Decision:** Add `assets/js/icons.js` (inline Lucide-style SVG helper), `assets/js/ui.js` (theme via `data-theme`,
custom `UI.select`, scroll-spy, command palette), and a token-driven `assets/css/site.css` layout (~1700px max width).
Company discovery uses a unified `.company-explorer` card, **10 rows/page** with padded tbody for stable height, and
custom selects instead of native `<select>` for filter dropdowns. Favicon at `assets/icons/favicon.svg`.
**Trade-off accepted:** More bespoke CSS/JS to maintain; no icon font or component framework. Glossary/interview tables
keep 25 rows/page (company table only uses 10).
**Follow-up:** Owner browser sign-off per `17_TESTING_GUIDE.md` Milestone 11 before Milestone 12.

## DR-014 — Product vs dev visibility split (Milestone 11)

**Date:** 2026-07-07
**Context:** Milestone 11 ships a jobs-first public UI while the owner still needs the full handbook (Project Status,
Mission, version label, all chapters) for maintenance.
**Decision:** `data/site.json` field `mode: "product" | "dev"` controls visibility. Default **product** hides dev-only
chapters (`navigation.devOnlyChapterIds`), Project Status dashboard, version label, and roadmap panels above companies.
Append **`?mode=dev`** to the URL to restore the full handbook without a separate deployment. Custom layout/CSS in
`assets/css/site.css` supplements Tailwind; no build step.
**Trade-off accepted:** Two experiences share one `index.html`; chapter section anchors use stable `chapter.id` values
instead of `#ch0`…`#chN` (search index updated accordingly).
**Follow-up:** Browser test plan in `17_TESTING_GUIDE.md` Milestone 11.

## DR-013 — Shareable discovery filter URLs use query params (Milestone 9)

**Date:** 2026-07-07
**Context:** Milestone 9 adds shareable filter state for company table and search-panel facets. Chapter navigation
already uses `#ch0` hash anchors.
**Decision:** Serialize filter state as **query parameters** (`cf_type`, `cf_industry`, `cf_migration`, `cf_q`,
`cf_sort`, boolean flags `cf_india`/`cf_aem`/`cf_cloud`/`cf_verified`, search-only `sf_source`, global search `q`).
Use `history.replaceState` on filter changes — no full page reload. Hash reserved for in-page anchors only.
**Trade-off accepted:** URLs are longer than a single hash blob; params are human-readable and GitHub Pages compatible.
**Follow-up:** `CompanyFilters.parseUrlState` / `serializeUrlState` in `assets/js/filters.js`; browser steps in
`17_TESTING_GUIDE.md` Milestone 9.

## DR-009 — Resequence Milestones 8–12: product before publish

**Date:** Post–Milestone 7 planning
**Context:** Owner requested company pipeline, filters, owner playbook, and minimal product UI **before** GitHub
Pages / publishing. Original plan had Publishing as Milestone 8.
**Decision:** New order: **8** Company Pipeline & Hiring Gate → **9** Discovery Filters → **10** Owner Playbook →
**11** Minimal Product UI → **12** Publishing. Publish only after hire-focused data, filters, owner content, and
jobs-first mobile UI are in place.
**Trade-off accepted:** No public URL until Milestone 12; local serve remains the dev workflow until then.
**Follow-up:** Update `21_PUBLISHING.md` and `15_RELEASE_PROCESS.md` milestone references.

## DR-010 — Milestone 8 expanded: fresh research, no cap, table filters

**Date:** Milestone 8 planning (post–M7)
**Context:** Owner wants the fullest hire-verified company list possible, fresh evidence (not md copy-paste), India-first
priority, client-side filter/sort on the company table, and curated BuiltWith-style domain seeds (no paid API).
**Decision:** Expand Milestone 8 to include: (1) fresh research workflow with `md/` reference-only; (2) no row-count cap;
(3) `assets/js/filters.js` + company table filter/sort (folded from planned M9 table work); (4) curated domain-map
manifest (paid BuiltWith API removed per DR-012); (5) `LastHiringVerified` on schema. Milestone 9 retains search-panel facets and shareable
filter URLs only.
**Trade-off accepted:** M8 is larger and research-heavy; M9 scope reduced accordingly.
**Follow-up:** Implement per `14_ROADMAP.md` Milestone 8 section.

---

## DR-012 — No paid BuiltWith API (accepted — Milestone 8, owner-directed)

**Date:** 2026-07-07
**Context:** Owner will not purchase BuiltWith Lists API subscription.
**Decision:** Remove `scripts/builtwith-api.js` and all `BUILTWITH_API_KEY` / Lists API ingest paths. Keep curated
`data/company-sources.json` seed list and optional public `builtwith.com/{domain}` reference URLs in `Evidence` (manual
lookup only). Grow the company list via fresh research and expanding the domain map — not bulk API ingest.
**Trade-off accepted:** No automated discovery of thousands of AEM domains; seed map remains maintainable by hand.
**Supersedes (partial):** DR-010 item (4) optional paid API adapter; DR-011 API manifest merge path.
**Follow-up:** Archive `data/manifests/builtwith-input.json` config; seed-only `ingest-builtwith-candidates.js`.

## DR-011 — BuiltWith watchlist promotion (accepted — Milestone 8, owner-directed)

**Date:** 2026-07-07
**Context:** Owner noted many AEM employers are missed when requiring Tier 1–2 Adobe evidence only; service firms
have hundreds of AEM clients; product employers often hire AEM talent in low capacity but still offer viable roles.
BuiltWith Lists API can surface thousands of AEM CMS domains.
**Decision:** Add a **watchlist promotion path** alongside DR-008: rows may enter `companies.json` when (1) BuiltWith
or equivalent Tier-4 tech detection is recorded in `Evidence` with explicit tier labelling in `Notes`, (2) an official
`careersUrl` exists, and (3) `HiringIntensity` is `Low` (or `Medium` when Tier-2 evidence is also present). Tier-4-only
rows remain `Status: Verified` but must not be presented as Adobe case-study confirmed — upgrade `Evidence` when
Tier 1–2 is found. Curated seeds live in `data/company-sources.json` and `data/manifests/builtwith-candidates.json`
(paid API removed per DR-012).
**Trade-off accepted:** Larger public list with more inference-labelled rows; user filters by `HiringIntensity` to
separate steady vs sporadic employers.
**Supersedes (partial):** DR-008 “Tier 4 never sufficient for `usesAEM`” for **promotion** only — Tier 4 + careers is
now sufficient at Low intensity. DR-008 archive rules unchanged for rows without careers/hiring URLs.
**Follow-up:** `data/company-sources.json`, `scripts/company-records.js`, `ingest-builtwith-candidates.js`,
`scripts/build-companies.js`, `07_RESEARCH_GUIDE.md`.

## DR-008 — Company hiring gate + BuiltWith ingest (accepted — Milestone 8)

**Date:** Milestone 8 planning
**Context:** Owner wants hire-focused employers only; BuiltWith and similar sources are candidate ingest, not proof.
**Decision:** Ingest BuiltWith into review manifests only. Promote to `companies.json` when AEM usage is Tier 1–2 and
`HiringAEM` is true with `AEMHiringEvidence` URL(s). Non-hiring rows archived to `data/manifests/company-candidates.json`.
**Trade-off accepted:** Smaller public list than raw tech-detect lists; manual verification per promotion.
**Follow-up:** `scripts/hiring-gate.js`, `verify-companies.js`, `11_COMPANY_SCHEMA.md`.

## DR-007 — Milestone 7 learning content defaults

**Date:** Milestone 7 (start)
**Context:** Milestone 7 open questions (content minimums, roadmap titles, new chapters, templates tone, field
rename) were scoped with default proposals. The project owner directed work to start on Milestone 7.
**Decision:** Adopt scoped defaults: minimum counts (30 glossary, 15 technologies, 2 career paths, 20 interviews,
5 templates, 10 resources, 3 roadmaps); roadmap ids `aem-foundation`, `cloud-eds`, `experience-platform`; add
`glossary` and `interview-prep` chapters; generic templates only; defer `reading` → `readingTime` rename.
**Trade-off accepted:** Content is seed-quality reference material (official-doc sourced) — expandable in later
milestones without schema changes.
**Follow-up:** None open unless the owner overrides minimums or roadmap split.

## DR-006 — Milestone 6 verification defaults (25 verified, 100-row cap, pagination 25)

**Date:** Milestone 6 (start)
**Context:** Milestone 6 open questions (verified minimum, unverified ingest cap, pagination size) were scoped with
default proposals. The project owner accepted Milestone 5 and directed work to proceed to Milestone 6 without
explicitly re-stating each default.
**Decision:** Adopt the scoped defaults: (1) acceptance requires **25 `Status: "Verified"`** companies with
`Evidence` and `LastVerified`; (2) additional candidates may be ingested as `Status: "Unverified"` up to **100
total rows** in `data/companies.json`; (3) company table pagination at **25 rows per page**.
**Trade-off accepted:** Verification work is front-loaded into Milestone 6 and may span multiple sessions; unverified
rows are visible in search/table but clearly marked and never `usesAEM: true` without evidence.
**Follow-up:** None open unless the owner overrides any of the three numbers.

## DR-005 — Accept that local viewing requires a server once Milestone 3 introduces `fetch()`

**Date:** Milestone 3
**Context:** Milestone 3 moves `PLAYBOOK.chapters`/`PLAYBOOK.companies` into `data/*.json`, fetched via
`fetch()` at load time. Browsers block `fetch()` against `file://` URLs under their default CORS policy, which
means `index.html` can no longer be viewed by double-clicking it locally — it must be served over HTTP (any static
server: `npx serve`, `python -m http.server`, the VS Code/Cursor Live Preview extension already configured in this
repo's `.vscode/settings.json`, etc.). This changes a workflow that has been true since the project's first commit.
**Decision:** Accept the trade-off rather than avoid it (e.g. via a `data/chapters.js` global-variable wrapper
instead of `.json` + `fetch()`), because `MASTER_BOOTSTRAP_PROMPT.md` explicitly mandates JSON as the primary data
source, and because the deployed site (GitHub Pages) is entirely unaffected — this only changes local development,
not production. `17_TESTING_GUIDE.md`'s smoke test is updated accordingly.
**Trade-off accepted:** Contributors must run one command (or use an editor's built-in live-preview feature) before
viewing local changes, instead of double-clicking `index.html`. In exchange, the data layer conforms to the
constitution's explicit JSON mandate and unlocks the same `fetch()`-based pattern for every future data file
(`technologies.json`, `roadmaps.json`, etc. in later milestones).
**Follow-up:** None open. Flagged to and accepted by the project owner before implementation began.

## DR-004 — Restructure `.playbook/` for AI token efficiency: merge core docs, archive roadmap history, add Cursor rules

**Date:** Post-Milestone-2
**Context:** Measuring every `.playbook/` file directly showed the 26 governance documents total ~28,000 tokens,
and `.github/copilot-instructions.md` mandated reading 7 of them in full (`MASTER_BOOTSTRAP_PROMPT.md`,
`01_AI_CONSTITUTION.md`, `02_PROJECT_MEMORY.md`, `03_ARCHITECTURE.md`, `09_DATA_MODEL.md`, `14_ROADMAP.md`,
`19_CURRENT_SPRINT.md`) before *any* change, regardless of relevance — roughly 10,000 tokens paid on every session
even for a trivial, unrelated task. `14_ROADMAP.md` alone had grown to ~3,400 tokens by keeping full historical
detail for every completed milestone forever.
**Decision:**
1. Merge `00_PROJECT_OVERVIEW.md`, `01_AI_CONSTITUTION.md`, and `02_PROJECT_MEMORY.md` into one file
   (`00_PROJECT_OVERVIEW.md`), deduplicating overlapping content. The other two are kept as short pointer stubs
   (not deleted) so every existing cross-reference across `.playbook/` continues to resolve.
2. Move completed milestones' full Goal/Scope/Estimates/Acceptance-Criteria/Definition-of-Done/review detail out of
   `14_ROADMAP.md` into a new `25_ROADMAP_ARCHIVE.md`. The active roadmap keeps only the milestone sequence table
   and a short summary + link per completed milestone.
3. Add `.cursor/rules/` (`constitution.mdc`, `current-state.mdc` — both `alwaysApply: true` — plus
   `coding-standard.mdc`, `architecture.mdc`, `company-data.mdc`, `editorial-style.mdc`, each scoped with `globs:`
   to only auto-attach when relevant files are open) so Cursor sessions get the right context automatically instead
   of a manual "read these N files" instruction.
4. Update `.github/copilot-instructions.md` to reflect the new structure and note that Cursor users get most of
   this automatically via rules.
**Trade-off accepted:** An extra indirection (stub files, an archive file) to navigate for anyone specifically
looking for the old `01_AI_CONSTITUTION.md`/`02_PROJECT_MEMORY.md` files or historical milestone detail, in
exchange for an estimated ~68% reduction in the token cost paid on every session (~10,000 → ~3,200 tokens for a
typical code-touching task, less for anything that doesn't touch code).
**Follow-up:** None open. No information was deleted — this is pure reorganization; full historical and
constitutional content still exists, just relocated and no longer force-read by default.

## DR-003 — Split Milestone 2 into a smaller "Render Function Extraction" step, deferring data migration to Milestone 3

**Date:** Post-Milestone-1 (pre-Milestone-2 planning)
**Context:** A Lead-Architect PR review of Milestone 1 found that the roadmap's original Milestone 2 description
("split `index.html`'s inline `PLAYBOOK` object and rendering loop into: a thin HTML shell, a `data/` fetch layer,
and named render functions") bundled two independently-testable concerns — extracting render functions, and
migrating data to `data/*.json` with `fetch()` — into a single milestone. It also silently overlapped with
Milestone 4 ("Renderer — implement the named render functions"), already planned as a separate, later step.
Combining both concerns violates the roadmap's own "one responsibility at a time" principle and the "small,
independently testable, reversible" requirement given for Milestone 2 specifically.
**Decision:** Narrow Milestone 2 to render-function extraction only: `renderSidebar`, `renderChapter`, and
`renderCompanyTable` are extracted as named, pure functions operating on `PLAYBOOK.chapters` / `PLAYBOOK.companies`
exactly where that data already lives in `index.html`. No data migration, no `fetch()`, no loading states in this
milestone — those move to Milestone 3 (Data Model), which now also absorbs the "move data out of `index.html`" work
previously implied by Milestone 2. Milestone 4 (Renderer) is narrowed in turn to extending the render-function set
to content types that don't exist in the UI yet (hero, roadmap, dashboard, footer, search), once Milestone 3 gives
them a data source.
**Trade-off accepted:** One more milestone-sequencing update to keep synchronized across `14_ROADMAP.md`,
`03_ARCHITECTURE.md`, and `10_COMPONENT_LIBRARY.md`, in exchange for a Milestone 2 that is genuinely small, has one
objective pass/fail test (byte-identical rendered output), and is trivially revertible (one file, one `<script>`
block, no data changes).
**Follow-up:** None open — `14_ROADMAP.md`, `03_ARCHITECTURE.md`, and `10_COMPONENT_LIBRARY.md` were updated in the
same pass that introduced this decision record.

## DR-002 — Recover from the Milestone 1 repository-integrity incident by rewriting, not restoring, the stub docs

**Date:** Milestone 1
**Context:** An Architecture Review found that all 20 committed `.playbook/00–19` files and
`.github/copilot-instructions.md` were missing from the working tree, while still present as one-line stubs in git
history (48–197 bytes each). Five newer, never-committed docs (`20`–`24`) were also missing. No delete command had
been run by the reviewing session; `.git/refs/codex/...` checkpoint refs indicate a separate AI coding session had
operated on this repository.
**Decision:** Do not `git checkout` the old stub content back from history. The stubs were themselves a violation
of the "publication quality, not placeholders" rule, so restoring them would restore a known problem. Instead,
Milestone 1 writes real, complete content for all 25 documents from scratch, using `MASTER_BOOTSTRAP_PROMPT.md` as
the source spec.
**Trade-off accepted:** Slightly more up-front writing effort in Milestone 1, in exchange for never having placeholder
documentation checked in again.
**Follow-up:** Confirm with the project owner whether another agent session/window was concurrently open on this
repository, and avoid running two sessions against the same working tree going forward (see `02_PROJECT_MEMORY.md`).

## DR-001 — Adopt milestone-based delivery instead of a flat task backlog

**Date:** Milestone 1
**Context:** `MASTER_BOOTSTRAP_PROMPT.md` requires an implementation roadmap split into independently testable
milestones, implemented one at a time, only after roadmap approval.
**Decision:** Roadmap recorded in `14_ROADMAP.md` with 8 milestones (Repository Foundation → Publishing). Each
milestone lists explicit in-scope and out-of-scope items and acceptance criteria before implementation starts.
**Trade-off accepted:** Slower to reach visible feature work, in exchange for avoiding the duplicated/contradictory
state that a flat backlog already produced once in this repository's short history.

---

## Template for new entries

```
## DR-00N — <short decision title>

**Date:** <milestone or date>
**Context:** <what prompted this decision>
**Decision:** <what was decided>
**Trade-off accepted:** <what was given up>
**Follow-up:** <any open action items, optional>
```
