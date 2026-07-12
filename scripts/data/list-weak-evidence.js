const c = require('../../data/companies.json');
for (const x of c.filter((y) => y.ownerVerified === false)) {
  console.log(x.id + '\t' + (x.hiringEvidence || []).join(' | '));
}
