---
title: 'Story 6.2: Grounded Conversational Scheme Assistant'
type: 'feature'
created: '2026-08-28'
status: 'done'
baseline_commit: '64887c4731b83d1c165f1e847c234a9ef1c28c3a'
review_loop_iteration: 0
context:
  - '_bmad-output/implementation-artifacts/epic-6-context.md'
  - '_bmad-output/implementation-artifacts/spec-6-1-web-speech-api-multilingual-voice-intake.md'
---

<frozen-after-approval reason="human-owned intent — do not modify unless human renegotiates">

## Intent

**Problem:** Conventional generic chatbots hallucinate loan policies, promise impossible loan approvals, or give incorrect interest rates that mislead vulnerable beneficiaries.

**Approach:** Implement a grounded, conversational AI assistant ("Saathi AI") accessible via a dedicated page `/assistant` and a global floating chat drawer that answers questions strictly anchored in verified government scheme data, provides deep links to calculators and partner maps, enforces mandatory anti-hallucination safety guardrails, and supports voice dictation and text-to-speech readout in English and Hindi.

## Boundaries & Constraints

**Always:**
- Ground all responses strictly in the verified scheme catalog and statutory knowledge base (interest rates, max assistance caps, moratorium rules, required documents, channel partners).
- When a user asks an ungrounded or speculative question, display the mandatory AI Safety Guardrail disclaimer:
  *"I couldn't verify this information from official government scheme guidelines. SchemeSathi provides indicative guidance; final loan approval is subject to appraisal by designated Channel Partners (SCAs/Banks)."*
- Attach contextual action pills to responses (e.g., "Calculate EMI", "View Scheme Details", "Find Partners", "Check Documents").
- Support voice input dictation via Web Speech API and audio readout via Web Speech Synthesis.
- Support 100% localization in English (`en`) and Hindi (`hi`).
- Maintain accessible WCAG AA touch targets (min 44x44px).

**Never:**
- Fabricate non-existent schemes, guarantee loan sanctions, or estimate interest rates not specified in official guidelines.
- Block the user from accessing manual forms or catalog browsing.

## I/O & Edge-Case Matrix

| Scenario | Input / State | Expected Output / Behavior | Error Handling |
|----------|--------------|---------------------------|----------------|
| Women Entrepreneur Query | User asks: "Are there special schemes for women?" | Replies with Mahila Samriddhi Yojana details (4% p.a. interest, up to ₹1.4L, SHG channel) and action buttons to view scheme or calculate EMI | Cites verified rules |
| Out-of-Scope / Hallucination Bait | User asks: "Can you guarantee I get approved for 50 lakhs tomorrow without documents?" | Rebuffs speculation: cites that loans require physical document appraisal and cites official maximum limits with statutory safety guardrail disclaimer | Refuses false promises |
| Voice Dictation | User clicks mic inside chat input and speaks | Transcribes speech directly into message input; allows user review before sending | Shows clear listening state |

</frozen-after-approval>

## Code Map

- `src/types/assistant.ts` -- Define interfaces for `ChatMessage`, `AssistantActionPill`, `GroundedSchemeContext`, and `SuggestedPrompt`.
- `src/lib/assistantService.ts` -- Grounded conversational retrieval engine with local scheme indexing, keyword intent matching, citation generator, and safety guardrails.
- `src/stores/useAssistantStore.ts` -- Zustand store managing message history, active streaming state, audio TTS playback state, and language.
- `src/components/assistant/ChatBubble.tsx` -- Message bubble rendering markdown, source citations, action pills, and TTS speak button.
- `src/components/assistant/AssistantDrawer.tsx` -- Global floating expandable chat assistant widget.
- `src/pages/AssistantPage.tsx` -- Dedicated full-screen `/assistant` page with suggested prompt chips, chat history, and voice dictation.
- `src/App.tsx` -- Register `/assistant` route and mount global `AssistantDrawer` in `AppShell.tsx`.
- `src/i18n/en.json` & `src/i18n/hi.json` -- Localization strings for assistant persona, suggested prompts, disclaimer copy, and action buttons.

## Tasks & Acceptance

**Execution:**
- [x] `src/types/assistant.ts` -- Define conversational assistant data models.
- [x] `src/lib/assistantService.ts` -- Implement grounded retrieval engine with safety guardrails and action pills.
- [x] `src/stores/useAssistantStore.ts` -- Build persistent assistant conversation store.
- [x] `src/components/assistant/ChatBubble.tsx` -- Build accessible message bubble with citations and TTS playback.
- [x] `src/components/assistant/AssistantDrawer.tsx` -- Build global floating assistant widget.
- [x] `src/pages/AssistantPage.tsx` -- Build dedicated `/assistant` page.
- [x] `src/App.tsx` & `src/components/layout/AppShell.tsx` -- Register route and mount floating assistant.
- [x] `src/i18n/en.json` & `src/i18n/hi.json` -- Add complete localized strings in English and Hindi.

**Acceptance Criteria:**
- Given a scheme question, Saathi AI replies with accurate numbers grounded in official data and deep-link action pills.
- Given a speculative prompt, the mandatory AI safety disclaimer is returned.
- Given voice dictation, spoken words populate the chat input.

## Spec Change Log

_None._

## Design Notes

- Warm "Saathi AI" persona with government trust colors (Saffron/Emerald accent badges).
- Quick suggestion chips for rapid discovery on mobile devices.

## Verification

**Commands:**
- `npm run lint` -- expected: zero errors across `src/`
- `npm run build` -- expected: clean TypeScript compilation and Vite build with no type errors

## Suggested Review Order

**Grounded Conversational Retrieval & Safety Engine**

- Grounded retrieval service, keyword routing, official citations, deep-link action pill generator, and mandatory AI safety guardrails.
  [`assistantService.ts:1`](../../src/lib/assistantService.ts#L1)

- Conversational assistant data models and interfaces.
  [`assistant.ts:1`](../../src/types/assistant.ts#L1)

- Persistent assistant conversation store with TTS audio playback control.
  [`useAssistantStore.ts:1`](../../src/stores/useAssistantStore.ts#L1)

**Chat UI Components & Assistant Page**

- Message bubble with markdown tables, citations, action pills, and Web Speech Synthesis controls.
  [`ChatBubble.tsx:1`](../../src/components/assistant/ChatBubble.tsx#L1)

- Global floating assistant drawer with voice dictation and prompt chips.
  [`AssistantDrawer.tsx:1`](../../src/components/assistant/AssistantDrawer.tsx#L1)

- Dedicated full-screen `/assistant` page.
  [`AssistantPage.tsx:1`](../../src/pages/AssistantPage.tsx#L1)

**Routing, AppShell & Localization**

- Route registration in App.tsx and mounting in AppShell.
  [`App.tsx:32`](../../src/App.tsx#L32)
  [`AppShell.tsx:140`](../../src/components/layout/AppShell.tsx#L140)

- English and Hindi localized dictionaries for persona, safety disclaimers, and suggested prompts.
  [`en.json:1020`](../../src/i18n/en.json#L1020)
  [`hi.json:1020`](../../src/i18n/hi.json#L1020)
