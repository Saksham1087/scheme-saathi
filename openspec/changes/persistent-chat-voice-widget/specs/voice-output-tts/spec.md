## ADDED Requirements

### Requirement: Per-message text-to-speech via ElevenLabs
The system SHALL provide optional text-to-speech for assistant messages using ElevenLabs API, triggered per-message by user click (not auto-play).

#### Scenario: TTS toggle in drawer header
- **WHEN** the chat drawer is open
- **THEN** a TTS toggle button SHALL be displayed in the drawer header
- **WHEN** TTS is enabled (default: off)
- **THEN** the toggle SHALL show "Voice output enabled" and a speaker icon
- **WHEN** TTS is disabled
- **THEN** the toggle SHALL show "Voice output disabled" and a muted speaker icon
- **THEN** the TTS preference SHALL persist in localStorage per user

#### Scenario: Play button on each assistant message
- **WHEN** TTS is enabled and an assistant message is displayed
- **THEN** a "Play" button SHALL appear next to the message
- **WHEN** TTS is disabled
- **THEN** the "Play" button SHALL be hidden

#### Scenario: TTS plays on user click per message
- **WHEN** TTS is enabled and a user clicks the "Play" button on an assistant message
- **THEN** the system SHALL call the `textToSpeech` Cloud Function with the message text and current language
- **THEN** the system SHALL play the returned audio via HTML5 `<audio>` element
- **THEN** the "Play" button SHALL change to a "Stop" button during playback

#### Scenario: TTS stops on user click or new message
- **WHEN** TTS is playing and the user clicks "Stop" on the same message
- **THEN** the audio SHALL stop immediately
- **WHEN** TTS is playing and a new assistant message arrives
- **THEN** the current audio SHALL stop and the new message's Play button SHALL be available

#### Scenario: TTS language matches app language
- **WHEN** the app language is English (en)
- **THEN** the TTS request SHALL use voice_id for English (Adam: `pNInz6obpgDQGcFmaJgB`)
- **WHEN** the app language is Hindi (hi)
- **THEN** the TTS request SHALL use voice_id for Hindi (Emily multilingual: `MF3mGyEYCl7XYWbV9V6O`)
- **WHEN** the app language is Marathi (mr)
- **THEN** the TTS request SHALL use the same Hindi voice (ElevenLabs multilingual v2 supports Marathi)

#### Scenario: TTS uses ElevenLabs multilingual v2 model
- **WHEN** any TTS request is made
- **THEN** the system SHALL use model `eleven_multilingual_v2`
- **THEN** the audio format SHALL be MP3 (base64 encoded in response)

#### Scenario: TTS character usage displayed
- **WHEN** TTS is enabled
- **THEN** the drawer header SHALL show remaining monthly characters (e.g., "TTS: 8,234 / 10,000 chars")
- **WHEN** characters are exhausted
- **THEN** the TTS toggle SHALL be disabled and show "Monthly limit reached"

### Requirement: TTS error handling
The system SHALL handle TTS errors gracefully.

#### Scenario: ElevenLabs API error
- **WHEN** the `textToSpeech` function returns an error
- **THEN** the system SHALL display a toast: "Voice output unavailable. Please try again."
- **THEN** the Play button SHALL revert to play state

#### Scenario: Audio playback error
- **WHEN** the browser fails to play the returned audio
- **THEN** the system SHALL display a toast: "Could not play audio. Please try again."

#### Scenario: Rate limit exceeded
- **WHEN** the user exceeds per-day TTS limit (20 requests)
- **THEN** the system SHALL display: "Daily voice limit reached. Try again tomorrow."
- **THEN** the Play buttons SHALL be disabled for the rest of the day