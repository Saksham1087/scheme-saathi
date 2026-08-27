## ADDED Requirements

### Requirement: Pass total to recommendation engine
The system SHALL pass the project cost planner's total directly to the recommendation engine as the project cost input for scheme matching.

#### Scenario: User completes planner and proceeds to recommendations
- **WHEN** the user has a project cost total of ₹8,00,000 from the planner
- **WHEN** the user proceeds to scheme recommendations
- **THEN** the recommendation engine SHALL receive ₹8,00,000 as the project cost
- **THEN** the eligibility engine SHALL use this value to match against schemes with compatible loan/assistance amounts

### Requirement: Total integration with assessment
The system SHALL integrate the planner total into the assessment flow so that the project cost field in the assessment is auto-filled with the planner's total.

#### Scenario: Planner total auto-fills assessment
- **WHEN** the user completes the planner with a total of ₹8,00,000
- **WHEN** the planner is accessed from the assessment flow
- **THEN** the project cost field in the assessment SHALL be auto-filled with ₹8,00,000
- **THEN** the user SHALL be able to manually override the auto-filled value

### Requirement: Manual project cost entry
The system SHALL allow users to enter a project cost manually without using the planner, as an alternative path.

#### Scenario: User types project cost directly
- **WHEN** the user is on the assessment flow and types a project cost of ₹5,00,000 directly into the project cost field
- **THEN** the system SHALL accept the manual entry
- **THEN** the planner link SHALL remain available as an alternative

#### Scenario: User uses planner after manual entry
- **WHEN** the user has manually entered ₹5,00,000 and then opens the planner
- **WHEN** the planner calculates a total of ₹8,00,000
- **THEN** the manual entry SHALL be replaced with the planner total of ₹8,00,000
