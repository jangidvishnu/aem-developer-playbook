/**
 * Company seed loader — reads data/company-sources.json (single source for new rows).
 * Dev-only; consumed by scripts/build-companies.js.
 */

const fs = require('fs');
const path = require('path');

const sourcesPath = path.join(__dirname, '..', 'data', 'company-sources.json');

function loadSources() {
  return JSON.parse(fs.readFileSync(sourcesPath, 'utf8'));
}

function builtwithPublicUrl(domain) {
  const host = String(domain).replace(/^https?:\/\//, '').split('/')[0];
  return `https://builtwith.com/${host}`;
}

/** @returns {Array<object>} */
function getBuiltwithDomainMap() {
  const seeds = loadSources().builtwithSeeds;
  return Array.isArray(seeds) ? seeds : [];
}

/**
 * Build company rows from JSON seeds (deduped by id).
 * @param {import('./company-schema').emptyCompany} emptyCompany
 */
function buildCompanyRecords(emptyCompany) {
  const { records } = loadSources();
  const list = Array.isArray(records) ? records : [];
  const seen = new Set();
  return list.filter(r => {
    if (!r || !r.id || seen.has(r.id)) return false;
    seen.add(r.id);
    return true;
  });
}

module.exports = {
  buildCompanyRecords,
  getBuiltwithDomainMap,
  builtwithPublicUrl,
  loadSources
};
