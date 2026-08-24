import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { useTranslation } from "react-i18next"
import { toast } from "sonner"
import { ArrowLeft, ArrowRight, Mic } from "lucide-react"
import { httpsCallable } from "firebase/functions"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
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
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Checkbox } from "@/components/ui/checkbox"
import { Textarea } from "@/components/ui/textarea"
import { Progress } from "@/components/ui/progress"
import { functions } from "@/lib/firebase"
import { STATES } from "@/lib/states"
import { fmtINR } from "@/lib/format"
import { useVoiceInput } from "@/lib/voice"
import { useIntakeStore } from "@/stores/intakeStore"
import type {
  ApplicantCategory,
  EducationStatus,
  MatchResponse,
} from "@/types"

const TOTAL_STEPS = 5

const projectTypes = [
  "shop",
  "manufacturing",
  "service",
  "agri",
  "higher_education",
  "other",
] as const

const educationStatuses = [
  "student",
  "below_twelfth",
  "twelfth",
  "graduate",
  "postgraduate",
  "other",
] as const

function ConsentGate({ onAccept }: { onAccept: () => void }) {
  const { t } = useTranslation()
  const [checked, setChecked] = useState(false)

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-foreground/40 p-4">
      <Card className="w-full max-w-lg border-accent/50 shadow-xl">
        <CardHeader>
          <CardTitle className="font-display text-xl">
            {t("intake.incomeConsentTitle")}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm leading-relaxed text-foreground/85">
            {t("intake.incomeConsentBody")}
          </p>
          <label className="mt-5 flex items-start gap-3 cursor-pointer">
            <Checkbox
              checked={checked}
              onCheckedChange={(v) => setChecked(v === true)}
              className="mt-0.5"
            />
            <span className="text-sm font-medium">
              {t("intake.incomeConsentAccept")}
            </span>
          </label>
          <Button
            className="mt-5 w-full"
            disabled={!checked}
            onClick={onAccept}
          >
            {t("common.next")}
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}

function VoiceDescribeField() {
  const { t } = useTranslation()
  const projectDetails = useIntakeStore((s) => s.projectDetails)
  const setField = useIntakeStore((s) => s.setField)
  // TODO(voice-intake): Web Speech API wiring lands here (hi-IN / en-IN).
  // Hook signature is ready in src/lib/voice.ts; UI slot intentionally visible.
  const voice = useVoiceInput((text) => setField("projectDetails", text))

  return (
    <div className="space-y-2">
      <Label htmlFor="project-details">{t("intake.describeLabel")}</Label>
      <div className="flex gap-2">
        <Textarea
          id="project-details"
          value={projectDetails}
          onChange={(e) => setField("projectDetails", e.target.value)}
          rows={2}
        />
        <Button
          type="button"
          variant="outline"
          size="icon"
          className="shrink-0 size-10 self-start"
          title={t("intake.voiceComingSoon")}
          disabled={!voice.supported}
          aria-label={t("intake.voiceComingSoon")}
        >
          <Mic className="size-4" />
        </Button>
      </div>
    </div>
  )
}

export default function IntakeWizard() {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const store = useIntakeStore()
  const [busy, setBusy] = useState(false)

  const {
    step,
    setStep,
    projectType,
    estimatedCost,
    annualFamilyIncome,
    educationStatus,
    category,
    state,
    consentAt,
    setField,
  } = store

  const canContinue =
    (step === 0 && Boolean(projectType) && Boolean(state)) ||
    (step === 1 && estimatedCost >= 10000) ||
    (step === 2 && annualFamilyIncome >= 0 && Boolean(consentAt)) ||
    (step === 3 && Boolean(educationStatus)) ||
    step === 4

  async function findMatches() {
    setBusy(true)
    try {
      const callable = httpsCallable<{ input: object }, MatchResponse>(
        functions,
        "matchSchemes",
      )
      const res = await callable({
        input: {
          projectType,
          estimatedCost,
          annualFamilyIncome,
          educationStatus,
          category,
          state,
        },
      })
      store.setMatch(res.data)
      navigate("/results")
    } catch (err) {
      console.error(err)
      toast.error(t("intake.matchFailed"))
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="mx-auto max-w-2xl px-4 py-10">
      <Progress
        value={((step + 1) / TOTAL_STEPS) * 100}
        className="mb-6 h-1.5"
        aria-label={t("intake.stepOf", { current: step + 1, total: TOTAL_STEPS })}
      />
      <p className="text-sm font-medium text-muted-foreground mb-1">
        {t("intake.stepOf", { current: step + 1, total: TOTAL_STEPS })}
      </p>
      <h1 className="font-display font-bold text-2xl sm:text-3xl tracking-tight mb-7">
        {step === 4 ? t("intake.reviewTitle") : t("intake.title")}
      </h1>

      {/* Step 0 — project + location */}
      {step === 0 && (
        <div className="space-y-6">
          <div className="space-y-2">
            <Label>{t("intake.projectTypeLabel")}</Label>
            <Select
              value={projectType}
              onValueChange={(v) => setField("projectType", v)}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder={t("intake.projectTypePlaceholder")} />
              </SelectTrigger>
              <SelectContent>
                {projectTypes.map((pt) => (
                  <SelectItem key={pt} value={pt}>
                    {t(`projectTypes.${pt}`)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <VoiceDescribeField />
          <div className="space-y-2">
            <Label>{t("intake.stateLabel")}</Label>
            <Select value={state} onValueChange={(v) => setField("state", v)}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder={t("intake.statePlaceholder")} />
              </SelectTrigger>
              <SelectContent>
                {STATES.map((st) => (
                  <SelectItem key={st} value={st}>
                    {st}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      )}

      {/* Step 1 — cost */}
      {step === 1 && (
        <div className="space-y-6">
          <div>
            <div className="flex items-baseline justify-between mb-3">
              <Label htmlFor="cost">{t("intake.costLabel")}</Label>
              <span className="font-display font-bold text-2xl text-primary">
                {fmtINR(estimatedCost)}
              </span>
            </div>
            <Slider
              id="cost"
              min={10000}
              max={5000000}
              step={5000}
              value={[estimatedCost]}
              onValueChange={([v]) => setField("estimatedCost", v)}
            />
            <Input
              type="number"
              min={0}
              value={estimatedCost}
              onChange={(e) =>
                setField("estimatedCost", Math.max(0, Number(e.target.value)))
              }
              className="mt-4 max-w-48"
              aria-label={t("intake.costLabel")}
            />
          </div>
        </div>
      )}

      {/* Step 2 — income + category (consent gated) */}
      {step === 2 && (
        <div className="space-y-6">
          {!consentAt && (
            <ConsentGate
              onAccept={() => setField("consentAt", new Date().toISOString())}
            />
          )}
          <div>
            <div className="flex items-baseline justify-between mb-3">
              <Label htmlFor="income">{t("intake.incomeLabel")}</Label>
              <span className="font-display font-bold text-2xl text-primary">
                {fmtINR(annualFamilyIncome)}
              </span>
            </div>
            <Slider
              id="income"
              min={0}
              max={1000000}
              step={10000}
              value={[annualFamilyIncome]}
              onValueChange={([v]) => setField("annualFamilyIncome", v)}
            />
            <p
              className={`mt-2 text-xs font-medium ${
                annualFamilyIncome > 500000 ? "text-destructive" : "text-muted-foreground"
              }`}
            >
              {annualFamilyIncome > 500000
                ? t("reasons.income_exceeds")
                : t("reasons.income_ok")}
            </p>
          </div>
          <fieldset className="space-y-3">
            <legend className="text-sm font-medium mb-1">
              {t("intake.categoryLabel")}
            </legend>
            <RadioGroup
              value={category}
              onValueChange={(v) => setField("category", v as ApplicantCategory)}
              className="gap-2"
            >
              {(["sc", "other"] as const).map((c) => (
                <label
                  key={c}
                  className="flex items-center gap-3 rounded-lg border border-border px-4 py-3 cursor-pointer hover:bg-secondary has-[button[data-state=checked]]:border-primary"
                >
                  <RadioGroupItem value={c} />
                  <span className="text-sm font-medium">
                    {t(`categories.${c}`)}
                  </span>
                </label>
              ))}
            </RadioGroup>
          </fieldset>
        </div>
      )}

      {/* Step 3 — education */}
      {step === 3 && (
        <fieldset className="space-y-3">
          <legend className="text-sm font-medium mb-1">
            {t("intake.educationLabel")}
          </legend>
          <RadioGroup
            value={educationStatus}
            onValueChange={(v) =>
              setField("educationStatus", v as EducationStatus)
            }
            className="gap-2"
          >
            {educationStatuses.map((es) => (
              <label
                key={es}
                className="flex items-center gap-3 rounded-lg border border-border px-4 py-3 cursor-pointer hover:bg-secondary has-[button[data-state=checked]]:border-primary"
              >
                <RadioGroupItem value={es} />
                <span className="text-sm font-medium">
                  {t(`educationStatuses.${es}`)}
                </span>
              </label>
            ))}
          </RadioGroup>
        </fieldset>
      )}

      {/* Step 4 — review */}
      {step === 4 && (
        <dl className="rounded-lg border border-border divide-y divide-border bg-card overflow-hidden">
          {[
            ["reviewProjectType", projectType ? t(`projectTypes.${projectType}`) : ""],
            ["reviewState", state],
            ["reviewCost", fmtINR(estimatedCost)],
            ["reviewIncome", fmtINR(annualFamilyIncome)],
            ["reviewCategory", t(`categories.${category}`)],
            ["reviewEducation", t(`educationStatuses.${educationStatus}`)],
          ].map(([key, value]) => (
            <div key={key} className="flex justify-between gap-4 px-4 py-3">
              <dt className="text-sm text-muted-foreground">{t(`intake.${key}`)}</dt>
              <dd className="text-sm font-semibold text-right">{value}</dd>
            </div>
          ))}
        </dl>
      )}

      {/* Nav buttons */}
      <div className="mt-8 flex justify-between gap-3">
        <Button
          variant="outline"
          onClick={() => setStep(Math.max(0, step - 1))}
          disabled={step === 0 || busy}
        >
          <ArrowLeft className="mr-1.5 size-4" />
          {t("common.back")}
        </Button>
        {step < TOTAL_STEPS - 1 ? (
          <Button onClick={() => setStep(step + 1)} disabled={!canContinue}>
            {t("common.next")}
            <ArrowRight className="ml-1.5 size-4" />
          </Button>
        ) : (
          <Button onClick={() => void findMatches()} disabled={busy}>
            {busy ? t("intake.matching") : t("intake.findSchemesCta")}
          </Button>
        )}
      </div>
    </div>
  )
}
