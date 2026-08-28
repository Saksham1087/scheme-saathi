import { useState, useEffect, useRef } from "react"

export interface VoiceInputController {
  supported: boolean
  listening: boolean
  start: () => void
  stop: () => void
}

export function useVoiceInput(
  onResult: (text: string) => void,
  lang: string = "en-IN",
): VoiceInputController {
  const [listening, setListening] = useState(false)
  const recognitionRef = useRef<any>(null)

  const isSupported =
    typeof window !== "undefined" &&
    Boolean(
      (window as any).SpeechRecognition ||
        (window as any).webkitSpeechRecognition,
    )

  useEffect(() => {
    if (!isSupported) return

    const SpeechRecognitionClass =
      (window as any).SpeechRecognition ||
      (window as any).webkitSpeechRecognition

    try {
      const recognition = new SpeechRecognitionClass()
      recognition.continuous = false
      recognition.interimResults = true
      recognition.lang = lang === "hi" ? "hi-IN" : "en-IN"

      recognition.onresult = (event: any) => {
        let transcript = ""
        for (let i = event.resultIndex; i < event.results.length; i++) {
          transcript += event.results[i][0].transcript
        }
        if (transcript) {
          onResult(transcript)
        }
      }

      recognition.onend = () => {
        setListening(false)
      }

      recognition.onerror = () => {
        setListening(false)
      }

      recognitionRef.current = recognition
    } catch (err) {
      console.warn("Speech recognition initialization failed:", err)
    }

    return () => {
      if (recognitionRef.current) {
        try {
          recognitionRef.current.abort()
        } catch {
          // ignore
        }
      }
    }
  }, [isSupported, lang, onResult])

  const start = () => {
    if (recognitionRef.current && !listening) {
      try {
        recognitionRef.current.start()
        setListening(true)
      } catch (err) {
        console.warn("Speech start failed:", err)
      }
    }
  }

  const stop = () => {
    if (recognitionRef.current && listening) {
      try {
        recognitionRef.current.stop()
        setListening(false)
      } catch (err) {
        console.warn("Speech stop failed:", err)
      }
    }
  }

  return {
    supported: isSupported,
    listening,
    start,
    stop,
  }
}
