#!/usr/bin/env node
/**
 * Start static server, run Playwright search smoke test, then stop server.
 * Usage (from repo root): npm run ui-smoke
 * Requires: npm install (devDependencies) and npx playwright install chromium
 */
import { spawn } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import waitOn from 'wait-on';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, '..');
const PORT = process.env.PORT || '3456';
const BASE = process.env.BASE_URL || `http://localhost:${PORT}`;
const HEADED = process.argv.includes('--headed') || /^(1|true|yes)$/i.test(process.env.HEADED || '');
const childEnv = { ...process.env, BASE_URL: BASE, ...(HEADED ? { HEADED: '1' } : {}) };

function runNode(script, env = {}) {
  return new Promise((resolve, reject) => {
    const child = spawn(process.execPath, [script], {
      cwd: root,
      env: { ...childEnv, ...env },
      stdio: 'inherit'
    });
    child.on('error', reject);
    child.on('close', code => (code === 0 ? resolve() : reject(new Error(`${script} exited ${code}`))));
  });
}

const serve = spawn(
  process.platform === 'win32' ? 'npx.cmd' : 'npx',
  ['serve', '.', '-p', PORT],
  { cwd: root, stdio: 'pipe', shell: process.platform === 'win32' }
);

let serveLog = '';
serve.stdout?.on('data', d => { serveLog += d; });
serve.stderr?.on('data', d => { serveLog += d; });

try {
  await waitOn({ resources: [BASE], timeout: 30000, interval: 250, window: 1000 });
  if (HEADED) console.log('Opening Chromium (headed mode) — watch the browser window…');
  await runNode(join(__dirname, 'ui-smoke-search.mjs'));
  await runNode(join(__dirname, 'ui-smoke-companies.mjs'));
  console.log('run-ui-smoke: PASS');
} catch (err) {
  console.error('run-ui-smoke: FAIL');
  if (serveLog) console.error(serveLog);
  console.error(err.message || err);
  process.exitCode = 1;
} finally {
  serve.kill('SIGTERM');
}
