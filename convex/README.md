# SmarTap Convex backend

This directory owns the profile schema, publication lifecycle, image references, and admin authorization. The TAGATAP renderer reads only `profiles.publishedBySlug`. Dashboard operations call the admin functions in `profiles.js`; every such function checks `ADMIN_EMAIL` against the signed-in Convex Auth user.

## Environments

Use the user's chosen Convex project. Run `npx convex dev --configure existing --team <team-slug> --project <project-slug> --dev-deployment cloud --once` to link a development deployment. Convex writes deployment URLs to the ignored `.env.local`. Production is a separate deployment in the same project and must receive its own environment settings. Do not put secrets in `VITE_` variables.

Convex Auth requires `JWT_PRIVATE_KEY` and `JWKS` in each deployment; generate them as documented by Convex. Configure `ADMIN_EMAIL` to the first authorized admin email. During first account creation only, set a random `ADMIN_SETUP_CODE` in the deployment environment. The account's password signup request must include `email`, `password`, `flow: 'signUp'`, and `setupCode`; the provider rejects other addresses/codes. Remove `ADMIN_SETUP_CODE` after that account is created. No public signup UI is planned.

The chosen email address, setup code, private key, and password must stay out of source control and logs. The development deployment has `ADMIN_EMAIL`, `JWT_PRIVATE_KEY`, and `JWKS`. The first admin account was created on 2026-10-15 and `ADMIN_SETUP_CODE` was removed; signing in remains available at the local `/admin` route. Password recovery and production key provisioning remain pending.

## Profile rules

`createDraft` reserves a unique slug. `save` never changes it. `publish` requires name, portrait, background, and one phone/email/social contact. `unpublish` hides the record without changing its URL. `archive` retains the record and slug. Published reads return the renderer fields only; missing, draft, and archived slugs return `null`.

Upload URLs require admin authorization. `attachImage` accepts JPEG, PNG, or WebP under 8 MB and checks storage metadata before attaching. Replacing an image deletes the previous file when no profile references it. The editor calls `discardUpload` if attachment fails; that mutation refuses to delete a referenced file. An upload interrupted after storage succeeds but before the browser receives its ID can leave an unattached file, so a later storage audit is still needed. Convex storage URLs are bearer links, so draft image URLs are returned only to the admin query and must not be placed in public pages.

## Verification

- `npm test` checks input normalization, slug creation, and publish requirements.
- `npm run test:convex` calls the linked deployment to check anonymous public reads and rejection of unauthenticated admin list/create/upload calls.
- The development admin identity passed a live draft-to-publish, edit, unpublish, republish, and archive check with uploaded images. Anonymous draft visibility and a foreign identity denial were checked. A real signed-in non-admin account and two simultaneous published slugs remain to be verified.
