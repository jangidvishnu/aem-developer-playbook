/**
 * Truth-pass remediation (2026-07-10):
 * - Archive thin-evidence / M&A / dead-DNS rows (never delete — write manifest)
 * - Fix careersUrl redirects + known 404 replacements for keepers
 * - Bump verifiedAt on touched keepers
 *
 * Run: node scripts/data/apply-truth-pass.js
 */
const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..', '..');
const COMPANIES = path.join(ROOT, 'data', 'companies.json');
const ARCHIVE_OUT = path.join(ROOT, 'archive', 'companies', 'manifests', 'truth-pass-2026-07-10.json');

const TODAY = '2026-07-10';

/** careersUrl replacements (dead → working employer page, or redirect final host) */
const CAREERS_FIXES = {
  // redirects (clean final employer URLs)
  dell: 'https://iawmqy.fa.ocs.oraclecloud.com/hcmUI/CandidateExperience/en/sites/careers',
  cyient: 'https://www.cyient.careers/',
  airtel: 'https://careers.airtel.com/',
  'axis-bank': 'https://www.axis.bank.in/careers',
  innominds: 'https://careers.innominds.com/',
  sasken: 'https://careers.sasken.com/',
  salesforce: 'https://www.salesforce.com/company/careers/',
  hul: 'https://careers.unilever.com/en/india',
  albertsons: 'https://eofd.fa.us6.oraclecloud.com/hcmUI/CandidateExperience/en/sites/CX_1001',
  srijan: 'https://www.materialplus.io/careers/job-openings-apac',
  athenahealth: 'https://careers.athenahealth.com/us/en/',
  sanofi: 'https://jobs.sanofi.com/en',
  infogain: 'https://www.tenarai.com/careers',
  starbucks: 'https://careers.starbucks.com/',
  mckesson: 'https://careers.mckesson.com/en',
  'zimmer-biomet': 'https://careers.zimmerbiomet.com/us/en',
  // dead 404 / DNS replacements for keepers
  sika: 'https://www.sika.com/en/career.html',
  havas: 'https://www.havas.com/who-we-are/our-careers/',
  'national-bank-of-canada': 'https://emplois.bnc.ca/en_CA/careers/home',
  tsb: 'https://www.tsbcareers.co.uk/',
  'r-systems': 'https://www.rsystems.com/join-us/',
  'phygital-insights': 'https://www.phygital-insights.com/careers',
  agileengine: 'https://join.agileengine.com/',
  'schneider-electric': 'https://careers.se.com/jobs',
  'royal-cyber': 'https://www.royalcyber.com/company/careers/',
  'te-connectivity': 'https://careers.te.com/',
  jabil: 'https://careers.jabil.com/',
  zeiss: 'https://www.zeiss.com/career/en/working-at-zeiss.html',
  agilent: 'https://careers.agilent.com/',
  parexel: 'https://jobs.parexel.com/',
  resmed: 'https://www.resmed.com/en-us/corporate/careers.html',
  olympus: 'https://www.olympusamerica.com/careers',
  bruker: 'https://careers.bruker.com/',
  // Adobe-case keepers — best available employer careers entry
  ftd: 'https://www.ftd.com/',
  pethealth: 'https://www.trupanion.com/about/careers',
  'real-madrid': 'https://www.realmadrid.com/en-US/the-club',
  softtek: 'https://jobs.softtek.com/careers/',
  langoor: 'https://www.langoor.com/',
  kotak: 'https://www.kotak.bank.in/en/about-us/careers.html',
  nestdigital: 'https://www.nestdigital.com/career',
  'westcon-comstor': 'https://www.westconcomstor.com/',
  techtarget: 'https://www.informatechtarget.com/careers/',
  tvsmotor: 'https://www.tvsmotor.com/careers-at-tvs',
  'kin-carta': 'https://www.accenture.com/us-en/careers',
  shimadzu: 'https://www.shimadzu.com/aboutus/career/'
};

/** Explicit archive ids (M&A / DNS dead / no employer careers / thin) beyond note-based rules */
const FORCE_ARCHIVE = new Set([
  'willware', // DNS ENOTFOUND
  'orbion', // DNS failure; previously parked closed
  'kin-carta', // acquired by Accenture (parent live)
  'leica-microsystems', // Danaher unit; careers → jobs.danaher.com; parent live
  'westcon-comstor', // thin evidence; previously parked
  'langoor' // no employer-owned careers page (research guide: do not publish)
]);

/** Note patterns → archive (exclude intentional Tier-4 BuiltWith / DR-011) */
function shouldArchiveByNotes(co) {
  const n = String(co.notes || '');
  if (/Tier 4 BuiltWith|DR-011/i.test(n)) return false;
  if (/pending stronger AEM Tier-1\/2/i.test(n)) return true;
  if (/AEM evidence thin/i.test(n)) return true;
  if (/AEM hiring rare|AEM hiring uncommon|AEM usage not strongly evidenced/i.test(n)) return true;
  if (/priority capped pending stronger AEM case|priority capped pending Adobe/i.test(n)) return true;
  if (/CMS\/AEM hiring rare|AEM\/CMS inferred — priority capped/i.test(n)) return true;
  return false;
}

function archiveReason(co) {
  if (FORCE_ARCHIVE.has(co.id)) {
    const reasons = {
      willware: 'DNS failure on careers host; no recoverable employer careers URL',
      orbion: 'DNS failure; previously parked as closed/unavailable',
      'kin-carta': 'M&A — acquired by Accenture (accenture already live)',
      'leica-microsystems': 'M&A/unit — careers funnel to Danaher (danaher already live)',
      'westcon-comstor': 'Thin AEM evidence; previously parked',
      langoor: 'No employer-owned careers page (research guide: do not publish)'
    };
    return reasons[co.id] || 'forced archive';
  }
  if (/pending stronger AEM Tier-1\/2/i.test(co.notes || '')) {
    return 'Truth-pass: notes admit insufficient Tier-1/2 AEM evidence (B6–B8 fill quality bar)';
  }
  return 'Truth-pass: weak/inferred AEM evidence; priority-capped watchlist without Tier-1/2 proof';
}

const companies = JSON.parse(fs.readFileSync(COMPANIES, 'utf8'));
const archived = [];
const kept = [];
const careersFixed = [];
const notesUpdated = [];

for (const co of companies) {
  if (FORCE_ARCHIVE.has(co.id) || shouldArchiveByNotes(co)) {
    archived.push({
      ...co,
      _archivedAt: TODAY,
      _archiveReason: archiveReason(co)
    });
    continue;
  }

  let touched = false;
  if (CAREERS_FIXES[co.id] && co.careersUrl !== CAREERS_FIXES[co.id]) {
    co.careersUrl = CAREERS_FIXES[co.id];
    careersFixed.push(co.id);
    touched = true;
  }

  // M&A / rebrand notes for keepers
  if (co.id === 'srijan' && !/Material/i.test(co.notes || '')) {
    co.notes = `${co.notes || ''} Rebrand/M&A: careers now under Material+ (materialplus.io) — monitor as Srijan/Material.`.trim();
    notesUpdated.push(co.id);
    touched = true;
  }
  if (co.id === 'infogain' && !/Tenarai/i.test(co.notes || '')) {
    co.notes = `${co.notes || ''} Rebrand: Infogain → Tenarai (tenarai.com); careers URL updated.`.trim();
    notesUpdated.push(co.id);
    touched = true;
  }
  if (co.id === 'hul' && !/Unilever India/i.test(co.notes || '')) {
    co.notes = `${co.notes || ''} Careers funnel is Unilever India (careers.unilever.com/en/india); HUL brand retained for India seekers.`.trim();
    notesUpdated.push(co.id);
    touched = true;
  }

  if (touched) co.verifiedAt = TODAY;
  kept.push(co);
}

fs.writeFileSync(COMPANIES, JSON.stringify(kept, null, 2) + '\n');
fs.mkdirSync(path.dirname(ARCHIVE_OUT), { recursive: true });
fs.writeFileSync(
  ARCHIVE_OUT,
  JSON.stringify(
    {
      archivedAt: TODAY,
      reason: 'Truth-pass on weak/unchecked rows: thin Tier-1/2 evidence, M&A duplicates, dead careers with no fix',
      count: archived.length,
      ids: archived.map((c) => c.id).sort(),
      companies: archived
    },
    null,
    2
  ) + '\n'
);

console.log(
  JSON.stringify(
    {
      before: companies.length,
      after: kept.length,
      archived: archived.length,
      careersFixed: careersFixed.length,
      careersFixedIds: careersFixed.sort(),
      notesUpdated,
      archiveFile: path.relative(ROOT, ARCHIVE_OUT)
    },
    null,
    2
  )
);
