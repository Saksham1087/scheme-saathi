## ADDED Requirements

### Requirement: Ranked scheme recommendations
The system SHALL sort eligible schemes by suitability score in descending order and present the top results to the user.

#### Scenario: Multiple eligible schemes exist
- **WHEN** the eligibility engine identifies 12 eligible schemes
- **WHEN** the suitability scoring module computes scores for all 12
- **THEN** the system SHALL rank schemes from highest to lowest score
- **THEN** the system SHALL present 5-10 top results to the user

### Requirement: Recommendation card display
The system SHALL display each recommended scheme as a card containing the scheme name, match score, key eligibility details, and explanation text.

#### Scenario: User views recommendation results
- **WHEN** the system returns ranked recommendations
- **THEN** each scheme card SHALL display: scheme name, indicative matching score, match reason indicators, and a brief scheme description

### Requirement: Score-based prioritization
The system SHALL prioritize schemes with higher suitability scores in the display order, with the highest-scoring scheme shown first.

#### Scenario: Score ordering
- **WHEN** scheme A scores 85, scheme B scores 92, and scheme C scores 78
- **THEN** the display order SHALL be scheme B (92), scheme A (85), scheme C (78)
