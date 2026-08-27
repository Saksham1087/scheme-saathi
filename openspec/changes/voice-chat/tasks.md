## 1. Speech Recognition Service

- [x] 1.1 Create `src/services/voice/recognition.ts` — Web Speech API (`SpeechRecognition`) wrapper
- [x] 1.2 Support locales: `en-IN` (English), `hi-IN` (Hindi), `mr-IN` (Marathi); default to user's selected app language
- [x] 1.3 Implement browser API detection — disable voice button if `SpeechRecognition` not available
- [x] 1.4 Implement fallback triggers: microphone permission denied, speech error, silence timeout (>5s), API unavailable → seamless switch to typed input

## 2. NLP Extraction

- [x] 2.1 Create `src/services/voice/nlp.ts` — pattern matching and keyword extraction for structured fields
- [x] 2.2 Map extracted fields to scheme recommendation input: purpose, loan amount, annual income, state, category
- [x] 2.3 Show recognized text to user for confirmation before processing
- [x] 2.4 Handle partial recognition and low-confidence results — ask for clarification

## 3. Conversational Flow

- [x] 3.1 Implement voice-guided conversation: ask purpose → amount → income → state → category → recommend
- [x] 3.2 Each turn accepts a single piece of information via voice
- [x] 3.3 Maintain conversation context when falling back to typed input
- [x] 3.4 Allow skipping non-critical questions with partial data

## 4. Voice Output (Optional)

- [x] 4.1 Create `src/services/voice/tts.ts` — browser `SpeechSynthesis` wrapper, disabled by default
- [x] 4.2 Implement TTS for scheme recommendations only (not full scheme details)
- [x] 4.3 Add user toggle to enable/disable text-to-speech

## 5. UI Component

- [x] 5.1 Create `VoiceAssistant` component with "Talk to Scheme Sathi" button
- [x] 5.2 Show listening state, recognized text, and processing state
- [x] 5.3 Display privacy notice: "Voice data is processed by the browser and not stored by Scheme Sathi"
- [x] 5.4 Handle error states: unclear speech, silence, microphone denial — with clear user-facing messages

## 6. Testing & Polish

- [x] 6.1 Test speech recognition with English, Hindi, and Marathi input
- [x] 6.2 Test fallback to typed input on microphone denial and API unavailability
- [x] 6.3 Test silence timeout triggers fallback after 5 seconds
- [x] 6.4 Test NLP extraction accuracy for purpose, amount, income, state, category
- [x] 6.5 Test conversational flow end-to-end with voice and typed mixed input
