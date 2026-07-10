/**
 * Shared company record shape for the public employer list (see 11_COMPANY_SCHEMA.md).
 * Dev-only — never loaded by index.html.
 */

const { validateHiringGate, PRODUCT_CODES } = require('./hiring-gate');

const REQUIRED_KEYS = [
  'id',
  'name',
  'priority',
  'industry',
  'companyType',
  'careersUrl',
  'products',
  'roles',
  'notes',
  'evidence',
  'hiringEvidence',
  'verifiedAt',
  'ownerVerified'
];

const OPTIONAL_KEYS = [
  'hq',
  'indiaPresence',
  'hiringIndia',
  'jobSearchUrl',
  'hiringActive',
  'ownerPreferred',
  'signals',
  'locations',
  'remote',
  'noticePolicy'
];

const SIGNAL_SCORE_KEYS = ['overall', 'hiring', 'culture', 'benefits', 'workLife'];
const SIGNAL_SOURCES = ['glassdoor', 'ambitionbox', 'levels', 'blind', 'owner', 'other'];

// Notice-period buckets for the (data-only for now) notice filter. `flexible-long` covers
// "employer allows long notice" or "range unknown but not immediate-only".
const NOTICE_POLICIES = ['immediate', '30d', '60d', '90d', 'flexible-long'];

function emptyCompany(overrides = {}) {
  const base = {
    id: 'unknown',
    name: 'Unknown',
    priority: 0,
    industry: 'Unknown',
    companyType: 'Unknown',
    careersUrl: 'https://example.com/',
    products: ['sites'],
    roles: [],
    notes: '',
    evidence: [],
    hiringEvidence: [],
    verifiedAt: null,
    ownerVerified: false
  };
  return Object.assign(base, overrides);
}

function isScore(n) {
  return typeof n === 'number' && !Number.isNaN(n) && n >= 0 && n <= 5;
}

function validateSignals(signals, label) {
  const errors = [];
  if (signals == null) return errors;
  if (typeof signals !== 'object' || Array.isArray(signals)) {
    errors.push(`${label}: signals must be an object when present`);
    return errors;
  }

  if (!isScore(signals.overall)) {
    errors.push(`${label}: signals.overall must be a number 0–5`);
  }

  SIGNAL_SCORE_KEYS.filter(k => k !== 'overall').forEach(key => {
    if (key in signals && signals[key] != null && !isScore(signals[key])) {
      errors.push(`${label}: signals.${key} must be a number 0–5 when present`);
    }
  });

  if (!signals.source || !SIGNAL_SOURCES.includes(signals.source)) {
    errors.push(`${label}: signals.source must be one of ${SIGNAL_SOURCES.join(', ')}`);
  }

  if (signals.sourceUrl != null) {
    if (typeof signals.sourceUrl !== 'string' || !signals.sourceUrl.startsWith('http')) {
      errors.push(`${label}: signals.sourceUrl must be an http(s) URL when present`);
    }
  }

  if (!signals.asOf || typeof signals.asOf !== 'string') {
    errors.push(`${label}: signals.asOf (ISO date) is required when signals is present`);
  }

  if (signals.sampleSize != null && typeof signals.sampleSize !== 'string' && typeof signals.sampleSize !== 'number') {
    errors.push(`${label}: signals.sampleSize must be a string or number when present`);
  }

  if (signals.notes != null && typeof signals.notes !== 'string') {
    errors.push(`${label}: signals.notes must be a string when present`);
  }

  return errors;
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

  if (!Array.isArray(co.products) || co.products.length === 0) {
    errors.push(`${label}: products must be a non-empty array`);
  } else {
    co.products.forEach(p => {
      if (!PRODUCT_CODES.includes(p)) errors.push(`${label}: unknown product code "${p}"`);
    });
  }

  if (!Array.isArray(co.roles)) errors.push(`${label}: roles must be an array`);
  if (!Array.isArray(co.evidence) || co.evidence.length === 0) {
    errors.push(`${label}: evidence must be a non-empty array of http URLs`);
  }
  if (typeof co.notes !== 'string') errors.push(`${label}: notes must be a string`);
  if (!co.verifiedAt) errors.push(`${label}: verifiedAt is required`);

  if (co.ownerVerified !== true && co.ownerVerified !== false) {
    errors.push(`${label}: ownerVerified must be boolean (false until the project owner manually checks the row)`);
  }

  if ('indiaPresence' in co && co.indiaPresence !== true && co.indiaPresence !== false) {
    errors.push(`${label}: indiaPresence must be boolean when present`);
  }
  if ('hiringIndia' in co && co.hiringIndia !== true && co.hiringIndia !== false) {
    errors.push(`${label}: hiringIndia must be boolean when present`);
  }
  if ('hiringActive' in co && co.hiringActive !== true && co.hiringActive !== false) {
    errors.push(`${label}: hiringActive must be boolean when present`);
  }
  if ('ownerPreferred' in co && co.ownerPreferred !== true && co.ownerPreferred !== false) {
    errors.push(`${label}: ownerPreferred must be boolean when present`);
  }

  if ('remote' in co && co.remote !== true && co.remote !== false) {
    errors.push(`${label}: remote must be boolean when present`);
  }

  if ('noticePolicy' in co && co.noticePolicy != null && co.noticePolicy !== '') {
    if (!NOTICE_POLICIES.includes(co.noticePolicy)) {
      errors.push(`${label}: noticePolicy must be one of ${NOTICE_POLICIES.join(', ')}`);
    }
  }

  if ('locations' in co) {
    if (!Array.isArray(co.locations)) {
      errors.push(`${label}: locations must be an array when present`);
    } else {
      co.locations.forEach((loc, i) => {
        if (!loc || typeof loc !== 'object' || Array.isArray(loc)) {
          errors.push(`${label}: locations[${i}] must be an object { city?, country }`);
          return;
        }
        if (!loc.country || typeof loc.country !== 'string') {
          errors.push(`${label}: locations[${i}].country is required (string)`);
        }
        if (loc.city != null && typeof loc.city !== 'string') {
          errors.push(`${label}: locations[${i}].city must be a string when present`);
        }
      });
    }
  }

  if ('signals' in co) {
    errors.push(...validateSignals(co.signals, label));
  }

  errors.push(...validateHiringGate(co, label));

  return errors;
}

module.exports = {
  REQUIRED_KEYS,
  OPTIONAL_KEYS,
  SIGNAL_SCORE_KEYS,
  SIGNAL_SOURCES,
  NOTICE_POLICIES,
  emptyCompany,
  validateCompany,
  validateSignals,
  PRODUCT_CODES
};
