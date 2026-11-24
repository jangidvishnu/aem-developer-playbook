# Constitution

Full detail: `.playbook/00_PROJECT_OVERVIEW.md` (read before non-trivial change).

1. Never delete information — archive it (`.playbook/12_DECISIONS.md`).
2. Preserve backwards compatibility; no silent rewrites of working content.
3. Content lives in `data/*.json`, never hardcoded in HTML/JS; rendering is separate from content.
4. Vanilla JS + hand-written CSS (`assets/css/site.css`) only — no frameworks/CSS CDN; no new dependency without a
   DR. No request-time build; exception: `npm run prerender` bakes data into committed `index.html`/`sitemap.xml`/
   `robots.txt` (DR-022) and `verify` fails on drift.
5. GitHub Pages + offline + responsive + accessible + print-friendly.
6. Evidence over assumption; mark opinion vs fact.
7. One topic, one authoritative home — no duplication.
8. Reusable render functions, not copy-pasted markup.
9. Publication quality — no placeholders as finished.

## Process

- One milestone at a time; next only after explicit owner accept.
- Architecture changes: Analyze → Plan → Sync docs → Debt review → Implement → Self-review.
- Milestone done → test plan in `17_TESTING_GUIDE.md`, shared with the owner (`15_RELEASE_PROCESS.md`).
