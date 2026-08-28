import { useTranslation } from "react-i18next"
import { CheckCircle2, ShieldCheck, Sparkles } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import type { MatchReason } from "@/types"

interface WhyThisSchemeCardProps {
  reasons: MatchReason[]
  className?: string
}

export function WhyThisSchemeCard({
  reasons,
  className = "",
}: WhyThisSchemeCardProps) {
  const { t } = useTranslation()

  if (!reasons || reasons.length === 0) {
    return null
  }

  return (
    <div
      className={`rounded-xl border border-emerald-500/20 bg-emerald-500/5 p-4 text-card-foreground dark:border-emerald-500/30 dark:bg-emerald-950/20 ${className}`}
      data-testid="why-this-scheme-card"
    >
      <div className="flex items-center gap-2 mb-3">
        <div className="flex size-6 items-center justify-center rounded-full bg-emerald-600/10 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-400">
          <Sparkles className="size-3.5" />
        </div>
        <h4 className="font-display font-semibold text-sm text-emerald-900 dark:text-emerald-200">
          {t("results.whyThisSchemeHeading")}
        </h4>
        <Badge
          variant="outline"
          className="ml-auto text-[11px] font-medium bg-emerald-100/70 text-emerald-800 border-emerald-300 dark:bg-emerald-900/40 dark:text-emerald-300 dark:border-emerald-700/50"
        >
          <ShieldCheck className="mr-1 size-3" />
          {t("results.allCriteriaPassed")}
        </Badge>
      </div>

      <ul className="space-y-2">
        {reasons.map((r, i) => (
          <li
            key={`${r.key}-${i}`}
            className="flex items-start gap-2.5 rounded-lg bg-background/60 p-2.5 text-xs text-foreground/90 border border-emerald-500/15"
          >
            <CheckCircle2
              className="size-4 shrink-0 mt-0.5 text-emerald-600 dark:text-emerald-400"
              aria-hidden="true"
            />
            <span className="leading-relaxed">
              {t(`reasons.${r.key}`, r.params)}
            </span>
          </li>
        ))}
      </ul>
    </div>
  )
}
