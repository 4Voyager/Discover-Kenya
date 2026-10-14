/* ==========================================================================
   explore.js — search, filters, sorting, map view and load-more
   State lives in one object and is mirrored into the URL
   (?q=…&cat=…&region=…&sort=…&view=…) so views can be shared.
   ========================================================================== */

(function () {
  const { qs, qsa, esc, icon } = KT;
  const PAGE_SIZE = 6;
  const state = { q: '', cat: 'all', region: 'all', sort: 'popular', view: 'grid', shown: PAGE_SIZE };

  const els = {
    grid: qs('[data-grid]'), layout: qs('[data-layout]'), status: qs('[data-status]'), empty: qs('[data-empty]'),
    more: qs('[data-more]'), moreBtn: qs('[data-more-btn]'), moreStatus: qs('[data-more-status]'),
    search: qs('[data-search]'), clear: qs('[data-search-clear]'), cats: qs('[data-cat-chips]'),
    region: qs('[data-region-select]'), sort: qs('[data-sort-select]'), reset: qs('[data-reset]'),
  };
  let map;

  /* ---------- URL <-> state ---------- */
  function readUrl() {
    const p = new URLSearchParams(location.search);
    state.q = p.get('q') || '';
    state.cat = KT.categories.some(c => c.id === p.get('cat')) ? p.get('cat') : 'all';
    state.region = KT.regions.some(r => r.id === p.get('region')) ? p.get('region') : 'all';
    state.sort = ['popular', 'region', 'type', 'name'].includes(p.get('sort')) ? p.get('sort') : 'popular';
    state.view = p.get('view') === 'map' ? 'map' : 'grid';
  }
  function writeUrl() {
    const p = new URLSearchParams();
    if (state.q) p.set('q', state.q);
    if (state.cat !== 'all') p.set('cat', state.cat);
    if (state.region !== 'all') p.set('region', state.region);
    if (state.sort !== 'popular') p.set('sort', state.sort);
    if (state.view !== 'grid') p.set('view', state.view);
    const s = p.toString();
    history.replaceState(null, '', s ? `?${s}` : location.pathname);
  }

  /* ---------- filtering + sorting ---------- */
  function haystack(a) {
    return [a.name, a.tagline, a.summary, KT.regionName(a.region), ...a.categories.map(KT.categoryName), ...a.thingsToDo.map(t => t.title)].join(' ').toLowerCase();
  }
  function results() {
    const terms = state.q.toLowerCase().split(/\s+/).filter(Boolean);
    const list = KT.attractions.filter(a =>
      (state.cat === 'all' || a.categories.includes(state.cat)) &&
      (state.region === 'all' || a.region === state.region) &&
      terms.every(t => haystack(a).includes(t)));
    const regionIdx = id => KT.regions.findIndex(r => r.id === id);
    const catIdx = a => KT.categories.findIndex(c => c.id === a.categories[0]);
    const byName = (a, b) => a.name.localeCompare(b.name);
    const sorters = {
      popular: (a, b) => b.popularity - a.popularity,
      region: (a, b) => regionIdx(a.region) - regionIdx(b.region) || byName(a, b),
      type: (a, b) => catIdx(a) - catIdx(b) || byName(a, b),
      name: byName,
    };
    return list.sort(sorters[state.sort]);
  }

  /* ---------- rendering ---------- */
  function cardFor(a) {
    const top3 = [...KT.attractions].sort((x, y) => y.popularity - x.popularity).slice(0, 3).map(x => x.slug);
    const extra = `
      ${top3.includes(a.slug) ? '<span class="card__badge">Popular</span>' : ''}
      <span class="card__tags">${a.categories.map(c => `<span class="tag">${icon(KT.categoryIcon(c), 14)}${KT.categoryName(c)}</span>`).join('')}</span>
      <span class="card__facts"><span>${icon('calendar', 16)}${esc(KT.bestMonthsLabel(a))}</span><span>${icon('clock', 16)}${esc(a.duration)}</span></span>`;
    return KT.card(a, { extra });
  }

  function render({ resetPaging = false } = {}) {
    if (resetPaging) state.shown = PAGE_SIZE;
    const all = results(), visible = all.slice(0, state.shown);

    els.grid.innerHTML = visible.map(cardFor).join('');
    els.empty.hidden = all.length > 0;
    els.more.hidden = all.length <= state.shown;
    els.moreStatus.textContent = `Showing ${visible.length} of ${all.length}`;
    const next = Math.min(PAGE_SIZE, all.length - visible.length);
    els.moreBtn.textContent = `Show ${next} more`;

    const filters = [state.q && `“${state.q}”`, state.cat !== 'all' && KT.categoryName(state.cat), state.region !== 'all' && KT.regionName(state.region)].filter(Boolean);
    els.status.textContent = `${all.length} ${all.length === 1 ? 'place' : 'places'}${filters.length ? ' · ' + filters.join(' · ') : ''}`;
    els.reset.hidden = !filters.length;
    els.clear.hidden = !state.q;

    qsa('.chip', els.cats).forEach(c => c.setAttribute('aria-pressed', c.dataset.cat === state.cat));
    els.region.value = state.region; els.sort.value = state.sort; els.search.value = state.q;
    els.layout.dataset.view = state.view;
    qsa('[data-view-btn]').forEach(b => b.setAttribute('aria-pressed', b.dataset.viewBtn === state.view));

    if (map) { map.setPins(all.map(a => a.slug)); map.setActive(null); }
    writeUrl();
  }

  /* ---------- setup ---------- */
  function init() {
    readUrl();
    qs('[data-icon="search"]').innerHTML = icon('search', 22);
    els.clear.innerHTML = icon('x', 18);

    els.cats.innerHTML = [{ id: 'all', label: 'All' }, ...KT.categories].map(c =>
      `<button class="chip" type="button" data-cat="${c.id}" aria-pressed="false">${c.id === 'all' ? '' : icon(KT.categoryIcon(c.id), 18)}${c.label}</button>`).join('');
    els.region.innerHTML = [{ id: 'all', label: 'All regions' }, ...KT.regions].map(r => `<option value="${r.id}">${r.label}</option>`).join('');
    qs('[data-view-btn="grid"]').innerHTML = `${icon('grid', 18)}<span>Cards</span>`;
    qs('[data-view-btn="map"]').innerHTML = `${icon('map', 18)}<span>Map</span>`;

    map = KT.createMap(qs('[data-map]'), { labels: 'hover', legend: true, onSelect: slug => {
      const card = qs(`.card[data-slug="${slug}"]`, els.grid);
      if (!card) { // not rendered yet: reveal everything up to it
        const idx = results().findIndex(a => a.slug === slug); if (idx >= 0) { state.shown = Math.max(state.shown, idx + 1); render(); }
      }
      const el = qs(`.card[data-slug="${slug}"]`, els.grid);
      if (el) { el.scrollIntoView({ block: 'center', behavior: KT.reduceMotion ? 'auto' : 'smooth' }); el.classList.add('is-selected'); setTimeout(() => el.classList.remove('is-selected'), 1800); map.setActive(slug); }
    } });

    els.cats.addEventListener('click', e => { const b = e.target.closest('[data-cat]'); if (!b) return; state.cat = b.dataset.cat; render({ resetPaging: true }); });
    els.region.addEventListener('change', () => { state.region = els.region.value; render({ resetPaging: true }); });
    els.sort.addEventListener('change', () => { state.sort = els.sort.value; render({ resetPaging: true }); });
    els.search.addEventListener('input', KT.debounce(() => { state.q = els.search.value.trim(); render({ resetPaging: true }); }, 160));
    qs('[data-search-form]').addEventListener('submit', e => { e.preventDefault(); state.q = els.search.value.trim(); render({ resetPaging: true }); qs('#results').scrollIntoView({ behavior: KT.reduceMotion ? 'auto' : 'smooth' }); });
    els.clear.addEventListener('click', () => { state.q = ''; render({ resetPaging: true }); els.search.focus(); });
    els.moreBtn.addEventListener('click', () => {
      const before = els.grid.children.length; state.shown += PAGE_SIZE; render();
      const first = els.grid.children[before]; if (first) first.focus({ preventScroll: true });
    });
    const reset = () => { Object.assign(state, { q: '', cat: 'all', region: 'all', sort: 'popular', shown: PAGE_SIZE }); render(); };
    els.reset.addEventListener('click', reset); qs('[data-reset-empty]').addEventListener('click', reset);
    qsa('[data-view-btn]').forEach(b => b.addEventListener('click', () => { state.view = b.dataset.viewBtn; render(); if (state.view === 'map') qs('.xtools').scrollIntoView({ behavior: KT.reduceMotion ? 'auto' : 'smooth' }); }));

    // list ↔ map hover link
    els.grid.addEventListener('pointerover', e => { const c = e.target.closest('.card'); if (c && state.view === 'map') map.setActive(c.dataset.slug); });
    els.grid.addEventListener('focusin', e => { const c = e.target.closest('.card'); if (c && state.view === 'map') map.setActive(c.dataset.slug); });

    render();
  }

  document.addEventListener('DOMContentLoaded', init);
})();
