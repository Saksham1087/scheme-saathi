## 1. Setup & Dependencies

- [x] 1.1 Install `react-leaflet` and `leaflet` dependencies
- [x] 1.2 Create `src/services/partners/` directory structure (locator, filtering, routing, scoring modules)
- [x] 1.3 Define partner data model and types (id, name, type, lat/lng, supported schemes, availability, contact info)
- [x] 1.4 Create demo partner dataset with clear "Demo Data" labels

## 2. Partner Service Layer

- [x] 2.1 Implement haversine distance calculation function (lat/lng → km, 1 decimal precision)
- [x] 2.2 Implement partner filtering service — multi-facet: scheme, loan type, state, district, distance, partner type, availability
- [x] 2.3 Implement partner match score — weighted: scheme compatibility 40%, location proximity 25%, loan category 20%, distance 10%, availability 5%
- [x] 2.4 Implement partner routing — filter by scheme eligibility first, then rank by composite score
- [x] 2.5 Implement fallback for denied/unavailable geolocation → state/district-based filtering

## 3. UI Components

- [x] 3.1 Create `PartnerCard` component with partner name, type, distance, match score, availability
- [x] 3.2 Create `PartnerMap` component using React Leaflet with OpenStreetMap tiles and partner markers
- [x] 3.3 Create `PartnerFilter` component with multi-facet filter controls
- [x] 3.4 Create `PartnerMatchScore` component displaying weighted score breakdown
- [x] 3.5 Implement map/list toggle — default list on mobile, map on desktop
- [x] 3.6 Add map tile failure graceful degradation to list-only view

## 4. Pages

- [x] 4.1 Create `src/pages/Partners.tsx` — partner listing page with map + list views at `/partners`
- [x] 4.2 Create `src/pages/PartnerDetail.tsx` — full partner detail with contact, supported schemes, availability at `/partners/:id`
- [x] 4.3 Add partner type labels and icons for each category (SCA, PSB, RRB, NBFC-MFI, other)
- [x] 4.4 Add "Find Partner" CTA from scheme detail page and recommendation results
- [x] 4.5 Add directions link (external map URL) on partner detail

## 5. Data & Attribution

- [x] 5.1 Add source attribution and "last updated" date to partner data display
- [x] 5.2 Label demo data prominently — visible banner/notice that real data is pending
- [x] 5.3 Add geolocation permission denied notice with fallback instructions

## 6. Testing & Polish

- [x] 6.1 Test partner filtering across all facets (scheme, type, location, distance)
- [x] 6.2 Test match score calculation with various partner/scheme combinations
- [x] 6.3 Test map rendering, marker placement, and list/map toggle
- [x] 6.4 Test geolocation denied/unavailable fallback behavior
- [x] 6.5 Test partner detail page with partners that have missing/incomplete data
