import { useTranslation } from "react-i18next"
import {
  ArrowUpDown,
  Clock,
  Crosshair,
  Loader2,
  MapPin,
  RotateCcw,
  Search,
  Sparkles,
  TriangleAlert,
  X,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import { PARTNER_TYPE_VISUALS } from "@/lib/maps/types"
import type { PartnerSortOption } from "@/lib/maps/scoring"
import type { PartnerType, SchemeType } from "@/types"

const CATEGORIES: Array<SchemeType | "all"> = ["all", "micro", "term", "education"]
const PARTNER_TYPES: Array<PartnerType | "all"> = ["all", "SCA", "PSB", "RRB", "NBFC_MFI"]

const SORT_OPTIONS: Array<{
  id: PartnerSortOption
  labelKey: string
  icon: typeof Sparkles
}> = [
  { id: "best_match", labelKey: "partners.sort.bestMatch", icon: Sparkles },
  { id: "nearest", labelKey: "partners.sort.nearest", icon: MapPin },
  { id: "speed", labelKey: "partners.sort.speed", icon: Clock },
]

export interface PartnerMapSearchProps {
  searchQuery: string
  onSearchQueryChange: (q: string) => void
  categoryFilter: SchemeType | "all"
  onCategoryFilterChange: (cat: SchemeType | "all") => void
  partnerTypeFilter: PartnerType | "all"
  onPartnerTypeFilterChange: (type: PartnerType | "all") => void
  sortBy: PartnerSortOption
  onSortByChange: (sort: PartnerSortOption) => void
  includeFlagged: boolean
  onIncludeFlaggedChange: (include: boolean) => void
  onUseMyLocation: () => void
  isLocating: boolean
  totalCount: number
  filteredCount: number
  onResetFilters: () => void
}

export function PartnerMapSearch({
  searchQuery,
  onSearchQueryChange,
  categoryFilter,
  onCategoryFilterChange,
  partnerTypeFilter,
  onPartnerTypeFilterChange,
  sortBy,
  onSortByChange,
  includeFlagged,
  onIncludeFlaggedChange,
  onUseMyLocation,
  isLocating,
  totalCount,
  filteredCount,
  onResetFilters,
}: PartnerMapSearchProps) {
  const { t } = useTranslation()

  const hasActiveFilters =
    searchQuery.trim().length > 0 ||
    categoryFilter !== "all" ||
    partnerTypeFilter !== "all" ||
    sortBy !== "best_match" ||
    includeFlagged

  return (
    <div className="space-y-4 rounded-xl border border-border/80 bg-card p-4 md:p-5 shadow-xs">
      {/* Search Input and Geolocation Trigger */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-muted-foreground pointer-events-none" />
          <Input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchQueryChange(e.target.value)}
            placeholder={t("partners.searchPlaceholder")}
            aria-label={t("partners.searchPlaceholder")}
            className="pl-9 pr-9 h-11 text-sm bg-background/80"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => onSearchQueryChange("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground p-1 transition-colors"
              aria-label="Clear search query"
            >
              <X className="size-4" />
            </button>
          )}
        </div>

        <Button
          type="button"
          variant="outline"
          onClick={onUseMyLocation}
          disabled={isLocating}
          className="h-11 px-4 min-w-[44px] min-h-[44px] shrink-0 font-medium transition-all"
        >
          {isLocating ? (
            <Loader2 className="mr-2 size-4 animate-spin text-primary" />
          ) : (
            <Crosshair className="mr-2 size-4 text-primary" />
          )}
          {isLocating ? t("partners.locating") : t("partners.useMyLocation")}
        </Button>
      </div>

      {/* Sort Options Selector */}
      <div className="flex flex-wrap items-center gap-2 pt-1 border-t border-border/40">
        <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mr-1 flex items-center gap-1">
          <ArrowUpDown className="size-3.5" />
          {t("partners.sort.label", "Sort By")}:
        </span>
        <div className="flex flex-wrap items-center gap-1.5">
          {SORT_OPTIONS.map((opt) => {
            const isSelected = sortBy === opt.id
            const Icon = opt.icon
            return (
              <button
                key={opt.id}
                type="button"
                onClick={() => onSortByChange(opt.id)}
                aria-pressed={isSelected}
                className={`rounded-full border px-3 py-1 text-xs font-medium min-h-[32px] inline-flex items-center gap-1.5 transition-all cursor-pointer ${
                  isSelected
                    ? "border-primary bg-primary text-primary-foreground font-semibold shadow-xs"
                    : "border-border/80 bg-background text-muted-foreground hover:bg-secondary/60 hover:text-foreground"
                }`}
              >
                <Icon className="size-3.5" />
                <span>{t(opt.labelKey)}</span>
              </button>
            )
          })}
        </div>
      </div>

      {/* Scheme Category Filter Chips */}
      <div className="flex flex-wrap items-center gap-1.5 pt-1">
        <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mr-1.5">
          {t("partners.categoryLabel")}:
        </span>
        {CATEGORIES.map((cat) => {
          const isSelected = categoryFilter === cat
          return (
            <button
              key={cat}
              type="button"
              onClick={() => onCategoryFilterChange(cat)}
              aria-pressed={isSelected}
              className={`rounded-full border px-3.5 py-1.5 text-xs font-medium min-h-[36px] transition-all cursor-pointer ${
                isSelected
                  ? "border-primary bg-primary text-primary-foreground shadow-xs"
                  : "border-border/80 bg-secondary/50 text-secondary-foreground hover:bg-secondary"
              }`}
            >
              {cat === "all"
                ? t("partners.filterAll")
                : t(`partners.filter${cat[0].toUpperCase()}${cat.slice(1)}`)}
            </button>
          )
        })}
      </div>

      {/* Partner Type Filter Chips */}
      <div className="flex flex-wrap items-center gap-1.5">
        <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mr-1.5">
          {t("partners.typeLabel")}:
        </span>
        {PARTNER_TYPES.map((type) => {
          const isSelected = partnerTypeFilter === type
          const visual = type !== "all" ? PARTNER_TYPE_VISUALS[type] : null

          return (
            <button
              key={type}
              type="button"
              onClick={() => onPartnerTypeFilterChange(type)}
              aria-pressed={isSelected}
              className={`rounded-full border px-3 py-1 text-xs font-medium min-h-[32px] inline-flex items-center gap-1.5 transition-all cursor-pointer ${
                isSelected
                  ? "border-foreground bg-foreground text-background font-semibold shadow-xs"
                  : "border-border/70 bg-background text-muted-foreground hover:bg-secondary/60 hover:text-foreground"
              }`}
            >
              {visual && (
                <span
                  className="size-2 rounded-full shrink-0"
                  style={{ backgroundColor: visual.color }}
                />
              )}
              {type === "all" ? t("partners.filterAllTypes") : visual?.shortLabel || type}
            </button>
          )
        })}
      </div>

      {/* Footer controls: High-NPA Checkbox, Count, Reset */}
      <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-border/60">
        <label className="flex items-center gap-2 cursor-pointer text-xs sm:text-sm text-muted-foreground select-none hover:text-foreground transition-colors min-h-[44px]">
          <Checkbox
            checked={includeFlagged}
            onCheckedChange={(v) => onIncludeFlaggedChange(v === true)}
            className="size-4"
          />
          <span className="inline-flex items-center gap-1">
            <TriangleAlert className="size-3.5 text-amber-500" />
            {t("partners.includeFlagged")}
          </span>
        </label>

        <div className="flex items-center gap-3 ml-auto">
          <span className="text-xs font-medium text-muted-foreground">
            {t("partners.resultsCount", { count: filteredCount, total: totalCount })}
          </span>

          {hasActiveFilters && (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={onResetFilters}
              className="h-8 px-2.5 text-xs text-muted-foreground hover:text-destructive gap-1"
            >
              <RotateCcw className="size-3.5" />
              {t("partners.resetFilters")}
            </Button>
          )}
        </div>
      </div>
    </div>
  )
}
