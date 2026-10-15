import assert from 'node:assert/strict';
import { normalizeProfileInput, slugBase, validatePublication } from '../convex/profileValidation.js';

assert.equal(slugBase('Ana Dela Cruz'), 'ana-dela-cruz');
assert.equal(slugBase('José Reyes'), 'jose-reyes');
const input = normalizeProfileInput({ name: ' Ana ', phone: '+63 917 555 0123', email: 'ANA@EXAMPLE.COM' });
assert.equal(input.name, 'Ana');
assert.equal(input.phone, '+639175550123');
assert.equal(input.email, 'ana@example.com');
assert.throws(() => normalizeProfileInput({ name: 'Ana', social: { facebook: 'javascript:alert(1)' } }), /HTTPS/);
assert.throws(() => normalizeProfileInput({ name: 'Ana', appearance: { portraitScale: 99 } }), /range/);
assert.throws(() => validatePublication(input), /portrait/);
assert.doesNotThrow(() => validatePublication({ ...input, portraitStorageId: 'portrait', backgroundStorageId: 'background' }));
assert.throws(() => validatePublication({ name: 'Ana', portraitStorageId: 'portrait', backgroundStorageId: 'background', social: {} }), /phone, email, or social/);
console.log('PASS profile input, slug, and publication validation');
