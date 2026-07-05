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
    return `<input class="border rounded-lg px-3 py-2 w-64 bg-white text-slate-800" id="search" placeholder="${Render.escapeHtml(config.placeholder)}" aria-label="${Render.escapeHtml(config.ariaLabel)}" />`;
  },

  sidebar(chapters) {
    return chapters.map((c, i) => `<a href="#ch${i}" class="block px-3 py-2 rounded hover:bg-slate-100">${Render.escapeHtml(c.title)}</a>`).join('');
  },

  dashboard(stats) {
    const items = stats.items.map(item => `<li>${Render.escapeHtml(item)}</li>`).join('');
    return `<h3 class="font-semibold">${Render.escapeHtml(stats.title)}</h3><ul class="list-disc ml-5 mt-2">${items}</ul>`;
  },

  hero(content) {
    return `<section class="bg-gradient-to-r from-blue-700 to-sky-600 text-white rounded-2xl p-8"><h2 class="text-4xl font-bold">${Render.escapeHtml(content.title)}</h2><p class="mt-4 text-lg">${Render.escapeHtml(content.body)}</p></section>`;
  },

  roadmap(roadmap) {
    const steps = roadmap.steps.map(s =>
      `<li><span class="text-slate-500 text-sm">${Render.escapeHtml(s.status)}</span> — ${Render.escapeHtml(s.title)}</li>`
    ).join('');
    return `<section class="bg-white text-slate-800 rounded-xl shadow p-8"><h2 class="text-2xl font-bold">${Render.escapeHtml(roadmap.title)}</h2><p class="text-slate-500 mt-2 mb-4">${Render.escapeHtml(roadmap.summary)}</p><ol class="list-decimal ml-6 space-y-2">${steps}</ol></section>`;
  },

  companyRow(x) {
    const search = x.search.startsWith('http')
      ? `<a class="text-blue-600 underline" target="_blank" href="${Render.escapeHtml(x.search)}">Search</a>`
      : Render.escapeHtml(x.search);
    return `<tr class="border-t"><td class="p-2">${Render.escapeHtml(x.priority)}</td><td class="p-2 font-semibold">${Render.escapeHtml(x.company)}</td><td class="p-2">${Render.escapeHtml(x.type)}</td><td class="p-2">${Render.escapeHtml(x.india)}</td><td class="p-2">${Render.escapeHtml(x.aem)}</td><td class="p-2"><a class="text-blue-600 underline" target="_blank" href="${Render.escapeHtml(x.careers)}">Careers</a></td><td class="p-2">${search}</td><td class="p-2">${Render.escapeHtml(x.visa)}</td></tr>`;
  },

  companyTable(companies) {
    // Renders every row inline. If this grows well beyond today's handful of
    // companies (the md/ research implies 100+ eventually), revisit
    // pagination/virtualization before Milestone 6 populates it fully.
    return `<div class="overflow-auto"><table class="min-w-full text-sm border"><thead class="bg-slate-100"><tr><th class="p-2">Priority</th><th class="p-2">Company</th><th class="p-2">Type</th><th class="p-2">India</th><th class="p-2">AEM</th><th class="p-2">Careers</th><th class="p-2">AEM Jobs</th><th class="p-2">Visa</th></tr></thead><tbody>${companies.map(Render.companyRow).join('')}</tbody></table></div>`;
  },

  chapter(chapter, index, companies) {
    const id = 'ch' + index;
    let body = chapter.body || '';
    if (chapter.companyTable) {
      body = Render.companyTable(companies);
    }
    return `<section id="${id}" class="section bg-white text-slate-800 rounded-xl shadow p-8"><h2 class="text-3xl font-bold">${Render.escapeHtml(chapter.title)}</h2><div class="text-xs text-slate-500 mt-1">⏱ ${Render.escapeHtml(chapter.reading)} • ${Render.escapeHtml(chapter.tags.join(', '))}</div><p class="text-slate-500 mb-4">${Render.escapeHtml(chapter.summary)}</p>${body}<details class="mt-6"><summary class="cursor-pointer font-semibold">📌 Summary</summary><div class="mt-2 text-slate-600">${Render.escapeHtml(chapter.summary)}</div></details></section>`;
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
