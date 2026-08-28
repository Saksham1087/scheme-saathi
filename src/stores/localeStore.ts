import { create } from "zustand"

export type Lang = "en" | "hi"

export const langLabels: Record<Lang, string> = {
  en: "English",
  hi: "हिन्दी",
}

interface LocaleState {
  lang: Lang
  setLang: (lang: Lang) => void
}

const SUPPORTED: Lang[] = ["en", "hi"]

function initialLang(): Lang {
  const saved = localStorage.getItem("ss-lang") as Lang | null
  if (saved && SUPPORTED.includes(saved)) return saved
  const browser = navigator.language
  if (browser.startsWith("hi")) return "hi"
  return "en"
}

export const useLocaleStore = create<LocaleState>()((set) => ({
  lang: initialLang(),
  setLang: (lang) => {
    localStorage.setItem("ss-lang", lang)
    document.documentElement.lang = lang
    set({ lang })
  },
}))
