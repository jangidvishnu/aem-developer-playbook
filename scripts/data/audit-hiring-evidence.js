/**
 * Audit hiringEvidence quality for ownerVerified:false rows.
 * Run: node scripts/data/audit-hiring-evidence.js
 */
const fs = require('fs');
const path = require('path');

const companies = JSON.parse(
  fs.readFileSync(path.join(__dirname, '../../data/companies.json'), 'utf8')
);

const JOB_PATTERNS = [
  /\/job\//i,
  /\/jobs\/[^?]+\//i,
  /\/en\/jobs\/r-/i,
  /greenhouse\.io\/[^?]+\/jobs\/\d+/i,
  /myworkdayjobs\.com\/[^?]+\/job\//i,
  /lever\.co\/[^/]+\/[a-f0-9-]{36}/i,
  /boards\.greenhouse\.io\/[^?]+\/jobs\/\d+/i,
  /smartrecruiters\.com\/[^/]+\/\d+/i,
  /taleo\.net\/[^?]+jobdetail/i,
  /icims\.com\/jobs\/\d+/i,
  /ashbyhq\.com\/[^/]+\/[a-f0-9-]{36}/i,
  /jobvite\.com\/[^/]+\/job\//i,
  /foundit\.in\/job\//i,
  /builtin\.com\/job\//i,
  /naukri\.com\/job-listings-/i,
  /linkedin\.com\/jobs\/view\//i,
  /indeed\.com\/viewjob/i
];

const SEARCH_PATTERNS = [
  /search-results/i,
  /search-jobs/i,
  /job-search/i,
  /career-search/i,
  /[?&](keywords?|keyword|q|query|search)=/i,
  /\/search\//i,
  /\/search$/i,
  /naukri\.com\/[^/]+-jobs-careers$/i,
  /foundit\.in\/search\//i,
  /myworkdayjobs\.com\/[^?]+\?q=/i,
  /\/jobs\?/i,
  /\/careers\?/i,
  /\/careers$/i
];

function classifyUrl(url) {
  if (JOB_PATTERNS.some((p) => p.test(url))) return 'job';
  if (SEARCH_PATTERNS.some((p) => p.test(url))) return 'search';
  return 'unknown';
}

const rows = companies.filter((c) => c.ownerVerified === false);
const report = { searchOnly: [], mixed: [], jobOnly: [], unknownOnly: [] };

for (const c of rows) {
  const he = (c.hiringEvidence || []).filter(Boolean);
  const classes = he.map(classifyUrl);
  const hasJob = classes.includes('job');
  const hasSearch = classes.includes('search');
  const entry = { id: c.id, name: c.name, careersUrl: c.careersUrl, hiringEvidence: he, classes };

  if (!hasJob && hasSearch) report.searchOnly.push(entry);
  else if (hasJob && hasSearch) report.mixed.push(entry);
  else if (hasJob) report.jobOnly.push(entry);
  else report.unknownOnly.push(entry);
}

console.log(`ownerVerified:false total: ${rows.length}`);
console.log(`search-only: ${report.searchOnly.length}`);
console.log(`mixed: ${report.mixed.length}`);
console.log(`job-only: ${report.jobOnly.length}`);
console.log(`unknown-only: ${report.unknownOnly.length}`);
console.log('\n=== SEARCH-ONLY ===');
for (const e of report.searchOnly) {
  console.log(`\n${e.id} (${e.name})`);
  e.hiringEvidence.forEach((u, i) => console.log(`  [${e.classes[i]}] ${u}`));
}
console.log('\n=== MIXED (has search links too) ===');
for (const e of report.mixed) {
  console.log(`\n${e.id} (${e.name})`);
  e.hiringEvidence.forEach((u, i) => console.log(`  [${e.classes[i]}] ${u}`));
}
console.log('\n=== UNKNOWN-ONLY ===');
for (const e of report.unknownOnly) {
  console.log(`\n${e.id} (${e.name})`);
  e.hiringEvidence.forEach((u, i) => console.log(`  [${e.classes[i]}] ${u}`));
}
