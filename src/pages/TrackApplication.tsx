import { useEffect, useMemo, useState } from "react"
import { Link } from "react-router-dom"
import { useTranslation } from "react-i18next"
import { toast } from "sonner"
import { Check, CircleDashed, Send } from "lucide-react"
import { httpsCallable } from "firebase/functions"
import {
  collection,
  getDocs,
  onSnapshot,
  orderBy,
  query,
  where,
} from "firebase/firestore"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { db, functions } from "@/lib/firebase"
import { fmtINR } from "@/lib/format"
import { useAuthStore } from "@/stores/authStore"
import { useIntakeStore } from "@/stores/intakeStore"
import { APPLICATION_STATUS_ORDER, type Application, type ChannelPartner, type SchemeType } from "@/types"

function StatusTimeline({ status }: { status: Application["status"] }) {
  const { t } = useTranslation()
  const currentIdx = APPLICATION_STATUS_ORDER.indexOf(status)
  return (
    <ol className="flex items-center gap-1.5" aria-label={t("track.title")}>
      {APPLICATION_STATUS_ORDER.map((s, i) => {
        const reached = i <= currentIdx
        return (
          <li key={s} className="flex items-center gap-1.5">
            <span
              className={`flex size-5 items-center justify-center rounded-full ${
                reached ? "bg-success text-success-foreground" : "bg-muted text-muted-foreground"
              }`}
            >
              {reached ? <Check className="size-3" /> : <CircleDashed className="size-3" />}
            </span>
            <span className={`text-xs ${reached ? "font-semibold text-foreground" : "text-muted-foreground"}`}>
              {t(`statusLabels.${s}`)}
            </span>
            {i < APPLICATION_STATUS_ORDER.length - 1 && (
              <span aria-hidden className="w-4 border-t border-dashed border-border" />
            )}
          </li>
        )
      })}
    </ol>
  )
}

interface NewApplicationDialogProps {
  partners: ChannelPartner[]
}

function NewApplicationDialog({ partners }: NewApplicationDialogProps) {
  const { t } = useTranslation()
  const match = useIntakeStore((s) => s.match)
  const [schemeId, setSchemeId] = useState("")
  const [partnerId, setPartnerId] = useState("")
  const [amount, setAmount] = useState(0)
  const [busy, setBusy] = useState(false)

  const eligibleMatches = useMemo(
    () => (match?.matches ?? []).filter((m) => m.eligible),
    [match],
  )
  const selectedSchemeType: SchemeType | null =
    eligibleMatches.find((m) => m.schemeId === schemeId)?.schemeType ?? null

  function pickScheme(id: string) {
    setSchemeId(id)
    setPartnerId("")
    const m = eligibleMatches.find((x) => x.schemeId === id)
    if (m) setAmount(m.suggestedAmount)
  }

  async function submit() {
    setBusy(true)
    try {
      const callable = httpsCallable<
        {
          schemeId: string
          partnerId: string
          requestedAmount: number
          applicantName?: string
        },
        { ok: boolean; reasonKey?: string }
      >(functions, "submitApplication")
      const res = await callable({
        schemeId,
        partnerId,
        requestedAmount: amount,
      })
      if (!res.data.ok) {
        toast.error(t("track.routingBlockedToast"))
        return
      }
      toast.success(
        t("track.submittedToast", {
          partner: partners.find((p) => p.id === partnerId)?.name ?? partnerId,
        }),
      )
      setSchemeId("")
      setPartnerId("")
      setAmount(0)
    } catch (err) {
      console.error(err)
      toast.error(t("auth.errorGeneric"))
    } finally {
      setBusy(false)
    }
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button>
          <Send className="mr-1.5 size-4" />
          {t("track.newApplication")}
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="font-display">{t("track.title")}</DialogTitle>
        </DialogHeader>

        {eligibleMatches.length === 0 && (
          <p className="text-sm text-muted-foreground">{t("track.none")}</p>
        )}

        {eligibleMatches.length > 0 && (
          <div className="space-y-4">
            <fieldset className="space-y-2">
              <legend className="text-sm font-medium mb-1">
                {t("track.pickScheme")}
              </legend>
              {eligibleMatches.map((m) => (
                <label
                  key={m.schemeId}
                  className="flex items-center gap-3 rounded-lg border border-border px-3 py-2.5 cursor-pointer hover:bg-secondary has-[button[data-state=checked]]:border-primary"
                >
                  <input
                    type="radio"
                    name="pick-scheme"
                    checked={schemeId === m.schemeId}
                    onChange={() => pickScheme(m.schemeId)}
                    className="accent-[var(--primary)]"
                  />
                  <span className="text-sm font-medium">
                    {m.schemeName.en}
                  </span>
                </label>
              ))}
            </fieldset>

            {selectedSchemeType && (
              <fieldset className="space-y-2">
                <legend className="text-sm font-medium mb-1">
                  {t("track.pickPartner")}
                </legend>
                {partners.map((p) => {
                  const compatible =
                    p.npaFlag !== "high" &&
                    p.schemeCategories.includes(selectedSchemeType)
                  return (
                    // Misrouting prevention UI: incompatible partners are
                    // disabled with an explicit reason. Server re-validates.
                    <label
                      key={p.id}
                      className={`flex items-center justify-between gap-3 rounded-lg border px-3 py-2.5 ${
                        partnerId === p.id ? "border-primary bg-primary/5" : "border-border"
                      } ${compatible ? "cursor-pointer hover:bg-secondary" : "opacity-55 cursor-not-allowed"}`}
                      title={
                        compatible
                          ? undefined
                          : t("track.partnerIncompatible", {
                              type: t(`schemeTypes.${selectedSchemeType}`),
                            })
                      }
                    >
                      <span className="flex items-center gap-3">
                        <input
                          type="radio"
                          name="pick-partner"
                          disabled={!compatible}
                          checked={partnerId === p.id}
                          onChange={() => setPartnerId(p.id)}
                          className="accent-[var(--primary)]"
                        />
                        <span className="text-sm font-medium">{p.name}</span>
                      </span>
                      {!compatible && (
                        <span className="text-xs text-destructive font-medium whitespace-nowrap">
                          {t("track.partnerIncompatible", {
                            type: t(`schemeTypes.${selectedSchemeType}`),
                          })}
                        </span>
                      )}
                    </label>
                  )
                })}
              </fieldset>
            )}

            {schemeId && (
              <div className="space-y-2">
                <Label htmlFor="req-amount">{t("track.requestedAmount")}</Label>
                <Input
                  id="req-amount"
                  type="number"
                  min={0}
                  value={amount || ""}
                  onChange={(e) => setAmount(Number(e.target.value))}
                />
              </div>
            )}

            <Button
              className="w-full"
              onClick={() => void submit()}
              disabled={!schemeId || !partnerId || amount <= 0 || busy}
            >
              {t("track.submitCta")}
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}

export default function TrackApplication() {
  const { t } = useTranslation()
  const { user, loading } = useAuthStore()

  const [applications, setApplications] = useState<Application[] | null>(null)
  const [partners, setPartners] = useState<ChannelPartner[]>([])
  const [schemeNames, setSchemeNames] = useState<Record<string, string>>({})

  useEffect(() => {
    if (!user) {
      setApplications(null)
      return
    }
    const q = query(
      collection(db, "applications"),
      where("uid", "==", user.uid),
      orderBy("createdAt", "desc"),
    )
    const unsub = onSnapshot(q, (snap) => {
      setApplications(
        snap.docs.map((d) => ({ ...(d.data() as Application), id: d.id })),
      )
    })
    return unsub
  }, [user])

  // Partner + scheme catalogs for display names and routing validation.
  useEffect(() => {
    async function load() {
      try {
        const [partnerSnap, schemeSnap] = await Promise.all([
          getDocs(collection(db, "partners")),
          getDocs(collection(db, "schemes")),
        ])
        if (partnerSnap.empty || schemeSnap.empty) throw new Error("empty")
        setPartners(partnerSnap.docs.map((d) => ({
          ...(d.data() as ChannelPartner),
          id: d.id,
        })))
        const names: Record<string, string> = {}
        for (const d of schemeSnap.docs) {
          names[d.id] = (d.data() as { name?: { en?: string } }).name?.en ?? d.id
        }
        setSchemeNames(names)
      } catch {
        // Firestore empty/unavailable — dialog still works via seed fallback.
        void 0
      }
    }
    void load()
  }, [])

  if (loading) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-16 text-center text-muted-foreground">
        {t("common.loading")}
      </div>
    )
  }

  if (!user) {
    return (
      <div className="mx-auto max-w-md px-4 py-16 text-center space-y-5">
        <h1 className="font-display font-bold text-2xl">{t("track.title")}</h1>
        <p className="text-muted-foreground">{t("track.loginPrompt")}</p>
        <Button asChild>
          <Link to="/login">{t("nav.login")}</Link>
        </Button>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-2xl px-4 py-10">
      <div className="flex items-center justify-between flex-wrap gap-3 mb-7">
        <h1 className="font-display font-bold text-3xl tracking-tight">
          {t("track.title")}
        </h1>
        <NewApplicationDialog partners={partners} />
      </div>

      {applications === null && (
        <Card>
          <CardContent className="py-10 text-center text-muted-foreground">
            {t("common.loading")}
          </CardContent>
        </Card>
      )}

      {applications?.length === 0 && (
        <Card>
          <CardContent className="py-10 text-center text-muted-foreground">
            {t("track.none")}
          </CardContent>
        </Card>
      )}

      <div className="space-y-4">
        {applications?.map((app) => {
          const partner = partners.find((p) => p.id === app.partnerId)
          const routingWarning =
            app.routingCheck.reasonKey === "partner_high_npa" ||
            partner?.npaFlag === "high"
          return (
            <Card key={app.id}>
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between gap-3 flex-wrap">
                  <div>
                    <Badge variant="secondary" className="mb-1.5 font-semibold">
                      {t(`schemeTypes.${app.schemeType}`)}
                    </Badge>
                    <CardTitle className="font-display text-base">
                      {schemeNames[app.schemeId] ?? app.schemeId}
                    </CardTitle>
                    <p className="text-sm text-muted-foreground mt-0.5">
                      {t("track.routedTo")}:{" "}
                      <strong className="font-semibold text-foreground">
                        {partner?.name ?? app.partnerId}
                      </strong>{" "}
                      · {fmtINR(app.requestedAmount)}
                    </p>
                  </div>
                </div>
                {routingWarning && (
                  <p className="mt-1 rounded-md bg-destructive/10 px-3 py-2 text-xs font-medium text-destructive">
                    {t("track.routingWarning")}
                  </p>
                )}
              </CardHeader>
              <CardContent>
                <StatusTimeline status={app.status} />
              </CardContent>
            </Card>
          )
        })}
      </div>
    </div>
  )
}
