import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';

process.env.TAGATAP_ORIGIN = 'https://renderer.example';
const { config } = await import('../vercel.mjs');
const route = source => config.rewrites.find(item => item.source === source);

assert.equal(route('/admin').destination, '/admin/index.html');
assert.equal(route('/admin/').destination, '/admin/index.html');
assert.equal(route('/p/:slug').destination, 'https://renderer.example/p/:slug');
assert.equal(route('/tagatap/:path*').destination, 'https://renderer.example/tagatap/:path*');
assert.ok(!route('/:path*'));
for (const invalid of ['', 'http://renderer.example', 'https://renderer.example/other', 'https://renderer.example?token=one']) {
  const check = spawnSync(process.execPath, ['-e', "import('./vercel.mjs')"], { env: { ...process.env, TAGATAP_ORIGIN: invalid }, encoding: 'utf8' });
  assert.notEqual(check.status, 0, `Accepted invalid origin: ${invalid}`);
}
console.log('PASS SmarTap deployment routes');
