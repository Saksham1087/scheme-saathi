## Context

Scheme Sathi's primary users are SC beneficiaries who may be more comfortable with Hindi, Marathi, or regional languages. The PRD requires multilingual support as P0. Every UI string must use translation keys to enable seamless language switching. The system must be lightweight, performant, and integrate naturally with React.

## Goals / Non-Goals

**Goals:**
- Establish i18n infrastructure with react-i18next (or equivalent)
- Create a complete English translation key set covering all UI strings
- Provide Hindi and Marathi translations
- Build a language selector component with preference persistence
- Support language detection from browser/locale and user preference
- Store language preference in Firebase user profile and localStorage fallback

**Non-Goals:**
- Machine translation integration (all translations are manually curated)
- RTL language support (Hindi and Marathi are LTR)
- Dynamic translation loading from Firebase (static JSON files for MVP)
- Translating user-generated content or scheme data

## Decisions

- **Library:** react-i18next for mature React integration, namespace support, and lazy loading of translation bundles.
- **Translation Structure:** Flat JSON files per locale (`en.json`, `hi.json`, `mr.json`) in `src/locales/`. Key names follow dot notation: `home.hero.title`, `nav.findScheme`, etc.
- **Key Naming Convention:** Organized by feature area: `home.*`, `nav.*`, `schemes.*`, `common.*`, `auth.*`.
- **Language Selector:** Dropdown component in the header Navbar. Shows language name in its native script (English, हिन्दी, मराठी).
- **Persistence:** Language preference stored in localStorage for immediate effect, synced to Firebase user profile when authenticated.
- **Fallback:** English is the default/fallback language. Missing keys fall back to English.

## Risks / Trade-offs

- **Translation Completeness:** Hindi and Marathi translations may lag behind English keys. Use translation key display as fallback to surface untranslated strings.
- **Bundle Size:** Including all languages in the main bundle increases size. Use i18next lazy loading to load only the active language.
- **Consistency:** Keeping translations in sync across three languages requires discipline. CI lint step can flag missing keys.
