import { useNavigate } from "react-router-dom"
import { useTranslation } from "react-i18next"
import { ArrowRight, Check, Calculator, MapPin, Sparkles } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { InfoNote } from "@/components/literacy/InfoNote"
import { ScoreBreakdownCard } from "@/components/results/ScoreBreakdownCard"
import { fmtINR } from "@/lib/format"
import { useIntakeStore } from "@/stores/intakeStore"
import { useCalculatorStore } from "@/stores/calculatorStore"

export default function Results() {
  const { t, i18n } = useTranslation()
  const navigate = useNavigate()
  const match = useIntakeStore((s) => s.match)
  const reset = useIntakeStore((s) => s.reset)
  const patchCalc = useCalculatorStore((s) => s.patch)

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

  const matches: NonNullable<typeof match>["matches"] = match.matches

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

  const isHindi = i18n.language === "hi"

  return (
    <div className="mx-auto max-w-3xl px-4 py-10">
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h1 className="font-display font-bold text-3xl tracking-tight">
            {t("results.title")}
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {t("results.subtitle")}
          </p>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => {
            reset()
            navigate("/find-schemes")
          }}
        >
          {t("results.restartCta")}
        </Button>
      </div>

      <div className="mt-8 space-y-6">
        {matches.map((m, idx) => {
          const schemeNameText = isHindi ? m.schemeName.hi || m.schemeName.en : m.schemeName.en
          const isTopRanked = idx === 0 && m.eligible

          return m.eligible ? (
            <Card key={m.schemeId} className="relative border-primary/40 overflow-hidden shadow-sm">
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
              <CardContent className="pt-6 pr-6 sm:pr-28 space-y-4">
                <div>
                  <div className="flex flex-wrap items-center gap-2 mb-2">
                    <Badge variant="secondary" className="font-semibold">
                      {t(`schemeTypes.${m.schemeType}`)}
                    </Badge>
                    <Badge variant="outline" className="text-xs text-muted-foreground">
                      #{m.rank} {t("results.rankLabel")}
                    </Badge>
                  </div>
                  <h2 className="font-display font-bold text-xl text-foreground">
                    {schemeNameText}
                  </h2>
                </div>

                {/* 100-Point Deterministic Score Card */}
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

                <ul className="grid grid-cols-1 sm:grid-cols-3 gap-2 rounded-lg bg-muted/40 p-3 text-sm text-foreground/85">
                  <li>
                    <span className="block text-xs text-muted-foreground">
                      {t("results.suggestedAmountLabel")}
                    </span>
                    <strong className="font-semibold text-primary">
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

                <Separator />

                <div>
                  <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-2">
                    {t("results.whyHeading")}
                  </p>
                  <ul className="space-y-1.5">
                    {m.reasons.map((r) => (
                      <li
                        key={r.key}
                        className="flex gap-2 text-sm"
                      >
                        <Check
                          className="size-4 shrink-0 mt-0.5 text-success"
                          aria-hidden
                        />
                        <span>{t(`reasons.${r.key}`, r.params)}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="pt-2 flex flex-wrap gap-2.5">
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
                </div>
              </CardContent>
            </Card>
          ) : (
            <Card key={m.schemeId} className="opacity-80 bg-muted/40 border-muted">
              <CardContent className="pt-6 space-y-4">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <Badge variant="outline" className="mb-2">
                      {t(`schemeTypes.${m.schemeType}`)}
                    </Badge>
                    <h2 className="font-display font-bold text-lg text-foreground">
                      {schemeNameText}
                    </h2>
                  </div>
                  <span className="stamp text-muted-foreground/70 text-xs font-bold select-none shrink-0">
                    {t("results.notEligibleStamp")}
                  </span>
                </div>

                {/* Score breakdown for non-eligible scheme showing reasons/criteria gaps */}
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

                <Separator />

                <div>
                  <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-2">
                    {t("results.blockersHeading")}
                  </p>
                  <ul className="space-y-1.5">
                    {m.reasons.map((r) => (
                      <li
                        key={r.key}
                        className="flex gap-2 text-sm text-foreground/80"
                      >
                        <ArrowRight
                          className="size-4 shrink-0 mt-0.5 text-destructive"
                          aria-hidden
                        />
                        <span>{t(`reasons.${r.key}`, r.params)}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      <div className="mt-8">
        <InfoNote topic="concessional" />
      </div>
    </div>
  )
}
