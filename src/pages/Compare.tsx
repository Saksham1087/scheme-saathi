import { Link } from "react-router-dom"
import { useTranslation } from "react-i18next"
import { ArrowLeft, GitCompareArrows, Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { ComparisonTable } from "@/components/ComparisonTable"
import { useComparisonStore } from "@/stores/comparisonStore"

export default function Compare() {
  const { t } = useTranslation()
  const { selected, clear } = useComparisonStore()

  if (selected.length < 2) {
    return (
      <main className="mx-auto max-w-3xl px-4 py-16 text-center">
        <GitCompareArrows className="size-12 mx-auto text-muted-foreground mb-4" />
        <h1 className="font-display font-bold text-3xl">{t("comparison.emptyTitle")}</h1>
        <p className="mt-3 text-muted-foreground max-w-md mx-auto">
          {t("comparison.emptyDesc")}
        </p>
        <Button asChild className="mt-6">
          <Link to="/schemes">
            <Plus className="mr-2 size-4" />
            {t("comparison.browseSchemes")}
          </Link>
        </Button>
      </main>
    )
  }

  return (
    <main className="mx-auto max-w-6xl px-4 py-8">
      <div className="flex items-center justify-between gap-4 mb-6">
        <div>
          <Button variant="ghost" size="sm" asChild className="mb-2">
            <Link to="/schemes">
              <ArrowLeft className="mr-1.5 size-4" />
              {t("comparison.backToSchemes")}
            </Link>
          </Button>
          <h1 className="font-display font-bold text-3xl tracking-tight">
            {t("comparison.title")}
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {t("comparison.subtitle", { count: selected.length })}
          </p>
        </div>
        <Button variant="outline" size="sm" onClick={clear}>
          {t("comparison.clearAll")}
        </Button>
      </div>

      <Card className="border-border">
        <CardContent className="p-0">
          <ComparisonTable schemes={selected} />
        </CardContent>
      </Card>
    </main>
  )
}
