import { useState } from "react"
import { useTranslation } from "react-i18next"
import {
  Award,
  CheckCircle2,
  ChevronRight,
  Clock,
  Coins,
  Compass,
  Info,
  Layers,
  Sparkles,
  TriangleAlert,
} from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Progress } from "@/components/ui/progress"
import type { PartnerMatchScore } from "@/lib/maps/scoring"
import type { ChannelPartner } from "@/types"

export interface PartnerScoreBadgeProps {
  score: PartnerMatchScore
  partner: ChannelPartner
  isTopRanked?: boolean
  showDetailsButton?: boolean
}

export function PartnerScoreBadge({
  score,
  partner,
  isTopRanked = false,
  showDetailsButton = true,
}: PartnerScoreBadgeProps) {
  const { t } = useTranslation()
  const [open, setOpen] = useState(false)

  const { breakdown, totalScore, tier, isHighNpa, distanceKm } = score

  // Visual style config per tier
  const getBadgeVisuals = () => {
    if (isHighNpa) {
      return {
        variant: "destructive" as const,
        badgeClass:
          "bg-destructive/10 text-destructive border-destructive/30 hover:bg-destructive/15",
        icon: <TriangleAlert className="size-3.5 shrink-0 text-destructive" />,
        label: t("partners.scoring.highNpaWarning", "High NPA Review — Possible Sanction Delays"),
        shortLabel: `${totalScore}% · ${t("partners.scoring.moderateMatch", "Caution")}`,
      }
    }

    if (tier === "top" || isTopRanked) {
      return {
        variant: "outline" as const,
        badgeClass:
          "bg-emerald-50 text-emerald-800 border-emerald-300 dark:bg-emerald-950/60 dark:text-emerald-300 dark:border-emerald-800 hover:bg-emerald-100/70",
        icon: <Sparkles className="size-3.5 shrink-0 text-emerald-600 dark:text-emerald-400" />,
        label: `${t("partners.scoring.topRecommendation", "Top Recommendation")} · ${totalScore}% ${t("partners.scoring.topMatch", "Match")}`,
        shortLabel: `${totalScore}% · ${t("partners.scoring.topRecommendation", "Top Match")}`,
      }
    }

    if (tier === "high") {
      return {
        variant: "outline" as const,
        badgeClass:
          "bg-blue-50 text-blue-800 border-blue-300 dark:bg-blue-950/60 dark:text-blue-300 dark:border-blue-800 hover:bg-blue-100/70",
        icon: <CheckCircle2 className="size-3.5 shrink-0 text-blue-600 dark:text-blue-400" />,
        label: `${t("partners.scoring.strongMatch", "Strong Match")} · ${totalScore}% ${t("partners.scoring.topMatch", "Match")}`,
        shortLabel: `${totalScore}% · ${t("partners.scoring.strongMatch", "Strong Match")}`,
      }
    }

    return {
      variant: "outline" as const,
      badgeClass:
        "bg-amber-50 text-amber-800 border-amber-300 dark:bg-amber-950/60 dark:text-amber-300 dark:border-amber-800 hover:bg-amber-100/70",
      icon: <Info className="size-3.5 shrink-0 text-amber-600 dark:text-amber-400" />,
      label: `${t("partners.scoring.moderateMatch", "Moderate Match")} · ${totalScore}%`,
      shortLabel: `${totalScore}% · ${t("partners.scoring.moderateMatch", "Moderate")}`,
    }
  }

  const visuals = getBadgeVisuals()

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <button
          type="button"
          onClick={(e) => e.stopPropagation()}
          className={`group inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-semibold shadow-2xs transition-all cursor-pointer select-none ${visuals.badgeClass}`}
          title={t("partners.scoring.viewBreakdown", "Click to view 5-factor scoring breakdown")}
        >
          {visuals.icon}
          <span className="truncate">{visuals.label}</span>
          {showDetailsButton && (
            <ChevronRight className="size-3 opacity-60 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all ml-0.5" />
          )}
        </button>
      </DialogTrigger>

      <DialogContent
        className="max-w-lg p-0 overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <DialogHeader className="p-5 pb-4 bg-muted/40 border-b border-border/70">
          <div className="flex items-center gap-2 mb-1">
            <span
              className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-semibold border ${visuals.badgeClass}`}
            >
              {visuals.icon}
              {totalScore}/100 {t("partners.scoring.scoreOutOf", "Suitability Score")}
            </span>
            {isHighNpa && (
              <Badge variant="destructive" className="text-[11px] gap-1 py-0.5">
                <TriangleAlert className="size-3" />
                NPA Risk
              </Badge>
            )}
          </div>
          <DialogTitle className="font-display text-lg sm:text-xl font-bold text-foreground">
            {partner.name}
          </DialogTitle>
          <DialogDescription className="text-xs sm:text-sm text-muted-foreground">
            {t(
              "partners.scoring.breakdownDesc",
              "Deterministic suitability score evaluated across 5 statutory and operational dimensions.",
            )}
          </DialogDescription>
        </DialogHeader>

        <div className="p-5 space-y-4 max-h-[70vh] overflow-y-auto">
          {/* Total score overview meter */}
          <div className="rounded-xl border border-border/80 bg-card p-4 space-y-2">
            <div className="flex justify-between items-baseline text-sm">
              <span className="font-semibold text-foreground flex items-center gap-1.5">
                <Award className="size-4 text-primary" />
                {t("partners.scoring.overallScore", "Total Suitability Score")}
              </span>
              <span className="font-bold text-primary font-mono text-base">
                {totalScore} / 100
              </span>
            </div>
            <Progress value={totalScore} className="h-2.5" />
            <p className="text-xs text-muted-foreground pt-1">
              {isHighNpa
                ? t(
                    "partners.scoring.highNpaWarning",
                    "High NPA Review — Possible Sanction Delays",
                  )
                : tier === "top"
                  ? t(
                      "partners.scoring.topExplainer",
                      "Top tier recommendation based on direct institutional alignment, high proximity, and fast processing.",
                    )
                  : t(
                      "partners.scoring.tierExplainer",
                      "Standard authorized channel partner for NSFDC concessional credit deployment.",
                    )}
            </p>
          </div>

          {/* 5-Factor Detailed Sub-Scores */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
              {t("partners.scoring.breakdownTitle", "5-Factor Suitability Breakdown")}
            </h4>

            {/* Factor 1: Proximity */}
            <div className="rounded-lg border border-border/60 p-3 bg-muted/20 space-y-1.5">
              <div className="flex items-center justify-between text-xs">
                <span className="font-medium text-foreground flex items-center gap-1.5">
                  <Compass className="size-3.5 text-primary" />
                  {t("partners.scoring.proximityTitle", "Proximity & Distance")}
                </span>
                <span className="font-mono font-semibold text-foreground">
                  {breakdown.proximity} / 30 pts
                </span>
              </div>
              <Progress value={(breakdown.proximity / 30) * 100} className="h-1.5" />
              <div className="flex justify-between text-[11px] text-muted-foreground">
                <span>{distanceKm.toFixed(1)} km {t("partners.distanceAway", "away")}</span>
                <span>{t("partners.scoring.proximityDesc", "Max 30 pts based on GPS distance")}</span>
              </div>
            </div>

            {/* Factor 2: Partner Type Alignment */}
            <div className="rounded-lg border border-border/60 p-3 bg-muted/20 space-y-1.5">
              <div className="flex items-center justify-between text-xs">
                <span className="font-medium text-foreground flex items-center gap-1.5">
                  <Layers className="size-3.5 text-primary" />
                  {t("partners.scoring.channelTitle", "Channel Institution Alignment")}
                </span>
                <span className="font-mono font-semibold text-foreground">
                  {breakdown.channelAlignment} / 25 pts
                </span>
              </div>
              <Progress value={(breakdown.channelAlignment / 25) * 100} className="h-1.5" />
              <div className="flex justify-between text-[11px] text-muted-foreground">
                <span>{partner.type} ({t(`partners.typeNames.${partner.type}`)})</span>
                <span>{t("partners.scoring.channelDesc", "Dedicated SCA priority")}</span>
              </div>
            </div>

            {/* Factor 3: Scheme Match */}
            <div className="rounded-lg border border-border/60 p-3 bg-muted/20 space-y-1.5">
              <div className="flex items-center justify-between text-xs">
                <span className="font-medium text-foreground flex items-center gap-1.5">
                  <Award className="size-3.5 text-primary" />
                  {t("partners.scoring.schemeTitle", "Scheme Category Support")}
                </span>
                <span className="font-mono font-semibold text-foreground">
                  {breakdown.schemeMatch} / 20 pts
                </span>
              </div>
              <Progress value={(breakdown.schemeMatch / 20) * 100} className="h-1.5" />
              <div className="flex justify-between text-[11px] text-muted-foreground">
                <span>{partner.schemeCategories.map((c) => t(`schemeTypes.${c}`)).join(", ")}</span>
                <span>{t("partners.scoring.schemeDesc", "Category breadth")}</span>
              </div>
            </div>

            {/* Factor 4: Processing Speed */}
            <div className="rounded-lg border border-border/60 p-3 bg-muted/20 space-y-1.5">
              <div className="flex items-center justify-between text-xs">
                <span className="font-medium text-foreground flex items-center gap-1.5">
                  <Clock className="size-3.5 text-primary" />
                  {t("partners.scoring.speedTitle", "Sanction & Processing Speed")}
                </span>
                <span className="font-mono font-semibold text-foreground">
                  {breakdown.processingSpeed} / 15 pts
                </span>
              </div>
              <Progress value={(breakdown.processingSpeed / 15) * 100} className="h-1.5" />
              <div className="flex justify-between text-[11px] text-muted-foreground">
                <span>~{partner.avgProcessingDays || 30} {t("common.days", "days")}</span>
                <span>{t("partners.scoring.speedDesc", "Fastest turnaround")}</span>
              </div>
            </div>

            {/* Factor 5: Fund Health */}
            <div className="rounded-lg border border-border/60 p-3 bg-muted/20 space-y-1.5">
              <div className="flex items-center justify-between text-xs">
                <span className="font-medium text-foreground flex items-center gap-1.5">
                  <Coins className="size-3.5 text-primary" />
                  {t("partners.scoring.healthTitle", "Fund Utilization & Health Track Record")}
                </span>
                <span className="font-mono font-semibold text-foreground">
                  {breakdown.fundHealth} / 10 pts
                </span>
              </div>
              <Progress value={(breakdown.fundHealth / 10) * 100} className="h-1.5" />
              <div className="flex justify-between text-[11px] text-muted-foreground">
                <span>{partner.fundUtilizationPct}% {t("partners.capacity", "capacity deployed")}</span>
                <span>{t("partners.scoring.healthDesc", "Optimal 50-85%")}</span>
              </div>
            </div>

            {/* NPA Penalty Notice if applicable */}
            {isHighNpa && (
              <div className="rounded-lg border border-destructive/40 bg-destructive/5 p-3 space-y-1 text-xs text-destructive">
                <div className="flex items-center justify-between font-semibold">
                  <span className="flex items-center gap-1.5">
                    <TriangleAlert className="size-3.5 shrink-0" />
                    {t("partners.scoring.npaPenaltyTitle", "High NPA Risk Deduction")}
                  </span>
                  <span className="font-mono">-15 pts</span>
                </div>
                <p className="text-[11px] text-muted-foreground">
                  {t(
                    "partners.scoring.npaPenaltyDesc",
                    "This partner has high overdue NPA rates which may cause delays in loan sanctions.",
                  )}
                </p>
              </div>
            )}
          </div>
        </div>

        <div className="p-4 bg-muted/30 border-t border-border/60 flex justify-end">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => setOpen(false)}
            className="text-xs"
          >
            {t("common.close", "Close")}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
