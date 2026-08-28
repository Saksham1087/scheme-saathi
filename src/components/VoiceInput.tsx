import { useState } from "react"
import { useTranslation } from "react-i18next"
import { Mic, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { isVoiceSupported } from "@/services/voice/types"
import { startRecognition, stopRecognition } from "@/services/voice/recognition"

interface VoiceInputProps {
  onTranscript: (text: string) => void
  disabled?: boolean
}

export function VoiceInput({ onTranscript, disabled }: VoiceInputProps) {
  const { i18n } = useTranslation()
  const [isListening, setIsListening] = useState(false)
  const supported = isVoiceSupported()

  const handleToggle = () => {
    if (isListening) {
      stopRecognition()
      setIsListening(false)
      return
    }

    setIsListening(true)
    startRecognition(
      i18n.language,
      (result) => {
        if (result.isFinal) {
          onTranscript(result.transcript)
          setIsListening(false)
        }
      },
      () => {
        setIsListening(false)
      },
    )
  }

  if (!supported) return null

  return (
    <Button
      type="button"
      size="icon"
      variant={isListening ? "default" : "outline"}
      onClick={handleToggle}
      disabled={disabled}
      className={isListening ? "animate-pulse" : ""}
    >
      {isListening ? (
        <Loader2 className="size-4 animate-spin" />
      ) : (
        <Mic className="size-4" />
      )}
    </Button>
  )
}
