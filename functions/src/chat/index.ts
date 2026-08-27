export { chatCompletion } from "./chatCompletion";
export { textToSpeech } from "./textToSpeech";
export { getGroqClient, callGroqChat, type ChatCompletionParams, type ChatCompletionResult } from "./groqClient";
export { getElevenLabsClient, callElevenLabsTTS, VOICE_IDS, TTS_MODEL, type TextToSpeechParams, type TextToSpeechResult, type VoiceLanguage } from "./elevenlabsClient";
export { buildSystemPrompt, buildConversationMessages, type SchemeContext } from "./promptBuilder";
export { getRelevantSchemes, clearSchemeCache, type UserProfile, type ConversationIntent } from "./schemeContext";