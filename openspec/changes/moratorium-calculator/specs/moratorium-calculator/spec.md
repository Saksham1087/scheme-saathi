## ADDED Requirements

### Requirement: Moratorium impact calculation
The system SHALL calculate the impact of a moratorium period on total repayment, including repayment start date, additional interest during moratorium (if applicable), and adjusted EMI after moratorium ends.

#### Scenario: Interest-free moratorium
- **WHEN** a scheme has a 6-month interest-free moratorium
- **WHEN** the loan amount is ₹5,00,000 at 8% for 60 months
- **THEN** the system SHALL calculate repayment starting after 6 months
- **THEN** the EMI SHALL remain the same as without moratorium
- **THEN** the total repayment SHALL equal standard EMI × 60 months (no extra interest)

#### Scenario: Interest-accruing moratorium
- **WHEN** a scheme has a 6-month moratorium that accrues interest
- **WHEN** the loan amount is ₹5,00,000 at 8% for 60 months
- **THEN** the system SHALL add accrued moratorium interest to the principal
- **THEN** the adjusted EMI SHALL be recalculated on the new principal for 60 months
- **THEN** the total repayment SHALL be higher than the interest-free scenario

### Requirement: Repayment start date
The system SHALL display the estimated date when repayment begins, calculated as the scheme disbursement date plus the moratorium period.

#### Scenario: User provides disbursement date
- **WHEN** the user enters or the system assumes a disbursement date of January 2026
- **WHEN** the moratorium period is 6 months
- **THEN** the system SHALL display repayment starting July 2026

#### Scenario: No disbursement date provided
- **WHEN** the user does not provide a disbursement date
- **THEN** the system SHALL display the moratorium duration in months without a specific calendar date

### Requirement: Total cost impact display
The system SHALL display the total cost difference between having a moratorium period and not having one.

#### Scenario: Moratorium increases total cost
- **WHEN** the moratorium accrues ₹20,000 in additional interest
- **THEN** the system SHALL display the total repayment with moratorium vs. without moratorium
- **THEN** the system SHALL highlight the additional cost of ₹20,000
