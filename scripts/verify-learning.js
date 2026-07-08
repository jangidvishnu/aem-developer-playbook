#!/usr/bin/env node
/**
 * Validates Milestone 7 learning data files (see 09_DATA_MODEL.md).
 * Usage: node scripts/verify-learning.js
 */

const fs = require('fs');
const path = require('path');
const {
  MINIMUMS,
  validateGlossary,
  validateTechnology,
  validateCareerPath,
  validateInterview,
  validateTemplate,
  validateResource,
  validateRoadmap,
  collectIds,
  validateCrossRefs
} = require('./learning-schema');

const root = path.join(__dirname, '..', 'data');

function load(name) {
  return JSON.parse(fs.readFileSync(path.join(root, name), 'utf8'));
}

const glossary = load('glossary.json');
const technologies = load('technologies.json');
const careerPaths = load('career_paths.json');
const interviews = load('interviews.json');
const templates = load('templates.json');
const resources = load('resources.json');
const roadmaps = load('roadmaps.json');
const chapters = load('chapters.json');

let errors = [];

[glossary, technologies, careerPaths, interviews, templates, resources, roadmaps].forEach((arr, i) => {
  if (!Array.isArray(arr)) errors.push(`file ${i}: expected array`);
});

glossary.forEach((g, i) => {
  errors = errors.concat(validateGlossary(g, i));
});
technologies.forEach((t, i) => {
  errors = errors.concat(validateTechnology(t, i));
});
careerPaths.forEach((p, i) => {
  errors = errors.concat(validateCareerPath(p, i));
});
interviews.forEach((q, i) => {
  errors = errors.concat(validateInterview(q, i));
});
templates.forEach((t, i) => {
  errors = errors.concat(validateTemplate(t, i));
});
resources.forEach((r, i) => {
  errors = errors.concat(validateResource(r, i));
});
roadmaps.forEach((rm, i) => {
  errors = errors.concat(validateRoadmap(rm, i));
});

errors = errors.concat(collectIds(glossary));
errors = errors.concat(collectIds(technologies));
errors = errors.concat(collectIds(careerPaths));
errors = errors.concat(collectIds(interviews));
errors = errors.concat(collectIds(templates));
errors = errors.concat(collectIds(resources));
errors = errors.concat(collectIds(roadmaps));

errors = errors.concat(validateCrossRefs({ glossary, technologies, careerPaths, resources, roadmaps, chapters }));

const counts = {
  glossary: glossary.length,
  technologies: technologies.length,
  careerPaths: careerPaths.length,
  interviews: interviews.length,
  templates: templates.length,
  resources: resources.length,
  roadmaps: roadmaps.length
};

console.log('Learning data counts:', counts);

Object.entries(MINIMUMS).forEach(([key, min]) => {
  const n = counts[key];
  if (n < min) errors.push(`minimum ${key}: ${n}/${min} (DR-007)`);
});

if (errors.length) {
  errors.forEach(e => console.error('FAIL', e));
  process.exit(1);
}

console.log('All learning records pass schema validation and minimum counts.');
