## ADDED Requirements

### Requirement: Principal vs interest visual breakdown
The system SHALL display a visual breakdown of the total repayment into principal and interest components after calculation.

#### Scenario: Visualization displayed
- **WHEN** the EMI calculation completes
- **THEN** the system SHALL display a chart (bar or pie) showing the proportion of principal vs interest in the total repayment

#### Scenario: Low interest scenario
- **WHEN** the total interest is small relative to principal (e.g., 5% of total)
- **THEN** the chart SHALL visually reflect the small interest proportion

#### Scenario: High interest scenario
- **WHEN** the total interest is large relative to principal (e.g., 60% of total)
- **THEN** the chart SHALL visually reflect the large interest proportion

### Requirement: Visual chart type
The system SHALL use a bar chart or pie chart to display the principal vs interest breakdown, rendered with a lightweight charting library already in the project dependencies.

#### Scenario: Chart renders on load
- **WHEN** the user views the calculator results
- **THEN** a bar or pie chart SHALL be rendered showing principal (one color) and interest (another color) with labels

### Requirement: Chart legend and labels
The system SHALL include a legend and data labels on the visualization to clearly identify principal and interest portions.

#### Scenario: User views chart
- **WHEN** the chart is displayed
- **THEN** the chart SHALL include a legend identifying which color represents principal and which represents interest
- **THEN** the chart SHALL display numeric values (amounts) as labels on or near the chart segments
