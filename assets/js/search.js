/**
 * Search namespace — data-indexed ranked search (see 10_COMPONENT_LIBRARY.md, Milestone 5).
 * Loaded by index.html via <script src>; also require()'d by scripts/verify-search.js.
 */
const Search = {
  stripHtml(html) {
    return String(html)
      .replace(/<[^>]+>/g, ' ')
      .replace(/\s+/g, ' ')
      .trim();
  },

  tokenize(query) {
    return String(query).toLowerCase().trim().split(/\s+/).filter(Boolean);
  },

  companyName(company) {
    return company.name || company.company || '';
  },

  _companyFilters() {
    if (typeof CompanyFilters !== 'undefined') return CompanyFilters;
    try {
      return require('./filters.js').CompanyFilters;
    } catch (_) {
      return null;
    }
  },

  productLabels(codes) {
    const list = Array.isArray(codes) ? codes : [];
    const filters = Search._companyFilters();
    return list.map(code => (filters && filters.productLabel ? filters.productLabel(code) : code)).filter(Boolean);
  },

  companySnippet(co) {
    const meta = [
      co.companyType || co.type,
      co.hiringIndia === true ? 'India hiring' : '',
      co.hiringActive === true ? 'Frequent hiring' : '',
      co.ownerPreferred === true ? 'Preferred' : '',
      co.industry
    ].filter(Boolean);
    const products = Search.productLabels(co.products).join(', ');
    return {
      meta: meta.join(' · '),
      products,
      snippet: [meta.join(' · '), products].filter(Boolean).join(' · ')
    };
  },

  companyFacets(co) {
    const products = Array.isArray(co.products) ? co.products : [];
    return {
      companyType: co.companyType || co.type || 'Unknown',
      industry: co.industry || 'Unknown',
      products,
      hiringIndia: co.hiringIndia === true,
      aemCloud: products.includes('aem-cloud'),
      hiringActive: co.hiringActive === true,
      ownerPreferred: co.ownerPreferred === true
    };
  },

  findChapterIndex(chapters, flag) {
    const i = chapters.findIndex(c => c[flag]);
    return i >= 0 ? i : 0;
  },

  findCompanyChapterIndex(chapters) {
    return Search.findChapterIndex(chapters, 'companyTable');
  },

  chapterAnchor(ch, index) {
    return '#' + (ch.id || 'ch' + index);
  },

  anchorForChapterFlag(chapters, flag) {
    const ch = chapters.find(c => c[flag]);
    return ch ? '#' + ch.id : '#main';
  },

  buildIndex(sources) {
    const { chapters, companies, roadmaps, site, learning = {}, ownerPlaybook } = sources;
    const entries = [];
    const companyChapterIndex = Search.findCompanyChapterIndex(chapters);
    const companyAnchor = Search.anchorForChapterFlag(chapters, 'companyTable');
    const glossaryAnchor = Search.anchorForChapterFlag(chapters, 'glossaryEmbed');
    const techAnchor = Search.anchorForChapterFlag(chapters, 'technologyEmbed');
    const careerAnchor = Search.anchorForChapterFlag(chapters, 'careerPathEmbed');
    const interviewAnchor = Search.anchorForChapterFlag(chapters, 'interviewEmbed');
    const templateAnchor = Search.anchorForChapterFlag(chapters, 'templateEmbed');
    const resourceAnchor = Search.anchorForChapterFlag(chapters, 'resourceEmbed');
    const ownerAnchor = Search.anchorForChapterFlag(chapters, 'ownerPlaybookEmbed');

    chapters.forEach((ch, i) => {
      entries.push({
        source: 'chapter',
        id: ch.id,
        title: ch.title,
        snippet: ch.summary,
        anchor: Search.chapterAnchor(ch, i),
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
      const snip = Search.companySnippet(co);
      entries.push({
        source: 'company',
        id: co.id,
        title: name,
        snippet: snip.snippet,
        snippetMeta: snip.meta,
        snippetProducts: snip.products,
        anchor: companyAnchor,
        pageOrder: 1000 + companyChapterIndex + (i + 1) * 0.01,
        facets: Search.companyFacets(co),
        fields: {
          title: name.toLowerCase(),
          summary: [co.industry, co.companyType, co.notes || co.Notes, co.hq].filter(Boolean).join(' ').toLowerCase(),
          tags: (co.roles || co.TypicalRoles || []).join(' ').toLowerCase(),
          body: (co.products || []).join(' ').toLowerCase()
        }
      });
    });

    (roadmaps || []).forEach((rm, ri) => {
      const anchor = '#roadmap-' + rm.id;
      entries.push({
        source: 'roadmap',
        id: rm.id,
        title: rm.title,
        snippet: rm.summary,
        anchor,
        pageOrder: 50 + ri * 10,
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
          anchor,
          pageOrder: 50 + ri * 10 + si + 1,
          fields: {
            title: step.title.toLowerCase(),
            summary: ((step.status || '') + ' ' + (step.description || '')).toLowerCase(),
            tags: rm.title.toLowerCase(),
            body: ''
          }
        });
      });
    });

    if (site && site.hero) {
      const purposeText =
        typeof site.hero.purpose === 'string'
          ? site.hero.purpose
          : [
              site.hero.purpose && (site.hero.purpose.intro || site.hero.purpose.lead),
              ...((site.hero.purpose && site.hero.purpose.points) || [])
            ]
              .filter(Boolean)
              .join(' ');
      const heroSnippet = [purposeText, site.hero.body].filter(Boolean).join(' ');
      const heroSearchText = [site.hero.title, purposeText, site.hero.body].filter(Boolean).join(' ').toLowerCase();
      entries.push({
        source: 'site',
        id: 'hero',
        title: site.hero.title,
        snippet: heroSnippet,
        anchor: '#hero',
        pageOrder: 0,
        fields: {
          title: site.hero.title.toLowerCase(),
          summary: heroSearchText,
          tags: '',
          body: purposeText.toLowerCase()
        }
      });
    }

    (learning.glossary || []).forEach((g, i) => {
      entries.push({
        source: 'glossary',
        id: g.id,
        title: g.term,
        snippet: g.definition.slice(0, 80) + (g.definition.length > 80 ? '…' : ''),
        anchor: glossaryAnchor,
        pageOrder: 1000 + Search.findChapterIndex(chapters, 'glossaryEmbed') + (i + 1) * 0.001,
        fields: {
          title: g.term.toLowerCase(),
          summary: g.definition.toLowerCase(),
          tags: (g.relatedTerms || []).join(' ').toLowerCase(),
          body: ''
        }
      });
    });

    (learning.technologies || []).forEach((t, i) => {
      entries.push({
        source: 'technology',
        id: t.id,
        title: t.name,
        snippet: t.category + ' · ' + t.difficulty,
        anchor: techAnchor,
        pageOrder: 1000 + Search.findChapterIndex(chapters, 'technologyEmbed') + (i + 1) * 0.001,
        fields: {
          title: t.name.toLowerCase(),
          summary: (t.summary || '').toLowerCase(),
          tags: (t.category + ' ' + t.difficulty).toLowerCase(),
          body: (t.prerequisites || []).join(' ').toLowerCase()
        }
      });
    });

    (learning.careerPaths || []).forEach((cp, i) => {
      entries.push({
        source: 'career',
        id: cp.id,
        title: cp.title,
        snippet: cp.summary,
        anchor: careerAnchor,
        pageOrder: 1000 + Search.findChapterIndex(chapters, 'careerPathEmbed') + (i + 1) * 0.001,
        fields: {
          title: cp.title.toLowerCase(),
          summary: cp.summary.toLowerCase(),
          tags: '',
          body: (cp.milestones || [])
            .map(m => m.title + ' ' + m.description)
            .join(' ')
            .toLowerCase()
        }
      });
    });

    (learning.interviews || []).forEach((q, i) => {
      entries.push({
        source: 'interview',
        id: q.id,
        title: q.question,
        snippet: q.category + ' · ' + q.difficulty,
        anchor: interviewAnchor,
        pageOrder: 1000 + Search.findChapterIndex(chapters, 'interviewEmbed') + (i + 1) * 0.001,
        fields: {
          title: q.question.toLowerCase(),
          summary: q.guidance.toLowerCase(),
          tags: (q.category + ' ' + q.difficulty + ' ' + (q.technologies || []).join(' ')).toLowerCase(),
          body: ''
        }
      });
    });

    (learning.templates || []).forEach((t, i) => {
      entries.push({
        source: 'template',
        id: t.id,
        title: t.title,
        snippet: t.category,
        anchor: templateAnchor,
        pageOrder: 1000 + Search.findChapterIndex(chapters, 'templateEmbed') + (i + 1) * 0.001,
        fields: {
          title: t.title.toLowerCase(),
          summary: t.body.toLowerCase(),
          tags: t.category.toLowerCase(),
          body: ''
        }
      });
    });

    (learning.resources || []).forEach((r, i) => {
      entries.push({
        source: 'resource',
        id: r.id,
        title: r.title,
        snippet: r.type,
        anchor: resourceAnchor,
        pageOrder: 1000 + Search.findChapterIndex(chapters, 'resourceEmbed') + (i + 1) * 0.001,
        fields: {
          title: r.title.toLowerCase(),
          summary: r.type.toLowerCase(),
          tags: '',
          body: r.url.toLowerCase()
        }
      });
    });

    if (ownerPlaybook && ownerPlaybook.sections) {
      const ownerChapterIndex = Search.findChapterIndex(chapters, 'ownerPlaybookEmbed');
      ownerPlaybook.sections.forEach((sec, i) => {
        entries.push({
          source: 'owner',
          id: sec.id,
          title: sec.title,
          snippet: sec.summary,
          anchor: ownerAnchor,
          pageOrder: 1000 + ownerChapterIndex + (i + 1) * 0.001,
          fields: {
            title: sec.title.toLowerCase(),
            summary: ((sec.summary || '') + ' ' + (sec.body || '')).toLowerCase(),
            tags: 'owner apply outreach workflow',
            body: (sec.steps || []).join(' ').toLowerCase()
          }
        });
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
