---
paths:
  - "index.html"
  - "assets/js/**"
  - "scripts/**"
  - "data/**"
---

# Architecture and code

Full detail: `.playbook/03_ARCHITECTURE.md`, `09_DATA_MODEL.md`, `04_CODING_STANDARD.md`, `10_COMPONENT_LIBRARY.md`.

- Flow: `data/*.json` → `Render` (`assets/js/render.js`) → thin `index.html` (fetch + shell + wiring).
- Records: stable `id`; unknown fields `null`/`"Unknown"` (companies: omit); dates ISO 8601.
- All render methods live on `Render` — no bare top-level functions in `index.html`. Render functions are pure:
  args in → markup out, no `fetch()`.
- Escape interpolated text/attrs with `Render.escapeHtml()`; chapter `body` is intentional raw HTML (never escape).
- After `Render` changes: `node scripts/verify-render.js`. Data that changes rendered output → `npm run prerender`.
