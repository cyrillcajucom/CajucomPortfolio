// Builds ../portfolio.html from works.js, tome.js and resume.js: node portfolio/build.mjs
// Rerun after changing any of those files; check.cjs fails while portfolio.html is stale.
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { loadData, slug, esc, chapter, certGroups, certCount, shotList } from './data.mjs';
import { content as C } from './content.js';
import * as UI from './components.js';

// same tab icon as the room site (the mini CRT TV in index.html)
const ICON = fs.readFileSync(path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', 'index.html'), 'utf8').match(/<link rel="icon"[^>]*>/)[0];

const here = path.dirname(fileURLToPath(import.meta.url));
const SECTIONS = ['nav', 'hero', 'trusted', 'built', 'intro', 'work', 'experience', 'proof', 'why', 'certifications', 'faq', 'cta'];
const FORBIDDEN = /me-barong|clarissa|erwin|tel:|\+63|\.pdf|resume\d|studio|450\+|london|awmedia|sheffield/i;

export function buildPage(root = path.resolve(here, '..')) {
  const raw = loadData(root);
  // page-only rewording, applied to every string of the data before anything is drawn (not to file names or links)
  const reword = (v) => typeof v === 'string' ? C.reword.reduce((t, [from, to]) => t.split(from).join(to), v)
    : Array.isArray(v) ? v.map(reword)
    : v && typeof v === 'object' ? Object.fromEntries(Object.entries(v).map(([k, x]) => [k, ['img', 'verify', 'badges'].includes(k) ? x : reword(x)]))
    : v;
  const { works, tome, resume, skills } = { works: reword(raw.works), tome: reword(raw.tome), resume: raw.resume, skills: raw.skills };
  const W = (f) => `photos/works/${f}`;

  const projects = works.items.map((it) => ({
    ...it,
    links: it.links || [],
    id: `p-${slug(it.t)}`,
    category: it.topics.join(' · '),
    poster: W(`${it.demo?.poster || shotList(it)[0]?.file}.jpg`),
    card: W(`${C.posters[it.t] || it.demo?.poster || shotList(it)[0]?.file}.jpg`),
    live: (it.links || []).some(([l]) => /live/i.test(l)),
    demo: it.demo && { src: W(`${it.demo.video}.mp4`), about: it.demo.about },
    shots: shotList(it).map((s) => ({ src: W(`${s.file}.jpg`), cap: s.cap })),
  }));
  const byName = (t) => projects.find((p) => p.t === t) || assert.fail(`No project named ${t} in works.js`);

  const summary = chapter(tome, 'Summary');
  const groups = certGroups(tome);
  const count = certCount(tome);
  assert.equal(count, Number(summary.lead.match(/(\d+) certifications/)?.[1]), 'Certificate count differs from the Summary lead in tome.js');

  const experience = chapter(tome, 'Experience').entries;
  const education = chapter(tome, 'Education').entries;
  assert.ok(experience.some((e) => /nine (backend )?builds (plus|and) a capstone/i.test([].concat(e.d).join(' '))), 'FlyRank "9 + 1" no longer matches the Experience text');
  const logo = (m) => C.logos.find(([k]) => m.includes(k))?.[1];
  const rows = [...experience, ...education].map((e) => {
    const d = [].concat(e.d || []);
    return { h: e.h, m: e.m, logo: logo(e.m), first: d[0], rest: d.slice(1) };
  });

  const [langAI] = chapter(tome, 'Skills').parts;
  const issuers = new Set(['FlyRank AI', 'FEU Institute of Technology']);
  for (const g of groups) for (const c of g.items) issuers.add(c.m ? c.m.split(',')[0] : g.label);

  // Built slider: a few screens of the lead project, then one of each other project. The address bar follows the slide.
  const address = (p) => {
    const href = (p.links.find(([l]) => /live/i.test(l)) || p.links[0])?.[1];
    return href ? { href, host: href.replace(/^https?:\/\//, '').replace(/\/landing$|\/$/, '') } : { href: `#${p.id}`, host: 'a video, no site to visit', open: p.id };
  };
  const lead = byName(C.built.lead);
  const slides = [
    ...lead.shots.slice(0, C.built.leadShots).map((s) => ({ src: s.src, cap: `${lead.t}: ${s.cap}`, ...address(lead) })),
    ...projects.filter((p) => p !== lead).map((p) => ({ src: p.card, cap: `${p.t}: ${p.category}`, ...address(p) })),
  ];

  const tagCount = (tag) => projects.filter((p) => p.tags.includes(tag)).length;
  const core = byName('Ascend Core');
  const dean = education.find((e) => /Dean's Lister/.test(e.d || ''));

  const body = [
    UI.Navbar({ projects, email: C.links.email }),
    '<main>',
    UI.Hero({ ...C.hero, sub: summary.lead, email: C.links.email }),
    UI.TrustedMarquee({ label: C.trustedLabel, row1: langAI.entries.flatMap((e) => e.pills), row2: [...issuers] }),
    UI.BuiltShowcase({ ...C.built, slides }),
    UI.IntroServices({ ...C.intro, cells: C.intro.cells.map((c) => ({ ...c, id: byName(c.project).id })) }),
    UI.WorkShowcase({ ...C.work, featured: C.work.featured.map(byName), carousel: projects.filter((p) => !C.work.featured.includes(p.t)) }),
    UI.ServicesList({ ...C.experience, rows }),
    UI.ProofStats({
      ...C.proof,
      stats: [
        { num: String(projects.length), label: 'PROJECTS', desc: `${tagCount('Solo')} solo, ${tagCount('Capstone')} capstone, ${tagCount('Thesis')} team thesis, ${tagCount('Video')} video for a friend. Each with a demo video.` },
        { num: '9 + 1', label: 'FLYRANK AI BUILDS', desc: 'Nine backend builds and a capstone in the Backend AI Engineering internship.' },
        { num: String(count), label: 'CERTIFICATIONS', desc: 'From SAP and PMI to seven Anthropic Academy courses. Most have a public verify link.' },
        { num: "Dean's", label: 'LISTER', desc: `${dean.m.split(',')[0]}, ${dean.d.replace("Dean's Lister, ", '')}.` },
      ],
    }),
    UI.WhyUsBento({
      ...C.why,
      tiles: C.why.tiles.map((t) => ({ ...t, id: byName(t.project).id, desc: byName(t.project).hard })),
      photo: { src: 'photos/me-tie.jpg', title: C.why.photoTitle, lines: resume.intro },
    }),
    UI.BlogSection({ ...C.certs, top: C.certs.top.map((h) => groups.flatMap((g) => g.items).find((c) => c.h === h) || assert.fail(`No certificate named ${h} in tome.js`)), groups, awards: chapter(tome, 'Awards').entries, count }),
    UI.FaqAccordion({ faqs: C.faq }),
    UI.CtaBanner({ ...C.cta, links: C.links }),
    '</main>',
    UI.Footer({
      name: resume.full,
      tagline: 'Software and AI engineer in Manila. AI agents, full-stack apps, computer vision and hardware.',
      projects,
      skills: Object.entries(skills).filter(([, ps]) => ps.length).map(([skill, ps]) => ({ skill, projects: ps, id: byName(ps[0]).id })),
      links: C.links,
    }),
    UI.MessagePill({ links: C.links }),
    UI.EmailMenu({ email: C.links.email }),
    projects.map(UI.ProjectDialog).join('\n'),
  ].join('\n');

  const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${esc(C.title)}</title>
  <meta name="description" content="${esc(C.description)}">
  <meta property="og:title" content="${esc(C.title)}">
  <meta property="og:description" content="${esc(C.description)}">
  <meta property="og:image" content="https://cajucomportfolio.vercel.app/photos/og.jpg">
  ${ICON}
  <link rel="stylesheet" href="portfolio/styles.css">
  <script src="portfolio/page.js" defer></script>
  <script src="portfolio/clouds.js" defer></script>
  <script src="chooser.js" defer></script>
</head>
<body>
<!-- Generated by portfolio/build.mjs from works.js, tome.js and resume.js. Do not edit by hand. -->
${body}
</body>
</html>
`;
  check(html, root, projects.length);
  return html;
}

function check(html, root, projectCount) {
  for (const id of SECTIONS) {
    const m = html.match(new RegExp(`<(section|header)[^>]* id="${id}"[\\s\\S]*?</\\1>`));
    assert.ok(m && m[0].replace(/<[^>]+>/g, '').trim().length > 20, `Section #${id} missing or empty`);
  }
  assert.equal((html.match(/<dialog class="project/g) || []).length, projectCount, 'A project is missing its dialog');
  assert.ok(html.includes('Wake&amp;Brake'), 'Data is not escaped');
  // AI assistants are named only inside the full certificate list (course titles and their verify links)
  const upFront = html.replace(/<details class="qa glass cert-all">[\s\S]*?<\/details>/, '').replace(/<[^>]+>/g, ' ');
  assert.ok(!/claude/i.test(upFront), `"Claude" shows outside the certificate list: ${upFront.match(/.{0,50}claude.{0,30}/i)?.[0]}`);
  const bad = html.match(FORBIDDEN);
  assert.ok(!bad, `Forbidden text in page: ${bad?.[0]}`);
  const refs = [...html.matchAll(/(?:src|href|poster)="([^"#:]+?)"|url\('([^']+)'\)/g)].map((m) => m[1] || m[2]);
  const missing = [...new Set(refs)].filter((r) => r !== '/' && !fs.existsSync(path.join(root, r)));
  assert.deepEqual(missing, [], `Missing files: ${missing.join(', ')}`);
  const ids = new Set([...html.matchAll(/ id="([^"]+)"/g)].map((m) => m[1]));
  const dead = [...new Set([...html.matchAll(/(?:href="#|data-open=")([^"]+)"/g)].map((m) => m[1]))].filter((id) => !ids.has(id));
  assert.deepEqual(dead, [], `Links to missing ids: ${dead.join(', ')}`);
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  const html = buildPage();
  fs.writeFileSync(path.resolve(here, '..', 'portfolio.html'), html, 'utf8');
  console.log(`OK: portfolio.html (${html.length} bytes)`);
}
