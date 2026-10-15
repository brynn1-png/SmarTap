import { defineSchema, defineTable } from 'convex/server';
import { v } from 'convex/values';
import { authTables } from '@convex-dev/auth/server';

const social = v.object({
  facebook: v.optional(v.string()),
  instagram: v.optional(v.string()),
  tiktok: v.optional(v.string()),
  messenger: v.optional(v.string()),
});

const appearance = v.object({
  portraitX: v.number(),
  portraitY: v.number(),
  portraitScale: v.number(),
  backgroundX: v.number(),
  backgroundY: v.number(),
  backgroundOverlay: v.number(),
  accentColor: v.string(),
  darkColor: v.string(),
});

export default defineSchema({
  ...authTables,
  profiles: defineTable({
    slug: v.string(),
    name: v.string(),
    headline: v.optional(v.string()),
    description: v.optional(v.string()),
    phone: v.optional(v.string()),
    email: v.optional(v.string()),
    address: v.optional(v.string()),
    mapsLocation: v.optional(v.string()),
    social,
    portraitStorageId: v.optional(v.id('_storage')),
    backgroundStorageId: v.optional(v.id('_storage')),
    portraitKind: v.optional(v.union(v.literal('cutout'), v.literal('photo'))),
    appearance,
    status: v.union(v.literal('draft'), v.literal('published'), v.literal('archived')),
    createdBy: v.id('users'),
    createdAt: v.number(),
    updatedAt: v.number(),
    publishedAt: v.optional(v.number()),
  }).index('by_slug', ['slug']).index('by_status', ['status']),
});
