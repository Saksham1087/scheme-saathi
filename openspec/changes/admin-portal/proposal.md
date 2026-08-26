## Why

Admins need to manage schemes, partners, data verification, and view analytics. The admin portal is P2 but the architecture should support it from the start.

## What Changes

- Admin portal at `/admin` with role-based access
- Scheme management: add, edit, verify, deactivate, update, source tracking
- Partner management: add, edit, location, supported schemes, status, availability
- Data management: source, last updated, verification status
- Analytics: scheme searches, recommendations, no-match cases, calculator usage, partner searches, language usage, user completion rate
- Admin user management in Firestore

## Capabilities

### New Capabilities
- `admin-schemes`: Admin CRUD for schemes with verification and source tracking
- `admin-partners`: Admin CRUD for partners with location and availability management
- `admin-analytics`: Dashboard with usage metrics and completion rates
- `admin-access`: Role-based admin authentication and authorization

### Modified Capabilities

(none)

## Impact

- New `src/pages/Admin.tsx` with sub-routes
- New `src/services/admin/` directory
- New components: AdminSchemeForm, AdminPartnerForm, AnalyticsDashboard
- Route: `/admin`
- Depends on: `firebase-architecture`, `scheme-data-model`
