## ADDED Requirements

### Requirement: Per-scheme document checklist display

The system SHALL display a checklist of required documents for a given scheme.

#### Scenario: Scheme has defined document requirements
- **WHEN** a user views the document checklist for a scheme with structured document requirements
- **THEN** the system SHALL list all required documents with their name, category, and required/optional designation

#### Scenario: Scheme has partial document data
- **WHEN** a scheme has some but not all document requirements defined
- **THEN** the system SHALL display the available documents and include a note that the list may be incomplete, suggesting verification with the scheme authority

#### Scenario: Scheme has no document data
- **WHEN** a scheme has no structured document requirements
- **THEN** the system SHALL display a message indicating document requirements are not yet available and provide guidance to check official scheme documentation

### Requirement: Document ready/pending tracking

Each document item SHALL have a ready/pending status that the user can toggle.

#### Scenario: User marks document as ready
- **WHEN** a user toggles a document from pending to ready
- **THEN** the system SHALL update the document's status to ready, save the state to the user's profile, and update the progress indicator

#### Scenario: User marks document as pending
- **WHEN** a user toggles a document from ready back to pending
- **THEN** the system SHALL update the document's status to pending, save the state to the user's profile, and update the progress indicator

#### Scenario: Unauthenticated user
- **WHEN** an unauthenticated user toggles a document status
- **THEN** the system SHALL update the status in local state and prompt the user to sign in to save progress

### Requirement: Document checklist persistence

Document checklist state SHALL be saved to the user's Firebase profile.

#### Scenario: Checklist saved on toggle
- **WHEN** a user changes a document's readiness status
- **THEN** the system SHALL persist the updated checklist state to Firebase under the user's profile, keyed by scheme ID

#### Scenario: Checklist loaded on page visit
- **WHEN** an authenticated user navigates to a document checklist they have previously interacted with
- **THEN** the system SHALL load and display their saved readiness states
