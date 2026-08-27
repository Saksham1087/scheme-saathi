import { Link } from "react-router-dom"
import { useTranslation } from "react-i18next"
import {
  ArrowLeft,
  Building2,
  ShieldCheck,
  AlertTriangle,
  Coins,
  Percent,
  Clock,
  FileCheck2,
  MapPin,
  Tag,
} from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { fmtINR } from "@/lib/format"
import type { Scheme } from "@/types"

interface SchemeDetailsHeaderProps {
  scheme: Scheme
}

export function SchemeDetailsHeader({ scheme }: SchemeDetailsHeaderProps) {
  const { t, i18n } = useTranslation()
  const lang = (i18n.language === "hi" ? "hi" : "en") as "en" | "hi"

  const schemeName = scheme.name?.[lang] || scheme.name?.en || scheme.id
  const ministryName = scheme.ministry?.[lang] || scheme.ministry?.en
  const deptName = scheme.department?.[lang] || scheme.department?.en
  const categoryKey = scheme.category || scheme.type

  const minRate = scheme.interestRateDetails?.min ?? scheme.rateRange?.min ?? 6.0
  const maxRate = scheme.interestRateDetails?.max ?? scheme.rateRange?.max ?? 9.0
  const minTenure = scheme.repaymentTerms?.tenureRangeMonths?.min ?? scheme.tenureRangeMonths?.min ?? 12
  const maxTenure = scheme.repaymentTerms?.tenureRangeMonths?.max ?? scheme.tenureRangeMonths?.max ?? 60
  const tenureDisplay =
    maxTenure < 12
      ? `${minTenure} – ${maxTenure} ${t("schemes.months", "months")}`
      : `${Math.max(1, Math.round(minTenure / 12))} – ${Math.max(1, Math.round(maxTenure / 12))} ${t("schemes.years", "years")}`

  const minMoratorium = scheme.moratoriumDetails?.minMonths ?? scheme.moratorium?.minMonths ?? 0
  const maxMoratorium = scheme.moratoriumDetails?.maxMonths ?? scheme.moratorium?.maxMonths ?? 0
  const interestAccrues = scheme.moratoriumDetails?.interestAccrues ?? scheme.moratorium?.interestAccrues ?? false

  return (
    <div className="space-y-4">
      {/* Back Link */}
      <div>
        <Button
          asChild
          variant="ghost"
          size="sm"
          className="group -ml-2 h-9 text-xs font-semibold text-muted-foreground hover:text-foreground"
        >
          <Link to="/schemes" className="inline-flex items-center gap-1.5">
            <ArrowLeft className="size-4 transition-transform group-hover:-translate-x-0.5" />
            {t("schemeDetails.backToCatalog", "Back to Scheme Catalog")}
          </Link>
        </Button>
      </div>

      {/* Main Hero Header Card */}
      <div className="rounded-2xl border border-border bg-card p-6 sm:p-8 shadow-xs">
        {/* Category & Status Badges */}
        <div className="flex flex-wrap items-center justify-between gap-3 pb-3">
          <div className="flex flex-wrap items-center gap-2">
            <Badge variant="default" className="capitalize text-xs font-semibold px-3 py-1">
              {t(`categories.${categoryKey}`, { defaultValue: categoryKey })}
            </Badge>
            <Badge variant="secondary" className="text-xs font-medium px-2.5 py-0.5">
              {t(`schemeTypes.${scheme.type}`, scheme.type)}
            </Badge>
            {scheme.verified ? (
              <span className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-800 dark:text-emerald-300 bg-emerald-100 dark:bg-emerald-950/80 border border-emerald-300 dark:border-emerald-700 rounded-full px-2.5 py-0.5">
                <ShieldCheck className="size-3.5" />
                {t("schemes.verifiedBadge", "Verified Govt Scheme")}
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 text-xs font-semibold text-amber-800 dark:text-amber-300 bg-amber-100 dark:bg-amber-950/80 border border-amber-300 dark:border-amber-700 rounded-full px-2.5 py-0.5">
                <AlertTriangle className="size-3.5" />
                {t("schemeDetails.unverifiedWarning", "Information not independently verified")}
              </span>
            )}
          </div>

          {/* Applicable States */}
          {scheme.applicableStates && scheme.applicableStates.length > 0 && (
            <div className="inline-flex items-center gap-1 text-xs text-muted-foreground bg-muted/60 px-2.5 py-1 rounded-md">
              <MapPin className="size-3 text-muted-foreground" />
              <span>{scheme.applicableStates.join(", ")}</span>
            </div>
          )}
        </div>

        {/* Scheme Title */}
        <h1 className="font-display text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-foreground leading-tight">
          {schemeName}
        </h1>

        {/* Ministry & Department */}
        {(ministryName || deptName) && (
          <div className="mt-2.5 flex items-start gap-2 text-sm text-muted-foreground">
            <Building2 className="size-4 shrink-0 mt-0.5 text-primary" />
            <p className="font-medium">
              {deptName ? `${deptName} · ` : ""}
              {ministryName}
            </p>
          </div>
        )}

        {/* Purpose Tags */}
        {scheme.purposeTags && scheme.purposeTags.length > 0 && (
          <div className="mt-4 flex flex-wrap items-center gap-1.5 pt-3 border-t border-border/50">
            <span className="text-xs font-medium text-muted-foreground flex items-center gap-1 mr-1">
              <Tag className="size-3" />
              {t("schemes.purposeLabel", "Purpose:")}
            </span>
            {scheme.purposeTags.map((tag) => (
              <span
                key={tag}
                className="inline-block rounded-md bg-secondary/80 px-2.5 py-0.5 text-xs font-medium text-secondary-foreground"
              >
                {tag}
              </span>
            ))}
          </div>
        )}

        {/* Financial Highlights Ribbon */}
        <div className="mt-6 grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 pt-5 border-t border-border">
          {/* Max Assistance */}
          <div className="rounded-xl border border-border/80 bg-muted/30 p-3.5 sm:p-4 space-y-1">
            <span className="text-xs font-medium text-muted-foreground flex items-center gap-1.5">
              <Coins className="size-4 text-accent" />
              {t("schemes.maxAssistance", "Max Assistance")}
            </span>
            <p className="font-display text-lg sm:text-xl font-bold text-foreground">
              {fmtINR(scheme.maxProjectCost)}
            </p>
            <p className="text-[11px] text-muted-foreground">
              {t("schemes.coverageNote", "Up to {{pct}}% funded", {
                pct: scheme.coverageMaxPct,
              })}
            </p>
          </div>

          {/* Interest Rate */}
          <div className="rounded-xl border border-border/80 bg-muted/30 p-3.5 sm:p-4 space-y-1">
            <span className="text-xs font-medium text-muted-foreground flex items-center gap-1.5">
              <Percent className="size-4 text-primary" />
              {t("schemes.interestRate", "Interest Rate")}
            </span>
            <p className="font-display text-lg sm:text-xl font-bold text-primary">
              {minRate}% – {maxRate}%
              <span className="text-xs font-normal text-muted-foreground ml-1">
                {t("schemes.perAnnum", "p.a.")}
              </span>
            </p>
            <p className="text-[11px] font-medium text-emerald-700 dark:text-emerald-400">
              {t("schemes.concessionalTag", "Concessional rate")}
            </p>
          </div>

          {/* Repayment Tenure */}
          <div className="rounded-xl border border-border/80 bg-muted/30 p-3.5 sm:p-4 space-y-1">
            <span className="text-xs font-medium text-muted-foreground flex items-center gap-1.5">
              <Clock className="size-4 text-muted-foreground" />
              {t("schemes.tenure", "Tenure")}
            </span>
            <p className="font-display text-lg sm:text-xl font-bold text-foreground">
              {tenureDisplay}
            </p>
            <p className="text-[11px] text-muted-foreground">
              {minTenure} – {maxTenure} {t("schemes.months", "months")}
            </p>
          </div>

          {/* Moratorium */}
          <div className="rounded-xl border border-border/80 bg-muted/30 p-3.5 sm:p-4 space-y-1">
            <span className="text-xs font-medium text-muted-foreground flex items-center gap-1.5">
              <FileCheck2 className="size-4 text-muted-foreground" />
              {t("schemes.moratorium", "Moratorium")}
            </span>
            <p className="font-display text-lg sm:text-xl font-bold text-foreground">
              {minMoratorium} – {maxMoratorium} {t("schemes.months", "months")}
            </p>
            <p className="text-[11px] text-muted-foreground">
              {interestAccrues
                ? t("schemeDetails.interestAccruesShort", "Interest accrues")
                : t("schemeDetails.interestFreePause", "Interest-free pause")}
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
