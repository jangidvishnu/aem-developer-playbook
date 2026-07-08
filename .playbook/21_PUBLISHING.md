# Publishing

## Target outputs

Per `MASTER_BOOTSTRAP_PROMPT.md`, this project ships as four things from one source:

1. **GitHub repository** — the source of truth (this repo).
2. **GitHub Pages website** — the primary reading experience.
3. **Printable handbook** — browser print-to-PDF using the existing print CSS.
4. **PDF book** — a more deliberate, paginated export (target state; not yet built).

## GitHub Pages (Milestone 12)

Because the site has no build step at deploy/request time, GitHub Pages can serve the repository (or a `/docs` or
root path, per GitHub's Pages configuration) directly. Requirements this places on every change:

- No server-side logic — everything must run as static files.
- No absolute local paths — all asset references must resolve correctly when served from a Pages subpath.
- `data/*.json` fetches must use relative paths so they work both locally (file:// or a simple static server) and
  when deployed.
- `index.html`, `sitemap.xml`, and `robots.txt` are committed files, including the parts `npm run prerender`
  generates ahead of time (Milestone 14, DR-022) — Pages never runs that script itself; it only ever serves what's
  already in the repo.

## SEO and crawlability (Milestone 14)

The site's product-mode content (companies, apply guide, learning chapters) is baked into `index.html` at commit
time by `npm run prerender`, plus a generated `sitemap.xml` and `robots.txt` (both from `data/site.json`'s
`seo.siteUrl`) and a static `<link rel="canonical">` / JSON-LD `WebSite` block in `<head>` — see `03_ARCHITECTURE.md`
→ "Prerendering" and `12_DECISIONS.md` DR-022 for the full mechanism and why hydration was deferred. `assets/js/app.js`
still fully re-renders on load for interactivity; the baked HTML exists so crawlers and no-JS clients see real
content without executing JavaScript. `scripts/verify-prerender.js` (part of `npm run verify`) keeps the baked
files from silently drifting out of sync with `data/*.json`.

## Print handbook (implemented today, basic)

The existing `@media print` rules in `index.html` hide interactive chrome (`aside`, `header`, search, theme toggle)
and prevent sections from breaking across page boundaries. This is the foundation for the "printable handbook"
output and should be re-verified any time section markup changes (`17_TESTING_GUIDE.md`'s smoke test covers this).

## PDF book (target state, not yet built)

Planned approach: reuse the print stylesheet as the basis for a dedicated print/export view (e.g. a print-optimized
route or flag that expands all collapsible sections and removes any remaining interactive-only chrome), then
generate a PDF from that view. No specific tool is chosen yet — any addition here goes through a decision record
or the coding standard's dependency rules if it requires anything beyond browser print-to-PDF.

## Offline compatibility

The current architecture (`assets/css/site.css`, no CDN framework since Milestone 11's DR-015) is mostly
offline-friendly already, with one remaining caveat: the Google Fonts import requires network access on first load.
A fully offline mode (a system-fonts fallback, or vendoring the font files) is a candidate future decision, not
required today.

## Publishing checklist (target state, for Milestone 12)

- [ ] Site renders correctly when served from a GitHub Pages subpath, not just from the repo root locally.
- [ ] Print output verified as a complete, readable handbook (`17_TESTING_GUIDE.md`).
- [ ] PDF export produces a paginated, readable document with working internal links/bookmarks where feasible.
- [ ] No broken relative links or asset paths in the deployed environment.
