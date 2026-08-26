import { useLocaleStore, langLabels } from "@/stores/localeStore"
import { useTranslation } from "react-i18next"
import { supportedLangs } from "@/i18n"

export function LanguageSelector() {
  const { lang, setLang } = useLocaleStore()
  const { t } = useTranslation()

  return (
    <div
      role="group"
      aria-label={t("nav.home")}
      className="flex rounded-md border border-border overflow-hidden text-sm font-semibold"
    >
      {supportedLangs.map((code) => (
        <button
          key={code}
          onClick={() => setLang(code)}
          aria-pressed={lang === code}
          className={`px-2.5 py-1.5 transition-colors ${
            lang === code
              ? "bg-primary text-primary-foreground"
              : "hover:bg-muted"
          }`}
        >
          {langLabels[code]}
        </button>
      ))}
    </div>
  )
}
