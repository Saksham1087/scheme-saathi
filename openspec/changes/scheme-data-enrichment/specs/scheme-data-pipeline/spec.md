## ADDED Requirements

### Requirement: Parse eligibility text into structured fields
The system SHALL parse natural language eligibility text from Kaggle CSV into structured JSON fields including: states, categories, maxIncome, minIncome, minAge, maxAge, occupations, purposes, gender, disabilityRequired.

#### Scenario: Regex extracts state names
- **WHEN** eligibility text contains "resident of Gujarat" or "Gujarat state"
- **THEN** system extracts `states: ["Gujarat"]`

#### Scenario: Regex extracts income limits
- **WHEN** eligibility text contains "income not exceeding ₹1,50,000"
- **THEN** system extracts `maxIncome: 150000`

#### Scenario: Regex extracts age ranges
- **WHEN** eligibility text contains "age 18-45" or "between 18 and 45 years"
- **THEN** system extracts `minAge: 18, maxAge: 45`

#### Scenario: LLM handles ambiguous cases
- **WHEN** regex cannot reliably extract fields from eligibility text
- **THEN** system sends text to LLM with structured extraction prompt
- **AND** LLM returns JSON with extracted fields

### Requirement: Resolve state names to标准 format
The system SHALL resolve all state name variations to the standard 36 Indian states/UTs.

#### Scenario: Full state name resolution
- **WHEN** text contains "Andhra Pradesh"
- **THEN** system maps to `"Andhra Pradesh"`

#### Scenario: Abbreviation resolution
- **WHEN** text contains "GJ" or "Guj."
- **THEN** system maps to `"Gujarat"`

#### Scenario: Regional grouping expansion
- **WHEN** text contains "North Eastern states"
- **THEN** system expands to `["Assam", "Arunachal Pradesh", "Manipur", "Mizoram", "Nagaland", "Tripura", "Meghalaya"]`

#### Scenario: All India detection
- **WHEN** text contains "all over India" or "across the country" or "nationwide"
- **THEN** system sets `states: ["ALL"]`

### Requirement: Map Kaggle categories to app categories
The system SHALL map 19 Kaggle categories to 8 app categories.

#### Scenario: Direct category mapping
- **WHEN** scheme has Kaggle category "Education & Learning"
- **THEN** system maps to `"education"`

#### Scenario: Merged category mapping
- **WHEN** scheme has Kaggle category "Women and Child"
- **THEN** system maps to `"social-welfare"`

### Requirement: Validate extracted data
The system SHALL validate all extracted fields against known constraints.

#### Scenario: Invalid state rejection
- **WHEN** extracted state is not in STATE_MAP
- **THEN** system logs warning and excludes that state

#### Scenario: Income range validation
- **WHEN** extracted maxIncome is less than minIncome
- **THEN** system logs warning and swaps values

#### Scenario: Age range validation
- **WHEN** extracted minAge is greater than maxAge
- **THEN** system logs warning and swaps values

### Requirement: Handle unparseable schemes
The system SHALL apply conservative defaults for schemes with no extractable eligibility.

#### Scenario: No eligibility text
- **WHEN** scheme has empty or missing eligibility text
- **THEN** system sets `states: ["ALL"]`, `categories: ["SC", "ST", "OBC", "General"]`
- **AND** marks scheme as `needsReview: true`

#### Scenario: Partial extraction
- **WHEN** regex extracts some fields but not others
- **THEN** system uses extracted fields and applies defaults for missing ones
- **AND** sets confidence score based on completeness

### Requirement: Generate output JSON files
The system SHALL generate per-category JSON files matching existing schema.

#### Scenario: Output file generation
- **WHEN** parsing completes for all schemes
- **THEN** system writes `src/data/schemes/{category}.json` files
- **AND** each file contains array of schemes with enriched eligibilityRules

#### Scenario: Deduplication
- **WHEN** multiple Kaggle rows refer to the same scheme
- **THEN** system keeps the entry with most complete eligibility text
