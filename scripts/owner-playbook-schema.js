/**
 * Owner playbook data shape for Milestone 10 (see 14_ROADMAP.md).
 * Dev-only — never loaded by index.html directly except via fetch.
 */

const MIN_SECTIONS = 5;

const REQUIRED_SECTION_KEYS = ['id', 'title', 'audience', 'summary'];
const ROOT_KEYS = ['id', 'title', 'summary', 'sections'];

function validateSection(section, index) {
  const errors = [];
  const label = section.id || `section index ${index}`;
  REQUIRED_SECTION_KEYS.forEach(k => {
    if (!(k in section)) errors.push(`${label}: missing "${k}"`);
  });
  if (section.audience !== 'owner') {
    errors.push(`${label}: audience must be "owner"`);
  }
  if (!section.summary || !String(section.summary).trim()) {
    errors.push(`${label}: summary must be non-empty`);
  }
  const hasBody = section.body && String(section.body).trim();
  const hasSteps = Array.isArray(section.steps) && section.steps.length > 0;
  if (!hasBody && !hasSteps) {
    errors.push(`${label}: requires body or steps`);
  }
  if (section.steps && !Array.isArray(section.steps)) {
    errors.push(`${label}: steps must be an array`);
  }
  return errors;
}

function validateOwnerPlaybook(playbook) {
  const errors = [];
  if (!playbook || typeof playbook !== 'object') {
    return ['owner_playbook.json: expected object'];
  }
  ROOT_KEYS.forEach(k => {
    if (!(k in playbook)) errors.push(`root: missing "${k}"`);
  });
  if (!Array.isArray(playbook.sections)) {
    errors.push('sections must be an array');
    return errors;
  }
  if (playbook.sections.length < MIN_SECTIONS) {
    errors.push(`sections: expected at least ${MIN_SECTIONS}, got ${playbook.sections.length}`);
  }
  const ids = new Set();
  playbook.sections.forEach((sec, i) => {
    errors.push(...validateSection(sec, i));
    if (sec.id) {
      if (ids.has(sec.id)) errors.push(`duplicate section id "${sec.id}"`);
      ids.add(sec.id);
    }
  });
  const requiredIds = ['apply-workflow', 'outreach', 'learning-sources', 'weekly-rhythm', 'tools'];
  requiredIds.forEach(rid => {
    if (!ids.has(rid)) errors.push(`missing required section id "${rid}"`);
  });
  return errors;
}

module.exports = {
  MIN_SECTIONS,
  validateOwnerPlaybook
};
