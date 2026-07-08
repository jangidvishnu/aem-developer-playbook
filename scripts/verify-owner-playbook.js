#!/usr/bin/env node
/**
 * Validates data/owner_playbook.json (Milestone 10).
 * Usage: node scripts/verify-owner-playbook.js
 */

const fs = require('fs');
const path = require('path');
const { validateOwnerPlaybook } = require('./owner-playbook-schema');

const playbookPath = path.join(__dirname, '..', 'data', 'owner_playbook.json');
const chaptersPath = path.join(__dirname, '..', 'data', 'chapters.json');

const playbook = JSON.parse(fs.readFileSync(playbookPath, 'utf8'));
const chapters = JSON.parse(fs.readFileSync(chaptersPath, 'utf8'));

const errors = validateOwnerPlaybook(playbook);

const embedChapter = chapters.find(c => c.ownerPlaybookEmbed);
if (!embedChapter) {
  errors.push('chapters.json: no chapter with ownerPlaybookEmbed');
} else if (embedChapter.id !== 'how-to-apply') {
  errors.push(`chapters.json: ownerPlaybookEmbed chapter should be how-to-apply, got ${embedChapter.id}`);
}

if (errors.length) {
  console.error('Owner playbook validation failed:');
  errors.forEach(e => console.error(' -', e));
  process.exit(1);
}

console.log('Owner playbook validation passed.');
console.log(`  sections: ${playbook.sections.length}`);
console.log(`  chapter embed: ${embedChapter.id} (${embedChapter.title})`);
