// TODO(voice-intake): Web Speech API voice input for low-literacy users.
//
// Integration point: `useVoiceInput` below is designed to attach to any
// intake text field. Wire-up plan:
//   1. Feature-detect window.SpeechRecognition || window.webkitSpeechRecognition
//   2. recognition.lang = lang === "hi" ? "hi-IN" : "en-IN"
//   3. continuous = false, interimResults = true → stream into field state
//   4. Render a mic <Button> next to IntakeWizard free-text fields
//      (projectDetails first), gated on `supported`.
// Stretch goal per spec — UI slot exists, engine intentionally stubbed.

export interface VoiceInputController {
  supported: boolean
  listening: boolean
  start: () => void
  stop: () => void
}

export function useVoiceInput(_onResult: (text: string) => void): VoiceInputController {
  return {
    supported: false,
    listening: false,
    start: () => {},
    stop: () => {},
  }
}
