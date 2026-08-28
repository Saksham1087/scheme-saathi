---
title: 'Story 6.1: Web Speech API Multilingual Voice Intake'
type: 'feature'
created: '2026-08-28'
status: 'done'
baseline_commit: 'd6cfec61ea6b6b77c5c249a5d5c073db1c556ee0'
review_loop_iteration: 0
context:
  - '_bmad-output/implementation-artifacts/epic-6-context.md'
  - '_bmad-output/planning-artifacts/architectures/architecture-scheme-saathi-2026-08-27/ARCHITECTURE-SPINE.md'
---

<frozen-after-approval reason="human-owned intent — do not modify unless human renegotiates">

## Intent

**Problem:** Semi-literate or rural beneficiaries often struggle with complex web forms and English typing, making standard digital eligibility intake tools inaccessible.

**Approach:** Implement a browser-native **Multilingual Voice Intake System** using the Web Speech API supporting Hindi (`hi-IN`), Marathi (`mr-IN`), and Indian English (`en-IN`), featuring a dedicated speech capture modal with real-time audio animation, natural language parameter extraction (mapping spoken intents to state, business purpose, income, and project budget), and automatic pre-filling of the `/find-schemes` intake wizard with seamless fallback to keyboard typing.

## Boundaries & Constraints

**Always:**
- Use browser-native `SpeechRecognition` / `webkitSpeechRecognition` with zero external API key requirements.
- Support 3 distinct language codes: Hindi (`hi-IN`), Marathi (`mr-IN`), and Indian English (`en-IN`).
- Extract demographic & financial parameters using robust regex/intent parsing:
  - Budget / Amount: parses numbers, "lakh / लाख / lac", "hazar / हज़ार / thousand" (e.g. "2.5 lakh" $\rightarrow 250000$, "50 hazar" $\rightarrow 50000$).
  - Purpose: maps keywords (e.g., "dukan / shop / store" $\rightarrow$ `shop`, "kheti / tractor / dairy" $\rightarrow$ `agri`, "padhai / college / btech" $\rightarrow$ `higher_education`, "silai / tailor / garment" $\rightarrow$ `manufacturing`, "auto / e-rickshaw / driver" $\rightarrow$ `service`).
  - State & Category: extracts mentions of Indian states (e.g. "Uttar Pradesh", "Bihar", "Maharashtra") and social categories.
- Provide immediate visual and audio feedback (listening indicator, live transcript display, and recognized parameter tags).
- Seamless fallback to manual form entry if microphone permission is denied or Web Speech is unsupported in the client browser.
- Support 100% localization in English (`en`) and Hindi (`hi`).

**Never:**
- Block the user flow if microphone access is denied.
- Transmit raw audio data to third-party servers.

## I/O & Edge-Case Matrix

| Scenario | Input / State | Expected Output / Behavior | Error Handling |
|----------|--------------|---------------------------|----------------|
| Hindi Voice Command | User speaks: "Mujhe kirana dukan ke liye 1 lakh 50 hazar ka loan chahiye" | Transcribes in Hindi $\rightarrow$ Extracts `projectType: "shop"`, `estimatedCost: 150000` $\rightarrow$ Pre-populates intake store and navigates to Step 2 | If amount not recognized, sets purpose and highlights amount input for manual review |
| Unsupported Browser | User opens in browser without Web Speech API | Hides or disables mic button with subtle tooltip: "Voice input not supported in this browser — please use manual form" | Standard form inputs remain 100% usable |
| Permission Denied | User blocks browser microphone prompt | Shows friendly guidance toast: "Microphone permission denied. You can still fill the form manually." | Resets voice button state |

</frozen-after-approval>

## Code Map

- `src/lib/voice.ts` -- Enhanced Web Speech API controller with language switching (`hi-IN`, `mr-IN`, `en-IN`), error event handling, and speech synthesis text-to-speech feedback.
- `src/lib/nlpExtractor.ts` -- Deterministic natural language entity parser extracting loan amount, business purpose, location, and social category from multilingual transcripts.
- `src/components/voice/VoiceIntakeModal.tsx` -- Accessible voice capture modal with pulsing listening animation, live speech transcript, recognized parameter pills, and "Apply to Form" action.
- `src/components/voice/VoiceFloatingButton.tsx` -- Global floating microphone trigger allowing voice intake from any page.
- `src/pages/IntakeWizard.tsx` -- Add direct "Speak Your Needs / बोलकर भरें" voice intake CTA on the intake questionnaire.
- `src/components/layout/AppShell.tsx` -- Mount global `VoiceFloatingButton`.
- `src/i18n/en.json` & `src/i18n/hi.json` -- Localization strings for voice prompts, listening states, extracted parameters, and permission notices.

## Tasks & Acceptance

**Execution:**
- [x] `src/lib/voice.ts` -- Upgrade speech recognition hook with multilingual codes and text-to-speech output.
- [x] `src/lib/nlpExtractor.ts` -- Build deterministic entity extractor for Indian currencies, amounts, and scheme purposes.
- [x] `src/components/voice/VoiceIntakeModal.tsx` -- Build accessible voice modal with live transcript and parameter preview.
- [x] `src/components/voice/VoiceFloatingButton.tsx` -- Build global floating voice launcher.
- [x] `src/pages/IntakeWizard.tsx` & `src/components/layout/AppShell.tsx` -- Mount voice buttons.
- [x] `src/i18n/en.json` & `src/i18n/hi.json` -- Add complete localized strings.

**Acceptance Criteria:**
- Given speech in Hindi or English, the Web Speech API transcribes words and extracts purpose and loan amounts.
- Given extracted values, clicking "Apply to Form" updates `useIntakeStore` and advances the wizard.
- Given browser permission denial, a graceful text fallback is provided.

## Spec Change Log

_None._

## Design Notes

- High-contrast animated orange/emerald ripple ring around the microphone during active listening.
- Clear parameter confirmation chips (e.g. `[Purpose: Retail Shop]` `[Amount: ₹1,50,000]`).

## Verification

**Commands:**
- `npm run lint` -- expected: zero errors across `src/`
- `npm run build` -- expected: clean TypeScript compilation and Vite build with no type errors

## Suggested Review Order

**Voice Controller & NLP Parameter Extractor**

- Web Speech API speech recognition and synthesis hooks (`hi-IN`, `mr-IN`, `en-IN`).
  [`voice.ts:1`](../../src/lib/voice.ts#L1)

- Deterministic multilingual currency and parameter extractor (lakhs, hazars, Indian numbers, purposes, states).
  [`nlpExtractor.ts:1`](../../src/lib/nlpExtractor.ts#L1)

**Voice UI Components & Integration**

- Accessible voice intake modal with audio ripple animation, live transcript, recognized parameter tags, and TTS playback.
  [`VoiceIntakeModal.tsx:1`](../../src/components/voice/VoiceIntakeModal.tsx#L1)

- Global floating microphone launcher.
  [`VoiceFloatingButton.tsx:1`](../../src/components/voice/VoiceFloatingButton.tsx#L1)

- Intake wizard voice trigger integration and AppShell mounting.
  [`IntakeWizard.tsx:40`](../../src/pages/IntakeWizard.tsx#L40)
  [`AppShell.tsx:135`](../../src/components/layout/AppShell.tsx#L135)

**Localization**

- Complete English and Hindi localized dictionaries for voice prompts, listening states, and extracted parameter labels.
  [`en.json:960`](../../src/i18n/en.json#L960)
  [`hi.json:960`](../../src/i18n/hi.json#L960)
