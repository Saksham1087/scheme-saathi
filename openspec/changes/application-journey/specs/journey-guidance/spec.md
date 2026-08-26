## ADDED Requirements

### Requirement: Step-specific guidance content
The system SHALL provide guidance content and actionable steps for each journey step to help users understand what to do next.

#### Scenario: User views a journey step
- **WHEN** the user views a specific step in the application journey
- **THEN** the system SHALL display guidance content describing what the step entails and what actions the user should take

#### Scenario: Step has associated actions
- **WHEN** a journey step has recommended actions (e.g., upload documents, find a partner)
- **THEN** the system SHALL display actionable CTAs that link to the relevant tools or pages

### Requirement: Integration with document checklist
The system SHALL integrate the document checklist step with the documents preparation step in the journey timeline.

#### Scenario: User reaches the documents prepared step
- **WHEN** the user advances to the "documents prepared" step
- **THEN** the system SHALL provide a CTA linking to the document checklist and display the user's document readiness status

### Requirement: Integration with partner locator
The system SHALL integrate the partner locator step with the partner identification step in the journey timeline.

#### Scenario: User reaches the partner identified step
- **WHEN** the user advances to the "partner identified" step
- **THEN** the system SHALL provide a CTA linking to the partner locator and display saved partners if any exist
