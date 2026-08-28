import { useState, useEffect, useRef, useCallback } from "react"

export type SupportedSpeechLang = "hi-IN" | "mr-IN" | "en-IN"

export interface VoiceRecognitionState {
  supported: boolean
  listening: boolean
  transcript: string
  interimTranscript: string
  error: string | null
  errorCode: string | null
  lang: SupportedSpeechLang
}

export interface VoiceInputController extends VoiceRecognitionState {
  start: () => void
  stop: () => void
  reset: () => void
  setLanguage: (lang: SupportedSpeechLang) => void
  speakText: (text: string, lang?: string) => Promise<void>
  stopSpeaking: () => void
  isSpeaking: boolean
}

/** Map short locale strings ('hi', 'mr', 'en') to BCP 47 speech recognition tags */
export function normalizeSpeechLang(lang?: string): SupportedSpeechLang {
  if (!lang) return "en-IN"
  const clean = lang.toLowerCase().trim()
  if (clean.startsWith("hi")) return "hi-IN"
  if (clean.startsWith("mr")) return "mr-IN"
  return "en-IN"
}

/** Check if Web Speech Recognition is supported in the browser */
export function isSpeechRecognitionSupported(): boolean {
  if (typeof window === "undefined") return false
  return Boolean(
    (window as any).SpeechRecognition ||
      (window as any).webkitSpeechRecognition,
  )
}

/** Check if Speech Synthesis is supported in the browser */
export function isSpeechSynthesisSupported(): boolean {
  if (typeof window === "undefined") return false
  return Boolean(window.speechSynthesis)
}

/** Speak text aloud using browser SpeechSynthesis */
export function speak(
  text: string,
  lang: string = "en-IN",
  onEnd?: () => void,
): Promise<void> {
  return new Promise((resolve) => {
    if (typeof window === "undefined" || !window.speechSynthesis) {
      resolve()
      return
    }

    try {
      window.speechSynthesis.cancel() // Stop any ongoing speech

      const utterance = new SpeechSynthesisUtterance(text)
      const targetLang = normalizeSpeechLang(lang)
      utterance.lang = targetLang
      utterance.rate = 0.95 // Slightly slower for clarity
      utterance.pitch = 1.0

      // Attempt to pick a voice matching the target language
      const voices = window.speechSynthesis.getVoices()
      const matchedVoice = voices.find((v) =>
        v.lang.toLowerCase().replace("_", "-").startsWith(targetLang.slice(0, 2)),
      )
      if (matchedVoice) {
        utterance.voice = matchedVoice
      }

      utterance.onend = () => {
        if (onEnd) onEnd()
        resolve()
      }

      utterance.onerror = (e) => {
        console.warn("Speech synthesis error:", e)
        if (onEnd) onEnd()
        resolve()
      }

      window.speechSynthesis.speak(utterance)
    } catch (err) {
      console.warn("Speech synthesis failed:", err)
      if (onEnd) onEnd()
      resolve()
    }
  })
}

/** Stop any active speech synthesis */
export function stopSpeaking(): void {
  if (typeof window !== "undefined" && window.speechSynthesis) {
    try {
      window.speechSynthesis.cancel()
    } catch {
      // ignore
    }
  }
}

/**
 * Enhanced hook for Web Speech API speech recognition and synthesis.
 * Supports Hindi (hi-IN), Marathi (mr-IN), and Indian English (en-IN).
 */
export function useVoiceRecognition(
  options: {
    initialLang?: SupportedSpeechLang | string
    continuous?: boolean
    onResult?: (transcript: string, isFinal: boolean) => void
    onError?: (error: string, code: string) => void
  } = {},
): VoiceInputController {
  const {
    initialLang = "en-IN",
    continuous = false,
    onResult,
    onError,
  } = options

  const [lang, setLang] = useState<SupportedSpeechLang>(() =>
    normalizeSpeechLang(initialLang),
  )
  const [listening, setListening] = useState(false)
  const [transcript, setTranscript] = useState("")
  const [interimTranscript, setInterimTranscript] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [errorCode, setErrorCode] = useState<string | null>(null)
  const [isSpeaking, setIsSpeaking] = useState(false)

  const recognitionRef = useRef<any>(null)
  const supported = isSpeechRecognitionSupported()

  // Keep latest callbacks in ref to avoid re-triggering effects
  const onResultRef = useRef(onResult)
  const onErrorRef = useRef(onError)

  useEffect(() => {
    onResultRef.current = onResult
    onErrorRef.current = onError
  }, [onResult, onError])

  const cleanupRecognition = useCallback(() => {
    if (recognitionRef.current) {
      try {
        recognitionRef.current.onresult = null
        recognitionRef.current.onend = null
        recognitionRef.current.onerror = null
        recognitionRef.current.abort()
      } catch {
        // ignore
      }
      recognitionRef.current = null
    }
  }, [])

  useEffect(() => {
    return () => {
      cleanupRecognition()
      stopSpeaking()
    }
  }, [cleanupRecognition])

  const setLanguage = useCallback((newLang: SupportedSpeechLang | string) => {
    const normalized = normalizeSpeechLang(newLang)
    setLang(normalized)
  }, [])

  const start = useCallback(() => {
    if (!supported) {
      setError("Speech recognition is not supported in this browser.")
      setErrorCode("not-supported")
      return
    }

    cleanupRecognition()
    setError(null)
    setErrorCode(null)
    setInterimTranscript("")

    const SpeechRecognitionClass =
      (window as any).SpeechRecognition ||
      (window as any).webkitSpeechRecognition

    try {
      const recognition = new SpeechRecognitionClass()
      recognition.continuous = continuous
      recognition.interimResults = true
      recognition.lang = lang

      recognition.onstart = () => {
        setListening(true)
        setError(null)
        setErrorCode(null)
      }

      recognition.onresult = (event: any) => {
        let finalStr = ""
        let interimStr = ""

        for (let i = 0; i < event.results.length; i++) {
          const res = event.results[i]
          const txt = res[0]?.transcript || ""
          if (res.isFinal) {
            finalStr += txt
          } else {
            interimStr += txt
          }
        }

        const combined = (finalStr + (interimStr ? " " + interimStr : "")).trim()
        if (finalStr) {
          setTranscript(combined)
          setInterimTranscript("")
          if (onResultRef.current) {
            onResultRef.current(combined, true)
          }
        } else {
          setInterimTranscript(interimStr)
          if (onResultRef.current) {
            onResultRef.current(interimStr, false)
          }
        }
      }

      recognition.onerror = (event: any) => {
        const code = event.error || "unknown"
        setErrorCode(code)
        let friendlyMsg = "Voice input encountered an error."

        switch (code) {
          case "not-allowed":
          case "service-not-allowed":
            friendlyMsg = "Microphone permission denied. Please allow microphone access in your browser."
            break
          case "no-speech":
            friendlyMsg = "No speech was detected. Please try speaking again."
            break
          case "audio-capture":
            friendlyMsg = "No microphone was found or microphone is busy."
            break
          case "network":
            friendlyMsg = "Network error during speech recognition. Please check your connection."
            break
          case "aborted":
            friendlyMsg = "Speech recording was stopped."
            break
          default:
            friendlyMsg = `Speech recognition error: ${code}`
        }

        setError(friendlyMsg)
        setListening(false)
        if (onErrorRef.current) {
          onErrorRef.current(friendlyMsg, code)
        }
      }

      recognition.onend = () => {
        setListening(false)
      }

      recognitionRef.current = recognition
      recognition.start()
    } catch (err: any) {
      console.warn("Speech recognition start failed:", err)
      const msg = err?.message || "Failed to start microphone."
      setError(msg)
      setErrorCode("start-failed")
      setListening(false)
    }
  }, [supported, continuous, lang, cleanupRecognition])

  const stop = useCallback(() => {
    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop()
      } catch {
        // ignore
      }
    }
    setListening(false)
  }, [])

  const reset = useCallback(() => {
    stop()
    setTranscript("")
    setInterimTranscript("")
    setError(null)
    setErrorCode(null)
  }, [stop])

  const speakText = useCallback(
    async (text: string, speakLang?: string) => {
      if (!isSpeechSynthesisSupported()) return
      setIsSpeaking(true)
      await speak(text, speakLang || lang, () => {
        setIsSpeaking(false)
      })
    },
    [lang],
  )

  const stopSpeech = useCallback(() => {
    stopSpeaking()
    setIsSpeaking(false)
  }, [])

  return {
    supported,
    listening,
    transcript,
    interimTranscript,
    error,
    errorCode,
    lang,
    start,
    stop,
    reset,
    setLanguage,
    speakText,
    stopSpeaking: stopSpeech,
    isSpeaking,
  }
}

/**
 * Backward compatible hook for existing single-input callers
 */
export function useVoiceInput(
  onResult: (text: string) => void,
  lang: string = "en-IN",
): VoiceInputController {
  return useVoiceRecognition({
    initialLang: lang,
    continuous: false,
    onResult: (text, isFinal) => {
      if (isFinal && text) {
        onResult(text)
      }
    },
  })
}
