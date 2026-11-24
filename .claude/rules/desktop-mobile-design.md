---
paths:
  - "assets/css/**"
  - "assets/js/**"
  - "index.html"
---

# Desktop + mobile design

Every visual/layout change must work on desktop and mobile. Detail: `.playbook/08_UI_GUIDELINES.md`.

1. **Desktop** (≥1024px): layout, sticky sidebar/header, tables, filters, search.
2. **Mobile** (≤767px): no page horizontal scroll, no crushed tables, usable touch targets; company explorer = cards;
   learning tables may scroll inside a wrap.
3. **Tablet** (~768–1023px): spot-check when breakpoints/sticky/nav change.

Known traps: `table-layout: fixed` + `%` widths (use min-width + `overflow-x: auto` wrap, or cards); desktop-only
sticky/absolute overlapping small screens; filter toolbars forcing horizontal scroll (stack/panel).
