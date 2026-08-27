## ADDED Requirements

### Requirement: Partner CRUD operations
The system SHALL provide admin capabilities to create, read, update, and delete partners with location and availability management.

#### Scenario: Admin creates a new partner
- **WHEN** an admin submits the partner creation form with valid data including name, location, and supported schemes
- **THEN** the system SHALL create the partner in Firestore with an active status

#### Scenario: Admin edits partner details
- **WHEN** an admin modifies partner information and saves changes
- **THEN** the system SHALL update the partner record in Firestore and record the modification timestamp

#### Scenario: Admin updates partner availability
- **WHEN** an admin changes a partner's availability status
- **THEN** the system SHALL update the partner's availability field and reflect the change in user-facing partner search results

#### Scenario: Admin deactivates a partner
- **WHEN** an admin deactivates a partner
- **THEN** the system SHALL mark the partner as inactive and exclude them from user-facing search results

### Requirement: Partner location and scheme management
The system SHALL allow admins to manage partner locations and the schemes they support.

#### Scenario: Admin assigns schemes to a partner
- **WHEN** an admin selects schemes that a partner supports
- **THEN** the system SHALL associate those schemes with the partner record and update the partner's supported schemes list
