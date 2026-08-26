## ADDED Requirements

### Requirement: Partner detail page

The system SHALL provide a partner detail page at `/partners/:id` with comprehensive partner information.

#### Scenario: User navigates to partner detail
- **WHEN** a user navigates to `/partners/:id` with a valid partner ID
- **THEN** the system SHALL display the partner's full profile including name, type, address, contact information, and supported schemes

#### Scenario: Invalid partner ID
- **WHEN** a user navigates to `/partners/:id` with an invalid or non-existent partner ID
- **THEN** the system SHALL display a "Partner not found" message with a link back to the partner list

### Requirement: Partner contact information

The partner detail page SHALL display contact information.

#### Scenario: Contact details available
- **WHEN** the partner record contains phone, email, or office address
- **THEN** the system SHALL display the available contact details with appropriate icons and labels

#### Scenario: Contact details unavailable
- **WHEN** the partner record does not contain contact details
- **THEN** the system SHALL display "Contact information not available" and suggest checking the official partner directory

### Requirement: Supported schemes listing

The partner detail page SHALL list all schemes supported by the partner.

#### Scenario: Scheme list displayed
- **WHEN** the partner supports one or more schemes
- **THEN** the system SHALL display each supported scheme as a card with scheme name, category, and a link to the scheme detail page

#### Scenario: Scheme eligibility context
- **WHEN** the user arrived via "Find Partner" for a specific scheme
- **THEN** the system SHALL highlight the target scheme in the supported schemes list and show the match score for that scheme

### Requirement: Partner availability display

The partner detail page SHALL show availability information when available.

#### Scenario: Availability data present
- **WHEN** the partner record contains availability or working hours data
- **THEN** the system SHALL display the availability status and hours

#### Scenario: No availability data
- **WHEN** the partner record does not contain availability information
- **THEN** the system SHALL display "Availability information not available" and suggest calling the partner directly
