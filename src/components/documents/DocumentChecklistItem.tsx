import { useState } from "react"
import { useTranslation } from "react-i18next"
import {
  Building2,
  CheckCircle2,
  HelpCircle,
  Lightbulb,
  FileCheck2,
  Edit3,
  Check,
  Sparkles,
} from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import type { RequiredDocument } from "@/types"

interface DocumentChecklistItemProps {
  document: RequiredDocument
  checked: boolean
  note?: string
  onToggle: () => void
  onNoteChange?: (note: string) => void
  compact?: boolean
}

export function DocumentChecklistItem({
  document,
  checked,
  note = "",
  onToggle,
  onNoteChange,
  compact = false,
}: DocumentChecklistItemProps) {
  const { t, i18n } = useTranslation()
  const lang = (i18n.language === "hi" ? "hi" : "en") as "en" | "hi"

  const [isEditingNote, setIsEditingNote] = useState(false)
  const [localNote, setLocalNote] = useState(note)

  const docName = document.name?.[lang] || document.name?.en || ""
  const docDesc = document.description?.[lang] || document.description?.en || ""
  const authority = document.issuingAuthority?.[lang] || document.issuingAuthority?.en || ""
  const guidance = document.guidanceNotes?.[lang] || document.guidanceNotes?.en
  const altDocs = document.alternativeDocs?.[lang] || document.alternativeDocs?.en

  const handleSaveNote = () => {
    onNoteChange?.(localNote)
    setIsEditingNote(false)
  }

  return (
    <div
      className={`group relative rounded-xl border transition-all duration-200 ${
        checked
          ? "border-emerald-500/40 bg-emerald-500/5 shadow-xs dark:bg-emerald-950/15 dark:border-emerald-500/30"
          : "border-border/80 bg-card hover:border-border hover:shadow-xs"
      } ${compact ? "p-3.5" : "p-4 sm:p-5"}`}
    >
      <div className="flex items-start gap-3.5 sm:gap-4">
        {/* Accessible Checkbox with min 44x44px touch target */}
        <div className="flex items-center justify-center shrink-0 pt-0.5">
          <button
            type="button"
            role="checkbox"
            aria-checked={checked}
            aria-label={`${docName} (${checked ? t("documents.ready", "Ready") : t("documents.pending", "Pending")})`}
            onClick={onToggle}
            className={`size-8 sm:size-9 rounded-lg flex items-center justify-center border-2 transition-all cursor-pointer focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 ${
              checked
                ? "bg-emerald-600 border-emerald-600 text-white shadow-xs dark:bg-emerald-500 dark:border-emerald-500"
                : "border-input hover:border-primary/70 bg-background text-transparent hover:bg-muted/50"
            }`}
          >
            <Check className={`size-5 transition-transform duration-200 ${checked ? "scale-100" : "scale-50"}`} />
          </button>
        </div>

        {/* Main Details Body */}
        <div className="flex-1 min-w-0 space-y-2">
          {/* Header Row: Title & Badges */}
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="flex flex-wrap items-center gap-2">
              <h3
                onClick={onToggle}
                className={`font-semibold text-sm sm:text-base cursor-pointer select-none transition-colors ${
                  checked
                    ? "text-foreground font-medium"
                    : "text-foreground group-hover:text-primary"
                }`}
              >
                {docName}
              </h3>
              {checked && (
                <span className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-600 dark:text-emerald-400">
                  <CheckCircle2 className="size-3.5 shrink-0" />
                  <span className="hidden sm:inline">{t("documents.ready", "Ready")}</span>
                </span>
              )}
            </div>

            <div className="flex items-center gap-1.5 shrink-0">
              {document.mandatory ? (
                <Badge
                  variant="destructive"
                  className="text-[10px] sm:text-xs font-semibold uppercase tracking-wider py-0.5 px-2 bg-destructive/10 text-destructive border-destructive/20 hover:bg-destructive/15"
                >
                  {t("documents.mandatory", "Mandatory")}
                </Badge>
              ) : (
                <Badge
                  variant="secondary"
                  className="text-[10px] sm:text-xs font-medium py-0.5 px-2 text-muted-foreground"
                >
                  {t("documents.optional", "Optional")}
                </Badge>
              )}

              {document.digiLockerVerifiable && (
                <Badge
                  variant="outline"
                  className="text-[10px] sm:text-xs font-medium border-emerald-600/30 text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 hidden xs:inline-flex items-center gap-1"
                  title={t("documents.digiLockerVerifiableTip", "Can be verified digitally via DigiLocker")}
                >
                  <Sparkles className="size-2.5 text-emerald-600 dark:text-emerald-400" />
                  <span>DigiLocker</span>
                </Badge>
              )}
            </div>
          </div>

          {/* Description */}
          <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
            {docDesc}
          </p>

          {/* Issuing Authority Card */}
          {authority && (
            <div className="flex items-start gap-2 text-xs text-foreground/80 bg-muted/40 dark:bg-muted/20 rounded-lg p-2.5 border border-border/60">
              <Building2 className="size-4 text-primary shrink-0 mt-0.5" />
              <div className="space-y-0.5">
                <span className="font-semibold text-foreground text-[11px] uppercase tracking-wider block">
                  {t("documents.issuingAuthority", "Issuing Authority / Agency")}:
                </span>
                <span className="text-muted-foreground leading-snug">{authority}</span>
              </div>
            </div>
          )}

          {/* Guidance Note / Tip (if not compact) */}
          {!compact && guidance && (
            <div className="flex items-start gap-2 text-xs text-muted-foreground bg-primary/5 dark:bg-primary/10 rounded-lg p-2.5 border border-primary/15">
              <Lightbulb className="size-4 text-accent shrink-0 mt-0.5" />
              <div className="space-y-0.5">
                <span className="font-semibold text-foreground text-[11px] block">
                  {t("documents.officialTip", "Submission Guidance & Requirements")}:
                </span>
                <span className="leading-snug">{guidance}</span>
              </div>
            </div>
          )}

          {/* Alternatives */}
          {!compact && altDocs && (
            <div className="flex items-center gap-1.5 text-[11px] text-muted-foreground pt-0.5">
              <HelpCircle className="size-3.5 text-muted-foreground/80 shrink-0" />
              <span>
                <strong>{t("documents.acceptedAlternatives", "Accepted Alternatives")}:</strong> {altDocs}
              </span>
            </div>
          )}

          {/* Custom Note or Reference Info */}
          <div className="pt-1.5">
            {isEditingNote ? (
              <div className="flex items-center gap-2 mt-1">
                <Input
                  value={localNote}
                  onChange={(e) => setLocalNote(e.target.value)}
                  placeholder={t(
                    "documents.notePlaceholder",
                    "Add reference number, certificate serial, or renewal note...",
                  )}
                  className="text-xs h-8"
                  autoFocus
                  onKeyDown={(e) => {
                    if (e.key === "Enter") handleSaveNote()
                    if (e.key === "Escape") setIsEditingNote(false)
                  }}
                />
                <Button size="sm" className="h-8 px-3 text-xs" onClick={handleSaveNote}>
                  {t("common.save", "Save")}
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  className="h-8 px-2 text-xs"
                  onClick={() => setIsEditingNote(false)}
                >
                  {t("common.cancel", "Cancel")}
                </Button>
              </div>
            ) : (
              <div className="flex items-center justify-between gap-2 text-xs text-muted-foreground">
                {note ? (
                  <div
                    onClick={() => setIsEditingNote(true)}
                    className="flex items-center gap-1.5 text-foreground/80 bg-accent/10 border border-accent/20 px-2.5 py-1 rounded-md cursor-pointer hover:bg-accent/15 transition-colors"
                  >
                    <FileCheck2 className="size-3.5 text-accent shrink-0" />
                    <span className="truncate max-w-xs sm:max-w-md font-mono text-[11px]">{note}</span>
                    <Edit3 className="size-3 text-muted-foreground ml-1" />
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={() => setIsEditingNote(true)}
                    className="inline-flex items-center gap-1 text-[11px] text-muted-foreground hover:text-primary transition-colors cursor-pointer"
                  >
                    <Edit3 className="size-3" />
                    <span>{t("documents.addNote", "+ Add reference / serial note")}</span>
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
