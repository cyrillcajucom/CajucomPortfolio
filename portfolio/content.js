// Words only this page uses: headings, taglines, FAQ. Facts (projects, dates, counts, certificates) come from works.js, tome.js and resume.js.
export const content = {
  title: 'Cyrill Cajucom | Software & AI Engineer',
  description: 'Projects, experience and certifications of Cyrill Gerard P. Cajucom, a 4th-year BS Computer Science student in Manila building AI agents, full-stack apps and computer vision.',
  hero: {
    badge: 'SOFTWARE & AI ENGINEER · MANILA',
    line1: 'Engineered properly.',
    line2: 'Built to ship.',
  },
  trustedLabel: 'Built with',
  built: {
    chip: 'Recent builds',
    note: 'Use the arrows or swipe to look around. The address bar opens the project.',
    // the slider leads with a few screens of this project, then one screen of every other project
    lead: 'Ascend Core',
    leadShots: 3,
  },
  intro: {
    statement: 'Agents that work as a team,',
    dim: 'apps that see and talk back, and hardware that keeps drivers awake.',
    lede: 'I build the whole thing: the API and the database, the agent and its guardrails, the screen people use, and the tests that say it works. Every project below has a demo and its code on GitHub.',
    cells: [
      { tag: 'AUTOMATION', title: 'AI Agents & n8n', sub: 'Chasing unpaid invoices in Taglish', project: 'Kinsenas' },
      { tag: 'ORCHESTRATION', title: 'Multi-agent coding', sub: 'Three agents, one codebase, you approve', project: 'Ascend Hub' },
      { tag: 'FULL-STACK', title: 'Web apps & APIs', sub: 'Next.js and FastAPI, live on Vercel', project: 'Ascend Core' },
      { tag: 'VISION & VOICE', title: 'Computer vision & voice', sub: 'Runs on your own computer', project: 'Ascend Vision' },
      { tag: 'HARDWARE', title: 'Embedded & hardware', sub: 'Raspberry Pi and Arduino, in a car', project: 'Wake&Brake' },
      { tag: 'GUARDRAILS', title: 'LLM guardrails & evaluation', sub: 'Says no when nothing fits', project: 'Image Relevance Engine' },
    ],
  },
  work: { eyebrow: 'Projects', line1: 'From idea to demo.', line2: 'Code on GitHub.', featured: ['Ascend Core', 'Ascend Hub', 'Ascend Vision'] },
  experience: { line1: 'Where I have', line2: 'worked and studied.' },
  proof: { lead: 'Real projects. Real tests.', body: 'Each project has a demo video, its code in public, and the numbers it was measured on.' },
  why: {
    eyebrow: 'The hard parts',
    line1: 'Six builds.',
    line2: 'Six hard problems.',
    tiles: [
      { project: 'Ascend Hub', title: 'Three agents, one codebase.' },
      { project: 'Image Relevance Engine', title: 'Knowing when to say no.' },
      { project: 'Kinsenas', title: 'Never trusting a screenshot.' },
      { project: 'Ascend Vision', title: 'A pickup, or just a hand passing by?' },
      { project: 'Wake&Brake', title: 'Alerts that do not wear off.' },
      { project: 'Ascend Core', title: 'Progress that cannot be faked.' },
    ],
    photoTitle: 'Hi, I am Cyrill.',
  },
  certs: {
    line1: 'Certified, and',
    line2: 'every one verifiable.',
    // shown first, as large cards; the rest are in the full list
    top: ['Certificate of Completion: Backend AI Engineering', 'PMI Project Management Ready', 'IT Specialist: Python'],
  },
  // Wording for this page only (Cyrill's call): AI assistants aren't named up front. The data files keep the full wording.
  reword: [
    ['Codex, Claude and Antigravity', 'Three AI coding agents'],
    ['seven Claude Academy courses', 'seven Anthropic Academy courses'],
    ['Claude Academy', 'Anthropic Academy'],
  ],
  // Card pictures for this page only, where the usual poster names an assistant in large type
  posters: { 'Ascend Hub': 'hub-room-themes' },
  faq: [
    {
      q: 'Are you available for an internship?',
      a: 'Yes. I am a 4th-year BS Computer Science student at FEU Tech, and I am looking for a 520-hour or 1,040-hour internship in software or AI engineering.',
    },
    {
      q: 'What do you build with?',
      a: 'Python and FastAPI or TypeScript, React and Next.js for the app, with PostgreSQL or SQLite underneath. n8n and the Gemini and OpenAI APIs for agents. OpenCV, YOLO and MediaPipe for vision, and a Raspberry Pi with an Arduino when it needs hardware.',
    },
    {
      q: 'Cloud AI or local AI?',
      a: 'Both. Ascend Core runs in the cloud: Vercel for the app, FastAPI on Render and PostgreSQL on Neon. Ascend Hub runs only on your computer at 127.0.0.1, and Ascend Vision does its detection and her Kokoro voice offline. The Image Relevance Engine uses a local vision model to describe each photo.',
    },
    {
      q: 'How do you test your projects?',
      a: 'Ascend Core is tested with Vitest and Playwright. Ascend Hub has 100 automated test files. The Image Relevance Engine has 21 passing tests and was measured on 10 labeled articles. Kinsenas went through about 40 test runs with test invoices, covering every path.',
    },
    {
      q: 'How do I reach you?',
      a: 'Email is fastest: cyrillgerardc@gmail.com. My code is on GitHub at cyrillcajucom, and I am on LinkedIn too.',
    },
  ],
  cta: { line1: 'Have a role', line2: 'I could help with?', lede: 'Send me an email, or read through the code on GitHub first.' },
  links: {
    email: 'cyrillgerardc@gmail.com',
    github: 'https://github.com/cyrillcajucom',
    linkedin: 'https://www.linkedin.com/in/cyrillcajucom/',
  },
  logos: [
    ['FlyRank', 'photos/flyrank.webp'],
    ['FEU', 'photos/feutech.webp'],
    ['St. Paul', 'photos/spusm.webp'],
    ['San Miguel National', 'photos/smnhs.webp'],
  ],
};
