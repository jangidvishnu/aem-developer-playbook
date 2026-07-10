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
assert(
  'agency filter returns only agencies',
  byType.every(c => c.companyType === 'Agency')
);

const india = CompanyFilters.filter(companies, { ...CompanyFilters.defaultState(), hiringIndia: true });
assert(
  'india hiring filter',
  india.every(c => c.hiringIndia === true)
);

const finance = CompanyFilters.filter(companies, { ...CompanyFilters.defaultState(), industry: 'Finance' });
assert('industry filter returns only Finance', finance.length >= 1 && finance.every(c => c.industry === 'Finance'));

const cloud = CompanyFilters.filter(companies, { ...CompanyFilters.defaultState(), aemCloud: true });
assert('aem cloud filter', cloud.length >= 1 && cloud.every(c => (c.products || []).includes('aem-cloud')));

const active = CompanyFilters.filter(companies, { ...CompanyFilters.defaultState(), hiringActive: true });
assert('hiringActive filter', active.length >= 1 && active.every(c => c.hiringActive === true));

const preferred = CompanyFilters.filter(companies, { ...CompanyFilters.defaultState(), ownerPreferred: true });
assert('ownerPreferred filter', preferred.length >= 1 && preferred.every(c => c.ownerPreferred === true));

assert('isHiringActive helper', CompanyFilters.isHiringActive({ hiringActive: true }) === true);
assert('isOwnerPreferred helper', CompanyFilters.isOwnerPreferred({ ownerPreferred: true }) === true);

const byProduct = CompanyFilters.filter(companies, { ...CompanyFilters.defaultState(), product: 'assets' });
assert('product filter assets', byProduct.length >= 1 && byProduct.every(c => (c.products || []).includes('assets')));

assert('isAemCloud helper', CompanyFilters.isAemCloud({ products: ['sites', 'aem-cloud'] }) === true);
assert('isAemCloud false', CompanyFilters.isAemCloud({ products: ['sites'] }) === false);

const sorted = CompanyFilters.sort(companies, 'name-asc');
assert('name sort ascending', sorted[0].name.localeCompare(sorted[sorted.length - 1].name) <= 0);

const q = CompanyFilters.apply(companies, { ...CompanyFilters.defaultState(), query: 'adobe' });
assert('name query finds Adobe', q.length >= 1 && q[0].id === 'adobe');

const state = {
  ...CompanyFilters.defaultState(),
  companyType: 'Agency',
  industry: 'Consulting',
  hiringIndia: true,
  hiringActive: true,
  ownerPreferred: true,
  product: 'sites',
  sourceFilter: 'company'
};
const serialized = CompanyFilters.serializeUrlState(state, 'aem');
const parsed = CompanyFilters.parseUrlState(serialized);
assert('URL round-trip type', parsed.state.companyType === 'Agency');
assert('URL round-trip industry', parsed.state.industry === 'Consulting');
assert('URL round-trip india', parsed.state.hiringIndia === true);
assert('URL round-trip hiringActive', parsed.state.hiringActive === true);
assert('URL round-trip ownerPreferred', parsed.state.ownerPreferred === true);
assert('URL round-trip product', parsed.state.product === 'sites');
assert('search category not in URL (session-only)', parsed.state.sourceFilter === '' && !serialized.includes('sf_source'));
assert('URL round-trip search q', parsed.searchQuery === 'aem');
assert('URL contains cf_active', serialized.includes('cf_active=1'));
assert('URL contains cf_preferred', serialized.includes('cf_preferred=1'));

assert('hasShareableState when filtered', CompanyFilters.hasShareableState(state, 'aem'));
assert('hasShareableState false when default', !CompanyFilters.hasShareableState(CompanyFilters.defaultState(), ''));

assert('hasActiveFilters false by default', !CompanyFilters.hasActiveFilters(CompanyFilters.defaultState()));
assert('hasActiveFilters true with query', CompanyFilters.hasActiveFilters({ ...CompanyFilters.defaultState(), query: 'adobe' }));
assert('resetFilters clears query', CompanyFilters.resetFilters().query === '');

const locOpts = CompanyFilters.locationsFrom(companies);
assert('locationsFrom returns options', locOpts.length >= 1);
const indiaTok = locOpts.find(o => o.id === 'country:India');
assert('locationsFrom includes India country', !!indiaTok);
assert('locationsFrom India is grouped', indiaTok && indiaTok.group === 'India' && indiaTok.kind === 'country');
const nestedCity = locOpts.find(o => o.kind === 'city' && o.group === 'India');
assert('locationsFrom has nested India city', !!nestedCity);
const byIndiaLoc = CompanyFilters.filter(companies, {
  ...CompanyFilters.defaultState(),
  locations: ['country:India']
});
assert('location country filter', byIndiaLoc.length >= 1 && byIndiaLoc.every(c => (c.locations || []).some(l => l.country === 'India')));
const cityTok = locOpts.find(o => o.id.startsWith('city:') && o.id.includes('Bengaluru'));
if (cityTok) {
  const byCity = CompanyFilters.filter(companies, { ...CompanyFilters.defaultState(), locations: [cityTok.id] });
  assert('location city filter', byCity.length >= 1);
}
const locState = { ...CompanyFilters.defaultState(), locations: ['country:India', 'city:Bengaluru|India'] };
const locSerialized = CompanyFilters.serializeUrlState(locState, '');
const locParsed = CompanyFilters.parseUrlState(locSerialized);
assert('URL round-trip locations', JSON.stringify(locParsed.state.locations) === JSON.stringify(locState.locations));
assert('hasActiveFilters true with locations', CompanyFilters.hasActiveFilters(locState));
assert('resetFilters clears locations', (CompanyFilters.resetFilters().locations || []).length === 0);

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
  sourceFilter: 'career'
});
assert('search source filter career', ownerOnly.length === 1 && ownerOnly[0].source === 'owner');

const interviewOnly = CompanyFilters.filterSearchResults([...mockResults, { source: 'interview', id: 'int-1', title: 'Q' }], byId, {
  ...CompanyFilters.defaultState(),
  sourceFilter: 'interview'
});
assert('search source filter interview', interviewOnly.length === 1 && interviewOnly[0].source === 'interview');

assert('sortOptionsFor(product) excludes devOnly options', !CompanyFilters.sortOptionsFor(true).some(o => o.devOnly));
assert(
  'sortOptionsFor(dev) includes devOnly options',
  CompanyFilters.sortOptionsFor(false).some(o => o.id === 'type-desc')
);

assert('sortDirectionFor detects active ascending column', CompanyFilters.sortDirectionFor('Company', 'name-asc') === 'asc');
assert('sortDirectionFor null when column inactive', CompanyFilters.sortDirectionFor('Company', 'priority-desc') === null);
assert('nextSortFor applies column default on first click', CompanyFilters.nextSortFor('Company', 'priority-desc') === 'name-asc');
assert('nextSortFor toggles direction on repeat click', CompanyFilters.nextSortFor('Company', 'name-asc') === 'name-desc');

if (failed) process.exit(1);
console.log('All filter tests passed.');
