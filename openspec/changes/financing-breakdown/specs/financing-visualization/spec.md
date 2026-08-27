## ADDED Requirements

### Requirement: Visual representation of financing split

The system SHALL provide a visual representation of the financing breakdown (scheme finance vs own contribution).

#### Scenario: Bar chart rendering
- **WHEN** the financing breakdown is displayed and the viewport supports chart rendering
- **THEN** the system SHALL render a horizontal or vertical bar chart showing scheme finance and own contribution as proportional segments of the total cost

#### Scenario: Table fallback
- **WHEN** chart rendering is unavailable or the user prefers tabular data
- **THEN** the system SHALL display a table with columns: Component, Amount (₹), Percentage (%)

### Requirement: Interactive visual elements

The visual representation SHALL support basic interaction for clarity.

#### Scenario: Hover/touch reveals details
- **WHEN** a user hovers over or taps a chart segment
- **THEN** the system SHALL display the exact amount and percentage for that segment in a tooltip or overlay

#### Scenario: Color differentiation
- **WHEN** the chart renders scheme finance and own contribution segments
- **THEN** the system SHALL use distinct, accessible colors (meeting WCAG 2.1 contrast requirements) and include a legend

### Requirement: Responsive visualization layout

The visualization SHALL adapt to different screen sizes.

#### Scenario: Desktop viewport
- **WHEN** the viewport width is 768px or greater
- **THEN** the chart and breakdown details SHALL display side by side or stacked with adequate spacing

#### Scenario: Mobile viewport
- **WHEN** the viewport width is less than 768px
- **THEN** the chart SHALL render at full width with the table below it, maintaining readability without horizontal scroll
