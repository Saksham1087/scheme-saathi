## Why

The recommendation engine shows the same schemes repeatedly for ALL users regardless of their profile (state, gender, disability, occupation, purpose). Root cause: when scheme data has EMPTY fields (states, occupations, purposes, gender, disability, income, age), the eligibility check SKIPS those fields entirely, making the scheme pass for ALL users. Additionally, the scoring function rewards empty fields with perfect scores (1.0), causing schemes with the most incomplete data to rank highest. This defeats the purpose of personalized scheme matching.

## What Changes

- **Approach 1 - Penalize Empty Fields in Scoring**: Modify scoring functions to give LOW scores (not 1.0) when scheme data fields are empty, so schemes with incomplete data rank lower
- **Approach 2 - Require Minimum Data for Eligibility**: Schemes must have data in key fields (states, categories, purposes) to be eligible. If a scheme has empty states, it's not eligible for any user
- **Fix State Filtering**: Ensure state-specific schemes only appear for users in that state (and ALL India schemes)
- **Fix Gender/Disability Filtering**: Ensure gender-specific and disability-specific schemes only match users with those attributes
- **Update Eligibility Confidence**: Recalculate confidence to reflect actual field matching vs. skipped fields

## Capabilities

### New Capabilities
- `recommendation-accuracy`: Core logic for accurate scheme filtering based on complete user profile matching

### Modified Capabilities
- `smart-scheme-recommender`: The existing recommender's eligibility and scoring requirements are changing - it now requires minimum data completeness and penalizes empty fields

## Impact

**Affected Files:**
- `src/services/recommendation/eligibility.ts` - Core eligibility checking logic
- `src/services/recommendation/scoring.ts` - Scoring algorithm
- `src/services/recommendation/engine.ts` - Recommendation engine that combines eligibility and scoring
- `src/services/recommendation/config.ts` - Score weights (may need adjustment)
- `src/types/scheme.ts` - May need new types for data completeness tracking

**Data Impact:**
- 1819 schemes loaded from JSON files
- ~20% have empty states (358 schemes)
- ~24% have empty occupations (442 schemes)
- ~18% have empty purposes (319 schemes)
- ~86% have empty gender (1559 schemes)
- ~87% have empty disability (1576 schemes)