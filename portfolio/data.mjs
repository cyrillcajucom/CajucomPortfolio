// Reads the words the CRT site draws (works.js, tome.js, resume.js) so this page never keeps its own copy.
import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';

const NAMES = { works: 'WORKS_WORDS', tome: 'TOME_WORDS', resume: 'RESUME_WORDS', skills: 'TOME_SKILL_PROJECTS' };

export function loadData(root) {
  const ctx = vm.createContext({});
  // The files go on to draw the room and throw on browser-only names (Image, document...) after their data is defined; that's fine.
  for (const f of ['resume.js', 'tome.js', 'works.js']) {
    try { vm.runInContext(fs.readFileSync(path.join(root, f), 'utf8'), ctx, { filename: f }); } catch {}
  }
  const out = {};
  for (const [key, name] of Object.entries(NAMES)) {
    // JSON round trip: brings the plain data into this realm (vm arrays have their own Array.prototype)
    out[key] = JSON.parse(vm.runInContext(`typeof ${name} === 'undefined' ? 'null' : JSON.stringify(${name})`, ctx));
    if (!out[key]) throw new Error(`${name} missing: ${name === 'TOME_SKILL_PROJECTS' ? 'tome.js' : name.split('_')[0].toLowerCase() + '.js'} stopped before defining it`);
  }
  return out;
}

export const slug = (t) => t.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');

export const esc = (s) => String(s ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]);

export const chapter = (tome, name) => tome.chapters.find((c) => c.name === name);

export function certGroups(tome) {
  return chapter(tome, 'Certifications').parts.map(({ label, lead, entries = [], badges = [] }) => ({
    label,
    lead,
    items: [...entries, ...badges.map(([h, img, , url]) => ({ h, img, verify: ['Verify', url] }))],
  }));
}

export const certCount = (tome) => certGroups(tome).reduce((n, g) => n + g.items.length, 0);

// works.js rewrites shots to {names, cap} while it loads; accept either shape. A shot with several frames shows its first.
export const shotList = (item) => (item.shots || []).map((s) => {
  const [names, cap] = Array.isArray(s) ? s : [s.names, s.cap];
  return { file: [].concat(names)[0], cap };
});
