/**
 * Render namespace — pure markup builders (see 10_COMPONENT_LIBRARY.md).
 * Loaded by index.html via <script src>; also require()'d by scripts/verify-render.js.
 */
const Render = {
  escapeHtml(value) {
    return String(value).replace(/[&<>"']/g, ch => ({
      '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
    }[ch]));
  },

  pageHeader(meta) {
    return `<h1 class="text-2xl font-extrabold text-slate-800">${Render.escapeHtml(meta.title)}</h1><p class="text-sm text-slate-500">${Render.escapeHtml(meta.versionLabel)}</p>`;
  },

  search(config) {
    return `<div class="relative" id="search-wrap"><div class="flex items-center relative"><input class="border rounded-lg pl-3 pr-9 py-2 w-64 bg-white text-slate-800" id="search" placeholder="${Render.escapeHtml(config.placeholder)}" aria-label="${Render.escapeHtml(config.ariaLabel)}" aria-controls="search-results" aria-expanded="false" aria-autocomplete="list" autocomplete="off" /><button type="button" class="hidden absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 text-lg leading-none px-1" id="search-clear" aria-label="${Render.escapeHtml(config.clearLabel || 'Clear search')}" title="${Render.escapeHtml(config.clearLabel || 'Clear search')}">×</button></div><div id="search-panel" class="hidden absolute z-50 top-full left-0 right-0 mt-1 bg-white border rounded-lg shadow-lg text-slate-800 min-w-[18rem]"><div id="search-facets" class="px-2 pt-2 pb-1 border-b" role="group" aria-label="Filter search results"></div><div id="search-results" class="max-h-72 overflow-auto" role="listbox"></div></div><p id="search-status" class="sr-only" aria-live="polite"></p></div>`;
  },

  searchFacets(state) {
    const sources = [
      { id: '', label: 'All' },
      { id: 'company', label: 'Companies' },
      { id: 'owner', label: 'Apply' },
      { id: 'chapter', label: 'Chapters' },
      { id: 'learning', label: 'Learning' }
    ];
    const sourceChips = sources.map(s => {
      const active = (state.sourceFilter || '') === s.id ? ' bg-blue-100 border-blue-400 font-semibold' : ' bg-white hover:bg-slate-50';
      return `<button type="button" class="text-xs px-2 py-0.5 border rounded-full${active}" data-search-facet="sourceFilter" data-value="${Render.escapeHtml(s.id)}">${Render.escapeHtml(s.label)}</button>`;
    }).join('');
    const active = [];
    if (state.companyType) active.push(`Type: ${state.companyType}`);
    if (state.industry) active.push(`Industry: ${state.industry}`);
    if (state.migrationBand) {
      const band = { cloud: 'Cloud', migrating: 'Migrating', unknown: 'Unknown migration' }[state.migrationBand] || state.migrationBand;
      active.push(`Migration: ${band}`);
    }
    if (state.hiringIndia) active.push('India hiring');
    if (state.hiringAEM) active.push('Hiring AEM');
    if (state.aemaaCS) active.push('AEM Cloud');
    if (state.verifiedOnly) active.push('Verified');
    const hint = active.length
      ? `<span class="text-xs text-slate-500 ml-1">Table filters: ${active.map(Render.escapeHtml).join(' · ')}</span>`
      : '';
    return `<div class="flex flex-wrap gap-1 items-center justify-between w-full gap-y-1"><div class="flex flex-wrap gap-1 items-center">${sourceChips}${hint}</div><div class="flex items-center gap-1 shrink-0"><button type="button" data-copy-discovery-link class="text-xs px-2 py-0.5 border rounded bg-white hover:bg-slate-50" title="Copy link to this filtered view">Copy link</button><span data-copy-link-status class="text-xs text-green-700 hidden" aria-live="polite">Copied!</span></div></div>`;
  },

  searchResults(results, query, activeIndex) {
    if (!query || !query.trim()) return '';
    if (!results.length) {
      return `<p class="px-3 py-2 text-sm text-slate-500">No results</p>`;
    }
    const typeLabel = {
      chapter: 'Chapter', company: 'Company', owner: 'Apply', roadmap: 'Roadmap', 'roadmap-step': 'Roadmap step', site: 'Site',
      glossary: 'Glossary', technology: 'Technology', career: 'Career path', interview: 'Interview',
      template: 'Template', resource: 'Resource'
    };
    return results.map((r, i) => {
      const active = i === activeIndex ? ' bg-blue-50' : '';
      const label = typeLabel[r.source] || r.source;
      return `<button type="button" class="block w-full text-left px-3 py-2 text-sm hover:bg-slate-100${active}" role="option" data-anchor="${Render.escapeHtml(r.anchor)}" data-chapter-index="${r.chapterIndex != null ? r.chapterIndex : ''}" aria-selected="${i === activeIndex}"><span class="text-xs text-slate-400 uppercase">${Render.escapeHtml(label)}</span><span class="font-semibold block">${Render.escapeHtml(r.title)}</span><span class="text-slate-500 text-xs">${Render.escapeHtml(r.snippet)}</span></button>`;
    }).join('');
  },

  sidebar(chapters) {
    return chapters.map((c, i) => `<a href="#ch${i}" class="block px-3 py-2 rounded hover:bg-slate-100">${Render.escapeHtml(c.title)}</a>`).join('');
  },

  dashboard(stats) {
    const items = stats.items.map(item => `<li>${Render.escapeHtml(item)}</li>`).join('');
    return `<h3 class="font-semibold">${Render.escapeHtml(stats.title)}</h3><ul class="list-disc ml-5 mt-2">${items}</ul>`;
  },

  hero(content) {
    return `<section id="hero" class="bg-gradient-to-r from-blue-700 to-sky-600 text-white rounded-2xl p-8"><h2 class="text-4xl font-bold">${Render.escapeHtml(content.title)}</h2><p class="mt-4 text-lg">${Render.escapeHtml(content.body)}</p></section>`;
  },

  roadmap(roadmap) {
    return Render.roadmapPanel(roadmap);
  },

  roadmapList(roadmaps) {
    return (roadmaps || []).map(rm => Render.roadmapPanel(rm)).join('');
  },

  roadmapPanel(roadmap) {
    const steps = (roadmap.steps || []).map(s => {
      const desc = s.description
        ? `<p class="text-sm text-slate-600 mt-1 ml-6">${Render.escapeHtml(s.description)}</p>`
        : '';
      const hours = s.estimatedHours ? ` <span class="text-xs text-slate-400">(~${s.estimatedHours}h)</span>` : '';
      return `<li id="roadmap-step-${Render.escapeHtml(s.id)}"><span class="text-slate-500 text-sm">${Render.escapeHtml(s.status)}</span> — <strong>${Render.escapeHtml(s.title)}</strong>${hours}${desc}</li>`;
    }).join('');
    return `<section id="roadmap-${Render.escapeHtml(roadmap.id)}" class="section bg-white text-slate-800 rounded-xl shadow p-8"><h2 class="text-2xl font-bold">${Render.escapeHtml(roadmap.title)}</h2><p class="text-slate-500 mt-2 mb-4">${Render.escapeHtml(roadmap.summary)}</p><ol class="list-decimal ml-6 space-y-3">${steps}</ol></section>`;
  },

  paginatedTable(items, options, renderRow, headers, pageAttr) {
    const pageSize = options.pageSize || 25;
    const page = options.page || 1;
    const total = items.length;
    const totalPages = Math.max(1, Math.ceil(total / pageSize));
    const safePage = Math.min(Math.max(1, page), totalPages);
    const slice = items.slice((safePage - 1) * pageSize, safePage * pageSize);
    let pagination = '';
    if (totalPages > 1) {
      const buttons = [];
      for (let p = 1; p <= totalPages; p++) {
        const active = p === safePage ? ' bg-blue-100 font-semibold' : '';
        buttons.push(`<button type="button" data-${pageAttr}-page="${p}" class="px-2 py-1 border rounded hover:bg-slate-100${active}">${p}</button>`);
      }
      pagination = `<nav class="mt-3 flex flex-wrap gap-2 items-center text-sm" aria-label="${Render.escapeHtml(pageAttr)} pages">${buttons.join('')}<span class="text-slate-500 ml-2">${total} items · page ${safePage} of ${totalPages}</span></nav>`;
    }
    const head = headers.map(h => `<th class="p-2 text-left">${Render.escapeHtml(h)}</th>`).join('');
    return `<div class="overflow-auto"><table class="min-w-full text-sm border"><thead class="bg-slate-100"><tr>${head}</tr></thead><tbody>${slice.map(renderRow).join('')}</tbody></table></div>${pagination}`;
  },

  companyName(x) {
    return x.name || x.company || '';
  },

  companyRow(x) {
    const name = Render.companyName(x);
    const jobs = String(x.directJobSearch || x.search || 'Unknown');
    const jobCell = jobs.startsWith('http')
      ? `<a class="text-blue-600 underline" target="_blank" href="${Render.escapeHtml(jobs)}">Search</a>`
      : Render.escapeHtml(jobs);
    const careers = String(x.careersUrl || x.careers || 'Unknown');
    const careerCell = careers.startsWith('http')
      ? `<a class="text-blue-600 underline" target="_blank" href="${Render.escapeHtml(careers)}">Careers</a>`
      : Render.escapeHtml(careers);
    const aem = x.usesAEM === true ? 'Yes' : (x.aem || 'No');
    const india = x.indiaPresence != null ? x.indiaPresence : (x.india || 'Unknown');
    const type = x.companyType || x.type || 'Unknown';
    const priority = x.priority != null ? x.priority : '';
    const status = x.Status || 'Unknown';
    const hiring = x.HiringAEM === true ? 'Yes' : 'No';
    const intensity = x.HiringIntensity || 'Unknown';
    return `<tr class="border-t"><td class="p-2">${Render.escapeHtml(priority)}</td><td class="p-2 font-semibold">${Render.escapeHtml(name)}</td><td class="p-2">${Render.escapeHtml(type)}</td><td class="p-2">${Render.escapeHtml(india)}</td><td class="p-2">${Render.escapeHtml(hiring)}</td><td class="p-2">${Render.escapeHtml(intensity)}</td><td class="p-2">${Render.escapeHtml(aem)}</td><td class="p-2">${Render.escapeHtml(status)}</td><td class="p-2">${careerCell}</td><td class="p-2">${jobCell}</td><td class="p-2">${Render.escapeHtml(x.VisaSupport || x.visa || 'Unknown')}</td></tr>`;
  },

  companyFilterBar(state, total, filtered, industries) {
    const types = ['', 'Product', 'GCC', 'Agency', 'Enterprise'];
    const migrationBands = [
      { id: '', label: 'All migration' },
      { id: 'cloud', label: 'Cloud-native / migrated' },
      { id: 'migrating', label: 'Migrating to cloud' },
      { id: 'unknown', label: 'Unknown migration' }
    ];
    const sortOptions = [
      { id: 'priority-desc', label: 'Priority (high first)' },
      { id: 'priority-asc', label: 'Priority (low first)' },
      { id: 'name-asc', label: 'Name (A–Z)' },
      { id: 'name-desc', label: 'Name (Z–A)' },
      { id: 'hiring-desc', label: 'Hiring intensity' }
    ];
    const typeOpts = types
      .map(t => {
        const sel = state.companyType === t ? ' selected' : '';
        const label = t || 'All types';
        return `<option value="${Render.escapeHtml(t)}"${sel}>${Render.escapeHtml(label)}</option>`;
      })
      .join('');
    const industryList = industries || [];
    const industryOpts = [''].concat(industryList)
      .map(ind => {
        const sel = state.industry === ind ? ' selected' : '';
        const label = ind || 'All industries';
        return `<option value="${Render.escapeHtml(ind)}"${sel}>${Render.escapeHtml(label)}</option>`;
      })
      .join('');
    const migOpts = migrationBands.map(b => {
      const sel = state.migrationBand === b.id ? ' selected' : '';
      return `<option value="${Render.escapeHtml(b.id)}"${sel}>${Render.escapeHtml(b.label)}</option>`;
    }).join('');
    const sortOpts = sortOptions.map(o => {
      const sel = state.sort === o.id ? ' selected' : '';
      return `<option value="${Render.escapeHtml(o.id)}"${sel}>${Render.escapeHtml(o.label)}</option>`;
    }).join('');
    const chk = (key, label) => {
      const on = state[key] ? ' checked' : '';
      return `<label class="inline-flex items-center gap-1 text-sm"><input type="checkbox" data-company-filter="${key}"${on} /> ${Render.escapeHtml(label)}</label>`;
    };
    return `<div class="company-filters mb-4 p-3 border rounded-lg bg-slate-50 dark:bg-slate-800 space-y-3" role="search" aria-label="Filter companies">
      <div class="flex flex-wrap gap-3 items-end">
        <label class="text-sm flex flex-col gap-1">Search name<input type="search" data-company-filter="query" value="${Render.escapeHtml(state.query || '')}" placeholder="Company name…" class="border rounded px-2 py-1 min-w-[10rem]" /></label>
        <label class="text-sm flex flex-col gap-1">Type<select data-company-filter="companyType" class="border rounded px-2 py-1">${typeOpts}</select></label>
        <label class="text-sm flex flex-col gap-1">Industry<select data-company-filter="industry" class="border rounded px-2 py-1">${industryOpts}</select></label>
        <label class="text-sm flex flex-col gap-1">Migration<select data-company-filter="migrationBand" class="border rounded px-2 py-1">${migOpts}</select></label>
        <label class="text-sm flex flex-col gap-1">Sort<select data-company-filter="sort" class="border rounded px-2 py-1">${sortOpts}</select></label>
      </div>
      <div class="flex flex-wrap gap-4">${chk('hiringIndia', 'Hiring India')}${chk('hiringAEM', 'Hiring AEM')}${chk('aemaaCS', 'AEM Cloud')}${chk('verifiedOnly', 'Verified only')}</div>
      <div class="flex flex-wrap items-center justify-between gap-2 pt-1 border-t border-slate-200">
        <p class="text-xs text-slate-500">${filtered} of ${total} companies shown</p>
        <div class="flex items-center gap-2">
          <span class="text-xs text-slate-500">Share this filtered view</span>
          <button type="button" data-copy-discovery-link class="text-xs px-2 py-1 border rounded bg-white hover:bg-slate-50" title="Copy link to this filtered view">Copy link</button>
          <span data-copy-link-status class="text-xs text-green-700 hidden" aria-live="polite">Copied!</span>
        </div>
      </div>
    </div>`;
  },

  companyTable(companies, options = {}) {
    const pageSize = options.pageSize || 25;
    const page = options.page || 1;
    const total = companies.length;
    const totalPages = Math.max(1, Math.ceil(total / pageSize));
    const safePage = Math.min(Math.max(1, page), totalPages);
    const slice = companies.slice((safePage - 1) * pageSize, safePage * pageSize);
    let pagination = '';
    if (totalPages > 1) {
      const buttons = [];
      for (let p = 1; p <= totalPages; p++) {
        const active = p === safePage ? ' bg-blue-100 font-semibold' : '';
        buttons.push(`<button type="button" data-company-page="${p}" class="px-2 py-1 border rounded hover:bg-slate-100${active}">${p}</button>`);
      }
      pagination = `<nav class="mt-3 flex flex-wrap gap-2 items-center text-sm" aria-label="Company table pages">${buttons.join('')}<span class="text-slate-500 ml-2">${total} companies · page ${safePage} of ${totalPages}</span></nav>`;
    }
    return `<div class="overflow-auto"><table class="min-w-full text-sm border"><thead class="bg-slate-100"><tr><th class="p-2">Priority</th><th class="p-2">Company</th><th class="p-2">Type</th><th class="p-2">India</th><th class="p-2">Hiring</th><th class="p-2">Intensity</th><th class="p-2">AEM</th><th class="p-2">Status</th><th class="p-2">Careers</th><th class="p-2">AEM Jobs</th><th class="p-2">Visa</th></tr></thead><tbody>${slice.map(Render.companyRow).join('')}</tbody></table></div>${pagination}`;
  },

  companySection(companies, options = {}) {
    const state = options.filterState || {};
    const total = options.totalCount != null ? options.totalCount : companies.length;
    const filtered = companies.length;
    const filters = options.showFilters
      ? Render.companyFilterBar(state, total, filtered, options.industries)
      : '';
    return `${filters}<div class="company-table-wrap">${Render.companyTable(companies, options)}</div>`;
  },

  glossaryTable(terms, options = {}) {
    return Render.paginatedTable(
      terms,
      options,
      g => `<tr class="border-t"><td class="p-2 font-semibold">${Render.escapeHtml(g.term)}</td><td class="p-2">${Render.escapeHtml(g.definition)}</td><td class="p-2 text-slate-500 text-xs">${Render.escapeHtml((g.relatedTerms || []).join(', '))}</td></tr>`,
      ['Term', 'Definition', 'Related'],
      'glossary'
    );
  },

  technologyTable(technologies, options = {}) {
    return Render.paginatedTable(
      technologies,
      options,
      t => `<tr class="border-t"><td class="p-2 font-semibold">${Render.escapeHtml(t.name)}</td><td class="p-2">${Render.escapeHtml(t.category)}</td><td class="p-2">${Render.escapeHtml(t.difficulty)}</td><td class="p-2">${Render.escapeHtml(t.summary)}</td></tr>`,
      ['Technology', 'Category', 'Level', 'Summary'],
      'technology'
    );
  },

  careerPaths(paths) {
    return paths.map(p => {
      const milestones = (p.milestones || []).map(m =>
        `<li class="mt-2"><strong>${Render.escapeHtml(m.title)}</strong> — ${Render.escapeHtml(m.description)}</li>`
      ).join('');
      return `<article class="border rounded-lg p-4 mb-4"><h3 class="font-bold text-lg">${Render.escapeHtml(p.title)}</h3><p class="text-slate-600 text-sm mt-1">${Render.escapeHtml(p.summary)}</p><ol class="list-decimal ml-6 mt-3">${milestones}</ol></article>`;
    }).join('');
  },

  interviewList(items, options = {}) {
    return Render.paginatedTable(
      items,
      options,
      q => `<tr class="border-t align-top"><td class="p-2">${Render.escapeHtml(q.category)}</td><td class="p-2">${Render.escapeHtml(q.difficulty)}</td><td class="p-2 font-semibold">${Render.escapeHtml(q.question)}</td><td class="p-2 text-slate-600 text-sm">${Render.escapeHtml(q.guidance)}</td></tr>`,
      ['Category', 'Level', 'Question', 'Guidance'],
      'interview'
    );
  },

  templatesList(templates) {
    return templates.map(t =>
      `<article class="border rounded-lg p-4 mb-4"><h3 class="font-bold">${Render.escapeHtml(t.title)}</h3><p class="text-xs text-slate-500 uppercase mt-1">${Render.escapeHtml(t.category)}</p><p class="mt-2 text-slate-700 whitespace-pre-wrap">${Render.escapeHtml(t.body)}</p></article>`
    ).join('');
  },

  ownerPlaybook(playbook) {
    if (!playbook || !playbook.sections) return '';
    return playbook.sections.map(sec => {
      const badge = sec.audience === 'owner'
        ? '<span class="text-xs uppercase text-amber-700 bg-amber-50 border border-amber-200 rounded px-1.5 py-0.5">Owner</span>'
        : '';
      const steps = Array.isArray(sec.steps) && sec.steps.length
        ? `<ol class="list-decimal ml-6 mt-3 space-y-2">${sec.steps.map(s =>
            `<li class="text-slate-700">${Render.escapeHtml(s)}</li>`
          ).join('')}</ol>`
        : '';
      const body = sec.body
        ? `<p class="mt-3 text-slate-600 text-sm">${Render.escapeHtml(sec.body)}</p>`
        : '';
      return `<article id="owner-${Render.escapeHtml(sec.id)}" class="border rounded-lg p-4 mb-4"><div class="flex flex-wrap items-center gap-2"><h3 class="font-bold text-lg">${Render.escapeHtml(sec.title)}</h3>${badge}</div><p class="text-slate-600 text-sm mt-1">${Render.escapeHtml(sec.summary)}</p>${steps}${body}</article>`;
    }).join('');
  },

  resourcesList(resources) {
    return `<ul class="list-disc ml-6 space-y-2">${resources.map(r =>
      `<li><a class="text-blue-600 underline" href="${Render.escapeHtml(r.url)}" target="_blank" rel="noopener noreferrer">${Render.escapeHtml(r.title)}</a> <span class="text-xs text-slate-500">(${Render.escapeHtml(r.type)})</span></li>`
    ).join('')}</ul>`;
  },

  chapter(chapter, index, ctx) {
    const id = 'ch' + index;
    const companies = ctx.companies || [];
    const learning = ctx.learning || {};
    let body = chapter.body || '';
    if (chapter.companyTable) {
      body = `<div id="company-table-container">${Render.companySection(companies, { page: 1, showFilters: true, filterState: {}, totalCount: companies.length })}</div>`;
    } else if (chapter.ownerPlaybookEmbed && ctx.ownerPlaybook) {
      body += `<div class="mt-4">${Render.ownerPlaybook(ctx.ownerPlaybook)}</div>`;
    } else if (chapter.glossaryEmbed && learning.glossary) {
      body += `<div id="glossary-table-container" class="mt-4">${Render.glossaryTable(learning.glossary, { page: 1 })}</div>`;
    } else if (chapter.technologyEmbed && learning.technologies) {
      body += `<div id="technology-table-container" class="mt-4">${Render.technologyTable(learning.technologies, { page: 1 })}</div>`;
    } else if (chapter.careerPathEmbed && learning.careerPaths) {
      body += `<div class="mt-4">${Render.careerPaths(learning.careerPaths)}</div>`;
    } else if (chapter.templateEmbed && learning.templates) {
      body += `<div class="mt-4">${Render.templatesList(learning.templates)}</div>`;
    } else if (chapter.interviewEmbed && learning.interviews) {
      body += `<div id="interview-table-container" class="mt-4">${Render.interviewList(learning.interviews, { page: 1 })}</div>`;
    } else if (chapter.resourceEmbed && learning.resources) {
      body += `<div class="mt-4">${Render.resourcesList(learning.resources)}</div>`;
    }
    const reading = chapter.reading || chapter.readingTime || '';
    return `<section id="${id}" class="section bg-white text-slate-800 rounded-xl shadow p-8"><h2 class="text-3xl font-bold">${Render.escapeHtml(chapter.title)}</h2><div class="text-xs text-slate-500 mt-1">⏱ ${Render.escapeHtml(reading)} • ${Render.escapeHtml(chapter.tags.join(', '))}</div><p class="text-slate-500 mb-4">${Render.escapeHtml(chapter.summary)}</p>${body}<details class="mt-6"><summary class="cursor-pointer font-semibold">📌 Summary</summary><div class="mt-2 text-slate-600">${Render.escapeHtml(chapter.summary)}</div></details></section>`;
  },

  footer(footer) {
    return `<footer class="max-w-7xl mx-auto p-6 text-sm text-slate-500 text-center border-t mt-6">${Render.escapeHtml(footer.text)}</footer>`;
  }
};

if (typeof window !== 'undefined') {
  window.Render = Render;
}
if (typeof module !== 'undefined' && module.exports) {
  module.exports = Render;
}
