import assert from 'node:assert/strict';
import { createServer } from 'node:http';
import { readFile } from 'node:fs/promises';
import { join, extname } from 'node:path';
import { chromium } from 'playwright';

const rendererDist = process.env.TAGATAP_DIST;
if (!rendererDist) throw new Error('Set TAGATAP_DIST to the TAGATAP build directory');
const mime = { '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css', '.png': 'image/png', '.svg': 'image/svg+xml', '.woff2': 'font/woff2' };
const person = (slug, name, portraitKind) => ({
  slug, name, portraitKind, headline: 'Designer', description: 'Hello.', phone: '+639171112222',
  email: `${slug}@example.com`, address: 'Laguna', mapsLocation: 'Laguna', social: {},
  portraitUrl: '/tagatap/profile-cutout.png', backgroundUrl: '/tagatap/smartap-nfc-connection-dusk.png',
  appearance: { portraitX: 0, portraitY: 8, portraitScale: 1, backgroundX: 50, backgroundY: 50, backgroundOverlay: 0.5, accentColor: '#a8f53b', darkColor: '#282e31' },
});
const profiles = { 'alex-rivera': person('alex-rivera', 'Alex Rivera', 'cutout'), 'jo-santos': person('jo-santos', 'Jo Santos', 'photo') };

const server = createServer(async (request, response) => {
  const path = new URL(request.url, 'http://localhost').pathname;
  let root = 'dist';
  let file = path === '/' ? 'index.html' : path.slice(1);
  if (/^\/p\/[a-z0-9-]+$/.test(path)) { root = rendererDist; file = 'index.html'; }
  else if (path.startsWith('/tagatap/')) { root = rendererDist; file = path.slice('/tagatap/'.length); }
  else if (path === '/admin' || path === '/admin/') file = 'admin/index.html';
  else if (path === '/qa-preview') {
    response.writeHead(200, { 'Content-Type': 'text/html' });
    response.end('<iframe src="/p/preview"></iframe><script>addEventListener("message", e => { if (e.origin === location.origin && e.data?.type === "smartap:ready") document.querySelector("iframe").contentWindow.postMessage({type:"smartap:preview",profile:window.profile},location.origin) })</script>');
    return;
  }
  try {
    const body = await readFile(join(root, file));
    response.writeHead(200, { 'Content-Type': mime[extname(file)] || 'application/octet-stream' });
    response.end(body);
  } catch {
    response.writeHead(404); response.end('Not found');
  }
});
await new Promise(resolve => server.listen(0, '127.0.0.1', resolve));
const origin = `http://127.0.0.1:${server.address().port}`;
let browser;
try {
  browser = await chromium.launch({ headless: true, channel: 'chrome' });
  const page = await browser.newPage({ viewport: { width: 390, height: 844 } });
  const pageErrors = [];
  page.on('pageerror', error => pageErrors.push(error.message));
  await page.route('**/api/query', route => {
    const slug = route.request().postDataJSON().args[0].slug;
    return route.fulfill({ status: 200, contentType: 'application/json', headers: { 'Access-Control-Allow-Origin': '*' }, body: JSON.stringify({ status: 'success', value: profiles[slug] || null }) });
  });
  for (const [path, title] of [['/', /SmarTap/i], ['/demo/index.html', /SmarTap/i], ['/demo/business.html', /Morrow/i], ['/admin', /SmarTap/i]]) {
    const response = await page.goto(`${origin}${path}`);
    assert.equal(response.status(), 200, path);
    assert.match(await page.title(), title, path);
  }
  for (const [slug, name] of [['alex-rivera', 'Alex Rivera'], ['jo-santos', 'Jo Santos']]) {
    await page.goto(`${origin}/p/${slug}`);
    await page.getByRole('heading', { name }).waitFor();
    assert.equal(new URL(page.url()).pathname, `/p/${slug}`);
    assert.equal(await page.locator('.hero-background').evaluate(el => el.complete && el.naturalWidth > 0), true);
    assert.equal(await page.locator('.profile-wordmark').evaluate(el => el.complete && el.naturalWidth > 0), true);
    assert.equal(await page.locator('.powered-by img').evaluate(el => el.complete && el.naturalWidth > 0), true);
    assert.equal(await page.locator('link[rel="stylesheet"]').first().evaluate(el => el.sheet !== null), true);
    await page.reload();
    await page.getByRole('heading', { name }).waitFor();
  }
  for (const slug of ['missing', 'unpublished']) {
    await page.goto(`${origin}/p/${slug}`);
    await page.getByRole('heading', { name: 'Page unavailable' }).waitFor();
  }
  await page.goto(`${origin}/qa-preview`);
  await page.evaluate(profile => { window.profile = profile; }, profiles['alex-rivera']);
  // The iframe may announce ready before the parent profile is set, so request a reload.
  await page.locator('iframe').evaluate(frame => { frame.src = '/p/preview'; });
  await page.frameLocator('iframe').getByRole('heading', { name: 'Alex Rivera' }).waitFor();
  assert.deepEqual(pageErrors, []);
  console.log('PASS combined static routes, two profiles, missing/unpublished, refresh, assets, and same-origin preview');
} finally {
  await browser?.close();
  await new Promise(resolve => server.close(resolve));
}
