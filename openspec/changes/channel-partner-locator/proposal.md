## Why

The channel partner locator is one of Scheme Sathi's major differentiators. Users who find a suitable scheme need to know where to actually go to process their application. The system must find the nearest eligible partner, not just the nearest bank.

## What Changes

- Partner listing page at `/partners` with map and list views
- React Leaflet + OpenStreetMap integration (no Google Maps dependency)
- Partner filtering: scheme, loan type, state, district, distance, partner type, availability
- Partner categories: State Channelizing Agencies, PSBs, RRBs, NBFC-MFIs, other authorized partners
- Partner routing: nearest eligible partner for selected scheme (not just nearest bank)
- Partner match score: scheme compatibility 40%, location 25%, loan category 20%, distance 10%, availability 5%
- Partner detail page at `/partners/:id`
- Distance calculation using lat/lng
- Map/list toggle view
- Directions link
- Partner data with official source attribution
- Demo data labelling when real data unavailable
- "Find Partner" CTA from scheme detail and recommendation results

## Capabilities

### New Capabilities
- `partner-locator`: Partner listing with map and list views, filtering, sorting
- `partner-map`: React Leaflet map with partner markers, current location, search
- `partner-filtering`: Multi-facet filtering by scheme, type, location, distance, availability
- `partner-routing`: Find nearest eligible partner for a specific scheme
- `partner-match-score`: Weighted scoring for partner suitability
- `partner-detail`: Full partner detail page with contact, supported schemes, availability

### Modified Capabilities

(none)

## Impact

- New `src/pages/Partners.tsx` and `src/pages/PartnerDetail.tsx`
- New `src/services/partners/` directory with locator, filtering, routing, scoring
- New components: PartnerCard, PartnerMap, PartnerFilter, PartnerMatchScore
- New dependency: `react-leaflet`, `leaflet`
- Route: `/partners`, `/partners/:id`
- Depends on: `firebase-architecture`, `scheme-data-model`
