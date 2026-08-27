## ADDED Requirements

### Requirement: Cloud Function for Groq chat completion
The system SHALL provide an HTTPS Callable Cloud Function (`chatCompletion`) that accepts conversation history, fetches relevant scheme context, calls Groq LLM, and returns the response.

#### Scenario: Function requires authentication
- **WHEN** an unauthenticated request calls `chatCompletion`
- **THEN** the function SHALL throw `HttpsError` with code `unauthenticated`
- **THEN** the error message SHALL be "Please sign in to use the assistant."

#### Scenario: Function validates input
- **WHEN** a request lacks `messages` array or `messages` is empty
- **THEN** the function SHALL throw `HttpsError` with code `invalid-argument`
- **THEN** the error message SHALL be "Messages array required."

#### Scenario: Function fetches user profile
- **WHEN** an authenticated request is received
- **THEN** the function SHALL fetch the user's document from `users/{uid}` collection
- **THEN** the profile data (state, district, preferredLanguage, saved schemes) SHALL be used for context

#### Scenario: Function fetches relevant schemes
- **WHEN** a request is received
- **THEN** the function SHALL call the scheme matching logic (reusing `matchSchemes` approach) to find top 10 relevant schemes for the user
- **THEN** the schemes SHALL be filtered by user's state, income, category, and conversation context

#### Scenario: Function builds system prompt with scheme context
- **WHEN** relevant schemes are fetched
- **THEN** the function SHALL build a system prompt including:
  - Scheme Sathi persona (trustworthy, simple, inclusive, transparent)
  - Strict rule: "NEVER invent loan limits, interest rates, eligibility, income thresholds, documents"
  - Rule: "If unsure: 'I couldn't verify this from official sources.'"
  - Top 10 schemes with: name, max amount, interest rate, category, eligibility summary
  - User profile context (state, category, language)

#### Scenario: Function calls Groq API with llama-3.3-70b-versatile
- **WHEN** system prompt and conversation history are ready
- **THEN** the function SHALL call Groq Chat Completions API with:
  - Model: `llama-3.3-70b-versatile`
  - Messages: system prompt + last 10 conversation messages (user/assistant alternating)
  - Temperature: 0.3 (factual, consistent)
  - Max tokens: 1024
  - Stream: false (MVP)

#### Scenario: Function returns response with used scheme IDs
- **WHEN** Groq API returns successfully
- **THEN** the function SHALL return:
  - `response`: string (assistant message)
  - `usedSchemeIds`: string[] (scheme IDs referenced in response)
  - `tokenUsage`: object (promptTokens, completionTokens, totalTokens)

#### Scenario: Function handles Groq API errors
- **WHEN** Groq API returns rate limit (429)
- **THEN** the function SHALL throw `HttpsError` with code `resource-exhausted` and message "Service busy. Please try again in a moment."
- **WHEN** Groq API returns authentication error
- **THEN** the function SHALL throw `HttpsError` with code `internal` and log error (do not expose key)
- **WHEN** Groq API returns other errors
- **THEN** the function SHALL throw `HttpsError` with code `internal` and message "Failed to generate response."

#### Scenario: Function enforces per-user rate limit
- **WHEN** a user exceeds 50 chat requests per day
- **THEN** the function SHALL throw `HttpsError` with code `resource-exhausted` and message "Daily limit reached. Try again tomorrow."
- **THEN** the limit SHALL reset at midnight UTC

#### Scenario: Function logs usage for analytics
- **WHEN** a request completes successfully
- **THEN** the function SHALL log: uid, timestamp, tokenUsage, schemeCount, responseLength
- **WHEN** a request fails
- **THEN** the function SHALL log: uid, timestamp, errorCode, errorMessage

### Requirement: Groq client wrapper
The system SHALL provide a Groq SDK wrapper for the Cloud Function.

#### Scenario: Client initializes with API key from environment
- **WHEN** the Function starts
- **THEN** the Groq client SHALL read `GROQ_API_KEY` from `process.env` or Firebase Functions secrets
- **THEN** the key SHALL never be logged or exposed in responses

#### Scenario: Client handles retries with exponential backoff
- **WHEN** a Groq request fails with transient error (5xx, timeout)
- **THEN** the client SHALL retry up to 3 times with exponential backoff (1s, 2s, 4s)
- **THEN** if all retries fail, throw the last error