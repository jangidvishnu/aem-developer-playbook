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

const verified = companies.filter(c => c.Status === 'Verified');
const hiring = companies.filter(c => c.HiringAEM === true);
console.log(`Companies: ${companies.length} total, ${verified.length} Verified, ${hiring.length} HiringAEM`);

if (errors.length) {
  errors.forEach(e => console.error('FAIL', e));
  process.exit(1);
}

console.log('All company records pass schema validation and hiring gate.');
