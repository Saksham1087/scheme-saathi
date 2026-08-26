## ADDED Requirements

### Requirement: How It Works Section
The home page SHALL include a "How It Works" section that displays a 5-step visual flow explaining the product journey from entry to scheme benefit.

#### Scenario: Step display
- **WHEN** a user views the How It Works section
- **THEN** five sequential steps SHALL be displayed with step numbers, icons, titles, and brief descriptions

### Requirement: Step Content
Each of the 5 steps SHALL convey one stage of the Scheme Sathi journey: (1) Tell us about yourself, (2) Get matched with schemes, (3) Understand eligibility, (4) Connect with a partner, (5) Apply and track.

#### Scenario: Step content renders
- **WHEN** the How It Works section loads
- **THEN** each step SHALL display a numeric indicator (1-5), a descriptive title, and a short paragraph explaining that step's action

### Requirement: Visual Flow Indicators
The How It Works section SHALL include visual connectors (arrows, lines, or progress indicators) between steps to indicate sequential flow.

#### Scenario: Desktop flow layout
- **WHEN** viewed on desktop (width >= 1024px)
- **THEN** the 5 steps SHALL be displayed horizontally with directional arrows or connectors between them

#### Scenario: Mobile flow layout
- **WHEN** viewed on mobile (width < 768px)
- **THEN** the 5 steps SHALL be displayed vertically with downward connectors between them

### Requirement: Step Translation
All How It Works step titles and descriptions SHALL use translation keys for multilingual support.

#### Scenario: Language switch
- **WHEN** a user changes the language from English to Hindi
- **THEN** all step titles and descriptions in the How It Works section SHALL update to Hindi text
