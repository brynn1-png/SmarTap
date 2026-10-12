# Project Architecture

## Current state

SmarTap is a responsive marketing site and set of example digital cards. It is a client-only React 19 application built with Vite 7 and plain CSS. There is no backend, database, authentication, profile editor, or live profile data service in this repository. `plan.md` proposes those capabilities for a later release; do not describe them as implemented.

## Entry points and structure

| Entry | React source | Styling | Purpose |
| --- | --- | --- | --- |
| `index.html` | `src/main.jsx` → `src/App.jsx` | `src/site.css` | Marketing homepage |
| `demo/index.html` | `src/StarterDemo.jsx` | `src/starter.css` | Starter card demo |
| `demo/business.html` | `src/BusinessDemo.jsx` | `src/business.css` | Fictional Morrow Coffee Business showcase |

`vite.config.js` lists these three HTML files as separate build inputs. `public/` holds only runtime images, logos, and fonts. Design preview routes and the archived reference bundle were removed during launch cleanup. The browser loads each HTML entry directly. There is no client-side router.

## Data and behavior

Profile and marketing content is defined in the React source. Components use local React state for menus, FAQ disclosure, how-it-works steps, card color mode, and action feedback. There is no persisted application state or network data fetch. Contact actions use browser links (`tel:`, `sms:`, `mailto:` and external URLs), a generated vCard download, and native share or clipboard APIs when available. The Business showcase and its details are fictional; some of its contact buttons display sample feedback rather than opening contact targets.

`src/App.jsx`, `src/StarterDemo.jsx`, and `src/BusinessDemo.jsx` are separate page implementations. Contact data and card markup are currently duplicated across them. Do not assume a shared profile component or a single source of profile data exists.

## Development and boundaries

- Package manager: npm (`package-lock.json`). Runtime dependencies: React, React DOM, and `simple-icons`. Vite is the build tool.
- Commands: `npm run dev`, `npm run build`, `npm run preview`. The build output is `dist/`.
- There is no configured test, lint, or type-check script. Verify changes with the relevant available checks and direct inspection.
- Do not place real credentials in source or Vite public environment variables. Any future admin or profile data service must enforce access at its own trust boundary; a hidden UI route alone is not authorization.
- No deployment provider configuration is present in the current implementation. The Vercel and Supabase choices in `plan.md` are proposals.

Update this file when the actual architecture changes. Check source and configuration before relying on it.
