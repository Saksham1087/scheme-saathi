## ADDED Requirements

### Requirement: Responsive comparison table layout
The system SHALL display the comparison table responsively — full grid on desktop, horizontally scrollable with sticky scheme name column on mobile.

#### Scenario: Desktop view
- **WHEN** the user views the comparison on a desktop viewport (≥ 1024px)
- **THEN** the table SHALL display all schemes and dimensions in a full grid without horizontal scroll

#### Scenario: Mobile view
- **WHEN** the user views the comparison on a mobile viewport (< 768px)
- **THEN** the table SHALL scroll horizontally
- **THEN** the first column (dimension names) SHALL remain sticky/fixed during horizontal scroll

### Requirement: Difference highlighting
The system SHALL visually highlight differences between schemes in the comparison table to help users quickly identify distinguishing factors.

#### Scenario: Divergent values across schemes
- **WHEN** two schemes have different interest rates (e.g., 4% vs 8%)
- **THEN** the system SHALL visually distinguish the differing values (e.g., bold text, color, or icon)

#### Scenario: Identical values across schemes
- **WHEN** all compared schemes have the same value for a dimension
- **THEN** the system SHALL display the value without difference highlighting

### Requirement: Comparison page navigation
The system SHALL provide a dedicated comparison view at `/compare` or as a modal overlay, accessible from the comparison bar.

#### Scenario: User clicks Compare button
- **WHEN** the user clicks the "Compare" button in the comparison bar with 2+ schemes selected
- **THEN** the system SHALL navigate to or open the comparison view
- **THEN** the comparison view SHALL display the full comparison table
