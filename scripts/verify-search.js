#!/usr/bin/env node
/**
 * Regression check for assets/js/search.js (Milestone 5).
 * Usage: node scripts/verify-search.js
 */

const fs = require('fs');
const path = require('path');

const Search = require(path.join(__dirname, '..', 'assets', 'js', 'search.js'));

const chapters = JSON.parse(fs.readFileSync(path.join(__dirname, '..', 'data', 'chapters.json'), 'utf8'));
const companies = JSON.parse(fs.readFileSync(path.join(__dirname, '..', 'data', 'companies.json'), 'utf8'));
const site = JSON.parse(fs.readFileSync(path.join(__dirname, '..', 'data', 'site.json'), 'utf8'));
const roadmaps = JSON.parse(fs.readFileSync(path.join(__dirname, '..', 'data', 'roadmaps.json'), 'utf8'));

function loadLearning() {
  const load = name => JSON.parse(fs.readFileSync(path.join(__dirname, '..', 'data', name), 'utf8'));
  return {
    glossary: load('glossary.json'),
    technologies: load('technologies.json'),
    careerPaths: load('career_paths.json'),
    interviews: load('interviews.json'),
    templates: load('templates.json'),
    resources: load('resources.json')
  };
}

const learning = loadLearning();
const index = Search.buildIndex({ chapters, companies, roadmaps, site, learning });

const cases = [
  { query: 'Adobe', expectInResults: { source: 'company', id: 'adobe' } },
  { query: 'mission', expectTopSource: 'chapter', expectTopId: 'mission' },
  { query: 'AEM foundation', expectTopSource: 'roadmap', expectTopId: 'aem-foundation' },
  { query: 'Welcome', expectTopSource: 'site', expectTopId: 'hero' },
  { query: 'principles', expectTopSource: 'chapter', expectTopId: 'mission' },
  { query: 'HTL', expectInResults: { source: 'glossary', id: 'htl' } },
  { query: 'behavioral', expectInResults: { source: 'interview', id: 'int-behavior-star' } },
  { query: 'resume bullet', expectInResults: { source: 'template', id: 'resume-bullet-aem' } }
];

let failed = 0;

cases.forEach(({ query, expectTopSource, expectTopId, expectInResults }) => {
  const results = Search.query(index, query);
  if (expectInResults) {
    const found = results.find(r => r.source === expectInResults.source && r.id === expectInResults.id);
    const ok = !!found;
    console.log(ok ? 'PASS' : 'FAIL', JSON.stringify({ query, found: found ? { source: found.source, id: found.id } : null, expected: expectInResults }));
    if (!ok) failed++;
    return;
  }
  const top = results[0];
  const ok = top && top.source === expectTopSource && top.id === expectTopId;
  console.log(ok ? 'PASS' : 'FAIL', JSON.stringify({ query, got: top ? { source: top.source, id: top.id } : null, expected: { source: expectTopSource, id: expectTopId } }));
  if (!ok) failed++;
});

const ranked = Search.query(index, 'Adobe AEM');
const adobeIdx = ranked.findIndex(r => r.id === 'adobe');
const aemStepIdx = ranked.findIndex(r => r.id === 'aem-architecture');
if (adobeIdx >= 0 && aemStepIdx >= 0 && aemStepIdx < adobeIdx) {
  console.log('PASS', 'page order: roadmap section before company table (AEM step before Adobe)');
} else if (adobeIdx < 0 || aemStepIdx < 0) {
  console.log('SKIP', 'page-order Adobe AEM check (missing expected ids)');
} else {
  console.log('FAIL', 'expected AEM roadmap step before Adobe company in page order');
  failed++;
}

const pageOrder = Search.query(index, 'a').map(r => r.pageOrder);
const sorted = [...pageOrder].sort((a, b) => a - b);
if (pageOrder.length >= 2 && pageOrder.every((v, i) => v === sorted[i])) {
  console.log('PASS', 'equal-score results follow page order (top-to-bottom)');
} else if (pageOrder.length < 2) {
  console.log('SKIP', 'page-order check (too few results for query "a")');
} else {
  console.log('FAIL', 'results not sorted by page order when scores tie');
  failed++;
}

if (failed) {
  console.error('\n' + failed + ' search test(s) failed.');
  process.exitCode = 1;
} else {
  console.log('\nAll search tests passed.');
}
