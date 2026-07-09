/**
 * Public company hiring gate — shared logic for build + verify scripts.
 * See 12_DECISIONS.md DR-008 and 11_COMPANY_SCHEMA.md.
 */

const AEM_ROLE_PATTERN = /aem|adobe experience manager|experience manager|dxp|adobe cloud|edge delivery|martech|digital experience/i;

const PRODUCT_CODES = [
  'sites',
  'assets',
  'forms',
  'aem-cloud',
  'eds',
  'headless',
  'universal-editor',
  'aep',
  'analytics',
  'target',
  'ajo',
  'campaign',
  'cja',
  'workfront',
  'commerce',
  'launch',
  'guides',
  'creative-cloud'
];

function isHttpUrl(value) {
  return typeof value === 'string' && value.startsWith('http');
}

function hasProduct(co, code) {
  return Array.isArray(co.products) && co.products.includes(code);
}

function hasHiringSignal(co) {
  if (isHttpUrl(co.jobSearchUrl) || isHttpUrl(co.directJobSearch)) return true;
  if (Array.isArray(co.roles) && co.roles.some(role => AEM_ROLE_PATTERN.test(role))) return true;
  if (Array.isArray(co.TypicalRoles) && co.TypicalRoles.some(role => AEM_ROLE_PATTERN.test(role))) return true;
  if (co.hiringIndia === true || co.HiringIndia === 'Yes') return true;
  if (Array.isArray(co.hiringEvidence) && co.hiringEvidence.some(isHttpUrl)) return true;
  if (Array.isArray(co.AEMHiringEvidence) && co.AEMHiringEvidence.some(isHttpUrl)) return true;
  return false;
}

function passesPublicGate(co) {
  const evidence = co.evidence || co.Evidence;
  const hiringEvidence = co.hiringEvidence || co.AEMHiringEvidence;
  if (!Array.isArray(evidence) || evidence.length === 0 || !evidence.some(isHttpUrl)) return false;
  if (!Array.isArray(hiringEvidence) || hiringEvidence.length === 0 || !hiringEvidence.some(isHttpUrl)) return false;
  if (!isHttpUrl(co.careersUrl)) return false;
  if (!Array.isArray(co.products) || co.products.length === 0) return false;
  return true;
}

function validateHiringGate(co, label) {
  const errors = [];
  if (!passesPublicGate(co)) {
    errors.push(`${label}: public table requires evidence, careersUrl http, hiringEvidence, and non-empty products`);
  }
  const hiringEvidence = co.hiringEvidence || co.AEMHiringEvidence;
  if (!Array.isArray(hiringEvidence) || !hiringEvidence.some(isHttpUrl)) {
    errors.push(`${label}: hiringEvidence must include at least one http URL`);
  }
  return errors;
}

module.exports = {
  AEM_ROLE_PATTERN,
  PRODUCT_CODES,
  hasProduct,
  hasHiringSignal,
  passesPublicGate,
  validateHiringGate,
  isHttpUrl
};
