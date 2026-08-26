import i18next from "i18next"
import { initReactI18next } from "react-i18next"
import en from "./en.json"
import hi from "./hi.json"
import mr from "./mr.json"
import { useLocaleStore, type Lang } from "@/stores/localeStore"

export const supportedLangs: Lang[] = ["en", "hi", "mr"]

const resources = {
  en: { translation: en },
  hi: { translation: hi },
  mr: { translation: mr },
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
