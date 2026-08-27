## ADDED Requirements

### Requirement: Minimum data completeness for eligibility
The system SHALL require schemes to have data in at least one key eligibility field (states, categories, or purposes) to be considered eligible for any user. Schemes with ALL three fields empty SHALL be marked ineligible with reason "insufficient_data".

#### Scenario: Scheme has no states, categories, or purposes
- **WHEN** a scheme's eligibilityRules has empty arrays for states, categories, AND purposes
- **THEN** the system SHALL mark the scheme as ineligible
- **THEN** the system SHALL record "insufficient_data" as the failure reason

#### Scenario: Scheme has states but no categories or purposes
- **WHEN** a scheme's eligibilityRules has states data but empty categories and purposes
- **THEN** the system SHALL evaluate eligibility based on available fields (states)
- **THEN** the system SHALL only skip category and purpose checks

### Requirement: State-specific eligibility enforcement
The system SHALL enforce state-specific eligibility: schemes with specific states ONLY match users in those states; schemes with "ALL" states match all users; schemes with empty states are ineligible (per minimum data requirement).

#### Scenario: Scheme available in specific state matches user in that state
- **WHEN** a scheme's eligibilityRules.states includes "Gujarat"
- **WHEN** the user's state is "Gujarat"
- **THEN** the system SHALL pass the state criterion

#### Scenario: Scheme available in specific state does NOT match user in different state
- **WHEN** a scheme's eligibilityRules.states includes "Maharashtra"
- **WHEN** the user's state is "Gujarat"
- **THEN** the system SHALL fail the state criterion
- **THEN** the scheme SHALL be marked ineligible

#### Scenario: All-India scheme matches any state
- **WHEN** a scheme's eligibilityRules.states includes "ALL"
- **WHEN** the user's state is any valid Indian state
- **THEN** the system SHALL pass the state criterion

#### Scenario: Scheme with empty states is ineligible
- **WHEN** a scheme's eligibilityRules.states is empty or missing
- **THEN** the system SHALL mark the scheme as ineligible per minimum data requirement

### Requirement: Gender-specific eligibility enforcement
The system SHALL enforce gender-specific eligibility: schemes with gender specified ONLY match users of that gender; schemes without gender specified match all genders.

#### Scenario: Women-only scheme matches female user
- **WHEN** a scheme's eligibilityRules.gender is "female"
- **WHEN** the user's gender is "female"
- **THEN** the system SHALL pass the gender criterion

#### Scenario: Women-only scheme does NOT match male user
- **WHEN** a scheme's eligibilityRules.gender is "female"
- **WHEN** the user's gender is "male"
- **THEN** the system SHALL fail the gender criterion
- **THEN** the scheme SHALL be marked ineligible

#### Scenario: Scheme without gender restriction matches any gender
- **WHEN** a scheme's eligibilityRules.gender is undefined or empty
- **WHEN** the user's gender is any value
- **THEN** the system SHALL pass the gender criterion

### Requirement: Disability-specific eligibility enforcement
The system SHALL enforce disability-specific eligibility: schemes with disabilityRequired=true ONLY match users with disability=true; schemes with disabilityRequired=false ONLY match users with disability=false; schemes without disability restriction match all users.

#### Scenario: Disability-required scheme matches disabled user
- **WHEN** a scheme's eligibilityRules.disabilityRequired is true
- **WHEN** the user's disability is true
- **THEN** the system SHALL pass the disability criterion

#### Scenario: Disability-required scheme does NOT match non-disabled user
- **WHEN** a scheme's eligibilityRules.disabilityRequired is true
- **WHEN** the user's disability is false
- **THEN** the system SHALL fail the disability criterion

#### Scenario: Non-disability scheme matches non-disabled user
- **WHEN** a scheme's eligibilityRules.disabilityRequired is false
- **WHEN** the user's disability is false
- **THEN** the system SHALL pass the disability criterion

#### Scenario: Scheme without disability restriction matches any disability status
- **WHEN** a scheme's eligibilityRules.disabilityRequired is undefined
- **WHEN** the user's disability is any value
- **THEN** the system SHALL pass the disability criterion

### Requirement: Accurate confidence calculation
The system SHALL calculate confidence based ONLY on fields that exist in the scheme data. Empty fields in scheme data SHALL NOT count toward total or matched fields.

#### Scenario: Confidence excludes empty scheme fields
- **WHEN** a scheme has states and categories but empty occupations, purposes, gender, disability
- **WHEN** the user provides state, category, occupation, purpose, gender, disability
- **THEN** confidence SHALL be calculated as (matched fields) / (fields with data in scheme)
- **THEN** empty scheme fields SHALL NOT inflate the confidence percentage

#### Scenario: Scheme with minimal data has lower confidence
- **WHEN** a scheme only has states and categories populated
- **WHEN** the user matches both states and categories
- **THEN** confidence SHALL be 100% (2/2 fields matched)
- **THEN** this is LOWER than a scheme with 5 fields matched out of 6 (83%)