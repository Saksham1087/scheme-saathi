## ADDED Requirements

### Requirement: Progress indicator display

The system SHALL display a progress indicator showing the number of documents ready out of total required.

#### Scenario: Progress with mix of ready and pending
- **WHEN** a user has some documents marked as ready and some as pending
- **THEN** the system SHALL display a progress indicator in the format "X/Y documents ready" with a visual progress bar showing the percentage complete

#### Scenario: All documents ready
- **WHEN** all required documents are marked as ready
- **THEN** the system SHALL display "All documents ready" with a completion indicator (e.g., checkmark or green bar at 100%)

#### Scenario: No documents ready
- **WHEN** no documents have been marked as ready
- **THEN** the system SHALL display "0/Y documents ready" with an empty progress bar and a prompt to begin preparing documents

### Requirement: Progress indicator position

The progress indicator SHALL be prominently placed for visibility.

#### Scenario: Progress indicator location
- **WHEN** the document checklist is displayed
- **THEN** the progress indicator SHALL appear at the top of the checklist, above the individual document items, as a sticky or fixed element that remains visible while scrolling through the list

### Requirement: Completion encouragement

The system SHALL encourage users to complete document preparation.

#### Scenario: Near-complete checklist
- **WHEN** the user has 80% or more of documents marked as ready
- **THEN** the system SHALL display an encouraging message such as "Almost there! Just X more document(s) to prepare"

#### Scenario: Checklist not started
- **WHEN** the user has not marked any documents as ready
- **THEN** the system SHALL display a helpful starting message encouraging document preparation before visiting a partner
