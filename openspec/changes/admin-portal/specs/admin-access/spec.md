## ADDED Requirements

### Requirement: Role-based admin access
The system SHALL enforce role-based access control for the admin portal, restricting access to users with an admin role stored in Firestore.

#### Scenario: Admin user accesses admin portal
- **WHEN** a user with an admin role in their Firestore profile navigates to `/admin`
- **THEN** the system SHALL grant access and render the admin portal

#### Scenario: Non-admin user accesses admin portal
- **WHEN** a user without an admin role navigates to `/admin`
- **THEN** the system SHALL deny access and redirect the user to the main dashboard with an unauthorized message

#### Scenario: Unauthenticated user accesses admin portal
- **WHEN** an unauthenticated user navigates to `/admin`
- **THEN** the system SHALL redirect the user to the login page

### Requirement: Admin role management in Firestore
The system SHALL store admin user roles in Firestore user documents and check roles on every admin route access.

#### Scenario: Admin role is checked on route access
- **WHEN** a user navigates to any `/admin` sub-route
- **THEN** the system SHALL verify the user's admin role from their Firestore document before rendering the page

#### Scenario: Admin role is removed
- **WHEN** an admin's role is removed from their Firestore document
- **THEN** the system SHALL deny access to the admin portal on the next route navigation or page refresh
