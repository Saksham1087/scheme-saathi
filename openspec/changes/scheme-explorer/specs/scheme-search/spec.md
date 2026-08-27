## ADDED Requirements

### Requirement: Search Input
The scheme listing page SHALL include a search input field that allows users to search schemes by name, ministry, or purpose.

#### Scenario: Search input present
- **WHEN** the scheme listing page loads
- **THEN** a search input field SHALL be displayed at the top of the page with a search icon and placeholder text "Search schemes..."

#### Scenario: Search on type
- **WHEN** a user types in the search field
- **THEN** the scheme list SHALL filter in real-time (debounced by 300ms) to show only schemes matching the search text

### Requirement: Search Scope
Search SHALL match against scheme name, ministry name, department name, and purpose fields.

#### Scenario: Search by name
- **WHEN** a user types "mudra"
- **THEN** schemes with "mudra" in their name SHALL be displayed

#### Scenario: Search by ministry
- **WHEN** a user types "ministry of finance"
- **THEN** schemes under the Ministry of Finance SHALL be displayed

#### Scenario: Search by purpose
- **WHEN** a user types "business startup"
- **THEN** schemes with purpose related to business startup SHALL be displayed

### Requirement: Search Debouncing
The search input SHALL debounce user input by 300ms before executing the search query.

#### Scenario: Rapid typing
- **WHEN** a user types "mudra yojana" quickly
- **THEN** the search SHALL execute once after 300ms of inactivity, not on every keystroke

### Requirement: Search Results Feedback
The system SHALL provide visual feedback during search and display result counts.

#### Scenario: Search in progress
- **WHEN** a search query is being executed
- **THEN** a loading indicator SHALL be displayed near the search input

#### Scenario: Search results count
- **WHEN** search results are displayed
- **THEN** a count of matching schemes SHALL be shown (e.g., "12 schemes found")

### Requirement: Clear Search
The search input SHALL include a clear button to reset the search.

#### Scenario: Clear button visible
- **WHEN** a user has entered search text
- **THEN** a clear (X) button SHALL appear inside the search input

#### Scenario: Clear search
- **WHEN** a user clicks the clear button
- **THEN** the search text SHALL be cleared and the full scheme list SHALL be restored
