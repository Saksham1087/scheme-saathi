# Scheme Card

## Purpose

TBD - Define reusable SchemeCard component with content, match score display, click target, hover/focus effects, and responsive sizing.

## Requirements

### Requirement: Scheme Card Component
The system SHALL provide a reusable `SchemeCard` component for displaying scheme summaries in listing views.

#### Scenario: Card renders
- **WHEN** a SchemeCard receives scheme data as props
- **THEN** it SHALL display the scheme name, ministry, category badge, short description, and loan amount range

### Requirement: Card Content
Each scheme card SHALL display: scheme name (as title), ministry/department (as subtitle), category badge, short description (truncated to 2 lines), loan amount range, and an optional match score indicator.

#### Scenario: Full card content
- **WHEN** a scheme card renders with all data available
- **THEN** it SHALL show all content elements: name, ministry, category tag, truncated description, amount range (e.g., "Up to ₹10L"), and match score percentage

#### Scenario: Card without match score
- **WHEN** a scheme card renders without match score data
- **THEN** the match score indicator SHALL be hidden and the card layout SHALL adjust accordingly

### Requirement: Match Score Display
When available, the scheme card SHALL display a match score as a percentage with a visual indicator (colored ring or bar).

#### Scenario: High match score
- **WHEN** a scheme has a match score >= 80%
- **THEN** the match score indicator SHALL be green

#### Scenario: Medium match score
- **WHEN** a scheme has a match score between 50% and 79%
- **THEN** the match score indicator SHALL be yellow/amber

#### Scenario: Low match score
- **WHEN** a scheme has a match score < 50%
- **THEN** the match score indicator SHALL be gray or hidden

### Requirement: Card Click Target
The entire scheme card SHALL be a clickable element navigating to the scheme detail page.

#### Scenario: Card navigation
- **WHEN** a user clicks/taps anywhere on a scheme card
- **THEN** the user SHALL be navigated to `/schemes/:slug` for that scheme

#### Scenario: Card keyboard navigation
- **WHEN** a user presses Enter on a focused scheme card
- **THEN** the user SHALL be navigated to the scheme detail page

### Requirement: Card Hover/Focus Effect
Scheme cards SHALL display visual feedback on hover (desktop) and focus (keyboard navigation).

#### Scenario: Hover effect
- **WHEN** a user hovers over a scheme card on desktop
- **THEN** the card SHALL show a subtle elevation change (shadow increase or border highlight)

#### Scenario: Focus ring
- **WHEN** a user tabs to a scheme card
- **THEN** a visible focus ring SHALL appear around the card

### Requirement: Card Responsive Sizing
Scheme cards SHALL maintain consistent sizing within a grid and adapt to their container width.

#### Scenario: Equal height in grid
- **WHEN** multiple scheme cards are rendered in a grid
- **THEN** all cards in the same row SHALL have equal height

#### Scenario: Mobile single column
- **WHEN** rendered on mobile
- **THEN** scheme cards SHALL take full width with appropriate padding