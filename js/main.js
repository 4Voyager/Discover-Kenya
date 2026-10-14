/* ==========================================================================
   main.js — shared helpers + site header/footer used on every page.
   ========================================================================== */

window.KT = window.KT || {};

/* ---------- tiny utilities ---------- */
KT.qs = (sel, root = document) => root.querySelector(sel);
KT.qsa = (sel, root = document) => [...root.querySelectorAll(sel)];
KT.reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
KT.debounce = (fn, ms = 180) => { let t; return (...a) => { clearTimeout(t); t = setTimeout(() => fn(...a), ms); }; };
KT.esc = s => String(s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
KT.url = slug => `attraction.html?slug=${encodeURIComponent(slug)}`;
KT.pad = n => String(n).padStart(2, '0');

/* ---------- reusable attraction card ---------- */
KT.card = (a, { variant = '', extra = '' } = {}) => `
  <a class="card ${variant}" href="${KT.url(a.slug)}" data-slug="${a.slug}">
    <span class="card__media"><img src="${KT.img.scene(a.slug)}" alt="" loading="lazy" width="1600" height="900"></span>
    <span class="card__body">
      <span class="card__meta">${KT.esc(KT.regionName(a.region))}</span>
      <span class="card__title">${KT.esc(KT.shortLabel(a))}</span>
      <span class="card__text">${KT.esc(a.summary)}</span>
      ${extra}
    </span>
    <span class="card__go" aria-hidden="true">${KT.icon('arrow-up-right', 18)}</span>
  </a>`;

/* ---------- header ---------- */
KT.renderHeader = function () {
  const host = KT.qs('[data-site-header]'); if (!host) return;
  const page = document.body.dataset.page || 'home';
  const link = (href, label, key) => `<li><a href="${href}"${page === key ? ' aria-current="page"' : ''}>${label}</a></li>`;
  host.className = 'site-header';
  host.innerHTML = `
    <div class="site-header__inner">
      <a class="brand" href="index.html" aria-label="Discover Kenya — home">
        <svg class="brand__mark" viewBox="0 0 40 40" aria-hidden="true"><circle cx="20" cy="20" r="19" fill="currentColor" opacity=".14"/><path d="M20 33V22M20 24c-3-1-5-3-7-5M20 22c3-1 6-3 8-6" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" fill="none"/><ellipse cx="20" cy="14" rx="12" ry="3.2" fill="currentColor"/><ellipse cx="11" cy="17.5" rx="6" ry="2" fill="currentColor"/><ellipse cx="29" cy="15.5" rx="6.5" ry="2" fill="currentColor"/></svg>
        <span class="brand__name" translate="no">Discover<b>Kenya</b></span>
      </a>
      <nav class="site-nav" id="site-nav" aria-label="Main">
        <ul>
          ${link('index.html', 'Home', 'home')}
          ${link('explore.html', 'Explore', 'explore')}
          ${link('index.html#itineraries', 'Itineraries', 'x1')}
          ${link('index.html#stories', 'Travel notes', 'x2')}
        </ul>
        <a class="btn btn--sm btn--amber site-nav__cta" href="explore.html">Plan a trip</a>
      </nav>
      <button class="nav-toggle" type="button" aria-label="Open menu" aria-expanded="false" aria-controls="site-nav">${KT.icon('menu', 24)}</button>
    </div>`;

  const toggle = KT.qs('.nav-toggle', host);
  toggle.addEventListener('click', () => {
    const open = host.classList.toggle('is-open');
    toggle.setAttribute('aria-expanded', open); toggle.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
    toggle.innerHTML = KT.icon(open ? 'x' : 'menu', 24);
  });
  KT.qsa('.site-nav a', host).forEach(a => a.addEventListener('click', () => { host.classList.remove('is-open'); toggle.setAttribute('aria-expanded', 'false'); toggle.innerHTML = KT.icon('menu', 24); }));

  const onScroll = () => host.classList.toggle('is-solid', window.scrollY > 40);
  onScroll(); window.addEventListener('scroll', onScroll, { passive: true });
};

/* ---------- footer ---------- */
KT.renderFooter = function () {
  const host = KT.qs('[data-site-footer]'); if (!host) return;
  host.className = 'site-footer';
  host.innerHTML = `
    <div class="site-footer__inner">
      <div class="site-footer__brand">
        <p class="site-footer__logo">Discover<b>Kenya</b></p>
        <p>A guide to the places worth the journey: wildlife, coast, mountains and living culture.</p>
      </div>
      <nav aria-label="Browse by category">
        <h2 class="site-footer__h">Browse</h2>
        <ul>${KT.categories.map(c => `<li><a href="explore.html?cat=${c.id}">${c.label}</a></li>`).join('')}</ul>
      </nav>
      <nav aria-label="Browse by region">
        <h2 class="site-footer__h">Regions</h2>
        <ul>${KT.regions.map(r => `<li><a href="explore.html?region=${r.id}">${r.label}</a></li>`).join('')}</ul>
      </nav>
      <nav aria-label="Official sources">
        <h2 class="site-footer__h">Official sources</h2>
        <ul>
          <li><a href="https://www.magicalkenya.com/" target="_blank" rel="noopener">Kenya Tourism Board ${KT.icon('external', 14)}</a></li>
          <li><a href="https://www.kws.go.ke/" target="_blank" rel="noopener">Kenya Wildlife Service ${KT.icon('external', 14)}</a></li>
          <li><a href="https://www.museums.or.ke/" target="_blank" rel="noopener">National Museums of Kenya ${KT.icon('external', 14)}</a></li>
        </ul>
      </nav>
    </div>
    <p class="site-footer__legal">Fees, hours and travel conditions change: confirm with the official source before you travel.</p>`;
};

/* ---------- generic: elements that reveal once when scrolled into view ---------- */
KT.observeOnce = function (selector, cls = 'is-in', margin = '0px 0px -10% 0px') {
  const els = KT.qsa(selector); if (!els.length) return;
  if (!('IntersectionObserver' in window) || KT.reduceMotion) { els.forEach(e => e.classList.add(cls)); return; }
  const io = new IntersectionObserver(entries => entries.forEach(en => { if (en.isIntersecting) { en.target.classList.add(cls); io.unobserve(en.target); } }), { rootMargin: margin });
  els.forEach(e => io.observe(e));
};

document.addEventListener('DOMContentLoaded', () => { KT.renderHeader(); KT.renderFooter(); });
