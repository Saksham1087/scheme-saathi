import { useMemo, useEffect, useState } from "react"
import { useSearchParams, Link } from "react-router-dom"
import { useTranslation } from "react-i18next"
import {
  RotateCcw,
  Printer,
  Sparkles,
  ArrowRight,
  TrendingDown,
  CheckCircle2,
  X,
  Calculator,
  FileSpreadsheet,
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { Switch } from "@/components/ui/switch"
import { Button } from "@/components/ui/button"
import { InfoNote } from "@/components/literacy/InfoNote"
import { computeLoan, computeMoratoriumComparison } from "@/lib/emi"
import { fmtINR } from "@/lib/format"
import { useCalculatorStore } from "@/stores/calculatorStore"
import { SchemePresetBar } from "@/components/calculator/SchemePresetBar"
import { SCHEME_PRESETS } from "@/lib/calculatorPresets"
import { AmortizationTable } from "@/components/calculator/AmortizationTable"
import { MoratoriumComparisonCard } from "@/components/calculator/MoratoriumComparisonCard"
import schemesSeed from "@seed/schemes.seed.json"
import type { SchemePreset } from "@/types/calculator"

function SliderInputRow({
  id,
  label,
  value,
  displayValue,
  min,
  max,
  step,
  unit,
  helperText,
  onChange,
}: {
  id: string
  label: string
  value: number
  displayValue: string
  min: number
  max: number
  step: number
  unit?: string
  helperText?: string
  onChange: (v: number) => void
}) {
  return (
    <div className="space-y-2.5">
      <div className="flex items-baseline justify-between gap-2">
        <div>
          <Label htmlFor={id} className="text-sm font-semibold text-foreground cursor-pointer">
            {label}
          </Label>
          {helperText && (
            <p className="text-[11px] text-muted-foreground mt-0.5">{helperText}</p>
          )}
        </div>
        <span className="font-display font-bold text-base sm:text-lg text-primary tabular-nums">
          {displayValue}
        </span>
      </div>

      <div className="flex items-center gap-3">
        <div className="flex-1 py-1">
          <Slider
            id={`${id}-slider`}
            min={min}
            max={max}
            step={step}
            value={[Math.min(max, Math.max(min, value))]}
            onValueChange={([v]) => onChange(v)}
            aria-label={label}
            className="cursor-pointer"
          />
        </div>
        <div className="relative shrink-0 w-28 sm:w-32">
          <Input
            id={id}
            type="number"
            min={min}
            max={max}
            step={step}
            value={Number.isNaN(value) ? "" : value}
            onChange={(e) => {
              const val = e.target.value === "" ? 0 : Number(e.target.value)
              onChange(Math.max(0, val))
            }}
            className="text-right pr-7 font-medium h-9 text-xs sm:text-sm tabular-nums"
            aria-label={label}
          />
          {unit && (
            <span className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-xs text-muted-foreground">
              {unit}
            </span>
          )}
        </div>
      </div>
    </div>
  )
}

export default function CalculatorPage() {
  const { t, i18n } = useTranslation()
  const [searchParams] = useSearchParams()
  const calc = useCalculatorStore()
  const [dismissedSchemeKey, setDismissedSchemeKey] = useState<string | null>(null)

  // Sync URL search params on deep-link mount
  useEffect(() => {
    const amount = searchParams.get("amount")
    const rate = searchParams.get("rate")
    const tenure = searchParams.get("tenure")
    const moratorium = searchParams.get("moratorium")
    const accrual = searchParams.get("accrual")
    const scheme = searchParams.get("scheme")

    const patch: Partial<{
      principal: number
      annualRatePct: number
      tenureMonths: number
      moratoriumMonths: number
      moratoriumInterestAccrues: boolean
      schemeId: string | null
      schemeName: string | null
      activePresetId: string | null
    }> = {}

    if (amount) {
      const numAmount = Number(amount)
      if (!Number.isNaN(numAmount) && numAmount >= 0) patch.principal = numAmount
    }
    if (rate) {
      const numRate = Number(rate)
      if (!Number.isNaN(numRate) && numRate >= 0) patch.annualRatePct = numRate
    }
    if (tenure) {
      const tenureVal = Number(tenure)
      if (!Number.isNaN(tenureVal) && tenureVal > 0) {
        patch.tenureMonths = tenureVal <= 10 ? tenureVal * 12 : tenureVal
      }
    }
    if (moratorium) {
      const numMoratorium = Number(moratorium)
      if (!Number.isNaN(numMoratorium) && numMoratorium >= 0) {
        patch.moratoriumMonths = numMoratorium
      }
    }
    if (accrual !== null) {
      patch.moratoriumInterestAccrues = accrual === "1" || accrual === "true"
    }

    if (scheme) {
      patch.schemeId = scheme
      // Check if matches a preset or seed scheme
      const matchedPreset = SCHEME_PRESETS.find(
        (p) =>
          p.id.toLowerCase() === scheme.toLowerCase() ||
          p.defaultName.en.toLowerCase() === scheme.toLowerCase() ||
          p.defaultName.hi.toLowerCase() === scheme.toLowerCase(),
      )
      if (matchedPreset) {
        patch.activePresetId = matchedPreset.id
        patch.schemeName =
          i18n.language?.startsWith("hi")
            ? matchedPreset.defaultName.hi
            : matchedPreset.defaultName.en
      } else {
        const seedMatch = schemesSeed.find(
          (s) => s.id === scheme || s.name.en.toLowerCase() === scheme.toLowerCase(),
        )
        patch.schemeName = seedMatch ? (i18n.language?.startsWith("hi") ? seedMatch.name.hi || seedMatch.name.en : seedMatch.name.en) : scheme
      }
    }

    if (Object.keys(patch).length > 0) {
      calc.patch(patch)
    }
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  const [activeScenario, setActiveScenario] = useState<"capitalize" | "service">(
    calc.moratoriumInterestAccrues ? "capitalize" : "service",
  )

  // Calculate standard reducing balance loan
  const result = useMemo(
    () =>
      computeLoan({
        principal: Math.max(0, calc.principal),
        annualRatePct: Math.max(0, calc.annualRatePct),
        tenureMonths: Math.max(1, calc.tenureMonths),
        moratoriumMonths: Math.max(0, calc.moratoriumMonths),
        moratoriumInterestAccrues: calc.moratoriumInterestAccrues,
      }),
    [
      calc.principal,
      calc.annualRatePct,
      calc.tenureMonths,
      calc.moratoriumMonths,
      calc.moratoriumInterestAccrues,
    ],
  )

  // Calculate side-by-side moratorium comparison
  const moratoriumComparison = useMemo(
    () =>
      computeMoratoriumComparison({
        principal: Math.max(0, calc.principal),
        annualRatePct: Math.max(0, calc.annualRatePct),
        tenureMonths: Math.max(1, calc.tenureMonths),
        moratoriumMonths: Math.max(0, calc.moratoriumMonths),
        moratoriumInterestAccrues: calc.moratoriumInterestAccrues,
      }),
    [
      calc.principal,
      calc.annualRatePct,
      calc.tenureMonths,
      calc.moratoriumMonths,
      calc.moratoriumInterestAccrues,
    ],
  )

  // Calculate commercial bank comparison (e.g. 10.5% standard commercial rate)
  const commercialResult = useMemo(
    () =>
      computeLoan({
        principal: Math.max(0, calc.principal),
        annualRatePct: 10.5,
        tenureMonths: Math.max(1, calc.tenureMonths),
        moratoriumMonths: 0,
        moratoriumInterestAccrues: false,
      }),
    [calc.principal, calc.tenureMonths],
  )

  const interestSavedVsCommercial = Math.max(
    0,
    commercialResult.totalInterest - result.totalInterest,
  )

  const handleScenarioSelect = (scenario: "capitalize" | "service") => {
    setActiveScenario(scenario)
    calc.patch({
      moratoriumInterestAccrues: scenario === "capitalize",
      activePresetId: null,
    })
  }

  // Handler for scheme preset pill click
  const handleSelectPreset = (preset: SchemePreset) => {
    calc.patch({
      principal: preset.principal,
      annualRatePct: preset.annualRatePct,
      tenureMonths: preset.tenureMonths,
      moratoriumMonths: preset.moratoriumMonths,
      moratoriumInterestAccrues: preset.moratoriumInterestAccrues,
      activePresetId: preset.id,
      schemeId: preset.id,
      schemeName:
        i18n.language?.startsWith("hi") ? preset.defaultName.hi : preset.defaultName.en,
    })
    setActiveScenario(preset.moratoriumInterestAccrues ? "capitalize" : "service")
    setDismissedSchemeKey(null)
  }

  // Handle Reset to defaults
  const handleReset = () => {
    calc.reset()
    setActiveScenario("service")
    setDismissedSchemeKey("all")
  }

  // Handle Print / PDF trigger
  const handlePrint = () => {
    window.print()
  }

  const displayedSchemeName = calc.schemeName || (calc.schemeId ? calc.schemeId : null)
  const isBannerVisible =
    !!displayedSchemeName &&
    dismissedSchemeKey !== displayedSchemeName &&
    dismissedSchemeKey !== "all"

  const tenureYearsDisplay = (calc.tenureMonths / 12).toFixed(1).replace(/\.0$/, "")

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 sm:py-10 space-y-8 print:p-0 print:m-0 print:max-w-none">
      {/* Tab Switcher between EMI Calculator and Project Cost Planner */}
      <div className="flex items-center gap-2 border-b border-border pb-4 print:hidden">
        <Link
          to="/calculator"
          className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold transition-colors bg-primary text-primary-foreground shadow-xs"
        >
          <Calculator className="size-4" />
          <span>{t("calculator.tabTitle", "EMI & Moratorium Calculator")}</span>
        </Link>

        <Link
          to="/planner"
          className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors border border-transparent text-muted-foreground hover:text-foreground hover:bg-muted/50"
        >
          <FileSpreadsheet className="size-4" />
          <span>{t("planner.tabTitle", "Project Cost & Financing Planner")}</span>
        </Link>
      </div>

      {/* Header & Quick Action Buttons */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border pb-6">
        <div>
          <h1 className="font-display font-bold text-2xl sm:text-3xl text-foreground tracking-tight">
            {t("calculator.title", "EMI Calculator")}
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {t(
              "calculator.subtitle",
              "Simulate reducing-balance repayments, compare concessional schemes, and inspect full amortization schedules.",
            )}
          </p>
        </div>

        <div className="flex items-center gap-2.5 print:hidden">
          <Button
            variant="outline"
            size="sm"
            onClick={handleReset}
            className="min-h-[44px] px-3.5 cursor-pointer text-xs font-medium"
            title={t("calculator.resetTitle", "Reset all inputs to default")}
          >
            <RotateCcw className="size-3.5 mr-1.5 text-muted-foreground" />
            {t("calculator.resetButton", "Reset")}
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={handlePrint}
            className="min-h-[44px] px-3.5 cursor-pointer text-xs font-medium"
            title={t("calculator.printTitle", "Print or export calculation")}
          >
            <Printer className="size-3.5 mr-1.5 text-muted-foreground" />
            {t("calculator.printButton", "Print")}
          </Button>
        </div>
      </div>

      {/* Quick Scheme Preset Selector Bar */}
      <div className="print:hidden">
        <SchemePresetBar
          activePresetId={calc.activePresetId}
          onSelectPreset={handleSelectPreset}
        />
      </div>

      {/* Active Scheme Deep-link Banner */}
      {isBannerVisible && (
        <div className="flex items-center justify-between gap-3 rounded-lg border border-primary/30 bg-primary/5 px-4 py-3 text-sm text-foreground animate-in fade-in duration-200">
          <div className="flex items-center gap-2.5">
            <CheckCircle2 className="size-4 text-primary shrink-0" />
            <span>
              {t("calculator.fromSchemeNotice", {
                scheme: displayedSchemeName,
                defaultValue: `Loaded parameters for ${displayedSchemeName}`,
              })}
            </span>
          </div>
          <button
            type="button"
            onClick={() => setDismissedSchemeKey(displayedSchemeName)}
            className="p-1 text-muted-foreground hover:text-foreground rounded-md transition-colors min-h-[32px] min-w-[32px] flex items-center justify-center cursor-pointer"
            aria-label={t("common.close", "Close")}
          >
            <X className="size-4" />
          </button>
        </div>
      )}

      {/* Main Dual-Column Workspace */}
      <div className="grid gap-8 lg:grid-cols-12 items-start">
        {/* Left Column: Interactive Controls */}
        <Card className="lg:col-span-7 border-border shadow-xs">
          <CardHeader className="pb-4">
            <CardTitle className="text-base sm:text-lg font-semibold flex items-center gap-2">
              <Sparkles className="size-4 text-primary" />
              {t("calculator.parametersHeading", "Loan & Repayment Parameters")}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6 pt-0">
            {/* Principal Loan Amount */}
            <SliderInputRow
              id="principal-amount"
              label={t("calculator.amountLabel", "Loan Amount")}
              value={calc.principal}
              displayValue={fmtINR(calc.principal)}
              min={10000}
              max={5000000}
              step={10000}
              unit="₹"
              helperText={t("calculator.amountHelper", "Principal borrowed from channel partner")}
              onChange={(v) => calc.patch({ principal: v, activePresetId: null })}
            />

            {/* Interest Rate */}
            <SliderInputRow
              id="annual-rate"
              label={t("calculator.rateLabel", "Interest Rate (p.a.)")}
              value={calc.annualRatePct}
              displayValue={`${calc.annualRatePct}%`}
              min={0}
              max={18}
              step={0.1}
              unit="%"
              helperText={t(
                "calculator.rateHelper",
                "Concessional rate (0%–8% for schemes, 10.5%+ commercial)",
              )}
              onChange={(v) => calc.patch({ annualRatePct: v, activePresetId: null })}
            />

            {/* Tenure */}
            <SliderInputRow
              id="tenure-months"
              label={t("calculator.tenureLabel", "Repayment Period")}
              value={calc.tenureMonths}
              displayValue={`${calc.tenureMonths} ${t("calculator.monthsShort", "mo")} (${tenureYearsDisplay} ${t("calculator.yearsShort", "yrs")})`}
              min={6}
              max={120}
              step={1}
              unit="mo"
              helperText={t("calculator.tenureHelper", "Number of monthly repayment installments")}
              onChange={(v) =>
                calc.patch({
                  tenureMonths: Math.max(1, v),
                  activePresetId: null,
                })
              }
            />

            {/* Moratorium Grace Period */}
            <SliderInputRow
              id="moratorium-months"
              label={t("calculator.moratoriumLabel", "Moratorium (Grace) Period")}
              value={calc.moratoriumMonths}
              displayValue={`${calc.moratoriumMonths} ${t("calculator.monthsShort", "mo")}`}
              min={0}
              max={60}
              step={1}
              unit="mo"
              helperText={t(
                "calculator.moratoriumHelper",
                "Repayment holiday before first installment begins",
              )}
              onChange={(v) =>
                calc.patch({
                  moratoriumMonths: Math.max(0, v),
                  activePresetId: null,
                })
              }
            />

            {/* Moratorium Interest Accrual Toggle */}
            <div className="rounded-lg border border-border/80 bg-muted/30 p-3.5 space-y-2">
              <div className="flex items-center justify-between gap-4">
                <Label
                  htmlFor="accrual-switch"
                  className="text-xs sm:text-sm font-medium cursor-pointer"
                >
                  {t("calculator.accrualLabel", "Interest accrues during moratorium")}
                </Label>
                <Switch
                  id="accrual-switch"
                  checked={calc.moratoriumInterestAccrues}
                  onCheckedChange={(v) => {
                    calc.patch({
                      moratoriumInterestAccrues: v,
                      activePresetId: null,
                    })
                    setActiveScenario(v ? "capitalize" : "service")
                  }}
                  aria-label={t("calculator.accrualLabel", "Interest accrues during moratorium")}
                />
              </div>
              <p className="text-xs text-muted-foreground leading-relaxed">
                {calc.moratoriumInterestAccrues
                  ? t(
                      "calculator.accrualHintOn",
                      "Interest adds to your balance during the pause, so EMIs are higher later.",
                    )
                  : t(
                      "calculator.accrualHintOff",
                      "No interest during the pause. EMIs start on the same amount after it ends.",
                    )}
              </p>
            </div>

            {/* Moratorium & Interest Capitalization Simulation */}
            {calc.moratoriumMonths > 0 && (
              <div className="pt-3 border-t border-border/60">
                <MoratoriumComparisonCard
                  comparison={moratoriumComparison}
                  activeScenario={activeScenario}
                  onSelectScenario={handleScenarioSelect}
                />
              </div>
            )}
          </CardContent>
        </Card>

        {/* Right Column: Real-time Metric Cards & Savings */}
        <div className="lg:col-span-5 space-y-4 lg:sticky lg:top-20">
          {/* Primary EMI KPI Card */}
          <Card className="border-primary/50 bg-gradient-to-br from-primary via-primary/95 to-primary/90 text-primary-foreground shadow-md">
            <CardContent className="pt-6 pb-5 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold uppercase tracking-wider text-primary-foreground/80">
                  {t("calculator.emiLabel", "Monthly EMI")}
                </span>
                {calc.moratoriumMonths > 0 && (
                  <span className="rounded-full bg-primary-foreground/20 px-2 py-0.5 text-[11px] font-semibold">
                    {t("calculator.startsAfter", "Starts Month {{m}}", {
                      m: calc.moratoriumMonths + 1,
                    })}
                  </span>
                )}
              </div>

              <div className="font-display font-extrabold text-4xl sm:text-5xl tracking-tight tabular-nums">
                {fmtINR(result.emi)}
              </div>

              <p className="text-xs text-primary-foreground/80">
                {t("calculator.emiSubtext", "Calculated on standard reducing balance method")}
              </p>
            </CardContent>
          </Card>

          {/* Secondary Metric Cards Grid */}
          <div className="grid grid-cols-2 gap-3">
            <Card className="border-border bg-card shadow-xs">
              <CardContent className="p-3.5 space-y-1">
                <p className="text-xs text-muted-foreground font-medium">
                  {t("calculator.totalInterestLabel", "Total Interest")}
                </p>
                <p className="font-display font-bold text-base sm:text-lg text-amber-600 dark:text-amber-400 tabular-nums">
                  {fmtINR(result.totalInterest)}
                </p>
              </CardContent>
            </Card>

            <Card className="border-border bg-card shadow-xs">
              <CardContent className="p-3.5 space-y-1">
                <p className="text-xs text-muted-foreground font-medium">
                  {t("calculator.totalPayableLabel", "Total Payable")}
                </p>
                <p className="font-display font-bold text-base sm:text-lg text-foreground tabular-nums">
                  {fmtINR(result.totalPayable)}
                </p>
              </CardContent>
            </Card>

            <Card className="border-border bg-card shadow-xs">
              <CardContent className="p-3.5 space-y-1">
                <p className="text-xs text-muted-foreground font-medium">
                  {t("calculator.effectivePrincipalLabel", "Starting Balance")}
                </p>
                <p className="font-display font-bold text-base sm:text-lg text-foreground tabular-nums">
                  {fmtINR(result.effectivePrincipal)}
                </p>
              </CardContent>
            </Card>

            <Card className="border-border bg-card shadow-xs">
              <CardContent className="p-3.5 space-y-1">
                <p className="text-xs text-muted-foreground font-medium">
                  {t("calculator.totalTenure", "Total Duration")}
                </p>
                <p className="font-display font-bold text-base sm:text-lg text-foreground tabular-nums">
                  {calc.moratoriumMonths + calc.tenureMonths} {t("calculator.monthsShort", "mo")}
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Concessional Savings Callout Card */}
          {calc.annualRatePct < 10.5 && interestSavedVsCommercial > 0 && (
            <div className="rounded-xl border border-emerald-500/30 bg-emerald-50/80 dark:bg-emerald-950/40 p-4 space-y-1.5 text-emerald-900 dark:text-emerald-200 shadow-xs">
              <div className="flex items-center gap-1.5 font-semibold text-xs text-emerald-800 dark:text-emerald-300">
                <TrendingDown className="size-4 text-emerald-600 dark:text-emerald-400" />
                {t("calculator.savingsTitle", "Government Concession Savings")}
              </div>
              <p className="text-xs leading-relaxed">
                {t("calculator.savingsDescription", {
                  savings: fmtINR(interestSavedVsCommercial),
                  rate: calc.annualRatePct,
                  defaultValue: `You save ${fmtINR(interestSavedVsCommercial)} in total interest compared to standard 10.5% commercial bank financing.`,
                })}
              </p>
            </div>
          )}

          {/* Find Matching Schemes CTA */}
          <div className="pt-2 print:hidden">
            <Button
              asChild
              className="w-full min-h-[44px] font-semibold text-xs sm:text-sm cursor-pointer shadow-xs"
            >
              <Link to="/find-schemes">
                {t("calculator.findSchemesCta", "Find Schemes Matching This Loan")}
                <ArrowRight className="size-4 ml-1.5" />
              </Link>
            </Button>
          </div>
        </div>
      </div>

      {/* Amortization Schedule & Visual Breakdown */}
      <section className="pt-4 border-t border-border">
        <AmortizationTable
          comparison={moratoriumComparison}
          activeScenario={activeScenario}
          onSelectScenario={handleScenarioSelect}
          schedule={result.schedule}
          principal={calc.principal}
          totalInterest={result.totalInterest}
          totalPayable={result.totalPayable}
        />
      </section>

      {/* Financial Literacy Note */}
      <div className="pt-2 print:hidden">
        <InfoNote topic="moratorium" defaultOpen={false} />
      </div>
    </div>
  )
}
