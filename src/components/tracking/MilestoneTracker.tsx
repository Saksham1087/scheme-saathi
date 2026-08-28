import { useState } from "react"
import { useTranslation } from "react-i18next"
import {
  Check,
  CircleDot,
  Clock,
  FileText,
  ChevronDown,
  ChevronUp,
  Hash,
  Sparkles,
} from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { useApplicationStore } from "@/stores/useApplicationStore"
import { useLocaleStore } from "@/stores/localeStore"
import {
  DEFAULT_MILESTONE_DEFINITIONS,
  type ApplicationJourney,
  type ApplicationStageKey,
} from "@/types/application"

interface MilestoneTrackerProps {
  journey: ApplicationJourney
}

export function MilestoneTracker({ journey }: MilestoneTrackerProps) {
  const { t } = useTranslation()
  const { lang } = useLocaleStore()
  const {
    toggleMilestone,
    updateMilestoneNotes,
    updateAcknowledgmentNumber,
  } = useApplicationStore()

  const [expandedNotesStage, setExpandedNotesStage] = useState<ApplicationStageKey | null>(null)
  const [editingNotes, setEditingNotes] = useState<Record<string, string>>({})
  const [editingRefNo, setEditingRefNo] = useState(false)
  const [tempRefNo, setTempRefNo] = useState(journey.acknowledgmentNumber || "")

  function formatDate(isoString?: string) {
    if (!isoString) return null
    try {
      const d = new Date(isoString)
      return d.toLocaleDateString(lang === "hi" ? "hi-IN" : "en-IN", {
        day: "numeric",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      })
    } catch {
      return isoString
    }
  }

  function handleToggle(stageKey: ApplicationStageKey) {
    toggleMilestone(journey.id, stageKey)
  }

  function handleSaveNotes(stageKey: ApplicationStageKey) {
    const text = editingNotes[stageKey] ?? ""
    updateMilestoneNotes(journey.id, stageKey, text)
    setExpandedNotesStage(null)
  }

  function handleSaveRefNo() {
    updateAcknowledgmentNumber(journey.id, tempRefNo.trim())
    setEditingRefNo(false)
  }

  return (
    <div className="space-y-4" aria-label={t("track.milestonesTimeline")}>
      <div className="flex items-center justify-between">
        <h3 className="font-display font-bold text-lg text-foreground flex items-center gap-2">
          <Sparkles className="size-4 text-primary" />
          {t("track.milestoneJourneyTitle")}
        </h3>
        <span className="text-xs text-muted-foreground">
          {t("track.clickToToggleHint")}
        </span>
      </div>

      <div className="relative pl-6 sm:pl-8 space-y-6 before:absolute before:left-3 sm:before:left-4 before:top-3 before:bottom-3 before:w-0.5 before:bg-border">
        {DEFAULT_MILESTONE_DEFINITIONS.map((def) => {
          const record = journey.stages.find((s) => s.stageKey === def.key)
          const isCompleted = Boolean(record?.completed)
          const isCurrent = journey.currentStage === def.key && !isCompleted
          const stageNotes = record?.notes || ""
          const isNotesOpen = expandedNotesStage === def.key
          const completedDateStr = formatDate(record?.completedAt)

          return (
            <div key={def.key} className="relative group">
              {/* Step Node Icon / Touch Target */}
              <button
                type="button"
                onClick={() => handleToggle(def.key)}
                aria-label={`${t("track.markStage")} ${def.title[lang] || def.title.en} ${
                  isCompleted ? t("track.completed") : t("track.incomplete")
                }`}
                title={
                  isCompleted
                    ? t("track.markAsIncomplete")
                    : t("track.markAsCompleted")
                }
                className={`absolute -left-6 sm:-left-8 top-1.5 flex size-7 sm:size-8 items-center justify-center rounded-full border-2 transition-all duration-200 focus-visible:ring-2 focus-visible:ring-primary focus-visible:outline-none cursor-pointer min-w-[32px] min-h-[32px] sm:min-w-[36px] sm:min-h-[36px] ${
                  isCompleted
                    ? "bg-emerald-600 border-emerald-600 text-white shadow-sm hover:bg-emerald-700"
                    : isCurrent
                    ? "bg-primary border-primary text-primary-foreground ring-4 ring-primary/20 animate-pulse"
                    : "bg-background border-muted-foreground/30 text-muted-foreground hover:border-primary/50"
                }`}
              >
                {isCompleted ? (
                  <Check className="size-4 stroke-[3]" />
                ) : isCurrent ? (
                  <CircleDot className="size-4" />
                ) : (
                  <span className="text-xs font-bold">{def.order}</span>
                )}
              </button>

              {/* Stage Card */}
              <Card
                className={`transition-all duration-200 border ${
                  isCompleted
                    ? "border-emerald-500/30 bg-emerald-500/[0.02]"
                    : isCurrent
                    ? "border-primary/40 bg-primary/[0.02] shadow-sm"
                    : "border-border/70 hover:border-border"
                }`}
              >
                <CardContent className="p-4 sm:p-5">
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2.5">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                          {t("track.stagePrefix", { number: def.order })}
                        </span>
                        {isCompleted && (
                          <Badge className="bg-emerald-600 text-white hover:bg-emerald-700 font-medium text-[11px] px-2 py-0.5">
                            <Check className="size-3 mr-1" />
                            {t("track.completedBadge")}
                          </Badge>
                        )}
                        {isCurrent && (
                          <Badge variant="default" className="text-[11px] px-2 py-0.5 animate-pulse">
                            {t("track.currentStageBadge")}
                          </Badge>
                        )}
                        {def.estimatedDays && (
                          <span className="inline-flex items-center text-xs text-muted-foreground gap-1">
                            <Clock className="size-3" />
                            ~{def.estimatedDays} {t("track.days")}
                          </span>
                        )}
                      </div>

                      <h4
                        onClick={() => handleToggle(def.key)}
                        className={`text-base font-semibold font-display cursor-pointer select-none transition-colors ${
                          isCompleted
                            ? "text-foreground line-through decoration-emerald-600/50"
                            : "text-foreground hover:text-primary"
                        }`}
                      >
                        {def.title[lang] || def.title.en}
                      </h4>

                      <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                        {def.description[lang] || def.description.en}
                      </p>
                    </div>

                    {/* Checkbox Trigger Button for explicit accessibility */}
                    <div className="flex sm:flex-col items-center sm:items-end gap-2 shrink-0 pt-1 sm:pt-0">
                      <Button
                        size="sm"
                        variant={isCompleted ? "outline" : "default"}
                        onClick={() => handleToggle(def.key)}
                        className={`h-9 text-xs font-medium min-w-[120px] transition-colors ${
                          isCompleted
                            ? "border-emerald-600 text-emerald-700 dark:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-950/30"
                            : ""
                        }`}
                      >
                        {isCompleted ? (
                          <>
                            <Check className="size-3.5 mr-1 text-emerald-600" />
                            {t("track.doneBtn")}
                          </>
                        ) : (
                          t("track.markDoneBtn")
                        )}
                      </Button>
                    </div>
                  </div>

                  {/* Stage 6 Specific: Acknowledgment Receipt Number */}
                  {def.key === "submitted" && (
                    <div className="mt-3.5 pt-3 border-t border-border/60 bg-muted/30 rounded-lg p-3">
                      <div className="flex items-center justify-between flex-wrap gap-2">
                        <div className="flex items-center gap-1.5 text-xs font-semibold text-foreground">
                          <Hash className="size-3.5 text-primary" />
                          <span>{t("track.ackReceiptLabel")}:</span>
                          {journey.acknowledgmentNumber ? (
                            <code className="px-2 py-0.5 bg-background border border-border rounded text-primary font-mono text-xs font-bold">
                              {journey.acknowledgmentNumber}
                            </code>
                          ) : (
                            <span className="text-muted-foreground font-normal italic">
                              {t("track.noAckYet")}
                            </span>
                          )}
                        </div>

                        {!editingRefNo ? (
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-7 text-xs text-primary"
                            onClick={() => {
                              setTempRefNo(journey.acknowledgmentNumber || "")
                              setEditingRefNo(true)
                            }}
                          >
                            {journey.acknowledgmentNumber
                              ? t("track.editAckBtn")
                              : t("track.addAckBtn")}
                          </Button>
                        ) : null}
                      </div>

                      {editingRefNo && (
                        <div className="mt-2 flex items-center gap-2">
                          <Input
                            placeholder={t("track.ackPlaceholder")}
                            value={tempRefNo}
                            onChange={(e) => setTempRefNo(e.target.value)}
                            className="h-8 text-xs font-mono"
                          />
                          <Button
                            size="sm"
                            className="h-8 text-xs shrink-0"
                            onClick={handleSaveRefNo}
                          >
                            {t("common.submit")}
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            className="h-8 text-xs shrink-0"
                            onClick={() => setEditingRefNo(false)}
                          >
                            {t("common.cancel")}
                          </Button>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Completion Date Stamp & Notes Section Toggle */}
                  <div className="mt-3.5 pt-2.5 border-t border-border/50 flex items-center justify-between flex-wrap gap-2 text-xs">
                    <div className="flex items-center gap-2 text-muted-foreground">
                      {isCompleted && completedDateStr && (
                        <span className="inline-flex items-center gap-1 text-emerald-700 dark:text-emerald-400 font-medium">
                          <Check className="size-3" />
                          {t("track.completedOn", { date: completedDateStr })}
                        </span>
                      )}
                    </div>

                    <button
                      type="button"
                      onClick={() => {
                        if (isNotesOpen) {
                          setExpandedNotesStage(null)
                        } else {
                          setEditingNotes((prev) => ({
                            ...prev,
                            [def.key]: stageNotes,
                          }))
                          setExpandedNotesStage(def.key)
                        }
                      }}
                      className="inline-flex items-center gap-1 font-medium text-primary hover:underline cursor-pointer"
                    >
                      <FileText className="size-3" />
                      {stageNotes
                        ? t("track.viewEditNotes")
                        : t("track.addVisitNote")}
                      {isNotesOpen ? (
                        <ChevronUp className="size-3" />
                      ) : (
                        <ChevronDown className="size-3" />
                      )}
                    </button>
                  </div>

                  {/* Expanded Notes Editor */}
                  {isNotesOpen && (
                    <div className="mt-3 space-y-2 bg-muted/40 p-3 rounded-lg border border-border/60">
                      <label className="text-xs font-medium text-foreground block">
                        {t("track.notesForStage", { stage: def.shortTitle[lang] || def.shortTitle.en })}
                      </label>
                      <Textarea
                        rows={2}
                        placeholder={t("track.notesPlaceholder")}
                        value={
                          editingNotes[def.key] !== undefined
                            ? editingNotes[def.key]
                            : stageNotes
                        }
                        onChange={(e) =>
                          setEditingNotes((prev) => ({
                            ...prev,
                            [def.key]: e.target.value,
                          }))
                        }
                        className="text-xs resize-none"
                      />
                      <div className="flex justify-end gap-2">
                        <Button
                          size="sm"
                          variant="ghost"
                          className="h-7 text-xs"
                          onClick={() => setExpandedNotesStage(null)}
                        >
                          {t("common.cancel")}
                        </Button>
                        <Button
                          size="sm"
                          className="h-7 text-xs"
                          onClick={() => handleSaveNotes(def.key)}
                        >
                          {t("track.saveNoteBtn")}
                        </Button>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          )
        })}
      </div>
    </div>
  )
}
