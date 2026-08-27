# Assessment Flow

## Purpose

TBD - Define multi-step assessment questionnaire with progress indicator, conversational mode, input validation, and history persistence.

## Requirements

### Requirement: Multi-step assessment questionnaire
The system SHALL present a 6-8 question multi-step assessment form to collect user profile information for scheme matching.

#### Scenario: User starts assessment
- **WHEN** the user navigates to the recommendation page
- **THEN** the system SHALL display the first question of the assessment with a progress indicator showing total steps

#### Scenario: User completes all questions
- **WHEN** the user answers all assessment questions
- **THEN** the system SHALL collect the responses and pass them to the eligibility engine for processing

### Requirement: Progress indicator
The system SHALL display a visual progress indicator showing the current step and total number of steps during the assessment flow.

#### Scenario: User is on step 3 of 7
- **WHEN** the user is answering the third question out of seven
- **THEN** the progress indicator SHALL show "3/7" or an equivalent visual representation

### Requirement: Conversational mode
The system SHALL support a conversational mode (Mode B) as an alternative to the standard form mode (Mode A) for completing the assessment.

#### Scenario: User selects conversational mode
- **WHEN** the user opts into conversational mode
- **THEN** the system SHALL present questions one at a time in a chat-like interface with contextual follow-up

#### Scenario: User selects form mode
- **WHEN** the user uses the default form mode
- **THEN** the system SHALL present questions in a multi-step form layout

### Requirement: Input validation
The system SHALL validate each assessment question before allowing the user to proceed to the next step.

#### Scenario: User leaves a required field empty
- **WHEN** the user attempts to proceed without answering a required question
- **THEN** the system SHALL display a validation error and prevent navigation to the next step

#### Scenario: User provides invalid input
- **WHEN** the user enters a value outside acceptable ranges (e.g., negative age)
- **WHEN** the user enters text in a numeric-only field
- **THEN** the system SHALL display a specific validation message indicating the expected input format

### Requirement: Assessment history persistence
The system SHALL save completed assessment responses to the user's Firebase profile.

#### Scenario: User completes assessment while logged in
- **WHEN** a logged-in user submits their assessment answers
- **THEN** the system SHALL persist the answers and timestamp to their Firebase user profile
- **THEN** the system SHALL make the saved assessment available on subsequent visits