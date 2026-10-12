# Progress

## Current State Summary

The SmarTap marketing site and its Starter and Business demos are ready for shipping. The full-bleed homepage hero uses dedicated panoramic desktop and portrait mobile images, plus a shared responsive grid, strong text contrast, and tight CTA grouping. The homepage retains horizontal mobile packages with an explicit swipe cue and animated FAQ chevrons. The tabletop card photo uses the compact SmarTap mark. The profile app in plan.md remains proposed work.

## Entries

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
