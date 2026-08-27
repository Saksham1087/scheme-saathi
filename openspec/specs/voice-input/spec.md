# Voice Input

## Purpose

TBD - Define browser speech recognition capabilities for multilingual voice input with visual feedback.

## Requirements

### Requirement: Browser speech recognition

The system SHALL use the browser Web Speech API for speech-to-text conversion.

#### Scenario: Voice button available
- **WHEN** the browser supports the SpeechRecognition API and the user has not denied microphone permission
- **THEN** the system SHALL display a "Talk to Scheme Sathi" button or microphone icon in the assessment interface

#### Scenario: Voice button unavailable
- **WHEN** the browser does not support the SpeechRecognition API
- **THEN** the system SHALL hide the voice input option and fall back to typed input without error messages

### Requirement: Multilingual speech recognition

The system SHALL support speech recognition in multiple languages matching the app language setting.

#### Scenario: Hindi speech input
- **WHEN** the app language is set to Hindi and the user activates voice input
- **THEN** the system SHALL configure speech recognition to the `hi-IN` locale and process Hindi speech

#### Scenario: English speech input
- **WHEN** the app language is set to English and the user activates voice input
- **THEN** the system SHALL configure speech recognition to the `en-IN` locale and process English speech

#### Scenario: Marathi speech input
- **WHEN** the app language is set to Marathi and the user activates voice input
- **THEN** the system SHALL configure speech recognition to the `mr-IN` locale and process Marathi speech

#### Scenario: Hinglish tolerance
- **WHEN** the user speaks in a mix of Hindi and English (Hinglish)
- **THEN** the system SHALL process the speech using the Hindi locale and tolerate English words within Hindi sentences

### Requirement: Voice recording interaction

The system SHALL provide clear visual feedback during voice recording.

#### Scenario: Recording started
- **WHEN** the user clicks the voice input button
- **THEN** the system SHALL display a recording indicator (e.g., pulsing microphone icon) and begin listening

#### Scenario: Speech detected
- **WHEN** the system detects speech during recording
- **THEN** the system SHALL display the recognized text in real-time as the user speaks

#### Scenario: Recording stopped by user
- **WHEN** the user clicks the stop button or the button again
- **THEN** the system SHALL stop recording and process the final recognized text

#### Scenario: Recording stopped by silence
- **WHEN** no speech is detected for 5 seconds during recording
- **THEN** the system SHALL automatically stop recording and process the recognized text (if any)

### Requirement: Microphone permission handling

The system SHALL handle microphone permission states gracefully.

#### Scenario: Microphone permission granted
- **WHEN** the user grants microphone permission
- **THEN** the system SHALL proceed with voice recording

#### Scenario: Microphone permission denied
- **WHEN** the user denies microphone permission
- **THEN** the system SHALL display a message explaining that microphone access is needed for voice input and automatically fall back to typed input

#### Scenario: Microphone permission prompt
- **WHEN** the user first clicks the voice input button
- **THEN** the system SHALL trigger the browser's microphone permission prompt if not already granted