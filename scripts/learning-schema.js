/**
 * Learning data shapes for Milestone 7 (see 09_DATA_MODEL.md).
 * Dev-only — never loaded by index.html.
 */

const MINIMUMS = {
  glossary: 30,
  technologies: 15,
  careerPaths: 2,
  interviews: 20,
  templates: 5,
  resources: 10,
  roadmaps: 3
};

function validateGlossary(term, index) {
  const errors = [];
  const label = term.id || `glossary index ${index}`;
  ['id', 'term', 'definition'].forEach(k => {
    if (!(k in term)) errors.push(`${label}: missing "${k}"`);
  });
  if (!Array.isArray(term.relatedTerms)) errors.push(`${label}: relatedTerms must be an array`);
  return errors;
}

function validateTechnology(tech, index) {
  const errors = [];
  const label = tech.id || `technology index ${index}`;
  ['id', 'name', 'category', 'difficulty', 'summary'].forEach(k => {
    if (!(k in tech)) errors.push(`${label}: missing "${k}"`);
  });
  if (!Array.isArray(tech.prerequisites)) errors.push(`${label}: prerequisites must be an array`);
  if (!Array.isArray(tech.resourceIds)) errors.push(`${label}: resourceIds must be an array`);
  return errors;
}

function validateCareerPath(path, index) {
  const errors = [];
  const label = path.id || `careerPath index ${index}`;
  ['id', 'title', 'summary', 'milestones'].forEach(k => {
    if (!(k in path)) errors.push(`${label}: missing "${k}"`);
  });
  if (!Array.isArray(path.milestones)) errors.push(`${label}: milestones must be an array`);
  return errors;
}

function validateInterview(item, index) {
  const errors = [];
  const label = item.id || `interview index ${index}`;
  ['id', 'question', 'category', 'difficulty', 'guidance'].forEach(k => {
    if (!(k in item)) errors.push(`${label}: missing "${k}"`);
  });
  if (!Array.isArray(item.technologies)) errors.push(`${label}: technologies must be an array`);
  return errors;
}

function validateTemplate(item, index) {
  const errors = [];
  const label = item.id || `template index ${index}`;
  ['id', 'title', 'category', 'body'].forEach(k => {
    if (!(k in item)) errors.push(`${label}: missing "${k}"`);
  });
  return errors;
}

function validateResource(item, index) {
  const errors = [];
  const label = item.id || `resource index ${index}`;
  ['id', 'title', 'url', 'type'].forEach(k => {
    if (!(k in item)) errors.push(`${label}: missing "${k}"`);
  });
  return errors;
}

function validateRoadmap(rm, index) {
  const errors = [];
  const label = rm.id || `roadmap index ${index}`;
  ['id', 'title', 'summary', 'steps'].forEach(k => {
    if (!(k in rm)) errors.push(`${label}: missing "${k}"`);
  });
  if (!Array.isArray(rm.steps) || !rm.steps.length) errors.push(`${label}: steps must be a non-empty array`);
  (rm.steps || []).forEach((step, si) => {
    ['id', 'title', 'status'].forEach(k => {
      if (!(k in step)) errors.push(`${label} step ${si}: missing "${k}"`);
    });
  });
  return errors;
}

function collectIds(items) {
  const ids = new Set();
  const errors = [];
  items.forEach(item => {
    if (ids.has(item.id)) errors.push(`duplicate id: ${item.id}`);
    ids.add(item.id);
  });
  return errors;
}

function validateCrossRefs(data) {
  const errors = [];
  const techIds = new Set(data.technologies.map(t => t.id));
  const resIds = new Set(data.resources.map(r => r.id));
  const chapterIds = new Set(data.chapters.map(c => c.id));

  data.technologies.forEach(t => {
    t.resourceIds.forEach(rid => {
      if (rid && !resIds.has(rid)) errors.push(`${t.id}: unknown resourceId "${rid}"`);
    });
  });

  data.glossary.forEach(g => {
    if (g.chapterId && !chapterIds.has(g.chapterId)) {
      errors.push(`glossary ${g.id}: unknown chapterId "${g.chapterId}"`);
    }
  });

  data.careerPaths.forEach(cp => {
    (cp.milestones || []).forEach((m, i) => {
      (m.technologyIds || []).forEach(tid => {
        if (tid && !techIds.has(tid)) errors.push(`${cp.id} milestone ${i}: unknown technologyId "${tid}"`);
      });
    });
  });

  data.roadmaps.forEach(rm => {
    (rm.steps || []).forEach(step => {
      (step.technologyIds || []).forEach(tid => {
        if (tid && !techIds.has(tid)) errors.push(`roadmap ${rm.id} step ${step.id}: unknown technologyId "${tid}"`);
      });
      (step.resourceIds || []).forEach(rid => {
        if (rid && !resIds.has(rid)) errors.push(`roadmap ${rm.id} step ${step.id}: unknown resourceId "${rid}"`);
      });
    });
  });

  return errors;
}

module.exports = {
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
};
