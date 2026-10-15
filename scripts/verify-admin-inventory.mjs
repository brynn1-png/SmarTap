import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { chromium } from 'playwright';
import { createServer } from 'vite';

const server = await createServer({ configFile: false, optimizeDeps: { noDiscovery: true, include: [] }, server: { middlewareMode: true } });
let browser;
try {
  const { ProfileInventory } = await server.ssrLoadModule('/src/admin/AdminApp.jsx');
  const empty = renderToStaticMarkup(React.createElement(ProfileInventory, { profiles: [] }));
  assert.match(empty, /No profiles yet/);
  assert.match(empty, /Profiles you create/);

  const profiles = [{ _id: 'p1', name: 'Ana Dela Cruz', slug: 'ana-dela-cruz', status: 'published', updatedAt: Date.UTC(2026, 9, 16) }];
  const list = renderToStaticMarkup(React.createElement(ProfileInventory, { profiles, onEdit() {} }));
  assert.match(list, /Ana Dela Cruz/);
  assert.match(list, /\/p\/ana-dela-cruz/);
  assert.match(list, /published/);
  assert.match(list, /Updated/);
  assert.match(list, /1 profile/);
  assert.match(list, /Edit profile/);
  browser = await chromium.launch({ channel: 'chrome', headless: true });
  const page = await browser.newPage({ viewport: { width: 390, height: 844 } });
  const styles = await readFile(new URL('../src/admin/admin.css', import.meta.url), 'utf8');
  await page.setContent(`<style>${styles}</style><main class="admin-main">${list}</main>`);
  assert.equal(await page.locator('body').evaluate(element => element.scrollWidth <= window.innerWidth), true);
  assert.equal(await page.getByRole('row', { name: /Ana Dela Cruz/ }).count(), 1);
  console.log('PASS admin inventory empty and populated states');
} finally {
  await browser?.close();
  await server.close();
}
