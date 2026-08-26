import { useParams, Link } from "react-router-dom"
import { useTranslation } from "react-i18next"
import {
  ArrowLeft,
  Calculator,
  CheckCircle2,
  ExternalLink,
  FileText,
  MapPin,
  ShieldCheck,
  XCircle,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { getSchemeBySlug } from "@/data"

function formatAmount(amount: number): string {
  if (amount >= 10000000) return `₹${(amount / 10000000).toFixed(1)} Cr`
  if (amount >= 100000) return `₹${(amount / 100000).toFixed(1)} L`
  return `₹${amount.toLocaleString("en-IN")}`
}

function CollapsibleSection({
  title,
  icon: Icon,
  defaultOpen = true,
  children,
}: {
  title: string
  icon: React.ComponentType<{ className?: string }>
  defaultOpen?: boolean
  children: React.ReactNode
}) {
  return (
    <details open={defaultOpen} className="group border-b border-border last:border-b-0">
      <summary className="flex items-center gap-2 py-4 cursor-pointer list-none font-display font-semibold text-lg">
        <Icon className="size-5 text-primary" />
        {title}
      </summary>
      <div className="pb-5">{children}</div>
    </details>
  )
}

export default function SchemeDetail() {
  const { slug } = useParams<{ slug: string }>()
  const { t, i18n } = useTranslation()
  const lang = i18n.language as "en" | "hi" | "mr"

  const scheme = slug ? getSchemeBySlug(slug) : undefined

  if (!scheme) {
    return (
      <main className="mx-auto max-w-3xl px-4 py-16 text-center">
        <h1 className="font-display font-bold text-3xl">{t("schemes.detail.notFound")}</h1>
        <p className="mt-3 text-muted-foreground">{t("schemes.detail.notFoundDesc")}</p>
        <Button asChild className="mt-6">
          <Link to="/schemes">
            <ArrowLeft className="mr-2 size-4" />
            {t("schemes.detail.backToList")}
          </Link>
        </Button>
      </main>
    )
  }

  const name = (scheme.name as Record<string, string>)[lang] || scheme.name.en
  const desc = (scheme.description as Record<string, string>)[lang] || scheme.description.en
  const fa = scheme.financialAssistance

  return (
    <main className="mx-auto max-w-4xl px-4 py-8">
      <Button variant="ghost" size="sm" asChild className="mb-6">
        <Link to="/schemes">
          <ArrowLeft className="mr-1.5 size-4" />
          {t("schemes.detail.backToList")}
        </Link>
      </Button>

      {/* Header */}
      <header className="space-y-3">
        <div className="flex flex-wrap gap-2">
          {scheme.category.map((cat) => (
            <Badge key={cat} variant="secondary" className="text-xs">
              {t(`schemes.categories.${cat}`, cat)}
            </Badge>
          ))}
          {scheme.verified && (
            <Badge variant="outline" className="text-xs text-success border-success">
              <CheckCircle2 className="size-3 mr-1" />
              {t("schemes.detail.verified")}
            </Badge>
          )}
        </div>
        <h1 className="font-display font-bold text-3xl sm:text-4xl tracking-tight">
          {name}
        </h1>
        <p className="text-sm text-muted-foreground">{scheme.ministry}</p>
      </header>

      {/* CTAs */}
      <div className="mt-6 flex flex-wrap gap-3">
        <Button asChild>
          <Link to="/calculator">
            <Calculator className="mr-2 size-4" />
            {t("schemes.detail.calcEmi")}
          </Link>
        </Button>
        <Button variant="outline" asChild>
          <Link to="/partners">
            <MapPin className="mr-2 size-4" />
            {t("schemes.detail.findPartner")}
          </Link>
        </Button>
        {scheme.officialUrl && (
          <Button variant="outline" asChild>
            <a href={scheme.officialUrl} target="_blank" rel="noopener noreferrer">
              <ExternalLink className="mr-2 size-4" />
              {t("schemes.detail.officialSite")}
            </a>
          </Button>
        )}
      </div>

      {/* Sections */}
      <div className="mt-8 border-t border-border">
        <CollapsibleSection title={t("schemes.detail.overview")} icon={FileText}>
          <p className="text-sm leading-relaxed text-muted-foreground">{desc}</p>
          {scheme.purpose && (
            <div className="mt-4">
              <h4 className="text-sm font-semibold mb-1">{t("schemes.detail.purpose")}</h4>
              <p className="text-sm text-muted-foreground">{scheme.purpose}</p>
            </div>
          )}
          {scheme.targetBeneficiaries?.length > 0 && (
            <div className="mt-4">
              <h4 className="text-sm font-semibold mb-1">{t("schemes.detail.beneficiaries")}</h4>
              <ul className="list-disc list-inside text-sm text-muted-foreground space-y-0.5">
                {scheme.targetBeneficiaries.map((b) => (
                  <li key={b}>{b}</li>
                ))}
              </ul>
            </div>
          )}
        </CollapsibleSection>

        <CollapsibleSection title={t("schemes.detail.financialAssistance")} icon={Calculator}>
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <p className="text-xs text-muted-foreground uppercase tracking-wide">{t("schemes.detail.loanRange")}</p>
              <p className="text-lg font-semibold mt-1">
                {formatAmount(fa.minAmount)} – {formatAmount(fa.maxAmount)}
              </p>
            </div>
            {fa.interestRate && (
              <div>
                <p className="text-xs text-muted-foreground uppercase tracking-wide">{t("schemes.detail.interestRate")}</p>
                <p className="text-lg font-semibold mt-1">
                  {fa.interestRate.min}% – {fa.interestRate.max}% p.a.
                </p>
              </div>
            )}
            {fa.repaymentMonths && (
              <div>
                <p className="text-xs text-muted-foreground uppercase tracking-wide">{t("schemes.detail.repaymentTenure")}</p>
                <p className="text-lg font-semibold mt-1">
                  {Math.floor(fa.repaymentMonths.min / 12)}–{Math.floor(fa.repaymentMonths.max / 12)} years
                </p>
              </div>
            )}
            {fa.moratoriumMonths && (
              <div>
                <p className="text-xs text-muted-foreground uppercase tracking-wide">{t("schemes.detail.moratorium")}</p>
                <p className="text-lg font-semibold mt-1">
                  {fa.moratoriumMonths.min}–{fa.moratoriumMonths.max} months
                </p>
              </div>
            )}
          </div>
        </CollapsibleSection>

        <CollapsibleSection title={t("schemes.detail.eligibility")} icon={ShieldCheck} defaultOpen={false}>
          <div className="space-y-3">
            {scheme.eligibilityRules.categories?.length && (
              <div>
                <p className="text-sm font-semibold">{t("schemes.detail.eligibleCategories")}</p>
                <div className="flex flex-wrap gap-1.5 mt-1">
                  {scheme.eligibilityRules.categories.map((c) => (
                    <Badge key={c} variant="secondary" className="text-xs">{c}</Badge>
                  ))}
                </div>
              </div>
            )}
            {scheme.eligibilityRules.maxIncome && (
              <div>
                <p className="text-sm font-semibold">{t("schemes.detail.incomeCeiling")}</p>
                <p className="text-sm text-muted-foreground">
                  Up to {formatAmount(scheme.eligibilityRules.maxIncome)} annually
                </p>
              </div>
            )}
            {scheme.eligibilityRules.states?.length && (
              <div>
                <p className="text-sm font-semibold">{t("schemes.detail.eligibleStates")}</p>
                <p className="text-sm text-muted-foreground">
                  {scheme.eligibilityRules.states.join(", ")}
                </p>
              </div>
            )}
            {scheme.eligibilityRules.occupations?.length && (
              <div>
                <p className="text-sm font-semibold">{t("schemes.detail.eligibleOccupations")}</p>
                <p className="text-sm text-muted-foreground">
                  {scheme.eligibilityRules.occupations.join(", ")}
                </p>
              </div>
            )}
          </div>
        </CollapsibleSection>

        <CollapsibleSection title={t("schemes.detail.documents")} icon={FileText} defaultOpen={false}>
          <ul className="space-y-2">
            {scheme.requiredDocuments?.map((doc) => (
              <li key={doc.name} className="flex items-start gap-2 text-sm">
                {doc.mandatory ? (
                  <CheckCircle2 className="size-4 shrink-0 mt-0.5 text-success" />
                ) : (
                  <XCircle className="size-4 shrink-0 mt-0.5 text-muted-foreground" />
                )}
                <div>
                  <span className={doc.mandatory ? "font-medium" : "text-muted-foreground"}>
                    {doc.name}
                  </span>
                  <p className="text-xs text-muted-foreground">{doc.description}</p>
                </div>
              </li>
            ))}
          </ul>
        </CollapsibleSection>

        {scheme.applicationProcess && (
          <CollapsibleSection title={t("schemes.detail.applicationProcess")} icon={FileText} defaultOpen={false}>
            <p className="text-sm leading-relaxed text-muted-foreground">
              {scheme.applicationProcess}
            </p>
          </CollapsibleSection>
        )}

        <CollapsibleSection title={t("schemes.detail.sourceTrust")} icon={ShieldCheck} defaultOpen={false}>
          <div className="space-y-2 text-sm text-muted-foreground">
            <p>{t("schemes.detail.source")}: {scheme.source}</p>
            <p>{t("schemes.detail.lastUpdated")}: {scheme.lastUpdated}</p>
            {scheme.officialUrl && (
              <p>
                {t("schemes.detail.officialUrl")}:{" "}
                <a href={scheme.officialUrl} target="_blank" rel="noopener noreferrer" className="text-primary underline">
                  {scheme.officialUrl}
                </a>
              </p>
            )}
            <p className="text-xs italic">{t("schemes.detail.disclaimer")}</p>
          </div>
        </CollapsibleSection>
      </div>
    </main>
  )
}
