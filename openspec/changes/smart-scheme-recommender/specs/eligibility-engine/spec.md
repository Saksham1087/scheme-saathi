## ADDED Requirements

### Requirement: Rule-based eligibility checking
The system SHALL evaluate each scheme against the user's assessment responses using a rule-based eligibility engine that checks income, age, category, state, occupation, education, and purpose.

#### Scenario: User meets all eligibility criteria
- **WHEN** a user's profile satisfies all eligibility rules for a scheme
- **THEN** the system SHALL mark the scheme as eligible for the user

#### Scenario: User fails one eligibility criterion
- **WHEN** a user's profile fails at least one eligibility rule for a scheme
- **THEN** the system SHALL mark the scheme as ineligible for the user
- **THEN** the system SHALL record which specific criterion was not met

### Requirement: Per-criterion evaluation
The system SHALL evaluate each eligibility dimension (income, age, category, state, occupation, education, purpose) independently and record pass/fail for each.

#### Scenario: User income is below scheme threshold
- **WHEN** a scheme requires annual income ≤ ₹5,00,000
- **WHEN** the user reports annual income of ₹3,00,000
- **THEN** the system SHALL pass the income criterion for that scheme

#### Scenario: User state does not match scheme availability
- **WHEN** a scheme is available only in Maharashtra
- **WHEN** the user selects their state as Gujarat
- **THEN** the system SHALL fail the state criterion for that scheme

### Requirement: Eligibility results feeding into scoring
The system SHALL pass eligibility results (pass/fail per criterion) to the suitability scoring module so that only eligible schemes receive a suitability score.

#### Scenario: Scheme is ineligible
- **WHEN** a scheme is marked ineligible based on eligibility rules
- **THEN** the system SHALL not compute a suitability score for that scheme
- **THEN** the system SHALL categorize the scheme under rejection results with the failing criterion

#### Scenario: Scheme is eligible
- **WHEN** a scheme passes all eligibility rules
- **THEN** the system SHALL pass the scheme to the suitability scoring module for score computation
