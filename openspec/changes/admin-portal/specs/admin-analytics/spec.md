## ADDED Requirements

### Requirement: Analytics dashboard display
The system SHALL provide an analytics dashboard at `/admin` that displays key usage metrics and completion rates.

#### Scenario: Admin views analytics dashboard
- **WHEN** an admin navigates to the analytics section of the admin portal
- **THEN** the system SHALL display metrics including scheme searches, recommendations, no-match cases, calculator usage, partner searches, language usage, and user completion rate

### Requirement: Usage metrics tracking
The system SHALL track and display the following usage metrics: scheme searches, recommendations generated, no-match cases, calculator usage, partner searches, and language usage distribution.

#### Scenario: Scheme search metric is displayed
- **WHEN** the analytics dashboard loads
- **THEN** the system SHALL display the total count of scheme searches performed by users

#### Scenario: No-match cases are tracked
- **WHEN** a user search returns no matching schemes
- **THEN** the system SHALL increment the no-match counter and display it on the analytics dashboard

#### Scenario: Language usage distribution
- **WHEN** the analytics dashboard loads
- **THEN** the system SHALL display a breakdown of which languages users have selected

### Requirement: User completion rate
The system SHALL calculate and display the percentage of users who complete the full assessment and application journey.

#### Scenario: Completion rate is calculated
- **WHEN** the analytics dashboard loads
- **THEN** the system SHALL compute the completion rate as the ratio of users who reached the final journey step to total users who started an assessment
