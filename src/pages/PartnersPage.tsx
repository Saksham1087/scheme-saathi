import { useCallback, useEffect, useMemo, useRef, useState } from "react"
import { useSearchParams } from "react-router-dom"
import { useTranslation } from "react-i18next"
import { toast } from "sonner"
import { List, Map as MapIcon, RotateCcw, ShieldAlert, Sparkles } from "lucide-react"
import { collection, getDocs } from "firebase/firestore"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { PartnerCard } from "@/components/partners/PartnerCard"
import { PartnerMapSearch } from "@/components/partners/PartnerMapSearch"
import { db } from "@/lib/firebase"
import { distanceKm } from "@/lib/emi"
import { createLeafletMap } from "@/lib/maps/leaflet"
import { type GeoPoint, type MapService, PARTNER_TYPE_VISUALS } from "@/lib/maps/types"
import type { ChannelPartner, PartnerType, SchemeType } from "@/types"
import partnersSeed from "@seed/partners.seed.json"

const DEFAULT_LOCATION: GeoPoint = { lat: 26.8467, lng: 80.9462 } // Lucknow / UP Capital Center

function loadSeedPartners(): ChannelPartner[] {
  return partnersSeed as unknown as ChannelPartner[]
}

export default function PartnersPage() {
  const { t } = useTranslation()
  const [searchParams] = useSearchParams()

  const mapElRef = useRef<HTMLDivElement>(null)
  const mapRef = useRef<MapService | null>(null)

  // Initialize filter from URL query param if present
  const initialCategory = useMemo<SchemeType | "all">(() => {
    const type = searchParams.get("type")
    if (type === "micro" || type === "term" || type === "education") {
      return type
    }
    return "all"
  }, [searchParams])

  const [partners, setPartners] = useState<ChannelPartner[] | null>(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [filter, setFilter] = useState<SchemeType | "all">(initialCategory)
  const [partnerTypeFilter, setPartnerTypeFilter] = useState<PartnerType | "all">("all")
  const [includeFlagged, setIncludeFlagged] = useState(false)
  const [userLoc, setUserLoc] = useState<GeoPoint>(DEFAULT_LOCATION)
  const [isLocating, setIsLocating] = useState(false)
  const [focusId, setFocusId] = useState<string | null>(null)
  const [mobileTab, setMobileTab] = useState<"list" | "map">("list")

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

  const handleMarkerClick = useCallback((partnerId: string) => {
    setFocusId(partnerId)
    // If on mobile map view, switch to list or scroll
    const el = document.getElementById(`partner-card-${partnerId}`)
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "nearest" })
    }
  }, [])

  // Mount / unmount map
  useEffect(() => {
    if (!mapElRef.current) return
    const service = createLeafletMap()
    service.mount(mapElRef.current, {
      onMarkerClick: handleMarkerClick,
    })
    mapRef.current = service

    return () => {
      service.destroy()
      mapRef.current = null
    }
  }, [handleMarkerClick])

  // Invalidate map size when mobile view switches or window resizes
  useEffect(() => {
    const timer = setTimeout(() => {
      mapRef.current?.invalidateSize()
    }, 150)
    return () => clearTimeout(timer)
  }, [mobileTab])

  // Filter and sort partners
  const filteredSorted = useMemo(() => {
    if (!partners) return []

    const q = searchQuery.trim().toLowerCase()

    const result = partners.filter((p) => {
      // 1. Category filter
      if (filter !== "all" && !p.schemeCategories.includes(filter)) {
        return false
      }

      // 2. Partner type filter
      if (partnerTypeFilter !== "all" && p.type !== partnerTypeFilter) {
        return false
      }

      // 3. High-NPA flag filter
      if (!includeFlagged && p.npaFlag === "high") {
        return false
      }

      // 4. Text search query
      if (q) {
        const nameMatch = p.name.toLowerCase().includes(q)
        const cityMatch = p.city.toLowerCase().includes(q)
        const stateMatch = p.state.toLowerCase().includes(q)
        const addressMatch = p.address.toLowerCase().includes(q)
        if (!nameMatch && !cityMatch && !stateMatch && !addressMatch) {
          return false
        }
      }

      return true
    })

    return result.sort((a, b) => {
      // High-NPA partners deprioritized to the bottom when included
      const npaA = a.npaFlag === "high" ? 1 : 0
      const npaB = b.npaFlag === "high" ? 1 : 0
      if (npaA !== npaB) return npaA - npaB
      return distanceKm(userLoc, a.geo) - distanceKm(userLoc, b.geo)
    })
  }, [partners, filter, partnerTypeFilter, includeFlagged, searchQuery, userLoc])

  // Update map markers when filtered list or focus changes
  useEffect(() => {
    mapRef.current?.setMarkers(filteredSorted, focusId)
  }, [filteredSorted, focusId])

  // Update user location pin on map
  useEffect(() => {
    mapRef.current?.setUserLocation(userLoc)
  }, [userLoc])

  function handleLocateMe() {
    if (!navigator.geolocation) {
      toast.error(t("partners.locationError"))
      return
    }

    setIsLocating(true)
    toast.info(t("partners.locating"))

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setIsLocating(false)
        const newLoc = {
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
        }
        setUserLoc(newLoc)
        toast.success(t("partners.locationSuccess"))
      },
      () => {
        setIsLocating(false)
        toast.error(t("partners.locationError"))
        // Safe fallback already set to state capital default
      },
      { timeout: 10000, enableHighAccuracy: true },
    )
  }

  function handleResetFilters() {
    setSearchQuery("")
    setFilter("all")
    setPartnerTypeFilter("all")
    setIncludeFlagged(false)
    setFocusId(null)
  }

  function handleFocusOnMap(partner: ChannelPartner) {
    setFocusId(partner.id)
    mapRef.current?.focusPartner(partner)
    // On mobile, jump to map view to view the focused partner pin
    setMobileTab("map")
  }

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 md:py-10">
      {/* Header */}
      <div className="mb-6 space-y-2">
        <div className="flex flex-wrap items-center gap-2">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
            <Sparkles className="size-3.5" />
            NSFDC Channel Network
          </span>
          <span className="inline-flex items-center gap-1 rounded-full bg-muted px-2.5 py-0.5 text-xs font-medium text-muted-foreground">
            Zero-API OpenStreetMap
          </span>
        </div>
        <h1 className="font-display font-extrabold text-2xl sm:text-3xl md:text-4xl tracking-tight text-foreground">
          {t("partners.title")}
        </h1>
        <p className="text-sm sm:text-base text-muted-foreground max-w-3xl">
          {t("partners.subtitle")}
        </p>
      </div>

      {/* Search and Filters Bar */}
      <div className="mb-6">
        <PartnerMapSearch
          searchQuery={searchQuery}
          onSearchQueryChange={setSearchQuery}
          categoryFilter={filter}
          onCategoryFilterChange={setFilter}
          partnerTypeFilter={partnerTypeFilter}
          onPartnerTypeFilterChange={setPartnerTypeFilter}
          includeFlagged={includeFlagged}
          onIncludeFlaggedChange={setIncludeFlagged}
          onUseMyLocation={handleLocateMe}
          isLocating={isLocating}
          totalCount={partners ? partners.length : 0}
          filteredCount={filteredSorted.length}
          onResetFilters={handleResetFilters}
        />
      </div>

      {/* Visual Legend Bar */}
      <div className="mb-6 rounded-lg bg-card border border-border/70 px-4 py-2.5 flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2 text-muted-foreground font-medium">
          <span className="font-semibold text-foreground uppercase tracking-wider text-[11px]">
            {t("partners.legendTitle")}:
          </span>
        </div>
        <div className="flex flex-wrap items-center gap-3 sm:gap-5">
          {(["SCA", "PSB", "RRB", "NBFC_MFI"] as PartnerType[]).map((type) => {
            const visual = PARTNER_TYPE_VISUALS[type]
            return (
              <div key={type} className="flex items-center gap-1.5">
                <span
                  className="size-3 rounded-full border border-white/80 shadow-xs"
                  style={{ backgroundColor: visual.color }}
                />
                <span className="font-medium text-foreground">{visual.shortLabel}</span>
                <span className="text-muted-foreground hidden md:inline">({t(visual.labelKey)})</span>
              </div>
            )
          })}
          <div className="flex items-center gap-1.5 pl-2 border-l border-border/70">
            <span className="size-3 rounded-full bg-orange-600 border border-white shadow-xs" />
            <span className="font-medium text-foreground">{t("partners.userLocation")}</span>
          </div>
        </div>
      </div>

      {/* Mobile Map / List Toggle */}
      <div className="lg:hidden mb-4 flex items-center justify-center">
        <div className="inline-flex rounded-lg border border-border bg-muted/60 p-1 shadow-xs">
          <Button
            type="button"
            size="sm"
            variant={mobileTab === "list" ? "default" : "ghost"}
            onClick={() => setMobileTab("list")}
            className="h-9 px-4 text-xs font-semibold gap-1.5"
          >
            <List className="size-4" />
            {t("partners.mobileToggleList")} ({filteredSorted.length})
          </Button>
          <Button
            type="button"
            size="sm"
            variant={mobileTab === "map" ? "default" : "ghost"}
            onClick={() => setMobileTab("map")}
            className="h-9 px-4 text-xs font-semibold gap-1.5"
          >
            <MapIcon className="size-4" />
            {t("partners.mobileToggleMap")}
          </Button>
        </div>
      </div>

      {/* Split-screen Responsive Layout */}
      <div className="grid lg:grid-cols-[1fr_1.15fr] gap-6 items-start">
        {/* Left Column: Partner List */}
        <div
          className={`space-y-4 ${
            mobileTab === "map" ? "hidden lg:block" : "block"
          }`}
        >
          {partners === null && (
            <Card className="border-dashed">
              <CardContent className="py-12 text-center text-muted-foreground text-sm">
                <div className="inline-block animate-spin rounded-full size-6 border-2 border-primary border-t-transparent mb-3" />
                <p>{t("common.loading")}</p>
              </CardContent>
            </Card>
          )}

          {partners !== null && filteredSorted.length === 0 && (
            <Card className="border-dashed bg-muted/20">
              <CardContent className="py-12 px-6 text-center space-y-3">
                <div className="mx-auto size-10 rounded-full bg-muted flex items-center justify-center text-muted-foreground">
                  <ShieldAlert className="size-5" />
                </div>
                <h3 className="font-display font-semibold text-base text-foreground">
                  {t("partners.emptyList")}
                </h3>
                <p className="text-xs sm:text-sm text-muted-foreground max-w-md mx-auto">
                  {t("partners.emptyPrompt")}
                </p>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={handleResetFilters}
                  className="mt-2 text-xs font-semibold gap-1.5"
                >
                  <RotateCcw className="size-3.5" />
                  {t("partners.resetFilters")}
                </Button>
              </CardContent>
            </Card>
          )}

          {filteredSorted.map((p) => (
            <PartnerCard
              key={p.id}
              partner={p}
              userLocation={userLoc}
              isSelected={focusId === p.id}
              onSelect={() => setFocusId(p.id)}
              onFocusOnMap={handleFocusOnMap}
            />
          ))}
        </div>

        {/* Right Column: Sticky Interactive Leaflet Map */}
        <div
          className={`rounded-xl overflow-hidden border border-border shadow-sm bg-muted relative h-[420px] sm:h-[480px] lg:h-[calc(100vh-140px)] lg:sticky lg:top-20 z-0 ${
            mobileTab === "list" ? "hidden lg:block" : "block"
          }`}
        >
          <div ref={mapElRef} className="w-full h-full" />
        </div>
      </div>
    </div>
  )
}

