/**
 * UI behaviors — theme, scroll-spy, custom selects, command palette (M11 polish).
 */
const UI = {
  COMPANY_PAGE_SIZE: 10,
  LEARNING_PAGE_SIZE: 10,

  /** Delays `fn` until `wait`ms after the last call (Milestone 13 — avoids a full filter+sort+
   *  re-render on every keystroke once the company dataset grows). Only for free-text typing;
   *  clicks/changes on chips, selects, and checkboxes stay immediate. */
  debounce(fn, wait) {
    let timer;
    return (...args) => {
      clearTimeout(timer);
      timer = setTimeout(() => fn(...args), wait != null ? wait : 200);
    };
  },

  initTheme(toggleId) {
    const root = document.documentElement;
    const btn = document.getElementById(toggleId || 'themeToggle');
    function apply(theme) {
      root.setAttribute('data-theme', theme);
      localStorage.theme = theme;
      if (btn) {
        btn.innerHTML = typeof Icons !== 'undefined' ? Icons.svg(theme === 'dark' ? 'sun' : 'moon', 'icon') : theme === 'dark' ? '☀' : '☾';
        btn.setAttribute('aria-label', theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode');
      }
    }
    const saved = localStorage.theme;
    const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    apply(saved || (prefersDark ? 'dark' : 'light'));
    if (btn) {
      btn.onclick = () => apply(root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark');
    }
  },

  wireScrollSpy() {
    const links = document.querySelectorAll('.doc-nav__link[data-nav-id]');
    if (!links.length) return;
    const sections = [...links].map(a => document.getElementById(a.getAttribute('data-nav-id'))).filter(Boolean);
    if (!sections.length) return;
    const obs = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          if (!entry.isIntersecting) return;
          const id = entry.target.id;
          links.forEach(a => {
            const on = a.getAttribute('data-nav-id') === id;
            a.classList.toggle('doc-nav__link--active', on);
            if (on) a.setAttribute('aria-current', 'true');
            else a.removeAttribute('aria-current');
          });
        });
      },
      { rootMargin: '-20% 0px -60% 0px', threshold: 0 }
    );
    sections.forEach(s => obs.observe(s));
  },

  wireTableTips(root) {
    function closeAll(except) {
      (root || document).querySelectorAll('[data-table-tip]').forEach(btn => {
        if (btn === except) return;
        btn.setAttribute('aria-expanded', 'false');
        btn.closest('.table-tip')?.classList.remove('table-tip--open');
      });
    }

    (root || document).querySelectorAll('[data-table-tip]').forEach(btn => {
      if (btn.dataset.tipWired) return;
      btn.dataset.tipWired = '1';
      btn.addEventListener('click', e => {
        e.stopPropagation();
        const wrap = btn.closest('.table-tip');
        const open = btn.getAttribute('aria-expanded') === 'true';
        closeAll(open ? null : btn);
        btn.setAttribute('aria-expanded', open ? 'false' : 'true');
        wrap?.classList.toggle('table-tip--open', !open);
      });
    });

    if (!UI._tableTipsDocWired) {
      UI._tableTipsDocWired = true;
      document.addEventListener('click', () => closeAll());
    }
  },

  wireSelects(root) {
    function closeAllExcept(current) {
      document.querySelectorAll('[data-ui-select]').forEach(w => {
        if (w === current) return;
        const list = w.querySelector('.ui-select__list');
        const trigger = w.querySelector('.ui-select__trigger');
        if (list) list.classList.add('hidden');
        if (trigger) trigger.setAttribute('aria-expanded', 'false');
      });
    }

    (root || document).querySelectorAll('[data-ui-select]').forEach(wrap => {
      if (wrap.dataset.uiWired) return;
      wrap.dataset.uiWired = '1';
      const trigger = wrap.querySelector('.ui-select__trigger');
      const list = wrap.querySelector('.ui-select__list');
      const hidden = wrap.querySelector('input[type="hidden"]');
      const valueEl = wrap.querySelector('.ui-select__value');
      if (!trigger || !list || !hidden) return;

      function close() {
        list.classList.add('hidden');
        trigger.setAttribute('aria-expanded', 'false');
      }
      function open() {
        closeAllExcept(wrap);
        list.classList.remove('hidden');
        trigger.setAttribute('aria-expanded', 'true');
      }
      function setValue(val, label) {
        hidden.value = val;
        if (valueEl) valueEl.textContent = label;
        list.querySelectorAll('[role="option"]').forEach(opt => {
          const on = opt.getAttribute('data-value') === val;
          opt.setAttribute('aria-selected', on ? 'true' : 'false');
          opt.classList.toggle('ui-select__option--active', on);
        });
        hidden.dispatchEvent(new Event('change', { bubbles: true }));
      }

      trigger.addEventListener('click', e => {
        e.stopPropagation();
        if (list.classList.contains('hidden')) open();
        else close();
      });
      list.querySelectorAll('[role="option"]').forEach(opt => {
        opt.addEventListener('click', e => {
          e.stopPropagation();
          setValue(opt.getAttribute('data-value'), opt.textContent.trim());
          close();
        });
      });
      document.addEventListener('click', e => {
        if (!wrap.contains(e.target)) close();
      });
      trigger.addEventListener('keydown', e => {
        if (e.key === 'Escape') close();
      });
    });
  },

  wireSiteSearch(config) {
    const { searchIndex, companiesById, searchFacetState, filterState, wrapIds, onUrlSync, onCopyLink, initialQuery } = config;
    const wraps = (wrapIds || []).map(id => document.getElementById(id)).filter(Boolean);
    if (!wraps.length) return;

    const inputs = [];
    let results = [];
    let rawCount = 0;
    let widened = false;
    let activeIndex = -1;
    let panelOpen = false;
    let activeWrap = null;

    function getParts(wrap) {
      return {
        wrap,
        input: wrap.querySelector('input[type="search"]') || wrap.querySelector('input'),
        clearBtn: wrap.querySelector('.search-clear'),
        searchPanel: wrap.querySelector('.search-panel'),
        facetsEl: wrap.querySelector('.search-facets'),
        panel: wrap.querySelector('.search-results'),
        status: wrap.querySelector('[aria-live="polite"]')
      };
    }

    const partsList = wraps.map(getParts).filter(p => p.input && p.searchPanel && p.panel);

    function syncUrl() {
      if (!onUrlSync) return;
      const q = partsList.find(p => p.input.value.trim())?.input.value || partsList[0]?.input.value || '';
      onUrlSync(q);
    }

    function setPanelOpen(open) {
      panelOpen = open;
      partsList.forEach(p => {
        p.searchPanel.classList.toggle('is-open', open);
        p.searchPanel.classList.toggle('hidden', !open);
        p.input.setAttribute('aria-expanded', open ? 'true' : 'false');
      });
    }

    function renderFacets(p) {
      if (!p.facetsEl) return;
      p.facetsEl.innerHTML = Render.searchFacets(searchFacetState);
      p.facetsEl.querySelectorAll('[data-search-facet]').forEach(btn => {
        btn.onclick = e => {
          e.stopPropagation();
          const key = btn.getAttribute('data-search-facet');
          const val = btn.getAttribute('data-value') || '';
          searchFacetState[key] = val;
          filterState[key] = val;
          syncUrl();
          runQuery();
        };
      });
      if (onCopyLink) onCopyLink(p.facetsEl);
    }

    function renderPanel() {
      const labels = { company: 'Companies', owner: 'Apply', chapter: 'Chapters', learning: 'Learning' };
      const meta = {
        rawCount,
        sourceFilter: searchFacetState.sourceFilter || '',
        widened,
        categoryLabel: labels[searchFacetState.sourceFilter] || ''
      };
      const html = Render.searchResults(results, activeQuery(), activeIndex, meta);

      partsList.forEach(p => {
        renderFacets(p);
        p.panel.innerHTML = html;
        p.panel.querySelectorAll('.search-reset-facet').forEach(btn => {
          btn.onclick = e => {
            e.stopPropagation();
            searchFacetState.sourceFilter = '';
            filterState.sourceFilter = '';
            syncUrl();
            runQuery();
          };
        });
        if (p.clearBtn) p.clearBtn.classList.toggle('hidden', !activeQuery());
        if (p.status) {
          p.status.textContent = !activeQuery()
            ? ''
            : !results.length
              ? Render.searchEmptyMessage(activeQuery(), meta)
              : results.length + ' result(s)';
        }
        p.panel.querySelectorAll('[role="option"]').forEach((btn, i) => {
          btn.onclick = () => activateResult(i);
        });
      });

      if (panelOpen && activeQuery()) setPanelOpen(true);
      else if (!activeQuery()) setPanelOpen(false);
    }

    function activeQuery() {
      return (activeWrap && activeWrap.input.value.trim()) || partsList.find(p => p.input.value.trim())?.input.value.trim() || '';
    }

    function activateResult(i) {
      if (i < 0 || i >= results.length) return;
      const el = document.querySelector(results[i].anchor);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'start' });
        el.classList.add('section-flash');
        setTimeout(() => el.classList.remove('section-flash'), 2000);
      }
      setPanelOpen(false);
      partsList.forEach(p => p.input.blur());
    }

    function runQuery(fromWrap) {
      if (fromWrap) activeWrap = fromWrap;
      const q = activeQuery();
      if (!q) {
        results = [];
        rawCount = 0;
        widened = false;
        activeIndex = -1;
        setPanelOpen(false);
        renderPanel();
        syncUrl();
        return;
      }
      const out = CompanyFilters.querySearch(searchIndex, q, companiesById, searchFacetState);
      rawCount = out.raw.length;
      results = out.results;
      widened = out.widened;
      if (widened) {
        searchFacetState.sourceFilter = '';
        filterState.sourceFilter = '';
      }
      activeIndex = results.length ? 0 : -1;
      setPanelOpen(true);
      renderPanel();
      syncUrl();
    }

    partsList.forEach(p => {
      inputs.push(p.input);
      if (p.clearBtn) {
        p.clearBtn.addEventListener('click', e => {
          e.stopPropagation();
          p.input.value = '';
          activeWrap = p;
          runQuery(p);
          p.input.focus();
        });
      }
      const debouncedRunQuery = UI.debounce(() => runQuery(p), 200);
      p.input.addEventListener('input', debouncedRunQuery);
      p.input.addEventListener('focus', () => {
        activeWrap = p;
        if (p.input.value.trim()) {
          panelOpen = true;
          renderPanel();
        }
      });
      p.input.addEventListener('keydown', e => {
        activeWrap = p;
        if (e.key === 'Escape') {
          if (p.input.value.trim()) {
            p.input.value = '';
            runQuery(p);
          } else setPanelOpen(false);
          return;
        }
        if (!results.length || !panelOpen) return;
        if (e.key === 'ArrowDown') {
          e.preventDefault();
          activeIndex = Math.min(activeIndex + 1, results.length - 1);
          renderPanel();
        } else if (e.key === 'ArrowUp') {
          e.preventDefault();
          activeIndex = Math.max(activeIndex - 1, 0);
          renderPanel();
        } else if (e.key === 'Enter' && activeIndex >= 0) {
          e.preventDefault();
          activateResult(activeIndex);
        }
      });
    });

    document.addEventListener('click', e => {
      if (partsList.some(p => p.wrap.contains(e.target))) return;
      setPanelOpen(false);
    });

    if (initialQuery) {
      partsList[0].input.value = initialQuery;
      activeWrap = partsList[0];
      runQuery(partsList[0]);
    }

    return () => runQuery(activeWrap || partsList[0]);
  },

  wireCommandPalette(config) {
    const modal = document.getElementById('command-palette');
    const input = document.getElementById('command-input');
    const results = document.getElementById('command-results');
    const trigger = document.getElementById('command-trigger');
    if (!modal || !input || !results) return;

    const esc = typeof Render !== 'undefined' ? Render.escapeHtml.bind(Render) : s => String(s);
    let activeIndex = -1;
    let items = [];
    let lastRawCount = 0;

    function close() {
      modal.classList.add('hidden');
      modal.setAttribute('aria-hidden', 'true');
      input.value = '';
      items = [];
      results.innerHTML = '';
      activeIndex = -1;
    }
    function open() {
      modal.classList.remove('hidden');
      modal.setAttribute('aria-hidden', 'false');
      input.focus();
    }
    function renderList() {
      results.innerHTML = items.length
        ? items
            .map((r, i) => {
              const active = i === activeIndex ? ' command-result--active' : '';
              return `<button type="button" class="command-result${active}" data-idx="${i}" role="option" aria-selected="${i === activeIndex}"><span class="command-result__type">${esc(r.type)}</span><span class="command-result__title">${esc(r.title)}</span><span class="command-result__snippet">${esc(r.snippet)}</span></button>`;
            })
            .join('')
        : (() => {
            const q = input.value.trim();
            if (!q) return '<p class="command-empty">Type to search…</p>';
            const sf = (config.searchFacetState || config.filterState || {}).sourceFilter || '';
            const hint =
              lastRawCount > 0 && sf && !items.length
                ? 'No results in this category — press Escape and select All in search'
                : 'No results';
            return `<p class="command-empty">${esc(hint)}</p>`;
          })();
      results.querySelectorAll('.command-result').forEach(btn => {
        btn.onclick = () => activate(parseInt(btn.getAttribute('data-idx'), 10));
      });
    }
    function activate(i) {
      if (i < 0 || i >= items.length) return;
      const r = items[i];
      const el = document.querySelector(r.anchor);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'start' });
        el.classList.add('section-flash');
        setTimeout(() => el.classList.remove('section-flash'), 2000);
      }
      close();
    }
    function run() {
      const q = input.value.trim();
      if (!q) {
        items = [];
        lastRawCount = 0;
        renderList();
        return;
      }
      const raw = Search.query(config.searchIndex, q);
      lastRawCount = raw.length;
      const out = CompanyFilters.querySearch(config.searchIndex, q, config.companiesById, config.searchFacetState || config.filterState);
      if (out.widened && config.searchFacetState) config.searchFacetState.sourceFilter = '';
      items = out.results.slice(0, 12).map(r => ({
        anchor: r.anchor,
        title: r.title,
        snippet: r.snippet,
        type: (r.source || '').toUpperCase()
      }));
      activeIndex = items.length ? 0 : -1;
      renderList();
    }

    if (trigger) trigger.addEventListener('click', open);
    input.addEventListener('input', run);
    input.addEventListener('keydown', e => {
      if (e.key === 'Escape') {
        close();
        return;
      }
      if (!items.length) return;
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        activeIndex = Math.min(activeIndex + 1, items.length - 1);
        renderList();
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        activeIndex = Math.max(activeIndex - 1, 0);
        renderList();
      } else if (e.key === 'Enter' && activeIndex >= 0) {
        e.preventDefault();
        activate(activeIndex);
      }
    });
    modal.querySelector('[data-command-close]')?.addEventListener('click', close);
    modal.addEventListener('click', e => {
      if (e.target === modal) close();
    });

    document.addEventListener('keydown', e => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        open();
      }
    });
  },

  wireNavDrawer(toggleId, sidebarId, backdropId) {
    const toggle = document.getElementById(toggleId || 'navToggle');
    const sidebar = document.getElementById(sidebarId || 'site-sidebar');
    const backdrop = document.getElementById(backdropId || 'navBackdrop');
    if (!toggle || !sidebar) return;
    function setOpen(open) {
      sidebar.classList.toggle('is-open', open);
      if (backdrop) {
        backdrop.classList.toggle('is-open', open);
        backdrop.hidden = !open;
      }
      toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
    }
    toggle.addEventListener('click', () => setOpen(!sidebar.classList.contains('is-open')));
    backdrop?.addEventListener('click', () => setOpen(false));
    sidebar.addEventListener('click', e => {
      if (e.target.closest('a[href^="#"]')) setOpen(false);
    });
    document.addEventListener('keydown', e => {
      if (e.key === 'Escape' && sidebar.classList.contains('is-open')) setOpen(false);
    });
  },

  wireNavGroups() {
    document.querySelectorAll('[data-nav-group]').forEach(details => {
      const id = details.getAttribute('data-nav-group');
      const key = 'nav-group-' + id;
      if (localStorage.getItem(key) === 'closed') details.open = false;
      details.addEventListener('toggle', () => {
        localStorage.setItem(key, details.open ? 'open' : 'closed');
      });
    });
  },

  wireInPageAnchors() {
    function headerOffset() {
      const header = document.querySelector('.doc-header');
      return (header ? header.getBoundingClientRect().height : 56) + 8;
    }

    function scrollToTarget(el, hash) {
      const y = el.getBoundingClientRect().top + window.scrollY - headerOffset();
      window.scrollTo({ top: Math.max(0, y), behavior: 'smooth' });
      if (hash) history.replaceState(null, '', hash);
    }

    document.querySelectorAll('a.doc-wordmark[href^="#"], .doc-hero a.hero-cta[href^="#"], a.doc-nav__link[href^="#"]').forEach(a => {
      a.addEventListener('click', e => {
        const href = a.getAttribute('href');
        if (!href || href === '#') return;
        const el = document.querySelector(href);
        if (!el) return;
        e.preventDefault();
        scrollToTarget(el, href);
      });
    });

    if (location.hash) {
      const el = document.querySelector(location.hash);
      if (el) requestAnimationFrame(() => scrollToTarget(el, null));
    }
  },

  wireOwnerPlaybookNav() {
    const nav = document.querySelector('.owner-playbook-nav');
    if (!nav) return;

    const links = [...nav.querySelectorAll('a[href^="#owner-"]')];
    const sections = links.map(a => document.getElementById((a.getAttribute('href') || '').slice(1))).filter(Boolean);
    if (!sections.length) return;

    function scrollOffset() {
      const header = document.querySelector('.doc-header');
      const headerH = header ? header.getBoundingClientRect().height : 56;
      return headerH + nav.getBoundingClientRect().height + 8;
    }

    links.forEach(a => {
      a.addEventListener('click', e => {
        const id = (a.getAttribute('href') || '').slice(1);
        const el = document.getElementById(id);
        if (!el) return;
        e.preventDefault();
        const y = el.getBoundingClientRect().top + window.scrollY - scrollOffset();
        window.scrollTo({ top: Math.max(0, y), behavior: 'smooth' });
        history.replaceState(null, '', '#' + id);
      });
    });

    function bindObserver() {
      if (bindObserver._obs) bindObserver._obs.disconnect();
      bindObserver._obs = new IntersectionObserver(
        entries => {
          entries.forEach(entry => {
            if (!entry.isIntersecting) return;
            const id = entry.target.id;
            links.forEach(a => {
              const on = (a.getAttribute('href') || '') === '#' + id;
              a.classList.toggle('is-active', on);
              if (on) a.setAttribute('aria-current', 'true');
              else a.removeAttribute('aria-current');
            });
          });
        },
        { rootMargin: `-${scrollOffset()}px 0px -55% 0px`, threshold: 0 }
      );
      sections.forEach(s => bindObserver._obs.observe(s));
    }

    bindObserver();
    window.addEventListener('resize', bindObserver, { passive: true });
  }
};

if (typeof window !== 'undefined') window.UI = UI;
if (typeof module !== 'undefined' && module.exports) module.exports = UI;
