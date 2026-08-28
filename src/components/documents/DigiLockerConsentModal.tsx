import { useState } from "react"
import { useTranslation } from "react-i18next"
import { toast } from "sonner"
import {
  ShieldCheck,
  CheckCircle2,
  Lock,
  Sparkles,
  Loader2,
  Trash2,
  FileText,
  Building,
  Calendar,
  User,
  Hash,
  AlertCircle,
} from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { simulateDigiLockerFetch } from "@/lib/digilockerService"
import { useDocumentStore } from "@/stores/useDocumentStore"
import type { RequiredDocument } from "@/types"

interface DigiLockerConsentModalProps {
  document: RequiredDocument
  open: boolean
  onOpenChange: (open: boolean) => void
}

type ModalStage = "consent" | "fetching" | "verified_view" | "confirm_unlink"

export function DigiLockerConsentModal({
  document,
  open,
  onOpenChange,
}: DigiLockerConsentModalProps) {
  const { t, i18n } = useTranslation()
  const lang = (i18n.language === "hi" ? "hi" : "en") as "en" | "hi"

  const {
    digiLockerVerifications,
    syncDigiLockerDocument,
    unlinkDigiLockerDocument,
  } = useDocumentStore()

  const existingMetadata = digiLockerVerifications[document.id]

  const [customStage, setCustomStage] = useState<ModalStage | null>(null)
  const [fetchProgressStep, setFetchProgressStep] = useState<number>(1)

  const stage: ModalStage = customStage ?? (existingMetadata ? "verified_view" : "consent")
  const activeMetadata = existingMetadata || null

  const handleOpenChange = (newOpen: boolean) => {
    if (!newOpen) {
      setCustomStage(null)
      setFetchProgressStep(1)
    }
    onOpenChange(newOpen)
  }


  const docName = document.name?.[lang] || document.name?.en || ""

  const handleStartFetch = async () => {
    setCustomStage("fetching")
    setFetchProgressStep(1)

    const stepTimer1 = setTimeout(() => setFetchProgressStep(2), 500)
    const stepTimer2 = setTimeout(() => setFetchProgressStep(3), 1000)

    try {
      const metadata = await simulateDigiLockerFetch(document.id, docName)
      clearTimeout(stepTimer1)
      clearTimeout(stepTimer2)

      syncDigiLockerDocument(document.id, metadata)
      setCustomStage("verified_view")

      toast.success(
        t(
          "digilocker.toastSyncSuccess",
          "Certificate verified successfully via DigiLocker!"
        )
      )
    } catch {
      clearTimeout(stepTimer1)
      clearTimeout(stepTimer2)
      setCustomStage("consent")
      toast.error(
        t(
          "digilocker.toastSyncError",
          "Unable to sync with DigiLocker gateway. Please try again or upload manually."
        )
      )
    }
  }

  const handleUnlink = () => {
    unlinkDigiLockerDocument(document.id)
    setCustomStage("consent")
    toast.info(
      t(
        "digilocker.toastUnlinkSuccess",
        "DigiLocker certificate unlinked."
      )
    )
    handleOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="max-w-lg sm:max-w-xl max-h-[90vh] overflow-y-auto p-4 sm:p-6">
        {/* Stage 1: Statutory Consent Disclosure */}
        {stage === "consent" && (
          <div className="space-y-5">
            <DialogHeader className="space-y-2">
              <div className="flex items-center gap-2 text-cyan-700 dark:text-cyan-400">
                <div className="flex items-center justify-center size-8 rounded-lg bg-cyan-100 dark:bg-cyan-950/60 border border-cyan-300 dark:border-cyan-800">
                  <ShieldCheck className="size-5 text-cyan-600 dark:text-cyan-400" />
                </div>
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider block">
                    {t("digilocker.headerBadge", "DigiLocker National Digital Verification")}
                  </span>
                  <span className="text-[11px] text-muted-foreground">
                    {t("digilocker.meitySubhead", "Ministry of Electronics & IT (MeitY), Govt. of India")}
                  </span>
                </div>
              </div>
              <DialogTitle className="text-lg sm:text-xl font-bold text-foreground pt-1">
                {t("digilocker.consentTitle", "Verify {{docName}} via DigiLocker", { docName })}
              </DialogTitle>
              <DialogDescription className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                {t(
                  "digilocker.consentDescription",
                  "Directly fetch your digitally signed statutory certificate from the DigiLocker repository. Verified credentials are automatically accepted by banks and State Channelizing Agencies without physical stamping."
                )}
              </DialogDescription>
            </DialogHeader>

            {/* Statutory Consent Box */}
            <div className="rounded-xl border border-cyan-200 dark:border-cyan-900/60 bg-cyan-50/50 dark:bg-cyan-950/20 p-4 space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-cyan-900 dark:text-cyan-300 flex items-center gap-1.5">
                <Lock className="size-3.5" />
                <span>{t("digilocker.statutoryConsentTitle", "Applicant Statutory Consent Notice")}</span>
              </h4>
              <p className="text-xs text-cyan-950/80 dark:text-cyan-200/90 leading-relaxed">
                {t(
                  "digilocker.consentLegalText",
                  "By proceeding, you grant SchemeSathi one-time authorization to query the DigiLocker National Gateway for the purpose of validating statutory eligibility. Only cryptographic metadata (Certificate Serial No, Issuing Authority, Verification Hash) is retrieved."
                )}
              </p>
              <div className="text-[11px] text-cyan-800/80 dark:text-cyan-300/70 border-t border-cyan-200/80 dark:border-cyan-800/60 pt-2 flex items-center gap-1">
                <Sparkles className="size-3 shrink-0" />
                <span>
                  {t(
                    "digilocker.itActCompliance",
                    "Compliant with Rule 9A of Information Technology Rules 2016."
                  )}
                </span>
              </div>
            </div>

            {/* What will be retrieved list */}
            <div className="space-y-2 text-xs">
              <span className="font-semibold text-foreground block">
                {t("digilocker.retrievedDataTitle", "Data accessed during verification:")}
              </span>
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-muted-foreground">
                <li className="flex items-center gap-2 bg-muted/40 p-2 rounded-lg border border-border/50">
                  <CheckCircle2 className="size-3.5 text-cyan-600 shrink-0" />
                  <span>{t("digilocker.dataItem1", "Certificate / Roll Number")}</span>
                </li>
                <li className="flex items-center gap-2 bg-muted/40 p-2 rounded-lg border border-border/50">
                  <CheckCircle2 className="size-3.5 text-cyan-600 shrink-0" />
                  <span>{t("digilocker.dataItem2", "Beneficiary Full Name")}</span>
                </li>
                <li className="flex items-center gap-2 bg-muted/40 p-2 rounded-lg border border-border/50">
                  <CheckCircle2 className="size-3.5 text-cyan-600 shrink-0" />
                  <span>{t("digilocker.dataItem3", "Competent Issuing Authority")}</span>
                </li>
                <li className="flex items-center gap-2 bg-muted/40 p-2 rounded-lg border border-border/50">
                  <CheckCircle2 className="size-3.5 text-cyan-600 shrink-0" />
                  <span>{t("digilocker.dataItem4", "PKI Digital Signature Hash")}</span>
                </li>
              </ul>
            </div>

            <DialogFooter className="flex flex-col-reverse sm:flex-row gap-2 pt-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
                className="h-11 min-h-[44px] text-xs font-semibold"
              >
                {t("common.cancel", "Cancel")}
              </Button>
              <Button
                type="button"
                onClick={handleStartFetch}
                className="h-11 min-h-[44px] text-xs font-semibold gap-2 bg-cyan-600 hover:bg-cyan-700 text-white shadow-xs"
              >
                <ShieldCheck className="size-4" />
                <span>{t("digilocker.btnAuthorizeAndFetch", "Authorize & Fetch via DigiLocker")}</span>
              </Button>
            </DialogFooter>
          </div>
        )}

        {/* Stage 2: Simulated Fetching / Handshake Animation */}
        {stage === "fetching" && (
          <div className="py-8 space-y-6 text-center">
            <div className="relative inline-flex items-center justify-center size-20 rounded-full bg-cyan-100 dark:bg-cyan-950/60 border-2 border-cyan-400 dark:border-cyan-700 animate-pulse">
              <Loader2 className="size-10 text-cyan-600 dark:text-cyan-400 animate-spin" />
            </div>

            <div className="space-y-2 max-w-sm mx-auto">
              <h3 className="text-base font-bold text-foreground">
                {t("digilocker.fetchingTitle", "Contacting DigiLocker National Gateway...")}
              </h3>
              <p className="text-xs text-muted-foreground">
                {t(
                  "digilocker.fetchingSubtitle",
                  "Securely retrieving authenticated digital certificate metadata."
                )}
              </p>
            </div>

            {/* Stepper indicator */}
            <div className="max-w-xs mx-auto space-y-2 text-left text-xs bg-muted/40 p-3.5 rounded-xl border border-border/60">
              <div className={`flex items-center gap-2 ${fetchProgressStep >= 1 ? "text-cyan-600 dark:text-cyan-400 font-semibold" : "text-muted-foreground"}`}>
                <div className={`size-2 rounded-full ${fetchProgressStep >= 1 ? "bg-cyan-600 dark:bg-cyan-400" : "bg-muted-foreground/40"}`} />
                <span>{t("digilocker.step1", "1. Connecting to MeitY DigiLocker API")}</span>
              </div>
              <div className={`flex items-center gap-2 ${fetchProgressStep >= 2 ? "text-cyan-600 dark:text-cyan-400 font-semibold" : "text-muted-foreground"}`}>
                <div className={`size-2 rounded-full ${fetchProgressStep >= 2 ? "bg-cyan-600 dark:bg-cyan-400" : "bg-muted-foreground/40"}`} />
                <span>{t("digilocker.step2", "2. Authenticating citizen e-KYC credential")}</span>
              </div>
              <div className={`flex items-center gap-2 ${fetchProgressStep >= 3 ? "text-cyan-600 dark:text-cyan-400 font-semibold" : "text-muted-foreground"}`}>
                <div className={`size-2 rounded-full ${fetchProgressStep >= 3 ? "bg-cyan-600 dark:bg-cyan-400" : "bg-muted-foreground/40"}`} />
                <span>{t("digilocker.step3", "3. Validating PKI digital signature")}</span>
              </div>
            </div>
          </div>
        )}

        {/* Stage 3: Verified Metadata Certificate View */}
        {stage === "verified_view" && activeMetadata && (
          <div className="space-y-5">
            <DialogHeader className="space-y-2">
              <div className="flex items-center justify-between">
                <Badge
                  className="bg-emerald-600 hover:bg-emerald-600 text-white font-semibold text-xs py-1 px-3 gap-1.5 shadow-xs"
                >
                  <CheckCircle2 className="size-3.5" />
                  <span>{t("digilocker.badgeVerified", "Verified via DigiLocker")}</span>
                </Badge>

                <span className="text-[11px] text-muted-foreground font-mono">
                  {new Date(activeMetadata.verifiedAt).toLocaleDateString(
                    lang === "hi" ? "hi-IN" : "en-IN",
                    { day: "numeric", month: "short", year: "numeric" }
                  )}
                </span>
              </div>

              <DialogTitle className="text-lg sm:text-xl font-bold text-foreground">
                {activeMetadata.docType}
              </DialogTitle>
              <DialogDescription className="text-xs text-muted-foreground">
                {t(
                  "digilocker.verifiedCardSubtitle",
                  "Authenticated statutory record directly linked from the National Digital Locker."
                )}
              </DialogDescription>
            </DialogHeader>

            {/* Official Certificate Card */}
            <div className="rounded-xl border-2 border-emerald-500/40 bg-linear-to-b from-emerald-50/40 to-background dark:from-emerald-950/20 dark:to-background p-4 sm:p-5 space-y-3.5 shadow-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div className="space-y-1">
                  <div className="flex items-center gap-1.5 text-muted-foreground font-semibold uppercase tracking-wider text-[10px]">
                    <Hash className="size-3 text-emerald-600" />
                    <span>{t("digilocker.lblCertNo", "Certificate / Ref No.")}</span>
                  </div>
                  <p className="font-mono font-bold text-foreground text-sm">
                    {activeMetadata.certificateNo}
                  </p>
                </div>

                <div className="space-y-1">
                  <div className="flex items-center gap-1.5 text-muted-foreground font-semibold uppercase tracking-wider text-[10px]">
                    <User className="size-3 text-emerald-600" />
                    <span>{t("digilocker.lblIssuedTo", "Issued To / Beneficiary")}</span>
                  </div>
                  <p className="font-medium text-foreground">
                    {activeMetadata.issuedTo || "Verified Citizen"}
                  </p>
                </div>

                <div className="space-y-1 sm:col-span-2 border-t border-emerald-500/20 pt-2.5">
                  <div className="flex items-center gap-1.5 text-muted-foreground font-semibold uppercase tracking-wider text-[10px]">
                    <Building className="size-3 text-emerald-600" />
                    <span>{t("digilocker.lblIssuer", "Issuing Authority")}</span>
                  </div>
                  <p className="font-medium text-foreground leading-snug">
                    {activeMetadata.issuer}
                  </p>
                </div>

                <div className="space-y-1 border-t border-emerald-500/20 pt-2.5">
                  <div className="flex items-center gap-1.5 text-muted-foreground font-semibold uppercase tracking-wider text-[10px]">
                    <Calendar className="size-3 text-emerald-600" />
                    <span>{t("digilocker.lblValidity", "Validity Status")}</span>
                  </div>
                  <p className="font-medium text-foreground">
                    {activeMetadata.validUntil || "Permanent / Life-long"}
                  </p>
                </div>

                <div className="space-y-1 border-t border-emerald-500/20 pt-2.5">
                  <div className="flex items-center gap-1.5 text-muted-foreground font-semibold uppercase tracking-wider text-[10px]">
                    <FileText className="size-3 text-emerald-600" />
                    <span>{t("digilocker.lblUri", "DigiLocker Doc URI")}</span>
                  </div>
                  <p className="font-mono text-[11px] text-muted-foreground truncate" title={activeMetadata.uri}>
                    {activeMetadata.uri || "in.gov.digilocker.doc"}
                  </p>
                </div>
              </div>

              {/* Digital Hash Banner */}
              {activeMetadata.hash && (
                <div className="rounded-lg bg-muted/60 dark:bg-muted/30 p-2.5 border border-border/60 text-[11px] font-mono text-muted-foreground flex items-center justify-between gap-2">
                  <span className="truncate">
                    <strong>Digital Sig:</strong> {activeMetadata.hash}
                  </span>
                  <Badge variant="outline" className="text-[9px] uppercase font-semibold text-emerald-600 border-emerald-500/40 shrink-0">
                    PKI OK
                  </Badge>
                </div>
              )}
            </div>

            {/* Compliance Guarantee Footer */}
            <p className="text-[11px] text-muted-foreground text-center">
              {t(
                "digilocker.statutoryAcceptanceNote",
                "✓ Recognized as legally valid document per Information Technology Act 2000."
              )}
            </p>

            <DialogFooter className="flex flex-col-reverse sm:flex-row items-center justify-between gap-2 pt-2">
              <Button
                type="button"
                variant="ghost"
                onClick={() => setCustomStage("confirm_unlink")}
                className="h-10 min-h-[44px] text-xs font-semibold text-destructive hover:text-destructive hover:bg-destructive/10 gap-1.5 w-full sm:w-auto"
              >
                <Trash2 className="size-3.5" />
                <span>{t("digilocker.btnUnlink", "Unlink Certificate")}</span>
              </Button>

              <Button
                type="button"
                onClick={() => handleOpenChange(false)}
                className="h-10 min-h-[44px] text-xs font-semibold px-6 w-full sm:w-auto"
              >
                {t("common.done", "Done")}
              </Button>
            </DialogFooter>
          </div>
        )}

        {/* Stage 4: Confirm Unlink Dialog */}
        {stage === "confirm_unlink" && (
          <div className="space-y-4 py-2">
            <DialogHeader className="space-y-2">
              <div className="flex items-center gap-2 text-destructive">
                <AlertCircle className="size-5" />
                <DialogTitle className="text-base sm:text-lg font-bold">
                  {t("digilocker.confirmUnlinkTitle", "Unlink DigiLocker Certificate?")}
                </DialogTitle>
              </div>
              <DialogDescription className="text-xs text-muted-foreground leading-relaxed">
                {t(
                  "digilocker.confirmUnlinkDesc",
                  "This will remove the verified status for {{docName}}. Your readiness meter will be updated. You can re-verify or upload a manual file anytime.",
                  { docName }
                )}
              </DialogDescription>
            </DialogHeader>

            <DialogFooter className="flex flex-col-reverse sm:flex-row gap-2 pt-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setCustomStage("verified_view")}
                className="h-11 min-h-[44px] text-xs font-semibold"
              >
                {t("common.cancel", "Cancel")}
              </Button>
              <Button
                type="button"
                variant="destructive"
                onClick={handleUnlink}
                className="h-11 min-h-[44px] text-xs font-semibold gap-1.5"
              >
                <Trash2 className="size-3.5" />
                <span>{t("digilocker.btnConfirmUnlink", "Yes, Unlink Certificate")}</span>
              </Button>
            </DialogFooter>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}
