/**
 * Client-side company table filter, search facets, and shareable URL state (M8 + M9).
 * Loaded by index.html; testable via scripts/verify-filters.js.
 */

const CompanyFilters = {
  COMPANY_TYPES: ['Product', 'GCC', 'Agency', 'Enterprise'],
  MIGRATION_BANDS: [
    { id: '', label: 'All migration' },
    { id: 'cloud', label: 'Cloud-native / migrated' },
    { id: 'migrating', label: 'Migrating to cloud' },
    { id: 'unknown', label: 'Unknown migration' }
  ],
  SOURCE_FILTERS: [
    { id: '', label: 'All' },
    { id: 'company', label: 'Companies' },
    { id: 'owner', label: 'Apply' },
    { id: 'chapter', label: 'Chapters' },
    { id: 'learning', label: 'Learning' }
  ],
  LEARNING_SOURCES: ['glossary', 'technology', 'career', 'interview', 'template', 'resource'],
  CHAPTER_SOURCES: ['chapter', 'site', 'roadmap', 'roadmap-step'],
  SORT_OPTIONS: [
    { id: 'priority-desc', label: 'Priority (high first)' },
    { id: 'priority-asc', label: 'Priority (low first)' },
    { id: 'name-asc', label: 'Name (A–Z)' },
    { id: 'name-desc', label: 'Name (Z–A)' },
    { id: 'hiring-desc', label: 'Hiring intensity' }
  ],

  defaultState() {
    return {
      query: '',
      companyType: '',
      industry: '',
      migrationBand: '',
      hiringIndia: false,
      hiringAEM: false,
      aemaaCS: false,
      verifiedOnly: false,
      sort: 'priority-desc',
      sourceFilter: ''
    };
  },

  migrationBand(status) {
    const s = status || 'Unknown';
    if (s === 'Cloud-native' || s === 'Migrated to AEM as a Cloud Service') return 'cloud';
    if (s === 'Migrating to AEM as a Cloud Service') return 'migrating';
    return 'unknown';
  },

  industriesFrom(companies) {
    const set = new Set();
    (companies || []).forEach(co => {
      if (co.industry && co.industry !== 'Unknown') set.add(co.industry);
    });
    return [...set].sort((a, b) => a.localeCompare(b));
  },

  matchesCompany(co, state) {
    const s = state || CompanyFilters.defaultState();
    const q = (s.query || '').trim().toLowerCase();
    if (q && !CompanyFilters.companyName(co).toLowerCase().includes(q)) return false;
    if (s.companyType && (co.companyType || 'Unknown') !== s.companyType) return false;
    if (s.industry && (co.industry || 'Unknown') !== s.industry) return false;
    if (s.migrationBand && CompanyFilters.migrationBand(co.MigrationStatus) !== s.migrationBand) return false;
    if (s.hiringIndia && co.HiringIndia !== 'Yes') return false;
    if (s.hiringAEM && co.HiringAEM !== true) return false;
    if (s.aemaaCS && co.AEMaaCS !== true) return false;
    if (s.verifiedOnly && co.Status !== 'Verified') return false;
    return true;
  },

  matchesSource(entry, sourceFilter) {
    if (!sourceFilter) return true;
    const src = entry.source;
    if (sourceFilter === 'company') return src === 'company';
    if (sourceFilter === 'owner') return src === 'owner';
    if (sourceFilter === 'chapter') return CompanyFilters.CHAPTER_SOURCES.includes(src);
    if (sourceFilter === 'learning') return CompanyFilters.LEARNING_SOURCES.includes(src);
    return true;
  },

  filter(companies, state) {
    const s = state || CompanyFilters.defaultState();
    return companies.filter(co => CompanyFilters.matchesCompany(co, s));
  },

  sort(companies, sortId) {
    const list = [...companies];
    const intensityRank = { High: 3, Medium: 2, Low: 1, Unknown: 0 };
    switch (sortId) {
      case 'priority-asc':
        return list.sort((a, b) => a.priority - b.priority || a.name.localeCompare(b.name));
      case 'name-asc':
        return list.sort((a, b) => a.name.localeCompare(b.name));
      case 'name-desc':
        return list.sort((a, b) => b.name.localeCompare(a.name));
      case 'hiring-desc':
        return list.sort(
          (a, b) =>
            (intensityRank[b.HiringIntensity] || 0) - (intensityRank[a.HiringIntensity] || 0) ||
            b.priority - a.priority
        );
      case 'priority-desc':
      default:
        return list.sort((a, b) => b.priority - a.priority || a.name.localeCompare(b.name));
    }
  },

  apply(companies, state) {
    return CompanyFilters.sort(CompanyFilters.filter(companies, state), state.sort);
  },

  filterSearchResults(results, companiesById, state) {
    const s = state || CompanyFilters.defaultState();
    return (results || []).filter(entry => {
      if (!CompanyFilters.matchesSource(entry, s.sourceFilter)) return false;
      if (entry.source !== 'company') return true;
      const co = entry.facets || (companiesById && companiesById[entry.id]);
      if (!co) return true;
      if (entry.facets) {
        if (s.companyType && co.companyType !== s.companyType) return false;
        if (s.industry && co.industry !== s.industry) return false;
        if (s.migrationBand && co.migrationBand !== s.migrationBand) return false;
        if (s.hiringIndia && !co.hiringIndia) return false;
        if (s.hiringAEM && !co.hiringAEM) return false;
        if (s.aemaaCS && !co.aemaaCS) return false;
        if (s.verifiedOnly && co.status !== 'Verified') return false;
        return true;
      }
      return CompanyFilters.matchesCompany(co, s);
    });
  },

  parseUrlState(search) {
    const params = new URLSearchParams(
      typeof search === 'string' ? search.replace(/^\?/, '') : ''
    );
    const state = CompanyFilters.defaultState();
    if (params.has('cf_q')) state.query = params.get('cf_q') || '';
    if (params.has('cf_type')) state.companyType = params.get('cf_type') || '';
    if (params.has('cf_industry')) state.industry = params.get('cf_industry') || '';
    if (params.has('cf_migration')) state.migrationBand = params.get('cf_migration') || '';
    if (params.has('cf_sort')) state.sort = params.get('cf_sort') || 'priority-desc';
    if (params.get('cf_india') === '1') state.hiringIndia = true;
    if (params.get('cf_aem') === '1') state.hiringAEM = true;
    if (params.get('cf_cloud') === '1') state.aemaaCS = true;
    if (params.get('cf_verified') === '1') state.verifiedOnly = true;
    if (params.has('sf_source')) state.sourceFilter = params.get('sf_source') || '';
    return { state, searchQuery: params.get('q') || '' };
  },

  serializeUrlState(state, searchQuery) {
    const params = new URLSearchParams();
    const s = state || CompanyFilters.defaultState();
    if (searchQuery && searchQuery.trim()) params.set('q', searchQuery.trim());
    if (s.query) params.set('cf_q', s.query);
    if (s.companyType) params.set('cf_type', s.companyType);
    if (s.industry) params.set('cf_industry', s.industry);
    if (s.migrationBand) params.set('cf_migration', s.migrationBand);
    if (s.sort && s.sort !== 'priority-desc') params.set('cf_sort', s.sort);
    if (s.hiringIndia) params.set('cf_india', '1');
    if (s.hiringAEM) params.set('cf_aem', '1');
    if (s.aemaaCS) params.set('cf_cloud', '1');
    if (s.verifiedOnly) params.set('cf_verified', '1');
    if (s.sourceFilter) params.set('sf_source', s.sourceFilter);
    const qs = params.toString();
    return qs ? '?' + qs : '';
  },

  hasShareableState(state, searchQuery) {
    return CompanyFilters.serializeUrlState(state, searchQuery) !== '';
  },

  shareUrl(state, searchQuery, basePath) {
    const path = basePath != null ? basePath : '';
    return path + CompanyFilters.serializeUrlState(state, searchQuery);
  },

  companiesById(companies) {
    const map = {};
    (companies || []).forEach(co => {
      map[co.id] = co;
    });
    return map;
  },

  companyName(co) {
    return co.name || co.company || '';
  }
};

if (typeof module !== 'undefined' && module.exports) {
  module.exports = { CompanyFilters };
}
