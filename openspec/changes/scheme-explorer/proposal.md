## Why

Users need to browse and discover schemes independently, not just through the recommender. The scheme explorer provides search, filtering, and detailed scheme information — enabling users who already know what they're looking for to find it quickly.

## What Changes

- Scheme listing page at `/schemes` with search and multi-faceted filters
- Scheme detail page at `/schemes/:id` with comprehensive information sections
- Search by scheme name, ministry, or purpose
- Filters: category, state, income range, loan amount, purpose, education
- Sorting by relevance, match score, loan amount
- Scheme detail sections: overview, eligibility, financial assistance, interest rate, loan limits, moratorium, repayment, required documents, channel partners, application process, official source, last updated, disclaimer
- Scheme card component for listing view
- "Calculate My EMI" CTA linking to calculator
- "Find Partner" CTA linking to partner locator

## Capabilities

### New Capabilities
- `scheme-listing`: Paginated scheme listing with search, filters, sorting, and responsive card grid
- `scheme-detail`: Full scheme detail page with all PRD-specified sections
- `scheme-search`: Text search across scheme name, ministry, purpose, description
- `scheme-filters`: Multi-facet filtering by category, state, income, amount, purpose, education
- `scheme-card`: Reusable card component showing scheme summary with match score

### Modified Capabilities

(none)

## Impact

- New `src/pages/Schemes.tsx` and `src/pages/SchemeDetail.tsx`
- New components: SchemeCard, SchemeFilter, SchemeSearch, SchemeDetailSection
- Route additions: `/schemes`, `/schemes/:id`
- Depends on: `scheme-data-model`, `firebase-architecture`
