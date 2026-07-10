/**
 * Build truth-pass audit for weak-evidence companies.
 * Output: scripts/data/truth-pass-audit.json
 */
const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..', '..');
const companies = JSON.parse(fs.readFileSync(path.join(ROOT, 'data', 'companies.json'), 'utf8'));

function evidenceClass(ev) {
  const u = (ev || []).map(String);
  if (u.some((x) => /business\.adobe\.com\/customer-success|adobe\.com\/.*case-study/i.test(x))) return 'adobe-case';
  if (u.some((x) => /casestudies\.com/i.test(x))) return 'casestudies-mirror';
  if (u.some((x) => /builtwith\.com/i.test(x))) return 'builtwith';
  if (u.some((x) => /aem|experience-manager|adobe/i.test(x) && !/career|jobs\.|jobvite/i.test(x))) return 'practice-page';
  if (u.length && u.every((x) => /career|jobs\.|jobvite|applytojob|\/jobs/i.test(x))) return 'careers-only';
  try {
    if (u.every((x) => {
      const p = new URL(x).pathname.replace(/\/$/, '');
      return p === '' || p.split('/').filter(Boolean).length <= 1;
    })) return 'homepage-only';
  } catch (_) { /* ignore */ }
  return 'other';
}

function needsTruthPass(co) {
  const cls = evidenceClass(co.evidence);
  if (co.ownerVerified === false) return true;
  if (cls === 'careers-only' || cls === 'homepage-only') return true;
  return false;
}

const audit = companies.filter(needsTruthPass).map((co) => ({
  id: co.id,
  name: co.name,
  priority: co.priority,
  ownerVerified: co.ownerVerified === true,
  evidenceClass: evidenceClass(co.evidence),
  careersUrl: co.careersUrl,
  evidence0: (co.evidence || [])[0] || null,
  products: co.products,
  hiringActive: !!co.hiringActive,
  roles: co.roles,
  notesSnippet: String(co.notes || '').slice(0, 160)
}));

const byClass = {};
audit.forEach((r) => {
  byClass[r.evidenceClass] = (byClass[r.evidenceClass] || 0) + 1;
});

const out = {
  generatedAt: new Date().toISOString(),
  totalCompanies: companies.length,
  needsTruthPass: audit.length,
  byEvidenceClass: byClass,
  // Highest risk first: careers/homepage only, then others
  rows: audit.sort((a, b) => {
    const rank = { 'careers-only': 0, 'homepage-only': 1, other: 2, builtwith: 3, 'practice-page': 4, 'casestudies-mirror': 5, 'adobe-case': 6 };
    return (rank[a.evidenceClass] ?? 9) - (rank[b.evidenceClass] ?? 9) || b.priority - a.priority || a.id.localeCompare(b.id);
  })
};

fs.writeFileSync(path.join(ROOT, 'scripts', 'data', 'truth-pass-audit.json'), JSON.stringify(out, null, 2) + '\n');
console.log(JSON.stringify({ needsTruthPass: out.needsTruthPass, byEvidenceClass: byClass }, null, 2));
