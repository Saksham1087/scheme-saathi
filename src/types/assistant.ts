import type { LocalizedText, Scheme } from "@/types"

export type AssistantActionIcon =
  | "calculator"
  | "file-text"
  | "building"
  | "list-checks"
  | "sparkles"
  | "arrow-right"
  | "info"
  | "external-link"

export interface AssistantActionPill {
  id: string
  label: LocalizedText | string
  to: string
  icon?: AssistantActionIcon
  variant?: "default" | "outline" | "secondary"
}

export interface GroundedCitation {
  schemeId?: string
  schemeName: string
  section?: string
  officialSourceUrl?: string
  verifiedDate?: string
}

export interface ChatMessage {
  id: string
  role: "user" | "assistant" | "system"
  content: string
  timestamp: number
  lang: "en" | "hi"
  citations?: GroundedCitation[]
  actionPills?: AssistantActionPill[]
  isGuardrailTriggered?: boolean
  disclaimer?: string
  confidence?: "high" | "indicative" | "ungrounded"
  matchedSchemeId?: string
}

export interface SuggestedPrompt {
  id: string
  title: LocalizedText
  prompt: LocalizedText
  category: "women" | "education" | "rates" | "documents" | "process" | "general"
  icon?: string
}

export interface GroundedSchemeContext {
  scheme: Scheme
  relevanceScore: number
  matchedKeywords: string[]
}

export interface AssistantQueryResult {
  text: {
    en: string
    hi: string
  }
  citations: GroundedCitation[]
  actionPills: AssistantActionPill[]
  isGuardrailTriggered: boolean
  confidence: "high" | "indicative" | "ungrounded"
  matchedSchemeId?: string
}
