import { onCall, HttpsError } from "firebase-functions/v2/https";
import { getFirestore } from "firebase-admin/firestore";
import { callElevenLabsTTS, VoiceLanguage } from "./elevenlabsClient";

const DAILY_TTS_LIMIT = 20;
const ttsUsage = new Map<string, { count: number; resetAt: number; chars: number }>();
const MONTHLY_CHAR_LIMIT = 10000;

function checkTtsRateLimit(uid: string, charCount: number): void {
  const now = Date.now();
  let usage = ttsUsage.get(uid);

  const currentMonthStart = new Date();
  currentMonthStart.setDate(1);
  currentMonthStart.setHours(0, 0, 0, 0);
  const monthStartMs = currentMonthStart.getTime();

  if (!usage || now > usage.resetAt) {
    const nextMonth = new Date(currentMonthStart);
    nextMonth.setMonth(nextMonth.getMonth() + 1);
    ttsUsage.set(uid, { count: 1, resetAt: nextMonth.getTime(), chars: charCount });
    return;
  }

  if (now > monthStartMs && usage.resetAt > monthStartMs) {
    usage.chars = charCount;
  } else {
    usage.chars += charCount;
  }

  if (usage.chars > MONTHLY_CHAR_LIMIT) {
    throw new HttpsError(
      "resource-exhausted",
      "Monthly character limit reached for voice output."
    );
  }

  if (usage.count >= DAILY_TTS_LIMIT) {
    throw new HttpsError(
      "resource-exhausted",
      "Daily voice limit reached. Try again tomorrow."
    );
  }

  usage.count++;
}

export interface TextToSpeechRequest {
  text: string;
  language: VoiceLanguage;
}

export interface TextToSpeechResponse {
  audioBase64: string;
  characterCount: number;
  charsRemaining: number;
}

export const textToSpeech = onCall(async (request) => {
  if (!request.auth) {
    throw new HttpsError("unauthenticated", "Please sign in to use voice output.");
  }

  const uid = request.auth.uid;
  const { text, language } = request.data;

  if (!text || typeof text !== "string" || text.trim().length === 0) {
    throw new HttpsError("invalid-argument", "Text is required for TTS.");
  }

  if (!["en", "hi", "mr"].includes(language)) {
    throw new HttpsError("invalid-argument", "Invalid language. Supported: en, hi, mr.");
  }

  checkTtsRateLimit(uid, text.length);

  let result;
  try {
    result = await callElevenLabsTTS({ text, language });
  } catch (error) {
    console.error("ElevenLabs TTS error:", error);
    throw new HttpsError("internal", "Failed to generate speech. Please try again.");
  }

  const usage = ttsUsage.get(uid);
  const charsRemaining = Math.max(0, MONTHLY_CHAR_LIMIT - (usage?.chars || 0));

  return {
    audioBase64: result.audioBase64,
    characterCount: result.characterCount,
    charsRemaining,
  };
});