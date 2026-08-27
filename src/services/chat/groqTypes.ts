export interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: string;
  isStreaming?: boolean;
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

export interface TextToSpeechRequest {
  text: string;
  language: "en" | "hi" | "mr";
}

export interface TextToSpeechResponse {
  audioBase64: string;
  characterCount: number;
  charsRemaining: number;
}