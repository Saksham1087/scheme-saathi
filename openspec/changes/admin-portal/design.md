## Context

Admins need tools to manage schemes, partners, verify data, and view analytics. Without an admin portal, data management requires direct database access, which is error-prone and unscalable. The admin portal is P2 priority, but the architecture should support it from the start.

## Goals / Non-Goals

**Goals:**
- Provide a `/admin` portal with role-based access control
- Enable CRUD operations for schemes with verification and source tracking
- Enable CRUD operations for partners with location and availability management
- Display analytics: scheme searches, recommendations, no-match cases, calculator usage, partner searches, language usage, completion rate
- Store admin user roles in Firestore

**Non-Goals:**
- Bulk data import/export (future enhancement)
- Audit logging of all admin actions
- Multi-level admin roles (admin vs super-admin)
- Real-time analytics streaming
- Self-service admin registration

## Decisions

- Role-based access: admin role stored in Firestore user document, checked on every admin route
- Admin portal shares authentication with main app; no separate login
- Sub-routes under `/admin` for schemes, partners, analytics sections
- Analytics data aggregated from Firestore collections; no separate analytics backend
- Scheme management includes source tracking (official vs community-contributed)

## Risks / Trade-offs

- **Authorization bypass:** Role checks must be enforced both client-side and in Firestore security rules
- **Data integrity:** Admin edits to schemes/partners affect all users immediately; confirmation dialogs for destructive actions
- **Analytics performance:** Aggregating large collections on the fly may be slow; pre-computed counters or caching may be needed
- **Scope creep:** Admin features can expand rapidly; strict P2 scope boundaries must be maintained
