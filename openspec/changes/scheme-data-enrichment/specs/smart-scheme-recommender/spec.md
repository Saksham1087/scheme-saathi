## MODIFIED Requirements

### Requirement: Scheme eligibility checking
The eligibility engine SHALL check all fields present in a scheme's eligibilityRules against user input. When a field exists in rules but user hasn't provided data, the check SHALL fail (not skip). When a field doesn't exist in rules, the check SHALL pass (scheme is available to all).

#### Scenario: User state matches scheme states
- **WHEN** user selects state "Gujarat" AND scheme has `states: ["Gujarat", "Maharashtra"]`
- **THEN** eligibility check passes for state field

#### Scenario: User state doesn't match scheme states
- **WHEN** user selects state "Gujarat" AND scheme has `states: ["Maharashtra", "Karnataka"]`
- **THEN** eligibility check fails for state field

#### Scenario: Scheme has no state restriction
- **WHEN** user selects any state AND scheme has no `states` field
- **THEN** eligibility check passes for state field (scheme available nationwide)

#### Scenario: User category matches scheme categories
- **WHEN** user selects category "SC" AND scheme has `categories: ["SC", "ST"]`
- **THEN** eligibility check passes for category field

#### Scenario: User category doesn't match scheme categories
- **WHEN** user selects category "General" AND scheme has `categories: ["SC", "ST"]`
- **THEN** eligibility check fails for category field

#### Scenario: User income within scheme limit
- **WHEN** user income is ₹200,000 AND scheme has `maxIncome: 250000`
- **THEN** eligibility check passes for income field

#### Scenario: User income exceeds scheme limit
- **WHEN** user income is ₹300,000 AND scheme has `maxIncome: 250000`
- **THEN** eligibility check fails for income field

#### Scenario: User age within scheme range
- **WHEN** user age is 25 AND scheme has `minAge: 18, maxAge: 45`
- **THEN** eligibility check passes for age field

#### Scenario: User age outside scheme range
- **WHEN** user age is 50 AND scheme has `minAge: 18, maxAge: 45`
- **THEN** eligibility check fails for age field

#### Scenario: User purpose matches scheme purposes
- **WHEN** user purpose is "dairy" AND scheme has `purposes: ["dairy", "poultry"]`
- **THEN** eligibility check passes for purpose field

#### Scenario: User purpose doesn't match scheme purposes
- **WHEN** user purpose is "education" AND scheme has `purposes: ["dairy", "poultry"]`
- **THEN** eligibility check fails for purpose field

#### Scenario: User occupation matches scheme occupations
- **WHEN** user occupation is "Student" AND scheme has `occupations: ["Student", "Farmer"]`
- **THEN** eligibility check passes for occupation field

#### Scenario: User occupation doesn't match scheme occupations
- **WHEN** user occupation is "Salaried" AND scheme has `occupations: ["Student", "Farmer"]`
- **THEN** eligibility check fails for occupation field

### Requirement: Confidence score calculation
The confidence score SHALL reflect how many rule fields the user provided data for, weighted by field importance.

#### Scenario: High confidence match
- **WHEN** user provides all fields AND scheme has rules for all those fields
- **THEN** confidence score is 80-100%

#### Scenario: Medium confidence match
- **WHEN** user provides some fields AND scheme has rules for some
- **THEN** confidence score is 50-79%

#### Scenario: Low confidence match
- **WHEN** user provides few fields AND scheme has rules for many
- **THEN** confidence score is below 50%

### Requirement: Score weighting for new fields
The scoring engine SHALL weight all eligibility fields in match score calculation.

#### Scenario: Purpose matching contributes to score
- **WHEN** user purpose matches scheme purposes
- **THEN** purpose field contributes to match score with weight 0.18

#### Scenario: Occupation matching contributes to score
- **WHEN** user occupation matches scheme occupations
- **THEN** occupation field contributes to match score with weight 0.10

#### Scenario: State matching contributes to score
- **WHEN** user state matches scheme states
- **THEN** state field contributes to match score with weight 0.15

#### Scenario: Category matching contributes to score
- **WHEN** user category matches scheme categories
- **THEN** category field contributes to match score with weight 0.15

## ADDED Requirements

### Requirement: Filter by scheme level
The system SHALL distinguish between Central and State-level schemes.

#### Scenario: Central scheme availability
- **WHEN** scheme has `level: "Central"`
- **THEN** scheme is available to users in all states

#### Scenario: State scheme availability
- **WHEN** scheme has `level: "State"` and `states: ["Gujarat"]`
- **THEN** scheme is only available to users in Gujarat

### Requirement: Handle schemes with needsReview flag
The system SHALL handle schemes marked as needing review.

#### Scenario: Display schemes with needsReview
- **WHEN** scheme has `needsReview: true`
- **THEN** system displays scheme with lower confidence indicator
- **AND** shows "Eligibility details may vary" disclaimer
