## ADDED Requirements

### Requirement: Graceful fallback to manual upload
The system SHALL provide a graceful fallback to manual document upload when DigiLocker is unavailable or the requested document is not available.

#### Scenario: DigiLocker service is unavailable
- **WHEN** the DigiLocker API is unreachable or returns an error
- **THEN** the system SHALL display the message "DigiLocker unavailable for this document. Upload manually." and present the manual upload interface

#### Scenario: User's DigiLocker account has no relevant documents
- **WHEN** the user's DigiLocker account does not contain documents matching the application checklist
- **THEN** the system SHALL display the manual upload option without showing an error about DigiLocker

#### Scenario: User explicitly chooses manual upload
- **WHEN** the user selects the manual upload option instead of DigiLocker
- **THEN** the system SHALL bypass the DigiLocker flow entirely and present the standard file upload interface

### Requirement: DigiLocker unavailable messaging
The system SHALL display clear and helpful messaging when DigiLocker fallback is triggered, ensuring users understand their options.

#### Scenario: Fallback message is displayed
- **WHEN** DigiLocker fallback is triggered for any reason
- **THEN** the system SHALL display a user-friendly message explaining that manual upload is available as an alternative
