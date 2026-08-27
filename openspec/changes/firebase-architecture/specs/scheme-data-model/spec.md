## ADDED Requirements

### Requirement: Scheme Document Schema
The system SHALL define a Firestore `schemes` collection document with the following fields: `id`, `slug`, `name`, `ministry`, `department`, `category`, `description`, `shortDescription`, `purpose`, `financialAssistance` (type, amount, interestRate, loanLimit, moratoriumPeriod, repaymentPeriod), `eligibilityRules` (reference to schemeRules), `requiredDocuments`, `applicationProcess`, `officialUrl`, `source` (tier 1-4), `lastUpdated`, `verified`, `isActive`, `createdAt`, `updatedAt`.

#### Scenario: Scheme document creation
- **WHEN** a new scheme document is created
- **THEN** it SHALL contain all required fields with valid types and the `createdAt` and `updatedAt` timestamps SHALL be set to the server time

#### Scenario: Scheme document read
- **WHEN** a scheme document is read from Firestore
- **THEN** it SHALL return a typed Scheme object matching the TypeScript interface

### Requirement: Scheme Slug
Each scheme SHALL have a unique, URL-friendly `slug` field derived from the scheme name.

#### Scenario: Slug uniqueness
- **WHEN** two schemes have similar names
- **THEN** their slugs SHALL be unique (e.g., appending a numeric suffix)

#### Scenario: Slug format
- **WHEN** a scheme named "PM Mudra Yojana" is created
- **THEN** its slug SHALL be `pm-mudra-yojana`

### Requirement: Scheme Categories
Schemes SHALL be categorized using predefined category values: `business`, `education`, `agriculture`, `transport`, `housing`, `health`, `social-welfare`, `employment`, `other`.

#### Scenario: Category assignment
- **WHEN** a scheme is created
- **THEN** it SHALL be assigned to one or more valid categories

### Requirement: Financial Assistance Structure
Each scheme's `financialAssistance` field SHALL be a structured object containing type (grant/loan/subsidy/insurance), amount range, interest rate, loan limit, moratorium period, and repayment period.

#### Scenario: Loan-type scheme
- **WHEN** a scheme provides a loan
- **THEN** `financialAssistance.type` SHALL be "loan" and SHALL include interestRate, loanLimit, moratoriumPeriod, and repaymentPeriod fields

#### Scenario: Grant-type scheme
- **WHEN** a scheme provides a grant
- **THEN** `financialAssistance.type` SHALL be "grant" and SHALL include amount fields but loan-specific fields MAY be null

### Requirement: TypeScript Interface
The system SHALL provide a `Scheme` TypeScript interface in `src/types/scheme.ts` that matches the Firestore document structure.

#### Scenario: Type safety
- **WHEN** a component imports the Scheme type
- **THEN** all scheme properties SHALL be correctly typed and compilable with TypeScript strict mode
