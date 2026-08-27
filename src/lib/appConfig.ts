export const appConfig = {
  hasChat: true,
  hasVoice: true,
  hasTTS: true,
} as const;

export type AppConfig = typeof appConfig;