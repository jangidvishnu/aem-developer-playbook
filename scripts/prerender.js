#!/usr/bin/env node
/**
 * Bakes the current data/*.json content into index.html (product-mode markup), plus sitemap.xml and
 * robots.txt, so the site has real HTML for crawlers and first paint instead of an empty shell that
 * only fills in after assets/js/app.js runs (Milestone 14, see 12_DECISIONS.md DR-022).
 *
 * assets/js/app.js still re-renders everything on load for full interactivity — this is a first-paint/
 * SEO baseline, not hydration. Run this after any data/*.json edit; scripts/verify-prerender.js
 * (part of `npm run verify` and the pre-commit hook) fails the build if index.html has drifted from it.
 *
 * Usage: node scripts/prerender.js
 */
const fs = require('fs');
const core = require('./lib/prerender-core.js');

const { indexHtml, sitemapXml, robotsTxt } = core.generate();

fs.writeFileSync(core.INDEX_HTML_PATH, indexHtml);
fs.writeFileSync(core.SITEMAP_PATH, sitemapXml);
fs.writeFileSync(core.ROBOTS_PATH, robotsTxt);

console.log('Prerendered:');
console.log(' -', core.INDEX_HTML_PATH);
console.log(' -', core.SITEMAP_PATH);
console.log(' -', core.ROBOTS_PATH);
