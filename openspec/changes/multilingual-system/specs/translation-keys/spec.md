## ADDED Requirements

### Requirement: Navigation Translation Keys
The system SHALL provide translation keys for all navigation elements including logo text, menu items, and action buttons.

#### Scenario: Nav keys present
- **WHEN** the en.json file is inspected
- **THEN** it SHALL contain keys for: `nav.home`, `nav.findScheme`, `nav.calculator`, `nav.partners`, `nav.about`, `nav.signIn`, `nav.language`

### Requirement: Home Page Translation Keys
The system SHALL provide translation keys for all home page sections: hero, how-it-works, features, popular schemes, FAQ, and trust section.

#### Scenario: Home hero keys
- **WHEN** the en.json file is inspected
- **THEN** it SHALL contain keys for: `home.hero.title`, `home.hero.subtitle`, `home.hero.cta`, `home.hero.secondaryCta`

#### Scenario: Home features keys
- **WHEN** the en.json file is inspected
- **THEN** it SHALL contain keys for: `home.features.smartMatching.title`, `home.features.smartMatching.description`, and similar keys for calculator, partnerLocator, voiceAssistant, and digiLocker

### Requirement: Scheme Explorer Translation Keys
The system SHALL provide translation keys for scheme listing, detail, search, and filter UI elements.

#### Scenario: Scheme listing keys
- **WHEN** the en.json file is inspected
- **THEN** it SHALL contain keys for: `schemes.listing.title`, `schemes.listing.noResults`, `schemes.listing.loading`, `schemes.listing.loadMore`

#### Scenario: Scheme detail keys
- **WHEN** the en.json file is inspected
- **THEN** it SHALL contain keys for: `schemes.detail.overview`, `schemes.detail.eligibility`, `schemes.detail.financialAssistance`, `schemes.detail.documents`, `schemes.detail.applicationProcess`, `schemes.detail.disclaimer`

### Requirement: Common/Shared Translation Keys
The system SHALL provide common translation keys for shared UI patterns.

#### Scenario: Common keys present
- **WHEN** the en.json file is inspected
- **THEN** it SHALL contain keys for: `common.loading`, `common.error`, `common.retry`, `common.save`, `common.cancel`, `common.submit`, `common.back`, `common.next`, `common.search`, `common.filter`, `common.sort`

### Requirement: Auth Translation Keys
The system SHALL provide translation keys for authentication-related UI strings.

#### Scenario: Auth keys present
- **WHEN** the en.json file is inspected
- **THEN** it SHALL contain keys for: `auth.signIn.title`, `auth.signIn.emailLabel`, `auth.signIn.passwordLabel`, `auth.signIn.submit`, `auth.signIn.google`, `auth.signIn.error`, `auth.signUp.title`, `auth.signUp.submit`

### Requirement: Accessibility Translation Keys
The system SHALL provide translation keys for accessibility control labels.

#### Scenario: Accessibility keys present
- **WHEN** the en.json file is inspected
- **THEN** it SHALL contain keys for: `accessibility.fontSize`, `accessibility.increaseFont`, `accessibility.decreaseFont`, `accessibility.highContrast`
