## ADDED Requirements

### Requirement: Hindi Translation Coverage
The system SHALL provide Hindi translations for all English translation keys defined in the translation-keys specification.

#### Scenario: Complete Hindi coverage
- **WHEN** the hi.json file is compared against en.json
- **THEN** every key present in en.json SHALL have a corresponding Hindi translation in hi.json

### Requirement: Hindi Translation Quality
All Hindi translations SHALL use natural, colloquial Hindi appropriate for SC beneficiaries with limited formal education.

#### Scenario: Technical terms
- **WHEN** a scheme name or government term is translated
- **THEN** the Hindi translation SHALL use commonly understood Hindi equivalents rather than literal word-for-word translations

### Requirement: Hindi Language Selector
The Hindi language option SHALL be labeled as "हिन्दी" in the language selector component.

#### Scenario: Language selector displays Hindi option
- **WHEN** a user opens the language selector
- **THEN** one of the options SHALL display "हिन्दी" as the label

### Requirement: Hindi Font Support
The application SHALL render Hindi text correctly using system fonts or web fonts that support Devanagari script.

#### Scenario: Hindi text renders
- **WHEN** the UI is set to Hindi
- **THEN** all Hindi text SHALL render without missing glyphs, tofu characters, or layout breaks
