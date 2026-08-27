## 1. Authentication & Authorization

- [x] 1.1 Define admin role structure in Firestore user documents (`role: 'admin' | 'user'`)
- [x] 1.2 Implement `isAdmin()` utility function to check user role from Firestore
- [x] 1.3 Create admin route guard: redirect non-admin users from `/admin` to home with error message
- [x] 1.4 Write Firestore security rules to enforce admin-only access on admin collections
- [x] 1.5 Create admin user management: ability to promote/demote users via Firestore (manual for MVP)

## 2. Route & Layout Setup

- [x] 2.1 Create `src/pages/Admin.tsx` with nested sub-route layout
- [x] 2.2 Register `/admin` route with admin guard
- [x] 2.3 Create admin sidebar/navigation with sections: Schemes, Partners, Analytics
- [x] 2.4 Style admin layout distinct from public pages (dark sidebar, admin header with role badge)

## 3. Scheme Management (Admin CRUD)

- [x] 3.1 Create `AdminSchemeList` component: table view of all schemes with name, category, status, last updated, source
- [x] 3.2 Implement scheme search and filter (by category, status, source)
- [x] 3.3 Create `AdminSchemeForm` component: add new scheme with all fields from scheme data model
- [x] 3.4 Implement edit scheme functionality with pre-filled form
- [x] 3.5 Implement scheme verification toggle (verified/unverified) with confirmation
- [x] 3.6 Implement scheme deactivation with confirmation dialog and soft-delete behavior
- [x] 3.7 Add source tracking field: official vs community-contributed with source URL/reference

## 4. Partner Management (Admin CRUD)

- [x] 4.1 Create `AdminPartnerList` component: table view of all partners with name, location, schemes, status
- [x] 4.2 Implement partner search and filter (by location, supported scheme, availability status)
- [x] 4.3 Create `AdminPartnerForm` component: add new partner with all fields from partner data model
- [x] 4.4 Implement edit partner functionality with pre-filled form
- [x] 4.5 Implement partner status management (active/inactive/suspended) with confirmation
- [x] 4.6 Implement location management for partners (address, coordinates, service areas)

## 5. Admin Services Layer

- [x] 5.1 Create `src/services/admin/schemes.ts`: Firestore CRUD operations for admin scheme management
- [x] 5.2 Create `src/services/admin/partners.ts`: Firestore CRUD operations for admin partner management
- [x] 5.3 Create `src/services/admin/analytics.ts`: aggregation queries for analytics data
- [x] 5.4 Create `src/services/admin/access.ts`: role checking and admin user management
- [x] 5.5 Create barrel export `src/services/admin/index.ts`

## 6. Analytics Dashboard

- [x] 6.1 Create `AnalyticsDashboard` component with metric cards layout
- [x] 6.2 Implement scheme searches metric: count and trend from Firestore
- [x] 6.3 Implement recommendations metric: how many users received recommendations
- [x] 6.4 Implement no-match cases metric: users who found no matching schemes
- [x] 6.5 Implement calculator usage metric: EMI and affordability calculator usage counts
- [x] 6.6 Implement partner searches metric: partner locator usage
- [x] 6.7 Implement language usage metric: breakdown of language selection
- [x] 6.8 Implement user completion rate: percentage of users who completed application journey
- [x] 6.9 Display analytics with date range selector (last 7 days, 30 days, all time)

## 7. Data Management

- [x] 7.1 Create data verification panel showing schemes/partners pending verification
- [x] 7.2 Display last-updated timestamps for all managed entities
- [x] 7.3 Implement bulk verification actions (verify multiple schemes at once)

## 8. Confirmation & Safety

- [x] 8.1 Add confirmation dialogs for all destructive actions (deactivate, delete, demote)
- [x] 8.2 Implement undo capability for scheme deactivation (re-activate within 24h)
- [x] 8.3 Add warning banners for admin actions that affect all users immediately

## 9. Error Handling & Edge Cases

- [x] 9.1 Handle unauthorized access attempts with clear error messaging
- [x] 9.2 Handle Firestore write failures in CRUD operations with retry and error display
- [x] 9.3 Handle empty states for analytics (no data yet) and entity lists (no schemes/partners)
- [x] 9.4 Handle concurrent admin edits with last-write-wins and stale-data warnings
