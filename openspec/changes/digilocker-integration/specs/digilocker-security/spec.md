## ADDED Requirements

### Requirement: No credential storage
The system SHALL never store DigiLocker passwords or credentials in any form within the application.

#### Scenario: User authenticates with DigiLocker
- **WHEN** the user completes DigiLocker OAuth authentication
- **THEN** the system SHALL store only the OAuth access token in the user's session and SHALL NOT persist the user's DigiLocker password or PIN

#### Scenario: System processes DigiLocker credentials
- **WHEN** the system receives DigiLocker credentials during the authentication flow
- **THEN** the system SHALL forward them directly to the API Setu endpoint without logging, caching, or storing them

### Requirement: Consent-only document access
The system SHALL only access DigiLocker documents after explicit user consent has been obtained for each retrieval session.

#### Scenario: User has not provided consent
- **WHEN** the user has not authenticated or granted consent for the current session
- **THEN** the system SHALL NOT attempt to retrieve any documents from DigiLocker

#### Scenario: Consent is withdrawn or session expires
- **WHEN** the user's consent session expires or they explicitly disconnect DigiLocker
- **THEN** the system SHALL immediately invalidate the stored OAuth token and cease all DigiLocker access

### Requirement: Authorized integration only
The system SHALL only connect to DigiLocker through the official API Setu integration and SHALL NOT use any unofficial or scraping mechanisms.

#### Scenario: System initiates DigiLocker connection
- **WHEN** the system needs to connect to DigiLocker for any operation
- **THEN** the system SHALL exclusively use the official API Setu endpoints and SHALL NOT use unofficial APIs, scraping, or any other unauthorized mechanism

#### Scenario: API Setu credentials are missing
- **WHEN** the system does not have valid API Setu credentials configured
- **THEN** the system SHALL disable the DigiLocker option and show only the manual upload path
