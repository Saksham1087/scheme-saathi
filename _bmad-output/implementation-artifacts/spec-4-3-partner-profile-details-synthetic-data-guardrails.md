---
title: 'Story 4.3: Partner Profile Details & Synthetic Data Guardrails'
type: 'feature'
created: '2026-08-28'
status: 'done'
baseline_commit: '99a9fa5ee2f4c407519b788a096c4293f0b2f567'
review_loop_iteration: 0
context:
  - '_bmad-output/implementation-artifacts/epic-4-context.md'
  - '_bmad-output/implementation-artifacts/spec-4-1-react-leaflet-partner-map-geo-spatial-search.md'
  - '_bmad-output/implementation-artifacts/spec-4-2-5-factor-partner-match-scoring-nearest-partner-routing.md'
---

<frozen-after-approval reason="human-owned intent — do not modify unless human renegotiates">

## Intent

**Problem:** Beneficiaries preparing to visit a channel partner lack operational specifics—such as the nodal desk officer's name, working hours, exact documents demanded by that specific branch, and scheme rates—and portal demonstrators need clear synthetic data disclaimers to prevent mistaking test records for actual banking contacts.

**Approach:** Implement a comprehensive **Partner Profile Detail Dialog/Drawer** accessible from `/partners` that displays complete operational branch details (Nodal Officer, operating hours, desk contact, supported schemes, document checklist), integrates one-click actions (Call, Email, Route, Share), and places a statutory **Synthetic Demonstration Data Disclaimer** badge on simulated seed partners with full privacy guardrails.

## Boundaries & Constraints

**Always:**
- Display complete operational details for each channel partner:
  - Nodal Desk Officer name, designation, direct phone (`tel:`), official email (`mailto:`)
  - Office hours (e.g. Mon–Fri 10:00 AM – 5:00 PM, 1st/3rd/5th Sat)
  - Full postal address and geo-coordinates
  - Supported schemes list with interest rates and maximum limits
  - Required document checklist with status indicators
  - 5-factor suitability score and capacity utilization
- Prominently display the **Synthetic Demonstration Data Disclaimer** badge on synthetic seed records.
- Support 100% localization in English (`en`) and Hindi (`hi`).
- Maintain accessible WCAG AA touch targets (min 44x44px).

**Never:**
- Present simulated phone numbers or officer names as live banking contacts without the synthetic disclosure badge.
- Allow broken contact triggers (`tel:` and `mailto:` must be properly sanitized).

## I/O & Edge-Case Matrix

| Scenario | Input / State | Expected Output / Behavior | Error Handling |
|----------|--------------|---------------------------|----------------|
| Open Partner Profile | User clicks "View Profile" on Lucknow SCA card | Opens comprehensive detail modal with nodal officer info, supported schemes, working hours, documents required, and synthetic data banner | Accessible Esc / Close button |
| Synthetic Disclaimer | Viewing any seed partner record | Displays amber/neutral info badge: "Demonstration Partner Record: Contact information is simulated for testing and demonstration." | Clearly visible at top of profile |
| Share Partner Profile | User taps "Share Branch Info" | Copies formatted branch address, phone, and coordinates to clipboard or opens Web Share dialog | Shows copy confirmation toast |

</frozen-after-approval>

## Code Map

- `src/types/index.ts` -- Extend `ChannelPartner` with `nodalOfficer`, `email`, `operatingHours`, `isSynthetic`, and `supportedSchemeDetails`.
- `functions/src/data/partners.seed.json` -- Enrich seed dataset with authentic nodal officers, working hours, email, and synthetic flags.
- `src/components/partners/PartnerDetailDialog.tsx` -- Accessible, responsive modal/drawer rendering full branch profile, contact actions, scheme list, document checklist, and synthetic disclaimer.
- `src/components/partners/PartnerCard.tsx` -- Add "View Profile" trigger to open `PartnerDetailDialog`.
- `src/pages/PartnersPage.tsx` -- Support deep-linking `/partners?id=partner-id` to auto-open partner profile modal.
- `src/i18n/en.json` & `src/i18n/hi.json` -- Complete localization for all partner profile fields, nodal roles, hours, and disclaimer copy.

## Tasks & Acceptance

**Execution:**
- [x] `src/types/index.ts` -- Extend `ChannelPartner` interface with operational profile fields and synthetic flag.
- [x] `functions/src/data/partners.seed.json` -- Enrich partner seed records with operational metadata.
- [x] `src/components/partners/PartnerDetailDialog.tsx` -- Build comprehensive partner profile dialog with synthetic disclaimer.
- [x] `src/components/partners/PartnerCard.tsx` -- Wire "View Profile" CTA into partner cards.
- [x] `src/pages/PartnersPage.tsx` -- Support URL deep-linking to auto-open partner details.
- [x] `src/i18n/en.json` & `src/i18n/hi.json` -- Add complete localized strings in English and Hindi.

**Acceptance Criteria:**
- Given a partner card, clicking "View Profile" opens the full profile dialog with nodal officer, operating hours, and document checklist.
- Given synthetic records, the synthetic demo disclaimer badge is clearly displayed.
- Given `/partners?id=bsc-lucknow`, the page loads with that partner highlighted on map and detail dialog opened.

## Spec Change Log

_None._

## Design Notes

- High-contrast modal with organized tabs/sections (Contact & Hours, Supported Schemes, Required Documents).
- Direct call (`tel:`) and email (`mailto:`) action buttons with distinct visual styling.

## Verification

**Commands:**
- `npm run lint` -- expected: zero errors across `src/`
- `npm run build` -- expected: clean TypeScript compilation and Vite build with no type errors

## Suggested Review Order

**Data Model & Seed Dataset**

- Partner types extension with nodal desk officer, operating hours, and synthetic demonstration flag.
  [`types/index.ts:255`](../../src/types/index.ts#L255)

- Enriched seed partners dataset with authentic contacts, working hours, and scheme details.
  [`partners.seed.json:1`](../../functions/src/data/partners.seed.json#L1)

**Partner Profile Detail Dialog & Synthetic Guardrails**

- Accessible, responsive modal with tabbed sections (Overview & Nodal Desk, Supported Schemes, Document Checklist) and synthetic data disclaimer banner.
  [`PartnerDetailDialog.tsx:1`](../../src/components/partners/PartnerDetailDialog.tsx#L1)

**Card Trigger & URL Deep Linking**

- Partner card updated with primary "View Profile" CTA trigger.
  [`PartnerCard.tsx:180`](../../src/components/partners/PartnerCard.tsx#L180)

- Split-screen partners page supporting `/partners?id=partner-id` deep linking and modal management.
  [`PartnersPage.tsx:90`](../../src/pages/PartnersPage.tsx#L90)

**Bilingual English & Hindi Localization**

- English and Hindi dictionaries updated for all partner profile fields, tabs, actions, and disclaimer copy.
  [`en.json:360`](../../src/i18n/en.json#L360)
  [`hi.json:360`](../../src/i18n/hi.json#L360)
