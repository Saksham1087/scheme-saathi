import { useTranslation } from "react-i18next"
import { CheckCircle2, Circle, FileText, Info } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"

export interface DocumentCheckItem {
  id: string
  name: string
  description?: string
  mandatory: boolean
  ready: boolean
  digilockerAvailable?: boolean
}

interface DocumentChecklistProps {
  documents: DocumentCheckItem[]
  onToggle: (id: string) => void
}

export function DocumentChecklist({ documents, onToggle }: DocumentChecklistProps) {
  const { t } = useTranslation()

  const totalRequired = documents.filter((d) => d.mandatory).length
  const readyRequired = documents.filter((d) => d.mandatory && d.ready).length
  const progressPct = totalRequired > 0 ? (readyRequired / totalRequired) * 100 : 100

  return (
    <div className="space-y-4">
      <ReadinessProgress
        ready={readyRequired}
        total={totalRequired}
        pct={progressPct}
      />
      <div className="space-y-2">
        {documents.map((doc) => (
          <DocumentItem key={doc.id} doc={doc} onToggle={() => onToggle(doc.id)} />
        ))}
      </div>
      <div className="flex items-start gap-2 rounded-lg bg-secondary/50 p-3 text-xs text-muted-foreground">
        <Info className="size-4 shrink-0 mt-0.5" />
        <p>{t("checklist.reminder")}</p>
      </div>
    </div>
  )
}

function ReadinessProgress({
  ready,
  total,
  pct,
}: {
  ready: number
  total: number
  pct: number
}) {
  const { t } = useTranslation()

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium">
          {t("checklist.readyCount", { ready, total })}
        </span>
        <span className="text-xs text-muted-foreground tabular-nums">
          {Math.round(pct)}%
        </span>
      </div>
      <Progress value={pct} className="h-2" />
    </div>
  )
}

function DocumentItem({
  doc,
  onToggle,
}: {
  doc: DocumentCheckItem
  onToggle: () => void
}) {
  const { t } = useTranslation()

  return (
    <div
      className={`flex items-center gap-3 rounded-lg border p-3 transition-colors ${
        doc.ready
          ? "border-success/30 bg-success/5"
          : "border-border hover:bg-secondary/50"
      }`}
    >
      <button
        onClick={onToggle}
        className="shrink-0"
        aria-label={
          doc.ready
            ? t("checklist.markNotReady", { name: doc.name })
            : t("checklist.markReady", { name: doc.name })
        }
      >
        {doc.ready ? (
          <CheckCircle2 className="size-5 text-success" />
        ) : (
          <Circle className="size-5 text-muted-foreground" />
        )}
      </button>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <span className={`text-sm font-medium ${doc.ready ? "line-through text-muted-foreground" : ""}`}>
            {doc.name}
          </span>
          <Badge
            variant={doc.mandatory ? "default" : "secondary"}
            className="text-[10px] px-1.5 py-0"
          >
            {doc.mandatory ? t("checklist.required") : t("checklist.optional")}
          </Badge>
        </div>
        {doc.description && (
          <p className="text-xs text-muted-foreground mt-0.5">{doc.description}</p>
        )}
      </div>
      {doc.digilockerAvailable && !doc.ready && (
        <Button size="sm" variant="outline" className="shrink-0 text-xs">
          <FileText className="size-3 mr-1" />
          DigiLocker
        </Button>
      )}
    </div>
  )
}
