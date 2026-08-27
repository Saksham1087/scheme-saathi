# Voice Fallback

## Purpose

TBD - Define fallback behavior when voice input fails or is unavailable, preserving conversation context.

## Requirements

### Requirement: Graceful fallback to typed input

The system SHALL fall back to typed input when voice input fails or is unavailable, without losing conversation context.

#### Scenario: Speech recognition error
- **WHEN** the speech recognition API returns an error (e.g., network error, audio capture error)
- **THEN** the system SHALL display the error message and switch to typed input mode, preserving all previously collected fields

#### Scenario: Unrecognized speech
- **WHEN** the speech recognition returns empty or unintelligible results after multiple attempts
- **THEN** the system SHALL display a message like "I couldn't understand that" and offer the user a text input field to type their answer

#### Scenario: Browser API unavailable
- **WHEN** the browser does not support the SpeechRecognition API
- **THEN** the system SHALL only show the typed input interface without any voice-related UI elements

### Requirement: Context preservation across fallback

The system SHALL preserve all conversation context when falling back from voice to typed input.

#### Scenario: Mid-conversation fallback
- **WHEN** a user is in the middle of a voice conversation and voice fails
- **THEN** the system SHALL switch to typed input with all previously collected fields intact, prompting the user for the next missing field via text

#### Scenario: Seamless mode switching
- **WHEN** a user switches from typed to voice or voice to typed mid-conversation
- **THEN** the system SHALL preserve all collected data and continue from the current question in the new input mode

### Requirement: Error state communication

The system SHALL communicate voice errors clearly to the user.

#### Scenario: Microphone denied
- **WHEN** the user denies microphone permission
- **THEN** the system SHALL display: "Microphone access is needed for voice input. You can type your answers instead."

#### Scenario: Network error during recognition
- **WHEN** the speech recognition fails due to network issues
- **THEN** the system SHALL display: "Voice recognition requires internet. Please type your answer."

#### Scenario: Silence timeout
- **WHEN** the system detects no speech for 5 seconds
- **THEN** the system SHALL display: "I didn't hear anything. You can speak again or type your answer."

### Requirement: Voice error states

The system SHALL handle specific voice error scenarios with appropriate messages.

#### Scenario: Unclear speech detected
- **WHEN** speech is detected but confidence is very low
- **THEN** the system SHALL display "I'm not sure I understood. Could you rephrase?" and offer both voice retry and text input options

#### Scenario: Too much background noise
- **WHEN** the system detects excessive noise preventing recognition
- **THEN** the system SHALL display "There's too much background noise. Please try speaking closer to the microphone or type your answer."