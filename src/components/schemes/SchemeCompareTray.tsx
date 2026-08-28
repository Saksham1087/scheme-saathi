import { useEffect } from "react"
import { Link, useLocation } from "react-router-dom"
import { useTranslation } from "react-i18next"
import { ArrowRight, Trash2, X, Layers } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useCompareStore, MAX_COMPARE_SCHEMES } from "@/stores/useCompareStore"
import { useSchemeStore } from "@/stores/useSchemeStore"
import { getSeedSchemes } from "@/services/schemeService"
import type { Scheme } from "@/types"

export function SchemeCompareTray() {
  const { t, i18n } = useTranslation()
  const location = useLocation()
  const lang = (i18n.language === "hi" ? "hi" : "en") as "en" | "hi"

  const { selectedSchemeIds, removeScheme, clearAll } = useCompareStore()
  const { schemes, loadSchemes } = useSchemeStore()

  useEffect(() => {
    if (schemes.length === 0) {
      loadSchemes()
    }
  }, [schemes.length, loadSchemes])

  const allSchemes = schemes.length > 0 ? schemes : getSeedSchemes()

  // Hide comparison tray on /compare page to prevent UI clash with comparison matrix
  if (selectedSchemeIds.length === 0 || location.pathname === "/compare") {
    return null
  }

  // Resolve selected scheme objects
  const selectedSchemes = selectedSchemeIds
    .map((id) => allSchemes.find((s) => s.id === id) || getSeedSchemes().find((s) => s.id === id))
    .filter((s): s is Scheme => Boolean(s))

  const count = selectedSchemes.length
  const canCompare = count >= 2

  return (
    <aside
      aria-label={t("compare.trayAriaLabel", "Scheme comparison tray")}
      className="fixed bottom-4 left-1/2 -translate-x-1/2 z-50 w-full max-w-4xl px-3 animate-in fade-in-0 slide-in-from-bottom-6 duration-300 pointer-events-none"
    >
      <div className="pointer-events-auto rounded-2xl border-2 border-primary/20 bg-background/95 p-3 sm:p-4 shadow-2xl backdrop-blur-md dark:bg-card/95">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          {/* Header & Badges */}
          <div className="flex items-center justify-between sm:justify-start gap-2.5">
            <div className="flex items-center gap-2">
              <div className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <Layers className="size-4.5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-display text-sm font-bold text-foreground">
                    {t("compare.trayTitle", "Compare Schemes")}
                  </span>
                  <Badge variant="secondary" className="px-2 py-0.5 text-xs font-semibold">
                    {count}/{MAX_COMPARE_SCHEMES}
                  </Badge>
                </div>
                <p className="text-[11px] text-muted-foreground hidden sm:block">
                  {canCompare
                    ? t("compare.trayReady", "Ready to compare side-by-side")
                    : t("compare.traySelectOneMore", "Select at least 1 more scheme to compare")}
                </p>
              </div>
            </div>

            {/* Clear All Mobile Button */}
            <Button
              variant="ghost"
              size="sm"
              onClick={clearAll}
              className="sm:hidden text-xs text-muted-foreground hover:text-destructive h-8 px-2"
              title={t("compare.clearAll", "Clear all")}
            >
              <Trash2 className="size-3.5" />
            </Button>
          </div>

          {/* Selected Scheme Chips */}
          <div className="flex items-center gap-2 overflow-x-auto py-1 sm:py-0 max-w-full sm:max-w-[45%]">
            {selectedSchemes.map((scheme) => {
              const name = scheme.name?.[lang] || scheme.name?.en || scheme.id
              return (
                <div
                  key={scheme.id}
                  className="group flex shrink-0 items-center gap-1.5 rounded-lg border border-border/80 bg-muted/50 px-2.5 py-1.5 text-xs font-medium transition-colors hover:bg-muted"
                >
                  <span className="max-w-[110px] sm:max-w-[130px] truncate text-foreground text-xs">
                    {name}
                  </span>
                  <button
                    type="button"
                    onClick={() => removeScheme(scheme.id)}
                    className="flex size-5 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive focus-visible:outline-ring"
                    aria-label={t("compare.removeScheme", "Remove {{name}} from comparison", {
                      name,
                    })}
                  >
                    <X className="size-3" />
                  </button>
                </div>
              )
            })}
          </div>

          {/* Action CTAs */}
          <div className="flex items-center justify-end gap-2 shrink-0">
            <Button
              variant="ghost"
              size="sm"
              onClick={clearAll}
              className="hidden sm:inline-flex text-xs font-medium text-muted-foreground hover:text-destructive h-9 px-2.5"
            >
              <Trash2 className="size-3.5 mr-1" />
              {t("compare.clearAll", "Clear all")}
            </Button>

            <Button
              asChild={canCompare}
              disabled={!canCompare}
              size="sm"
              className="min-h-[44px] sm:min-h-[38px] flex-1 sm:flex-initial text-xs sm:text-sm font-semibold px-4 shadow-sm"
            >
              {canCompare ? (
                <Link to={`/compare?schemes=${selectedSchemeIds.join(",")}`}>
                  {t("compare.compareNow", "Compare Now ({{count}})", { count })}
                  <ArrowRight className="size-4 ml-1.5" />
                </Link>
              ) : (
                <span>
                  {t("compare.selectAtLeastTwo", "Select 2+ to Compare")}
                </span>
              )}
            </Button>
          </div>
        </div>
      </div>
    </aside>
  )
}
