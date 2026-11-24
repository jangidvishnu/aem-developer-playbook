# AEM Career Playbook

Static, data-driven site for Adobe Experience Manager (AEM) developers in India: employer list
(`data/companies.json`), apply steps, learning chapters, interview prep.

- **Production:** https://aemplaybook.pages.dev/ (`master` → Cloudflare Pages)
- **Staging:** https://jangidvishnu.github.io/aem-developer-playbook/ (`stage` → GitHub Pages)

Rules: `.claude/rules/` (some load only when matching files are touched). Full docs: `.playbook/`.

## Check before work

Active work `.playbook/19_CURRENT_SPRINT.md` · roadmap `14_ROADMAP.md` · overview `00_PROJECT_OVERVIEW.md` ·
decisions `12_DECISIONS.md` · changelog `13_CHANGELOG.md`. Read other `.playbook/` docs only when the task touches
that topic.

## Commands

| Task | Command |
|---|---|
| Serve locally (`file://` breaks `fetch`) | `npx serve -p 3456` |
| All verify scripts (pre-commit hook also runs this + lint) | `npm run verify` |
| ESLint + Prettier | `npm run lint` |
| Playwright UI smoke (starts its own server) | `npm run ui-smoke` |
| Re-bake data into `index.html` / sitemap / robots | `npm run prerender` |
| Company `careersUrl` link check (rewrites `scripts/data/link-report.json`) | `npm run check-links` |
| Company schema only | `node scripts/verify-companies.js` |
