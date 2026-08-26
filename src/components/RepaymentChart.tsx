import { fmtINR } from "@/lib/format"

interface RepaymentChartProps {
  principal: number
  interest: number
}

export function RepaymentChart({ principal, interest }: RepaymentChartProps) {
  const total = principal + interest
  if (total === 0) return null

  const principalPct = (principal / total) * 100
  const interestPct = (interest / total) * 100

  return (
    <div className="space-y-3">
      <div className="h-4 rounded-full overflow-hidden flex bg-secondary">
        <div
          className="bg-primary transition-all duration-300"
          style={{ width: `${principalPct}%` }}
          role="img"
          aria-label={`Principal: ${fmtINR(principal)} (${Math.round(principalPct)}%)`}
        />
        <div
          className="bg-accent transition-all duration-300"
          style={{ width: `${interestPct}%` }}
          role="img"
          aria-label={`Interest: ${fmtINR(interest)} (${Math.round(interestPct)}%)`}
        />
      </div>
      <div className="flex items-center justify-between text-xs">
        <div className="flex items-center gap-1.5">
          <span className="size-2.5 rounded-full bg-primary" />
          <span className="text-muted-foreground">
            Principal: <span className="font-medium text-foreground">{fmtINR(principal)}</span> ({Math.round(principalPct)}%)
          </span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="size-2.5 rounded-full bg-accent" />
          <span className="text-muted-foreground">
            Interest: <span className="font-medium text-foreground">{fmtINR(interest)}</span> ({Math.round(interestPct)}%)
          </span>
        </div>
      </div>
    </div>
  )
}
