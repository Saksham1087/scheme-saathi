import type { LocalScheme, UserProfile } from "./types";

export interface SchemeContext {
  schemes: LocalScheme[];
  userProfile: UserProfile;
}

export function buildSystemPrompt(context: SchemeContext): string {
  const { schemes, userProfile } = context;
  const lang = userProfile.preferredLanguage || "en";

  const schemeList = schemes
    .map((s) => {
      const fa = s.financialAssistance;
      const maxAmount = fa.maxAmount ? `₹${(fa.maxAmount / 100000).toFixed(1)}L` : "N/A";
      const interest = fa.interestRate
        ? `${fa.interestRate.min}%-${fa.interestRate.max}%`
        : "N/A";
      const categories = s.category.join(", ");
      const eligibility = buildEligibilitySummary(s.eligibilityRules);

      const name = (s.name as Record<string, string>)[lang] || s.name.en;
      return `- ${name}: Max ${maxAmount}, ${interest} interest, Categories: ${categories}, Eligibility: ${eligibility}`;
    })
    .join("\n");

  const userContext = [
    userProfile.state && `State: ${userProfile.state}`,
    userProfile.district && `District: ${userProfile.district}`,
    userProfile.category && `Category: ${userProfile.category}`,
    userProfile.preferredLanguage && `Language: ${userProfile.preferredLanguage}`,
  ]
    .filter(Boolean)
    .join(", ");

  return `You are Scheme Sathi — a government scheme navigator for SC beneficiaries in India.
Tone: trustworthy, simple, inclusive, transparent, government-service oriented.

USER PROFILE: ${userContext || "Not provided"}

AVAILABLE SCHEMES (verified data only):
${schemeList || "No schemes matched current context."}

CRITICAL RULES — NEVER VIOLATE:
1. NEVER invent: loan limits, interest rates, eligibility criteria, income thresholds, required documents, partner availability, fund availability, NPA status, or government benefits.
2. If information cannot be verified from the provided scheme data: "I couldn't verify this from official sources."
3. Always describe match scores as "Indicative matching score" — never as approval or guarantee.
4. Cite scheme names exactly as listed above when referencing them.
5. For financial questions (EMI, interest, moratorium): use only the data from the schemes above. If a scheme lacks specific data, say so.
6. For document questions: list only documents from the scheme's requiredDocuments.
7. For Channel Partner questions: only mention partner types from the scheme's channelPartnerTypes.
8. If user asks about a scheme not in the list: "That scheme isn't in my verified database. It may not be available in Scheme Sathi yet."
9. Keep responses concise but complete. Use bullet points for clarity.
10. Respond in the user's language (${lang === "hi" ? "Hindi" : lang === "mr" ? "Marathi" : "English"}).`;
}

function buildEligibilitySummary(rules: any): string {
  const parts: string[] = [];
  if (rules.minIncome || rules.maxIncome) {
    const min = rules.minIncome ? `₹${(rules.minIncome / 100000).toFixed(1)}L` : "any";
    const max = rules.maxIncome ? `₹${(rules.maxIncome / 100000).toFixed(1)}L` : "no limit";
    parts.push(`Income ${min}–${max}`);
  }
  if (rules.minAge || rules.maxAge) {
    parts.push(`Age ${rules.minAge || 18}–${rules.maxAge || 65}`);
  }
  if (rules.categories?.length) {
    parts.push(`Category: ${rules.categories.join(", ")}`);
  }
  if (rules.states?.length) {
    parts.push(`States: ${rules.states.slice(0, 3).join(", ")}${rules.states.length > 3 ? "..." : ""}`);
  }
  return parts.length ? parts.join("; ") : "See scheme details";
}

export function buildConversationMessages(
  systemPrompt: string,
  history: Array<{ role: "user" | "assistant"; content: string }>,
  maxHistory = 10
): Array<{ role: "system" | "user" | "assistant"; content: string }> {
  const recentHistory = history.slice(-maxHistory);
  return [
    { role: "system" as const, content: systemPrompt },
    ...recentHistory.map((msg) => ({
      role: msg.role,
      content: msg.content,
    })),
  ];
}