# Voice NLP Extraction

## Purpose

TBD - Define extraction of structured scheme-matching fields from natural language speech input with confidence handling.

## Requirements

### Requirement: Extract structured fields from speech

The system SHALL extract structured scheme-matching fields from natural language speech input.

#### Scenario: Purpose extraction
- **WHEN** the user speaks about the purpose of their need (e.g., "I need a loan for farming", "मुझे पशुपालन के लिए ऋण चाहिए")
- **THEN** the system SHALL extract the purpose field and map it to the closest matching scheme category

#### Scenario: Loan amount extraction
- **WHEN** the user mentions a specific amount (e.g., "5 lakh rupees", "दस लाख", "₹2,00,000")
- **THEN** the system SHALL extract the numeric amount in rupees and store it in the loan amount field

#### Scenario: Income extraction
- **WHEN** the user mentions their annual income (e.g., "I earn 3 lakh per year", "मेरी सालानी आमदनी ₹1,50,000 है")
- **THEN** the system SHALL extract the numeric income value in rupees per year

#### Scenario: State extraction
- **WHEN** the user mentions a state name (e.g., "I'm from Maharashtra", "मैं बिहार से हूँ")
- **THEN** the system SHALL extract the state and map it to the canonical state name

#### Scenario: Category extraction
- **WHEN** the user mentions their category (e.g., "I'm SC", "मैं OBC हूँ", "General category")
- **THEN** the system SHALL extract the social category and map it to the canonical category value

### Requirement: Multi-field extraction from single utterance

The system SHALL attempt to extract multiple fields from a single speech input.

#### Scenario: User provides multiple details in one utterance
- **WHEN** the user says "I need 5 lakh for farming in Maharashtra, I earn 2 lakh per year"
- **THEN** the system SHALL extract purpose (farming), amount (5,00,000), state (Maharashtra), and income (2,00,000) from the single utterance

#### Scenario: Partial extraction
- **WHEN** the system can only confidently extract some fields from an utterance
- **THEN** the system SHALL use the extracted fields and ask follow-up questions for missing fields

### Requirement: Extraction confidence handling

The system SHALL handle low-confidence extractions appropriately.

#### Scenario: High confidence extraction
- **WHEN** the system extracts a field with high confidence
- **THEN** the system SHALL use the extracted value and display it to the user for confirmation

#### Scenario: Low confidence extraction
- **WHEN** the system extracts a field with low confidence or ambiguity
- **THEN** the system SHALL display the best guess and ask the user to confirm or correct it (e.g., "I heard '5 lakh' — is that correct?")

#### Scenario: No extraction possible
- **WHEN** the system cannot extract any fields from the speech input
- **THEN** the system SHALL ask the user to rephrase or provide the information via text