interface MoratoriumTimelineProps {
  moratoriumMonths: number
  tenureMonths: number
}

export function MoratoriumTimeline({
  moratoriumMonths,
  tenureMonths,
}: MoratoriumTimelineProps) {
  if (moratoriumMonths === 0) return null

  const totalMonths = moratoriumMonths + tenureMonths
  const moratoriumPct = (moratoriumMonths / totalMonths) * 100
  const repaymentPct = (tenureMonths / totalMonths) * 100

  return (
    <div className="space-y-2">
      <div className="h-3 rounded-full overflow-hidden flex bg-primary/20">
        <div
          className="bg-accent/60 transition-all duration-300"
          style={{ width: `${moratoriumPct}%` }}
          aria-label={`Moratorium: ${moratoriumMonths} months`}
        />
        <div
          className="bg-primary transition-all duration-300"
          style={{ width: `${repaymentPct}%` }}
          aria-label={`Repayment: ${tenureMonths} months`}
        />
      </div>
      <div className="flex items-center justify-between text-xs text-muted-foreground">
        <div className="flex items-center gap-1.5">
          <span className="size-2.5 rounded-full bg-accent/60" />
          <span>Moratorium ({moratoriumMonths}mo)</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="size-2.5 rounded-full bg-primary" />
          <span>Repayment ({tenureMonths}mo)</span>
        </div>
      </div>
      <div className="flex justify-between text-[11px] text-muted-foreground">
        <span>Month 1</span>
        <span>Month {moratoriumMonths} → Repayment starts</span>
        <span>Month {totalMonths}</span>
      </div>
    </div>
  )
}
