/* ==========================================================================
   home.js — behaviour for index.html
   Sections: hero · featured · categories · destinations carousel ·
             regions map · experiences · itineraries · stories
   ========================================================================== */

(function () {
  const { qs, qsa, esc, icon } = { qs: KT.qs, qsa: KT.qsa, esc: KT.esc, icon: KT.icon };

  /* ------------------------------------------------------------------
     1. HERO — the chosen card grows to fill the stage (clip-path + image
        scale, both from the card's own rectangle) while the old image
        expands outward. The new image then holds for HOLD ms.
     ------------------------------------------------------------------ */
  function initHero() {
    const HOLD = 3000, MOVE = 1300, EASE = 'cubic-bezier(.77, 0, .175, 1)';
    const hero = qs('#hero'), stage = qs('[data-hero-stage]'), layersEl = qs('[data-hero-layers]');
    const content = qs('[data-hero-content]'), rail = qs('[data-hero-cards]');
    const items = KT.heroSlides.map(KT.bySlug), N = items.length;
    let i = 0, busy = false, paused = KT.reduceMotion, timers = [];
    stage.style.setProperty('--hold', HOLD + 'ms');

    layersEl.innerHTML = items.map((a, k) => `
      <div class="hero__layer" data-k="${k}" aria-hidden="true">
        <img class="hero__img" src="${KT.img.scene(a.slug)}" alt="" width="1600" height="900" decoding="async" ${k === 0 ? 'fetchpriority="high"' : 'loading="eager"'}>
      </div>`).join('');
    const layers = qsa('.hero__layer', layersEl);

    rail.innerHTML = items.map((b, k) => `
      <button class="rcard" type="button" data-go="${k}" data-r="${(k + N) % N}" style="--r:${k}" aria-label="Show ${esc(KT.shortLabel(b))}">
        <img src="${KT.img.scene(b.slug)}" alt="" width="1600" height="900" decoding="async">
        <span class="rcard__text"><small>${esc(KT.regionName(b.region))}</small><b>${esc(KT.shortLabel(b))}</b></span></button>`).join('');
    const cards = qsa('.rcard', rail);

    const els = { region: qs('[data-hero-region]'), name: qs('[data-hero-name]'), text: qs('[data-hero-text]'), link: qs('[data-hero-link]'), counter: qs('[data-hero-counter]'), bar: qs('[data-hero-progress]') };
    qs('[data-hero-prev]').innerHTML = icon('arrow-left');
    qs('[data-hero-next]').innerHTML = icon('arrow-right');
    const pauseBtn = qs('[data-hero-pause]');
    const later = (fn, ms) => { const t = setTimeout(fn, ms); timers.push(t); return t; };

    function setPaused(v) {
      paused = v; stage.classList.toggle('is-paused', v);
      pauseBtn.setAttribute('aria-pressed', v); pauseBtn.setAttribute('aria-label', v ? 'Play slideshow' : 'Pause slideshow');
      pauseBtn.innerHTML = icon(v ? 'play' : 'pause');
    }

    function setText(k) {
      const a = items[k];
      els.region.textContent = KT.regionName(a.region);
      els.name.textContent = KT.shortLabel(a);
      els.text.textContent = a.tagline;
      els.link.href = KT.url(a.slug);
      els.link.setAttribute('aria-label', `See ${KT.shortLabel(a)}`);
      els.counter.innerHTML = `${KT.pad(k + 1)}<span>/${KT.pad(N)}</span>`;
    }

    // rail positions: r = how far a card is from the active slide
    function placeRail(target, fromCard) {
      cards.forEach((c, k) => {
        const oldR = +c.dataset.r, newR = (k - target + N) % N;
        if (k === target) { c.classList.add('is-snap'); c.dataset.r = 0; c.style.setProperty('--r', 0); return; }
        c.dataset.r = newR;
        if ((oldR !== 0 && Math.abs(newR - oldR) === 1) || (oldR === 0 && newR === 1)) { c.classList.remove('is-snap'); c.style.setProperty('--r', newR); return; }
        // wrapping card: fade out, jump, fade back in once the others have settled
        c.classList.add('is-fade');
        later(() => { c.classList.add('is-snap'); c.style.setProperty('--r', newR); void c.offsetWidth; c.classList.remove('is-fade'); c.classList.remove('is-snap'); }, 320);
      });
    }

    // rectangle (in stage coordinates) the new image should grow from
    function originRect(k) {
      const s = stage.getBoundingClientRect(), r = rail.getBoundingClientRect(), c = cards[k].getBoundingClientRect();
      const visible = c.width > 0 && c.left >= r.left - 2 && c.right <= r.right + 2;
      const cw = c.width || 120, ch = c.height || 170;
      const left = visible ? c.left : r.left, top = visible ? c.top : r.bottom - ch;
      return { x: left - s.left, y: top - s.top, w: cw, h: ch, W: s.width, H: s.height };
    }

    function restartProgress() { els.bar.classList.remove('run'); void els.bar.offsetWidth; els.bar.classList.add('run'); }

    function setRest(k) {
      layers.forEach((l, n) => { l.classList.toggle('is-rest', n === k); l.classList.remove('is-in', 'is-out'); l.setAttribute('aria-hidden', n !== k); });
    }

    function go(n) {
      const target = (n + N) % N;
      if (busy || target === i) return;
      busy = true; timers.forEach(clearTimeout); timers = [];
      els.bar.classList.remove('run'); els.bar.style.transform = 'scaleX(0)';
      const from = i, o = originRect(target);
      const inL = layers[target], outL = layers[from], inImg = inL.firstElementChild, outImg = outL.firstElementChild;
      const iw = inImg.naturalWidth || 1600, ih = inImg.naturalHeight || 900;
      const stageCover = Math.max(o.W / iw, o.H / ih), cardCover = Math.max(o.w / iw, o.h / ih), s0 = cardCover / stageCover;
      const tx = o.x + o.w / 2 - o.W / 2, ty = o.y + o.h / 2 - o.H / 2;
      const clip0 = `inset(${o.y}px ${o.W - o.x - o.w}px ${o.H - o.y - o.h}px ${o.x}px round 16px)`;

      placeRail(target);
      content.classList.add('is-leaving'); content.classList.remove('is-entering');
      outL.classList.remove('is-rest'); outL.classList.add('is-out'); inL.classList.add('is-in');
      i = target;

      const done = () => {
        setRest(target); busy = false;
        restartProgress();
      };
      if (KT.reduceMotion || !inL.animate) { setText(target); content.classList.remove('is-leaving'); done(); return; }

      const opts = { duration: MOVE, easing: EASE, fill: 'both' };
      const a1 = inL.animate([{ clipPath: clip0 }, { clipPath: 'inset(0px 0px 0px 0px round 0px)' }], opts);
      inImg.animate([{ transform: `translate(${tx}px, ${ty}px) scale(${s0})` }, { transform: 'translate(0px, 0px) scale(1)' }], opts);
      outImg.animate([{ transform: 'scale(1)', filter: 'brightness(1)' }, { transform: 'scale(1.16)', filter: 'brightness(.55)' }], opts);
      later(() => { setText(target); content.classList.remove('is-leaving'); content.classList.add('is-entering'); }, MOVE * .42);
      a1.finished.then(() => { qsa('.hero__layer, .hero__img', layersEl).forEach(el => el.getAnimations().forEach(an => an.cancel())); done(); }).catch(() => { busy = false; });
    }

    els.bar.addEventListener('animationend', () => { if (!paused && !busy) go(i + 1); });
    qs('[data-hero-prev]').addEventListener('click', () => go(i - 1));
    qs('[data-hero-next]').addEventListener('click', () => go(i + 1));
    pauseBtn.addEventListener('click', () => setPaused(!paused));
    rail.addEventListener('click', e => { const b = e.target.closest('[data-go]'); if (b) go(+b.dataset.go); });

    // the slideshow only stops when the visitor presses pause (hovering never stops it);
    // it just idles while the hero is scrolled out of view or the tab is hidden
    if ('IntersectionObserver' in window) new IntersectionObserver(([en]) => stage.classList.toggle('is-offscreen', !en.isIntersecting), { threshold: .25 }).observe(hero);
    document.addEventListener('visibilitychange', () => stage.classList.toggle('is-offscreen', document.hidden));

    // swipe
    let sx = null;
    stage.addEventListener('pointerdown', e => { sx = e.clientX; });
    stage.addEventListener('pointerup', e => { if (sx === null) return; const dx = e.clientX - sx; sx = null; if (Math.abs(dx) > 60 && !e.target.closest('a,button')) go(i + (dx < 0 ? 1 : -1)); });
    stage.addEventListener('pointercancel', () => { sx = null; });

    // the stage eases into a rounded panel as you scroll away
    let ticking = false;
    window.addEventListener('scroll', () => {
      if (ticking) return; ticking = true;
      requestAnimationFrame(() => { const p = Math.min(1, Math.max(0, window.scrollY / (window.innerHeight * .75))); hero.style.setProperty('--p', p.toFixed(3)); ticking = false; });
    }, { passive: true });

    setPaused(paused); setText(0); setRest(0); content.classList.add('is-entering'); restartProgress();
  }

  /* ------------------------------------------------------------------
     2. FEATURED — one large card, four supporting
     ------------------------------------------------------------------ */
  function initFeatured() {
    qs('[data-featured-grid]').innerHTML = KT.featured.map((s, k) =>
      KT.card(KT.bySlug(s), { variant: `card--overlay featured__item featured__item--${k + 1}` })).join('');
  }

  /* ------------------------------------------------------------------
     3. CATEGORIES — expanding panels
     ------------------------------------------------------------------ */
  function initCategories() {
    qs('[data-category-list]').innerHTML = KT.categories.map(c => {
      const count = KT.attractions.filter(a => a.categories.includes(c.id)).length;
      return `<li class="cat-item"><a class="cat" href="explore.html?cat=${c.id}">
        <img src="${KT.img.scene(c.scene)}" alt="" loading="lazy" width="1600" height="900">
        <span class="cat__icon">${icon(KT.categoryIcon(c.id), 26)}</span>
        <span class="cat__body"><span class="cat__name">${c.label}</span><span class="cat__text">${c.text}</span><span class="cat__count">${count} places</span></span>
      </a></li>`;
    }).join('');
  }

  /* ------------------------------------------------------------------
     4. DESTINATIONS — centre-stage carousel with region filters
     ------------------------------------------------------------------ */
  function initDestinations() {
    const stage = qs('[data-destination-carousel]'), filters = qs('[data-destination-filters]');
    qs('[data-destination-prev]').innerHTML = icon('arrow-left');
    qs('[data-destination-next]').innerHTML = icon('arrow-right');
    let region = 'all', list = [], active = 0;

    filters.innerHTML = [{ id: 'all', label: 'All Kenya' }, ...KT.regions].map(r => `<button class="chip" type="button" data-region="${r.id}" aria-pressed="${r.id === 'all'}">${r.label}</button>`).join('');

    function offset(k) {
      const n = list.length; let d = k - active;
      if (n >= 5) { d = ((d % n) + n) % n; if (d > n / 2) d -= n; }
      return d;
    }
    function layout() {
      qsa('.dcard', stage).forEach((el, k) => {
        const o = offset(k), abs = Math.abs(o);
        el.style.setProperty('--o', o); el.style.setProperty('--abs', abs);
        el.style.zIndex = 20 - abs; el.classList.toggle('is-active', o === 0);
        el.classList.toggle('is-far', abs > 2);
        el.tabIndex = o === 0 ? 0 : -1; el.setAttribute('aria-hidden', abs > 2);
        el.setAttribute('aria-label', `${list[k].name}${o === 0 ? '' : ' (show)'}`);
      });
    }
    function build() {
      list = KT.attractions.filter(a => region === 'all' || a.region === region).sort((a, b) => b.popularity - a.popularity);
      active = 0;
      stage.innerHTML = list.map(a => `
        <a class="dcard" href="${KT.url(a.slug)}" data-slug="${a.slug}">
          <img src="${KT.img.scene(a.slug)}" alt="" loading="lazy" width="1600" height="900">
          <span class="dcard__text"><small>${esc(KT.regionName(a.region))}</small><b>${esc(KT.shortLabel(a))}</b><span class="dcard__go">${icon('arrow-up-right', 20)}</span></span>
        </a>`).join('');
      layout();
    }
    const move = d => { if (!list.length) return; const n = list.length; active = n >= 5 ? (active + d + n) % n : Math.min(n - 1, Math.max(0, active + d)); layout(); };

    filters.addEventListener('click', e => {
      const b = e.target.closest('[data-region]'); if (!b) return;
      region = b.dataset.region; qsa('.chip', filters).forEach(c => c.setAttribute('aria-pressed', c === b)); build();
    });
    stage.addEventListener('click', e => {
      const card = e.target.closest('.dcard'); if (!card) return;
      const k = qsa('.dcard', stage).indexOf(card);
      if (k !== active) { e.preventDefault(); active = k; layout(); }
    });
    stage.addEventListener('keydown', e => { if (e.key === 'ArrowRight') { e.preventDefault(); move(1); } if (e.key === 'ArrowLeft') { e.preventDefault(); move(-1); } });
    qs('[data-destination-prev]').addEventListener('click', () => move(-1));
    qs('[data-destination-next]').addEventListener('click', () => move(1));

    let sx = null;
    stage.addEventListener('pointerdown', e => { sx = e.clientX; });
    stage.addEventListener('pointerup', e => { if (sx === null) return; const dx = e.clientX - sx; sx = null; if (Math.abs(dx) > 50) { move(dx < 0 ? 1 : -1); stage.dataset.swiped = '1'; setTimeout(() => delete stage.dataset.swiped, 50); } });
    stage.addEventListener('click', e => { if (stage.dataset.swiped) e.preventDefault(); }, true);

    build();
  }

  /* ------------------------------------------------------------------
     5. REGIONS — map + region panel
     ------------------------------------------------------------------ */
  function initRegions() {
    const tabs = qs('[data-region-tabs]'), detail = qs('[data-region-detail]');
    const map = KT.createMap(qs('[data-region-map]'), { labels: 'hover', legend: true, onSelect: slug => select(KT.bySlug(slug).region, slug) });
    const all = [{ id: 'all', label: 'All Kenya', text: 'Fourteen places across five regions. Pick a region to zoom in on what’s there.' }, ...KT.regions];
    tabs.innerHTML = all.map(r => `<button class="rtab" type="button" role="tab" data-region="${r.id}" aria-selected="${r.id === 'all'}">${r.label}</button>`).join('');

    function select(id, focusSlug) {
      const r = all.find(x => x.id === id), list = KT.attractions.filter(a => id === 'all' || a.region === id);
      qsa('.rtab', tabs).forEach(t => t.setAttribute('aria-selected', t.dataset.region === id));
      map.setRegion(id === 'all' ? '' : id); map.setPins(list.map(a => a.slug)); map.setLabels(id === 'all' ? 'hover' : 'always'); map.setActive(focusSlug || null);
      detail.innerHTML = `<p class="regions__text">${esc(r.text)}</p>
        <ul class="rlist">${list.map(a => `<li><a class="ritem${a.slug === focusSlug ? ' is-focus' : ''}" href="${KT.url(a.slug)}" data-slug="${a.slug}">
          <img src="${KT.img.scene(a.slug)}" alt="" loading="lazy" width="1600" height="900">
          <span><b>${esc(KT.shortLabel(a))}</b><small>${a.categories.map(KT.categoryName).join(' · ')}</small></span>${icon('arrow-right', 18)}</a></li>`).join('')}</ul>`;
    }
    tabs.addEventListener('click', e => { const t = e.target.closest('[data-region]'); if (t) select(t.dataset.region); });
    detail.addEventListener('pointerover', e => { const it = e.target.closest('.ritem'); if (it) map.setActive(it.dataset.slug); });
    detail.addEventListener('focusin', e => { const it = e.target.closest('.ritem'); if (it) map.setActive(it.dataset.slug); });
    select('all');
  }

  /* ------------------------------------------------------------------
     6. EXPERIENCES — typographic list, image appears on hover
     ------------------------------------------------------------------ */
  function initExperiences() {
    qs('[data-experience-list]').innerHTML = KT.experiences.map(x => {
      const a = KT.bySlug(x.place);
      return `<li><a class="exp" href="${KT.url(a.slug)}">
        <span class="exp__title">${esc(x.title)}</span>
        <span class="exp__place">${icon('pin', 16)} ${esc(KT.shortLabel(a))}</span>
        <span class="exp__meta"><span>${esc(x.length)}</span><span>${esc(x.season)}</span></span>
        <span class="exp__thumb"><img src="${KT.img.gallery(a.slug)[1]}" alt="" loading="lazy" width="1600" height="900"></span>
        <span class="exp__go">${icon('arrow-up-right', 22)}</span>
      </a></li>`;
    }).join('');
  }

  /* ------------------------------------------------------------------
     7. ITINERARIES — day list + route map
     ------------------------------------------------------------------ */
  function initItineraries() {
    const tabs = qs('[data-itinerary-tabs]'), list = qs('[data-itinerary-days]');
    const map = KT.createMap(qs('[data-itinerary-map]'), { labels: 'always', onSelect: slug => { const li = qs(`.day[data-place="${slug}"]`, list); if (li) { li.scrollIntoView({ block: 'center', behavior: KT.reduceMotion ? 'auto' : 'smooth' }); map.setActive(slug); } } });
    tabs.innerHTML = KT.itineraries.map((t, k) => `<button class="chip" type="button" role="tab" data-id="${t.id}" aria-selected="${k === 0}" aria-pressed="${k === 0}">${esc(t.label)} <small>${esc(t.length)}</small></button>`).join('');

    function show(id) {
      const t = KT.itineraries.find(x => x.id === id), places = [...new Set(t.days.map(d => d.place))];
      qsa('.chip', tabs).forEach(c => { const on = c.dataset.id === id; c.setAttribute('aria-selected', on); c.setAttribute('aria-pressed', on); });
      list.innerHTML = `<li class="itinerary__intro">${esc(t.blurb)}</li>` + t.days.map((d, k) => {
        const a = KT.bySlug(d.place);
        return `<li class="day" data-place="${a.slug}" tabindex="0">
          <span class="day__n">Day <b>${k + 1}</b></span>
          <div class="day__body"><h3>${esc(d.title)}</h3><p>${esc(d.text)}</p><a href="${KT.url(a.slug)}">${esc(KT.shortLabel(a))} ${icon('arrow-right', 16)}</a></div></li>`;
      }).join('');
      map.setPins(places); map.setRoute(t.days.map(d => d.place)); map.setActive(t.days[0].place);
    }
    tabs.addEventListener('click', e => { const c = e.target.closest('[data-id]'); if (c) show(c.dataset.id); });
    list.addEventListener('pointerover', e => { const li = e.target.closest('.day'); if (li) map.setActive(li.dataset.place); });
    list.addEventListener('focusin', e => { const li = e.target.closest('.day'); if (li) map.setActive(li.dataset.place); });
    show(KT.itineraries[0].id);
  }

  /* ------------------------------------------------------------------
     8. STORIES — one big quote at a time
     ------------------------------------------------------------------ */
  function initStories() {
    const quote = qs('[data-story-quote]'), dots = qs('[data-story-dots]'), N = KT.stories.length; let i = 0;
    qs('[data-story-prev]').innerHTML = icon('arrow-left'); qs('[data-story-next]').innerHTML = icon('arrow-right');
    dots.innerHTML = KT.stories.map((_, k) => `<button type="button" aria-label="Story ${k + 1}" data-i="${k}"></button>`).join('');
    function show(n) {
      i = (n + N) % N; const s = KT.stories[i];
      quote.classList.remove('is-in'); void quote.offsetWidth;
      quote.innerHTML = `<blockquote><p>${esc(s.quote)}</p></blockquote><figcaption><span>${esc(s.from)}</span><small>${esc(s.name)}</small></figcaption>`;
      quote.classList.add('is-in');
      qsa('button', dots).forEach((b, k) => b.setAttribute('aria-current', k === i));
    }
    qs('[data-story-prev]').addEventListener('click', () => show(i - 1));
    qs('[data-story-next]').addEventListener('click', () => show(i + 1));
    dots.addEventListener('click', e => { const b = e.target.closest('[data-i]'); if (b) show(+b.dataset.i); });
    show(0);
  }

  document.addEventListener('DOMContentLoaded', () => {
    initHero(); initFeatured(); initCategories(); initDestinations(); initRegions(); initExperiences(); initItineraries(); initStories();
  });
})();
