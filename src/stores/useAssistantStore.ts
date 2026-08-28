import { create } from "zustand"
import { persist, createJSONStorage } from "zustand/middleware"
import type { ChatMessage } from "@/types/assistant"
import { queryAssistant } from "@/lib/assistantService"
import { speak, stopSpeaking } from "@/lib/voice"

interface AssistantState {
  messages: ChatMessage[]
  isLoading: boolean
  activeAudioMessageId: string | null
  isOpen: boolean
  isMinimized: boolean

  // Actions
  setOpen: (open: boolean) => void
  toggleOpen: () => void
  setMinimized: (minimized: boolean) => void
  toggleMinimized: () => void
  clearMessages: (lang?: "en" | "hi") => void
  addMessage: (msg: Omit<ChatMessage, "id" | "timestamp">) => string
  sendMessage: (query: string, lang: "en" | "hi") => Promise<void>
  speakMessage: (messageId: string, text: string, lang: "en" | "hi") => Promise<void>
  stopAudio: () => void
}

function getWelcomeMessage(lang: "en" | "hi" = "en"): ChatMessage {
  const isHi = lang === "hi"
  return {
    id: "welcome-msg",
    role: "assistant",
    content: isHi
      ? `नमस्ते! मैं **साथी एआई (Saathi AI)** हूँ, सरकारी रियायती ऋण योजनाओं और आधिकारिक दिशानिर्देशों के लिए आपका सत्यापित सहायक।\n\nआप मुझसे योजनाओं की ब्याज दरों, महिला उद्यमी सहायता, शिक्षा ऋण, आवश्यक दस्तावेजों या आवेदन प्रक्रिया के बारे में पूछ सकते हैं। नीचे दिए गए सुझाए गए प्रश्नों में से किसी एक को चुनें या अपना प्रश्न टाइप करें/बोलें!`
      : `Namaste! I am **Saathi AI**, your verified assistant for government concessional schemes and lending guidelines.\n\nYou can ask me about interest rates, Mahila Samriddhi Yojana for women, education loans with moratorium relief, mandatory documents, or channel partner application steps. Tap any suggested question below or speak directly!`,
    timestamp: Date.now(),
    lang,
    actionPills: [
      {
        id: "find-schemes",
        label: { en: "Find My Scheme (Wizard)", hi: "स्मार्ट पात्रता विज़ार्ड" },
        to: "/find-schemes",
        icon: "sparkles",
        variant: "default",
      },
      {
        id: "view-schemes",
        label: { en: "Browse Catalog", hi: "योजना सूची" },
        to: "/schemes",
        icon: "file-text",
        variant: "outline",
      },
      {
        id: "calc",
        label: { en: "EMI Calculator", hi: "ईएमआई कैलकुलेटर" },
        to: "/calculator",
        icon: "calculator",
        variant: "secondary",
      },
    ],
    confidence: "high",
  }
}

export const useAssistantStore = create<AssistantState>()(
  persist(
    (set, get) => ({
      messages: [getWelcomeMessage("en")],
      isLoading: false,
      activeAudioMessageId: null,
      isOpen: false,
      isMinimized: false,

      setOpen: (open) => set({ isOpen: open, isMinimized: false }),
      toggleOpen: () => set((state) => ({ isOpen: !state.isOpen, isMinimized: false })),
      setMinimized: (minimized) => set({ isMinimized: minimized }),
      toggleMinimized: () => set((state) => ({ isMinimized: !state.isMinimized })),

      clearMessages: (lang = "en") => {
        get().stopAudio()
        set({
          messages: [getWelcomeMessage(lang)],
          isLoading: false,
          activeAudioMessageId: null,
        })
      },

      addMessage: (msg) => {
        const id = `msg-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`
        const newMsg: ChatMessage = {
          ...msg,
          id,
          timestamp: Date.now(),
        }
        set((state) => ({
          messages: [...state.messages, newMsg],
        }))
        return id
      },

      sendMessage: async (queryText, lang) => {
        const text = queryText.trim()
        if (!text) return

        // Stop any audio before sending
        get().stopAudio()

        // 1. Add user message
        const userMsgId = `user-${Date.now()}`
        const userMessage: ChatMessage = {
          id: userMsgId,
          role: "user",
          content: text,
          timestamp: Date.now(),
          lang,
        }

        set((state) => ({
          messages: [...state.messages, userMessage],
          isLoading: true,
        }))

        try {
          // Slight natural delay for conversational realism
          await new Promise((r) => setTimeout(r, 450))

          // 2. Query grounded engine
          const result = await queryAssistant(text, lang)

          const assistantMsgId = `asst-${Date.now()}`
          const assistantContent = lang === "hi" ? result.text.hi : result.text.en

          const assistantMessage: ChatMessage = {
            id: assistantMsgId,
            role: "assistant",
            content: assistantContent,
            timestamp: Date.now(),
            lang,
            citations: result.citations,
            actionPills: result.actionPills,
            isGuardrailTriggered: result.isGuardrailTriggered,
            confidence: result.confidence,
            matchedSchemeId: result.matchedSchemeId,
          }

          set((state) => ({
            messages: [...state.messages, assistantMessage],
            isLoading: false,
          }))
        } catch (err) {
          console.error("Assistant query error:", err)
          const errMsgId = `err-${Date.now()}`
          const errorMessage: ChatMessage = {
            id: errMsgId,
            role: "assistant",
            content:
              lang === "hi"
                ? "माफ़ कीजिये, आपके अनुरोध को संसाधित करते समय एक त्रुटि हुई। कृपया पुनः प्रयास करें।"
                : "I apologize, an error occurred while processing your request. Please try again.",
            timestamp: Date.now(),
            lang,
            isGuardrailTriggered: true,
          }
          set((state) => ({
            messages: [...state.messages, errorMessage],
            isLoading: false,
          }))
        }
      },

      speakMessage: async (messageId, text, lang) => {
        const { activeAudioMessageId, stopAudio } = get()
        if (activeAudioMessageId === messageId) {
          stopAudio()
          return
        }

        stopAudio()
        set({ activeAudioMessageId: messageId })

        // Clean markdown symbols for cleaner TTS reading
        const plainText = text
          .replace(/[#*`_~>-]/g, " ")
          .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1")
          .replace(/\s+/g, " ")
          .trim()

        const speechLang = lang === "hi" ? "hi-IN" : "en-IN"
        await speak(plainText, speechLang, () => {
          if (get().activeAudioMessageId === messageId) {
            set({ activeAudioMessageId: null })
          }
        })
      },

      stopAudio: () => {
        stopSpeaking()
        set({ activeAudioMessageId: null })
      },
    }),
    {
      name: "scheme-saathi-assistant-storage",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        messages: state.messages.slice(-20), // Persist last 20 messages
      }),
    },
  ),
)
