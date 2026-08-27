## Context

Scheme Sathi currently has:
- A rule-based `/assistant` page at `/assistant` route (src/pages/Assistant.tsx) using `ChatInterface` + `assistant.ts` for structured Q&A
- `VoiceInput` component using browser Web Speech API (EN/HI/MR) with `nlp.ts` for field extraction
- Translation keys for assistant + voice in en/hi/mr
- Firebase Functions infrastructure with `matchSchemes` callable for rule-based matching
- Scheme data in local JSON (src/data/schemes/) and Firestore `schemes` collection
- Auth via Firebase Auth

The new widget must be persistent (all pages), support voice I/O, use Groq LLM for open conversation, and ground answers in verified scheme data.

## Goals / Non-Goals

**Goals:**
- Persistent side-drawer chat widget on all pages for signed-in users
- Text chat with Groq LLM (llama-3.3-70b-versatile) via Cloud Function
- Voice input via existing `VoiceInput` component (browser Web Speech API)
- Voice output via ElevenLabs TTS (per-message click, not auto-play)
- Scheme context injection: fetch relevant schemes from Firestore, inject into LLM prompt
- Conversation persistence across navigation via IndexedDB
- Multilingual: EN, HI, MR for all UI + TTS
- Replace `/assistant` page entirely
- Rate limiting per user (Groq free tier: 30 req/min, 6k tokens/min; ElevenLabs: 10k chars/month)

**Non-Goals:**
- Real-time streaming tokens (MVP: full response then render)
- Conversation sharing/export
- Voice input via ElevenLabs (use browser API)
- Unauthenticated access
- Webhook/callback integrations
- Admin chat monitoring

## Decisions

| Decision | Choice | Rationale | Alternatives Considered |
|----------|--------|-----------|-------------------------|
| **Widget position** | Fixed right side drawer (z-50), slides in 380px | Familiar pattern, doesn't obscure content on mobile | Bottom sheet, modal, floating bubble |
| **Minimize behavior** | Collapse to 60px vertical tab on right edge | Persistent access without full drawer | Full close, floating action button |
| **Groq model** | `llama-3.3-70b-versatile` | Best reasoning for scheme Q&A; free tier available | `llama-3.1-8b-instant` (faster/cheaper) |
| **Context window** | Last 10 messages + system prompt (~4k tokens) | Balances context with token limits | Last 5, last 20 |
| **Scheme retrieval** | Call `matchSchemes` logic + fetch top 10 by eligibility | Reuses existing matching, accurate context | Full-text search on query keywords |
| **TTS trigger** | Per-message "Play" button click | User control, saves ElevenLabs chars, avoids surprise audio | Auto-play on response |
| **ElevenLabs voices** | Multilingual v2: Adam (EN), Emily (HI/MR) | Supports 29 languages including Hindi/Marathi | Language-specific voices (limited availability) |
| **TTS audio format** | Base64 MP3 returned from Function | Simple frontend `<audio>` playback | Streaming URL (complex, needs signed URLs) |
| **Persistence** | IndexedDB (idb lib) keyed by UID | Survives refresh, no backend storage needed | localStorage (size limit), Firestore (cost) |
| **Auth guard** | Cloud Function verifies `request.auth.uid` | Standard Firebase pattern | Custom claims, App Check |
| **Rate limiting** | In-memory per-UID counter in Function (reset daily) | Simple, no extra infra | Redis, Firestore counter |

## Risks / Trade-offs

| Risk | Mitigation |
|------|------------|
| Groq rate limits (30 req/min) | Per-user daily cap (50); exponential backoff; fallback to rule-based `assistant.ts` logic if exceeded |
| ElevenLabs char limit (10k/mo free) | Per-user daily TTS cap (20); cache repeated phrases; show char count in UI |
| LLM hallucination on scheme facts | Strict system prompt: "NEVER invent"; inject top 10 verified schemes as context; if unsure → "I couldn't verify" |
| Browser speech recognition unreliable for HI/MR | Fallback to typed input (existing `VoiceInput` handles this); show "We couldn't understand. Type instead." |
| IndexedDB quota exceeded | Limit history to last 100 messages; compress old messages |
| Mobile drawer UX on small screens | 100% width on <480px; swipe-to-close gesture |
| Auth token expiry during long session | Function returns 401 → frontend re-auth → retry |
| TTS latency (ElevenLabs ~1-2s) | Show loading spinner on play button; cache audio in memory per session |

## Migration Plan

1. **Deploy Functions first** (chatCompletion, textToSpeech) with API keys as secrets
2. **Deploy frontend** with new drawer components, updated App.tsx, Navbar
3. **Remove** `/assistant` route and Assistant.tsx
4. **Test** signed-in flow on staging
5. **Rollback**: Revert frontend deploy; Functions can remain (no breaking API changes)

## Open Questions

1. **ElevenLabs voice quality for Marathi**: Test Emily voice; may need custom voice or accept accent
2. **Scheme context freshness**: Should we re-fetch schemes on every message or cache per session? (Recommend: cache 5 min)
3. **Conversation export**: Future feature? (Non-goal for MVP)
4. **Analytics**: Track chat usage, TTS usage, errors? (Add later)