/**
 * Split hiringEvidence vs jobSearchUrl for ownerVerified:false companies.
 * hiringEvidence = specific job posting URLs only.
 * jobSearchUrl = search portals / careers search / job-board company pages.
 * Run: node scripts/data/cleanup-hiring-evidence-urls.js
 */
const fs = require('fs');
const path = require('path');
const { isSpecificJobPostingUrl, isHttpUrl } = require('../hiring-gate');

const companiesPath = path.join(__dirname, '../../data/companies.json');
const companies = JSON.parse(fs.readFileSync(companiesPath, 'utf8'));

function normPath(u) {
  try {
    const x = new URL(u);
    return (x.origin + x.pathname).replace(/\/$/, '').toLowerCase();
  } catch {
    return String(u || '').trim().toLowerCase();
  }
}

function pickJobSearchUrl(existing, weak, careersUrl) {
  const candidates = [];
  if (isHttpUrl(existing)) candidates.push(existing);
  weak.forEach((u) => candidates.push(u));
  const careersNorm = normPath(careersUrl);
  const scored = candidates.map((u) => {
    let score = 0;
    if (/[?&](keywords?|keyword|q|query|search)=/i.test(u)) score += 3;
    if (/AEM|Experience%20Manager|Adobe/i.test(u)) score += 2;
    if (/foundit\.in\/search|naukri\.com\/.*-jobs-career/i.test(u)) score += 1;
    if (normPath(u) === careersNorm) score -= 2;
    if (/\/careers\/?$/i.test(u)) score -= 1;
    return { u, score };
  });
  scored.sort((a, b) => b.score - a.score);
  return scored[0]?.u || existing || weak[0] || undefined;
}

const report = { fixed: [], cleared: [], unchanged: [] };

for (const co of companies) {
  if (co.ownerVerified !== false) continue;
  const before = [...(co.hiringEvidence || [])];
  const httpUrls = before.filter(isHttpUrl);
  const specific = httpUrls.filter(isSpecificJobPostingUrl);
  const weak = httpUrls.filter((u) => !isSpecificJobPostingUrl(u));

  if (!weak.length && specific.length === before.filter(isHttpUrl).length) {
    if (specific.length) report.unchanged.push(co.id);
    continue;
  }

  co.hiringEvidence = specific;
  const nextSearch = pickJobSearchUrl(co.jobSearchUrl, weak, co.careersUrl);
  if (nextSearch) co.jobSearchUrl = nextSearch;
  else if (co.jobSearchUrl && !isHttpUrl(co.jobSearchUrl)) delete co.jobSearchUrl;

  if (specific.length) {
    report.fixed.push({ id: co.id, jobs: specific, jobSearchUrl: co.jobSearchUrl || null });
  } else {
    report.cleared.push({ id: co.id, removed: weak, jobSearchUrl: co.jobSearchUrl || null });
  }
}

fs.writeFileSync(companiesPath, JSON.stringify(companies, null, 2) + '\n');

console.log('Specific job URLs kept:', report.fixed.length);
report.fixed.forEach((r) => console.log(`  ${r.id}: ${r.jobs.length} posting(s)`));
console.log('\nCleared weak hiringEvidence (jobSearchUrl only):', report.cleared.length);
report.cleared.slice(0, 20).forEach((r) => console.log(`  ${r.id}`));
if (report.cleared.length > 20) console.log(`  ... +${report.cleared.length - 20} more`);
