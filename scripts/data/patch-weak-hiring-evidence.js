/**
 * DEPRECATED — do not run.
 *
 * Previous version patched hiringEvidence with careers search URLs (?keywords=AEM).
 * That is not valid evidence. hiringEvidence must be a specific job posting URL
 * (foundit.in/job/…, builtin.com/job/…, employer ATS /job/…, etc.).
 *
 * Use instead:
 *   node scripts/data/audit-hiring-evidence.js
 *   node scripts/verify-companies.js  (fails ownerVerified:false rows with search links)
 *
 * Research standard: .playbook/07_RESEARCH_GUIDE.md
 */
console.error(
  'patch-weak-hiring-evidence.js is deprecated. hiringEvidence requires specific job URLs — not search links.'
);
process.exit(1);
