import { fmtINR } from "@/lib/format"
import { useTranslation } from "react-i18next"

interface FinancingBreakdownProps {
  totalCost: number
  ownContribution: number
  loanAmount: number
  subsidyAmount: number
}

export function FinancingBreakdown({
  totalCost,
  ownContribution,
  loanAmount,
  subsidyAmount,
}: FinancingBreakdownProps) {
  const { t } = useTranslation()
  const total = ownContribution + loanAmount + subsidyAmount
  const gap = totalCost - total

  const ownPct = totalCost > 0 ? (ownContribution / totalCost) * 100 : 0
  const loanPct = totalCost > 0 ? (loanAmount / totalCost) * 100 : 0
  const subsidyPct = totalCost > 0 ? (subsidyAmount / totalCost) * 100 : 0

  return (
    <div className="space-y-4">
      <div className="h-4 rounded-full overflow-hidden flex bg-secondary">
        <div
          className="bg-primary transition-all duration-300"
          style={{ width: `${ownPct}%` }}
          aria-label={`${t("financing.percentages.own")}: ${fmtINR(ownContribution)}`}
        />
        <div
          className="bg-accent transition-all duration-300"
          style={{ width: `${loanPct}%` }}
          aria-label={`${t("financing.percentages.loan")}: ${fmtINR(loanAmount)}`}
        />
        {subsidyPct > 0 && (
          <div
            className="bg-success transition-all duration-300"
            style={{ width: `${subsidyPct}%` }}
            aria-label={`${t("financing.percentages.subsidy")}: ${fmtINR(subsidyAmount)}`}
          />
        )}
      </div>

      <div className="grid grid-cols-2 gap-3 text-sm">
        <div>
          <p className="text-xs text-muted-foreground">{t("financing.totalProjectCost")}</p>
          <p className="font-semibold">{fmtINR(totalCost)}</p>
        </div>
        <div>
          <p className="text-xs text-muted-foreground">{t("financing.ownContribution")}</p>
          <p className="font-semibold">{fmtINR(ownContribution)} ({Math.round(ownPct)}%)</p>
        </div>
        <div>
          <p className="text-xs text-muted-foreground">{t("financing.loanAmount")}</p>
          <p className="font-semibold">{fmtINR(loanAmount)} ({Math.round(loanPct)}%)</p>
        </div>
        <div>
          <p className="text-xs text-muted-foreground">{t("financing.subsidyAmount")}</p>
          <p className="font-semibold">{fmtINR(subsidyAmount)} ({Math.round(subsidyPct)}%)</p>
        </div>
      </div>

      {gap > 0 && (
        <div className="rounded-lg bg-destructive/10 p-3 text-sm">
          <p className="font-medium text-destructive">
            {t("financing.gap")}: {fmtINR(gap)}
          </p>
          <p className="text-xs text-muted-foreground mt-0.5">{t("financing.gapDesc")}</p>
        </div>
      )}
    </div>
  )
}
