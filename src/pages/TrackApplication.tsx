import { useEffect, useMemo, useState } from "react"
import { useParams, useNavigate, Link } from "react-router-dom"
import { useTranslation } from "react-i18next"
import { toast } from "sonner"
import {
  Landmark,
  Building2,
  Phone,
  Printer,
  RotateCcw,
  Trash2,
  Edit3,
  Check,
  X,
  Compass,
  ArrowRight,
  ShieldCheck,
  UserCheck,
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Progress } from "@/components/ui/progress"
import { MilestoneTracker } from "@/components/tracking/MilestoneTracker"
import { NextActionCard } from "@/components/tracking/NextActionCard"
import { NewJourneyModal } from "@/components/tracking/NewJourneyModal"
import { useApplicationStore } from "@/stores/useApplicationStore"
import { useLocaleStore } from "@/stores/localeStore"
import { fmtINR } from "@/lib/format"
import type { ApplicationJourney } from "@/types/application"

export default function TrackApplication() {
  const { t } = useTranslation()
  const { lang } = useLocaleStore()
  const { id } = useParams<{ id?: string }>()
  const navigate = useNavigate()

  const {
    applications,
    setActiveJourneyId,
    getJourneyById,
    getActiveJourney,
    updateAcknowledgmentNumber,
    resetJourneyToBeginning,
    deleteJourney,
  } = useApplicationStore()

  // Editing state for reference number in header
  const [isEditingRef, setIsEditingRef] = useState(false)
  const [refInput, setRefInput] = useState("")

  // Handle URL route synchronization: if /application/:id is provided
  useEffect(() => {
    if (id) {
      const match = getJourneyById(id)
      if (match) {
        setActiveJourneyId(id)
      }
    }
  }, [id, getJourneyById, setActiveJourneyId])

  const activeJourney: ApplicationJourney | undefined = useMemo(() => {
    if (id) {
      return getJourneyById(id) || getActiveJourney()
    }
    return getActiveJourney()
  }, [id, getJourneyById, getActiveJourney])

  // Synchronize refInput when active journey changes
  useEffect(() => {
    if (activeJourney) {
      setRefInput(activeJourney.acknowledgmentNumber || "")
      setIsEditingRef(false)
    }
  }, [activeJourney])

  function handleSelectJourney(journeyId: string) {
    setActiveJourneyId(journeyId)
    navigate(`/application/${journeyId}`)
  }

  function handleSaveRef() {
    if (!activeJourney) return
    updateAcknowledgmentNumber(activeJourney.id, refInput.trim())
    setIsEditingRef(false)
    toast.success(t("track.ackUpdatedToast"))
  }

  function handleReset(journeyId: string) {
    if (window.confirm(t("track.confirmResetJourney"))) {
      resetJourneyToBeginning(journeyId)
      toast.info(t("track.journeyResetToast"))
    }
  }

  function handleDelete(journeyId: string) {
    if (window.confirm(t("track.confirmDeleteJourney"))) {
      deleteJourney(journeyId)
      toast.info(t("track.journeyDeletedToast"))
      navigate("/track")
    }
  }

  function handlePrint() {
    window.print()
  }

  // Calculate progress for active journey
  const progressStats = useMemo(() => {
    if (!activeJourney) return { completed: 0, total: 8, pct: 0 }
    const total = activeJourney.stages.length || 8
    const completed = activeJourney.stages.filter((s) => s.completed).length
    const pct = Math.round((completed / total) * 100)
    return { completed, total, pct }
  }, [activeJourney])

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 space-y-6 print:p-0 print:m-0 print:max-w-none">
      {/* Printable Heading (Only visible in print) */}
      <div className="hidden print:block mb-6 border-b pb-4">
        <h1 className="text-2xl font-bold text-black">SchemeSathi Application Milestone Dossier</h1>
        <p className="text-sm text-gray-600">
          Statutory Post-Discovery Citizen Self-Tracking Report · Generated on {new Date().toLocaleDateString()}
        </p>
      </div>

      {/* Screen Header & Top Action Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 print:hidden">
        <div>
          <div className="flex items-center gap-2">
            <span className="flex size-9 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <Landmark className="size-5" />
            </span>
            <div>
              <h1 className="font-display font-bold text-2xl sm:text-3xl tracking-tight text-foreground">
                {t("track.pageTitle")}
              </h1>
              <p className="text-xs sm:text-sm text-muted-foreground">
                {t("track.pageSubtitle")}
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          {activeJourney && (
            <Button
              variant="outline"
              size="sm"
              onClick={handlePrint}
              className="gap-1.5 text-xs font-semibold"
            >
              <Printer className="size-3.5" />
              {t("track.printSummaryBtn")}
            </Button>
          )}
          <NewJourneyModal
            onCreated={(newId) => {
              navigate(`/application/${newId}`)
            }}
          />
        </div>
      </div>

      {/* Application Selector Tabs (if multiple journeys exist) */}
      {applications.length > 0 && (
        <div className="print:hidden">
          <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-border/80">
            <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider shrink-0 mr-1">
              {t("track.activeJourneys")}:
            </span>
            {applications.map((app) => {
              const isCurrent = app.id === activeJourney?.id
              const appCompleted = app.stages.filter((s) => s.completed).length
              const appPct = Math.round((appCompleted / (app.stages.length || 8)) * 100)

              return (
                <button
                  key={app.id}
                  type="button"
                  onClick={() => handleSelectJourney(app.id)}
                  className={`flex items-center gap-2.5 px-3.5 py-2 rounded-lg text-xs font-medium transition-all whitespace-nowrap cursor-pointer border ${
                    isCurrent
                      ? "bg-primary text-primary-foreground border-primary shadow-sm"
                      : "bg-card hover:bg-muted text-foreground border-border"
                  }`}
                >
                  <span className="truncate max-w-[160px] sm:max-w-[220px]">
                    {app.schemeName[lang] || app.schemeName.en}
                  </span>
                  <span
                    className={`text-[10px] px-1.5 py-0.5 rounded-full font-bold ${
                      isCurrent
                        ? "bg-primary-foreground/20 text-primary-foreground"
                        : "bg-muted text-muted-foreground"
                    }`}
                  >
                    {appPct}%
                  </span>
                </button>
              )
            })}
          </div>
        </div>
      )}

      {/* Empty State when no journeys exist */}
      {(!activeJourney || applications.length === 0) && (
        <Card className="text-center py-16 px-4">
          <CardContent className="space-y-4 max-w-md mx-auto">
            <div className="flex size-14 mx-auto items-center justify-center rounded-full bg-primary/10 text-primary">
              <Compass className="size-7" />
            </div>
            <h3 className="font-display font-bold text-xl text-foreground">
              {t("track.noActiveJourneysTitle")}
            </h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              {t("track.noActiveJourneysDesc")}
            </p>
            <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
              <NewJourneyModal
                onCreated={(newId) => navigate(`/application/${newId}`)}
              />
              <Button asChild variant="outline" size="sm">
                <Link to="/find-schemes">
                  {t("track.discoverEligibleSchemes")}
                  <ArrowRight className="size-3.5 ml-1.5" />
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Active Application Journey Details & Stepper */}
      {activeJourney && (
        <div className="space-y-6">
          {/* Main Application Summary Header Card */}
          <Card className="border-border shadow-sm overflow-hidden">
            <CardHeader className="bg-muted/30 pb-4 border-b border-border/60">
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                <div className="space-y-1.5">
                  <div className="flex items-center gap-2 flex-wrap">
                    <Badge variant="secondary" className="font-semibold text-xs uppercase">
                      {t(`schemeTypes.${activeJourney.schemeType}`)}
                    </Badge>
                    <span className="text-xs text-muted-foreground font-mono">
                      ID: {activeJourney.id}
                    </span>
                    {activeJourney.isSynthetic && (
                      <Badge variant="outline" className="text-[10px] text-muted-foreground">
                        {t("track.sampleJourneyBadge")}
                      </Badge>
                    )}
                  </div>

                  <CardTitle className="font-display text-xl sm:text-2xl text-foreground">
                    {activeJourney.schemeName[lang] || activeJourney.schemeName.en}
                  </CardTitle>

                  <div className="flex items-center gap-2 text-xs sm:text-sm text-muted-foreground flex-wrap">
                    <span className="flex items-center gap-1 text-foreground font-semibold">
                      <Building2 className="size-3.5 text-primary" />
                      {activeJourney.partnerName}
                    </span>
                    <span>·</span>
                    <span>
                      {t("track.requestedCost")}:{" "}
                      <strong className="text-foreground font-bold">
                        {fmtINR(activeJourney.requestedAmount)}
                      </strong>
                    </span>
                  </div>
                </div>

                {/* Progress Meter Block */}
                <div className="lg:w-72 bg-background border border-border/80 rounded-xl p-3.5 space-y-2 shrink-0">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-foreground flex items-center gap-1.5">
                      <ShieldCheck className="size-4 text-emerald-600" />
                      {t("track.journeyProgress")}
                    </span>
                    <span className="font-bold text-primary font-mono text-sm">
                      {progressStats.completed}/{progressStats.total} ({progressStats.pct}%)
                    </span>
                  </div>
                  <Progress value={progressStats.pct} className="h-2.5" />
                  <div className="flex items-center justify-between text-[11px] text-muted-foreground">
                    <span>
                      {progressStats.completed === progressStats.total
                        ? t("track.allCompletedStatus")
                        : t("track.stagesRemaining", { count: progressStats.total - progressStats.completed })}
                    </span>
                    <span className="font-medium">
                      {progressStats.pct === 100 ? "100%" : `${progressStats.pct}%`}
                    </span>
                  </div>
                </div>
              </div>
            </CardHeader>

            <CardContent className="p-4 sm:p-5 space-y-4">
              {/* Reference Number & Partner Meta Grid */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                {/* Physical Acknowledgment / Ref No Box */}
                <div className="p-3 rounded-lg border border-border bg-muted/20 space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-muted-foreground uppercase tracking-wider text-[10px]">
                      {t("track.applicationRefNo")}
                    </span>
                    {!isEditingRef && (
                      <button
                        type="button"
                        onClick={() => setIsEditingRef(true)}
                        className="text-primary hover:underline font-medium text-[11px] flex items-center gap-0.5 print:hidden cursor-pointer"
                      >
                        <Edit3 className="size-3" />
                        {activeJourney.acknowledgmentNumber
                          ? t("common.edit")
                          : t("track.addBtn")}
                      </button>
                    )}
                  </div>

                  {isEditingRef ? (
                    <div className="flex items-center gap-1.5 pt-1">
                      <Input
                        value={refInput}
                        onChange={(e) => setRefInput(e.target.value)}
                        placeholder="e.g. UP-SCA-2026-889"
                        className="h-7 text-xs font-mono"
                        autoFocus
                      />
                      <Button
                        size="sm"
                        className="h-7 px-2 text-xs"
                        onClick={handleSaveRef}
                      >
                        <Check className="size-3.5" />
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        className="h-7 px-2 text-xs"
                        onClick={() => {
                          setRefInput(activeJourney.acknowledgmentNumber || "")
                          setIsEditingRef(false)
                        }}
                      >
                        <X className="size-3.5" />
                      </Button>
                    </div>
                  ) : (
                    <p className="font-mono text-sm font-bold text-foreground">
                      {activeJourney.acknowledgmentNumber || (
                        <span className="text-muted-foreground font-normal text-xs italic">
                          {t("track.notRecordedYet")}
                        </span>
                      )}
                    </p>
                  )}
                </div>

                {/* Partner Branch & Location */}
                <div className="p-3 rounded-lg border border-border bg-muted/20 space-y-1">
                  <span className="font-semibold text-muted-foreground uppercase tracking-wider text-[10px]">
                    {t("track.assignedBranchLocation")}
                  </span>
                  <p className="font-medium text-foreground text-xs leading-snug line-clamp-2">
                    {activeJourney.partnerAddress || activeJourney.partnerBranch || activeJourney.partnerName}
                  </p>
                  {activeJourney.partnerPhone && (
                    <p className="text-[11px] text-muted-foreground flex items-center gap-1 pt-0.5">
                      <Phone className="size-3 text-primary" />
                      <a
                        href={`tel:${activeJourney.partnerPhone}`}
                        className="hover:text-primary transition-colors font-mono"
                      >
                        {activeJourney.partnerPhone}
                      </a>
                    </p>
                  )}
                </div>

                {/* Nodal Officer Contact */}
                <div className="p-3 rounded-lg border border-border bg-muted/20 space-y-1">
                  <span className="font-semibold text-muted-foreground uppercase tracking-wider text-[10px]">
                    {t("track.designatedNodalOfficer")}
                  </span>
                  <p className="font-medium text-foreground text-xs flex items-center gap-1.5">
                    <UserCheck className="size-3.5 text-primary shrink-0" />
                    {activeJourney.nodalOfficerName || t("track.branchManagerInCharge")}
                  </p>
                  {activeJourney.nodalOfficerPhone && (
                    <p className="text-[11px] text-muted-foreground font-mono">
                      {activeJourney.nodalOfficerPhone}
                    </p>
                  )}
                </div>
              </div>

              {/* Journey Level Notes if present */}
              {activeJourney.notes && (
                <div className="text-xs bg-muted/30 p-2.5 rounded-md border border-border/60 text-muted-foreground">
                  <strong className="text-foreground font-medium mr-1">
                    {t("track.journeyNotesLabel")}:
                  </strong>
                  {activeJourney.notes}
                </div>
              )}

              {/* Journey Action Controls (Reset, Delete) */}
              <div className="flex items-center justify-end gap-2 pt-1 border-t border-border/40 print:hidden text-xs">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleReset(activeJourney.id)}
                  className="h-7 text-xs text-muted-foreground hover:text-foreground gap-1"
                >
                  <RotateCcw className="size-3" />
                  {t("track.resetMilestonesBtn")}
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleDelete(activeJourney.id)}
                  className="h-7 text-xs text-destructive hover:text-destructive hover:bg-destructive/10 gap-1"
                >
                  <Trash2 className="size-3" />
                  {t("track.deleteJourneyBtn")}
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Contextual Next Action Card */}
          <div className="print:hidden">
            <NextActionCard journey={activeJourney} />
          </div>

          {/* 8-Stage Interactive Milestone Stepper */}
          <Card className="border-border shadow-sm">
            <CardContent className="p-4 sm:p-6">
              <MilestoneTracker journey={activeJourney} />
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}
