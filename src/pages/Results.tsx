import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { useTranslation } from "react-i18next"
import {
  Calculator,
  CheckCircle2,
  Compass,
  FileText,
  HelpCircle,
  MapPin,
  RotateCcw,
  Scale,
  Share2,
  Sparkles,
} from "lucide-react"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { InfoNote } from "@/components/literacy/InfoNote"
import { ScoreBreakdownCard } from "@/components/results/ScoreBreakdownCard"
import { WhyThisSchemeCard } from "@/components/results/WhyThisSchemeCard"
import { WhyNotSchemeCard } from "@/components/results/WhyNotSchemeCard"
import { SchemeCompareTray } from "@/components/schemes/SchemeCompareTray"
import { fmtINR } from "@/lib/format"
import { useIntakeStore } from "@/stores/intakeStore"
import { useCalculatorStore } from "@/stores/calculatorStore"
import { useCompareStore } from "@/stores/useCompareStore"

export default function Results() {
  const { t, i18n } = useTranslation()
  const navigate = useNavigate()
  const match = useIntakeStore((s) => s.match)
  const reset = useIntakeStore((s) => s.reset)
  const patchCalc = useCalculatorStore((s) => s.patch)

  const isComparing = useCompareStore((s) => s.isComparing)
  const toggleScheme = useCompareStore((s) => s.toggleScheme)

  const isHindi = i18n.language === "hi"

  const matches = match?.matches || []
  const eligibleMatches = matches.filter((m) => m.eligible)
  const otherMatches = matches.filter((m) => !m.eligible)

  // Default to recommended tab if eligible schemes exist, otherwise gap analysis tab
  const [activeTab, setActiveTab] = useState<string>(() =>
    eligibleMatches.length > 0 ? "recommended" : "other"
  )

  if (!match || match.matches.length === 0) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-16 text-center">
        <p className="text-muted-foreground mb-5">{t("results.empty")}</p>
        <Button onClick={() => navigate("/find-schemes")}>
          {t("home.heroCta")}
        </Button>
      </div>
    )
  }

  function openCalculator(m: (typeof matches)[number]) {
    patchCalc({
      schemeId: m.schemeId,
      principal: m.suggestedAmount,
      annualRatePct: (m.rateRange.min + m.rateRange.max) / 2,
      tenureMonths: Math.round(
        (m.tenureRangeMonths.min + m.tenureRangeMonths.max) / 2,
      ),
      moratoriumMonths: m.moratorium.maxMonths,
      moratoriumInterestAccrues: m.moratorium.interestAccrues,
    })
    navigate("/calculator")
  }

  const handleShare = async () => {
    const shareData = {
      title: t("results.shareResultsTitle"),
      text: t("results.shareResultsTitle"),
      url: window.location.href,
    }

    if (navigator.share) {
      try {
        await navigator.share(shareData)
      } catch (err) {
        if ((err as Error).name !== "AbortError") {
          copyToClipboard()
        }
      }
    } else {
      copyToClipboard()
    }
  }

  const copyToClipboard = () => {
    navigator.clipboard
      .writeText(window.location.href)
      .then(() => {
        toast.success(t("results.shareSuccessToast"))
      })
      .catch(() => {
        toast.error(t("results.shareFailedToast"))
      })
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:py-12">
      {/* Header with Title and Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b">
        <div>
          <h1 className="font-display font-bold text-2xl sm:text-3xl tracking-tight text-foreground">
            {t("results.title")}
          </h1>
          <p className="mt-1 text-xs sm:text-sm text-muted-foreground">
            {t("results.subtitle")}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleShare}
            className="text-xs h-9 gap-1.5"
            aria-label={t("results.shareResultsCta")}
          >
            <Share2 className="size-3.5" />
            <span>{t("results.shareResultsCta")}</span>
          </Button>

          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              reset()
              navigate("/find-schemes")
            }}
            className="text-xs h-9 text-muted-foreground hover:text-foreground gap-1.5"
          >
            <RotateCcw className="size-3.5" />
            <span>{t("results.restartCta")}</span>
          </Button>
        </div>
      </div>

      {/* Tabs for Separating Recommended from Other / Gap Analyzed Schemes */}
      <div className="mt-6">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
            <TabsList className="grid grid-cols-2 w-full sm:w-auto h-10 p-1 bg-muted/80">
              <TabsTrigger
                value="recommended"
                className="text-xs sm:text-sm font-medium gap-1.5 data-[state=active]:bg-background data-[state=active]:text-primary data-[state=active]:shadow-xs"
              >
                <CheckCircle2 className="size-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                <span>{t("results.tabRecommended")}</span>
                <Badge
                  variant="secondary"
                  className="ml-1 text-[10px] px-1.5 py-0 font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300"
                >
                  {eligibleMatches.length}
                </Badge>
              </TabsTrigger>

              <TabsTrigger
                value="other"
                className="text-xs sm:text-sm font-medium gap-1.5 data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-xs"
              >
                <Compass className="size-4 text-rose-600 dark:text-rose-400 shrink-0" />
                <span>{t("results.tabOtherGaps")}</span>
                <Badge
                  variant="secondary"
                  className="ml-1 text-[10px] px-1.5 py-0 font-bold bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300"
                >
                  {otherMatches.length}
                </Badge>
              </TabsTrigger>
            </TabsList>

            <span className="text-xs text-muted-foreground">
              {activeTab === "recommended"
                ? t("results.summaryEligible", { count: eligibleMatches.length })
                : t("results.summaryGaps", { count: otherMatches.length })}
            </span>
          </div>

          {/* TAB 1: Recommended Eligible Schemes */}
          <TabsContent value="recommended" className="space-y-6 mt-0">
            {eligibleMatches.length === 0 ? (
              <div className="rounded-xl border border-amber-500/30 bg-amber-500/5 p-6 text-center space-y-3">
                <HelpCircle className="size-8 text-amber-600 mx-auto" />
                <h3 className="font-semibold text-base text-foreground">
                  {t("results.noDirectMatchesTitle", "No direct qualifying scheme under current constraints")}
                </h3>
                <p className="text-xs sm:text-sm text-muted-foreground max-w-lg mx-auto">
                  {t(
                    "results.noDirectMatchesDesc",
                    "Your declared profile inputs exceed specific scheme limits or require alternative parameters. Explore the 'Other Schemes & Gap Analysis' tab to see exact constraint gaps and recommended alternative routes."
                  )}
                </p>
                <Button
                  size="sm"
                  onClick={() => setActiveTab("other")}
                  className="mt-2"
                >
                  {t("results.tabOtherGaps")} ({otherMatches.length})
                </Button>
              </div>
            ) : (
              eligibleMatches.map((m, idx) => {
                const schemeNameText = isHindi ? m.schemeName.hi || m.schemeName.en : m.schemeName.en
                const isTopRanked = idx === 0
                const inCompare = isComparing(m.schemeId)

                return (
                  <Card
                    key={m.schemeId}
                    className="relative border-primary/40 overflow-hidden shadow-sm hover:shadow-md transition-shadow"
                    data-testid={`eligible-scheme-card-${m.schemeId}`}
                  >
                    {isTopRanked && (
                      <div className="bg-primary/10 border-b border-primary/20 px-6 py-1.5 flex items-center gap-1.5 text-xs font-semibold text-primary">
                        <Sparkles className="size-3.5" />
                        <span>{t("results.topMatchBadge")}</span>
                      </div>
                    )}

                    <span
                      aria-hidden
                      className="absolute top-4 right-5 stamp text-success text-sm font-bold select-none"
                      style={{ animation: "stamp-in .35s ease-out" }}
                    >
                      {t("results.eligibleStamp")}
                    </span>

                    <CardContent className="pt-6 pr-6 sm:pr-28 space-y-5">
                      <div>
                        <div className="flex flex-wrap items-center gap-2 mb-2">
                          <Badge variant="secondary" className="font-semibold">
                            {t(`schemeTypes.${m.schemeType}`)}
                          </Badge>
                          <Badge variant="outline" className="text-xs text-muted-foreground">
                            #{m.rank} {t("results.rankLabel")}
                          </Badge>
                        </div>
                        <h2 className="font-display font-bold text-xl sm:text-2xl text-foreground">
                          {schemeNameText}
                        </h2>
                      </div>

                      {/* 100-Point Deterministic Score Card with Indicative Badge */}
                      <ScoreBreakdownCard
                        score={m.score ?? 100}
                        breakdown={m.breakdown ?? {
                          income: 20,
                          category: 20,
                          purpose: 20,
                          cost: 20,
                          age: 10,
                          state: 10,
                        }}
                        defaultExpanded={isTopRanked}
                      />

                      {/* Key Numbers Grid */}
                      <ul className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 rounded-lg bg-muted/40 p-3 text-sm text-foreground/85">
                        <li>
                          <span className="block text-xs text-muted-foreground">
                            {t("results.suggestedAmountLabel")}
                          </span>
                          <strong className="font-semibold text-primary text-base">
                            {fmtINR(m.suggestedAmount)}
                          </strong>
                        </li>
                        <li>
                          <span className="block text-xs text-muted-foreground">
                            {t("results.coverageLabel")}
                          </span>
                          <span className="font-medium">{t("results.coverage", { pct: m.coveragePct })}</span>
                        </li>
                        <li>
                          <span className="block text-xs text-muted-foreground">
                            {t("results.interestRateLabel")}
                          </span>
                          <span className="font-medium">
                            {t("results.rateRange", {
                              min: m.rateRange.min,
                              max: m.rateRange.max,
                            })}
                          </span>
                        </li>
                      </ul>

                      {/* Positive Explainability Card ("Why This Scheme?") */}
                      <WhyThisSchemeCard reasons={m.reasons} />

                      <Separator />

                      {/* Action Buttons */}
                      <div className="pt-1 flex flex-wrap items-center justify-between gap-2.5">
                        <div className="flex flex-wrap gap-2.5">
                          <Button size="sm" onClick={() => openCalculator(m)}>
                            <Calculator className="mr-1.5 size-4" />
                            {t("results.calcCta")}
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() =>
                              navigate(`/partners?type=${m.schemeType}`)
                            }
                          >
                            <MapPin className="mr-1.5 size-4" />
                            {t("results.partnersCta")}
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => navigate(`/schemes/${m.schemeId}`)}
                            className="text-xs"
                          >
                            <FileText className="mr-1.5 size-3.5" />
                            {t("schemes.viewDetails")}
                          </Button>
                        </div>

                        <Button
                          size="sm"
                          variant={inCompare ? "secondary" : "outline"}
                          className={`text-xs h-8 gap-1.5 ${
                            inCompare ? "border-primary/50 text-primary font-medium" : ""
                          }`}
                          onClick={() => toggleScheme(m.schemeId)}
                        >
                          <Scale className="size-3.5" />
                          <span>
                            {inCompare
                              ? t("results.inComparison")
                              : t("results.compareCta")}
                          </span>
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                )
              })
            )}
          </TabsContent>

          {/* TAB 2: Other Schemes & Gap Analysis */}
          <TabsContent value="other" className="space-y-6 mt-0">
            {/* Contextual Notice Banner */}
            <div className="rounded-xl border border-primary/20 bg-primary/5 p-4 sm:p-5 space-y-2">
              <div className="flex items-center gap-2 text-primary font-semibold text-sm">
                <Compass className="size-4 shrink-0" />
                <span>{t("results.otherSchemesBannerTitle")}</span>
              </div>
              <p className="text-xs text-muted-foreground leading-relaxed">
                {t("results.otherSchemesBannerDesc")}
              </p>
            </div>

            {otherMatches.map((m) => {
              const schemeNameText = isHindi ? m.schemeName.hi || m.schemeName.en : m.schemeName.en
              const inCompare = isComparing(m.schemeId)

              return (
                <Card
                  key={m.schemeId}
                  className="relative bg-card/90 border-muted-foreground/20 overflow-hidden shadow-xs hover:border-muted-foreground/30 transition-colors"
                  data-testid={`gap-scheme-card-${m.schemeId}`}
                >
                  <span className="absolute top-4 right-5 stamp text-muted-foreground/80 text-xs font-bold select-none shrink-0">
                    {t("results.notEligibleStamp")}
                  </span>

                  <CardContent className="pt-6 pr-6 sm:pr-28 space-y-5">
                    <div>
                      <div className="flex flex-wrap items-center gap-2 mb-2">
                        <Badge variant="outline" className="text-xs">
                          {t(`schemeTypes.${m.schemeType}`)}
                        </Badge>
                      </div>
                      <h2 className="font-display font-bold text-lg sm:text-xl text-foreground">
                        {schemeNameText}
                      </h2>
                    </div>

                    {/* 100-Point Score Breakdown (identifies which categories lost points) */}
                    <ScoreBreakdownCard
                      score={m.score ?? 0}
                      breakdown={m.breakdown ?? {
                        income: 0,
                        category: 0,
                        purpose: 0,
                        cost: 0,
                        age: 0,
                        state: 0,
                      }}
                      defaultExpanded={false}
                    />

                    {/* Gap Diagnostics & Actionable Alternatives */}
                    <WhyNotSchemeCard
                      schemeId={m.schemeId}
                      gapBreakdown={m.gapBreakdown}
                      remedialAdvice={m.remedialAdvice}
                      alternativeSchemes={m.alternativeSchemes}
                      blockers={m.reasons}
                    />

                    <Separator />

                    {/* Action Bar */}
                    <div className="pt-1 flex flex-wrap items-center justify-between gap-2.5">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => navigate(`/schemes/${m.schemeId}`)}
                        className="text-xs h-8 gap-1.5"
                      >
                        <FileText className="size-3.5" />
                        <span>{t("schemes.viewDetails")}</span>
                      </Button>

                      <Button
                        size="sm"
                        variant={inCompare ? "secondary" : "outline"}
                        className={`text-xs h-8 gap-1.5 ${
                          inCompare ? "border-primary/50 text-primary font-medium" : ""
                        }`}
                        onClick={() => toggleScheme(m.schemeId)}
                      >
                        <Scale className="size-3.5" />
                        <span>
                          {inCompare
                            ? t("results.inComparison")
                            : t("results.compareCta")}
                        </span>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </TabsContent>
        </Tabs>
      </div>

      {/* Comparison Floating Tray */}
      <SchemeCompareTray />

      {/* Financial Literacy Advisory */}
      <div className="mt-10">
        <InfoNote topic="concessional" />
      </div>
    </div>
  )
}
