# TASK-001: Client Page System Implementation Plan

> **For future implementation:** Work through one phase at a time. Follow `.ai/rules.md` and `.ai/workflow.md`; get approval for the phase's concrete code plan before changing code. Do not commit or push unless the user requests it.

**Status:** In progress — the isolated TAGATAP renderer preview passes protected browser checks; the SmarTap and TAGATAP previews are deployed, but their combined protected rewrite and signed-in admin flow await browser verification. Production remains pending.
**Created:** 2026-10-15
**Goal:** An admin can publish a personal TAGATAP page with a permanent SmarTap URL that works from an NFC card.
**Architecture:** This repository hosts the marketing site and admin dashboard. The existing TAGATAP repository hosts one data-driven public template. Both use a shared Convex backend per environment; an explicit Vercel rewrite serves TAGATAP pages at `/p/:slug` on the canonical site.
**Tech stack:** React, Vite, TAGATAP, Convex, Convex Auth, Vercel.
**Spec:** [`plan.md`](../../plan.md)

## Status key

- `[x]` Verified complete.
- `[ ]` Needed. Do not mark complete based on a plan, mockup, or untested code.
- Record completion evidence (command, preview URL, or manual device result) in `results.md` and update the summaries in the three root logs.

## Expected file ownership

- **SmarTap repository:** `vite.config.js` and a new admin entry for the dashboard; focused admin UI files under `src/`; a `convex/` directory for backend functions and schema; deployment routing configuration. Confirm exact paths against the repository before each phase.
- **TAGATAP repository:** its existing `src/profile.js`, `src/App.jsx`, `src/components/`, `src/styles/global.css`, and Vite/deployment configuration for the data-driven renderer. Keep the template's existing UI checks and fixture.

## Already done

- [x] Define the first release as **personal** pages from one template.
- [x] Select the existing [TAGATAP repository](https://github.com/httpkristine/TAGATAP) as the template source; inspect its static React/Vite implementation.
- [x] Select one canonical path URL per person, `/p/:slug`, instead of a deployment per client.
- [x] Record Convex as the proposed database and image store, and Convex Auth as the proposed login method.
- [x] Document the product requirements, security boundary, and launch criteria in [`plan.md`](../../plan.md).
- [x] Confirm the current SmarTap repository contains only the marketing page and two demos; no backend or admin route exists.

## Phase 0 — Resolve launch dependencies

**Deliverable:** A concrete environment and access decision record. These checks gate implementation in the relevant repository.

- [x] Confirm the TAGATAP creator permits the intended adaptation and that the project has write/deployment access (user attestation; remote write has not been tested). Its inspected repository had no license file.
- [x] Choose the canonical production origin and identify the Vercel project that owns it. Origin is `https://smartap-png.vercel.app`; authenticated Vercel CLI inspection identified project `taga-tap` in team `brynn1-pngs-projects`.
- [x] Confirm Convex Auth beta and email/password for the first admin. Use a server-side admin email allowlist and a temporary setup code to create the first account; remove the code afterward. Development account provisioned; production remains pending.
- [x] Confirm Save draft then Publish. Reserve the slug on draft creation and program an NFC card only after publication.
- [x] Support both ordinary photos and transparent cutouts. Require name, portrait, background, and one contact method for publication.
- [x] Prove an empty TAGATAP `/p/preview` shell populated only by a same-origin message from the authorized admin iframe; local browser check passed.
- [x] Record these decisions in `decisions.md` and update `plan.md`.

## Phase 1 — Define and prove the template contract

**Repository:** TAGATAP. **Deliverable:** Its existing page renders a supplied profile fixture without changing source constants per client.

- [x] Map client-specific values in the listed template files to profile fields; keep branding, layout, and section labels fixed. Mapping is in TAGATAP's README.
- [x] Define the profile data contract for identity, contacts, images, appearance, and text in TAGATAP's README and local fixture.
- [x] Render the page from one supplied profile object and retain the Lloyd fixture for visual review.
- [x] Generate Call, Text, Maps, social links, and vCard from that input; omit missing optional actions.
- [x] Test long and short names, missing links, both portrait modes, nine widths, keyboard use, and contact downloads. TAGATAP's `npm test` and `npm run build` passed in the isolated worktree.

**Acceptance:** One fixture change updates the complete page and contact file; no Lloyd-specific value leaks into another person's page.

## Phase 2 — Build the Convex foundation

**Repository:** SmarTap. **Deliverable:** A development Convex backend with protected admin functions and a public published-profile read.

- [ ] Create separate development and production Convex configuration; keep secrets out of Vite public variables and source control.
- [x] Define and deploy the profile schema and slug/status indexes, publication states, image references, and timestamps to the Convex development deployment.
- [x] Set up Convex Auth email/password and provision the first development admin behind the allowlist and temporary setup code; remove the code after account creation. Production provisioning remains separate.
- [x] Add a reusable backend admin check to every list, draft-read, create, edit, upload, publish, unpublish, and archive operation. Live admin and foreign-identity checks passed in development.
- [x] Implement slug reservation and collision handling in backend functions; never change a published slug during normal editing. Live duplicate-name and published-edit checks passed.
- [x] Add the anonymous read that returns only published fields needed by TAGATAP. Live draft/publication/unpublication checks and anonymous authorization checks passed.
- [ ] Test unauthenticated, signed-in non-admin, and admin requests; duplicate slugs; invalid links/phone values; and draft-to-published transitions.

**Acceptance:** Only the provisioned admin can write or inspect drafts, and anonymous clients can read only published profiles.

## Phase 3 — Make TAGATAP a public renderer

**Repository:** TAGATAP. **Deliverable:** The template loads one published profile by URL slug.

- [x] Connect the renderer to the Phase 2 published-profile read and parse the slug from `/p/:slug`. The TAGATAP worktree uses `VITE_CONVEX_URL` for the public Convex client.
- [x] Keep the same-origin admin draft preview isolated at `/p/preview`; it makes no public slug query.
- [x] Render loading, unavailable, and recoverable network-error states. Missing and unpublished slugs reveal no profile content.
- [x] Load stored portrait/background URLs and apply bounded image and color settings. Two live development records with both portrait modes rendered successfully.
- [x] Verify contact actions, social links, vCard, and Share URL use the loaded person. Browser checks cover two distinct profiles.
- [x] Run the build and UI checks; inspect a phone-sized viewport and refreshed deep links. `npm test`, `npm run build`, and `npm run test:live` passed in the isolated worktree; live published-record checks also passed.

**Acceptance:** Two different published records render correctly from the same deployment; an unpublished slug reveals no profile content.

## Phase 4 — Add the admin shell and dashboard

**Repository:** SmarTap. **Deliverable:** An authorized admin can see the profile inventory at `/admin`.

- [x] Add a separate admin entry/route without changing the existing marketing and demo entries. Local `/admin` and `/admin/` navigation, refresh, and the four-page build passed in the SmarTap worktree.
- [ ] Implement sign-in, sign-out, loading, unauthorized, and expired-session states.
- [ ] List profiles with name, slug, status, updated time, and edit/preview actions. Add search only if the list size makes it useful.
- [ ] Add empty, loading, and recoverable error states with accessible labels and keyboard navigation.
- [ ] Verify direct `/admin` navigation and refresh, backend denial for non-admins, and that the existing three pages still build.

2026-10-16 progress: the inventory now has an accessible caption, responsive rows, singular/plural count, and empty/loading states. An error boundary offers a retry by reloading when Convex queries fail, and an unauthorized account receives a sign-out error if that action fails. Local UI and build checks passed. These checklist items remain open until edit/preview actions and a real signed-in browser session are verified.

2026-10-16 follow-up: New profile, Edit profile, and editor Preview actions are implemented. A mocked signed-in browser flow checks navigation, but a real signed-in admin browser session and deployed renderer route are still needed for acceptance.

**Acceptance:** The initial admin can see drafts and published pages; other visitors cannot obtain dashboard data.

## Phase 5 — Build the profile editor and customization

**Repository:** SmarTap. **Deliverable:** An admin can create, review, save, and publish a person without code edits.

- [x] Add identity, contact, social, and image fields with visible labels and local validation that matches backend rules. The editor imports the backend normalizer; browser checks cover all field labels and invalid phone input.
- [ ] Add portrait/background upload, replacement, progress, and error handling. Keep file ownership and cleanup rules explicit.
- [x] Add the Customization tab: image position/scale, background overlay, and constrained colors. Keep the TAGATAP layout fixed. Browser checks cover all eight controls.
- [ ] Show a live preview through the Phase 3 integration, including missing optional fields and accessibility/readability feedback.
- [x] Implement Save draft, Publish, Unpublish, Archive, and Copy URL with clear success/error feedback. A mocked browser lifecycle passed; backend lifecycle was verified separately in development.
- [ ] Test invalid inputs, interrupted uploads, unauthorized edits, preserving the slug through edits, and publishing only complete records.

2026-10-16 progress: the editor creates reserved-slug drafts, saves through protected Convex mutations, uploads images, enforces the publication minimum, and supports customization and lifecycle actions. A same-origin preview ready/message contract passed separately in TAGATAP and in a local mock receiver; the real combined iframe needs Phase 6 routing. Browser tests covered invalid phone/image input, interrupted upload recovery, incomplete publish, stable copied URL, unpublish/republish/archive, and 390px layout. Replacing an image deletes its previous unreferenced file; failed attachment calls a protected discard mutation. A browser interrupted after storage upload can still leave an orphan, so storage audit remains a launch follow-up.

**Acceptance:** A nontechnical admin can publish a complete page, copy its permanent URL, edit it later, and unpublish it without changing that URL.

## Phase 6 — Route and deploy both apps

**Repositories:** SmarTap and TAGATAP. **Deliverable:** The canonical site serves public pages from TAGATAP with working assets and refreshes.

- [x] Deploy the TAGATAP renderer and SmarTap admin/marketing app to preview environments against development Convex; both Vercel preview deployments reached Ready.
- [x] Configure specific Vercel rewrites for `/p/:slug` and the renderer's built assets, plus direct admin navigation; local combined-route browser verification passed. Signed-in cloud verification remains below.
- [ ] Configure the canonical origin used for copied links. Verify the rewrite keeps it in the browser address bar.
- [ ] Test two published slugs, missing and unpublished slugs, deep-link refresh, image/font loading, and the same flows on preview URLs.
- [ ] Review the working preview with the user and obtain deployment authorization.
- [ ] Promote production configuration after preview checks and authorization.

**Acceptance:** A copied `/p/:slug` URL works in a fresh browser and after refresh, with no per-client deployment.

2026-10-16 progress: Both worktrees contain Vercel routing configuration, and TAGATAP's built asset URLs use `/tagatap/` to avoid colliding with SmarTap's `/assets/`. A local combined-build browser check passed two person routes, missing/unpublished routes, refreshes, assets, homepage/demos/admin, and same-origin draft preview. The authenticated CLI linked both projects and deployed protected previews: TAGATAP `smartap-tagatap-dopbfboso-brynn1-pngs-projects.vercel.app` and SmarTap `taga-mf901h613-brynn1-pngs-projects.vercel.app`. TAGATAP's preview passed a browser check with two mocked published profiles, refresh, images/styles, and unavailable states. SmarTap's preview rewrites to that protected destination, but the combined route needs a signed-in team browser check. An automation bypass token cannot authenticate the rewritten destination. Production deployment and real signed-in admin checks remain open. The renderer project's first CLI deployment also created a production alias without production Convex configuration; do not use it for client pages.

## Phase 7 — End-to-end and NFC launch check

**Deliverable:** Recorded evidence that the full admin-to-card flow works.

- [ ] Create a clearly fictional test person and publish through the admin UI.
- [ ] Confirm the page on a fresh phone, then program and scan an NFC card with its canonical URL.
- [ ] Check Call, Text, Email, Maps, social links, vCard, Share, portrait/background, and small-screen readability on a real phone.
- [ ] Edit the published person and confirm the existing NFC card opens the updated page.
- [ ] Unpublish and confirm public access disappears; republish and confirm the same URL works again.
- [ ] Run relevant builds and tests in both repositories, review changed files, update architecture/context docs for what actually shipped, and record results in the root logs.

**Acceptance:** All criteria in `plan.md`'s **Done when** section are demonstrated with actual results.

## Cross-cutting review focus

- Long names and URLs must fit the TAGATAP template and remain keyboard accessible.
- Missing optional contacts must not create broken buttons or malformed vCards.
- Invalid image types, oversized files, and interrupted uploads must leave the draft usable.
- Direct Convex calls by signed-out or non-admin clients must not expose drafts or permit writes.
- A saved draft, a renamed person, and an unpublished page must never silently change an NFC card's URL.

## Deferred from the first release

- Business-profile templates and client self-service accounts.
- Multiple page designs or unrestricted CSS/layout editing.
- A Vercel deployment or GitHub repository per person.
- Branded social previews, search indexing guarantees, and HTTP 404 responses from the server-rendered profile route.
