/* ==========================================================================
   motion.js — scroll-reveal for the whole site.
   Tags common blocks with data-reveal, then fades/lifts them in once as they
   enter the viewport. Siblings stagger by 70ms. Respects reduced motion.
   Elements are released (attribute removed) after they finish, so normal
   hover transitions on cards are never slowed down.
   ========================================================================== */

(function () {
  const TARGETS = [
    '.section-head', '.featured__item', '.cat-item', '.destinations__stage', '.destinations__filters', '.regions__map', '.regions__panel',
    '.exp-list > li', '.itineraries__tabs', '.day', '.itineraries__map', '.stories__slider', '.cta__inner',
    '.xtools', '.xcard, .xgrid > .card', '.asec', '.special li', '.todo li', '.modes li', '.facs li', '.near > .card', '.anext__inner',
  ].join(',');

  if (KT.reduceMotion || !('IntersectionObserver' in window)) return;
  document.documentElement.classList.add('reveal-ready');

  const io = new IntersectionObserver(entries => entries.forEach(en => {
    if (!en.isIntersecting) return;
    const el = en.target; io.unobserve(el);
    el.classList.add('is-in');
    setTimeout(() => { el.removeAttribute('data-reveal'); el.classList.remove('is-in'); el.style.removeProperty('--d'); }, 1400);
  }), { rootMargin: '0px 0px -8% 0px', threshold: .08 });

  function scan() {
    const fresh = [...document.querySelectorAll(TARGETS)].filter(el => !el.dataset.revealed && !el.closest('.hero'));
    fresh.forEach(el => {
      el.dataset.revealed = '1';
      // elements already on screen at load reveal straight away; below-fold ones wait
      const sibs = el.parentElement ? [...el.parentElement.children].filter(c => c.matches(TARGETS)) : [el];
      el.style.setProperty('--d', Math.min(sibs.indexOf(el), 6) * 70 + 'ms');
      el.setAttribute('data-reveal', el.matches('.card, .featured__item, .near > .card') ? 'scale' : '');
      io.observe(el);
    });
  }

  const start = () => requestAnimationFrame(scan);
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', start); else start();

  // content rendered later (filters, tabs, "show more") gets revealed too
  let t; new MutationObserver(() => { clearTimeout(t); t = setTimeout(scan, 60); }).observe(document.body, { childList: true, subtree: true });
})();
