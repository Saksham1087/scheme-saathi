## ADDED Requirements

### Requirement: Add scheme to comparison
The system SHALL provide an "Add to comparison" action on scheme cards (in recommendation results and scheme explorer) that adds the scheme to the comparison list.

#### Scenario: User adds a scheme to comparison
- **WHEN** the user clicks "Add to comparison" on a scheme card
- **THEN** the system SHALL add the scheme to the comparison list
- **THEN** the comparison bar/toolbar SHALL update to show the newly added scheme

#### Scenario: User adds a scheme already in comparison
- **WHEN** the user clicks "Add to comparison" on a scheme already in the comparison list
- **THEN** the system SHALL not add a duplicate
- **THEN** the UI SHALL indicate the scheme is already selected (e.g., button state changes to "Added")

### Requirement: Remove scheme from comparison
The system SHALL allow users to remove schemes from the comparison list via the comparison bar or comparison page.

#### Scenario: User removes a scheme from comparison bar
- **WHEN** the user clicks the remove icon on a scheme in the comparison bar
- **THEN** the system SHALL remove the scheme from the comparison list
- **THEN** the comparison bar SHALL update to reflect the removal

#### Scenario: User removes the last scheme
- **WHEN** the user removes the last remaining scheme from comparison
- **THEN** the comparison bar SHALL hide or collapse

### Requirement: Comparison bar display
The system SHALL display a persistent comparison bar or toolbar showing the currently selected schemes and providing a "Compare" call-to-action.

#### Scenario: At least one scheme is selected
- **WHEN** the user has added one or more schemes to comparison
- **THEN** the comparison bar SHALL appear (e.g., fixed at bottom of screen)
- **THEN** the bar SHALL show thumbnails or names of selected schemes and a "Compare (N)" button
