## Context

The recommendation engine currently has a critical flaw: schemes with incomplete data (empty fields) pass eligibility checks for ALL users and get perfect scores. This causes the same schemes to appear repeatedly for every user profile, regardless of state, gender, disability, occupation, or purpose.

**Current State:**
- 1819 schemes loaded from JSON files
- ~20% have empty states (358 schemes)
- ~24% have empty occupations (442 schemes)
- ~18% have empty purposes (319 schemes)
- ~86% have empty gender (1559 schemes)
- ~87% have empty disability (1576 schemes)
- ~83% have empty income (1513 schemes)
- ~75% have empty age (1372 schemes)

**Current Logic (PROBLEMATIC):**
- Eligibility: Empty field → SKIP check → PASS for all users
- Scoring: Empty field → 1.0 (perfect score)
- Result: Schemes with most empty fields rank highest for everyone

## Goals / Non-Goals

**Goals:**
1. State-specific schemes ONLY appear for users in that state (or ALL India)
2. Gender-specific schemes ONLY match users of that gender
3. Disability-specific schemes ONLY match users with that disability status
4. Schemes with incomplete data (empty key fields) rank lower or are excluded
5. User confidence reflects actual field matching, not skipped fields
6. Top 10 results are truly personalized to user profile

**Non-Goals:**
- Modify scheme data enrichment pipeline (separate concern)
- Add new scheme data fields
- Change the 8-step wizard UI
- Modify Firebase/Cloud Functions integration

## Decisions

### Decision 1: Eligibility - Require Minimum Data
**Choice:** Schemes MUST have data in key fields to be eligible. If a scheme has empty states, it's not eligible for any user.

**Rationale:** This ensures users only see schemes that are actually relevant to them. A scheme without state information cannot be verified as available in the user's state.

**Implementation:**
- Add `hasMinimumData(rules)` check before eligibility evaluation
- Key fields required: `states`, `categories`, `purposes` (at least one must have data)
- If minimum data not met → scheme is `eligible: false` with reason `insufficient_data`

### Decision 2: Scoring - Penalize Empty Fields
**Choice:** When a scheme field is empty, give a LOW score (0.1-0.3) instead of 1.0. This pushes incomplete schemes down in rankings.

**Rationale:** Some schemes may have partial data and still be somewhat relevant. Penalizing instead of excluding allows them to appear as lower-confidence matches.

**Scoring Values:**
| Field | Empty Score | Has Data + Match | Has Data + No Match |
|-------|-------------|------------------|---------------------|
| state | 0.1 | 1.0 | 0.0 |
| category | 0.2 | 1.0 | 0.3 |
| occupation | 0.2 | 1.0 | 0.3 |
| purpose | 0.2 | 1.0 | 0.3 |
| gender | 0.3 | 1.0 | 0.0 |
| disability | 0.3 | 1.0 | 0.0 |
| income | 0.5 | 1.0/0.8/0.3/0.0 | N/A |
| age | 0.5 | 1.0/0.5/0.0 | N/A |

### Decision 3: State Filtering Logic
**Choice:** 
- If scheme has `states: ["ALL"]` → available everywhere
- If scheme has specific states → ONLY available in those states
- If scheme has empty `states` → NOT eligible (per Decision 1)

**Rationale:** This matches real-world scheme availability. Empty states means "we don't know where this is available", not "available everywhere".

### Decision 4: Confidence Calculation
**Choice:** Confidence = (matched fields with data) / (total fields with data in scheme). Skip fields that are empty in BOTH scheme and user input.

**Rationale:** Current confidence calculation counts empty scheme fields as "matched", inflating confidence. New calculation only counts fields that actually exist in the scheme.

## Risks / Trade-offs

| Risk | Impact | Mitigation |
|------|--------|------------|
| Fewer eligible schemes | Users see fewer results | Show "No exact matches" with partial matches as alternatives |
| Breaking existing tests | Test failures | Update test expectations to match new behavior |
| Performance | Slight overhead for data completeness check | Negligible - O(1) per scheme |
| Data quality dependency | Results depend on enrichment quality | Document that enrichment must populate key fields |

## Migration Plan

1. Update eligibility.ts with minimum data check and fixed state logic
2. Update scoring.ts with empty field penalties
3. Update engine.ts confidence calculation
4. Test with various user profiles
5. Verify no regression in existing functionality