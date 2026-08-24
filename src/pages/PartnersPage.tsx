import { useEffect, useMemo, useRef, useState } from "react"
import { useSearchParams } from "react-router-dom"
import { useTranslation } from "react-i18next"
import { toast } from "sonner"
import { BadgeCheck, Crosshair, Phone, TriangleAlert } from "lucide-react"
import { collection, getDocs } from "firebase/firestore"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Progress } from "@/components/ui/progress"
import { db } from "@/lib/firebase"
import { distanceKm } from "@/lib/emi"
import { createLeafletMap } from "@/lib/maps/leaflet"
import type { MapService } from "@/lib/maps/types"
import type { ChannelPartner, SchemeType } from "@/types"
import partnersSeed from "@seed/partners.seed.json"

const DEFAULT_LOCATION = { lat: 26.8467, lng: 80.9462 }

const FILTERS: Array<SchemeType | "all"> = ["all", "micro", "term", "education"]

function loadSeedPartners(): ChannelPartner[] {
  return partnersSeed as unknown as ChannelPartner[]
}

export default function PartnersPage() {
  const { t, i18n } = useTranslation()
  const [searchParams] = useSearchParams()

  const mapElRef = useRef<HTMLDivElement>(null)
  const mapRef = useRef<MapService | null>(null)

  const [partners, setPartners] = useState<ChannelPartner[] | null>(null)
  const [filter, setFilter] = useState<SchemeType | "all">("all")
  const [includeFlagged, setIncludeFlagged] = useState(false)
  const [userLoc, setUserLoc] = useState(DEFAULT_LOCATION)
  const [focusId, setFocusId] = useState<string | null>(null)

  // URL param preset from Results CTA (?type=micro|term|education)
  useEffect(() => {
    const type = searchParams.get("type")
    if (type === "micro" || type === "term" || type === "education") {
      setFilter(type)
    }
  }, [searchParams])

  // Load partners: Firestore first, bundled seed fallback for demo resilience.
  useEffect(() => {
    let cancelled = false
    async function load() {
      try {
        const snap = await getDocs(collection(db, "partners"))
        if (!cancelled) {
          setPartners(
            snap.empty
              ? loadSeedPartners()
              : snap.docs.map((d) => ({ ...(d.data() as ChannelPartner), id: d.id })),
          )
        }
      } catch {
        if (!cancelled) setPartners(loadSeedPartners())
      }
    }
    void load()
    return () => {
      cancelled = true
    }
  }, [])

  // Mount / unmount map
  useEffect(() => {
    if (!mapElRef.current) return
    const service = createLeafletMap()
    service.mount(mapElRef.current)
    mapRef.current = service
    return () => {
      service.destroy()
      mapRef.current = null
    }
  }, [])

  const filteredSorted = useMemo(() => {
    if (!partners) return []
    const byCategory = partners.filter((p) =>
      filter === "all" ? true : p.schemeCategories.includes(filter),
    )
    const visible = includeFlagged
      ? byCategory
      : byCategory.filter((p) => p.npaFlag !== "high")

    return [...visible].sort((a, b) => {
      // High-NPA partners deprioritized to the bottom when included.
      const npaA = a.npaFlag === "high" ? 1 : 0
      const npaB = b.npaFlag === "high" ? 1 : 0
      if (npaA !== npaB) return npaA - npaB
      return (
        distanceKm(userLoc, a.geo) - distanceKm(userLoc, b.geo)
      )
    })
  }, [partners, filter, includeFlagged, userLoc])

  useEffect(() => {
    mapRef.current?.setMarkers(filteredSorted, focusId)
  }, [filteredSorted, focusId])

  useEffect(() => {
    mapRef.current?.setUserLocation(userLoc)
  }, [userLoc]) // eslint-disable-line react-hooks/exhaustive-deps

  function locateMe() {
    if (!navigator.geolocation) return
    toast.info(t("partners.locating"))
    navigator.geolocation.getCurrentPosition(
      (pos) =>
        setUserLoc({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
      () => toast.error(t("partners.loadError")),
      { timeout: 8000 },
    )
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <h1 className="font-display font-bold text-3xl tracking-tight">
        {t("partners.title")}
      </h1>
      <p className="mt-1 text-sm text-muted-foreground mb-7">
        {t("partners.subtitle")}
      </p>

      {/* Filters */}
      <div className="mb-5 flex flex-wrap items-center gap-2">
        {FILTERS.map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            aria-pressed={filter === f}
            className={`rounded-full border px-4 py-1.5 text-sm font-medium transition-colors ${
              filter === f
                ? "border-primary bg-primary text-primary-foreground"
                : "border-border hover:bg-secondary"
            }`}
          >
            {f === "all"
              ? t("partners.filterAll")
              : t(`partners.filter${f[0].toUpperCase()}${f.slice(1)}`)}
          </button>
        ))}
        <Button variant="outline" size="sm" onClick={locateMe} className="ml-auto">
          <Crosshair className="mr-1.5 size-4" />
          {t("partners.useMyLocation")}
        </Button>
        <label className="flex items-center gap-2 cursor-pointer text-sm">
          <Checkbox
            checked={includeFlagged}
            onCheckedChange={(v) => setIncludeFlagged(v === true)}
          />
          {t("partners.includeFlagged")}
        </label>
      </div>

      <div className="grid lg:grid-cols-[1fr_1.1fr] gap-6 items-start">
        {/* Map */}
        <div className="rounded-xl overflow-hidden border border-border h-[380px] lg:h-[640px] lg:sticky lg:top-24 z-0">
          <div ref={mapElRef} className="w-full h-full bg-muted" />
        </div>

        {/* Partner cards */}
        <div className="space-y-4">
          {partners === null && (
            <Card>
              <CardContent className="py-10 text-center text-muted-foreground">
                {t("common.loading")}
              </CardContent>
            </Card>
          )}
          {partners !== null && filteredSorted.length === 0 && (
            <Card>
              <CardContent className="py-10 text-center text-muted-foreground">
                {t("partners.emptyList")}
              </CardContent>
            </Card>
          )}
          {filteredSorted.map((p) => {
            const highNpa = p.npaFlag === "high"
            return (
              <Card
                key={p.id}
                onMouseEnter={() => setFocusId(p.id)}
                onFocus={() => setFocusId(p.id)}
                tabIndex={0}
                className={`cursor-pointer transition-shadow ${
                  highNpa ? "border-destructive/50 opacity-90" : ""
                }`}
              >
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between gap-3">
                    <CardTitle className="font-display text-base leading-snug">
                      {p.name}
                    </CardTitle>
                    <span className="text-xs font-semibold text-primary whitespace-nowrap mt-1">
                      {t("partners.distanceAway", {
                        km: distanceKm(userLoc, p.geo).toFixed(1),
                      })}
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {p.address}, {p.city}, {p.state}
                  </p>
                  {highNpa && (
                    <Badge variant="destructive" className="mt-1 w-fit gap-1">
                      <TriangleAlert className="size-3" />
                      {t("partners.highNpaBadge")}
                    </Badge>
                  )}
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex flex-wrap gap-1.5">
                    {p.schemeCategories.map((c) => (
                      <Badge key={c} variant="secondary" className="font-medium">
                        {t(`schemeTypes.${c}`)}
                      </Badge>
                    ))}
                    <span className="inline-flex items-center gap-1 rounded-md border border-border px-2 py-0.5 text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
                      <BadgeCheck className="size-3" />
                      {t(`partners.typeNames.${p.type}`)}
                    </span>
                  </div>
                  <div>
                    <div className="flex justify-between text-xs text-muted-foreground mb-1">
                      <span>{t("partners.capacity")}</span>
                      <span className="tabular-nums">{p.fundUtilizationPct}%</span>
                    </div>
                    <Progress value={p.fundUtilizationPct} className="h-2" />
                  </div>
                  {typeof p.avgProcessingDays === "number" && (
                    <p className="text-xs text-muted-foreground">
                      {t("partners.processingTime", { days: p.avgProcessingDays })}
                    </p>
                  )}
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button size="sm" variant="outline">
                        {t("partners.docsRequired")}
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-sm">
                      <DialogHeader>
                        <DialogTitle className="font-display">
                          {p.name}
                        </DialogTitle>
                      </DialogHeader>
                      <p className="text-sm font-semibold">
                        {t("partners.docsRequired")}
                      </p>
                      <ul className="list-disc pl-5 space-y-1 text-sm">
                        {p.docsRequired.map((d) => (
                          <li key={d.en}>
                            {d[i18n.language as "en" | "hi"] ?? d.en}
                          </li>
                        ))}
                      </ul>
                      {p.phone && (
                        <Button asChild>
                          <a href={`tel:${p.phone}`}>
                            <Phone className="mr-1.5 size-4" />
                            {t("partners.callNow")} · {p.phone}
                          </a>
                        </Button>
                      )}
                    </DialogContent>
                  </Dialog>
                </CardContent>
              </Card>
            )
          })}
        </div>
      </div>
    </div>
  )
}

