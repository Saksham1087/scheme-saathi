## ADDED Requirements

### Requirement: Recommendation explanation
The system SHALL provide human-readable reasons explaining why each recommended scheme was matched for the user.

#### Scenario: Scheme recommended due to income and category match
- **WHEN** a scheme is recommended to the user
- **WHEN** the user's income and category matched the scheme's eligibility criteria
- **THEN** the system SHALL display explanation text such as "Recommended because: Your income falls within the eligible range and your category matches"

### Requirement: Rejection explanation
The system SHALL provide human-readable reasons explaining why each non-recommended scheme was rejected.

#### Scenario: Scheme rejected due to state mismatch
- **WHEN** a scheme is not recommended to the user
- **WHEN** the reason is that the scheme is not available in the user's state
- **THEN** the system SHALL display rejection text such as "Not available in your state"

#### Scenario: Scheme rejected due to income exceeding threshold
- **WHEN** a scheme requires income ≤ ₹3,00,000
- **WHEN** the user's income is ₹4,50,000
- **THEN** the system SHALL display rejection text such as "Your income (₹4,50,000) exceeds the scheme limit (₹3,00,000)"

### Requirement: Checkmark indicators for recommendations
The system SHALL display visual checkmark indicators next to each criterion that matched for a recommended scheme.

#### Scenario: Multiple criteria matched
- **WHEN** a scheme matches the user on income, category, and purpose
- **THEN** the UI SHALL display checkmark icons or indicators next to "Income", "Category", and "Purpose" for that scheme card

### Requirement: Explanation text consistency
The system SHALL use pre-defined explanation templates for all recommendation and rejection reasons to ensure consistent messaging.

#### Scenario: Income match explanation
- **WHEN** a scheme's income criterion passes for a user
- **THEN** the explanation text SHALL use the predefined template for income matches (not dynamically generated prose)
