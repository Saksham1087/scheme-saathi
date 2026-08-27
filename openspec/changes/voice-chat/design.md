## Context

Voice interaction is a key differentiator for users with limited digital literacy. The PRD specifies "Talk to Scheme Sathi" — users speak in Hindi, Hinglish, Marathi, or English and the system extracts structured data for scheme matching. Voice input removes the barrier of typing for users unfamiliar with keyboard input or uncomfortable with written language.

## Goals / Non-Goals

**Goals:**
- Provide browser-native speech recognition with multilingual support (English, Hindi, Hinglish, Marathi)
- Extract structured fields (purpose, amount, income, state, category) from natural language speech
- Support a conversational voice flow for scheme assessment
- Provide optional text-to-speech output for results
- Gracefully fall back to typed input when voice fails or is unavailable

**Non-Goals:**
- Real-time translation between languages
- Speaker identification or voice biometrics
- Offline speech recognition (browser APIs require network for processing)
- Custom wake word or always-on listening
- Integration with external voice assistants (Alexa, Google Assistant)

## Decisions

1. **Speech recognition API**: The system SHALL use the browser's Web Speech API (`SpeechRecognition`) as the primary recognition engine. An external API fallback MAY be added later but is not in scope for this change.

2. **Language support**: The system SHALL support English (`en-IN`), Hindi (`hi-IN`), and Marathi (`mr-IN`). Hinglish SHALL be handled by the Hindi locale with code-switching tolerance. The system SHALL default to the user's selected app language.

3. **NLP extraction approach**: The system SHALL use pattern matching and keyword extraction for structured field extraction. This avoids LLM API dependency for basic extraction. The extracted fields map to the scheme recommendation input schema: purpose, loan amount, annual income, state, category.

4. **Conversational flow**: The voice assistant SHALL follow the same guided conversation structure as the typed assessment: ask purpose → amount → income → state → category → recommend. Each turn SHALL accept a single piece of information via voice.

5. **Output modality**: Text-to-speech SHALL be optional and disabled by default. When enabled, the system SHALL use the browser's `SpeechSynthesis` API. TTS SHALL only read scheme recommendations, not full scheme details.

6. **Fallback strategy**: Voice fallback SHALL occur automatically on: microphone permission denied, speech recognition error, silence timeout (>5 seconds of no speech), or browser API unavailable. The system SHALL seamlessly switch to typed input without losing conversation context.

## Risks / Trade-offs

- **Browser API limitations**: Web Speech API support varies across browsers and may not work well on all mobile browsers. The system SHALL detect availability and disable the voice button if the API is not supported.
- **Speech accuracy in noisy environments**: Background noise may reduce recognition accuracy. The system SHALL show the recognized text for user confirmation before processing.
- **Multilingual accuracy**: Hinglish (code-switched Hindi-English) may have lower accuracy than pure Hindi or English. The system SHALL be tolerant of partial recognition and ask for clarification when confidence is low.
- **Privacy**: Speech data is processed by the browser's speech service. The system SHALL display a notice that voice data is processed by the browser and not stored by Scheme Sathi.
