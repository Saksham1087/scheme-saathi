## MODIFIED Requirements

### Requirement: Weighted suitability scoring
The system SHALL compute a suitability score for each eligible scheme using weighted factors: income (18%), category (18%), purpose (18%), loan amount (18%), age (8%), location (8%), gender (6%), disability (6%). Empty scheme fields receive penalty scores instead of perfect scores.

#### Scenario: All factors match closely
- **WHEN** a user's profile closely matches all scheme parameters across all eight weighted dimensions
- **THEN** the system SHALL compute a suitability score near the maximum (e.g., ≥ 90 out of 100)

#### Scenario: Some factors match, some do not
- **WHEN** a user matches on income and purpose (36% weight) but not on category or loan amount (36% weight)
- **WHEN** the user partially matches on age and location (16% weight)
- **THEN** the system SHALL compute a weighted score reflecting the partial matches

#### Scenario: Scheme with empty fields receives penalty scores
- **WHEN** a scheme has empty states, occupations, and purposes
- **WHEN** the user's profile would otherwise match
- **THEN** the system SHALL apply penalty scores: state=0.1, occupation=0.2, purpose=0.2
- **THEN** the final score SHALL be significantly lower than a complete scheme with same matches

### Requirement: Per-dimension scoring
The system SHALL compute a score for each individual dimension (income, category, purpose, loan amount, age, location, gender, disability) before applying the weighted combination. Empty scheme fields receive penalty scores.

#### Scenario: Income dimension scoring
- **WHEN** a scheme's income range is ₹1,00,000 – ₹5,00,000
- **WHEN** the user's income is ₹2,50,000 (within range, near midpoint)
- **THEN** the income dimension score SHALL be high (e.g., ≥ 80 out of 100)

#### Scenario: Income dimension scoring — out of range
- **WHEN** a scheme's income range is ₹1,00,000 – ₹5,00,000
- **WHEN** the user's income is ₹10,00,000
- **THEN** the income dimension score SHALL be low (e.g., ≤ 20 out of 100)

#### Scenario: Empty income field gets penalty score
- **WHEN** a scheme has no maxIncome or minIncome specified
- **THEN** the income dimension score SHALL be 0.5 (penalty)

#### Scenario: Location dimension scoring — state match
- **WHEN** a scheme's eligibilityRules.states includes the user's state
- **THEN** the location dimension score SHALL be 1.0

#### Scenario: Location dimension scoring — state mismatch
- **WHEN** a scheme's eligibilityRules.states does NOT include the user's state
- **THEN** the location dimension score SHALL be 0.0

#### Scenario: Empty location field gets penalty score
- **WHEN** a scheme has no states specified
- **THEN** the location dimension score SHALL be 0.1 (penalty)

#### Scenario: Gender dimension scoring — match
- **WHEN** a scheme's eligibilityRules.gender matches the user's gender
- **THEN** the gender dimension score SHALL be 1.0

#### Scenario: Gender dimension scoring — mismatch
- **WHEN** a scheme's eligibilityRules.gender does NOT match the user's gender
- **THEN** the gender dimension score SHALL be 0.0

#### Scenario: Empty gender field gets penalty score
- **WHEN** a scheme has no gender restriction
- **THEN** the gender dimension score SHALL be 0.3 (penalty)

#### Scenario: Disability dimension scoring — match
- **WHEN** a scheme's eligibilityRules.disabilityRequired matches the user's disability status
- **THEN** the disability dimension score SHALL be 1.0

#### Scenario: Disability dimension scoring — mismatch
- **WHEN** a scheme's eligibilityRules.disabilityRequired does NOT match the user's disability status
- **THEN** the disability dimension score SHALL be 0.0

#### Scenario: Empty disability field gets penalty score
- **WHEN** a scheme has no disability restriction
- **THEN** the disability dimension score SHALL be 0.3 (penalty)

### Requirement: Match score display
The system SHALL display the final suitability score as an "Indicative matching score" and SHALL NOT present it as an approval or guarantee.

#### Scenario: Score is displayed to user
- **WHEN** the system computes a suitability score of 75 for a scheme
- **THEN** the UI SHALL display the score with a label such as "Indicative matching score: 75/100"
- **THEN** the UI SHALL include a disclaimer that this is indicative and not a guarantee of approval