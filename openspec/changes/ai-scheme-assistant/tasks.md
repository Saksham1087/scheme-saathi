## 1. Core Services

- [x] 1.1 Create `src/services/ai/assistant.ts` — conversation state machine managing guided flow (purpose → amount → income → state → category → recommend)
- [x] 1.2 Create `src/services/ai/safety.ts` — AI safety layer that cross-references all scheme-specific claims against scheme-data-model before presenting
- [x] 1.3 Implement safety rule: respond with "I couldn't verify this information from the available official source" for any unverifiable claim
- [x] 1.4 Bound assistant knowledge to scheme-data-model — never generate info about schemes not in database
- [x] 1.5 Implement graceful degradation from LLM API to rule-based assistant when API unavailable

## 2. LLM Integration (Optional)

- [x] 2.1 Integrate LLM API (Gemini or similar) for natural language understanding and generation
- [x] 2.2 Ground all LLM scheme-specific claims in scheme-data-model data — LLM handles conversation flow, data provides facts
- [x] 2.3 Implement conversation length limits and caching for common patterns

## 3. Recommendation Integration

- [x] 3.1 Wire assistant to smart-scheme-recommender — pass collected user requirements when sufficient data gathered
- [x] 3.2 Present scheme recommendations conversationally in the chat interface
- [x] 3.3 Allow users to skip non-critical questions and proceed with partial data, noting missing fields

## 4. UI Components

- [x] 4.1 Create `ChatInterface` component — message list, input area, send button
- [x] 4.2 Create `MessageBubble` component — distinguish user vs assistant messages
- [x] 4.3 Create `AIAssistant` wrapper component integrating chat with voice input option
- [x] 4.4 Add voice input integration from voice-chat module (voice button in chat input)
- [x] 4.5 Add text input as default and always-available option
- [x] 4.6 Style chat UI to match existing app design system

## 5. Pages & Routing

- [x] 5.1 Create `src/pages/Assistant.tsx` — conversational assistant page at `/assistant`
- [x] 5.2 Add route to router configuration
- [x] 5.3 Scope conversation to single session — no persistence across page refreshes unless user saves

## 6. Testing & Polish

- [x] 6.1 Test guided conversation flow end-to-end with all required fields
- [x] 6.2 Test conversation with partial data / skipped questions
- [x] 6.3 Test AI safety layer — verify no hallucinated scheme data reaches user
- [x] 6.4 Test LLM API unavailable degradation to rule-based assistant
- [x] 6.5 Test voice input integration within chat interface
