import { useEffect, useMemo } from "react"
import { Link } from "react-router-dom"
import { useTranslation } from "react-i18next"
import { toast } from "sonner"
import {
  Bookmark,
  ExternalLink,
  Layers,
  Calculator,
  Coins,
  Percent,
  Trash2,
  ShieldCheck,
  Building2,
  ArrowRight,
  FolderHeart,
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { useSavedStore } from "@/stores/useSavedStore"
import { useSchemeStore } from "@/stores/useSchemeStore"
import { useCompareStore } from "@/stores/useCompareStore"
import { useLocaleStore } from "@/stores/localeStore"
import { getSeedSchemes } from "@/services/schemeService"
import { fmtINR } from "@/lib/format"
import type { Scheme } from "@/types"

export function SavedSchemesCard() {
  const { t } = useTranslation()
  const { lang } = useLocaleStore()
  const { savedSchemeIds, removeScheme } = useSavedStore()
  const { schemes, loadSchemes } = useSchemeStore()
  const { isComparing, toggleScheme } = useCompareStore()

  useEffect(() => {
    void loadSchemes()
  }, [loadSchemes])

  const savedSchemesList: Scheme[] = useMemo(() => {
    const pool = schemes.length > 0 ? schemes : getSeedSchemes()
    return savedSchemeIds
      .map((id) => pool.find((s) => s.id === id))
      .filter((s): s is Scheme => Boolean(s))
  }, [savedSchemeIds, schemes])

  function handleRemove(schemeId: string, schemeName: string) {
    removeScheme(schemeId)
    toast.info(t("dashboard.schemeRemovedToast", "Removed {{name}} from saved list", { name: schemeName }))
  }

  return (
    <Card className="border border-border/80 shadow-xs">
      <CardHeader className="flex flex-row items-center justify-between pb-3 space-y-0">
        <div>
          <div className="flex items-center gap-2">
            <span className="rounded-full bg-accent/10 px-2 py-0.5 text-xs font-semibold text-accent">
              {t("dashboard.savedSchemesBadge", "Bookmarked")}
            </span>
            <Badge variant="outline" className="text-xs font-mono">
              {savedSchemesList.length}
            </Badge>
          </div>
          <CardTitle className="font-display text-lg font-bold text-foreground mt-1">
            {t("dashboard.savedSchemesTitle", "Saved Schemes & Concessional Loans")}
          </CardTitle>
          <CardDescription className="text-xs text-muted-foreground">
            {t(
              "dashboard.savedSchemesDesc",
              "Compare terms, calculate repayment schedules, or review requirements for your shortlisted schemes."
            )}
          </CardDescription>
        </div>

        <Button asChild size="sm" variant="outline" className="h-8 text-xs font-semibold gap-1.5 shrink-0">
          <Link to="/schemes">
            <span>{t("dashboard.browseCatalogBtn", "Browse Catalog")}</span>
            <ArrowRight className="size-3.5" />
          </Link>
        </Button>
      </CardHeader>

      <CardContent className="space-y-4 pt-1">
        {savedSchemesList.length === 0 ? (
          <div className="rounded-xl border border-dashed border-border/80 p-6 text-center space-y-3 bg-muted/20">
            <div className="mx-auto flex size-12 items-center justify-center rounded-full bg-accent/10 text-accent">
              <FolderHeart className="size-6" />
            </div>
            <div>
              <h4 className="font-display font-semibold text-sm text-foreground">
                {t("dashboard.noSavedSchemesTitle", "No saved schemes yet")}
              </h4>
              <p className="text-xs text-muted-foreground max-w-sm mx-auto mt-1">
                {t(
                  "dashboard.noSavedSchemesDesc",
                  "Bookmark schemes from the catalog or recommendation wizard to compare interest rates and calculate EMIs."
                )}
              </p>
            </div>
            <Button asChild size="sm" className="text-xs font-semibold gap-1.5">
              <Link to="/schemes">
                <Bookmark className="size-3.5" />
                {t("dashboard.exploreSchemesBtn", "Explore Government Schemes")}
              </Link>
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
            {savedSchemesList.map((scheme) => {
              const schemeName = scheme.name?.[lang] || scheme.name?.en || scheme.id
              const ministryName = scheme.ministry?.[lang] || scheme.ministry?.en
              const deptName = scheme.department?.[lang] || scheme.department?.en
              const categoryKey = scheme.category || scheme.type
              const comparing = isComparing(scheme.id)

              const calcParams = new URLSearchParams({
                amount: (scheme.maxProjectCost ?? 100000).toString(),
                rate: (scheme.rateRange?.min ?? 6.0).toString(),
                tenure: Math.max(1, Math.round(((scheme.tenureRangeMonths?.min ?? 12) + (scheme.tenureRangeMonths?.max ?? 60)) / 24)).toString(),
                moratorium: (scheme.moratorium?.minMonths ?? 0).toString(),
                scheme: scheme.name?.en || scheme.id,
              }).toString()

              return (
                <div
                  key={scheme.id}
                  className="rounded-xl border border-border/70 bg-card p-4 space-y-3 flex flex-col justify-between transition-all hover:border-border hover:shadow-xs"
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex flex-wrap items-center gap-1.5">
                        <Badge variant="secondary" className="capitalize text-[11px] font-semibold">
                          {t(`categories.${categoryKey}`, categoryKey)}
                        </Badge>
                        {scheme.verified && (
                          <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 rounded px-1.5 py-0.5">
                            <ShieldCheck className="size-3" />
                            {t("schemes.verifiedBadge", "Verified")}
                          </span>
                        )}
                      </div>

                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleRemove(scheme.id, schemeName)}
                        className="size-7 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-md"
                        title={t("dashboard.removeFromSaved", "Remove from saved")}
                        aria-label={t("dashboard.removeSavedSchemeAria", "Remove {{name}} from saved", { name: schemeName })}
                      >
                        <Trash2 className="size-3.5" />
                      </Button>
                    </div>

                    <h4 className="font-display font-bold text-base text-foreground leading-snug">
                      <Link to={`/schemes/${scheme.id}`} className="hover:text-primary transition-colors">
                        {schemeName}
                      </Link>
                    </h4>

                    {(ministryName || deptName) && (
                      <p className="text-xs text-muted-foreground flex items-center gap-1 leading-tight line-clamp-1">
                        <Building2 className="size-3 shrink-0" />
                        <span>{deptName ? `${deptName} · ` : ""}{ministryName}</span>
                      </p>
                    )}

                    {/* Highlights */}
                    <div className="grid grid-cols-2 gap-2 rounded-lg bg-muted/40 p-2.5 text-xs border border-border/50">
                      <div>
                        <span className="text-muted-foreground text-[11px] flex items-center gap-1">
                          <Coins className="size-3 text-accent" />
                          {t("schemes.maxAssistance", "Max Assistance")}
                        </span>
                        <p className="font-bold text-sm text-foreground mt-0.5">
                          {fmtINR(scheme.maxProjectCost)}
                        </p>
                      </div>
                      <div>
                        <span className="text-muted-foreground text-[11px] flex items-center gap-1">
                          <Percent className="size-3 text-primary" />
                          {t("schemes.interestRate", "Interest Rate")}
                        </span>
                        <p className="font-bold text-sm text-primary mt-0.5">
                          {scheme.rateRange.min}% – {scheme.rateRange.max}%
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Actions row */}
                  <div className="pt-2 border-t border-border/60 flex items-center gap-2">
                    <Button asChild size="sm" className="flex-1 h-8 text-xs font-semibold">
                      <Link to={`/schemes/${scheme.id}`}>
                        {t("schemes.viewDetails", "Details")}
                        <ExternalLink className="size-3 ml-1" />
                      </Link>
                    </Button>

                    <Button
                      variant={comparing ? "secondary" : "outline"}
                      size="sm"
                      onClick={() => toggleScheme(scheme.id)}
                      className={`h-8 text-xs font-medium px-2.5 ${
                        comparing ? "border-primary bg-primary/10 text-primary" : ""
                      }`}
                      title={t("compare.compareTooltip", "Add to scheme comparison tray")}
                    >
                      <Layers className="size-3.5 mr-1" />
                      {comparing ? t("compare.comparing", "Comparing") : t("compare.compareCheckbox", "Compare")}
                    </Button>

                    <Button
                      asChild
                      variant="outline"
                      size="sm"
                      className="h-8 text-xs font-medium px-2.5"
                      title={t("schemes.calculateEmi", "Calculate EMI")}
                    >
                      <Link to={`/calculator?${calcParams}`}>
                        <Calculator className="size-3.5 mr-1 text-primary" />
                        {t("schemes.emi", "EMI")}
                      </Link>
                    </Button>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
