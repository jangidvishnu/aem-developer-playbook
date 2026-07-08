#!/usr/bin/env node
/**
 * Browser smoke test for Target Companies table + filter bar layout.
 * Prereqs: npm install && npx playwright install chromium
 */
import { chromium } from 'playwright';
import { mkdir, writeFile } from 'node:fs/promises';
import { join } from 'node:path';

const BASE = process.env.BASE_URL || 'http://localhost:3456';
const HEADED = /^(1|true|yes)$/i.test(process.env.HEADED || '');

function assertInside(outer, inner, label) {
  if (!outer || !inner) throw new Error(`${label}: missing bounding box`);
  const iconCenterY = inner.y + inner.height / 2;
  if (iconCenterY < outer.y - 1 || iconCenterY > outer.y + outer.height + 1) {
    throw new Error(`${label}: not vertically aligned inside field`);
  }
  if (inner.x < outer.x - 1 || inner.x > outer.x + 36) {
    throw new Error(`${label}: not positioned at left of field`);
  }
}

async function main() {
  const browser = await chromium.launch({
    headless: !HEADED,
    slowMo: HEADED ? 200 : 0
  });
  const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });
  const errors = [];
  page.on('pageerror', err => errors.push(err.message));

  await page.goto(BASE, { waitUntil: 'networkidle' });
  await page.locator('#company-table-container').scrollIntoViewIfNeeded();
  await page.waitForSelector('.company-table--product', { timeout: 10000 });

  const table = page.locator('.company-table--product');
  const wrap = page.locator('.company-table-desktop');
  const tableBox = await table.boundingBox();
  const wrapBox = await wrap.boundingBox();
  if (!tableBox || !wrapBox) throw new Error('Company table/wrap missing');
  if (tableBox.width < wrapBox.width * 0.92) {
    throw new Error(`Table not using full width (${Math.round(tableBox.width)}px of ${Math.round(wrapBox.width)}px)`);
  }

  const input = page.locator('.company-filters__search-field input');
  const icon = page.locator('.company-filters__search-icon');
  await input.waitFor({ state: 'visible' });
  assertInside(await input.boundingBox(), await icon.boundingBox(), 'Company search icon');

  const headers = page.locator('.company-table--product thead th');
  if (await headers.count() !== 5) throw new Error('Expected 5 company table columns');

  const india = page.locator('.company-table__th--india');
  const careers = page.locator('.company-table__th--careers');
  const indiaBox = await india.boundingBox();
  const careersBox = await careers.boundingBox();
  if (!indiaBox || !careersBox) throw new Error('India/Careers headers not visible');
  const gap = careersBox.x - (indiaBox.x + indiaBox.width);
  if (gap > 48) throw new Error(`Excessive gap between India and Careers columns (${Math.round(gap)}px)`);

  const companyCell = page.locator('.company-table__name').first();
  const typeCell = page.locator('.company-table__type').first();
  const companyBox = await companyCell.boundingBox();
  const typeBox = await typeCell.boundingBox();
  if (!companyBox || !typeBox) throw new Error('Company/Type cells not visible');
  const midGap = typeBox.x - (companyBox.x + companyBox.width);
  if (midGap > 64) throw new Error(`Excessive gap between Company and Type columns (${Math.round(midGap)}px)`);

  const tipBtn = page.locator('.company-table__th--careers [data-table-tip]');
  const tipBox = await tipBtn.boundingBox();
  const careersThBox = await careers.boundingBox();
  if (!tipBox || !careersThBox) throw new Error('Careers tip/header box missing');
  if (tipBox.x + tipBox.width > careersThBox.x + careersThBox.width + 4) {
    throw new Error('Careers header tip icon clipped outside header cell');
  }

  await page.setViewportSize({ width: 390, height: 844 });
  await page.locator('#company-table-container').scrollIntoViewIfNeeded();
  assertInside(
    await page.locator('.company-filters__search-field input').boundingBox(),
    await page.locator('.company-filters__search-icon').boundingBox(),
    'Mobile company search icon'
  );
  const mobileSearch = await page.locator('.company-filters__search').boundingBox();
  const mobileSort = await page.locator('.company-filters__sort').boundingBox();
  if (!mobileSearch || !mobileSort) throw new Error('Mobile search/sort missing');
  const filterGap = mobileSort.y - (mobileSearch.y + mobileSearch.height);
  if (filterGap > 16) throw new Error(`Mobile filter gap too large (${Math.round(filterGap)}px)`);

  // Functional regression coverage (search filtering, focus retention, pagination):
  // a prior refactor left the visible table wired to a CSS selector that no longer
  // existed, so typing and Next/Prev silently did nothing while layout checks still passed.
  await page.setViewportSize({ width: 1280, height: 900 });
  await page.locator('#company-table-container').scrollIntoViewIfNeeded();
  const searchInput = page.locator('.company-filters__search-field input');
  await searchInput.click();
  await searchInput.type('adobe', { delay: 30 });
  await page.waitForTimeout(150);
  const focusedOnSearch = await page.evaluate(() =>
    document.activeElement === document.querySelector('.company-filters__search-field input'));
  if (!focusedOnSearch) throw new Error('Search input lost focus while typing');
  const filteredRows = await page.locator('.company-table--product tbody tr:not(.company-table__pad)').allTextContents();
  if (!filteredRows.length || !filteredRows.some(r => /adobe/i.test(r))) {
    throw new Error('Search query did not filter the visible table');
  }
  await searchInput.fill('');
  await page.waitForTimeout(150);

  const firstRowBefore = await page.locator('.company-table--product tbody tr:not(.company-table__pad)').first().textContent();
  const nextBtn = page.locator('[data-company-next]').first();
  if (await nextBtn.count()) {
    await nextBtn.click();
    await page.waitForTimeout(150);
    const firstRowAfter = await page.locator('.company-table--product tbody tr:not(.company-table__pad)').first().textContent();
    if (firstRowBefore.trim() === firstRowAfter.trim()) {
      throw new Error('Pagination Next did not change the visible table rows');
    }
  }

  if (errors.length) console.warn('Console errors:', errors);
  console.log('UI smoke companies: PASS');
  await browser.close();
}

main().catch(async err => {
  console.error('UI smoke companies: FAIL');
  console.error(err.message || err);
  try {
    const browser = await chromium.launch({ headless: true });
    const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });
    await page.goto(process.env.BASE_URL || 'http://localhost:3456', { waitUntil: 'networkidle' });
    await page.locator('#company-table-container').scrollIntoViewIfNeeded();
    const dir = join(process.cwd(), 'scripts', '.ui-smoke-artifacts');
    await mkdir(dir, { recursive: true });
    const shot = join(dir, 'companies-fail.png');
    await page.screenshot({ path: shot, fullPage: false });
    await writeFile(join(dir, 'companies-fail.txt'), String(err.message || err));
    console.error('Screenshot:', shot);
    await browser.close();
  } catch (e) {
    console.error('Could not capture failure screenshot:', e.message || e);
  }
  process.exitCode = 1;
});
