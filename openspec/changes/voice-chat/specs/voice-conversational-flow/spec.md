## ADDED Requirements

### Requirement: Conversational voice flow

The system SHALL guide the user through a structured conversation to collect scheme-matching information via voice.

#### Scenario: Conversation initiation
- **WHEN** the user activates the voice assistant
- **THEN** the system SHALL greet the user and ask the first question: "What do you need a loan for?" (in the user's language)

#### Scenario: Sequential question flow
- **WHEN** the user answers a question via voice
- **THEN** the system SHALL extract the relevant field, confirm it, and proceed to the next question (purpose → amount → income → state → category)

#### Scenario: User provides multiple answers
- **WHEN** the user answers multiple questions in a single utterance
- **THEN** the system SHALL extract all available fields, confirm them, and skip questions already answered

### Requirement: Voice confirmation of extracted data

The system SHALL confirm extracted data with the user before proceeding.

#### Scenario: Field extracted and confirmed
- **WHEN** the system extracts a field from speech
- **THEN** the system SHALL display the extracted value and ask "Is this correct?" via voice and text

#### Scenario: User confirms
- **WHEN** the user says "yes", "हाँ", "correct", or similar affirmative
- **THEN** the system SHALL accept the value and proceed to the next question

#### Scenario: User corrects
- **WHEN** the user provides a correction (e.g., "No, I said 3 lakh")
- **THEN** the system SHALL update the field with the corrected value and proceed

### Requirement: Conversation state management

The system SHALL maintain conversation state throughout the voice interaction.

#### Scenario: Conversation resumption
- **WHEN** a user interrupts a voice conversation and returns later
- **THEN** the system SHALL resume from the last unanswered question, preserving all previously collected fields

#### Scenario: Conversation completion
- **WHEN** all required fields have been collected and confirmed
- **THEN** the system SHALL transition to showing scheme recommendations based on the collected data

### Requirement: Language-consistent conversation

The conversation SHALL be conducted in the user's selected app language.

#### Scenario: Hindi conversation
- **WHEN** the app language is Hindi
- **THEN** all system prompts and confirmations SHALL be in Hindi

#### Scenario: English conversation
- **WHEN** the app language is English
- **THEN** all system prompts and confirmations SHALL be in English
