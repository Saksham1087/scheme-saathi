import { useEffect, useState, useMemo } from "react"
import { Link, useSearchParams } from "react-router-dom"
import { useTranslation } from "react-i18next"
import { toast } from "sonner"
import {
  ArrowLeft,
  Building2,
  Calculator,
  Compass,
  FileCheck2,
  Layers,
  Percent,
  Coins,
  Clock,
  Printer,
  Share2,
  Plus,
  Trash2,
  X,
  Check,
  Search,
  ExternalLink,
  ShieldCheck,
  Info,
  Sparkles,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { Card, CardContent } from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogDescription,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { useCompareStore, MAX_COMPARE_SCHEMES } from "@/stores/useCompareStore"
import { useSchemeStore } from "@/stores/useSchemeStore"
import { getSeedSchemes } from "@/services/schemeService"
import { fmtINR } from "@/lib/format"
import type { Scheme } from "@/types"

interface ComparisonDimension {
  id: string
  titleKey: string
  defaultTitle: string
  icon: React.ComponentType<{ className?: string }>
  getValueKey: (scheme: Scheme, lang: "en" | "hi") => string | number | boolean
  renderCell: (scheme: Scheme, lang: "en" | "hi", t: (key: string, opts?: any) => string) => React.ReactNode
}

export default function ComparePage() {
  const { t, i18n } = useTranslation()
  const lang = (i18n.language === "hi" ? "hi" : "en") as "en" | "hi"
  const [searchParams, setSearchParams] = useSearchParams()

  const {
    selectedSchemeIds,
    addScheme,
    removeScheme,
    clearAll,
    setSchemes,
    highlightDifferences,
    setHighlightDifferences,
  } = useCompareStore()

  const { schemes, loadSchemes, loading } = useSchemeStore()
  const [addModalOpen, setAddModalOpen] = useState(false)
  const [pickerSearch, setPickerSearch] = useState("")
  const [copied, setCopied] = useState(false)

  // 1. Load schemes catalog if not loaded
  useEffect(() => {
    if (schemes.length === 0) {
      loadSchemes()
    }
  }, [schemes.length, loadSchemes])

  const allSchemes = schemes.length > 0 ? schemes : getSeedSchemes()

  // 2. Synchronize URL query params with store
  const [urlInitialized, setUrlInitialized] = useState(false)

  useEffect(() => {
    const querySchemes = searchParams.get("schemes")
    if (querySchemes && !urlInitialized) {
      const idsFromUrl = querySchemes
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean)
      if (idsFromUrl.length > 0) {
        setSchemes(idsFromUrl)
      }
      setUrlInitialized(true)
    } else {
      setUrlInitialized(true)
    }
  }, [searchParams, urlInitialized, setSchemes])

  useEffect(() => {
    if (urlInitialized) {
      const currentParam = searchParams.get("schemes") || ""
      const newParam = selectedSchemeIds.join(",")
      if (currentParam !== newParam) {
        setSearchParams(
          newParam ? { schemes: newParam } : {},
          { replace: true }
        )
      }
    }
  }, [selectedSchemeIds, urlInitialized, searchParams, setSearchParams])

  // Resolve comparing schemes
  const comparedSchemes = useMemo(() => {
    return selectedSchemeIds
      .map((id) => allSchemes.find((s) => s.id === id) || getSeedSchemes().find((s) => s.id === id))
      .filter((s): s is Scheme => Boolean(s))
  }, [selectedSchemeIds, allSchemes])

  // Copy shareable link
  const handleShare = async () => {
    const shareUrl = window.location.href
    if (navigator.share && navigator.canShare && navigator.canShare({ url: shareUrl })) {
      try {
        await navigator.share({
          title: t("compare.shareTitle", "Compare Schemes - SchemeSathi"),
          text: t("compare.shareText", "Compare these government schemes side-by-side on SchemeSathi:"),
          url: shareUrl,
        })
        return
      } catch (err) {
        if ((err as Error).name !== "AbortError") {
          console.error("Share error:", err)
        }
      }
    }

    try {
      await navigator.clipboard.writeText(shareUrl)
      setCopied(true)
      toast.success(t("compare.linkCopied", "Comparison link copied to clipboard!"))
      setTimeout(() => setCopied(false), 2500)
    } catch {
      toast.error(t("compare.copyFailed", "Could not copy link to clipboard."))
    }
  }

  // Print comparison table
  const handlePrint = () => {
    window.print()
  }

  // Define 12 Comparison Dimensions
  const dimensions: ComparisonDimension[] = useMemo(
    () => [
      // 1. Category & Type
      {
        id: "category_type",
        titleKey: "compare.dimCategoryType",
        defaultTitle: "Category & Scheme Type",
        icon: Layers,
        getValueKey: (s) => `${s.category || s.type}-${s.type}`,
        renderCell: (scheme, l, trans) => {
          const catKey = scheme.category || scheme.type
          return (
            <div className="space-y-1.5">
              <div className="flex flex-wrap items-center gap-1.5">
                <Badge variant="default" className="capitalize text-xs font-semibold px-2.5 py-0.5">
                  {trans(`categories.${catKey}`, { defaultValue: catKey })}
                </Badge>
                <Badge variant="secondary" className="text-xs font-medium px-2 py-0.5">
                  {trans(`schemeTypes.${scheme.type}`, scheme.type)}
                </Badge>
              </div>
              <p className="text-xs text-muted-foreground leading-snug">
                {scheme.purpose?.[l] || scheme.purpose?.en || scheme.description?.[l] || scheme.description?.en}
              </p>
            </div>
          )
        },
      },

      // 2. Ministry / Governing Corporation
      {
        id: "ministry",
        titleKey: "compare.dimMinistry",
        defaultTitle: "Ministry & Nodal Corporation",
        icon: Building2,
        getValueKey: (s) => `${s.ministry?.en || ""}-${s.department?.en || ""}`,
        renderCell: (scheme, l) => {
          const ministry = scheme.ministry?.[l] || scheme.ministry?.en || "Ministry of Social Justice and Empowerment"
          const dept = scheme.department?.[l] || scheme.department?.en || "NSFDC"
          return (
            <div className="space-y-1">
              <p className="font-semibold text-xs text-foreground">{dept}</p>
              <p className="text-xs text-muted-foreground leading-snug">{ministry}</p>
            </div>
          )
        },
      },

      // 3. Max Project Cost / Assistance Cap
      {
        id: "max_cost",
        titleKey: "compare.dimMaxCost",
        defaultTitle: "Max Project Cost / Assistance Cap",
        icon: Coins,
        getValueKey: (s) => s.maxProjectCost,
        renderCell: (scheme, l, trans) => {
          const minAmt = scheme.loanLimits?.minAmount
          const unitCostLimit = scheme.loanLimits?.unitCostLimit?.[l] || scheme.loanLimits?.unitCostLimit?.en
          return (
            <div className="space-y-1">
              <p className="font-display text-base sm:text-lg font-bold text-foreground">
                {fmtINR(scheme.maxProjectCost)}
              </p>
              {minAmt ? (
                <p className="text-[11px] text-muted-foreground">
                  {trans("compare.minAmount", { amt: fmtINR(minAmt), defaultValue: "Min: {{amt}}" })}
                </p>
              ) : null}
              {unitCostLimit && (
                <p className="text-[11px] text-muted-foreground line-clamp-2 leading-tight">
                  {unitCostLimit}
                </p>
              )}
            </div>
          )
        },
      },

      // 4. Corporation Coverage Share %
      {
        id: "coverage_share",
        titleKey: "compare.dimCoverageShare",
        defaultTitle: "Corporation Coverage Share %",
        icon: Percent,
        getValueKey: (s) => s.coverageMaxPct,
        renderCell: (scheme, l, trans) => {
          const fundingPattern =
            scheme.financialAssistance?.fundingPattern?.[l] ||
            scheme.financialAssistance?.fundingPattern?.en
          return (
            <div className="space-y-1">
              <p className="font-display text-base sm:text-lg font-bold text-primary">
                {scheme.coverageMaxPct}%
              </p>
              <p className="text-[11px] text-muted-foreground">
                {trans("compare.coverageDesc", "Funded by NSFDC / Central Corp")}
              </p>
              {fundingPattern && (
                <p className="text-[11px] text-foreground/80 line-clamp-2 pt-0.5 leading-snug">
                  {fundingPattern}
                </p>
              )}
            </div>
          )
        },
      },

      // 5. Promoter / Beneficiary Margin %
      {
        id: "promoter_margin",
        titleKey: "compare.dimPromoterMargin",
        defaultTitle: "Promoter / Beneficiary Margin %",
        icon: Coins,
        getValueKey: (s) =>
          s.financialAssistance?.promoterContributionPct ?? Math.max(0, 100 - s.coverageMaxPct),
        renderCell: (scheme, _l, trans) => {
          const margin =
            scheme.financialAssistance?.promoterContributionPct ?? Math.max(0, 100 - scheme.coverageMaxPct)
          return (
            <div className="space-y-1">
              <p className="font-display text-base sm:text-lg font-bold text-foreground">
                {margin}%
              </p>
              <p className="text-[11px] text-muted-foreground">
                {trans("compare.promoterNote", "Promoter / Beneficiary + State SCA contribution")}
              </p>
            </div>
          )
        },
      },

      // 6. Interest Rate Range (p.a.)
      {
        id: "interest_rate",
        titleKey: "compare.dimInterestRate",
        defaultTitle: "Interest Rate Range (p.a.)",
        icon: Percent,
        getValueKey: (s) =>
          `${s.interestRateDetails?.min ?? s.rateRange?.min}-${s.interestRateDetails?.max ?? s.rateRange?.max}`,
        renderCell: (scheme, _l, trans) => {
          const min = scheme.interestRateDetails?.min ?? scheme.rateRange?.min ?? 6.0
          const max = scheme.interestRateDetails?.max ?? scheme.rateRange?.max ?? 9.0
          return (
            <div className="space-y-1">
              <p className="font-display text-base sm:text-lg font-bold text-primary">
                {min}% – {max}%{" "}
                <span className="text-xs font-normal text-muted-foreground">
                  {trans("schemes.perAnnum", "p.a.")}
                </span>
              </p>
              <span className="inline-block text-[11px] font-medium text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 px-1.5 py-0.5 rounded">
                {trans("schemes.concessionalTag", "Concessional rate")}
              </span>
            </div>
          )
        },
      },

      // 7. Special Rebates & Concessions
      {
        id: "rebates",
        titleKey: "compare.dimRebates",
        defaultTitle: "Special Rebates & Concessions",
        icon: Sparkles,
        getValueKey: (s) =>
          s.interestRateDetails?.concessions?.en ||
          s.interestRateDetails?.rebates?.map((r) => r.en).join(";") ||
          "standard",
        renderCell: (scheme, l, trans) => {
          const concessions =
            scheme.interestRateDetails?.concessions?.[l] || scheme.interestRateDetails?.concessions?.en
          const rebatesList = scheme.interestRateDetails?.rebates

          if (rebatesList && rebatesList.length > 0) {
            return (
              <ul className="space-y-1 text-xs text-foreground/90 list-disc pl-4">
                {rebatesList.map((reb, idx) => (
                  <li key={idx} className="leading-snug">
                    {reb[l] || reb.en}
                  </li>
                ))}
              </ul>
            )
          }

          if (concessions) {
            return (
              <p className="text-xs text-foreground/90 leading-snug">
                {concessions}
              </p>
            )
          }

          return (
            <p className="text-xs text-muted-foreground">
              {trans("compare.standardConcession", "0.5% rebate on timely repayment")}
            </p>
          )
        },
      },

      // 8. Moratorium Period & Interest Accrual
      {
        id: "moratorium",
        titleKey: "compare.dimMoratorium",
        defaultTitle: "Moratorium Period & Interest Accrual",
        icon: Clock,
        getValueKey: (s) => {
          const minM = s.moratoriumDetails?.minMonths ?? s.moratorium?.minMonths ?? 0
          const maxM = s.moratoriumDetails?.maxMonths ?? s.moratorium?.maxMonths ?? 0
          const accrues = s.moratoriumDetails?.interestAccrues ?? s.moratorium?.interestAccrues ?? false
          return `${minM}-${maxM}-${accrues}`
        },
        renderCell: (scheme, _l, trans) => {
          const minM = scheme.moratoriumDetails?.minMonths ?? scheme.moratorium?.minMonths ?? 0
          const maxM = scheme.moratoriumDetails?.maxMonths ?? scheme.moratorium?.maxMonths ?? 0
          const interestAccrues =
            scheme.moratoriumDetails?.interestAccrues ?? scheme.moratorium?.interestAccrues ?? false

          return (
            <div className="space-y-1.5">
              <p className="font-semibold text-xs text-foreground">
                {minM} – {maxM} {trans("schemes.months", "months")}
              </p>
              <div>
                {interestAccrues ? (
                  <span className="inline-block text-[11px] font-medium text-amber-800 dark:text-amber-300 bg-amber-100 dark:bg-amber-950/80 px-2 py-0.5 rounded">
                    {trans("schemeDetails.accruesCapitalized", "Interest Accrues")}
                  </span>
                ) : (
                  <span className="inline-block text-[11px] font-medium text-emerald-800 dark:text-emerald-300 bg-emerald-100 dark:bg-emerald-950/80 px-2 py-0.5 rounded">
                    {trans("schemeDetails.interestFreePause", "Interest-free pause")}
                  </span>
                )}
              </div>
            </div>
          )
        },
      },

      // 9. Repayment Tenure Range
      {
        id: "tenure",
        titleKey: "compare.dimTenure",
        defaultTitle: "Repayment Tenure Range",
        icon: Clock,
        getValueKey: (s) => {
          const min = s.repaymentTerms?.tenureRangeMonths?.min ?? s.tenureRangeMonths?.min ?? 12
          const max = s.repaymentTerms?.tenureRangeMonths?.max ?? s.tenureRangeMonths?.max ?? 60
          return `${min}-${max}`
        },
        renderCell: (scheme, _l, trans) => {
          const min = scheme.repaymentTerms?.tenureRangeMonths?.min ?? scheme.tenureRangeMonths?.min ?? 12
          const max = scheme.repaymentTerms?.tenureRangeMonths?.max ?? scheme.tenureRangeMonths?.max ?? 60
          const tenureDisplay =
            max < 12
              ? `${min} – ${max} ${trans("schemes.months", "months")}`
              : `${Math.max(1, Math.round(min / 12))} – ${Math.max(1, Math.round(max / 12))} ${trans("schemes.years", "years")}`

          return (
            <div className="space-y-1">
              <p className="font-semibold text-xs text-foreground">{tenureDisplay}</p>
              <p className="text-[11px] text-muted-foreground">
                {min} – {max} {trans("schemes.months", "months")} ({trans("schemeDetails.monthlyQuarterly", "Monthly / Quarterly")})
              </p>
              <p className="text-[11px] text-emerald-700 dark:text-emerald-400 font-medium">
                {trans("schemeDetails.zeroForeclosure", "Zero pre-closure penalty")}
              </p>
            </div>
          )
        },
      },

      // 10. Income Ceiling & Caste Eligibility
      {
        id: "eligibility",
        titleKey: "compare.dimEligibility",
        defaultTitle: "Income Ceiling & Caste Eligibility",
        icon: FileCheck2,
        getValueKey: (s) => s.incomeCeiling,
        renderCell: (scheme, l, trans) => {
          const caste =
            scheme.eligibilityCriteria?.targetCaste?.[l] ||
            scheme.eligibilityCriteria?.targetCaste?.en ||
            trans("schemeDetails.scTarget", "Scheduled Caste (SC)")
          const ageMin = scheme.eligibilityCriteria?.ageRange?.min ?? 18
          const ageMax = scheme.eligibilityCriteria?.ageRange?.max ?? 60

          return (
            <div className="space-y-1.5 text-xs">
              <div>
                <span className="text-muted-foreground font-medium block text-[11px]">
                  {trans("schemeDetails.casteCategory", "Caste / Category")}:
                </span>
                <span className="font-semibold text-foreground">{caste}</span>
              </div>
              <div>
                <span className="text-muted-foreground font-medium block text-[11px]">
                  {trans("schemeDetails.annualIncomeCeiling", "Income Ceiling")}:
                </span>
                <span className="font-bold text-foreground">{fmtINR(scheme.incomeCeiling)}</span>
              </div>
              <div>
                <span className="text-muted-foreground font-medium block text-[11px]">
                  {trans("schemeDetails.ageLimit", "Age Limit")}:
                </span>
                <span>{ageMin} – {ageMax} {trans("schemeDetails.yearsOld", "years")}</span>
              </div>
            </div>
          )
        },
      },

      // 11. Key Mandatory Documents
      {
        id: "documents",
        titleKey: "compare.dimDocuments",
        defaultTitle: "Key Mandatory Documents",
        icon: FileCheck2,
        getValueKey: (s) =>
          s.requiredDocumentsList
            ?.flatMap((c) => c.items)
            .filter((i) => i.mandatory)
            .map((i) => i.name.en)
            .join(";") || "kyc,caste,income",
        renderCell: (scheme, l, trans) => {
          const docGroups = scheme.requiredDocumentsList
          if (docGroups && docGroups.length > 0) {
            const mandatoryDocs = docGroups
              .flatMap((g) => g.items)
              .filter((item) => item.mandatory !== false)
              .slice(0, 4)

            return (
              <ul className="space-y-1 text-xs text-foreground/90 list-disc pl-4">
                {mandatoryDocs.map((doc, idx) => (
                  <li key={idx} className="leading-snug">
                    {doc.name[l] || doc.name.en}
                  </li>
                ))}
              </ul>
            )
          }

          return (
            <p className="text-xs text-muted-foreground leading-snug">
              {trans("schemeDetails.defaultDocsText", "KYC, Caste Certificate, Income Certificate, and Project Quotation.")}
            </p>
          )
        },
      },

      // 12. Authorized Channel Partners
      {
        id: "partners",
        titleKey: "compare.dimPartners",
        defaultTitle: "Authorized Channel Partners",
        icon: Compass,
        getValueKey: (s) =>
          s.channelPartnersInfo?.partnerTypes?.join(",") || s.type || "SCA,PSB,RRB",
        renderCell: (scheme, _l, trans) => {
          const partnerTypes = scheme.channelPartnersInfo?.partnerTypes || ["SCA", "PSB", "RRB"]
          return (
            <div className="space-y-1.5">
              <div className="flex flex-wrap gap-1">
                {partnerTypes.map((pt) => (
                  <Badge key={pt} variant="outline" className="text-[11px] font-semibold">
                    {trans(`schemeDetails.${pt.toLowerCase()}Label`, pt)}
                  </Badge>
                ))}
              </div>
              <p className="text-[11px] text-muted-foreground leading-snug">
                {trans("compare.partnerRoutingNote", "State Channelizing Agencies (SCAs) & Banks")}
              </p>
            </div>
          )
        },
      },
    ],
    []
  )

  // Check if a row has differences across the compared schemes
  const rowHasDifference = (dim: ComparisonDimension): boolean => {
    if (comparedSchemes.length < 2) return false
    const firstVal = dim.getValueKey(comparedSchemes[0], lang)
    return comparedSchemes.some((s) => dim.getValueKey(s, lang) !== firstVal)
  }

  // Schemes available to add into comparison
  const availableToAdd = useMemo(() => {
    return allSchemes.filter(
      (s) =>
        !selectedSchemeIds.includes(s.id) &&
        (pickerSearch === "" ||
          (s.name[lang] || s.name.en).toLowerCase().includes(pickerSearch.toLowerCase()) ||
          (s.category || s.type).toLowerCase().includes(pickerSearch.toLowerCase()) ||
          (s.purpose?.[lang] || s.purpose?.en || "").toLowerCase().includes(pickerSearch.toLowerCase()))
    )
  }, [allSchemes, selectedSchemeIds, pickerSearch, lang])

  return (
    <div className="min-h-svh bg-background pb-20">
      {/* Top Header & Breadcrumb Bar */}
      <div className="border-b border-border bg-card/60 backdrop-blur-sm sticky top-16 z-30">
        <div className="mx-auto max-w-7xl px-4 py-3 sm:py-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
            {/* Left Title & Back CTA */}
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <Button
                  asChild
                  variant="ghost"
                  size="sm"
                  className="-ml-2 h-8 text-xs font-semibold text-muted-foreground hover:text-foreground"
                >
                  <Link to="/schemes" className="inline-flex items-center gap-1.5">
                    <ArrowLeft className="size-3.5" />
                    {t("schemeDetails.backToCatalog", "Back to Catalog")}
                  </Link>
                </Button>
                <span className="text-muted-foreground/40 text-xs">/</span>
                <span className="text-xs font-medium text-muted-foreground">
                  {t("compare.matrixBreadcrumb", "Side-by-Side Comparison")}
                </span>
              </div>
              <div className="flex items-center gap-2.5">
                <h1 className="font-display text-xl sm:text-2xl font-bold tracking-tight text-foreground">
                  {t("compare.pageTitle", "Multi-Scheme Comparison Matrix")}
                </h1>
                <Badge variant="secondary" className="text-xs font-semibold px-2 py-0.5">
                  {comparedSchemes.length}/{MAX_COMPARE_SCHEMES}
                </Badge>
              </div>
            </div>

            {/* Right Action Controls */}
            <div className="flex flex-wrap items-center gap-2">
              {/* Highlight Differences Switch */}
              {comparedSchemes.length >= 2 && (
                <div className="flex items-center gap-2 rounded-lg border border-border/80 bg-muted/40 px-3 py-1.5 text-xs">
                  <Switch
                    id="highlight-diff-toggle"
                    checked={highlightDifferences}
                    onCheckedChange={setHighlightDifferences}
                    aria-label={t("compare.highlightDifferences", "Highlight Differences")}
                  />
                  <label
                    htmlFor="highlight-diff-toggle"
                    className="font-medium text-foreground cursor-pointer select-none"
                  >
                    {t("compare.highlightDifferences", "Highlight Differences")}
                  </label>
                </div>
              )}

              {/* Add Scheme Trigger */}
              {comparedSchemes.length < MAX_COMPARE_SCHEMES && (
                <Dialog open={addModalOpen} onOpenChange={setAddModalOpen}>
                  <DialogTrigger asChild>
                    <Button size="sm" variant="outline" className="h-9 text-xs font-semibold">
                      <Plus className="size-3.5 mr-1" />
                      {t("compare.addSchemeBtn", "Add Scheme")}
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                      <DialogTitle className="text-base font-bold">
                        {t("compare.addModalTitle", "Add Scheme to Comparison")}
                      </DialogTitle>
                      <DialogDescription className="text-xs">
                        {t(
                          "compare.addModalDesc",
                          "Select an additional government scheme to compare side-by-side (up to {{max}} schemes).",
                          { max: MAX_COMPARE_SCHEMES }
                        )}
                      </DialogDescription>
                    </DialogHeader>

                    <div className="space-y-3 pt-2">
                      <div className="relative">
                        <Search className="size-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                        <Input
                          placeholder={t("compare.searchSchemePlaceholder", "Search by name or category…")}
                          value={pickerSearch}
                          onChange={(e) => setPickerSearch(e.target.value)}
                          className="pl-9 text-xs"
                        />
                      </div>

                      <div className="max-h-64 overflow-y-auto space-y-2 pr-1">
                        {availableToAdd.length === 0 ? (
                          <div className="text-center py-6 text-xs text-muted-foreground">
                            {t("compare.noMoreSchemes", "No additional schemes matching search.")}
                          </div>
                        ) : (
                          availableToAdd.map((scheme) => {
                            const name = scheme.name?.[lang] || scheme.name?.en || scheme.id
                            const cat = scheme.category || scheme.type
                            return (
                              <div
                                key={scheme.id}
                                className="flex items-center justify-between p-2.5 rounded-lg border border-border hover:bg-muted/60 transition-colors gap-2"
                              >
                                <div className="space-y-0.5 min-w-0 flex-1">
                                  <p className="font-semibold text-xs text-foreground truncate">
                                    {name}
                                  </p>
                                  <div className="flex items-center gap-1.5 text-[11px] text-muted-foreground">
                                    <Badge variant="secondary" className="text-[10px] px-1.5 py-0">
                                      {t(`categories.${cat}`, { defaultValue: cat })}
                                    </Badge>
                                    <span>· {fmtINR(scheme.maxProjectCost)}</span>
                                  </div>
                                </div>
                                <Button
                                  size="sm"
                                  onClick={() => {
                                    addScheme(scheme.id)
                                    setAddModalOpen(false)
                                  }}
                                  className="h-8 text-xs font-semibold shrink-0"
                                >
                                  {t("compare.add", "Add")}
                                </Button>
                              </div>
                            )
                          })
                        )}
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>
              )}

              {/* Share Button */}
              {comparedSchemes.length > 0 && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleShare}
                  className="h-9 text-xs font-medium"
                  title={t("compare.shareComparison", "Share comparison link")}
                >
                  {copied ? (
                    <>
                      <Check className="size-3.5 mr-1 text-emerald-600" />
                      {t("schemeDetails.copied", "Copied")}
                    </>
                  ) : (
                    <>
                      <Share2 className="size-3.5 mr-1" />
                      {t("schemeDetails.share", "Share")}
                    </>
                  )}
                </Button>
              )}

              {/* Print Button */}
              {comparedSchemes.length >= 2 && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handlePrint}
                  className="h-9 text-xs font-medium"
                  title={t("schemeDetails.printScheme", "Print comparison matrix")}
                >
                  <Printer className="size-3.5 mr-1 text-muted-foreground" />
                  {t("schemeDetails.print", "Print / PDF")}
                </Button>
              )}

              {/* Clear All Button */}
              {comparedSchemes.length > 0 && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={clearAll}
                  className="h-9 text-xs text-muted-foreground hover:text-destructive"
                  title={t("compare.clearAll", "Clear all")}
                >
                  <Trash2 className="size-3.5 mr-1" />
                  <span className="hidden sm:inline">{t("compare.clearAll", "Clear all")}</span>
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Main Comparison Area */}
      <main className="mx-auto max-w-7xl px-4 py-6">
        {/* Loading State */}
        {loading && comparedSchemes.length === 0 && (
          <div className="py-20 text-center space-y-3">
            <div className="inline-block size-8 animate-spin rounded-full border-4 border-primary border-r-transparent" />
            <p className="text-sm text-muted-foreground">{t("common.loading", "Loading…")}</p>
          </div>
        )}

        {/* Empty State (< 2 Schemes) */}
        {!loading && comparedSchemes.length < 2 && (
          <Card className="border-dashed border-2 border-border/80 text-center p-8 sm:p-12 my-6">
            <CardContent className="space-y-4 max-w-lg mx-auto p-0">
              <div className="mx-auto flex size-14 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                <Layers className="size-7" />
              </div>
              <div className="space-y-1.5">
                <h2 className="font-display text-xl font-bold text-foreground">
                  {comparedSchemes.length === 1
                    ? t("compare.selectOneMoreTitle", "Select At Least 1 More Scheme")
                    : t("compare.emptyTitle", "Select At Least 2 Schemes to Compare")}
                </h2>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {comparedSchemes.length === 1
                    ? t(
                        "compare.selectOneMoreBody",
                        "You have currently selected 1 scheme. Add another scheme from the catalog to compare interest rates, loan limits, coverage, and moratorium side-by-side."
                      )
                    : t(
                        "compare.emptyBody",
                        "Browse the scheme catalog and tap 'Compare' on cards to compare up to 4 central and state financial assistance programs side-by-side."
                      )}
                </p>
              </div>

              {/* Single Selected Scheme Preview if 1 is chosen */}
              {comparedSchemes.length === 1 && (
                <div className="p-3 bg-muted/50 rounded-xl border border-border flex items-center justify-between gap-3 text-left">
                  <div>
                    <span className="text-[11px] text-muted-foreground font-medium uppercase tracking-wider block">
                      {t("compare.selectedScheme", "Selected Scheme:")}
                    </span>
                    <p className="font-semibold text-sm text-foreground">
                      {comparedSchemes[0].name?.[lang] || comparedSchemes[0].name?.en}
                    </p>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => removeScheme(comparedSchemes[0].id)}
                    className="h-8 text-xs text-muted-foreground hover:text-destructive"
                  >
                    <X className="size-3.5 mr-1" />
                    {t("compare.remove", "Remove")}
                  </Button>
                </div>
              )}

              <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
                <Button asChild size="lg" className="min-h-[44px] font-semibold text-sm px-6">
                  <Link to="/schemes">
                    {t("schemeDetails.browseCatalogCta", "Browse All Schemes")}
                  </Link>
                </Button>

                {/* Quick Add from available seed schemes */}
                <Dialog open={addModalOpen} onOpenChange={setAddModalOpen}>
                  <DialogTrigger asChild>
                    <Button variant="outline" size="lg" className="min-h-[44px] font-semibold text-sm px-6">
                      <Plus className="size-4 mr-1.5" />
                      {t("compare.quickAddBtn", "Add From List")}
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                      <DialogTitle className="text-base font-bold">
                        {t("compare.addModalTitle", "Add Scheme to Comparison")}
                      </DialogTitle>
                    </DialogHeader>
                    <div className="space-y-3 pt-2">
                      <div className="relative">
                        <Search className="size-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                        <Input
                          placeholder={t("compare.searchSchemePlaceholder", "Search by name or category…")}
                          value={pickerSearch}
                          onChange={(e) => setPickerSearch(e.target.value)}
                          className="pl-9 text-xs"
                        />
                      </div>
                      <div className="max-h-64 overflow-y-auto space-y-2 pr-1">
                        {availableToAdd.map((scheme) => {
                          const name = scheme.name?.[lang] || scheme.name?.en || scheme.id
                          const cat = scheme.category || scheme.type
                          return (
                            <div
                              key={scheme.id}
                              className="flex items-center justify-between p-2.5 rounded-lg border border-border hover:bg-muted/60 transition-colors gap-2"
                            >
                              <div className="space-y-0.5 min-w-0 flex-1">
                                <p className="font-semibold text-xs text-foreground truncate">
                                  {name}
                                </p>
                                <div className="flex items-center gap-1.5 text-[11px] text-muted-foreground">
                                  <Badge variant="secondary" className="text-[10px] px-1.5 py-0">
                                    {t(`categories.${cat}`, { defaultValue: cat })}
                                  </Badge>
                                  <span>· {fmtINR(scheme.maxProjectCost)}</span>
                                </div>
                              </div>
                              <Button
                                size="sm"
                                onClick={() => {
                                  addScheme(scheme.id)
                                  setAddModalOpen(false)
                                }}
                                className="h-8 text-xs font-semibold shrink-0"
                              >
                                {t("compare.add", "Add")}
                              </Button>
                            </div>
                          )
                        })}
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
            </CardContent>
          </Card>
        )}

        {/* 2 to 4 Schemes Comparison Table Matrix */}
        {comparedSchemes.length >= 2 && (
          <div className="space-y-4">
            {/* Table Container with Horizontal Scroll */}
            <div className="rounded-2xl border border-border bg-card shadow-sm overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full border-collapse text-left text-sm">
                  {/* Sticky Top Header: Scheme Titles & Quick Actions */}
                  <thead>
                    <tr className="border-b border-border bg-muted/40 divide-x divide-border">
                      {/* Left Header Corner */}
                      <th
                        scope="col"
                        className="w-56 sm:w-64 p-4 align-bottom bg-muted/50 sticky left-0 z-20 backdrop-blur-xs font-display text-xs uppercase tracking-wider font-bold text-muted-foreground"
                      >
                        <div className="flex items-center justify-between gap-1">
                          <span>{t("compare.criteriaHeader", "Key Dimension")}</span>
                          {highlightDifferences && (
                            <span className="inline-flex items-center gap-1 text-[10px] text-amber-700 dark:text-amber-400 font-semibold bg-amber-100 dark:bg-amber-950/80 px-1.5 py-0.5 rounded">
                              <Sparkles className="size-3" />
                              {t("compare.diffOn", "Diffs On")}
                            </span>
                          )}
                        </div>
                      </th>

                      {/* Scheme Column Headers */}
                      {comparedSchemes.map((scheme) => {
                        const schemeName = scheme.name?.[lang] || scheme.name?.en || scheme.id
                        const catKey = scheme.category || scheme.type
                        return (
                          <th
                            key={scheme.id}
                            scope="col"
                            className="min-w-[240px] sm:min-w-[280px] max-w-[320px] p-4 align-top space-y-2 bg-card"
                          >
                            <div className="flex items-start justify-between gap-2">
                              <div className="flex flex-wrap items-center gap-1.5">
                                <Badge variant="secondary" className="capitalize text-[11px] font-semibold">
                                  {t(`categories.${catKey}`, { defaultValue: catKey })}
                                </Badge>
                                {scheme.verified && (
                                  <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 rounded px-1.5 py-0.5">
                                    <ShieldCheck className="size-3" />
                                    {t("schemes.verifiedBadge", "Verified")}
                                  </span>
                                )}
                              </div>

                              {/* Remove Scheme Trigger */}
                              <button
                                type="button"
                                onClick={() => removeScheme(scheme.id)}
                                className="flex size-7 items-center justify-center rounded-md text-muted-foreground hover:bg-destructive/10 hover:text-destructive transition-colors focus-visible:outline-ring"
                                title={t("compare.removeSchemeTitle", "Remove {{name}} from comparison", {
                                  name: schemeName,
                                })}
                                aria-label={t("compare.removeSchemeTitle", "Remove {{name}} from comparison", {
                                  name: schemeName,
                                })}
                              >
                                <X className="size-4" />
                              </button>
                            </div>

                            {/* Scheme Name with Link */}
                            <h3 className="font-display text-base font-bold text-foreground leading-snug">
                              <Link
                                to={`/schemes/${scheme.id}`}
                                className="hover:text-primary transition-colors focus-visible:outline-ring"
                              >
                                {schemeName}
                              </Link>
                            </h3>

                            {/* View Details Link */}
                            <Button
                              asChild
                              variant="ghost"
                              size="sm"
                              className="h-7 text-xs font-semibold text-primary hover:text-primary/80 -ml-2.5 px-2"
                            >
                              <Link to={`/schemes/${scheme.id}`}>
                                {t("schemes.viewDetails", "View Full Details")}
                                <ExternalLink className="size-3 ml-1" />
                              </Link>
                            </Button>
                          </th>
                        )
                      })}
                    </tr>
                  </thead>

                  {/* Table Body: 12 Structured Comparison Dimensions */}
                  <tbody className="divide-y divide-border">
                    {dimensions.map((dim, dimIndex) => {
                      const isDiff = rowHasDifference(dim)
                      const isHighlighted = highlightDifferences && isDiff

                      return (
                        <tr
                          key={dim.id}
                          className={`divide-x divide-border transition-colors ${
                            isHighlighted
                              ? "bg-amber-500/10 dark:bg-amber-950/30 border-l-4 border-l-amber-500"
                              : dimIndex % 2 === 0
                              ? "bg-muted/10 hover:bg-muted/30"
                              : "bg-background hover:bg-muted/30"
                          }`}
                        >
                          {/* Row Dimension Label (Sticky Left) */}
                          <th
                            scope="row"
                            className={`w-56 sm:w-64 p-3.5 sm:p-4 align-top sticky left-0 z-10 font-medium text-xs text-foreground backdrop-blur-xs ${
                              isHighlighted
                                ? "bg-amber-100/90 dark:bg-amber-950/90 border-r-2 border-r-amber-500/50"
                                : "bg-card/95"
                            }`}
                          >
                            <div className="flex items-start gap-2">
                              <dim.icon
                                className={`size-4 shrink-0 mt-0.5 ${
                                  isHighlighted ? "text-amber-600 dark:text-amber-400 font-bold" : "text-primary"
                                }`}
                              />
                              <div>
                                <span className="font-semibold block leading-tight">
                                  {t(dim.titleKey, dim.defaultTitle)}
                                </span>
                                {isHighlighted && (
                                  <span className="text-[10px] text-amber-700 dark:text-amber-300 font-semibold mt-0.5 block">
                                    {t("compare.diffNotice", "Values differ across schemes")}
                                  </span>
                                )}
                              </div>
                            </div>
                          </th>

                          {/* Scheme Value Cells */}
                          {comparedSchemes.map((scheme) => (
                            <td
                              key={scheme.id}
                              className="p-3.5 sm:p-4 align-top text-xs leading-relaxed"
                            >
                              {dim.renderCell(scheme, lang, t)}
                            </td>
                          ))}
                        </tr>
                      )
                    })}

                    {/* Bottom Row: Quick Action CTAs */}
                    <tr className="divide-x divide-border bg-muted/40 border-t-2 border-border print:hidden">
                      <th
                        scope="row"
                        className="w-56 sm:w-64 p-4 align-middle sticky left-0 z-10 bg-muted/60 backdrop-blur-xs text-xs font-bold text-muted-foreground uppercase tracking-wider"
                      >
                        {t("compare.quickActions", "Quick Actions")}
                      </th>
                      {comparedSchemes.map((scheme) => {
                        const minRate = scheme.interestRateDetails?.min ?? scheme.rateRange?.min ?? 6.0
                        const minTenure = scheme.repaymentTerms?.tenureRangeMonths?.min ?? scheme.tenureRangeMonths?.min ?? 12
                        const maxTenure = scheme.repaymentTerms?.tenureRangeMonths?.max ?? scheme.tenureRangeMonths?.max ?? 60
                        const minMoratorium = scheme.moratoriumDetails?.minMonths ?? scheme.moratorium?.minMonths ?? 0
                        const interestAccrues = scheme.moratoriumDetails?.interestAccrues ?? scheme.moratorium?.interestAccrues ?? false

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

                        return (
                          <td key={scheme.id} className="p-4 align-top space-y-2 bg-card">
                            <Button
                              asChild
                              size="sm"
                              className="w-full text-xs font-semibold min-h-[40px] shadow-xs"
                            >
                              <Link to={`/calculator?${calcParams}`}>
                                <Calculator className="size-3.5 mr-1.5 text-accent" />
                                {t("schemes.calculateEmi", "Calculate EMI")}
                              </Link>
                            </Button>

                            <Button
                              asChild
                              variant="outline"
                              size="sm"
                              className="w-full text-xs font-medium min-h-[40px]"
                            >
                              <Link to={`/partners?${partnerParams}`}>
                                <Compass className="size-3.5 mr-1.5 text-primary" />
                                {t("schemes.findPartners", "Find Partners")}
                              </Link>
                            </Button>
                          </td>
                        )
                      })}
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            {/* Matrix Guidance Note */}
            <div className="rounded-xl border border-border/80 bg-muted/30 p-4 flex items-start gap-3 text-xs text-muted-foreground leading-relaxed">
              <Info className="size-4 text-primary shrink-0 mt-0.5" />
              <div>
                <span className="font-semibold text-foreground mr-1">
                  {t("compare.matrixNoteTitle", "Understanding Scheme Comparisons:")}
                </span>
                {t(
                  "compare.matrixNoteBody",
                  "Direct loan sanctioning is handled through designated Channel Partners (SCAs, Banks, RRBs). Exact interest rates and subsidy eligibility may vary based on applicant category verification and project appraisal."
                )}
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}
