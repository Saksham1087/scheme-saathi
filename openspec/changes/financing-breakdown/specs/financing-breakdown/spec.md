## ADDED Requirements

### Requirement: Display financing breakdown

The system SHALL display a financing breakdown for a selected scheme showing total project cost, scheme finance amount, and own contribution amount.

#### Scenario: User views financing breakdown with complete data
- **WHEN** a user selects a scheme with defined financing rules and has provided a project cost
- **THEN** the system SHALL display: total project cost, scheme finance portion (with percentage), and own contribution (with percentage)

#### Scenario: Scheme has percentage-based financing rules
- **WHEN** the scheme defines finance coverage as a percentage (e.g., "up to 60% of project cost")
- **THEN** the system SHALL calculate the absolute scheme finance amount from the project cost and display both the percentage and calculated amount

#### Scenario: Scheme has fixed-value financing rules
- **WHEN** the scheme defines a fixed maximum finance amount (e.g., "up to ₹10 lakh")
- **THEN** the system SHALL display the fixed cap alongside the calculated amount and use the lesser of the two as the effective scheme finance

### Requirement: Source values from verified scheme data

The system SHALL source all financing values from the scheme-data-model. Values SHALL NOT be fabricated or hardcoded.

#### Scenario: Scheme has structured financing data
- **WHEN** the scheme record contains financing rule fields
- **THEN** the system SHALL use those fields to compute and display the breakdown

#### Scenario: Scheme lacks financing data
- **WHEN** the scheme record does not contain financing rule fields
- **THEN** the system SHALL display available cost fields and mark financing-specific fields as "Not specified in scheme data"

### Requirement: Display disclaimer for illustrative values

The system SHALL clearly distinguish between official fixed values and illustrative calculated values.

#### Scenario: Values are calculated from user input
- **WHEN** financing amounts are derived from user-provided project cost multiplied by scheme rules
- **THEN** the system SHALL display a disclaimer stating the values are illustrative and the source of the underlying data

#### Scenario: Values are from official fixed scheme data
- **WHEN** financing amounts come directly from scheme records as fixed values
- **THEN** the system SHALL label them as "As per scheme guidelines" without the illustrative disclaimer

### Requirement: Integrate with project cost planner

The system SHALL read the total project cost from the project-cost-planner context when available.

#### Scenario: Project cost is available from planner
- **WHEN** the user has entered a project cost in the project cost planner
- **THEN** the system SHALL use that value as the total project cost in the breakdown

#### Scenario: Project cost is not available
- **WHEN** the user has not entered a project cost
- **THEN** the system SHALL prompt the user to enter a project cost before displaying the full breakdown
