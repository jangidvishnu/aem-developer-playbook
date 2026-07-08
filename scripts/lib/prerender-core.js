#!/usr/bin/env node
/**
 * Shared generation logic for scripts/prerender.js and scripts/verify-prerender.js (Milestone 14,
 * see 12_DECISIONS.md DR-022). Kept in one place so "what gets written" and "what gets checked"
 * can never silently drift apart.
 *
 * Renders the same product-mode markup assets/js/app.js's App.boot() builds in the browser, using
 * the real assets/js/render.js (require()'d directly — no hand-copied duplicate), then splices the
 * result into index.html between fixed `<!-- PRERENDER:START:x --><!-- PRERENDER:END:x -->` comment
 * pairs. Every replacement is a pure function of data/*.json — no timestamps, no randomness — so
 * re-running with unchanged data produces byte-identical output (required for the staleness check).
 */
const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..', '..');
const DATA_DIR = path.join(ROOT, 'data');
const INDEX_HTML_PATH = path.join(ROOT, 'index.html');

function loadJson(name) {
  return JSON.parse(fs.readFileSync(path.join(DATA_DIR, name), 'utf8'));
}

function loadData() {
  return {
    allChapters: loadJson('chapters.json'),
    companies: loadJson('companies.json'),
    site: loadJson('site.json'),
    roadmaps: loadJson('roadmaps.json'),
    ownerPlaybook: loadJson('owner_playbook.json'),
    learning: {
      glossary: loadJson('glossary.json'),
      technologies: loadJson('technologies.json'),
      careerPaths: loadJson('career_paths.json'),
      interviews: loadJson('interviews.json'),
      templates: loadJson('templates.json'),
      resources: loadJson('resources.json')
    }
  };
}

/** Node has no `Icons`/`CompanyFilters` globals from separate <script> tags like the browser does.
 *  Render.icon() and Render._companyFilters() both fall back to a bare `Icons` / require('./filters.js')
 *  lookup, so exposing Icons as a real Node global here lets the exact same Render functions used in
 *  the browser also produce real icon markup (not blank) when called from this script. */
function requireRenderWithIcons() {
  global.Icons = require(path.join(ROOT, 'assets', 'js', 'icons.js'));
  return require(path.join(ROOT, 'assets', 'js', 'render.js'));
}

function replaceMarker(html, name, content) {
  const marker = new RegExp(`(<!-- PRERENDER:START:${name} -->)([\\s\\S]*?)(<!-- PRERENDER:END:${name} -->)`);
  if (!marker.test(html)) {
    throw new Error(`scripts/prerender.js: marker "${name}" not found in index.html — did the shell markup change?`);
  }
  // Function replacer (not a "$1"-style replacement string) so any literal "$" in `content` is
  // inserted as-is instead of being misread as a regex backreference.
  return html.replace(marker, (_match, start, _old, end) => start + content + end);
}

/** Builds every prerendered fragment from data/*.json. Mirrors assets/js/app.js's App.boot() render
 *  calls exactly (same functions, same arguments) for the always-published product-mode view. */
function buildFragments(Render, data) {
  const { allChapters, companies, site, roadmaps, ownerPlaybook, learning } = data;
  const productMode = Render.resolveProductMode(site);
  const chapters = Render.chaptersForMode(allChapters, site);
  const renderOpts = { productMode };
  const ctx = { companies, learning, ownerPlaybook, productMode, roadmaps };
  const stats = Render.companyStats(companies);
  const groups = site.navigation && site.navigation.groups;
  const seo = site.seo || {};
  const siteUrl = seo.siteUrl || '';

  const chaptersHtml = chapters.map((c, i) => Render.chapter(c, i, ctx)).join('');
  const roadmapsHtml = productMode ? '' : Render.roadmapList(roadmaps, renderOpts);

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: site.documentTitle || '',
    description: seo.description || '',
    url: siteUrl,
    potentialAction: {
      '@type': 'SearchAction',
      target: `${siteUrl}?q={search_term_string}`,
      'query-input': 'required name=search_term_string'
    }
  };
  // Escape "<" so a literal "</script>" can never appear inside the JSON-LD payload and prematurely
  // close the <script> tag it's embedded in.
  const jsonLdJson = JSON.stringify(jsonLd).replace(/</g, '\\u003c');

  return {
    siteUrl,
    canonical: `<link rel="canonical" href="${siteUrl || './'}" />`,
    'json-ld': siteUrl ? `<script type="application/ld+json" id="site-json-ld">${jsonLdJson}</script>` : '',
    'page-header': Render.pageHeader(site.header, renderOpts),
    'search-desktop': Render.search(site.search, 'search-wrap', '-desktop'),
    'search-header': Render.search(site.search, 'search-wrap-header-inner', '-mobile'),
    'site-disclaimer': Render.disclaimer(site.disclaimer, site.header),
    'sidebar-label': Render.escapeHtml(site.sidebar.contentsLabel),
    toc: groups ? Render.sidebarGrouped(chapters, groups) : Render.sidebar(chapters),
    main: Render.hero(site.hero, renderOpts, stats) + roadmapsHtml + chaptersHtml,
    'site-footer': Render.footer(site.footer)
  };
}

const MARKER_NAMES = [
  'canonical',
  'json-ld',
  'page-header',
  'search-desktop',
  'search-header',
  'site-disclaimer',
  'sidebar-label',
  'toc',
  'main',
  'site-footer'
];

function buildIndexHtml(fragments) {
  const currentHtml = fs.readFileSync(INDEX_HTML_PATH, 'utf8');
  return MARKER_NAMES.reduce((html, name) => replaceMarker(html, name, fragments[name]), currentHtml);
}

function buildSitemapXml(siteUrl) {
  const loc = siteUrl || './';
  return (
    '<?xml version="1.0" encoding="UTF-8"?>\n' +
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n' +
    '  <url>\n' +
    `    <loc>${loc}</loc>\n` +
    '    <changefreq>weekly</changefreq>\n' +
    '    <priority>1.0</priority>\n' +
    '  </url>\n' +
    '</urlset>\n'
  );
}

function buildRobotsTxt(siteUrl) {
  const lines = ['User-agent: *', 'Allow: /', ''];
  if (siteUrl) lines.push(`Sitemap: ${siteUrl}sitemap.xml`);
  return lines.join('\n') + '\n';
}

/** Pure: reads data/*.json + the current index.html shell, returns generated file contents. Does
 *  not write anything — scripts/prerender.js writes, scripts/verify-prerender.js only compares. */
function generate() {
  const Render = requireRenderWithIcons();
  const data = loadData();
  const fragments = buildFragments(Render, data);
  return {
    indexHtml: buildIndexHtml(fragments),
    sitemapXml: buildSitemapXml(fragments.siteUrl),
    robotsTxt: buildRobotsTxt(fragments.siteUrl)
  };
}

module.exports = {
  ROOT,
  INDEX_HTML_PATH,
  SITEMAP_PATH: path.join(ROOT, 'sitemap.xml'),
  ROBOTS_PATH: path.join(ROOT, 'robots.txt'),
  generate
};
