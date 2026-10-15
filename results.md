# Results

## Current State Summary

The main checkout remains the three-page marketing site. In isolated worktrees, TAGATAP loads published pages by slug and SmarTap's admin/editor pass build/browser checks. Phase 6 combined local routing and preview messaging pass with mocked public reads. Both apps now have protected Vercel previews; the TAGATAP preview passes browser checks with mocked reads. The user reported an error on the combined protected rewrite; its exact message is pending. No live published profile exists.

## Entries

- 2026-10-16: Confirmed canonical `https://smartap-png.vercel.app/` returns 200, while `/admin`, `/admin/`, and `/p/preview` return 404. The feature worktree contains `admin/index.html`, a Vite admin build entry, and Vercel `/admin` rewrites. SmarTap production Vercel has no environment variables; Convex production `precious-llama-422` has no auth environment variables. SmarTap feature tests, admin UI checks, and build passed; a TAGATAP test rerun stopped at an occupied port 5174. No live deployment was changed.

- 2026-10-16: After the user reported an error on the SmarTap protected preview, inspected both deployment records: `taga-tap` deployment `dpl_5sAeXQK355r9AbcKUET9VM7FhK45` and `smartap-tagatap` deployment `dpl_BEiyXfqeT34cUwvKsqrTTswtFHjt` remain Ready preview targets. Without a browser Vercel session, SmarTap `/`, `/admin`, `/p/preview`, and `/tagatap/smartap-monogram.png` each return 302 to Vercel SSO. The exact browser error is needed to locate the failing boundary; no fix or settings change was attempted.

- 2026-10-16: Vercel CLI 64.2.0 linked `taga-tap` and `smartap-tagatap`, and Ready previews were deployed at `https://taga-mf901h613-brynn1-pngs-projects.vercel.app` and `https://smartap-tagatap-dopbfboso-brynn1-pngs-projects.vercel.app`. TAGATAP's protected preview passed Playwright checks for two mocked profiles, deep-link refresh, branding/background assets, CSS, and missing/unpublished states. Unauthenticated SmarTap preview requests returned Vercel auth redirects (expected); CLI automation-bypass requests cannot verify the protected cross-project target. Temporary bypass tokens were revoked. Vercel auto-created a TAGATAP production alias on its first deployment, but that build lacks production `VITE_CONVEX_URL`; the canonical SmarTap production `/admin` and `/p/preview` returned 404 and remains unchanged. `git diff --check` passed in both worktrees after removing CLI-added ignore duplication. The separate signed-in team-browser check is pending.

- 2026-10-16: Phase 6 local checks passed: TAGATAP `npm test`, `npm run build`, and `node scripts/verify-deployment.mjs`; SmarTap `npm test`, `npm run test:admin-ui`, `npm run build`, and `node scripts/verify-deployment.mjs`. `node scripts/verify-combined-routing.mjs` served both built outputs on one local origin and passed two distinct profiles, missing/unpublished states, deep-link refresh, branding/image/CSS loading, existing site routes, and iframe preview messaging. Both `git diff --check` runs passed. The public profile responses in this combined check were mocked. Vercel CLI 64.2.0 is available through `npx`, but `whoami` reports logged out; actual Vercel routing and production deployment remain unverified.

- 2026-10-16: Phase 5 editor browser check passed mock-backed draft creation, validation failure, interrupted upload, image upload, incomplete/complete publication, URL copy, list/edit navigation, unsaved preview messaging, preview timeout/retry, unpublish/republish/archive, and 390px/1440px overflow checks. TAGATAP `npm test` and `npm run build` passed after adding the same-origin ready message. SmarTap `npm test`, `npm run test:admin-ui`, `npm run test:convex`, and `npm run build` passed; the changed Convex functions deployed to `courteous-falcon-337` with `npx convex dev --once`. A read-only deployment check found 0 profiles and 0 stored images. A concurrent TAGATAP test first hit an occupied port 5174; a separate rerun passed. SmarTap's build emitted the existing Convex Auth `use client` directive warning. The browser lifecycle uses a mock Convex adapter, and the real TAGATAP iframe is not yet served on the SmarTap origin.

- 2026-10-16: SmarTap Phase 4 inventory check passed empty and populated server rendering and a 390px Chrome overflow/row check. `npm test` passed profile validation and auth gate checks. `npm run test:admin-ui` passed direct `/admin` and `/admin/` navigation, refresh, sign-in/setup fields, and mobile width when run outside the sandbox. `npm run build` produced the homepage, both demos, and admin entry outside the sandbox. The sandbox's esbuild child process could not read worktree files; the same checks passed with elevated execution. Impeccable's detector flagged only the incumbent Inter font. Signed-in dashboard interaction and edit/preview actions remain unverified/unimplemented.

- 2026-10-16: TAGATAP `npm test` passed profile helpers, nine viewport widths, preview isolation, person-specific routes/actions/vCards/Share URLs, loading/unavailable/network retry states, and deep-link refresh. `npm run build` and `npm run test:live` passed. Two temporary published records with cutout/photo modes and stored images rendered from the real development Convex deployment at 390px, including after refresh; an unpublished slug showed no profile. QA records and images were removed and the temporary cleanup function was undeployed; `profiles` and `_storage` counts returned to 0. Mobile published and mobile/desktop state screenshots were inspected. Impeccable's detector reported only the template's existing Inter font choice. Canonical Vercel routing and production deployment remain pending.

- 2026-10-16: Live development test passed admin draft creation, invalid phone rejection, duplicate slug suffix, image upload, publication, public field filtering, stable slug through edit, unpublish, republish, and denial for a foreign identity. The first test run stopped on the Convex CLI's empty output for `null`; its QA draft was archived. The corrected run passed. Three archived QA records and two test images were removed with a temporary admin-protected cleanup function; after redeploying without that function, `profiles` and `_storage` counts were both 0. `npm test`, `npm run test:convex`, and `npm run build` passed; Vite emitted an ignored `use client` directive warning from Convex Auth. A real non-admin account and browser-based signed-in flow remain untested.

- 2026-10-15: User reported the admin setup working. A sanitized Convex `users` table check found one user matching the authorized admin email. `npx convex env remove ADMIN_SETUP_CODE` succeeded on `courteous-falcon-337`; a names-only environment listing confirmed it is absent while `ADMIN_EMAIL`, `JWKS`, and `JWT_PRIVATE_KEY` remain. `npm test` and `npm run test:convex` passed. No password, code, or key value was printed or logged.

- 2026-10-15: `npx convex env get ADMIN_SETUP_CODE` returned a 48-character stored value plus the CLI's final newline (metadata only; value was not printed). A live signup retry logged `emailAllowed: true`, `setupEnabled: true`, `codeMatches: false`, then the existing generic rejection. Removed temporary diagnostics and redeployed `npx convex dev --once` successfully. The admin account is still not created.

- 2026-10-15: TDD verified `admin.viewer` returns false anonymously (missing-function failure before implementation, pass after deployment). Chrome checks passed direct `/admin` and `/admin/` navigation, refresh, sign-in/setup fields, and 390px overflow; screenshots inspected at 390px and 1440px. `npm test`, `npm run build` (four HTML pages), and `git diff --check` passed. `http://127.0.0.1:5180/admin` returned HTTP 200 with the admin title. A Windows line ending in the first setup-code upload was detected and replaced; a follow-up environment listing showed no warning. The design detector ran in degraded regex mode and flagged the existing Inter font choice; no visual defect was identified in the screenshots. First-account signup remains a user action.

- 2026-10-15: Confirmed the development deployment initially had no environment variables, then generated and set `JWT_PRIVATE_KEY` and `JWKS` without printing their values, removed the one-time local generation script, and set `ADMIN_EMAIL`. Re-listing environment variable names confirmed the two key variables; `npm test` and `npm run test:convex` passed after configuration. The account is not created yet.

- 2026-10-15: Confirmed `.env.local` points to `smartap-a93dc` / `courteous-falcon-337`, deployed the updated backend with `npx convex dev --once`, and reran `npm run test:convex`: missing published slug returned null and anonymous admin list/create/upload requests were rejected. Admin account and signed-in flows remain untested.

- 2026-10-15: Reproduced the auth bug with a failing sign-in regression check after removing `ADMIN_SETUP_CODE`, then corrected the gate. `npm test` passes both profile and auth checks, and `npm run build` passes with three HTML pages when run outside the Windows sandbox. Cloud auth behavior remains unverified until the user's earlier project is linked and the first admin is provisioned.

- 2026-10-15: TAGATAP worktree `.qa/worktrees/TAGATAP-phase1`: `npm test` passed (nine viewport widths, person-specific links/vCard, sparse fields, short/long names, both portrait modes, preview iframe, keyboard checks) and `npm run build` passed. SmarTap worktree `.qa/worktrees/SmarTap-phase2`: `npm test` and Convex HTTP checks passed for a missing public slug and rejection of anonymous admin list/create/upload. `npx convex dev --once` deployed the current schema/functions to the temporary development deployment `courteous-falcon-337`; signed-in admin and published-profile transitions remain untested. The baseline main-site `npm run build` passed outside the sandbox.

- 2026-10-15: Created `.ai/tasks/TASK-001-client-page-system.md` and linked it from `plan.md`. Checked eight numbered phases, six completed planning items, 48 pending items, link existence, and whitespace (`git diff --check` passed). No implementation phase is marked complete.

- 2026-10-15: Updated `plan.md`, matching proposal references in `.ai/context.md` and `.ai/architecture.md`, and project state logs. Inspected the current site and TAGATAP source before writing; no application code or deployment configuration changed.

- 2026-10-13: Verified the highlighted footer CTA at 1440×1000 and 390×844. The button remains prominent, readable, and proportionate; production build and design scan completed.

- 2026-10-13: Verified the package swipe cue at an emulated 390×844 viewport. It appears below the cards, the next card remains visible at the edge, and the production build passes.

- 2026-10-12: Verified the 940×1672 mobile hero in-browser at 500×844. The full subject, menu, wordmark, supporting copy, and CTA remain visible; the desktop source remains unchanged.

- 2026-10-12: Verified the 6% desktop hero zoom at wide and standard desktop sizes; the subject's hairline, shoulders, hands, card, phone, and jacket sides remain visible.

- 2026-10-12: Connected the approved 1774×887 panoramic hero asset. Production build passed, and browser captures confirmed improved subject visibility across wide desktop, standard desktop, and mobile layouts.

- 2026-10-12: Verified the refined hero with a production build and desktop/mobile browser captures. Navigation, copy, wordmark, CTA, subject, and card remain visible without overlap.

- 2026-10-12: Converted the framed hero to a full-bleed viewport hero and removed obsolete responsive frame rules.

- 2026-10-12: Updated the hero shell and frame styles; source review confirmed no responsive border override remains.

- 2026-10-12: Restored the selected earlier image byte-for-byte and verified its SHA-256 hash before rebuilding.

- 2026-10-12: Visually inspected the full corrected image and measured the final mark within 0.5 px horizontally and 0.2 px vertically of the card center. The asset remains 1122×1402.

- 2026-10-12: Corrected the compact mark placement after visual review; the replacement retains the 1122×1402 source dimensions.

- 2026-10-12: Replaced the full wordmark in `public/card-editorial-branded.png` with the compact lime mark. Inspected the generated edit and confirmed the output retained the source dimensions before replacing the shared asset.

- 2026-10-12: Removed 11,349,169 bytes of obsolete assets and QA artifacts, plus preview source and stale reports. Unused public assets account for 4,783,556 bytes no longer deployed; Starter CSS also shrank from 10.08 kB to 4.39 kB. Rebuilt dist and checked page/resource references and absence of removed artifacts.

- 2026-10-12: FAQ chevron replacement passed the production build and whitespace check. Browser visual verification was not performed.

- 2026-10-12: FAQ animation production build and whitespace checks passed. Source review confirmed independent toggles, expanded-state attributes, closed-answer inertness, and reduced-motion coverage. Browser animation feel remains unverified.

- 2026-10-12: Mobile horizontal package scrolling is implemented. Production build and whitespace checks passed; design scan showed only existing font warnings. Touch/browser verification remains unconfirmed.

- 2026-10-12: Changed the shared package markup and CSS to a two-column layout. Production build and diff whitespace check passed; design scan reported only existing Inter font warnings. No new browser visual check was performed.

- 2026-10-12: Updated the existing package loop and responsive spacing. Production build passed; design scan reported only the pre-existing Inter font warnings. Local screenshot captures were blank, and no connected browser was available for an alternate visual check.

- 2026-10-12: Created project-specific architecture and context documents, aligned the task directory, updated skill guidance and README, and initialized persistent state logs. Verified required files exist, the old task path is gone, template placeholders are absent from the two project documents, and `npm run build` succeeds. The first build attempt was blocked by sandbox filesystem access; the same command succeeded with access granted.
- 2026-10-12: Verified both branded photos retain their original pixel dimensions, checked their source references, ran `npm run build` successfully, and visually inspected the full-size edits and a desktop homepage preview. A headless 390px capture was cropped by Chrome, so it was not used as a full mobile layout check.
- 2026-10-12: Parsed `public/phones-3d.svg` as XML, rendered and visually inspected a 980px preview, and verified `npm run build` includes the SVG in `dist/`.
- 2026-10-12: Corrected `public/phones-transparent.png` after the first attempt used the SVG preview as reference. The replacement follows the user's original photorealistic two-phone image. Confirmed a 1254×1254 PNG with alpha 0 in sampled exterior pixels and opaque phone pixels; removed the superseded SVG and preview. The screen checkerboard remains opaque.
