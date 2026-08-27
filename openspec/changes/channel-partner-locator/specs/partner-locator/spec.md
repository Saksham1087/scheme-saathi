## ADDED Requirements

### Requirement: Partner listing page

The system SHALL provide a partner listing page at `/partners` displaying all available channel partners.

#### Scenario: User navigates to partners page
- **WHEN** a user navigates to `/partners`
- **THEN** the system SHALL display a list of channel partners with name, type, location, and supported schemes

#### Scenario: Partner data is available
- **WHEN** partner data exists in the system
- **THEN** the system SHALL display all partners with source attribution and last-updated date

#### Scenario: Partner data is unavailable
- **WHEN** no real partner data is available
- **THEN** the system SHALL display demo partner data with a clearly visible "Demo Data" label and a message indicating real data is pending

### Requirement: Map and list view toggle

The system SHALL support both map and list views for partner results.

#### Scenario: Default view on desktop
- **WHEN** the viewport width is 768px or greater
- **THEN** the system SHALL default to the map view with a sidebar list

#### Scenario: Default view on mobile
- **WHEN** the viewport width is less than 768px
- **THEN** the system SHALL default to the list view with an option to switch to map

#### Scenario: User toggles view
- **WHEN** a user clicks the map/list toggle button
- **THEN** the system SHALL switch between map and list views while preserving current filters and sort state

### Requirement: Partner card display

Each partner in the list SHALL be displayed as a card with key information.

#### Scenario: Partner card rendering
- **WHEN** partners are displayed in list view
- **THEN** each partner card SHALL show: partner name, partner type (e.g., PSB, RRB), location (city, state), distance (if user location available), number of supported schemes, and availability status
