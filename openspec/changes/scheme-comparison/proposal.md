## Why

After receiving recommendations, users need to compare schemes side-by-side to make informed decisions. The PRD specifies comparing purpose, eligibility, assistance, interest, repayment, moratorium, documents, and match scores.

## What Changes

- Multi-scheme selection from recommendation results or scheme explorer
- Side-by-side comparison table
- Comparison dimensions: purpose, eligibility, max assistance, interest, repayment, moratorium, own contribution, required documents, partner availability, match score
- "Add to comparison" action on scheme cards
- Comparison persistence in session or user profile

## Capabilities

### New Capabilities
- `scheme-comparison`: Side-by-side comparison of 2-4 schemes across all PRD dimensions
- `comparison-selection`: Add/remove schemes from comparison via scheme cards
- `comparison-table`: Responsive comparison table with highlighted differences

### Modified Capabilities

(none)

## Impact

- New `src/pages/Compare.tsx` or modal component
- New components: SchemeComparison, ComparisonTable, ComparisonBar
- Route: `/compare` or overlay pattern
- Depends on: `scheme-data-model`
