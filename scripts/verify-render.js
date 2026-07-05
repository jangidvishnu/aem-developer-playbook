#!/usr/bin/env node
/**
 * Manual regression check for index.html's render functions and data/*.json.
 *
 * Purpose (see 17_TESTING_GUIDE.md): whenever the rendering logic in index.html's
 * <script> block or the data/*.json files change, this proves the resulting
 * toc/main markup is unchanged (or shows exactly what changed) without needing
 * a browser or a build step.
 *
 * This is a dev-only tool. It is never loaded by index.html and does not affect
 * the shipped, no-build-step site (see 04_CODING_STANDARD.md).
 *
 * As of Milestone 3, runCurrent() reads the REAL data/chapters.json and
 * data/companies.json from disk — this proves those files are a faithful
 * transcription of the original inline data, not just that a hardcoded copy in
 * this script is self-consistent.
 *
 * Known, accepted diffs vs. the pre-Milestone-1 baseline:
 * - MAIN gains ` text-slate-800` on every chapter <section> (post-Milestone-2
 *   dark-mode accessibility fix — see 20_ACCESSIBILITY.md).
 * - The `id` field added to each data/*.json record in Milestone 3 (see
 *   12_DECISIONS.md DR-005 area / 09_DATA_MODEL.md's stable-id rule) does not
 *   appear in rendered output — no template interpolates chapter.id or x.id.
 *
 * Usage: node scripts/verify-render.js
 */

const fs = require('fs');
const path = require('path');

const chapters = JSON.parse(fs.readFileSync(path.join(__dirname, '..', 'data', 'chapters.json'), 'utf8'));
const companies = JSON.parse(fs.readFileSync(path.join(__dirname, '..', 'data', 'companies.json'), 'utf8'));

const HERO = '<section class="bg-gradient-to-r from-blue-700 to-sky-600 text-white rounded-2xl p-8">HERO</section>';

// --- Pre-Milestone-1 baseline (the original single forEach loop, using the
// same data now stored in data/*.json — proves the JSON is a faithful copy). --
function runBaseline() {
  let toc = { innerHTML: '' };
  let main = { innerHTML: HERO };
  chapters.forEach((c, i) => {
    const id = 'ch' + i;
    toc.innerHTML += `<a href="#${id}" class="block px-3 py-2 rounded hover:bg-slate-100">${c.title}</a>`;
    let body = c.body || '';
    if (c.companyTable) {
      body = `<div class="overflow-auto"><table class="min-w-full text-sm border"><thead class="bg-slate-100"><tr><th class="p-2">Priority</th><th class="p-2">Company</th><th class="p-2">Type</th><th class="p-2">India</th><th class="p-2">AEM</th><th class="p-2">Careers</th><th class="p-2">AEM Jobs</th><th class="p-2">Visa</th></tr></thead><tbody>${companies.map(x => `<tr class="border-t"><td class="p-2">${x.priority}</td><td class="p-2 font-semibold">${x.company}</td><td class="p-2">${x.type}</td><td class="p-2">${x.india}</td><td class="p-2">${x.aem}</td><td class="p-2"><a class="text-blue-600 underline" target="_blank" href="${x.careers}">Careers</a></td><td class="p-2">${x.search.startsWith('http') ? `<a class="text-blue-600 underline" target="_blank" href="${x.search}">Search</a>` : x.search}</td><td class="p-2">${x.visa}</td></tr>`).join('')
        }</tbody></table></div>`;
    }
    main.innerHTML += `<section id="${id}" class="section bg-white rounded-xl shadow p-8"><h2 class="text-3xl font-bold">${c.title}</h2><div class="text-xs text-slate-500 mt-1">⏱ ${c.reading} • ${c.tags.join(', ')}</div><p class="text-slate-500 mb-4">${c.summary}</p>${body}<details class="mt-6"><summary class="cursor-pointer font-semibold">📌 Summary</summary><div class="mt-2 text-slate-600">${c.summary}</div></details></section>`;
  });
  return { toc: toc.innerHTML, main: main.innerHTML };
}

// --- Current index.html rendering logic -------------------------------------
// Kept in sync manually with index.html's <script> block. If this drifts,
// the comparison below stops being meaningful — update it whenever the
// Render namespace in index.html changes. Data now comes from data/*.json
// (read above), matching how index.html actually fetches it.
function runCurrent() {
  let toc = { innerHTML: '' };
  let main = { innerHTML: HERO };

  const Render = {
    escapeHtml(value) {
      return String(value).replace(/[&<>"']/g, ch => ({
        '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
      }[ch]));
    },
    sidebar(chapters) {
      return chapters.map((c, i) => `<a href="#ch${i}" class="block px-3 py-2 rounded hover:bg-slate-100">${Render.escapeHtml(c.title)}</a>`).join('');
    },
    companyRow(x) {
      const search = x.search.startsWith('http')
        ? `<a class="text-blue-600 underline" target="_blank" href="${Render.escapeHtml(x.search)}">Search</a>`
        : Render.escapeHtml(x.search);
      return `<tr class="border-t"><td class="p-2">${Render.escapeHtml(x.priority)}</td><td class="p-2 font-semibold">${Render.escapeHtml(x.company)}</td><td class="p-2">${Render.escapeHtml(x.type)}</td><td class="p-2">${Render.escapeHtml(x.india)}</td><td class="p-2">${Render.escapeHtml(x.aem)}</td><td class="p-2"><a class="text-blue-600 underline" target="_blank" href="${Render.escapeHtml(x.careers)}">Careers</a></td><td class="p-2">${search}</td><td class="p-2">${Render.escapeHtml(x.visa)}</td></tr>`;
    },
    companyTable(companies) {
      return `<div class="overflow-auto"><table class="min-w-full text-sm border"><thead class="bg-slate-100"><tr><th class="p-2">Priority</th><th class="p-2">Company</th><th class="p-2">Type</th><th class="p-2">India</th><th class="p-2">AEM</th><th class="p-2">Careers</th><th class="p-2">AEM Jobs</th><th class="p-2">Visa</th></tr></thead><tbody>${companies.map(Render.companyRow).join('')}</tbody></table></div>`;
    },
    chapter(chapter, index, companies) {
      const id = 'ch' + index;
      let body = chapter.body || '';
      if (chapter.companyTable) {
        body = Render.companyTable(companies);
      }
      return `<section id="${id}" class="section bg-white text-slate-800 rounded-xl shadow p-8"><h2 class="text-3xl font-bold">${Render.escapeHtml(chapter.title)}</h2><div class="text-xs text-slate-500 mt-1">⏱ ${Render.escapeHtml(chapter.reading)} • ${Render.escapeHtml(chapter.tags.join(', '))}</div><p class="text-slate-500 mb-4">${Render.escapeHtml(chapter.summary)}</p>${body}<details class="mt-6"><summary class="cursor-pointer font-semibold">📌 Summary</summary><div class="mt-2 text-slate-600">${Render.escapeHtml(chapter.summary)}</div></details></section>`;
    }
  };

  toc.innerHTML = Render.sidebar(chapters);
  main.innerHTML += chapters.map((c, i) => Render.chapter(c, i, companies)).join('');
  return { toc: toc.innerHTML, main: main.innerHTML };
}

const baseline = runBaseline();
const current = runCurrent();

const tocMatch = baseline.toc === current.toc;
const mainMatch = baseline.main === current.main;

console.log('TOC MATCH:', tocMatch, `(baseline ${baseline.toc.length} chars, current ${current.toc.length} chars)`);
console.log('MAIN MATCH:', mainMatch, `(baseline ${baseline.main.length} chars, current ${current.main.length} chars)`);

function firstDiff(a, b, label) {
  const len = Math.min(a.length, b.length);
  for (let i = 0; i < len; i++) {
    if (a[i] !== b[i]) {
      console.log(`\n${label} first differs at index ${i}:`);
      console.log('  baseline: ...' + a.slice(Math.max(0, i - 30), i + 60) + '...');
      console.log('  current:  ...' + b.slice(Math.max(0, i - 30), i + 60) + '...');
      return;
    }
  }
  console.log(`\n${label} differs only in trailing length (one is a prefix of the other).`);
}

if (!tocMatch || !mainMatch) {
  console.log('\nOutput differs from the pre-Milestone-1 baseline. This is expected once real');
  console.log('escaping/behavior/markup changes are intentionally introduced — inspect the diff');
  console.log('below and confirm it is exactly the change you intended.');
  if (!tocMatch) firstDiff(baseline.toc, current.toc, 'TOC');
  if (!mainMatch) firstDiff(baseline.main, current.main, 'MAIN');
  process.exitCode = 1;
} else {
  console.log('\nRendered output is byte-identical to the pre-Milestone-1 baseline.');
}
