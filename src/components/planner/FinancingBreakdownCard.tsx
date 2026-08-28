import { useNavigate } from "react-router-dom"
import { useTranslation } from "react-i18next"
import {
  Landmark,
  PiggyBank,
  Sparkles,
  ArrowRight,
  Calculator,
  Info,
  Check,
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { fmtINR } from "@/lib/format"
import { usePlannerStore } from "@/stores/plannerStore"
import { useIntakeStore } from "@/stores/intakeStore"
import type { FinancingBreakdown } from "@/types/planner"

interface FinancingBreakdownCardProps {
  breakdown: FinancingBreakdown
}

export function FinancingBreakdownCard({ breakdown }: FinancingBreakdownCardProps) {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const { loanSharePct, promoterMarginPct, subsidyPct, projectType, setFinancingRatios } =
    usePlannerStore()
  const { setField, jumpToStep } = useIntakeStore()

  const {
    totalProjectCost,
    loanAmount,
    promoterMarginAmount,
    subsidyAmount,
  } = breakdown

  const ratioOptions = [
    {
      id: "90_10",
      labelKey: "planner.ratios.standard",
      defaultLabel: "90% Loan / 10% Margin (Standard)",
      loan: 90,
      margin: 10,
      subsidy: 0,
      badge: "NSFDC Standard",
    },
    {
      id: "95_5",
      labelKey: "planner.ratios.priority",
      defaultLabel: "95% Loan / 5% Margin (Micro / Women)",
      loan: 95,
      margin: 5,
      subsidy: 0,
      badge: "Micro Credit / BPL",
    },
    {
      id: "85_15",
      labelKey: "planner.ratios.term",
      defaultLabel: "85% Loan / 15% Margin (Term Loan)",
      loan: 85,
      margin: 15,
      subsidy: 0,
      badge: "Capital Heavy",
    },
  ]

  // Port budget to Intake Wizard
  const handleFindSchemes = () => {
    // Port total budget and project type into Intake Store
    setField("estimatedCost", Math.max(10000, totalProjectCost))
    if (projectType) {
      setField("projectType", projectType)
    }
    jumpToStep(0)
    navigate("/find-schemes")
  }

  // Navigate to EMI Calculator with loan amount
  const handleSimulateEmi = () => {
    navigate(`/calculator?amount=${loanAmount}&rate=5.0&tenure=36&moratorium=6&scheme=Concessional+Scheme`)
  }

  const isSelectedRatio = (loan: number, margin: number) =>
    loanSharePct === loan && promoterMarginPct === margin

  return (
    <Card className="border-border shadow-md overflow-hidden bg-card">
      <CardHeader className="bg-muted/40 pb-4 border-b border-border">
        <div className="flex items-center justify-between gap-2">
          <CardTitle className="text-base sm:text-lg font-semibold flex items-center gap-2">
            <Landmark className="size-5 text-primary" />
            {t("planner.breakdownTitle", "Financing & Equity Breakdown")}
          </CardTitle>
          <Badge variant="outline" className="bg-primary/5 text-primary border-primary/20 text-xs font-semibold">
            {t("planner.statutoryRatios", "Statutory Ratios")}
          </Badge>
        </div>
        <p className="text-xs text-muted-foreground mt-1">
          {t(
            "planner.breakdownSubtitle",
            "Government concessional financing pattern vs required beneficiary margin contribution.",
          )}
        </p>
      </CardHeader>

      <CardContent className="p-5 sm:p-6 space-y-6">
        {/* Total Project Cost Headline */}
        <div className="rounded-xl border border-primary/20 bg-gradient-to-br from-primary/10 via-primary/5 to-background p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-xs">
          <div>
            <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              {t("planner.totalBudgetLabel", "Total Project Budget")}
            </span>
            <div className="font-display font-extrabold text-3xl sm:text-4xl text-foreground tracking-tight tabular-nums mt-0.5">
              {fmtINR(totalProjectCost)}
            </div>
          </div>
          <div className="text-left sm:text-right">
            <span className="text-xs text-muted-foreground block">
              {t("planner.approvedCoverage", "Scheme Approved Coverage")}
            </span>
            <span className="font-display font-bold text-lg text-emerald-600 dark:text-emerald-400 tabular-nums">
              {loanSharePct}% {t("planner.loanFunded", "Concessional Loan")}
            </span>
          </div>
        </div>

        {/* Visual Stacked Progress Bar */}
        <div className="space-y-2">
          <div className="flex justify-between text-xs font-medium text-muted-foreground">
            <span>{t("planner.capitalDistribution", "Capital Distribution")}</span>
            <span>100% {t("planner.funded", "Funded")}</span>
          </div>

          <div
            className="h-6 w-full rounded-lg overflow-hidden flex bg-muted/60 p-0.5 gap-0.5 border border-border shadow-inner"
            role="progressbar"
            aria-label="Financing Breakdown"
            aria-valuenow={loanSharePct}
            aria-valuemin={0}
            aria-valuemax={100}
          >
            {/* Scheme Concessional Loan Share (Emerald) */}
            {loanSharePct > 0 && (
              <div
                style={{ width: `${loanSharePct}%` }}
                className="bg-emerald-500 hover:bg-emerald-600 transition-all rounded-l-md flex items-center justify-center text-[11px] font-bold text-white tracking-wide truncate px-1"
                title={`${t("planner.loanShare", "Scheme Loan")}: ${loanSharePct}% (${fmtINR(loanAmount)})`}
              >
                {loanSharePct >= 15 && `${loanSharePct}% Loan`}
              </div>
            )}

            {/* Subsidy Grant if applicable (Cyan) */}
            {subsidyPct > 0 && (
              <div
                style={{ width: `${subsidyPct}%` }}
                className="bg-cyan-500 hover:bg-cyan-600 transition-all flex items-center justify-center text-[11px] font-bold text-white tracking-wide truncate px-1"
                title={`${t("planner.subsidyGrant", "Subsidy")}: ${subsidyPct}% (${fmtINR(subsidyAmount)})`}
              >
                {subsidyPct >= 10 && `${subsidyPct}% Subsidy`}
              </div>
            )}

            {/* Promoter Own Contribution Margin (Violet) */}
            {promoterMarginPct > 0 && (
              <div
                style={{ width: `${promoterMarginPct}%` }}
                className="bg-violet-600 hover:bg-violet-700 transition-all rounded-r-md flex items-center justify-center text-[11px] font-bold text-white tracking-wide truncate px-1"
                title={`${t("planner.promoterMargin", "Own Margin")}: ${promoterMarginPct}% (${fmtINR(promoterMarginAmount)})`}
              >
                {promoterMarginPct >= 8 && `${promoterMarginPct}% Margin`}
              </div>
            )}
          </div>

          {/* Legend */}
          <div className="flex flex-wrap items-center justify-between gap-2 pt-1 text-xs">
            <div className="flex items-center gap-1.5">
              <span className="size-2.5 rounded-full bg-emerald-500 shrink-0" />
              <span className="font-medium text-foreground">
                {t("planner.concessionalLoan", "Govt Concessional Loan")}:
              </span>
              <span className="font-bold text-emerald-600 dark:text-emerald-400 tabular-nums">
                {loanSharePct}% ({fmtINR(loanAmount)})
              </span>
            </div>

            <div className="flex items-center gap-1.5">
              <span className="size-2.5 rounded-full bg-violet-600 shrink-0" />
              <span className="font-medium text-foreground">
                {t("planner.beneficiaryMargin", "Promoter Own Margin")}:
              </span>
              <span className="font-bold text-violet-600 dark:text-violet-400 tabular-nums">
                {promoterMarginPct}% ({fmtINR(promoterMarginAmount)})
              </span>
            </div>
          </div>
        </div>

        {/* Financing Ratio Preset Switcher */}
        <div className="space-y-2.5 pt-2 border-t border-border/70">
          <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider block">
            {t("planner.selectRatioPattern", "Select Financing Scheme Pattern")}
          </label>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
            {ratioOptions.map((opt) => {
              const selected = isSelectedRatio(opt.loan, opt.margin)
              return (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() => setFinancingRatios(opt.loan, opt.margin, opt.subsidy)}
                  className={`p-3 rounded-lg border text-left transition-all min-h-[54px] flex flex-col justify-between cursor-pointer ${
                    selected
                      ? "border-primary bg-primary/10 shadow-xs ring-1 ring-primary"
                      : "border-border bg-background hover:bg-muted/50 text-muted-foreground"
                  }`}
                >
                  <div className="flex items-center justify-between gap-1 w-full">
                    <span className="text-xs font-bold text-foreground">
                      {opt.loan}% / {opt.margin}%
                    </span>
                    {selected && <Check className="size-3.5 text-primary shrink-0" />}
                  </div>
                  <span className="text-[11px] text-muted-foreground truncate mt-1">
                    {opt.badge}
                  </span>
                </button>
              )
            })}
          </div>
        </div>

        {/* Financial Breakdown Metric Cards */}
        <div className="grid grid-cols-2 gap-3 pt-1">
          {/* Concessional Loan Card */}
          <div className="rounded-xl border border-emerald-500/30 bg-emerald-50/60 dark:bg-emerald-950/20 p-3.5 space-y-1">
            <div className="flex items-center gap-1.5 text-emerald-800 dark:text-emerald-300 text-xs font-semibold">
              <Landmark className="size-3.5" />
              {t("planner.schemeLoanShare", "Scheme Concessional Loan")}
            </div>
            <p className="font-display font-extrabold text-xl sm:text-2xl text-emerald-700 dark:text-emerald-300 tabular-nums">
              {fmtINR(loanAmount)}
            </p>
            <p className="text-[11px] text-emerald-600/90 dark:text-emerald-400">
              {t("planner.schemeLoanNote", "Disbursed via SCA / Bank at 2%–6% concessional interest")}
            </p>
          </div>

          {/* Promoter Margin Card */}
          <div className="rounded-xl border border-violet-500/30 bg-violet-50/60 dark:bg-violet-950/20 p-3.5 space-y-1">
            <div className="flex items-center gap-1.5 text-violet-800 dark:text-violet-300 text-xs font-semibold">
              <PiggyBank className="size-3.5" />
              {t("planner.promoterEquityShare", "Promoter Margin (Your Equity)")}
            </div>
            <p className="font-display font-extrabold text-xl sm:text-2xl text-violet-700 dark:text-violet-300 tabular-nums">
              {fmtINR(promoterMarginAmount)}
            </p>
            <p className="text-[11px] text-violet-600/90 dark:text-violet-400">
              {t("planner.promoterMarginNote", "Arranged by applicant / State SCA margin money grant")}
            </p>
          </div>
        </div>

        {/* Statutory Scheme Education Callout */}
        <div className="rounded-lg border border-border/80 bg-muted/30 p-3.5 flex items-start gap-3 text-xs text-muted-foreground leading-relaxed">
          <Info className="size-4 text-primary shrink-0 mt-0.5" />
          <div>
            <span className="font-semibold text-foreground mr-1">
              {t("planner.whyMarginTitle", "Why does the scheme require Promoter Margin?")}
            </span>
            {t(
              "planner.whyMarginDesc",
              "Government corporations fund up to 90%–95% of unit cost. The 5%–10% promoter contribution proves applicant commitment. For SC/BPL beneficiaries, some states also provide special margin subsidy grants.",
            )}
          </div>
        </div>

        {/* Primary and Secondary Action CTAs */}
        <div className="space-y-2.5 pt-2">
          {/* Port to Intake Wizard CTA */}
          <Button
            type="button"
            onClick={handleFindSchemes}
            className="w-full min-h-[46px] font-semibold text-xs sm:text-sm cursor-pointer shadow-sm flex items-center justify-center gap-2"
          >
            <Sparkles className="size-4" />
            <span>
              {t("planner.findSchemesCta", {
                amount: fmtINR(totalProjectCost),
                defaultValue: `Find Matching Schemes for ₹${fmtINR(totalProjectCost)}`,
              })}
            </span>
            <ArrowRight className="size-4 ml-0.5" />
          </Button>

          {/* Simulate EMI in Calculator */}
          <Button
            type="button"
            variant="outline"
            onClick={handleSimulateEmi}
            className="w-full min-h-[44px] font-medium text-xs sm:text-sm cursor-pointer border-border hover:bg-muted"
          >
            <Calculator className="size-4 mr-2 text-primary" />
            <span>
              {t("planner.simulateEmiCta", {
                amount: fmtINR(loanAmount),
                defaultValue: `Simulate Repayment EMI for ₹${fmtINR(loanAmount)} Loan`,
              })}
            </span>
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
