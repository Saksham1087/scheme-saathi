import i18next from "i18next"
import { initReactI18next } from "react-i18next"
import en from "./en.json"
import hi from "./hi.json"
import { useLocaleStore, type Lang } from "@/stores/localeStore"

export const supportedLangs: Lang[] = ["en", "hi"]

// Architecture ready for more regional languages: add a JSON file per locale
// (mr, ta, bn, te) and register it here — components need zero changes.
const resources = {
  en: { translation: en },
  hi: { translation: hi },
}

void i18next.use(initReactI18next).init({
  resources,
  lng: useLocaleStore.getState().lang,
  fallbackLng: "en",
  interpolation: { escapeValue: false },
})

useLocaleStore.subscribe(({ lang }) => {
  if (i18next.language !== lang) void i18next.changeLanguage(lang)
})
