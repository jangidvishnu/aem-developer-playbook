#!/usr/bin/env node
/**
 * Milestone 6 seed: verified Adobe case-study companies + Tier-1 unverified + Needs review.
 * Dev-only. Run: node scripts/build-companies-m6.js
 * Output: data/companies.json
 */

const fs = require('fs');
const path = require('path');
const { emptyCompany } = require('./company-schema');
const { VERIFIED_DATE, buildVerifiedRecords } = require('./company-verified-records');

const needsReview = [
  emptyCompany({
    id: 'workday',
    name: 'Workday',
    priority: 9,
    industry: 'Software',
    companyType: 'Product',
    headquarters: 'Pleasanton, USA',
    indiaPresence: 'Yes',
    careersUrl: 'https://www.workday.com/en-in/company/careers',
    usesAEM: false,
    VisaSupport: 'Limited',
    HiringIndia: 'Yes',
    Notes:
      'Phase 4 report cites AEMaaCS + Edge Delivery at Summit; formal Adobe case-study URL not yet attached — Needs review.',
    References: ['md/deep-research-report-phase-4.md', 'md/deep-research-report.md'],
    LastVerified: VERIFIED_DATE,
    Status: 'Needs review'
  }),
  emptyCompany({
    id: 'servicenow',
    name: 'ServiceNow',
    priority: 9,
    industry: 'Software',
    companyType: 'Product',
    headquarters: 'Santa Clara, USA',
    indiaPresence: 'Yes',
    careersUrl: 'https://careers.servicenow.com/',
    usesAEM: false,
    VisaSupport: 'Limited',
    HiringIndia: 'Yes',
    Notes: 'Tier-1 Phase 1 target; no vendor-confirmed AEM evidence URL on file yet — Needs review.',
    References: ['md/deep-research-report.md'],
    LastVerified: VERIFIED_DATE,
    Status: 'Needs review'
  })
];

const tier1Unverified = [
  ['sap', 'SAP', 9, 'Software'],
  ['microsoft', 'Microsoft', 9, 'Software'],
  ['salesforce', 'Salesforce', 8, 'Software'],
  ['atlassian', 'Atlassian', 8, 'Software'],
  ['intuit', 'Intuit', 8, 'Software'],
  ['vmware', 'VMware (Broadcom)', 7, 'Software'],
  ['samsung', 'Samsung', 8, 'Electronics'],
  ['siemens', 'Siemens', 8, 'Industrial'],
  ['bosch', 'Bosch', 7, 'Industrial'],
  ['nokia', 'Nokia', 7, 'Telecom'],
  ['ericsson', 'Ericsson', 7, 'Telecom'],
  ['hp', 'HP', 7, 'Technology'],
  ['intel', 'Intel', 7, 'Semiconductors'],
  ['dell', 'Dell Technologies', 8, 'Technology'],
  ['mastercard', 'MasterCard', 8, 'Finance'],
  ['american-express', 'American Express', 8, 'Finance'],
  ['jpmorgan-chase', 'JPMorgan Chase', 8, 'Finance'],
  ['fidelity', 'Fidelity Investments', 7, 'Finance'],
  ['lowes', "Lowe's", 7, 'Retail']
].map(([id, name, priority, industry]) =>
  emptyCompany({
    id,
    name,
    priority,
    industry,
    companyType: 'Product',
    Notes:
      'Tier-1 candidate from md/deep-research-report.md; no Tier-1/2 AEM evidence URL attached yet per 07_RESEARCH_GUIDE.md.',
    References: ['md/deep-research-report.md']
  })
);

const verified = buildVerifiedRecords(emptyCompany);
const verifiedIds = new Set(verified.map(c => c.id));

const unverified = tier1Unverified.filter(c => !verifiedIds.has(c.id));
const companies = [...verified, ...needsReview, ...unverified].sort(
  (a, b) => b.priority - a.priority || a.name.localeCompare(b.name)
);

const out = path.join(__dirname, '..', 'data', 'companies.json');
fs.writeFileSync(out, JSON.stringify(companies, null, 2) + '\n');
const verifiedCount = companies.filter(c => c.Status === 'Verified').length;
console.log(`Wrote ${companies.length} companies (${verifiedCount} Verified) to`, out);
