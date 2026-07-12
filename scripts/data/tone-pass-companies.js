/**
 * One-off tone pass: simplify company notes for friend-share voice.
 * Run: node scripts/data/tone-pass-companies.js
 */
const fs = require('fs');
const path = require('path');

const file = path.join(__dirname, '../../data/companies.json');
const companies = JSON.parse(fs.readFileSync(file, 'utf8'));

/** @param {string} s */
function simplifyNote(s) {
  if (!s || typeof s !== 'string') return s;
  let n = s;

  const replacements = [
    [/Owner preferred:\s*/gi, "I'd pick this one — "],
    [/Strong compensation and career growth for AEM\/DXP delivery \(owner opinion\)\.\s*/gi, 'Good pay and growth for AEM work (my take). '],
    [/Not owner-preferred for pay\/growth relative to top SI picks \(owner opinion\)\.\s*/gi, 'Not my top pick for pay/growth vs bigger SIs (my take). '],
    [/\s*\(owner opinion\)/gi, ' (my take)'],
    [/flagship employer for DXP engineers/gi, 'main product company for AEM'],
    [/AEM \/ Experience Cloud product owner;/gi, 'Adobe makes AEM;'],
    [/\. products lists the full Adobe stack Adobe builds and hires against\./gi, '. Full Adobe product stack.'],
    [/cadence below continuous SI hiring/gi, "doesn't hire AEM as often as big SIs"],
    [/India AEM volume is intermittent vs SI partners/gi, 'AEM hiring in India comes and goes — less steady than big SIs'],
    [/AEM-titled hiring is intermittent — monitor careers/gi, 'AEM-titled jobs come and go — set job alerts'],
    [/AEM-titled roles are intermittent — set job alerts/gi, 'AEM-titled jobs come and go — set job alerts'],
    [/AEM-titled eng hiring intermittent — monitor careers/gi, 'AEM engineering jobs come and go — check careers often'],
    [/AEM-titled internal hiring not shown as monthly cadence/gi, "doesn't show AEM hiring every month"],
    [/AEM-titled openings are rare \(~yearly\) — monitor careers; priority reflects hiring frequency, not brand prestige/gi, 'AEM-titled jobs are rare (~yearly) — check careers; priority is how often they hire, not how big the brand is'],
    [/Global Experience Cloud rollout;/gi, 'Uses full Adobe stack;'],
    [/full ownership journey on Experience Cloud/gi, 'full Adobe stack rollout'],
    [/on full Adobe Experience Cloud per Adobe case study/gi, 'on full Adobe stack (Adobe case study)'],
    [/Adobe Experience Cloud partner/gi, 'Adobe partner'],
    [/Adobe Experience Cloud integrations/gi, 'Adobe stack integrations'],
    [/Adobe Experience Cloud engineering team/gi, 'Adobe/AEM engineering team'],
    [/Adobe Experience Cloud case study/gi, 'Adobe case study'],
    [/Experience Cloud case study/gi, 'Adobe case study'],
    [/Experience Manager Sites/g, 'AEM Sites'],
    [/Experience Manager Assets/g, 'AEM Assets'],
    [/Experience Manager Managed Services/g, 'AEM Managed Services'],
    [/Experience Manager/g, 'AEM'],
    [/enterprise AEM architecture/gi, 'senior AEM architecture roles'],
    [/enterprise programs/gi, 'large AEM projects'],
    [/AEM\/DXP delivery/gi, 'AEM work'],
    [/AEM\/DXP roles/gi, 'AEM roles'],
    [/for DXP engineers/gi, 'for AEM developers'],
    [/Digital Experience Technology Partner/gi, 'Adobe partner'],
    [/Digital experience delivery/gi, 'Digital delivery'],
    [/digital transformation firm/gi, 'IT services firm'],
    [/Fortune 100 digital practice/gi, 'Large digital practice'],
    [/Industrial automation leader;/gi, ''],
    [/owner-marked hiringActive/gi, 'I marked as frequent hiring'],
    [/frequent AEM hiring pattern/gi, 'often posts AEM roles'],
    [/AEM detected on public web properties \(tech-detection\)\. Hiring may be sporadic or under generic titles — check careers regularly\./g, 'Uses AEM on their public site (tech detection). Jobs may be rare or under generic titles — check careers often.'],
    [/verify AEM-titled roles on careers portal periodically/gi, 'check careers for AEM-titled roles now and then'],
    [/verify AEM-titled roles periodically/gi, 'check careers for AEM-titled roles now and then'],
    [/India hiring not evidenced/gi, 'no clear India AEM hiring signal'],
    [/India hiring unclear — monitor careers/gi, 'India hiring unclear — check careers'],
    [/Hiring may be sporadic/gi, 'Hiring may be occasional'],
    [/openings cycle — not continuous priority-10 hiring/gi, 'openings come and go — not constant hiring'],
    [/search careers portal for AEM \/ Experience Manager roles/gi, 'search their careers site for AEM roles'],
    [/filter ibegin portal for AEM \/ Experience Manager roles/gi, 'filter their careers portal for AEM roles'],
    [/Global digital consultancy with India presence; Adobe Experience Manager practice for enterprise programs\./gi, 'Global consultancy with India offices; runs AEM projects.'],
    [/specialising exclusively in Adobe Experience Cloud/gi, 'focused on Adobe stack'],
    [/specialising in Adobe Experience Cloud/gi, 'focused on Adobe stack'],
    [/Runs AEM \(incl\. AEMaaCS/gi, 'Uses AEM (incl. AEMaaCS'],
    [/Per Adobe case study/gi, 'Adobe case study'],
    [/ per Adobe case study/gi, ' (Adobe case study)'],
    [/Phase 4 research/gi, 'research'],
    [/Phase 4\)/gi, 'research)'],
  ];

  for (const [re, rep] of replacements) {
    n = n.replace(re, rep);
  }

  // Cleanup double spaces and stray punctuation
  n = n.replace(/\s{2,}/g, ' ').replace(/\s+\./g, '.').replace(/\s+,/g, ',').trim();
  return n;
}

let changed = 0;
for (const c of companies) {
  if (!c.notes) continue;
  const next = simplifyNote(c.notes);
  if (next !== c.notes) {
    c.notes = next;
    changed++;
  }
}

fs.writeFileSync(file, JSON.stringify(companies, null, 2) + '\n', 'utf8');
console.log(`Tone pass: updated ${changed} of ${companies.length} company notes.`);
