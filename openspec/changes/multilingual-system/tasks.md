## 1. i18n Infrastructure Setup

- [x] 1.1 Install `react-i18next` and `i18next` dependencies
- [x] 1.2 Create `src/i18n/index.ts` with i18n instance configuration
- [x] 1.3 Configure English as default/fallback language
- [x] 1.4 Set up language detection from browser locale and localStorage
- [x] 1.5 Configure lazy loading of translation bundles per language

## 2. Translation Files

- [x] 2.1 Create `src/locales/en.json` with complete English translation key set
- [x] 2.2 Define key naming convention organized by feature: `home.*`, `nav.*`, `schemes.*`, `common.*`, `auth.*`
- [x] 2.3 Create `src/locales/hi.json` with Hindi translations
- [x] 2.4 Create `src/locales/mr.json` with Marathi translations
- [x] 2.5 Verify all three locale files have identical top-level key structures

## 3. Language Selector Component

- [x] 3.1 Create `src/components/LanguageSelector.tsx` dropdown component
- [x] 3.2 Display language names in native script (English, हिन्दी, मराठी)
- [x] 3.3 Integrate language selector into the Navbar header
- [x] 3.4 Store selected language in localStorage on change
- [x] 3.5 Sync language preference to Firebase user profile when authenticated
- [x] 3.6 On app load, read preference from localStorage first, then Firebase, then browser locale

## 4. Component String Extraction

- [x] 4.1 Audit all existing components for hardcoded UI strings
- [x] 4.2 Replace hardcoded strings in Navbar/Footer with `t('nav.*')` calls
- [x] 4.3 Replace hardcoded strings in Home page sections with `t('home.*')` calls
- [x] 4.4 Replace hardcoded strings in auth-related components with `t('auth.*')` calls
- [x] 4.5 Add `useTranslation` hook to all components with user-facing strings
- [x] 4.6 Verify all new components use translation keys instead of hardcoded strings

## 5. Accessibility Controls

- [x] 5.1 Add font size adjustment controls (small/medium/large) persisted in localStorage
- [x] 5.2 Add high-contrast mode toggle persisted in localStorage
- [x] 5.3 Apply font size classes to root element based on preference
- [x] 5.4 Apply contrast mode styles via CSS class toggling on body
- [x] 5.5 Integrate accessibility controls into Footer component

## 6. Verification & Testing

- [x] 6.1 Test language switching updates all visible strings without page reload
- [x] 6.2 Test language preference persists across page refreshes
- [x] 6.3 Verify missing translation keys fall back to English
- [x] 6.4 Verify no hardcoded strings remain in components (grep audit)
- [x] 6.5 Test font size and contrast controls apply correctly
