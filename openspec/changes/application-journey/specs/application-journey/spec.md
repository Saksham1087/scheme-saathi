## ADDED Requirements

### Requirement: 8-step visual timeline
The system SHALL provide an 8-step visual timeline on the `/application/:id` page that tracks application progress from scheme identification through decision.

#### Scenario: User views application journey
- **WHEN** the user navigates to `/application/:id` for a valid application
- **THEN** the system SHALL display a visual timeline with 8 steps: scheme identified, eligibility checked, documents prepared, partner identified, application started, application submitted, under review, decision

#### Scenario: Current step is highlighted
- **WHEN** the user views the application journey timeline
- **THEN** the system SHALL highlight the current step and visually distinguish completed steps from upcoming steps

#### Scenario: Application ID is invalid
- **WHEN** the user navigates to `/application/:id` with an invalid or non-existent application ID
- **THEN** the system SHALL display an error message and redirect to the dashboard

### Requirement: User-managed step progression
The system SHALL allow users to manually advance steps in the journey, as status is user-managed rather than automatically synced with government systems.

#### Scenario: User advances to next step
- **WHEN** the user completes an action for the current step and requests advancement
- **THEN** the system SHALL update the current step to the next step in the timeline and persist the change

#### Scenario: User is on the final step
- **WHEN** the user is on the "decision" step and the application is resolved
- **THEN** the system SHALL display the final outcome and disable further step progression
