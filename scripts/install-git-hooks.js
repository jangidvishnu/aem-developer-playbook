#!/usr/bin/env node
/**
 * Copies scripts/git-hooks/pre-commit into .git/hooks/pre-commit (Milestone 13).
 * Runs automatically via the "prepare" npm script after `npm install` / `npm ci`. No-ops outside
 * a git checkout (missing .git) so it never breaks a plain install or a non-git CI environment.
 */
const fs = require('fs');
const path = require('path');

const repoRoot = path.join(__dirname, '..');
const gitDir = path.join(repoRoot, '.git');
const hooksDir = path.join(gitDir, 'hooks');
const source = path.join(__dirname, 'git-hooks', 'pre-commit');
const dest = path.join(hooksDir, 'pre-commit');

if (!fs.existsSync(gitDir) || !fs.statSync(gitDir).isDirectory()) {
  process.exit(0);
}

try {
  fs.mkdirSync(hooksDir, { recursive: true });
  fs.copyFileSync(source, dest);
  fs.chmodSync(dest, 0o755);
  console.log('Installed pre-commit hook: scripts/git-hooks/pre-commit -> .git/hooks/pre-commit');
} catch (err) {
  console.warn('Could not install pre-commit hook (non-fatal):', err.message);
}
