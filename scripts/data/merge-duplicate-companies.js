/**
 * Merge duplicate / child-brand company rows into parent entries.
 * Archives removed rows under archive/companies/.
 * Run: node scripts/data/merge-duplicate-companies.js
 */
const fs = require('fs');
const path = require('path');

const root = path.join(__dirname, '../..');
const companiesPath = path.join(root, 'data/companies.json');
const archivePath = path.join(root, 'archive/companies/merged-duplicates-2026-07-11.json');

const companies = JSON.parse(fs.readFileSync(companiesPath, 'utf8'));
const byId = new Map(companies.map(c => [c.id, c]));

function uniq(arr) {
  return [...new Set((arr || []).filter(Boolean))];
}

function mergeLocations(a, b) {
  const out = new Map();
  for (const l of [...(a || []), ...(b || [])]) {
    if (!l || (!l.city && !l.country)) continue;
    const key = `${l.city || ''}|${l.country || ''}`;
    out.set(key, { city: l.city || null, country: l.country || null });
  }
  return [...out.values()];
}

function mergeInto(parentId, childId, patchParent) {
  const parent = byId.get(parentId);
  const child = byId.get(childId);
  if (!parent || !child) {
    throw new Error(`Missing parent ${parentId} or child ${childId}`);
  }
  Object.assign(parent, patchParent(parent, child));
  byId.delete(childId);
  return child;
}

const removed = [];

removed.push(
  mergeInto('vml', 'vml-enterprise-solutions', (p, c) => ({
    priority: Math.max(p.priority || 0, c.priority || 0),
    hiringActive: p.hiringActive === true || c.hiringActive === true,
    products: uniq([...(p.products || []), ...(c.products || [])]),
    roles: uniq([...(p.roles || []), ...(c.roles || [])]),
    locations: mergeLocations(p.locations, c.locations),
    evidence: uniq([...(p.evidence || []), ...(c.evidence || [])]),
    hiringEvidence: uniq([...(p.hiringEvidence || []), ...(c.hiringEvidence || [])]),
    notes:
      'WPP agency. Enterprise Solutions division (AEM Cloud) also hires on a separate Greenhouse board — check vml.com/careers for Bengaluru/Mumbai and the Enterprise Solutions Greenhouse for New Delhi and other hubs.'
  }))
);

removed.push(
  mergeInto('dentsu', 'merkle', (p, c) => ({
    priority: Math.max(p.priority || 0, c.priority || 0),
    hiringActive: true,
    products: uniq([...(p.products || []), ...(c.products || [])]),
    roles: uniq([...(p.roles || []), ...(c.roles || [])]),
    locations: mergeLocations(p.locations, c.locations),
    evidence: uniq([...(p.evidence || []), ...(c.evidence || [])]),
    hiringEvidence: uniq([...(p.hiringEvidence || []), ...(c.hiringEvidence || []), c.careersUrl]),
    notes:
      'Global marketing network. Merkle (dentsu CXM brand in India) runs much of AEM delivery — search Workday careers and merkle.com for India AEM roles (Bengaluru, Noida, Pune, Mumbai).'
  }))
);

removed.push(
  mergeInto('danaher', 'pall', (p, c) => ({
    priority: Math.max(p.priority || 0, c.priority || 0),
    hiringActive: true,
    products: uniq([...(p.products || []), ...(c.products || [])]),
    roles: uniq([...(p.roles || []), ...(c.roles || [])]),
    locations: mergeLocations(p.locations, c.locations),
    evidence: uniq([...(p.evidence || []), ...(c.evidence || [])]),
    hiringEvidence: uniq([...(p.hiringEvidence || []), ...(c.hiringEvidence || []), c.careersUrl]),
    notes:
      'Life sciences conglomerate. Pall operating company runs AEMaaCS + EDS with frontend/AEM developer hiring in Pune/Kolkata; also architect roles in Bengaluru on jobs.danaher.com.'
  }))
);

removed.push(
  mergeInto('unilever', 'hul', (p, c) => ({
    locations: mergeLocations(p.locations, c.locations),
    evidence: uniq([...(p.evidence || []), ...(c.evidence || [])]),
    hiringEvidence: uniq([
      ...(p.hiringEvidence || []),
      ...(c.hiringEvidence || []),
      c.careersUrl,
      'https://www.hul.co.in/careers/'
    ]),
    notes:
      'Global CPG on Adobe Commerce; brand sites historically on AEM in some markets. India hiring via Unilever India (HUL) at hul.co.in/careers and careers.unilever.com/en/india — verify AEM-titled roles.'
  }))
);

const merged = [...byId.values()].sort((a, b) => (b.priority || 0) - (a.priority || 0) || String(a.name).localeCompare(b.name));

fs.mkdirSync(path.dirname(archivePath), { recursive: true });
fs.writeFileSync(
  archivePath,
  JSON.stringify(
    {
      mergedAt: '2026-07-11',
      reason: 'Duplicate or child-brand rows merged into parent per 11_COMPANY_SCHEMA / M&A rule',
      removed
    },
    null,
    2
  ) + '\n',
  'utf8'
);

fs.writeFileSync(companiesPath, JSON.stringify(merged, null, 2) + '\n', 'utf8');
console.log(`Merged ${removed.length} duplicate rows. Live count: ${merged.length}. Archived to ${archivePath}`);
