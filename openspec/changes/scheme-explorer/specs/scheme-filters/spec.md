## ADDED Requirements

### Requirement: Filter Panel
The scheme listing page SHALL include a filter panel with the following filter dimensions: category, state, income range, loan amount, purpose, and education level.

#### Scenario: Filter panel present
- **WHEN** the scheme listing page loads
- **THEN** a filter panel SHALL be displayed (sidebar on desktop, bottom sheet or slide-out on mobile)

### Requirement: Category Filter
The category filter SHALL allow users to select one or more scheme categories.

#### Scenario: Category multi-select
- **WHEN** a user opens the category filter
- **THEN** checkboxes SHALL be displayed for: Business, Education, Agriculture, Transport, Housing, Health, Social Welfare, Employment

#### Scenario: Category applied
- **WHEN** a user selects "Education" and "Business" categories
- **THEN** the scheme list SHALL show only schemes in those categories

### Requirement: State Filter
The state filter SHALL allow users to filter schemes by Indian state.

#### Scenario: State selection
- **WHEN** a user opens the state filter
- **THEN** a searchable dropdown or multi-select SHALL display all Indian states and union territories

#### Scenario: State applied
- **WHEN** a user selects "Maharashtra"
- **THEN** the scheme list SHALL show only schemes available in Maharashtra

### Requirement: Income Range Filter
The income filter SHALL allow users to filter schemes based on annual household income ranges.

#### Scenario: Income slider or preset ranges
- **WHEN** a user opens the income filter
- **THEN** preset income ranges SHALL be available (e.g., "< ₹1L", "₹1-3L", "₹3-6L", "₹6-8L", "> ₹8L")

#### Scenario: Income filter applied
- **WHEN** a user selects "₹3-6L"
- **THEN** schemes requiring income within ₹3,00,000 to ₹6,00,000 SHALL be shown

### Requirement: Active Filter Display
Applied filters SHALL be displayed as removable tags/badges above the scheme list.

#### Scenario: Filter tags visible
- **WHEN** a user has applied category and state filters
- **THEN** filter tags for "Education", "Business", and "Maharashtra" SHALL be displayed with an X button to remove each

#### Scenario: Clear all filters
- **WHEN** a user clicks "Clear All" on the filter tags
- **THEN** all filters SHALL be removed and the full scheme list restored

### Requirement: Filter Mobile Layout
On mobile viewports, the filter panel SHALL be accessible via a "Filters" button that opens a bottom sheet or slide-out panel.

#### Scenario: Mobile filter access
- **WHEN** viewed on mobile and a user taps the "Filters" button
- **THEN** a bottom sheet or slide-out panel SHALL appear with all filter options

#### Scenario: Mobile filter apply
- **WHEN** a user applies filters in the mobile filter panel
- **THEN** the panel SHALL close and the scheme list SHALL update with the filtered results
