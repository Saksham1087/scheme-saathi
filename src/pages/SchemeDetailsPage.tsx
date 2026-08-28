import { useState, useEffect } from "react"
import { useParams, Link } from "react-router-dom"
import { useTranslation } from "react-i18next"
import {
  BookOpen,
  Users,
  Scale,
  Coins,
  Percent,
  Layers,
  Clock,
  FileCheck2,
  ListChecks,
  Compass,
  Milestone,
  ExternalLink,
  ShieldCheck,
  AlertTriangle,
  CheckCircle2,
  Building2,
  Calendar,
  AlertCircle,
  Check,
  FileText,
  Search,
} from "lucide-react"
import { SchemeDetailsHeader } from "@/components/schemes/SchemeDetailsHeader"
import { SchemeSectionCard } from "@/components/schemes/SchemeSectionCard"
import { SchemeActionSidebar } from "@/components/schemes/SchemeActionSidebar"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card } from "@/components/ui/card"
import { fetchSchemeById } from "@/services/schemeService"
import { fmtINR } from "@/lib/format"
import type { Scheme } from "@/types"

export default function SchemeDetailsPage() {
  const { id } = useParams<{ id: string }>()
  const { t, i18n } = useTranslation()
  const lang = (i18n.language === "hi" ? "hi" : "en") as "en" | "hi"

  const [scheme, setScheme] = useState<Scheme | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let cancelled = false
    async function loadScheme() {
      if (!id) {
        setLoading(false)
        return
      }
      setLoading(true)
      try {
        const data = await fetchSchemeById(id)
        if (!cancelled) {
          setScheme(data)
          if (data) {
            const title = data.name[lang] || data.name.en || "Scheme Details"
            document.title = `${title} | SchemeSathi`
          }
        }
      } catch (err) {
        console.error("Error loading scheme:", err)
      } finally {
        if (!cancelled) {
          setLoading(false)
        }
      }
    }
    loadScheme()
    return () => {
      cancelled = true
    }
  }, [id, lang])

  // Loading state
  if (loading) {
    return (
      <div className="container max-w-7xl mx-auto px-4 py-8 space-y-8 animate-pulse">
        <div className="h-6 w-36 bg-muted rounded-md" />
        <div className="h-56 bg-muted rounded-2xl" />
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-8 space-y-6">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-44 bg-muted rounded-xl" />
            ))}
          </div>
          <div className="lg:col-span-4 space-y-4">
            <div className="h-72 bg-muted rounded-xl" />
          </div>
        </div>
      </div>
    )
  }

  // Not found state (404 UI)
  if (!scheme) {
    return (
      <div className="container max-w-3xl mx-auto px-4 py-16 text-center">
        <Card className="border-border/80 p-8 shadow-sm">
          <div className="mx-auto flex size-14 items-center justify-center rounded-full bg-muted text-muted-foreground mb-4">
            <Search className="size-7" />
          </div>
          <h2 className="font-display text-2xl font-bold text-foreground">
            {t("schemeDetails.notFoundTitle", "Scheme Not Found")}
          </h2>
          <p className="text-muted-foreground mt-2 max-w-md mx-auto text-sm leading-relaxed">
            {t(
              "schemeDetails.notFoundBody",
              "The requested government scheme could not be found or may have been updated. Explore all available schemes in the catalog."
            )}
          </p>
          <div className="mt-6 flex justify-center gap-3">
            <Button asChild size="lg" className="min-h-[44px]">
              <Link to="/schemes">
                {t("schemeDetails.browseCatalogCta", "Browse All Schemes")}
              </Link>
            </Button>
          </div>
        </Card>
      </div>
    )
  }

  const isVerified = scheme.verified ?? true
  const officialUrl = scheme.officialSourceUrl || scheme.officialUrl || "https://nsfdc.nic.in"
  const lastUpdated = scheme.sourceLastUpdated || scheme.lastUpdated || "2026-08-01"

  const minRate = scheme.interestRateDetails?.min ?? scheme.rateRange?.min ?? 6.0
  const maxRate = scheme.interestRateDetails?.max ?? scheme.rateRange?.max ?? 9.0
  const minTenure = scheme.repaymentTerms?.tenureRangeMonths?.min ?? scheme.tenureRangeMonths?.min ?? 12
  const maxTenure = scheme.repaymentTerms?.tenureRangeMonths?.max ?? scheme.tenureRangeMonths?.max ?? 60
  const minMoratorium = scheme.moratoriumDetails?.minMonths ?? scheme.moratorium?.minMonths ?? 0
  const maxMoratorium = scheme.moratoriumDetails?.maxMonths ?? scheme.moratorium?.maxMonths ?? 0
  const interestAccrues = scheme.moratoriumDetails?.interestAccrues ?? scheme.moratorium?.interestAccrues ?? false
  const coveragePct = scheme.financialAssistance?.coverageMaxPct ?? scheme.coverageMaxPct ?? 90
  const promoterShare = Math.max(0, 100 - coveragePct)

  const partnerParams = new URLSearchParams({
    type: scheme.type || "micro",
  }).toString()

  // 14 Standardized Section TOC definitions
  const sections = [
    { id: "overview", label: t("schemeDetails.secOverview", "Overview & Objectives"), number: 1 },
    { id: "who-can-apply", label: t("schemeDetails.secWhoCanApply", "Who Can Apply & Target Beneficiaries"), number: 2 },
    { id: "eligibility", label: t("schemeDetails.secEligibility", "Eligibility Criteria Matrix"), number: 3 },
    { id: "financial-assistance", label: t("schemeDetails.secFinancial", "Financial Assistance & Coverage"), number: 4 },
    { id: "interest-rate", label: t("schemeDetails.secInterest", "Interest Rate & Concessions"), number: 5 },
    { id: "loan-limits", label: t("schemeDetails.secLoanLimits", "Loan Limits & Project Cost Caps"), number: 6 },
    { id: "moratorium", label: t("schemeDetails.secMoratorium", "Moratorium Period & Interest Accrual"), number: 7 },
    { id: "repayment", label: t("schemeDetails.secRepayment", "Repayment Schedule & Tenure"), number: 8 },
    { id: "documents", label: t("schemeDetails.secDocuments", "Required Documents Checklist"), number: 9 },
    { id: "channel-partners", label: t("schemeDetails.secPartners", "Authorized Channel Partners"), number: 10 },
    { id: "application-process", label: t("schemeDetails.secProcess", "Step-by-Step Application Process"), number: 11 },
    { id: "official-source", label: t("schemeDetails.secSource", "Official Source Attribution"), number: 12 },
    { id: "last-updated", label: t("schemeDetails.secLastUpdated", "Last Updated & Verification"), number: 13 },
    { id: "disclaimer", label: t("schemeDetails.secDisclaimer", "Statutory Disclaimer"), number: 14 },
  ]

  return (
    <div className="container max-w-7xl mx-auto px-4 py-6 sm:py-8 space-y-8">
      {/* Unverified Global Warning Banner (if unverified) */}
      {!isVerified && (
        <div className="rounded-xl border border-amber-300 bg-amber-50 p-4 text-amber-950 dark:border-amber-700/80 dark:bg-amber-950/50 dark:text-amber-200 flex items-start gap-3 shadow-xs">
          <AlertTriangle className="size-5 shrink-0 text-amber-600 dark:text-amber-400 mt-0.5" />
          <div className="space-y-0.5 text-xs sm:text-sm">
            <p className="font-bold">
              {t("schemeDetails.unverifiedWarning", "Information not independently verified")}
            </p>
            <p className="text-amber-900/80 dark:text-amber-300/80 text-xs">
              {t(
                "schemeDetails.unverifiedBannerText",
                "This scheme dataset is awaiting official ministry re-verification. Please verify all interest rates and subsidy rules with the authorized Channelizing Agency before submitting an application."
              )}
            </p>
          </div>
        </div>
      )}

      {/* Header */}
      <SchemeDetailsHeader scheme={scheme} />

      {/* 2-Column Responsive Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Main Content: 14 Standardized Sections */}
        <main className="lg:col-span-8 space-y-6">
          {/* Section 1: Overview & Objectives */}
          <SchemeSectionCard
            id="overview"
            sectionNumber={1}
            title={t("schemeDetails.secOverview", "Overview & Objectives")}
            icon={<BookOpen className="size-5" />}
            subtitle={t("schemeDetails.overviewSubtitle", "High-level summary, purpose, and statutory goals of the scheme")}
            isVerified={isVerified}
          >
            <div className="space-y-4 leading-relaxed">
              <p className="text-foreground/90 text-sm sm:text-base font-normal">
                {scheme.overview?.[lang] || scheme.overview?.en || scheme.description?.[lang] || scheme.description?.en}
              </p>

              {scheme.purpose && (
                <div className="rounded-lg bg-muted/40 p-3.5 border border-border/60 text-xs space-y-1">
                  <span className="font-semibold text-foreground flex items-center gap-1.5">
                    <Milestone className="size-3.5 text-primary" />
                    {t("schemeDetails.coreObjective", "Core Objective:")}
                  </span>
                  <p className="text-muted-foreground">
                    {scheme.purpose[lang] || scheme.purpose.en}
                  </p>
                </div>
              )}
            </div>
          </SchemeSectionCard>

          {/* Section 2: Who Can Apply & Target Beneficiaries */}
          <SchemeSectionCard
            id="who-can-apply"
            sectionNumber={2}
            title={t("schemeDetails.secWhoCanApply", "Who Can Apply & Target Beneficiaries")}
            icon={<Users className="size-5" />}
            subtitle={t("schemeDetails.whoCanApplySubtitle", "Target demographic groups, occupations, and priority beneficiaries")}
            isVerified={isVerified}
          >
            <div className="space-y-3">
              {scheme.whoCanApply && scheme.whoCanApply.length > 0 ? (
                <ul className="space-y-2.5">
                  {scheme.whoCanApply.map((item, idx) => (
                    <li key={idx} className="flex items-start gap-2.5 text-sm">
                      <CheckCircle2 className="size-4 shrink-0 text-emerald-600 dark:text-emerald-400 mt-0.5" />
                      <span>{item[lang] || item.en}</span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-muted-foreground text-xs italic">
                  {t("schemeDetails.standardBeneficiaryText", "Eligible members of Scheduled Castes and allied priority categories.")}
                </p>
              )}
            </div>
          </SchemeSectionCard>

          {/* Section 3: Eligibility Criteria Matrix */}
          <SchemeSectionCard
            id="eligibility"
            sectionNumber={3}
            title={t("schemeDetails.secEligibility", "Eligibility Criteria Matrix")}
            icon={<Scale className="size-5" />}
            subtitle={t("schemeDetails.eligibilitySubtitle", "Caste, family income ceiling, age bounds, gender, and education rules")}
            isVerified={isVerified}
          >
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {/* Caste */}
                <div className="rounded-lg border border-border/80 bg-muted/20 p-3 text-xs space-y-1">
                  <span className="text-muted-foreground font-medium">
                    {t("schemeDetails.casteCategory", "Caste / Category")}
                  </span>
                  <p className="font-semibold text-foreground text-sm">
                    {scheme.eligibilityCriteria?.targetCaste?.[lang] ||
                      scheme.eligibilityCriteria?.targetCaste?.en ||
                      t("schemeDetails.scTarget", "Scheduled Caste (SC)")}
                  </p>
                </div>

                {/* Income Ceiling */}
                <div className="rounded-lg border border-border/80 bg-muted/20 p-3 text-xs space-y-1">
                  <span className="text-muted-foreground font-medium">
                    {t("schemeDetails.annualIncomeCeiling", "Annual Family Income Ceiling")}
                  </span>
                  <p className="font-semibold text-foreground text-sm">
                    {fmtINR(scheme.eligibilityCriteria?.incomeCeiling ?? scheme.incomeCeiling ?? 500000)}{" "}
                    {t("schemes.perAnnum", "p.a.")}
                  </p>
                </div>

                {/* Age Limit */}
                <div className="rounded-lg border border-border/80 bg-muted/20 p-3 text-xs space-y-1">
                  <span className="text-muted-foreground font-medium">
                    {t("schemeDetails.ageLimit", "Age Limit")}
                  </span>
                  <p className="font-semibold text-foreground text-sm">
                    {scheme.eligibilityCriteria?.ageRange
                      ? `${scheme.eligibilityCriteria.ageRange.min} – ${scheme.eligibilityCriteria.ageRange.max ?? 60} ${t("schemeDetails.yearsOld", "years")}`
                      : `18 – 60 ${t("schemeDetails.yearsOld", "years")}`}
                  </p>
                </div>

                {/* Gender */}
                <div className="rounded-lg border border-border/80 bg-muted/20 p-3 text-xs space-y-1">
                  <span className="text-muted-foreground font-medium">
                    {t("schemeDetails.genderEligibility", "Gender Eligibility")}
                  </span>
                  <p className="font-semibold text-foreground text-sm">
                    {scheme.eligibilityCriteria?.gender?.[lang] ||
                      scheme.eligibilityCriteria?.gender?.en ||
                      t("schemeDetails.allGenders", "All Genders")}
                  </p>
                </div>
              </div>

              {/* Education Requirement */}
              <div className="rounded-lg border border-border/80 bg-muted/20 p-3.5 text-xs space-y-1">
                <span className="text-muted-foreground font-medium">
                  {t("schemeDetails.educationQualification", "Educational Qualification")}
                </span>
                <p className="font-semibold text-foreground text-sm">
                  {scheme.eligibilityCriteria?.educationDescription?.[lang] ||
                    scheme.eligibilityCriteria?.educationDescription?.en ||
                    t("schemeDetails.noMinEdu", "No minimum qualification mandatory")}
                </p>
              </div>

              {/* Other Requirements */}
              {scheme.eligibilityCriteria?.otherRequirements &&
                scheme.eligibilityCriteria.otherRequirements.length > 0 && (
                  <div className="pt-2">
                    <span className="text-xs font-semibold text-muted-foreground block mb-2">
                      {t("schemeDetails.additionalConditions", "Additional Conditions:")}
                    </span>
                    <ul className="space-y-1.5">
                      {scheme.eligibilityCriteria.otherRequirements.map((req, idx) => (
                        <li key={idx} className="flex items-start gap-2 text-xs text-foreground/80">
                          <span className="text-primary font-bold">•</span>
                          <span>{req[lang] || req.en}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
            </div>
          </SchemeSectionCard>

          {/* Section 4: Financial Assistance & Coverage % */}
          <SchemeSectionCard
            id="financial-assistance"
            sectionNumber={4}
            title={t("schemeDetails.secFinancial", "Financial Assistance & Coverage")}
            icon={<Coins className="size-5" />}
            subtitle={t("schemeDetails.financialSubtitle", "Maximum quantum of loan, coverage share percentage, and margin money")}
            isVerified={isVerified}
          >
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-center">
                <div className="rounded-xl bg-primary/5 dark:bg-primary/10 border border-primary/20 p-4">
                  <span className="text-xs text-muted-foreground font-medium">
                    {t("schemeDetails.maxAssistanceCap", "Max Assistance Cap")}
                  </span>
                  <p className="font-display text-xl font-bold text-foreground mt-1">
                    {fmtINR(scheme.maxProjectCost)}
                  </p>
                </div>

                <div className="rounded-xl bg-muted/40 border border-border p-4">
                  <span className="text-xs text-muted-foreground font-medium">
                    {t("schemeDetails.corporationCoverage", "Corporation Share")}
                  </span>
                  <p className="font-display text-xl font-bold text-primary mt-1">
                    {coveragePct}%
                  </p>
                  <span className="text-[11px] text-muted-foreground">
                    {t("schemeDetails.ofProjectCost", "of project cost")}
                  </span>
                </div>

                <div className="rounded-xl bg-muted/40 border border-border p-4">
                  <span className="text-xs text-muted-foreground font-medium">
                    {t("schemeDetails.promoterContribution", "Promoter / SCA Share")}
                  </span>
                  <p className="font-display text-xl font-bold text-foreground mt-1">
                    {promoterShare}%
                  </p>
                  <span className="text-[11px] text-muted-foreground">
                    {t("schemeDetails.beneficiaryMargin", "beneficiary margin")}
                  </span>
                </div>
              </div>

              {/* Funding Pattern */}
              {scheme.financialAssistance?.fundingPattern && (
                <div className="rounded-lg bg-muted/30 p-3.5 border border-border/60 text-xs space-y-1">
                  <span className="font-semibold text-foreground">
                    {t("schemeDetails.fundingPatternTitle", "Funding Pattern Breakdown:")}
                  </span>
                  <p className="text-muted-foreground">
                    {scheme.financialAssistance.fundingPattern[lang] ||
                      scheme.financialAssistance.fundingPattern.en}
                  </p>
                </div>
              )}

              {/* Subsidy Info */}
              {scheme.financialAssistance?.subsidyDetails && (
                <div className="rounded-lg bg-emerald-50/60 dark:bg-emerald-950/30 p-3.5 border border-emerald-200 dark:border-emerald-800/60 text-xs space-y-1">
                  <span className="font-semibold text-emerald-900 dark:text-emerald-300 flex items-center gap-1.5">
                    <Check className="size-3.5" />
                    {t("schemeDetails.subsidyGrantTitle", "Subsidy / Grant Policy:")}
                  </span>
                  <p className="text-emerald-950/80 dark:text-emerald-200/80">
                    {scheme.financialAssistance.subsidyDetails[lang] ||
                      scheme.financialAssistance.subsidyDetails.en}
                  </p>
                </div>
              )}
            </div>
          </SchemeSectionCard>

          {/* Section 5: Interest Rate & Concessions */}
          <SchemeSectionCard
            id="interest-rate"
            sectionNumber={5}
            title={t("schemeDetails.secInterest", "Interest Rate & Concessions")}
            icon={<Percent className="size-5" />}
            subtitle={t("schemeDetails.interestSubtitle", "Concessional base rate, rebates for women entrepreneurs, and timely repayment")}
            isVerified={isVerified}
          >
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 p-4 rounded-xl border border-border bg-muted/30">
                <div className="space-y-1">
                  <span className="text-xs text-muted-foreground font-medium">
                    {t("schemeDetails.beneficiaryLandingRate", "Beneficiary Interest Rate")}
                  </span>
                  <p className="font-display text-2xl font-bold text-primary">
                    {minRate}% – {maxRate}%{" "}
                    <span className="text-sm font-normal text-muted-foreground">
                      {t("schemes.perAnnum", "p.a.")}
                    </span>
                  </p>
                </div>
                <Badge variant="secondary" className="text-xs font-semibold px-3 py-1">
                  {t("schemeDetails.subsidizedConcession", "Highly Subsidized Concessional Rate")}
                </Badge>
              </div>

              {/* Description */}
              {scheme.interestRateDetails?.rateDescription && (
                <p className="text-xs sm:text-sm text-foreground/80">
                  {scheme.interestRateDetails.rateDescription[lang] ||
                    scheme.interestRateDetails.rateDescription.en}
                </p>
              )}

              {/* Rebates */}
              {scheme.interestRateDetails?.rebates &&
                scheme.interestRateDetails.rebates.length > 0 && (
                  <div className="space-y-2 pt-2">
                    <span className="text-xs font-semibold text-muted-foreground block">
                      {t("schemeDetails.specialRebates", "Available Rebates & Incentives:")}
                    </span>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                      {scheme.interestRateDetails.rebates.map((rebate, idx) => (
                        <div
                          key={idx}
                          className="flex items-start gap-2 rounded-lg border border-border/80 bg-muted/20 p-2.5 text-xs text-foreground/90"
                        >
                          <Check className="size-3.5 text-emerald-600 shrink-0 mt-0.5" />
                          <span>{rebate[lang] || rebate.en}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
            </div>
          </SchemeSectionCard>

          {/* Section 6: Loan Limits & Project Cost Caps */}
          <SchemeSectionCard
            id="loan-limits"
            sectionNumber={6}
            title={t("schemeDetails.secLoanLimits", "Loan Limits & Project Cost Caps")}
            icon={<Layers className="size-5" />}
            subtitle={t("schemeDetails.loanLimitsSubtitle", "Unit cost specifications and allowable asset capital expenditures")}
            isVerified={isVerified}
          >
            <div className="space-y-4">
              <div className="rounded-lg bg-muted/40 p-3.5 border border-border/70 text-xs sm:text-sm">
                <span className="font-semibold text-foreground block mb-1">
                  {t("schemeDetails.unitCostSpec", "Unit Cost Ceiling:")}
                </span>
                <p className="text-muted-foreground">
                  {scheme.loanLimits?.unitCostLimit?.[lang] ||
                    scheme.loanLimits?.unitCostLimit?.en ||
                    `Up to ${fmtINR(scheme.maxProjectCost)} per unit or enterprise.`}
                </p>
              </div>

              {/* Allowable Expenditure */}
              {scheme.loanLimits?.allowableExpenditure &&
                scheme.loanLimits.allowableExpenditure.length > 0 && (
                  <div className="space-y-2">
                    <span className="text-xs font-semibold text-muted-foreground block">
                      {t("schemeDetails.allowableAssets", "Permitted Capital & Working Expenses:")}
                    </span>
                    <ul className="space-y-2">
                      {scheme.loanLimits.allowableExpenditure.map((item, idx) => (
                        <li key={idx} className="flex items-start gap-2.5 text-xs sm:text-sm text-foreground/80">
                          <CheckCircle2 className="size-4 shrink-0 text-primary mt-0.5" />
                          <span>{item[lang] || item.en}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
            </div>
          </SchemeSectionCard>

          {/* Section 7: Moratorium Period & Interest Accrual Policy */}
          <SchemeSectionCard
            id="moratorium"
            sectionNumber={7}
            title={t("schemeDetails.secMoratorium", "Moratorium Period & Interest Accrual")}
            icon={<Clock className="size-5" />}
            subtitle={t("schemeDetails.moratoriumSubtitle", "Repayment pause rules and policy regarding interest treatment during holiday")}
            isVerified={isVerified}
          >
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="rounded-xl border border-border bg-muted/30 p-4 text-xs space-y-1">
                  <span className="text-muted-foreground font-medium">
                    {t("schemeDetails.moratoriumDuration", "Moratorium Duration")}
                  </span>
                  <p className="font-display text-lg font-bold text-foreground">
                    {minMoratorium} – {maxMoratorium}{" "}
                    {t("schemes.months", "months")}
                  </p>
                  <p className="text-[11px] text-muted-foreground">
                    {t("schemeDetails.moratoriumHolidayNote", "Principal repayment pause")}
                  </p>
                </div>

                <div className="rounded-xl border border-border bg-muted/30 p-4 text-xs space-y-1">
                  <span className="text-muted-foreground font-medium">
                    {t("schemeDetails.interestAccrualPolicy", "Interest Accrual Policy")}
                  </span>
                  <p className="font-display text-lg font-bold text-foreground">
                    {interestAccrues
                      ? t("schemeDetails.accruesCapitalized", "Interest Accrues")
                      : t("schemeDetails.interestFreePause", "Interest-free pause")}
                  </p>
                  <p className="text-[11px] text-muted-foreground">
                    {interestAccrues
                      ? t("schemeDetails.accrualCapitalizedSub", "Capitalized into principal amortisation")
                      : t("schemeDetails.noInterestDuringPause", "Zero interest charged during holiday")}
                  </p>
                </div>
              </div>

              {scheme.moratoriumDetails?.policyDescription && (
                <p className="text-xs sm:text-sm text-foreground/80 leading-relaxed pt-1">
                  {scheme.moratoriumDetails.policyDescription[lang] ||
                    scheme.moratoriumDetails.policyDescription.en}
                </p>
              )}
            </div>
          </SchemeSectionCard>

          {/* Section 8: Repayment Schedule & Tenure */}
          <SchemeSectionCard
            id="repayment"
            sectionNumber={8}
            title={t("schemeDetails.secRepayment", "Repayment Schedule & Tenure")}
            icon={<FileCheck2 className="size-5" />}
            subtitle={t("schemeDetails.repaymentSubtitle", "Tenure bounds, installment frequency, and pre-closure foreclosure terms")}
            isVerified={isVerified}
          >
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="rounded-lg border border-border/80 bg-muted/20 p-3.5 text-xs space-y-1">
                  <span className="text-muted-foreground font-medium">
                    {t("schemeDetails.maxRepaymentTenure", "Repayment Tenure")}
                  </span>
                  <p className="font-semibold text-foreground text-sm">
                    {minTenure} – {maxTenure}{" "}
                    {t("schemes.months", "months")} (
                    {Math.max(1, Math.round(maxTenure / 12))} {t("schemes.years", "years")})
                  </p>
                </div>

                <div className="rounded-lg border border-border/80 bg-muted/20 p-3.5 text-xs space-y-1">
                  <span className="text-muted-foreground font-medium">
                    {t("schemeDetails.installmentFrequency", "Installment Frequency")}
                  </span>
                  <p className="font-semibold text-foreground text-sm">
                    {scheme.repaymentTerms?.repaymentFrequency?.[lang] ||
                      scheme.repaymentTerms?.repaymentFrequency?.en ||
                      t("schemeDetails.monthlyQuarterly", "Monthly or Quarterly installments")}
                  </p>
                </div>
              </div>

              {/* Prepayment / Foreclosure */}
              <div className="rounded-lg border border-border/80 bg-emerald-50/50 dark:bg-emerald-950/20 p-3 text-xs space-y-1">
                <span className="font-semibold text-emerald-900 dark:text-emerald-300">
                  {t("schemeDetails.preclosureTitle", "Pre-payment & Foreclosure:")}
                </span>
                <p className="text-emerald-950/80 dark:text-emerald-200/80">
                  {scheme.repaymentTerms?.penaltyDescription?.[lang] ||
                    scheme.repaymentTerms?.penaltyDescription?.en ||
                    t("schemeDetails.zeroForeclosure", "Zero foreclosure charges or pre-payment penalty for early settlement.")}
                </p>
              </div>
            </div>
          </SchemeSectionCard>

          {/* Section 9: Required Documents Checklist Preview */}
          <SchemeSectionCard
            id="documents"
            sectionNumber={9}
            title={t("schemeDetails.secDocuments", "Required Documents Checklist")}
            icon={<ListChecks className="size-5" />}
            subtitle={t("schemeDetails.documentsSubtitle", "Mandatory and supporting certificates required by channel partners")}
            isVerified={isVerified}
          >
            <div className="space-y-4">
              {scheme.requiredDocumentsList && scheme.requiredDocumentsList.length > 0 ? (
                <div className="space-y-4">
                  {scheme.requiredDocumentsList.map((catGroup, idx) => (
                    <div key={idx} className="space-y-2">
                      <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                        {catGroup.category[lang] || catGroup.category.en}
                      </h4>
                      <div className="space-y-2">
                        {catGroup.items.map((doc, docIdx) => (
                          <div
                            key={docIdx}
                            className="flex items-start justify-between gap-3 rounded-lg border border-border/70 bg-card p-3 text-xs"
                          >
                            <div className="space-y-0.5">
                              <div className="flex items-center gap-2">
                                <FileText className="size-3.5 text-primary shrink-0" />
                                <span className="font-semibold text-foreground text-xs sm:text-sm">
                                  {doc.name[lang] || doc.name.en}
                                </span>
                              </div>
                              {doc.description && (
                                <p className="text-muted-foreground text-[11px] pl-5.5">
                                  {doc.description[lang] || doc.description.en}
                                </p>
                              )}
                            </div>
                            <Badge
                              variant={doc.mandatory ? "default" : "outline"}
                              className="text-[10px] shrink-0 font-medium"
                            >
                              {doc.mandatory
                                ? t("schemeDetails.mandatoryDoc", "Mandatory")
                                : t("schemeDetails.optionalDoc", "Optional")}
                            </Badge>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-muted-foreground">
                  {t("schemeDetails.defaultDocsText", "Standard KYC, Caste Certificate, Income Certificate, and Project Quotation.")}
                </p>
              )}

              <div className="pt-2">
                <Button asChild variant="outline" size="sm" className="font-semibold text-xs gap-1.5 border-primary/40 hover:bg-primary/5">
                  <Link to={`/documents?scheme=${scheme.id}`}>
                    <FileCheck2 className="size-3.5 text-primary" />
                    <span>{t("documents.openInteractiveChecklist", "Open Interactive Document Checklist & Tracker")}</span>
                  </Link>
                </Button>
              </div>
            </div>
          </SchemeSectionCard>

          {/* Section 10: Authorized Channel Partners */}
          <SchemeSectionCard
            id="channel-partners"
            sectionNumber={10}
            title={t("schemeDetails.secPartners", "Authorized Channel Partners")}
            icon={<Compass className="size-5" />}
            subtitle={t("schemeDetails.partnersSubtitle", "Designated financial institutions and state corporations disbursing funds")}
            isVerified={isVerified}
          >
            <div className="space-y-4">
              <p className="text-xs sm:text-sm text-foreground/90">
                {scheme.channelPartnersInfo?.description?.[lang] ||
                  scheme.channelPartnersInfo?.description?.en ||
                  t(
                    "schemeDetails.defaultPartnerDesc",
                    "Disbursement is routed through State Channelizing Agencies (SCAs), Public Sector Banks, Regional Rural Banks, and accredited NBFC-MFIs."
                  )}
              </p>

              {/* Partner Badges */}
              <div className="flex flex-wrap gap-2 pt-1">
                {(scheme.channelPartnersInfo?.partnerTypes || ["SCA", "PSB", "RRB"]).map(
                  (ptype) => (
                    <Badge key={ptype} variant="secondary" className="text-xs font-semibold px-3 py-1">
                      <Building2 className="size-3.5 mr-1 text-primary" />
                      {ptype === "SCA"
                        ? t("schemeDetails.scaLabel", "State Channelizing Agency (SCA)")
                        : ptype === "PSB"
                        ? t("schemeDetails.psbLabel", "Public Sector Banks (PSBs)")
                        : ptype === "RRB"
                        ? t("schemeDetails.rrbLabel", "Regional Rural Banks (RRBs)")
                        : t("schemeDetails.mfiLabel", "NBFC-MFIs")}
                    </Badge>
                  )
                )}
              </div>

              {/* Jump to Partner Locator CTA */}
              <div className="pt-3 border-t border-border/60">
                <Button asChild variant="outline" size="sm" className="min-h-[44px] text-xs font-semibold">
                  <Link to={`/partners?${partnerParams}`}>
                    <Compass className="size-4 mr-2 text-primary" />
                    {t("schemeDetails.locateNearbyPartners", "Locate Nearest Channel Partner Offices")}
                  </Link>
                </Button>
              </div>
            </div>
          </SchemeSectionCard>

          {/* Section 11: Step-by-Step Application Process */}
          <SchemeSectionCard
            id="application-process"
            sectionNumber={11}
            title={t("schemeDetails.secProcess", "Step-by-Step Application Process")}
            icon={<Milestone className="size-5" />}
            subtitle={t("schemeDetails.processSubtitle", "How to apply from initial document collection to DBT loan disbursement")}
            isVerified={isVerified}
          >
            <div className="space-y-4">
              {scheme.applicationProcessSteps && scheme.applicationProcessSteps.length > 0 ? (
                <div className="relative pl-6 space-y-6 before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-border">
                  {scheme.applicationProcessSteps.map((step) => (
                    <div key={step.stepNumber} className="relative space-y-1">
                      <span className="absolute -left-6 top-0.5 flex size-5 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-primary-foreground">
                        {step.stepNumber}
                      </span>
                      <h4 className="font-semibold text-foreground text-xs sm:text-sm">
                        {step.title[lang] || step.title.en}
                      </h4>
                      <p className="text-muted-foreground text-xs sm:text-sm leading-relaxed">
                        {step.description[lang] || step.description.en}
                      </p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-muted-foreground">
                  {t("schemeDetails.defaultProcessText", "Submit required forms and project report to your district State SC Corporation.")}
                </p>
              )}
            </div>
          </SchemeSectionCard>

          {/* Section 12: Official Source Attribution Link */}
          <SchemeSectionCard
            id="official-source"
            sectionNumber={12}
            title={t("schemeDetails.secSource", "Official Source Attribution Link")}
            icon={<ExternalLink className="size-5" />}
            subtitle={t("schemeDetails.sourceSubtitle", "Direct attribution to ministerial guidelines and portal documentation")}
            isVerified={isVerified}
          >
            <div className="space-y-3">
              <p className="text-xs sm:text-sm text-muted-foreground">
                {t(
                  "schemeDetails.officialSourceNotice",
                  "This scheme overview is compiled from official notifications published by the Ministry of Social Justice & Empowerment and NSFDC."
                )}
              </p>
              <div className="pt-1">
                <Button asChild size="sm" className="min-h-[44px] text-xs font-semibold">
                  <a
                    href={officialUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2"
                  >
                    <ExternalLink className="size-4" />
                    <span>{t("schemeDetails.openOfficialSource", "Open Official Portal Link")}</span>
                  </a>
                </Button>
              </div>
            </div>
          </SchemeSectionCard>

          {/* Section 13: Last Updated & Verification Timestamp */}
          <SchemeSectionCard
            id="last-updated"
            sectionNumber={13}
            title={t("schemeDetails.secLastUpdated", "Last Updated & Verification Timestamp")}
            icon={<ShieldCheck className="size-5" />}
            subtitle={t("schemeDetails.lastUpdatedSubtitle", "Data audit timestamp and government publication verification status")}
            isVerified={isVerified}
          >
            <div className="space-y-3">
              <div className="flex flex-wrap items-center gap-4 text-xs">
                <div className="flex items-center gap-1.5 text-muted-foreground">
                  <Calendar className="size-4 text-primary" />
                  <span>
                    {t("schemeDetails.lastAuditDate", "Last Audit Date:")}{" "}
                    <strong className="text-foreground">{lastUpdated}</strong>
                  </span>
                </div>

                <div className="flex items-center gap-1.5">
                  {isVerified ? (
                    <Badge variant="default" className="bg-emerald-600 hover:bg-emerald-700 text-xs">
                      <ShieldCheck className="size-3 mr-1" />
                      {t("schemeDetails.verifiedGovtStatus", "Verified Official Guidelines")}
                    </Badge>
                  ) : (
                    <Badge variant="outline" className="border-amber-400 bg-amber-50 text-amber-900 text-xs">
                      <AlertCircle className="size-3 mr-1 text-amber-600" />
                      {t("schemeDetails.unverifiedWarning", "Information not independently verified")}
                    </Badge>
                  )}
                </div>
              </div>
            </div>
          </SchemeSectionCard>

          {/* Section 14: Statutory Official Disclaimer */}
          <SchemeSectionCard
            id="disclaimer"
            sectionNumber={14}
            title={t("schemeDetails.secDisclaimer", "Statutory Official Disclaimer")}
            icon={<AlertTriangle className="size-5 text-amber-600 dark:text-amber-400" />}
            subtitle={t("schemeDetails.disclaimerSubtitle", "Mandatory legal notice regarding scheme governance and partner sanction")}
            isVerified={isVerified}
          >
            <div className="rounded-xl border border-amber-300/80 bg-amber-50/70 dark:border-amber-800/80 dark:bg-amber-950/40 p-4 text-xs sm:text-sm text-amber-950 dark:text-amber-200 leading-relaxed space-y-2">
              <p className="font-semibold text-amber-900 dark:text-amber-300">
                {t("schemeDetails.statutoryNoticeTitle", "Statutory Government Notice:")}
              </p>
              <p>
                {scheme.disclaimerText?.[lang] ||
                  scheme.disclaimerText?.en ||
                  t(
                    "schemeDetails.defaultDisclaimer",
                    "The terms, interest rates, and loan caps shown above are governed by NSFDC guidelines. Final sanction and disbursement are subject to verification of applicant eligibility and credit appraisal by the designated Channelizing Agency or Partner Bank."
                  )}
              </p>
            </div>
          </SchemeSectionCard>
        </main>

        {/* Action Sidebar */}
        <div className="lg:col-span-4">
          <SchemeActionSidebar scheme={scheme} sections={sections} />
        </div>
      </div>
    </div>
  )
}
