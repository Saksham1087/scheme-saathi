## 1. Types & Data Model

- [x] 1.1 Extend `src/types/index.ts` with assessment types: `AssessmentInput`, `EligibilityResult`, `SuitabilityScore`, `RecommendationResult`, `Explanation`
- [x] 1.2 Define score weight constants (income 20%, category 20%, purpose 20%, loan 20%, age 10%, location 10%) in a config file under `src/services/recommendation/`
- [x] 1.3 Add assessment history type to user profile types for Firebase persistence

## 2. Eligibility Engine

- [x] 2.1 Create `src/services/recommendation/eligibility.ts` with rule-based eligibility checking against scheme eligibility rules
- [x] 2.2 Implement per-field checks: income ceiling, age range, category match, state match, occupation, education, project purpose
- [x] 2.3 Return `EligibilityResult` per scheme with pass/fail per rule and aggregate eligible boolean

## 3. Suitability Scoring

- [x] 3.1 Create `src/services/recommendation/scoring.ts` with weighted suitability scoring algorithm
- [x] 3.2 Implement individual scoring functions for each dimension: income match, category match, purpose match, loan amount fit, age fit, location fit
- [x] 3.3 Combine scores with configurable weights and return normalized 0-100 score per scheme

## 4. Explanation Generation

- [x] 4.1 Create `src/services/recommendation/explanation.ts` for human-readable explanation generation
- [x] 4.2 Define pre-defined explanation text maps for acceptance reasons (e.g., "Income within ceiling", "Category eligible")
- [x] 4.3 Define pre-defined rejection reason text maps with alternative suggestions
- [x] 4.4 Return arrays of `Explanation` objects per scheme for both matched and unmatched results

## 5. Recommendation Orchestrator

- [x] 5.1 Create `src/services/recommendation/engine.ts` orchestrating eligibility → scoring → explanation pipeline
- [x] 5.2 Filter schemes by eligibility, score remainder, sort by suitability descending, return top 5-10 ranked results
- [x] 5.3 Implement no-match handler: when zero eligible schemes, return relaxed-criteria alternatives with explanation
- [x] 5.4 Ensure match scores are labeled "Indicative matching score" in all outputs, never as approval

## 6. Assessment Flow (UI)

- [x] 6.1 Create `src/pages/Recommend.tsx` with multi-step stepper/progress pattern (6-8 questions)
- [x] 6.2 Build `QuestionStep` component rendering form inputs per step (income slider, category radio, state select, occupation, education, purpose, loan amount)
- [x] 6.3 Build `ProgressIndicator` component showing current step and total
- [x] 6.4 Implement form validation per step and collect `AssessmentInput` on completion
- [x] 6.5 Add conversational mode toggle (progressive enhancement) — same data, conversational UX wrapper

## 7. Recommendation Results (UI)

- [x] 7.1 Build `RecommendationCard` component displaying scheme name, type, suggested amount, coverage %, and indicative match score
- [x] 7.2 Build `MatchScore` component rendering score as a visual bar or badge with "Indicative matching score" label
- [x] 7.3 Build `EligibilityBadge` component showing eligible/not-eligible status with color coding
- [x] 7.4 Display per-scheme explanations: green checkmarks for "Why was this recommended?" and red crosses for rejection reasons
- [x] 7.5 Handle no-match state: show explanation card with alternative suggestions

## 8. Integration & Routing

- [x] 8.1 Add `/recommend` route in `src/App.tsx`
- [x] 8.2 Link "Don't know your project cost?" to project cost planner (integration point with that change)
- [x] 8.3 Save assessment history to Firebase user profile on completion for logged-in users
- [x] 8.4 Add "Calculate My EMI" CTA on recommendation cards linking to calculator with scheme parameters

## 9. i18n

- [x] 9.1 Add English and Hindi translation keys for all assessment questions, explanations, result labels, and no-match messages
- [x] 9.2 Ensure all user-facing strings use `useTranslation` / `t()` function

## 10. Testing

- [x] 10.1 Unit test eligibility engine with mock scheme data covering pass/fail edge cases
- [x] 10.2 Unit test scoring algorithm with known inputs verifying expected rank ordering
- [x] 10.3 Unit test explanation generation for both acceptance and rejection paths
- [x] 10.4 Integration test: render assessment flow, fill inputs, verify recommendation results display
