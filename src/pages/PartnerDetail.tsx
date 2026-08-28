import { useParams, Link } from "react-router-dom"
import { useTranslation } from "react-i18next"
import {
  ArrowLeft,
  BadgeCheck,
  Clock,
  ExternalLink,
  MapPin,
  Phone,
  TriangleAlert,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import partnersSeed from "@seed/partners.seed.json"
import type { ChannelPartner } from "@/types"
import { distanceKm } from "@/lib/emi"

const DEFAULT_LOCATION = { lat: 26.8467, lng: 80.9462 }

export default function PartnerDetail() {
  const { id } = useParams<{ id: string }>()
  const { t, i18n } = useTranslation()
  const lang = i18n.language as "en" | "hi"

  const partner = (partnersSeed as unknown as ChannelPartner[]).find((p) => p.id === id)

  if (!partner) {
    return (
      <main className="mx-auto max-w-3xl px-4 py-16 text-center">
        <h1 className="font-display font-bold text-3xl">{t("partners.emptyList")}</h1>
        <Button asChild className="mt-6">
          <Link to="/partners">
            <ArrowLeft className="mr-2 size-4" />
            {t("common.back")}
          </Link>
        </Button>
      </main>
    )
  }

  const dist = distanceKm(DEFAULT_LOCATION, partner.geo).toFixed(1)
  const highNpa = partner.npaFlag === "high"

  const directionsUrl = `https://www.google.com/maps/dir/?api=1&destination=${partner.geo.lat},${partner.geo.lng}`

  return (
    <main className="mx-auto max-w-3xl px-4 py-8">
      <Button variant="ghost" size="sm" asChild className="mb-6">
        <Link to="/partners">
          <ArrowLeft className="mr-1.5 size-4" />
          {t("common.back")}
        </Link>
      </Button>

      <header className="space-y-3">
        <div className="flex items-start justify-between gap-3">
          <h1 className="font-display font-bold text-3xl tracking-tight">
            {partner.name}
          </h1>
          <span className="text-sm font-semibold text-primary whitespace-nowrap mt-1">
            {t("partners.distanceAway", { km: dist })}
          </span>
        </div>
        <p className="text-sm text-muted-foreground">
          {partner.address}, {partner.city}, {partner.state}
        </p>
        <div className="flex flex-wrap gap-2">
          <Badge variant="outline" className="gap-1">
            <BadgeCheck className="size-3" />
            {t(`partners.typeNames.${partner.type}`)}
          </Badge>
          {highNpa && (
            <Badge variant="destructive" className="gap-1">
              <TriangleAlert className="size-3" />
              {t("partners.highNpaBadge")}
            </Badge>
          )}
        </div>
      </header>

      <div className="mt-6 space-y-4">
        {/* Scheme categories */}
        <Card>
          <CardContent className="pt-5 space-y-3">
            <h3 className="text-sm font-semibold">{t("partners.handles")}</h3>
            <div className="flex flex-wrap gap-1.5">
              {partner.schemeCategories.map((c) => (
                <Badge key={c} variant="secondary" className="font-medium">
                  {t(`schemeTypes.${c}`)}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Capacity & processing */}
        <Card>
          <CardContent className="pt-5 space-y-4">
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span>{t("partners.capacity")}</span>
                <span className="tabular-nums font-medium">{partner.fundUtilizationPct}%</span>
              </div>
              <Progress value={partner.fundUtilizationPct} className="h-2" />
            </div>
            {typeof partner.avgProcessingDays === "number" && (
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Clock className="size-4" />
                {t("partners.processingTime", { days: partner.avgProcessingDays })}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Documents */}
        <Card>
          <CardContent className="pt-5 space-y-3">
            <h3 className="text-sm font-semibold">{t("partners.docsRequired")}</h3>
            <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
              {partner.docsRequired.map((d) => (
                <li key={d.en}>{d[lang] ?? d.en}</li>
              ))}
            </ul>
          </CardContent>
        </Card>

        {/* Actions */}
        <div className="flex flex-wrap gap-3">
          {partner.phone && (
            <Button asChild>
              <a href={`tel:${partner.phone}`}>
                <Phone className="mr-2 size-4" />
                {t("partners.callNow")} · {partner.phone}
              </a>
            </Button>
          )}
          <Button variant="outline" asChild>
            <a href={directionsUrl} target="_blank" rel="noopener noreferrer">
              <MapPin className="mr-2 size-4" />
              {t("partners.directions")}
              <ExternalLink className="ml-1.5 size-3" />
            </a>
          </Button>
        </div>
      </div>
    </main>
  )
}
