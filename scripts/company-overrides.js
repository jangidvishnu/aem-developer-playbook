/**
 * Company hiring research overrides (dev-only).
 * Patches rows already in data/companies.json at build time.
 */

const VERIFY_DATE = '2026-07-07';

/** @type {Record<string, object>} */
const COMPANY_OVERRIDES = {
  adobe: {
    directJobSearch: 'https://careers.adobe.com/us/en/search-results?keywords=AEM',
    AEMHiringEvidence: ['https://careers.adobe.com/us/en/search-results?keywords=AEM'],
    LastHiringVerified: VERIFY_DATE
  },
  cisco: {
    directJobSearch: 'https://jobs.cisco.com/jobs/SearchJobs/?keyword=experience%20manager',
    AEMHiringEvidence: ['https://jobs.cisco.com/jobs/SearchJobs/?keyword=experience%20manager'],
    LastHiringVerified: VERIFY_DATE
  },
  philips: {
    directJobSearch: 'https://www.careers.philips.com/na/en/search-results?keywords=AEM',
    AEMHiringEvidence: [
      'https://philips.talent-pool.com/projects/freelance-content-migration-project-manager/56490'
    ],
    LastHiringVerified: VERIFY_DATE
  },
  qualcomm: {
    directJobSearch: 'https://careers.qualcomm.com/careers?query=AEM',
    AEMHiringEvidence: ['https://careers.qualcomm.com/careers?query=AEM'],
    LastHiringVerified: VERIFY_DATE
  },
  'juniper-networks': {
    directJobSearch: 'https://careers.juniper.net/us/en/search-results?keywords=AEM',
    AEMHiringEvidence: ['https://careers.juniper.net/us/en/search-results?keywords=AEM'],
    LastHiringVerified: VERIFY_DATE
  },
  grundfos: {
    directJobSearch: 'https://jobs.grundfos.com/search/?q=AEM',
    AEMHiringEvidence: ['https://jobs.grundfos.com/search/?q=AEM'],
    LastHiringVerified: VERIFY_DATE
  },
  walmart: {
    directJobSearch: 'https://careers.walmart.com/results?q=AEM',
    AEMHiringEvidence: ['https://careers.walmart.com/results?q=AEM'],
    LastHiringVerified: VERIFY_DATE
  },
  'hdfc-ltd': {
    directJobSearch: 'https://www.hdfc.com/careers',
    AEMHiringEvidence: ['https://www.hdfc.com/careers'],
    LastHiringVerified: VERIFY_DATE
  },
  'cox-communications': {
    directJobSearch: 'https://jobs.coxenterprises.com/en/search-jobs?k=aem',
    AEMHiringEvidence: ['https://jobs.coxenterprises.com/en/search-jobs?k=aem'],
    LastHiringVerified: VERIFY_DATE
  },
  panasonic: {
    directJobSearch: 'https://careers.na.panasonic.com/en/search-results?keywords=AEM',
    AEMHiringEvidence: ['https://careers.na.panasonic.com/en/search-results?keywords=AEM'],
    LastHiringVerified: VERIFY_DATE
  },
  hanesbrands: {
    careersUrl: 'https://careers.hanes.com/',
    directJobSearch: 'https://careers.hanes.com/search?q=AEM',
    AEMHiringEvidence: ['https://careers.hanes.com/search?q=AEM'],
    LastHiringVerified: VERIFY_DATE
  },
  bbva: {
    directJobSearch: 'https://bbva.csod.com/ux/ats/careersite/4/home?c=bbva&q=AEM',
    AEMHiringEvidence: ['https://bbva.csod.com/ux/ats/careersite/4/home?c=bbva&q=AEM'],
    LastHiringVerified: VERIFY_DATE
  },
  vanguard: {
    directJobSearch: 'https://www.vanguardjobs.com/job-search-results/?keyword=AEM',
    AEMHiringEvidence: ['https://www.vanguardjobs.com/job-search-results/?keyword=AEM'],
    LastHiringVerified: VERIFY_DATE
  }
};

module.exports = { COMPANY_OVERRIDES, VERIFY_DATE };
