import { ElevenLabsClient } from "@elevenlabs/elevenlabs-js";
import * as functions from "firebase-functions";

let elevenlabsClient: ElevenLabsClient | null = null;

function getApiKey(): string {
  const config = functions.config();
  const apiKey = config?.chat?.elevenlabs_api_key;
  if (!apiKey) {
    throw new Error("ELEVENLABS_API_KEY not set in functions config");
  }
  return apiKey;
}

export function getElevenLabsClient(): ElevenLabsClient {
  if (!elevenlabsClient) {
    elevenlabsClient = new ElevenLabsClient({ apiKey: getApiKey() });
  }
  return elevenlabsClient;
}

export type VoiceLanguage = "en" | "hi" | "mr";

export const VOICE_IDS: Record<VoiceLanguage, string> = {
  en: "pNInz6obpgDQGcFmaJgB",
  hi: "MF3mGyEYCl7XYWbV9V6O",
  mr: "MF3mGyEYCl7XYWbV9V6O",
};

export const TTS_MODEL = "eleven_multilingual_v2";

export interface TextToSpeechParams {
  text: string;
  language: VoiceLanguage;
  voiceId?: string;
}

export interface TextToSpeechResult {
  audioBase64: string;
  characterCount: number;
}

export async function callElevenLabsTTS(
  params: TextToSpeechParams
): Promise<TextToSpeechResult> {
  const client = getElevenLabsClient();
  const voiceId = params.voiceId || VOICE_IDS[params.language];

  const audio = await client.textToSpeech.convert(voiceId, {
    text: params.text,
    modelId: TTS_MODEL,
    outputFormat: "mp3_44100_128",
  });

  const chunks: Uint8Array[] = [];
  for await (const chunk of audio) {
    chunks.push(chunk);
  }

  const audioBuffer = Buffer.concat(chunks);
  const audioBase64 = audioBuffer.toString("base64");

  return {
    audioBase64,
    characterCount: params.text.length,
  };
}