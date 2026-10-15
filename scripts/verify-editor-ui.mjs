import assert from 'node:assert/strict';
import { fileURLToPath } from 'node:url';
import { chromium } from 'playwright';
import { createServer } from 'vite';

const mockConvex = `
import React from 'react';
import { getFunctionName } from 'convex/server';
import { validatePublication } from '/convex/profileValidation.js';
const db = { profiles: [], version: 0, listeners: new Set() };
window.__mockDb = db;
const subscribe = fn => { db.listeners.add(fn); return () => db.listeners.delete(fn); };
const snapshot = () => db.version;
const changed = () => { db.version++; db.listeners.forEach(fn => fn()); };
export class ConvexReactClient { constructor() {} }
export function useQuery(ref) {
  React.useSyncExternalStore(subscribe, snapshot);
  const name = getFunctionName(ref);
  if (name === 'admin:viewer') return true;
  if (name === 'profiles:list') return db.profiles;
  if (name === 'profiles:getForAdmin') return db.profiles[0] || null;
}
export function useMutation(ref) {
  const name = getFunctionName(ref);
  return async args => {
    const profile = db.profiles[0];
    if (name === 'profiles:createDraft') {
      db.profiles.push({ _id: 'mock-profile', slug: 'ana-reyes', name: args.input.name.trim(), status: 'draft', updatedAt: Date.now(), social: {}, appearance: {} });
      changed(); return 'mock-profile';
    }
    if (name === 'profiles:save') { Object.assign(profile, args.input); changed(); return; }
    if (name === 'profiles:publish') { validatePublication(profile); profile.status = 'published'; changed(); return profile.slug; }
    if (name === 'profiles:generateUploadUrl') return '/mock-upload';
    if (name === 'profiles:attachImage') { profile[args.kind + 'StorageId'] = args.storageId; profile[args.kind + 'Url'] = 'data:image/png;base64,iVBORw0KGgo='; changed(); return; }
    if (name === 'profiles:discardUpload') return;
    if (name === 'profiles:unpublish') { profile.status = 'draft'; changed(); return; }
    if (name === 'profiles:archive') { profile.status = 'archived'; changed(); return; }
  };
}
`;
const mockAuth = `
export function ConvexAuthProvider({children}) { return children; }
export function useConvexAuth() { return { isLoading: false, isAuthenticated: true }; }
export function useAuthActions() { return { signOut: async () => {}, signIn: async () => ({ signingIn: true }) }; }
`;
const plugin = {
  name: 'admin-mock', enforce: 'pre',
  configureServer(server) {
    server.middlewares.use((request, response, next) => {
      if (request.url !== '/p/preview') return next();
      response.setHeader('Content-Type', 'text/html');
      response.end('<!doctype html><h1>Waiting</h1><script>addEventListener("message", e => { if (e.origin === location.origin && e.data?.type === "smartap:preview") document.querySelector("h1").textContent = e.data.profile.name; }); parent.postMessage({type:"smartap:ready"},location.origin);</script>');
    });
  },
  resolveId(id) {
    if (id === 'convex/react') return '\0admin-mock-convex';
    if (id === '@convex-dev/auth/react') return '\0admin-mock-auth';
  },
  load(id) {
    if (id === '\0admin-mock-convex') return mockConvex;
    if (id === '\0admin-mock-auth') return mockAuth;
  },
};

const server = await createServer({ configFile: false, plugins: [plugin], server: { host: '127.0.0.1', port: 0 } });
let browser;
try {
  await server.listen();
  browser = await chromium.launch({ channel: 'chrome', headless: true });
  const page = await browser.newPage({ viewport: { width: 390, height: 844 }, permissions: ['clipboard-read', 'clipboard-write'] });
  page.on('pageerror', error => console.error('BROWSER ERROR:', error.message));
  await page.route('**/mock-upload', route => route.fulfill({ status: 200, contentType: 'application/json', body: '{"storageId":"image-1"}' }));
  await page.goto(`${server.resolvedUrls.local[0]}admin/index.html`);
  await page.getByRole('heading', { name: 'Profile dashboard' }).waitFor({ timeout: 5000 }).catch(async error => { console.error((await page.locator('body').innerText()).slice(0, 500)); throw error; });
  await page.getByRole('button', { name: 'New profile' }).click();
  await page.getByLabel('Full name').fill('Ana Reyes');
  await page.getByRole('button', { name: 'Create draft' }).click();
  await page.getByRole('heading', { name: 'Ana Reyes' }).waitFor();
  for (const label of ['Full name', 'Headline', 'Phone', 'Email', 'Address', 'Maps location', 'Description', 'Facebook', 'Instagram', 'TikTok', 'Messenger']) {
    assert.equal(await page.getByLabel(label, { exact: true }).count(), 1, `${label} has a visible label`);
  }
  if (process.env.ADMIN_CAPTURE) await page.screenshot({ path: fileURLToPath(new URL('../../../admin-editor-mobile.png', import.meta.url)), fullPage: true });
  await page.getByLabel('Phone').fill('bad');
  await page.getByRole('button', { name: 'Save changes' }).click();
  await page.getByRole('alert').getByText(/Phone/).waitFor();
  await page.getByLabel('Phone').fill('+63 916 370 9474');
  await page.getByRole('button', { name: 'Save changes' }).click();
  await page.getByText('Changes saved.').waitFor();
  await page.getByRole('button', { name: 'Publish', exact: true }).click();
  await page.getByRole('alert').getByText(/portrait/).waitFor();
  await page.getByRole('button', { name: 'Images', exact: true }).click();
  await page.locator('#upload-portrait').setInputFiles({ name: 'bad.svg', mimeType: 'image/svg+xml', buffer: Buffer.from('<svg/>') });
  await page.getByRole('alert').getByText(/JPEG, PNG, or WebP/).waitFor();
  const interrupt = route => route.abort();
  await page.route('**/mock-upload', interrupt);
  const png = { name: 'test.png', mimeType: 'image/png', buffer: Buffer.from('89504e470d0a1a0a', 'hex') };
  await page.locator('#upload-portrait').setInputFiles(png);
  await page.getByRole('alert').getByText(/fetch|network|upload/i).waitFor();
  await page.unroute('**/mock-upload', interrupt);
  await page.locator('#upload-portrait').setInputFiles(png);
  await page.getByText('Portrait uploaded.').waitFor();
  await page.locator('#upload-background').setInputFiles(png);
  await page.getByText('Background uploaded.').waitFor();
  await page.getByRole('button', { name: 'Publish', exact: true }).click();
  await page.getByText('Page published.').waitFor();
  await page.getByRole('button', { name: 'Copy URL' }).click();
  await page.getByText('Published URL copied.').waitFor();
  assert.equal(await page.evaluate(() => navigator.clipboard.readText()), 'https://smartap-png.vercel.app/p/ana-reyes');
  assert.equal(new URL(page.url()).searchParams.get('profile'), 'mock-profile');
  await page.getByRole('button', { name: 'Back to profiles' }).click();
  await page.getByRole('button', { name: /Edit profile.*Ana Reyes/ }).click();
  await page.getByRole('heading', { name: 'Ana Reyes' }).waitFor();
  await page.getByRole('button', { name: 'Customization' }).click();
  for (const label of ['Portrait horizontal position', 'Portrait vertical position', 'Portrait size', 'Background horizontal position', 'Background vertical position', 'Background dark overlay', 'Accent color', 'Dark color']) {
    assert.equal(await page.getByLabel(new RegExp(label)).count(), 1, `${label} control is present`);
  }
  await page.getByRole('button', { name: 'Details' }).click();
  await page.getByLabel('Full name').fill('Ana M. Reyes');
  await page.getByRole('button', { name: 'Preview' }).click();
  await page.frameLocator('iframe').getByRole('heading', { name: 'Ana M. Reyes' }).waitFor();
  assert.equal(await page.locator('body').evaluate(element => element.scrollWidth <= window.innerWidth), true);
  await page.route('**/p/preview', route => route.fulfill({ status: 200, contentType: 'text/html', body: '<!doctype html><p>Unavailable</p>' }));
  await page.getByRole('button', { name: 'Details' }).click();
  await page.getByRole('button', { name: 'Preview' }).click();
  await page.getByRole('alert').getByText(/Preview unavailable/).waitFor({ timeout: 7000 });
  await page.unroute('**/p/preview');
  await page.getByRole('button', { name: 'Retry preview' }).click();
  await page.frameLocator('iframe').getByRole('heading', { name: 'Ana M. Reyes' }).waitFor();
  await page.getByRole('button', { name: 'Save changes' }).click();
  await page.getByText('Changes saved.').waitFor();
  await page.getByRole('button', { name: 'Unpublish' }).click();
  await page.getByText(/Page unpublished/).waitFor();
  await page.getByRole('button', { name: 'Publish', exact: true }).click();
  await page.getByText('Page published.').waitFor();
  page.once('dialog', dialog => dialog.accept());
  await page.getByRole('button', { name: 'Archive' }).click();
  await page.getByRole('heading', { name: 'Profile dashboard' }).waitFor();
  assert.match(await page.locator('.admin-status').first().textContent(), /archived/);
  await page.setViewportSize({ width: 1440, height: 900 });
  assert.equal(await page.locator('body').evaluate(element => element.scrollWidth <= window.innerWidth), true);
  if (process.env.ADMIN_CAPTURE) await page.screenshot({ path: fileURLToPath(new URL('../../../admin-editor-desktop.png', import.meta.url)), fullPage: true });
  console.log('PASS editor create, save, upload, publish gate, copy URL, and phone layout');
} finally {
  await browser?.close();
  await server.close();
}
