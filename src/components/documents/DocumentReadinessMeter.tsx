import { useTranslation } from "react-i18next"
import {
  CheckCircle2,
  Clock,
  Sparkles,
  AlertCircle,
  Printer,
  CheckCheck,
  RotateCcw,
} from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import type { DocumentReadinessState } from "@/types"

interface DocumentReadinessMeterProps {
  readiness: DocumentReadinessState
  onMarkAll?: () => void
  onClearAll?: () => void
  onPrint?: () => void
  showActions?: boolean
}

export function DocumentReadinessMeter({
  readiness,
  onMarkAll,
  onClearAll,
  onPrint,
  showActions = true,
}: DocumentReadinessMeterProps) {
  const { t } = useTranslation()

  const {
    totalCount,
    completedCount,
    percentage,
    status,
    mandatoryTotal,
    mandatoryCompleted,
  } = readiness

  const isComplete = status === "ready_to_apply" || (totalCount > 0 && completedCount === totalCount)
  const isStarted = completedCount > 0

  return (
    <div
      className={`rounded-2xl border transition-all duration-300 p-5 sm:p-6 ${
        isComplete
          ? "border-emerald-500/50 bg-linear-to-br from-emerald-500/10 via-emerald-500/5 to-transparent shadow-md dark:border-emerald-500/40"
          : "border-border/80 bg-card shadow-xs"
      }`}
    >
      {/* Top Header: Title, Status Badge & Print */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="font-display font-bold text-lg sm:text-xl text-foreground">
              {t("documents.readinessTitle", "Document Readiness Progress")}
            </h2>
            {isComplete && (
              <Sparkles className="size-5 text-emerald-500 animate-bounce shrink-0" />
            )}
          </div>
          <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">
            {isComplete
              ? t(
                  "documents.allReadyMessage",
                  "All required documents are prepared! You are ready to apply at your Channel Partner.",
                )
              : t(
                  "documents.progressSubtitle",
                  "Check off certificates you have gathered to verify readiness before submitting.",
                )}
          </p>
        </div>

        {/* Readiness Status Badge */}
        <div className="flex items-center gap-2">
          {status === "ready_to_apply" ? (
            <Badge className="bg-emerald-600 hover:bg-emerald-600 text-white font-bold px-3 py-1 text-xs sm:text-sm gap-1.5 shadow-xs">
              <CheckCircle2 className="size-4 shrink-0" />
              <span>{t("documents.statusReady", "Ready to Apply")}</span>
            </Badge>
          ) : status === "in_progress" ? (
            <Badge
              variant="secondary"
              className="bg-sky-500/15 text-sky-700 dark:text-sky-300 border-sky-500/30 font-semibold px-3 py-1 text-xs sm:text-sm gap-1.5"
            >
              <Clock className="size-3.5 shrink-0" />
              <span>{t("documents.statusInProgress", "In Progress")}</span>
            </Badge>
          ) : (
            <Badge
              variant="outline"
              className="text-muted-foreground border-border font-medium px-3 py-1 text-xs sm:text-sm gap-1.5"
            >
              <AlertCircle className="size-3.5 shrink-0" />
              <span>{t("documents.statusNotStarted", "Not Started")}</span>
            </Badge>
          )}

          {onPrint && (
            <Button
              variant="outline"
              size="sm"
              onClick={onPrint}
              className="min-h-[36px] text-xs font-semibold gap-1.5 border-border/80 hover:border-primary/50"
              title={t("documents.printSlipTip", "Print document readiness slip")}
            >
              <Printer className="size-3.5 text-muted-foreground" />
              <span className="hidden sm:inline">{t("documents.printSlip", "Print Slip")}</span>
            </Button>
          )}
        </div>
      </div>

      {/* Progress Bar & Percentage */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-xs sm:text-sm">
          <div className="font-semibold text-foreground flex items-center gap-2">
            <span>
              {t("documents.countOfTotal", {
                completed: completedCount,
                total: totalCount,
                defaultValue: "{{completed}} of {{total}} documents ready",
              })}
            </span>
            <span className="text-muted-foreground font-normal">·</span>
            <span className="text-primary font-bold">{percentage}% {t("documents.complete", "Complete")}</span>
          </div>

          {mandatoryTotal > 0 && (
            <div className="text-xs text-muted-foreground font-medium">
              <span
                className={
                  mandatoryCompleted === mandatoryTotal
                    ? "text-emerald-600 dark:text-emerald-400 font-semibold"
                    : "text-amber-600 dark:text-amber-400 font-medium"
                }
              >
                {mandatoryCompleted}/{mandatoryTotal} {t("documents.mandatoryReady", "Mandatory Ready")}
              </span>
            </div>
          )}
        </div>

        {/* Visual Progress Bar */}
        <Progress
          value={percentage}
          className={`h-3 ${
            isComplete
              ? "[&>[data-slot=progress-indicator]]:bg-emerald-500"
              : percentage > 50
                ? "[&>[data-slot=progress-indicator]]:bg-primary"
                : "[&>[data-slot=progress-indicator]]:bg-amber-500"
          }`}
        />
      </div>

      {/* Action Buttons Row */}
      {showActions && (onMarkAll || onClearAll) && (
        <div className="flex flex-wrap items-center justify-between gap-2 pt-4 mt-4 border-t border-border/60 text-xs">
          <div className="text-muted-foreground text-[11px]">
            {isStarted ? (
              <span>{t("documents.autoSavedTip", "✓ Progress saved automatically in your browser.")}</span>
            ) : (
              <span>{t("documents.startTip", "Tip: Check items as you assemble them.")}</span>
            )}
          </div>

          <div className="flex items-center gap-2 ml-auto">
            {onMarkAll && (
              <Button
                variant="ghost"
                size="sm"
                onClick={onMarkAll}
                className="h-8 px-2.5 text-xs text-muted-foreground hover:text-foreground"
              >
                <CheckCheck className="size-3.5 mr-1" />
                {t("documents.markAll", "Mark All Ready")}
              </Button>
            )}
            {onClearAll && isStarted && (
              <Button
                variant="ghost"
                size="sm"
                onClick={onClearAll}
                className="h-8 px-2.5 text-xs text-muted-foreground hover:text-destructive"
              >
                <RotateCcw className="size-3.5 mr-1" />
                {t("documents.clearAll", "Reset")}
              </Button>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
