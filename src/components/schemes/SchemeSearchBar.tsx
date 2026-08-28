import { useTranslation } from "react-i18next"
import { Search, X, RotateCcw } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useSchemeStore, DEFAULT_AMOUNT_RANGE } from "@/stores/useSchemeStore"
import { fmtINR } from "@/lib/format"

const QUICK_CATEGORIES = [
  { id: "all", labelKey: "schemes.allCategories" },
  { id: "business", labelKey: "categories.business" },
  { id: "micro", labelKey: "categories.micro" },
  { id: "education", labelKey: "categories.education" },
  { id: "women", labelKey: "categories.women" },
  { id: "agriculture", labelKey: "categories.agriculture" },
  { id: "sanitation", labelKey: "categories.sanitation" },
  { id: "skills", labelKey: "categories.skills" },
]

export function SchemeSearchBar() {
  const { t } = useTranslation()
  const {
    searchQuery,
    setSearchQuery,
    selectedCategories,
    toggleCategory,
    setSelectedCategories,
    selectedState,
    maxIncome,
    amountRange,
    selectedPurposes,
    selectedEducation,
    resetFilters,
    removeFilter,
    getActiveFilterCount,
  } = useSchemeStore()

  const activeCount = getActiveFilterCount()
  const hasActiveAmount =
    amountRange[0] > 0 || amountRange[1] < DEFAULT_AMOUNT_RANGE[1]

  return (
    <div className="space-y-4">
      {/* Search Input Bar */}
      <div className="relative flex items-center w-full">
        <Search className="absolute left-3.5 size-4.5 text-muted-foreground pointer-events-none" />
        <Input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder={t("schemes.searchPlaceholder", "Search schemes by name, keyword, business type, or ministry…")}
          className="pl-10 pr-10 h-12 text-sm md:text-base rounded-xl border-border bg-card shadow-xs focus-visible:ring-2 focus-visible:ring-primary"
          aria-label={t("schemes.searchLabel", "Search schemes")}
        />
        {searchQuery && (
          <button
            onClick={() => setSearchQuery("")}
            className="absolute right-3 p-1 rounded-full text-muted-foreground hover:text-foreground hover:bg-muted focus-visible:outline-ring"
            aria-label={t("common.clear", "Clear search")}
          >
            <X className="size-4" />
          </button>
        )}
      </div>

      {/* Quick Category Pills */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none no-scrollbar">
        {QUICK_CATEGORIES.map((cat) => {
          const isAll = cat.id === "all"
          const isSelected = isAll
            ? selectedCategories.length === 0
            : selectedCategories.includes(cat.id)

          return (
            <button
              key={cat.id}
              onClick={() => {
                if (isAll) {
                  setSelectedCategories([])
                } else {
                  toggleCategory(cat.id)
                }
              }}
              aria-pressed={isSelected}
              className={`whitespace-nowrap rounded-full px-3.5 py-1.5 text-xs font-semibold transition-colors min-h-[36px] flex items-center ${
                isSelected
                  ? "bg-primary text-primary-foreground shadow-xs"
                  : "bg-secondary text-secondary-foreground hover:bg-secondary/80 border border-border/60"
              }`}
            >
              {t(cat.labelKey, cat.id)}
            </button>
          )
        })}
      </div>

      {/* Active Filter Tags */}
      {activeCount > 0 && (
        <div className="flex flex-wrap items-center gap-2 pt-1">
          <span className="text-xs font-medium text-muted-foreground mr-1">
            {t("schemes.activeFilters", "Active Filters:")}
          </span>

          {/* Search Query Pill */}
          {searchQuery && (
            <Badge
              variant="outline"
              className="gap-1.5 pl-2.5 pr-1.5 py-1 text-xs bg-muted/50 border-primary/40 text-foreground"
            >
              <span>
                "{searchQuery}"
              </span>
              <button
                onClick={() => removeFilter("search")}
                className="rounded-full hover:bg-muted p-0.5"
                aria-label="Remove search filter"
              >
                <X className="size-3" />
              </button>
            </Badge>
          )}

          {/* Category Pills */}
          {selectedCategories.map((cat) => (
            <Badge
              key={cat}
              variant="outline"
              className="gap-1.5 pl-2.5 pr-1.5 py-1 text-xs bg-primary/10 border-primary/30 text-primary capitalize font-medium"
            >
              <span>{t(`categories.${cat}`, cat)}</span>
              <button
                onClick={() => removeFilter("category", cat)}
                className="rounded-full hover:bg-primary/20 p-0.5"
                aria-label={`Remove ${cat} category filter`}
              >
                <X className="size-3" />
              </button>
            </Badge>
          ))}

          {/* State Pill */}
          {selectedState && selectedState !== "all" && (
            <Badge
              variant="outline"
              className="gap-1.5 pl-2.5 pr-1.5 py-1 text-xs bg-muted/50 border-border"
            >
              <span>{t("filters.state", "State")}: {selectedState}</span>
              <button
                onClick={() => removeFilter("state")}
                className="rounded-full hover:bg-muted p-0.5"
                aria-label="Remove state filter"
              >
                <X className="size-3" />
              </button>
            </Badge>
          )}

          {/* Income Pill */}
          {maxIncome !== null && maxIncome > 0 && (
            <Badge
              variant="outline"
              className="gap-1.5 pl-2.5 pr-1.5 py-1 text-xs bg-muted/50 border-border"
            >
              <span>{t("filters.incomeLimit", "Income")}: {fmtINR(maxIncome)}</span>
              <button
                onClick={() => removeFilter("income")}
                className="rounded-full hover:bg-muted p-0.5"
                aria-label="Remove income filter"
              >
                <X className="size-3" />
              </button>
            </Badge>
          )}

          {/* Amount Pill */}
          {hasActiveAmount && (
            <Badge
              variant="outline"
              className="gap-1.5 pl-2.5 pr-1.5 py-1 text-xs bg-muted/50 border-border"
            >
              <span>
                {t("filters.amount", "Amount")}: {fmtINR(amountRange[0])} – {fmtINR(amountRange[1])}
              </span>
              <button
                onClick={() => removeFilter("amount")}
                className="rounded-full hover:bg-muted p-0.5"
                aria-label="Remove amount range filter"
              >
                <X className="size-3" />
              </button>
            </Badge>
          )}

          {/* Purpose Pills */}
          {selectedPurposes.map((p) => (
            <Badge
              key={p}
              variant="outline"
              className="gap-1.5 pl-2.5 pr-1.5 py-1 text-xs bg-muted/50 border-border"
            >
              <span>{p}</span>
              <button
                onClick={() => removeFilter("purpose", p)}
                className="rounded-full hover:bg-muted p-0.5"
                aria-label={`Remove purpose ${p}`}
              >
                <X className="size-3" />
              </button>
            </Badge>
          ))}

          {/* Education Pill */}
          {selectedEducation && selectedEducation !== "all" && (
            <Badge
              variant="outline"
              className="gap-1.5 pl-2.5 pr-1.5 py-1 text-xs bg-muted/50 border-border"
            >
              <span>
                {t(`educationStatuses.${selectedEducation}`, selectedEducation)}
              </span>
              <button
                onClick={() => removeFilter("education")}
                className="rounded-full hover:bg-muted p-0.5"
                aria-label="Remove education filter"
              >
                <X className="size-3" />
              </button>
            </Badge>
          )}

          {/* Clear All Action */}
          <Button
            variant="ghost"
            size="sm"
            onClick={resetFilters}
            className="h-7 px-2 text-xs text-muted-foreground hover:text-destructive gap-1"
          >
            <RotateCcw className="size-3" />
            {t("schemes.clearAll", "Clear all")}
          </Button>
        </div>
      )}
    </div>
  )
}
