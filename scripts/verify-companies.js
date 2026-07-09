#!/usr/bin/env node
/**
 * Validates data/companies.json against 11_COMPANY_SCHEMA.md rules (Milestone 6).
 * Usage: node scripts/verify-companies.js
 */

const fs = require('fs');
const path = require('path');
const { validateCompany } = require('./company-schema');

const file = path.join(__dirname, '..', 'data', 'companies.json');
const companies = JSON.parse(fs.readFileSync(file, 'utf8'));

if (!Array.isArray(companies)) {
  console.error('companies.json must be an array');
  process.exit(1);
}

const ids = new Set();
let errors = [];

companies.forEach((co, i) => {
  errors = errors.concat(validateCompany(co, i));
  if (ids.has(co.id)) errors.push(`duplicate id: ${co.id}`);
  ids.add(co.id);
});

const verified = companies.filter(c => c.verifiedAt);
const ownerVerified = companies.filter(c => c.ownerVerified === true);
const hiringActive = companies.filter(c => c.hiringActive === true);
const ownerPreferred = companies.filter(c => c.ownerPreferred === true);
const cloud = companies.filter(c => Array.isArray(c.products) && c.products.includes('aem-cloud'));
console.log(
  `Companies: ${companies.length} total, ${verified.length} with verifiedAt, ` +
    `${ownerVerified.length} ownerVerified, ${hiringActive.length} hiringActive, ` +
    `${ownerPreferred.length} ownerPreferred, ${cloud.length} AEM Cloud`
);

// Scaling size guard (Milestone 13, see 12_DECISIONS.md DR-020). data/companies.json is fetched in
// full on every page load with no chunking today — fine at current volume, but the chosen future
// strategy (paginated data/companies/page-N.json + manifest) needs to actually get built once this
// threshold is crossed, not silently forgotten. This never fails the build, only warns loudly.
const COMPANIES_COUNT_WARN_THRESHOLD = 400;
const COMPANIES_SIZE_WARN_THRESHOLD_BYTES = 800 * 1024;
const fileSizeBytes = fs.statSync(file).size;
if (companies.length > COMPANIES_COUNT_WARN_THRESHOLD || fileSizeBytes > COMPANIES_SIZE_WARN_THRESHOLD_BYTES) {
  console.warn(
    `WARNING: data/companies.json is ${companies.length} companies / ${Math.round(fileSizeBytes / 1024)}KB — ` +
      `past the DR-020 threshold (${COMPANIES_COUNT_WARN_THRESHOLD} companies / ${Math.round(COMPANIES_SIZE_WARN_THRESHOLD_BYTES / 1024)}KB). ` +
      'Time to implement the chunked-fetch strategy described in 12_DECISIONS.md DR-020.'
  );
}

if (errors.length) {
  errors.forEach(e => console.error('FAIL', e));
  process.exit(1);
}

console.log('All company records pass schema validation and hiring gate.');
