/**
 * Client-side company table filter and sort (Milestone 8).
 * Loaded by index.html; testable via scripts/verify-filters.js.
 */

const CompanyFilters = {
  COMPANY_TYPES: ['Product', 'GCC', 'Agency', 'Enterprise'],
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
      hiringIndia: false,
      hiringAEM: false,
      aemaaCS: false,
      verifiedOnly: false,
      sort: 'priority-desc'
    };
  },

  filter(companies, state) {
    const s = state || CompanyFilters.defaultState();
    const q = (s.query || '').trim().toLowerCase();
    return companies.filter(co => {
      if (q && !CompanyFilters.companyName(co).toLowerCase().includes(q)) return false;
      if (s.companyType && (co.companyType || 'Unknown') !== s.companyType) return false;
      if (s.hiringIndia && co.HiringIndia !== 'Yes') return false;
      if (s.hiringAEM && co.HiringAEM !== true) return false;
      if (s.aemaaCS && co.AEMaaCS !== true) return false;
      if (s.verifiedOnly && co.Status !== 'Verified') return false;
      return true;
    });
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

  companyName(co) {
    return co.name || co.company || '';
  }
};

if (typeof module !== 'undefined' && module.exports) {
  module.exports = { CompanyFilters };
}
