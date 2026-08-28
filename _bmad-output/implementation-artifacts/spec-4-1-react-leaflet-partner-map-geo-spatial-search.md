---
title: 'Story 4.1: React Leaflet Partner Map & Geo-Spatial Search'
type: 'feature'
created: '2026-08-28'
status: 'done'
baseline_commit: '517631c261e4ea47c6e61f221469e38d4f40f28e'
review_loop_iteration: 0
context:
  - '_bmad-output/implementation-artifacts/epic-4-context.md'
  - '_bmad-output/planning-artifacts/architectures/architecture-scheme-saathi-2026-08-27/ARCHITECTURE-SPINE.md'
---

<frozen-after-approval reason="human-owned intent — do not modify unless human renegotiates">

## Intent

**Problem:** Beneficiaries and grassroots field officers cannot easily find which physical bank branches or State Channelizing Agency (SCA) offices in their district or state are authorized to process SC concessional scheme applications.

**Approach:** Implement an accessible, interactive OpenStreetMap Leaflet map interface at `/partners` with custom branded color-coded markers for different channel types (SCA, PSB, RRB, NBFC-MFI), geo-location proximity detection ("Use My Location"), text search across state, district, city, and pin codes, and multi-category scheme filters (Micro-Credit, Term Loan, Education Loan).

## Boundaries & Constraints

**Always:**
- Use Leaflet / OpenStreetMap with tile caching and zero proprietary map API keys required.
- Render distinct branded map markers for Partner Types (SCA: Purple, PSB: Blue, RRB: Green, NBFC: Amber).
- Provide browser geo-location lookup (`navigator.geolocation`) with permission handling and fallback to State Capital coordinates.
- Allow filtering by Scheme Category (`all`, `micro`, `term`, `education`) and search text (city, district, partner name).
- Support 100% localization in English (`en`) and Hindi (`hi`).
- Maintain accessible touch targets (min 44x44px) and responsive side-by-side (desktop) or stacked (mobile) layout.

**Never:**
- Block the page if geo-location permission is denied by the user.
- Cause map canvas distortion on window resize or tab switch (call `invalidateSize` appropriately).

## I/O & Edge-Case Matrix

| Scenario | Input / State | Expected Output / Behavior | Error Handling |
|----------|--------------|---------------------------|----------------|
| Use Current Location | User clicks "Use My Location" button | Obtains GPS coordinates; centers map; places user marker; recalculates distance to all partners | If location denied or times out, shows friendly toast and centers on default state capital |
| Search by District / City | User types "Lucknow" or "Kanpur" | Filters partner list and fits map viewport bounds to matching branch locations | If no matching branches found, shows empty state with CTA to reset filters |
| Click Map Marker | User clicks branch marker pin | Pops open summary tooltip; highlights partner card in side panel; scrolls card into view | Smooth animated scroll |

</frozen-after-approval>

## Code Map

- `src/lib/maps/leaflet.ts` & `src/lib/maps/types.ts` -- Enhanced Leaflet map adapter with typed markers, partner type icons, click bindings, and responsive invalidation.
- `src/components/partners/PartnerMapSearch.tsx` -- Search and filter control bar with search input, category chips, and geo-location trigger.
- `src/components/partners/PartnerCard.tsx` -- Partner summary card with partner type badge, address, phone CTA, distance badge, and directions action.
- `src/pages/PartnersPage.tsx` -- Redesigned `/partners` page with split-screen map and list layout, filter syncing, and mobile map/list toggle.
- `src/i18n/en.json` & `src/i18n/hi.json` -- Localization strings for partner map, search placeholders, category chips, and location status.

## Tasks & Acceptance

**Execution:**
- [x] `src/lib/maps/leaflet.ts` -- Upgrade Leaflet service with partner-type branded markers, popups, and click callbacks.
- [x] `src/components/partners/PartnerMapSearch.tsx` -- Build responsive search and filter bar with geo-location button.
- [x] `src/components/partners/PartnerCard.tsx` -- Build accessible partner card with distance badge and contact triggers.
- [x] `src/pages/PartnersPage.tsx` -- Integrate split map/list view with auto-scrolling on marker select and mobile toggle.
- [x] `src/i18n/en.json` & `src/i18n/hi.json` -- Add complete localized strings in English and Hindi.

**Acceptance Criteria:**
- Given a user visiting `/partners`, the OpenStreetMap renders with all authorized channel partners.
- Given "Use My Location", the map centers on the user's coordinates and updates branch distances in real time.
- Given typing a city or selecting a scheme filter, both map pins and list update in lockstep.

## Spec Change Log

_None._

## Design Notes

- High-contrast map controls with clear color coding for institutional channel types.
- Mobile floating toggle switch between "Map View" and "List View".

## Verification

**Commands:**
- `npm run lint` -- expected: zero errors across `src/`
- `npm run build` -- expected: clean TypeScript compilation and Vite build with no type errors

## Suggested Review Order

**Map Infrastructure & Custom Markers**

- OpenStreetMap Leaflet adapter with channel pin SVG teardrops, popups, and user location radar ping.
  [`leaflet.ts:1`](../../src/lib/maps/leaflet.ts#L1)

- Map types and channel partner color tokens (SCA, PSB, RRB, NBFC).
  [`types.ts:1`](../../src/lib/maps/types.ts#L1)

**Search, Filter & Card Components**

- Responsive search and multi-category/partner-type filter bar with GPS locator.
  [`PartnerMapSearch.tsx:20`](../../src/components/partners/PartnerMapSearch.tsx#L20)

- Accessible partner card with distance badge, direct phone trigger (`tel:`), Google Maps navigation link, and required documents modal.
  [`PartnerCard.tsx:25`](../../src/components/partners/PartnerCard.tsx#L25)

**Split View Page & Bilingual Localization**

- Responsive split-screen desktop & mobile toggled `/partners` layout with marker syncing.
  [`PartnersPage.tsx:40`](../../src/pages/PartnersPage.tsx#L40)

- English and Hindi localized dictionaries for map controls, filters, and partner types.
  [`en.json:700`](../../src/i18n/en.json#L700)
  [`hi.json:700`](../../src/i18n/hi.json#L700)
