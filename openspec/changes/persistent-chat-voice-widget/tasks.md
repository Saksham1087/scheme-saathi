## 1. Backend: Firebase Functions Setup

- [ ] 1.1 Add `groq-sdk` and `@elevenlabs/elevenlabs-js` to `functions/package.json`
- [ ] 1.2 Add `GROQ_API_KEY` and `ELEVENLABS_API_KEY` to `functions/.env.example`
- [ ] 1.3 Create `functions/src/chat/groqClient.ts` - Groq SDK wrapper with API key from env
- [ ] 1.4 Create `functions/src/chat/elevenlabsClient.ts` - ElevenLabs SDK wrapper with API key from env
- [ ] 1.5 Create `functions/src/chat/promptBuilder.ts` - Build system prompt with Scheme Sathi persona + scheme context
- [ ] 1.6 Create `functions/src/chat/schemeContext.ts` - Firestore query for relevant schemes (top 10, cached 5 min)
- [ ] 1.7 Create `functions/src/chat/chatCompletion.ts` - HTTPS Callable: auth → profile → schemes → prompt → Groq → response
- [ ] 1.8 Create `functions/src/chat/textToSpeech.ts` - HTTPS Callable: auth → ElevenLabs TTS → base64 MP3
- [ ] 1.9 Create `functions/src/chat/index.ts` - Export chat functions
- [ ] 1.10 Update `functions/src/index.ts` - Export `chatCompletion` and `textToSpeech`
- [ ] 1.11 Deploy functions and set secrets: `firebase functions:secrets:set GROQ_API_KEY ELEVENLABS_API_KEY`

## 2. Frontend: Chat Drawer Core Components

- [ ] 2.1 Create `src/components/chat/PersistentChatDrawer.tsx` - Main side drawer (fixed right, z-50, slide animation)
- [ ] 2.2 Create `src/components/chat/ChatHeader.tsx` - Title, TTS toggle, minimize/close, new conversation button
- [ ] 2.3 Create `src/components/chat/ChatMessageList.tsx` - Virtualized message list with user/assistant bubbles, timestamps
- [ ] 2.4 Create `src/components/chat/ChatInput.tsx` - Text input + VoiceInput component + send button
- [ ] 2.5 Create `src/components/chat/index.ts` - Export all chat components
- [ ] 2.6 Create `src/hooks/useChatPersistence.ts` - IndexedDB persistence (idb): load/save/clear by UID, 100 msg limit
- [ ] 2.7 Create `src/services/chat/chatService.ts` - Call `chatCompletion` and `textToSpeech` Cloud Functions
- [ ] 2.8 Create `src/services/chat/groqTypes.ts` - Types for messages, requests, responses

## 3. Frontend: Integration & Routing

- [ ] 3.1 Update `src/App.tsx` - Add `<PersistentChatDrawer />` at root level (outside Routes)
- [ ] 3.2 Update `src/components/layout/Navbar.tsx` - Add "Talk to Scheme Sathi" button to open drawer
- [ ] 3.3 Delete `src/pages/Assistant.tsx`
- [ ] 3.4 Remove `/assistant` route from router configuration
- [ ] 3.5 Add auth guard in `PersistentChatDrawer` - redirect to login if not authenticated

## 4. Frontend: Voice & TTS Integration

- [ ] 4.1 Integrate existing `VoiceInput` component into `ChatInput.tsx` (reuse as-is)
- [ ] 4.2 Implement TTS playback in `ChatMessageList` - Play/Stop button per assistant message
- [ ] 4.3 Implement TTS toggle state in `ChatHeader` - persists to localStorage
- [ ] 4.4 Add TTS character counter display in header (from function response metadata)
- [ ] 4.5 Handle TTS errors: toast notifications, button state recovery
- [ ] 4.6 Ensure TTS stops on new message or user click

## 5. Frontend: i18n & Polish

- [ ] 5.1 Add chat drawer translation keys to `src/i18n/en.json` (welcome, placeholders, errors, TTS labels)
- [ ] 5.2 Add chat drawer translation keys to `src/i18n/hi.json`
- [ ] 5.3 Add chat drawer translation keys to `src/i18n/mr.json`
- [ ] 5.4 Add loading/typing indicator in `ChatMessageList`
- [ ] 5.5 Add welcome message + quick prompt chips for empty conversation
- [ ] 5.6 Add swipe-to-close gesture for mobile drawer (<480px)
- [ ] 5.7 Add minimized tab state (60px vertical tab on right edge)
- [ ] 5.8 Test responsive behavior: desktop (380px), tablet, mobile (100%)

## 6. Testing & Verification

- [ ] 6.1 Test signed-in flow: open drawer, send text message, receive Groq response
- [ ] 6.2 Test voice input: click mic, speak in EN/HI/MR, transcript appears, send
- [ ] 6.3 Test TTS: enable toggle, click Play on response, audio plays, Stop works
- [ ] 6.4 Test persistence: refresh page, drawer opens with history intact
- [ ] 6.5 Test navigation: open drawer, navigate pages, drawer stays open
- [ ] 6.6 Test auth: unauthenticated click → redirect to login → auto-open drawer
- [ ] 6.7 Test rate limits: exceed daily chat/TTS limits → proper error messages
- [ ] 6.8 Test scheme grounding: ask about specific scheme → response cites verified data
- [ ] 6.9 Test fallback: ask about unknown scheme → "I couldn't verify..."
- [ ] 6.10 Test mobile: open on phone, drawer works, swipe closes, voice works

## 7. Cleanup

- [ ] 7.1 Remove unused imports from deleted `Assistant.tsx`
- [ ] 7.2 Verify no dead code references to `/assistant` route
- [ ] 7.3 Update README if needed
- [ ] 7.4 Run lint and typecheck: `npm run lint` && `npm run typecheck`