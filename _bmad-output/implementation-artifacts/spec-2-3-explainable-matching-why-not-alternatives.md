---
title: 'Story 2.3: Explainable Matching & "Why Not This Scheme?" Alternatives'
type: 'feature'
created: '2026-08-28'
status: 'done'
baseline_commit: '5dcd034c44e99f0bb3b3790518bb1d6a978fbb42'
review_loop_iteration: 0
context:
  - '_bmad-output/implementation-artifacts/epic-2-context.md'
  - '_bmad-output/implementation-artifacts/spec-2-2-100-point-deterministic-eligibility-scoring-engine.md'
---

<frozen-after-approval reason="human-owned intent — do not modify unless human renegotiates">

## Intent

**Problem:** When citizens receive eligibility results, conventional portals simply hide disqualified schemes or give cryptic rejections without explaining which specific parameter caused the disqualification or offering practical alternative paths.

**Approach:** Implement an explainable results architecture on `/results` that pairs positive recommendation rationales ("Why This Scheme?") with structured gap diagnostics for disqualified/lower-scoring schemes ("Why Not This Scheme?"), displaying exact numerical constraint failures, actionable remedial explanations, and direct clickable links to suitable alternative schemes.

## Boundaries & Constraints

**Always:**
- Display exact matching reasons on qualified scheme cards with clear green bullet badges (e.g., "Annual income ₹1.5L is within ₹5.0L ceiling").
- For disqualified schemes (`eligible: false`), display a dedicated "Why Not This Scheme?" section with specific constraint failures (e.g., "Requested ₹10L exceeds ₹1.4L micro-credit cap") and remedial guidance.
- Automatically suggest and link suitable alternative schemes for every disqualified scheme (e.g., suggest Term Loan for high project costs, suggest Mahila Samriddhi for women SHG members).
- Provide tabbed or filtered views on `/results`: "Recommended Schemes (N)" and "Other Schemes & Gap Analysis (N)".
- Support 100% localization in English (`en`) and Hindi (`hi`).

**Never:**
- Display generic "Not Eligible" labels without citing the exact failing constraint.
- Block the user from viewing details of non-eligible schemes.

## I/O & Edge-Case Matrix

| Scenario | Input / State | Expected Output / Behavior | Error Handling |
|----------|--------------|---------------------------|----------------|
| High Cost Disqualification | User needs ₹15 Lakhs for business setup | Micro-Finance card shows in "Other Schemes": "Requested ₹15L exceeds ₹1.4L limit" $\rightarrow$ Suggests "Term Loan Scheme (Up to ₹50 Lakhs)" as alternative | Click on alternative scheme opens Term Loan details |
| Income Exceeds Ceiling | User family income is ₹6.0 Lakhs | Cites "Family income ₹6.0L exceeds ₹5.0L concessional ceiling"; provides advisory note on commercial bank priority sector lending | Shows general financial literacy guidance |
| Non-Student Education Query | Non-student selects Education Loan | Explains "Education Loan requires formal college/university admission offer"; recommends vocational skill loan alternatives | Clear step-by-step guidance |

</frozen-after-approval>

## Code Map

- `src/types/index.ts` -- Extend `SchemeMatch` with `alternativeSchemeIds`, `remedialAdvice`, and `gapBreakdown`.
- `src/services/matchingEngine.ts` & `functions/src/engine/rules.ts` -- Enhance rule engine to attach tailored alternative scheme suggestions and remedial advice to non-eligible matches.
- `src/components/results/WhyThisSchemeCard.tsx` -- Component rendering positive qualification highlights and match criteria breakdown.
- `src/components/results/WhyNotSchemeCard.tsx` -- Component rendering specific constraint failures, remedial advice, and clickable alternative scheme recommendation cards.
- `src/pages/Results.tsx` -- Enhanced results view with tabs for "Top Recommendations" and "Other Schemes (With Gap Explanations)", share results CTA, and restart assessment trigger.
- `src/i18n/en.json` & `src/i18n/hi.json` -- Localization strings for gap explanations, alternative suggestions, and remedial guidance.

## Tasks & Acceptance

**Execution:**
- [x] `src/types/index.ts` -- Add `SchemeAlternative` and update `SchemeMatch` type.
- [x] `src/services/matchingEngine.ts` & `functions/src/engine/rules.ts` -- Implement alternative scheme pairing logic and remedial advice generator.
- [x] `src/components/results/WhyThisSchemeCard.tsx` -- Build positive explainability highlight component.
- [x] `src/components/results/WhyNotSchemeCard.tsx` -- Build gap diagnostic component with alternative scheme links.
- [x] `src/pages/Results.tsx` -- Build tabbed view separating eligible recommendations from gap-analyzed schemes with quick filter toggles.
- [x] `src/i18n/en.json` & `src/i18n/hi.json` -- Add complete English and Hindi translations for all explainability terms.

**Acceptance Criteria:**
- Given a disqualified scheme, the user sees the exact failing criteria and at least one recommended alternative scheme link.
- Given an eligible scheme, the user sees itemized positive matching factors.
- Given user interaction with an alternative scheme suggestion, clicking it navigates to that scheme's details or pre-fills comparison.

## Spec Change Log

_None._

## Design Notes

- Rose/Amber accent tints for non-matching constraint callouts, paired with friendly, non-judgmental guidance.
- One-click "Consider This Alternative" buttons leading to qualifying schemes.

## Verification

**Commands:**
- `npm run lint` -- expected: zero errors across `src/`
- `npm run build` -- expected: clean TypeScript compilation and Vite build with no type errors

## Suggested Review Order

**Explainable Matching Data Contract & Alternative Pairing**

- Data contracts for `SchemeAlternative`, `GapItem`, and updated `SchemeMatch`.
  [`types/index.ts:208`](../../src/types/index.ts#L208)
  [`types.ts:21`](../../functions/src/types.ts#L21)

- Deterministic client-side gap diagnostics and tailored alternative recommendation generator.
  [`matchingEngine.ts:232`](../../src/services/matchingEngine.ts#L232)

- Backend Cloud Function rule engine mirror with identical gap breakdown and alternative suggestions.
  [`rules.ts:346`](../../functions/src/engine/rules.ts#L346)

**Explainability Components**

- Positive qualification highlights card ("Why This Scheme?") with itemized check badges.
  [`WhyThisSchemeCard.tsx:1`](../../src/components/results/WhyThisSchemeCard.tsx#L1)

- Gap diagnostic card ("Why Not This Scheme?") with numerical constraint failures, remedial advice, and clickable alternative scheme cards.
  [`WhyNotSchemeCard.tsx:1`](../../src/components/results/WhyNotSchemeCard.tsx#L1)

**Results View & Localization**

- Results page with dual-tabbed layout ("Recommended Schemes" vs "Other Schemes & Gap Analysis"), Share Results CTA, restart trigger, and comparison support.
  [`Results.tsx:35`](../../src/pages/Results.tsx#L35)

- Bilingual English and Hindi localization for all gap explanations, alternative suggestions, and remedial guidance copy.
  [`en.json:165`](../../src/i18n/en.json#L165)
  [`hi.json:165`](../../src/i18n/hi.json#L165)
