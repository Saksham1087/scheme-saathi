## ADDED Requirements

### Requirement: Firestore Service Layer
The system SHALL provide a typed service layer in `src/services/firebase/` that abstracts all Firestore operations. Components SHALL NOT access Firestore SDK directly.

#### Scenario: Service layer provides CRUD
- **WHEN** a component needs to read or write Firestore data
- **THEN** it SHALL call a method in the service layer (e.g., `getSchemeById()`, `saveUserPreferences()`) rather than using `firebase.firestore()` directly

### Requirement: Firestore Collections
The system SHALL define the following Firestore collections: `users`, `schemes`, `schemeRules`, `partners`, `partnerSchemes`, `recommendations`, `assessments`, `savedSchemes`, `savedPartners`, `calculatorHistory`, `documents`, `applicationJourneys`, `categories`, `translations`, `adminUsers`.

#### Scenario: Collection structure exists
- **WHEN** the application initializes
- **THEN** Firestore SHALL contain or be ready to contain all listed collections with documents conforming to the defined TypeScript interfaces

### Requirement: CRUD Operations
The service layer SHALL provide create, read, update, and delete operations for all primary collections.

#### Scenario: Create document
- **WHEN** a service method is called to create a new document
- **THEN** a Firestore document SHALL be created with an auto-generated or specified ID and a server timestamp

#### Scenario: Read document
- **WHEN** a service method is called to read a document by ID
- **THEN** the typed document object SHALL be returned, or null if not found

#### Scenario: Update document
- **WHEN** a service method is called to update a document
- **THEN** only the specified fields SHALL be updated (partial update / merge)

#### Scenario: Delete document
- **WHEN** a service method is called to delete a document
- **THEN** the document SHALL be removed from Firestore

### Requirement: Real-Time Subscriptions
The service layer SHALL support real-time listeners for collections where live updates are needed (e.g., user saved schemes, recommendations).

#### Scenario: Subscribe to collection
- **WHEN** a component subscribes to a Firestore collection via the service layer
- **THEN** it SHALL receive real-time updates whenever documents in that collection change

#### Scenario: Unsubscribe on unmount
- **WHEN** a subscribing component unmounts
- **THEN** the real-time listener SHALL be unsubscribed to prevent memory leaks

### Requirement: Security Rules
Firestore security rules SHALL enforce role-based access control for all collections.

#### Scenario: Public read for schemes
- **WHEN** any user (authenticated or not) reads from the `schemes` collection
- **THEN** the read SHALL be permitted

#### Scenario: Authenticated user writes own data
- **WHEN** an authenticated user writes to their own document in the `users` collection
- **THEN** the write SHALL be permitted

#### Scenario: Unauthenticated write blocked
- **WHEN** an unauthenticated user attempts to write to any collection
- **THEN** the write SHALL be denied with a permission error

#### Scenario: Admin-only operations
- **WHEN** a non-admin user attempts to write to `schemes`, `adminUsers`, or `categories` collections
- **THEN** the write SHALL be denied

### Requirement: Error Handling
All Firestore service methods SHALL handle errors gracefully and return typed error results.

#### Scenario: Network error
- **WHEN** a Firestore operation fails due to network issues
- **THEN** the service method SHALL return an error result with a user-friendly message without crashing the application
