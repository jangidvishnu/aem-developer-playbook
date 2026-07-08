#!/usr/bin/env node
/**
 * Browser smoke test for search UI (dev-time only).
 * Prereqs: npm install && npx playwright install chromium
 * Usage: npm run ui-smoke
 */
import { chromium } from 'playwright';

const BASE = process.env.BASE_URL || 'http://localhost:3456';
const HEADED = /^(1|true|yes)$/i.test(process.env.HEADED || '');

async function main() {
  const browser = await chromium.launch({
    headless: !HEADED,
    slowMo: HEADED ? 250 : 0
  });
  const page = await browser.newPage({ viewport: { width: 1280, height: 800 } });
  const errors = [];
  page.on('pageerror', err => errors.push(err.message));

  await page.goto(BASE, { waitUntil: 'networkidle' });

  const search = page.locator('#search-desktop');
  await search.waitFor({ state: 'visible', timeout: 10000 });

  await search.fill('Adobe');
  await page.waitForSelector('.search-panel.is-open .search-result', { timeout: 8000 });
  if ((await page.locator('.search-result').count()) < 1) throw new Error('Adobe should return results');

  await search.fill('AEM');
  await page.waitForSelector('.search-panel.is-open .search-result', { timeout: 8000 });

  await page.locator('#search-wrap .search-facet-chip', { hasText: 'Apply' }).click();
  await search.fill('ad');
  await page.waitForSelector('#search-wrap .search-panel.is-open .search-result', { timeout: 8000 });
  const adCount = await page.locator('#search-wrap .search-result').count();
  if (adCount < 1) throw new Error('Apply + ad should widen to All and show results');

  if (errors.length) console.warn('Console errors:', errors);
  console.log('UI smoke search: PASS');
  await browser.close();
}

main().catch(err => {
  console.error('UI smoke search: FAIL');
  console.error(err.message || err);
  process.exitCode = 1;
});
