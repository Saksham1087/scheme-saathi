## ADDED Requirements

### Requirement: DigiLocker OAuth connection flow
The system SHALL provide an OAuth-based connection flow that allows users to authenticate with DigiLocker via API Setu and grant consent for document retrieval.

#### Scenario: User initiates DigiLocker connection
- **WHEN** the user clicks the "Get from DigiLocker" CTA in the document checklist
- **THEN** the system SHALL redirect the user to the DigiLocker OAuth authorization page via API Setu

#### Scenario: User grants consent
- **WHEN** the user successfully authenticates and grants consent on the DigiLocker authorization page
- **THEN** the system SHALL receive an OAuth token and store it in the user's session for document retrieval

#### Scenario: User denies consent
- **WHEN** the user denies consent on the DigiLocker authorization page
- **THEN** the system SHALL redirect the user back to the document checklist and display the manual upload option without error

#### Scenario: OAuth token expires
- **WHEN** the user's DigiLocker OAuth token has expired
- **THEN** the system SHALL prompt the user to re-authenticate before attempting document retrieval
