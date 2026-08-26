## ADDED Requirements

### Requirement: No-match explanation
The system SHALL display a clear explanation when no schemes match the user's profile after the assessment.

#### Scenario: Zero eligible schemes
- **WHEN** the eligibility engine finds no schemes matching the user's criteria
- **THEN** the system SHALL display a message explaining that no exact matches were found
- **THEN** the system SHALL not display an empty results page

### Requirement: Alternative suggestions
The system SHALL provide alternative suggestions when no exact matches are found, such as schemes in nearby categories, relaxed location requirements, or general-purpose schemes.

#### Scenario: No match due to state restriction
- **WHEN** no schemes are available in the user's state
- **THEN** the system SHALL suggest national schemes or schemes available in nearby states

#### Scenario: No match due to income range
- **WHEN** no schemes match the user's income level
- **THEN** the system SHALL suggest schemes with adjacent income ranges or general welfare schemes

### Requirement: Relaxed criteria fallback
The system SHALL optionally re-run matching with relaxed eligibility criteria (e.g., ignoring state or occupation constraints) to surface near-miss schemes.

#### Scenario: Near-miss schemes exist
- **WHEN** strict eligibility yields zero matches
- **WHEN** relaxing the state criterion yields 3 eligible schemes
- **THEN** the system SHALL present these as "nearby options" with a note that location requirements may differ
