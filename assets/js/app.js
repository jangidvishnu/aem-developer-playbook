/**
 * App — boot sequence and interactive DOM wiring for index.html.
 * Extracted from index.html's inline bootstrap script (Milestone 13 cleanup, see 12_DECISIONS.md)
 * so this logic is a real, reviewable, lintable file instead of living only inside HTML.
 * DOM-dependent (unlike render.js/filters.js/search.js) — not require()'d by scripts/verify-*.js;
 * exercised via scripts/ui-smoke-*.mjs instead.
 */
const App = {
  PAGE_SIZE: null,

  copyDiscoveryLink(statusEl) {
    const url = window.location.href;
    const done = () => {
      if (statusEl) {
        statusEl.textContent = 'Copied!';
        statusEl.classList.remove('hidden');
        setTimeout(() => statusEl.classList.add('hidden'), 2000);
      }
    };
    if (navigator.clipboard?.writeText)
      navigator.clipboard
        .writeText(url)
        .then(done)
        .catch(() => {});
    else {
      const ta = document.createElement('textarea');
      ta.value = url;
      document.body.appendChild(ta);
      ta.select();
      try {
        document.execCommand('copy');
        done();
      } catch (_e) {
        /* clipboard unsupported; ignore */
      }
      document.body.removeChild(ta);
    }
  },

  wireCopyDiscoveryLink(root) {
    if (!root) return;
    root.addEventListener('click', e => {
      const btn = e.target.closest('[data-copy-discovery-link]');
      if (!btn || !root.contains(btn)) return;
      e.preventDefault();
      App.copyDiscoveryLink(root.querySelector('[data-copy-link-status]'));
    });
  },

  readCompanyFilterState(bar, filterState, defaultSort) {
    if (!bar) return filterState;
    const q = bar.querySelector('input[data-company-filter="query"]');
    filterState.query = q ? q.value : '';
    ['sort', 'companyType', 'industry', 'product'].forEach(key => {
      const el = bar.querySelector(`input[type="hidden"][data-company-filter="${key}"]`);
      if (el) filterState[key] = el.value;
    });
    if (!filterState.sort) filterState.sort = defaultSort;
    ['hiringIndia', 'aemCloud', 'hiringActive', 'ownerPreferred'].forEach(key => {
      filterState[key] =
        !!bar.querySelector(`[data-company-filter="${key}"][aria-pressed="true"]`) ||
        !!bar.querySelector(`input[data-company-filter="${key}"]:checked`);
    });
    return filterState;
  },

  syncFiltersPanel(bar, filterState, open) {
    if (!bar) return;
    const panel = bar.querySelector('#company-filters-panel');
    const btn = bar.querySelector('[data-company-filters-toggle]');
    if (!panel || !btn) return;
    const count = [filterState.companyType, filterState.industry, filterState.product].filter(Boolean).length;
    const isOpen = !!open;
    panel.classList.toggle('is-open', isOpen);
    btn.classList.toggle('is-open', isOpen);
    btn.classList.toggle('has-active', count > 0);
    btn.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
    const countEl = btn.querySelector('[data-filters-count]');
    if (countEl) {
      countEl.textContent = count ? String(count) : '';
      countEl.classList.toggle('hidden', !count);
    }
  },

  wireCompanyPagination(allCompanies, industries, products, filterState, onStateChange, productMode) {
    const container = document.getElementById('company-table-container');
    if (!container) return null;
    let page = 1;
    let filtersPanelOpen = !!(filterState.companyType || filterState.industry || filterState.product);
    const defaultSort = 'priority-desc';
    const debouncedRenderTable = UI.debounce(() => renderTable(), 200);

    function wirePagination() {
      container.querySelectorAll('[data-company-prev]').forEach(btn => {
        btn.onclick = () => {
          page = Math.max(1, page - 1);
          renderTable();
        };
      });
      container.querySelectorAll('[data-company-next]').forEach(btn => {
        btn.onclick = () => {
          const filtered = CompanyFilters.apply(allCompanies, filterState);
          const totalPages = Math.max(1, Math.ceil(filtered.length / App.PAGE_SIZE));
          page = Math.min(totalPages, page + 1);
          renderTable();
        };
      });
    }

    /** Click-to-sort table column headers (Milestone 13) — reuses the existing sort ids/logic
     *  already offered by the Sort dropdown, via CompanyFilters.COLUMN_SORTS/nextSortFor.
     *  Uses a full toolbar re-render (not renderTable()) so the Sort dropdown's own displayed
     *  value stays in sync with the column that was just clicked — renderTable() re-reads sort
     *  from the toolbar DOM first, which would otherwise stomp on the value set here. */
    function wireSortHeaders() {
      container.querySelectorAll('[data-sort-column]').forEach(btn => {
        btn.onclick = () => {
          const column = btn.getAttribute('data-sort-column');
          filterState.sort = CompanyFilters.nextSortFor(column, filterState.sort || defaultSort);
          page = 1;
          renderCompanySection();
        };
      });
    }

    function renderCompanySection() {
      if (!filterState.sort) filterState.sort = defaultSort;
      if (filterState.companyType || filterState.industry || filterState.product) filtersPanelOpen = true;
      const filtered = CompanyFilters.apply(allCompanies, filterState);
      const totalPages = Math.max(1, Math.ceil(filtered.length / App.PAGE_SIZE));
      if (page > totalPages) page = 1;
      container.innerHTML = Render.companySection(filtered, {
        page,
        showFilters: true,
        filterState,
        totalCount: allCompanies.length,
        industries,
        products,
        productMode,
        allCompanies,
        filtersPanelOpen
      });
      UI.wireSelects(container);
      UI.wireTableTips(container);
      UI.wireCompanyExpand(container);
      wirePagination();
      wireSortHeaders();
      App.wireCopyDiscoveryLink(container);
      const bar = container.querySelector('.company-explorer__toolbar');
      if (bar) {
        App.syncFiltersPanel(bar, filterState, filtersPanelOpen);
        wireToolbar(bar);
      }
      if (onStateChange) onStateChange();
    }

    function renderTable() {
      const bar = container.querySelector('.company-explorer__toolbar');
      App.readCompanyFilterState(bar, filterState, defaultSort);
      const filtered = CompanyFilters.apply(allCompanies, filterState);
      const totalPages = Math.max(1, Math.ceil(filtered.length / App.PAGE_SIZE));
      if (page > totalPages) page = 1;
      const wrap = container.querySelector('.company-explorer__body');
      const opts = { page, productMode, allCompanies, filterState };
      if (wrap) wrap.innerHTML = Render.companyDataBody(filtered, opts);
      else {
        renderCompanySection();
        return;
      }
      const countEl = container.querySelector('[data-company-count]');
      if (countEl) countEl.textContent = Render.companyCountLabel(page, filtered.length, allCompanies.length, App.PAGE_SIZE);
      const resultsCountEl = container.querySelector('[data-company-results-count]');
      if (resultsCountEl) {
        resultsCountEl.textContent = Render.companyResultsLabel(filtered.length, allCompanies.length);
      }
      const pagEl = container.querySelector('[data-company-pagination]');
      if (pagEl) pagEl.innerHTML = Render.companyPagination(page, filtered.length, 'company');
      const clearBtn = container.querySelector('[data-company-clear-filters]');
      const showClear = CompanyFilters.hasActiveFilters(filterState);
      if (clearBtn) clearBtn.classList.toggle('hidden', !showClear);
      if (filterState.companyType || filterState.industry || filterState.product) filtersPanelOpen = true;
      App.syncFiltersPanel(bar, filterState, filtersPanelOpen);
      UI.wireSelects(container);
      UI.wireTableTips(container);
      UI.wireCompanyExpand(container);
      wirePagination();
      wireSortHeaders();
      App.wireCopyDiscoveryLink(container);
      if (onStateChange) onStateChange();
    }

    function wireToolbar(bar) {
      App.wireCopyDiscoveryLink(bar);
      bar.addEventListener('click', e => {
        const clear = e.target.closest('[data-company-clear-filters]');
        if (clear && bar.contains(clear)) {
          e.preventDefault();
          Object.assign(filterState, CompanyFilters.resetFilters(defaultSort));
          filtersPanelOpen = false;
          page = 1;
          renderCompanySection();
          return;
        }
        const filtersToggle = e.target.closest('[data-company-filters-toggle]');
        if (filtersToggle && bar.contains(filtersToggle)) {
          e.preventDefault();
          filtersPanelOpen = !filtersPanelOpen;
          App.syncFiltersPanel(bar, filterState, filtersPanelOpen);
          return;
        }
        const chip = e.target.closest('[data-company-filter][data-chip]');
        if (!chip || !bar.contains(chip)) return;
        e.preventDefault();
        const key = chip.getAttribute('data-company-filter');
        const next = chip.getAttribute('aria-pressed') !== 'true';
        chip.setAttribute('aria-pressed', next ? 'true' : 'false');
        chip.classList.toggle('filter-chip--active', next);
        filterState[key] = next;
        page = 1;
        renderTable();
      });
      bar.addEventListener('input', e => {
        if (!e.target.matches('[data-company-filter]')) return;
        page = 1;
        debouncedRenderTable();
      });
      bar.addEventListener('change', e => {
        if (!e.target.matches('[data-company-filter]')) return;
        page = 1;
        renderTable();
      });
    }

    page = 1;
    if (!filterState.sort) filterState.sort = defaultSort;
    renderCompanySection();

    function setQuery(query) {
      filterState.query = String(query || '').trim();
      page = 1;
      renderCompanySection();
      return true;
    }

    App.companyExplorer = { setQuery };
    return { setQuery };
  },

  wirePaginatedContainer(containerId, renderFn, data, pageAttr, options) {
    const container = document.getElementById(containerId);
    if (!container) return null;
    let page = 1;
    let lockedWrapH = 0;
    const pageSize = UI.LEARNING_PAGE_SIZE;
    const attr = pageAttr || containerId.replace('-table-container', '');
    const getOrderedItems = (options && options.getOrderedItems) || (() => data);
    function wirePages() {
      container.querySelectorAll(`[data-${attr}-prev]`).forEach(btn => {
        btn.onclick = () => {
          page = Math.max(1, page - 1);
          render();
        };
      });
      container.querySelectorAll(`[data-${attr}-next]`).forEach(btn => {
        btn.onclick = () => {
          const items = getOrderedItems();
          page = Math.min(Math.max(1, Math.ceil(items.length / pageSize)), page + 1);
          render();
        };
      });
    }
    function lockTableHeight() {
      const wrap = container.querySelector('.data-table-wrap');
      if (!wrap) return;
      wrap.style.minHeight = '';
      const h = wrap.offsetHeight;
      if (h > lockedWrapH) lockedWrapH = h;
      if (lockedWrapH) wrap.style.minHeight = `${lockedWrapH}px`;
    }
    function flashRow(id) {
      const row = container.querySelector(`[data-item-id="${CSS.escape(String(id))}"]`);
      if (!row) return;
      row.classList.add('data-table__row--flash');
      setTimeout(() => row.classList.remove('data-table__row--flash'), 2000);
    }
    function goToItem(id) {
      const items = getOrderedItems();
      const idx = items.findIndex(x => x && x.id === id);
      if (idx < 0) return false;
      page = Math.floor(idx / pageSize) + 1;
      render();
      requestAnimationFrame(() => flashRow(id));
      return true;
    }
    function render() {
      container.innerHTML = renderFn(data, { page, pageSize });
      lockTableHeight();
      wirePages();
    }
    if (!App.learningTables) App.learningTables = Object.create(null);
    App.learningTables[attr] = { goToItem };
    render();
    return { goToItem };
  },

  /** Boot sequence: fetch data/*.json in parallel, render the shell, wire up interactivity. */
  boot() {
    App.PAGE_SIZE = UI.COMPANY_PAGE_SIZE;
    const main = document.getElementById('main');
    const toc = document.getElementById('toc');
    const loadingId = 'data-loading';
    // Milestone 14 (DR-022): index.html ships with #main already full of prerendered, real content
    // baked by scripts/prerender.js. Blanking it out to a small loader card and then swapping in the
    // full render again a moment later causes a large, avoidable Cumulative Layout Shift (the page
    // shrinks then grows back). Only show the loader when there's no prerendered markup to preserve —
    // e.g. a local dev copy of index.html that hasn't been prerendered yet.
    const hasPrerenderedContent = main.children.length > 0;
    if (!hasPrerenderedContent) {
      main.innerHTML = `<div id="${loadingId}" class="page-loader" role="status" aria-live="polite" aria-busy="true">
        <div class="page-loader__card">
          <p class="page-loader__title">AEM Playbook</p>
          <div class="page-loader__track" aria-hidden="true"><div class="page-loader__bar"></div></div>
          <p class="page-loader__text">Loading playbook…</p>
        </div>
      </div>`;
    }

    document.getElementById('navToggle').innerHTML = Icons.svg('menu');
    document.getElementById('command-trigger').insertAdjacentHTML('afterbegin', Icons.svg('search'));
    // Platform class so the header search shortcut shows ⌘K vs Ctrl K without layout shift.
    const isMac = /Mac|iPhone|iPad|iPod/i.test(navigator.platform || '') || /Mac OS X/.test(navigator.userAgent || '');
    document.body.classList.add(isMac ? 'search-platform-mac' : 'search-platform-nonmac');

    Promise.all([
      fetch('data/chapters.json').then(r => r.json()),
      fetch('data/companies.json').then(r => r.json()),
      fetch('data/site.json').then(r => r.json()),
      fetch('data/roadmaps.json').then(r => r.json()),
      fetch('data/glossary.json').then(r => r.json()),
      fetch('data/technologies.json').then(r => r.json()),
      fetch('data/career_paths.json').then(r => r.json()),
      fetch('data/interviews.json').then(r => r.json()),
      fetch('data/templates.json').then(r => r.json()),
      fetch('data/resources.json').then(r => r.json()),
      fetch('data/owner_playbook.json').then(r => r.json())
    ])
      .then(
        ([
          allChapters,
          companies,
          site,
          roadmaps,
          glossary,
          technologies,
          careerPaths,
          interviews,
          templates,
          resources,
          ownerPlaybook
        ]) => {
          const productMode = Render.resolveProductMode(site);
          const chapters = Render.chaptersForMode(allChapters, site);
          const learning = { glossary, technologies, careerPaths, interviews, templates, resources };
          const renderOpts = { productMode };
          const ctx = { companies, learning, ownerPlaybook, productMode, roadmaps };
          const stats = Render.companyStats(companies);

          Render.applyHeadMeta(site);
          document.getElementById('page-header').innerHTML = Render.pageHeader(site.header, renderOpts);
          const disclaimerEl = document.getElementById('site-disclaimer');
          if (disclaimerEl) disclaimerEl.innerHTML = Render.disclaimer(site.disclaimer, site.header);

          if (site.header.githubUrl) {
            const tools = document.querySelector('.doc-header__tools');
            let gh = document.getElementById('github-link');
            if (!gh && tools) {
              tools.insertAdjacentHTML('beforeend', Render.headerGithubLink(site.header));
              gh = document.getElementById('github-link');
            } else if (gh) {
              gh.href = site.header.githubUrl;
            }
          }

          document.getElementById('search-wrap--header').innerHTML = Render.search(site.search, 'search-wrap-header-inner', '-mobile');
          document.getElementById('search-desktop-wrap').innerHTML = Render.search(site.search, 'search-wrap', '-desktop');

          document.getElementById('sidebar-contents-label').textContent = site.sidebar.contentsLabel;
          const dashboardEl = document.getElementById('dashboard');
          if (productMode) {
            dashboardEl.innerHTML = '';
            dashboardEl.hidden = true;
          } else {
            dashboardEl.hidden = false;
            dashboardEl.innerHTML = Render.dashboard(site.dashboard);
          }

          const groups = site.navigation?.groups;
          toc.innerHTML = groups ? Render.sidebarGrouped(chapters, groups) : Render.sidebar(chapters);

          const chaptersHtml = chapters.map((c, i) => Render.chapter(c, i, ctx)).join('');
          const roadmapsHtml = productMode ? '' : Render.roadmapList(roadmaps, renderOpts);
          main.innerHTML = Render.hero(site.hero, renderOpts, stats) + roadmapsHtml + chaptersHtml;
          document.getElementById('site-footer').innerHTML = Render.footer(site.footer);

          const searchIndex = Search.buildIndex({ chapters, companies, roadmaps, site, learning, ownerPlaybook });
          const industries = CompanyFilters.industriesFrom(companies);
          const products = CompanyFilters.productsFrom(companies);
          const companiesById = CompanyFilters.companiesById(companies);
          const urlParsed = CompanyFilters.parseUrlState(location.search);
          // Single shared state object for both company-table filters and search facets (Milestone 13
          // cleanup) — previously two separately-allocated objects manually kept in sync field-by-field.
          const filterState = urlParsed.state;
          filterState.sourceFilter = '';
          // Do not force product-mode sort to 'hiring-desc' here. That id is normalized to
          // 'priority-desc' by CompanyFilters.normalizeSort / parseUrlState, while serializeUrlState
          // still treats only 'priority-desc' as the omit-from-URL default — so every alternate
          // reload wrote then erased ?cf_sort=hiring-desc. Default sort is already priority-desc.

          const refreshSearch = UI.wireSiteSearch({
            searchIndex,
            companiesById,
            searchFacetState: filterState,
            filterState,
            wrapIds: ['search-wrap', 'search-wrap-header-inner'],
            initialQuery: urlParsed.searchQuery,
            onCopyLink: App.wireCopyDiscoveryLink,
            onUrlSync: q => {
              history.replaceState(null, '', location.pathname + CompanyFilters.serializeUrlState(filterState, q || '') + location.hash);
            }
          });

          App.wireCompanyPagination(
            companies,
            industries,
            products,
            filterState,
            () => {
              const q = document.getElementById('search-mobile')?.value || document.getElementById('search-desktop')?.value || '';
              history.replaceState(null, '', location.pathname + CompanyFilters.serializeUrlState(filterState, q) + location.hash);
              if (refreshSearch) refreshSearch();
            },
            productMode
          );

          App.wirePaginatedContainer('glossary-table-container', Render.glossaryTable, glossary, 'glossary');
          App.wirePaginatedContainer(
            'technology-table-container',
            (data, opts) => Render.technologyTable(data, { ...opts, resources }),
            technologies,
            'technology',
            { getOrderedItems: () => Render.sortByDifficulty(technologies, 'name') }
          );
          App.wirePaginatedContainer('interview-table-container', Render.interviewList, interviews, 'interview', {
            getOrderedItems: () => Render.sortByDifficulty(interviews, 'question')
          });

          UI.initTheme('themeToggle');
          UI.wireNavDrawer();
          UI.wireNavGroups();
          UI.wireInPageAnchors();
          UI.wireOwnerPlaybookNav();
          UI.wireScrollSpy();
          UI.wireCommandPalette({ searchIndex, companiesById, searchFacetState: filterState });
        }
      )
      .catch(err => {
        // If prerendered content is already on the page, there's no loader element to replace —
        // leave the baked static content visible (readable, if non-interactive) instead of
        // destroying it in favor of an error card.
        const el = document.getElementById(loadingId);
        if (el) {
          el.setAttribute('role', 'alert');
          el.removeAttribute('aria-busy');
          el.removeAttribute('aria-live');
          el.classList.add('page-loader--error');
          el.innerHTML = `<div class="page-loader__card"><p class="page-loader__title">Could not load</p><p class="page-loader__text">Failed to load content. Serve over HTTP — see .playbook/17_TESTING_GUIDE.md.</p></div>`;
        }
        console.error(err);
        UI.initTheme('themeToggle');
      });
  }
};

if (typeof window !== 'undefined') {
  window.App = App;
}
if (typeof module !== 'undefined' && module.exports) {
  module.exports = App;
}
