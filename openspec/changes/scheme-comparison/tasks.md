## 1. Types & State

- [x] 1.1 Define `ComparisonSelection` type and max selection constant (4) in `src/types/index.ts` or a new `src/types/comparison.ts`
- [x] 1.2 Create a React context or Zustand store `comparisonStore` for session-held comparison selection state
- [x] 1.3 Implement add/remove/clear functions with guard against exceeding 4-scheme limit

## 2. Comparison Bar Component

- [x] 2.1 Build `ComparisonBar` component: persistent bottom/toolbar showing selected scheme count and thumbnail chips
- [x] 2.2 Show "Compare (N/4)" CTA button enabled when 2+ schemes selected
- [x] 2.3 Add remove action (X icon) on each scheme chip in the bar
- [x] 2.4 Render bar only when at least 1 scheme is selected

## 3. Add to Comparison Action

- [x] 3.1 Add "Compare" toggle/checkbox action on `RecommendationCard` component in results page
- [x] 3.2 Add "Compare" toggle/checkbox action on scheme cards in scheme explorer
- [x] 3.3 Visual feedback: toggle checked state reflects current comparison selection
- [x] 3.4 Disable toggle and show tooltip when 4-scheme limit is reached

## 4. Comparison Table

- [x] 4.1 Build `ComparisonTable` component accepting array of 2-4 schemes as props
- [x] 4.2 Render side-by-side columns for: purpose, eligibility, max assistance, interest rate, repayment tenure, moratorium, own contribution, required documents, partner availability, match score
- [x] 4.3 Use existing `Table` UI component from `src/components/ui/table.tsx`
- [x] 4.4 Handle missing data gracefully with "N/A" or dashes for fields not present on a scheme
- [x] 4.5 Highlight differences between compared schemes with visual differentiation (color/bold)

## 5. Comparison Page/View

- [x] 5.1 Create `src/pages/Compare.tsx` (or modal component) rendering the comparison table
- [x] 5.2 Route at `/compare` registered in `src/App.tsx`
- [x] 5.3 Show empty state when fewer than 2 schemes are selected with guidance to add schemes
- [x] 5.4 Provide "Add/Remove schemes" action to return to selection or modify from the comparison view

## 6. Responsive Design

- [x] 6.1 Desktop: full grid layout with all schemes visible side-by-side
- [x] 6.2 Mobile: horizontal scroll with sticky first column (scheme name) for readability
- [x] 6.3 Test responsive behavior at common breakpoints (sm, md, lg)

## 7. i18n

- [x] 7.1 Add translation keys for all comparison dimension labels, empty states, and CTA text in English and Hindi
- [x] 7.2 All user-facing strings use `useTranslation` / `t()`

## 8. Testing

- [x] 8.1 Unit test comparison store: add, remove, limit enforcement, clear
- [x] 8.2 Unit test comparison table rendering with 2, 3, and 4 schemes including missing data
- [x] 8.3 Integration test: select schemes from results, navigate to compare, verify table renders correctly
