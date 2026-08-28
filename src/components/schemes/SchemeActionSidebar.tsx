import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import { useTranslation } from "react-i18next"
import { toast } from "sonner"
import {
  Calculator,
  Compass,
  Printer,
  Share2,
  ExternalLink,
  Check,
  ListTree,
  Headphones,
  Layers,
  FileCheck2,
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useCompareStore } from "@/stores/useCompareStore"
import type { Scheme } from "@/types"

interface SchemeActionSidebarProps {
  scheme: Scheme
  sections: Array<{ id: string; label: string; number: number }>
}

export function SchemeActionSidebar({ scheme, sections }: SchemeActionSidebarProps) {
  const { t } = useTranslation()
  const { isComparing, toggleScheme } = useCompareStore()
  const comparing = isComparing(scheme.id)
  const [copied, setCopied] = useState(false)
  const [activeSection, setActiveSection] = useState<string>("")

  // Pre-configured query params for EMI Calculator
  const minRate = scheme.rateRange?.min ?? 6.0
  const minTenure = scheme.tenureRangeMonths?.min ?? 12
  const maxTenure = scheme.tenureRangeMonths?.max ?? 60
  const minMoratorium = scheme.moratoriumDetails?.minMonths ?? scheme.moratorium?.minMonths ?? 0
  const interestAccrues = scheme.moratoriumDetails?.interestAccrues ?? scheme.moratorium?.interestAccrues ?? false

  const calcParams = new URLSearchParams({
    amount: (scheme.maxProjectCost ?? 100000).toString(),
    rate: minRate.toString(),
    tenure: Math.max(1, Math.round((minTenure + maxTenure) / 24)).toString(),
    moratorium: minMoratorium.toString(),
    accrual: interestAccrues ? "1" : "0",
    scheme: scheme.name?.en || scheme.id,
  }).toString()

  const partnerParams = new URLSearchParams({
    type: scheme.type || "micro",
  }).toString()

  const officialUrl = scheme.officialSourceUrl || scheme.officialUrl || "https://nsfdc.nic.in"

  // Share or copy link
  const handleShare = async () => {
    const shareData = {
      title: scheme.name?.en || "Scheme Details",
      text: scheme.description?.en || "",
      url: window.location.href,
    }

    if (navigator.share && navigator.canShare && navigator.canShare(shareData)) {
      try {
        await navigator.share(shareData)
        return
      } catch (err) {
        if ((err as Error).name !== "AbortError") {
          console.error("Share error:", err)
        }
      }
    }

    // Fallback: Copy to clipboard
    try {
      await navigator.clipboard.writeText(window.location.href)
      setCopied(true)
      toast.success(t("schemeDetails.linkCopied", "Scheme link copied to clipboard!"))
      setTimeout(() => setCopied(false), 2500)
    } catch {
      toast.error(t("schemeDetails.copyFailed", "Could not copy link to clipboard."))
    }
  }

  // Print scheme page
  const handlePrint = () => {
    window.print()
  }

  // Active section scrollspy
  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY + 140

      for (let i = sections.length - 1; i >= 0; i--) {
        const sectionEl = document.getElementById(sections[i].id)
        if (sectionEl) {
          const rect = sectionEl.getBoundingClientRect()
          const top = rect.top + window.scrollY
          if (scrollPosition >= top) {
            setActiveSection(sections[i].id)
            break
          }
        }
      }
    }

    window.addEventListener("scroll", handleScroll, { passive: true })
    handleScroll()
    return () => window.removeEventListener("scroll", handleScroll)
  }, [sections])

  const scrollToSection = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    e.preventDefault()
    const target = document.getElementById(id)
    if (target) {
      target.scrollIntoView({ behavior: "smooth", block: "start" })
      setActiveSection(id)
      window.history.pushState(null, "", `#${id}`)
    }
  }

  return (
    <aside className="space-y-6 lg:sticky lg:top-20">
      {/* Quick Action Tools Card */}
      <Card className="border-border/80 shadow-sm bg-card overflow-hidden">
        <CardHeader className="pb-3 bg-muted/30 border-b border-border/60">
          <CardTitle className="font-display text-base font-bold text-foreground">
            {t("schemeDetails.quickActionsTitle", "Quick Actions & Tools")}
          </CardTitle>
        </CardHeader>
        <CardContent className="p-4 space-y-3">
          {/* Calculate EMI CTA */}
          <Button
            asChild
            size="lg"
            className="w-full justify-start text-sm font-semibold min-h-[44px] shadow-xs"
          >
            <Link to={`/calculator?${calcParams}`}>
              <Calculator className="size-4 mr-2.5 text-accent" />
              {t("schemes.calculateEmi", "Calculate EMI")}
            </Link>
          </Button>

          {/* Find Channel Partners CTA */}
          <Button
            asChild
            variant="outline"
            size="lg"
            className="w-full justify-start text-sm font-semibold min-h-[44px]"
          >
            <Link to={`/partners?${partnerParams}`}>
              <Compass className="size-4 mr-2.5 text-primary" />
              {t("schemes.findPartners", "Find Channel Partners")}
            </Link>
          </Button>

          {/* Document Checklist CTA */}
          <Button
            asChild
            variant="outline"
            size="lg"
            className="w-full justify-start text-sm font-semibold min-h-[44px]"
          >
            <Link to={`/documents?scheme=${scheme.id}`}>
              <FileCheck2 className="size-4 mr-2.5 text-emerald-600 dark:text-emerald-400" />
              {t("schemes.documentChecklist", "Document Checklist")}
            </Link>
          </Button>

          {/* Add to Compare CTA */}
          <Button
            variant={comparing ? "secondary" : "outline"}
            size="lg"
            onClick={() => toggleScheme(scheme.id)}
            className={`w-full justify-start text-sm font-semibold min-h-[44px] ${
              comparing
                ? "border-primary/50 bg-primary/10 text-primary hover:bg-primary/20"
                : ""
            }`}
          >
            <Layers className={`size-4 mr-2.5 ${comparing ? "text-primary" : "text-accent"}`} />
            {comparing
              ? t("compare.inComparison", "Added to Comparison")
              : t("compare.addToCompare", "Add to Compare")}
          </Button>

          {/* Print & Share CTAs */}
          <div className="grid grid-cols-2 gap-2 pt-1">
            <Button
              variant="outline"
              size="sm"
              onClick={handlePrint}
              className="min-h-[44px] text-xs font-medium"
              title={t("schemeDetails.printScheme", "Print or save scheme as PDF")}
            >
              <Printer className="size-3.5 mr-1.5 text-muted-foreground" />
              {t("schemeDetails.print", "Print / PDF")}
            </Button>

            <Button
              variant="outline"
              size="sm"
              onClick={handleShare}
              className="min-h-[44px] text-xs font-medium"
              title={t("schemeDetails.shareScheme", "Share this scheme")}
            >
              {copied ? (
                <>
                  <Check className="size-3.5 mr-1.5 text-emerald-600" />
                  {t("schemeDetails.copied", "Copied")}
                </>
              ) : (
                <>
                  <Share2 className="size-3.5 mr-1.5 text-muted-foreground" />
                  {t("schemeDetails.share", "Share")}
                </>
              )}
            </Button>
          </div>

          {/* Official Ministry Link */}
          {officialUrl && (
            <div className="pt-2 border-t border-border/60">
              <Button
                asChild
                variant="ghost"
                size="sm"
                className="w-full justify-start text-xs font-medium text-muted-foreground hover:text-foreground h-9"
              >
                <a
                  href={officialUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 truncate"
                >
                  <ExternalLink className="size-3.5 shrink-0 text-primary" />
                  <span className="truncate">{t("schemeDetails.visitOfficialPortal", "Visit Official Portal")}</span>
                </a>
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Table of Contents Sticky Jump Navigation */}
      <Card className="border-border/80 shadow-xs hidden lg:block bg-card">
        <CardHeader className="pb-2.5 pt-4 px-4">
          <CardTitle className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
            <ListTree className="size-3.5 text-primary" />
            {t("schemeDetails.tableOfContents", "Table of Contents")}
          </CardTitle>
        </CardHeader>
        <CardContent className="px-2 pb-4 pt-1 max-h-[50vh] overflow-y-auto">
          <nav className="space-y-0.5">
            {sections.map((sec) => {
              const isActive = activeSection === sec.id
              return (
                <a
                  key={sec.id}
                  href={`#${sec.id}`}
                  onClick={(e) => scrollToSection(e, sec.id)}
                  className={`group flex items-center gap-2 rounded-md px-2.5 py-1.5 text-xs font-medium transition-colors ${
                    isActive
                      ? "bg-primary/10 text-primary font-semibold dark:bg-primary/20"
                      : "text-muted-foreground hover:bg-muted hover:text-foreground"
                  }`}
                >
                  <span
                    className={`flex size-4 shrink-0 items-center justify-center rounded-full text-[10px] ${
                      isActive
                        ? "bg-primary text-primary-foreground font-bold"
                        : "bg-muted text-muted-foreground group-hover:bg-primary/20 group-hover:text-primary"
                    }`}
                  >
                    {sec.number}
                  </span>
                  <span className="truncate">{sec.label}</span>
                </a>
              )
            })}
          </nav>
        </CardContent>
      </Card>

      {/* Official Corporation Helpline Card */}
      <div className="rounded-xl border border-border/80 bg-muted/40 p-4 space-y-2 text-xs">
        <div className="flex items-center gap-2 font-semibold text-foreground">
          <Headphones className="size-4 text-primary shrink-0" />
          <span>{t("schemeDetails.helplineTitle", "Need Assistance?")}</span>
        </div>
        <p className="text-muted-foreground text-[11px] leading-relaxed">
          {t("schemeDetails.helplineDesc", "Contact NSFDC official toll-free helpline or visit the nearest State Channelizing Agency.")}
        </p>
        <div className="pt-1 font-mono font-bold text-primary text-xs">
          📞 1800-180-2222 / 14420
        </div>
      </div>
    </aside>
  )
}
