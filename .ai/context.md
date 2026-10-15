# Project Context

## Purpose and audience

SmarTap presents NFC business cards that open a contact page in a phone browser. The current site explains the product and lets prospective customers explore Starter and Business examples. A visitor can inspect examples, follow contact links, save a contact card, and use browser sharing where supported.

## Current experience

- The homepage presents SmarTap packages, how the card works, questions, and Lloyd Pucyutan's contact actions.
- The Starter demo shows Lloyd's example profile. Its portrait is illustrative and should be replaced before treating the card as a live personal profile.
- The Business demo depicts Morrow Coffee, a fictional shop. Its menu, prices, contact details, and some action responses are samples; do not present them as a real business listing.
- The Starter demo offers Light/Dark modes. The design picker and legacy preview route were removed for launch.

## Planned product direction

`plan.md` describes a proposed first release in which an authorized admin creates and publishes personal contact pages from the separate TAGATAP template, with stable URLs for NFC cards. It proposes an admin dashboard, Convex data and image storage, authentication, public pages, and access rules. None of that is implemented yet. Treat the plan as proposed requirements to review before implementation, not as evidence of current behavior. The existing Starter and Business pages remain demos.

## Terms and constraints

- **Starter card:** the personal contact card example at `/demo/index.html`.
- **Business showcase:** the fictional Morrow Coffee example at `/demo/business.html`.
- **Published profile:** a future concept from `plan.md`; there are no published profile records or public profile routes today.
- Preserve the existing homepage and demo links when adding new capabilities.
- Keep sample content clearly identified as illustrative. Keep contact actions usable on mobile and provide feedback when browser share or clipboard actions fail.

Use the current source for implementation facts, this file for project intent, and `plan.md` for the proposed profile app. Record session-specific progress and decisions in the root logs rather than here.
