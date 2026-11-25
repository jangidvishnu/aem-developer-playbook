#!/usr/bin/env node
/**
 * Dev-only: renders the link-preview card (og:image) to assets/og/og-image.png at 1200×627.
 * Uses the existing Playwright dev dependency — no new packages.
 * Prereqs: npm install && npx playwright install chromium
 * Usage:   node scripts/build-og-image.mjs   (re-run when the title, employer count or URL changes)
 *
 * Text comes from data/*.json (title, employer count, host) so the card matches the site.
 * Colours mirror the light-theme tokens in assets/css/site.css (:root).
 */
import { chromium } from 'playwright';
import { readFileSync, mkdirSync, statSync } from 'fs';
import { dirname, join } from 'path';
import { fileURLToPath, URL } from 'url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const OUT = join(ROOT, 'assets', 'og', 'og-image.png');
const WIDTH = 1200; // keep in sync with Render.OG_IMAGE_WIDTH
const HEIGHT = 627; // keep in sync with Render.OG_IMAGE_HEIGHT
const AUTHOR = 'Vishnu Jangid';

const readJson = name => JSON.parse(readFileSync(join(ROOT, 'data', name), 'utf8'));
const site = readJson('site.json');
const companies = readJson('companies.json');

const title = (site.header && site.header.title) || 'AEM Career Playbook';
const host = new URL(site.seo.siteUrl).host;
const tagline = `${companies.length} AEM employers · apply steps · interview prep (India)`;

const esc = s => String(s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c]);

// Tokens from assets/css/site.css :root (light theme).
const html = `<!doctype html>
<html><head><meta charset="utf-8" />
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=block" rel="stylesheet" />
<style>
  :root { --bg-page:#f8fafc; --text-primary:#0f172a; --text-secondary:#475569; --accent:#2563eb;
          --border:#e2e8f0; --font: Inter, system-ui, sans-serif; }
  * { box-sizing: border-box; margin: 0; }
  html, body { width:${WIDTH}px; height:${HEIGHT}px; }
  body { background: var(--bg-page); font-family: var(--font); color: var(--text-primary);
         display:flex; flex-direction:column; justify-content:space-between; padding: 96px 80px 64px;
         border-top: 16px solid var(--accent); }
  h1 { font-size: 96px; font-weight: 700; letter-spacing: -0.02em; line-height: 1.05; }
  .tagline { margin-top: 28px; font-size: 42px; font-weight: 500; color: var(--text-secondary); line-height: 1.3; }
  .tagline span { white-space: nowrap; }
  .foot { display:flex; justify-content:space-between; align-items:center; border-top: 2px solid var(--border);
          padding-top: 28px; font-size: 32px; }
  .host { color: var(--accent); font-weight: 600; }
  .by { color: var(--text-secondary); }
</style></head>
<body>
  <div><h1>${esc(title)}</h1><p class="tagline">${tagline
    .split(' · ')
    .map(part => `<span>${esc(part)}</span>`)
    .join(' · ')}</p></div>
  <div class="foot"><span class="host">${esc(host)}</span><span class="by">by ${esc(AUTHOR)}</span></div>
</body></html>`;

const browser = await chromium.launch();
try {
  const page = await browser.newPage({ viewport: { width: WIDTH, height: HEIGHT } });
  await page.setContent(html, { waitUntil: 'networkidle' });
  await page.evaluate(() => document.fonts.ready);
  mkdirSync(dirname(OUT), { recursive: true });
  await page.screenshot({ path: OUT, type: 'png', clip: { x: 0, y: 0, width: WIDTH, height: HEIGHT } });
} finally {
  await browser.close();
}

const kb = statSync(OUT).size / 1024;
console.log(`Wrote ${OUT} (${WIDTH}×${HEIGHT}, ${kb.toFixed(1)} KB)`);
if (kb >= 1024) {
  console.error('og-image.png is 1 MB or larger — social previews may drop it.');
  process.exit(1);
}
