import { useTranslation } from "react-i18next"
import { Link } from "react-router-dom"
import {
  FileCheck,
  ExternalLink,
} from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { DocumentChecklistItem } from "@/components/documents/DocumentChecklistItem"
import { DocumentReadinessMeter } from "@/components/documents/DocumentReadinessMeter"
import { useDocumentStore } from "@/stores/useDocumentStore"
import {
  getDocumentsForScheme,
  computeReadiness,
} from "@/lib/documentRules"
import type { Scheme } from "@/types"

interface DocumentChecklistModalProps {
  scheme: Scheme
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function DocumentChecklistModal({
  scheme,
  open,
  onOpenChange,
}: DocumentChecklistModalProps) {
  const { t, i18n } = useTranslation()
  const lang = (i18n.language === "hi" ? "hi" : "en") as "en" | "hi"

  const { checkedDocMap, docNotesMap, toggleDocCheck, setDocNote, markAllCheckedForScheme, resetChecklistForScheme } =
    useDocumentStore()

  const schemeName = scheme.name?.[lang] || scheme.name?.en || "Scheme Checklist"
  const docs = getDocumentsForScheme(scheme.id, scheme.type)
  const readiness = computeReadiness(docs, checkedDocMap)
  const docIds = docs.map((d) => d.id)

  const handlePrint = () => {
    window.print()
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto p-4 sm:p-6">
        <DialogHeader className="space-y-1.5 pb-2">
          <div className="flex items-center gap-2 text-primary">
            <FileCheck className="size-5 shrink-0" />
            <span className="text-xs font-bold uppercase tracking-wider">
              {t("documents.modalBadge", "Statutory Document Readiness")}
            </span>
          </div>
          <DialogTitle className="font-display text-xl sm:text-2xl font-bold">
            {schemeName}
          </DialogTitle>
          <DialogDescription className="text-xs sm:text-sm text-muted-foreground">
            {t(
              "documents.modalSubtitle",
              "Check off your documents to track readiness before submitting to the Channel Partner.",
            )}
          </DialogDescription>
        </DialogHeader>

        {/* Readiness Meter */}
        <div className="my-2">
          <DocumentReadinessMeter
            readiness={readiness}
            onMarkAll={() => markAllCheckedForScheme(docIds)}
            onClearAll={() => resetChecklistForScheme(docIds)}
            onPrint={handlePrint}
          />
        </div>

        {/* Checklist items */}
        <div className="space-y-3 mt-4">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
              {t("documents.requiredItems", "Required Certificates & Documents")} ({docs.length})
            </h3>
            <Button asChild variant="link" size="sm" className="text-xs h-auto p-0 text-primary">
              <Link to={`/documents?scheme=${scheme.id}`} onClick={() => onOpenChange(false)}>
                <span>{t("documents.openFullPage", "Open Full Checklist Page")}</span>
                <ExternalLink className="size-3 ml-1" />
              </Link>
            </Button>
          </div>

          <div className="space-y-2.5">
            {docs.map((doc) => (
              <DocumentChecklistItem
                key={doc.id}
                document={doc}
                checked={Boolean(checkedDocMap[doc.id])}
                note={docNotesMap[doc.id]}
                onToggle={() => toggleDocCheck(doc.id)}
                onNoteChange={(note) => setDocNote(doc.id, note)}
                compact
              />
            ))}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
