# User Dashboard

## Purpose

TBD - Define the personal dashboard page at `/dashboard` serving as a central hub for user-saved and in-progress items.

## Requirements

### Requirement: Dashboard page at /dashboard
The system SHALL provide a personal dashboard page at `/dashboard` that serves as a central hub for all user-saved and in-progress items.

#### Scenario: Authenticated user accesses dashboard
- **WHEN** an authenticated user navigates to `/dashboard`
- **THEN** the system SHALL display a responsive grid layout with all dashboard sections populated with the user's data

#### Scenario: Unauthenticated user accesses dashboard
- **WHEN** an unauthenticated user navigates to `/dashboard`
- **THEN** the system SHALL redirect the user to the login page

### Requirement: Dashboard data aggregation
The system SHALL aggregate and display the user's saved schemes, saved partners, assessment history, document readiness, and application journeys.

#### Scenario: User has saved schemes
- **WHEN** the user has saved schemes in their profile
- **THEN** the dashboard SHALL display a "Saved Schemes" section listing all saved schemes with their names and status

#### Scenario: User has saved partners
- **WHEN** the user has saved partners in their profile
- **THEN** the dashboard SHALL display a "Saved Partners" section listing all saved partners with their names and locations

#### Scenario: User has assessment history
- **WHEN** the user has completed assessments
- **THEN** the dashboard SHALL display a "Recent Calculations" section and an "Assessment History" section with the most recent entries

### Requirement: Quick actions on dashboard
The system SHALL provide quick action CTAs on the dashboard to drive engagement.

#### Scenario: Dashboard displays quick actions
- **WHEN** the user views the dashboard
- **THEN** the system SHALL display quick action buttons for "Recalculate", "Find Partner", and "Start New Assessment"