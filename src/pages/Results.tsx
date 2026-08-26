import { useNavigate } from "react-router-dom"
import { useTranslation } from "react-i18next"
import { ArrowRight, Check, Calculator, MapPin, ExternalLink } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { InfoNote } from "@/components/literacy/InfoNote"
import { fmtINR } from "@/lib/format"
import { useIntakeStore } from "@/stores/intakeStore"
import { useCalculatorStore } from "@/stores/calculatorStore"

export default function Results() {
  const { t } = useTranslation()
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

      <div className="mt-8 space-y-5">
        {matches.map((m) =>
          m.eligible ? (
            <Card key={m.schemeId} className="relative border-primary/40">
              <span
                aria-hidden
                className="absolute top-4 right-5 stamp text-success text-sm font-bold select-none"
                style={{ animation: "stamp-in .35s ease-out" }}
              >
                {t("results.eligibleStamp")}
              </span>
              <CardContent className="pt-6 pr-28">
                <Badge variant="secondary" className="mb-2 font-semibold">
                  {t(`schemeTypes.${m.schemeType}`)}
                </Badge>
                <h2 className="font-display font-bold text-xl">
                  {m.schemeName.en}
                </h2>
                <ul className="mt-3 space-y-1.5 text-sm text-foreground/85">
                  <li>
                    <strong className="font-semibold">
                      {t("results.suggestedAmount", {
                        amount: fmtINR(m.suggestedAmount),
                      })}
                    </strong>
                  </li>
                  <li>{t("results.coverage", { pct: m.coveragePct })}</li>
                  <li>
                    {t("results.rateRange", {
                      min: m.rateRange.min,
                      max: m.rateRange.max,
                    })}
                  </li>
                </ul>

                <Separator className="my-4" />
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

                <div className="mt-5 flex flex-wrap gap-2.5">
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
                  {m.applyUrl && (
                    <Button
                      size="sm"
                      variant="outline"
                      asChild
                    >
                      <a
                        href={m.applyUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <ExternalLink className="mr-1.5 size-4" />
                        {t("results.applyCta")}
                      </a>
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          ) : (
            <Card key={m.schemeId} className="opacity-70 bg-muted/50">
              <CardContent className="pt-6">
                <span className="float-right stamp text-muted-foreground/70 text-xs font-bold select-none">
                  {t("results.notEligibleStamp")}
                </span>
                <Badge variant="outline" className="mb-2">
                  {t(`schemeTypes.${m.schemeType}`)}
                </Badge>
                <h2 className="font-display font-bold text-lg">
                  {m.schemeName.en}
                </h2>
                <Separator className="my-3" />
                <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-2">
                  {t("results.blockersHeading")}
                </p>
                <ul className="space-y-1.5">
                  {m.reasons.map((r) => (
                    <li
                      key={r.key}
                      className="flex gap-2 text-sm text-foreground/75"
                    >
                      <ArrowRight
                        className="size-4 shrink-0 mt-0.5 text-destructive"
                        aria-hidden
                      />
                      <span>{t(`reasons.${r.key}`, r.params)}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          ),
        )}
      </div>

      <div className="mt-8">
        <InfoNote topic="concessional" />
      </div>
    </div>
  )
}
