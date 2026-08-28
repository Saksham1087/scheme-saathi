import { getAllSchemes } from "@/data"
import type { LocalScheme } from "@/data"
import type { SchemeCategory } from "@/types/scheme"

export interface ChatMessage {
  id: string
  role: "user" | "assistant"
  content: string
  timestamp: string
}

export interface ConversationState {
  step: ConversationStep
  collectedData: Partial<UserRequirements>
  history: ChatMessage[]
}

export type ConversationStep =
  | "purpose"
  | "amount"
  | "income"
  | "category"
  | "recommend"
  | "complete"

export interface UserRequirements {
  purpose: string
  loanAmount: number
  annualIncome: number
  category: string
  state: string
}

const STEP_QUESTIONS: Record<ConversationStep, { key: string; followUp?: string }> = {
  purpose: { key: "assistant.questions.purpose" },
  amount: { key: "assistant.questions.amount", followUp: "assistant.followups.amount" },
  income: { key: "assistant.questions.income", followUp: "assistant.followups.income" },
  category: { key: "assistant.questions.category" },
  recommend: { key: "assistant.questions.recommend" },
  complete: { key: "assistant.questions.complete" },
}

const PURPOSE_KEYWORDS: Record<string, string> = {
  business: "business",
  education: "education",
  agriculture: "agriculture",
  farming: "agriculture",
  transport: "transport",
  vehicle: "transport",
  housing: "housing",
  house: "housing",
  home: "housing",
  health: "health",
  medical: "health",
  employment: "employment",
  job: "employment",
}

export function createAssistant(): ConversationState {
  return {
    step: "purpose",
    collectedData: {},
    history: [],
  }
}

export function getAssistantMessage(state: ConversationState, t: (key: string) => string): string {
  const question = STEP_QUESTIONS[state.step]
  return t(question.key)
}

export function processUserInput(
  state: ConversationState,
  input: string,
  t: (key: string) => string,
): { state: ConversationState; response: string } {
  const normalized = input.toLowerCase().trim()
  const newState = { ...state, collectedData: { ...state.collectedData } }

  switch (state.step) {
    case "purpose": {
      const matched = Object.entries(PURPOSE_KEYWORDS).find(([kw]) =>
        normalized.includes(kw),
      )
      if (matched) {
        newState.collectedData.purpose = matched[1]
        newState.step = "amount"
        return { state: newState, response: t("assistant.responses.purposeRecognized") }
      }
      return { state: newState, response: t("assistant.responses.purposeUnknown") }
    }
    case "amount": {
      const numMatch = normalized.match(/(\d[\d,]*\.?\d*)/)
      if (numMatch) {
        const amount = parseFloat(numMatch[1].replace(/,/g, ""))
        if (amount > 0) {
          newState.collectedData.loanAmount = amount
          newState.step = "income"
          return { state: newState, response: t("assistant.responses.amountReceived") }
        }
      }
      return { state: newState, response: t("assistant.responses.amountInvalid") }
    }
    case "income": {
      const numMatch = normalized.match(/(\d[\d,]*\.?\d*)/)
      if (numMatch) {
        const income = parseFloat(numMatch[1].replace(/,/g, ""))
        if (income > 0) {
          newState.collectedData.annualIncome = income
          newState.step = "category"
          return { state: newState, response: t("assistant.responses.incomeReceived") }
        }
      }
      return { state: newState, response: t("assistant.responses.incomeInvalid") }
    }
    case "category": {
      const schemes = getAllSchemes()
      const matched = Object.entries(PURPOSE_KEYWORDS).find(([kw]) =>
        normalized.includes(kw),
      )
      const category = matched ? matched[1] : newState.collectedData.purpose || "other"
      newState.collectedData.category = category
      newState.step = "recommend"
      return { state: newState, response: findMatchingSchemes(schemes, newState.collectedData) }
    }
    default:
      return { state: newState, response: t("assistant.responses.idle") }
  }
}

function findMatchingSchemes(
  schemes: LocalScheme[],
  data: Partial<UserRequirements>,
): string {
  const matches = schemes.filter((s) => {
    if (data.category && !s.category.includes(data.category as SchemeCategory)) return false
    if (data.loanAmount && s.financialAssistance) {
      if (data.loanAmount > s.financialAssistance.maxAmount * 1.2) return false
    }
    return true
  })

  if (matches.length === 0) {
    return "No match"
  }

  const top3 = matches.slice(0, 3)
  const names = top3.map((s) => s.name.en).join(", ")
  return `Found ${matches.length} matching schemes: ${names}`
}
