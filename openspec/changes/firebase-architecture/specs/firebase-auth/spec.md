## ADDED Requirements

### Requirement: Firebase Authentication Setup
The system SHALL provide Firebase Authentication with email/password and Google sign-in providers enabled.

#### Scenario: Email sign-up
- **WHEN** a new user submits a valid email and password on the sign-up form
- **THEN** a Firebase Auth account SHALL be created and the user SHALL be signed in automatically

#### Scenario: Email sign-in
- **WHEN** an existing user submits valid email and password credentials
- **THEN** the user SHALL be authenticated and redirected to the application home page

#### Scenario: Google sign-in
- **WHEN** a user clicks the "Sign in with Google" button
- **THEN** a Google OAuth popup SHALL open, and upon successful authentication the user SHALL be signed in

#### Scenario: Invalid credentials
- **WHEN** a user submits an incorrect email or password
- **THEN** an error message SHALL be displayed indicating authentication failure without revealing which field is incorrect

### Requirement: Session Management
The system SHALL maintain user sessions using Firebase Auth persistence and expose session state to the React application.

#### Scenario: Session persistence
- **WHEN** an authenticated user closes and reopens the browser
- **THEN** the user SHALL remain signed in without re-authenticating

#### Scenario: Session expiry
- **WHEN** a user's Firebase token expires
- **THEN** the system SHALL automatically refresh the token using the Firebase SDK

### Requirement: Protected Routes
The system SHALL restrict access to authenticated-only routes using a route guard component.

#### Scenario: Unauthenticated access to protected route
- **WHEN** an unauthenticated user navigates to a protected route (e.g., profile, saved schemes)
- **THEN** the user SHALL be redirected to the sign-in page

#### Scenario: Authenticated access to protected route
- **WHEN** an authenticated user navigates to a protected route
- **THEN** the route SHALL render normally

### Requirement: Auth State Provider
The system SHALL provide an AuthContext that exposes the current user, authentication state, and auth methods to all child components.

#### Scenario: Auth context provides user
- **WHEN** a user is signed in
- **THEN** `useAuth()` hook SHALL return the current user object with uid, email, displayName, and photoURL

#### Scenario: Auth context when signed out
- **WHEN** no user is signed in
- **THEN** `useAuth()` hook SHALL return null user and isAuthenticated = false
