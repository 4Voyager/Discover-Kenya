/* ==========================================================================
   map.js — an interactive map of Kenya, shared by Home, Explore and Detail.
   KT.createMap(container, options) → controller

   Real country outlines (js/geo.js) with a cartographic style: ocean ripples,
   neighbouring countries, graticule, terrain washes, the Rift Valley, cities,
   category-coloured pins with collision-aware labels, zoom + pan, a scale bar
   and a hover card.

   options:
     pins      array of slugs to show              (default: all attractions)
     active    slug to highlight
     onSelect  fn(slug) when a pin is activated
     labels    'hover' | 'always' | 'active'        (default 'hover')
     route     array of slugs drawn as a numbered journey line
     controls  show zoom buttons                    (default true)
     legend    show the category legend             (default false)
   controller: setPins(slugs) · setActive(slug) · setRegion(id) · setRoute(slugs) · setLabels(mode)
   ========================================================================== */

(function () {
  const VB_W = 640, VB_H = 700, K = 68, LON0 = 33.2, LAT0 = 5.2;
  const X = lon => +((lon - LON0) * K).toFixed(1);
  const Y = lat => +((LAT0 - lat) * K).toFixed(1);
  const ring = pts => 'M' + pts.map(([lo, la]) => `${X(lo)},${Y(la)}`).join('L') + 'Z';
  const open = pts => 'M' + pts.map(([lo, la]) => `${X(lo)},${Y(la)}`).join('L');
  const CAT = { wildlife: '#f2a33a', beaches: '#3cc7d6', mountains: '#b9a3f5', culture: '#ff7f6e', adventure: '#a4e56b' };
  const colour = a => CAT[a.categories[0]] || '#f2a33a';
  const NS = 'http://www.w3.org/2000/svg';
  const ease = t => t < .5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;

  const TURKANA = [[36.05, 4.35], [36.22, 4.1], [36.3, 3.75], [36.42, 3.35], [36.6, 3.0], [36.72, 2.7], [36.55, 2.5], [36.3, 2.62], [36.1, 2.95], [35.98, 3.4], [35.92, 3.9]];
  const VICTORIA = [[33.95, -1.0], [33.9, 0.05], [34.15, 0.0], [34.45, -0.15], [34.8, -0.28], [34.9, -0.42], [34.62, -0.55], [34.35, -0.52], [34.18, -0.85], [34.0, -1.02]];
  const RIFT = [[35.95, 3.7], [35.9, 2.4], [36.0, 1.2], [36.05, 0.1], [36.2, -0.8], [36.28, -1.7], [36.12, -2.5]];
  const CITIES = [{ n: 'Nairobi', lon: 36.82, lat: -1.29 }, { n: 'Mombasa', lon: 39.67, lat: -4.04 }, { n: 'Kisumu', lon: 34.76, lat: -0.09 }];
  const COUNTRY_LABELS = [['UGANDA', 33.5, 1.7, 'start'], ['TANZANIA', 35.55, -3.95, 'start'], ['ETHIOPIA', 38.9, 4.75, 'middle'], ['SOMALIA', 42.45, 1.1, 'end'], ['SOUTH SUDAN', 33.45, 4.95, 'start']];
  const REGION_GLOW = { coast: [40.0, -3.0, 1.5], rift: [35.8, -0.6, 1.5], highlands: [37.0, -0.55, 1.0], south: [37.9, -2.8, 1.5], north: [37.6, 2.3, 2.2] };
  const WASH = [ // soft terrain tints: id, lon, lat, radius (deg), colour, alpha
    ['arid', 38.2, 2.6, 2.8, '#d2b27a', .07], ['arid2', 40.6, 1.2, 1.6, '#d2b27a', .05], ['hi', 37.2, -0.3, 1.3, '#8fe9b0', .1],
    ['rift', 35.7, 0.4, 1.1, '#8fe9b0', .07], ['coast', 39.9, -3.5, 1.4, '#3cc7d6', .1], ['west', 34.6, 0.2, 1.0, '#8fe9b0', .09],
  ];

  function base() {
    const k = KT.geo;
    const grat = [];
    for (let lo = 34; lo <= 42; lo++) grat.push(`<line x1="${X(lo)}" x2="${X(lo)}" y1="0" y2="${VB_H}"/>`);
    for (let la = -5; la <= 5; la++) grat.push(`<line y1="${Y(la)}" y2="${Y(la)}" x1="0" x2="${VB_W}"/>`);
    const gratLab = [];
    for (let lo = 34; lo <= 42; lo += 2) gratLab.push(`<text x="${X(lo) + 4}" y="${VB_H - 8}">${lo}°E</text>`);
    for (let la = -4; la <= 4; la += 2) if (la) gratLab.push(`<text x="6" y="${Y(la) - 4}">${Math.abs(la)}°${la < 0 ? 'S' : 'N'}</text>`);
    const others = Object.entries(k).filter(([n]) => n !== 'kenya' && n !== 'coast').map(([n, r]) => `<path class="kmap__nb" d="${ring(r)}"/>`).join('');
    const coast = open(k.kenya.slice(k.coast[0], k.coast[1] + 1));
    return `
    <svg class="kmap__svg" viewBox="0 0 ${VB_W} ${VB_H}" role="group" aria-label="Map of Kenya showing attraction locations" preserveAspectRatio="xMidYMid slice">
      <defs>
        <linearGradient id="km-sea" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#0d2a21"/><stop offset="1" stop-color="#0a2630"/></linearGradient>
        <linearGradient id="km-land" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#2a7357"/><stop offset="1" stop-color="#1d5a46"/></linearGradient>
        <pattern id="km-wave" width="26" height="14" patternUnits="userSpaceOnUse"><path d="M0 7 Q6.5 2 13 7 T26 7" fill="none" stroke="#9fe0ea" stroke-width=".8" opacity=".16"/></pattern>
        <pattern id="km-dots" width="7" height="7" patternUnits="userSpaceOnUse"><circle cx="1.5" cy="1.5" r=".7" fill="#bff0d2" opacity=".2"/></pattern>
        <radialGradient id="km-glow"><stop offset="0" stop-color="#f2a33a" stop-opacity=".75"/><stop offset="1" stop-color="#f2a33a" stop-opacity="0"/></radialGradient>
        <radialGradient id="km-vig" cx=".5" cy=".5" r=".75"><stop offset=".6" stop-color="#000" stop-opacity="0"/><stop offset="1" stop-color="#000" stop-opacity=".5"/></radialGradient>
        ${WASH.map(([id, , , , c]) => `<radialGradient id="km-w-${id}"><stop offset="0" stop-color="${c}" stop-opacity="1"/><stop offset="1" stop-color="${c}" stop-opacity="0"/></radialGradient>`).join('')}
        <clipPath id="km-clip"><path d="${ring(k.kenya)}"/></clipPath>
        <path id="km-rift" d="${open(RIFT)}"/>
      </defs>
      <g class="kmap__world">
        <rect class="kmap__sea" x="-400" y="-400" width="${VB_W + 800}" height="${VB_H + 800}" fill="url(#km-sea)"/>
        <rect x="-400" y="-400" width="${VB_W + 800}" height="${VB_H + 800}" fill="url(#km-wave)"/>
        <g class="kmap__ripples" fill="none" stroke-linejoin="round" stroke-linecap="round">
          <path d="${coast}" stroke="#7fd6e2" stroke-opacity=".07" stroke-width="46"/><path d="${coast}" stroke="#7fd6e2" stroke-opacity=".08" stroke-width="30"/><path d="${coast}" stroke="#7fd6e2" stroke-opacity=".12" stroke-width="15"/>
        </g>
        ${others}
        <g class="kmap__grat">${grat.join('')}</g>
        <path class="kmap__land" d="${ring(k.kenya)}" fill="url(#km-land)"/>
        <g clip-path="url(#km-clip)">
          <rect width="${VB_W}" height="${VB_H}" fill="url(#km-dots)"/>
          ${WASH.map(([id, lo, la, r]) => `<circle cx="${X(lo)}" cy="${Y(la)}" r="${r * K}" fill="url(#km-w-${id})"/>`).join('')}
          <use href="#km-rift" class="kmap__rift"/>
          <g class="kmap__glows">${Object.entries(REGION_GLOW).map(([id, [lo, la, r]]) => `<circle data-region="${id}" cx="${X(lo)}" cy="${Y(la)}" r="${r * K}" fill="url(#km-glow)"/>`).join('')}</g>
          <path class="kmap__lake" d="${ring(TURKANA)}"/><path class="kmap__lake" d="${ring(VICTORIA)}"/>
        </g>
        <path class="kmap__border-glow" d="${ring(k.kenya)}"/>
        <path class="kmap__border" d="${ring(k.kenya)}"/>
        <text class="kmap__rift-label"><textPath href="#km-rift" startOffset="50%" text-anchor="middle">GREAT RIFT VALLEY</textPath></text>
        <line class="kmap__equator" x1="-400" x2="${VB_W + 400}" y1="${Y(0)}" y2="${Y(0)}"/>
        <text class="kmap__equator-label" x="${X(41.1)}" y="${Y(0) - 6}">EQUATOR</text>
        <g class="kmap__grat-labels">${gratLab.join('')}</g>
        ${COUNTRY_LABELS.map(([t, lo, la, an]) => `<text class="kmap__country" x="${X(lo)}" y="${Y(la)}" text-anchor="${an}">${t}</text>`).join('')}
        <text class="kmap__water" x="${X(42.45)}" y="${Y(-3.5)}" text-anchor="end">Indian Ocean</text>
        <text class="kmap__water kmap__water--lake" x="${X(36.62)}" y="${Y(3.45)}" transform="rotate(-76 ${X(36.62)} ${Y(3.45)})" text-anchor="middle">Lake Turkana</text>
        <text class="kmap__water kmap__water--lake" x="${X(34.2)}" y="${Y(-0.7)}" text-anchor="middle" dy="2">Lake Victoria</text>
        <path class="kmap__route-halo" d=""/><path class="kmap__route" d=""/>
      </g>
      <g class="kmap__cities"></g>
      <g class="kmap__pins"></g>
      <rect class="kmap__vignette" x="0" y="0" width="${VB_W}" height="${VB_H}" fill="url(#km-vig)" pointer-events="none"/>
    </svg>`;
  }

  KT.createMap = function (container, opts = {}) {
    const o = { labels: 'hover', pins: KT.attractions.map(a => a.slug), controls: true, legend: false, ...opts };
    container.classList.add('kmap');
    container.innerHTML = `<div class="kmap__frame">${base()}</div>
      <div class="kmap__tip" role="status" hidden></div>
      <div class="kmap__compass" aria-hidden="true"><svg viewBox="0 0 40 40"><path d="M20 4 L26 22 L20 18 L14 22 Z" fill="#fff"/><path d="M20 36 L14 22 L20 18 L26 22 Z" fill="#fff" opacity=".28"/></svg><span>N</span></div>
      <div class="kmap__scale" aria-hidden="true"><i></i><span>100 km</span></div>
      ${o.controls ? `<div class="kmap__ctrl" role="group" aria-label="Map zoom">
        <button type="button" data-z="in" aria-label="Zoom in">${KT.icon('plus', 18)}</button>
        <button type="button" data-z="out" aria-label="Zoom out">${KT.icon('minus', 18)}</button>
        <button type="button" data-z="reset" aria-label="Reset map">${KT.icon('target', 18)}</button></div>` : ''}
      ${o.legend ? `<ul class="kmap__legend" aria-hidden="true">${Object.entries(CAT).map(([id, c]) => `<li><i style="background:${c}"></i>${KT.categoryName(id)}</li>`).join('')}</ul>` : ''}`;

    const svg = container.querySelector('.kmap__svg');
    const pinLayer = container.querySelector('.kmap__pins');
    const cityLayer = container.querySelector('.kmap__cities');
    const routeEl = container.querySelector('.kmap__route'), haloEl = container.querySelector('.kmap__route-halo');
    const tip = container.querySelector('.kmap__tip');
    const scaleBar = container.querySelector('.kmap__scale');
    let visible = new Set(o.pins), active = o.active || null, routeSlugs = [];
    let vb = { x: 0, y: 0, w: VB_W, h: VB_H }, raf = 0;

    /* pins: [halo, ring, number] + label pill, inside a group that is scaled against the zoom */
    pinLayer.innerHTML = KT.attractions.map(a => `
      <g class="kmap__pin" data-slug="${a.slug}" data-region="${a.region}" tabindex="0" role="button" aria-label="${KT.esc(a.name)}" style="--c:${colour(a)}">
        <g class="kmap__ui">
          <circle class="kmap__pulse" r="13"/><circle class="kmap__halo" r="13"/><circle class="kmap__dot" r="6.5"/><text class="kmap__num" y="3.6" text-anchor="middle"></text>
          <g class="kmap__lab"><rect rx="11" ry="11" height="22" y="-11"/><text y="4">${KT.esc(KT.shortLabel(a))}</text></g>
        </g>
      </g>`).join('');
    cityLayer.innerHTML = CITIES.map(c => `<g class="kmap__city" data-city="${c.n}"><g class="kmap__ui"><rect x="-3" y="-3" width="6" height="6" transform="rotate(45)"/><text x="8" y="3.5">${c.n}</text></g></g>`).join('');

    const pinEls = () => [...pinLayer.querySelectorAll('.kmap__pin')];
    const cityEls = () => [...cityLayer.querySelectorAll('.kmap__city')];
    const zoom = () => VB_W / vb.w;

    /* ---------- view (viewBox) ---------- */
    function applyView() {
      svg.setAttribute('viewBox', `${vb.x.toFixed(2)} ${vb.y.toFixed(2)} ${vb.w.toFixed(2)} ${vb.h.toFixed(2)}`);
      const z = zoom(), inv = 1 / z;
      pinEls().concat(cityEls()).forEach(el => { const g = el.querySelector('.kmap__ui'); g.setAttribute('transform', `scale(${inv.toFixed(4)})`); });
      container.style.setProperty('--zoom', z.toFixed(3));
      container.classList.toggle('is-zoomed', z > 1.05);
      // scale bar: 100 km in px
      const px = container.querySelector('.kmap__frame').clientWidth || 500;
      const w = (100 / 111.32) * K / vb.w * px;
      scaleBar.style.setProperty('--w', Math.max(24, Math.min(160, w)).toFixed(0) + 'px');
    }
    function clampView(v) {
      v.w = Math.min(VB_W, Math.max(VB_W / 5, v.w)); v.h = v.w * VB_H / VB_W;
      v.x = Math.min(VB_W - v.w, Math.max(0, v.x)); v.y = Math.min(VB_H - v.h, Math.max(0, v.y));
      return v;
    }
    function animateTo(target, instant) {
      cancelAnimationFrame(raf); target = clampView({ ...target });
      if (instant || KT.reduceMotion) { vb = target; applyView(); layoutLabels(); return; }
      const from = { ...vb }, t0 = performance.now(), D = 750;
      const step = now => {
        const t = Math.min(1, (now - t0) / D), e = ease(t);
        vb = { x: from.x + (target.x - from.x) * e, y: from.y + (target.y - from.y) * e, w: from.w + (target.w - from.w) * e, h: from.h + (target.h - from.h) * e };
        applyView();
        if (t < 1) raf = requestAnimationFrame(step); else layoutLabels();
      };
      raf = requestAnimationFrame(step);
    }
    function zoomBy(f) {
      const cx = vb.x + vb.w / 2, cy = vb.y + vb.h / 2, w = vb.w / f;
      animateTo({ x: cx - w / 2, y: cy - (w * VB_H / VB_W) / 2, w });
    }
    function fitSlugs(slugs, pad = 1.1) {
      const pts = slugs.map(KT.bySlug).filter(Boolean); if (!pts.length) return { x: 0, y: 0, w: VB_W, h: VB_H };
      const xs = pts.map(a => X(a.lon)), ys = pts.map(a => Y(a.lat)), P = pad * K;
      const minX = Math.min(...xs) - P, maxX = Math.max(...xs) + P, minY = Math.min(...ys) - P, maxY = Math.max(...ys) + P;
      const w = Math.max(maxX - minX, (maxY - minY) * VB_W / VB_H, 260);
      return { x: (minX + maxX) / 2 - w / 2, y: (minY + maxY) / 2 - (w * VB_H / VB_W) / 2, w };
    }

    /* ---------- pins, labels, routes ---------- */
    function labelWidth(el) {
      const t = el.querySelector('.kmap__lab text'); let w = 0;
      try { w = t.getComputedTextLength(); } catch (e) { /* hidden */ }
      return (w || t.textContent.length * 6.8) + 22;
    }
    function layoutLabels() {
      const z = zoom(), placed = [], H = 22;
      const toScreen = (lon, lat) => [(X(lon) - vb.x) * z, (Y(lat) - vb.y) * z];
      const hit = (a, b) => !(a.x2 < b.x1 || a.x1 > b.x2 || a.y2 < b.y1 || a.y1 > b.y2);
      const pins = pinEls().filter(el => visible.has(el.dataset.slug));
      pins.forEach(el => { const a = KT.bySlug(el.dataset.slug), [x, y] = toScreen(a.lon, a.lat); placed.push({ x1: x - 11, x2: x + 11, y1: y - 11, y2: y + 11 }); });
      const order = pins.filter(el => el.classList.contains('show-label')).sort((p, q) => (q.dataset.slug === active) - (p.dataset.slug === active) || KT.bySlug(q.dataset.slug).popularity - KT.bySlug(p.dataset.slug).popularity);
      order.forEach(el => {
        const a = KT.bySlug(el.dataset.slug), [x, y] = toScreen(a.lon, a.lat), w = labelWidth(el);
        const cands = [['r', x + 12, y - H / 2], ['l', x - 12 - w, y - H / 2], ['t', x - w / 2, y - 12 - H], ['b', x - w / 2, y + 12]];
        let pick = null;
        for (const [id, lx, ly] of cands) {
          const r = { x1: lx, x2: lx + w, y1: ly, y2: ly + H };
          const inside = r.x1 >= 2 && r.x2 <= VB_W - 2 && r.y1 >= 2 && r.y2 <= VB_H - 2;
          if (inside && !placed.some(p => hit(r, p))) { pick = { id, lx, ly, r }; break; }
        }
        const lab = el.querySelector('.kmap__lab');
        if (!pick) { lab.classList.add('is-off'); return; }
        lab.classList.remove('is-off'); placed.push(pick.r);
        const rect = lab.querySelector('rect'), txt = lab.querySelector('text');
        rect.setAttribute('width', w); rect.setAttribute('x', pick.lx - x); rect.setAttribute('y', pick.ly - y);
        txt.setAttribute('x', pick.lx - x + 11); txt.setAttribute('y', pick.ly - y + H / 2 + 4);
      });
      // cities fill the gaps, lowest priority
      cityEls().forEach(el => {
        const c = CITIES.find(c => c.n === el.dataset.city), [x, y] = toScreen(c.lon, c.lat), w = c.n.length * 6 + 16;
        const r = { x1: x - 4, x2: x + w, y1: y - 9, y2: y + 9 };
        const ok = r.x2 <= VB_W - 2 && r.x1 >= 0 && r.y1 >= 0 && r.y2 <= VB_H && !placed.some(p => hit(r, p));
        el.classList.toggle('is-off', !ok);
        el.style.display = (x < 0 || y < 0 || x > VB_W || y > VB_H) ? 'none' : '';
        if (ok) placed.push(r);
      });
    }

    function render() {
      pinEls().forEach(el => {
        const s = el.dataset.slug, a = KT.bySlug(s);
        el.setAttribute('transform', `translate(${X(a.lon)} ${Y(a.lat)})`);
        el.classList.toggle('is-hidden', !visible.has(s));
        el.classList.toggle('is-active', s === active);
        el.classList.toggle('show-label', visible.has(s) && (o.labels === 'always' || (o.labels === 'active' && s === active)));
        el.setAttribute('tabindex', visible.has(s) ? '0' : '-1');
        const n = routeSlugs.indexOf(s); el.querySelector('.kmap__num').textContent = n >= 0 ? n + 1 : '';
        el.classList.toggle('has-num', n >= 0);
      });
      cityEls().forEach(el => { const c = CITIES.find(c => c.n === el.dataset.city); el.setAttribute('transform', `translate(${X(c.lon)} ${Y(c.lat)})`); });
      const act = pinLayer.querySelector(`[data-slug="${active}"]`); if (act) pinLayer.appendChild(act);
      applyView(); layoutLabels();
    }

    function smooth(pts) { // cardinal spline through pts → cubic béziers
      if (pts.length === 2) { const [a, b] = pts, mx = (a[0] + b[0]) / 2, my = (a[1] + b[1]) / 2, dx = b[0] - a[0], dy = b[1] - a[1]; return `M${a} Q${mx - dy * .18},${my + dx * .18} ${b}`; }
      let d = `M${pts[0]}`;
      for (let i = 0; i < pts.length - 1; i++) {
        const p0 = pts[i - 1] || pts[i], p1 = pts[i], p2 = pts[i + 1], p3 = pts[i + 2] || p2;
        d += ` C${p1[0] + (p2[0] - p0[0]) / 6},${p1[1] + (p2[1] - p0[1]) / 6} ${p2[0] - (p3[0] - p1[0]) / 6},${p2[1] - (p3[1] - p1[1]) / 6} ${p2[0]},${p2[1]}`;
      }
      return d;
    }
    function drawRoute(slugs) {
      routeSlugs = [];
      const pts = (slugs || []).map(KT.bySlug).filter(Boolean).filter((a, i, arr) => !i || a.slug !== arr[i - 1].slug);
      pts.forEach(a => { if (!routeSlugs.includes(a.slug)) routeSlugs.push(a.slug); });
      if (pts.length < 2) { routeEl.setAttribute('d', ''); haloEl.setAttribute('d', ''); render(); return; }
      const d = smooth(pts.map(a => [X(a.lon), Y(a.lat)]));
      routeEl.setAttribute('d', d); haloEl.setAttribute('d', d);
      const len = routeEl.getTotalLength ? routeEl.getTotalLength() : 1000;
      routeEl.style.setProperty('--len', len);
      routeEl.classList.remove('is-drawn'); void routeEl.getBoundingClientRect(); routeEl.classList.add('is-drawn');
      render();
    }

    /* ---------- hover card ---------- */
    function showTip(el) {
      const a = KT.bySlug(el.dataset.slug); if (!a) return;
      tip.innerHTML = `<img src="${KT.img.scene(a.slug)}" alt="" width="64" height="48"><span><strong>${KT.esc(KT.shortLabel(a))}</strong><small>${KT.esc(KT.regionName(a.region))}</small></span>`;
      tip.hidden = false;
      const p = el.getBoundingClientRect(), c = container.getBoundingClientRect(), tw = tip.offsetWidth || 190;
      const x = p.left + p.width / 2 - c.left, below = p.top - c.top < 90;
      tip.classList.toggle('is-below', below);
      tip.style.left = Math.max(tw / 2 + 8, Math.min(c.width - tw / 2 - 8, x)) + 'px';
      tip.style.top = (below ? p.bottom - c.top + 10 : p.top - c.top - 10) + 'px';
    }
    const hideTip = () => { tip.hidden = true; };
    const canHover = o.labels !== 'always';
    pinLayer.addEventListener('pointerover', e => { const p = e.target.closest('.kmap__pin'); if (p && !p.classList.contains('is-hidden') && e.pointerType !== 'touch') showTip(p); });
    pinLayer.addEventListener('pointerout', hideTip);
    pinLayer.addEventListener('focusin', e => { const p = e.target.closest('.kmap__pin'); if (p && canHover) showTip(p); });
    pinLayer.addEventListener('focusout', hideTip);
    const select = e => {
      const p = e.target.closest('.kmap__pin'); if (!p || p.classList.contains('is-hidden')) return;
      if (e.type === 'keydown' && e.key !== 'Enter' && e.key !== ' ') return;
      if (dragged) return; e.preventDefault(); o.onSelect && o.onSelect(p.dataset.slug);
    };
    pinLayer.addEventListener('click', select);
    pinLayer.addEventListener('keydown', select);

    /* ---------- controls + drag to pan ---------- */
    container.querySelector('.kmap__ctrl')?.addEventListener('click', e => {
      const b = e.target.closest('[data-z]'); if (!b) return;
      if (b.dataset.z === 'in') zoomBy(1.6); else if (b.dataset.z === 'out') zoomBy(1 / 1.6); else animateTo({ x: 0, y: 0, w: VB_W });
    });
    let drag = null, dragged = false;
    svg.addEventListener('pointerdown', e => { if (zoom() < 1.05 || e.target.closest('.kmap__pin')) return; drag = { x: e.clientX, y: e.clientY, vx: vb.x, vy: vb.y, id: e.pointerId }; dragged = false; });
    svg.addEventListener('pointermove', e => {
      if (!drag) return; const dx = e.clientX - drag.x, dy = e.clientY - drag.y;
      if (!dragged && Math.hypot(dx, dy) < 4) return; dragged = true; svg.setPointerCapture(drag.id); hideTip();
      const k = vb.w / svg.clientWidth; vb = clampView({ ...vb, x: drag.vx - dx * k, y: drag.vy - dy * k }); applyView();
    });
    const end = () => { if (drag) { drag = null; layoutLabels(); setTimeout(() => { dragged = false; }, 30); } };
    svg.addEventListener('pointerup', end); svg.addEventListener('pointercancel', end);
    if ('ResizeObserver' in window) new ResizeObserver(() => { applyView(); layoutLabels(); }).observe(container);

    render(); drawRoute(o.route);
    return {
      setPins(list) { visible = new Set(list); render(); },
      setActive(slug) { active = slug; render(); },
      setRegion(id) {
        container.dataset.region = id || '';
        const slugs = id ? KT.attractions.filter(a => a.region === id).map(a => a.slug) : null;
        animateTo(slugs ? fitSlugs(slugs) : { x: 0, y: 0, w: VB_W });
      },
      fit(slugs) { animateTo(fitSlugs(slugs, 1.4), true); },
      setRoute(list) { drawRoute(list); animateTo(fitSlugs(routeSlugs, 1.2)); },
      setLabels(mode) { o.labels = mode; render(); },
    };
  };
})();
