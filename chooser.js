// First visit only: ask whether to look around in the room (index.html) or on the one-page portfolio (portfolio.html).
// Loaded by both pages. The answer is kept in this browser, so it asks once; each page also links to the other.
(() => {
  const KEY = 'cc-view';
  const here = /portfolio\.html$/.test(location.pathname) ? 'quick' : 'room';
  const read = () => { try { return localStorage.getItem(KEY); } catch { return 'unknown'; } }; // no storage (private mode): never nag
  const save = (v) => { try { localStorage.setItem(KEY, v); } catch {} };
  // already chosen, a shared link to one project, or a link that names the view: open the page as asked
  if (read() || /^#p-/.test(location.hash) || /[?&]view=/.test(location.search)) return;

  const css = `
#cc-chooser { position: fixed; inset: 0; width: min(880px, calc(100% - 32px)); max-height: calc(100svh - 32px); height: fit-content; margin: auto; padding: 0; border: 1px solid rgba(255,255,255,.14); border-radius: 24px; background: rgba(12,12,14,.92); color: #f2f3f4; font: 400 16px/1.5 "Rethink Sans", system-ui, -apple-system, "Segoe UI", sans-serif; box-shadow: 0 40px 120px -20px rgba(0,0,0,.9); -webkit-backdrop-filter: blur(22px) saturate(160%); backdrop-filter: blur(22px) saturate(160%); overflow: auto; }
#cc-chooser::backdrop { background: rgba(3,3,4,.72); -webkit-backdrop-filter: blur(6px); backdrop-filter: blur(6px); }
#cc-chooser[open] { animation: cc-in .32s cubic-bezier(.16,1,.3,1); }
@keyframes cc-in { from { opacity: 0; transform: translateY(16px) scale(.985); } }
#cc-chooser .cc-inner { padding: 28px; }
#cc-chooser h2 { margin: 0 0 4px; font-size: clamp(1.4rem, 3vw, 1.9rem); font-weight: 700; letter-spacing: -.02em; line-height: 1.15; }
#cc-chooser .cc-lede { margin: 0 0 22px; color: #a3a8ad; }
#cc-chooser .cc-options { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
#cc-chooser .cc-option { all: unset; box-sizing: border-box; display: flex; flex-direction: column; cursor: pointer; border-radius: 16px; border: 1px solid rgba(255,255,255,.12); background: rgba(255,255,255,.035); overflow: hidden; transition: border-color .2s ease, transform .25s cubic-bezier(.16,1,.3,1), background .2s ease; }
#cc-chooser .cc-option:hover, #cc-chooser .cc-option:focus-visible { border-color: #ffe600; background: rgba(255,230,0,.05); transform: translateY(-2px); }
#cc-chooser .cc-option:focus-visible { outline: 2px solid #ffe600; outline-offset: 3px; }
#cc-chooser .cc-option img { display: block; width: 100%; height: auto; aspect-ratio: 16 / 10; object-fit: cover; border-bottom: 1px solid rgba(255,255,255,.1); }
#cc-chooser .cc-text { padding: 16px 18px 18px; display: grid; gap: 4px; }
#cc-chooser .cc-name { font-size: 1.15rem; font-weight: 700; letter-spacing: -.01em; display: flex; align-items: center; justify-content: space-between; gap: 10px; }
#cc-chooser .cc-time { font: 500 .72rem/1 "JetBrains Mono", ui-monospace, Consolas, monospace; letter-spacing: .1em; text-transform: uppercase; color: #060507; background: #ffe600; padding: 5px 8px; border-radius: 6px; white-space: nowrap; }
#cc-chooser .cc-desc { color: #a3a8ad; font-size: .95rem; }
#cc-chooser .cc-foot { margin: 18px 0 0; color: #8b9196; font-size: .85rem; }
@media (max-width: 640px) {
  #cc-chooser .cc-inner { padding: 20px; }
  #cc-chooser .cc-options { grid-template-columns: 1fr; gap: 12px; }
  #cc-chooser .cc-option { flex-direction: row; align-items: stretch; }
  #cc-chooser .cc-option img { flex: none; width: 38%; height: auto; aspect-ratio: auto; min-height: 112px; border-bottom: 0; border-right: 1px solid rgba(255,255,255,.1); }
  #cc-chooser .cc-text { padding: 12px 14px; align-content: center; }
  #cc-chooser .cc-name { font-size: 1.02rem; flex-wrap: wrap; }
  #cc-chooser .cc-desc { font-size: .86rem; }
}
@media (prefers-reduced-motion: reduce) { #cc-chooser[open] { animation: none; } #cc-chooser .cc-option { transition: none; } }`;

  const options = [
    { view: 'quick', href: 'portfolio.html', img: 'photos/choose-quick.jpg', name: 'Quick portfolio', time: '1 min', desc: 'Projects, experience and certificates on one page you scroll.' },
    { view: 'room', href: './', img: 'photos/choose-room.jpg', name: 'The room', time: '3 min', desc: 'Walk up to a retro TV and step inside. Best with sound on.' },
  ];

  const style = document.createElement('style');
  style.textContent = css;
  const dialog = document.createElement('dialog');
  dialog.id = 'cc-chooser';
  dialog.setAttribute('aria-labelledby', 'cc-title');
  dialog.innerHTML = `
    <div class="cc-inner">
      <h2 id="cc-title">How would you like to look around?</h2>
      <p class="cc-lede">Both show the same projects. Pick the one that fits your time.</p>
      <div class="cc-options">
        ${options.map((o) => `
          <button type="button" class="cc-option" data-view="${o.view}">
            <img src="${o.img}" alt="" width="800" height="500">
            <span class="cc-text">
              <span class="cc-name">${o.name}<span class="cc-time">${o.time}</span></span>
              <span class="cc-desc">${o.desc}</span>
            </span>
          </button>`).join('')}
      </div>
      <p class="cc-foot">You can switch any time: ${here === 'room' ? 'look for “Quick portfolio” at the top of the page' : 'look for “Room version” at the top of the page, or in the menu on a phone'}.</p>
    </div>`;

  const choose = (view) => {
    save(view);
    if (view === here) { dialog.close(); return; }
    location.href = options.find((o) => o.view === view).href;
  };
  dialog.addEventListener('click', (e) => {
    const b = e.target.closest('.cc-option');
    if (b) choose(b.dataset.view);
  });
  dialog.addEventListener('cancel', () => save(here)); // Esc: stay here, and don't ask again

  const open = () => {
    // a shadow root, so neither page's own dialog and button styles reach the chooser
    const host = document.createElement('div');
    host.id = 'cc-host';
    const root = host.attachShadow({ mode: 'open' });
    root.append(style, dialog);
    document.body.append(host);
    dialog.addEventListener('close', () => host.remove());
    dialog.showModal();
    // focus the option for the page they are on, so Enter keeps them here
    dialog.querySelector(`[data-view="${here}"]`).focus();
  };
  if (document.body) open(); else addEventListener('DOMContentLoaded', open);
})();
