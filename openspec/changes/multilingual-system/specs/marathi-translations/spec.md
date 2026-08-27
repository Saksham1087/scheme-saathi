## ADDED Requirements

### Requirement: Marathi Translation Coverage
The system SHALL provide Marathi translations for all English translation keys defined in the translation-keys specification.

#### Scenario: Complete Marathi coverage
- **WHEN** the mr.json file is compared against en.json
- **THEN** every key present in en.json SHALL have a corresponding Marathi translation in mr.json

### Requirement: Marathi Translation Quality
All Marathi translations SHALL use natural Marathi appropriate for beneficiaries in Maharashtra.

#### Scenario: Regional terminology
- **WHEN** a government scheme or program name is translated
- **THEN** the Marathi translation SHALL use Marathi terminology that is standard in Maharashtra government communications

### Requirement: Marathi Language Selector
The Marathi language option SHALL be labeled as "मराठी" in the language selector component.

#### Scenario: Language selector displays Marathi option
- **WHEN** a user opens the language selector
- **THEN** one of the options SHALL display "मराठी" as the label

### Requirement: Marathi Font Support
The application SHALL render Marathi text correctly using system fonts or web fonts that support Devanagari script.

#### Scenario: Marathi text renders
- **WHEN** the UI is set to Marathi
- **THEN** all Marathi text SHALL render without missing glyphs, tofu characters, or layout breaks
