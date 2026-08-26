## ADDED Requirements

### Requirement: Seed Data Scope
The system SHALL provide a curated dataset of at least 50 government schemes covering business, education, agriculture, transport, housing, health, social welfare, and employment categories.

#### Scenario: Minimum scheme count
- **WHEN** the seed data is loaded
- **THEN** it SHALL contain at least 50 unique scheme records

#### Scenario: Category coverage
- **WHEN** the seed data is analyzed by category
- **THEN** at least 5 schemes SHALL exist for each of the 8 primary categories

### Requirement: Scheme Data Quality
Each seed scheme SHALL include accurate, verified information sourced from official government websites.

#### Scenario: Official source required
- **WHEN** a scheme record is created in seed data
- **THEN** it SHALL include a valid `officialUrl` pointing to a government domain (.gov.in or similar)

#### Scenario: Verification status
- **WHEN** a scheme record is created in seed data
- **THEN** the `verified` field SHALL be true and `source` SHALL be 1 or 2

### Requirement: Seed Data File Format
Seed data SHALL be stored as JSON files in `src/data/schemes/` organized by category, with each file containing an array of scheme objects.

#### Scenario: File structure
- **WHEN** the `src/data/schemes/` directory is inspected
- **THEN** it SHALL contain files like `business.json`, `education.json`, `agriculture.json`, etc., each containing an array of Scheme objects

### Requirement: Seed Data Seeding Script
The system SHALL provide a script that imports the seed data JSON files into the Firestore `schemes` and `schemeRules` collections.

#### Scenario: Script execution
- **WHEN** the seeding script is run with valid Firebase credentials
- **THEN** all seed data schemes SHALL be created in Firestore with auto-generated IDs and corresponding eligibility rules

#### Scenario: Idempotent seeding
- **WHEN** the seeding script is run multiple times
- **THEN** it SHALL not create duplicate scheme records (use slug as unique key)

### Requirement: Scheme Slug Generation
Each seed scheme SHALL have a pre-generated URL-friendly slug derived from the scheme name.

#### Scenario: Slug format
- **WHEN** a scheme named "Pradhan Mantri Mudra Yojana" is seeded
- **THEN** its slug SHALL be `pradhan-mantri-mudra-yojana`

### Requirement: Seed Data Covers Key SC Schemes
The seed dataset SHALL include the most relevant schemes for SC beneficiaries as identified in the PRD.

#### Scenario: Key schemes present
- **WHEN** the seed data is reviewed
- **THEN** it SHALL include schemes such as: Stand-Up India, PM Mudra Yojana, National Scheduled Caste Finance Development Corporation schemes, Post-Matric Scholarship for SC, and other SC-focused welfare schemes
