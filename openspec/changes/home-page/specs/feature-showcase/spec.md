## ADDED Requirements

### Requirement: Feature Showcase Section
The home page SHALL include a feature showcase section displaying cards for each core product feature.

#### Scenario: Feature cards display
- **WHEN** a user scrolls to the feature showcase section
- **THEN** feature cards SHALL be visible for: Smart Matching, Financial Calculator, Partner Locator, Voice Assistant, and DigiLocker

### Requirement: Feature Card Content
Each feature card SHALL display a feature icon, title, short description, and a call-to-action link or button.

#### Scenario: Card renders with all elements
- **WHEN** a feature card loads
- **THEN** it SHALL contain an icon/image, a title (e.g., "Smart Matching"), a 1-2 sentence description, and a CTA (e.g., "Try Now", "Learn More")

### Requirement: Feature Card Layout
Feature cards SHALL be displayed in a responsive grid that adapts from multi-column on desktop to single-column on mobile.

#### Scenario: Desktop grid
- **WHEN** viewed on desktop (width >= 1024px)
- **THEN** feature cards SHALL be arranged in a grid of 3 columns with consistent spacing

#### Scenario: Tablet grid
- **WHEN** viewed on tablet (width >= 768px and < 1024px)
- **THEN** feature cards SHALL be arranged in a grid of 2 columns

#### Scenario: Mobile grid
- **WHEN** viewed on mobile (width < 768px)
- **THEN** feature cards SHALL be stacked in a single column

### Requirement: Feature Card Interaction
Feature cards SHALL be interactive, responding to hover/focus with a visual highlight effect.

#### Scenario: Hover effect on desktop
- **WHEN** a user hovers over a feature card on desktop
- **THEN** the card SHALL display a subtle elevation change (shadow or border highlight)

#### Scenario: Focus effect for keyboard users
- **WHEN** a user tabs to a feature card
- **THEN** the card SHALL display a visible focus ring indicator

### Requirement: Feature Card Translation
All feature card titles, descriptions, and CTA text SHALL use translation keys.

#### Scenario: Language switch
- **WHEN** a user changes the language to Marathi
- **THEN** all feature card text SHALL update to Marathi while maintaining layout
