# Publishing

## Target outputs

Per `MASTER_BOOTSTRAP_PROMPT.md`, this project ships as four things from one source:

1. **GitHub repository** — the source of truth (this repo).
2. **GitHub Pages website** — the primary reading experience.
3. **Printable handbook** — browser print-to-PDF using the existing print CSS.
4. **PDF book** — a more deliberate, paginated export (target state; not yet built).

## GitHub Pages (Milestone 12)

Because the site has no build step, GitHub Pages can serve the repository (or a `/docs` or root path, per GitHub's
Pages configuration) directly. Requirements this places on every change:

- No server-side logic — everything must run as static files.
- No absolute local paths — all asset references must resolve correctly when served from a Pages subpath.
- `data/*.json` fetches must use relative paths so they work both locally (file:// or a simple static server) and
  when deployed.

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

The single-file, CDN-Tailwind architecture is mostly offline-friendly already, with one caveat: Tailwind (via CDN)
and the Google Fonts import require network access on first load. A fully offline mode (vendored Tailwind build or
system fonts fallback) is a candidate future decision, not required for Milestone 1.

## Publishing checklist (target state, for Milestone 12)

- [ ] Site renders correctly when served from a GitHub Pages subpath, not just from the repo root locally.
- [ ] Print output verified as a complete, readable handbook (`17_TESTING_GUIDE.md`).
- [ ] PDF export produces a paginated, readable document with working internal links/bookmarks where feasible.
- [ ] No broken relative links or asset paths in the deployed environment.
