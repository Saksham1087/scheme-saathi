# Voice Output

## Purpose

TBD - Define optional text-to-speech output for scheme recommendations with playback controls.

## Requirements

### Requirement: Text-to-speech output for results

The system SHALL provide optional text-to-speech (TTS) output for scheme recommendations.

#### Scenario: TTS enabled by user
- **WHEN** the user enables the TTS option in voice settings
- **THEN** the system SHALL read out scheme recommendation summaries using the browser SpeechSynthesis API

#### Scenario: TTS disabled (default)
- **WHEN** the user has not enabled TTS
- **THEN** the system SHALL display results as text only without audio output

#### Scenario: TTS language matching
- **WHEN** TTS is enabled and the app language is set
- **THEN** the system SHALL use the appropriate voice language for speech synthesis (e.g., Hindi voice for Hindi app language)

### Requirement: TTS content scope

TTS output SHALL be limited to concise summaries, not full scheme details.

#### Scenario: Recommendation summary readout
- **WHEN** TTS is active and scheme recommendations are displayed
- **THEN** the system SHALL read out each scheme name and a one-line summary (e.g., "Pradhan Mantri Mudra Yojana — loans up to 10 lakh for small businesses")

#### Scenario: Detailed information not read aloud
- **WHEN** a user expands a scheme for full details
- **THEN** the system SHALL NOT automatically read the full detail text via TTS

### Requirement: TTS playback controls

The system SHALL provide basic controls for TTS playback.

#### Scenario: Stop TTS
- **WHEN** TTS is playing and the user clicks stop or starts speaking
- **THEN** the system SHALL immediately stop the TTS output

#### Scenario: Replay TTS
- **WHEN** TTS has finished and the user clicks replay
- **THEN** the system SHALL read the last TTS content again