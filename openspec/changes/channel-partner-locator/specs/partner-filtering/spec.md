## ADDED Requirements

### Requirement: Multi-facet filtering

The system SHALL support filtering partners by multiple facets simultaneously.

#### Scenario: Filter by scheme
- **WHEN** a user selects a specific scheme filter
- **THEN** the system SHALL display only partners that support the selected scheme

#### Scenario: Filter by partner type
- **WHEN** a user selects one or more partner types (e.g., PSB, RRB, NBFC-MFI)
- **THEN** the system SHALL display only partners matching the selected types

#### Scenario: Filter by state and district
- **WHEN** a user selects a state and/or district
- **THEN** the system SHALL display only partners within the selected geographic area

#### Scenario: Filter by distance
- **WHEN** a user sets a maximum distance radius
- **THEN** the system SHALL display only partners within that distance from the user's location, and hide this filter if geolocation is unavailable

#### Scenario: Filter by availability
- **WHEN** a user toggles the availability filter
- **THEN** the system SHALL display only currently available partners (if availability data exists)

#### Scenario: Combined filters
- **WHEN** a user applies multiple filters simultaneously
- **THEN** the system SHALL apply all filters with AND logic and display only partners matching every active filter

### Requirement: Filter state persistence

Filter state SHALL be preserved during a session.

#### Scenario: Filter state maintained across view toggle
- **WHEN** a user switches between map and list view
- **THEN** the system SHALL maintain all active filters and sort state

#### Scenario: Filter state maintained on navigation
- **WHEN** a user navigates to a partner detail page and returns to the list
- **THEN** the system SHALL restore the previously active filters

### Requirement: Clear and reset filters

Users SHALL be able to clear individual or all filters.

#### Scenario: Clear single filter
- **WHEN** a user clicks clear on an individual filter
- **THEN** the system SHALL remove that filter and update results immediately

#### Scenario: Reset all filters
- **WHEN** a user clicks "Reset All" or "Clear Filters"
- **THEN** the system SHALL remove all active filters and display the full partner list
