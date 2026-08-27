## Context

Users who find a suitable scheme need to know where to actually go to process their application. The channel partner locator is a major differentiator for Scheme Sathi — it connects users with the nearest eligible partner for their specific scheme, not just any nearby bank. Partner data includes State Channelizing Agencies, PSBs, RRBs, NBFC-MFIs, and other authorized partners sourced from official directories.

## Goals / Non-Goals

**Goals:**
- Provide a partner listing page with both map and list views
- Enable multi-facet filtering by scheme, loan type, state, district, distance, partner type, and availability
- Calculate nearest eligible partner routing based on scheme compatibility
- Compute a weighted match score for partner suitability
- Display full partner detail with contact information, supported schemes, and availability
- Use React Leaflet + OpenStreetMap (no Google Maps dependency)
- Label demo data clearly when real partner data is unavailable

**Non-Goals:**
- Real-time appointment booking at partners
- Partner availability API integration (real-time status)
- Application submission through the partner interface
- Partner onboarding or partner-side dashboards

## Decisions

1. **Map technology**: React Leaflet with OpenStreetMap tiles. This avoids Google Maps API costs and licensing restrictions while providing full mapping capabilities.

2. **Partner categories**: The system SHALL support these partner types as defined in the PRD: State Channelizing Agencies, Public Sector Banks (PSBs), Regional Rural Banks (RRBs), NBFC-MFIs, and other authorized partners. Each SHALL have a distinct label and optional icon.

3. **Match score formula**: Partner match score SHALL be weighted: scheme compatibility 40%, location proximity 25%, loan category match 20%, distance 10%, availability 5%. This weighting prioritizes scheme eligibility over pure distance.

4. **Routing logic**: "Find Partner" routing SHALL find the nearest partner that is eligible for the specific scheme, not just the nearest partner overall. The system SHALL filter by scheme eligibility first, then rank by composite score.

5. **Data strategy**: Partner data SHALL be sourced from official partner directories with source attribution. When real data is unavailable, the system SHALL display demo data with a visible "Demo Data" label and a note that real data is pending.

6. **Distance calculation**: The system SHALL calculate distance using haversine formula on lat/lng coordinates. Distance SHALL be displayed in km with one decimal precision.

7. **Map/list toggle**: The default view SHALL be list on mobile, map on desktop. Users SHALL be able to toggle between views at any time.

## Risks / Trade-offs

- **Partner data freshness**: Partner locations and eligibility may change. The system SHALL include source attribution and "last updated" dates. Periodic data refreshes are outside this change's scope.
- **Map tile reliability**: OpenStreetMap tiles may have occasional downtime. The system SHALL gracefully degrade to list-only view if map tiles fail to load.
- **Geolocation permission**: The "Find nearest" feature requires browser geolocation. The system SHALL handle denied/unavailable geolocation by falling back to state/district-based filtering.
- **Demo data confusion**: Demo data must be clearly labeled to prevent users from acting on fabricated partner information.
