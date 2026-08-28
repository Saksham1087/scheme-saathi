import { Link } from "react-router-dom"
import { useTranslation } from "react-i18next"
import {
  Calculator,
  FileSpreadsheet,
  RotateCcw,
  Printer,
  Sparkles,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { InfoNote } from "@/components/literacy/InfoNote"
import { ProjectCostPlanner } from "@/components/planner/ProjectCostPlanner"
import { FinancingBreakdownCard } from "@/components/planner/FinancingBreakdownCard"
import { usePlannerStore } from "@/stores/plannerStore"

export default function PlannerPage() {
  const { t } = useTranslation()
  const { resetToDefault, getFinancingBreakdown } = usePlannerStore()
  const breakdown = getFinancingBreakdown()

  const handlePrint = () => {
    window.print()
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:py-10 space-y-8 print:p-0 print:m-0 print:max-w-none">
      {/* Tab Switcher between EMI Calculator and Project Cost Planner */}
      <div className="flex items-center gap-2 border-b border-border pb-4 print:hidden">
        <Link
          to="/calculator"
          className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors border border-transparent text-muted-foreground hover:text-foreground hover:bg-muted/50"
        >
          <Calculator className="size-4" />
          <span>{t("calculator.tabTitle", "EMI & Moratorium Calculator")}</span>
        </Link>

        <Link
          to="/planner"
          className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold transition-colors bg-primary text-primary-foreground shadow-xs"
        >
          <FileSpreadsheet className="size-4" />
          <span>{t("planner.tabTitle", "Project Cost & Financing Planner")}</span>
        </Link>
      </div>

      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border/80 pb-6">
        <div>
          <div className="flex items-center gap-2">
            <span className="rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-semibold text-primary">
              {t("planner.badge", "Micro-Enterprise & Startup Budgeting")}
            </span>
          </div>
          <h1 className="font-display font-bold text-2xl sm:text-3xl text-foreground tracking-tight mt-1.5">
            {t("planner.pageTitle", "Project Cost Planner & Financing Breakdown")}
          </h1>
          <p className="mt-1 text-sm text-muted-foreground max-w-2xl">
            {t(
              "planner.pageSubtitle",
              "Itemize startup machinery, stock, and working capital across 6 statutory categories to calculate exact government loan share vs required promoter equity.",
            )}
          </p>
        </div>

        <div className="flex items-center gap-2.5 print:hidden shrink-0">
          <Button
            variant="outline"
            size="sm"
            onClick={resetToDefault}
            className="min-h-[44px] px-3.5 cursor-pointer text-xs font-medium"
            title={t("planner.resetTitle", "Reset all inputs to default")}
          >
            <RotateCcw className="size-3.5 mr-1.5 text-muted-foreground" />
            {t("planner.resetBtn", "Reset Plan")}
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={handlePrint}
            className="min-h-[44px] px-3.5 cursor-pointer text-xs font-medium"
            title={t("planner.printTitle", "Print or export project budget")}
          >
            <Printer className="size-3.5 mr-1.5 text-muted-foreground" />
            {t("planner.printBtn", "Print")}
          </Button>
        </div>
      </div>

      {/* Main Dual-Column Planner Layout */}
      <div className="grid gap-8 lg:grid-cols-12 items-start">
        {/* Left Column: Interactive Itemized Cost Builder */}
        <div className="lg:col-span-7 space-y-6">
          <ProjectCostPlanner />
        </div>

        {/* Right Column: Real-time Financing Breakdown & Statutory Ratios */}
        <div className="lg:col-span-5 space-y-6 lg:sticky lg:top-20">
          <FinancingBreakdownCard breakdown={breakdown} />
        </div>
      </div>

      {/* Financial Literacy Advisory Section */}
      <section className="pt-6 border-t border-border print:hidden space-y-4">
        <div className="flex items-center gap-2">
          <Sparkles className="size-4 text-primary" />
          <h2 className="text-base font-semibold text-foreground">
            {t("planner.literacyTitle", "Financial Guidelines & Scheme Appraisal Rules")}
          </h2>
        </div>
        <InfoNote topic="concessional" defaultOpen={false} />
      </section>
    </div>
  )
}
