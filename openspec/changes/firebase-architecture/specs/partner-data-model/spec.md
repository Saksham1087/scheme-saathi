## ADDED Requirements

### Requirement: Partner Document Schema
The system SHALL define a Firestore `partners` collection document with the following fields: `id`, `name`, `type` (bank/NBFC/ngo/government), `address`, `state`, `district`, `pincode`, `geoLocation` (latitude, longitude), `phone`, `email`, `website`, `supportedSchemes` (array of scheme IDs), `availability` (hours, days), `rating`, `isActive`, `createdAt`, `updatedAt`.

#### Scenario: Partner document creation
- **WHEN** a new partner document is created
- **THEN** it SHALL contain all required fields with valid types and the `createdAt` and `updatedAt` timestamps SHALL be set

### Requirement: Partner Geo Location
Each partner SHALL have a `geoLocation` field with latitude and longitude for map-based partner discovery.

#### Scenario: Partner with location
- **WHEN** a partner is created with geo coordinates
- **THEN** the `geoLocation` field SHALL contain numeric latitude and longitude values within valid ranges (lat: -90 to 90, lng: -180 to 180)

#### Scenario: Partner without location
- **WHEN** a partner does not have physical location data
- **THEN** the `geoLocation` field SHALL be null and the partner SHALL still be queryable by state/district

### Requirement: Partner Scheme Associations
Each partner SHALL have a `supportedSchemes` array linking to scheme document IDs.

#### Scenario: Partner supports schemes
- **WHEN** a partner supports specific schemes
- **THEN** the `supportedSchemes` array SHALL contain valid scheme document IDs from the `schemes` collection

### Requirement: Partner Type Classification
Partners SHALL be classified by type: `bank`, `nbfc`, `ngo`, `government`.

#### Scenario: Valid partner type
- **WHEN** a partner is created
- **THEN** its `type` field SHALL be one of the valid enum values

### Requirement: Partner TypeScript Interface
The system SHALL provide a `Partner` TypeScript interface in `src/types/partner.ts` matching the Firestore document structure.

#### Scenario: Type safety
- **WHEN** a component imports the Partner type
- **THEN** all partner properties SHALL be correctly typed
