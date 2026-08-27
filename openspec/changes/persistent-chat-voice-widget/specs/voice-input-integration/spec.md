## ADDED Requirements

### Requirement: Voice input via browser Web Speech API
The system SHALL provide voice input capability using the browser's native SpeechRecognition API, reusing the existing `VoiceInput` component.

#### Scenario: Voice button appears in chat input bar
- **WHEN** the chat drawer is open and the browser supports SpeechRecognition
- **THEN** a microphone button SHALL be displayed in the chat input bar next to the text field
- **WHEN** the browser does not support SpeechRecognition
- **THEN** the microphone button SHALL be hidden

#### Scenario: Voice recording starts on button press
- **WHEN** a user clicks the microphone button
- **THEN** the system SHALL request microphone permission if not already granted
- **THEN** the system SHALL start speech recognition with the current app language locale
- **THEN** the button SHALL show a pulsing/loading state indicating recording

#### Scenario: Real-time transcript display
- **WHEN** speech recognition returns interim results
- **THEN** the recognized text SHALL appear in the text input field in real-time
- **WHEN** the user stops speaking and recognition finalizes
- **THEN** the final transcript SHALL populate the text input field

#### Scenario: Language locale matches app language
- **WHEN** the app language is English (en)
- **THEN** speech recognition SHALL use `en-IN` locale
- **WHEN** the app language is Hindi (hi)
- **THEN** speech recognition SHALL use `hi-IN` locale
- **WHEN** the app language is Marathi (mr)
- **THEN** speech recognition SHALL use `mr-IN` locale

#### Scenario: Hinglish tolerance for Hindi
- **WHEN** the app language is Hindi and user speaks Hinglish (Hindi + English mix)
- **THEN** the system SHALL use `hi-IN` locale and tolerate English words within Hindi sentences

#### Scenario: Voice input stops on button press or silence
- **WHEN** a user clicks the microphone button again during recording
- **THEN** the system SHALL stop recognition and process the final transcript
- **WHEN** no speech is detected for 5 seconds during recording
- **THEN** the system SHALL auto-stop recognition and process the transcript

#### Scenario: Transcript sent as message on Enter or auto-send
- **WHEN** voice recognition finalizes with a transcript
- **THEN** the transcript SHALL be placed in the text input field
- **WHEN** the user presses Enter or clicks Send
- **THEN** the message SHALL be sent normally

### Requirement: Structured field extraction from voice
The system SHALL extract structured fields (purpose, amount, income) from voice transcripts using the existing `nlp.ts` module.

#### Scenario: Purpose extraction from voice
- **WHEN** a user says "I need a loan for farming" or "मुझे खेती के लिए लोन चाहिए"
- **THEN** the system SHALL extract purpose = "agriculture" and pre-fill the context

#### Scenario: Amount extraction from voice
- **WHEN** a user says "5 lakh rupees" or "दस लाख" or "₹2,00,000"
- **THEN** the system SHALL extract loanAmount = 500000 (or appropriate value)

#### Scenario: Income extraction from voice
- **WHEN** a user says "My income is 3 lakh per year" or "मेरी आमदनी 3 लाख है"
- **THEN** the system SHALL extract annualIncome = 300000

#### Scenario: Multi-field extraction from single utterance
- **WHEN** a user says "I need 5 lakh for business in Maharashtra, I earn 3 lakh"
- **THEN** the system SHALL extract purpose, loanAmount, state, and annualIncome from the single utterance

### Requirement: Voice error handling and fallback
The system SHALL handle voice recognition errors gracefully with clear user messages.

#### Scenario: Microphone permission denied
- **WHEN** a user denies microphone permission
- **THEN** the system SHALL display: "Microphone access is needed for voice input. You can type your answers instead."
- **THEN** the microphone button SHALL be hidden or disabled

#### Scenario: Speech recognition error
- **WHEN** the SpeechRecognition API returns an error (network, audio capture)
- **THEN** the system SHALL display: "We couldn't understand that. You can type your answer instead."
- **THEN** the text input SHALL remain available

#### Scenario: No speech detected
- **WHEN** the system detects silence for 5 seconds
- **THEN** the system SHALL display: "I didn't hear anything. You can speak again or type your answer."

#### Scenario: Low confidence recognition
- **WHEN** speech is detected but confidence is very low
- **THEN** the system SHALL display: "I'm not sure I understood. Could you rephrase?"
- **THEN** both voice retry and text input SHALL be offered

### Requirement: Voice input disabled during assistant response
The system SHALL disable voice input while the assistant is responding.

#### Scenario: Voice button disabled during loading
- **WHEN** the assistant is generating a response (typing indicator shown)
- **THEN** the microphone button SHALL be disabled
- **WHEN** the response completes
- **THEN** the microphone button SHALL be re-enabled