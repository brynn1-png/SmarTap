# Decisions

## Current State Summary

Ship only the homepage, Starter demo, and Business demo from current SmarTap production. The client-page system under development uses the existing TAGATAP template, Convex project `smartap-a93dc`, an admin dashboard, and stable `https://smartap-png.vercel.app/p/:slug` URLs. Both isolated worktrees have protected Vercel previews. Production promotion awaits a signed-in combined preview review and production configuration. The Convex development deployment is `courteous-falcon-337`.

## Entries

- 2026-10-16: Keep `/admin` on the existing SmarTap origin. The separate TAGATAP project renders client pages only; its deployment URL is an implementation detail, not an admin address. The user's requested public admin URL is `https://smartap-png.vercel.app/admin`.

- 2026-10-16: Keep Vercel Authentication enabled on both preview projects while checking the same-team protected rewrite with a signed-in Vercel browser. Automatic approval review rejected a project-wide TAGATAP SSO disable because it would expose every deployment and that security change was not explicitly authorized. Do not use automation bypass as evidence that the browser rewrite works; Vercel does not forward that authentication to a protected destination. The first renderer deployment created an unconfigured production alias, which must not be used for NFC cards.

- 2026-10-16: Reserve `/tagatap/` for renderer build assets so TAGATAP and the SmarTap marketing/admin build can share one browser origin without `/assets` collisions. Use Vercel's external rewrite for `/p/:slug` and `/tagatap/:path*`; set `TAGATAP_ORIGIN` per SmarTap deployment through Vercel environment settings. Keep the canonical copied NFC URL at `https://smartap-png.vercel.app/p/:slug`. Production promotion waits for a real preview review.

- 2026-10-16: The Phase 5 editor uses the backend's pure profile normalizer for client-side validation, then protected Convex mutations as the authority. Draft preview stays in a same-origin iframe and waits for TAGATAP's `smartap:ready` message before sending profile data; it times out with retry when routing is unavailable. Uploaded images are deleted on replacement when unreferenced, and failed attachments request protected cleanup. The canonical URL remains fixed to `https://smartap-png.vercel.app/p/:slug`.

- 2026-10-16: Keep Phase 4 dashboard actions limited to working behavior. Create/edit/draft-preview controls depend on the Phase 5 editor and same-origin preview integration, so the inventory currently presents status and stable path without dead links. Use the existing SmarTap admin visual language for the responsive list and recovery states.

- 2026-10-16: TAGATAP loads public `/p/:slug` records through Convex's published-only query using a public `VITE_CONVEX_URL`. The admin draft preview remains a same-origin message flow with no draft query. Share Page uses the current browser origin plus the published slug, so the Phase 6 same-origin rewrite will produce canonical NFC links.

- 2026-10-16: Use Convex CLI test identities for development authorization checks so the admin password stays private. Test data is clearly labeled and removed after live lifecycle verification; a real signed-in non-admin account still needs separate verification.

- 2026-10-15: After confirming the first development admin exists, remove the one-time `ADMIN_SETUP_CODE` as originally planned. Keep `ADMIN_EMAIL` and Convex Auth keys for normal sign-in; production will need separate provisioning.

- 2026-10-15: Keep the generic client-facing setup failure to avoid revealing account and setup-code checks to visitors. Use secret-free, temporary backend diagnostics for the development signup failure; remove them immediately after diagnosis.

- 2026-10-15: Move the admin access shell ahead of the public renderer so the first admin can securely choose a password and Phase 2 signed-in checks can proceed. Preserve the existing SmarTap Inter/lime visual language. Keep `ADMIN_SETUP_CODE` only in Convex development environment and remove it after first signup; no password or code enters source or logs.

- 2026-10-15: Restrict development admin access to the user's supplied Gmail address through Convex `ADMIN_EMAIL`; retain a temporary setup code for account creation and remove it afterward. Password-only Convex Auth does not require `SITE_URL` in the current manual setup guidance.

- 2026-10-15: The user confirmed using `smartap-a93dc`, the project identified by their Convex dashboard URL. Continue with `courteous-falcon-337` for development; no project switch is needed. The admin email remains unspecified.

- 2026-10-15: Request the earlier Convex project's HTTPS dashboard page URL to identify the project and team before linking it. A `.convex.cloud` deployment URL alone is not the requested project identity. Keep the setup code mandatory for signup and removable afterward without affecting sign-in.

- 2026-10-15: User confirmed TAGATAP permission/access, the existing SmarTap Vercel origin, Convex Auth beta with email/password, both ordinary and transparent-cutout portraits, and a publication minimum of name, portrait, background, and one contact method. Save draft then Publish is retained. The empty TAGATAP preview shell accepts profile data only by same-origin iframe message from the admin browser.

- 2026-10-15: Use a server-side admin email allowlist and temporary setup code for the first Convex Auth password account; remove the code after provisioning. Keep credentials out of source and logs. The exact admin email and final Convex project are pending user input. A new project `smartap-a93dc` was created after the user selected “Create a new SmarTap Convex project,” but the user subsequently said to use an earlier project; do not add real data to the new project.

- 2026-10-15: Keep product requirements in `plan.md` and track execution in one task checklist under `.ai/tasks/`. Phase 0 records unresolved decisions before either repository's implementation begins.

- 2026-10-15: For the proposed first release, serve people only; adapt the existing TAGATAP repository directly as the single template; keep marketing/admin in this repository; use Convex for records and image storage, with Convex Auth proposed for login. Use one canonical path URL per person so NFC cards keep working after edits. Save draft then Publish remains a plan assumption to confirm before implementation.

- 2026-10-13: Use the existing SmarTap lime for the primary footer CTA rather than introducing another accent; retain the button's current placement and behavior.

- 2026-10-13: Keep the package swipe cue static, text-led, and mobile-only; reuse the existing arrow component and leave scroll snapping unchanged.

- 2026-10-12: Use `hero-editorial-mobile.png` at 760px and below through native `<picture>` selection; keep `hero-editorial-wide.png` as the desktop fallback.

- 2026-10-12: Limited the panoramic hero's 6% scale increase to desktop; mobile remains unscaled because its narrow crop already presents the subject closely.

- 2026-10-12: Added the approved generated image as `hero-editorial-wide.png` instead of overwriting `hero-editorial-branded.png`, because the latter remains in use by the Starter demo.

- 2026-10-12: Preserved the hero's image-led concept and React structure; improved it through focused CSS alignment, contrast, spacing, and CTA refinements with no new dependency.

- 2026-10-12: The hero image now defines the entire section surface at full width and `100svh`; mobile retains only its focal-position adjustment.

- 2026-10-12: Kept the hero shell spacing and rounded corners while replacing its sage backing with dark ink and removing the decorative white border.

- 2026-10-12: User selected the earlier generated card version shown in their screenshot. Restored that exact file without further positioning or regeneration.

- 2026-10-12: Used measured image coordinates for final placement: card center (550.0, 779.8) and mark bounding-box center (549.5, 780.0). Used the generated blank card texture as the base and preserved the existing compact mark pixels.

- 2026-10-12: Centered the compact mark optically within the photographed card face rather than relying on its first placement.

- 2026-10-12: Used the existing compact SVG mark as the exact reference for the photographic edit. Kept the same asset path so the homepage and Starter demo receive the update without code changes.

- 2026-10-12: User confirmed removing design previews. Removed superseded original photos as part of launch cleanup; branded runtime photos remain. Removed obsolete design QA reports with their captures to avoid stale verification claims.

- 2026-10-12: Use a decorative inline SVG chevron without a circle for FAQ state; retain the 200ms rotation and reduced-motion support.

- 2026-10-12: FAQ uses independent React disclosure state and CSS grid/opacity transitions, with accessible buttons, inert closed answers, and the existing reduced-motion override. No animation dependency was added.

- 2026-10-12: Use native horizontal scrolling below 760px, with nearly full-width cards and keyboard access to the scroll region; no carousel dependency.

- 2026-10-12: User requested side-by-side placement. Names and prices occupy the left column and phones the right; descriptions span both columns to keep longer copy readable.

- 2026-10-12: Placed the phone image between each package card's number and details. Used empty alt text because the repeated image is decorative and adds no package information.

- 2026-10-12: Kept `plan.md` as a proposal and recorded only current React/Vite behavior in `.ai/architecture.md`; this prevents future agents from assuming that admin, database, and public profile routes already exist.
- 2026-10-12: Used `.ai/tasks/` as the task specification directory to match `AGENTS.md` and `.ai/context.md`.
- 2026-10-12: Used the compact SmarTap mark on the small handheld card and the full wordmark on the larger tabletop card so each remains legible at its display size.
- 2026-10-12: Made the requested phone image as editable vector shapes with a transparent outer background and checkerboard screen placeholders. Deferred page placement and screen content until the user reviews the asset.
- 2026-10-12: User preferred a cutout of the original photorealistic phone image over the vector recreation. Keep the checkerboard screens and remove only the exterior backdrop. The first cutout targeted the wrong reference and was replaced.
