import { useTranslation } from "react-i18next"
import { X, SlidersHorizontal } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

export interface FilterState {
  category: string
  minAmount: string
  maxAmount: string
}

interface SchemeFilterProps {
  filters: FilterState
  onChange: (filters: FilterState) => void
  resultCount: number
}

const categoryKeys = [
  { value: "all", label: "schemes.categories.all" },
  { value: "business", label: "schemes.categories.business" },
  { value: "education", label: "schemes.categories.education" },
  { value: "agriculture", label: "schemes.categories.agriculture" },
  { value: "transport", label: "schemes.categories.transport" },
  { value: "housing", label: "schemes.categories.housing" },
  { value: "health", label: "schemes.categories.health" },
  { value: "social-welfare", label: "schemes.categories.socialWelfare" },
  { value: "employment", label: "schemes.categories.employment" },
]

const amountRanges = [
  { value: "", label: "schemes.filter.anyAmount" },
  { value: "0-100000", label: "schemes.filter.upTo1L" },
  { value: "100000-500000", label: "schemes.filter.1to5L" },
  { value: "500000-1000000", label: "schemes.filter.5to10L" },
  { value: "1000000-10000000", label: "schemes.filter.10Lto1Cr" },
  { value: "10000000-999999999", label: "schemes.filter.above1Cr" },
]

function parseAmountRange(value: string): { min?: number; max?: number } {
  if (!value) return {}
  const [min, max] = value.split("-").map(Number)
  return { min, max }
}

export function SchemeFilter({ filters, onChange, resultCount }: SchemeFilterProps) {
  const { t } = useTranslation()

  const hasActiveFilters =
    filters.category !== "all" || filters.minAmount || filters.maxAmount

  const activeAmount = filters.minAmount || filters.maxAmount
    ? `${filters.minAmount || "0"}-${filters.maxAmount || "999999999"}`
    : ""

  function handleAmountChange(value: string) {
    const { min, max } = parseAmountRange(value)
    onChange({ ...filters, minAmount: min?.toString() || "", maxAmount: max?.toString() || "" })
  }

  function clearAll() {
    onChange({ category: "all", minAmount: "", maxAmount: "" })
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <SlidersHorizontal className="size-4 text-muted-foreground" />
          <span className="text-sm font-medium">
            {t("schemes.filter.title")}
          </span>
          <Badge variant="secondary" className="text-xs">
            {resultCount} {t("schemes.filter.results")}
          </Badge>
        </div>
        {hasActiveFilters && (
          <Button variant="ghost" size="sm" onClick={clearAll} className="h-7 text-xs">
            <X className="size-3 mr-1" />
            {t("schemes.filter.clearAll")}
          </Button>
        )}
      </div>
      <div className="flex flex-wrap gap-3">
        <Select
          value={filters.category}
          onValueChange={(v) => onChange({ ...filters, category: v })}
        >
          <SelectTrigger className="w-[160px]">
            <SelectValue placeholder={t("schemes.filter.category")} />
          </SelectTrigger>
          <SelectContent>
            {categoryKeys.map((cat) => (
              <SelectItem key={cat.value} value={cat.value}>
                {t(cat.label)}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={activeAmount} onValueChange={handleAmountChange}>
          <SelectTrigger className="w-[160px]">
            <SelectValue placeholder={t("schemes.filter.loanAmount")} />
          </SelectTrigger>
          <SelectContent>
            {amountRanges.map((range) => (
              <SelectItem key={range.value} value={range.value}>
                {t(range.label)}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  )
}
