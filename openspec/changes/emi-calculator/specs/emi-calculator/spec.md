## ADDED Requirements

### Requirement: EMI calculation
The system SHALL calculate monthly EMI using the standard formula: P × r × (1+r)^n / [(1+r)^n − 1], where P is principal, r is monthly interest rate, and n is tenure in months.

#### Scenario: Standard EMI calculation
- **WHEN** the user enters loan amount ₹5,00,000, interest rate 8% per annum, and tenure 60 months
- **THEN** the system SHALL compute and display the monthly EMI (approximately ₹10,133)

#### Scenario: Zero interest rate
- **WHEN** the user enters an interest rate of 0%
- **THEN** the system SHALL compute EMI as loan amount divided by tenure (simple division)

### Requirement: Input fields
The system SHALL accept the following inputs: loan amount, annual interest rate, tenure in months, and moratorium period in months.

#### Scenario: User enters all inputs
- **WHEN** the user provides loan amount, interest rate, tenure, and moratorium period
- **THEN** the system SHALL use all four values in the EMI calculation

#### Scenario: User omits moratorium period
- **WHEN** the user does not enter a moratorium period
- **THEN** the system SHALL default the moratorium period to 0 months

### Requirement: Output display
The system SHALL display the following outputs after calculation: monthly EMI amount, total principal, total interest payable, and total repayment amount.

#### Scenario: Output values shown
- **WHEN** the EMI calculation completes
- **THEN** the system SHALL display: monthly EMI, total principal (loan amount), total interest (total repayment minus principal), and total repayment (EMI × effective tenure)

### Requirement: Input validation
The system SHALL validate all inputs before performing the calculation.

#### Scenario: Negative loan amount
- **WHEN** the user enters a negative loan amount
- **THEN** the system SHALL display a validation error and prevent calculation

#### Scenario: Zero tenure
- **WHEN** the user enters a tenure of 0 months
- **THEN** the system SHALL display a validation error and prevent calculation

#### Scenario: Negative interest rate
- **WHEN** the user enters a negative interest rate
- **THEN** the system SHALL display a validation error and prevent calculation

### Requirement: Disclaimer display
The system SHALL display a visual disclaimer stating "This is an illustrative calculation" prominently near the calculator output.

#### Scenario: Disclaimer is visible
- **WHEN** the calculator displays results
- **THEN** the disclaimer SHALL be visible above or below the output section
- **THEN** the disclaimer SHALL not be dismissible or hidden

### Requirement: Calculation history persistence
The system SHALL save calculation inputs and results to the user's Firebase profile for logged-in users.

#### Scenario: Logged-in user calculates EMI
- **WHEN** a logged-in user performs an EMI calculation
- **THEN** the system SHALL save the inputs (loan amount, rate, tenure, moratorium) and outputs (EMI, total interest, total repayment) with a timestamp to the user profile

### Requirement: Responsive slider and input
The system SHALL provide both slider and numeric input for loan amount, interest rate, and tenure, with bidirectional synchronization.

#### Scenario: User adjusts slider
- **WHEN** the user moves the loan amount slider to ₹7,00,000
- **THEN** the numeric input field for loan amount SHALL update to ₹7,00,000

#### Scenario: User types in input field
- **WHEN** the user types ₹3,50,000 in the loan amount input field
- **THEN** the slider position SHALL update to reflect ₹3,50,000
