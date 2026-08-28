import React from "react"
import { useNavigate } from "react-router-dom"
import { useTranslation } from "react-i18next"
import {
  Bot,
  Volume2,
  VolumeX,
  ExternalLink,
  ShieldCheck,
  ShieldAlert,
  Calculator,
  FileText,
  Building2,
  ListChecks,
  Sparkles,
  ArrowRight,
  Info,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import type {
  ChatMessage,
  AssistantActionPill,
  AssistantActionIcon,
  GroundedCitation,
} from "@/types/assistant"
import { useAssistantStore } from "@/stores/useAssistantStore"
import { useLocaleStore } from "@/stores/localeStore"

interface ChatBubbleProps {
  message: ChatMessage
}

function renderActionIcon(icon?: AssistantActionIcon) {
  switch (icon) {
    case "calculator":
      return <Calculator className="size-3.5 mr-1 text-emerald-600 dark:text-emerald-400" />
    case "file-text":
      return <FileText className="size-3.5 mr-1 text-blue-600 dark:text-blue-400" />
    case "building":
      return <Building2 className="size-3.5 mr-1 text-purple-600 dark:text-purple-400" />
    case "list-checks":
      return <ListChecks className="size-3.5 mr-1 text-amber-600 dark:text-amber-400" />
    case "sparkles":
      return <Sparkles className="size-3.5 mr-1 text-primary animate-pulse" />
    case "arrow-right":
      return <ArrowRight className="size-3.5 mr-1 text-muted-foreground" />
    case "external-link":
      return <ExternalLink className="size-3.5 mr-1 text-muted-foreground" />
    default:
      return <Info className="size-3.5 mr-1 text-muted-foreground" />
  }
}

/**
 * Lightweight and safe markdown block parser for assistant responses.
 * Parses headers, bolding, tables, blockquotes, and lists cleanly.
 */
function FormattedContent({ content }: { content: string }) {
  const lines = content.split("\n")
  const elements: React.ReactNode[] = []
  let tableRows: string[][] = []
  let inTable = false

  const parseInline = (text: string): React.ReactNode => {
    // Bold: **text**
    const parts = text.split(/(\*\*[^*]+\*\*)/g)
    return parts.map((part, idx) => {
      if (part.startsWith("**") && part.endsWith("**")) {
        return (
          <strong key={idx} className="font-semibold text-foreground">
            {part.slice(2, -2)}
          </strong>
        )
      }
      // Italic: *text*
      const italicParts = part.split(/(\*[^*]+\*)/g)
      return (
        <span key={idx}>
          {italicParts.map((sub, sIdx) => {
            if (sub.startsWith("*") && sub.endsWith("*")) {
              return (
                <em key={sIdx} className="italic text-muted-foreground">
                  {sub.slice(1, -1)}
                </em>
              )
            }
            return sub
          })}
        </span>
      )
    })
  }

  const flushTable = (keyPrefix: number) => {
    if (tableRows.length === 0) return
    const headers = tableRows[0]
    const dataRows = tableRows.slice(1).filter((r) => !r.every((c) => c.includes("---")))

    elements.push(
      <div key={`table-${keyPrefix}`} className="my-2.5 overflow-x-auto rounded-lg border border-border/80 text-xs">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-muted/60 border-b border-border/70">
              {headers.map((h, i) => (
                <th key={i} className="px-2.5 py-1.5 font-semibold text-foreground">
                  {parseInline(h.trim())}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {dataRows.map((row, rIdx) => (
              <tr
                key={rIdx}
                className={`border-b border-border/40 last:border-0 ${
                  rIdx % 2 === 0 ? "bg-background" : "bg-muted/20"
                }`}
              >
                {row.map((cell, cIdx) => (
                  <td key={cIdx} className="px-2.5 py-1.5 align-top">
                    {parseInline(cell.trim())}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>,
    )
    tableRows = []
    inTable = false
  }

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i]

    // Table detection
    if (line.trim().startsWith("|") && line.trim().endsWith("|")) {
      inTable = true
      const cells = line
        .trim()
        .slice(1, -1)
        .split("|")
        .map((c) => c.trim())
      tableRows.push(cells)
      continue
    } else if (inTable) {
      flushTable(i)
    }

    // Header: ### or ####
    if (line.startsWith("### ")) {
      elements.push(
        <h3 key={i} className="text-base font-bold text-foreground mt-2 mb-1 flex items-center gap-1.5">
          {parseInline(line.slice(4))}
        </h3>,
      )
      continue
    }
    if (line.startsWith("#### ")) {
      elements.push(
        <h4 key={i} className="text-sm font-bold text-foreground mt-2 mb-0.5">
          {parseInline(line.slice(5))}
        </h4>,
      )
      continue
    }

    // Blockquote: > ...
    if (line.startsWith("> ")) {
      elements.push(
        <div
          key={i}
          className="my-2 border-l-4 border-amber-500 bg-amber-500/10 dark:bg-amber-500/20 px-3 py-2 rounded-r-md text-xs leading-relaxed text-amber-950 dark:text-amber-200"
        >
          {parseInline(line.slice(2))}
        </div>,
      )
      continue
    }

    // List item: - ... or * ...
    if (line.trim().startsWith("- ") || line.trim().startsWith("* ")) {
      const indentLevel = line.search(/\S/) > 2 ? "ml-5" : "ml-2"
      elements.push(
        <div key={i} className={`flex items-start gap-2 my-0.5 text-sm leading-relaxed ${indentLevel}`}>
          <span className="size-1.5 rounded-full bg-primary/70 mt-2 shrink-0" />
          <span className="flex-1">{parseInline(line.trim().slice(2))}</span>
        </div>,
      )
      continue
    }

    // Numbered list item: 1. ...
    const numMatch = line.trim().match(/^(\d+)\.\s+(.*)$/)
    if (numMatch) {
      elements.push(
        <div key={i} className="flex items-start gap-2 my-0.5 text-sm leading-relaxed ml-2">
          <span className="font-semibold text-primary/80 shrink-0 text-xs mt-0.5">{numMatch[1]}.</span>
          <span className="flex-1">{parseInline(numMatch[2])}</span>
        </div>,
      )
      continue
    }

    // Regular line / Paragraph
    if (line.trim().length > 0) {
      elements.push(
        <p key={i} className="my-1 text-sm leading-relaxed">
          {parseInline(line)}
        </p>,
      )
    } else {
      // Empty line / spacer
      elements.push(<div key={i} className="h-1" />)
    }
  }

  if (inTable) {
    flushTable(lines.length)
  }

  return <div className="space-y-0.5">{elements}</div>
}

export function ChatBubble({ message }: ChatBubbleProps) {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const { lang: currentLang } = useLocaleStore()
  const { activeAudioMessageId, speakMessage, stopAudio } = useAssistantStore()

  const isUser = message.role === "user"
  const isSpeaking = activeAudioMessageId === message.id

  const formatTimestamp = (ts: number) => {
    return new Date(ts).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
  }

  const handleActionClick = (action: AssistantActionPill) => {
    if (action.to.startsWith("http")) {
      window.open(action.to, "_blank", "noopener,noreferrer")
    } else {
      navigate(action.to)
    }
  }

  const getPillLabel = (label: string | { en: string; hi: string }): string => {
    if (typeof label === "string") return label
    return currentLang === "hi" ? label.hi : label.en
  }

  if (isUser) {
    return (
      <div className="flex justify-end my-3 pl-8">
        <div className="flex flex-col items-end max-w-[85%] sm:max-w-[75%]">
          <div className="rounded-2xl rounded-tr-xs bg-primary px-4 py-2.5 text-primary-foreground shadow-sm">
            <p className="text-sm font-medium leading-relaxed whitespace-pre-wrap">{message.content}</p>
          </div>
          <span className="text-[10px] text-muted-foreground mt-1 px-1">{formatTimestamp(message.timestamp)}</span>
        </div>
      </div>
    )
  }

  return (
    <div className="flex items-start gap-2.5 my-3 pr-4 sm:pr-8">
      {/* Bot Avatar */}
      <div className="size-8 rounded-full bg-linear-to-tr from-amber-500 to-primary text-white flex items-center justify-center shrink-0 shadow-sm mt-0.5">
        <Bot className="size-4.5" />
      </div>

      {/* Bot Message Body */}
      <div className="flex-1 flex flex-col items-start max-w-[95%] sm:max-w-[85%]">
        <div
          className={`w-full rounded-2xl rounded-tl-xs border bg-card p-4 shadow-sm text-card-foreground transition-colors ${
            message.isGuardrailTriggered
              ? "border-amber-400/50 bg-amber-50/30 dark:bg-amber-950/10"
              : "border-border/80"
          }`}
        >
          {/* Header Bar */}
          <div className="flex items-center justify-between gap-2 mb-2 pb-1.5 border-b border-border/50">
            <div className="flex items-center gap-1.5">
              <span className="font-display text-xs font-bold tracking-tight text-foreground">
                Saathi AI
              </span>
              {message.isGuardrailTriggered ? (
                <Badge
                  variant="outline"
                  className="bg-amber-100 dark:bg-amber-900/30 text-amber-800 dark:text-amber-300 border-amber-300 dark:border-amber-700 text-[10px] py-0 px-1.5 h-4.5 flex items-center gap-1"
                >
                  <ShieldAlert className="size-2.5" />
                  <span>{t("assistant.guardrailBadge", "Safety Guardrail")}</span>
                </Badge>
              ) : (
                <Badge
                  variant="outline"
                  className="bg-emerald-100 dark:bg-emerald-900/30 text-emerald-800 dark:text-emerald-300 border-emerald-300 dark:border-emerald-700 text-[10px] py-0 px-1.5 h-4.5 flex items-center gap-1"
                >
                  <ShieldCheck className="size-2.5" />
                  <span>{t("assistant.verifiedBadge", "Verified Grounding")}</span>
                </Badge>
              )}
            </div>

            {/* Audio Speech Readout Button */}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                if (isSpeaking) {
                  stopAudio()
                } else {
                  void speakMessage(message.id, message.content, message.lang || currentLang)
                }
              }}
              className={`h-7 px-2 text-xs rounded-full cursor-pointer transition-colors ${
                isSpeaking
                  ? "bg-primary text-primary-foreground hover:bg-primary/90 animate-pulse"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted"
              }`}
              aria-label={isSpeaking ? t("assistant.stopAudio", "Stop Audio") : t("assistant.readAloud", "Read Aloud")}
              title={isSpeaking ? "Stop speech playback" : "Listen to answer"}
            >
              {isSpeaking ? (
                <>
                  <VolumeX className="size-3.5 mr-1 text-white" />
                  <span className="text-[11px] font-semibold">{t("assistant.speaking", "Stop")}</span>
                </>
              ) : (
                <>
                  <Volume2 className="size-3.5 mr-1" />
                  <span className="text-[11px]">{t("assistant.listen", "Listen")}</span>
                </>
              )}
            </Button>
          </div>

          {/* Formatted Text Content */}
          <FormattedContent content={message.content} />

          {/* Grounded Source Citations */}
          {message.citations && message.citations.length > 0 && (
            <div className="mt-3.5 pt-2.5 border-t border-border/60">
              <div className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground mb-1.5 flex items-center gap-1">
                <ShieldCheck className="size-3 text-emerald-600 dark:text-emerald-400" />
                <span>{t("assistant.sourcesLabel", "Verified Sources & Statutory Citations:")}</span>
              </div>
              <div className="space-y-1">
                {message.citations.map((citation: GroundedCitation, cIdx: number) => (
                  <div
                    key={cIdx}
                    className="flex items-start justify-between gap-2 rounded-md bg-muted/50 px-2.5 py-1.5 text-xs text-muted-foreground border border-border/40"
                  >
                    <div className="flex-1">
                      <p className="font-semibold text-foreground">{citation.schemeName}</p>
                      {citation.section && <p className="text-[11px] text-muted-foreground">{citation.section}</p>}
                    </div>
                    {citation.officialSourceUrl && (
                      <a
                        href={citation.officialSourceUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-primary hover:underline shrink-0 p-1"
                        aria-label="Open official source guidelines"
                      >
                        <ExternalLink className="size-3.5" />
                      </a>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Contextual Action Pills */}
          {message.actionPills && message.actionPills.length > 0 && (
            <div className="mt-3.5 pt-2 border-t border-dashed border-border/60">
              <div className="text-[11px] font-semibold text-muted-foreground mb-1.5">
                {t("assistant.suggestedActions", "Recommended Next Steps:")}
              </div>
              <div className="flex flex-wrap gap-1.5">
                {message.actionPills.map((action) => (
                  <button
                    key={action.id}
                    type="button"
                    onClick={() => handleActionClick(action)}
                    className="inline-flex items-center min-h-[44px] px-3 py-1.5 rounded-full border border-border bg-background hover:bg-muted/80 text-xs font-medium text-foreground transition-all duration-200 shadow-2xs hover:shadow-xs active:scale-95 cursor-pointer"
                  >
                    {renderActionIcon(action.icon)}
                    <span>{getPillLabel(action.label)}</span>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Timestamp */}
        <span className="text-[10px] text-muted-foreground mt-1 px-1">{formatTimestamp(message.timestamp)}</span>
      </div>
    </div>
  )
}
