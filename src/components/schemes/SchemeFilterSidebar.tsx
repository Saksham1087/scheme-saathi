import { useTranslation } from "react-i18next"
import {
  RotateCcw,
  SlidersHorizontal,
  Layers,
  MapPin,
  IndianRupee,
  Coins,
  Briefcase,
  GraduationCap,
  ArrowUpDown,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { useSchemeStore } from "@/stores/useSchemeStore"
import { STATES } from "@/lib/states"
import { fmtINR } from "@/lib/format"
import type { EducationStatus, SchemeCategory, SchemeSortOption } from "@/types"

const CATEGORIES: Array<{ id: SchemeCategory; labelKey: string }> = [
  { id: "business", labelKey: "categories.business" },
  { id: "micro", labelKey: "categories.micro" },
  { id: "education", labelKey: "categories.education" },
  { id: "women", labelKey: "categories.women" },
  { id: "agriculture", labelKey: "categories.agriculture" },
  { id: "sanitation", labelKey: "categories.sanitation" },
  { id: "skills", labelKey: "categories.skills" },
]

const PURPOSES = [
  "Shop / Retail",
  "Manufacturing",
  "Services",
  "Agri-business",
  "Women Entrepreneurship",
  "Higher Education",
  "Sanitation Equipment",
  "Solar Energy",
  "Skill Development",
  "Tailoring",
  "Artisan",
]

const EDUCATION_OPTIONS: Array<{ id: EducationStatus | "all"; labelKey: string }> = [
  { id: "all", labelKey: "filters.eduAll" },
  { id: "student", labelKey: "educationStatuses.student" },
  { id: "below_twelfth", labelKey: "educationStatuses.below_twelfth" },
  { id: "twelfth", labelKey: "educationStatuses.twelfth" },
  { id: "graduate", labelKey: "educationStatuses.graduate" },
  { id: "postgraduate", labelKey: "educationStatuses.postgraduate" },
]

const SORT_OPTIONS: Array<{ id: SchemeSortOption; labelKey: string }> = [
  { id: "name_asc", labelKey: "filters.sortNameAsc" },
  { id: "max_amount_desc", labelKey: "filters.sortAmountDesc" },
  { id: "max_amount_asc", labelKey: "filters.sortAmountAsc" },
  { id: "rate_asc", labelKey: "filters.sortRateAsc" },
  { id: "income_ceiling_asc", labelKey: "filters.sortIncomeAsc" },
]

interface SchemeFilterSidebarProps {
  onCloseMobileDrawer?: () => void
}

export function SchemeFilterSidebar({ onCloseMobileDrawer }: SchemeFilterSidebarProps) {
  const { t } = useTranslation()
  const {
    selectedCategories,
    toggleCategory,
    selectedState,
    setSelectedState,
    maxIncome,
    setMaxIncome,
    amountRange,
    setAmountRange,
    selectedPurposes,
    togglePurpose,
    selectedEducation,
    setSelectedEducation,
    sortBy,
    setSortBy,
    resetFilters,
    getActiveFilterCount,
  } = useSchemeStore()

  const activeCount = getActiveFilterCount()

  return (
    <div className="space-y-6 pb-6">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-border/80 pb-3">
        <div className="flex items-center gap-2">
          <SlidersHorizontal className="size-4.5 text-primary" />
          <h2 className="font-display font-bold text-base text-foreground">
            {t("filters.title", "Filter Schemes")}
          </h2>
          {activeCount > 0 && (
            <span className="rounded-full bg-primary/15 text-primary px-2 py-0.5 text-xs font-semibold">
              {activeCount}
            </span>
          )}
        </div>
        {activeCount > 0 && (
          <Button
            variant="ghost"
            size="sm"
            onClick={resetFilters}
            className="h-8 text-xs text-muted-foreground hover:text-destructive gap-1 px-2"
          >
            <RotateCcw className="size-3" />
            {t("filters.resetAll", "Reset")}
          </Button>
        )}
      </div>

      {/* 1. Sorting */}
      <div className="space-y-2">
        <Label className="text-xs font-semibold text-foreground flex items-center gap-1.5">
          <ArrowUpDown className="size-3.5 text-muted-foreground" />
          {t("filters.sortBy", "Sort Order")}
        </Label>
        <Select
          value={sortBy}
          onValueChange={(val) => setSortBy(val as SchemeSortOption)}
        >
          <SelectTrigger className="w-full h-9 text-xs">
            <SelectValue placeholder={t("filters.sortBy", "Sort schemes")} />
          </SelectTrigger>
          <SelectContent>
            {SORT_OPTIONS.map((opt) => (
              <SelectItem key={opt.id} value={opt.id} className="text-xs">
                {t(opt.labelKey, opt.id)}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* 2. Category Filter */}
      <div className="space-y-3">
        <Label className="text-xs font-semibold text-foreground flex items-center gap-1.5">
          <Layers className="size-3.5 text-muted-foreground" />
          {t("filters.category", "Scheme Category")}
        </Label>
        <div className="space-y-2">
          {CATEGORIES.map((cat) => {
            const isChecked = selectedCategories.includes(cat.id)
            return (
              <label
                key={cat.id}
                className="flex items-center gap-2.5 text-xs cursor-pointer hover:text-foreground text-foreground/85 min-h-[28px]"
              >
                <Checkbox
                  checked={isChecked}
                  onCheckedChange={() => toggleCategory(cat.id)}
                />
                <span>{t(cat.labelKey, cat.id)}</span>
              </label>
            )
          })}
        </div>
      </div>

      {/* 3. State Filter */}
      <div className="space-y-2">
        <Label className="text-xs font-semibold text-foreground flex items-center gap-1.5">
          <MapPin className="size-3.5 text-muted-foreground" />
          {t("filters.state", "State / UT")}
        </Label>
        <Select
          value={selectedState || "all"}
          onValueChange={(val) => setSelectedState(val === "all" ? null : val)}
        >
          <SelectTrigger className="w-full h-9 text-xs">
            <SelectValue placeholder={t("filters.allStates", "All India / Any State")} />
          </SelectTrigger>
          <SelectContent className="max-h-60">
            <SelectItem value="all" className="text-xs">
              {t("filters.allStates", "All India (National & State)")}
            </SelectItem>
            {STATES.map((st) => (
              <SelectItem key={st} value={st} className="text-xs">
                {st}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* 4. Assistance Amount Filter */}
      <div className="space-y-2.5">
        <div className="flex items-center justify-between">
          <Label className="text-xs font-semibold text-foreground flex items-center gap-1.5">
            <Coins className="size-3.5 text-muted-foreground" />
            {t("filters.maxAssistance", "Max Assistance Needed")}
          </Label>
          <span className="text-xs font-bold text-primary tabular-nums">
            {amountRange[1] >= 5000000
              ? t("filters.anyAmount", "Up to ₹50L+")
              : fmtINR(amountRange[1])}
          </span>
        </div>
        <Slider
          value={[amountRange[1]]}
          min={100000}
          max={5000000}
          step={50000}
          onValueChange={(vals) => setAmountRange([amountRange[0], vals[0]])}
        />
        <div className="flex justify-between text-[10px] text-muted-foreground">
          <span>₹1.0 Lakh</span>
          <span>₹25 Lakh</span>
          <span>₹50 Lakh+</span>
        </div>
        {/* Preset quick buttons */}
        <div className="flex flex-wrap gap-1 pt-1">
          {[
            { label: "₹1.4L", val: 140000 },
            { label: "₹15L", val: 1500000 },
            { label: "₹30L", val: 3000000 },
            { label: "₹50L", val: 5000000 },
          ].map((preset) => (
            <button
              key={preset.val}
              onClick={() => setAmountRange([0, preset.val])}
              className={`px-2 py-0.5 rounded text-[11px] font-medium border transition-colors ${
                amountRange[1] === preset.val
                  ? "border-primary bg-primary/10 text-primary"
                  : "border-border text-muted-foreground hover:bg-muted"
              }`}
            >
              {preset.label}
            </button>
          ))}
        </div>
      </div>

      {/* 5. Annual Family Income Ceiling */}
      <div className="space-y-2.5">
        <div className="flex items-center justify-between">
          <Label className="text-xs font-semibold text-foreground flex items-center gap-1.5">
            <IndianRupee className="size-3.5 text-muted-foreground" />
            {t("filters.incomeLimit", "Annual Family Income")}
          </Label>
          <span className="text-xs font-bold text-foreground tabular-nums">
            {maxIncome ? fmtINR(maxIncome) : t("filters.incomeAny", "Up to ₹5.0L")}
          </span>
        </div>
        <Slider
          value={[maxIncome || 500000]}
          min={50000}
          max={500000}
          step={25000}
          onValueChange={(vals) => setMaxIncome(vals[0])}
        />
        <div className="flex justify-between text-[10px] text-muted-foreground">
          <span>₹50,000</span>
          <span>₹2.5 Lakh</span>
          <span>₹5.0 Lakh</span>
        </div>
      </div>

      {/* 6. Education Qualification */}
      <div className="space-y-2">
        <Label className="text-xs font-semibold text-foreground flex items-center gap-1.5">
          <GraduationCap className="size-3.5 text-muted-foreground" />
          {t("filters.education", "Education Qualification")}
        </Label>
        <Select
          value={selectedEducation || "all"}
          onValueChange={(val) =>
            setSelectedEducation(val as EducationStatus | "all")
          }
        >
          <SelectTrigger className="w-full h-9 text-xs">
            <SelectValue placeholder={t("filters.eduAll", "All Education Levels")} />
          </SelectTrigger>
          <SelectContent>
            {EDUCATION_OPTIONS.map((opt) => (
              <SelectItem key={opt.id} value={opt.id} className="text-xs">
                {t(opt.labelKey, opt.id)}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* 7. Purpose Tags */}
      <div className="space-y-2.5">
        <Label className="text-xs font-semibold text-foreground flex items-center gap-1.5">
          <Briefcase className="size-3.5 text-muted-foreground" />
          {t("filters.purpose", "Project / Business Purpose")}
        </Label>
        <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
          {PURPOSES.map((purpose) => {
            const isChecked = selectedPurposes.includes(purpose)
            return (
              <label
                key={purpose}
                className="flex items-center gap-2 text-xs cursor-pointer hover:text-foreground text-foreground/85 min-h-[26px]"
              >
                <Checkbox
                  checked={isChecked}
                  onCheckedChange={() => togglePurpose(purpose)}
                />
                <span className="truncate">{purpose}</span>
              </label>
            )
          })}
        </div>
      </div>

      {/* Mobile Drawer Close Button */}
      {onCloseMobileDrawer && (
        <div className="pt-4 border-t border-border">
          <Button
            className="w-full min-h-[44px]"
            onClick={onCloseMobileDrawer}
          >
            {t("filters.applyFilters", "Show Results")}
          </Button>
        </div>
      )}
    </div>
  )
}
