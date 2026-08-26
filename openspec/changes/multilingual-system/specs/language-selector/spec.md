## ADDED Requirements

### Requirement: Language Selector Component
The system SHALL provide a language selector component rendered in the header/navbar allowing users to switch between English, Hindi, and Marathi.

#### Scenario: Selector displays current language
- **WHEN** the language selector renders
- **THEN** it SHALL display the currently active language name in its native script (English, हिन्दी, or मराठी)

#### Scenario: Selector opens options
- **WHEN** a user clicks/taps the language selector
- **THEN** a dropdown or popover SHALL appear showing all three language options

#### Scenario: Language selection
- **WHEN** a user selects a different language from the dropdown
- **THEN** the dropdown SHALL close and the entire UI SHALL update to the selected language

### Requirement: Language Preference Persistence
The system SHALL persist the user's language selection in localStorage and, when authenticated, sync it to the Firebase user profile.

#### Scenario: Persistence to localStorage
- **WHEN** a user changes the language
- **THEN** the selected language code (en/hi/mr) SHALL be saved to localStorage under a defined key

#### Scenario: Restore from localStorage
- **WHEN** the application loads and a language preference exists in localStorage
- **THEN** the UI SHALL initialize in that language

#### Scenario: Sync to Firebase profile
- **WHEN** an authenticated user changes the language
- **THEN** the language field in their Firebase user document SHALL be updated to match

### Requirement: Language Selector Accessibility
The language selector SHALL be keyboard-accessible and announce language changes to screen readers.

#### Scenario: Keyboard operation
- **WHEN** a user navigates to the language selector using Tab key
- **THEN** the selector SHALL receive focus and be operable with Enter/Space to open and Arrow keys to navigate options

#### Scenario: Screen reader announcement
- **WHEN** a user changes the language
- **THEN** the screen reader SHALL announce the language change (e.g., "Language changed to Hindi")

### Requirement: Native Script Labels
Each language option in the selector SHALL display the language name in its own script rather than an English transliteration.

#### Scenario: Labels display correctly
- **WHEN** the language selector renders
- **THEN** the options SHALL show "English", "हिन्दी", and "मराठी" as their respective labels
