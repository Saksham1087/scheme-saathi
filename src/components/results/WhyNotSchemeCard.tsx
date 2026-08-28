import { useNavigate } from "react-router-dom"
import { useTranslation } from "react-i18next"
import {
  AlertCircle,
  ArrowRight,
  ArrowUpRight,
  CheckCircle2,
  Compass,
  FileText,
  Lightbulb,
} from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { fmtINR } from "@/lib/format"
import type { GapItem, LocalizedText, MatchReason, SchemeAlternative } from "@/types"

interface WhyNotSchemeCardProps {
  schemeId: string
  gapBreakdown?: GapItem[]
  remedialAdvice?: LocalizedText[]
  alternativeSchemes?: SchemeAlternative[]
  blockers?: MatchReason[]
  onSelectAlternative?: (schemeId: string) => void
  className?: string
}

export function WhyNotSchemeCard({
  schemeId,
  gapBreakdown,
  remedialAdvice,
  alternativeSchemes,
  blockers,
  onSelectAlternative,
  className = "",
}: WhyNotSchemeCardProps) {
  const { t, i18n } = useTranslation()
  const navigate = useNavigate()
  const isHindi = i18n.language === "hi"

  const getText = (text?: LocalizedText) => {
    if (!text) return ""
    return isHindi ? text.hi || text.en : text.en || text.hi
  }

  const handleAlternativeClick = (altSchemeId: string) => {
    if (onSelectAlternative) {
      onSelectAlternative(altSchemeId)
    } else {
      navigate(`/schemes/${altSchemeId}`)
    }
  }

  return (
    <div
      className={`rounded-xl border border-rose-500/20 bg-rose-500/5 p-4 text-card-foreground dark:border-rose-500/30 dark:bg-rose-950/20 space-y-4 ${className}`}
      data-testid="why-not-scheme-card"
    >
      {/* Header */}
      <div className="flex items-center gap-2">
        <div className="flex size-6 items-center justify-center rounded-full bg-rose-600/10 text-rose-700 dark:bg-rose-500/20 dark:text-rose-400">
          <AlertCircle className="size-3.5" />
        </div>
        <h4 className="font-display font-semibold text-sm text-rose-900 dark:text-rose-200">
          {t("results.whyNotSchemeHeading")}
        </h4>
        <Badge
          variant="outline"
          className="ml-auto text-[11px] font-medium bg-rose-100/70 text-rose-800 border-rose-300 dark:bg-rose-900/40 dark:text-rose-300 dark:border-rose-700/50"
        >
          {t("results.gapIdentified")}
        </Badge>
      </div>

      {/* 1. Itemized Constraint Failures / Gaps */}
      <div className="space-y-2">
        <p className="text-xs font-bold uppercase tracking-wider text-rose-800/80 dark:text-rose-300/80">
          {t("results.constraintFailuresTitle")}
        </p>

        {gapBreakdown && gapBreakdown.length > 0 ? (
          <ul className="space-y-2">
            {gapBreakdown.map((gap, idx) => (
              <li
                key={`${gap.criterion}-${idx}`}
                className="rounded-lg border border-rose-500/20 bg-background/80 p-3 text-xs space-y-1.5"
              >
                <div className="flex items-start gap-2">
                  <AlertCircle className="size-4 shrink-0 mt-0.5 text-rose-600 dark:text-rose-400" />
                  <div className="flex-1">
                    <span className="font-medium text-foreground leading-relaxed">
                      {getText(gap.explanation)}
                    </span>
                    {(gap.userValue !== undefined || gap.requiredValue !== undefined) && (
                      <div className="mt-1 flex flex-wrap gap-x-4 gap-y-1 text-[11px] text-muted-foreground">
                        {gap.userValue !== undefined && (
                          <span>
                            {t("results.yourValue")}: <strong className="text-foreground">{gap.userValue}</strong>
                          </span>
                        )}
                        {gap.requiredValue !== undefined && (
                          <span>
                            {t("results.schemeLimit")}: <strong className="text-foreground">{gap.requiredValue}</strong>
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </li>
            ))}
          </ul>
        ) : blockers && blockers.length > 0 ? (
          <ul className="space-y-1.5">
            {blockers.map((b, idx) => (
              <li
                key={`${b.key}-${idx}`}
                className="flex items-start gap-2 text-xs text-foreground/85 rounded-lg border border-rose-500/15 bg-background/60 p-2.5"
              >
                <ArrowRight className="size-3.5 shrink-0 mt-0.5 text-rose-600 dark:text-rose-400" />
                <span>{t(`reasons.${b.key}`, b.params)}</span>
              </li>
            ))}
          </ul>
        ) : null}
      </div>

      {/* 2. Actionable Remedial Advice & Guidance */}
      {remedialAdvice && remedialAdvice.length > 0 && (
        <div className="rounded-lg border border-amber-500/25 bg-amber-500/10 p-3 text-xs text-amber-950 dark:text-amber-200 dark:bg-amber-950/30 dark:border-amber-500/30 space-y-1.5">
          <div className="flex items-center gap-1.5 font-semibold text-amber-900 dark:text-amber-300">
            <Lightbulb className="size-3.5 text-amber-600 dark:text-amber-400 shrink-0" />
            <span>{t("results.remedialAdviceTitle")}</span>
          </div>
          <ul className="space-y-1 pl-5 list-disc">
            {remedialAdvice.map((adv, idx) => (
              <li key={idx} className="leading-relaxed">
                {getText(adv)}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* 3. Suitable Alternative Scheme Recommendations */}
      {alternativeSchemes && alternativeSchemes.length > 0 && (
        <div className="pt-2 border-t border-rose-500/15 space-y-2.5">
          <div className="flex items-center gap-1.5">
            <Compass className="size-4 text-primary" />
            <h5 className="font-semibold text-xs uppercase tracking-wider text-foreground">
              {t("results.suggestedAlternativesTitle")}
            </h5>
          </div>

          <div className="grid grid-cols-1 gap-2">
            {alternativeSchemes.map((alt) => {
              const altName = getText(alt.schemeName)
              const altReason = getText(alt.reason)

              return (
                <div
                  key={alt.schemeId}
                  className="rounded-lg border border-primary/20 bg-background/90 p-3 hover:border-primary/40 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-2xs"
                >
                  <div className="space-y-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <Badge variant="secondary" className="text-[10px] px-1.5 py-0 font-medium">
                        {t(`schemeTypes.${alt.schemeType}`)}
                      </Badge>
                      <h6 className="font-semibold text-xs text-foreground">
                        {altName}
                      </h6>
                    </div>
                    <p className="text-[11px] text-muted-foreground leading-relaxed">
                      {altReason}
                    </p>
                    <div className="flex items-center gap-3 text-[11px] text-muted-foreground">
                      <span>
                        {t("results.maxLimit")}: <strong className="text-primary font-semibold">{fmtINR(alt.maxProjectCost)}</strong>
                      </span>
                      <span>•</span>
                      <span>
                        {t("results.rateRange", { min: alt.rateRange.min, max: alt.rateRange.max })}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <Button
                      size="sm"
                      variant="outline"
                      className="h-7 text-xs border-primary/30 text-primary hover:bg-primary/10 gap-1"
                      onClick={() => handleAlternativeClick(alt.schemeId)}
                      aria-label={`${t("results.considerAlternativeCta")} - ${altName}`}
                    >
                      <CheckCircle2 className="size-3 text-primary" />
                      <span>{t("results.considerAlternativeCta")}</span>
                      <ArrowUpRight className="size-3" />
                    </Button>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}

      {/* Scheme details button - ensure user is never blocked */}
      <div className="pt-1 flex items-center justify-between text-xs">
        <span className="text-muted-foreground text-[11px]">
          {t("results.schemeDetailsPrompt")}
        </span>
        <Button
          variant="ghost"
          size="sm"
          className="h-7 text-xs text-muted-foreground hover:text-foreground gap-1"
          onClick={() => navigate(`/schemes/${schemeId}`)}
        >
          <FileText className="size-3" />
          <span>{t("results.viewSchemeGuidelines")}</span>
        </Button>
      </div>
    </div>
  )
}
