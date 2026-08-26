## ADDED Requirements

### Requirement: Visual moratorium timeline
The system SHALL display a visual timeline showing the moratorium phase and the repayment phase as distinct segments.

#### Scenario: Timeline with moratorium period
- **WHEN** a scheme has a 6-month moratorium and 60-month repayment
- **THEN** the timeline SHALL show a "Moratorium" segment (6 months) followed by a "Repayment" segment (60 months)
- **THEN** the timeline SHALL be proportionally scaled or labeled to reflect the relative durations

### Requirement: Timeline key milestones
The system SHALL mark key milestones on the timeline: disbursement date, moratorium end / repayment start, and final repayment date.

#### Scenario: Timeline milestones displayed
- **WHEN** the user views the moratorium timeline
- **THEN** the timeline SHALL display markers or labels for: disbursement, repayment start, and final payment
- **THEN** each milestone SHALL show the estimated date or month

### Requirement: Timeline color coding
The system SHALL use distinct colors or visual styling to differentiate the moratorium phase from the repayment phase.

#### Scenario: Color distinction
- **WHEN** the timeline is rendered
- **THEN** the moratorium phase SHALL use one color (e.g., blue or grey)
- **THEN** the repayment phase SHALL use another color (e.g., green)
- **THEN** a legend or inline label SHALL identify each phase
