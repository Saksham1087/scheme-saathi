import { getFirestore } from "firebase-admin/firestore";
import type { LocalScheme, UserProfile, ConversationIntent, VoiceLanguage } from "./types";
import schemesSeed from "../data/schemes.seed.json";

interface SchemeCacheEntry {
  schemes: LocalScheme[];
  timestamp: number;
}

const schemeCache = new Map<string, SchemeCacheEntry>();
const CACHE_TTL_MS = 5 * 60 * 1000;

export { UserProfile, ConversationIntent, VoiceLanguage };

export function extractIntentFromMessages(
  messages: Array<{ role: "user" | "assistant"; content: string }>
): ConversationIntent {
  const userMessages = messages
    .filter((m) => m.role === "user")
    .slice(-3)
    .map((m) => m.content.toLowerCase())
    .join(" ");

  const intent: ConversationIntent = {};

  const purposeKeywords: Record<string, string> = {
    business: "business",
    shop: "business",
    education: "education",
    study: "education",
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
  };

  for (const [keyword, purpose] of Object.entries(purposeKeywords)) {
    if (userMessages.includes(keyword)) {
      intent.purpose = purpose;
      break;
    }
  }

  const amountPatterns = [
    /(\d+)\s*(?:lakh|lac)/i,
    /(\d+)\s*(?:crore|cr)/i,
    /(?:₹|rs\.?\s*)?(\d[\d,]*)/i,
  ];

  for (const pattern of amountPatterns) {
    const match = userMessages.match(pattern);
    if (match) {
      const num = parseInt(match[1].replace(/,/g, ""), 10);
      if (pattern.source.includes("lakh")) {
        intent.amount = num * 100000;
      } else if (pattern.source.includes("crore")) {
        intent.amount = num * 10000000;
      } else {
        intent.amount = num;
      }
      break;
    }
  }

  const states = [
    "andhra pradesh",
    "arunachal pradesh",
    "assam",
    "bihar",
    "chhattisgarh",
    "goa",
    "gujarat",
    "haryana",
    "himachal pradesh",
    "jharkhand",
    "karnataka",
    "kerala",
    "madhya pradesh",
    "maharashtra",
    "manipur",
    "meghalaya",
    "mizoram",
    "nagaland",
    "odisha",
    "punjab",
    "rajasthan",
    "sikkim",
    "tamil nadu",
    "telangana",
    "tripura",
    "uttar pradesh",
    "uttarakhand",
    "west bengal",
  ];

  for (const state of states) {
    if (userMessages.includes(state)) {
      intent.state = state;
      break;
    }
  }

  return intent;
}

function schemeMatchesFilters(
  scheme: LocalScheme,
  profile: UserProfile,
  intent: ConversationIntent
): boolean {
  if (profile.state && scheme.eligibilityRules.states?.length) {
    if (!scheme.eligibilityRules.states.includes(profile.state)) {
      return false;
    }
  }

  if (profile.category && scheme.eligibilityRules.categories?.length) {
    if (!scheme.eligibilityRules.categories.includes(profile.category)) {
      return false;
    }
  }

  if (intent.amount && scheme.financialAssistance.maxAmount) {
    if (intent.amount > scheme.financialAssistance.maxAmount * 1.2) {
      return false;
    }
  }

  if (intent.purpose && scheme.category.length) {
    const categoryMatch = scheme.category.some((c) =>
      c.toLowerCase().includes(intent.purpose!.toLowerCase())
    );
    if (!categoryMatch) {
      return false;
    }
  }

  return true;
}

function calculateRelevanceScore(
  scheme: LocalScheme,
  profile: UserProfile,
  intent: ConversationIntent
): number {
  let score = 0;

  if (intent.purpose && scheme.category.length) {
    const categoryMatch = scheme.category.some((c) =>
      c.toLowerCase().includes(intent.purpose!.toLowerCase())
    );
    if (categoryMatch) score += 30;
  }

  if (intent.amount && scheme.financialAssistance.maxAmount) {
    const ratio = intent.amount / scheme.financialAssistance.maxAmount;
    if (ratio <= 1) score += 25;
    else if (ratio <= 1.2) score += 15;
    else score += 5;
  }

  if (profile.state && scheme.eligibilityRules.states?.includes(profile.state)) {
    score += 20;
  }

  if (profile.category && scheme.eligibilityRules.categories?.includes(profile.category)) {
    score += 15;
  }

  if (scheme.verified) score += 10;

  return score;
}

export async function getRelevantSchemes(
  profile: UserProfile,
  conversationHistory: Array<{ role: "user" | "assistant"; content: string }>
): Promise<LocalScheme[]> {
  const cacheKey = profile.uid;
  const cached = schemeCache.get(cacheKey);

  if (cached && Date.now() - cached.timestamp < CACHE_TTL_MS) {
    return cached.schemes;
  }

  const intent = extractIntentFromMessages(conversationHistory);

  const db = getFirestore();
  const snap = await db.collection("schemes").where("isActive", "==", true).limit(50).get();

  let schemes: LocalScheme[] = [];

  if (!snap.empty) {
    schemes = snap.docs.map((doc) => {
      const data = doc.data();
      return {
        ...data,
        id: doc.id,
      } as unknown as LocalScheme;
    });
  } else {
    schemes = (schemesSeed as unknown as LocalScheme[]).filter((s) => s.isActive);
  }

  const filtered = schemes.filter((s) => schemeMatchesFilters(s, profile, intent));

  const scored = filtered.map((s) => ({
    scheme: s,
    score: calculateRelevanceScore(s, profile, intent),
  }));

  scored.sort((a, b) => b.score - a.score);

  const topSchemes = scored.slice(0, 10).map((s) => s.scheme);

  schemeCache.set(cacheKey, {
    schemes: topSchemes,
    timestamp: Date.now(),
  });

  return topSchemes;
}

export function clearSchemeCache(uid?: string): void {
  if (uid) {
    schemeCache.delete(uid);
  } else {
    schemeCache.clear();
  }
}