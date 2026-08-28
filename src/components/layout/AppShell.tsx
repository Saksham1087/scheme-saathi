import { NavLink, Link, Outlet, useNavigate } from "react-router-dom"
import { LogOut, MapPin } from "lucide-react"
import { useTranslation } from "react-i18next"
import { Button } from "@/components/ui/button"
import { SchemeCompareTray } from "@/components/schemes/SchemeCompareTray"
import { useLocaleStore } from "@/stores/localeStore"
import { useAuthStore } from "@/stores/authStore"
import { auth } from "@/lib/firebase"

function Wordmark() {
  return (
    <Link
      to="/"
      className="flex items-center gap-2.5 focus-visible:outline-ring rounded-sm"
    >
      <img src="/favicon.svg" alt="" className="size-9" aria-hidden />
      <span className="font-display font-bold text-xl leading-none tracking-tight">
        Scheme<span className="text-accent">Sathi</span>
      </span>
    </Link>
  )
}

function LanguageToggle() {
  const { lang, setLang } = useLocaleStore()
  return (
    <div
      role="group"
      aria-label="Language"
      className="flex rounded-md border border-border overflow-hidden text-sm font-semibold"
    >
      <button
        onClick={() => setLang("en")}
        aria-pressed={lang === "en"}
        className={`px-2.5 py-1.5 transition-colors ${
          lang === "en" ? "bg-primary text-primary-foreground" : "hover:bg-muted"
        }`}
      >
        EN
      </button>
      <button
        onClick={() => setLang("hi")}
        aria-pressed={lang === "hi"}
        className={`px-2.5 py-1.5 transition-colors ${
          lang === "hi" ? "bg-primary text-primary-foreground" : "hover:bg-muted"
        }`}
      >
        हिंदी
      </button>
    </div>
  )
}

const navKeys = [
  { to: "/schemes", key: "nav.schemes" },
  { to: "/find-schemes", key: "nav.findSchemes" },
  { to: "/calculator", key: "nav.calculator" },
  { to: "/partners", key: "nav.partners" },
  { to: "/how-it-works", key: "nav.howItWorks" },
  { to: "/track", key: "nav.track" },
]

export function AppShell() {
  const { t } = useTranslation()
  const { user } = useAuthStore()
  const navigate = useNavigate()

  return (
    <div className="min-h-svh flex flex-col bg-background">
      <header className="sticky top-0 z-40 border-b border-border/80 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80">
        <div className="mx-auto max-w-6xl px-4 h-16 flex items-center gap-4">
          <Wordmark />
          <nav className="hidden lg:flex mx-auto gap-1" aria-label="Main">
            {navKeys.map(({ to, key }) => (
              <NavLink
                key={to}
                to={to}
                className={({ isActive }) =>
                  `px-3 py-2 rounded-md text-sm font-medium transition-colors hover:bg-secondary ${
                    isActive ? "text-primary" : "text-foreground/75"
                  }`
                }
              >
                {t(key)}
              </NavLink>
            ))}
          </nav>
          <div className="ml-auto lg:ml-0 flex items-center gap-3">
            <LanguageToggle />
            {user ? (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => void auth.signOut()}
              >
                <LogOut className="size-4 mr-1" />
                {t("nav.logout")}
              </Button>
            ) : (
              <Button size="sm" onClick={() => navigate("/login")}>
                {t("nav.login")}
              </Button>
            )}
          </div>
        </div>
        <nav
          aria-label={t("nav.home")}
          className="lg:hidden flex gap-1 overflow-x-auto px-3 pb-2"
        >
          {navKeys.map(({ to, key }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) =>
                `whitespace-nowrap px-3 py-1.5 rounded-full border text-sm font-medium transition-colors ${
                  isActive
                    ? "border-primary bg-primary text-primary-foreground"
                    : "border-border text-foreground/70 hover:bg-secondary"
                }`
              }
            >
              {t(key)}
            </NavLink>
          ))}
        </nav>
      </header>

      <main className="flex-1">
        <Outlet />
      </main>

      <SchemeCompareTray />

      <footer className="border-t border-border/70 mt-16">
        <div className="mx-auto max-w-6xl px-4 py-8 flex flex-col sm:flex-row gap-4 items-start justify-between text-sm text-muted-foreground">
          <p className="font-display font-semibold text-base text-foreground">
            SchemeSathi — {t("common.tagline")}
          </p>
          <p className="max-w-md flex gap-2 leading-relaxed">
            <MapPin className="size-4 shrink-0 mt-0.5 text-accent" />
            {t("home.privacyNote")}
          </p>
        </div>
      </footer>
    </div>
  )
}
