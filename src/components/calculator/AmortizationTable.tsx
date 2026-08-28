import React, { useState, useMemo } from "react"
import { useTranslation } from "react-i18next"
import { ChevronDown, ChevronRight, ChevronsUpDown, Calendar, Clock, BarChart3 } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { fmtINR } from "@/lib/format"
import { computeAnnualSchedule } from "@/lib/emi"
import type { AmortizationRow } from "@/types/calculator"

interface AmortizationTableProps {
  schedule: AmortizationRow[]
  principal: number
  totalInterest: number
  totalPayable: number
}

export function AmortizationTable({
  schedule,
  principal,
  totalInterest,
  totalPayable,
}: AmortizationTableProps) {
  const { t } = useTranslation()
  const [viewMode, setViewMode] = useState<"annual" | "monthly">("annual")
  const [expandedYears, setExpandedYears] = useState<Record<number, boolean>>({ 1: true })
  const [showAllMonthly, setShowAllMonthly] = useState(false)

  const annualSchedule = useMemo(() => computeAnnualSchedule(schedule), [schedule])

  const principalPct = totalPayable > 0 ? (principal / totalPayable) * 100 : 100
  const interestPct = totalPayable > 0 ? (totalInterest / totalPayable) * 100 : 0

  const toggleYear = (year: number) => {
    setExpandedYears((prev) => ({
      ...prev,
      [year]: !prev[year],
    }))
  }

  const toggleAllYears = () => {
    const allExpanded = annualSchedule.every((row) => !!expandedYears[row.year])
    if (allExpanded) {
      setExpandedYears({})
    } else {
      const nextState: Record<number, boolean> = {}
      annualSchedule.forEach((row) => {
        nextState[row.year] = true
      })
      setExpandedYears(nextState)
    }
  }

  const visibleMonthlyRows = showAllMonthly ? schedule : schedule.slice(0, 12)

  return (
    <div className="space-y-6">
      {/* Visual Principal vs Interest Progress Bar */}
      <div className="rounded-xl border border-border bg-card p-4 sm:p-5 space-y-3 shadow-xs">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <BarChart3 className="size-4 text-primary" />
            <h3 className="text-sm font-semibold text-foreground">
              {t("calculator.breakdownTitle", "Principal vs. Interest Breakdown")}
            </h3>
          </div>
          <div className="text-xs text-muted-foreground font-medium">
            {t("calculator.totalRepayment", "Total Repayment:")}{" "}
            <span className="font-bold text-foreground">{fmtINR(totalPayable)}</span>
          </div>
        </div>

        {/* Visual Stacked Bar */}
        <div className="h-3.5 w-full overflow-hidden rounded-full bg-muted flex">
          <div
            className="h-full bg-primary transition-all duration-300 rounded-l-full"
            style={{ width: `${Math.min(100, Math.max(0, principalPct))}%` }}
            title={`${t("calculator.schedulePrincipal", "Principal")}: ${principalPct.toFixed(1)}%`}
          />
          <div
            className="h-full bg-amber-500 transition-all duration-300 rounded-r-full"
            style={{ width: `${Math.min(100, Math.max(0, interestPct))}%` }}
            title={`${t("calculator.scheduleInterest", "Interest")}: ${interestPct.toFixed(1)}%`}
          />
        </div>

        {/* Legend */}
        <div className="flex flex-wrap items-center justify-between gap-3 text-xs pt-1">
          <div className="flex items-center gap-2">
            <span className="size-3 rounded-full bg-primary shrink-0" />
            <span className="text-muted-foreground">
              {t("calculator.schedulePrincipal", "Principal")}:
            </span>
            <span className="font-semibold text-foreground">
              {fmtINR(principal)} ({principalPct.toFixed(1)}%)
            </span>
          </div>

          <div className="flex items-center gap-2">
            <span className="size-3 rounded-full bg-amber-500 shrink-0" />
            <span className="text-muted-foreground">
              {t("calculator.scheduleInterest", "Total Interest")}:
            </span>
            <span className="font-semibold text-foreground">
              {fmtINR(totalInterest)} ({interestPct.toFixed(1)}%)
            </span>
          </div>
        </div>
      </div>

      {/* Schedule Table Controls Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2">
        <div>
          <h2 className="font-display font-bold text-xl text-foreground">
            {t("calculator.scheduleTitle", "Amortization Schedule")}
          </h2>
          <p className="text-xs text-muted-foreground mt-0.5">
            {t("calculator.scheduleSubtitle", "Year-by-year and monthly payment timeline")}
          </p>
        </div>

        <div className="flex items-center gap-2">
          {/* View Mode Toggle */}
          <div className="inline-flex rounded-lg border border-border bg-muted/60 p-0.5 text-xs">
            <button
              type="button"
              onClick={() => setViewMode("annual")}
              className={`flex items-center gap-1.5 rounded-md px-3 py-1.5 font-medium transition-colors min-h-[36px] cursor-pointer ${
                viewMode === "annual"
                  ? "bg-card text-foreground shadow-xs font-semibold"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <Calendar className="size-3.5" />
              {t("calculator.viewAnnual", "Annual Summary")}
            </button>
            <button
              type="button"
              onClick={() => setViewMode("monthly")}
              className={`flex items-center gap-1.5 rounded-md px-3 py-1.5 font-medium transition-colors min-h-[36px] cursor-pointer ${
                viewMode === "monthly"
                  ? "bg-card text-foreground shadow-xs font-semibold"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <Clock className="size-3.5" />
              {t("calculator.viewMonthly", "Monthly Detail")}
            </button>
          </div>

          {viewMode === "annual" && annualSchedule.length > 1 && (
            <Button
              variant="outline"
              size="sm"
              onClick={toggleAllYears}
              className="text-xs min-h-[36px] cursor-pointer"
            >
              <ChevronsUpDown className="size-3.5 mr-1" />
              {annualSchedule.every((row) => !!expandedYears[row.year])
                ? t("calculator.collapseAll", "Collapse All")
                : t("calculator.expandAll", "Expand All")}
            </Button>
          )}
        </div>
      </div>

      {/* Schedule Content */}
      {viewMode === "annual" ? (
        <div className="rounded-lg border border-border overflow-x-auto bg-card shadow-xs">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/40 hover:bg-muted/40">
                <TableHead className="w-[180px]">{t("calculator.scheduleYear", "Year / Period")}</TableHead>
                <TableHead className="text-right">{t("calculator.scheduleOpening", "Opening Balance")}</TableHead>
                <TableHead className="text-right">{t("calculator.scheduleAnnualEmi", "Total EMI")}</TableHead>
                <TableHead className="text-right">{t("calculator.schedulePrincipal", "Principal")}</TableHead>
                <TableHead className="text-right">{t("calculator.scheduleInterest", "Interest")}</TableHead>
                <TableHead className="text-right">{t("calculator.scheduleClosing", "Closing Balance")}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {annualSchedule.map((yearRow) => {
                const isExpanded = !!expandedYears[yearRow.year]

                return (
                  <React.Fragment key={`year-group-${yearRow.year}`}>
                    <TableRow
                      onClick={() => toggleYear(yearRow.year)}
                      className="cursor-pointer hover:bg-muted/50 font-medium select-none group border-b border-border/80"
                    >
                      <TableCell className="font-semibold text-foreground flex items-center gap-2">
                        <span className="p-1 rounded text-muted-foreground group-hover:text-foreground">
                          {isExpanded ? (
                            <ChevronDown className="size-4 text-primary" />
                          ) : (
                            <ChevronRight className="size-4" />
                          )}
                        </span>
                        <span>
                          {t("calculator.yearLabel", "Year {{year}}", { year: yearRow.year })}
                        </span>
                        <span className="text-[11px] text-muted-foreground font-normal">
                          ({yearRow.months.length} {t("calculator.monthsShort", "mo")})
                        </span>
                      </TableCell>
                      <TableCell className="text-right tabular-nums">
                        {fmtINR(yearRow.openingBalance)}
                      </TableCell>
                      <TableCell className="text-right tabular-nums font-semibold text-foreground">
                        {fmtINR(yearRow.totalEmi)}
                      </TableCell>
                      <TableCell className="text-right tabular-nums text-emerald-700 dark:text-emerald-400">
                        {fmtINR(yearRow.principalPaid)}
                      </TableCell>
                      <TableCell className="text-right tabular-nums text-amber-700 dark:text-amber-400">
                        {fmtINR(yearRow.interestPaid)}
                      </TableCell>
                      <TableCell className="text-right tabular-nums font-semibold">
                        {fmtINR(yearRow.closingBalance)}
                      </TableCell>
                    </TableRow>

                    {/* Drill-down monthly rows when year is expanded */}
                    {isExpanded &&
                      yearRow.months.map((monthRow) => (
                        <TableRow
                          key={`month-${monthRow.month}`}
                          className="bg-muted/20 hover:bg-muted/40 text-xs border-b border-border/40"
                        >
                          <TableCell className="pl-9 font-normal text-muted-foreground">
                            {t("calculator.monthLabel", "Month {{m}}", { m: monthRow.month })}
                            {monthRow.phase === "moratorium" && (
                              <span className="ml-2 rounded-full bg-accent/20 text-accent-foreground text-[10px] font-semibold px-2 py-0.5">
                                {t("calculator.phaseMoratorium", "Moratorium")}
                              </span>
                            )}
                          </TableCell>
                          <TableCell className="text-right tabular-nums text-muted-foreground">
                            {fmtINR(monthRow.openingBalance)}
                          </TableCell>
                          <TableCell className="text-right tabular-nums">
                            {monthRow.emi > 0 ? fmtINR(monthRow.emi) : "—"}
                          </TableCell>
                          <TableCell className="text-right tabular-nums text-emerald-700/90 dark:text-emerald-400/90">
                            {fmtINR(monthRow.principalPaid)}
                          </TableCell>
                          <TableCell className="text-right tabular-nums text-amber-700/90 dark:text-amber-400/90">
                            {fmtINR(monthRow.interest)}
                          </TableCell>
                          <TableCell className="text-right tabular-nums font-medium text-foreground">
                            {fmtINR(monthRow.closingBalance)}
                          </TableCell>
                        </TableRow>
                      ))}
                  </React.Fragment>
                )
              })}
            </TableBody>
          </Table>
        </div>
      ) : (
        <div className="space-y-3">
          <div className="rounded-lg border border-border overflow-x-auto bg-card shadow-xs">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/40 hover:bg-muted/40">
                  <TableHead className="w-[140px]">{t("calculator.scheduleMonth", "Month")}</TableHead>
                  <TableHead className="text-right">{t("calculator.scheduleOpening", "Opening Balance")}</TableHead>
                  <TableHead className="text-right">{t("calculator.scheduleEmi", "EMI")}</TableHead>
                  <TableHead className="text-right">{t("calculator.schedulePrincipal", "Principal")}</TableHead>
                  <TableHead className="text-right">{t("calculator.scheduleInterest", "Interest")}</TableHead>
                  <TableHead className="text-right">{t("calculator.scheduleBalance", "Closing Balance")}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {visibleMonthlyRows.map((row, i) => (
                  <TableRow key={row.month} className="hover:bg-muted/30">
                    <TableCell className="font-medium text-foreground">
                      {t("calculator.monthLabel", "Month {{m}}", { m: row.month })}
                      {i === 11 && !showAllMonthly && schedule.length > 12 ? " …" : ""}
                      {row.phase === "moratorium" && (
                        <span className="ml-2 rounded-full bg-accent/20 text-accent-foreground text-[10px] font-semibold px-2 py-0.5">
                          {t("calculator.phaseMoratorium", "Moratorium")}
                        </span>
                      )}
                    </TableCell>
                    <TableCell className="text-right tabular-nums text-muted-foreground">
                      {fmtINR(row.openingBalance)}
                    </TableCell>
                    <TableCell className="text-right tabular-nums font-semibold text-foreground">
                      {row.emi > 0 ? fmtINR(row.emi) : "—"}
                    </TableCell>
                    <TableCell className="text-right tabular-nums text-emerald-700 dark:text-emerald-400">
                      {fmtINR(row.principalPaid)}
                    </TableCell>
                    <TableCell className="text-right tabular-nums text-amber-700 dark:text-amber-400">
                      {fmtINR(row.interest)}
                    </TableCell>
                    <TableCell className="text-right tabular-nums font-semibold">
                      {fmtINR(row.closingBalance)}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {schedule.length > 12 && (
            <div className="flex justify-center pt-1">
              <Button
                variant="outline"
                size="sm"
                className="min-h-[44px] cursor-pointer"
                onClick={() => setShowAllMonthly((v) => !v)}
              >
                {showAllMonthly
                  ? t("calculator.hideFullSchedule", "Show fewer rows")
                  : t("calculator.showFullScheduleAll", "Show all {{count}} months", {
                      count: schedule.length,
                    })}
              </Button>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
