/**
 * Shared company record shape for Milestone 6 (see 11_COMPANY_SCHEMA.md).
 * Dev-only — never loaded by index.html.
 */

const REQUIRED_KEYS = [
  'id', 'name', 'priority', 'industry', 'companyType', 'headquarters', 'indiaPresence',
  'careersUrl', 'careersLogin', 'directJobSearch', 'usesAEM', 'AdobeProducts', 'AEMVersion',
  'AEMaaCS', 'EdgeDeliveryServices', 'UniversalEditor', 'GraphQL', 'AEP', 'Analytics', 'Target',
  'Forms', 'Assets', 'Sites', 'MigrationStatus', 'EngineeringCulture', 'Compensation',
  'WorkLifeBalance', 'VisaSupport', 'HiringIndia', 'HiringGlobal', 'InterviewDifficulty',
  'TypicalRoles', 'Recruiters', 'Notes', 'Evidence', 'References', 'LastVerified', 'Status',
  'Wishlist', 'Applied', 'Interview', 'Offer', 'Rejected'
];

function emptyCompany(overrides = {}) {
  const base = {
    id: 'unknown',
    name: 'Unknown',
    priority: 0,
    industry: 'Unknown',
    companyType: 'Unknown',
    headquarters: 'Unknown',
    indiaPresence: 'Unknown',
    careersUrl: 'Unknown',
    careersLogin: 'Unknown',
    directJobSearch: 'Unknown',
    usesAEM: false,
    AdobeProducts: [],
    AEMVersion: 'Unknown',
    AEMaaCS: false,
    EdgeDeliveryServices: false,
    UniversalEditor: false,
    GraphQL: false,
    AEP: false,
    Analytics: false,
    Target: false,
    Forms: false,
    Assets: false,
    Sites: false,
    MigrationStatus: 'Unknown',
    EngineeringCulture: 'Unknown',
    Compensation: 'Unknown',
    WorkLifeBalance: 'Unknown',
    VisaSupport: 'Unknown',
    HiringIndia: 'Unknown',
    HiringGlobal: 'Unknown',
    InterviewDifficulty: 'Unknown',
    TypicalRoles: [],
    Recruiters: [],
    Notes: '',
    Evidence: [],
    References: [],
    LastVerified: null,
    Status: 'Unverified',
    Wishlist: false,
    Applied: false,
    Interview: false,
    Offer: false,
    Rejected: false
  };
  return Object.assign(base, overrides);
}

function validateCompany(co, index) {
  const errors = [];
  const label = co.id || `index ${index}`;

  REQUIRED_KEYS.forEach(key => {
    if (!(key in co)) errors.push(`${label}: missing key "${key}"`);
  });

  if (typeof co.priority !== 'number' || co.priority < 0 || co.priority > 10) {
    errors.push(`${label}: priority must be a number 0–10`);
  }

  if (co.usesAEM === true && (!Array.isArray(co.Evidence) || co.Evidence.length === 0)) {
    errors.push(`${label}: usesAEM true requires non-empty Evidence`);
  }

  if (co.Status === 'Verified' && !co.LastVerified) {
    errors.push(`${label}: Status Verified requires LastVerified`);
  }

  if (co.Status === 'Verified' && (!Array.isArray(co.Evidence) || co.Evidence.length === 0)) {
    errors.push(`${label}: Status Verified requires non-empty Evidence`);
  }

  return errors;
}

module.exports = { REQUIRED_KEYS, emptyCompany, validateCompany };
