import { type VoiceRecognitionResult, getLanguageCode, isVoiceSupported } from "./types"

type RecognitionCallback = (result: VoiceRecognitionResult) => void
type ErrorCallback = (error: string) => void

let recognition: any = null

export function startRecognition(
  lang: string,
  onResult: RecognitionCallback,
  onError: ErrorCallback,
): () => void {
  if (!isVoiceSupported()) {
    onError("Voice recognition not supported in this browser")
    return () => {}
  }

  const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition
  recognition = new SpeechRecognition()
  recognition.lang = getLanguageCode(lang)
  recognition.interimResults = true
  recognition.continuous = false

  recognition.onresult = (event: any) => {
    const last = event.results[event.results.length - 1]
    const result: VoiceRecognitionResult = {
      transcript: last[0].transcript,
      confidence: last[0].confidence,
      isFinal: last.isFinal,
    }
    onResult(result)
  }

  recognition.onerror = (event: any) => {
    onError(event.error || "Recognition error")
  }

  recognition.onend = () => {
    recognition = null
  }

  try {
    recognition.start()
  } catch (e) {
    onError("Failed to start recognition")
  }

  return () => {
    recognition?.stop()
    recognition = null
  }
}

export function stopRecognition(): void {
  recognition?.stop()
  recognition = null
}
