import { useRef, useState } from "react"
import { useLocation, useNavigate } from "react-router-dom"
import { useTranslation } from "react-i18next"
import { toast } from "sonner"
import {
  RecaptchaVerifier,
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithEmailAndPassword,
  signInWithPhoneNumber,
  signInWithPopup,
  type ConfirmationResult,
} from "firebase/auth"
import { auth } from "@/lib/firebase"
import { persistConsentIfAny } from "@/lib/userProfile"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

function GoogleIcon() {
  return (
    <svg viewBox="0 0 24 24" className="size-4" aria-hidden>
      <path
        fill="#4285F4"
        d="M23.5 12.27c0-.85-.08-1.66-.22-2.45H12v4.64h6.46a5.53 5.53 0 0 1-2.39 3.62v3h3.87c2.26-2.09 3.56-5.17 3.56-8.81Z"
      />
      <path
        fill="#34A853"
        d="M12 24c3.24 0 5.96-1.07 7.94-2.91l-3.87-3c-1.08.72-2.45 1.15-4.07 1.15-3.13 0-5.78-2.11-6.73-4.96H1.29v3.1A12 12 0 0 0 12 24Z"
      />
      <path
        fill="#FBBC05"
        d="M5.27 14.28A7.2 7.2 0 0 1 4.89 12c0-.79.14-1.56.38-2.28V6.62H1.28a12 12 0 0 0 0 10.76l3.99-3.1Z"
      />
      <path
        fill="#EA4335"
        d="M12 4.77c1.76 0 3.35.61 4.6 1.8l3.42-3.42A11.97 11.97 0 0 0 12 0 12 12 0 0 0 1.28 6.62l3.99 3.1C6.22 6.88 8.87 4.77 12 4.77Z"
      />
    </svg>
  )
}

export default function Login() {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const location = useLocation()
  const from = (location.state as { from?: string } | null)?.from ?? "/track"

  const [phone, setPhone] = useState("+91")
  const [code, setCode] = useState("")
  const [otpSent, setOtpSent] = useState(false)
  const confirmationRef = useRef<ConfirmationResult | null>(null)

  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")

  async function afterAuth(uid: string) {
    await persistConsentIfAny(uid)
    navigate(from)
  }

  function ensureRecaptcha(): RecaptchaVerifier {
    const existing = auth.app.name
      ? (window as unknown as { __ssRecaptcha?: RecaptchaVerifier })
          .__ssRecaptcha
      : undefined
    if (existing) return existing
    const verifier = new RecaptchaVerifier(auth, "recaptcha-container", {
      size: "invisible",
    })
    ;(window as unknown as { __ssRecaptcha?: RecaptchaVerifier }).__ssRecaptcha =
      verifier
    return verifier
  }

  async function sendOtp() {
    try {
      const verifier = ensureRecaptcha()
      const confirmation = await signInWithPhoneNumber(auth, phone.trim(), verifier)
      confirmationRef.current = confirmation
      setOtpSent(true)
      toast.success(t("auth.otpSent", { phone: phone.trim() }))
    } catch (err) {
      console.error(err)
      toast.error(t("auth.errorInvalidPhone"))
    }
  }

  async function verifyOtp() {
    try {
      const result = await confirmationRef.current!.confirm(code.trim())
      await afterAuth(result.user.uid)
    } catch (err) {
      console.error(err)
      toast.error(t("auth.errorGeneric"))
    }
  }

  async function emailAuth(mode: "signin" | "signup") {
    try {
      const result =
        mode === "signin"
          ? await signInWithEmailAndPassword(auth, email.trim(), password)
          : await createUserWithEmailAndPassword(auth, email.trim(), password)
      await afterAuth(result.user.uid)
    } catch (err) {
      console.error(err)
      toast.error(t("auth.errorGeneric"))
    }
  }

  async function googleAuth() {
    try {
      const provider = new GoogleAuthProvider()
      provider.setCustomParameters({ prompt: "select_account" })
      const result = await signInWithPopup(auth, provider)
      await afterAuth(result.user.uid)
    } catch (err) {
      console.error(err)
      toast.error(t("auth.errorGeneric"))
    }
  }

  return (
    <div className="mx-auto max-w-md px-4 py-12">
      <Card>
        <CardHeader>
          <CardTitle className="font-display text-2xl">
            {t("auth.title")}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="phone">
            <TabsList className="w-full mb-5">
              <TabsTrigger value="phone" className="flex-1">
                {t("auth.phoneTab")}
              </TabsTrigger>
              <TabsTrigger value="email" className="flex-1">
                {t("auth.emailTab")}
              </TabsTrigger>
            </TabsList>

            {/* Phone OTP — primary for users without email */}
            <TabsContent value="phone" className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="phone">{t("auth.phoneLabel")}</Label>
                <Input
                  id="phone"
                  type="tel"
                  inputMode="tel"
                  autoComplete="tel"
                  placeholder="+91 98765 43210"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                />
                <p className="text-xs text-muted-foreground">
                  {t("auth.phoneHint")}
                </p>
              </div>
              {!otpSent ? (
                <Button className="w-full" onClick={() => void sendOtp()}>
                  {t("auth.sendOtp")}
                </Button>
              ) : (
                <>
                  <div className="space-y-2">
                    <Label htmlFor="code">{t("auth.codeLabel")}</Label>
                    <Input
                      id="code"
                      inputMode="numeric"
                      maxLength={6}
                      value={code}
                      onChange={(e) => setCode(e.target.value)}
                      className="tracking-[0.4em] text-center font-semibold"
                    />
                  </div>
                  <Button
                    className="w-full"
                    onClick={() => void verifyOtp()}
                    disabled={code.trim().length !== 6}
                  >
                    {t("auth.verifyOtp")}
                  </Button>
                </>
              )}
            </TabsContent>

            {/* Email fallback */}
            <TabsContent value="email" className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">{t("auth.emailLabel")}</Label>
                <Input
                  id="email"
                  type="email"
                  autoComplete="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">{t("auth.passwordLabel")}</Label>
                <Input
                  id="password"
                  type="password"
                  autoComplete={
                    email && password.length === 0 ? "current-password" : "new-password"
                  }
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <Button
                  variant="outline"
                  onClick={() => void emailAuth("signin")}
                  disabled={!email || !password}
                >
                  {t("auth.emailSignIn")}
                </Button>
                <Button
                  onClick={() => void emailAuth("signup")}
                  disabled={!email || !password}
                >
                  {t("auth.emailSignUp")}
                </Button>
              </div>
            </TabsContent>
          </Tabs>

          <div className="my-5 flex items-center gap-3">
            <Separator className="flex-1" />
            <span className="text-xs text-muted-foreground">
              {t("auth.orContinue")}
            </span>
            <Separator className="flex-1" />
          </div>

          <Button
            variant="outline"
            className="w-full"
            onClick={() => void googleAuth()}
          >
            <GoogleIcon />
            {t("auth.googleButton")}
          </Button>

          <div id="recaptcha-container" aria-hidden />
        </CardContent>
      </Card>
    </div>
  )
}
