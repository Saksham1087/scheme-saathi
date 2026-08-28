import { useState, useMemo } from "react"
import { Link } from "react-router-dom"
import { useTranslation } from "react-i18next"
import { toast } from "sonner"
import {
  Building2,
  Phone,
  Navigation,
  UserCheck,
  Trash2,
  MapPin,
  Clock,
  ArrowRight,
  Landmark,
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { PartnerDetailDialog } from "@/components/partners/PartnerDetailDialog"
import { useSavedStore } from "@/stores/useSavedStore"
import { PARTNER_TYPE_VISUALS, type GeoPoint } from "@/lib/maps/types"
import { getNavigationUrl } from "@/lib/maps/scoring"
import partnersSeed from "@seed/partners.seed.json"
import type { ChannelPartner } from "@/types"

const DEFAULT_USER_LOCATION: GeoPoint = { lat: 26.8467, lng: 80.9462 } // Lucknow

export function SavedPartnersCard() {
  const { t } = useTranslation()
  const { savedPartnerIds, removePartner } = useSavedStore()
  const [activeDetailPartner, setActiveDetailPartner] = useState<ChannelPartner | null>(null)

  const savedPartnersList: ChannelPartner[] = useMemo(() => {
    const allPartners = partnersSeed as unknown as ChannelPartner[]
    return savedPartnerIds
      .map((id) => allPartners.find((p) => p.id === id))
      .filter((p): p is ChannelPartner => Boolean(p))
  }, [savedPartnerIds])

  function handleRemove(partnerId: string, partnerName: string) {
    removePartner(partnerId)
    toast.info(t("dashboard.partnerRemovedToast", "Removed {{name}} from saved partners", { name: partnerName }))
  }

  return (
    <Card className="border border-border/80 shadow-xs">
      <CardHeader className="flex flex-row items-center justify-between pb-3 space-y-0">
        <div>
          <div className="flex items-center gap-2">
            <span className="rounded-full bg-emerald-500/10 px-2 py-0.5 text-xs font-semibold text-emerald-700 dark:text-emerald-400">
              {t("dashboard.savedPartnersBadge", "Designated Branches")}
            </span>
            <Badge variant="outline" className="text-xs font-mono">
              {savedPartnersList.length}
            </Badge>
          </div>
          <CardTitle className="font-display text-lg font-bold text-foreground mt-1">
            {t("dashboard.savedPartnersTitle", "Saved Channel Partners & SCAs")}
          </CardTitle>
          <CardDescription className="text-xs text-muted-foreground">
            {t(
              "dashboard.savedPartnersDesc",
              "Authorized State Channelizing Agencies, regional partner banks, and field nodal desks."
            )}
          </CardDescription>
        </div>

        <Button asChild size="sm" variant="outline" className="h-8 text-xs font-semibold gap-1.5 shrink-0">
          <Link to="/partners">
            <span>{t("dashboard.findPartnersBtn", "Find Partners")}</span>
            <ArrowRight className="size-3.5" />
          </Link>
        </Button>
      </CardHeader>

      <CardContent className="space-y-4 pt-1">
        {savedPartnersList.length === 0 ? (
          <div className="rounded-xl border border-dashed border-border/80 p-6 text-center space-y-3 bg-muted/20">
            <div className="mx-auto flex size-12 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
              <Landmark className="size-6" />
            </div>
            <div>
              <h4 className="font-display font-semibold text-sm text-foreground">
                {t("dashboard.noSavedPartnersTitle", "No bookmarked channel partners")}
              </h4>
              <p className="text-xs text-muted-foreground max-w-sm mx-auto mt-1">
                {t(
                  "dashboard.noSavedPartnersDesc",
                  "Save nearby State Channelizing Agencies (SCAs) and designated bank branches for quick phone contact and routing directions."
                )}
              </p>
            </div>
            <Button asChild size="sm" className="text-xs font-semibold gap-1.5">
              <Link to="/partners">
                <MapPin className="size-3.5" />
                {t("dashboard.explorePartnersBtn", "Find Nearest Partner Branch")}
              </Link>
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
            {savedPartnersList.map((partner) => {
              const visual = PARTNER_TYPE_VISUALS[partner.type] || PARTNER_TYPE_VISUALS.SCA
              const googleMapsUrl = getNavigationUrl(DEFAULT_USER_LOCATION, partner.geo, "google")

              return (
                <div
                  key={partner.id}
                  className="rounded-xl border border-border/70 bg-card p-4 space-y-3 flex flex-col justify-between transition-all hover:border-border hover:shadow-xs"
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between gap-2">
                      <span
                        className={`inline-flex items-center gap-1 rounded-md px-2 py-0.5 text-xs font-semibold uppercase tracking-wider border ${visual.bgClass} ${visual.borderClass}`}
                      >
                        <Building2 className="size-3" />
                        {t(visual.labelKey)}
                      </span>

                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleRemove(partner.id, partner.name)}
                        className="size-7 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-md"
                        title={t("dashboard.removeFromSaved", "Remove from saved")}
                        aria-label={t("dashboard.removeSavedPartnerAria", "Remove {{name}} from saved", { name: partner.name })}
                      >
                        <Trash2 className="size-3.5" />
                      </Button>
                    </div>

                    <h4 className="font-display font-bold text-base text-foreground leading-snug">
                      {partner.name}
                    </h4>

                    <p className="text-xs text-muted-foreground flex items-center gap-1.5">
                      <MapPin className="size-3.5 shrink-0 text-primary" />
                      <span className="line-clamp-1">{partner.address}, {partner.city}, {partner.state}</span>
                    </p>

                    <div className="flex items-center gap-3 pt-1 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Clock className="size-3 text-muted-foreground" />
                        ~{partner.avgProcessingDays || 14} {t("common.days", "days processing")}
                      </span>
                      <span>·</span>
                      <span className="font-medium text-foreground">
                        {partner.fundUtilizationPct}% {t("partners.capacity", "capacity")}
                      </span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="pt-2 border-t border-border/60 flex flex-wrap items-center gap-2">
                    <Button
                      size="sm"
                      variant="default"
                      onClick={() => setActiveDetailPartner(partner)}
                      className="h-8 text-xs font-semibold gap-1 min-h-[36px]"
                    >
                      <UserCheck className="size-3.5" />
                      {t("partners.viewProfile", "Profile")}
                    </Button>

                    {partner.phone && (
                      <Button
                        asChild
                        size="sm"
                        variant="outline"
                        className="h-8 text-xs font-semibold gap-1 min-h-[36px]"
                      >
                        <a href={`tel:${partner.phone}`}>
                          <Phone className="size-3.5 text-emerald-600 dark:text-emerald-400" />
                          {t("partners.callNow", "Call")}
                        </a>
                      </Button>
                    )}

                    <Button
                      asChild
                      size="sm"
                      variant="outline"
                      className="h-8 text-xs font-medium gap-1 min-h-[36px] ml-auto"
                      title="Open Google Maps Directions"
                    >
                      <a href={googleMapsUrl} target="_blank" rel="noopener noreferrer">
                        <Navigation className="size-3.5 text-primary" />
                        {t("partners.getDirections", "Directions")}
                      </a>
                    </Button>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </CardContent>

      <PartnerDetailDialog
        partner={activeDetailPartner}
        open={Boolean(activeDetailPartner)}
        onOpenChange={(open) => {
          if (!open) setActiveDetailPartner(null)
        }}
        userLocation={DEFAULT_USER_LOCATION}
      />
    </Card>
  )
}
