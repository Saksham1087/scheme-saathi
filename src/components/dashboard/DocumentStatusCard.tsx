import { useMemo } from "react"
import { Link } from "react-router-dom"
import { useTranslation } from "react-i18next"
import {
  FileCheck2,
  ShieldCheck,
  UploadCloud,
  Clock,
  ArrowRight,
  CheckCircle2,
  AlertCircle,
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { useDocumentStore } from "@/stores/useDocumentStore"
import {
  getSchemeDocumentConfig,
  computeReadiness,
} from "@/lib/documentRules"

export function DocumentStatusCard() {
  const { t } = useTranslation()
  const {
    selectedSchemeId,
    checkedDocMap,
    digiLockerVerifications,
    manualUploads,
  } = useDocumentStore()

  const config = useMemo(() => {
    return getSchemeDocumentConfig(selectedSchemeId || "micro-finance")
  }, [selectedSchemeId])

  const readiness = useMemo(() => {
    return computeReadiness(config.documents, checkedDocMap)
  }, [config, checkedDocMap])

  const digiLockerCount = Object.keys(digiLockerVerifications).length
  const manualCount = Object.keys(manualUploads).length

  const statusVariant =
    readiness.status === "ready_to_apply"
      ? "bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border-emerald-500/30"
      : readiness.status === "in_progress"
      ? "bg-blue-500/10 text-primary border-primary/30"
      : "bg-amber-500/10 text-amber-700 dark:text-amber-400 border-amber-500/30"

  const statusLabel =
    readiness.status === "ready_to_apply"
      ? t("documents.readyToApply", "Ready to Apply")
      : readiness.status === "in_progress"
      ? t("documents.inProgress", "In Progress")
      : t("documents.notStarted", "Action Needed")

  return (
    <Card className="border border-border/80 shadow-xs">
      <CardHeader className="flex flex-row items-center justify-between pb-3 space-y-0">
        <div>
          <div className="flex items-center gap-2">
            <span className="rounded-full bg-primary/10 px-2 py-0.5 text-xs font-semibold text-primary">
              {t("dashboard.documentsBadge", "Statutory Verification")}
            </span>
            <span className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-semibold border ${statusVariant}`}>
              {readiness.status === "ready_to_apply" ? (
                <CheckCircle2 className="size-3" />
              ) : (
                <Clock className="size-3" />
              )}
              {statusLabel}
            </span>
          </div>
          <CardTitle className="font-display text-lg font-bold text-foreground mt-1">
            {t("dashboard.documentsTitle", "Document Readiness Status")}
          </CardTitle>
          <CardDescription className="text-xs text-muted-foreground">
            {t(
              "dashboard.documentsDesc",
              "Pre-submission verification for Aadhaar, Caste Certificate, and Income Proof."
            )}
          </CardDescription>
        </div>

        <Button asChild size="sm" variant="outline" className="h-8 text-xs font-semibold gap-1.5 shrink-0">
          <Link to="/documents">
            <span>{t("dashboard.openChecklistBtn", "Open Checklist")}</span>
            <ArrowRight className="size-3.5" />
          </Link>
        </Button>
      </CardHeader>

      <CardContent className="space-y-4 pt-1">
        {/* Progress meter */}
        <div className="rounded-xl border border-border/70 bg-card p-4 space-y-3">
          <div className="flex items-center justify-between text-xs">
            <span className="font-semibold text-foreground">
              {t("dashboard.docsReadyCount", "{{completed}} of {{total}} Required Documents Ready", {
                completed: readiness.completedCount,
                total: readiness.totalCount,
              })}
            </span>
            <span className="font-mono font-bold text-base text-primary tabular-nums">
              {readiness.percentage}%
            </span>
          </div>

          <Progress value={readiness.percentage} className="h-2.5" />

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 pt-1 text-xs">
            <div className="rounded-lg bg-muted/40 p-2.5 border border-border/40 space-y-0.5">
              <span className="text-[11px] text-muted-foreground flex items-center gap-1">
                <ShieldCheck className="size-3 text-emerald-600 dark:text-emerald-400" />
                {t("documents.digiLockerSynced", "DigiLocker Synced")}
              </span>
              <p className="font-bold text-sm text-foreground">
                {digiLockerCount} {t("dashboard.documentsShort", "docs")}
              </p>
            </div>

            <div className="rounded-lg bg-muted/40 p-2.5 border border-border/40 space-y-0.5">
              <span className="text-[11px] text-muted-foreground flex items-center gap-1">
                <UploadCloud className="size-3 text-primary" />
                {t("documents.manualUploads", "Manual Uploads")}
              </span>
              <p className="font-bold text-sm text-foreground">
                {manualCount} {t("dashboard.documentsShort", "docs")}
              </p>
            </div>

            <div className="rounded-lg bg-muted/40 p-2.5 border border-border/40 space-y-0.5">
              <span className="text-[11px] text-muted-foreground flex items-center gap-1">
                <AlertCircle className="size-3 text-amber-600 dark:text-amber-400" />
                {t("documents.pendingDocs", "Pending Verification")}
              </span>
              <p className="font-bold text-sm text-amber-700 dark:text-amber-400">
                {readiness.totalCount - readiness.completedCount} {t("dashboard.documentsShort", "docs")}
              </p>
            </div>
          </div>
        </div>

        {/* Action Link Banner */}
        <div className="flex items-center justify-between gap-3 rounded-lg border border-primary/20 bg-primary/[0.03] px-3.5 py-2.5 text-xs text-foreground">
          <div className="flex items-center gap-2">
            <FileCheck2 className="size-4 text-primary shrink-0" />
            <span>
              {readiness.percentage === 100
                ? t("dashboard.allDocsReadyNotice", "All statutory documents verified! You are ready to submit at your partner branch.")
                : t("dashboard.docsPendingNotice", "Complete document verification and print your application bundle before visiting the branch.")}
            </span>
          </div>
          <Button asChild size="sm" className="h-7 text-xs font-semibold shrink-0">
            <Link to="/documents">
              {t("dashboard.verifyNowBtn", "Verify Documents")}
            </Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
