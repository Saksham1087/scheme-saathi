## ADDED Requirements

### Requirement: Map rendering with partner markers

The system SHALL render an interactive map using React Leaflet with OpenStreetMap tiles showing partner locations.

#### Scenario: Map loads with partner markers
- **WHEN** the map view is active and partner data is loaded
- **THEN** the system SHALL display markers on the map at each partner's lat/lng coordinates with distinct markers per partner type

#### Scenario: Map tile loading failure
- **WHEN** OpenStreetMap tiles fail to load
- **THEN** the system SHALL display a fallback message and allow the user to switch to list view

### Requirement: Current location display

The system SHALL show the user's current location on the map when geolocation is available.

#### Scenario: Geolocation available and permitted
- **WHEN** the user grants geolocation permission
- **THEN** the system SHALL center the map on the user's location and display a distinct marker for it

#### Scenario: Geolocation denied or unavailable
- **WHEN** geolocation is denied or unavailable
- **THEN** the system SHALL center the map on the user's selected state/district or a default center, and allow manual location input

### Requirement: Marker interaction

Map markers SHALL support interaction for detail viewing.

#### Scenario: Marker click/tap
- **WHEN** a user clicks or taps a partner marker
- **THEN** the system SHALL display a popup with partner name, type, distance, and a "View Details" link to the partner detail page

#### Scenario: Cluster behavior
- **WHEN** multiple markers overlap at the current zoom level
- **THEN** the system SHALL cluster overlapping markers with a count indicator and expand on zoom

### Requirement: Map search and zoom

The system SHALL support map search and standard zoom controls.

#### Scenario: User searches location on map
- **WHEN** a user enters a location in the map search bar
- **THEN** the system SHALL pan the map to the searched location and update visible partner markers accordingly
