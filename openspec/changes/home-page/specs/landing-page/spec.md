## ADDED Requirements

### Requirement: Home Page Layout
The home page SHALL render a vertically stacked layout composed of Hero, HowItWorks, FeatureShowcase, PopularSchemes, FinancialLiteracy, FAQ, and TrustSection components.

#### Scenario: Page renders on desktop
- **WHEN** a user navigates to `/` on a desktop viewport (width >= 1024px)
- **THEN** the home page SHALL display all sections in a single-column layout with max-width container centered on the page

#### Scenario: Page renders on mobile
- **WHEN** a user navigates to `/` on a mobile viewport (width < 768px)
- **THEN** the home page SHALL display all sections in a single-column layout with full-width padding and appropriately sized typography

### Requirement: Navigation Bar
The home page SHALL include a responsive navigation bar at the top with the Scheme Sathi logo, navigation links, and a language selector.

#### Scenario: Desktop navigation
- **WHEN** the viewport width is >= 1024px
- **THEN** the navbar SHALL display all navigation links horizontally alongside the logo and language selector

#### Scenario: Mobile navigation
- **WHEN** the viewport width is < 768px
- **THEN** the navbar SHALL display the logo and a hamburger menu icon, and navigation links SHALL be hidden until the menu is opened

#### Scenario: Mobile menu toggle
- **WHEN** a user taps the hamburger menu icon on mobile
- **THEN** a slide-out or dropdown menu SHALL appear containing all navigation links and the language selector

### Requirement: Footer
The home page SHALL include a footer with site links, accessibility controls, and official attribution.

#### Scenario: Footer displays on all pages
- **WHEN** any page renders
- **THEN** the footer SHALL be visible at the bottom of the viewport containing navigation links, accessibility font-size controls, and trust attribution text

### Requirement: Responsive Design
All home page sections SHALL adapt their layout and typography based on viewport width using Tailwind CSS responsive utilities.

#### Scenario: Image and content sizing
- **WHEN** the viewport changes from desktop to mobile
- **THEN** images, cards, and text blocks SHALL resize proportionally and maintain readable line lengths (max 65ch for body text)

### Requirement: Accessibility
The home page SHALL meet WCAG 2.1 AA contrast requirements and support keyboard navigation.

#### Scenario: Keyboard navigation
- **WHEN** a user navigates using only the keyboard (Tab, Enter, Escape)
- **THEN** all interactive elements (links, buttons, menu toggles) SHALL be focusable and operable

#### Scenario: Screen reader support
- **WHEN** a screen reader processes the home page
- **THEN** all sections SHALL have appropriate heading hierarchy (h1 > h2 > h3) and ARIA landmarks
