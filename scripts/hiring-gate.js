/**
 * Milestone 8 hiring gate — shared logic for build + verify scripts.
 * See 12_DECISIONS.md DR-008 and 11_COMPANY_SCHEMA.md.
 */

const AEM_ROLE_PATTERN = /aem|adobe experience manager|experience manager|dxp|adobe cloud|edge delivery|martech|digital experience/i;

const HIRING_INTENSITY_VALUES = ['High', 'Medium', 'Low', 'Unknown'];

function isHttpUrl(value) {
  return typeof value === 'string' && value.startsWith('http');
}

function inferAEMWorkFocus(co) {
  const focus = new Set();
  if (co.Sites) focus.add('Sites');
  if (co.Assets) focus.add('Assets');
  if (co.Forms) focus.add('Forms');
  if (co.AEMaaCS) focus.add('Cloud migration');
  if (co.EdgeDeliveryServices) focus.add('EDS');
  if (co.MigrationStatus && /migrat|cloud/i.test(co.MigrationStatus)) focus.add('Cloud migration');
  if (co.GraphQL) focus.add('Headless');
  if (co.AEP) focus.add('AEP');
  return [...focus];
}

function hasHiringSignal(co) {
  if (isHttpUrl(co.directJobSearch)) return true;
  if (Array.isArray(co.TypicalRoles) && co.TypicalRoles.length > 0 && co.TypicalRoles.some(role => AEM_ROLE_PATTERN.test(role))) {
    return true;
  }
  if (co.HiringIndia === 'Yes' || co.HiringIndia === true) return true;
  if (co.HiringGlobal === 'Yes' || co.HiringGlobal === true) return true;
  if (Array.isArray(co.AEMHiringEvidence) && co.AEMHiringEvidence.some(isHttpUrl)) return true;
  return false;
}

function inferAEMHiringEvidence(co) {
  if (Array.isArray(co.AEMHiringEvidence) && co.AEMHiringEvidence.length > 0) {
    return co.AEMHiringEvidence.filter(isHttpUrl);
  }
  if (isHttpUrl(co.directJobSearch)) return [co.directJobSearch];
  if (isHttpUrl(co.careersUrl) && hasHiringSignal(co)) return [co.careersUrl];
  return [];
}

function inferHiringIntensity(co, hiringAEM) {
  if (!hiringAEM) return 'Unknown';
  if (isHttpUrl(co.directJobSearch)) return 'High';
  if (co.HiringIndia === 'Yes' && Array.isArray(co.TypicalRoles) && co.TypicalRoles.length > 0) {
    return 'Medium';
  }
  if (Array.isArray(co.TypicalRoles) && co.TypicalRoles.length > 0) return 'Medium';
  if (co.HiringGlobal === 'Yes' || co.HiringIndia === 'Yes') return 'Low';
  return 'Low';
}

function applyM8Fields(co) {
  const AEMHiringEvidence = inferAEMHiringEvidence(co);
  const HiringAEM = hasHiringSignal(co) && AEMHiringEvidence.length > 0;
  return {
    ...co,
    HiringAEM,
    AEMHiringEvidence,
    AEMWorkFocus: inferAEMWorkFocus(co),
    HiringIntensity: inferHiringIntensity(co, HiringAEM),
    AdobeSpend: co.AdobeSpend || 'Unknown',
    LastHiringVerified: co.LastHiringVerified || null
  };
}

function passesPublicGate(co) {
  if (co.usesAEM !== true) return false;
  if (!Array.isArray(co.Evidence) || co.Evidence.length === 0) return false;
  if (co.HiringAEM !== true) return false;
  if (!Array.isArray(co.AEMHiringEvidence) || co.AEMHiringEvidence.length === 0) return false;
  if (!isHttpUrl(co.careersUrl)) return false;
  return true;
}

function validateHiringGate(co, label) {
  const errors = [];
  if (!passesPublicGate(co)) {
    errors.push(`${label}: public table requires usesAEM, Evidence, careersUrl http, HiringAEM true, AEMHiringEvidence`);
  }
  if (co.HiringAEM === true && (!Array.isArray(co.AEMHiringEvidence) || co.AEMHiringEvidence.length === 0)) {
    errors.push(`${label}: HiringAEM true requires non-empty AEMHiringEvidence`);
  }
  if (co.HiringIntensity && !HIRING_INTENSITY_VALUES.includes(co.HiringIntensity)) {
    errors.push(`${label}: HiringIntensity must be one of ${HIRING_INTENSITY_VALUES.join(', ')}`);
  }
  if (co.AdobeSpend && typeof co.AdobeSpend !== 'string') {
    errors.push(`${label}: AdobeSpend must be a string`);
  }
  if (!Array.isArray(co.AEMWorkFocus)) {
    errors.push(`${label}: AEMWorkFocus must be an array`);
  }
  return errors;
}

module.exports = {
  AEM_ROLE_PATTERN,
  HIRING_INTENSITY_VALUES,
  applyM8Fields,
  passesPublicGate,
  hasHiringSignal,
  validateHiringGate,
  isHttpUrl
};
