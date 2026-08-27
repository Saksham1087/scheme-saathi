## Why

Users need a central place to track their saved schemes, saved partners, assessment history, document readiness, and application journeys. The dashboard is the personal hub for ongoing engagement.

## What Changes

- Dashboard page at `/dashboard`
- Sections: My Recommendations, Saved Schemes, Saved Partners, Recent Calculations, Document Readiness, Application Journey, Assessment History
- Quick actions: recalculate, find partner, start new assessment
- Responsive grid layout
- Empty states for each section
- Authentication required (protected route)

## Capabilities

### New Capabilities
- `user-dashboard`: Personal dashboard with saved schemes, partners, calculations, documents, journeys
- `dashboard-sections`: Individual section components with empty states and quick actions
- `protected-dashboard`: Authentication-gated dashboard access

### Modified Capabilities

(none)

## Impact

- New `src/pages/Dashboard.tsx`
- New components: DashboardSection, SavedSchemesList, SavedPartnersList, AssessmentHistory
- Route: `/dashboard`
- Depends on: `firebase-architecture`, all saveable modules
