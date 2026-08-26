## ADDED Requirements

### Requirement: Side-by-side scheme comparison
The system SHALL allow users to compare 2-4 schemes side-by-side across all PRD comparison dimensions: purpose, eligibility, max assistance, interest, repayment, moratorium, own contribution, required documents, partner availability, and match score.

#### Scenario: User compares two schemes
- **WHEN** the user selects two schemes for comparison
- **THEN** the system SHALL display a comparison table with each scheme as a column and each dimension as a row

#### Scenario: User attempts to compare more than 4 schemes
- **WHEN** the user tries to add a fifth scheme to comparison
- **THEN** the system SHALL prevent the addition
- **THEN** the system SHALL display a message indicating the maximum of 4 schemes has been reached

### Requirement: Comparison dimensions coverage
The system SHALL include all PRD-specified dimensions in the comparison table: purpose, eligibility, max assistance, interest rate, repayment terms, moratorium period, own contribution, required documents, partner availability, and match score.

#### Scenario: Comparison table structure
- **WHEN** the user views the comparison page
- **THEN** the table SHALL include rows for each of the 10 comparison dimensions
- **THEN** each row SHALL show the corresponding value for each selected scheme

### Requirement: Missing data handling
The system SHALL gracefully handle schemes that do not have values for certain comparison dimensions.

#### Scenario: Scheme lacks a comparison value
- **WHEN** a scheme does not have a value for the "moratorium" dimension
- **THEN** the comparison table SHALL display "N/A" or a dash for that cell
- **THEN** the system SHALL not break the table layout
