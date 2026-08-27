## MODIFIED Requirements

### Requirement: Conversational assistant interface

The system SHALL provide a persistent side-drawer chat widget accessible on all pages for signed-in users, replacing the `/assistant` page.

#### Scenario: User opens drawer from Navbar trigger
- **WHEN** a signed-in user clicks the "Talk to Scheme Sathi" button in the Navbar
- **THEN** the system SHALL open a persistent side-drawer (380px desktop, 100% mobile <480px) with chat interface
- **THEN** the drawer SHALL persist across page navigation

#### Scenario: Welcome message with Scheme Sathi persona
- **WHEN** the drawer opens with no conversation history
- **THEN** the system SHALL display: "Namaste! I'm Scheme Sathi. Ask me about government schemes, eligibility, repayment, documents, or Channel Partners."
- **THEN** quick prompt chips SHALL appear: "Find schemes for business", "Calculate EMI", "Required documents", "Find Channel Partner"

#### Scenario: Chat interface components in drawer
- **WHEN** the chat interface is displayed in the drawer
- **THEN** the system SHALL show: message area with virtualized conversation history, text input field with send button, voice input button, TTS toggle in header, minimize/close controls

#### Scenario: Unauthenticated user redirected to login
- **WHEN** an unauthenticated user clicks the Navbar trigger
- **THEN** the system SHALL redirect to login page with redirect back
- **THEN** after login, the drawer SHALL open automatically

### Requirement: Scheme data grounding with LLM + verified context

All scheme-specific information presented by the assistant SHALL be grounded in verified Scheme Sathi data (Firestore `schemes` collection), retrieved dynamically per conversation and injected into the Groq LLM prompt.

#### Scenario: User asks about a scheme in the database
- **WHEN** a user asks about a scheme that exists in Firestore
- **THEN** the assistant SHALL respond using only data from the scheme record, including name, eligibility, benefits, financial assistance, documents, and application process
- **THEN** the response SHALL include the official source URL and last updated date

#### Scenario: User asks about a scheme not in the database
- **WHEN** a user asks about a scheme that does not exist in Firestore
- **THEN** the assistant SHALL respond: "I couldn't find verified information about that scheme in Scheme Sathi's database. It may not be available yet or may be under a different name."

#### Scenario: User asks for scheme recommendations
- **WHEN** the user expresses a need (purpose, amount, location, etc.)
- **THEN** the assistant SHALL extract structured fields from the conversation
- **THEN** the assistant SHALL call the `chatCompletion` Cloud Function which fetches relevant schemes and calls Groq LLM with scheme context
- **THEN** the assistant SHALL present the LLM's response with scheme names, match reasons, and next steps

#### Scenario: LLM never invents scheme facts
- **WHEN** the Groq LLM generates a response
- **THEN** the system prompt SHALL enforce: "NEVER invent loan limits, interest rates, eligibility, income thresholds, documents, partner availability, or government benefits"
- **THEN** if the LLM cannot answer from provided context: "I couldn't verify this information from official sources."

#### Scenario: Scheme context injected per request
- **WHEN** the `chatCompletion` function is called
- **THEN** the function SHALL fetch top 10 relevant schemes for the user (by profile + conversation keywords)
- **THEN** the schemes SHALL be formatted and injected into the system prompt
- **THEN** only verified schemes (`verified == true`) SHALL be included

### Requirement: Conversational flow with voice and persistence

The assistant SHALL maintain a natural conversation across text and voice, with full history persisted locally.

#### Scenario: Voice input integrated in drawer
- **WHEN** the user clicks the microphone button in the input bar
- **THEN** the system SHALL use browser SpeechRecognition (existing `VoiceInput` component)
- **THEN** the transcript SHALL populate the text input field
- **THEN** the user can edit before sending

#### Scenario: Voice output per-message on click
- **WHEN** TTS is enabled and user clicks "Play" on an assistant message
- **THEN** the system SHALL call `textToSpeech` Cloud Function (ElevenLabs)
- **THEN** the audio SHALL play via HTML5 audio element
- **THEN** playback SHALL stop on user click or new message

#### Scenario: Conversation persists across navigation
- **WHEN** the user navigates between pages
- **THEN** the drawer SHALL remain open with full history
- **THEN** history SHALL be saved to IndexedDB keyed by UID
- **THEN** on reopen, history SHALL load from IndexedDB

#### Scenario: New conversation clears history
- **WHEN** the user clicks "New Conversation" in drawer header
- **THEN** the message list SHALL clear
- **THEN** IndexedDB data for this UID SHALL be removed
- **THEN** welcome message and quick prompts SHALL reappear

## REMOVED Requirements

### Requirement: Dedicated `/assistant` page route
**Reason**: Replaced by persistent side-drawer widget accessible on all pages.
**Migration**: Delete `src/pages/Assistant.tsx`, remove `/assistant` route from router. Users access via Navbar "Talk to Scheme Sathi" button.