import { useTranslation } from "react-i18next"
import {
  BadgeCheck,
  Building2,
  Clock,
  ExternalLink,
  FileText,
  MapPin,
  Navigation,
  Phone,
  Sparkles,
  TriangleAlert,
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Progress } from "@/components/ui/progress"
import { distanceKm } from "@/lib/emi"
import { calculatePartnerScore, getNavigationUrl, type PartnerMatchScore } from "@/lib/maps/scoring"
import { type GeoPoint, PARTNER_TYPE_VISUALS } from "@/lib/maps/types"
import { PartnerScoreBadge } from "@/components/partners/PartnerScoreBadge"
import type { ChannelPartner } from "@/types"

export interface PartnerCardProps {
  partner: ChannelPartner
  userLocation: GeoPoint
  score?: PartnerMatchScore
  isTopRanked?: boolean
  isSelected?: boolean
  onSelect?: (partner: ChannelPartner) => void
  onFocusOnMap?: (partner: ChannelPartner) => void
}

export function PartnerCard({
  partner,
  userLocation,
  score: propScore,
  isTopRanked = false,
  isSelected = false,
  onSelect,
  onFocusOnMap,
}: PartnerCardProps) {
  const { t, i18n } = useTranslation()
  const highNpa = partner.npaFlag === "high"
  const dist = distanceKm(userLocation, partner.geo)
  const visual = PARTNER_TYPE_VISUALS[partner.type] || PARTNER_TYPE_VISUALS.SCA

  // Ensure 5-factor score is computed
  const score = propScore || calculatePartnerScore(partner, userLocation)

  const googleMapsUrl = getNavigationUrl(userLocation, partner.geo, "google")
  const osmUrl = getNavigationUrl(userLocation, partner.geo, "osm")

  return (
    <Card
      id={`partner-card-${partner.id}`}
      data-partner-id={partner.id}
      tabIndex={0}
      onClick={() => onSelect?.(partner)}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault()
          onSelect?.(partner)
        }
      }}
      className={`group transition-all duration-200 outline-none cursor-pointer relative overflow-hidden ${
        isSelected
          ? "ring-2 ring-primary border-primary bg-primary/[0.03] shadow-md"
          : "border-border/80 hover:border-border hover:shadow-sm"
      } ${highNpa ? "border-destructive/40 bg-destructive/[0.02]" : ""}`}
    >
      {/* Top Recommendation Banner for #1 Match */}
      {isTopRanked && !highNpa && (
        <div className="bg-emerald-500/10 border-b border-emerald-500/20 px-5 py-1.5 flex items-center justify-between text-xs font-semibold text-emerald-700 dark:text-emerald-300">
          <span className="flex items-center gap-1.5">
            <Sparkles className="size-3.5" />
            {t("partners.scoring.topRecommendation", "Top Recommendation")} · #{1}{" "}
            {t("partners.scoring.bestMatchTier", "Best Match")}
          </span>
          <span className="font-mono text-[11px] font-bold">
            {score.totalScore}/100 {t("partners.scoring.pts", "pts")}
          </span>
        </div>
      )}

      <CardHeader className="pb-3 pt-5 px-5">
        <div className="flex items-start justify-between gap-3">
          <div className="space-y-1.5 min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <span
                className={`inline-flex items-center gap-1 rounded-md px-2 py-0.5 text-xs font-semibold uppercase tracking-wider border ${visual.bgClass} ${visual.borderClass}`}
              >
                <Building2 className="size-3" />
                {t(visual.labelKey)}
              </span>

              {/* 5-Factor Score Badge */}
              <PartnerScoreBadge
                score={score}
                partner={partner}
                isTopRanked={isTopRanked && !highNpa}
              />

              {highNpa && (
                <Badge variant="destructive" className="text-[11px] gap-1 py-0.5">
                  <TriangleAlert className="size-3" />
                  {t("partners.scoring.highNpaWarning", "High NPA Review — Possible Sanction Delays")}
                </Badge>
              )}
            </div>

            <CardTitle className="font-display text-base sm:text-lg font-bold leading-snug text-foreground group-hover:text-primary transition-colors pt-1">
              {partner.name}
            </CardTitle>
          </div>

          <Badge
            variant="outline"
            className="shrink-0 font-semibold text-xs border-primary/30 text-primary bg-primary/5 whitespace-nowrap"
          >
            <MapPin className="mr-1 size-3 text-primary" />
            {t("partners.distanceAway", { km: dist.toFixed(1) })}
          </Badge>
        </div>

        <p className="text-xs sm:text-sm text-muted-foreground flex items-center gap-1.5 pt-1">
          <span>
            {partner.address}, {partner.city}, {partner.state}
          </span>
        </p>
      </CardHeader>

      <CardContent className="space-y-4 px-5 pb-5 pt-0">
        {/* Supported scheme badges */}
        <div className="flex flex-wrap gap-1.5">
          {partner.schemeCategories.map((c) => (
            <Badge
              key={c}
              variant="secondary"
              className="text-xs font-medium bg-secondary/80 hover:bg-secondary"
            >
              {t(`schemeTypes.${c}`)}
            </Badge>
          ))}
        </div>

        {/* Capacity / Fund Utilization & Processing Time */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
          <div className="space-y-1.5 rounded-lg bg-muted/40 p-2.5 border border-border/40">
            <div className="flex justify-between text-xs text-muted-foreground">
              <span className="font-medium">{t("partners.capacity")}</span>
              <span className="tabular-nums font-semibold text-foreground">
                {partner.fundUtilizationPct}%
              </span>
            </div>
            <Progress value={partner.fundUtilizationPct} className="h-1.5" />
          </div>

          {typeof partner.avgProcessingDays === "number" && (
            <div className="flex items-center gap-2 rounded-lg bg-muted/40 p-2.5 border border-border/40 text-xs text-muted-foreground">
              <Clock className="size-4 text-primary shrink-0" />
              <div>
                <span className="block font-medium text-foreground">
                  ~{partner.avgProcessingDays} {t("common.days", "days")}
                </span>
                <span className="text-[11px]">
                  {t("partners.processingTime", { days: partner.avgProcessingDays })}
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Action triggers */}
        <div
          className="flex flex-wrap items-center gap-2 pt-2 border-t border-border/50"
          onClick={(e) => e.stopPropagation()}
        >
          {partner.phone && (
            <Button
              asChild
              size="sm"
              variant="default"
              className="h-9 text-xs font-semibold gap-1.5 min-w-[44px] min-h-[36px]"
            >
              <a href={`tel:${partner.phone}`}>
                <Phone className="size-3.5" />
                {t("partners.callNow")}
              </a>
            </Button>
          )}

          {/* Turn-by-Turn Routing Navigation Button */}
          <Button
            asChild
            size="sm"
            variant="outline"
            className="h-9 text-xs font-semibold gap-1.5 min-h-[36px] border-primary/40 hover:bg-primary/5 text-foreground"
          >
            <a
              href={googleMapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              title="Open turn-by-turn navigation in Google Maps"
            >
              <Navigation className="size-3.5 text-primary" />
              {t("partners.getDirections")}
            </a>
          </Button>

          {/* Documents Required Dialog */}
          <Dialog>
            <DialogTrigger asChild>
              <Button
                size="sm"
                variant="ghost"
                className="h-9 text-xs font-medium gap-1.5 text-muted-foreground hover:text-foreground ml-auto min-h-[36px]"
              >
                <FileText className="size-3.5" />
                {t("partners.docsRequired")}
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <div className="flex items-center gap-2 mb-1">
                  <span
                    className={`inline-flex items-center gap-1 rounded px-2 py-0.5 text-xs font-semibold uppercase ${visual.bgClass}`}
                  >
                    <BadgeCheck className="size-3" />
                    {partner.type}
                  </span>
                </div>
                <DialogTitle className="font-display text-lg">
                  {partner.name}
                </DialogTitle>
                <p className="text-xs text-muted-foreground">
                  {partner.address}, {partner.city}, {partner.state}
                </p>
              </DialogHeader>

              <div className="space-y-4 pt-2">
                <div className="rounded-lg border border-border/80 bg-muted/30 p-3.5">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-foreground mb-2 flex items-center gap-1.5">
                    <FileText className="size-4 text-primary" />
                    {t("partners.docsRequired")}
                  </h4>
                  <ul className="list-disc pl-5 space-y-1.5 text-sm text-foreground/90">
                    {partner.docsRequired.map((d, index) => {
                      const lang = i18n.language as "en" | "hi"
                      const label = d[lang] || d.en
                      return <li key={index}>{label}</li>
                    })}
                  </ul>
                </div>

                <div className="space-y-2 pt-1">
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <Navigation className="size-3.5 text-primary" />
                    <span>Navigation Coordinates:</span>
                    <a
                      href={osmUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="underline text-primary hover:text-primary/80 inline-flex items-center gap-0.5"
                    >
                      OpenStreetMap <ExternalLink className="size-3" />
                    </a>
                  </div>

                  {partner.phone && (
                    <Button asChild className="w-full gap-2 font-semibold">
                      <a href={`tel:${partner.phone}`}>
                        <Phone className="size-4" />
                        {t("partners.callNow")} · {partner.phone}
                      </a>
                    </Button>
                  )}
                </div>
              </div>
            </DialogContent>
          </Dialog>

          {onFocusOnMap && (
            <Button
              type="button"
              size="sm"
              variant="outline"
              onClick={() => onFocusOnMap(partner)}
              className="h-9 text-xs font-medium gap-1.5"
            >
              <MapPin className="size-3.5 text-primary" />
              {t("partners.showOnMap")}
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
