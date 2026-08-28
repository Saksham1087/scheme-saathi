import { useState } from "react"
import { useTranslation } from "react-i18next"
import { Mic, Sparkles } from "lucide-react"
import { VoiceIntakeModal } from "./VoiceIntakeModal"

export function VoiceFloatingButton() {
  const { t } = useTranslation()
  const [modalOpen, setModalOpen] = useState(false)

  return (
    <>
      <div className="fixed bottom-6 right-6 z-40 sm:bottom-8 sm:right-8 flex items-center gap-2">
        <button
          type="button"
          onClick={() => setModalOpen(true)}
          className="group relative flex items-center gap-2 rounded-full bg-primary px-4 py-3 text-primary-foreground shadow-xl transition-all duration-300 hover:scale-105 hover:bg-primary/90 hover:shadow-2xl focus:outline-hidden focus:ring-4 focus:ring-primary/30 active:scale-95 cursor-pointer"
          aria-label={t("voice.floatingAriaLabel", "Open Voice Intake Assistant")}
          title={t("voice.floatingTooltip", "Speak to find schemes (Hindi, Marathi, English)")}
        >
          {/* Subtle Outer Glow Wave */}
          <span className="absolute -inset-1 rounded-full bg-primary/20 blur-sm group-hover:bg-primary/30 transition-all" />

          {/* Animated Inner Rings */}
          <span className="relative flex size-6 items-center justify-center">
            <Mic className="size-5 transition-transform duration-300 group-hover:scale-110" />
          </span>

          <span className="relative hidden md:inline-flex items-center gap-1.5 text-xs font-bold tracking-tight">
            <span>{t("voice.floatingBtnText", "Voice Intake")}</span>
            <Sparkles className="size-3.5 text-amber-300 animate-pulse" />
          </span>
        </button>
      </div>

      <VoiceIntakeModal open={modalOpen} onOpenChange={setModalOpen} />
    </>
  )
}
