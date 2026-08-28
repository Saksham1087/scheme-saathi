import { useEffect, useMemo } from "react"
import { useSearchParams, Link } from "react-router-dom"
import { useTranslation } from "react-i18next"
import {
  FileCheck2,
  Compass,
  Search,
  Info,
  ShieldCheck,
  ArrowRight,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { DocumentChecklistItem } from "@/components/documents/DocumentChecklistItem"
import { DocumentReadinessMeter } from "@/components/documents/DocumentReadinessMeter"
import { useDocumentStore } from "@/stores/useDocumentStore"
import { useSchemeStore } from "@/stores/useSchemeStore"
import {
  getSchemeDocumentConfig,
  getDocumentCategories,
  computeReadiness,
  SCHEME_DOCUMENT_RULES,
} from "@/lib/documentRules"
import type { DocumentCategory } from "@/types"

export default function DocumentsPage() {
  const { t, i18n } = useTranslation()
  const lang = (i18n.language === "hi" ? "hi" : "en") as "en" | "hi"
  const [searchParams, setSearchParams] = useSearchParams()

  const {
    selectedSchemeId,
    setSelectedSchemeId,
    activeCategory,
    setActiveCategory,
    searchQuery,
    setSearchQuery,
    checkedDocMap,
    docNotesMap,
    digiLockerVerifications,
    manualUploads,
    toggleDocCheck,
    setDocNote,
    markAllCheckedForScheme,
    resetChecklistForScheme,
  } = useDocumentStore()

  const { schemes, loadSchemes } = useSchemeStore()

  // Initialize schemes on mount
  useEffect(() => {
    void loadSchemes()
  }, [loadSchemes])

  // Sync with URL query parameter ?scheme=...
  useEffect(() => {
    const urlScheme = searchParams.get("scheme")
    if (urlScheme && urlScheme !== selectedSchemeId) {
      setSelectedSchemeId(urlScheme)
    }
  }, [searchParams, selectedSchemeId, setSelectedSchemeId])

  const handleSchemeChange = (newSchemeId: string) => {
    setSelectedSchemeId(newSchemeId)
    setSearchParams({ scheme: newSchemeId }, { replace: true })
  }

  // Find active scheme information
  const activeSchemeFromStore = schemes.find((s) => s.id === selectedSchemeId)
  const schemeConfig = useMemo(() => {
    return getSchemeDocumentConfig(
      selectedSchemeId,
      activeSchemeFromStore?.name,
      activeSchemeFromStore?.type,
    )
  }, [selectedSchemeId, activeSchemeFromStore])

  const schemeName =
    activeSchemeFromStore?.name?.[lang] ||
    activeSchemeFromStore?.name?.en ||
    schemeConfig.schemeName?.[lang] ||
    schemeConfig.schemeName?.en ||
    "Selected Scheme"

  const documents = schemeConfig.documents
  const docIds = useMemo(() => documents.map((d) => d.id), [documents])
  const readiness = useMemo(
    () => computeReadiness(documents, checkedDocMap),
    [documents, checkedDocMap],
  )

  // Filter documents by category and search query
  const categories = useMemo(() => getDocumentCategories(), [])

  const filteredDocuments = useMemo(() => {
    return documents.filter((doc) => {
      // Category filter
      if (activeCategory !== "all" && doc.category !== activeCategory) {
        return false
      }

      // Search query filter
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim()
        const nameEn = doc.name?.en?.toLowerCase() || ""
        const nameHi = doc.name?.hi?.toLowerCase() || ""
        const descEn = doc.description?.en?.toLowerCase() || ""
        const descHi = doc.description?.hi?.toLowerCase() || ""
        const authEn = doc.issuingAuthority?.en?.toLowerCase() || ""
        const authHi = doc.issuingAuthority?.hi?.toLowerCase() || ""
        const match =
          nameEn.includes(q) ||
          nameHi.includes(q) ||
          descEn.includes(q) ||
          descHi.includes(q) ||
          authEn.includes(q) ||
          authHi.includes(q)
        if (!match) return false
      }

      return true
    })
  }, [documents, activeCategory, searchQuery])

  // Count items per category
  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = { all: documents.length }
    for (const d of documents) {
      counts[d.category] = (counts[d.category] || 0) + 1
    }
    return counts
  }, [documents])

  const handlePrint = () => {
    window.print()
  }

  // Scheme options for dropdown
  const availableSchemeOptions = useMemo(() => {
    const predefinedKeys = Object.keys(SCHEME_DOCUMENT_RULES)
    const options: Array<{ id: string; label: string }> = []

    // Add predefined from rules first
    for (const key of predefinedKeys) {
      const match = schemes.find((s) => s.id === key)
      const label =
        match?.name?.[lang] ||
        match?.name?.en ||
        SCHEME_DOCUMENT_RULES[key]?.schemeName?.[lang] ||
        SCHEME_DOCUMENT_RULES[key]?.schemeName?.en ||
        key
      options.push({ id: key, label })
    }

    // Add any additional schemes from the seed/firestore that aren't in predefined list
    for (const s of schemes) {
      if (!predefinedKeys.includes(s.id)) {
        options.push({
          id: s.id,
          label: s.name?.[lang] || s.name?.en || s.id,
        })
      }
    }

    return options
  }, [schemes, lang])

  return (
    <div className="min-h-screen bg-background pb-16">
      {/* Print-Only Header (Hidden on screen, visible during window.print()) */}
      <div className="hidden print:block p-8 border-b border-black/20 text-black">
        <div className="flex items-center justify-between border-b pb-4 mb-4">
          <div>
            <h1 className="text-2xl font-bold">SchemeSathi — Document Readiness Slip</h1>
            <p className="text-sm text-gray-600">Statutory Documentation Verification Checklist</p>
          </div>
          <div className="text-right text-xs text-gray-500">
            <p>Generated on: {new Date().toLocaleDateString()}</p>
            <p>Verification Status: {readiness.percentage}% Complete</p>
          </div>
        </div>

        <div className="mb-6">
          <h2 className="text-lg font-bold">Target Scheme: {schemeName}</h2>
          <p className="text-sm text-gray-700 mt-1">
            Status: {readiness.completedCount} of {readiness.totalCount} documents assembled (
            {readiness.mandatoryCompleted}/{readiness.mandatoryTotal} mandatory documents ready)
          </p>
        </div>

        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="border-b-2 border-black">
              <th className="py-2 px-1 font-bold">Status</th>
              <th className="py-2 px-2 font-bold">Document Name</th>
              <th className="py-2 px-2 font-bold">Type</th>
              <th className="py-2 px-2 font-bold">Issuing Authority</th>
              <th className="py-2 px-2 font-bold">Notes / Serial No.</th>
            </tr>
          </thead>
          <tbody>
            {documents.map((doc) => {
              const isChecked = Boolean(checkedDocMap[doc.id])
              const isDigiLocker = Boolean(digiLockerVerifications[doc.id])
              const isUploaded = Boolean(manualUploads[doc.id])
              const note =
                docNotesMap[doc.id] ||
                (isDigiLocker
                  ? `DigiLocker Cert: ${digiLockerVerifications[doc.id].certificateNo}`
                  : isUploaded
                    ? `Uploaded: ${manualUploads[doc.id].fileName}`
                    : "—")

              let statusText = "[   PENDING ]"
              if (isDigiLocker) {
                statusText = "[ ✓ DIGILOCKER VERIFIED ]"
              } else if (isUploaded) {
                statusText = "[ ✓ FILE ATTACHED ]"
              } else if (isChecked) {
                statusText = "[ ✓ READY ]"
              }

              return (
                <tr key={doc.id} className="border-b border-gray-200">
                  <td className="py-2 px-1">
                    <span className="font-bold">{statusText}</span>
                  </td>
                  <td className="py-2 px-2 font-semibold">
                    {doc.name[lang] || doc.name.en}
                  </td>
                  <td className="py-2 px-2">
                    {doc.mandatory ? "Mandatory" : "Optional"}
                  </td>
                  <td className="py-2 px-2 text-gray-600">
                    {doc.issuingAuthority[lang] || doc.issuingAuthority.en}
                  </td>
                  <td className="py-2 px-2 font-mono text-[10px]">
                    {note}
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>

        <div className="mt-8 pt-4 border-t border-gray-300 text-[11px] text-gray-600 space-y-1">
          <p className="font-bold">Instructions for State Channelizing Agency / Bank Branch Submission:</p>
          <p>1. Carry all original certificates along with 2 sets of self-attested photocopies.</p>
          <p>2. Ensure bank account is Aadhaar-seeded and active for direct DBT subsidy disbursement.</p>
          <p>3. Quotations for machinery or solar units must include the authorized vendor's valid GSTIN.</p>
        </div>
      </div>

      {/* Screen View */}
      <div className="print:hidden">
        {/* Page Hero Header */}
        <section className="border-b border-border/80 bg-muted/20 py-8 sm:py-10">
          <div className="mx-auto max-w-6xl px-4">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div className="space-y-2 max-w-2xl">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-semibold">
                  <FileCheck2 className="size-4" />
                  <span>{t("documents.badge", "Interactive Statutory Document Checklist")}</span>
                </div>
                <h1 className="font-display text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-foreground">
                  {t("documents.pageTitle", "Document Readiness Checklist")}
                </h1>
                <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
                  {t(
                    "documents.pageSubtitle",
                    "Assemble the exact statutory certificates and quotations required for your target scheme. Track progress in real-time and export your verified document slip.",
                  )}
                </p>
              </div>

              {/* Scheme Switcher Dropdown */}
              <div className="w-full md:w-80 shrink-0 bg-card p-4 rounded-xl border border-border/80 shadow-xs space-y-2">
                <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground block">
                  {t("documents.selectSchemeLabel", "Selected Target Scheme")}
                </label>
                <Select value={selectedSchemeId} onValueChange={handleSchemeChange}>
                  <SelectTrigger className="w-full font-medium text-sm h-11">
                    <SelectValue placeholder={t("documents.selectSchemePlaceholder", "Choose scheme...")} />
                  </SelectTrigger>
                  <SelectContent className="max-h-72">
                    {availableSchemeOptions.map((opt) => (
                      <SelectItem key={opt.id} value={opt.id} className="text-sm py-2">
                        {opt.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <div className="flex items-center justify-between text-[11px] text-muted-foreground pt-1">
                  <span>{documents.length} {t("documents.documentsRequired", "documents configured")}</span>
                  {activeSchemeFromStore && (
                    <Link
                      to={`/schemes/${activeSchemeFromStore.id}`}
                      className="text-primary font-medium hover:underline inline-flex items-center gap-0.5"
                    >
                      <span>{t("schemes.viewDetails", "View Scheme Details")}</span>
                      <ArrowRight className="size-3" />
                    </Link>
                  )}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Main Content Area */}
        <main className="mx-auto max-w-6xl px-4 py-8 space-y-8">
          {/* Real-time Readiness Progress Meter */}
          <DocumentReadinessMeter
            readiness={readiness}
            onMarkAll={() => markAllCheckedForScheme(docIds)}
            onClearAll={() => resetChecklistForScheme(docIds)}
            onPrint={handlePrint}
          />

          {/* Scheme Special Instructions Callout */}
          {schemeConfig.specialInstructions && (
            <div className="rounded-xl border border-primary/20 bg-primary/5 p-4 sm:p-5 flex items-start gap-3 text-xs sm:text-sm">
              <Info className="size-5 text-primary shrink-0 mt-0.5" />
              <div className="space-y-1">
                <h4 className="font-semibold text-foreground">
                  {t("documents.specialInstructionsTitle", "Scheme Documentation Specifics")}:
                </h4>
                <p className="text-muted-foreground leading-relaxed">
                  {schemeConfig.specialInstructions[lang] || schemeConfig.specialInstructions.en}
                </p>
              </div>
            </div>
          )}

          {/* Search & Category Filter Section */}
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
              {/* Category Filter Tabs */}
              <div className="overflow-x-auto pb-1 sm:pb-0">
                <Tabs
                  value={activeCategory}
                  onValueChange={(val) => setActiveCategory(val as DocumentCategory)}
                  className="w-auto"
                >
                  <TabsList className="h-9 p-1 bg-muted/60">
                    {categories.map((cat) => {
                      const count = categoryCounts[cat.id] || 0
                      if (cat.id !== "all" && count === 0) return null
                      return (
                        <TabsTrigger
                          key={cat.id}
                          value={cat.id}
                          className="text-xs px-2.5 py-1 font-medium data-[state=active]:bg-background"
                        >
                          <span>{cat.label[lang] || cat.label.en}</span>
                          <span className="ml-1.5 text-[10px] opacity-70 rounded-full bg-muted-foreground/15 px-1.5 py-0.2">
                            {count}
                          </span>
                        </TabsTrigger>
                      )
                    })}
                  </TabsList>
                </Tabs>
              </div>

              {/* Keyword Search Input */}
              <div className="relative w-full sm:w-64">
                <Search className="size-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                <Input
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder={t("documents.searchPlaceholder", "Filter documents...")}
                  className="pl-9 h-9 text-xs"
                />
              </div>
            </div>

            {/* Checklist Items List */}
            {filteredDocuments.length > 0 ? (
              <div className="space-y-3.5">
                {filteredDocuments.map((doc) => (
                  <DocumentChecklistItem
                    key={doc.id}
                    document={doc}
                    checked={Boolean(checkedDocMap[doc.id])}
                    note={docNotesMap[doc.id]}
                    onToggle={() => toggleDocCheck(doc.id)}
                    onNoteChange={(note) => setDocNote(doc.id, note)}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-12 border border-dashed border-border rounded-xl bg-card">
                <p className="text-sm text-muted-foreground mb-3">
                  {t("documents.noMatchingDocs", "No documents match the active filter.")}
                </p>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setActiveCategory("all")
                    setSearchQuery("")
                  }}
                >
                  {t("documents.resetFilters", "Reset Filters")}
                </Button>
              </div>
            )}
          </div>

          {/* Quick Bridge & Next Steps Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
            {/* Channel Partner Bridge Card */}
            <Card className="border-border/80 shadow-xs bg-linear-to-br from-card to-muted/20">
              <CardHeader className="pb-3">
                <div className="flex items-center gap-2 text-primary font-semibold text-xs uppercase tracking-wider">
                  <Compass className="size-4" />
                  <span>{t("documents.readyToApplyTitle", "Ready to Apply?")}</span>
                </div>
                <CardTitle className="font-display text-lg font-bold text-foreground">
                  {t("documents.findPartnerTitle", "Locate Your Channel Partner")}
                </CardTitle>
                <CardDescription className="text-xs text-muted-foreground leading-relaxed">
                  {t(
                    "documents.findPartnerDesc",
                    "Government concessional loans are disbursed through State Channelizing Agencies (SCAs), Regional Rural Banks (RRBs), and Public Sector Banks. Find the nearest office in your district.",
                  )}
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-0">
                <Button asChild size="lg" className="w-full sm:w-auto font-semibold gap-2">
                  <Link to={`/partners?type=${schemeConfig.schemeType}`}>
                    <Compass className="size-4" />
                    <span>{t("documents.locatePartnersCta", "Find Nearest Partner Branch")}</span>
                    <ArrowRight className="size-4" />
                  </Link>
                </Button>
              </CardContent>
            </Card>

            {/* Document Pitfalls & Verification Rules Guide */}
            <Card className="border-border/80 shadow-xs bg-card">
              <CardHeader className="pb-3">
                <div className="flex items-center gap-2 text-accent font-semibold text-xs uppercase tracking-wider">
                  <ShieldCheck className="size-4" />
                  <span>{t("documents.pitfallsTitle", "Statutory Compliance Checklist")}</span>
                </div>
                <CardTitle className="font-display text-lg font-bold text-foreground">
                  {t("documents.avoidRejectionsTitle", "Avoid Common Application Delays")}
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-0 space-y-2.5 text-xs text-muted-foreground">
                <div className="flex items-start gap-2">
                  <span className="font-bold text-primary shrink-0">1.</span>
                  <p>
                    <strong className="text-foreground">{t("documents.rule1Title", "Income Certificate Validity")}:</strong>{" "}
                    {t("documents.rule1Desc", "Income certificates must be issued within the last 12 months by a Tehsildar or Revenue Officer.")}
                  </p>
                </div>
                <div className="flex items-start gap-2">
                  <span className="font-bold text-primary shrink-0">2.</span>
                  <p>
                    <strong className="text-foreground">{t("documents.rule2Title", "Name & DOB Matching")}:</strong>{" "}
                    {t("documents.rule2Desc", "Applicant name spelling on Aadhaar, Caste Certificate, and Bank Passbook must match exactly.")}
                  </p>
                </div>
                <div className="flex items-start gap-2">
                  <span className="font-bold text-primary shrink-0">3.</span>
                  <p>
                    <strong className="text-foreground">{t("documents.rule3Title", "Aadhaar DBT Seeding")}:</strong>{" "}
                    {t("documents.rule3Desc", "Your bank account must have NPCI DBT mapping enabled for direct subsidy credit.")}
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </div>
  )
}
