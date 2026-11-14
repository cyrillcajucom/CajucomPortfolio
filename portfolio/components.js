// Page sections, adapted from the studio-ui component library. Each takes data already mapped by build.mjs
// and escapes every data string with esc(); markup in here is the only raw HTML.
import { esc } from './data.mjs';

const ext = 'target="_blank" rel="noopener"';
const lines = (a, b) => `<span class="line">${esc(a)}</span><span class="line chrome">${esc(b)}</span>`;
const pills = (tags) => `<div class="tag-row">${tags.map((t) => `<span class="tag-pill">${esc(t)}</span>`).join('')}</div>`;
const MONOGRAM = `<svg class="monogram" viewBox="0 0 40 40" width="32" height="32" aria-hidden="true"><rect x="1" y="1" width="38" height="38" rx="11" fill="none" stroke="currentColor" stroke-opacity=".35"/><text x="20" y="26" text-anchor="middle" fill="currentColor" font-family="Geist Mono, monospace" font-weight="500" font-size="15" letter-spacing="-.5">CC</text></svg>`;

export function Navbar({ projects, email }) {
  const links = [['Experience', '#experience'], ['Certifications', '#certifications'], ['FAQ', '#faq']];
  return `
  <header id="nav" class="nav">
    <div class="nav-wrap">
      <div class="nav-pill glass">
        <a class="nav-logo" href="#hero" aria-label="Cyrill Cajucom, back to top">${MONOGRAM}<span>Cyrill Cajucom</span></a>
        <nav class="nav-links" aria-label="Primary">
          <div class="nav-dropdown">
            <button type="button" class="nav-dropdown-trigger">Work <span aria-hidden="true">⌄</span></button>
            <div class="nav-dropdown-menu">
              ${projects.map((p) => `
                <a class="nav-dropdown-item" href="#${p.id}" data-open="${p.id}">
                  <strong>${esc(p.t)}</strong>
                  <span>${esc(p.category)}</span>
                </a>`).join('')}
            </div>
          </div>
          ${links.map(([l, h]) => `<a href="${h}">${l}</a>`).join('')}
        </nav>
        <div class="nav-side">
          <a class="nav-aux" href="/">Room version</a>
          <a class="btn btn-solid btn-sm" href="mailto:${esc(email)}"><span>Email me</span></a>
          <button class="nav-burger" id="open-sheet-btn" type="button" aria-label="Open menu" aria-expanded="false" aria-controls="sheet-drawer">
            <span></span><span></span>
          </button>
        </div>
      </div>
    </div>
  </header>
  <dialog id="sheet-drawer" class="sheet-dialog" aria-label="Site navigation menu">
    <div class="sheet-panel glass">
      <div class="sheet-head">
        <span class="nav-logo">${MONOGRAM}<span>Cyrill Cajucom</span></span>
        <button type="button" id="close-sheet-btn" class="sheet-close" aria-label="Close menu">✕</button>
      </div>
      <nav class="sheet-links" aria-label="Mobile navigation">
        <a href="#work">Projects</a>
        ${links.map(([l, h]) => `<a href="${h}">${l}</a>`).join('')}
        <a href="#cta">Contact</a>
        <a href="/">Room version</a>
      </nav>
    </div>
  </dialog>`;
}

export function Hero({ badge, line1, line2, sub, meta, email }) {
  return `
  <section id="hero" class="hero">
    <div class="hero-media">
      <canvas class="hero-clouds" aria-hidden="true"></canvas>
      <div class="hero-shade"></div>
    </div>
    <div class="hero-inner">
      <span class="chip glass">${esc(badge)}</span>
      <h1 class="hero-title">${lines(line1, line2)}</h1>
      <p class="hero-sub">${esc(sub)}</p>
      <div class="hero-ctas">
        <a class="btn btn-solid" href="#work"><span>View projects</span></a>
        <a class="btn btn-glass glass" href="mailto:${esc(email)}"><span>Email me</span></a>
      </div>
      <div class="hero-meta">${meta.map((m) => `<span>${esc(m.toUpperCase())}</span>`).join('')}</div>
    </div>
  </section>`;
}

export function TrustedMarquee({ label, row1, row2 }) {
  const track = (items) => [...items, ...items].map((n) => `<span class="name">${esc(n)}</span><i class="sep" aria-hidden="true"></i>`).join('');
  return `
  <section id="trusted" class="trusted" aria-label="${esc(label)}">
    <p class="trusted-label">${esc(label)}</p>
    <div class="marquee">
      <div class="marquee-row" data-dir="1"><div class="marquee-track">${track(row1)}</div></div>
      <div class="marquee-row" data-dir="-1"><div class="marquee-track">${track(row2)}</div></div>
    </div>
  </section>`;
}

export function BuiltShowcase({ chip, note, slides }) {
  const first = slides[0];
  return `
  <section id="built" class="built">
    <div class="built-head">
      <span class="chip glass"><i class="dot"></i>${esc(chip)}</span>
      <h2 class="display"><span class="line">Built <span class="chrome">like this.</span></span></h2>
    </div>
    <div class="built-stage">
      <div class="device glass built-device" id="built-slider" role="group" aria-roledescription="carousel" aria-label="Screens from my projects">
        <div class="device-bar">
          <span class="lights"><i></i><i></i><i></i></span>
          <a class="url glass built-url" href="${esc(first.href)}" ${ext}><span>${esc(first.host)}</span> ↗</a>
          <span class="bar-end"></span>
        </div>
        <div class="device-screen built-screen">
          ${slides.map((s, i) => `<img class="built-slide${i ? '' : ' is-active'}" src="${s.src}" alt="${esc(s.cap)}" data-href="${esc(s.href)}" data-host="${esc(s.host)}"${s.open ? ` data-project="${s.open}"` : ''} width="1280" height="800"${i ? ' loading="lazy"' : ''}>`).join('')}
          <button type="button" class="carousel-btn built-prev" aria-label="Previous screen">‹</button>
          <button type="button" class="carousel-btn built-next" aria-label="Next screen">›</button>
          <p class="built-cap glass" aria-live="polite">${esc(first.cap)}</p>
        </div>
      </div>
      <div class="built-dots">
        ${slides.map((s, i) => `<button type="button" class="built-dot${i ? '' : ' is-active'}" aria-label="Screen ${i + 1}: ${esc(s.cap)}"></button>`).join('')}
      </div>
    </div>
    <p class="built-sub">${esc(note)}</p>
  </section>`;
}

export function IntroServices({ statement, dim, lede, cells }) {
  return `
  <section id="intro" class="intro wrap">
    <div class="intro-grid">
      <h2 class="statement">${esc(statement)} <span class="dim">${esc(dim)}</span></h2>
      <div class="intro-side">
        <p class="lede">${esc(lede)}</p>
        <div class="text-links"><a href="#work">All projects →</a></div>
      </div>
    </div>
    <div class="cells glass">
      ${cells.map((c) => `
        <a class="cell" href="#${c.id}" data-open="${c.id}">
          <div class="cell-top"><span class="tag">${esc(c.tag)}</span><span class="cell-arrow" aria-hidden="true">↗</span></div>
          <div><span class="cell-label">${esc(c.title)}</span><span class="cell-sub">${esc(c.sub)}</span></div>
        </a>`).join('')}
    </div>
  </section>`;
}

export function WorkShowcase({ eyebrow, line1, line2, featured, carousel }) {
  const live = (p) => (p.live ? '<span class="live-pill">LIVE</span>' : '');
  return `
  <section id="work" class="work">
    <div class="wrap work-head">
      <div>
        <span class="eyebrow">${esc(eyebrow)}</span>
        <h2 class="display">${lines(line1, line2)}</h2>
      </div>
    </div>
    <div class="stack wrap">
      ${featured.map((p, i) => `
        <a class="stack-card" style="--i:${i}" href="#${p.id}" data-open="${p.id}">
          ${live(p)}
          <img src="${p.card}" alt="${esc(p.t)}" loading="lazy">
          <div class="stack-meta glass">
            <span class="stack-cat">${esc(p.category)}</span>
            <h3>${esc(p.t)}</h3>
            ${pills(p.tags)}
          </div>
        </a>`).join('')}
    </div>
    <div class="wrap work-carousel-wrap">
      <div class="carousel-controls">
        <button type="button" class="carousel-btn" id="work-prev" aria-label="Previous projects">‹</button>
        <button type="button" class="carousel-btn" id="work-next" aria-label="Next projects">›</button>
      </div>
      <div class="work-carousel" id="work-scroller">
        ${carousel.map((p) => `
          <a class="work-card" href="#${p.id}" data-open="${p.id}">
            <div class="work-card-media">${live(p)}<img src="${p.card}" alt="${esc(p.t)}" loading="lazy"></div>
            <span class="stack-cat">${esc(p.category)}</span>
            <h4>${esc(p.t)}</h4>
            ${pills(p.tags)}
          </a>`).join('')}
      </div>
    </div>
  </section>`;
}

export function ServicesList({ line1, line2, rows }) {
  return `
  <section id="experience" class="services wrap">
    <h2 class="display services-title">${lines(line1, line2)}</h2>
    <div class="rows">
      ${rows.map((r) => `
        <article class="row">
          <div class="row-head">
            ${r.logo ? `<img class="row-logo" src="${r.logo}" alt="" width="48" height="48" loading="lazy">` : ''}
            <div><h3>${esc(r.h)}</h3><span class="row-meta">${esc(r.m)}</span></div>
          </div>
          <div class="row-body">
            ${r.first ? `<p>${esc(r.first)}</p>` : ''}
            ${r.rest.length ? `
              <details class="row-more">
                <summary>All ${r.rest.length + 1}</summary>
                <ul>${r.rest.map((d) => `<li>${esc(d)}</li>`).join('')}</ul>
              </details>` : ''}
          </div>
        </article>`).join('')}
    </div>
  </section>`;
}

export function ProofStats({ lead, body, stats }) {
  return `
  <section id="proof" class="proof">
    <div class="wrap-narrow proof-copy">
      <p class="proof-lead chrome">${esc(lead)}</p>
      <p class="proof-body">${esc(body)}</p>
    </div>
    <div class="wrap">
      <div class="stats glass">
        ${stats.map((s) => `
          <div class="stat">
            <span class="stat-num">${esc(s.num)}</span>
            <span class="stat-label">${esc(s.label)}</span>
            <p>${esc(s.desc)}</p>
          </div>`).join('')}
      </div>
    </div>
  </section>`;
}

export function WhyUsBento({ eyebrow, line1, line2, tiles, photo }) {
  return `
  <section id="why" class="why wrap">
    <div class="process hard">
      <div class="process-side">
        <div class="process-sticky">
          <span class="eyebrow">${esc(eyebrow)}</span>
          <h2 class="display">${lines(line1, line2)}</h2>
          <span class="hard-no chrome" id="hard-no" aria-hidden="true">01</span>
          <div class="hard-bar" aria-hidden="true"><i id="hard-bar"></i></div>
        </div>
      </div>
      <ol class="steps" id="hard-steps">
        ${tiles.map((t, i) => `
          <li class="step glass${i ? '' : ' is-active'}">
            <a href="#${t.id}" data-open="${t.id}">
              <span class="step-label">${esc(t.project)}</span>
              <h3>${esc(t.title)}</h3>
              <p>${esc(t.desc)}</p>
            </a>
          </li>`).join('')}
      </ol>
    </div>
    <article class="tile tile-photo" style="background-image:linear-gradient(90deg,#050506 35%,rgba(5,5,6,.6) 60%,rgba(5,5,6,0) 85%),url('${photo.src}')">
      <div class="tile-photo-inner glass">
        <h3>${esc(photo.title)}</h3>
        ${photo.lines.map((l) => `<p>${esc(l)}</p>`).join('')}
      </div>
    </article>
  </section>`;
}

const MAIL_ICON = '<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="3" y="5" width="18" height="14" rx="3"></rect><path d="m4 7 8 6 8-6"></path></svg>';
const IN_ICON = '<svg viewBox="0 0 24 24" width="17" height="17" fill="currentColor" aria-hidden="true"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-4 0v7h-4v-7a6 6 0 0 1 6-6z"></path><rect x="2" y="9" width="4" height="12"></rect><circle cx="4" cy="4" r="2"></circle></svg>';

// Floating contact pill. Not a live chat: it opens the visitor's mail app or LinkedIn messages.
export function MessagePill({ links }) {
  return `
  <div id="chat-bar" class="chat-bar glass" role="region" aria-label="Message me">
    <span class="chat-status">Message me</span>
    <a class="chat-icon" href="${esc(links.linkedin)}" ${ext} aria-label="Message me on LinkedIn">${IN_ICON}</a>
    <a class="chat-icon light" href="mailto:${esc(links.email)}" aria-label="Email me">${MAIL_ICON}</a>
  </div>`;
}

const certThumb = (c) => `<a class="cert-zoom" href="photos/certs/${esc(c.img)}.jpg" ${ext} title="Open the full certificate"><img src="photos/certs/${esc(c.img)}.jpg" alt="${esc(c.h)}" loading="lazy"></a>`;
const verify = (c) => (c.verify ? `<a class="cert-verify" href="${esc(c.verify[1])}" ${ext}>Verify ↗</a>` : '<span class="cert-verify quiet">No public link</span>');

export function BlogSection({ line1, line2, top, groups, awards, count }) {
  return `
  <section id="certifications" class="blog wrap">
    <h2 class="display">${lines(line1, line2)}</h2>
    <div class="posts">
      ${top.map((c) => `
        <article class="post cert-post">
          <div class="post-media">${certThumb(c)}</div>
          <span class="post-tag">${esc(c.m)}</span>
          <h3>${esc(c.h)}</h3>
          ${c.d ? `<p>${esc(c.d)}</p>` : ''}
          <div class="post-foot">${verify(c)}</div>
        </article>`).join('')}
    </div>
    <details class="qa glass cert-all">
      <summary><span>All ${count} certifications and ${awards.length} awards</span><i aria-hidden="true"></i></summary>
      <div class="cert-groups">
        ${[...groups, { label: 'Awards', items: awards }].map((g) => `
          <h3 class="cert-group">${esc(g.label)}${g.lead ? ` <span>${esc(g.lead)}</span>` : ''}</h3>
          <ul class="cert-grid">
            ${g.items.map((c) => `
              <li class="cert-item">
                ${certThumb(c)}
                <div><strong>${esc(c.h)}</strong>${c.m ? `<span>${esc(c.m)}</span>` : ''}${verify(c)}</div>
              </li>`).join('')}
          </ul>`).join('')}
      </div>
    </details>
  </section>`;
}

export function FaqAccordion({ faqs }) {
  return `
  <section id="faq" class="faq wrap" aria-labelledby="faq-heading">
    <h2 id="faq-heading" class="display"><span class="line">Questions <span class="chrome">recruiters ask</span></span></h2>
    <div class="faq-list">
      ${faqs.map((f) => `
        <details class="qa glass">
          <summary><span>${esc(f.q)}</span><i aria-hidden="true"></i></summary>
          <div class="qa-answer"><p>${esc(f.a)}</p></div>
        </details>`).join('')}
    </div>
  </section>`;
}

export function CtaBanner({ line1, line2, lede, links }) {
  return `
  <section id="cta" class="cta">
    <div class="wrap-narrow cta-inner">
      <h2 class="cta-title">${lines(line1, line2)}</h2>
      <p class="lede">${esc(lede)}</p>
      <div class="cta-actions">
        <a class="btn btn-solid btn-lg" href="mailto:${esc(links.email)}"><span>Email me</span></a>
        <a class="btn btn-glass glass btn-lg" href="${esc(links.github)}" ${ext}><span>GitHub</span></a>
        <a class="btn btn-glass glass btn-lg" href="${esc(links.linkedin)}" ${ext}><span>LinkedIn</span></a>
      </div>
    </div>
  </section>`;
}

export function Footer({ name, tagline, projects, skills, links }) {
  return `
  <footer class="footer">
    <div class="wrap">
      <div class="foot-top">
        <div class="foot-brand">
          <span class="nav-logo">${MONOGRAM}<span>Cyrill Cajucom</span></span>
          <p class="foot-line">${esc(tagline)}</p>
          <div class="socials">
            <a class="round glass" href="${esc(links.github)}" ${ext} aria-label="GitHub">
              <svg viewBox="0 0 24 24"><path d="M9 19c-4 1.5-4-2-6-2.5m12 5v-3.5c0-1 .1-1.4-.5-2 2.8-.3 5.5-1.4 5.5-6a4.6 4.6 0 0 0-1.3-3.2 4.2 4.2 0 0 0-.1-3.2s-1.1-.3-3.5 1.3a12 12 0 0 0-6.2 0C6.5 2.8 5.4 3.1 5.4 3.1a4.2 4.2 0 0 0-.1 3.2A4.6 4.6 0 0 0 4 9.5c0 4.6 2.7 5.7 5.5 6-.6.6-.6 1.2-.5 2V21"></path></svg>
            </a>
            <a class="round glass" href="${esc(links.linkedin)}" ${ext} aria-label="LinkedIn">
              <svg viewBox="0 0 24 24"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path><rect x="2" y="9" width="4" height="12"></rect><circle cx="4" cy="4" r="2"></circle></svg>
            </a>
          </div>
        </div>
        <div class="foot-col">
          <h4>Sections</h4>
          <ul>
            <li><a href="#work">Projects</a></li>
            <li><a href="#experience">Experience</a></li>
            <li><a href="#certifications">Certifications</a></li>
            <li><a href="#faq">FAQ</a></li>
            <li><a href="/">Room version</a></li>
          </ul>
        </div>
        <div class="foot-col">
          <h4>Projects</h4>
          <ul>${projects.map((p) => `<li><a href="#${p.id}" data-open="${p.id}">${esc(p.t)}</a></li>`).join('')}</ul>
        </div>
        <div class="foot-col">
          <h4>Contact</h4>
          <ul>
            <li><a href="mailto:${esc(links.email)}">${esc(links.email)}</a></li>
            <li><a href="${esc(links.github)}" ${ext}>GitHub</a></li>
            <li><a href="${esc(links.linkedin)}" ${ext}>LinkedIn</a></li>
          </ul>
        </div>
      </div>
      <details class="qa glass foot-locations">
        <summary><span>Skills, and where I used them</span><i aria-hidden="true"></i></summary>
        <div class="loc-grid">
          ${skills.map((s) => `<a href="#${s.id}" data-open="${s.id}" title="${esc(s.projects.join(', '))}">${esc(s.skill)}</a>`).join('')}
        </div>
      </details>
      <div class="foot-bottom"><span>© 2026 ${esc(name)}</span></div>
    </div>
  </footer>`;
}

// One menu for every "Email me" control: a mailto link alone does nothing on a computer with no mail app.
export function EmailMenu({ email }) {
  const gmail = `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(email)}`;
  return `
  <dialog id="email-menu" class="email-menu glass" aria-labelledby="email-menu-title">
    <div class="email-menu-inner">
      <div class="project-head">
        <div><span class="stack-cat">Email</span><h3 id="email-menu-title">${esc(email)}</h3></div>
        <button type="button" class="sheet-close email-close" aria-label="Close">✕</button>
      </div>
      <a class="btn btn-solid" href="${esc(gmail)}" ${ext}><span>Open in Gmail</span></a>
      <a class="btn btn-glass glass" href="mailto:${esc(email)}" data-direct><span>Open my mail app</span></a>
      <button type="button" class="btn btn-glass glass" id="email-copy" data-email="${esc(email)}"><span>Copy address</span></button>
    </div>
  </dialog>`;
}

export function ProjectDialog(p) {
  const list = (h, items) => (items?.length ? `<h4>${h}</h4><ul>${items.map((i) => `<li>${esc(i)}</li>`).join('')}</ul>` : '');
  return `
  <dialog class="project glass" id="${p.id}" aria-labelledby="${p.id}-title">
   <button type="button" class="sheet-close project-close" aria-label="Close ${esc(p.t)}">✕</button>
   <div class="project-inner">
    <div class="project-head">
      <div>
        <span class="stack-cat">${esc(p.category)}</span>
        <h3 id="${p.id}-title">${esc(p.t)}</h3>
        ${pills(p.tags)}
      </div>
    </div>
    ${p.demo ? `<video class="project-video" controls preload="none" poster="${p.poster}"><source src="${p.demo.src}" type="video/mp4"></video>
    <p class="project-cap">${esc(p.demo.about)}</p>` : ''}
    <p class="project-copy">${esc(p.copy)}</p>
    ${list('What it does', p.features)}
    ${list('Results', p.results)}
    ${p.hard ? `<h4>The hardest part</h4><p>${esc(p.hard)}</p>` : ''}
    ${p.shots.length ? `<h4>Screens</h4><div class="project-shots">${p.shots.map((s) => `<figure><img src="${s.src}" alt="${esc(s.cap)}" loading="lazy"><figcaption>${esc(s.cap)}</figcaption></figure>`).join('')}</div>` : ''}
    <div class="project-links">${p.links.map(([l, h]) => `<a class="btn btn-glass glass btn-sm" href="${esc(h)}" ${ext}><span>${esc(l)} ↗</span></a>`).join('')}</div>
   </div>
  </dialog>`;
}
