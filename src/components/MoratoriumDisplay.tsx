import { fmtINR } from "@/lib/format"

interface MoratoriumDisplayProps {
  moratoriumMonths: number
  interestAccrues: boolean
  moratoriumInterest: number
  effectivePrincipal: number
  originalPrincipal: number
}

export function MoratoriumDisplay({
  moratoriumMonths,
  interestAccrues,
  moratoriumInterest,
  effectivePrincipal,
  originalPrincipal,
}: MoratoriumDisplayProps) {
  if (moratoriumMonths === 0) return null

  return (
    <div className="rounded-lg border border-border bg-card p-4 space-y-3">
      <h3 className="text-sm font-semibold">Moratorium impact</h3>
      <div className="grid grid-cols-2 gap-4 text-sm">
        <div>
          <p className="text-xs text-muted-foreground">Duration</p>
          <p className="font-medium">{moratoriumMonths} months</p>
        </div>
        <div>
          <p className="text-xs text-muted-foreground">Type</p>
          <p className="font-medium">
            {interestAccrues ? "Interest-accruing" : "Interest-free"}
          </p>
        </div>
        <div>
          <p className="text-xs text-muted-foreground">Interest during moratorium</p>
          <p className="font-medium">
            {interestAccrues ? fmtINR(moratoriumInterest) : "₹0"}
          </p>
        </div>
        <div>
          <p className="text-xs text-muted-foreground">
            {interestAccrues ? "Adjusted principal" : "Principal (unchanged)"}
          </p>
          <p className="font-medium">{fmtINR(effectivePrincipal)}</p>
        </div>
      </div>
      <p className="text-xs text-muted-foreground leading-relaxed">
        {interestAccrues
          ? `During the ${moratoriumMonths}-month moratorium, ${fmtINR(moratoriumInterest)} in interest accrues and is added to your balance. EMIs are calculated on the adjusted amount of ${fmtINR(effectivePrincipal)}.`
          : `No interest accrues during the ${moratoriumMonths}-month moratorium. Your EMIs are calculated on the original principal of ${fmtINR(originalPrincipal)}.`}
      </p>
    </div>
  )
}
