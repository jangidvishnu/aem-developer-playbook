#!/usr/bin/env node
/* Temporary planning helper: list companies sorted by priority with which filter fields are missing. */
const fs = require('fs');
const path = require('path');
const companies = JSON.parse(fs.readFileSync(path.join(__dirname, '..', 'data', 'companies.json'), 'utf8'));

const rows = companies
  .map((c, i) => ({
    i,
    id: c.id,
    name: c.name,
    priority: c.priority,
    type: c.companyType,
    hq: c.hq || '',
    products: (c.products || []).join('|'),
    loc: Array.isArray(c.locations) ? c.locations.length : 0,
    remote: 'remote' in c,
    notice: !!c.noticePolicy,
    ha: c.hiringActive === true
  }))
  .sort((a, b) => b.priority - a.priority || a.name.localeCompare(b.name));

const argFilter = process.argv[2]; // optional min priority
const minP = argFilter ? parseInt(argFilter, 10) : 0;

let n = 0;
for (const r of rows) {
  if (r.priority < minP) continue;
  n++;
  const miss = [];
  if (!r.loc) miss.push('loc');
  if (!r.remote) miss.push('remote');
  if (!r.notice) miss.push('notice');
  if (!r.ha) miss.push('hiringActive');
  console.log(`P${r.priority} ${r.id} | ${r.name} | ${r.type} | hq:${r.hq} | prod:${r.products} | missing:${miss.join(',') || 'none'}`);
}
console.log(`\nTotal shown: ${n} / ${rows.length}`);
