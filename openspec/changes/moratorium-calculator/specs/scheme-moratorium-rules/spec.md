## ADDED Requirements

### Requirement: Per-scheme moratorium rules
The system SHALL apply moratorium rules specific to each scheme rather than using a default or assumed moratorium policy.

#### Scenario: Scheme A has interest-free moratorium
- **WHEN** scheme A's data specifies a 3-month interest-free moratorium
- **WHEN** the user selects scheme A for moratorium calculation
- **THEN** the system SHALL apply the 3-month interest-free rule from scheme A's data

#### Scenario: Scheme B has interest-accruing moratorium
- **WHEN** scheme B's data specifies a 6-month interest-accruing moratorium at the scheme's interest rate
- **WHEN** the user selects scheme B for moratorium calculation
- **THEN** the system SHALL apply the 6-month interest-accruing rule from scheme B's data

### Requirement: Moratorium rule data from scheme model
The system SHALL read moratorium parameters (duration in months, interest accrual yes/no, interest rate during moratorium) from the scheme data model.

#### Scenario: Scheme data includes moratorium fields
- **WHEN** a scheme record in the data model contains moratorium_duration_months, moratorium_interest_accrual, and moratorium_interest_rate fields
- **THEN** the system SHALL use these fields for moratorium calculations
- **THEN** the system SHALL not override them with default values

#### Scenario: Scheme data lacks moratorium fields
- **WHEN** a scheme record does not contain moratorium fields
- **THEN** the system SHALL assume no moratorium period (0 months)
- **THEN** the moratorium calculator SHALL not display moratorium-specific UI for that scheme
