## ADDED Requirements

### Requirement: Structured conversation flow

The assistant SHALL guide users through a structured conversation to collect scheme-matching requirements.

#### Scenario: Conversation sequence
- **WHEN** a user begins a conversation with the assistant
- **THEN** the assistant SHALL follow the sequence: purpose → loan amount → annual income → state → social category → recommend

#### Scenario: First question
- **WHEN** the conversation begins
- **THEN** the assistant SHALL ask: "What do you need financial help for?" (in the user's language)

#### Scenario: Each subsequent question
- **WHEN** the user answers a question
- **THEN** the assistant SHALL acknowledge the answer, extract the relevant field, and ask the next question in the sequence

### Requirement: Flexible information gathering

The assistant SHALL handle users providing information out of sequence or in bulk.

#### Scenario: User provides multiple fields at once
- **WHEN** a user provides several pieces of information in a single message (e.g., "I need a loan for farming in Maharashtra, I'm SC and earn 2 lakh per year")
- **THEN** the assistant SHALL extract all available fields, confirm them, and skip questions for already-answered fields

#### Scenario: User skips a question
- **WHEN** a user does not want to answer a specific question
- **WHEN** the assistant SHALL allow the skip, note the missing field, and proceed to the next question

#### Scenario: User provides ambiguous answer
- **WHEN** the assistant cannot confidently map an answer to a specific field
- **THEN** the assistant SHALL ask a clarifying question (e.g., "Could you tell me more about what you need the loan for?")

### Requirement: Field confirmation

The assistant SHALL confirm extracted fields with the user before proceeding.

#### Scenario: Field extracted from user message
- **WHEN** the assistant extracts a field value from the user's message
- **THEN** the assistant SHALL confirm the extraction (e.g., "I understand you're looking for a loan for farming — is that correct?")

#### Scenario: User confirms extraction
- **WHEN** the user confirms the extracted field
- **THEN** the assistant SHALL accept the value and move to the next question

#### Scenario: User corrects extraction
- **WHEN** the user corrects the extracted field
- **THEN** the assistant SHALL update the value and proceed

### Requirement: Conversation completion and recommendation

The assistant SHALL transition to recommendations when sufficient data is collected.

#### Scenario: All fields collected
- **WHEN** all five fields (purpose, amount, income, state, category) have been collected and confirmed
- **THEN** the assistant SHALL present the collected summary and offer to find matching schemes

#### Scenario: Minimum fields collected
- **WHEN** at least purpose and state are collected
- **THEN** the assistant SHALL offer to find schemes with the available information, noting which additional fields could improve recommendations

#### Scenario: Recommendation presentation
- **WHEN** the assistant calls the recommendation engine
- **THEN** the assistant SHALL present the top results conversationally, including scheme name, key benefit, and a link to the scheme detail page
