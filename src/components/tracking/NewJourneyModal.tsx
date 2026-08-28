import { useEffect, useMemo, useState } from "react"
import { useTranslation } from "react-i18next"
import { toast } from "sonner"
import { PlusCircle, Building2, Landmark, DollarSign, CheckCircle2, ShieldAlert } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogDescription,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { useApplicationStore } from "@/stores/useApplicationStore"
import { useLocaleStore } from "@/stores/localeStore"
import { useAuthStore } from "@/stores/authStore"
import { getSeedSchemes, fetchSchemes } from "@/services/schemeService"
import partnersSeed from "@seed/partners.seed.json"
import type { ChannelPartner, Scheme, SchemeType } from "@/types"
import { fmtINR } from "@/lib/format"

interface NewJourneyModalProps {
  onCreated?: (journeyId: string) => void
  triggerButton?: React.ReactNode
}

export function NewJourneyModal({ onCreated, triggerButton }: NewJourneyModalProps) {
  const { t } = useTranslation()
  const { lang } = useLocaleStore()
  const { user } = useAuthStore()
  const { createJourney } = useApplicationStore()

  const [open, setOpen] = useState(false)
  const [schemes, setSchemes] = useState<Scheme[]>([])
  const [partners, setPartners] = useState<ChannelPartner[]>([])

  const [selectedSchemeId, setSelectedSchemeId] = useState<string>("")
  const [selectedPartnerId, setSelectedPartnerId] = useState<string>("")
  const [amount, setAmount] = useState<number>(140000)
  const [ackNumber, setAckNumber] = useState<string>("")
  const [notes, setNotes] = useState<string>("")

  // Load catalogs
  useEffect(() => {
    async function loadData() {
      try {
        const fetchedSchemes = await fetchSchemes()
        setSchemes(fetchedSchemes.length > 0 ? fetchedSchemes : getSeedSchemes())
      } catch {
        setSchemes(getSeedSchemes())
      }
      setPartners(partnersSeed as unknown as ChannelPartner[])
    }
    void loadData()
  }, [])

  // Auto-set default scheme when loaded
  useEffect(() => {
    if (schemes.length > 0 && !selectedSchemeId) {
      setSelectedSchemeId(schemes[0].id)
      setAmount(schemes[0].maxProjectCost || 140000)
    }
  }, [schemes, selectedSchemeId])

  const selectedScheme = useMemo(
    () => schemes.find((s) => s.id === selectedSchemeId),
    [schemes, selectedSchemeId]
  )

  // Compatible partners based on selected scheme type
  const compatiblePartners = useMemo(() => {
    if (!selectedScheme) return partners
    return partners.filter((p) =>
      p.schemeCategories.includes(selectedScheme.type as SchemeType)
    )
  }, [partners, selectedScheme])

  // Auto-set first compatible partner
  useEffect(() => {
    if (compatiblePartners.length > 0) {
      if (!selectedPartnerId || !compatiblePartners.some((p) => p.id === selectedPartnerId)) {
        setSelectedPartnerId(compatiblePartners[0].id)
      }
    }
  }, [compatiblePartners, selectedPartnerId])

  function handleSchemeChange(id: string) {
    setSelectedSchemeId(id)
    const scheme = schemes.find((s) => s.id === id)
    if (scheme) {
      setAmount(scheme.maxProjectCost || 140000)
    }
  }

  function handleCreate() {
    if (!selectedScheme || !selectedPartnerId || amount <= 0) {
      toast.error(t("track.validationError"))
      return
    }

    const partner = partners.find((p) => p.id === selectedPartnerId)
    if (!partner) return

    const journey = createJourney({
      schemeId: selectedScheme.id,
      schemeName: selectedScheme.name,
      schemeType: selectedScheme.type as SchemeType,
      partnerId: partner.id,
      partnerName: partner.name,
      partnerBranch: partner.address,
      partnerAddress: `${partner.address}, ${partner.city}, ${partner.state}`,
      partnerPhone: partner.phone,
      nodalOfficerName: partner.nodalOfficer?.name,
      nodalOfficerPhone: partner.nodalOfficer?.phone,
      requestedAmount: amount,
      acknowledgmentNumber: ackNumber.trim(),
      initialNotes: notes.trim(),
      userId: user?.uid,
    })

    toast.success(
      t("track.journeyCreatedToast", {
        scheme: selectedScheme.name[lang] || selectedScheme.name.en,
      })
    )

    setOpen(false)
    setAckNumber("")
    setNotes("")

    if (onCreated) {
      onCreated(journey.id)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {triggerButton || (
          <Button className="gap-2 font-semibold">
            <PlusCircle className="size-4" />
            {t("track.startNewJourneyBtn")}
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="max-w-xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="font-display text-xl flex items-center gap-2">
            <Landmark className="size-5 text-primary" />
            {t("track.newJourneyModalTitle")}
          </DialogTitle>
          <DialogDescription className="text-xs text-muted-foreground">
            {t("track.newJourneyModalSubtitle")}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-5 pt-2">
          {/* Step 1: Scheme Selection */}
          <div className="space-y-2">
            <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground flex items-center justify-between">
              <span>{t("track.selectSchemeLabel")}</span>
              <span className="text-[11px] font-normal text-muted-foreground">
                {t("track.stepOfModal", { current: 1, total: 3 })}
              </span>
            </Label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
              {schemes.map((s) => {
                const isSelected = s.id === selectedSchemeId
                return (
                  <button
                    key={s.id}
                    type="button"
                    onClick={() => handleSchemeChange(s.id)}
                    className={`text-left p-3 rounded-lg border text-xs transition-all cursor-pointer flex flex-col justify-between ${
                      isSelected
                        ? "border-primary bg-primary/5 ring-2 ring-primary/20"
                        : "border-border hover:border-border/80 hover:bg-muted/50"
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <Badge variant="secondary" className="text-[10px] uppercase font-semibold">
                          {t(`schemeTypes.${s.type}`)}
                        </Badge>
                        {isSelected && <CheckCircle2 className="size-3.5 text-primary" />}
                      </div>
                      <p className="font-semibold text-foreground line-clamp-2">
                        {s.name[lang] || s.name.en}
                      </p>
                    </div>
                    <p className="mt-2 text-[11px] font-medium text-primary">
                      {t("track.upToMaxCost", { cost: fmtINR(s.maxProjectCost) })}
                    </p>
                  </button>
                )
              })}
            </div>
          </div>

          {/* Step 2: Channel Partner Selection */}
          <div className="space-y-2">
            <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground flex items-center justify-between">
              <span>{t("track.selectPartnerLabel")}</span>
              <span className="text-[11px] font-normal text-muted-foreground">
                {t("track.stepOfModal", { current: 2, total: 3 })}
              </span>
            </Label>
            <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
              {compatiblePartners.map((p) => {
                const isSelected = p.id === selectedPartnerId
                const isHighNpa = p.npaFlag === "high"
                return (
                  <button
                    key={p.id}
                    type="button"
                    onClick={() => setSelectedPartnerId(p.id)}
                    className={`w-full text-left p-2.5 rounded-lg border text-xs transition-all cursor-pointer flex items-start justify-between gap-3 ${
                      isSelected
                        ? "border-primary bg-primary/5 ring-1 ring-primary/20"
                        : "border-border hover:border-border/80 hover:bg-muted/40"
                    }`}
                  >
                    <div className="space-y-0.5">
                      <div className="flex items-center gap-2">
                        <Building2 className="size-3.5 text-primary shrink-0" />
                        <span className="font-semibold text-foreground">{p.name}</span>
                        <Badge variant="outline" className="text-[10px] px-1.5 py-0 font-normal">
                          {p.type}
                        </Badge>
                      </div>
                      <p className="text-[11px] text-muted-foreground pl-5">
                        {p.city}, {p.state} · {p.phone}
                      </p>
                    </div>
                    {isSelected && <CheckCircle2 className="size-4 text-primary shrink-0 mt-0.5" />}
                    {isHighNpa && (
                      <span className="text-[10px] text-destructive flex items-center gap-0.5 shrink-0">
                        <ShieldAlert className="size-3" />
                        {t("track.highNpaWarning")}
                      </span>
                    )}
                  </button>
                )
              })}
            </div>
          </div>

          {/* Step 3: Requested Amount & Details */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label htmlFor="journey-amount" className="text-xs font-semibold text-foreground">
                {t("track.requestedLoanAmount")} (₹)
              </Label>
              <div className="relative">
                <DollarSign className="size-4 text-muted-foreground absolute left-2.5 top-2.5" />
                <Input
                  id="journey-amount"
                  type="number"
                  min={10000}
                  max={selectedScheme?.maxProjectCost || 5000000}
                  step={5000}
                  value={amount || ""}
                  onChange={(e) => setAmount(Number(e.target.value))}
                  className="pl-8 text-xs font-medium"
                />
              </div>
              {selectedScheme && (
                <p className="text-[11px] text-muted-foreground">
                  {t("track.maxCostNotice", { max: fmtINR(selectedScheme.maxProjectCost) })}
                </p>
              )}
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="journey-ack" className="text-xs font-semibold text-foreground">
                {t("track.initialAckNumberOptional")}
              </Label>
              <Input
                id="journey-ack"
                placeholder="e.g. UP-SCA-2026-889"
                value={ackNumber}
                onChange={(e) => setAckNumber(e.target.value)}
                className="text-xs font-mono uppercase"
              />
              <p className="text-[11px] text-muted-foreground">
                {t("track.ackHintOptional")}
              </p>
            </div>
          </div>

          {/* Initial Project / Target Notes */}
          <div className="space-y-1.5">
            <Label htmlFor="journey-notes" className="text-xs font-semibold text-foreground">
              {t("track.initialJourneyNotesOptional")}
            </Label>
            <Textarea
              id="journey-notes"
              rows={2}
              placeholder={t("track.initialJourneyNotesPlaceholder")}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="text-xs resize-none"
            />
          </div>

          {/* Action Buttons */}
          <div className="pt-2 flex items-center justify-end gap-2.5">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setOpen(false)}
            >
              {t("common.cancel")}
            </Button>
            <Button
              type="button"
              size="sm"
              onClick={handleCreate}
              disabled={!selectedSchemeId || !selectedPartnerId || amount <= 0}
              className="gap-1.5 font-semibold"
            >
              <PlusCircle className="size-4" />
              {t("track.createJourneySubmitBtn")}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
