// The page's only script: mobile menu, project carousel, and the project dialogs (also opened by #p-... links).
(() => {
  const $ = (s) => document.querySelector(s);

  const drawer = $('#sheet-drawer');
  const burger = $('#open-sheet-btn');
  const closeDrawer = () => drawer.close();
  burger?.addEventListener('click', () => { drawer.showModal(); burger.setAttribute('aria-expanded', 'true'); });
  drawer?.addEventListener('close', () => burger.setAttribute('aria-expanded', 'false'));
  $('#close-sheet-btn')?.addEventListener('click', closeDrawer);
  drawer?.addEventListener('click', (e) => { if (e.target === drawer || e.target.closest('.sheet-links a')) closeDrawer(); });

  const scroller = $('#work-scroller');
  $('#work-prev')?.addEventListener('click', () => scroller.scrollBy({ left: -400, behavior: 'smooth' }));
  $('#work-next')?.addEventListener('click', () => scroller.scrollBy({ left: 400, behavior: 'smooth' }));

  const still = matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Built slider: arrows, dots, swipe, and a slow autoplay that stops once the visitor takes over.
  const slider = $('#built-slider');
  if (slider) {
    const slides = [...slider.querySelectorAll('.built-slide')];
    const dots = [...document.querySelectorAll('.built-dot')];
    const cap = slider.querySelector('.built-cap');
    let at = 0;
    let timer = 0;
    const show = (i) => {
      at = (i + slides.length) % slides.length;
      slides.forEach((el, k) => el.classList.toggle('is-active', k === at));
      dots.forEach((el, k) => el.classList.toggle('is-active', k === at));
      cap.textContent = slides[at].alt;
      // the address bar follows the slide: the live site, the repository, or (for a video) the project's own pop-up
      const url = slider.querySelector('.built-url');
      const { href, host, project } = slides[at].dataset;
      url.href = href;
      url.firstElementChild.textContent = host;
      if (project) { url.dataset.open = project; url.removeAttribute('target'); } else { delete url.dataset.open; url.target = '_blank'; }
    };
    const take = (i) => { clearInterval(timer); show(i); };
    slider.querySelector('.built-prev').addEventListener('click', () => take(at - 1));
    slider.querySelector('.built-next').addEventListener('click', () => take(at + 1));
    dots.forEach((el, k) => el.addEventListener('click', () => take(k)));
    slider.addEventListener('keydown', (e) => { if (e.key === 'ArrowLeft') take(at - 1); if (e.key === 'ArrowRight') take(at + 1); });
    let downX = null;
    slider.addEventListener('pointerdown', (e) => { downX = e.clientX; });
    slider.addEventListener('pointerup', (e) => { if (downX !== null && Math.abs(e.clientX - downX) > 40) take(at + (e.clientX < downX ? 1 : -1)); downX = null; });
    if (!still) timer = setInterval(() => { if (!slider.matches(':hover')) show(at + 1); }, 4500);
  }

  // Sections rise in as they scroll into view; grid children follow one after another.
  // Checked in the scroll handler, not an IntersectionObserver: a jump down the page must also reveal what it skipped.
  let pending = [];
  if (!still) {
    const groups = ['.built-head', '.built-stage', '.intro-side', '.cells', '.work-head', '.work-card', '.services-title', '.services .row', '.proof-copy', '.stat', '.process-sticky', '.about', '.blog .display', '.post', '.cert-all', '.faq .display', '.qa', '.cta-inner'];
    for (const sel of groups) {
      document.querySelectorAll(sel).forEach((el, i) => {
        if (el.closest('dialog')) return;
        el.classList.add('reveal');
        el.style.setProperty('--d', `${Math.min(i, 5) * 0.07}s`);
        pending.push(el);
      });
    }
  }

  // Intro statement: words light up as the block moves up the screen.
  const statement = $('.statement');
  const words = [];
  if (statement && !still) {
    const wrap = (node) => {
      for (const child of [...node.childNodes]) {
        if (child.nodeType === 3) {
          const frag = document.createDocumentFragment();
          for (const part of child.textContent.split(/(\s+)/)) {
            if (!part.trim()) { frag.append(part); continue; }
            const w = document.createElement('span');
            w.className = 'w';
            w.textContent = part;
            words.push(w);
            frag.append(w);
          }
          child.replaceWith(frag);
        } else wrap(child);
      }
    };
    wrap(statement);
    statement.querySelector('.dim')?.classList.remove('dim');
  }

  // Hardest parts: the card nearest the middle of the screen is the active one.
  const steps = [...document.querySelectorAll('#hard-steps .step')];
  const stackCards = [...document.querySelectorAll('.stack-card')];
  let queued = false;
  const onScroll = () => {
    queued = false;
    const vh = innerHeight;
    pending = pending.filter((el) => el.getBoundingClientRect().top > vh * 0.9 || (el.classList.add('in'), false));
    if (words.length) {
      const r = statement.getBoundingClientRect();
      const t = Math.min(1, Math.max(0, (vh * 0.85 - r.top) / (vh * 0.5 + r.height)));
      const lit = Math.round(t * words.length);
      words.forEach((w, i) => w.classList.toggle('lit', i < lit));
    }
    if (steps.length) {
      let best = 0;
      let gap = Infinity;
      steps.forEach((el, i) => {
        const r = el.getBoundingClientRect();
        const d = Math.abs(r.top + r.height / 2 - vh / 2);
        if (d < gap) { gap = d; best = i; }
      });
      steps.forEach((el, i) => el.classList.toggle('is-active', i === best));
      $('#hard-no').textContent = String(best + 1).padStart(2, '0');
      $('#hard-bar').style.width = `${((best + 1) / steps.length) * 100}%`;
    }
    // The nav shows which part of the page is on screen.
    let here = '';
    for (const id of ['work', 'experience', 'certifications', 'faq']) if (document.getElementById(id).getBoundingClientRect().top <= vh * 0.4) here = id;
    for (const a of document.querySelectorAll('.nav-links > a')) a.toggleAttribute('aria-current', a.getAttribute('href') === `#${here}`);
    document.querySelector('.nav-dropdown-trigger').classList.toggle('is-current', here === 'work');
    // Stacked project cards shrink a little as the next card covers them.
    if (!still && innerWidth > 960) {
      stackCards.forEach((el, i) => {
        const next = stackCards[i + 1];
        if (!next) return;
        const cover = Math.min(1, Math.max(0, 1 - (next.getBoundingClientRect().top - el.getBoundingClientRect().top) / el.offsetHeight));
        el.style.transform = `scale(${(1 - cover * 0.05).toFixed(4)})`;
        el.style.filter = `brightness(${(1 - cover * 0.45).toFixed(3)})`;
      });
    }
  };
  addEventListener('scroll', () => { if (!queued) { queued = true; requestAnimationFrame(onScroll); } }, { passive: true });
  addEventListener('resize', onScroll);
  onScroll();

  // Email: every mailto link opens a small menu (Gmail, mail app, copy), since mailto does nothing without a mail app.
  const menu = $('#email-menu');
  if (menu) {
    document.addEventListener('click', (e) => {
      const a = e.target.closest('a[href^="mailto:"]:not([data-direct])');
      if (!a) return;
      e.preventDefault();
      menu.showModal();
    });
    menu.querySelector('.email-close').addEventListener('click', () => menu.close());
    menu.addEventListener('click', (e) => { if (e.target === menu) menu.close(); });
    const copy = $('#email-copy');
    copy.addEventListener('click', async () => {
      const label = copy.querySelector('span');
      try { await navigator.clipboard.writeText(copy.dataset.email); label.textContent = 'Copied'; }
      catch { label.textContent = copy.dataset.email; } // no clipboard access: show the address to select by hand
      setTimeout(() => { label.textContent = 'Copy address'; }, 2500);
    });
  }

  const open = (id) => {
    const d = document.getElementById(id);
    if (!(d instanceof HTMLDialogElement) || !d.classList.contains('project')) return false;
    if (!d.open) d.showModal();
    history.replaceState(null, '', `#${id}`);
    return true;
  };
  document.addEventListener('click', (e) => {
    const a = e.target.closest('[data-open]');
    if (a && open(a.dataset.open)) e.preventDefault();
  });
  for (const d of document.querySelectorAll('dialog.project')) {
    d.querySelector('.project-close').addEventListener('click', () => d.close());
    d.addEventListener('click', (e) => { if (e.target === d) d.close(); }); // a click on the backdrop lands on the dialog itself
    d.addEventListener('close', () => {
      d.querySelector('video')?.pause();
      if (location.hash === `#${d.id}`) history.replaceState(null, '', location.pathname + location.search);
    });
  }
  const fromHash = () => location.hash.length > 1 && open(decodeURIComponent(location.hash.slice(1)));
  fromHash();
  addEventListener('hashchange', fromHash);
})();
