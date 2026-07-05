/**
 * Search namespace — data-indexed ranked search (see 10_COMPONENT_LIBRARY.md, Milestone 5).
 * Loaded by index.html via <script src>; also require()'d by scripts/verify-search.js.
 */
const Search = {
  stripHtml(html) {
    return String(html).replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
  },

  tokenize(query) {
    return String(query).toLowerCase().trim().split(/\s+/).filter(Boolean);
  },

  companyName(company) {
    return company.name || company.company || '';
  },

  findCompanyChapterIndex(chapters) {
    const i = chapters.findIndex(c => c.companyTable);
    return i >= 0 ? i : 0;
  },

  buildIndex(sources) {
    const { chapters, companies, roadmaps, site } = sources;
    const entries = [];
    const companyChapterIndex = Search.findCompanyChapterIndex(chapters);
    const companyAnchor = '#ch' + companyChapterIndex;

    chapters.forEach((ch, i) => {
      entries.push({
        source: 'chapter',
        id: ch.id,
        title: ch.title,
        snippet: ch.summary,
        anchor: '#ch' + i,
        chapterIndex: i,
        pageOrder: 1000 + i,
        fields: {
          title: ch.title.toLowerCase(),
          summary: (ch.summary || '').toLowerCase(),
          tags: (ch.tags || []).join(' ').toLowerCase(),
          body: Search.stripHtml(ch.body || '').toLowerCase()
        }
      });
    });

    companies.forEach((co, i) => {
      const name = Search.companyName(co);
      entries.push({
        source: 'company',
        id: co.id,
        title: name,
        snippet: [co.type, co.india, co.aem].filter(Boolean).join(' · '),
        anchor: companyAnchor,
        pageOrder: 1000 + companyChapterIndex + (i + 1) * 0.01,
        fields: {
          title: name.toLowerCase(),
          summary: [co.type, co.india, co.aem, co.visa].filter(Boolean).join(' ').toLowerCase(),
          tags: '',
          body: ''
        }
      });
    });

    (roadmaps || []).forEach(rm => {
      entries.push({
        source: 'roadmap',
        id: rm.id,
        title: rm.title,
        snippet: rm.summary,
        anchor: '#roadmap',
        pageOrder: 100,
        fields: {
          title: rm.title.toLowerCase(),
          summary: (rm.summary || '').toLowerCase(),
          tags: '',
          body: ''
        }
      });
      (rm.steps || []).forEach((step, si) => {
        entries.push({
          source: 'roadmap-step',
          id: step.id,
          title: step.title,
          snippet: rm.title + ' — ' + step.status,
          anchor: '#roadmap',
          pageOrder: 110 + si,
          fields: {
            title: step.title.toLowerCase(),
            summary: (step.status || '').toLowerCase(),
            tags: rm.title.toLowerCase(),
            body: ''
          }
        });
      });
    });

    if (site && site.hero) {
      entries.push({
        source: 'site',
        id: 'hero',
        title: site.hero.title,
        snippet: site.hero.body,
        anchor: '#hero',
        pageOrder: 0,
        fields: {
          title: site.hero.title.toLowerCase(),
          summary: site.hero.body.toLowerCase(),
          tags: '',
          body: ''
        }
      });
    }

    return { entries, companyChapterIndex };
  },

  rank(tokens, entry) {
    if (!tokens.length) return 0;
    let score = 0;
    const { title, summary, tags, body } = entry.fields;
    for (const t of tokens) {
      if (title.includes(t)) {
        if (title === t) score += 100;
        else if (title.startsWith(t)) score += 50;
        else score += 30;
      }
      if (summary.includes(t)) score += 10;
      if (tags.includes(t)) score += 8;
      if (body.includes(t)) score += 3;
    }
    return score;
  },

  query(index, query, limit = 20) {
    const tokens = Search.tokenize(query);
    if (!tokens.length) return [];

    return index.entries
      .map(entry => ({ ...entry, score: Search.rank(tokens, entry) }))
      .filter(r => r.score > 0)
      .sort((a, b) => a.pageOrder - b.pageOrder || b.score - a.score || a.title.localeCompare(b.title))
      .slice(0, limit);
  }
};

if (typeof window !== 'undefined') {
  window.Search = Search;
}
if (typeof module !== 'undefined' && module.exports) {
  module.exports = Search;
}
