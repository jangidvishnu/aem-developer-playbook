#!/usr/bin/env node
/**
 * Tests for assets/js/filters.js (Milestone 8 + 9).
 * Usage: node scripts/verify-filters.js
 */

const fs = require('fs');
const path = require('path');
const vm = require('vm');

const filtersPath = path.join(__dirname, '..', 'assets', 'js', 'filters.js');
const companiesPath = path.join(__dirname, '..', 'data', 'companies.json');

const code = fs.readFileSync(filtersPath, 'utf8');
const sandbox = { module: { exports: {} }, URLSearchParams };
vm.runInNewContext(code, sandbox);
const { CompanyFilters } = sandbox.module.exports;

const companies = JSON.parse(fs.readFileSync(companiesPath, 'utf8'));
let failed = 0;

function assert(label, cond) {
  if (!cond) {
    console.error('FAIL', label);
    failed++;
  } else {
    console.log('PASS', label);
  }
}

const byType = CompanyFilters.filter(companies, { ...CompanyFilters.defaultState(), companyType: 'Agency' });
assert('agency filter returns only agencies', byType.every(c => c.companyType === 'Agency'));

const india = CompanyFilters.filter(companies, { ...CompanyFilters.defaultState(), hiringIndia: true });
assert('india hiring filter', india.every(c => c.HiringIndia === 'Yes'));

const finance = CompanyFilters.filter(companies, { ...CompanyFilters.defaultState(), industry: 'Finance' });
assert('industry filter returns only Finance', finance.length >= 1 && finance.every(c => c.industry === 'Finance'));

const cloud = CompanyFilters.filter(companies, { ...CompanyFilters.defaultState(), migrationBand: 'cloud' });
assert(
  'migration cloud band',
  cloud.length >= 1 &&
    cloud.every(c => ['Cloud-native', 'Migrated to AEM as a Cloud Service'].includes(c.MigrationStatus))
);

assert('migrationBand cloud', CompanyFilters.migrationBand('Cloud-native') === 'cloud');
assert('migrationBand migrating', CompanyFilters.migrationBand('Migrating to AEM as a Cloud Service') === 'migrating');
assert('migrationBand unknown', CompanyFilters.migrationBand('Unknown') === 'unknown');

const sorted = CompanyFilters.sort(companies, 'name-asc');
assert(
  'name sort ascending',
  sorted[0].name.localeCompare(sorted[sorted.length - 1].name) <= 0
);

const q = CompanyFilters.apply(companies, { ...CompanyFilters.defaultState(), query: 'adobe' });
assert('name query finds Adobe', q.length >= 1 && q[0].id === 'adobe');

const state = {
  ...CompanyFilters.defaultState(),
  companyType: 'Agency',
  industry: 'Consulting',
  hiringIndia: true,
  sourceFilter: 'company'
};
const serialized = CompanyFilters.serializeUrlState(state, 'aem');
const parsed = CompanyFilters.parseUrlState(serialized);
assert('URL round-trip type', parsed.state.companyType === 'Agency');
assert('URL round-trip industry', parsed.state.industry === 'Consulting');
assert('URL round-trip india', parsed.state.hiringIndia === true);
assert('search category not in URL (session-only)', parsed.state.sourceFilter === '' && !serialized.includes('sf_source'));
assert('URL round-trip search q', parsed.searchQuery === 'aem');

assert('hasShareableState when filtered', CompanyFilters.hasShareableState(state, 'aem'));
assert('hasShareableState false when default', !CompanyFilters.hasShareableState(CompanyFilters.defaultState(), ''));

const mockResults = [
  { source: 'company', id: 'adobe', title: 'Adobe' },
  { source: 'chapter', id: 'mission', title: 'Mission' },
  { source: 'glossary', id: 'htl', title: 'HTL' },
  { source: 'owner', id: 'outreach', title: 'Outreach' }
];
const byId = CompanyFilters.companiesById(companies);
const companyOnly = CompanyFilters.filterSearchResults(mockResults, byId, {
  ...CompanyFilters.defaultState(),
  sourceFilter: 'company'
});
assert('search source filter company', companyOnly.length === 1 && companyOnly[0].source === 'company');

const learningOnly = CompanyFilters.filterSearchResults(mockResults, byId, {
  ...CompanyFilters.defaultState(),
  sourceFilter: 'learning'
});
assert('search source filter learning', learningOnly.length === 1 && learningOnly[0].source === 'glossary');

const ownerOnly = CompanyFilters.filterSearchResults(mockResults, byId, {
  ...CompanyFilters.defaultState(),
  sourceFilter: 'owner'
});
assert('search source filter owner', ownerOnly.length === 1 && ownerOnly[0].source === 'owner');

if (failed) process.exit(1);
console.log('All filter tests passed.');
