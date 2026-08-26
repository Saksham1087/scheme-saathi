import { Link } from "react-router-dom"
import { useTranslation } from "react-i18next"
import { X, GitCompareArrows } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useComparisonStore } from "@/stores/comparisonStore"

export function ComparisonBar() {
  const { t, i18n } = useTranslation()
  const { selected, remove } = useComparisonStore()
  const lang = i18n.language as "en" | "hi" | "mr"

  if (selected.length === 0) return null

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 border-t border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80 shadow-lg">
      <div className="mx-auto max-w-6xl px-4 py-3 flex items-center gap-3">
        <div className="flex items-center gap-2 overflow-x-auto flex-1">
          {selected.map((scheme) => {
            const name = (scheme.name as Record<string, string>)[lang] || scheme.name.en
            return (
              <span
                key={scheme.slug}
                className="inline-flex items-center gap-1.5 rounded-full border border-border bg-secondary px-3 py-1 text-xs font-medium whitespace-nowrap"
              >
                {name.length > 20 ? name.slice(0, 20) + "…" : name}
                <button
                  onClick={() => remove(scheme.slug)}
                  className="rounded-full hover:bg-muted p-0.5"
                  aria-label={t("comparison.remove", { name })}
                >
                  <X className="size-3" />
                </button>
              </span>
            )
          })}
        </div>
        <Button size="sm" asChild disabled={selected.length < 2}>
          <Link to="/compare">
            <GitCompareArrows className="mr-1.5 size-4" />
            {t("comparison.compareCount", { count: selected.length, max: 4 })}
          </Link>
        </Button>
      </div>
    </div>
  )
}
