const { validateHiringEvidenceUrls } = require('../hiring-gate');
const companies = require('../../data/companies.json');
const bad = companies.filter(
  (x) => x.ownerVerified === false && validateHiringEvidenceUrls(x, x.id).length
);
console.log(bad.map((x) => x.id).join('\n'));
console.error(`\n${bad.length} failing`);
