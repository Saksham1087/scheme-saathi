## ADDED Requirements

### Requirement: Eligibility rules schema
The system SHALL define eligibility rules with the following fields:

```typescript
interface SchemeEligibilityRules {
  minIncome?: number
  maxIncome?: number
  minAge?: number
  maxAge?: number
  categories?: string[]  // ["SC", "ST", "OBC", "General"]
  states?: string[]      // ["Gujarat", "Maharashtra", "ALL"]
  districts?: string[]
  occupations?: string[] // ["Farmer", "Student", "Self-employed"]
  education?: string[]   // ["Class VIII", "Post-Graduate"]
  purposes?: string[]    // ["dairy", "food-processing", "agriculture"]
  disabilityRequired?: boolean
  gender?: string        // "male" | "female"
  existingBusiness?: boolean
  customRules?: Array<{
    field: string
    operator: string
    value: string | number | boolean | string[]
    description?: { en: string; hi: string }
  }>
}
```

#### Scenario: Income limits defined
- **WHEN** scheme has income eligibility
- **THEN** eligibilityRules contains `minIncome` and/or `maxIncome` as numbers

#### Scenario: Age range defined
- **WHEN** scheme has age eligibility
- **THEN** eligibilityRules contains `minAge` and/or `maxAge` as numbers

#### Scenario: Category restrictions defined
- **WHEN** scheme is restricted to specific social categories
- **THEN** eligibilityRules contains `categories` array with valid category strings

#### Scenario: State availability defined
- **WHEN** scheme is available in specific states
- **THEN** eligibilityRules contains `states` array with valid state names

#### Scenario: Occupation requirements defined
- **WHEN** scheme requires specific occupations
- **THEN** eligibilityRules contains `occupations` array with occupation strings

#### Scenario: Purpose restrictions defined
- **WHEN** scheme is for specific purposes
- **THEN** eligibilityRules contains `purposes` array with purpose strings

### Requirement: Data completeness tracking
The system SHALL track extraction confidence for each scheme.

```typescript
interface ExtractionMetadata {
  confidence: number  // 0.0 to 1.0
  source: "regex" | "llm" | "manual" | "default"
  extractedFields: string[]
  missingFields: string[]
  needsReview: boolean
}
```

#### Scenario: High confidence extraction
- **WHEN** regex extracts all major fields (states, categories, income, age)
- **THEN** confidence is 0.9 or higher

#### Scenario: Medium confidence extraction
- **WHEN** LLM extracts fields but some are ambiguous
- **THEN** confidence is 0.6 to 0.89

#### Scenario: Low confidence default
- **WHEN** no fields could be extracted, defaults applied
- **THEN** confidence is 0.3 or lower
- **AND** needsReview is true

### Requirement: Valid category values
The system SHALL accept only these category values:

- `"SC"` - Scheduled Caste
- `"ST"` - Scheduled Tribe
- `"OBC"` - Other Backward Class
- `"General"` - General category

#### Scenario: Invalid category handling
- **WHEN** extracted category is not in valid list
- **THEN** system maps to closest valid category or "General"

### Requirement: Valid state values
The system SHALL accept only these state/UT names:

Andhra Pradesh, Arunachal Pradesh, Assam, Bihar, Chhattisgarh, Goa, Gujarat, Haryana, Himachal Pradesh, Jharkhand, Karnataka, Kerala, Madhya Pradesh, Maharashtra, Manipur, Meghalaya, Mizoram, Nagaland, Odisha, Punjab, Rajasthan, Sikkim, Tamil Nadu, Telangana, Tripura, Uttar Pradesh, Uttarakhand, West Bengal, Andaman and Nicobar, Chandigarh, Dadra and Nagar Haveli and Daman and Diu, Delhi, Jammu and Kashmir, Ladakh, Lakshadweep, Puducherry

#### Scenario: State abbreviation mapping
- **WHEN** extracted state is "AP" or "A.P."
- **THEN** system maps to "Andhra Pradesh"

#### Scenario: Special region handling
- **WHEN** extracted state is "J&K"
- **THEN** system maps to "Jammu and Kashmir"
