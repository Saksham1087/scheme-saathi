## ADDED Requirements

### Requirement: Journey state persistence
The system SHALL save the application journey state to the user's Firebase profile so users can resume where they left off across sessions and devices.

#### Scenario: User makes progress on journey
- **WHEN** the user advances a step or updates journey state
- **THEN** the system SHALL persist the updated journey state to the user's Firebase profile

#### Scenario: User returns to journey after closing the app
- **WHEN** the user navigates to `/application/:id` after a previous session
- **THEN** the system SHALL restore the journey state from Firebase and display the correct current step

#### Scenario: User is not authenticated
- **WHEN** an unauthenticated user attempts to access a journey
- **THEN** the system SHALL redirect to the login page and restore the journey state after successful authentication
