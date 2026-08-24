import { useMemo } from "react"
import { useTranslation } from "react-i18next"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { Switch } from "@/components/ui/switch"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { useState } from "react"
import { InfoNote } from "@/components/literacy/InfoNote"
import { computeLoan } from "@/lib/emi"
import { fmtINR } from "@/lib/format"
import { useCalculatorStore } from "@/stores/calculatorStore"
import schemesSeed from "@seed/schemes.seed.json"

function SliderRow({
  id,
  label,
  value,
  display,
  min,
  max,
  step,
  onChange,
}: {
  id: string
  label: string
  value: number
  display: string
  min: number
  max: number
  step: number
  onChange: (v: number) => void
}) {
  return (
    <div>
      <div className="flex items-baseline justify-between mb-2.5">
        <Label htmlFor={id}>{label}</Label>
        <span className="font-display font-bold text-lg text-primary">
          {display}
        </span>
      </div>
      <Slider
        id={id}
        min={min}
        max={max}
        step={step}
        value={[value]}
        onValueChange={([v]) => onChange(v)}
      />
      <Input
        type="number"
        min={min}
        max={max}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="mt-3 max-w-44"
        aria-label={label}
      />
    </div>
  )
}

export default function CalculatorPage() {
  const { t } = useTranslation()
  const calc = useCalculatorStore()
  const [showFullSchedule, setShowFullSchedule] = useState(false)

  const result = useMemo(
    () =>
      computeLoan({
        principal: Math.max(0, calc.principal),
        annualRatePct: calc.annualRatePct,
        tenureMonths: Math.max(1, calc.tenureMonths),
        moratoriumMonths: Math.min(12, Math.max(0, calc.moratoriumMonths)),
        moratoriumInterestAccrues: calc.moratoriumInterestAccrues,
      }),
    [
      calc.principal,
      calc.annualRatePct,
      calc.tenureMonths,
      calc.moratoriumMonths,
      calc.moratoriumInterestAccrues,
    ],
  )

  const schemeName = calc.schemeId
    ? (schemesSeed.find((s) => s.id === calc.schemeId)?.name.en ?? null)
    : null

  const visibleRows = showFullSchedule
    ? result.schedule
    : result.schedule.slice(0, 12)

  return (
    <div className="mx-auto max-w-4xl px-4 py-10">
      <h1 className="font-display font-bold text-3xl tracking-tight">
        {t("calculator.title")}
      </h1>
      <p className="mt-1 text-sm text-muted-foreground mb-8">
        {t("calculator.subtitle")}
      </p>

      {schemeName && (
        <p className="mb-5 rounded-md bg-secondary px-4 py-2.5 text-sm font-medium">
          {t("calculator.fromSchemeNotice", { scheme: schemeName })}
        </p>
      )}

      <div className="grid gap-8 md:grid-cols-2 items-start">
        {/* Controls */}
        <Card>
          <CardContent className="pt-6 space-y-7">
            <SliderRow
              id="amount"
              label={t("calculator.amountLabel")}
              value={calc.principal}
              display={fmtINR(calc.principal)}
              min={10000}
              max={5000000}
              step={10000}
              onChange={(v) => calc.patch({ principal: v })}
            />
            <SliderRow
              id="rate"
              label={t("calculator.rateLabel")}
              value={calc.annualRatePct}
              display={`${calc.annualRatePct}%`}
              min={6.5}
              max={15}
              step={0.1}
              onChange={(v) => calc.patch({ annualRatePct: v })}
            />
            <SliderRow
              id="tenure"
              label={t("calculator.tenureLabel")}
              value={calc.tenureMonths}
              display={`${calc.tenureMonths}`}
              min={12}
              max={120}
              step={6}
              onChange={(v) => calc.patch({ tenureMonths: v })}
            />
            <SliderRow
              id="moratorium"
              label={t("calculator.moratoriumLabel")}
              value={calc.moratoriumMonths}
              display={`${calc.moratoriumMonths}`}
              min={0}
              max={12}
              step={1}
              onChange={(v) => calc.patch({ moratoriumMonths: v })}
            />
            <div className="space-y-2">
              <div className="flex items-center justify-between gap-4">
                <Label htmlFor="accrual">{t("calculator.accrualLabel")}</Label>
                <Switch
                  id="accrual"
                  checked={calc.moratoriumInterestAccrues}
                  onCheckedChange={(v) =>
                    calc.patch({ moratoriumInterestAccrues: v })
                  }
                />
              </div>
              <p className="text-xs text-muted-foreground leading-relaxed">
                {calc.moratoriumInterestAccrues
                  ? t("calculator.accrualHintOn")
                  : t("calculator.accrualHintOff")}
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Results */}
        <div className="space-y-4 md:sticky md:top-24">
          <Card className="border-primary/40 bg-primary text-primary-foreground">
            <CardContent className="pt-6">
              <p className="text-sm opacity-80">
                {t("calculator.emiLabel")}
              </p>
              <p className="font-display font-bold text-4xl sm:text-5xl tracking-tight mt-1 tabular-nums">
                {fmtINR(result.emi)}
              </p>
              <p className="text-sm opacity-80 mt-1">
                {t("common.perMonth")}
              </p>
            </CardContent>
          </Card>

          <dl className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {[
              ["effectivePrincipalLabel", result.effectivePrincipal],
              ["totalInterestLabel", result.totalInterest],
              ["totalPayableLabel", result.totalPayable],
            ].map(([key, val]) => (
              <Card key={key as string} className="bg-card">
                <CardContent className="pt-5 pb-4 px-4">
                  <dt className="text-xs text-muted-foreground leading-snug min-h-8">
                    {t(`calculator.${key}`)}
                  </dt>
                  <dd className="font-display font-bold text-lg tabular-nums mt-1">
                    {fmtINR(val as number)}
                  </dd>
                </CardContent>
              </Card>
            ))}
          </dl>
        </div>
      </div>

      {/* Amortization schedule */}
      <section className="mt-10">
        <h2 className="font-display font-bold text-xl mb-4">
          {t("calculator.scheduleTitle")}
        </h2>
        <div className="rounded-lg border border-border overflow-x-auto bg-card">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>{t("calculator.scheduleMonth")}</TableHead>
                <TableHead className="text-right">
                  {t("calculator.scheduleEmi")}
                </TableHead>
                <TableHead className="text-right">
                  {t("calculator.scheduleInterest")}
                </TableHead>
                <TableHead className="text-right">
                  {t("calculator.schedulePrincipal")}
                </TableHead>
                <TableHead className="text-right">
                  {t("calculator.scheduleBalance")}
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {visibleRows.map((row, i) => (
                <TableRow key={row.month}>
                  <TableCell>
                    {row.month}
                    {i === 11 && !showFullSchedule ? " …" : ""}
                    {row.phase === "moratorium" && (
                      <span className="ml-2 rounded-full bg-accent/20 text-accent-foreground text-[11px] font-semibold px-2 py-0.5">
                        {t("calculator.phaseMoratorium")}
                      </span>
                    )}
                  </TableCell>
                  <TableCell className="text-right tabular-nums">
                    {row.emi > 0 ? fmtINR(row.emi) : "—"}
                  </TableCell>
                  <TableCell className="text-right tabular-nums">
                    {fmtINR(row.interest)}
                  </TableCell>
                  <TableCell className="text-right tabular-nums">
                    {fmtINR(row.principalPaid)}
                  </TableCell>
                  <TableCell className="text-right tabular-nums">
                    {fmtINR(row.closingBalance)}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
        {result.schedule.length > 12 && (
          <Button
            variant="ghost"
            size="sm"
            className="mt-3"
            onClick={() => setShowFullSchedule((v) => !v)}
          >
            {showFullSchedule
              ? t("calculator.hideFullSchedule")
              : t("calculator.showFullSchedule")}
          </Button>
        )}
      </section>

      <div className="mt-8">
        <InfoNote topic="moratorium" defaultOpen />
      </div>
    </div>
  )
}
