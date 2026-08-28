import { useNavigate, Link } from "react-router-dom"
import { useTranslation } from "react-i18next"
import { toast } from "sonner"
import {
  Calculator,
  FileSpreadsheet,
  Trash2,
  RotateCcw,
  Calendar,
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { useSavedStore } from "@/stores/useSavedStore"
import { useCalculatorStore } from "@/stores/calculatorStore"
import { useLocaleStore } from "@/stores/localeStore"
import { fmtINR } from "@/lib/format"
import type { SavedCalculationRecord } from "@/types/saved"

export function RecentCalculationsCard() {
  const { t } = useTranslation()
  const { lang } = useLocaleStore()
  const navigate = useNavigate()
  const { savedCalculations, removeCalculation } = useSavedStore()
  const { patch: patchCalculator } = useCalculatorStore()

  function handleReloadCalculation(record: SavedCalculationRecord) {
    if (record.type === "emi") {
      patchCalculator({
        principal: record.principal || 500000,
        annualRatePct: record.annualRatePct || 9,
        tenureMonths: record.tenureMonths || 60,
        moratoriumMonths: record.moratoriumMonths || 0,
        moratoriumInterestAccrues: record.moratoriumInterestAccrues || false,
        schemeId: record.schemeId || null,
        schemeName: record.schemeName || null,
      })
      toast.success(t("dashboard.calcReloadedToast", "Loaded calculation into EMI Calculator"))
      navigate(
        `/calculator?amount=${record.principal}&rate=${record.annualRatePct}&tenure=${Math.max(1, Math.round((record.tenureMonths || 12) / 12))}`
      )
    } else {
      navigate("/planner")
    }
  }

  function handleRemove(id: string, title: string) {
    removeCalculation(id)
    toast.info(t("dashboard.calcRemovedToast", "Removed {{title}} from saved calculations", { title }))
  }

  return (
    <Card className="border border-border/80 shadow-xs">
      <CardHeader className="flex flex-row items-center justify-between pb-3 space-y-0">
        <div>
          <div className="flex items-center gap-2">
            <span className="rounded-full bg-blue-500/10 px-2 py-0.5 text-xs font-semibold text-blue-700 dark:text-blue-400">
              {t("dashboard.calculationsBadge", "Financial Estimates")}
            </span>
            <Badge variant="outline" className="text-xs font-mono">
              {savedCalculations.length}
            </Badge>
          </div>
          <CardTitle className="font-display text-lg font-bold text-foreground mt-1">
            {t("dashboard.calculationsTitle", "Recent Calculations & Budgets")}
          </CardTitle>
          <CardDescription className="text-xs text-muted-foreground">
            {t(
              "dashboard.calculationsDesc",
              "Preserved EMI estimates, moratorium comparisons, and itemized project startup plans."
            )}
          </CardDescription>
        </div>

        <div className="flex items-center gap-1.5 shrink-0">
          <Button asChild size="sm" variant="outline" className="h-8 text-xs font-semibold gap-1">
            <Link to="/calculator">
              <Calculator className="size-3.5 text-primary" />
              <span className="hidden sm:inline">{t("dashboard.newEmiBtn", "Calculator")}</span>
            </Link>
          </Button>
          <Button asChild size="sm" variant="outline" className="h-8 text-xs font-semibold gap-1">
            <Link to="/planner">
              <FileSpreadsheet className="size-3.5 text-accent" />
              <span className="hidden sm:inline">{t("dashboard.newPlannerBtn", "Planner")}</span>
            </Link>
          </Button>
        </div>
      </CardHeader>

      <CardContent className="space-y-4 pt-1">
        {savedCalculations.length === 0 ? (
          <div className="rounded-xl border border-dashed border-border/80 p-6 text-center space-y-3 bg-muted/20">
            <div className="mx-auto flex size-12 items-center justify-center rounded-full bg-blue-500/10 text-blue-600 dark:text-blue-400">
              <Calculator className="size-6" />
            </div>
            <div>
              <h4 className="font-display font-semibold text-sm text-foreground">
                {t("dashboard.noCalculationsTitle", "No saved calculations")}
              </h4>
              <p className="text-xs text-muted-foreground max-w-sm mx-auto mt-1">
                {t(
                  "dashboard.noCalculationsDesc",
                  "Simulate loan repayments or estimate itemized project costs to save calculations to your dashboard."
                )}
              </p>
            </div>
            <div className="flex flex-wrap items-center justify-center gap-2 pt-1">
              <Button asChild size="sm" className="text-xs font-semibold gap-1.5">
                <Link to="/calculator">
                  <Calculator className="size-3.5" />
                  {t("dashboard.calculateEmiBtn", "Calculate Loan EMI")}
                </Link>
              </Button>
              <Button asChild variant="outline" size="sm" className="text-xs font-semibold gap-1.5">
                <Link to="/planner">
                  <FileSpreadsheet className="size-3.5" />
                  {t("dashboard.planBudgetBtn", "Plan Project Budget")}
                </Link>
              </Button>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
            {savedCalculations.map((calc) => {
              const isEmi = calc.type === "emi"

              return (
                <div
                  key={calc.id}
                  className="rounded-xl border border-border/70 bg-card p-4 space-y-3 flex flex-col justify-between transition-all hover:border-border hover:shadow-xs"
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between gap-2">
                      <Badge
                        variant={isEmi ? "default" : "secondary"}
                        className="text-[11px] font-semibold flex items-center gap-1"
                      >
                        {isEmi ? <Calculator className="size-3" /> : <FileSpreadsheet className="size-3" />}
                        {isEmi
                          ? t("dashboard.emiCalcType", "EMI Calculation")
                          : t("dashboard.budgetPlanType", "Project Budget")}
                      </Badge>

                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleRemove(calc.id, calc.title)}
                        className="size-7 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-md"
                        title={t("dashboard.removeCalculation", "Remove calculation")}
                        aria-label={t("dashboard.removeCalculationAria", "Remove {{title}}", { title: calc.title })}
                      >
                        <Trash2 className="size-3.5" />
                      </Button>
                    </div>

                    <h4 className="font-display font-bold text-base text-foreground leading-snug">
                      {calc.title}
                    </h4>

                    {/* Metric Highlights */}
                    {isEmi ? (
                      <div className="grid grid-cols-2 gap-2 rounded-lg bg-muted/40 p-2.5 text-xs border border-border/50">
                        <div>
                          <span className="text-muted-foreground text-[11px] block">
                            {t("calculator.loanAmount", "Principal Loan")}
                          </span>
                          <span className="font-bold text-sm text-foreground mt-0.5 block">
                            {fmtINR(calc.principal || 0)}
                          </span>
                        </div>
                        <div>
                          <span className="text-muted-foreground text-[11px] block">
                            {t("calculator.monthlyEmi", "Monthly EMI")}
                          </span>
                          <span className="font-bold text-sm text-primary mt-0.5 block">
                            {fmtINR(calc.monthlyEmi || 0)}
                            <span className="text-[10px] font-normal text-muted-foreground ml-0.5">/mo</span>
                          </span>
                        </div>
                        <div className="col-span-2 pt-1 border-t border-border/40 flex items-center justify-between text-[11px] text-muted-foreground">
                          <span>
                            {calc.annualRatePct}% p.a. · {Math.round((calc.tenureMonths || 12) / 12)} yrs tenure
                          </span>
                          {calc.moratoriumMonths ? (
                            <span>{calc.moratoriumMonths} mos moratorium</span>
                          ) : null}
                        </div>
                      </div>
                    ) : (
                      <div className="grid grid-cols-2 gap-2 rounded-lg bg-muted/40 p-2.5 text-xs border border-border/50">
                        <div>
                          <span className="text-muted-foreground text-[11px] block">
                            {t("planner.totalProjectCost", "Total Project Cost")}
                          </span>
                          <span className="font-bold text-sm text-foreground mt-0.5 block">
                            {fmtINR(calc.totalProjectCost || 0)}
                          </span>
                        </div>
                        <div>
                          <span className="text-muted-foreground text-[11px] block">
                            {t("planner.loanAmount", "Govt Loan Share")}
                          </span>
                          <span className="font-bold text-sm text-primary mt-0.5 block">
                            {fmtINR(calc.loanAmount || 0)}
                          </span>
                        </div>
                        <div className="col-span-2 pt-1 border-t border-border/40 flex items-center justify-between text-[11px] text-muted-foreground">
                          <span>
                            {t("planner.promoterMargin", "Margin")}: {fmtINR(calc.promoterMargin || 0)}
                          </span>
                          {calc.itemCount ? <span>{calc.itemCount} itemized lines</span> : null}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Reload button */}
                  <div className="pt-2 border-t border-border/60 flex items-center justify-between">
                    <span className="text-[11px] text-muted-foreground flex items-center gap-1">
                      <Calendar className="size-3" />
                      {new Date(calc.calculatedAt).toLocaleDateString(lang === "hi" ? "hi-IN" : "en-IN")}
                    </span>

                    <Button
                      size="sm"
                      onClick={() => handleReloadCalculation(calc)}
                      className="h-8 text-xs font-semibold gap-1 min-h-[36px]"
                    >
                      <RotateCcw className="size-3.5" />
                      <span>{t("dashboard.reloadInToolBtn", "Open & Edit")}</span>
                    </Button>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
