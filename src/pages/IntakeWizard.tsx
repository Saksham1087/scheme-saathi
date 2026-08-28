import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { useTranslation } from "react-i18next"
import { toast } from "sonner"
import {
  Mic,
  MicOff,
  CheckCircle2,
  Building2,
  Store,
  Wrench,
  Tractor,
  GraduationCap,
  Sparkles,
  Palette,
  Briefcase,
  UserCheck,
  Users,
} from "lucide-react"
import { httpsCallable } from "firebase/functions"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import { Checkbox } from "@/components/ui/checkbox"
import { Textarea } from "@/components/ui/textarea"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { IntakeStepCard } from "@/components/intake/IntakeStepCard"
import { IntakeSummaryReview } from "@/components/intake/IntakeSummaryReview"
import { functions } from "@/lib/firebase"
import { STATES } from "@/lib/states"
import { fmtINR } from "@/lib/format"
import { useVoiceInput } from "@/lib/voice"
import { VoiceIntakeModal } from "@/components/voice/VoiceIntakeModal"
import { useIntakeStore } from "@/stores/intakeStore"
import { matchApplicantProfile } from "@/services/matchingEngine"
import type {
  ApplicantCategory,
  EducationStatus,
  Gender,
  MatchInput,
  MatchResponse,
} from "@/types"

const TOTAL_STEPS = 7

const projectTypes = [
  { id: "shop", icon: Store },
  { id: "service", icon: Wrench },
  { id: "manufacturing", icon: Building2 },
  { id: "agri", icon: Tractor },
  { id: "higher_education", icon: GraduationCap },
  { id: "sanitation", icon: Sparkles },
  { id: "artisan", icon: Palette },
  { id: "other", icon: Briefcase },
] as const

const educationStatuses: EducationStatus[] = [
  "student",
  "below_twelfth",
  "twelfth",
  "graduate",
  "postgraduate",
  "other",
]

const genderOptions: Gender[] = ["male", "female", "transgender", "other"]

const costPresets = [
  { labelKey: "intake.costPresetMicro", value: 140000 },
  { labelKey: "intake.costPresetSmall", value: 500000 },
  { labelKey: "intake.costPresetMedium", value: 1500000 },
  { labelKey: "intake.costPresetMax", value: 5000000 },
]

function formatLakhsHelper(amount: number): string {
  if (amount <= 0) return "₹0"
  if (amount < 100000) return fmtINR(amount)
  const lakhs = (amount / 100000).toFixed(2).replace(/\.00$/, "")
  return `${fmtINR(amount)} (₹${lakhs} Lakhs)`
}

export default function IntakeWizard() {
  const { t, i18n } = useTranslation()
  const navigate = useNavigate()
  const store = useIntakeStore()
  const [busy, setBusy] = useState(false)
  const [stepError, setStepError] = useState<string | null>(null)
  const [voiceModalOpen, setVoiceModalOpen] = useState(false)

  const {
    step,
    maxVisitedStep,
    nextStep,
    prevStep,
    jumpToStep,
    reset,
    state,
    category,
    gender,
    age,
    educationStatus,
    annualFamilyIncome,
    consentAt,
    projectType,
    projectDetails,
    estimatedCost,
    setField,
    recordConsent,
    isStepValid,
    getStepError,
  } = store

  const voice = useVoiceInput(
    (text) => {
      const current = store.projectDetails
      setField(
        "projectDetails",
        current ? `${current} ${text}` : text,
      )
    },
    i18n.language,
  )

  const canAdvance = isStepValid(step)

  const handleNext = () => {
    setStepError(null)
    const errKey = getStepError(step)
    if (errKey) {
      setStepError(t(errKey))
      return
    }

    if (step < TOTAL_STEPS - 1) {
      nextStep()
    } else {
      void handleFindMatches()
    }
  }

  const handleBack = () => {
    setStepError(null)
    prevStep()
  }

  const handleReset = () => {
    reset()
    setStepError(null)
  }

  const handleJump = (targetStep: number) => {
    setStepError(null)
    jumpToStep(targetStep)
  }

  async function handleFindMatches() {
    setBusy(true)
    setStepError(null)

    const inputPayload: MatchInput = {
      state,
      category,
      gender,
      age: Number(age) || 28,
      educationStatus,
      annualFamilyIncome: Number(annualFamilyIncome) || 0,
      projectType,
      estimatedCost: Number(estimatedCost) || 300000,
      consentAt,
    }

    try {
      // Try Cloud Function first
      const callable = httpsCallable<{ input: MatchInput }, MatchResponse>(
        functions,
        "matchSchemes",
      )
      const res = await callable({ input: inputPayload })
      if (res?.data?.matches) {
        store.setMatch(res.data)
        navigate("/results")
        return
      }
      throw new Error("Invalid Cloud Function response")
    } catch (err) {
      console.warn("Cloud function unreachable, executing deterministic local matching fallback:", err)
      try {
        const localMatchResult = await matchApplicantProfile(inputPayload)
        store.setMatch(localMatchResult)
        navigate("/results")
      } catch (fallbackErr) {
        console.error("Local matching failed:", fallbackErr)
        toast.error(t("intake.matchFailed"))
      }
    } finally {
      setBusy(false)
    }
  }

  const stepTitles = [
    t("intake.step1Title"),
    t("intake.step2Title"),
    t("intake.step3Title"),
    t("intake.step4Title"),
    t("intake.step5Title"),
    t("intake.step6Title"),
    t("intake.step7Title"),
  ]

  const stepDescriptions = [
    t("intake.step1Desc"),
    t("intake.step2Desc"),
    t("intake.step3Desc"),
    t("intake.step4Desc"),
    t("intake.step5Desc"),
    t("intake.step6Desc"),
    t("intake.step7Desc"),
  ]

  return (
    <div className="mx-auto max-w-2xl px-4 py-8 sm:py-12">
      {/* Wizard Header & Stepper */}
      <div className="mb-6 space-y-3">
        <div className="flex items-center justify-between gap-2">
          <p className="text-xs sm:text-sm font-semibold text-primary uppercase tracking-wider">
            {t("intake.title")}
          </p>
          <span className="text-xs font-medium text-muted-foreground">
            {t("intake.stepOf", { current: step + 1, total: TOTAL_STEPS })}
          </span>
        </div>

        <Progress
          value={((step + 1) / TOTAL_STEPS) * 100}
          className="h-2 bg-muted transition-all duration-300"
          aria-label={t("intake.stepOf", { current: step + 1, total: TOTAL_STEPS })}
        />

        {/* Step Jump Pills */}
        <div
          className="flex items-center justify-between gap-1 overflow-x-auto py-1 scrollbar-none"
          role="navigation"
          aria-label="Intake Steps Navigation"
        >
          {Array.from({ length: TOTAL_STEPS }).map((_, idx) => {
            const isCompleted = idx < step
            const isCurrent = idx === step
            const isClickable = idx <= maxVisitedStep

            return (
              <button
                key={idx}
                type="button"
                onClick={() => isClickable && handleJump(idx)}
                disabled={!isClickable}
                aria-label={`Step ${idx + 1}`}
                aria-current={isCurrent ? "step" : undefined}
                className={`flex size-7 sm:size-8 items-center justify-center rounded-full text-xs font-bold transition-all ${
                  isCurrent
                    ? "bg-primary text-primary-foreground shadow-sm ring-2 ring-primary/30 ring-offset-2"
                    : isCompleted
                      ? "bg-primary/20 text-primary hover:bg-primary/30 cursor-pointer"
                      : isClickable
                        ? "bg-muted text-foreground hover:bg-muted/80 cursor-pointer"
                        : "bg-muted/50 text-muted-foreground opacity-50 cursor-not-allowed"
                }`}
              >
                {isCompleted ? (
                  <CheckCircle2 className="size-4 text-primary" />
                ) : (
                  idx + 1
                )}
              </button>
            )
          })}
        </div>
      </div>

      {/* Multilingual Voice Intake CTA Banner */}
      <div className="mb-6 rounded-2xl border border-primary/20 bg-gradient-to-r from-primary/10 via-primary/5 to-transparent p-4 shadow-xs flex items-center justify-between gap-4 flex-wrap sm:flex-nowrap">
        <div className="flex items-center gap-3">
          <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-sm">
            <Mic className="size-5" />
          </div>
          <div>
            <h2 className="text-sm font-display font-bold text-foreground flex items-center gap-1.5">
              <span>{t("voice.bannerTitle", "Speak Your Needs / बोलकर भरें")}</span>
              <Badge variant="secondary" className="bg-primary/20 text-primary border-transparent text-[10px] py-0 px-1.5">
                {t("voice.badgeNew", "Voice AI")}
              </Badge>
            </h2>
            <p className="text-xs text-muted-foreground mt-0.5">
              {t("voice.bannerSubtitle", "Fill your details easily in Hindi, Marathi, or English using voice input.")}
            </p>
          </div>
        </div>
        <Button
          type="button"
          onClick={() => setVoiceModalOpen(true)}
          className="w-full sm:w-auto shrink-0 bg-primary hover:bg-primary/90 text-primary-foreground text-xs font-semibold shadow-xs min-h-[40px] px-4"
        >
          <Mic className="size-3.5 mr-1.5" />
          {t("voice.bannerCta", "Start Voice Intake")}
        </Button>
      </div>

      {/* Main Step Card Container */}
      <IntakeStepCard
        currentStep={step}
        totalSteps={TOTAL_STEPS}
        title={stepTitles[step]}
        description={stepDescriptions[step]}
        error={stepError}
        canAdvance={canAdvance}
        isBusy={busy}
        isLastStep={step === TOTAL_STEPS - 1}
        nextLabel={step === TOTAL_STEPS - 1 ? t("intake.findSchemesCta") : undefined}
        onNext={handleNext}
        onBack={handleBack}
        onReset={handleReset}
      >
        {/* Step 0 (Step 1/7): State / Location */}
        {step === 0 && (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="state-select" className="text-sm font-semibold">
                {t("intake.stateLabel")}
              </Label>
              <Select
                value={state}
                onValueChange={(val) => {
                  setField("state", val)
                  setStepError(null)
                }}
              >
                <SelectTrigger id="state-select" className="min-h-[48px] w-full text-base">
                  <SelectValue placeholder={t("intake.statePlaceholder")} />
                </SelectTrigger>
                <SelectContent className="max-h-64">
                  {STATES.map((st) => (
                    <SelectItem key={st} value={st} className="py-2.5 text-sm">
                      {st}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <p className="text-xs text-muted-foreground leading-relaxed">
              {t("intake.step1Desc")}
            </p>
          </div>
        )}

        {/* Step 1 (Step 2/7): Social Category */}
        {step === 1 && (
          <div className="space-y-4">
            <Label className="text-sm font-semibold">
              {t("intake.categoryLabel")}
            </Label>
            <div className="grid grid-cols-1 gap-3">
              {(["sc", "other"] as const).map((catKey) => {
                const isSelected = category === catKey
                return (
                  <button
                    key={catKey}
                    type="button"
                    onClick={() => {
                      setField("category", catKey as ApplicantCategory)
                      setStepError(null)
                    }}
                    className={`flex items-start gap-4 rounded-xl border p-4 text-left transition-all min-h-[56px] touch-manipulation cursor-pointer ${
                      isSelected
                        ? "border-primary bg-primary/5 shadow-sm ring-2 ring-primary/20"
                        : "border-border hover:bg-muted/40"
                    }`}
                  >
                    <div
                      className={`flex size-10 shrink-0 items-center justify-center rounded-lg ${
                        isSelected ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
                      }`}
                    >
                      {catKey === "sc" ? <UserCheck className="size-5" /> : <Users className="size-5" />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-semibold text-base text-foreground">
                          {t(`categories.${catKey}`)}
                        </span>
                        {catKey === "sc" && (
                          <Badge
                            variant="secondary"
                            className="bg-primary/10 text-primary border-transparent text-xs font-semibold"
                          >
                            {t("intake.nsfdcTarget")}
                          </Badge>
                        )}
                      </div>
                      <p className="mt-1 text-xs text-muted-foreground leading-relaxed">
                        {catKey === "sc"
                          ? t("intake.categoryHelpSC")
                          : t("intake.categoryHelpOther")}
                      </p>
                    </div>
                  </button>
                )
              })}
            </div>
          </div>
        )}

        {/* Step 2 (Step 3/7): Age & Gender */}
        {step === 2 && (
          <div className="space-y-6">
            {/* Age */}
            <div className="space-y-3">
              <div className="flex items-baseline justify-between">
                <Label htmlFor="age-input" className="text-sm font-semibold">
                  {t("intake.ageLabel")}
                </Label>
                <span className="font-display font-bold text-2xl text-primary">
                  {age} <span className="text-sm font-normal text-muted-foreground">{t("schemeDetails.yearsOld")}</span>
                </span>
              </div>
              <Slider
                min={18}
                max={75}
                step={1}
                value={[Number(age) || 18]}
                onValueChange={([v]) => {
                  setField("age", v)
                  setStepError(null)
                }}
                className="py-2"
                aria-label={t("intake.ageLabel")}
              />
              <div className="flex items-center gap-3">
                <Input
                  id="age-input"
                  type="number"
                  min={18}
                  max={100}
                  value={age || ""}
                  onChange={(e) => {
                    const parsed = Number(e.target.value)
                    setField("age", parsed)
                    setStepError(null)
                  }}
                  className="max-w-28 min-h-[44px] text-base"
                />
                <span className="text-xs text-muted-foreground">
                  {t("intake.ageHelper")}
                </span>
              </div>
            </div>

            {/* Gender */}
            <div className="space-y-3 pt-2">
              <Label className="text-sm font-semibold">
                {t("intake.genderLabel")}
              </Label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {genderOptions.map((g) => {
                  const isSelected = gender === g
                  return (
                    <button
                      key={g}
                      type="button"
                      onClick={() => {
                        setField("gender", g)
                        setStepError(null)
                      }}
                      className={`flex items-center justify-between rounded-xl border p-3.5 text-left transition-all min-h-[48px] touch-manipulation cursor-pointer ${
                        isSelected
                          ? "border-primary bg-primary/5 shadow-sm ring-1 ring-primary/30 font-semibold"
                          : "border-border hover:bg-muted/40"
                      }`}
                    >
                      <span className="text-sm font-medium">
                        {t(`intake.gender.${g}`)}
                      </span>
                      {isSelected && <CheckCircle2 className="size-4 text-primary shrink-0" />}
                    </button>
                  )
                })}
              </div>
            </div>
          </div>
        )}

        {/* Step 3 (Step 4/7): Education Status */}
        {step === 3 && (
          <div className="space-y-3">
            <Label className="text-sm font-semibold">
              {t("intake.educationLabel")}
            </Label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {educationStatuses.map((es) => {
                const isSelected = educationStatus === es
                return (
                  <button
                    key={es}
                    type="button"
                    onClick={() => {
                      setField("educationStatus", es)
                      setStepError(null)
                    }}
                    className={`flex items-center justify-between rounded-xl border p-3.5 text-left transition-all min-h-[52px] touch-manipulation cursor-pointer ${
                      isSelected
                        ? "border-primary bg-primary/5 shadow-sm ring-1 ring-primary/30"
                        : "border-border hover:bg-muted/40"
                    }`}
                  >
                    <span className="text-sm font-medium text-foreground">
                      {t(`educationStatuses.${es}`)}
                    </span>
                    {isSelected && <CheckCircle2 className="size-4 text-primary shrink-0" />}
                  </button>
                )
              })}
            </div>
          </div>
        )}

        {/* Step 4 (Step 5/7): Annual Family Income & Consent */}
        {step === 4 && (
          <div className="space-y-6">
            <div className="space-y-3">
              <div className="flex items-baseline justify-between flex-wrap gap-1">
                <Label htmlFor="income-input" className="text-sm font-semibold">
                  {t("intake.incomeLabel")}
                </Label>
                <span className="font-display font-bold text-2xl text-primary">
                  {formatLakhsHelper(annualFamilyIncome)}
                </span>
              </div>

              <Slider
                id="income-slider"
                min={0}
                max={1000000}
                step={10000}
                value={[Math.min(1000000, Math.max(0, annualFamilyIncome))]}
                onValueChange={([v]) => {
                  setField("annualFamilyIncome", v)
                  setStepError(null)
                }}
                className="py-2"
                aria-label={t("intake.incomeLabel")}
              />

              <div className="flex items-center gap-3">
                <div className="relative max-w-44">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm">
                    ₹
                  </span>
                  <Input
                    id="income-input"
                    type="number"
                    min={0}
                    step={5000}
                    value={annualFamilyIncome || ""}
                    onChange={(e) => {
                      const val = Math.max(0, Number(e.target.value))
                      setField("annualFamilyIncome", val)
                      setStepError(null)
                    }}
                    className="pl-7 min-h-[44px] text-base"
                  />
                </div>
                <p
                  className={`text-xs font-medium ${
                    annualFamilyIncome > 500000 ? "text-amber-600 dark:text-amber-400" : "text-success"
                  }`}
                >
                  {annualFamilyIncome > 500000
                    ? t("intake.aboveCeilingWarning")
                    : t("intake.withinCeiling")}
                </p>
              </div>
            </div>

            {/* Statutory Consent Card */}
            <div className="rounded-xl border border-primary/20 bg-primary/5 p-4 space-y-3">
              <div className="flex items-center gap-2">
                <UserCheck className="size-4 text-primary shrink-0" />
                <h3 className="font-display text-sm font-bold text-foreground">
                  {t("intake.incomeConsentTitle")}
                </h3>
              </div>
              <p className="text-xs leading-relaxed text-foreground/80">
                {t("intake.incomeConsentBody")}
              </p>
              <label className="flex items-start gap-3 pt-1 cursor-pointer select-none">
                <Checkbox
                  checked={Boolean(consentAt)}
                  onCheckedChange={(checked) => {
                    if (checked) {
                      recordConsent()
                      setStepError(null)
                    } else {
                      setField("consentAt", null)
                    }
                  }}
                  className="mt-0.5 size-5"
                />
                <span className="text-xs font-semibold text-foreground">
                  {t("intake.incomeConsentAccept")}
                </span>
              </label>
            </div>
          </div>
        )}

        {/* Step 5 (Step 6/7): Business / Loan Purpose */}
        {step === 5 && (
          <div className="space-y-6">
            <div className="space-y-3">
              <Label className="text-sm font-semibold">
                {t("intake.projectTypeLabel")}
              </Label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {projectTypes.map((pt) => {
                  const Icon = pt.icon
                  const isSelected = projectType === pt.id
                  return (
                    <button
                      key={pt.id}
                      type="button"
                      onClick={() => {
                        setField("projectType", pt.id)
                        setStepError(null)
                      }}
                      className={`flex items-center gap-3 rounded-xl border p-3.5 text-left transition-all min-h-[56px] touch-manipulation cursor-pointer ${
                        isSelected
                          ? "border-primary bg-primary/5 shadow-sm ring-1 ring-primary/30"
                          : "border-border hover:bg-muted/40"
                      }`}
                    >
                      <div
                        className={`flex size-9 shrink-0 items-center justify-center rounded-lg ${
                          isSelected ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
                        }`}
                      >
                        <Icon className="size-4.5" />
                      </div>
                      <span className="text-sm font-medium text-foreground flex-1">
                        {t(`projectTypes.${pt.id}`)}
                      </span>
                      {isSelected && <CheckCircle2 className="size-4 text-primary shrink-0" />}
                    </button>
                  )
                })}
              </div>
            </div>

            {/* Optional Project Description with Voice Input */}
            <div className="space-y-2 pt-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="project-desc" className="text-xs font-semibold text-muted-foreground">
                  {t("intake.describeLabel")}
                </Label>
                {voice.supported && (
                  <span className="text-[11px] text-muted-foreground">
                    {voice.listening ? (
                      <span className="text-primary font-semibold animate-pulse">
                        {t("intake.voiceRecording")}
                      </span>
                    ) : (
                      t("intake.voiceComingSoon")
                    )}
                  </span>
                )}
              </div>
              <div className="relative">
                <Textarea
                  id="project-desc"
                  value={projectDetails}
                  onChange={(e) => setField("projectDetails", e.target.value)}
                  placeholder={t("intake.describePlaceholder")}
                  rows={2}
                  className="pr-12 text-sm resize-none min-h-[64px]"
                />
                {voice.supported && (
                  <Button
                    type="button"
                    variant={voice.listening ? "default" : "outline"}
                    size="icon"
                    onClick={() => {
                      if (voice.listening) {
                        voice.stop()
                      } else {
                        voice.start()
                      }
                    }}
                    className={`absolute right-2 top-2 size-8 rounded-lg ${
                      voice.listening ? "bg-destructive text-destructive-foreground animate-pulse" : ""
                    }`}
                    title={voice.listening ? "Stop voice recording" : "Start voice recording"}
                    aria-label={voice.listening ? "Stop voice recording" : "Start voice recording"}
                  >
                    {voice.listening ? (
                      <MicOff className="size-4" />
                    ) : (
                      <Mic className="size-4" />
                    )}
                  </Button>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Step 6 (Step 7/7): Project Cost & Summary Review */}
        {step === 6 && (
          <div className="space-y-6">
            {/* Cost Input and Presets */}
            <div className="space-y-3">
              <div className="flex items-baseline justify-between flex-wrap gap-1">
                <Label htmlFor="cost-input" className="text-sm font-semibold">
                  {t("intake.costLabel")}
                </Label>
                <span className="font-display font-bold text-2xl text-primary">
                  {formatLakhsHelper(estimatedCost)}
                </span>
              </div>

              <Slider
                id="cost-slider"
                min={10000}
                max={5000000}
                step={10000}
                value={[Math.min(5000000, Math.max(10000, estimatedCost))]}
                onValueChange={([v]) => {
                  setField("estimatedCost", v)
                  setStepError(null)
                }}
                className="py-2"
                aria-label={t("intake.costLabel")}
              />

              <div className="flex items-center gap-3">
                <div className="relative max-w-48">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm">
                    ₹
                  </span>
                  <Input
                    id="cost-input"
                    type="number"
                    min={10000}
                    step={10000}
                    value={estimatedCost || ""}
                    onChange={(e) => {
                      const val = Math.max(0, Number(e.target.value))
                      setField("estimatedCost", val)
                      setStepError(null)
                    }}
                    className="pl-7 min-h-[44px] text-base"
                  />
                </div>
              </div>

              {/* Preset Chips */}
              <div className="pt-1">
                <p className="text-xs font-semibold text-muted-foreground mb-2">
                  {t("intake.costPresets")}
                </p>
                <div className="flex flex-wrap gap-2">
                  {costPresets.map((preset) => (
                    <Button
                      key={preset.value}
                      type="button"
                      variant={estimatedCost === preset.value ? "default" : "outline"}
                      size="sm"
                      onClick={() => {
                        setField("estimatedCost", preset.value)
                        setStepError(null)
                      }}
                      className="h-8 text-xs font-medium rounded-full touch-manipulation"
                    >
                      {t(preset.labelKey)}
                    </Button>
                  ))}
                </div>
              </div>
            </div>

            {/* Profile Review Summary */}
            <div className="pt-2">
              <div className="mb-3">
                <h3 className="font-display font-bold text-base text-foreground">
                  {t("intake.reviewTitle")}
                </h3>
                <p className="text-xs text-muted-foreground">
                  {t("intake.reviewSubtitle")}
                </p>
              </div>
              <IntakeSummaryReview
                data={{
                  state,
                  category,
                  age,
                  gender,
                  educationStatus,
                  annualFamilyIncome,
                  consentAt,
                  projectType,
                  projectDetails,
                  estimatedCost,
                }}
                onEditStep={handleJump}
              />
            </div>
          </div>
        )}
      </IntakeStepCard>

      <VoiceIntakeModal
        open={voiceModalOpen}
        onOpenChange={setVoiceModalOpen}
      />
    </div>
  )
}
