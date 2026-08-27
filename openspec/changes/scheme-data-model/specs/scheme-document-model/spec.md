## ADDED Requirements

### Requirement: Scheme Document Structure
The system SHALL define a comprehensive Firestore scheme document model containing metadata, financial parameters, eligibility references, document requirements, and trust/verification fields.

#### Scenario: Complete scheme document
- **WHEN** a scheme document is created
- **THEN** it SHALL contain: id, slug, name, ministry, department, category (array), description, shortDescription, purpose, financialAssistance (object), eligibilityRuleIds (array of references to schemeRules), requiredDocuments (array), applicationProcess (string), officialUrl, source (tier), lastUpdated, verified (boolean), isActive, createdAt, updatedAt

### Requirement: Financial Assistance Schema
Each scheme SHALL contain a structured `financialAssistance` object with fields: type (grant|loan|subsidy|insurance|guarantee), minAmount, maxAmount, interestRate, loanLimit, moratoriumPeriod, repaymentPeriod.

#### Scenario: Loan scheme financial params
- **WHEN** a scheme with type "loan" is stored
- **THEN** the financialAssistance object SHALL include non-null values for interestRate, loanLimit, moratoriumPeriod, and repaymentPeriod

#### Scenario: Grant scheme financial params
- **WHEN** a scheme with type "grant" is stored
- **THEN** the financialAssistance object SHALL include minAmount and maxAmount, and loan-specific fields MAY be null

### Requirement: Required Documents Schema
Each scheme SHALL specify required documents as an array of objects with fields: name, description, mandatory (boolean), format (e.g., pdf, jpeg).

#### Scenario: Document requirements listed
- **WHEN** a scheme requires documents for application
- **THEN** the `requiredDocuments` array SHALL list each document with its name, description, and whether it is mandatory

### Requirement: Source Metadata
Each scheme SHALL include source tracking fields: `source` (tier 1-4 integer), `officialUrl`, `lastUpdated` (ISO timestamp), and `verified` (boolean).

#### Scenario: Official source attribution
- **WHEN** a scheme is sourced from an official government portal
- **THEN** the `officialUrl` SHALL point to the government website and `source` SHALL be 1 (highest priority)

#### Scenario: Mock data labeling
- **WHEN** a scheme is created from mock/estimated data
- **THEN** the `verified` field SHALL be false and the scheme detail page SHALL display a disclaimer

### Requirement: Scheme TypeScript Interface
The system SHALL provide a comprehensive `Scheme` TypeScript interface in `src/types/scheme.ts` that matches the Firestore document structure with strict typing.

#### Scenario: Interface covers all fields
- **WHEN** the Scheme interface is imported
- **THEN** it SHALL define typed properties for all schema fields including nested FinancialAssistance and RequiredDocument types
