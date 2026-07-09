/**
 * Render namespace — pure markup builders (see 10_COMPONENT_LIBRARY.md).
 * Loaded by index.html via <script src>; also require()'d by scripts/verify-render.js.
 */
const COMPANY_PAGE_SIZE = 10;
const LEARNING_PAGE_SIZE = 10;

const Render = {
  pageSize: COMPANY_PAGE_SIZE,
  learningPageSize: LEARNING_PAGE_SIZE,

  icon(name, className) {
    if (typeof Icons !== 'undefined') return Icons.svg(name, className || 'icon');
    return '';
  },

  // Browser: index.html loads filters.js as a separate <script>, so `CompanyFilters` is already a
  // bare identifier in the shared script scope by the time any Render method actually runs.
  // Node (scripts/verify-render.js requires render.js in isolation): fall back to require().
  _companyFilters() {
    return typeof CompanyFilters !== 'undefined' ? CompanyFilters : require('./filters.js').CompanyFilters;
  },

  escapeHtml(value) {
    return String(value).replace(
      /[&<>"']/g,
      ch =>
        ({
          '&': '&amp;',
          '<': '&lt;',
          '>': '&gt;',
          '"': '&quot;',
          "'": '&#39;'
        })[ch]
    );
  },

  isProductMode(options) {
    return options && options.productMode === true;
  },

  difficultyRank(level) {
    const ranks = { Beginner: 1, Intermediate: 2, Advanced: 3 };
    return ranks[level] != null ? ranks[level] : 99;
  },

  sortByDifficulty(items, labelKey) {
    const key = labelKey || 'name';
    return [...(items || [])].sort((a, b) => {
      const diff = Render.difficultyRank(a.difficulty) - Render.difficultyRank(b.difficulty);
      if (diff !== 0) return diff;
      const av = (a[key] || a.term || a.question || '').toString();
      const bv = (b[key] || b.term || b.question || '').toString();
      return av.localeCompare(bv);
    });
  },

  heroPurposeText(purpose) {
    if (!purpose) return '';
    if (typeof purpose === 'string') return purpose;
    return [purpose.intro || purpose.lead, ...(purpose.points || [])].filter(Boolean).join(' ');
  },

  heroPurposeMarkup(purpose) {
    if (!purpose) return '';
    if (typeof purpose === 'string') {
      return `<div class="doc-hero__purpose"><p class="doc-hero__purpose-intro">${Render.escapeHtml(purpose)}</p></div>`;
    }
    const intro =
      purpose.intro || purpose.lead ? `<p class="doc-hero__purpose-intro">${Render.escapeHtml(purpose.intro || purpose.lead)}</p>` : '';
    const points =
      Array.isArray(purpose.points) && purpose.points.length
        ? `<ul class="doc-hero__purpose-list">${purpose.points.map(p => `<li>${Render.escapeHtml(p)}</li>`).join('')}</ul>`
        : '';
    if (!intro && !points) return '';
    return `<div class="doc-hero__purpose">${intro}${points}</div>`;
  },

  setMetaTag(name, content, attr) {
    if (!content) return;
    const key = attr || 'name';
    let el = document.querySelector(`meta[${key}="${name}"]`);
    if (!el) {
      el = document.createElement('meta');
      el.setAttribute(key, name);
      document.head.appendChild(el);
    }
    el.setAttribute('content', content);
  },

  applyHeadMeta(site) {
    if (typeof document === 'undefined' || !site) return;
    const title = site.documentTitle || '';
    const seo = site.seo || {};
    const desc = seo.description || '';
    document.title = title;
    Render.setMetaTag('description', desc);
    if (seo.keywords && seo.keywords.length) {
      Render.setMetaTag('keywords', seo.keywords.join(', '));
    }
    Render.setMetaTag('og:title', title, 'property');
    Render.setMetaTag('og:description', desc, 'property');
    Render.setMetaTag('og:type', seo.ogType || 'website', 'property');
    Render.setMetaTag('og:locale', seo.ogLocale || 'en_US', 'property');
    if (typeof location !== 'undefined' && location.href) {
      Render.setMetaTag('og:url', location.href.split('#')[0], 'property');
    }
    Render.setMetaTag('twitter:card', seo.twitterCard || 'summary');
    Render.setMetaTag('twitter:title', title);
    Render.setMetaTag('twitter:description', desc);
    if (seo.themeColor) Render.setMetaTag('theme-color', seo.themeColor);
    if (seo.ogImage) Render.setMetaTag('og:image', seo.ogImage, 'property');
    let canonical = document.querySelector('link[rel="canonical"]');
    if (!canonical) {
      canonical = document.createElement('link');
      canonical.rel = 'canonical';
      document.head.appendChild(canonical);
    }
    if (typeof location !== 'undefined') {
      canonical.href = location.href.split('#')[0].split('?')[0];
    }
    let ld = document.getElementById('site-json-ld');
    if (!ld) {
      ld = document.createElement('script');
      ld.id = 'site-json-ld';
      ld.type = 'application/ld+json';
      document.head.appendChild(ld);
    }
    const base = typeof location !== 'undefined' ? location.origin + location.pathname : '';
    ld.textContent = JSON.stringify({
      '@context': 'https://schema.org',
      '@type': 'WebSite',
      name: title,
      description: desc,
      url: base,
      potentialAction: {
        '@type': 'SearchAction',
        target: base + '?q={search_term_string}',
        'query-input': 'required name=search_term_string'
      }
    });
  },

  pageHeader(meta, options) {
    const short = meta.shortTitle || meta.title;
    const product = Render.isProductMode(options);
    const fullTitle = product ? '' : `<div class="doc-wordmark__full">${Render.escapeHtml(meta.title)}</div>`;
    const version = product ? '' : `<span class="doc-wordmark__full">${Render.escapeHtml(meta.versionLabel || '')}</span>`;
    const compactClass = product ? ' doc-wordmark--compact' : '';
    return `<a href="#hero" class="doc-wordmark${compactClass}"><div class="doc-wordmark__title">${Render.escapeHtml(short)}</div>${fullTitle}${version}</a>`;
  },

  /** Header GitHub control — prerendered so the tools row does not gain a 44px button after boot (CLS). */
  headerGithubLink(header) {
    const url = header && header.githubUrl;
    if (!url) return '';
    return `<a id="github-link" class="icon-btn icon-btn--header" href="${Render.escapeHtml(url)}" target="_blank" rel="noopener noreferrer" aria-label="GitHub repository">${Render.icon('github')}</a>`;
  },

  /** Default theme toggle icon for first paint; UI.initTheme replaces it with the real preference. */
  headerThemeToggle() {
    return `<button type="button" class="icon-btn icon-btn--header" id="themeToggle" aria-label="Toggle theme">${Render.icon('moon')}</button>`;
  },

  disclaimer(content, header) {
    if (!content) return '';
    const lines =
      Array.isArray(content.lines) && content.lines.length ? content.lines.filter(Boolean) : content.message ? [content.message] : [];
    if (!lines.length) return '';
    const prUrl = content.contributingUrl || (header && header.githubUrl ? String(header.githubUrl).replace(/\/$/, '') + '/pulls' : '');
    const links = [];
    if (content.contributing && prUrl) {
      links.push(`<a href="${Render.escapeHtml(prUrl)}" class="site-disclaimer__link">${Render.escapeHtml(content.contributing)}</a>`);
    }
    if (content.contactEmail) {
      links.push(
        `<a href="mailto:${Render.escapeHtml(content.contactEmail)}" class="site-disclaimer__link">${Render.escapeHtml(content.contactEmail)}</a>`
      );
    }

    let ctaHtml = '';
    if (content.contributingLead && links.length) {
      ctaHtml = `<p class="site-disclaimer__cta"><span class="site-disclaimer__lead">${Render.escapeHtml(content.contributingLead)}</span> <span class="site-disclaimer__links">${links.join('<span class="site-disclaimer__sep" aria-hidden="true"> · </span>')}</span></p>`;
    } else if (content.contributing && prUrl) {
      ctaHtml = `<p class="site-disclaimer__cta"><a href="${Render.escapeHtml(prUrl)}" class="site-disclaimer__link">${Render.escapeHtml(content.contributing)}</a></p>`;
    } else if (content.contributing) {
      ctaHtml = `<p class="site-disclaimer__cta">${Render.escapeHtml(content.contributing)}</p>`;
    }

    const messageHtml = lines.map(line => `<p class="site-disclaimer__text">${Render.escapeHtml(line)}</p>`).join('');

    return `<aside class="site-disclaimer" role="note" aria-label="Data disclaimer"><div class="site-disclaimer__inner">${messageHtml}${ctaHtml}</div></aside>`;
  },

  search(config, wrapId, idSuffix) {
    const id = wrapId || 'search-wrap';
    const s = idSuffix || '';
    const i = base => base + s;
    const isDesktop = s === '-desktop';
    // Desktop: show Ctrl/⌘K so the existing global shortcut is discoverable (width reserved to avoid CLS).
    const shortcut = isDesktop
      ? `<kbd class="search-wrap__shortcut" title="Keyboard shortcut"><span class="search-wrap__shortcut-ctrl">Ctrl</span><span class="search-wrap__shortcut-meta">⌘</span>K</kbd>`
      : '';
    const fieldClass = isDesktop
      ? 'search-wrap__field search-wrap__field--icon search-wrap__field--shortcut'
      : 'search-wrap__field search-wrap__field--icon';
    return `<div class="search-wrap" id="${id}"><div class="${fieldClass}"><span class="search-wrap__icon" aria-hidden="true">${Render.icon('search')}</span><span class="sr-only">${Render.escapeHtml(config.ariaLabel)}</span><input id="${i('search')}" placeholder="${Render.escapeHtml(config.placeholder)}" aria-label="${Render.escapeHtml(config.ariaLabel)}" aria-controls="${i('search-results')}" aria-expanded="false" aria-autocomplete="list" autocomplete="off" type="text" role="combobox" inputmode="search" /><button type="button" class="search-clear hidden" id="${i('search-clear')}" aria-label="${Render.escapeHtml(config.clearLabel || 'Clear search')}">${Render.icon('x')}</button>${shortcut}</div><div id="${i('search-panel')}" class="search-panel hidden"><div id="${i('search-facets')}" class="search-facets" role="group" aria-label="Filter search results"></div><div id="${i('search-results')}" class="search-results" role="listbox"></div></div><p id="${i('search-status')}" class="sr-only" aria-live="polite"></p></div>`;
  },

  searchFacets(state) {
    const sources = [
      { id: '', label: 'All' },
      { id: 'company', label: 'Companies' },
      { id: 'owner', label: 'Apply' },
      { id: 'chapter', label: 'Chapters' },
      { id: 'learning', label: 'Learning' }
    ];
    const sourceChips = sources
      .map(s => {
        const active = (state.sourceFilter || '') === s.id ? ' search-facet-chip--active' : '';
        return `<button type="button" class="search-facet-chip${active}" data-search-facet="sourceFilter" data-value="${Render.escapeHtml(s.id)}">${Render.escapeHtml(s.label)}</button>`;
      })
      .join('');
    return `<div class="search-facets-bar"><div class="search-facets-chips">${sourceChips}</div><div class="company-explorer__footer-copy"><button type="button" data-copy-discovery-link class="copy-link-btn">${Render.icon('copy')} Copy link</button><span data-copy-link-status class="copy-toast hidden" aria-live="polite">Copied!</span></div></div>`;
  },

  searchEmptyMessage(query, meta) {
    if (!query || !query.trim()) return 'No results';
    if (meta && meta.widened) {
      return `No results in ${meta.categoryLabel || 'that category'} for “${query.trim()}”. Showing all categories instead.`;
    }
    if (meta && meta.rawCount > 0 && meta.sourceFilter) {
      const labels = { company: 'Companies', owner: 'Apply', chapter: 'Chapters', learning: 'Learning' };
      const label = labels[meta.sourceFilter] || meta.sourceFilter;
      return `No results in ${label} for “${query.trim()}”. Try All or another category.`;
    }
    return 'No results';
  },

  searchResults(results, query, activeIndex, meta) {
    if (!query || !query.trim()) return '';
    if (!results.length) {
      const msg = Render.searchEmptyMessage(query, meta);
      const tryAll =
        meta && meta.rawCount > 0 && meta.sourceFilter
          ? ' <button type="button" class="search-facet-chip search-reset-facet" data-search-facet="sourceFilter" data-value="">Search all</button>'
          : '';
      return `<p class="search-empty">${Render.escapeHtml(msg)}${tryAll}</p>`;
    }
    const typeLabel = {
      chapter: 'Chapter',
      company: 'Company',
      owner: 'Apply',
      roadmap: 'Roadmap',
      'roadmap-step': 'Roadmap step',
      site: 'Site',
      glossary: 'Glossary',
      technology: 'Technology',
      career: 'Career path',
      interview: 'Interview',
      template: 'Template',
      resource: 'Resource'
    };
    return results
      .map((r, i) => {
        const active = i === activeIndex ? ' search-result--active' : '';
        const label = typeLabel[r.source] || r.source;
        let snippetHtml = `<span class="search-result__snippet">${Render.escapeHtml(r.snippet || '')}</span>`;
        if (r.source === 'company' && (r.snippetMeta || r.snippetProducts)) {
          const meta = r.snippetMeta ? `<span class="search-result__meta">${Render.escapeHtml(r.snippetMeta)}</span>` : '';
          const products = r.snippetProducts ? `<span class="search-result__products">${Render.escapeHtml(r.snippetProducts)}</span>` : '';
          snippetHtml = `<span class="search-result__snippet">${meta}${products}</span>`;
        }
        return `<button type="button" class="search-result${active}" role="option" data-anchor="${Render.escapeHtml(r.anchor)}" data-chapter-index="${r.chapterIndex != null ? r.chapterIndex : ''}" aria-selected="${i === activeIndex}"><span class="search-result__type">${Render.escapeHtml(label)}</span><span class="search-result__title">${Render.escapeHtml(r.title)}</span>${snippetHtml}</button>`;
      })
      .join('');
  },

  sidebar(chapters) {
    return chapters
      .map(c => {
        const anchor = c.id ? `#${Render.escapeHtml(c.id)}` : '#main';
        return `<a href="${anchor}" class="doc-nav__link" data-nav-id="${Render.escapeHtml(c.id || '')}">${Render.escapeHtml(c.title)}</a>`;
      })
      .join('');
  },

  sidebarGrouped(chapters, groups) {
    if (!groups || !groups.length) return Render.sidebar(chapters);
    const byId = new Map(chapters.map(c => [c.id, c]));
    const used = new Set();
    let html = '';
    groups.forEach(g => {
      const items = (g.chapterIds || []).map(id => byId.get(id)).filter(Boolean);
      if (!items.length) return;
      items.forEach(c => used.add(c.id));
      const links = items
        .map(c => {
          const anchor = `#${Render.escapeHtml(c.id)}`;
          return `<a href="${anchor}" class="doc-nav__link" data-nav-id="${Render.escapeHtml(c.id)}">${Render.escapeHtml(c.title)}</a>`;
        })
        .join('');
      html += `<details class="doc-nav__group" data-nav-group="${Render.escapeHtml(g.id)}" open><summary>${Render.escapeHtml(g.label)}</summary><div class="doc-nav__links">${links}</div></details>`;
    });
    chapters
      .filter(c => !used.has(c.id))
      .forEach(c => {
        html += `<a href="#${Render.escapeHtml(c.id)}" class="doc-nav__link" data-nav-id="${Render.escapeHtml(c.id)}">${Render.escapeHtml(c.title)}</a>`;
      });
    return html;
  },

  companyStats(companies) {
    const list = companies || [];
    const filters = Render._companyFilters();
    return {
      total: list.length,
      hiring: list.length,
      india: list.filter(c => filters.isHiringIndia(c)).length,
      cloud: list.filter(c => filters.isAemCloud(c)).length,
      hiringActive: list.filter(c => filters.isHiringActive(c)).length,
      ownerPreferred: list.filter(c => filters.isOwnerPreferred(c)).length,
      product: list.filter(c => c.companyType === 'Product').length,
      gcc: list.filter(c => c.companyType === 'GCC').length
    };
  },

  dashboard(stats) {
    const items = stats.items.map(item => `<li>${Render.escapeHtml(item)}</li>`).join('');
    return `<h3 class="font-semibold">${Render.escapeHtml(stats.title)}</h3><ul class="list-disc ml-5 mt-2">${items}</ul>`;
  },

  hero(content, options, stats) {
    const purpose = Render.heroPurposeMarkup(content.purpose);
    if (Render.isProductMode(options) && stats) {
      const ctas = `<div class="hero-cta-row">${content.ctaCompanies ? `<a class="hero-cta" href="#target-companies">${Render.escapeHtml(content.ctaCompanies)}</a>` : ''}${content.ctaApply ? `<a class="hero-cta hero-cta--secondary" href="#how-to-apply">${Render.escapeHtml(content.ctaApply)}</a>` : ''}</div>`;
      const statCards = [
        { v: stats.total, l: 'AEM employers' },
        { v: stats.india, l: 'Hiring in India' },
        { v: stats.cloud, l: 'AEM Cloud' },
        { v: stats.gcc, l: 'GCCs' }
      ]
        .map(
          s =>
            `<div class="stat-card"><div class="stat-card__value">${s.v}</div><div class="stat-card__label">${Render.escapeHtml(s.l)}</div></div>`
        )
        .join('');
      return `<section id="hero" class="doc-hero"><h2>${Render.escapeHtml(content.title)}</h2><p class="doc-hero__desc">${Render.escapeHtml(content.body)}</p>${purpose}<div class="doc-hero__stats">${statCards}</div>${ctas}</section>`;
    }
    let ctas = '';
    if (Render.isProductMode(options) && (content.ctaCompanies || content.ctaApply)) {
      const browse = content.ctaCompanies
        ? `<a class="hero-cta" href="#target-companies">${Render.escapeHtml(content.ctaCompanies)}</a>`
        : '';
      const apply = content.ctaApply
        ? `<a class="hero-cta hero-cta--secondary" href="#how-to-apply">${Render.escapeHtml(content.ctaApply)}</a>`
        : '';
      ctas = `<div class="hero-cta-row">${browse}${apply}</div>`;
    }
    return `<section id="hero" class="doc-hero"><h2>${Render.escapeHtml(content.title)}</h2><p class="doc-hero__desc">${Render.escapeHtml(content.body)}</p>${purpose}${ctas}</section>`;
  },

  roadmap(roadmap, options) {
    return Render.roadmapPanel(roadmap, options);
  },

  roadmapList(roadmaps, options) {
    return (roadmaps || []).map(rm => Render.roadmapPanel(rm, options)).join('');
  },

  roadmapPanel(roadmap, options) {
    const hideStatus = Render.isProductMode(options);
    const steps = (roadmap.steps || [])
      .map(s => {
        const desc = s.description ? `<p class="text-sm mt-1">${Render.escapeHtml(s.description)}</p>` : '';
        const hours = s.estimatedHours ? ` <span class="text-xs">(~${s.estimatedHours}h)</span>` : '';
        const status = hideStatus ? '' : `<span class="text-slate-500 text-sm">${Render.escapeHtml(s.status)}</span> — `;
        return `<li id="roadmap-step-${Render.escapeHtml(s.id)}">${status}<strong>${Render.escapeHtml(s.title)}</strong>${hours}${desc}</li>`;
      })
      .join('');
    if (hideStatus) {
      return `<details class="roadmap-accordion" id="roadmap-${Render.escapeHtml(roadmap.id)}"><summary>${Render.escapeHtml(roadmap.title)}</summary><div class="roadmap-accordion__body"><p class="text-sm mb-3">${Render.escapeHtml(roadmap.summary)}</p><ol>${steps}</ol></div></details>`;
    }
    return `<section id="roadmap-${Render.escapeHtml(roadmap.id)}" class="section"><h2>${Render.escapeHtml(roadmap.title)}</h2><p class="text-slate-500 mt-2 mb-4">${Render.escapeHtml(roadmap.summary)}</p><ol class="list-decimal ml-6 space-y-3">${steps}</ol></section>`;
  },

  uiSelect(filterKey, label, options, current, extraClass) {
    const isRail = /\bui-select--rail\b/.test(extraClass || '');
    const hasValue = !!(current && String(current).length);
    // Rail filters: category label is display-only (not a selectable "All …" row). Clear via ×.
    const listOptions = isRail ? options.filter(o => o.id !== '') : options;
    const opts = listOptions
      .map(o => {
        const sel = o.id === current ? ' ui-select__option--active' : '';
        const aria = o.id === current ? 'true' : 'false';
        return `<li role="option" class="ui-select__option${sel}" data-value="${Render.escapeHtml(o.id)}" data-label="${Render.escapeHtml(o.label)}" aria-selected="${aria}">${Render.escapeHtml(o.label)}</li>`;
      })
      .join('');
    const cur = options.find(o => o.id === current) || options.find(o => o.id === '') || options[0];
    const displayLabel = hasValue && cur ? cur.label : label;
    const cls = extraClass ? `ui-select ${extraClass}` : 'ui-select';
    const searchable = listOptions.length > 5;
    const search = searchable
      ? `<div class="ui-select__search"><span class="ui-select__search-icon" aria-hidden="true">${Render.icon('search', 'icon icon--sm')}</span><input type="search" class="ui-select__search-input" placeholder="Search ${Render.escapeHtml(label.toLowerCase())}…" autocomplete="off" aria-label="Search ${Render.escapeHtml(label)}" /></div>`
      : '';
    const searchableAttr = searchable ? ' data-ui-searchable="true"' : '';
    const clearableAttr = isRail ? ' data-ui-clearable="true"' : '';
    const clearHidden = hasValue ? '' : ' hidden';
    const clearBtn = isRail
      ? `<button type="button" class="ui-select__clear${clearHidden}" data-ui-select-clear aria-label="Clear ${Render.escapeHtml(label)}">${Render.icon('x', 'icon icon--sm')}</button>`
      : '';
    return `<div class="${cls}" data-ui-select${searchableAttr}${clearableAttr} data-ui-placeholder="${Render.escapeHtml(label)}"><span class="ui-select__label">${Render.escapeHtml(label)}</span><div class="ui-select__control"><button type="button" class="ui-select__trigger" aria-haspopup="listbox" aria-expanded="false"><span class="ui-select__value">${Render.escapeHtml(displayLabel)}</span>${Render.icon('chevronDown')}</button>${clearBtn}</div><div class="ui-select__dropdown hidden">${search}<ul class="ui-select__list" role="listbox">${opts}</ul><p class="ui-select__empty hidden" role="status">No matches</p></div><input type="hidden" data-company-filter="${Render.escapeHtml(filterKey)}" value="${Render.escapeHtml(current || '')}" /></div>`;
  },

  companyPagination(page, totalItems, pageAttr) {
    const pageSize = COMPANY_PAGE_SIZE;
    const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));
    const safePage = Math.min(Math.max(1, page), totalPages);
    if (totalPages <= 1) return '';
    const prev = safePage <= 1 ? 'disabled' : '';
    const next = safePage >= totalPages ? 'disabled' : '';
    return `<nav class="explorer-pagination" aria-label="Company pages"><button type="button" data-${pageAttr}-prev="${safePage}" ${prev}>${Render.icon('chevronLeft')} Prev</button><span class="explorer-pagination__info">Page ${safePage} of ${totalPages}</span><button type="button" data-${pageAttr}-next="${safePage}" ${next}>Next ${Render.icon('chevronRight')}</button></nav>`;
  },

  companyResultsLabel(filtered, totalAll) {
    if (!filtered) return `0 of ${totalAll} employers`;
    if (filtered === totalAll) return `${filtered} employers`;
    return `${filtered} of ${totalAll} employers`;
  },

  companyCountLabel(page, filtered, totalAll, pageSize) {
    const ps = pageSize || COMPANY_PAGE_SIZE;
    if (!filtered) return `0 of ${totalAll} employers`;
    const totalPages = Math.max(1, Math.ceil(filtered / ps));
    const safePage = Math.min(Math.max(1, page), totalPages);
    const start = (safePage - 1) * ps + 1;
    const end = Math.min(safePage * ps, filtered);
    const suffix = filtered < totalAll ? ` (from ${totalAll} total)` : '';
    return `Showing ${start}–${end} of ${filtered}${suffix}`;
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
        const active = p === safePage ? ' explorer-page-btn--active' : '';
        buttons.push(`<button type="button" data-${pageAttr}-page="${p}" class="explorer-page-btn${active}">${p}</button>`);
      }
      pagination = `<nav class="explorer-pagination explorer-pagination--numbered" aria-label="${Render.escapeHtml(pageAttr)} pages">${buttons.join('')}<span class="explorer-pagination__info">${total} items · page ${safePage} of ${totalPages}</span></nav>`;
    }
    const colClass = {
      Term: 'data-table__col--term',
      Definition: 'data-table__col--definition',
      Related: 'data-table__col--related',
      Technology: 'data-table__col--tech',
      Category: 'data-table__col--category',
      Level: 'data-table__col--level',
      Summary: 'data-table__col--summary',
      Question: 'data-table__col--question',
      Guidance: 'data-table__col--guidance'
    };
    const head = headers
      .map(h => {
        const cls = colClass[h] || '';
        return `<th scope="col"${cls ? ` class="${cls}"` : ''}>${Render.escapeHtml(h)}</th>`;
      })
      .join('');
    return `<div class="data-table-wrap"><table class="data-table data-table--${Render.escapeHtml(pageAttr)}"><thead><tr>${head}</tr></thead><tbody>${slice.map(renderRow).join('')}</tbody></table></div>${pagination}`;
  },

  companyName(x) {
    return x.name || x.company || '';
  },

  companyLink(url, label) {
    const href = String(url || '');
    if (href.startsWith('http')) {
      return `<a class="text-blue-600 underline" target="_blank" rel="noopener noreferrer" href="${Render.escapeHtml(href)}">${Render.escapeHtml(label)}</a>`;
    }
    return Render.escapeHtml(href || 'Unknown');
  },

  companyActionBtn(url, label) {
    const href = String(url || '');
    if (!href.startsWith('http')) return `<span class="text-muted">—</span>`;
    return `<a class="action-btn" href="${Render.escapeHtml(href)}" target="_blank" rel="noopener noreferrer" aria-label="${Render.escapeHtml(label)}">${Render.icon('external-link')}</a>`;
  },

  companyCareersLink(x) {
    const careers = String(x.careersUrl || x.careers || '');
    const jobs = String(x.jobSearchUrl || x.directJobSearch || x.search || '');
    if (careers.startsWith('http')) return careers;
    if (jobs.startsWith('http')) return jobs;
    return '';
  },

  companyBadges(x) {
    const filters = Render._companyFilters();
    const badges = [];
    if (filters.isOwnerPreferred(x)) {
      badges.push(
        `<span class="company-mark company-mark--preferred" title="Owner recommendation (pay, growth, quality)">${Render.icon('star', 'icon icon--sm')} Preferred</span>`
      );
    }
    if (filters.isHiringActive(x)) {
      badges.push(
        `<span class="company-mark company-mark--hiring" title="Generally posts AEM/DXP roles often — not a live vacancy guarantee">${Render.icon('activity', 'icon icon--sm')} Frequent</span>`
      );
    }
    return badges.length ? ` <span class="company-badges">${badges.join('')}</span>` : '';
  },

  companyEvidenceLinks(urls, label) {
    const list = (urls || []).filter(u => String(u || '').startsWith('http'));
    if (!list.length) return '';
    const items = list
      .map(
        (u, i) =>
          `<li><a href="${Render.escapeHtml(u)}" target="_blank" rel="noopener noreferrer">${Render.escapeHtml(label)}${list.length > 1 ? ` ${i + 1}` : ''}</a></li>`
      )
      .join('');
    return `<div class="company-detail__block"><h4 class="company-detail__label">${Render.escapeHtml(label)}</h4><ul class="company-detail__links">${items}</ul></div>`;
  },

  companyDetailPanel(x) {
    const filters = Render._companyFilters();
    const productChips = (x.products || [])
      .map(code => `<span class="company-detail__chip">${Render.escapeHtml(filters.productLabel(code))}</span>`)
      .join('');
    const roles = (x.roles || []).filter(Boolean);
    const rolesHtml = roles.length
      ? `<div class="company-detail__block"><h4 class="company-detail__label">Typical roles</h4><ul class="company-detail__list">${roles
          .map(r => `<li>${Render.escapeHtml(r)}</li>`)
          .join('')}</ul></div>`
      : '';
    const metaParts = [];
    if (x.hq) metaParts.push(`<span>HQ</span> ${Render.escapeHtml(x.hq)}`);
    const india = filters.indiaLabel(x);
    if (india && india !== '—') metaParts.push(`<span>India</span> ${Render.escapeHtml(india)}`);
    const meta = metaParts.length
      ? `<div class="company-detail__meta">${metaParts.join('<span class="company-detail__meta-sep" aria-hidden="true"> · </span>')}</div>`
      : '';
    const notes = String(x.notes || '').trim()
      ? `<div class="company-detail__block"><h4 class="company-detail__label">Notes</h4><p class="company-detail__notes">${Render.escapeHtml(x.notes)}</p></div>`
      : '';
    const productsHtml = productChips
      ? `<div class="company-detail__block"><h4 class="company-detail__label">Products</h4><div class="company-detail__chips">${productChips}</div></div>`
      : '';
    const evidence = Render.companyEvidenceLinks(x.evidence, 'AEM evidence');
    const hiringEvidence = Render.companyEvidenceLinks(x.hiringEvidence, 'Hiring evidence');
    const verified = x.verifiedAt
      ? `<p class="company-detail__verified">Verified ${Render.escapeHtml(x.verifiedAt)}${x.ownerVerified ? ' · Owner checked' : ''}</p>`
      : '';
    const linkNote =
      '<p class="company-detail__link-note">Tip: careers and evidence links are snapshots from the verified date. If a link fails, open the employer careers site and search for AEM / Adobe Experience Manager.</p>';
    return `<div class="company-detail">${meta}${productsHtml}${rolesHtml}${notes}${evidence}${hiringEvidence}${verified}${linkNote}</div>`;
  },

  companyRow(x, options) {
    const filters = Render._companyFilters();
    const name = Render.companyName(x);
    const careers = Render.companyCareersLink(x);
    const india = filters.indiaLabel(x);
    const type = x.companyType || x.type || 'Unknown';
    const priority = x.priority != null ? x.priority : '';
    const products = (x.products || []).map(p => filters.productLabel(p)).join(', ') || '—';
    const badges = Render.companyBadges(x);
    const id = Render.escapeHtml(x.id || name);
    const expandBtn = `<button type="button" class="company-table__expand" data-company-expand aria-expanded="false" aria-controls="company-detail-${id}" aria-label="Show details for ${Render.escapeHtml(name)}">${Render.icon('chevronRight', 'icon icon--sm')}</button>`;
    const detail = Render.companyDetailPanel(x);
    if (Render.isProductMode(options)) {
      const main = `<tr class="company-table__row" data-company-id="${id}"><td class="company-table__expand-cell">${expandBtn}</td><td class="company-table__priority">${Render.escapeHtml(priority)}</td><td class="company-table__name"><div class="company-table__name-cell"><strong class="company-table__name-text">${Render.escapeHtml(name)}</strong>${badges}</div></td><td class="company-table__type">${Render.escapeHtml(type)}</td><td class="company-table__india">${Render.escapeHtml(india)}</td><td class="company-table__careers">${Render.companyActionBtn(careers, 'Careers site for ' + name)}</td></tr>`;
      const detailRow = `<tr class="company-table__detail-row" id="company-detail-${id}" hidden><td class="company-table__detail-cell" colspan="6">${detail}</td></tr>`;
      return main + detailRow;
    }
    const careerCell = Render.companyLink(careers, 'Careers');
    const main = `<tr class="company-table__row" data-company-id="${id}"><td class="company-table__expand-cell">${expandBtn}</td><td class="company-table__priority">${Render.escapeHtml(priority)}</td><td><div class="company-table__name-cell"><strong class="company-table__name-text">${Render.escapeHtml(name)}</strong>${badges}</div></td><td>${Render.escapeHtml(type)}</td><td>${Render.escapeHtml(india)}</td><td>${Render.escapeHtml(products)}</td><td>${careerCell}</td><td>${Render.escapeHtml(x.hq || '—')}</td></tr>`;
    const detailRow = `<tr class="company-table__detail-row" id="company-detail-${id}" hidden><td class="company-table__detail-cell" colspan="8">${detail}</td></tr>`;
    return main + detailRow;
  },

  companyCard(x) {
    const filters = Render._companyFilters();
    const name = Render.companyName(x);
    const type = x.companyType || x.type || 'Unknown';
    const india = filters.indiaLabel(x);
    const priority = x.priority != null ? x.priority : '';
    const badges = Render.companyBadges(x);
    const careers = Render.companyCareersLink(x);
    const id = Render.escapeHtml(x.id || name);
    const careersBtn = careers
      ? `<a class="company-card__btn" href="${Render.escapeHtml(careers)}" target="_blank" rel="noopener noreferrer">${Render.icon('external-link')} Careers</a>`
      : '';
    const detailsBtn = `<button type="button" class="company-card__btn company-card__btn--secondary" data-company-expand aria-expanded="false" aria-controls="company-card-detail-${id}">Details</button>`;
    return `<article class="company-card" data-company-id="${id}"><div class="company-card__header"><div class="company-card__title"><span class="company-card__name">${Render.escapeHtml(name)}</span>${badges}</div></div><div class="company-card__meta"><span>Priority ${Render.escapeHtml(priority)}</span><span>${Render.escapeHtml(type)}</span><span>India: ${Render.escapeHtml(india)}</span></div><div class="company-card__actions">${detailsBtn}${careersBtn}</div><div class="company-card__detail" id="company-card-detail-${id}" hidden>${Render.companyDetailPanel(x)}</div></article>`;
  },

  careersSearchTipText() {
    return 'Opens each employer\u2019s careers site. Search for AEM, Adobe Experience Manager, or related stack keywords \u2014 job titles vary.';
  },

  careersTipMarkup(id) {
    const text = Render.careersSearchTipText();
    return `<span class="table-tip"><button type="button" class="table-tip__trigger" data-table-tip aria-controls="${id}" aria-expanded="false" aria-label="How to search on careers sites">${Render.icon('info', 'icon icon--sm')}</button><span id="${id}" role="tooltip" class="table-tip__panel">${Render.escapeHtml(text)}</span></span>`;
  },

  /** aria-sort + a clickable header button for columns with a CompanyFilters.COLUMN_SORTS entry
   *  (Priority, Company, Type, India); other columns (Hiring, Status, Careers, Visa) stay plain. */
  companyTableHead(headers, product, currentSort) {
    const colClass = {
      Priority: 'company-table__th--priority',
      Company: 'company-table__th--name',
      Type: 'company-table__th--type',
      India: 'company-table__th--india',
      Careers: 'company-table__th--careers'
    };
    const filters = Render._companyFilters();
    const expandTh = `<th scope="col" class="company-table__th--expand"><span class="sr-only">Details</span></th>`;
    const cols = headers
      .map(h => {
        const cls = colClass[h] || '';
        if (product && h === 'Careers') {
          return `<th scope="col" class="company-table__th--careers"><div class="company-table__th-careers-inner"><span>${Render.escapeHtml(h)}</span>${Render.careersTipMarkup('careers-col-tip')}</div></th>`;
        }
        const sortPair = filters.COLUMN_SORTS[h];
        if (sortPair) {
          const dir = filters.sortDirectionFor(h, currentSort || '');
          const ariaSort = dir === 'asc' ? 'ascending' : dir === 'desc' ? 'descending' : 'none';
          // Always show a sort affordance: dual chevron when inactive, up/down when active.
          const iconName = dir === 'asc' ? 'chevronUp' : dir === 'desc' ? 'chevronDown' : 'chevronsUpDown';
          const arrowClass = dir ? 'icon icon--sm sort-indicator' : 'icon icon--sm sort-indicator sort-indicator--idle';
          const arrow = Render.icon(iconName, arrowClass);
          return `<th scope="col" class="${cls} company-table__th--sortable" aria-sort="${ariaSort}"><button type="button" class="company-table__sort-btn" data-sort-column="${Render.escapeHtml(h)}" title="Sort by ${Render.escapeHtml(h)}">${Render.escapeHtml(h)}${arrow}</button></th>`;
        }
        return `<th scope="col" class="${cls}">${Render.escapeHtml(h)}</th>`;
      })
      .join('');
    return expandTh + cols;
  },

  companyTableColumns(product) {
    return product
      ? ['Priority', 'Company', 'Type', 'India', 'Careers']
      : ['Priority', 'Company', 'Type', 'India', 'Products', 'Careers', 'HQ'];
  },

  companyDataBody(companies, options) {
    const pageSize = COMPANY_PAGE_SIZE;
    const page = options.page || 1;
    const total = companies.length;
    if (!total) return '<div class="company-empty">No companies match your filters.</div>';
    const totalPages = Math.max(1, Math.ceil(total / pageSize));
    const safePage = Math.min(Math.max(1, page), totalPages);
    const slice = companies.slice((safePage - 1) * pageSize, safePage * pageSize);
    const product = Render.isProductMode(options);
    const headers = Render.companyTableColumns(product);
    const currentSort = options.filterState && options.filterState.sort;
    const head = Render.companyTableHead(headers, product, currentSort);
    const rows = slice.map(c => Render.companyRow(c, options)).join('');
    const colCount = headers.length + 1; // + expand column
    const pad = Math.max(0, pageSize - slice.length);
    const emptyRows = Array(pad)
      .fill('<tr class="company-table__pad"><td colspan="' + colCount + '"></td></tr>')
      .join('');
    const tableClass = product ? 'company-table company-table--product' : 'company-table';
    const table = `<div class="company-table-desktop company-explorer__table-wrap"><table class="${tableClass}"><thead><tr>${head}</tr></thead><tbody>${rows}${emptyRows}</tbody></table></div>`;
    const cardsTip = product ? `<div class="company-cards-tip">${Render.careersTipMarkup('careers-cards-tip')}</div>` : '';
    const cards = `${cardsTip}<div class="company-cards">${slice.map(Render.companyCard).join('')}</div>`;
    return table + cards;
  },

  companyFilterActive(state) {
    return Render._companyFilters().hasActiveFilters(state);
  },

  companyFilterBar(state, total, filtered, industries, options) {
    const productMode = Render.isProductMode(options);
    const filtersApi = Render._companyFilters();
    const types = ['Product', 'GCC', 'Agency', 'Enterprise'];
    const sortOptions = filtersApi.sortOptionsFor(productMode);
    const industryList = industries || [];
    const productList = options.products || filtersApi.productsFrom(options.allCompanies || []);
    // Empty id = cleared state; label is the category placeholder (not listed as an option).
    const typeOptions = [{ id: '', label: 'Type' }].concat(types.map(t => ({ id: t, label: t })));
    const industryOptions = [{ id: '', label: 'Industry' }].concat(industryList.map(ind => ({ id: ind, label: ind })));
    const productOptions = [{ id: '', label: 'Product' }].concat(
      productList.map(code => ({ id: code, label: filtersApi.productLabel(code) }))
    );
    const chip = (key, label, iconName) => {
      const active = state[key] ? ' filter-chip--active' : '';
      const pressed = state[key] ? 'true' : 'false';
      const icon = iconName ? Render.icon(iconName, 'icon icon--sm') : '';
      return `<button type="button" class="filter-chip${active}" data-company-filter="${key}" data-chip="true" aria-pressed="${pressed}">${icon}<span>${Render.escapeHtml(label)}</span></button>`;
    };
    const chk = (key, label) => {
      const on = state[key] ? ' checked' : '';
      return `<label class="inline-flex items-center gap-1 text-sm"><input type="checkbox" data-company-filter="${key}"${on} /> ${Render.escapeHtml(label)}</label>`;
    };
    // Cloud is Product → AEM Cloud Service only (no separate Cloud chip — same filter).
    const quickChips = productMode
      ? `<div class="filter-chips" role="group" aria-label="Quick filters">${chip('hiringIndia', 'India', 'mapPin')}${chip('hiringActive', 'Frequent', 'activity')}${chip('ownerPreferred', 'Preferred', 'star')}</div>`
      : `<div class="flex flex-wrap gap-4">${chk('hiringIndia', 'Hiring India')}${chk('hiringActive', 'Frequent hiring')}${chk('ownerPreferred', 'Preferred')}</div>`;
    const clearBtnHidden = Render.companyFilterActive(state) ? '' : ' hidden';
    const clearBtn = `<button type="button" class="filter-clear-btn${clearBtnHidden}" data-company-clear-filters>${Render.icon('x', 'icon icon--sm')} Clear filters</button>`;
    const searchField = `<div class="company-filters__search">
          <span class="company-filters__field-label">Search</span>
          <div class="company-filters__search-field company-filters__search-field--icon">
            <span class="company-filters__search-icon" aria-hidden="true">${Render.icon('search')}</span>
            <input type="search" data-company-filter="query" value="${Render.escapeHtml(state.query || '')}" placeholder="Search companies…" autocomplete="off" aria-label="Search companies" />
          </div>
        </div>`;
    const sortField = Render.uiSelect('sort', 'Sort', sortOptions, state.sort || 'priority-desc', 'ui-select--sort');
    const typeRailClass = `ui-select--rail${state.companyType ? ' ui-select--rail-active' : ''}`;
    const industryRailClass = `ui-select--rail${state.industry ? ' ui-select--rail-active' : ''}`;
    const productRailClass = `ui-select--rail${state.product ? ' ui-select--rail-active' : ''}`;
    const typeField = Render.uiSelect('companyType', 'Type', typeOptions, state.companyType || '', typeRailClass);
    const industryField = Render.uiSelect('industry', 'Industry', industryOptions, state.industry || '', industryRailClass);
    const productField = Render.uiSelect('product', 'Product', productOptions, state.product || '', productRailClass);
    const advancedCount = [state.companyType, state.industry, state.product].filter(Boolean).length;
    const panelOpen = !!(options && options.filtersPanelOpen);
    const filtersBtn = `<button type="button" class="company-filters__filters-btn${panelOpen ? ' is-open' : ''}${advancedCount ? ' has-active' : ''}" data-company-filters-toggle aria-expanded="${panelOpen ? 'true' : 'false'}" aria-controls="company-filters-panel">${Render.icon('filter', 'icon icon--sm')}<span data-filters-label>Filters</span>${advancedCount ? `<span class="company-filters__filters-count" data-filters-count>${advancedCount}</span>` : '<span class="company-filters__filters-count hidden" data-filters-count></span>'}${Render.icon('chevronDown', 'icon icon--sm company-filters__filters-chevron')}</button>`;
    // Mobile: Filters + chips wrap; panel stacks Type/Industry/Product (no horizontal scroll).
    // Desktop (≥640px): Filters button hidden; dropdowns sit inline before chips.
    return `<div class="company-explorer__toolbar" role="search" aria-label="Filter companies">
      <div class="company-filters company-filters--compact">
        <div class="company-filters__primary">${searchField}<div class="company-filters__sort">${sortField}</div></div>
        <div class="company-filters__advanced" role="group" aria-label="Company filters">
          ${filtersBtn}
          <div id="company-filters-panel" class="company-filters__panel${panelOpen ? ' is-open' : ''}">${typeField}${industryField}${productField}</div>
          ${quickChips}
          ${clearBtn}
        </div>
      </div>
    </div>`;
  },

  companySection(companies, options = {}) {
    const state = options.filterState || {};
    const total = options.totalCount != null ? options.totalCount : companies.length;
    const filtered = companies.length;
    const page = options.page || 1;
    const stats = Render.companyStats(options.allCompanies || companies);
    const metrics = Render.isProductMode(options)
      ? ''
      : `<div class="company-explorer__metrics"><span><strong>${stats.total}</strong> employers</span><span><strong>${stats.india}</strong> India hiring</span><span><strong>${stats.cloud}</strong> AEM Cloud</span></div>`;
    const toolbar = options.showFilters ? Render.companyFilterBar(state, total, filtered, options.industries, options) : '';
    const body = Render.companyDataBody(companies, options);
    const pagination = Render.companyPagination(page, filtered, 'company');
    const countLabel = Render.companyCountLabel(page, filtered, total, COMPANY_PAGE_SIZE);
    const resultsLabel = Render.companyResultsLabel(filtered, total);
    const resultsHead = `<div class="company-explorer__results-head"><div class="company-explorer__results-title"><span class="company-explorer__results-kicker">Results</span><span class="company-explorer__results-count" data-company-results-count aria-live="polite">${Render.escapeHtml(resultsLabel)}</span></div></div>`;
    const footer = `<div class="company-explorer__footer"><p class="company-explorer__page-range" data-company-count aria-live="polite">${countLabel}</p><div class="company-explorer__footer-copy"><button type="button" data-copy-discovery-link class="copy-link-btn">${Render.icon('copy')} Copy link</button><span data-copy-link-status class="copy-toast hidden" aria-live="polite">Copied!</span></div><div data-company-pagination>${pagination}</div></div>`;
    return `<div class="company-explorer">${metrics}${toolbar}${resultsHead}<div class="company-explorer__body">${body}</div>${footer}</div>`;
  },

  companyTable(companies, options = {}) {
    return Render.companyDataBody(companies, options) + Render.companyPagination(options.page || 1, companies.length, 'company');
  },

  glossaryTable(terms, options = {}) {
    return Render.paginatedTable(
      terms,
      { pageSize: LEARNING_PAGE_SIZE, ...options },
      g =>
        `<tr><td class="data-table__col--term font-semibold">${Render.escapeHtml(g.term)}</td><td class="data-table__col--definition">${Render.escapeHtml(g.definition)}</td><td class="data-table__col--related text-muted text-xs">${Render.escapeHtml((g.relatedTerms || []).join(', '))}</td></tr>`,
      ['Term', 'Definition', 'Related'],
      'glossary'
    );
  },

  technologyTable(technologies, options = {}) {
    const sorted = Render.sortByDifficulty(technologies, 'name');
    return Render.paginatedTable(
      sorted,
      { pageSize: LEARNING_PAGE_SIZE, ...options },
      t =>
        `<tr><td class="data-table__col--tech font-semibold">${Render.escapeHtml(t.name)}</td><td class="data-table__col--category">${Render.escapeHtml(t.category)}</td><td class="data-table__col--level">${Render.escapeHtml(t.difficulty)}</td><td class="data-table__col--summary">${Render.escapeHtml(t.summary)}</td></tr>`,
      ['Technology', 'Category', 'Level', 'Summary'],
      'technology'
    );
  },

  careerPaths(paths) {
    return paths
      .map(p => {
        const milestones = (p.milestones || [])
          .map(m => `<li class="mt-2"><strong>${Render.escapeHtml(m.title)}</strong> — ${Render.escapeHtml(m.description)}</li>`)
          .join('');
        return `<article class="border rounded-lg p-4 mb-4"><h3 class="font-bold text-lg">${Render.escapeHtml(p.title)}</h3><p class="text-slate-600 text-sm mt-1">${Render.escapeHtml(p.summary)}</p><ol class="list-decimal ml-6 mt-3">${milestones}</ol></article>`;
      })
      .join('');
  },

  interviewList(items, options = {}) {
    const sorted = Render.sortByDifficulty(items, 'question');
    return Render.paginatedTable(
      sorted,
      { pageSize: LEARNING_PAGE_SIZE, ...options },
      q =>
        `<tr><td class="data-table__col--category">${Render.escapeHtml(q.category)}</td><td class="data-table__col--level">${Render.escapeHtml(q.difficulty)}</td><td class="data-table__col--question font-semibold">${Render.escapeHtml(q.question)}</td><td class="data-table__col--guidance text-secondary text-sm">${Render.escapeHtml(q.guidance)}</td></tr>`,
      ['Category', 'Level', 'Question', 'Guidance'],
      'interview'
    );
  },

  templatesList(templates) {
    return templates
      .map(
        t =>
          `<article class="border rounded-lg p-4 mb-4"><h3 class="font-bold">${Render.escapeHtml(t.title)}</h3><p class="text-xs text-slate-500 uppercase mt-1">${Render.escapeHtml(t.category)}</p><p class="mt-2 text-slate-700 whitespace-pre-wrap">${Render.escapeHtml(t.body)}</p></article>`
      )
      .join('');
  },

  ownerPlaybookNav(sections) {
    const links = sections.map(s => `<a href="#owner-${Render.escapeHtml(s.id)}">${Render.escapeHtml(s.title)}</a>`).join('');
    return `<nav class="owner-playbook-nav" aria-label="Apply sections">${links}</nav>`;
  },

  ownerPlaybook(playbook, options) {
    if (!playbook || !playbook.sections) return '';
    const product = Render.isProductMode(options);
    const nav = product ? Render.ownerPlaybookNav(playbook.sections) : '';
    const articles = playbook.sections
      .map(sec => {
        const badge =
          !product && sec.audience === 'owner'
            ? '<span class="text-xs uppercase text-amber-700 bg-amber-50 border border-amber-200 rounded px-1.5 py-0.5">Owner</span>'
            : '';
        const steps =
          Array.isArray(sec.steps) && sec.steps.length
            ? `<ol class="owner-step-timeline">${sec.steps
                .map((s, i) => `<li data-step="${i + 1}">${Render.escapeHtml(s)}</li>`)
                .join('')}</ol>`
            : '';
        const body = sec.body ? `<p class="mt-3 text-slate-600 text-sm">${Render.escapeHtml(sec.body)}</p>` : '';
        return `<article id="owner-${Render.escapeHtml(sec.id)}" class="owner-section"><div class="flex flex-wrap items-center gap-2"><h3 class="font-bold text-lg">${Render.escapeHtml(sec.title)}</h3>${badge}</div><p class="text-slate-600 text-sm mt-1">${Render.escapeHtml(sec.summary)}</p>${steps}${body}</article>`;
      })
      .join('');
    const productClass = product ? ' owner-playbook--product' : '';
    return `<div class="owner-playbook${productClass}">${nav}<div class="owner-playbook__sections">${articles}</div></div>`;
  },

  resourcesList(resources) {
    return `<ul class="list-disc ml-6 space-y-2">${resources
      .map(
        r =>
          `<li><a class="text-blue-600 underline" href="${Render.escapeHtml(r.url)}" target="_blank" rel="noopener noreferrer">${Render.escapeHtml(r.title)}</a> <span class="text-xs text-slate-500">(${Render.escapeHtml(r.type)})</span></li>`
      )
      .join('')}</ul>`;
  },

  chapter(chapter, index, ctx) {
    const id = chapter.id || 'ch' + index;
    const companies = ctx.companies || [];
    const learning = ctx.learning || {};
    const renderOpts = { productMode: ctx.productMode };
    const productApply = ctx.productMode && chapter.ownerPlaybookEmbed;
    let body = productApply ? '' : chapter.body || '';
    if (chapter.companyTable) {
      body = `<div id="company-table-container">${Render.companySection(companies, {
        page: 1,
        showFilters: true,
        filterState: {},
        totalCount: companies.length,
        allCompanies: companies,
        industries: Render._companyFilters().industriesFrom(companies),
        products: Render._companyFilters().productsFrom(companies),
        productMode: ctx.productMode
      })}</div>`;
    } else if (chapter.ownerPlaybookEmbed && ctx.ownerPlaybook) {
      body += `<div class="owner-playbook-wrap">${Render.ownerPlaybook(ctx.ownerPlaybook, renderOpts)}</div>`;
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
    if (chapter.id === 'learning-roadmap' && ctx.productMode && ctx.roadmaps) {
      body += `<div class="mt-6 space-y-4">${Render.roadmapList(ctx.roadmaps, renderOpts)}</div>`;
    }
    const reading = chapter.reading || chapter.readingTime || '';
    const metaLine = ctx.productMode
      ? ''
      : `<div class="text-xs text-slate-500 mt-1">⏱ ${Render.escapeHtml(reading)} • ${Render.escapeHtml(chapter.tags.join(', '))}</div>`;
    const summaryBlock = ctx.productMode
      ? productApply
        ? `<p class="section-lead">${Render.escapeHtml(chapter.summary)}</p>`
        : `<p class="text-slate-500 mb-4">${Render.escapeHtml(chapter.summary)}</p>`
      : `<p class="text-slate-500 mb-4">${Render.escapeHtml(chapter.summary)}</p><details class="mt-6"><summary class="cursor-pointer font-semibold">📌 Summary</summary><div class="mt-2 text-slate-600">${Render.escapeHtml(chapter.summary)}</div></details>`;
    return `<section id="${Render.escapeHtml(id)}" class="section"><h2>${Render.escapeHtml(chapter.title)}</h2>${metaLine}${summaryBlock}${body}</section>`;
  },

  footer(footer) {
    return `<footer class="site-footer">${Render.escapeHtml(footer.text)}</footer>`;
  },

  resolveProductMode(site) {
    if (!site) return false;
    if (typeof location !== 'undefined') {
      const params = new URLSearchParams(location.search);
      if (params.get('mode') === 'dev') return false;
    }
    return site.mode !== 'dev';
  },

  chaptersForMode(allChapters, site) {
    const nav = site.navigation || {};
    const devOnly = new Set(nav.devOnlyChapterIds || []);
    const product = Render.resolveProductMode(site);
    if (!product) return allChapters.slice();
    const order = nav.productChapterIds || [];
    const byId = new Map(allChapters.map(c => [c.id, c]));
    const ordered = order.map(id => byId.get(id)).filter(Boolean);
    const included = new Set(ordered.map(c => c.id));
    allChapters.forEach(c => {
      if (!devOnly.has(c.id) && !included.has(c.id)) ordered.push(c);
    });
    return ordered;
  }
};

if (typeof window !== 'undefined') {
  window.Render = Render;
}
if (typeof module !== 'undefined' && module.exports) {
  module.exports = Render;
}
