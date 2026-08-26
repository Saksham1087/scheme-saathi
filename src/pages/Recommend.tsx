import { useState, useMemo } from "react"
import { Link } from "react-router-dom"
import { useTranslation } from "react-i18next"
import {
  ArrowLeft,
  ArrowRight,
  Calculator,
  CheckCircle2,
  ChevronRight,
  Info,
  Shield,
  XCircle,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { getAllSchemes } from "@/data"
import {
  runRecommendation,
  getNoMatchAlternatives,
  type RecommendationResult,
} from "@/services/recommendation/engine"
import type { AssessmentInput, Explanation } from "@/types/assessment"

/* ------------------------------------------------------------------ */
/*  Steps config                                                       */
/* ------------------------------------------------------------------ */

const steps = [
  { key: "income", fields: ["annualFamilyIncome"] },
  { key: "category", fields: ["category"] },
  { key: "state", fields: ["state"] },
  { key: "age", fields: ["age"] },
  { key: "gender", fields: ["gender"] },
  { key: "disability", fields: ["disability"] },
  { key: "occupation", fields: ["occupation"] },
  { key: "purpose", fields: ["purpose", "projectCost"] },
] as const

const states = [
  "Andhra Pradesh", "Bihar", "Chhattisgarh", "Delhi", "Goa", "Gujarat",
  "Haryana", "Himachal Pradesh", "Jharkhand", "Karnataka", "Kerala",
  "Madhya Pradesh", "Maharashtra", "Odisha", "Punjab", "Rajasthan",
  "Tamil Nadu", "Telangana", "Uttar Pradesh", "West Bengal",
]

const occupations = [
  "agriculture", "manufacturing", "service", "trading",
  "student", "self-employed", "employed", "other",
]

const purposes = [
  "shop", "manufacturing", "service", "agri",
  "higher_education", "other",
]

/* ------------------------------------------------------------------ */
/*  Confidence badge                                                   */
/* ------------------------------------------------------------------ */

function ConfidenceBadge({ confidence }: { confidence: number }) {
  const color =
    confidence >= 80
      ? "bg-success/10 text-success border-success/20"
      : confidence >= 50
        ? "bg-yellow-50 text-yellow-700 border-yellow-200"
        : "bg-muted text-muted-foreground border-border"

  return (
    <Badge variant="outline" className={`text-xs ${color}`}>
      <Shield className="mr-1 size-3" />
      {confidence}% {confidence >= 80 ? "matched" : "partial"}
    </Badge>
  )
}

/* ------------------------------------------------------------------ */
/*  Score bar                                                          */
/* ------------------------------------------------------------------ */

function MatchScoreBar({ score }: { score: number }) {
  return (
    <div className="flex items-center gap-2">
      <div className="h-2 flex-1 rounded-full bg-secondary overflow-hidden">
        <div
          className="h-full rounded-full bg-primary transition-all"
          style={{ width: `${score}%` }}
        />
      </div>
      <span className="text-sm font-semibold tabular-nums w-10 text-right">
        {score}%
      </span>
    </div>
  )
}

/* ------------------------------------------------------------------ */
/*  Explanation list                                                   */
/* ------------------------------------------------------------------ */

function ExplanationList({ items }: { items: Explanation[] }) {
  return (
    <ul className="space-y-1.5">
      {items.map((exp, i) => (
        <li key={i} className="flex items-start gap-2 text-sm">
          {exp.type === "acceptance" ? (
            <CheckCircle2 className="size-4 shrink-0 mt-0.5 text-success" />
          ) : (
            <XCircle className="size-4 shrink-0 mt-0.5 text-destructive" />
          )}
          <span className={exp.type === "rejection" ? "text-muted-foreground" : ""}>
            {exp.text}
          </span>
        </li>
      ))}
    </ul>
  )
}

/* ------------------------------------------------------------------ */
/*  Recommendation card                                                */
/* ------------------------------------------------------------------ */

function RecommendationCard({
  result,
  t,
}: {
  result: RecommendationResult
  t: (key: string) => string
}) {
  const scheme = result.scheme
  const name =
    (scheme.name as Record<string, string>)[
      (i18n?.language as string) || "en"
    ] || scheme.name.en
  const fa = scheme.financialAssistance

  const acceptanceExps = result.explanations.filter((e) => e.type === "acceptance")
  const rejectionExps = result.explanations.filter((e) => e.type === "rejection")

  return (
    <Card className="border-border">
      <CardHeader>
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <Badge
                variant={result.eligible ? "default" : "secondary"}
                className={`text-xs ${result.eligible ? "bg-success text-success-foreground" : ""}`}
              >
                {result.eligible
                  ? t("recommend.eligible")
                  : t("recommend.notEligible")}
              </Badge>
              <ConfidenceBadge confidence={result.eligibility.confidence} />
            </div>
            <CardTitle className="font-display text-lg">{name}</CardTitle>
            <p className="text-xs text-muted-foreground mt-1">{scheme.ministry}</p>
          </div>
          <div className="text-right shrink-0">
            <p className="text-xs text-muted-foreground">
              {t("recommend.matchScore")}
            </p>
            <p className="text-2xl font-bold text-primary">{result.matchScore}%</p>
          </div>
        </div>
        <MatchScoreBar score={result.matchScore} />
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-3 text-sm">
          <div>
            <p className="text-xs text-muted-foreground">{t("recommend.loanRange")}</p>
            <p className="font-medium">
              ₹{(fa.minAmount / 100000).toFixed(1)}L – ₹{(fa.maxAmount / 100000).toFixed(1)}L
            </p>
          </div>
          {fa.interestRate && (
            <div>
              <p className="text-xs text-muted-foreground">{t("recommend.interestRate")}</p>
              <p className="font-medium">{fa.interestRate.min}%–{fa.interestRate.max}%</p>
            </div>
          )}
        </div>

        {acceptanceExps.length > 0 && (
          <div>
            <p className="text-sm font-semibold mb-2 flex items-center gap-1.5">
              <CheckCircle2 className="size-4 text-success" />
              {t("recommend.whyRecommended")}
            </p>
            <ExplanationList items={acceptanceExps} />
          </div>
        )}

        {rejectionExps.length > 0 && (
          <div>
            <p className="text-sm font-semibold mb-2 flex items-center gap-1.5">
              <XCircle className="size-4 text-destructive" />
              {t("recommend.whyNotFit")}
            </p>
            <ExplanationList items={rejectionExps} />
          </div>
        )}

        <div className="flex flex-wrap gap-2 pt-2">
          <Button size="sm" asChild>
            <Link to="/calculator">
              <Calculator className="mr-1.5 size-3.5" />
              {t("recommend.calcEmi")}
            </Link>
          </Button>
          <Button size="sm" variant="outline" asChild>
            <Link to={`/schemes/${scheme.slug}`}>
              {t("recommend.viewDetails")}
              <ArrowRight className="ml-1.5 size-3.5" />
            </Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

/* ------------------------------------------------------------------ */
/*  Main page                                                          */
/* ------------------------------------------------------------------ */

let i18n: { language: string } = { language: "en" }

export default function Recommend() {
  const { t, i18n: realI18n } = useTranslation()
  i18n = realI18n
  const lang = realI18n.language as "en" | "hi" | "mr"

  const [step, setStep] = useState(0)
  const [showResults, setShowResults] = useState(false)
  const [input, setInput] = useState<Partial<AssessmentInput>>({
    category: "sc",
    annualFamilyIncome: 250000,
    age: 28,
    state: "",
    occupation: "",
    education: "",
    purpose: "",
    projectCost: undefined,
    gender: undefined,
    disability: undefined,
  })

  const currentStep = steps[step]
  const isLast = step === steps.length - 1

  function handleNext() {
    if (isLast) {
      setShowResults(true)
    } else {
      setStep((s) => s + 1)
    }
  }

  function handleBack() {
    setStep((s) => Math.max(0, s - 1))
  }

  function handleReset() {
    setStep(0)
    setShowResults(false)
    setInput({
      category: "sc",
      annualFamilyIncome: 250000,
      age: 28,
      state: "",
      occupation: "",
      education: "",
      purpose: "",
      projectCost: undefined,
      gender: undefined,
      disability: undefined,
    })
  }

  const results = useMemo(() => {
    if (!showResults) return []
    return runRecommendation(
      getAllSchemes(),
      input as AssessmentInput,
      lang,
    )
  }, [showResults, input, lang])

  const eligible = results.filter((r) => r.eligible)
  const noMatch = getNoMatchAlternatives(results)

  const canProceed = () => {
    if (step === 0) return true
    if (step === 1) return !!input.category
    if (step === 2) return !!input.state
    if (step === 3) return !!input.age
    if (step === 4) return true // gender is optional
    if (step === 5) return true // disability is optional
    if (step === 6) return !!input.occupation
    if (step === 7) return !!input.purpose
    return true
  }

  function updateField<K extends keyof AssessmentInput>(key: K, value: AssessmentInput[K]) {
    setInput((prev) => ({ ...prev, [key]: value }))
  }

  /* ---- Results view ---- */
  if (showResults) {
    return (
      <main className="mx-auto max-w-4xl px-4 py-8">
        <div className="flex items-center justify-between gap-4 mb-6">
          <div>
            <h1 className="font-display font-bold text-3xl tracking-tight">
              {t("recommend.title")}
            </h1>
            <p className="mt-1 text-sm text-muted-foreground">
              {t("recommend.indicative")}
            </p>
          </div>
          <Button variant="outline" size="sm" onClick={handleReset}>
            {t("recommend.startOver")}
          </Button>
        </div>

        {eligible.length > 0 ? (
          <>
            <p className="mb-4 text-sm font-medium text-success">
              {eligible.length} {t("recommend.schemesFound")}
            </p>
            <div className="space-y-5">
              {eligible.map((r) => (
                <RecommendationCard key={r.scheme.slug} result={r} t={t} />
              ))}
            </div>
          </>
        ) : (
          <Card className="border-border">
            <CardContent className="py-8 text-center">
              <Info className="size-8 mx-auto text-muted-foreground mb-3" />
              <p className="text-lg font-medium">{t("recommend.noMatchTitle")}</p>
              <p className="mt-2 text-sm text-muted-foreground max-w-md mx-auto">
                {t("recommend.noMatchDesc")}
              </p>
              {noMatch.length > 0 && (
                <div className="mt-6 space-y-4 text-left">
                  <p className="text-sm font-semibold">{t("recommend.alternatives")}</p>
                  {noMatch.map((r) => (
                    <RecommendationCard key={r.scheme.slug} result={r} t={t} />
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        )}
      </main>
    )
  }

  /* ---- Assessment view ---- */
  return (
    <main className="mx-auto max-w-2xl px-4 py-8">
      <h1 className="font-display font-bold text-3xl tracking-tight">
        {t("recommend.assessmentTitle")}
      </h1>
      <p className="mt-2 text-sm text-muted-foreground">
        {t("recommend.assessmentSubtitle")}
      </p>

      {/* Progress */}
      <div className="mt-6 flex items-center gap-1.5 flex-wrap">
        {steps.map((s, i) => (
          <div key={s.key} className="flex items-center gap-1.5">
            <div
              className={`size-7 rounded-full flex items-center justify-center text-xs font-bold transition-colors ${
                i < step
                  ? "bg-success text-success-foreground"
                  : i === step
                    ? "bg-primary text-primary-foreground"
                    : "bg-secondary text-secondary-foreground"
              }`}
            >
              {i < step ? "✓" : i + 1}
            </div>
            {i < steps.length - 1 && (
              <div
                className={`w-6 h-0.5 ${
                  i < step ? "bg-success" : "bg-secondary"
                }`}
              />
            )}
          </div>
        ))}
      </div>

      <Card className="mt-6 border-border">
        <CardHeader>
          <CardTitle className="font-display text-lg">
            {t(`recommend.steps.${currentStep.key}.title`)}
          </CardTitle>
          <p className="text-sm text-muted-foreground">
            {t(`recommend.steps.${currentStep.key}.description`)}
          </p>
        </CardHeader>
        <CardContent className="space-y-4">
          {currentStep.key === "income" && (
            <div>
              <Label>{t("recommend.incomeLabel")}</Label>
              <Input
                type="number"
                value={input.annualFamilyIncome || ""}
                onChange={(e) =>
                  updateField("annualFamilyIncome", Number(e.target.value))
                }
                placeholder="e.g. 250000"
                className="mt-1.5"
              />
              <p className="text-xs text-muted-foreground mt-1">
                {t("recommend.incomeHint")}
              </p>
            </div>
          )}

          {currentStep.key === "category" && (
            <div className="space-y-2">
              <Label>{t("recommend.categoryLabel")}</Label>
              {["sc", "other"].map((cat) => (
                <button
                  key={cat}
                  onClick={() => updateField("category", cat as "sc" | "other")}
                  className={`w-full text-left p-3 rounded-lg border transition-colors ${
                    input.category === cat
                      ? "border-primary bg-primary/5"
                      : "border-border hover:bg-secondary"
                  }`}
                >
                  <span className="text-sm font-medium">
                    {t(`categories.${cat}`)}
                  </span>
                </button>
              ))}
            </div>
          )}

          {currentStep.key === "state" && (
            <div>
              <Label>{t("recommend.stateLabel")}</Label>
              <Select
                value={input.state || ""}
                onValueChange={(v) => updateField("state", v)}
              >
                <SelectTrigger className="mt-1.5">
                  <SelectValue placeholder={t("recommend.statePlaceholder")} />
                </SelectTrigger>
                <SelectContent>
                  {states.map((s) => (
                    <SelectItem key={s} value={s}>
                      {s}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          {currentStep.key === "age" && (
            <div>
              <Label>{t("recommend.ageLabel")}</Label>
              <Input
                type="number"
                value={input.age || ""}
                onChange={(e) => updateField("age", Number(e.target.value))}
                min={18}
                max={70}
                className="mt-1.5"
              />
            </div>
          )}

          {currentStep.key === "gender" && (
            <div className="space-y-2">
              <Label>{t("recommend.genderLabel")}</Label>
              <p className="text-xs text-muted-foreground">
                {t("recommend.genderHint")}
              </p>
              {[
                { value: "male", label: t("recommend.genders.male") },
                { value: "female", label: t("recommend.genders.female") },
                { value: "other", label: t("recommend.genders.other") },
              ].map((g) => (
                <button
                  key={g.value}
                  onClick={() => updateField("gender", g.value)}
                  className={`w-full text-left p-3 rounded-lg border transition-colors ${
                    input.gender === g.value
                      ? "border-primary bg-primary/5"
                      : "border-border hover:bg-secondary"
                  }`}
                >
                  <span className="text-sm font-medium">{g.label}</span>
                </button>
              ))}
            </div>
          )}

          {currentStep.key === "disability" && (
            <div className="space-y-2">
              <Label>{t("recommend.disabilityLabel")}</Label>
              <p className="text-xs text-muted-foreground">
                {t("recommend.disabilityHint")}
              </p>
              {[
                { value: true, label: t("recommend.disabilityOptions.yes") },
                { value: false, label: t("recommend.disabilityOptions.no") },
              ].map((d) => (
                <button
                  key={String(d.value)}
                  onClick={() => updateField("disability", d.value)}
                  className={`w-full text-left p-3 rounded-lg border transition-colors ${
                    input.disability === d.value
                      ? "border-primary bg-primary/5"
                      : "border-border hover:bg-secondary"
                  }`}
                >
                  <span className="text-sm font-medium">{d.label}</span>
                </button>
              ))}
            </div>
          )}

          {currentStep.key === "occupation" && (
            <div className="space-y-2">
              <Label>{t("recommend.occupationLabel")}</Label>
              {occupations.map((occ) => (
                <button
                  key={occ}
                  onClick={() => updateField("occupation", occ)}
                  className={`w-full text-left p-3 rounded-lg border transition-colors ${
                    input.occupation === occ
                      ? "border-primary bg-primary/5"
                      : "border-border hover:bg-secondary"
                  }`}
                >
                  <span className="text-sm font-medium">
                    {t(`recommend.occupations.${occ}`)}
                  </span>
                </button>
              ))}
            </div>
          )}

          {currentStep.key === "purpose" && (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>{t("recommend.purposeLabel")}</Label>
                {purposes.map((p) => (
                  <button
                    key={p}
                    onClick={() => updateField("purpose", p)}
                    className={`w-full text-left p-3 rounded-lg border transition-colors ${
                      input.purpose === p
                        ? "border-primary bg-primary/5"
                        : "border-border hover:bg-secondary"
                    }`}
                  >
                    <span className="text-sm font-medium">
                      {t(`projectTypes.${p}`)}
                    </span>
                  </button>
                ))}
              </div>
              <div>
                <Label>{t("recommend.projectCostLabel")}</Label>
                <Input
                  type="number"
                  value={input.projectCost || ""}
                  onChange={(e) =>
                    updateField("projectCost", Number(e.target.value) || undefined)
                  }
                  placeholder="e.g. 300000"
                  className="mt-1.5"
                />
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Navigation */}
      <div className="mt-6 flex items-center justify-between">
        <Button
          variant="outline"
          onClick={handleBack}
          disabled={step === 0}
        >
          <ArrowLeft className="mr-1.5 size-4" />
          {t("common.back")}
        </Button>
        <Button onClick={handleNext} disabled={!canProceed()}>
          {isLast ? t("recommend.findSchemes") : t("common.next")}
          {!isLast && <ChevronRight className="ml-1.5 size-4" />}
        </Button>
      </div>
    </main>
  )
}
