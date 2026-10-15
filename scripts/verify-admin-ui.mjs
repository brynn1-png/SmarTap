import assert from 'node:assert/strict';
import { fileURLToPath } from 'node:url';
import { chromium } from 'playwright';
import { createServer } from 'vite';
import config from '../vite.config.js';

const server = await createServer({ ...config, configFile: false, server: { host: '127.0.0.1', port: 0 } });
let browser;
try {
  await server.listen();
  browser = await chromium.launch({ channel: 'chrome', headless: true });
  const page = await browser.newPage({ viewport: { width: 390, height: 844 } });
  await page.goto(`${server.resolvedUrls.local[0]}admin/`);
  await page.getByRole('heading', { name: 'Admin sign in' }).waitFor({ timeout: 15000 });
  await page.goto(`${server.resolvedUrls.local[0]}admin`);
  await page.getByRole('heading', { name: 'Admin sign in' }).waitFor({ timeout: 15000 });
  await page.reload();
  await page.getByRole('heading', { name: 'Admin sign in' }).waitFor({ timeout: 15000 });
  assert.equal(await page.getByLabel('Email address').count(), 1);
  assert.equal(await page.getByLabel('Password').count(), 1);
  if (process.env.ADMIN_CAPTURE) await page.screenshot({ path: fileURLToPath(new URL('../../../admin-mobile.png', import.meta.url)), fullPage: true });
  await page.getByRole('button', { name: 'Set up first account' }).click();
  assert.equal(await page.getByLabel('One-time setup code').count(), 1);
  assert.equal(await page.locator('body').evaluate(element => element.scrollWidth <= window.innerWidth), true);
  if (process.env.ADMIN_CAPTURE) {
    await page.getByRole('button', { name: 'Back to sign in' }).click();
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.screenshot({ path: fileURLToPath(new URL('../../../admin-desktop.png', import.meta.url)), fullPage: true });
  }
  console.log('PASS admin route, sign-in, setup fields, and mobile width');
} finally {
  await browser?.close();
  await server.close();
}
