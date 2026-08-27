## ADDED Requirements

### Requirement: Predefined cost categories
The system SHALL provide the following predefined project cost categories: Equipment, Raw Materials, Rent, Working Capital, and Other.

#### Scenario: Category dropdown populated
- **WHEN** the user adds a new line item
- **THEN** the category dropdown SHALL contain exactly: Equipment, Raw Materials, Rent, Working Capital, Other

#### Scenario: User selects a category
- **WHEN** the user selects "Equipment" from the category dropdown
- **THEN** the line item SHALL be tagged with the "Equipment" category
- **THEN** the category SHALL be saved as part of the line item data

### Requirement: Category as required field
The system SHALL require a category to be selected for each line item before it can be saved or contribute to the total.

#### Scenario: User leaves category empty
- **WHEN** the user adds a line item without selecting a category
- **THEN** the system SHALL display a validation error indicating category is required
- **THEN** the line item SHALL not be included in the running total until a category is selected

### Requirement: "Other" category for flexibility
The system SHALL include an "Other" category to accommodate project costs that do not fit the predefined categories.

#### Scenario: User selects "Other"
- **WHEN** the user's project cost does not fit Equipment, Raw Materials, Rent, or Working Capital
- **WHEN** the user selects "Other"
- **THEN** the system SHALL accept the line item with the "Other" category
- **THEN** the "Other" category SHALL function identically to other categories in calculations
