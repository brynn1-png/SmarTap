# Progress

## Current State Summary

The SmarTap marketing site and demos remain in the main checkout. TASK-001 is in progress in isolated worktrees under `.qa/worktrees/`: TAGATAP and the SmarTap admin/editor pass local build and browser checks. The first development admin account exists. Phase 6 Vercel routing is configured and the combined built apps pass a local same-origin browser check, including the preview iframe; real Vercel preview deployment and signed-in browser verification remain pending. No published client page is live.

## Entries

- 2026-10-16: Prepared Phase 6 routing in the two worktrees. TAGATAP now builds renderer assets under `/tagatap/`; SmarTap has environment-specific Vercel external rewrites for public pages and renderer assets. A combined local built-app browser check passed two profile routes, unavailable routes, refreshes, images/styles, preserved marketing/demo/admin routes, and same-origin preview messaging. Next: connect Vercel, deploy both previews with development Convex, verify actual Vercel routing and signed-in admin, then request production review.

- 2026-10-16: Added the Phase 5 admin editor in the SmarTap worktree: draft creation, detail/social fields, portrait/background upload, customization, preview handshake, save/publish/unpublish/archive, and canonical URL copy. TAGATAP now announces preview readiness. Deployed image replacement/discard cleanup to development Convex. Local browser checks cover the lifecycle and error recovery with a mocked signed-in backend; next verify a real signed-in browser and route the actual renderer at `/p/preview` and `/p/:slug` in Phase 6.

- 2026-10-16: Continued Phase 4 in the SmarTap worktree. Added responsive accessible profile inventory, query-error retry screen, and unauthorized sign-out failure feedback. Verified empty/populated inventory rendering, 390px overflow, signed-out admin route, existing validation tests, and four-entry build. Next: implement profile editor and draft preview actions, then verify the signed-in browser flow.

- 2026-10-16: Connected TAGATAP `/p/:slug` to the published-only Convex query, added loading/unavailable/retry states, and enabled Share Page only for published profiles. Kept `/p/preview` isolated and the root Lloyd fixture for review. Verified two temporary published development profiles, an unpublished URL, mobile layout, and deep-link refresh; removed all QA records/images. Next: finish the admin dashboard/editor and deploy the two apps with canonical routing.

- 2026-10-16: Verified the signed-in development admin can create drafts, reserve collision-safe slugs, upload images, publish, edit without changing the slug, unpublish, republish, and archive. Public reads hid drafts and unpublished pages; a foreign identity was denied. Removed all three archived QA records and uploaded test images, then removed the temporary test/cleanup code. Next: complete the admin UI and public renderer integration.

- 2026-10-15: User confirmed the local admin setup now works. Verified one matching authorized user in Convex development project `smartap-a93dc`, removed `ADMIN_SETUP_CODE` from deployment `courteous-falcon-337`, and updated the task checklist. Next: verify signed-in admin profile lifecycle and finish the dashboard/editor phases.

- 2026-10-15: Diagnosed the failed first-admin signup. A temporary development-only Convex diagnostic showed the authorized email matched, setup was enabled, and the submitted code did not match the stored value. Removed and redeployed the diagnostic; next: user copies the exact code value from `courteous-falcon-337` and completes setup, then run signed-in checks.

- 2026-10-15: Built the first SmarTap `/admin` shell in the isolated worktree: sign-in, one-time first-account setup, server-checked admin gate, profile inventory, local and Vercel path routing. Started localhost:5180 for account setup. Next: user creates the first account, then verify admin and non-admin behavior and continue the profile editor.

- 2026-10-15: Configured development-only Convex Auth signing keys and set `ADMIN_EMAIL` to the user's supplied address. No key values or passwords were stored in source or logs. Next: create the first account through an approved secure signup flow, then verify signed-in authorization and profile transitions.

- 2026-10-15: User supplied the Convex dashboard URL and confirmed using project `smartap-a93dc`; its development deployment already matches the isolated backend worktree. Re-deployed the auth correction and repeated anonymous access checks. Next: configure auth secrets and provision the first admin after receiving the admin email.

- 2026-10-15: Corrected the Convex Auth signup gate in the isolated SmarTap worktree so removing `ADMIN_SETUP_CODE` after provisioning will not block future sign-ins. Awaiting the earlier project's dashboard URL before switching cloud configuration.

- 2026-10-15: Began TASK-001 in isolated TAGATAP and SmarTap worktrees. Completed the TAGATAP profile contract and draft preview proof; deployed a Convex development schema and protected function foundation. Next: switch to the user's earlier Convex project after receiving its URL, provision admin auth, complete backend integration tests, then build the admin UI.

- 2026-10-15: Added a phase-by-phase implementation checklist with completed planning work, pending decisions, repository ownership, acceptance checks, and an NFC end-to-end launch gate. Next: resolve Phase 0 decisions before implementation.

- 2026-10-15: Replaced the earlier business-profile/Supabase proposal with a personal-page plan using the separate TAGATAP template repository, Convex, an admin dashboard, and stable NFC URLs. Next: confirm the canonical domain, TAGATAP access/permission, and Convex Auth choice before implementation.

- 2026-10-13: Promoted the footer save-contact action with a filled lime treatment, larger touch target, and clear hover and pressed states.

- 2026-10-13: Added a mobile-only “Swipe to view more packages” cue beneath the horizontal package carousel.

- 2026-10-12: Added the approved portrait mobile hero and served it below 760px through a responsive picture source.

- 2026-10-12: Applied a subtle 6% desktop zoom to the panoramic hero while retaining the existing mobile crop.

- 2026-10-12: Replaced the homepage hero source with an approved panoramic extension that preserves more of the subject on wide screens; retained the earlier image for the Starter demo.

- 2026-10-12: Refined the full-bleed homepage hero hierarchy, alignment, overlay contrast, CTA grouping, and responsive spacing without changing its content or image.

- 2026-10-12: Made the homepage hero fully edge-to-edge by removing its shell background and spacing, width cap, rounded frame, and breakpoint height overrides.

- 2026-10-12: Changed the homepage hero backing surface to `#171a17` and removed the white frame border on desktop and mobile.

- 2026-10-12: Restored the exact earlier compact-mark card image selected by the user from the conversation preview.

- 2026-10-12: Measured the photographed card and placed the compact mark at its geometric center, replacing the earlier visually offset version.

- 2026-10-12: Repositioned the compact mark toward the lower-right so it is visually centered on the tabletop card.

- 2026-10-12: Replaced the large wordmark printed on the tabletop card photo with the compact lime SmarTap mark while preserving the photo composition and dimensions.

- 2026-10-12: Removed preview routes and their state/styles, unused photos and logos, reference bundle, old screenshots/scripts/reports, and desktop.ini. Updated README, architecture, context, and ignore rules.

- 2026-10-12: Replaced the FAQ circled plus icons with simple SVG chevrons that point down when closed and up when open.

- 2026-10-12: FAQ answers now expand and collapse with a 200ms transition and a rotating chevron.

- 2026-10-12: Mobile package cards now scroll horizontally with snap alignment and a visible edge of the next card.

- 2026-10-12: Changed all package cards to put the name and price beside the phone image, with a full-width description below. Kept the same arrangement on mobile.

- 2026-10-12: Added the shared phone image to Starter, Business, and Executive package cards and adjusted desktop and mobile spacing. Screen content is deferred as requested.

- 2026-10-12: Aligned the `.ai/tasks/` path, documented the current implementation, made skill guidance agent-neutral, and added this state log. Next: use the harness for the next approved development task.
- 2026-10-12: Added the SmarTap mark to the handheld card photo and the wordmark to the tabletop card photo. Updated the homepage and Starter demo to use the branded copies.
- 2026-10-12: Created `public/phones-3d.svg` from the supplied two-phone reference and saved a rendered preview in `design-review/`. Next: review where to use it and what to put on the screens.
- 2026-10-12: Retired the rejected SVG and preview, then made a transparent PNG cutout. The first cutout used the wrong visual reference; corrected `public/phones-transparent.png` from the user's original photorealistic two-phone image. Next: review the cutout before placing it.
