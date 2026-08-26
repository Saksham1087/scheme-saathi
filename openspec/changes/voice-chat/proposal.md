## Why

Voice interaction is a key differentiator for users with limited digital literacy. The PRD specifies "Talk to Scheme Sathi" — users speak in Hindi/Hinglish/Marathi and the system extracts structured data for scheme matching.

## What Changes

- Voice input via "Talk to Scheme Sathi" button
- Browser-native speech recognition (with external API fallback if needed)
- Multilingual speech: English, Hindi, Hinglish, Marathi
- NLP extraction: purpose, amount, income, state, category from speech
- Conversational voice flow for assessment
- Text-to-speech output (optional)
- Graceful fallback to typed input on speech error
- Voice error states: unclear speech, silence, microphone denial

## Capabilities

### New Capabilities
- `voice-input`: Browser speech recognition with multilingual support
- `voice-nlp-extraction`: Extract structured fields from natural language speech
- `voice-conversational-flow`: Voice-based assessment conversation
- `voice-output`: Optional text-to-speech for results
- `voice-fallback`: Graceful degradation to typed input

### Modified Capabilities

(none)

## Impact

- New `src/services/voice/` directory with recognition, NLP, TTS modules
- New component: VoiceAssistant
- Browser Web Speech API integration
- Optional: external speech API if browser capabilities insufficient
- Depends on: `smart-scheme-recommender`, `multilingual-system`
