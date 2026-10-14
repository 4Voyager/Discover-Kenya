/* ==========================================================================
   attraction.js — attraction.html?slug=…
   Reads one record from KT.attractions and renders every section.
   ========================================================================== */

(function () {
  const { qs, qsa, esc, icon } = KT;
  const NAIROBI = { lat: -1.2921, lon: 36.8219 };
  const app = qs('#app');

  const slug = new URLSearchParams(location.search).get('slug');
  const a = KT.bySlug(slug);

  /* ---------- not found ---------- */
  function renderNotFound() {
    document.title = 'Place not found — Discover Kenya';
    app.innerHTML = `
      <section class="anf wrap">
        <h1 class="display">We couldn’t find that place</h1>
        <p>The link may be old or mistyped. Pick one of these instead, or browse everything.</p>
        <ul class="anf__list">${KT.attractions.map(x => `<li><a class="chip" href="${KT.url(x.slug)}">${esc(KT.shortLabel(x))}</a></li>`).join('')}</ul>
        <a class="btn btn--dark" href="explore.html">Browse all attractions</a>
      </section>`;
  }

  /* ---------- small helpers ---------- */
  const km = (x, y) => Math.round(KT.distanceKm(x, y) / 5) * 5;
  const modeIcon = m => /air|fly/i.test(m) ? 'plane' : /train|rail/i.test(m) ? 'train' : /road|drive|taxi/i.test(m) && !/tour/i.test(m) ? 'car' : 'compass';
  const levelUi = { yes: ['check', 'Available'], some: ['minus', 'Limited'], no: ['x', 'Not available'] };
  const GUIDELINES = [
    'Keep to marked tracks and designated viewpoints.',
    'Never feed wildlife, and keep a respectful distance.',
    'Take your litter with you, and use reusable bottles where you can.',
    'Ask before photographing people, homes or ceremonies.',
    'Book guides, boats and drivers through licensed operators.',
  ];

  /* ---------- sections ---------- */
  function hero() {
    const fromNairobi = km(a, NAIROBI);
    return `
    <section class="ahero" aria-labelledby="atitle">
      <img class="ahero__bg" src="${KT.img.scene(a.slug)}" alt="" width="1600" height="900" fetchpriority="high" decoding="async">
      <div class="ahero__inner wrap">
        <nav class="crumbs" aria-label="Breadcrumb"><a href="index.html">Home</a><span aria-hidden="true">/</span><a href="explore.html">Explore</a><span aria-hidden="true">/</span><span aria-current="page">${esc(KT.shortLabel(a))}</span></nav>
        <h1 id="atitle" class="ahero__title">${esc(a.name)}</h1>
        <p class="ahero__tagline">${esc(a.tagline)}</p>
        <div class="ahero__actions">
          <a class="btn btn--lg" href="#plan">Plan your visit</a>
          <a class="btn btn--lg btn--glass" href="#location">${icon('pin', 18)} See on map</a>
        </div>
      </div>
      <dl class="facts wrap">
        <div><dt>Region</dt><dd>${esc(KT.regionName(a.region))}</dd></div>
        <div><dt>Best time</dt><dd>${esc(KT.bestMonthsLabel(a))}</dd></div>
        <div><dt>Typical stay</dt><dd>${esc(a.duration)}</dd></div>
        <div><dt>From Nairobi</dt><dd>About ${fromNairobi} km</dd></div>
      </dl>
    </section>`;
  }

  function gallery() {
    const imgs = KT.img.gallery(a.slug);
    return `
    <section id="gallery" class="asec" aria-label="Photo gallery" data-gallery>
      <div class="gal" tabindex="0" aria-roledescription="carousel" aria-label="${esc(KT.shortLabel(a))} gallery">
        <div class="gal__stage">
          ${imgs.map((src, i) => `<img class="gal__img${i === 0 ? ' is-active' : ''}" src="${src}" alt="Photo of ${esc(KT.shortLabel(a))}, view ${i + 1} of ${imgs.length}" width="1600" height="900" ${i ? 'loading="lazy"' : ''}>`).join('')}
        </div>
        <div class="gal__bar">
          <div class="gal__thumbs" role="group" aria-label="Choose a view">${imgs.map((src, i) => `<button type="button" class="gal__thumb" data-i="${i}" aria-label="Show view ${i + 1}" aria-current="${i === 0}"><img src="${src}" alt="" loading="lazy" width="160" height="90"></button>`).join('')}</div>
          <div class="gal__nav"><span class="gal__count" data-count aria-hidden="true">01 / ${KT.pad(imgs.length)}</span>
            <button class="round-btn" type="button" aria-label="Previous view" data-prev>${icon('arrow-left')}</button>
            <button class="round-btn" type="button" aria-label="Next view" data-next>${icon('arrow-right')}</button></div>
        </div>
      </div>
    </section>`;
  }

  const overview = () => `
    <section id="overview" class="asec" aria-labelledby="h-overview">
      <h2 id="h-overview">Overview</h2>
      <p class="lead">${esc(a.overview[0])}</p>
      ${a.overview.slice(1).map(p => `<p>${esc(p)}</p>`).join('')}
      <h3 class="asec__sub">What makes it special</h3>
      <ul class="special">${a.highlights.map(h => `<li>${icon('sun', 22)}<span>${esc(h)}</span></li>`).join('')}</ul>
    </section>`;

  const thingsToDo = () => `
    <section id="do" class="asec" aria-labelledby="h-do">
      <h2 id="h-do">Things to see and do</h2>
      <ul class="todo">${a.thingsToDo.map(t => `<li><h3>${esc(t.title)}</h3><p>${esc(t.text)}</p></li>`).join('')}</ul>
    </section>`;

  const location_ = near => `
    <section id="location" class="asec" aria-labelledby="h-location">
      <h2 id="h-location">Location and map</h2>
      <div class="loc">
        <div class="loc__map" data-map></div>
        <div class="loc__side">
        <dl class="loc__info">
          <div><dt>Region</dt><dd>${esc(KT.regionName(a.region))}</dd></div>
          <div><dt>Coordinates</dt><dd>${Math.abs(a.lat).toFixed(2)}° ${a.lat < 0 ? 'S' : 'N'}, ${a.lon.toFixed(2)}° E</dd></div>
          <div><dt>From Nairobi</dt><dd>About ${km(a, NAIROBI)} km in a straight line</dd></div>
          <div><dt>Nearby</dt><dd>${near.map(n => esc(KT.shortLabel(n.a))).join(', ')}</dd></div>
        </dl>
        <a class="btn btn--dark loc__link" href="https://www.google.com/maps/search/?api=1&query=${a.lat},${a.lon}" target="_blank" rel="noopener">${icon('external', 18)} Open in your maps app</a>
        <p class="note">The map is a simplified sketch to show where places sit. Use a navigation app for directions.</p>
        </div>
      </div>
    </section>`;

  /* ---------- best time: a 12-month dial ---------- */
  const RATING = ['Less ideal', 'Good', 'Best'];
  const RATING_TEXT = ['Wetter or harder going. Fewer visitors and lower prices.', 'A good choice, with a few trade-offs.', 'The sweet spot for weather, wildlife or conditions.'];
  const MONTH_FULL = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  // runs of months with the same rating, wrapping Dec → Jan: [[start, end], …]
  function runs(level) {
    const m = a.months, n = 12, out = []; let start = m.findIndex((v, k) => v !== level && m[(k + 1) % n] === level);
    if (start === -1) return m.every(v => v === level) ? [[0, 11]] : [];
    for (let s = 0, k = (start + 1) % n; s < n; s++, k = (k + 1) % n) {
      if (m[k] === level) { let e = k; while (m[(e + 1) % n] === level && (e + 1) % n !== (start + 1) % n) e = (e + 1) % n; out.push([k, e]); s += (e - k + n) % n; k = e; }
    }
    return out;
  }
  const runLabel = ([s, e]) => s === e ? KT.MONTHS[s] : `${KT.MONTHS[s]}–${KT.MONTHS[e]}`;
  const polar = (r, deg) => { const t = (deg - 90) * Math.PI / 180; return [200 + r * Math.cos(t), 200 + r * Math.sin(t)]; };
  const sector = (r0, r1, d0, d1) => { const [a0, b0] = polar(r1, d0), [a1, b1] = polar(r1, d1), [a2, b2] = polar(r0, d1), [a3, b3] = polar(r0, d0); return `M${a0.toFixed(1)} ${b0.toFixed(1)}A${r1} ${r1} 0 0 1 ${a1.toFixed(1)} ${b1.toFixed(1)}L${a2.toFixed(1)} ${b2.toFixed(1)}A${r0} ${r0} 0 0 0 ${a3.toFixed(1)} ${b3.toFixed(1)}Z`; };

  const bestTime = () => {
    const R0 = 84, H = [24, 52, 82], now = new Date().getMonth();
    const bars = a.months.map((v, i) => {
      const d0 = i * 30 + 2, d1 = i * 30 + 28, [lx, ly] = polar(R0 + 82 + 24, i * 30 + 15);
      return `<g class="dm dm--${v}" data-i="${i}" style="--i:${i}">
        <path class="dm__track" d="${sector(R0, R0 + 82, d0, d1)}"/>
        <path class="dm__bar" d="${sector(R0, R0 + H[v], d0, d1)}"/>
        <text class="dm__label${i === now ? ' is-now' : ''}" x="${lx.toFixed(1)}" y="${ly.toFixed(1)}" text-anchor="middle" dominant-baseline="central">${KT.MONTHS[i]}</text>
      </g>`;
    }).join('');
    const guides = [24, 52, 82].map(h => `<circle class="dial__guide" cx="200" cy="200" r="${R0 + h}"/>`).join('');
    const [nx, ny] = polar(R0 - 13, now * 30 + 15);
    const best = runs(2), good = runs(1), low = runs(0);
    const chip = (lvl, list) => `<div class="when__row when__row--${lvl}"><dt><i></i>${RATING[lvl]}</dt><dd>${list.length ? list.map(runLabel).join(', ') : 'None'}</dd></div>`;
    return `
    <section id="when" class="asec" aria-labelledby="h-when">
      <h2 id="h-when">Best time to visit</h2>
      <div class="when">
        <div class="dial" data-dial>
          <svg viewBox="0 0 400 400" aria-hidden="true" class="dial__svg">
            <circle class="dial__hub" cx="200" cy="200" r="${R0 - 6}"/>${guides}${bars}
            <circle class="dial__now" cx="${nx.toFixed(1)}" cy="${ny.toFixed(1)}" r="4.5"/>
          </svg>
          <div class="dial__center" aria-hidden="true"><small data-dial-kicker>Best months</small><b data-dial-main>${esc(best.length ? runLabel(best[0]) : '—')}</b><span data-dial-sub>${best.length > 1 ? 'and ' + esc(runLabel(best[1])) : ''}</span></div>
        </div>
        <div class="when__side">
          <dl class="when__rows">${chip(2, best)}${chip(1, good)}${chip(0, low)}</dl>
          <p class="when__now" data-dial-now><b>${MONTH_FULL[now]}:</b> ${esc(RATING[a.months[now]])}. ${esc(RATING_TEXT[a.months[now]])}</p>
          <p>${esc(a.bestNote)}</p>
          <p class="note">Tap or hover a month to see how it rates.</p>
        </div>
        <ol class="visually-hidden">${a.months.map((v, i) => `<li>${MONTH_FULL[i]}: ${RATING[v]}</li>`).join('')}</ol>
      </div>
    </section>`;
  };

  function initDial() {
    const root = qs('[data-dial]'); if (!root) return;
    const kicker = qs('[data-dial-kicker]', root), main = qs('[data-dial-main]', root), sub = qs('[data-dial-sub]', root);
    const home = { k: kicker.textContent, m: main.textContent, s: sub.textContent };
    const groups = qsa('.dm', root); let locked = null;
    const show = i => {
      if (i === null) { kicker.textContent = home.k; main.textContent = home.m; sub.textContent = home.s; root.removeAttribute('data-level'); groups.forEach(g => g.classList.remove('is-hot')); return; }
      const v = a.months[i]; kicker.textContent = RATING[v]; main.textContent = MONTH_FULL[i]; sub.textContent = RATING_TEXT[v]; root.dataset.level = v;
      groups.forEach((g, k) => g.classList.toggle('is-hot', k === i));
    };
    groups.forEach(g => {
      g.addEventListener('pointerenter', e => { if (e.pointerType !== 'touch' && locked === null) show(+g.dataset.i); });
      g.addEventListener('pointerleave', e => { if (e.pointerType !== 'touch' && locked === null) show(null); });
      g.addEventListener('click', () => { const i = +g.dataset.i; locked = locked === i ? null : i; show(locked); });
    });
    root.addEventListener('pointerleave', () => { if (locked === null) show(null); });
    document.addEventListener('click', e => { if (!root.contains(e.target) && locked !== null) { locked = null; show(null); } });
  }

  const fees = () => `
    <section id="fees" class="asec" aria-labelledby="h-fees">
      <h2 id="h-fees">Opening hours, fees and permits</h2>
      <p class="callout">${icon('clock', 22)}<span>${esc(a.hours)}</span></p>
      <dl class="fees">${a.fees.map(f => `<div><dt>${esc(f.label)}</dt><dd>${esc(f.value)}</dd></div>`).join('')}</dl>
      <p class="note">${icon('ticket', 16)} ${esc(a.feesNote)} Prices are a guide and change often.</p>
    </section>`;

  const gettingThere = () => `
    <section id="getting-there" class="asec" aria-labelledby="h-get">
      <h2 id="h-get">How to get there</h2>
      <ul class="modes">${a.gettingThere.map(m => `<li>${icon(modeIcon(m.mode), 26)}<div><h3>${esc(m.mode)}</h3><p>${esc(m.text)}</p></div></li>`).join('')}</ul>
    </section>`;

  const facilities = () => `
    <section id="facilities" class="asec" aria-labelledby="h-fac">
      <h2 id="h-fac">Facilities and accessibility</h2>
      <ul class="facs">${a.facilities.map(f => { const [ic, txt] = levelUi[f.level]; return `<li class="fac fac--${f.level}"><span class="fac__ic">${icon(ic, 16)}</span><span class="fac__name">${esc(f.label)}</span><span class="fac__lvl">${txt}</span></li>`; }).join('')}</ul>
      <p class="callout">${icon('compass', 22)}<span>${esc(a.accessNote)}</span></p>
    </section>`;

  const nearby = near => `
    <section id="nearby" class="asec asec--wide" aria-labelledby="h-near">
      <h2 id="h-near">Nearby attractions</h2>
      <div class="near">${near.map(n => KT.card(n.a, { extra: `<span class="card__facts"><span>${icon('pin', 16)}About ${n.d} km away</span></span>` })).join('')}</div>
    </section>`;

  const tips = () => `
    <section id="tips" class="asec" aria-labelledby="h-tips">
      <h2 id="h-tips">Travel tips and visitor guidelines</h2>
      <div class="tips">
        <div><h3>Tips</h3><ul class="dots">${a.tips.map(t => `<li>${esc(t)}</li>`).join('')}</ul></div>
        <div><h3>Visitor guidelines</h3><ul class="dots">${GUIDELINES.map(t => `<li>${esc(t)}</li>`).join('')}</ul></div>
      </div>
    </section>`;

  const plan = () => `
    <section id="plan" class="asec plan" aria-labelledby="h-plan">
      <h2 id="h-plan">Plan and book</h2>
      <p>Check opening hours, prices and permits with the official source, then book through a licensed operator or the official channel.</p>
      <div class="plan__links">${a.official.map(o => `<a class="btn btn--dark" href="${o.url}" target="_blank" rel="noopener">${esc(o.label)} ${icon('external', 16)}</a>`).join('')}</div>
    </section>`;

  const subnav = () => `
    <nav class="subnav" aria-label="On this page"><ul>
      ${[['overview', 'Overview'], ['do', 'See and do'], ['location', 'Location'], ['when', 'Best time'], ['fees', 'Hours and fees'], ['getting-there', 'Getting there'], ['facilities', 'Facilities'], ['nearby', 'Nearby'], ['tips', 'Tips'], ['plan', 'Plan and book']].map(([id, l]) => `<li><a href="#${id}">${l}</a></li>`).join('')}
    </ul></nav>`;

  function nextBand() {
    const i = KT.attractions.indexOf(a), n = KT.attractions[(i + 1) % KT.attractions.length];
    return `
    <a class="anext" href="${KT.url(n.slug)}">
      <img src="${KT.img.scene(n.slug)}" alt="" loading="lazy" width="1600" height="900">
      <span class="anext__inner wrap"><span class="anext__label">Next place</span><span class="anext__name display">${esc(KT.shortLabel(n))}</span><span class="anext__go">${icon('arrow-right', 28)}</span></span>
    </a>`;
  }

  /* ---------- interactions ---------- */
  function initGallery() {
    const root = qs('[data-gallery]'); if (!root) return;
    const imgs = qsa('.gal__img', root), thumbs = qsa('.gal__thumb', root), count = qs('[data-count]', root); let i = 0;
    const show = n => {
      i = (n + imgs.length) % imgs.length;
      imgs.forEach((im, k) => im.classList.toggle('is-active', k === i));
      thumbs.forEach((t, k) => t.setAttribute('aria-current', k === i));
      count.textContent = `${KT.pad(i + 1)} / ${KT.pad(imgs.length)}`;
    };
    qs('[data-prev]', root).addEventListener('click', () => show(i - 1));
    qs('[data-next]', root).addEventListener('click', () => show(i + 1));
    thumbs.forEach(t => t.addEventListener('click', () => show(+t.dataset.i)));
    qs('.gal', root).addEventListener('keydown', e => { if (e.key === 'ArrowRight') show(i + 1); if (e.key === 'ArrowLeft') show(i - 1); });
    let sx = null; const stage = qs('.gal__stage', root);
    stage.addEventListener('pointerdown', e => { sx = e.clientX; });
    stage.addEventListener('pointerup', e => { if (sx === null) return; const dx = e.clientX - sx; sx = null; if (Math.abs(dx) > 50) show(i + (dx < 0 ? 1 : -1)); });
  }

  function initScrollSpy() {
    const links = qsa('.subnav a'); if (!links.length || !('IntersectionObserver' in window)) return;
    const map = new Map(links.map(l => [l.getAttribute('href').slice(1), l]));
    const io = new IntersectionObserver(entries => entries.forEach(en => {
      if (en.isIntersecting) { links.forEach(l => l.removeAttribute('aria-current')); const l = map.get(en.target.id); if (l) l.setAttribute('aria-current', 'true'); }
    }), { rootMargin: '-35% 0px -55% 0px' });
    map.forEach((_, id) => { const s = document.getElementById(id); if (s) io.observe(s); });
  }

  /* ---------- go ---------- */
  function render() {
    if (!a) return renderNotFound();
    document.title = `${a.name} — Discover Kenya`;
    const meta = qs('meta[name="description"]'); if (meta) meta.content = `${a.summary} Best time to visit, fees, how to get there and nearby places.`;

    const near = KT.attractions.filter(x => x.slug !== a.slug).map(x => ({ a: x, d: km(a, x) })).sort((p, q) => p.d - q.d).slice(0, 3);

    app.innerHTML = hero() + `
      <div class="alayout wrap">
        ${subnav()}
        <div class="acontent">
          ${gallery()}${overview()}${thingsToDo()}${location_(near)}${bestTime()}${fees()}${gettingThere()}${facilities()}${nearby(near)}${tips()}${plan()}
        </div>
      </div>
      ${nextBand()}`;

    initGallery(); initScrollSpy();
    const pm = KT.createMap(qs('[data-map]'), { pins: [a.slug, ...near.map(n => n.a.slug)], active: a.slug, labels: 'always', onSelect: s => { if (s !== a.slug) location.href = KT.url(s); } });
    pm.fit([a.slug, ...near.map(n => n.a.slug)]);
    KT.observeOnce('[data-dial]', 'is-in'); initDial();
  }

  document.addEventListener('DOMContentLoaded', render);
})();
