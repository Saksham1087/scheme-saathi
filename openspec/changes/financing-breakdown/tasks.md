## 1. Setup & Data Layer

- [x] 1.1 Create `src/services/calculator/financing.ts` with financing calculation logic (total cost, scheme finance, own contribution)
- [x] 1.2 Implement percentage-to-absolute-value conversion from scheme rule data + user project cost input
- [x] 1.3 Round calculations to nearest rupee and tag results as "approximate"
- [x] 1.4 Handle missing scheme financing rules — return "Not specified in scheme data" for unavailable fields

## 2. UI Components

- [x] 2.1 Create `FinancingBreakdown` component rendering textual breakdown (total cost, scheme finance, own contribution)
- [x] 2.2 Create `FinancingVisual` component with bar chart as primary visualization
- [x] 2.3 Add table fallback/alternative view for financing split
- [x] 2.4 Implement disclaimer component — label values as "illustrative" (calculated) vs "official" (fixed-value scheme data), including source attribution
- [x] 2.5 Style components to match existing scheme detail page design

## 3. Integration

- [x] 3.1 Integrate FinancingBreakdown into the scheme detail page
- [x] 3.2 Integrate FinancingBreakdown into the calculator page
- [x] 3.3 Read project cost from project-cost-planner context and pass to financing service
- [x] 3.4 Add "Financing Breakdown" section/tab navigation within scheme detail

## 4. Testing & Polish

- [x] 4.1 Test with schemes that have percentage-based coverage rules
- [x] 4.2 Test with schemes that have fixed-value coverage rules
- [x] 4.3 Test with schemes that have missing/incomplete financing rules
- [x] 4.4 Verify disclaimer rendering for both illustrative and official values
- [x] 4.5 Test bar chart and table view rendering with various cost ranges
