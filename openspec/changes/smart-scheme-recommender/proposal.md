## Why

The core value of Scheme Sathi is intelligent scheme matching. Users describe their situation, and the system returns ranked scheme recommendations with explainable matching. This is the primary differentiator — "don't just tell which schemes exist, tell which may fit."

## What Changes

- 6-8 question conversational assessment flow (Mode A: form, Mode B: conversational)
- Rule-based eligibility engine checking income, age, category, state, occupation, education, purpose
- Suitability scoring with weighted factors (income 20%, category 20%, purpose 20%, loan amount 20%, age 10%, location 10%)
- Ranked scheme recommendations (5-10 results)
- Explainable matching: "Why was this recommended?" with checkmark reasons
- "Why not this scheme?" rejection reasons with alternatives
- Match score display as "Indicative matching score" (never as approval)
- Assessment history saved to user profile
- Scheme recommendation cards with all PRD fields

## Capabilities

### New Capabilities
- `assessment-flow`: Multi-step questionnaire with progress indicator, form and conversational modes
- `eligibility-engine`: Rule-based eligibility checking against scheme eligibility rules
- `suitability-scoring`: Weighted scoring algorithm combining income, category, purpose, loan, age, location matches
- `explainable-matching`: Human-readable reasons for recommendations and rejections
- `scheme-ranking`: Sort and rank schemes by suitability score, display top results
- `no-match-alternatives`: When no schemes match, provide explanation and alternative suggestions

### Modified Capabilities

(none)

## Impact

- New `src/pages/Recommend.tsx`
- New `src/services/recommendation/` directory with engine, scoring, explanation modules
- New components: QuestionStep, ProgressIndicator, RecommendationCard, MatchScore, EligibilityBadge
- Depends on: `scheme-data-model`, `firebase-architecture`
