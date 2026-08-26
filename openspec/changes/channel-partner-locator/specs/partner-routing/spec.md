## ADDED Requirements

### Requirement: Nearest eligible partner for scheme

The system SHALL find and recommend the nearest partner eligible for a specific scheme, not just the nearest partner overall.

#### Scenario: "Find Partner" from scheme detail
- **WHEN** a user clicks "Find Partner" on a scheme detail page
- **THEN** the system SHALL navigate to `/partners` with the scheme pre-filtered and results sorted by eligibility + distance

#### Scenario: "Find Partner" from recommendation results
- **WHEN** a user clicks "Find Partner" on a recommendation result card
- **THEN** the system SHALL navigate to `/partners` with the recommended scheme pre-filtered and results sorted by eligibility + distance

#### Scenario: No eligible partners found
- **WHEN** no partners in the system are eligible for the selected scheme
- **THEN** the system SHALL display a message indicating no eligible partners were found and suggest broadening filters or contacting the scheme authority

### Requirement: Directions link

The system SHALL provide directions to a partner's location.

#### Scenario: Directions available
- **WHEN** a user views a partner with valid coordinates
- **THEN** the system SHALL provide a "Get Directions" link that opens the partner location in the user's default maps application

### Requirement: Partner routing integration with map

The map view SHALL reflect routing results.

#### Scenario: Map focuses on routing results
- **WHEN** a user arrives at the partners page via "Find Partner" with scheme routing
- **THEN** the system SHALL zoom the map to fit all eligible partners and highlight the top-ranked partner with a distinct marker
