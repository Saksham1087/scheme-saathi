## ADDED Requirements

### Requirement: i18n Library Integration
The system SHALL integrate react-i18next (or equivalent) as the internationalization framework for all UI strings.

#### Scenario: i18n initialization
- **WHEN** the application boots
- **THEN** i18next SHALL be initialized with English as the default language and locale JSON files loaded from `src/locales/`

### Requirement: Translation Key System
All user-facing strings in the application SHALL be replaced with translation keys following dot-notation convention (e.g., `home.hero.title`, `nav.findScheme`).

#### Scenario: Hardcoded strings removed
- **WHEN** any component renders text to the user
- **THEN** the text SHALL be sourced from a translation key using the `useTranslation()` hook or `t()` function, not from a hardcoded string

### Requirement: Language Detection
The system SHALL detect the user's preferred language using the following priority order: (1) localStorage saved preference, (2) Firebase user profile language, (3) browser navigator.language, (4) default to English.

#### Scenario: First-time user
- **WHEN** a user visits the app for the first time with browser language set to Hindi
- **THEN** the UI SHALL display in Hindi

#### Scenario: Returning user with saved preference
- **WHEN** a user previously selected Marathi and returns to the app
- **THEN** the UI SHALL display in Marathi regardless of browser language

### Requirement: Language Switching
The system SHALL support switching between English, Hindi, and Marathi at runtime without page reload.

#### Scenario: Switch language
- **WHEN** a user selects a different language from the language selector
- **THEN** all UI text SHALL update to the selected language immediately

### Requirement: Locale File Structure
The system SHALL maintain separate JSON locale files at `src/locales/en.json`, `src/locales/hi.json`, and `src/locales/mr.json`.

#### Scenario: Locale file format
- **WHEN** a locale file is loaded
- **THEN** it SHALL be a flat or nested JSON object where keys map to translation strings

### Requirement: Fallback Language
English SHALL serve as the fallback language. If a translation key is missing in the active language, the English translation SHALL be displayed.

#### Scenario: Missing translation key
- **WHEN** a component references a key that exists in en.json but not in hi.json and the active language is Hindi
- **THEN** the English string for that key SHALL be displayed
