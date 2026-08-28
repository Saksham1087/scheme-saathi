---
title: 'Story 2.1: 6–8 Question Demographic & Financial Intake Flow'
type: 'feature'
created: '2026-08-28'
status: 'done'
baseline_commit: 'c3a382418e2e27ec042cd35ffae9571813c6165d'
review_loop_iteration: 0
context:
  - '_bmad-output/implementation-artifacts/epic-2-context.md'
  - '_bmad-output/planning-artifacts/architectures/architecture-scheme-saathi-2026-08-27/ARCHITECTURE-SPINE.md'
---

<frozen-after-approval reason="human-owned intent — do not modify unless human renegotiates">

## Intent

**Problem:** Prospective beneficiaries seeking government loan assistance often find eligibility forms intimidating, lengthy, and filled with technical bureaucratic jargon, leading to high abandonment rates and incomplete profile submissions.

**Approach:** Implement an accessible, mobile-first 7-step guided intake wizard at `/find-schemes` (with `/recommend` alias) that captures key demographic and financial parameters (State/Location, Social Category, Age & Gender, Education, Annual Family Income, Project/Business Purpose, Estimated Project Cost) with high-contrast touch controls, step-by-step progress tracking, real-time input validation, and bilingual voice/speech input preparation.

## Boundaries & Constraints

**Always:**
- Structure the intake flow into 7 bite-sized, accessible steps:
  1. State / Union Territory Location
  2. Social / Caste Category
  3. Age & Gender
  4. Education Level
  5. Annual Family Income (with statutory consent disclosure)
  6. Business / Loan Purpose (Shop, Service, Manufacturing, Agri-allied, Education, Sanitation, Artisan, etc.)
  7. Estimated Project Cost & Required Funding
- Provide immediate, real-time inline validation (e.g., negative income/cost rejection, non-numeric guardrails, required state selection).
- Support 100% localization in English (`en`) and Hindi (`hi`).
- Maintain accessible WCAG AA touch targets (min 44x44px), keyboard navigation, and high visual contrast.
- Persist state in `useIntakeStore` with step resumption and quick reset actions.

**Ask First:**
- Modifying demographic data schemas that change Cloud Function input contracts.

**Never:**
- Request or collect Aadhaar numbers, biometric data, or bank account numbers during public eligibility discovery.
- Allow form submission with negative or invalid numerical values.

## I/O & Edge-Case Matrix

| Scenario | Input / State | Expected Output / Behavior | Error Handling |
|----------|--------------|---------------------------|----------------|
| Step Navigation | User selects State and taps "Next" | Transitions to Step 2 with animated progress bar update (1/7 to 2/7) | If required field is empty, displays inline error and keeps focus on field |
| Invalid Income Input | User inputs negative number or characters (e.g., "-50000" or "abc") | Rejects input immediately with error: "Please enter a valid positive income amount" | Prevents advancing to next step until corrected |
| Consent Disclosure | User reaches Annual Family Income step | Displays statutory demographic processing consent disclosure before proceeding | User must check consent box before proceeding past financial disclosure |
| Step Resumption & Reset | User refreshes page or navigates away | Re-loads current step and values from store; "Start Over" button resets all answers to defaults | Gracefully handles empty or corrupted local state |
| Submission to Engine | User completes Step 7 and clicks "Find Matching Schemes" | Saves profile to store and routes to `/results` with evaluated scheme match payload | If Cloud Function is unreachable, executes client-side fallback engine seamlessly |

</frozen-after-approval>

## Code Map

- `src/types/index.ts` -- Extend `MatchInput` interface with structured fields: `state`, `category`, `gender`, `age`, `educationStatus`, `annualFamilyIncome`, `projectType`, `estimatedCost`, `consentAt`.
- `src/stores/intakeStore.ts` -- Enhanced Zustand store managing 7-step wizard state, validation flags, step navigation history, and reset handlers.
- `src/pages/IntakeWizard.tsx` -- Redesigned 7-step guided intake wizard with animated progress bar, responsive card layouts, and quick step jump links.
- `src/components/intake/IntakeStepCard.tsx` -- Reusable step wrapper with header, helper hints, step counter, and back/next actions.
- `src/components/intake/IntakeSummaryReview.tsx` -- Step 7 pre-submission review panel summarizing all entered demographic and financial values before final scoring.
- `src/App.tsx` -- Register `/find-schemes` and `/recommend` routes pointing to `IntakeWizard`.
- `src/i18n/en.json` & `src/i18n/hi.json` -- Localization strings for all 7 questions, validation messages, hints, and category labels.

## Tasks & Acceptance

**Execution:**
- [x] `src/types/index.ts` -- Update `MatchInput` schema with all 7 demographic dimensions.
- [x] `src/stores/intakeStore.ts` -- Upgrade store with step validation, field setters, and consent recording.
- [x] `src/components/intake/IntakeStepCard.tsx` -- Build accessible step container with progress indicator.
- [x] `src/components/intake/IntakeSummaryReview.tsx` -- Build review summary card before engine submission.
- [x] `src/pages/IntakeWizard.tsx` -- Implement 7-step guided questionnaire with inline validation, sliders, and selection tiles.
- [x] `src/App.tsx` -- Add `/recommend` route alias for `/find-schemes`.
- [x] `src/i18n/en.json` & `src/i18n/hi.json` -- Add complete bilingual strings for all 7 steps.

**Acceptance Criteria:**
- Given a user on `/find-schemes`, when they proceed through the 7 steps, each step validates required fields before allowing progression.
- Given invalid income or negative project cost, an inline error is shown and submission is blocked.
- Given completion of Step 7, clicking "Find Matching Schemes" navigates to `/results` with profile data ready for scoring.
- Given bilingual toggle (`en` / `hi`), all questions, options, and error messages update in real time.

## Spec Change Log

_None._

## Design Notes

- High-contrast card selectors with large touch areas for ease of use on budget mobile devices.
- Currency inputs with formatted INR helpers (e.g. typing 150000 displays "₹1,50,000 (₹1.5 Lakhs)").
- Accessible keyboard shortcuts (Enter to proceed, Backspace/Esc to go back).

## Verification

**Commands:**
- `npm run lint` -- expected: zero errors across `src/`
- `npm run build` -- expected: clean TypeScript compilation and Vite build with no type errors

## Suggested Review Order

**Intake Wizard Page & Step Architecture**

- Main 7-step guided questionnaire page with animated progress bar and validation checks.
  [`IntakeWizard.tsx:45`](../../src/pages/IntakeWizard.tsx#L45)

- Step container card with step counter, keyboard navigation, and mobile touch targets.
  [`IntakeStepCard.tsx:20`](../../src/components/intake/IntakeStepCard.tsx#L20)

- Pre-submission summary review panel before matching engine execution.
  [`IntakeSummaryReview.tsx:15`](../../src/components/intake/IntakeSummaryReview.tsx#L15)

**State Management & Engine Fallback**

- Zustand intake store managing 7-step inputs, consent timestamp, and step resumption.
  [`intakeStore.ts:25`](../../src/stores/intakeStore.ts#L25)

- Client-side deterministic matching engine service ensuring offline parity with Cloud Functions.
  [`matchingEngine.ts:20`](../../src/services/matchingEngine.ts#L20)

**Types, Routing & Localization**

- Extended `MatchInput` demographic types and schemas.
  [`types/index.ts:120`](../../src/types/index.ts#L120)

- Route aliases `/find-schemes` and `/recommend` registered in `App.tsx`.
  [`App.tsx:25`](../../src/App.tsx#L25)

- English and Hindi localized question strings, options, and validation copy.
  [`en.json:480`](../../src/i18n/en.json#L480)
  [`hi.json:480`](../../src/i18n/hi.json#L480)
