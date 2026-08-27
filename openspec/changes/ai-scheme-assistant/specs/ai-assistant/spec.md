## ADDED Requirements

### Requirement: Conversational assistant interface

The system SHALL provide a conversational interface at `/assistant` for scheme discovery guidance.

#### Scenario: User navigates to assistant
- **WHEN** a user navigates to `/assistant`
- **THEN** the system SHALL display a chat interface with a welcome message explaining the assistant's capabilities and an input field for text (and voice if available)

#### Scenario: Welcome message
- **WHEN** the assistant session begins
- **THEN** the system SHALL display a greeting and a brief explanation: "I can help you find government schemes. Tell me what you need, and I'll guide you through the process."

#### Scenario: Chat interface components
- **WHEN** the chat interface is displayed
- **THEN** the system SHALL show: a message area with conversation history, a text input field with send button, and an optional voice input button (if voice-chat is available)

### Requirement: Scheme data grounding

All scheme-specific information presented by the assistant SHALL be grounded in the scheme-data-model.

#### Scenario: User asks about a scheme in the database
- **WHEN** a user asks about a scheme that exists in the scheme-data-model
- **THEN** the assistant SHALL respond using only data from the scheme record, including name, eligibility, benefits, and application process

#### Scenario: User asks about a scheme not in the database
- **WHEN** a user asks about a scheme that does not exist in the scheme-data-model
- **THEN** the assistant SHALL respond: "I don't have information about that scheme in my database. It may not be available in Scheme Sathi yet."

#### Scenario: User asks for scheme recommendations
- **WHEN** the assistant has collected sufficient user requirements
- **THEN** the assistant SHALL pass the requirements to the recommendation engine and present the top results conversationally

### Requirement: End of conversation recommendation

The assistant SHALL transition from conversation to recommendation display when requirements are collected.

#### Scenario: Sufficient data collected
- **WHEN** the assistant has collected at least purpose and state (minimum required fields)
- **THEN** the assistant SHALL call the recommendation engine and present matching schemes

#### Scenario: Insufficient data collected
- **WHEN** the assistant has not collected enough fields for meaningful recommendations
- **THEN** the assistant SHALL explain what additional information would help and offer to proceed with what is available
