import { getFunctions, httpsCallable } from "firebase/functions";
import { firebaseApp } from "@/lib/firebase";
import type {
  ChatCompletionRequest,
  ChatCompletionResponse,
  TextToSpeechRequest,
  TextToSpeechResponse,
} from "./groqTypes";

const functions = getFunctions(firebaseApp, "us-central1");

const chatCompletionFn = httpsCallable<ChatCompletionRequest, ChatCompletionResponse>(
  functions,
  "chatCompletion"
);

const textToSpeechFn = httpsCallable<TextToSpeechRequest, TextToSpeechResponse>(
  functions,
  "textToSpeech"
);

export async function callChatCompletion(
  messages: Array<{ role: "user" | "assistant"; content: string }>
): Promise<ChatCompletionResponse> {
  try {
    const result = await chatCompletionFn({ messages });
    return result.data;
  } catch (error: any) {
    console.error("Chat completion error:", error);
    throw new Error(
      error.message || "Failed to get response. Please try again."
    );
  }
}

export async function callTextToSpeech(
  text: string,
  language: "en" | "hi" | "mr"
): Promise<TextToSpeechResponse> {
  try {
    const result = await textToSpeechFn({ text, language });
    return result.data;
  } catch (error: any) {
    console.error("TTS error:", error);
    throw new Error(
      error.message || "Failed to generate speech. Please try again."
    );
  }
}