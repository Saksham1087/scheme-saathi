## ADDED Requirements

### Requirement: Firestore scheme retrieval for chat context
The system SHALL retrieve relevant schemes from Firestore to inject as context into the Groq LLM prompt.

#### Scenario: Retrieve schemes by user profile
- **WHEN** the `chatCompletion` function needs scheme context
- **THEN** the system SHALL query the `schemes` collection with filters:
  - `isActive == true`
  - `category` matching user's conversation intent (extracted from last user message)
  - `financialAssistance.maxAmount >=` user's mentioned amount (if any)
  - `eligibilityRules.states` includes user's state (from profile)
  - `eligibilityRules.categories` includes user's category (from profile)
- **THEN** the query SHALL be limited to 20 documents for performance

#### Scenario: Fallback to seeded schemes if Firestore empty
- **WHEN** the Firestore query returns empty results
- **THEN** the system SHALL fall back to the bundled `schemesSeed` data (same as `matchSchemes` function)
- **THEN** the same filtering logic SHALL apply to seeded data

#### Scenario: Rank schemes by relevance to conversation
- **WHEN** multiple schemes match the filters
- **THEN** the system SHALL rank them by:
  1. Eligibility match (eligible first)
  2. Suitability score (if available from `matchSchemes` logic)
  3. Conversation keyword match (purpose, amount, location mentions)
- **THEN** the top 10 schemes SHALL be selected for context injection

#### Scenario: Format scheme data for LLM prompt
- **WHEN** top 10 schemes are selected
- **THEN** each scheme SHALL be formatted as:
  ```
  - {name.en}: Max ₹{financialAssistance.maxAmount}, {interestRate}% interest, {category.join(', ')}, Eligibility: {income/age/category summary}
  ```
- **THEN** only verified schemes (`verified == true`) SHALL be included
- **THEN** the formatted list SHALL be injected into the system prompt

#### Scenario: Cache scheme context per session
- **WHEN** scheme context is retrieved for a user
- **THEN** the result SHALL be cached in memory (Function instance) for 5 minutes
- **WHEN** the same user makes another request within 5 minutes
- **THEN** the cached schemes SHALL be reused (avoid repeated Firestore reads)
- **WHEN** cache expires
- **THEN** fresh query SHALL be executed

#### Scenario: Extract conversation intent from messages
- **WHEN** building the Firestore query
- **THEN** the system SHALL analyze the last 3 user messages for keywords:
  - Purpose: business, education, agriculture, housing, transport, health
  - Amount: numeric values with lakh/crore
  - Location: state names
- **THEN** extracted intent SHALL refine the category and amount filters

### Requirement: Scheme context freshness
The system SHALL ensure scheme data used for context is reasonably fresh.

#### Scenario: Log scheme data age
- **WHEN** schemes are retrieved for context
- **THEN** the function SHALL log the `lastUpdated` field of the oldest scheme in the result
- **THEN** if oldest `lastUpdated` > 90 days, log a warning

#### Scenario: Exclude unverified schemes from context
- **WHEN** building the context list
- **THEN** schemes with `verified == false` SHALL be excluded
- **THEN** if all matching schemes are unverified, include top 5 with disclaimer in prompt