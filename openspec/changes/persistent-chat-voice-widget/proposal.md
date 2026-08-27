## Why

Scheme Sathi needs a persistent, always-available conversational interface that helps SC beneficiaries discover government schemes, understand eligibility, calculate repayment, and find Channel Partners — directly from any page. The existing `/assistant` page is isolated and lacks voice capabilities. Users need a lightweight, multilingual chat + voice widget that feels like "Scheme Sathi is speaking" — not a generic chatbot.

## What Changes

- **New**: Persistent side-drawer chat widget ("Talk to Scheme Sathi") accessible on all pages for signed-in users
- **New**: Voice input (browser Web Speech API) for Hindi/English/Marathi with structured field extraction
- **New**: Voice output (ElevenLabs TTS) per-message on user click — not auto-play
- **New**: Groq LLM backend (llama-3.3-70b-versatile) via Firebase Functions for natural conversation + scheme-aware answers
- **New**: Scheme context injection — relevant schemes fetched from Firestore and passed to LLM to prevent hallucination
- **New**: Conversation persistence across navigation via IndexedDB
- **Modified**: Replace existing `/assistant` page with the persistent drawer (BREAKING: route removed)
- **Modified**: Navbar gets "Talk to Scheme Sathi" trigger button

## Capabilities

### New Capabilities
- `persistent-chat-widget`: Side-drawer chat UI, message list, input bar, persistence, auth guard
- `voice-input-integration`: Browser speech recognition (existing `VoiceInput` component reused), multilingual support
- `voice-output-tts`: ElevenLabs text-to-speech via Cloud Function, per-message user-triggered, Hindi/English/Marathi voices
- `groq-chat-backend`: Cloud Function for Groq LLM calls with scheme context injection, auth verification, rate limiting
- `scheme-context-retrieval`: Firestore query for user-relevant schemes based on conversation, injected into LLM prompt

### Modified Capabilities
- `ai-scheme-assistant`: Replaces rule-based `/assistant` page with LLM-driven persistent widget; requirements shift from structured Q&A to open conversation with verified data grounding

## Impact

**Frontend (React/TypeScript)**:
- New: `src/components/chat/*` (drawer, header, message list, input, persistence hook)
- Modified: `src/App.tsx` (add drawer at root), `src/components/layout/Navbar.tsx` (add trigger)
- Deleted: `src/pages/Assistant.tsx`, `/assistant` route

**Backend (Firebase Functions/Node 20)**:
- New: `functions/src/chat/*` (chatCompletion, textToSpeech, promptBuilder, schemeContext, groqClient, elevenlabsClient)
- Modified: `functions/src/index.ts` (export new functions), `functions/package.json` (groq-sdk, @elevenlabs/elevenlabs-js)

**Dependencies**:
- Groq API key (server-only): `YOUR_GROQ_API_KEY`
- ElevenLabs API key (server-only): `YOUR_ELEVENLABS_API_KEY`
- Firebase Functions secrets for both keys

**Firestore**:
- Reads: `schemes` collection (for context injection), `users` (for profile)
- No new collections
