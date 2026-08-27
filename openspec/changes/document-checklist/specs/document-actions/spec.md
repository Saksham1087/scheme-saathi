## ADDED Requirements

### Requirement: DigiLocker retrieval CTA

The system SHALL provide a "Get from DigiLocker" button for documents available through DigiLocker integration.

#### Scenario: Document available via DigiLocker
- **WHEN** a document item has DigiLocker availability flagged as true
- **THEN** the system SHALL display a "Get from DigiLocker" button next to the document item

#### Scenario: User clicks DigiLocker CTA
- **WHEN** a user clicks the "Get from DigiLocker" button
- **THEN** the system SHALL initiate the DigiLocker retrieval flow via the digilocker-integration API

#### Scenario: DigiLocker retrieval succeeds
- **WHEN** the DigiLocker retrieval flow completes successfully
- **THEN** the system SHALL automatically mark the document as ready and update the progress indicator

#### Scenario: DigiLocker retrieval fails
- **WHEN** the DigiLocker retrieval flow fails or the user cancels
- **THEN** the system SHALL display the manual "Mark as Ready" fallback option and an error message explaining the failure

### Requirement: Manual upload fallback

For documents not available via DigiLocker, the system SHALL provide a manual preparation tracking option.

#### Scenario: Document not available via DigiLocker
- **WHEN** a document item does not have DigiLocker availability
- **THEN** the system SHALL display a "Mark as Ready" button instead of the DigiLocker CTA

#### Scenario: User marks document ready manually
- **WHEN** a user clicks "Mark as Ready" for a document
- **THEN** the system SHALL update the document status to ready and save the state

### Requirement: Document action availability indication

The system SHALL clearly indicate which action is available for each document.

#### Scenario: DigiLocker available indicator
- **WHEN** a document supports DigiLocker retrieval
- **THEN** the system SHALL display a small DigiLocker badge or icon next to the document name indicating digital retrieval is available

#### Scenario: Manual-only indicator
- **WHEN** a document only supports manual preparation
- **THEN** the system SHALL display text indicating the document must be prepared manually (e.g., "Prepare this document yourself")

### Requirement: Verification reminder

The system SHALL remind users that documents will be verified at the partner location.

#### Scenario: User views checklist
- **WHEN** the document checklist is displayed
- **THEN** the system SHALL include a disclaimer noting that documents will be verified in person at the channel partner location and marking a document as ready does not constitute official verification
