## ADDED Requirements

### Requirement: Eligibility Rules Structure
The system SHALL define eligibility rules as separate Firestore documents in a `schemeRules` collection, each containing a rule set with fields: `schemeId` (reference), `rules` (array of rule objects), `logic` (AND|OR), `description`.

#### Scenario: Rule document creation
- **WHEN** an eligibility rule set is created for a scheme
- **THEN** it SHALL be stored as a document in `schemeRules` with a reference to the parent scheme

### Requirement: Individual Rule Format
Each rule object within a rule set SHALL contain: `field`, `operator`, `value`, and optional `unit`.

#### Scenario: Rule with operator
- **WHEN** a rule checks income eligibility
- **THEN** the rule object SHALL have `field: "income"`, `operator: "<="`, `value: 800000`, and `unit: "INR"`

### Requirement: Supported Eligibility Fields
The system SHALL support the following eligibility fields: `income` (annual household income), `age` (applicant age), `category` (SC/ST/OBC/General), `state` (Indian state), `occupation` (employment type), `education` (education level), `purpose` (loan/business purpose), `disability` (disability status), `gender`.

#### Scenario: Income-based rule
- **WHEN** a scheme limits eligibility to households earning <= ₹8,00,000
- **THEN** a rule with `field: "income"`, `operator: "<="`, `value: 800000` SHALL exist

#### Scenario: Category-based rule
- **WHEN** a scheme is exclusively for SC category
- **THEN** a rule with `field: "category"`, `operator: "=="`, `value: "SC"` SHALL exist

#### Scenario: State-based rule
- **WHEN** a scheme is limited to Maharashtra
- **THEN** a rule with `field: "state"`, `operator: "in"`, `value: ["Maharashtra"]` SHALL exist

### Requirement: Supported Operators
The system SHALL support the following operators: `==`, `!=`, `<=`, `>=`, `<`, `>`, `in`, `notIn`, `between`.

#### Scenario: Between operator
- **WHEN** a scheme limits age between 18 and 45
- **THEN** a rule with `field: "age"`, `operator: "between"`, `value: [18, 45]` SHALL be valid

### Requirement: Combined Rule Logic
Multiple rules within a rule set SHALL be combined using AND or OR logic specified by the `logic` field.

#### Scenario: AND logic
- **WHEN** a scheme requires income <= ₹8L AND category == SC
- **THEN** the rule set SHALL have `logic: "AND"` and two rule objects

#### Scenario: OR logic
- **WHEN** a scheme is open to SC OR ST category
- **THEN** the rule set SHALL have `logic: "OR"` with category rules for SC and ST

### Requirement: Eligibility Rules TypeScript Interface
The system SHALL provide TypeScript interfaces for `EligibilityRuleSet`, `EligibilityRule`, and `EligibilityField` in `src/types/scheme.ts`.

#### Scenario: Type safety
- **WHEN** an eligibility rule set is loaded from Firestore
- **THEN** it SHALL be typed as `EligibilityRuleSet` with strongly typed rule objects
