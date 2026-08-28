export interface VoiceRecognitionResult {
  transcript: string
  confidence: number
  isFinal: boolean
}

export type VoiceLanguage = "en-IN" | "hi-IN" | "mr-IN"

export function isVoiceSupported(): boolean {
  return typeof window !== "undefined" && ("SpeechRecognition" in window || "webkitSpeechRecognition" in window)
}

export function getLanguageCode(lang: string): VoiceLanguage {
  switch (lang) {
    case "hi": return "hi-IN"
    case "mr": return "mr-IN"
    default: return "en-IN"
  }
}
