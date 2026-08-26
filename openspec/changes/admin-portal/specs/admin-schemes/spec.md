## ADDED Requirements

### Requirement: Scheme CRUD operations
The system SHALL provide admin capabilities to create, read, update, and delete schemes with verification and source tracking.

#### Scenario: Admin creates a new scheme
- **WHEN** an admin submits the scheme creation form with valid data
- **THEN** the system SHALL create the scheme in Firestore with a "pending verification" status and record the admin as the source

#### Scenario: Admin edits an existing scheme
- **WHEN** an admin modifies scheme details and saves changes
- **THEN** the system SHALL update the scheme in Firestore and record the modification timestamp and admin ID

#### Scenario: Admin verifies a scheme
- **WHEN** an admin marks a scheme as verified
- **THEN** the system SHALL update the scheme's verification status to "verified" and record the verification timestamp

#### Scenario: Admin deactivates a scheme
- **WHEN** an admin deactivates a scheme
- **THEN** the system SHALL mark the scheme as inactive and exclude it from user-facing search results while preserving it in the database

### Requirement: Source tracking
The system SHALL track the source and last update information for each scheme.

#### Scenario: Scheme displays source information
- **WHEN** an admin views scheme details
- **THEN** the system SHALL display the source (official, community-contributed), last updated timestamp, and verification status
