import assert from 'node:assert/strict';
import { draftInput, imageError, publishedUrl } from '../src/admin/profileEditor.js';

const input = draftInput({ name: ' Ana ', phone: '+63 916 370 9474', social: { instagram: 'https://instagram.com/ana' } });
assert.equal(input.name, 'Ana');
assert.equal(input.phone, '+639163709474');
assert.equal(input.social.instagram, 'https://instagram.com/ana');
assert.throws(() => draftInput({ name: 'Ana', phone: 'invalid' }), /Phone/);
assert.equal(imageError({ type: 'image/png', size: 1024 }), '');
assert.match(imageError({ type: 'image/svg+xml', size: 1024 }), /JPEG, PNG, or WebP/);
assert.match(imageError({ type: 'image/png', size: 9 * 1024 * 1024 }), /8 MB/);
assert.equal(publishedUrl('ana-dela-cruz'), 'https://smartap-png.vercel.app/p/ana-dela-cruz');
console.log('PASS editor input, image rules, and canonical URL');
