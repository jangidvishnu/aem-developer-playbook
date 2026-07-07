#!/usr/bin/env node
/**
 * Manual regression check for assets/js/render.js and data/*.json.
 *
 * Purpose (see 17_TESTING_GUIDE.md): whenever render logic or data files change,
 * this proves chapter/sidebar output is unchanged (or shows exactly what changed)
 * without needing a browser or a build step.
 *
 * As of Milestone 4, runCurrent() require()'s assets/js/render.js directly —
 * no hand-copied duplicate of the Render namespace.
 *
 * Usage: node scripts/verify-render.js
 *        node scripts/verify-render.js --update-golden   (after intentional render changes)
 */

const fs = require('fs');
const path = require('path');

const Render = require(path.join(__dirname, '..', 'assets', 'js', 'render.js'));

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
const ctx = { companies, learning, ownerPlaybook };

// Milestone 3 golden: toc + chapter markup only (sidebar and main content sections).
const M3_GOLDEN_PATH = path.join(__dirname, 'milestone-3-render-golden.json');

function runChaptersAndToc() {
  return {
    toc: Render.sidebar(chapters),
    chapters: chapters.map((c, i) => Render.chapter(c, i, ctx)).join('')
  };
}

function runSiteChrome() {
  return {
    pageHeader: Render.pageHeader(site.header),
    hero: Render.hero(site.hero),
    dashboard: Render.dashboard(site.dashboard),
    search: Render.search(site.search),
    roadmap: Render.roadmapList(roadmaps),
    footer: Render.footer(site.footer)
  };
}

function loadOrCreateM3Golden() {
  if (fs.existsSync(M3_GOLDEN_PATH)) {
    return JSON.parse(fs.readFileSync(M3_GOLDEN_PATH, 'utf8'));
  }
  const snapshot = runChaptersAndToc();
  fs.writeFileSync(M3_GOLDEN_PATH, JSON.stringify(snapshot, null, 2) + '\n');
  console.log('Created', path.relative(process.cwd(), M3_GOLDEN_PATH), '— re-run to verify against it.');
  return snapshot;
}

const golden = loadOrCreateM3Golden();
const current = runChaptersAndToc();

if (process.argv.includes('--update-golden')) {
  fs.writeFileSync(M3_GOLDEN_PATH, JSON.stringify(current, null, 2) + '\n');
  console.log('Updated', path.relative(process.cwd(), M3_GOLDEN_PATH));
  process.exit(0);
}

const tocMatch = golden.toc === current.toc;
const chaptersMatch = golden.chapters === current.chapters;

console.log('TOC MATCH (Milestone 3 golden):', tocMatch,
  `(golden ${golden.toc.length} chars, current ${current.toc.length} chars)`);
console.log('CHAPTERS MATCH (Milestone 3 golden):', chaptersMatch,
  `(golden ${golden.chapters.length} chars, current ${current.chapters.length} chars)`);

function firstDiff(a, b, label) {
  const len = Math.min(a.length, b.length);
  for (let i = 0; i < len; i++) {
    if (a[i] !== b[i]) {
      console.log(`\n${label} first differs at index ${i}:`);
      console.log('  golden:  ...' + a.slice(Math.max(0, i - 30), i + 60) + '...');
      console.log('  current: ...' + b.slice(Math.max(0, i - 30), i + 60) + '...');
      return;
    }
  }
  console.log(`\n${label} differs only in trailing length (one is a prefix of the other).`);
}

if (!tocMatch || !chaptersMatch) {
  console.log('\nChapter/sidebar output differs from the Milestone 3 golden snapshot.');
  if (!tocMatch) firstDiff(golden.toc, current.toc, 'TOC');
  if (!chaptersMatch) firstDiff(golden.chapters, current.chapters, 'CHAPTERS');
  process.exitCode = 1;
} else {
  console.log('\nChapter/sidebar output matches the Milestone 3 golden snapshot.');
}

const chrome = runSiteChrome();
console.log('\nSite chrome rendered (sanity check):');
console.log('  pageHeader:', chrome.pageHeader.length, 'chars');
console.log('  hero:', chrome.hero.length, 'chars');
console.log('  roadmap:', chrome.roadmap.length, 'chars');
console.log('  footer:', chrome.footer.length, 'chars');

if (!chrome.hero.includes(site.hero.title) || !chrome.pageHeader.includes(site.header.title)) {
  console.error('\nSite chrome sanity check failed — rendered output missing expected content.');
  process.exitCode = 1;
}
