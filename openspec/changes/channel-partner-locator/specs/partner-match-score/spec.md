## ADDED Requirements

### Requirement: Weighted match score calculation

The system SHALL compute a partner match score using the following weighted formula: scheme compatibility 40%, location proximity 25%, loan category match 20%, distance 10%, availability 5%.

#### Scenario: Score calculation with all factors available
- **WHEN** a partner has data for all scoring factors
- **THEN** the system SHALL calculate the composite score as a weighted sum of all five factors, normalized to 0-100

#### Scenario: Score calculation with missing factors
- **WHEN** a partner is missing data for one or more scoring factors
- **THEN** the system SHALL redistribute the missing factor's weight proportionally among available factors and note the reduced confidence

### Requirement: Scheme compatibility scoring

The scheme compatibility factor SHALL measure how well a partner supports the user's target scheme.

#### Scenario: Partner supports the target scheme
- **WHEN** a partner directly supports the user's selected scheme
- **THEN** the scheme compatibility factor SHALL receive a high score (80-100)

#### Scenario: Partner supports similar schemes
- **WHEN** a partner does not support the target scheme but supports schemes in the same category
- **THEN** the scheme compatibility factor SHALL receive a moderate score (40-79)

#### Scenario: Partner does not support the scheme or similar schemes
- **WHEN** a partner has no related scheme support
- **THEN** the scheme compatibility factor SHALL receive a low score (0-39)

### Requirement: Score display

Match scores SHALL be displayed to users in an understandable format.

#### Scenario: Score shown on partner card
- **WHEN** partners are displayed in list or map view
- **THEN** each partner card SHALL show the match score as a percentage or "X/100" with a qualitative label (Excellent, Good, Fair, Poor)

#### Scenario: Score shown on partner detail
- **WHEN** a user views a partner detail page
- **THEN** the system SHALL display the full score breakdown by factor with individual scores and weights
