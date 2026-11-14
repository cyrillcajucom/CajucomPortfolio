// Checks for the data loader: node portfolio/test.mjs
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { loadData, slug, certGroups, certCount, shotList, esc } from './data.mjs';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const { tome, works } = loadData(root);

assert.equal(certCount(tome), 21);
assert.deepEqual(certGroups(tome).map((g) => g.label), ['Professional', 'Claude Academy', 'Courses']);
assert.ok(certGroups(tome)[1].items.every((c) => c.h && c.img && c.verify?.[1].startsWith('https://')), 'badges normalised');
assert.equal(works.items.length, 7);
assert.equal(slug('Wake&Brake'), 'wake-brake');
assert.equal(slug('Image Relevance Engine'), 'image-relevance-engine');
assert.deepEqual(shotList({ shots: [[['a', 'b'], 'x']] }), [{ file: 'a', cap: 'x' }]);
assert.deepEqual(shotList({ shots: [{ names: ['c'], cap: 'y' }] }), [{ file: 'c', cap: 'y' }]);
assert.deepEqual(shotList({}), []);
assert.equal(esc('Wake&Brake'), 'Wake&amp;Brake');
assert.equal(esc(`<a href="x">it's</a>`), '&lt;a href=&quot;x&quot;&gt;it&#39;s&lt;/a&gt;');

// a data file that throws before its object exists must stop the build, not give an empty page
const broken = fs.mkdtempSync(path.join(os.tmpdir(), 'pf-'));
for (const f of ['resume.js', 'tome.js']) fs.copyFileSync(path.join(root, f), path.join(broken, f));
fs.writeFileSync(path.join(broken, 'works.js'), 'throw 1;');
assert.throws(() => loadData(broken), /WORKS_WORDS missing/);
fs.rmSync(broken, { recursive: true });

console.log('ok');
