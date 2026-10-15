import { v } from 'convex/values';
import { query, mutation } from './_generated/server';
import { requireAdmin } from './admin';
import { normalizeProfileInput, slugBase, validatePublication } from './profileValidation';

const optionalText = v.optional(v.string());
const profileInput = v.object({
  name: v.string(),
  headline: optionalText,
  description: optionalText,
  phone: optionalText,
  email: optionalText,
  address: optionalText,
  mapsLocation: optionalText,
  portraitKind: v.optional(v.union(v.literal('cutout'), v.literal('photo'))),
  social: v.optional(v.object({
    facebook: optionalText,
    instagram: optionalText,
    tiktok: optionalText,
    messenger: optionalText,
  })),
  appearance: v.optional(v.object({
    portraitX: v.optional(v.number()),
    portraitY: v.optional(v.number()),
    portraitScale: v.optional(v.number()),
    backgroundX: v.optional(v.number()),
    backgroundY: v.optional(v.number()),
    backgroundOverlay: v.optional(v.number()),
    accentColor: optionalText,
    darkColor: optionalText,
  })),
});

async function imageIsReferenced(ctx, storageId) {
  const profiles = await ctx.db.query('profiles').collect();
  return profiles.some(profile => profile.portraitStorageId === storageId || profile.backgroundStorageId === storageId);
}

async function images(ctx, profile) {
  return {
    portraitUrl: profile.portraitStorageId ? await ctx.storage.getUrl(profile.portraitStorageId) : null,
    backgroundUrl: profile.backgroundStorageId ? await ctx.storage.getUrl(profile.backgroundStorageId) : null,
  };
}

export const publishedBySlug = query({
  args: { slug: v.string() },
  handler: async (ctx, { slug }) => {
    const profile = await ctx.db.query('profiles').withIndex('by_slug', q => q.eq('slug', slug)).unique();
    if (!profile || profile.status !== 'published') return null;
    return {
      slug: profile.slug,
      name: profile.name,
      headline: profile.headline,
      description: profile.description,
      phone: profile.phone,
      email: profile.email,
      address: profile.address,
      mapsLocation: profile.mapsLocation,
      social: profile.social,
      portraitKind: profile.portraitKind,
      appearance: profile.appearance,
      ...await images(ctx, profile),
    };
  },
});

export const list = query({
  args: {},
  handler: async ctx => {
    await requireAdmin(ctx);
    const profiles = await ctx.db.query('profiles').collect();
    return profiles.map(({ _id, slug, name, status, updatedAt, publishedAt }) => ({ _id, slug, name, status, updatedAt, publishedAt }))
      .sort((a, b) => b.updatedAt - a.updatedAt);
  },
});

export const getForAdmin = query({
  args: { id: v.id('profiles') },
  handler: async (ctx, { id }) => {
    await requireAdmin(ctx);
    const profile = await ctx.db.get(id);
    return profile ? { ...profile, ...await images(ctx, profile) } : null;
  },
});

export const createDraft = mutation({
  args: { input: profileInput },
  handler: async (ctx, { input }) => {
    const userId = await requireAdmin(ctx);
    const fields = normalizeProfileInput(input);
    const base = slugBase(fields.name);
    let slug = base;
    for (let suffix = 2; await ctx.db.query('profiles').withIndex('by_slug', q => q.eq('slug', slug)).first(); suffix++) {
      slug = `${base}-${suffix}`;
    }
    const now = Date.now();
    return await ctx.db.insert('profiles', { ...fields, slug, status: 'draft', createdBy: userId, createdAt: now, updatedAt: now });
  },
});

export const save = mutation({
  args: { id: v.id('profiles'), input: profileInput },
  handler: async (ctx, { id, input }) => {
    await requireAdmin(ctx);
    const profile = await ctx.db.get(id);
    if (!profile) throw new Error('Profile not found.');
    const fields = normalizeProfileInput({ ...input, portraitKind: input.portraitKind ?? profile.portraitKind, appearance: { ...profile.appearance, ...input.appearance } });
    if (profile.status === 'published') validatePublication({ ...profile, ...fields });
    await ctx.db.patch(id, { ...fields, updatedAt: Date.now() });
  },
});

export const publish = mutation({
  args: { id: v.id('profiles') },
  handler: async (ctx, { id }) => {
    await requireAdmin(ctx);
    const profile = await ctx.db.get(id);
    if (!profile) throw new Error('Profile not found.');
    validatePublication(profile);
    if (!await ctx.db.system.get('_storage', profile.portraitStorageId) ||
        !await ctx.db.system.get('_storage', profile.backgroundStorageId)) {
      throw new Error('Re-upload missing images before publishing.');
    }
    await ctx.db.patch(id, { status: 'published', publishedAt: Date.now(), updatedAt: Date.now() });
    return profile.slug;
  },
});

export const unpublish = mutation({
  args: { id: v.id('profiles') },
  handler: async (ctx, { id }) => {
    await requireAdmin(ctx);
    const profile = await ctx.db.get(id);
    if (!profile) throw new Error('Profile not found.');
    await ctx.db.patch(id, { status: 'draft', updatedAt: Date.now() });
  },
});

export const archive = mutation({
  args: { id: v.id('profiles') },
  handler: async (ctx, { id }) => {
    await requireAdmin(ctx);
    const profile = await ctx.db.get(id);
    if (!profile) throw new Error('Profile not found.');
    await ctx.db.patch(id, { status: 'archived', updatedAt: Date.now() });
  },
});

export const generateUploadUrl = mutation({
  args: {},
  handler: async ctx => {
    await requireAdmin(ctx);
    return await ctx.storage.generateUploadUrl();
  },
});

export const attachImage = mutation({
  args: { id: v.id('profiles'), kind: v.union(v.literal('portrait'), v.literal('background')), storageId: v.id('_storage') },
  handler: async (ctx, { id, kind, storageId }) => {
    await requireAdmin(ctx);
    const profile = await ctx.db.get(id);
    if (!profile) throw new Error('Profile not found.');
    const metadata = await ctx.db.system.get('_storage', storageId);
    if (!metadata || !['image/jpeg', 'image/png', 'image/webp'].includes(metadata.contentType) || metadata.size > 8 * 1024 * 1024) {
      throw new Error('Upload a JPEG, PNG, or WebP image under 8 MB.');
    }
    const field = kind === 'portrait' ? 'portraitStorageId' : 'backgroundStorageId';
    const previousId = profile[field];
    await ctx.db.patch(id, { [field]: storageId, updatedAt: Date.now() });
    if (previousId && previousId !== storageId && !await imageIsReferenced(ctx, previousId) && await ctx.db.system.get('_storage', previousId)) {
      await ctx.storage.delete(previousId);
    }
  },
});

export const discardUpload = mutation({
  args: { storageId: v.id('_storage') },
  handler: async (ctx, { storageId }) => {
    await requireAdmin(ctx);
    if (await imageIsReferenced(ctx, storageId)) {
      throw new Error('This image is attached to a profile.');
    }
    if (await ctx.db.system.get('_storage', storageId)) await ctx.storage.delete(storageId);
  },
});
