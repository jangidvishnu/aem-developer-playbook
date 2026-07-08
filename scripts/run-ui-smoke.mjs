#!/usr/bin/env node
/**
 * Start static server, run Playwright smoke tests, then stop server and exit.
 * Usage (from repo root): npm run ui-smoke
 * Requires: npm install (devDependencies) and npx playwright install chromium
 */
import { spawn } from 'node:child_process';
import { createRequire } from 'node:module';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import waitOn from 'wait-on';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, '..');
const require = createRequire(import.meta.url);
const serveEntry = require.resolve('serve/build/main.js');
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

function stopServe(child) {
  if (!child || child.killed || child.exitCode != null) return;
  const pid = child.pid;
  if (!pid) return;
  if (process.platform === 'win32') {
    spawn('taskkill', ['/pid', String(pid), '/T', '/F'], { stdio: 'ignore' });
  } else {
    try {
      process.kill(pid, 'SIGTERM');
    } catch {
      /* already gone */
    }
  }
}

const serve = spawn(process.execPath, [serveEntry, '.', '-p', PORT], {
  cwd: root,
  stdio: ['ignore', 'pipe', 'pipe']
});

let serveLog = '';
serve.stdout?.on('data', d => { serveLog += d; });
serve.stderr?.on('data', d => { serveLog += d; });

let exitCode = 0;
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
  exitCode = 1;
} finally {
  stopServe(serve);
}

// Force exit: leftover serve handles previously kept the process (and CI) hanging after PASS.
process.exit(exitCode);
