## Why

Scheme Sathi's primary users are SC beneficiaries who may be more comfortable with Hindi, Marathi, or regional languages. The PRD explicitly requires multilingual support as P0. Every UI string must use translation keys to enable seamless language switching.

## What Changes

- i18n infrastructure with translation key system
- English (en), Hindi (hi), Marathi (mr) translation files
- Language selector component in the header
- Language preference persistence in user profile
- All UI strings converted to translation keys
- Accessibility controls for font size and contrast

## Capabilities

### New Capabilities
- `i18n-infrastructure`: Translation key system, language detection, locale file loading, language switching
- `translation-keys`: Complete English translation key set covering all UI strings
- `hindi-translations`: Hindi translation coverage
- `marathi-translations`: Marathi translation coverage
- `language-selector`: Language selector component with persistence

### Modified Capabilities

(none)

## Impact

- `src/locales/en.json`, `src/locales/hi.json`, `src/locales/mr.json`
- `src/i18n/` configuration (if not already present)
- New dependency: `react-i18next` or similar i18n library
- All existing components need string extraction to translation keys
- Language preference stored in Firebase user profile or localStorage
