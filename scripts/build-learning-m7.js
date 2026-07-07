#!/usr/bin/env node
/**
 * Milestone 7 seed writer — generates learning data/*.json and roadmaps.json.
 * Usage: node scripts/build-learning-m7.js
 */

const fs = require('fs');
const path = require('path');
const seed = require('./learning-seed-data');

const root = path.join(__dirname, '..', 'data');

function write(name, data) {
  const out = path.join(root, name);
  fs.writeFileSync(out, JSON.stringify(data, null, 2) + '\n');
  console.log('Wrote', data.length, 'records to', path.relative(process.cwd(), out));
}

write('resources.json', seed.resources);
write('technologies.json', seed.technologies);
write('glossary.json', seed.glossary);
write('career_paths.json', seed.careerPaths);
write('interviews.json', seed.interviews);
write('templates.json', seed.templates);
write('roadmaps.json', seed.roadmaps);
