# SmarTap profile web app plan

## Goal

Turn the current static card demos into a web app where an authorized SmarTap admin creates a business profile, publishes it, and copies a stable public link. Visitors open that link on a phone and see the business card with working contact actions.

First-release assumption: the editor creates business profiles. The existing personal Starter card stays a demo until its separate required fields are defined.

## Recommended first release

- Keep the existing React + Vite site and its marketing and demo pages.
- Use Supabase for Postgres, admin sign-in, and image storage. Its browser client can read published data and perform admin writes when database Row Level Security (RLS) policies allow them. Keep secret keys out of the browser.
- Keep the current six card designs and Light/Dark modes. Extract the card into one data-driven component so the demo, admin preview, and public profile show the same design.
- Use one invite-only admin account at first. Add client accounts and permissions only when needed.

## Routes

| Route | Purpose |
| --- | --- |
| `/` | Existing SmarTap website. |
| `/admin` | Admin sign-in and profile list; signed-in admin can create, edit, preview, publish, unpublish, and copy links. |
| `/admin/new` and `/admin/:id` | Create and edit screens within the admin app. |
| `/p/:slug` | Public, mobile-first business profile. Show only published profiles; show a clear not-found page for missing or unpublished slugs. |
| `/demo/*` | Keep existing examples and design picker for internal review. |

Add Vite HTML entries for the admin and public profile apps. Add explicit Vercel rewrites for `/admin/*` and `/p/*` so a copied link works when opened directly or refreshed. Do not use a catch-all rewrite that swallows the existing demo and asset routes. Store the slug, not the full URL; construct the share link from a configured canonical site origin.

## Profile data

Start with one `business_profiles` table:

| Group | Fields |
| --- | --- |
| Identity | `id`, unique `slug`, `business_name`, optional `contact_name`, `role`, `short_description`, `location_text` |
| Contact | one `phone_e164` used for both Call and Text, `email`, optional `website_url`, `messenger_url`, `maps_url`, and ordered social links |
| Visuals | `hero_image_path`, `portrait_or_logo_path`, selected `design` (`minimal`, `forest`, `mono`, `editorial`, `cobalt`, `outline`), `theme` (`light`, `dark`) |
| Publishing | `status` (`draft`, `published`, `archived`), `created_by`, `created_at`, `updated_at`, `published_at` |

Use a unique database constraint on `slug`. Generate a readable slug when creating the record and resolve collisions with a short suffix. Keep a published slug stable when the business name changes, so printed QR codes and shared links continue working. Keep uploaded images in Storage and paths in Postgres; do not put image bytes in the table. For this first release, uploaded images must be approved for public display.

## Admin flow

1. Admin signs in at `/admin`. Disable public self-sign-up and provision the initial admin through the provider dashboard or a trusted server process.
2. Admin selects **Create profile**, enters business/contact details, uploads a hero image and portrait or logo, and chooses a design and mode. Show a live mobile preview using the shared card component.
3. **Save draft** stores the record and reserves its slug. **Publish** validates required fields, makes the profile public, and shows its copyable `/p/:slug` link and QR-ready URL.
4. Admin can edit and republish without changing the link, or unpublish to remove public access. Prefer archive over permanent deletion in the first release.

Validate required fields and lengths, normalize the phone number, allow only safe `https:`/`http:` links, and check image type and size before upload. Build Call, Text, Share, and vCard actions from the saved profile data, not the current Lloyd demo constants. Show save, upload, authentication, and network errors next to the relevant action.

## Access rules

- The public client may read **published** profiles only. Draft and archived records must not appear through direct database requests.
- Only authenticated users with a trusted admin role may read all profiles or create, update, publish, and archive them. Put the role in provider-controlled app metadata, not editable user metadata. Enforce access with database grants and RLS, not just an `/admin` route check.
- Allow public reads of approved profile images; allow uploads, replacement, and removal only for admins. Never expose a Supabase secret/service key through Vite environment variables or client code.
- Keep the admin login and public profile states distinct: loading, unauthorized, not found, unpublished, and network failure.

## Implementation order

1. **Shared card:** extract the current card from `src/StarterDemo.jsx` into a component that receives profile data; keep demo content as a fixture. Confirm all six designs and both modes still render.
2. **Database and policies:** add versioned SQL migrations for `business_profiles`, slug/status constraints, indexes, RLS grants and policies, and Storage upload policies. Add an `.env.example` with the public Supabase URL/key and canonical site origin.
3. **Public route:** add `/p/:slug`, query a published profile, render the shared card, and generate Save contact and Share links from its data. Add Vercel rewrites and verify direct navigation and refresh.
4. **Admin route:** add invite-only sign-in, list/search, create/edit form, image upload, live preview, draft/publish controls, and copy-link action.
5. **Launch checks:** seed one fictional test business, test access rules for signed-out users, normal signed-in users, and admins; test slug collisions and unpublishing; verify mobile widths, both modes, image loading, Call/Text, vCard, and Share on a phone. Deploy to a Vercel preview before production.

## Release boundary and follow-up

The first release can load `/p/:slug` through a Vite page plus a Vercel rewrite. The card will work for visitors, but a purely client-rendered page may have generic social-link previews and may return HTTP 200 for a missing slug. Before relying on search indexing or branded link previews, add a small server-rendered profile response with per-profile title, description, image, canonical URL, and real HTTP 404 responses. Keep this separate from the core profile editor unless link-preview quality is a launch requirement.

## Done when

- An admin can create and publish a business profile without editing source files.
- The generated link opens the saved business profile on a fresh device and after refresh.
- Call and Text use the same saved phone number; other contact actions use saved values.
- Public requests cannot read or change drafts or admin-only data, and non-admin users cannot upload images.
- Existing marketing and demo routes still work.

## References

- [Vite multi-page builds](https://vite.dev/guide/build#multi-page-app)
- [Vercel rewrites](https://vercel.com/docs/routing/rewrites) and [Vite deep links on Vercel](https://vercel.com/docs/frameworks/frontend/vite)
- [Supabase RLS](https://supabase.com/docs/guides/database/postgres/row-level-security), [frontend key guidance](https://supabase.com/docs/guides/database/secure-data), and [Storage policies](https://supabase.com/docs/guides/storage/security/access-control)
