## ADDED Requirements

### Requirement: No hallucinated scheme information

The system SHALL NEVER fabricate or guess scheme-specific data including benefits, eligibility criteria, interest rates, loan limits, income limits, or government policies.

#### Scenario: Assistant is uncertain about a scheme detail
- **WHEN** the assistant cannot verify a scheme-specific claim against the scheme-data-model
- **THEN** the assistant SHALL respond with: "I couldn't verify this information from the available official source. Please check the official scheme page or contact the scheme authority."

#### Scenario: User asks about interest rate not in data
- **WHEN** a user asks about a scheme's interest rate and the rate is not in the scheme-data-model
- **THEN** the assistant SHALL NOT guess or provide a generic rate. It SHALL trigger the safety response directing the user to verify with official sources.

#### Scenario: User asks about eligibility criteria not in data
- **WHEN** a user asks about eligibility criteria that are not defined in the scheme-data-model
- **THEN** the assistant SHALL respond that the specific eligibility details are not available in its database and recommend checking official scheme documentation.

### Requirement: Safety response consistency

All safety responses SHALL follow a consistent pattern.

#### Scenario: Safety response format
- **WHEN** the safety layer intercepts an unverifiable claim
- **THEN** the system SHALL display the standard safety message with a clear indicator (e.g., ⚠️ icon) and a link to the scheme detail page where the user can find official information

#### Scenario: Safety response does not break conversation
- **WHEN** a safety response is triggered during a conversation
- **THEN** the assistant SHALL continue the conversation naturally, offering to help with other aspects of scheme discovery

### Requirement: Data freshness acknowledgment

The assistant SHALL acknowledge the limitations of its data.

#### Scenario: User asks about very recent scheme changes
- **WHEN** a user asks about a scheme change that may have occurred after the data was last updated
- **THEN** the assistant SHALL respond: "My information may not reflect the most recent changes. Please verify with the official scheme authority for the latest details."

#### Scenario: Data source attribution
- **WHEN** the assistant presents scheme information
- **THEN** the system SHALL include a note that the information is from the Scheme Sathi database and may not reflect the latest official updates
