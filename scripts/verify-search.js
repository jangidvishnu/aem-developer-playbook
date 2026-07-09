#!/usr/bin/env node
/**
 * Regression check for assets/js/search.js (Milestone 5).
 * Usage: node scripts/verify-search.js
 */

const fs = require('fs');
const path = require('path');

const Search = require(path.join(__dirname, '..', 'assets', 'js', 'search.js'));
globalThis.Search = Search;

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
const ownerPlaybook = JSON.parse(fs.readFileSync(path.join(__dirname, '..', 'data', 'owner_playbook.json'), 'utf8'));
const index = Search.buildIndex({ chapters, companies, roadmaps, site, learning, ownerPlaybook });

const cases = [
  { query: 'Adobe', expectInResults: { source: 'company', id: 'adobe' } },
  { query: 'mission', expectTopSource: 'chapter', expectTopId: 'mission' },
  { query: 'AEM foundation', expectInResults: { source: 'roadmap', id: 'aem-foundation' } },
  { query: 'researched AEM employers', expectTopSource: 'site', expectTopId: 'hero' },
  { query: 'principles', expectTopSource: 'chapter', expectTopId: 'mission' },
  { query: 'HTL', expectInResults: { source: 'glossary', id: 'htl' } },
  { query: 'behavioral', expectInResults: { source: 'interview', id: 'int-behavior-star' } },
  { query: 'resume bullet', expectInResults: { source: 'template', id: 'resume-bullet-aem' } },
  { query: 'outreach', expectInResults: { source: 'owner', id: 'outreach' } }
];

let failed = 0;

cases.forEach(({ query, expectTopSource, expectTopId, expectInResults }) => {
  const results = Search.query(index, query);
  if (expectInResults) {
    const found = results.find(r => r.source === expectInResults.source && r.id === expectInResults.id);
    const ok = !!found;
    console.log(
      ok ? 'PASS' : 'FAIL',
      JSON.stringify({ query, found: found ? { source: found.source, id: found.id } : null, expected: expectInResults })
    );
    if (!ok) failed++;
    return;
  }
  const top = results[0];
  const ok = top && top.source === expectTopSource && top.id === expectTopId;
  console.log(
    ok ? 'PASS' : 'FAIL',
    JSON.stringify({ query, got: top ? { source: top.source, id: top.id } : null, expected: { source: expectTopSource, id: expectTopId } })
  );
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

const { CompanyFilters } = require(path.join(__dirname, '..', 'assets', 'js', 'filters.js'));
const adobeResults = Search.query(index, 'Adobe');
const companyFaceted = CompanyFilters.filterSearchResults(adobeResults, CompanyFilters.companiesById(companies), {
  ...CompanyFilters.defaultState(),
  sourceFilter: 'company'
});
if (companyFaceted.length >= 1 && companyFaceted.every(r => r.source === 'company')) {
  console.log('PASS', 'facet intersection: Adobe + company source filter');
} else {
  console.log('FAIL', 'facet intersection: Adobe + company source filter');
  failed++;
}

const financeFaceted = CompanyFilters.filterSearchResults(adobeResults, CompanyFilters.companiesById(companies), {
  ...CompanyFilters.defaultState(),
  industry: 'Software'
});
if (financeFaceted.some(r => r.id === 'adobe')) {
  console.log('PASS', 'facet intersection: Adobe matches Software industry');
} else {
  console.log('FAIL', 'facet intersection: Adobe matches Software industry');
  failed++;
}

const financeMiss = CompanyFilters.filterSearchResults(adobeResults, CompanyFilters.companiesById(companies), {
  ...CompanyFilters.defaultState(),
  industry: 'Finance'
});
if (!financeMiss.some(r => r.id === 'adobe')) {
  console.log('PASS', 'facet intersection: Adobe excluded by Finance industry');
} else {
  console.log('FAIL', 'facet intersection: Adobe excluded by Finance industry');
  failed++;
}

const adobeCompany = adobeResults.find(r => r.source === 'company' && r.id === 'adobe');
if (adobeCompany && adobeCompany.facets && adobeCompany.facets.industry) {
  console.log('PASS', 'company index entries include facets metadata');
} else {
  console.log('FAIL', 'company index entries include facets metadata');
  failed++;
}

const byId = CompanyFilters.companiesById(companies);
const widenOut = CompanyFilters.querySearch(index, 'ad', byId, { sourceFilter: 'owner' });
if (widenOut.raw.length > 0 && widenOut.widened && widenOut.results.length > 0) {
  console.log('PASS', 'querySearch widens Apply filter when category empty');
} else {
  console.log('FAIL', 'querySearch widens Apply filter when category empty');
  failed++;
}

if (failed) {
  console.error('\n' + failed + ' search test(s) failed.');
  process.exitCode = 1;
} else {
  console.log('\nAll search tests passed.');
}
