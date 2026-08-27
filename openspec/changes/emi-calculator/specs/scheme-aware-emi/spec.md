## ADDED Requirements

### Requirement: Scheme-aware auto-population
The system SHALL support auto-populating the EMI calculator with parameters from a selected scheme when accessed via the "Calculate My EMI" CTA on a scheme detail page.

#### Scenario: User clicks "Calculate My EMI" on scheme page
- **WHEN** the user clicks the "Calculate My EMI" CTA on a scheme detail page
- **THEN** the system SHALL navigate to `/calculator`
- **THEN** the system SHALL pre-fill the loan amount (scheme max or typical), interest rate, and tenure from the scheme's parameters

#### Scenario: Scheme has interest rate range
- **WHEN** a scheme specifies an interest rate range (e.g., 6%–10%)
- **THEN** the system SHALL auto-fill with the minimum interest rate in the range
- **THEN** the system SHALL allow the user to adjust within the valid range

#### Scenario: Scheme has loan amount range
- **WHEN** a scheme specifies a loan amount range (₹1,00,000 – ₹10,00,000)
- **THEN** the system SHALL auto-fill with a reasonable default (e.g., midpoint or max)
- **THEN** the system SHALL allow the user to adjust within the valid range

### Requirement: Scheme context indicator
The system SHALL display an indicator showing which scheme's parameters are loaded into the calculator.

#### Scenario: Calculator loaded from scheme page
- **WHEN** the calculator is auto-populated from a scheme
- **THEN** the UI SHALL display the scheme name and a "Based on [Scheme Name]" indicator
- **THEN** the user SHALL be able to clear the scheme context and start fresh

### Requirement: Parameter override
The system SHALL allow users to override any auto-populated scheme parameter in the calculator.

#### Scenario: User changes auto-filled loan amount
- **WHEN** the calculator is pre-filled with ₹10,00,000 from a scheme
- **WHEN** the user changes the loan amount to ₹5,00,000
- **THEN** the system SHALL recalculate EMI with the new value
- **THEN** the scheme context indicator SHALL remain (showing the calculator is still scheme-informed)
