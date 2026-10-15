# SmarTap client page system plan

## Goal

Give a SmarTap admin a dashboard for creating personal contact pages from one template. The admin enters a person's details, uploads a portrait and background, reviews and customizes the page, then publishes a stable URL to program onto an NFC card. Scanning the card opens that person's current page. The first release serves people, not business profiles.

One template renders every saved profile. Creating a client does not create a GitHub repository, a Vercel project, or a hand-edited HTML file.

## Project boundaries

- Keep this repository's marketing homepage and existing Starter and Business demos. Add the admin dashboard here at `/admin`.
- Adapt [httpkristine/TAGATAP](https://github.com/httpkristine/TAGATAP) in its existing GitHub repository as the **only** client page template. It is currently a static React/Vite page with Lloyd's details and image paths hardcoded; make those inputs data-driven.
- Deploy the admin/marketing app and TAGATAP renderer as separate projects. Serve pages from the canonical SmarTap site at `/p/:slug`, forwarding that path to TAGATAP with an explicit Vercel rewrite. Forward built assets and direct page loads correctly. Do not add a catch-all rewrite over the marketing and demo routes.
- Use one shared Convex backend per environment for profile records, backend functions, and uploaded image storage. Both apps use the same published-profile API. Use Convex Auth email/password for initial admin login; its beta status was accepted.
- The user confirmed permission and access to adapt TAGATAP directly. No license file was present when inspected on 2026-10-15.

## Routes and URLs

| Route | Purpose |
| --- | --- |
| `/` | Existing marketing site. |
| `/demo/index.html`, `/demo/business.html` | Existing illustrative demos. |
| `/admin` | Admin login and dashboard of all client pages. |
| `/admin/new`, `/admin/:id` | Create and edit a client page. |
| `/p/:slug` | Published personal page rendered by TAGATAP. Missing, draft, and archived profiles show a clear unavailable state. |

The public link is `https://smartap-png.vercel.app/p/<slug>` (for example, `https://smartap-png.vercel.app/p/juan-dela-cruz`). Store the slug separately from the origin. Reserve it when the draft is created, make it unique in a Convex backend mutation, and keep it unchanged after publication even if the person's name changes. Program NFC cards only with the published canonical URL.

## Profile data and assets

Store one profile record per person in Convex:

| Group | Initial fields |
| --- | --- |
| Identity | ID, unique slug, display name, optional role/tagline, short description, location text. |
| Contact | One normalized phone number for Call, Text, and vCard; email; optional maps destination, Messenger, and supported social links. |
| Images | Portrait and background file IDs, plus display settings for each image. |
| Appearance | A bounded set of color values, background overlay strength, and template text settings. |
| Publishing | Draft/published/archived status, creator, created/updated/published timestamps. |

Use Convex file storage for uploads and keep file IDs in profile records. Validate image type, dimensions, and size. Only approved assets appear on public pages. A Convex storage URL is shareable by anyone who has it, so draft image URLs must not be treated as private secrets.

TAGATAP currently hardcodes the name, portrait, background, contact actions, social destinations, vCard content, and page copy. Replace those client-specific constants with saved fields. Keep the page structure fixed and hide optional actions when their data is absent.

Publication requires a display name, an approved portrait, an approved background image, and at least one usable phone, email, or social link. The portrait control supports both ordinary photos and transparent cutouts. Other content remains optional. The admin previews a draft in the TAGATAP renderer through a same-origin iframe message; the preview route itself reads no draft record.

## Admin workflow

1. **Sign in:** Start with one provisioned admin account and no public sign-up flow. Show loading, unauthorized, and session-expired states.
2. **Create:** Enter identity, contact information, and links. Assign and reserve a readable slug; resolve collisions with a short suffix.
3. **Upload:** Add portrait and background images. Show progress and actionable errors.
4. **Review and customize:** Preview the TAGATAP template at mobile size. A Customization tab offers portrait/background positioning and scale, background overlay strength, and constrained color controls. Content fields remain editable. Show readability problems before publishing. No arbitrary CSS or layout editor is planned.
5. **Save draft:** Persist inputs and customization without making the page public.
6. **Publish:** Validate required content and approved assets, then show a copyable canonical URL for the NFC card. Edits and republishing retain the URL. Unpublishing removes public access; archive is preferred to permanent deletion.

The dashboard lists profiles with name, slug, status, update time, and actions to edit, preview, publish/unpublish, and copy the public link. Add search when the list warrants it. Show save, validation, upload, authentication, and network errors beside the affected action.

## Authentication and access

- Convex Auth identifies the signed-in admin. Do not grant admin rights merely because someone is signed in; authorize the provisioned admin email against a server-side allowlist in every sensitive Convex query, mutation, and action. Create the first account with a temporary server-side setup code, then remove that code.
- Public functions return only published profile fields needed by the template. Drafts, archived profiles, dashboard data, and writes require admin authorization. The `/admin` route guard is a UI convenience.
- Upload, replace, delete, publish, unpublish, and slug-reservation operations run through validated backend functions. Keep secrets in server-side configuration, never Vite public variables.
- Validate text lengths, safe web links, email, and normalized phone values at the backend boundary. Generate Call, Text, Maps, social, and vCard actions from saved values.

## Implementation sequence

The [step-by-step implementation plan and live checklist](.ai/tasks/TASK-001-client-page-system.md) tracks completed prerequisites, remaining phases, acceptance checks, and evidence. The sequence below is its summary.

1. **Template contract:** Agree on TAGATAP's data fields and image behavior. Convert its static page into a renderer for a profile object, retaining a fixture for local review.
2. **Convex foundation:** Set up the project, schema/indexes, storage, Convex Auth, admin authorization checks, and published-profile read function. Keep development and production configuration separate.
3. **Public pages:** Load by slug in TAGATAP, handle unavailable and network states, and build contact/share actions from profile data. Deploy the renderer and configure `/p/*` rewrites and asset paths on the main site.
4. **Admin dashboard:** Build login, list, editor, uploads, customization controls, preview, draft/publish controls, and copy-link action in this repository.
5. **Launch verification:** Test admin versus signed-out access, draft isolation, slug collisions and stability, publish/unpublish behavior, uploads, direct navigation and refresh, mobile layout, vCard/contact links, and scanning a programmed NFC card on a fresh phone. Test a Vercel preview before production.

Use UI/UX Pro Max and Impeccable for the admin editor and public-page design work, Wayfinder for unresolved cross-repository decisions, and Ponytail to keep the first release focused on one template and the controls needed to publish it.

## Release boundary and open checks

- Browser-rendered profiles may have generic social previews and may return HTTP 200 for a missing slug. Add server-rendered metadata and real HTTP 404 responses before search indexing or branded previews become requirements.
- The canonical origin is `https://smartap-png.vercel.app`; verify access to its owning Vercel project before deployment. TAGATAP permission/access and Convex Auth beta acceptance are confirmed. Provisioning the first admin still requires the chosen email and credential setup.
- Save draft then Publish protects NFC links from incomplete pages. A saved draft remains private until the separate Publish action succeeds.

## Done when

- An admin can create and publish a person's page without editing source files or deploying for that person.
- The generated URL loads the saved page from an NFC scan on a fresh phone and remains valid after edits and direct refresh.
- Call, Text, vCard, and optional links use the saved person's data.
- Public requests cannot read drafts or admin-only data, and non-admin users cannot change records or files.
- The existing marketing and demo pages continue to work.

## References

- [TAGATAP template](https://github.com/httpkristine/TAGATAP)
- [Convex authentication](https://docs.convex.dev/auth/overview) and [Convex Auth](https://docs.convex.dev/auth/convex-auth)
- [Convex file storage](https://docs.convex.dev/file-storage/overview)
- [Vercel rewrites](https://vercel.com/docs/routing/rewrites)
