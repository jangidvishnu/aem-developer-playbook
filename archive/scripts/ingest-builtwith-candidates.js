#!/usr/bin/env node
/**
 * Write curated AEM employer seeds to data/manifests/builtwith-candidates.json.
 * Usage: node scripts/ingest-builtwith-candidates.js
 */

const fs = require('fs');
const path = require('path');
const { getBuiltwithDomainMap, builtwithPublicUrl } = require('./company-records');

const root = path.join(__dirname, '..');
const manifestDir = path.join(root, 'data', 'manifests');
const outPath = path.join(manifestDir, 'builtwith-candidates.json');

function hostOf(domain) {
  return domain.replace(/^https?:\/\//, '').split('/')[0].toLowerCase();
}

function main() {
  const candidates = getBuiltwithDomainMap()
    .filter(e => e.promote !== false)
    .map(entry => ({
      id: entry.id,
      domain: hostOf(entry.domain),
      name: entry.name,
      builtwithUrl: builtwithPublicUrl(entry.domain),
      source: 'seed',
      mapped: true,
      hasCareers: typeof entry.careersUrl === 'string' && entry.careersUrl.startsWith('http'),
      ingestedAt: new Date().toISOString().slice(0, 10)
    }));

  if (!fs.existsSync(manifestDir)) fs.mkdirSync(manifestDir, { recursive: true });

  const payload = {
    note:
      'Curated AEM employer seeds (DR-011). Public builtwith.com profile URLs are optional Tier-4 reference links. Seeds live in data/company-sources.json.',
    ingestedAt: new Date().toISOString().slice(0, 10),
    stats: { total: candidates.length, seed: candidates.length },
    candidates: candidates.sort((a, b) => a.name.localeCompare(b.name))
  };

  fs.writeFileSync(outPath, JSON.stringify(payload, null, 2) + '\n');
  console.log(`Wrote ${candidates.length} seed candidates to ${outPath}`);
}

main();
