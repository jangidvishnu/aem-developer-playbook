/**
 * Client-side company table filter, search facets, and shareable URL state (M8 + M9).
 * Loaded by index.html; testable via scripts/verify-filters.js.
 */

const CompanyFilters = {
  COMPANY_TYPES: ['Product', 'GCC', 'Agency', 'Enterprise'],
  PRODUCT_CODES: [
    'sites',
    'assets',
    'forms',
    'aem-cloud',
    'eds',
    'headless',
    'universal-editor',
    'aep',
    'analytics',
    'target',
    'ajo',
    'campaign',
    'cja',
    'workfront',
    'commerce',
    'launch',
    'guides',
    'creative-cloud'
  ],
  PRODUCT_LABELS: {
    sites: 'AEM Sites',
    assets: 'AEM Assets',
    forms: 'AEM Forms',
    'aem-cloud': 'AEM Cloud Service',
    eds: 'Edge Delivery',
    headless: 'Headless / GraphQL',
    'universal-editor': 'Universal Editor',
    aep: 'Adobe Experience Platform',
    analytics: 'Adobe Analytics',
    target: 'Adobe Target',
    ajo: 'Journey Optimizer',
    campaign: 'Adobe Campaign',
    cja: 'Customer Journey Analytics',
    workfront: 'Workfront',
    commerce: 'Adobe Commerce',
    launch: 'Adobe Launch / Tags',
    guides: 'AEM Guides',
    'creative-cloud': 'Creative Cloud'
  },
  SOURCE_FILTERS: [
    { id: '', label: 'All' },
    { id: 'company', label: 'Companies' },
    { id: 'career', label: 'Career' },
    { id: 'learning', label: 'Learning' },
    { id: 'interview', label: 'Interview' }
  ],
  /** Match Browse playbook sidebar groups (data/site.json navigation.groups). */
  CAREER_CHAPTER_IDS: ['how-to-apply', 'career-strategy', 'professional-branding'],
  LEARNING_CHAPTER_IDS: ['learning-roadmap', 'core-skills', 'glossary'],
  INTERVIEW_CHAPTER_IDS: ['interview-prep'],
  CAREER_SOURCES: ['owner', 'career', 'template'],
  LEARNING_SOURCES: ['glossary', 'technology', 'resource', 'roadmap', 'roadmap-step'],
  INTERVIEW_SOURCES: ['interview'],
  CHAPTER_SOURCES: ['chapter', 'site', 'roadmap', 'roadmap-step'],
  SORT_OPTIONS: [
    { id: 'priority-desc', label: 'Priority (high first)' },
    { id: 'priority-asc', label: 'Priority (low first)' },
    { id: 'name-asc', label: 'Name (A–Z)' },
    { id: 'name-desc', label: 'Name (Z–A)' },
    { id: 'type-asc', label: 'Type (A–Z)' },
    { id: 'type-desc', label: 'Type (Z–A)', devOnly: true },
    { id: 'india-desc', label: 'India hiring first' }
  ],

  COLUMN_SORTS: {
    Priority: { asc: 'priority-asc', desc: 'priority-desc', default: 'desc' },
    Company: { asc: 'name-asc', desc: 'name-desc', default: 'asc' },
    Type: { asc: 'type-asc', desc: 'type-desc', default: 'asc' },
    India: { asc: 'india-asc', desc: 'india-desc', default: 'desc' }
  },

  defaultState() {
    return {
      query: '',
      companyType: '',
      industry: '',
      product: '',
      hiringIndia: false,
      aemCloud: false,
      hiringActive: false,
      ownerPreferred: false,
      sort: 'priority-desc',
      sourceFilter: ''
    };
  },

  hasProduct(co, code) {
    return Array.isArray(co.products) && co.products.includes(code);
  },

  isAemCloud(co) {
    return CompanyFilters.hasProduct(co, 'aem-cloud');
  },

  isHiringIndia(co) {
    return co.hiringIndia === true;
  },

  isHiringActive(co) {
    return co.hiringActive === true;
  },

  isOwnerPreferred(co) {
    return co.ownerPreferred === true;
  },

  indiaLabel(co) {
    if (co.hiringIndia === true) return 'Yes';
    if (co.hiringIndia === false) return 'No';
    if (co.indiaPresence === true) return 'Presence';
    if (co.indiaPresence === false) return 'No';
    return '—';
  },

  indiaRank(co) {
    if (co.hiringIndia === true) return 3;
    if (co.indiaPresence === true) return 2;
    if (co.hiringIndia === false || co.indiaPresence === false) return 1;
    return 0;
  },

  hasActiveFilters(state) {
    const s = state || CompanyFilters.defaultState();
    return !!(
      String(s.query || '').trim() ||
      s.companyType ||
      s.industry ||
      s.product ||
      s.hiringIndia ||
      s.aemCloud ||
      s.hiringActive ||
      s.ownerPreferred
    );
  },

  resetFilters(defaultSort) {
    return { ...CompanyFilters.defaultState(), sort: defaultSort || 'priority-desc' };
  },

  sortOptionsFor(product) {
    return CompanyFilters.SORT_OPTIONS.filter(o => !(product && o.devOnly));
  },

  sortDirectionFor(header, sortId) {
    const pair = CompanyFilters.COLUMN_SORTS[header];
    if (!pair) return null;
    if (sortId === pair.asc) return 'asc';
    if (sortId === pair.desc) return 'desc';
    return null;
  },

  nextSortFor(header, currentSortId) {
    const pair = CompanyFilters.COLUMN_SORTS[header];
    if (!pair) return currentSortId;
    const dir = CompanyFilters.sortDirectionFor(header, currentSortId);
    if (!dir) return pair[pair.default];
    return dir === 'desc' ? pair.asc : pair.desc;
  },

  industriesFrom(companies) {
    const set = new Set();
    (companies || []).forEach(co => {
      if (co.industry && co.industry !== 'Unknown') set.add(co.industry);
    });
    return [...set].sort((a, b) => a.localeCompare(b));
  },

  productsFrom(companies) {
    const set = new Set();
    (companies || []).forEach(co => {
      (co.products || []).forEach(p => set.add(p));
    });
    return CompanyFilters.PRODUCT_CODES.filter(code => set.has(code));
  },

  productLabel(code) {
    return CompanyFilters.PRODUCT_LABELS[code] || code;
  },

  matchesCompany(co, state) {
    const s = state || CompanyFilters.defaultState();
    const q = (s.query || '').trim().toLowerCase();
    if (q && !CompanyFilters.companyName(co).toLowerCase().includes(q)) return false;
    if (s.companyType && (co.companyType || 'Unknown') !== s.companyType) return false;
    if (s.industry && (co.industry || 'Unknown') !== s.industry) return false;
    if (s.product && !CompanyFilters.hasProduct(co, s.product)) return false;
    if (s.hiringIndia && !CompanyFilters.isHiringIndia(co)) return false;
    if (s.aemCloud && !CompanyFilters.isAemCloud(co)) return false;
    if (s.hiringActive && !CompanyFilters.isHiringActive(co)) return false;
    if (s.ownerPreferred && !CompanyFilters.isOwnerPreferred(co)) return false;
    // Legacy URL/state keys still accepted
    if (s.aemaaCS && !CompanyFilters.isAemCloud(co)) return false;
    if (s.migrationBand === 'cloud' && !CompanyFilters.isAemCloud(co)) return false;
    return true;
  },

  matchesSource(entry, sourceFilter) {
    if (!sourceFilter) return true;
    const src = entry.source;
    if (sourceFilter === 'company') return src === 'company';
    if (sourceFilter === 'career') {
      if (CompanyFilters.CAREER_SOURCES.includes(src)) return true;
      return src === 'chapter' && CompanyFilters.CAREER_CHAPTER_IDS.includes(entry.id);
    }
    if (sourceFilter === 'learning') {
      if (CompanyFilters.LEARNING_SOURCES.includes(src)) return true;
      return src === 'chapter' && CompanyFilters.LEARNING_CHAPTER_IDS.includes(entry.id);
    }
    if (sourceFilter === 'interview') {
      if (CompanyFilters.INTERVIEW_SOURCES.includes(src)) return true;
      return src === 'chapter' && CompanyFilters.INTERVIEW_CHAPTER_IDS.includes(entry.id);
    }
    // Legacy facet ids (older shared links / tests) — map to sidebar names.
    if (sourceFilter === 'owner') return CompanyFilters.matchesSource(entry, 'career');
    if (sourceFilter === 'chapter') {
      return (
        CompanyFilters.matchesSource(entry, 'career') ||
        CompanyFilters.matchesSource(entry, 'learning') ||
        CompanyFilters.matchesSource(entry, 'interview') ||
        CompanyFilters.CHAPTER_SOURCES.includes(src)
      );
    }
    return true;
  },

  filter(companies, state) {
    const s = state || CompanyFilters.defaultState();
    return companies.filter(co => CompanyFilters.matchesCompany(co, s));
  },

  normalizeSort(sortId) {
    return sortId === 'hiring-desc' ? 'priority-desc' : sortId || 'priority-desc';
  },

  sort(companies, sortId) {
    const list = [...companies];
    const id = CompanyFilters.normalizeSort(sortId);
    switch (id) {
      case 'priority-asc':
        return list.sort((a, b) => a.priority - b.priority || a.name.localeCompare(b.name));
      case 'name-asc':
        return list.sort((a, b) => a.name.localeCompare(b.name));
      case 'name-desc':
        return list.sort((a, b) => b.name.localeCompare(a.name));
      case 'type-asc':
        return list.sort((a, b) => (a.companyType || '').localeCompare(b.companyType || '') || a.name.localeCompare(b.name));
      case 'type-desc':
        return list.sort((a, b) => (b.companyType || '').localeCompare(a.companyType || '') || a.name.localeCompare(b.name));
      case 'india-asc':
        return list.sort((a, b) => CompanyFilters.indiaRank(a) - CompanyFilters.indiaRank(b) || a.name.localeCompare(b.name));
      case 'india-desc':
        return list.sort(
          (a, b) => CompanyFilters.indiaRank(b) - CompanyFilters.indiaRank(a) || b.priority - a.priority || a.name.localeCompare(b.name)
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
        if (s.product && !(co.products || []).includes(s.product)) return false;
        if (s.hiringIndia && !co.hiringIndia) return false;
        if ((s.aemCloud || s.aemaaCS || s.migrationBand === 'cloud') && !co.aemCloud) return false;
        if (s.hiringActive && !co.hiringActive) return false;
        if (s.ownerPreferred && !co.ownerPreferred) return false;
        return true;
      }
      return CompanyFilters.matchesCompany(co, s);
    });
  },

  searchOnlyState(state) {
    return { sourceFilter: (state && state.sourceFilter) || '' };
  },

  querySearch(index, query, companiesById, searchFacetState) {
    const search = typeof Search !== 'undefined' ? Search : globalThis.Search;
    const raw = search.query(index, query);
    const narrow = CompanyFilters.searchOnlyState(searchFacetState);
    let results = CompanyFilters.filterSearchResults(raw, companiesById, narrow);
    let widened = false;
    if (!results.length && raw.length && narrow.sourceFilter) {
      results = CompanyFilters.filterSearchResults(raw, companiesById, { sourceFilter: '' });
      widened = true;
    }
    return { raw, results, widened };
  },

  parseUrlState(search) {
    const params = new URLSearchParams(typeof search === 'string' ? search.replace(/^\?/, '') : '');
    const state = CompanyFilters.defaultState();
    if (params.has('cf_q')) state.query = params.get('cf_q') || '';
    if (params.has('cf_type')) state.companyType = params.get('cf_type') || '';
    if (params.has('cf_industry')) state.industry = params.get('cf_industry') || '';
    if (params.has('cf_product')) state.product = params.get('cf_product') || '';
    if (params.has('cf_sort')) state.sort = CompanyFilters.normalizeSort(params.get('cf_sort'));
    if (params.get('cf_india') === '1') state.hiringIndia = true;
    if (params.get('cf_cloud') === '1') state.aemCloud = true;
    if (params.get('cf_active') === '1') state.hiringActive = true;
    if (params.get('cf_preferred') === '1') state.ownerPreferred = true;
    // Legacy: old migration / aemaaCS / hiringAEM / verified URL keys
    if (params.get('cf_migration') === 'cloud') state.aemCloud = true;
    if (params.get('cf_aem') === '1') {
      /* no-op: all public rows hire AEM */
    }
    if (params.get('cf_verified') === '1') {
      /* no-op: public list is hire-verified only */
    }
    return { state, searchQuery: params.get('q') || '' };
  },

  serializeUrlState(state, searchQuery) {
    const params = new URLSearchParams();
    const s = state || CompanyFilters.defaultState();
    if (searchQuery && searchQuery.trim()) params.set('q', searchQuery.trim());
    if (s.query) params.set('cf_q', s.query);
    if (s.companyType) params.set('cf_type', s.companyType);
    if (s.industry) params.set('cf_industry', s.industry);
    if (s.product) params.set('cf_product', s.product);
    if (s.sort && s.sort !== 'priority-desc') params.set('cf_sort', s.sort);
    if (s.hiringIndia) params.set('cf_india', '1');
    if (s.aemCloud || s.aemaaCS) params.set('cf_cloud', '1');
    if (s.hiringActive) params.set('cf_active', '1');
    if (s.ownerPreferred) params.set('cf_preferred', '1');
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
