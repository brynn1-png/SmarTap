import { getAuthUserId } from '@convex-dev/auth/server';
import { query } from './_generated/server';

async function adminUserId(ctx) {
  const userId = await getAuthUserId(ctx);
  const configuredEmail = process.env.ADMIN_EMAIL?.trim().toLowerCase();
  if (!userId || !configuredEmail) return null;
  const user = await ctx.db.get(userId);
  return user?.email?.trim().toLowerCase() === configuredEmail ? userId : null;
}

export const viewer = query({
  args: {},
  handler: async ctx => Boolean(await adminUserId(ctx)),
});

export async function requireAdmin(ctx) {
  const userId = await adminUserId(ctx);
  if (!userId) throw new Error('Admin access required.');
  return userId;
}
