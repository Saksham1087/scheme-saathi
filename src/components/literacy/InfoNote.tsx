import { useState } from "react"
import { useTranslation } from "react-i18next"
import { ChevronDown, Lightbulb } from "lucide-react"

type Topic = "concessional" | "moratorium" | "channel"

/**
 * Financial-literacy micro-content. Short plain-language explainers surfaced
 * contextually next to results and the calculator.
 */
export function InfoNote({
  topic,
  defaultOpen = false,
}: {
  topic: Topic
  defaultOpen?: boolean
}) {
  const { t } = useTranslation()
  const [open, setOpen] = useState(defaultOpen)

  return (
    <aside className="rounded-lg border border-accent/40 bg-accent/10 overflow-hidden">
      <button
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        className="w-full flex items-center gap-2.5 px-4 py-3 text-left focus-visible:outline-ring rounded-sm"
      >
        <Lightbulb className="size-5 shrink-0 text-accent" aria-hidden />
        <span className="font-display font-semibold text-[15px] flex-1">
          {t(`literacy.${topic}_title`)}
        </span>
        <ChevronDown
          className={`size-4 shrink-0 transition-transform ${open ? "rotate-180" : ""}`}
          aria-hidden
        />
      </button>
      {open && (
        <p className="px-4 pb-4 pl-11 text-sm leading-relaxed text-foreground/85">
          {t(`literacy.${topic}_body`)}
        </p>
      )}
    </aside>
  )
}
