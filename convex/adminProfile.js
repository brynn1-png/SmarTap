export function adminProfile(params) {
  const email = String(params.email || '').trim().toLowerCase();
  if (!process.env.ADMIN_EMAIL || email !== process.env.ADMIN_EMAIL.trim().toLowerCase() ||
      (params.flow === 'signUp' &&
        (!process.env.ADMIN_SETUP_CODE || params.setupCode !== process.env.ADMIN_SETUP_CODE))) {
    throw new Error('Admin account creation is unavailable.');
  }
  return { email };
}
