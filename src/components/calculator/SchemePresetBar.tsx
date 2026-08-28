import { useTranslation } from "react-i18next"
import { Badge } from "@/components/ui/badge"
import { Sparkles, Building2, Landmark, GraduationCap, Users } from "lucide-react"
import { fmtINR } from "@/lib/format"
import { SCHEME_PRESETS } from "@/lib/calculatorPresets"
import type { SchemePreset } from "@/types/calculator"

interface SchemePresetBarProps {
  activePresetId: string | null
  onSelectPreset: (preset: SchemePreset) => void
}

export function SchemePresetBar({
  activePresetId,
  onSelectPreset,
}: SchemePresetBarProps) {
  const { t, i18n } = useTranslation()
  const isHindi = i18n.language?.startsWith("hi")

  const getPresetIcon = (category: SchemePreset["category"]) => {
    switch (category) {
      case "micro":
        return <Users className="size-3.5" />
      case "women":
        return <Sparkles className="size-3.5 text-pink-500" />
      case "term":
        return <Landmark className="size-3.5 text-blue-500" />
      case "education":
        return <GraduationCap className="size-3.5 text-amber-500" />
      case "commercial":
        return <Building2 className="size-3.5 text-muted-foreground" />
      default:
        return <Landmark className="size-3.5" />
    }
  }

  return (
    <div className="space-y-2.5">
      <div className="flex items-center justify-between">
        <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-1.5">
          <Sparkles className="size-3.5 text-primary" />
          {t("calculator.presetHeading", "Popular Scheme Presets")}
        </label>
        <span className="text-[11px] text-muted-foreground hidden sm:inline">
          {t("calculator.presetHint", "Click any scheme to load its statutory terms")}
        </span>
      </div>

      <div
        className="flex gap-2 overflow-x-auto pb-1 pt-0.5 no-scrollbar scroll-smooth"
        role="group"
        aria-label={t("calculator.presetHeading", "Popular Scheme Presets")}
      >
        {SCHEME_PRESETS.map((preset) => {
          const isSelected = activePresetId === preset.id
          const displayName =
            t(preset.nameKey, isHindi ? preset.defaultName.hi : preset.defaultName.en)

          return (
            <button
              key={preset.id}
              type="button"
              onClick={() => onSelectPreset(preset)}
              aria-pressed={isSelected}
              className={`group flex items-center gap-2.5 rounded-lg border px-3 py-2 text-left transition-all duration-150 shrink-0 min-h-[44px] cursor-pointer ${
                isSelected
                  ? "border-primary bg-primary/10 text-primary shadow-xs ring-1 ring-primary/40 font-semibold"
                  : "border-border/80 bg-card hover:bg-muted/60 text-foreground hover:border-border"
              }`}
            >
              <div
                className={`flex size-7 items-center justify-center rounded-md transition-colors ${
                  isSelected
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted text-muted-foreground group-hover:text-foreground"
                }`}
              >
                {getPresetIcon(preset.category)}
              </div>

              <div className="flex flex-col">
                <div className="flex items-center gap-1.5">
                  <span className="text-xs font-medium leading-tight">
                    {displayName}
                  </span>
                  <Badge
                    variant={isSelected ? "default" : "secondary"}
                    className="text-[10px] px-1.5 py-0 h-4 font-semibold"
                  >
                    {preset.badge}
                  </Badge>
                </div>
                <span className="text-[11px] text-muted-foreground">
                  {fmtINR(preset.principal)} · {preset.tenureMonths} {t("calculator.monthsShort", "mo")}
                </span>
              </div>
            </button>
          )
        })}
      </div>
    </div>
  )
}
