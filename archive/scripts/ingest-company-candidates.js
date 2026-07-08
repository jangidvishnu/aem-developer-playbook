#!/usr/bin/env node
/**
 * Extract candidate company names from md/deep-research-report*.md (Milestone 6).
 * Outputs a review manifest — does NOT write data/companies.json.
 * Usage: node scripts/ingest-company-candidates.js
 */

const fs = require('fs');
const path = require('path');

const mdDir = path.join(__dirname, '..', 'md');
const files = fs.readdirSync(mdDir).filter(f => f.startsWith('deep-research-report') && f.endsWith('.md'));

const names = new Map();

function slug(name) {
  return name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
}

files.forEach(file => {
  const text = fs.readFileSync(path.join(mdDir, file), 'utf8');
  const bold = [...text.matchAll(/\*\*([^*]+)\*\*/g)].map(m => m[1].trim());
  bold.forEach(raw => {
    const name = raw.replace(/\s*\(.*\)\s*$/, '').trim();
    if (name.length < 2 || name.length > 80) return;
    if (/^(Column|Company|Executive|Sources|Attachments)/i.test(name)) return;
    const id = slug(name);
    if (!names.has(id)) names.set(id, { id, name, sources: [] });
    if (!names.get(id).sources.includes(file)) names.get(id).sources.push(file);
  });
});

const manifest = [...names.values()].sort((a, b) => a.name.localeCompare(b.name));
console.log(JSON.stringify({ extracted: manifest.length, candidates: manifest }, null, 2));
