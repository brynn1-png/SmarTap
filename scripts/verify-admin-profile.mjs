import assert from 'node:assert/strict';
import { adminProfile } from '../convex/adminProfile.js';

process.env.ADMIN_EMAIL = 'admin@example.com';
process.env.ADMIN_SETUP_CODE = 'one-time-code';

assert.deepEqual(
  adminProfile({ flow: 'signUp', email: ' ADMIN@EXAMPLE.COM ', setupCode: 'one-time-code' }),
  { email: 'admin@example.com' },
);
assert.throws(() => adminProfile({ flow: 'signUp', email: 'admin@example.com' }));
assert.throws(() => adminProfile({ flow: 'signUp', email: 'other@example.com', setupCode: 'one-time-code' }));

delete process.env.ADMIN_SETUP_CODE;
assert.deepEqual(adminProfile({ flow: 'signIn', email: 'admin@example.com' }), { email: 'admin@example.com' });
assert.throws(() => adminProfile({ flow: 'signIn', email: 'other@example.com' }));
assert.throws(() => adminProfile({ flow: 'signUp', email: 'admin@example.com', setupCode: 'one-time-code' }));

console.log('PASS admin signup and sign-in gate');
