import { useTranslation } from "react-i18next"
import { AlertTriangle, ShieldCheck, TrendingDown, Info, ArrowUpRight } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { fmtINR } from "@/lib/format"
import type { MoratoriumComparisonResult } from "@/types/calculator"

interface MoratoriumComparisonCardProps {
  comparison: MoratoriumComparisonResult
  activeScenario?: "capitalize" | "service"
  onSelectScenario?: (scenario: "capitalize" | "service") => void
}

export function MoratoriumComparisonCard({
  comparison,
  activeScenario = "capitalize",
  onSelectScenario,
}: MoratoriumComparisonCardProps) {
  const { t } = useTranslation()

  if (!comparison.hasMoratorium || comparison.moratoriumMonths <= 0) {
    return null
  }

  const {
    scenarioA,
    scenarioB,
    interestDifference,
    emiDifference,
    moratoriumMonths,
    principal,
  } = comparison

  const principalInflatedAmount = Math.max(
    0,
    scenarioA.effectivePrincipal - principal,
  )

  return (
    <div className="space-y-4 animate-in fade-in-50 duration-300">
      {/* Top Banner: Cost of Capitalization Highlight */}
      {interestDifference > 0 && (
        <div className="rounded-xl border border-amber-500/30 bg-amber-50/80 dark:bg-amber-950/40 p-4 sm:p-5 text-amber-950 dark:text-amber-100 shadow-xs">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-start gap-3">
              <div className="p-2 rounded-lg bg-amber-500/20 text-amber-800 dark:text-amber-300 shrink-0 mt-0.5 sm:mt-0">
                <AlertTriangle className="size-5" />
              </div>
              <div className="space-y-1">
                <h3 className="font-display font-bold text-sm sm:text-base text-amber-900 dark:text-amber-200">
                  {t(
                    "calculator.moratoriumCostTitle",
                    "Cost of Capitalization: {{diff}} Extra Lifetime Interest",
                    { diff: fmtINR(interestDifference) },
                  )}
                </h3>
                <p className="text-xs sm:text-sm text-amber-800/90 dark:text-amber-200/90 leading-relaxed">
                  {t(
                    "calculator.moratoriumCostBody",
                    "Deferring repayments adds interest to your loan balance. Servicing simple interest ({{monthlyService}}/mo) during the {{months}}-month grace period saves you {{savings}} and lowers your post-moratorium EMI by {{emiDiff}}/mo.",
                    {
                      monthlyService: fmtINR(scenarioB.moratoriumMonthlyPayment),
                      months: moratoriumMonths,
                      savings: fmtINR(interestDifference),
                      emiDiff: fmtINR(emiDifference),
                    },
                  )}
                </p>
              </div>
            </div>

            <div className="sm:self-center shrink-0 flex items-center gap-2">
              <span className="inline-flex items-center gap-1 rounded-full bg-emerald-600/15 dark:bg-emerald-400/20 text-emerald-800 dark:text-emerald-300 px-3 py-1 text-xs font-bold">
                <TrendingDown className="size-3.5" />
                {t("calculator.saveUpTo", "Save {{savings}}", {
                  savings: fmtINR(interestDifference),
                })}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Side-by-side Comparative Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-stretch">
        {/* Scenario A Card: Capitalize Interest */}
        <Card
          className={`relative border transition-all duration-200 ${
            activeScenario === "capitalize"
              ? "border-amber-500/80 bg-amber-500/[0.03] ring-1 ring-amber-500/50 shadow-sm"
              : "border-border bg-card opacity-95 hover:border-amber-500/40"
          }`}
        >
          <CardHeader className="pb-3 pt-4 px-4 sm:px-5">
            <div className="flex items-start justify-between gap-2">
              <div>
                <Badge
                  variant="outline"
                  className="bg-amber-500/10 text-amber-800 dark:text-amber-300 border-amber-500/30 text-[11px] font-semibold mb-1.5"
                >
                  {t("calculator.scenarioATitle", "Scenario A: Capitalize Interest")}
                </Badge>
                <CardTitle className="text-sm sm:text-base font-bold text-foreground">
                  {t("calculator.scenarioAName", "Complete Payment Holiday")}
                </CardTitle>
                <p className="text-xs text-muted-foreground mt-0.5">
                  {t(
                    "calculator.scenarioASubtitle",
                    "Pay ₹0 during grace; unpaid interest is capitalized into principal",
                  )}
                </p>
              </div>

              {onSelectScenario && (
                <button
                  type="button"
                  onClick={() => onSelectScenario("capitalize")}
                  className={`text-xs px-2.5 py-1 rounded-md font-medium cursor-pointer transition-colors ${
                    activeScenario === "capitalize"
                      ? "bg-amber-500 text-white font-semibold"
                      : "bg-muted text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {activeScenario === "capitalize"
                    ? t("calculator.viewingSchedule", "Viewing")
                    : t("calculator.selectSchedule", "View Schedule")}
                </button>
              )}
            </div>
          </CardHeader>

          <CardContent className="px-4 sm:px-5 pb-5 space-y-3.5 pt-0">
            <div className="grid grid-cols-2 gap-2.5 rounded-lg bg-muted/40 p-3 text-xs">
              <div>
                <p className="text-muted-foreground">
                  {t("calculator.duringMoratorium", "During Moratorium:")}
                </p>
                <p className="font-bold text-foreground text-sm tabular-nums mt-0.5">
                  ₹0 / {t("calculator.monthsShort", "mo")}
                </p>
                <p className="text-[11px] text-muted-foreground">
                  ({t("calculator.totalPaidDuring", "Total paid:")} ₹0)
                </p>
              </div>

              <div>
                <p className="text-muted-foreground">
                  {t("calculator.postMoratoriumEmi", "Post-Moratorium EMI:")}
                </p>
                <p className="font-bold text-amber-700 dark:text-amber-400 text-sm tabular-nums mt-0.5">
                  {fmtINR(scenarioA.postMoratoriumEmi)} / {t("calculator.monthsShort", "mo")}
                </p>
                {emiDifference > 0 && (
                  <p className="text-[11px] text-amber-700 dark:text-amber-400 font-medium">
                    +{fmtINR(emiDifference)}/{t("calculator.monthsShort", "mo")}
                  </p>
                )}
              </div>
            </div>

            <div className="space-y-2 text-xs divide-y divide-border/60">
              <div className="flex justify-between items-center pt-1">
                <span className="text-muted-foreground">
                  {t("calculator.startingLoanBalance", "Starting Principal Balance:")}
                </span>
                <span className="font-semibold text-foreground tabular-nums">
                  {fmtINR(scenarioA.effectivePrincipal)}
                  {principalInflatedAmount > 0 && (
                    <span className="text-[11px] text-amber-600 dark:text-amber-400 ml-1 font-normal">
                      (+{fmtINR(principalInflatedAmount)})
                    </span>
                  )}
                </span>
              </div>

              <div className="flex justify-between items-center pt-2">
                <span className="text-muted-foreground">
                  {t("calculator.totalInterestLabel", "Total Interest Payable:")}
                </span>
                <span className="font-bold text-amber-700 dark:text-amber-400 tabular-nums">
                  {fmtINR(scenarioA.totalInterest)}
                </span>
              </div>

              <div className="flex justify-between items-center pt-2">
                <span className="text-muted-foreground font-medium">
                  {t("calculator.totalPayableLabel", "Total Repayment:")}
                </span>
                <span className="font-bold text-foreground tabular-nums">
                  {fmtINR(scenarioA.totalPayable)}
                </span>
              </div>
            </div>

            <div className="rounded-md bg-amber-500/10 dark:bg-amber-500/15 p-2.5 text-[11px] text-amber-900 dark:text-amber-200 flex items-start gap-2">
              <ArrowUpRight className="size-3.5 shrink-0 mt-0.5 text-amber-600 dark:text-amber-400" />
              <span>
                {t(
                  "calculator.scenarioANote",
                  "Unpaid interest inflates your loan principal, increasing both the monthly EMI and the total lifetime interest paid.",
                )}
              </span>
            </div>
          </CardContent>
        </Card>

        {/* Scenario B Card: Service Interest Monthly */}
        <Card
          className={`relative border transition-all duration-200 ${
            activeScenario === "service"
              ? "border-emerald-500/80 bg-emerald-500/[0.03] ring-1 ring-emerald-500/50 shadow-sm"
              : "border-border bg-card opacity-95 hover:border-emerald-500/40"
          }`}
        >
          <CardHeader className="pb-3 pt-4 px-4 sm:px-5">
            <div className="flex items-start justify-between gap-2">
              <div>
                <Badge
                  variant="outline"
                  className="bg-emerald-500/10 text-emerald-800 dark:text-emerald-300 border-emerald-500/30 text-[11px] font-semibold mb-1.5"
                >
                  {t("calculator.scenarioBTitle", "Scenario B: Service Simple Interest")}
                </Badge>
                <CardTitle className="text-sm sm:text-base font-bold text-foreground">
                  {t("calculator.scenarioBName", "Monthly Simple Interest Servicing")}
                </CardTitle>
                <p className="text-xs text-muted-foreground mt-0.5">
                  {t(
                    "calculator.scenarioBSubtitle",
                    "Pay simple interest monthly during grace; principal stays protected",
                  )}
                </p>
              </div>

              {onSelectScenario && (
                <button
                  type="button"
                  onClick={() => onSelectScenario("service")}
                  className={`text-xs px-2.5 py-1 rounded-md font-medium cursor-pointer transition-colors ${
                    activeScenario === "service"
                      ? "bg-emerald-600 text-white font-semibold"
                      : "bg-muted text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {activeScenario === "service"
                    ? t("calculator.viewingSchedule", "Viewing")
                    : t("calculator.selectSchedule", "View Schedule")}
                </button>
              )}
            </div>
          </CardHeader>

          <CardContent className="px-4 sm:px-5 pb-5 space-y-3.5 pt-0">
            <div className="grid grid-cols-2 gap-2.5 rounded-lg bg-muted/40 p-3 text-xs">
              <div>
                <p className="text-muted-foreground">
                  {t("calculator.duringMoratorium", "During Moratorium:")}
                </p>
                <p className="font-bold text-foreground text-sm tabular-nums mt-0.5">
                  {fmtINR(scenarioB.moratoriumMonthlyPayment)} / {t("calculator.monthsShort", "mo")}
                </p>
                <p className="text-[11px] text-muted-foreground">
                  ({t("calculator.totalPaidDuring", "Total paid:")} {fmtINR(scenarioB.moratoriumTotalPaid)})
                </p>
              </div>

              <div>
                <p className="text-muted-foreground">
                  {t("calculator.postMoratoriumEmi", "Post-Moratorium EMI:")}
                </p>
                <p className="font-bold text-emerald-700 dark:text-emerald-400 text-sm tabular-nums mt-0.5">
                  {fmtINR(scenarioB.postMoratoriumEmi)} / {t("calculator.monthsShort", "mo")}
                </p>
                {emiDifference > 0 && (
                  <p className="text-[11px] text-emerald-700 dark:text-emerald-400 font-medium">
                    -{fmtINR(emiDifference)}/{t("calculator.monthsShort", "mo")}
                  </p>
                )}
              </div>
            </div>

            <div className="space-y-2 text-xs divide-y divide-border/60">
              <div className="flex justify-between items-center pt-1">
                <span className="text-muted-foreground">
                  {t("calculator.startingLoanBalance", "Starting Principal Balance:")}
                </span>
                <span className="font-semibold text-foreground tabular-nums">
                  {fmtINR(scenarioB.effectivePrincipal)}
                  <span className="text-[11px] text-emerald-600 dark:text-emerald-400 ml-1 font-normal">
                    ({t("calculator.uninflated", "clean")})
                  </span>
                </span>
              </div>

              <div className="flex justify-between items-center pt-2">
                <span className="text-muted-foreground">
                  {t("calculator.totalInterestLabel", "Total Interest Payable:")}
                </span>
                <span className="font-bold text-emerald-700 dark:text-emerald-400 tabular-nums">
                  {fmtINR(scenarioB.totalInterest)}
                </span>
              </div>

              <div className="flex justify-between items-center pt-2">
                <span className="text-muted-foreground font-medium">
                  {t("calculator.totalPayableLabel", "Total Repayment:")}
                </span>
                <span className="font-bold text-foreground tabular-nums">
                  {fmtINR(scenarioB.totalPayable)}
                </span>
              </div>
            </div>

            <div className="rounded-md bg-emerald-500/10 dark:bg-emerald-500/15 p-2.5 text-[11px] text-emerald-900 dark:text-emerald-200 flex items-start gap-2">
              <ShieldCheck className="size-3.5 shrink-0 mt-0.5 text-emerald-600 dark:text-emerald-400" />
              <span>
                {t(
                  "calculator.scenarioBNote",
                  "Paying simple interest prevents compounding, keeping your principal fixed and maximizing your lifetime interest savings.",
                )}
              </span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Educational Pocket Explainer */}
      <div className="rounded-lg border border-border/80 bg-muted/20 p-3.5 flex items-start gap-2.5 text-xs text-muted-foreground">
        <Info className="size-4 text-primary shrink-0 mt-0.5" />
        <div className="space-y-1">
          <p className="font-semibold text-foreground">
            {t("calculator.moratoriumPocketTitle", "What does Moratorium mean for your pocket?")}
          </p>
          <p className="leading-relaxed">
            {t(
              "calculator.moratoriumPocketDesc",
              "A moratorium gives you breathing room before regular EMIs begin. If you can afford simple interest during the holiday (even small amounts), choose Scenario B to avoid interest-on-interest. If starting out with zero cashflow, Scenario A allows 100% payment relief during gestation.",
            )}
          </p>
        </div>
      </div>
    </div>
  )
}
