---
title: 'Story 2.2: 100-Point Deterministic Eligibility & Scoring Engine'
type: 'feature'
created: '2026-08-28'
status: 'done'
baseline_commit: '086776c0f8fa55fa7eb3907c11fbf8ebf4b16223'
review_loop_iteration: 0
context:
  - '_bmad-output/implementation-artifacts/epic-2-context.md'
  - '_bmad-output/implementation-artifacts/spec-2-1-demographic-and-financial-intake-flow.md'
---

<frozen-after-approval reason="human-owned intent — do not modify unless human renegotiates">

## Intent

**Problem:** Existing public benefit portals rely on opaque rule sets or arbitrary binary filters that fail to explain why a beneficiary scored high on one scheme over another or how close they are to qualifying.

**Approach:** Implement a 100-point deterministic, explainable scoring engine that evaluates 6 weighted criteria (Income: 20 pts, Category: 20 pts, Purpose: 20 pts, Project Cost: 20 pts, Age: 10 pts, State/Location: 10 pts) with exact parity between Firebase Cloud Functions (`functions/src/engine/rules.ts`) and client-side offline execution (`src/services/matchingEngine.ts`), ensuring sub-50ms evaluations and mandatory "Indicative matching score" labeling.

## Boundaries & Constraints

**Always:**
- Strictly implement the 100-point deterministic weighting breakdown:
  - Income Ceiling Fit: 20 pts
  - Category / Caste Fit: 20 pts
  - Purpose / Sector Fit: 20 pts
  - Loan Amount / Project Cost Band: 20 pts
  - Age Bounds: 10 pts
  - Location / State Match: 10 pts
- Every recommendation badge and score metric must display the mandatory label "Indicative matching score" / "सांकेतिक मिलान स्कोर".
- Ensure 100% computational parity between backend Cloud Functions and client-side fallback engine.
- Calculate matches in < 50ms across the full catalog.

**Never:**
- Use non-deterministic AI or heuristic guessing for point calculation.
- Omit the indicative score disclaimer.

## I/O & Edge-Case Matrix

| Scenario | Input / State | Expected Output / Behavior | Error Handling |
|----------|--------------|---------------------------|----------------|
| Perfect Match Profile | SC applicant, Income ₹1.5L, Age 30, Maharashtra, Shop setup ₹1.2L | Micro-credit scheme scores 100/100 (20+20+20+20+10+10); ranked #1 | Returns all 6 category sub-scores |
| High Income Disqualification | Income ₹6.0L (> ₹5L ceiling) | Income sub-score = 0; overall score capped; eligible = false | Reasons clearly cite income ceiling exceedance |
| Education Scheme Evaluation | Student applicant with college course cost | Education scheme receives full 20 pts for purpose and education tier | Non-students get 0 pts for education specific schemes |

</frozen-after-approval>

## Code Map

- `src/types/index.ts` & `functions/src/types.ts` -- Define `ScoreBreakdown` (income: 20, category: 20, purpose: 20, cost: 20, age: 10, state: 10) and extend `MatchResultItem` with total score and breakdown.
- `functions/src/engine/rules.ts` -- Update Cloud Function deterministic scoring logic with full 100-point calculation.
- `src/services/matchingEngine.ts` -- Mirror 100-point algorithm client-side with sub-score breakdowns and offline support.
- `src/components/results/ScoreBreakdownCard.tsx` -- Component rendering the 100-point visual breakdown progress bars and indicative matching score badge.
- `src/pages/Results.tsx` -- Display top ranked schemes with score badges, sub-score breakdown drawer/popover, and criteria meters.
- `src/i18n/en.json` & `src/i18n/hi.json` -- Localization strings for score categories, indicative badge, and point labels.

## Tasks & Acceptance

**Execution:**
- [x] `src/types/index.ts` & `functions/src/types.ts` -- Add `ScoreBreakdown` interface and update `MatchResultItem`.
- [x] `functions/src/engine/rules.ts` -- Implement 100-point scoring algorithm with 6 sub-scores in Cloud Function.
- [x] `src/services/matchingEngine.ts` -- Implement 100-point scoring algorithm client-side with offline seed catalog fallback.
- [x] `src/components/results/ScoreBreakdownCard.tsx` -- Build accessible score breakdown visualizer component.
- [x] `src/pages/Results.tsx` -- Render ranked scheme recommendations with indicative score badges and 100-pt breakdown.
- [x] `src/i18n/en.json` & `src/i18n/hi.json` -- Add localized strings for all score labels.

**Acceptance Criteria:**
- Given a user profile, the engine computes match scores out of 100 with accurate itemized points.
- Given any displayed score badge, the mandatory text "Indicative matching score" is shown.
- Given an offline browser, the client-side engine computes identical scores in < 50ms.

## Spec Change Log

_None._

## Design Notes

- High-contrast circular or bar score indicators (e.g. 95/100) with color gradations (Emerald for 80+, Blue for 60-79, Amber for <60).
- Itemized point inspectability for full user trust and explainability.

## Verification

**Commands:**
- `npm run lint` -- expected: zero errors across `src/`
- `npm run build` -- expected: clean TypeScript compilation and Vite build with no type errors

## Suggested Review Order

**Deterministic 100-Point Scoring Engine & Rules Parity**

- Cloud Function deterministic 100-point scoring algorithm across 6 weighted dimensions.
  [`rules.ts:88`](../../functions/src/engine/rules.ts#L88)

- Client-side deterministic matching engine mirror with sub-millisecond offline execution.
  [`matchingEngine.ts:25`](../../src/services/matchingEngine.ts#L25)

**Score Visualizer & Results Display**

- Accessible 100-point score breakdown visualizer card with color gradations and criteria meters.
  [`ScoreBreakdownCard.tsx:20`](../../src/components/results/ScoreBreakdownCard.tsx#L20)

- Results page displaying ranked matching schemes with indicative score badges.
  [`Results.tsx:30`](../../src/pages/Results.tsx#L30)

**Types & Bilingual Localization**

- Shared `ScoreBreakdown` interface and extended match item contracts.
  [`types/index.ts:180`](../../src/types/index.ts#L180)
  [`types.ts:12`](../../functions/src/types.ts#L12)

- English and Hindi localized criteria labels, point meters, and indicative badge copy.
  [`en.json:151`](../../src/i18n/en.json#L151)
  [`hi.json:151`](../../src/i18n/hi.json#L151)
