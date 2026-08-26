## 1. Eligibility Engine Updates

- [x] 1.1 Add `hasMinimumData()` function to check if scheme has data in states, categories, or purposes
- [x] 1.2 Modify `checkAllFields()` to return ineligible with "insufficient_data" reason when minimum data not met
- [x] 1.3 Update state check logic: empty states → ineligible (not skip); "ALL" states → pass for all; specific states → match only those
- [x] 1.4 Update gender check logic: scheme with gender specified → exact match required; no gender → pass all
- [x] 1.5 Update disability check logic: scheme with disabilityRequired specified → exact match required; no restriction → pass all
- [x] 1.6 Update `countRuleFields()` to only count fields that exist in scheme data (exclude empty fields from total)

## 2. Scoring Engine Updates

- [x] 2.1 Update `scoreLocation()`: empty states → 0.1 penalty; "ALL" states → 1.0; specific states match → 1.0; mismatch → 0.0
- [x] 2.2 Update `scoreCategory()`: empty categories → 0.2 penalty; match → 1.0; mismatch → 0.3
- [x] 2.3 Update `scorePurpose()`: empty purposes → 0.2 penalty; match → 1.0; mismatch → 0.2
- [x] 2.4 Add `scoreGender()`: empty gender → 0.3 penalty; match → 1.0; mismatch → 0.0
- [x] 2.5 Add `scoreDisability()`: empty disability → 0.3 penalty; match → 1.0; mismatch → 0.0
- [x] 2.6 Update `scoreIncome()`: empty income → 0.5 penalty; existing logic for has data
- [x] 2.7 Update `scoreAge()`: empty age → 0.5 penalty; existing logic for has data

## 3. Recommendation Engine Updates

- [x] 3.1 Update `runRecommendation()` to filter out ineligible schemes early (before scoring)
- [x] 3.2 Update confidence calculation in `checkEligibility()` to use only fields with data in scheme
- [x] 3.3 Ensure sorting still works: eligible first, then by matchScore descending

## 4. Configuration Updates

- [x] 4.1 Update `SCORE_WEIGHTS` in config.ts to include gender (0.06) and disability (0.06) weights
- [x] 4.2 Verify weight totals sum to 1.0

## 5. Testing & Verification

- [x] 5.1 Test with user profile: General category, Gujarat state, Male, No disability, Student, Agri purpose
- [x] 5.2 Test with user profile: SC category, Maharashtra state, Female, Disabled, Farmer, Agriculture purpose
- [x] 5.3 Test with user profile: OBC category, Delhi state, Male, No disability, Salaried, Manufacturing purpose
- [x] 5.4 Verify state-specific schemes only appear for correct state
- [x] 5.5 Verify gender-specific schemes only appear for correct gender
- [x] 5.6 Verify disability-specific schemes only appear for correct disability status
- [x] 5.7 Verify schemes with empty key fields are ranked lower or excluded
- [x] 5.8 Run TypeScript compilation check: `npx tsc -b --noEmit`
- [x] 5.9 Test in browser with dev server