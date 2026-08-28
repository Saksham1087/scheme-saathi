import { useState } from "react"
import { Link } from "react-router-dom"
import { useTranslation } from "react-i18next"
import { toast } from "sonner"
import {
  Building2,
  CheckCircle2,
  Clock,
  ExternalLink,
  FileCheck,
  FileText,
  Mail,
  MapPin,
  Navigation,
  Percent,
  Phone,
  Share2,
  ShieldAlert,
  Sparkles,
  TriangleAlert,
  UserCheck,
  Wallet,
} from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { distanceKm } from "@/lib/emi"
import { calculatePartnerScore, getNavigationUrl, type PartnerMatchScore } from "@/lib/maps/scoring"
import { type GeoPoint, PARTNER_TYPE_VISUALS } from "@/lib/maps/types"
import { PartnerScoreBadge } from "@/components/partners/PartnerScoreBadge"
import type { ChannelPartner } from "@/types"

export interface PartnerDetailDialogProps {
  partner: ChannelPartner | null
  open: boolean
  onOpenChange: (open: boolean) => void
  userLocation?: GeoPoint
  score?: PartnerMatchScore
}

export function PartnerDetailDialog({
  partner,
  open,
  onOpenChange,
  userLocation,
  score: propScore,
}: PartnerDetailDialogProps) {
  const { t, i18n } = useTranslation()
  const [activeTab, setActiveTab] = useState<"overview" | "schemes" | "docs">("overview")

  if (!partner) return null

  const lang = (i18n.language === "hi" ? "hi" : "en") as "en" | "hi"
  const visual = PARTNER_TYPE_VISUALS[partner.type] || PARTNER_TYPE_VISUALS.SCA
  const highNpa = partner.npaFlag === "high"
  const isSynthetic = partner.isSynthetic !== false

  const dist = userLocation ? distanceKm(userLocation, partner.geo) : null
  const score = propScore || (userLocation ? calculatePartnerScore(partner, userLocation) : undefined)

  const googleMapsUrl = userLocation
    ? getNavigationUrl(userLocation, partner.geo, "google")
    : `https://www.google.com/maps/search/?api=1&query=${partner.geo.lat},${partner.geo.lng}`
  const osmUrl = userLocation
    ? getNavigationUrl(userLocation, partner.geo, "osm")
    : `https://www.openstreetmap.org/?mlat=${partner.geo.lat}&mlon=${partner.geo.lng}#map=16/${partner.geo.lat}/${partner.geo.lng}`

  const primaryPhone = partner.nodalOfficer?.phone || partner.phone
  const primaryEmail = partner.nodalOfficer?.email || partner.email

  async function handleShare() {
    if (!partner) return

    const textToShare = [
      `${partner.name} (${t(visual.labelKey)})`,
      `📍 ${partner.address}, ${partner.city}, ${partner.state}`,
      primaryPhone ? `📞 ${t("partners.profile.callDesk")}: ${primaryPhone}` : "",
      partner.nodalOfficer?.name ? `👤 ${t("partners.profile.officerName")}: ${partner.nodalOfficer.name}` : "",
      `🗺️ Directions: ${googleMapsUrl}`,
    ]
      .filter(Boolean)
      .join("\n")

    if (navigator.share) {
      try {
        await navigator.share({
          title: t("partners.profile.shareTitle", { name: partner.name }),
          text: textToShare,
          url: window.location.href,
        })
        return
      } catch {
        // Fallback to clipboard if share cancelled or unsupported
      }
    }

    try {
      await navigator.clipboard.writeText(textToShare)
      toast.success(t("partners.profile.shareSuccess"))
    } catch {
      toast.error(t("partners.profile.shareError"))
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] flex flex-col p-0 gap-0 overflow-hidden sm:rounded-xl">
        {/* Synthetic Demonstration Data Guardrail Banner */}
        {isSynthetic && (
          <div className="bg-amber-500/10 dark:bg-amber-500/15 border-b border-amber-500/25 px-5 py-2.5 flex items-start gap-2.5 text-xs text-amber-900 dark:text-amber-200">
            <ShieldAlert className="size-4 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
            <div className="space-y-0.5">
              <div className="flex items-center gap-2">
                <span className="font-bold uppercase tracking-wider text-[10px] bg-amber-500/20 text-amber-900 dark:text-amber-100 px-1.5 py-0.5 rounded">
                  {t("partners.profile.syntheticBadge")}
                </span>
              </div>
              <p className="text-[11px] leading-relaxed text-amber-800/90 dark:text-amber-300/90">
                {t("partners.profile.syntheticDisclaimer")}
              </p>
            </div>
          </div>
        )}

        {/* Header */}
        <DialogHeader className="p-5 pb-3 border-b border-border/60 text-left">
          <div className="flex flex-wrap items-center gap-2 mb-1.5">
            <span
              className={`inline-flex items-center gap-1 rounded-md px-2.5 py-0.5 text-xs font-semibold uppercase tracking-wider border ${visual.bgClass} ${visual.borderClass}`}
            >
              <Building2 className="size-3" />
              {t(visual.labelKey)}
            </span>

            {dist !== null && (
              <Badge
                variant="outline"
                className="font-semibold text-xs border-primary/30 text-primary bg-primary/5"
              >
                <MapPin className="mr-1 size-3 text-primary" />
                {t("partners.distanceAway", { km: dist.toFixed(1) })}
              </Badge>
            )}

            {score && (
              <PartnerScoreBadge score={score} partner={partner} />
            )}

            {highNpa && (
              <Badge variant="destructive" className="text-[11px] gap-1 py-0.5">
                <TriangleAlert className="size-3" />
                {t("partners.scoring.highNpaWarning")}
              </Badge>
            )}
          </div>

          <DialogTitle className="font-display text-xl sm:text-2xl font-bold tracking-tight text-foreground">
            {partner.name}
          </DialogTitle>

          <DialogDescription className="text-xs sm:text-sm text-muted-foreground flex items-center gap-1 pt-1">
            <MapPin className="size-3.5 text-muted-foreground shrink-0" />
            <span>
              {partner.address}, {partner.city}, {partner.state}
            </span>
          </DialogDescription>
        </DialogHeader>

        {/* Tabbed Content Body */}
        <div className="flex-1 overflow-y-auto px-5 py-4 space-y-4">
          <Tabs
            value={activeTab}
            onValueChange={(v) => setActiveTab(v as "overview" | "schemes" | "docs")}
            className="w-full space-y-4"
          >
            <TabsList className="grid grid-cols-3 w-full h-10 p-1 bg-muted/80 rounded-lg">
              <TabsTrigger
                value="overview"
                className="text-xs font-semibold gap-1.5 data-[state=active]:bg-background data-[state=active]:shadow-xs"
              >
                <UserCheck className="size-3.5" />
                <span className="hidden sm:inline">{t("partners.profile.tabOverview")}</span>
                <span className="sm:hidden">Overview</span>
              </TabsTrigger>
              <TabsTrigger
                value="schemes"
                className="text-xs font-semibold gap-1.5 data-[state=active]:bg-background data-[state=active]:shadow-xs"
              >
                <Wallet className="size-3.5" />
                <span className="hidden sm:inline">
                  {t("partners.profile.tabSchemes")} ({(partner.supportedSchemeDetails?.length || partner.schemeCategories.length)})
                </span>
                <span className="sm:hidden">
                  Schemes ({(partner.supportedSchemeDetails?.length || partner.schemeCategories.length)})
                </span>
              </TabsTrigger>
              <TabsTrigger
                value="docs"
                className="text-xs font-semibold gap-1.5 data-[state=active]:bg-background data-[state=active]:shadow-xs"
              >
                <FileText className="size-3.5" />
                <span className="hidden sm:inline">
                  {t("partners.profile.tabDocuments")} ({partner.docsRequired.length})
                </span>
                <span className="sm:hidden">Docs ({partner.docsRequired.length})</span>
              </TabsTrigger>
            </TabsList>

            {/* TAB 1: OVERVIEW & NODAL DESK */}
            <TabsContent value="overview" className="space-y-4 m-0 focus-visible:outline-none">
              {/* Nodal Desk Officer Card */}
              {partner.nodalOfficer && (
                <div className="rounded-xl border border-primary/20 bg-primary/[0.03] p-4 space-y-3">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className="size-10 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold">
                        <UserCheck className="size-5" />
                      </div>
                      <div>
                        <span className="text-[11px] font-semibold uppercase tracking-wider text-primary block">
                          {t("partners.profile.nodalOfficerTitle")}
                        </span>
                        <h4 className="font-display font-bold text-base text-foreground">
                          {partner.nodalOfficer.name}
                        </h4>
                        <p className="text-xs text-muted-foreground">
                          {partner.nodalOfficer.designation[lang] || partner.nodalOfficer.designation.en}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1 border-t border-primary/10">
                    {partner.nodalOfficer.phone && (
                      <Button
                        asChild
                        variant="outline"
                        size="sm"
                        className="h-10 text-xs font-semibold gap-2 justify-start border-primary/30 hover:bg-primary/5"
                      >
                        <a href={`tel:${partner.nodalOfficer.phone}`}>
                          <Phone className="size-3.5 text-primary" />
                          <span className="truncate">
                            {t("partners.profile.callDesk")}: {partner.nodalOfficer.phone}
                          </span>
                        </a>
                      </Button>
                    )}

                    {partner.nodalOfficer.email && (
                      <Button
                        asChild
                        variant="outline"
                        size="sm"
                        className="h-10 text-xs font-semibold gap-2 justify-start border-primary/30 hover:bg-primary/5"
                      >
                        <a href={`mailto:${partner.nodalOfficer.email}`}>
                          <Mail className="size-3.5 text-primary" />
                          <span className="truncate">
                            {t("partners.profile.emailDesk")}: {partner.nodalOfficer.email}
                          </span>
                        </a>
                      </Button>
                    )}
                  </div>
                </div>
              )}

              {/* Operating Hours Card */}
              {partner.operatingHours && (
                <div className="rounded-xl border border-border/80 bg-muted/30 p-4 flex items-start gap-3">
                  <Clock className="size-5 text-primary shrink-0 mt-0.5" />
                  <div className="space-y-1">
                    <h5 className="font-semibold text-sm text-foreground">
                      {t("partners.profile.operatingHours")}
                    </h5>
                    <p className="text-xs text-muted-foreground leading-relaxed">
                      {partner.operatingHours[lang] || partner.operatingHours.en}
                    </p>
                  </div>
                </div>
              )}

              {/* Operational Stats & Processing Capacity */}
              <div className="rounded-xl border border-border/80 bg-muted/20 p-4 space-y-3">
                <h5 className="font-semibold text-xs uppercase tracking-wider text-muted-foreground">
                  {t("partners.profile.operationalStats")}
                </h5>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="space-y-1.5 rounded-lg bg-background p-3 border border-border/60">
                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span className="font-medium">{t("partners.profile.fundUtilization")}</span>
                      <span className="tabular-nums font-bold text-foreground">
                        {partner.fundUtilizationPct}%
                      </span>
                    </div>
                    <Progress value={partner.fundUtilizationPct} className="h-2" />
                  </div>

                  {typeof partner.avgProcessingDays === "number" && (
                    <div className="flex items-center gap-3 rounded-lg bg-background p-3 border border-border/60">
                      <div className="size-8 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                        <Clock className="size-4" />
                      </div>
                      <div>
                        <span className="block font-bold text-sm text-foreground">
                          ~{partner.avgProcessingDays} {t("common.days", "days")}
                        </span>
                        <span className="text-xs text-muted-foreground">
                          {t("partners.profile.avgTurnaround")}
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Location & Coordinates Link */}
              <div className="rounded-xl border border-border/80 bg-muted/20 p-3.5 flex flex-wrap items-center justify-between gap-2 text-xs text-muted-foreground">
                <div className="flex items-center gap-1.5">
                  <Navigation className="size-3.5 text-primary shrink-0" />
                  <span>{t("partners.profile.coordinates")}:</span>
                  <span className="font-mono font-medium text-foreground">
                    {partner.geo.lat.toFixed(4)}, {partner.geo.lng.toFixed(4)}
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <a
                    href={googleMapsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="underline text-primary hover:text-primary/80 inline-flex items-center gap-1"
                  >
                    Google Maps <ExternalLink className="size-3" />
                  </a>
                  <a
                    href={osmUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="underline text-primary hover:text-primary/80 inline-flex items-center gap-1"
                  >
                    OSM <ExternalLink className="size-3" />
                  </a>
                </div>
              </div>
            </TabsContent>

            {/* TAB 2: SUPPORTED SCHEMES */}
            <TabsContent value="schemes" className="space-y-3 m-0 focus-visible:outline-none">
              <div className="space-y-1 pb-1">
                <h4 className="font-display font-semibold text-sm text-foreground">
                  {t("partners.profile.supportedSchemesTitle")}
                </h4>
                <p className="text-xs text-muted-foreground">
                  {t("partners.profile.supportedSchemesSubtitle")}
                </p>
              </div>

              {partner.supportedSchemeDetails && partner.supportedSchemeDetails.length > 0 ? (
                <div className="space-y-2.5">
                  {partner.supportedSchemeDetails.map((s, idx) => (
                    <div
                      key={idx}
                      className="rounded-xl border border-border/80 bg-card p-4 hover:border-primary/40 hover:shadow-xs transition-all space-y-3"
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div className="space-y-1 min-w-0 flex-1">
                          <div className="flex items-center gap-2">
                            <Badge variant="secondary" className="text-[11px] font-semibold">
                              {t(`schemeTypes.${s.category}`)}
                            </Badge>
                          </div>
                          <h5 className="font-display font-bold text-sm sm:text-base text-foreground">
                            {s.schemeName[lang] || s.schemeName.en}
                          </h5>
                        </div>

                        {s.schemeId && (
                          <Button asChild variant="ghost" size="sm" className="h-8 text-xs font-semibold gap-1 text-primary">
                            <Link to={`/schemes/${s.schemeId}`}>
                              <span>{t("partners.profile.viewScheme")}</span>
                              <ExternalLink className="size-3" />
                            </Link>
                          </Button>
                        )}
                      </div>

                      <div className="grid grid-cols-2 gap-2 pt-2 border-t border-border/50 text-xs">
                        <div className="flex items-center gap-2 rounded-lg bg-muted/30 p-2">
                          <Percent className="size-3.5 text-primary shrink-0" />
                          <div>
                            <span className="text-muted-foreground block text-[11px]">
                              {t("partners.profile.interestRate")}
                            </span>
                            <span className="font-bold text-foreground">{s.interestRate}</span>
                          </div>
                        </div>

                        <div className="flex items-center gap-2 rounded-lg bg-muted/30 p-2">
                          <Wallet className="size-3.5 text-primary shrink-0" />
                          <div>
                            <span className="text-muted-foreground block text-[11px]">
                              {t("partners.profile.maxLimit")}
                            </span>
                            <span className="font-bold text-foreground">{s.maxLimit}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="space-y-2">
                  {partner.schemeCategories.map((c) => (
                    <div
                      key={c}
                      className="rounded-lg border border-border/80 bg-muted/20 p-3 flex items-center justify-between text-xs"
                    >
                      <div className="flex items-center gap-2">
                        <Badge variant="secondary">{t(`schemeTypes.${c}`)}</Badge>
                        <span className="font-semibold text-foreground">
                          {t(`schemeTypes.${c}`)} Concessional Lending Channel
                        </span>
                      </div>
                      <Sparkles className="size-3.5 text-primary" />
                    </div>
                  ))}
                </div>
              )}
            </TabsContent>

            {/* TAB 3: REQUIRED DOCUMENTS */}
            <TabsContent value="docs" className="space-y-3 m-0 focus-visible:outline-none">
              <div className="space-y-1 pb-1">
                <h4 className="font-display font-semibold text-sm text-foreground">
                  {t("partners.profile.documentsTitle")}
                </h4>
                <p className="text-xs text-muted-foreground">
                  {t("partners.profile.documentsSubtitle")}
                </p>
              </div>

              <div className="rounded-xl border border-border/80 bg-card p-4 space-y-3">
                <ul className="space-y-2.5">
                  {partner.docsRequired.map((d, index) => {
                    const label = d[lang] || d.en
                    return (
                      <li
                        key={index}
                        className="flex items-start gap-2.5 text-sm text-foreground/90 p-2 rounded-lg bg-muted/20 border border-border/40"
                      >
                        <CheckCircle2 className="size-4 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                        <div className="flex-1">
                          <span className="font-medium">{label}</span>
                          <span className="ml-2 text-[10px] uppercase font-semibold text-muted-foreground bg-muted px-1.5 py-0.5 rounded">
                            {t("partners.profile.docMandatory")}
                          </span>
                        </div>
                      </li>
                    )
                  })}
                </ul>

                <div className="rounded-lg bg-primary/5 border border-primary/15 p-3 flex items-start gap-2 text-xs text-muted-foreground">
                  <FileCheck className="size-4 text-primary shrink-0 mt-0.5" />
                  <p className="leading-relaxed">
                    {t("partners.profile.docNote")}
                  </p>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>

        {/* Footer Action Bar with WCAG AA min 44x44px touch targets */}
        <div className="p-4 bg-muted/40 border-t border-border/70 flex flex-wrap items-center justify-between gap-2.5">
          <div className="flex flex-wrap items-center gap-2">
            {partner.phone && (
              <Button
                asChild
                size="default"
                variant="default"
                className="h-11 min-w-[44px] min-h-[44px] px-4 text-xs font-semibold gap-2 shadow-xs"
              >
                <a href={`tel:${partner.phone}`}>
                  <Phone className="size-4" />
                  {t("partners.profile.callBranch")}
                </a>
              </Button>
            )}

            {primaryEmail && (
              <Button
                asChild
                size="default"
                variant="outline"
                className="h-11 min-w-[44px] min-h-[44px] px-4 text-xs font-semibold gap-2 border-border/80"
              >
                <a href={`mailto:${primaryEmail}`}>
                  <Mail className="size-4" />
                  {t("partners.profile.emailBranch")}
                </a>
              </Button>
            )}

            <Button
              asChild
              size="default"
              variant="outline"
              className="h-11 min-w-[44px] min-h-[44px] px-4 text-xs font-semibold gap-2 border-primary/40 text-primary hover:bg-primary/5"
            >
              <a href={googleMapsUrl} target="_blank" rel="noopener noreferrer">
                <Navigation className="size-4" />
                {t("partners.getDirections")}
              </a>
            </Button>
          </div>

          <div className="flex items-center gap-2 ml-auto">
            <Button
              type="button"
              variant="outline"
              size="default"
              onClick={handleShare}
              className="h-11 min-w-[44px] min-h-[44px] px-3.5 text-xs font-semibold gap-2"
              title={t("partners.profile.shareBranch")}
            >
              <Share2 className="size-4 text-primary" />
              <span className="hidden sm:inline">{t("partners.profile.shareBranch")}</span>
            </Button>

            <Button
              type="button"
              variant="secondary"
              size="default"
              onClick={() => onOpenChange(false)}
              className="h-11 min-w-[44px] min-h-[44px] px-4 text-xs font-semibold"
            >
              {t("partners.profile.close")}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
