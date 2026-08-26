## ADDED Requirements

### Requirement: User Profile Document
The system SHALL define a Firestore `users` collection document with fields: `id` (matching Firebase Auth uid), `email`, `displayName`, `photoURL`, `phone`, `language` (en/hi/mr), `category`, `state`, `income`, `education`, `occupation`, `isCompleted`, `createdAt`, `updatedAt`.

#### Scenario: User profile creation on sign-up
- **WHEN** a new user signs up
- **THEN** a user document SHALL be created in the `users` collection with the Firebase Auth uid as the document ID

#### Scenario: User profile read
- **WHEN** an authenticated user requests their profile
- **THEN** the system SHALL return their user document from Firestore

### Requirement: Saved Schemes
The system SHALL maintain a `savedSchemes` sub-collection or collection referencing user-saved scheme IDs.

#### Scenario: Save a scheme
- **WHEN** an authenticated user saves a scheme
- **THEN** a document SHALL be created in `savedSchemes` with the userId, schemeId, and savedAt timestamp

#### Scenario: Remove saved scheme
- **WHEN** an authenticated user removes a saved scheme
- **THEN** the corresponding `savedSchemes` document SHALL be deleted

#### Scenario: List saved schemes
- **WHEN** an authenticated user views their saved schemes
- **THEN** the system SHALL return all schemes referenced by their savedSchemes documents

### Requirement: Saved Partners
The system SHALL maintain a `savedPartners` collection for user-saved partner references.

#### Scenario: Save a partner
- **WHEN** an authenticated user saves a partner
- **THEN** a document SHALL be created in `savedPartners` with the userId, partnerId, and savedAt timestamp

### Requirement: Assessment History
The system SHALL track user assessment submissions in an `assessments` collection.

#### Scenario: Assessment recorded
- **WHEN** a user completes a recommendation assessment
- **THEN** an assessment document SHALL be created with userId, responses, recommended schemes, and timestamp

#### Scenario: View assessment history
- **WHEN** an authenticated user views their assessment history
- **THEN** the system SHALL return all their past assessments sorted by most recent

### Requirement: Application Journey
The system SHALL track application journeys in an `applicationJourneys` collection for each scheme a user is actively applying to.

#### Scenario: Start application journey
- **WHEN** a user begins applying to a scheme
- **THEN** an applicationJourney document SHALL be created with userId, schemeId, status, checklist items, and timestamps

#### Scenario: Update journey status
- **WHEN** a user progresses through an application
- **THEN** the applicationJourney document SHALL be updated with the new status and completion checklist

### Requirement: User TypeScript Interfaces
The system SHALL provide TypeScript interfaces for User, SavedScheme, SavedPartner, Assessment, and ApplicationJourney in `src/types/user.ts`.

#### Scenario: Type safety
- **WHEN** any component imports user-related types
- **THEN** all properties SHALL be correctly typed and match Firestore document structures
