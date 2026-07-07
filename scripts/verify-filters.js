#!/usr/bin/env node
/**
 * Tests for assets/js/filters.js (Milestone 8).
 * Usage: node scripts/verify-filters.js
 */

const fs = require('fs');
const path = require('path');
const vm = require('vm');

const filtersPath = path.join(__dirname, '..', 'assets', 'js', 'filters.js');
const companiesPath = path.join(__dirname, '..', 'data', 'companies.json');

const code = fs.readFileSync(filtersPath, 'utf8');
const sandbox = { module: { exports: {} } };
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

const sorted = CompanyFilters.sort(companies, 'name-asc');
assert(
  'name sort ascending',
  sorted[0].name.localeCompare(sorted[sorted.length - 1].name) <= 0
);

const q = CompanyFilters.apply(companies, { ...CompanyFilters.defaultState(), query: 'adobe' });
assert('name query finds Adobe', q.length >= 1 && q[0].id === 'adobe');

if (failed) process.exit(1);
console.log('All filter tests passed.');
