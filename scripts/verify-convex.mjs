import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { ConvexHttpClient } from 'convex/browser';
import { api } from '../convex/_generated/api.js';

const env = readFileSync(new URL('../.env.local', import.meta.url), 'utf8');
const url = env.match(/^VITE_CONVEX_URL=(.+)$/m)?.[1]?.trim();
if (!url) throw new Error('Run npx convex dev --once first.');
const client = new ConvexHttpClient(url);

assert.equal(await client.query(api.profiles.publishedBySlug, { slug: 'missing' }), null);
assert.equal(await client.query(api.admin.viewer, {}), false);
await assert.rejects(client.query(api.profiles.list, {}), /Admin access required/);
await assert.rejects(client.mutation(api.profiles.createDraft, { input: { name: 'Unauthorized' } }), /Admin access required/);
await assert.rejects(client.mutation(api.profiles.generateUploadUrl, {}), /Admin access required/);
console.log('PASS anonymous reads show only published profiles; admin read, write, and upload require authorization');
