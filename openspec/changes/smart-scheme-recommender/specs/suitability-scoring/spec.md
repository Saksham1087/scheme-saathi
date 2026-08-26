## ADDED Requirements

### Requirement: Weighted suitability scoring
The system SHALL compute a suitability score for each eligible scheme using weighted factors: income (20%), category (20%), purpose (20%), loan amount (20%), age (10%), location (10%).

#### Scenario: All factors match closely
- **WHEN** a user's profile closely matches all scheme parameters across all six weighted dimensions
- **THEN** the system SHALL compute a suitability score near the maximum (e.g., ≥ 90 out of 100)

#### Scenario: Some factors match, some do not
- **WHEN** a user matches on income and purpose (40% weight) but not on category or loan amount (40% weight)
- **WHEN** the user partially matches on age and location (10% weight each)
- **THEN** the system SHALL compute a weighted score reflecting the partial matches

### Requirement: Per-dimension scoring
The system SHALL compute a score for each individual dimension (income, category, purpose, loan amount, age, location) before applying the weighted combination.

#### Scenario: Income dimension scoring
- **WHEN** a scheme's income range is ₹1,00,000 – ₹5,00,000
- **WHEN** the user's income is ₹2,50,000 (within range, near midpoint)
- **THEN** the income dimension score SHALL be high (e.g., ≥ 80 out of 100)

#### Scenario: Income dimension scoring — out of range
- **WHEN** a scheme's income range is ₹1,00,000 – ₹5,00,000
- **WHEN** the user's income is ₹10,00,000
- **THEN** the income dimension score SHALL be low (e.g., ≤ 20 out of 100)

### Requirement: Match score display
The system SHALL display the final suitability score as an "Indicative matching score" and SHALL NOT present it as an approval or guarantee.

#### Scenario: Score is displayed to user
- **WHEN** the system computes a suitability score of 75 for a scheme
- **THEN** the UI SHALL display the score with a label such as "Indicative matching score: 75/100"
- **THEN** the UI SHALL include a disclaimer that this is indicative and not a guarantee of approval
