import { useState } from "react"
import { useTranslation } from "react-i18next"
import {
  ChevronDown,
  ChevronUp,
  ShieldCheck,
  Award,
  Wallet,
  Users,
  Target,
  IndianRupee,
  Calendar,
  MapPin,
  Info,
} from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import type { ScoreBreakdown } from "@/types"

interface ScoreBreakdownCardProps {
  score: number
  breakdown: ScoreBreakdown
  defaultExpanded?: boolean
  className?: string
}

export function ScoreBreakdownCard({
  score,
  breakdown,
  defaultExpanded = false,
  className = "",
}: ScoreBreakdownCardProps) {
  const { t } = useTranslation()
  const [expanded, setExpanded] = useState(defaultExpanded)

  const getScoreColorTheme = (val: number) => {
    if (val >= 80) {
      return {
        badgeBg: "bg-emerald-500/10 text-emerald-700 border-emerald-500/30 dark:bg-emerald-500/20 dark:text-emerald-300 dark:border-emerald-500/40",
        progressColor: "bg-emerald-600 dark:bg-emerald-500",
        circleBorder: "border-emerald-600 text-emerald-700 dark:border-emerald-400 dark:text-emerald-300",
        pillBg: "bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-200",
      }
    }
    if (val >= 60) {
      return {
        badgeBg: "bg-blue-500/10 text-blue-700 border-blue-500/30 dark:bg-blue-500/20 dark:text-blue-300 dark:border-blue-500/40",
        progressColor: "bg-blue-600 dark:bg-blue-500",
        circleBorder: "border-blue-600 text-blue-700 dark:border-blue-400 dark:text-blue-300",
        pillBg: "bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-200",
      }
    }
    return {
      badgeBg: "bg-amber-500/10 text-amber-700 border-amber-500/30 dark:bg-amber-500/20 dark:text-amber-300 dark:border-amber-500/40",
      progressColor: "bg-amber-600 dark:bg-amber-500",
      circleBorder: "border-amber-600 text-amber-700 dark:border-amber-400 dark:text-amber-300",
      pillBg: "bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-200",
    }
  }

  const theme = getScoreColorTheme(score)

  const criteriaList = [
    {
      id: "income",
      label: t("results.criteria.income"),
      icon: Wallet,
      points: breakdown?.income ?? 0,
      max: 20,
      description: t("results.criteriaDesc.income"),
    },
    {
      id: "category",
      label: t("results.criteria.category"),
      icon: Users,
      points: breakdown?.category ?? 0,
      max: 20,
      description: t("results.criteriaDesc.category"),
    },
    {
      id: "purpose",
      label: t("results.criteria.purpose"),
      icon: Target,
      points: breakdown?.purpose ?? 0,
      max: 20,
      description: t("results.criteriaDesc.purpose"),
    },
    {
      id: "cost",
      label: t("results.criteria.cost"),
      icon: IndianRupee,
      points: breakdown?.cost ?? 0,
      max: 20,
      description: t("results.criteriaDesc.cost"),
    },
    {
      id: "age",
      label: t("results.criteria.age"),
      icon: Calendar,
      points: breakdown?.age ?? 0,
      max: 10,
      description: t("results.criteriaDesc.age"),
    },
    {
      id: "state",
      label: t("results.criteria.state"),
      icon: MapPin,
      points: breakdown?.state ?? 0,
      max: 10,
      description: t("results.criteriaDesc.state"),
    },
  ]

  return (
    <div
      className={`rounded-xl border bg-card/60 p-4 shadow-xs transition-all ${className}`}
      data-testid="score-breakdown-card"
    >
      {/* Header score & mandatory indicative label */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div
            className={`flex size-12 shrink-0 items-center justify-center rounded-full border-2 font-display font-extrabold text-base tracking-tight ${theme.circleBorder}`}
            aria-label={`Score ${score} out of 100`}
          >
            {score}
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <Badge
                variant="outline"
                className={`font-semibold tracking-wide text-xs px-2.5 py-0.5 ${theme.badgeBg}`}
              >
                <Award className="mr-1 size-3.5" />
                {t("results.indicativeScoreBadge")}
              </Badge>
            </div>
            <p className="mt-0.5 text-xs text-muted-foreground">
              {t("results.scoreOutOf", { score })} (
              {score >= 80
                ? t("results.fitHigh")
                : score >= 60
                  ? t("results.fitMedium")
                  : t("results.fitLow")}
              )
            </p>
          </div>
        </div>

        <Button
          variant="outline"
          size="sm"
          onClick={() => setExpanded(!expanded)}
          className="h-8 text-xs font-medium"
          aria-expanded={expanded}
        >
          {expanded ? (
            <>
              {t("results.hideBreakdown")}
              <ChevronUp className="ml-1.5 size-3.5" />
            </>
          ) : (
            <>
              {t("results.viewBreakdown")}
              <ChevronDown className="ml-1.5 size-3.5" />
            </>
          )}
        </Button>
      </div>

      {/* Main Score Progress Bar */}
      <div className="mt-3">
        <div className="h-2 w-full overflow-hidden rounded-full bg-secondary">
          <div
            className={`h-full transition-all duration-500 ease-out ${theme.progressColor}`}
            style={{ width: `${Math.min(100, Math.max(0, score))}%` }}
          />
        </div>
      </div>

      {/* Itemized 6-criteria breakdown */}
      {expanded && (
        <div className="mt-4 pt-3 border-t space-y-3 animate-in fade-in-50 duration-200">
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
              <ShieldCheck className="size-3.5 text-primary" />
              {t("results.scoreBreakdown")}
            </h4>
            <span className="text-xs font-semibold text-muted-foreground">
              {t("results.totalPoints", { points: score })}
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {criteriaList.map((item) => {
              const pct = (item.points / item.max) * 100
              const ItemIcon = item.icon
              const isFull = item.points === item.max
              return (
                <div
                  key={item.id}
                  className="rounded-lg border bg-background/50 p-2.5 flex flex-col justify-between gap-1.5"
                >
                  <div className="flex items-center justify-between text-xs">
                    <span className="flex items-center gap-1.5 font-medium text-foreground">
                      <ItemIcon className="size-3.5 text-muted-foreground" />
                      {item.label}
                    </span>
                    <span
                      className={`font-mono font-bold ${
                        isFull
                          ? "text-emerald-700 dark:text-emerald-400"
                          : item.points > 0
                            ? "text-blue-700 dark:text-blue-400"
                            : "text-amber-700 dark:text-amber-400"
                      }`}
                    >
                      {item.points} / {item.max} pts
                    </span>
                  </div>
                  <Progress value={pct} className="h-1.5" />
                  <p className="text-[11px] text-muted-foreground line-clamp-1">
                    {item.description}
                  </p>
                </div>
              )
            })}
          </div>

          <div className="flex items-start gap-1.5 rounded-md bg-muted/40 p-2 text-[11px] text-muted-foreground">
            <Info className="size-3.5 shrink-0 mt-0.5 text-primary" />
            <p>{t("results.indicativeDisclaimer")}</p>
          </div>
        </div>
      )}
    </div>
  )
}
