## 1. Routing & Page Setup

- [x] 1.1 Add `/schemes` route to React Router for listing page
- [x] 1.2 Add `/schemes/:slug` route for scheme detail page
- [x] 1.3 Create `src/pages/Schemes.tsx` listing page component
- [x] 1.4 Create `src/pages/SchemeDetail.tsx` detail page component

## 2. SchemeCard Component

- [x] 2.1 Create `src/components/SchemeCard.tsx` with scheme name, ministry, category badge, brief description
- [x] 2.2 Display loan amount range on the card
- [x] 2.3 Add optional match score indicator
- [x] 2.4 Make card clickable, linking to `/schemes/:slug`
- [x] 2.5 Style card for mobile and desktop responsive grid
- [x] 2.6 Extract all card strings to translation keys (`schemes.card.*`)

## 3. Search & Filter Components

- [x] 3.1 Create `src/components/SchemeSearch.tsx` text input for searching by name, ministry, purpose
- [x] 3.2 Create `src/components/SchemeFilter.tsx` with filter controls for category, state, income range, loan amount, purpose, education
- [x] 3.3 Implement filter state management via URL query parameters for shareability
- [x] 3.4 Read filter state from URL on page load and apply to queries
- [x] 3.5 Create mobile-friendly filter UI (slide-out panel or bottom sheet)
- [x] 3.6 Add "Clear Filters" button to reset all filters
- [x] 3.7 Extract all filter/search strings to translation keys (`schemes.filter.*`, `schemes.search.*`)

## 4. Scheme Listing Page

- [x] 4.1 Fetch schemes from Firestore with structured `where` clauses for active filters
- [x] 4.2 Implement text search using Firestore range queries (`>=` / `<=`) on lowercased name
- [x] 4.3 Implement sort options: relevance, match score, loan amount
- [x] 4.4 Implement cursor-based pagination with "Load More" button
- [x] 4.5 Display scheme count and active filter summary
- [x] 4.6 Handle empty state when no schemes match filters
- [x] 4.7 Handle loading state with skeleton cards
- [x] 4.8 Render scheme cards in a responsive grid layout

## 5. Scheme Detail Page

- [x] 5.1 Fetch scheme by slug from Firestore
- [x] 5.2 Create collapsible section components for detail page
- [x] 5.3 Implement Overview section (name, ministry, description, category)
- [x] 5.4 Implement Eligibility section (display all active eligibility rules)
- [x] 5.5 Implement Financial Assistance section (loan amount, interest rate, subsidy)
- [x] 5.6 Implement Documents section (list required documents with mandatory indicators)
- [x] 5.7 Implement Channel Partners section (list nearby partners if available)
- [x] 5.8 Implement Application Process section (step-by-step application guide)
- [x] 5.9 Implement Source & Trust section (official source URL, last updated, verification badge, disclaimer)
- [x] 5.10 Add "Calculate My EMI" CTA linking to EMI calculator
- [x] 5.11 Add "Find Partner" CTA linking to partner locator
- [x] 5.12 Handle 404 state for invalid/non-existent slugs
- [x] 5.13 Extract all detail page strings to translation keys (`schemes.detail.*`)

## 6. Integration & Polish

- [x] 6.1 Verify listing page integrates with Firebase Firestore service layer
- [x] 6.2 Verify detail page integrates with Firebase Firestore service layer
- [x] 6.3 Test filter + search + sort combination works correctly
- [x] 6.4 Test pagination loads more schemes without losing filter state
- [x] 6.5 Test back-button navigation preserves filter state via URL params
- [x] 6.6 Test mobile responsiveness of listing grid, filter panel, and detail sections
- [x] 6.7 Verify all interactive elements are keyboard accessible
