#!/usr/bin/env node
/**
 * Staleness check for Milestone 14 prerendering (see 12_DECISIONS.md DR-022): regenerates the
 * prerendered fragments from the current data/*.json in memory and fails if index.html, sitemap.xml,
 * or robots.txt on disk don't match — i.e. someone edited data/*.json (or index.html's static shell)
 * without re-running `npm run prerender`. Runs in `npm run verify`, CI, and the local pre-commit hook.
 *
 * This intentionally does NOT write any files itself — only scripts/prerender.js does.
 *
 * Usage: node scripts/verify-prerender.js
 */
const fs = require('fs');
const core = require('./lib/prerender-core.js');

function readIfExists(filePath) {
  return fs.existsSync(filePath) ? fs.readFileSync(filePath, 'utf8') : null;
}

const expected = core.generate();
const actual = {
  indexHtml: readIfExists(core.INDEX_HTML_PATH),
  sitemapXml: readIfExists(core.SITEMAP_PATH),
  robotsTxt: readIfExists(core.ROBOTS_PATH)
};

const checks = [
  ['index.html', expected.indexHtml, actual.indexHtml],
  ['sitemap.xml', expected.sitemapXml, actual.sitemapXml],
  ['robots.txt', expected.robotsTxt, actual.robotsTxt]
];

let ok = true;
checks.forEach(([label, want, got]) => {
  if (want === got) {
    console.log(`OK: ${label} matches data/*.json (prerender is up to date).`);
    return;
  }
  ok = false;
  console.error(`STALE: ${label} does not match what data/*.json currently produces.`);
  if (got == null) {
    console.error(`  ${label} is missing on disk.`);
  } else {
    const len = Math.min(want.length, got.length);
    let i = 0;
    while (i < len && want[i] === got[i]) i++;
    console.error(`  First difference at character ${i} (expected ${want.length} chars, found ${got.length} chars).`);
    console.error('  expected: ...' + want.slice(Math.max(0, i - 40), i + 60) + '...');
    console.error('  actual:   ...' + got.slice(Math.max(0, i - 40), i + 60) + '...');
  }
});

if (!ok) {
  console.error('\nRun `npm run prerender` and commit the result.');
  process.exitCode = 1;
} else {
  console.log('\nAll prerendered files are up to date.');
}
