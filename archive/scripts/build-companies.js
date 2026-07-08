#!/usr/bin/env node
/**
 * Apply hiring overrides, hiring gate; merge seeds from data/company-sources.json.
 * Usage: node scripts/build-companies.js
 */

const fs = require('fs');
const path = require('path');
const { emptyCompany } = require('./company-schema');
const { applyM8Fields, passesPublicGate } = require('./hiring-gate');
const { COMPANY_OVERRIDES } = require('./company-overrides');
const { buildCompanyRecords } = require('./company-records');

const root = path.join(__dirname, '..');
const companiesPath = path.join(root, 'data', 'companies.json');
const manifestDir = path.join(root, 'data', 'manifests');
const candidatesPath = path.join(manifestDir, 'company-candidates.json');
const queuePath = path.join(manifestDir, 'research-queue.json');

function archiveReason(co) {
  if (co.usesAEM !== true) return 'no_aem_evidence';
  if (!Array.isArray(co.Evidence) || co.Evidence.length === 0) return 'missing_evidence';
  if (!co.careersUrl || !co.careersUrl.startsWith('http')) return 'missing_careers_url';
  if (co.HiringAEM !== true) return 'no_hiring_signal';
  if (!Array.isArray(co.AEMHiringEvidence) || co.AEMHiringEvidence.length === 0) {
    return 'missing_hiring_evidence';
  }
  return 'failed_gate';
}

function mergeOverride(co) {
  const patch = COMPANY_OVERRIDES[co.id];
  if (!patch) return co;
  return { ...co, ...patch };
}

const existing = JSON.parse(fs.readFileSync(companiesPath, 'utf8'));
const existingIds = new Set(existing.map(c => c.id));

const newRecords = buildCompanyRecords(emptyCompany).filter(c => !existingIds.has(c.id));
const merged = [...existing, ...newRecords].map(mergeOverride).map(applyM8Fields);

const publicRows = [];
const archived = [];

merged.forEach(co => {
  if (passesPublicGate(co)) {
    publicRows.push(co);
  } else {
    archived.push({
      ...co,
      archivedAt: new Date().toISOString().slice(0, 10),
      archiveReason: archiveReason(co)
    });
  }
});

publicRows.sort((a, b) => b.priority - a.priority || a.name.localeCompare(b.name));

if (!fs.existsSync(manifestDir)) fs.mkdirSync(manifestDir, { recursive: true });

const priorCandidates = fs.existsSync(candidatesPath)
  ? JSON.parse(fs.readFileSync(candidatesPath, 'utf8'))
  : { archived: [] };

const priorArchived = Array.isArray(priorCandidates.archived) ? priorCandidates.archived : [];
const priorIds = new Set(priorArchived.map(c => c.id));
archived.forEach(c => {
  if (!priorIds.has(c.id)) priorArchived.push(c);
});

fs.writeFileSync(
  candidatesPath,
  JSON.stringify(
    {
      note: 'Non-public company rows per DR-008 — not deleted, available for re-research.',
      archived: priorArchived.sort((a, b) => a.name.localeCompare(b.name))
    },
    null,
    2
  ) + '\n'
);

if (!fs.existsSync(queuePath)) {
  fs.writeFileSync(
    queuePath,
    JSON.stringify(
      {
        note: 'Research queue — pending | researched | promoted | archived',
        items: archived.map(c => ({
          id: c.id,
          name: c.name,
          status: 'archived',
          reason: c.archiveReason
        }))
      },
      null,
      2
    ) + '\n'
  );
}

fs.writeFileSync(companiesPath, JSON.stringify(publicRows, null, 2) + '\n');

const verified = publicRows.filter(c => c.Status === 'Verified').length;
console.log(
  `Wrote ${publicRows.length} public companies (${verified} Verified) to companies.json`
);
console.log(`Archived ${archived.length} rows this run; manifest total ${priorArchived.length}`);
