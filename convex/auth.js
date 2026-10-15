import { Password } from '@convex-dev/auth/providers/Password';
import { convexAuth } from '@convex-dev/auth/server';
import { adminProfile } from './adminProfile.js';

// The setup code is stored only in the Convex deployment environment. Remove
// ADMIN_SETUP_CODE after the one approved admin account has been created.
const adminPassword = Password({
  profile: adminProfile,
  validatePasswordRequirements(password) {
    if (password.length < 14) throw new Error('Use at least 14 characters.');
  },
});

export const { auth, signIn, signOut, store, isAuthenticated } = convexAuth({
  providers: [adminPassword],
});
