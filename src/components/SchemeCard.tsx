import { Link } from "react-router-dom"
import { useTranslation } from "react-i18next"
import { ArrowRight, GitCompareArrows } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import type { LocalScheme } from "@/data"
import { useComparisonStore } from "@/stores/comparisonStore"

interface SchemeCardProps {
  scheme: LocalScheme
  matchScore?: number
  showCompare?: boolean
}

function formatAmount(amount: number): string {
  if (amount >= 10000000) return `₹${(amount / 10000000).toFixed(1)} Cr`
  if (amount >= 100000) return `₹${(amount / 100000).toFixed(1)} L`
  return `₹${amount.toLocaleString("en-IN")}`
}

const categoryColors: Record<string, string> = {
  business: "bg-blue-100 text-blue-800",
  education: "bg-purple-100 text-purple-800",
  agriculture: "bg-green-100 text-green-800",
  transport: "bg-orange-100 text-orange-800",
  housing: "bg-yellow-100 text-yellow-800",
  health: "bg-red-100 text-red-800",
  "social-welfare": "bg-pink-100 text-pink-800",
  employment: "bg-teal-100 text-teal-800",
  other: "bg-gray-100 text-gray-800",
}

export function SchemeCard({ scheme, matchScore, showCompare = false }: SchemeCardProps) {
  const { t, i18n } = useTranslation()
  const lang = i18n.language as "en" | "hi" | "mr"
  const { add, remove, isSelected } = useComparisonStore()
  const selected = isSelected(scheme.slug)
  const selectedCount = useComparisonStore((s) => s.selected.length)
  const atLimit = selectedCount >= 4 && !selected
  const name = (scheme.name as Record<string, string>)[lang] || scheme.name.en
  const desc =
    (scheme.shortDescription as Record<string, string>)[lang] ||
    scheme.shortDescription.en
  const fa = scheme.financialAssistance

  return (
    <Link to={`/schemes/${scheme.slug}`} className="group block">
      <Card className="h-full border-border shadow-[0_2px_0_0_var(--border)] group-hover:shadow-[0_4px_0_0_var(--border)] transition-shadow">
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between gap-2">
            <div className="flex flex-wrap gap-1.5">
              {scheme.category.map((cat) => (
                <Badge
                  key={cat}
                  variant="secondary"
                  className={`text-xs font-medium ${categoryColors[cat] || ""}`}
                >
                  {t(`schemes.categories.${cat}`, cat)}
                </Badge>
              ))}
            </div>
            <div className="flex items-center gap-2 shrink-0">
              {matchScore !== undefined && (
                <Badge variant="outline" className="text-xs font-bold text-primary">
                  {matchScore}%
                </Badge>
              )}
              {showCompare && (
                <button
                  onClick={(e) => {
                    e.preventDefault()
                    e.stopPropagation()
                    if (selected) {
                      remove(scheme.slug)
                    } else if (!atLimit) {
                      add(scheme)
                    }
                  }}
                  disabled={atLimit}
                  className={`rounded-full p-1.5 transition-colors ${
                    selected
                      ? "bg-primary text-primary-foreground"
                      : atLimit
                        ? "text-muted-foreground/40 cursor-not-allowed"
                        : "text-muted-foreground hover:bg-secondary"
                  }`}
                  title={selected ? t("comparison.remove", { name }) : atLimit ? t("comparison.limitReached") : t("comparison.add", { name })}
                >
                  <GitCompareArrows className="size-4" />
                </button>
              )}
            </div>
          </div>
          <CardTitle className="font-display text-lg mt-2 group-hover:text-primary transition-colors">
            {name}
          </CardTitle>
          <p className="text-xs text-muted-foreground">{scheme.ministry}</p>
        </CardHeader>
        <CardContent className="space-y-3">
          <p className="text-sm leading-relaxed text-muted-foreground line-clamp-3">
            {desc}
          </p>
          <div className="flex items-center justify-between">
            <span className="text-sm font-semibold text-primary">
              {formatAmount(fa.minAmount)} – {formatAmount(fa.maxAmount)}
            </span>
            <ArrowRight className="size-4 text-muted-foreground group-hover:text-primary transition-colors" />
          </div>
        </CardContent>
      </Card>
    </Link>
  )
}
