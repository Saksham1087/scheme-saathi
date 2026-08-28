import { Groq } from "groq-sdk";
import * as functions from "firebase-functions";

let groqClient: Groq | null = null;

function getApiKey(): string {
  const config = functions.config();
  const apiKey = config?.chat?.groq_api_key;
  if (!apiKey) {
    throw new Error("GROQ_API_KEY not set in functions config");
  }
  return apiKey;
}

export function getGroqClient(): Groq {
  if (!groqClient) {
    groqClient = new Groq({ apiKey: getApiKey() });
  }
  return groqClient;
}

export interface ChatCompletionParams {
  messages: Array<{ role: "system" | "user" | "assistant"; content: string }>;
  model?: string;
  temperature?: number;
  maxTokens?: number;
}

export interface ChatCompletionResult {
  content: string;
  promptTokens: number;
  completionTokens: number;
  totalTokens: number;
}

export async function callGroqChat(
  params: ChatCompletionParams,
  retries = 3
): Promise<ChatCompletionResult> {
  const client = getGroqClient();
  const model = params.model || "llama-3.3-70b-versatile";
  const temperature = params.temperature ?? 0.3;
  const maxTokens = params.maxTokens ?? 1024;

  let lastError: Error | null = null;

  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      const completion = await client.chat.completions.create({
        model,
        messages: params.messages,
        temperature,
        max_tokens: maxTokens,
        stream: false,
      });

      const choice = completion.choices[0];
      if (!choice?.message?.content) {
        throw new Error("Empty response from Groq");
      }

      return {
        content: choice.message.content,
        promptTokens: completion.usage?.prompt_tokens ?? 0,
        completionTokens: completion.usage?.completion_tokens ?? 0,
        totalTokens: completion.usage?.total_tokens ?? 0,
      };
    } catch (error) {
      lastError = error as Error;

      const isRetryable =
        error instanceof Error &&
        (error.message.includes("rate_limit") ||
          error.message.includes("503") ||
          error.message.includes("502") ||
          error.message.includes("504") ||
          error.message.includes("timeout"));

      if (isRetryable && attempt < retries) {
        const delay = Math.pow(2, attempt) * 1000;
        await new Promise((resolve) => setTimeout(resolve, delay));
        continue;
      }

      throw error;
    }
  }

  throw lastError ?? new Error("Groq request failed after retries");
}