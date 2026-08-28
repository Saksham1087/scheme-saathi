import React, { useState, useEffect, useMemo } from "react"
import { useNavigate } from "react-router-dom"
import { useTranslation } from "react-i18next"
import { toast } from "sonner"
import {
  Mic,
  MicOff,
  Volume2,
  VolumeX,
  RotateCcw,
  Check,
  Store,
  Building2,
  Wrench,
  Tractor,
  GraduationCap,
  Sparkles,
  Palette,
  Briefcase,
  MapPin,
  Users,
  IndianRupee,
  Calendar,
  AlertCircle,
  ArrowRight,
} from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  useVoiceRecognition,
  normalizeSpeechLang,
  type SupportedSpeechLang,
} from "@/lib/voice"
import {
  extractVoiceEntities,
  type ExtractedVoiceEntities,
} from "@/lib/nlpExtractor"
import { useIntakeStore } from "@/stores/intakeStore"
import { fmtINR } from "@/lib/format"

export interface VoiceIntakeModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onApplied?: (entities: ExtractedVoiceEntities) => void
}

const PURPOSE_ICONS: Record<string, React.ElementType> = {
  shop: Store,
  service: Wrench,
  manufacturing: Building2,
  agri: Tractor,
  higher_education: GraduationCap,
  sanitation: Sparkles,
  artisan: Palette,
  other: Briefcase,
}

const EXAMPLE_PROMPTS: Record<SupportedSpeechLang, string[]> = {
  "hi-IN": [
    "मुझे किराना दुकान के लिए 1 लाख 50 हजार का लोन चाहिए",
    "उत्तर प्रदेश में सिलाई सेंटर के लिए 2 लाख का लोन",
    "एससी कैटेगरी से हूँ, उच्च शिक्षा के लिए 4 लाख चाहिए",
  ],
  "mr-IN": [
    "मला शेती आणि ट्रॅक्टरसाठी २ लाख रुपये कर्ज हवे आहे",
    "महाराष्ट्रात किराणा दुकानासाठी १.५ लाख रुपयांचे कर्ज",
    "उच्च शिक्षणासाठी ४ लाख रुपयांचे शैक्षणिक कर्ज",
  ],
  "en-IN": [
    "Need a 1.5 lakh loan to start a grocery shop in Maharashtra",
    "Looking for 4 lakh higher education loan for college",
    "SC category applicant, need 75 thousand for auto repair service",
  ],
}

export function VoiceIntakeModal({
  open,
  onOpenChange,
  onApplied,
}: VoiceIntakeModalProps) {
  const { t, i18n } = useTranslation()
  const navigate = useNavigate()
  const store = useIntakeStore()

  const [selectedLang, setSelectedLang] = useState<SupportedSpeechLang>(() =>
    normalizeSpeechLang(i18n.language),
  )
  const [manualTranscript, setManualTranscript] = useState("")

  const voice = useVoiceRecognition({
    initialLang: selectedLang,
    continuous: true,
  })

  // Sync modal language with voice recognition language
  const handleLangChange = (newLang: SupportedSpeechLang) => {
    setSelectedLang(newLang)
    voice.setLanguage(newLang)
  }

  // Active transcript is either live voice transcript or manual input
  const activeTranscript = voice.transcript || voice.interimTranscript || manualTranscript

  // Extract entities in real time from active transcript
  const extractedEntities = useMemo(() => {
    return extractVoiceEntities(activeTranscript)
  }, [activeTranscript])

  const hasExtractedParams = Boolean(
    extractedEntities.projectType ||
      extractedEntities.estimatedCost ||
      extractedEntities.state ||
      extractedEntities.category ||
      extractedEntities.gender ||
      extractedEntities.age ||
      extractedEntities.annualFamilyIncome ||
      extractedEntities.educationStatus,
  )

  // Stop voice and speech when modal closes
  useEffect(() => {
    if (!open) {
      voice.stop()
      voice.stopSpeaking()
    }
  }, [open]) // eslint-disable-line react-hooks/exhaustive-deps

  const handleToggleListening = () => {
    if (voice.listening) {
      voice.stop()
    } else {
      setManualTranscript("")
      voice.reset()
      voice.start()
    }
  }

  const handleSelectPrompt = (promptText: string) => {
    voice.stop()
    setManualTranscript(promptText)
  }

  const handleClear = () => {
    voice.reset()
    voice.stopSpeaking()
    setManualTranscript("")
  }

  const handleTtsReadout = () => {
    if (voice.isSpeaking) {
      voice.stopSpeaking()
      return
    }

    if (!activeTranscript) return

    let readout = ""
    if (selectedLang === "hi-IN") {
      readout = "हमें यह समझ आया: "
      if (extractedEntities.projectType) {
        readout += `प्रोजेक्ट का प्रकार ${t(`projectTypes.${extractedEntities.projectType}`)}, `
      }
      if (extractedEntities.estimatedCost) {
        readout += `ऋण राशि ${extractedEntities.estimatedCost} रुपये, `
      }
      if (extractedEntities.state) {
        readout += `राज्य ${extractedEntities.state}, `
      }
      if (extractedEntities.category) {
        readout += `श्रेणी ${extractedEntities.category.toUpperCase()}, `
      }
    } else if (selectedLang === "mr-IN") {
      readout = "आम्हाला हे समजले: "
      if (extractedEntities.projectType) {
        readout += `प्रकल्पाचा प्रकार ${t(`projectTypes.${extractedEntities.projectType}`)}, `
      }
      if (extractedEntities.estimatedCost) {
        readout += `कर्ज रक्कम ${extractedEntities.estimatedCost} रुपये, `
      }
      if (extractedEntities.state) {
        readout += `राज्य ${extractedEntities.state}, `
      }
    } else {
      readout = "We understood: "
      if (extractedEntities.projectType) {
        readout += `Purpose ${t(`projectTypes.${extractedEntities.projectType}`)}, `
      }
      if (extractedEntities.estimatedCost) {
        readout += `Amount ${fmtINR(extractedEntities.estimatedCost)}, `
      }
      if (extractedEntities.state) {
        readout += `State ${extractedEntities.state}, `
      }
      if (extractedEntities.category) {
        readout += `Category ${extractedEntities.category.toUpperCase()}, `
      }
    }

    if (!readout || readout.endsWith(": ")) {
      readout = activeTranscript
    }

    void voice.speakText(readout, selectedLang)
  }

  const handleApplyToForm = () => {
    voice.stop()
    voice.stopSpeaking()

    let appliedCount = 0

    if (extractedEntities.state) {
      store.setField("state", extractedEntities.state)
      appliedCount++
    }
    if (extractedEntities.category) {
      store.setField("category", extractedEntities.category)
      appliedCount++
    }
    if (extractedEntities.gender) {
      store.setField("gender", extractedEntities.gender)
      appliedCount++
    }
    if (extractedEntities.age) {
      store.setField("age", extractedEntities.age)
      appliedCount++
    }
    if (extractedEntities.educationStatus) {
      store.setField("educationStatus", extractedEntities.educationStatus)
      appliedCount++
    }
    if (extractedEntities.annualFamilyIncome) {
      store.setField("annualFamilyIncome", extractedEntities.annualFamilyIncome)
      appliedCount++
    }
    if (extractedEntities.projectType) {
      store.setField("projectType", extractedEntities.projectType)
      appliedCount++
    }
    if (extractedEntities.estimatedCost) {
      store.setField("estimatedCost", extractedEntities.estimatedCost)
      appliedCount++
    }
    if (activeTranscript) {
      store.setField("projectDetails", activeTranscript)
    }

    // Advance wizard to the most relevant step (or Step 1 if state filled)
    if (extractedEntities.state && store.step === 0) {
      store.setStep(1)
    } else if (extractedEntities.projectType && extractedEntities.estimatedCost) {
      store.setStep(6) // Summary review
    }

    if (onApplied) {
      onApplied(extractedEntities)
    }

    toast.success(
      t("voice.appliedSuccess", {
        count: appliedCount,
        defaultValue: `Applied ${appliedCount} voice parameters to your intake form!`,
      }),
    )

    onOpenChange(false)
    navigate("/find-schemes")
  }

  const PurposeIcon = extractedEntities.projectType
    ? PURPOSE_ICONS[extractedEntities.projectType] || Briefcase
    : Briefcase

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-xl max-h-[90vh] overflow-y-auto p-5 sm:p-6">
        <DialogHeader className="text-left space-y-2">
          <div className="flex items-center justify-between gap-2 flex-wrap">
            <DialogTitle className="text-xl font-display font-bold flex items-center gap-2">
              <span className="flex size-7 items-center justify-center rounded-full bg-primary/10 text-primary">
                <Mic className="size-4" />
              </span>
              {t("voice.modalTitle", "Multilingual Voice Intake")}
            </DialogTitle>

            {/* Language Selector Pills */}
            <div
              className="flex items-center rounded-lg border border-border p-0.5 bg-muted/30 text-xs font-semibold"
              role="radiogroup"
              aria-label="Speech Language"
            >
              {(
                [
                  { code: "hi-IN", label: "हिंदी" },
                  { code: "mr-IN", label: "मराठी" },
                  { code: "en-IN", label: "English" },
                ] as const
              ).map(({ code, label }) => (
                <button
                  key={code}
                  type="button"
                  onClick={() => handleLangChange(code)}
                  aria-checked={selectedLang === code}
                  role="radio"
                  className={`px-2.5 py-1 rounded-md transition-all cursor-pointer ${
                    selectedLang === code
                      ? "bg-primary text-primary-foreground shadow-xs font-bold"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>

          <DialogDescription className="text-xs sm:text-sm text-muted-foreground">
            {t(
              "voice.modalDesc",
              "Speak naturally in Hindi, Marathi, or English. SchemeSathi will automatically identify your business purpose, loan amount, state, and category.",
            )}
          </DialogDescription>
        </DialogHeader>

        {/* Central Speech Capture Area */}
        <div className="my-2 flex flex-col items-center justify-center py-4 bg-gradient-to-b from-muted/30 to-background rounded-2xl border border-border/80 px-4 text-center">
          {/* Animated Glowing Ripple Microphone */}
          <div className="relative flex items-center justify-center size-28 mb-3">
            {/* Concentric Ripple Rings when listening */}
            {voice.listening && (
              <>
                <span className="absolute inline-flex size-full rounded-full bg-amber-500/20 animate-ping duration-1000" />
                <span className="absolute inline-flex size-24 rounded-full bg-emerald-500/30 animate-pulse duration-700" />
                <span className="absolute inline-flex size-20 rounded-full border-2 border-emerald-500/60 animate-spin duration-3000" />
              </>
            )}

            <Button
              type="button"
              variant={voice.listening ? "destructive" : "default"}
              size="icon"
              onClick={handleToggleListening}
              disabled={!voice.supported}
              className={`relative z-10 size-16 rounded-full shadow-lg transition-all transform hover:scale-105 active:scale-95 touch-manipulation cursor-pointer ${
                voice.listening
                  ? "bg-rose-600 hover:bg-rose-700 text-white ring-4 ring-rose-300 dark:ring-rose-900"
                  : "bg-primary hover:bg-primary/90 text-primary-foreground ring-4 ring-primary/20"
              }`}
              aria-label={
                voice.listening ? "Stop recording speech" : "Start speaking"
              }
            >
              {voice.listening ? (
                <MicOff className="size-7 animate-pulse" />
              ) : (
                <Mic className="size-7" />
              )}
            </Button>
          </div>

          {/* Status Label */}
          <div className="space-y-1 max-w-sm">
            {voice.listening ? (
              <p className="text-sm font-semibold text-emerald-600 dark:text-emerald-400 flex items-center justify-center gap-1.5 animate-pulse">
                <span className="size-2 rounded-full bg-emerald-500 inline-block" />
                {t("voice.listeningState", "Listening… Speak your needs clearly")}
              </p>
            ) : voice.error ? (
              <div className="text-xs text-destructive font-medium flex items-center justify-center gap-1.5">
                <AlertCircle className="size-3.5 shrink-0" />
                <span>{voice.error}</span>
              </div>
            ) : !voice.supported ? (
              <div className="text-xs text-amber-600 dark:text-amber-400 font-medium flex items-center justify-center gap-1.5">
                <AlertCircle className="size-3.5 shrink-0" />
                <span>
                  {t(
                    "voice.unsupportedBrowser",
                    "Web Speech is not supported in this browser. Please use keyboard form entry.",
                  )}
                </span>
              </div>
            ) : (
              <p className="text-xs font-medium text-muted-foreground">
                {t("voice.idleState", "Tap the microphone to speak, or select a sample phrase below")}
              </p>
            )}
          </div>
        </div>

        {/* Live Transcript Display Box */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              {t("voice.transcriptLabel", "Live Transcript")}
            </span>
            {activeTranscript && (
              <div className="flex items-center gap-2">
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={handleTtsReadout}
                  className="h-6 text-[11px] px-2 text-primary"
                  title="Read aloud"
                >
                  {voice.isSpeaking ? (
                    <>
                      <VolumeX className="size-3 mr-1 text-destructive" />
                      {t("voice.stopAudio", "Stop Audio")}
                    </>
                  ) : (
                    <>
                      <Volume2 className="size-3 mr-1" />
                      {t("voice.listenAudio", "Listen")}
                    </>
                  )}
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={handleClear}
                  className="h-6 text-[11px] px-2 text-muted-foreground hover:text-foreground"
                >
                  <RotateCcw className="size-3 mr-1" />
                  {t("voice.clear", "Clear")}
                </Button>
              </div>
            )}
          </div>

          <div
            className={`min-h-[64px] rounded-xl border p-3 text-sm leading-relaxed transition-all ${
              activeTranscript
                ? "border-primary/40 bg-primary/5 text-foreground font-medium"
                : "border-dashed border-border bg-muted/20 text-muted-foreground italic flex items-center justify-center text-xs"
            }`}
          >
            {activeTranscript ? (
              <div className="space-y-1">
                <p>{activeTranscript}</p>
                {voice.interimTranscript && (
                  <p className="text-xs text-muted-foreground animate-pulse">
                    …{voice.interimTranscript}
                  </p>
                )}
              </div>
            ) : (
              t("voice.noSpeechYet", "Speech will appear here in real-time as you speak…")
            )}
          </div>
        </div>

        {/* Recognized Parameter Chips */}
        {hasExtractedParams && (
          <div className="space-y-2 pt-1 animate-in fade-in-50 duration-300">
            <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              {t("voice.detectedEntities", "Extracted Parameters")}
            </span>

            <div className="flex flex-wrap gap-2">
              {extractedEntities.projectType && (
                <Badge
                  variant="outline"
                  className="bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border-emerald-500/30 px-2.5 py-1 text-xs font-medium flex items-center gap-1.5 shadow-xs"
                >
                  <PurposeIcon className="size-3.5 shrink-0" />
                  <span>
                    {t("voice.paramPurpose", "Purpose")}:{" "}
                    <strong>{t(`projectTypes.${extractedEntities.projectType}`)}</strong>
                  </span>
                </Badge>
              )}

              {extractedEntities.estimatedCost && (
                <Badge
                  variant="outline"
                  className="bg-amber-500/10 text-amber-700 dark:text-amber-300 border-amber-500/30 px-2.5 py-1 text-xs font-medium flex items-center gap-1.5 shadow-xs"
                >
                  <IndianRupee className="size-3.5 shrink-0" />
                  <span>
                    {t("voice.paramAmount", "Amount")}:{" "}
                    <strong>{fmtINR(extractedEntities.estimatedCost)}</strong>
                  </span>
                </Badge>
              )}

              {extractedEntities.state && (
                <Badge
                  variant="outline"
                  className="bg-blue-500/10 text-blue-700 dark:text-blue-300 border-blue-500/30 px-2.5 py-1 text-xs font-medium flex items-center gap-1.5 shadow-xs"
                >
                  <MapPin className="size-3.5 shrink-0" />
                  <span>
                    {t("voice.paramState", "State")}:{" "}
                    <strong>{extractedEntities.state}</strong>
                  </span>
                </Badge>
              )}

              {extractedEntities.category && (
                <Badge
                  variant="outline"
                  className="bg-purple-500/10 text-purple-700 dark:text-purple-300 border-purple-500/30 px-2.5 py-1 text-xs font-medium flex items-center gap-1.5 shadow-xs"
                >
                  <Users className="size-3.5 shrink-0" />
                  <span>
                    {t("voice.paramCategory", "Category")}:{" "}
                    <strong>{extractedEntities.category.toUpperCase()}</strong>
                  </span>
                </Badge>
              )}

              {extractedEntities.age && (
                <Badge
                  variant="outline"
                  className="bg-primary/10 text-primary border-primary/30 px-2.5 py-1 text-xs font-medium flex items-center gap-1.5 shadow-xs"
                >
                  <Calendar className="size-3.5 shrink-0" />
                  <span>
                    {t("voice.paramAge", "Age")}: <strong>{extractedEntities.age} yrs</strong>
                  </span>
                </Badge>
              )}

              {extractedEntities.gender && (
                <Badge
                  variant="outline"
                  className="bg-primary/10 text-primary border-primary/30 px-2.5 py-1 text-xs font-medium flex items-center gap-1.5 shadow-xs"
                >
                  <span>
                    {t("voice.paramGender", "Gender")}:{" "}
                    <strong>{t(`intake.gender.${extractedEntities.gender}`)}</strong>
                  </span>
                </Badge>
              )}

              {extractedEntities.annualFamilyIncome && (
                <Badge
                  variant="outline"
                  className="bg-indigo-500/10 text-indigo-700 dark:text-indigo-300 border-indigo-500/30 px-2.5 py-1 text-xs font-medium flex items-center gap-1.5 shadow-xs"
                >
                  <IndianRupee className="size-3.5 shrink-0" />
                  <span>
                    {t("voice.paramIncome", "Income")}:{" "}
                    <strong>{fmtINR(extractedEntities.annualFamilyIncome)}/yr</strong>
                  </span>
                </Badge>
              )}
            </div>
          </div>
        )}

        {/* Sample Voice Prompts */}
        <div className="space-y-2 pt-1">
          <p className="text-[11px] font-semibold text-muted-foreground">
            {t("voice.samplePromptsLabel", "Or try one of these sample phrases:")}
          </p>
          <div className="flex flex-col gap-1.5">
            {EXAMPLE_PROMPTS[selectedLang].map((prompt, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => handleSelectPrompt(prompt)}
                className="text-left text-xs p-2 rounded-lg border border-border/70 hover:border-primary/50 hover:bg-muted/40 transition-colors text-foreground/80 flex items-center justify-between group cursor-pointer"
              >
                <span>&ldquo;{prompt}&rdquo;</span>
                <ArrowRight className="size-3.5 opacity-0 group-hover:opacity-100 transition-opacity text-primary shrink-0 ml-2" />
              </button>
            ))}
          </div>
        </div>

        {/* Modal Footer Actions */}
        <div className="pt-3 border-t border-border flex items-center justify-between gap-3 flex-wrap sm:flex-nowrap">
          <Button
            type="button"
            variant="outline"
            onClick={() => {
              onOpenChange(false)
              navigate("/find-schemes")
            }}
            className="w-full sm:w-auto text-xs min-h-[40px]"
          >
            {t("voice.manualFormBtn", "Use Manual Form")}
          </Button>

          <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="text-xs min-h-[40px]"
            >
              {t("common.cancel", "Cancel")}
            </Button>

            <Button
              type="button"
              onClick={handleApplyToForm}
              disabled={!activeTranscript}
              className="text-xs font-semibold bg-primary hover:bg-primary/90 text-primary-foreground min-h-[40px] px-5 flex-1 sm:flex-initial shadow-sm"
            >
              <Check className="size-4 mr-1.5" />
              {t("voice.applyToFormCta", "Apply to Form")}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
