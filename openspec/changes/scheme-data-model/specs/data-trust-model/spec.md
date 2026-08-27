## ADDED Requirements

### Requirement: Source Tier Classification
Each scheme SHALL include a `source` field indicating data reliability tier: Tier 1 (official government portal), Tier 2 (verified government document), Tier 3 (secondary source / news), Tier 4 (estimated / unverified).

#### Scenario: Tier 1 scheme
- **WHEN** a scheme is sourced directly from a .gov.in portal
- **THEN** its `source` field SHALL be set to 1

#### Scenario: Tier 4 scheme
- **WHEN** a scheme data is estimated or from an unverified source
- **THEN** its `source` field SHALL be set to 4

### Requirement: Verification Status
Each scheme SHALL have a `verified` boolean field indicating whether the data has been manually verified by the Scheme Sathi team.

#### Scenario: Verified scheme
- **WHEN** a team member confirms a scheme's data accuracy
- **THEN** the `verified` field SHALL be set to true

#### Scenario: Unverified scheme
- **WHEN** a scheme is auto-imported or not yet reviewed
- **THEN** the `verified` field SHALL be false

### Requirement: Last Updated Tracking
Each scheme SHALL have a `lastUpdated` ISO 8601 timestamp field recording when the scheme data was last verified or refreshed.

#### Scenario: Timestamp recorded
- **WHEN** a scheme record is created or updated
- **THEN** the `lastUpdated` field SHALL be set to the current ISO 8601 timestamp

### Requirement: Mock Data Labeling
The system SHALL distinguish between real and mock/seed data so the UI can display appropriate disclaimers.

#### Scenario: Mock data flag
- **WHEN** a scheme is loaded from seed data that has not been independently verified
- **THEN** the scheme detail page SHALL display a disclaimer indicating the data may not reflect the latest government information

### Requirement: Official Source Display
The scheme detail page SHALL display the official source URL and tier information to users.

#### Scenario: Source attribution rendered
- **WHEN** a user views a scheme detail page
- **THEN** the page SHALL display the official source URL as a clickable link and indicate the source tier (e.g., "Source: Official Government Portal")

### Requirement: Disclaimer for Unverified Data
The system SHALL display a visible disclaimer on scheme detail pages for schemes with `verified: false` or `source >= 3`.

#### Scenario: Disclaimer shown
- **WHEN** a user views a scheme with verified=false
- **THEN** a disclaimer banner SHALL be displayed stating that the information may be approximate and should be verified with official sources
