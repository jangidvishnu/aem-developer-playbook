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

/** True when URL points at one job requisition, not a search portal or careers home. */
function isSpecificJobPostingUrl(url) {
  if (!isHttpUrl(url)) return false;
  const u = url.trim();
  const JOB_PATTERNS = [
    /\/job\//i,
    /foundit\.in\/job\//i,
    /builtin\.com\/job\//i,
    /linkedin\.com\/jobs\/view\//i,
    /naukri\.com\/job-listings-/i,
    /\/en\/jobs\/r-/i,
    /myworkdayjobs\.com\/[^?]+\/job\//i,
    /greenhouse\.io\/[^?]+\/jobs\/\d+/i,
    /boards\.greenhouse\.io\/[^?]+\/jobs\/\d+/i,
    /lever\.co\/[^/]+\/[a-f0-9-]{36}/i,
    /applytojob\.com\/apply\//i,
    /\/positions\/[^/?#]+/i,
    /hirist\.tech\/j\//i,
    /smartrecruiters\.com\/[^/]+\/\d+/i,
    /icims\.com\/jobs\/\d+/i,
    /taleo\.net\/[^?]+jobdetail/i,
    /indeed\.com\/viewjob/i,
    /careers\.[^/]+\/[^?]*\/job\/[^/?#]+/i,
    /jobs\.[^/]+\/[^?]*\/job\/[^/?#]+/i
  ];
  if (JOB_PATTERNS.some(p => p.test(u))) return true;

  const SEARCH_OR_PORTAL = [
    /search-results/i,
    /search-jobs/i,
    /job-search/i,
    /career-search/i,
    /[?&](keywords?|keyword|q|query|search)=/i,
    /\/search\//i,
    /\/search$/i,
    /naukri\.com\/[^/]+-jobs-careers$/i,
    /foundit\.in\/search\//i,
    /myworkdayjobs\.com\/[^?]+\?q=/i,
    /builtin\.com\/company\/[^/]+\/jobs$/i,
    /\/careers\/?$/i,
    /\/careers\.html$/i,
    /\/jobs\/?$/i,
    /\/jobs\?/i
  ];
  if (SEARCH_OR_PORTAL.some(p => p.test(u))) return false;

  return false;
}

function validateHiringEvidenceUrls(co, label) {
  const errors = [];
  const hiringEvidence = co.hiringEvidence || co.AEMHiringEvidence || [];
  if (!Array.isArray(hiringEvidence)) return errors;

  const jobUrls = hiringEvidence.filter(isHttpUrl);
  if (!jobUrls.length) return errors;

  const weak = jobUrls.filter(u => !isSpecificJobPostingUrl(u));
  if (weak.length) {
    errors.push(`${label}: hiringEvidence must be specific AEM job posting URL(s), not careers/search portals — weak: ${weak.join(', ')}`);
  }
  return errors;
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
  if (!Array.isArray(evidence) || evidence.length === 0 || !evidence.some(isHttpUrl)) return false;
  if (!isHttpUrl(co.careersUrl)) return false;
  if (!Array.isArray(co.products) || co.products.length === 0) return false;
  if (co.ownerVerified === false) return true;
  const hiringEvidence = co.hiringEvidence || co.AEMHiringEvidence;
  if (!Array.isArray(hiringEvidence) || hiringEvidence.length === 0 || !hiringEvidence.some(isHttpUrl)) {
    return false;
  }
  return true;
}

function validateHiringGate(co, label) {
  const errors = [];
  if (!passesPublicGate(co)) {
    errors.push(
      `${label}: public table requires evidence, careersUrl http, non-empty products` +
        (co.ownerVerified === false ? '' : ', and hiringEvidence')
    );
  }
  if (co.ownerVerified !== false) {
    const hiringEvidence = co.hiringEvidence || co.AEMHiringEvidence;
    if (!Array.isArray(hiringEvidence) || !hiringEvidence.some(isHttpUrl)) {
      errors.push(`${label}: hiringEvidence must include at least one http URL`);
    }
  }
  if (co.ownerVerified === false) {
    errors.push(...validateHiringEvidenceUrls(co, label));
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
  validateHiringEvidenceUrls,
  isSpecificJobPostingUrl,
  isHttpUrl
};
