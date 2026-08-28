import { useEffect, useMemo, useState } from "react"
import { useSearchParams } from "react-router-dom"
import { useTranslation } from "react-i18next"
import {
  SlidersHorizontal,
  SearchX,
  RotateCcw,
  Sparkles,
  BookOpen,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { SchemeCard } from "@/components/schemes/SchemeCard"
import { SchemeSearchBar } from "@/components/schemes/SchemeSearchBar"
import { SchemeFilterSidebar } from "@/components/schemes/SchemeFilterSidebar"
import { useSchemeStore, filterAndSortSchemes } from "@/stores/useSchemeStore"

export default function SchemesCatalog() {
  const { t, i18n } = useTranslation()
  const [searchParams, setSearchParams] = useSearchParams()
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false)

  const {
    schemes,
    loading,
    error,
    loadSchemes,
    searchQuery,
    selectedCategories,
    selectedState,
    maxIncome,
    amountRange,
    selectedPurposes,
    selectedEducation,
    sortBy,
    setSelectedCategories,
    setSearchQuery,
    setSelectedState,
    resetFilters,
    getActiveFilterCount,
  } = useSchemeStore()

  // 1. Initial Data Fetch
  useEffect(() => {
    void loadSchemes()
  }, [loadSchemes])

  // 2. Sync URL query parameters on page load / popstate
  useEffect(() => {
    const categoryParam = searchParams.get("category")
    const queryParam = searchParams.get("q")
    const stateParam = searchParams.get("state")

    if (categoryParam) {
      const cats = categoryParam.split(",").map((c) => c.trim()).filter(Boolean)
      setSelectedCategories(cats)
    }
    if (queryParam !== null) {
      setSearchQuery(queryParam)
    }
    if (stateParam) {
      setSelectedState(stateParam)
    }
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  // 3. Keep URL query params in sync when filters change
  useEffect(() => {
    const params = new URLSearchParams()
    if (selectedCategories.length > 0) {
      params.set("category", selectedCategories.join(","))
    }
    if (searchQuery.trim()) {
      params.set("q", searchQuery.trim())
    }
    if (selectedState && selectedState !== "all") {
      params.set("state", selectedState)
    }

    const currentString = searchParams.toString()
    const newString = params.toString()
    if (currentString !== newString) {
      setSearchParams(params, { replace: true })
    }
  }, [selectedCategories, searchQuery, selectedState, searchParams, setSearchParams])

  const lang = (i18n.language === "hi" ? "hi" : "en") as "en" | "hi"

  // 4. Memoized Filtered & Sorted schemes (guaranteed < 100ms response)
  const filteredSchemes = useMemo(() => {
    return filterAndSortSchemes(
      schemes,
      {
        searchQuery,
        selectedCategories,
        selectedState,
        maxIncome,
        amountRange,
        selectedPurposes,
        selectedEducation,
        sortBy,
      },
      lang,
    )
  }, [
    schemes,
    searchQuery,
    selectedCategories,
    selectedState,
    maxIncome,
    amountRange,
    selectedPurposes,
    selectedEducation,
    sortBy,
    lang,
  ])

  const activeCount = getActiveFilterCount()

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 md:py-10">
      {/* Hero Header */}
      <div className="mb-8 space-y-3">
        <div className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
          <Sparkles className="size-3.5" />
          {t("schemes.tagline", "Government Financial Assistance & Welfare Schemes")}
        </div>
        <h1 className="font-display font-bold text-3xl md:text-4xl tracking-tight text-foreground">
          {t("schemes.pageTitle", "Faceted Scheme Catalog")}
        </h1>
        <p className="max-w-2xl text-sm md:text-base text-muted-foreground leading-relaxed">
          {t(
            "schemes.pageSubtitle",
            "Explore concessional credit, term loans, and education finance from central and state corporations with multi-dimensional criteria matching.",
          )}
        </p>
      </div>

      {/* Top Search & Filter Bar */}
      <div className="mb-6">
        <SchemeSearchBar />
      </div>

      {/* Main Content: Sidebar + Cards Grid */}
      <div className="grid lg:grid-cols-[280px_1fr] gap-8 items-start">
        {/* Desktop Sidebar (Persistent) */}
        <aside className="hidden lg:block sticky top-20 rounded-xl border border-border/80 bg-card p-5 shadow-xs">
          <SchemeFilterSidebar />
        </aside>

        {/* Catalog Main Column */}
        <div className="space-y-5">
          {/* Toolbar: Counter & Mobile Filter Button */}
          <div className="flex items-center justify-between gap-3 bg-muted/40 border border-border/60 rounded-lg px-4 py-2.5">
            <div className="flex items-center gap-2">
              <BookOpen className="size-4 text-primary" />
              <span className="text-sm font-semibold text-foreground">
                {t("schemes.resultsCount", {
                  count: filteredSchemes.length,
                  total: schemes.length,
                  defaultValue: "Showing {{count}} of {{total}} schemes",
                })}
              </span>
            </div>

            {/* Mobile Filter Drawer Trigger */}
            <div className="lg:hidden">
              <Dialog open={mobileDrawerOpen} onOpenChange={setMobileDrawerOpen}>
                <DialogTrigger asChild>
                  <Button
                    variant="outline"
                    size="sm"
                    className="min-h-[40px] gap-2 text-xs font-semibold border-primary/50"
                  >
                    <SlidersHorizontal className="size-3.5" />
                    {t("filters.title", "Filters")}
                    {activeCount > 0 && (
                      <span className="flex size-5 items-center justify-center rounded-full bg-primary text-[11px] text-primary-foreground font-bold">
                        {activeCount}
                      </span>
                    )}
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-md max-h-[85vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle className="font-display">
                      {t("filters.title", "Filter Schemes")}
                    </DialogTitle>
                  </DialogHeader>
                  <SchemeFilterSidebar
                    onCloseMobileDrawer={() => setMobileDrawerOpen(false)}
                  />
                </DialogContent>
              </Dialog>
            </div>
          </div>

          {/* Loading State */}
          {loading && schemes.length === 0 && (
            <div className="grid gap-5 md:grid-cols-2">
              {[1, 2, 3, 4].map((i) => (
                <Card key={i} className="animate-pulse h-64 border-border/60">
                  <CardContent className="h-full flex items-center justify-center text-muted-foreground text-sm">
                    {t("common.loading", "Loading schemes…")}
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          {/* Error Banner */}
          {error && schemes.length === 0 && (
            <Card className="border-destructive/50 bg-destructive/5 p-6 text-center">
              <p className="text-destructive font-medium text-sm">{error}</p>
              <Button
                variant="outline"
                size="sm"
                onClick={() => void loadSchemes()}
                className="mt-3"
              >
                {t("schemes.retry", "Retry Loading")}
              </Button>
            </Card>
          )}

          {/* Schemes Cards Grid */}
          {!loading && filteredSchemes.length > 0 && (
            <div className="grid gap-5 sm:grid-cols-1 md:grid-cols-2">
              {filteredSchemes.map((scheme) => (
                <SchemeCard key={scheme.id} scheme={scheme} />
              ))}
            </div>
          )}

          {/* Empty Zero-State */}
          {!loading && filteredSchemes.length === 0 && (
            <Card className="border-dashed border-2 border-border/80 bg-muted/20 py-12 px-6 text-center">
              <CardContent className="space-y-4 max-w-md mx-auto">
                <div className="mx-auto flex size-14 items-center justify-center rounded-full bg-muted text-muted-foreground">
                  <SearchX className="size-7" />
                </div>
                <div className="space-y-1.5">
                  <h3 className="font-display font-bold text-lg text-foreground">
                    {t("schemes.noResultsTitle", "No matching schemes found")}
                  </h3>
                  <p className="text-xs md:text-sm text-muted-foreground leading-relaxed">
                    {t(
                      "schemes.noResultsBody",
                      "We couldn't find any schemes matching your current combination of filters. Try broadening your criteria or resetting filters.",
                    )}
                  </p>
                </div>
                <Button
                  onClick={resetFilters}
                  variant="default"
                  className="min-h-[44px] gap-2 text-xs font-semibold px-5"
                >
                  <RotateCcw className="size-3.5" />
                  {t("schemes.resetFiltersCta", "Reset All Filters")}
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}
