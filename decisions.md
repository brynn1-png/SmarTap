# Decisions

## Current State Summary

Ship only the homepage, Starter demo, and Business demo. Public assets are limited to files referenced by those pages. The tabletop card photo uses the compact SmarTap mark; other branding assets remain unchanged. Keep the AI harness, project logs, proposed product plan, and Starter Light/Dark modes.

## Entries

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
