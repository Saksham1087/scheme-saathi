import { onCall, HttpsError } from "firebase-functions/v2/https";
import { getFirestore } from "firebase-admin/firestore";
import { callGroqChat } from "./groqClient";
import { buildSystemPrompt, buildConversationMessages } from "./promptBuilder";
import { getRelevantSchemes, UserProfile } from "./schemeContext";
import type { LocalScheme } from "./types";

const DAILY_CHAT_LIMIT = 50;
const chatUsage = new Map<string, { count: number; resetAt: number }>();

function checkRateLimit(uid: string): void {
  const now = Date.now();
  const usage = chatUsage.get(uid);

  if (!usage || now > usage.resetAt) {
    const nextMidnight = new Date();
    nextMidnight.setUTCHours(24, 0, 0, 0);
    chatUsage.set(uid, { count: 1, resetAt: nextMidnight.getTime() });
    return;
  }

  if (usage.count >= DAILY_CHAT_LIMIT) {
    throw new HttpsError(
      "resource-exhausted",
      "Daily chat limit reached. Try again tomorrow."
    );
  }

  usage.count++;
}

export interface ChatCompletionRequest {
  messages: Array<{ role: "user" | "assistant"; content: string }>;
}

export interface ChatCompletionResponse {
  response: string;
  usedSchemeIds: string[];
  tokenUsage: {
    promptTokens: number;
    completionTokens: number;
    totalTokens: number;
  };
}

export const chatCompletion = onCall(async (request) => {
  if (!request.auth) {
    throw new HttpsError("unauthenticated", "Please sign in to use the assistant.");
  }

  const uid = request.auth.uid;
  const input = request.data;

  if (!input?.messages || !Array.isArray(input.messages) || input.messages.length === 0) {
    throw new HttpsError("invalid-argument", "Messages array required.");
  }

  checkRateLimit(uid);

  const db = getFirestore();

  const userDoc = await db.collection("users").doc(uid).get();
  const userData = userDoc.data();

  const profile: UserProfile = {
    uid,
    state: userData?.state,
    district: userData?.district,
    preferredLanguage: userData?.preferredLanguage || "en",
    category: userData?.category,
  };

  const schemes = await getRelevantSchemes(profile, input.messages);

  const systemPrompt = buildSystemPrompt({ schemes, userProfile: profile });

  const messages = buildConversationMessages(systemPrompt, input.messages);

  let groqResult;
  try {
    groqResult = await callGroqChat({ messages });
  } catch (error) {
    console.error("Groq API error:", error);
    if (error instanceof Error && error.message.includes("rate_limit")) {
      throw new HttpsError("resource-exhausted", "Service busy. Please try again in a moment.");
    }
    throw new HttpsError("internal", "Failed to generate response.");
  }

  const usedSchemeIds = extractSchemeIdsFromResponse(groqResult.content, schemes);

  await logUsage(uid, {
    timestamp: Date.now(),
    tokenUsage: groqResult,
    schemeCount: schemes.length,
    responseLength: groqResult.content.length,
  });

  return {
    response: groqResult.content,
    usedSchemeIds,
    tokenUsage: {
      promptTokens: groqResult.promptTokens,
      completionTokens: groqResult.completionTokens,
      totalTokens: groqResult.totalTokens,
    },
  };
});

function extractSchemeIdsFromResponse(response: string, schemes: LocalScheme[]): string[] {
  const usedIds: string[] = [];
  const lowerResponse = response.toLowerCase();

  for (const scheme of schemes) {
    const nameEn = scheme.name.en.toLowerCase();
    const nameHi = scheme.name.hi?.toLowerCase() || "";
    const nameMr = scheme.name.mr?.toLowerCase() || "";

    if (
      lowerResponse.includes(nameEn) ||
      lowerResponse.includes(nameHi) ||
      lowerResponse.includes(nameMr)
    ) {
      usedIds.push(scheme.id);
    }
  }

  return usedIds;
}

async function logUsage(
  uid: string,
  data: {
    timestamp: number;
    tokenUsage: { promptTokens: number; completionTokens: number; totalTokens: number };
    schemeCount: number;
    responseLength: number;
  }
): Promise<void> {
  try {
    const db = getFirestore();
    await db.collection("chatUsage").add({
      uid,
      ...data,
    });
  } catch (error) {
    console.error("Failed to log chat usage:", error);
  }
}