#!/usr/bin/env node
/**
 * Link status checker for data/companies.json — diagnostic, NOT part of `npm run verify`.
 *
 * Hits the live network, so it must never gate CI (career sites are flaky / bot-protected).
 * It classifies each URL so the owner can eyeball non-200 links:
 *
 *   ok       2xx                          → link works
 *   redirect ends on a different host     → works but destination moved (worth a look)
 *   blocked  401/403/429/5xx/timeout/TLS  → likely anti-bot; probably fine in a real browser
 *   dead     404/410/DNS failure          → broken; needs fixing or dropping
 *
 * Usage:
 *   node scripts/verify-links.js                     # check every careersUrl
 *   node scripts/verify-links.js --field careersUrl,jobSearchUrl
 *   node scripts/verify-links.js --ids adobe,accenture
 *   node scripts/verify-links.js --unverified        # only rows with ownerVerified !== true
 *   node scripts/verify-links.js --concurrency 6 --timeout 20000
 *   node scripts/verify-links.js --out scripts/data/link-report.json
 */

const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const COMPANIES = path.join(ROOT, 'data', 'companies.json');

function parseArgs(argv) {
  const args = {
    fields: ['careersUrl'],
    ids: null,
    unverified: false,
    concurrency: 8,
    timeout: 15000,
    out: path.join(ROOT, 'scripts', 'data', 'link-report.json')
  };
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (a === '--field' || a === '--fields')
      args.fields = argv[++i]
        .split(',')
        .map(s => s.trim())
        .filter(Boolean);
    else if (a === '--ids')
      args.ids = new Set(
        argv[++i]
          .split(',')
          .map(s => s.trim())
          .filter(Boolean)
      );
    else if (a === '--unverified') args.unverified = true;
    else if (a === '--concurrency') args.concurrency = Math.max(1, parseInt(argv[++i], 10) || 8);
    else if (a === '--timeout') args.timeout = Math.max(1000, parseInt(argv[++i], 10) || 15000);
    else if (a === '--out') args.out = path.resolve(ROOT, argv[++i]);
  }
  return args;
}

const BROWSER_HEADERS = {
  'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0 Safari/537.36',
  Accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8',
  'Accept-Language': 'en-US,en;q=0.9'
};

function classify(status) {
  if (status >= 200 && status < 300) return 'ok';
  if (status === 404 || status === 410) return 'dead';
  if (status === 401 || status === 403 || status === 429) return 'blocked';
  if (status >= 500) return 'blocked';
  if (status >= 300 && status < 400) return 'redirect';
  return 'blocked';
}

function hostOf(url) {
  try {
    return new URL(url).host.replace(/^www\./, '');
  } catch {
    return null;
  }
}

async function fetchOnce(url, method, timeout) {
  const ctrl = new AbortController();
  const t = setTimeout(() => ctrl.abort(), timeout);
  try {
    const res = await fetch(url, { method, redirect: 'follow', headers: BROWSER_HEADERS, signal: ctrl.signal });
    return { status: res.status, finalUrl: res.url };
  } finally {
    clearTimeout(t);
  }
}

async function checkUrl(url, timeout) {
  if (typeof url !== 'string' || !/^https?:\/\//i.test(url)) {
    return { category: 'dead', status: 0, note: 'not an http(s) url' };
  }
  // Prefer GET (many sites 405/403 on HEAD); one retry for transient/timeout.
  for (let attempt = 0; attempt < 2; attempt++) {
    try {
      const { status, finalUrl } = await fetchOnce(url, 'GET', timeout);
      let category = classify(status);
      if (category === 'ok') {
        const from = hostOf(url);
        const to = hostOf(finalUrl);
        if (from && to && from !== to) category = 'redirect';
      }
      const out = { category, status, finalUrl };
      if (category === 'blocked' && status >= 500 && attempt === 0) continue; // retry 5xx once
      return out;
    } catch (err) {
      const code = err && (err.code || err.cause?.code || err.name);
      const dns = code === 'ENOTFOUND' || code === 'EAI_AGAIN' || code === 'ERR_NAME_NOT_RESOLVED';
      if (dns) return { category: 'dead', status: 0, note: `dns: ${code}` };
      if (attempt === 0) continue; // retry timeout / reset once
      const timedOut = err && err.name === 'AbortError';
      return { category: 'blocked', status: 0, note: timedOut ? 'timeout' : `error: ${code || err.message}` };
    }
  }
  return { category: 'blocked', status: 0, note: 'unknown' };
}

async function runPool(items, concurrency, worker) {
  const results = new Array(items.length);
  let next = 0;
  async function drain() {
    while (next < items.length) {
      const i = next++;
      results[i] = await worker(items[i], i);
    }
  }
  await Promise.all(Array.from({ length: Math.min(concurrency, items.length) }, drain));
  return results;
}

async function main() {
  const args = parseArgs(process.argv.slice(2));
  const companies = JSON.parse(fs.readFileSync(COMPANIES, 'utf8'));

  const targets = [];
  for (const co of companies) {
    if (args.ids && !args.ids.has(co.id)) continue;
    if (args.unverified && co.ownerVerified === true) continue;
    for (const field of args.fields) {
      const raw = co[field];
      const urls = Array.isArray(raw) ? raw : raw ? [raw] : [];
      for (const url of urls) {
        if (url) targets.push({ id: co.id, name: co.name, field, url });
      }
    }
  }

  if (targets.length === 0) {
    console.log('No matching URLs to check.');
    return;
  }

  console.log(`Checking ${targets.length} link(s) across fields [${args.fields.join(', ')}] with concurrency ${args.concurrency}...`);
  let done = 0;
  const report = await runPool(targets, args.concurrency, async t => {
    const r = await checkUrl(t.url, args.timeout);
    done++;
    if (done % 20 === 0 || done === targets.length) process.stdout.write(`  ...${done}/${targets.length}\n`);
    return { ...t, ...r };
  });

  const by = { ok: [], redirect: [], blocked: [], dead: [] };
  report.forEach(r => by[r.category].push(r));

  fs.mkdirSync(path.dirname(args.out), { recursive: true });
  fs.writeFileSync(
    args.out,
    JSON.stringify(
      {
        checkedAt: new Date().toISOString(),
        fields: args.fields,
        total: report.length,
        summary: { ok: by.ok.length, redirect: by.redirect.length, blocked: by.blocked.length, dead: by.dead.length },
        results: report
      },
      null,
      2
    ) + '\n'
  );

  console.log('\n=== Link check summary ===');
  console.log(`  ok:       ${by.ok.length}`);
  console.log(`  redirect: ${by.redirect.length}`);
  console.log(`  blocked:  ${by.blocked.length}  (likely anti-bot; verify in a browser)`);
  console.log(`  dead:     ${by.dead.length}  (needs fix/drop)`);

  if (by.dead.length) {
    console.log('\n--- DEAD (fix or drop) ---');
    by.dead.forEach(r => console.log(`  [${r.status || '-'}] ${r.id} (${r.field}) ${r.url}${r.note ? '  <' + r.note + '>' : ''}`));
  }
  if (by.redirect.length) {
    console.log('\n--- REDIRECT (moved host) ---');
    by.redirect.forEach(r => console.log(`  [${r.status}] ${r.id} (${r.field}) ${r.url} -> ${r.finalUrl}`));
  }
  console.log(`\nFull report: ${path.relative(ROOT, args.out)}`);
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
