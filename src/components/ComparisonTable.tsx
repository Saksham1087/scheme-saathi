import { useTranslation } from "react-i18next"
import { CheckCircle2, XCircle } from "lucide-react"
import type { LocalScheme } from "@/data"

function formatAmount(amount: number): string {
  if (amount >= 10000000) return `₹${(amount / 10000000).toFixed(1)} Cr`
  if (amount >= 100000) return `₹${(amount / 100000).toFixed(1)} L`
  return `₹${amount.toLocaleString("en-IN")}`
}

interface ComparisonTableProps {
  schemes: LocalScheme[]
}

export function ComparisonTable({ schemes }: ComparisonTableProps) {
  const { t, i18n } = useTranslation()
  const lang = i18n.language as "en" | "hi" | "mr"

  const rows = getRows(schemes, lang, t)

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm border-collapse">
        <thead>
          <tr className="border-b border-border">
            <th className="text-left py-3 px-4 font-medium text-muted-foreground sticky left-0 bg-background min-w-[140px]">
              {t("comparison.dimension")}
            </th>
            {schemes.map((s) => {
              const name = (s.name as Record<string, string>)[lang] || s.name.en
              return (
                <th
                  key={s.slug}
                  className="text-left py-3 px-4 font-display font-semibold min-w-[200px]"
                >
                  {name}
                </th>
              )
            })}
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.key} className="border-b border-border/50">
              <td className="py-3 px-4 font-medium text-muted-foreground sticky left-0 bg-background">
                {row.label}
              </td>
              {row.values.map((val, i) => (
                <td
                  key={i}
                  className={`py-3 px-4 ${row.highlight && val !== row.values[0] ? "font-semibold text-primary" : ""}`}
                >
                  {val === "N/A" ? (
                    <span className="text-muted-foreground">—</span>
                  ) : val === "✓" ? (
                    <CheckCircle2 className="size-4 text-success" />
                  ) : val === "✗" ? (
                    <XCircle className="size-4 text-muted-foreground" />
                  ) : (
                    val
                  )}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

function getRows(
  schemes: LocalScheme[],
  _lang: string,
  t: (key: string) => string,
): Array<{ key: string; label: string; values: string[]; highlight?: boolean }> {
  return [
    {
      key: "ministry",
      label: t("comparison.ministry"),
      values: schemes.map((s) => s.ministry || "N/A"),
    },
    {
      key: "purpose",
      label: t("comparison.purpose"),
      values: schemes.map((s) => s.purpose || "N/A"),
    },
    {
      key: "loanRange",
      label: t("comparison.loanRange"),
      values: schemes.map((s) => {
        const fa = s.financialAssistance
        return fa ? `${formatAmount(fa.minAmount)} – ${formatAmount(fa.maxAmount)}` : "N/A"
      }),
      highlight: true,
    },
    {
      key: "interestRate",
      label: t("comparison.interestRate"),
      values: schemes.map((s) => {
        const ir = s.financialAssistance?.interestRate
        return ir ? `${ir.min}% – ${ir.max}%` : "N/A"
      }),
    },
    {
      key: "repaymentTenure",
      label: t("comparison.repaymentTenure"),
      values: schemes.map((s) => {
        const rm = s.financialAssistance?.repaymentMonths
        return rm ? `${Math.floor(rm.min / 12)}–${Math.floor(rm.max / 12)} years` : "N/A"
      }),
    },
    {
      key: "moratorium",
      label: t("comparison.moratorium"),
      values: schemes.map((s) => {
        const mm = s.financialAssistance?.moratoriumMonths
        return mm ? `${mm.min}–${mm.max} months` : "N/A"
      }),
    },
    {
      key: "categories",
      label: t("comparison.eligibleCategories"),
      values: schemes.map((s) => {
        const cats = s.eligibilityRules?.categories
        return cats?.length ? cats.join(", ") : "N/A"
      }),
    },
    {
      key: "maxIncome",
      label: t("comparison.incomeCeiling"),
      values: schemes.map((s) => {
        const max = s.eligibilityRules?.maxIncome
        return max ? formatAmount(max) : "N/A"
      }),
    },
    {
      key: "documents",
      label: t("comparison.requiredDocs"),
      values: schemes.map((s) => {
        const docs = s.requiredDocuments
        if (!docs?.length) return "N/A"
        const mandatory = docs.filter((d) => d.mandatory).length
        return `${mandatory} mandatory`
      }),
    },
    {
      key: "source",
      label: t("comparison.dataSource"),
      values: schemes.map((s) => s.source || "N/A"),
    },
  ]
}
