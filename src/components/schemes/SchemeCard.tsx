import { Link } from "react-router-dom"
import { useTranslation } from "react-i18next"
import {
  Building2,
  Calculator,
  Compass,
  FileCheck2,
  Percent,
  Coins,
  Clock,
  ExternalLink,
  ShieldCheck,
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { fmtINR } from "@/lib/format"
import type { Scheme } from "@/types"

interface SchemeCardProps {
  scheme: Scheme
}

export function SchemeCard({ scheme }: SchemeCardProps) {
  const { t, i18n } = useTranslation()
  const lang = (i18n.language === "hi" ? "hi" : "en") as "en" | "hi"

  const schemeName = scheme.name[lang] || scheme.name.en
  const schemeDesc = scheme.description[lang] || scheme.description.en
  const ministryName = scheme.ministry?.[lang] || scheme.ministry?.en
  const deptName = scheme.department?.[lang] || scheme.department?.en
  const categoryKey = scheme.category || scheme.type

  // Category badge color mapping
  const categoryBadgeVariant: Record<string, "default" | "secondary" | "outline"> = {
    business: "default",
    micro: "secondary",
    education: "outline",
    women: "default",
    sanitation: "secondary",
    agriculture: "outline",
    skills: "default",
  }

  // Pre-configured query params for Calculator
  const minRate = scheme.rateRange?.min ?? 6.0
  const minTenure = scheme.tenureRangeMonths?.min ?? 12
  const maxTenure = scheme.tenureRangeMonths?.max ?? 60
  const minMoratorium = scheme.moratorium?.minMonths ?? 0
  const interestAccrues = scheme.moratorium?.interestAccrues ?? false

  const calcParams = new URLSearchParams({
    amount: (scheme.maxProjectCost ?? 100000).toString(),
    rate: minRate.toString(),
    tenure: Math.max(1, Math.round((minTenure + maxTenure) / 24)).toString(),
    moratorium: minMoratorium.toString(),
    accrual: interestAccrues ? "1" : "0",
    scheme: scheme.name?.en || scheme.id,
  }).toString()

  const partnerParams = new URLSearchParams({
    type: scheme.type || "micro",
  }).toString()

  // Format tenure duration
  const tenureDisplay =
    maxTenure < 12
      ? `${minTenure} – ${maxTenure} ${t("schemes.months", "months")}`
      : `${Math.max(1, Math.round(minTenure / 12))} – ${Math.max(1, Math.round(maxTenure / 12))} ${t("schemes.years", "years")}`

  return (
    <Card className="flex flex-col justify-between border-border/80 shadow-xs hover:shadow-md transition-all duration-200 focus-within:ring-2 focus-within:ring-primary">
      <CardHeader className="space-y-2.5 pb-3">
        {/* Top Badges Row */}
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex flex-wrap items-center gap-1.5">
            <Badge
              variant={categoryBadgeVariant[categoryKey] || "secondary"}
              className="capitalize text-xs font-semibold px-2.5 py-0.5"
            >
              {t(`categories.${categoryKey}`, { defaultValue: categoryKey })}
            </Badge>
            {scheme.verified && (
              <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 rounded px-1.5 py-0.5">
                <ShieldCheck className="size-3" />
                {t("schemes.verifiedBadge", "Verified Govt Scheme")}
              </span>
            )}
          </div>
          <span className="text-[11px] font-medium text-muted-foreground uppercase tracking-wide">
            {t(`schemeTypes.${scheme.type}`, scheme.type)}
          </span>
        </div>

        {/* Scheme Name */}
        <CardTitle className="font-display text-xl leading-tight font-bold text-foreground">
          <Link
            to={`/schemes/${scheme.id}`}
            className="hover:text-primary transition-colors focus-visible:outline-ring rounded-xs"
          >
            {schemeName}
          </Link>
        </CardTitle>

        {/* Ministry & Department */}
        {(ministryName || deptName) && (
          <p className="flex items-start gap-1.5 text-xs text-muted-foreground leading-snug">
            <Building2 className="size-3.5 shrink-0 mt-0.5 text-muted-foreground/80" />
            <span>
              {deptName ? `${deptName} · ` : ""}
              {ministryName}
            </span>
          </p>
        )}

        {/* Description */}
        <p className="text-sm text-foreground/80 line-clamp-2 leading-relaxed">
          {schemeDesc}
        </p>
      </CardHeader>

      <CardContent className="space-y-4 pt-1">
        {/* Financial Highlights Grid */}
        <div className="grid grid-cols-2 gap-2.5 rounded-lg border border-border/70 bg-muted/40 p-3 text-xs">
          {/* Max Assistance */}
          <div className="space-y-0.5">
            <span className="text-muted-foreground font-medium flex items-center gap-1">
              <Coins className="size-3.5 text-accent" />
              {t("schemes.maxAssistance", "Max Assistance")}
            </span>
            <p className="font-bold text-base text-foreground">
              {fmtINR(scheme.maxProjectCost)}
            </p>
            <span className="text-[11px] text-muted-foreground">
              {t("schemes.coverageNote", "Up to {{pct}}% funded", {
                pct: scheme.coverageMaxPct,
              })}
            </span>
          </div>

          {/* Interest Rate */}
          <div className="space-y-0.5">
            <span className="text-muted-foreground font-medium flex items-center gap-1">
              <Percent className="size-3.5 text-primary" />
              {t("schemes.interestRate", "Interest Rate")}
            </span>
            <p className="font-bold text-base text-primary">
              {scheme.rateRange.min}% – {scheme.rateRange.max}%
              <span className="text-[11px] font-normal text-muted-foreground ml-1">
                {t("schemes.perAnnum", "p.a.")}
              </span>
            </p>
            <span className="text-[11px] font-medium text-emerald-700 dark:text-emerald-400">
              {t("schemes.concessionalTag", "Concessional rate")}
            </span>
          </div>

          {/* Repayment Tenure */}
          <div className="space-y-0.5 pt-1 border-t border-border/50">
            <span className="text-muted-foreground font-medium flex items-center gap-1">
              <Clock className="size-3 text-muted-foreground" />
              {t("schemes.tenure", "Tenure")}
            </span>
            <p className="font-semibold text-foreground">
              {tenureDisplay}
            </p>
          </div>

          {/* Moratorium Pause */}
          <div className="space-y-0.5 pt-1 border-t border-border/50">
            <span className="text-muted-foreground font-medium flex items-center gap-1">
              <FileCheck2 className="size-3 text-muted-foreground" />
              {t("schemes.moratorium", "Moratorium")}
            </span>
            <p className="font-semibold text-foreground">
              {scheme.moratorium?.minMonths ?? 0} – {scheme.moratorium?.maxMonths ?? 0}{" "}
              {t("schemes.months", "months")}
            </p>
          </div>
        </div>

        {/* Purpose Tags */}
        {scheme.purposeTags && scheme.purposeTags.length > 0 && (
          <div className="flex flex-wrap gap-1 items-center">
            <span className="text-[11px] font-medium text-muted-foreground mr-1">
              {t("schemes.purposeLabel", "Purpose:")}
            </span>
            {scheme.purposeTags.slice(0, 3).map((tag) => (
              <span
                key={tag}
                className="inline-block rounded-md bg-secondary/80 px-2 py-0.5 text-[11px] font-medium text-secondary-foreground"
              >
                {tag}
              </span>
            ))}
            {scheme.purposeTags.length > 3 && (
              <span className="text-[11px] text-muted-foreground">
                +{scheme.purposeTags.length - 3} {t("schemes.more", "more")}
              </span>
            )}
          </div>
        )}

        {/* Action CTAs */}
        <div className="pt-2 border-t border-border/60 flex flex-wrap items-center gap-2">
          <Button
            asChild
            size="sm"
            className="flex-1 min-h-[44px] text-xs font-semibold"
          >
            <Link to={`/schemes/${scheme.id}`}>
              {t("schemes.viewDetails", "View Details")}
              <ExternalLink className="size-3.5 ml-1" />
            </Link>
          </Button>

          <Button
            asChild
            variant="outline"
            size="sm"
            className="min-h-[44px] text-xs font-medium px-3"
            title={t("schemes.calculateEmi", "Calculate EMI")}
          >
            <Link to={`/calculator?${calcParams}`}>
              <Calculator className="size-3.5 mr-1 text-primary" />
              {t("schemes.emi", "EMI")}
            </Link>
          </Button>

          <Button
            asChild
            variant="outline"
            size="sm"
            className="min-h-[44px] text-xs font-medium px-3"
            title={t("schemes.findPartners", "Find Partners")}
          >
            <Link to={`/partners?${partnerParams}`}>
              <Compass className="size-3.5 mr-1 text-accent" />
              {t("schemes.partners", "Partners")}
            </Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
