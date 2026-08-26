## 1. Moratorium Service

- [x] 1.1 Create `src/services/calculator/moratorium.ts` with moratorium calculation functions
- [x] 1.2 Implement `computeMoratoriumImpact(params)`: calculate repayment start date, total moratorium interest (if applicable), adjusted EMI
- [x] 1.3 Handle two modes: interest-free moratorium (principal unchanged) and interest-accruing moratorium (interest capitalized to principal)
- [x] 1.4 Return structured result: moratorium duration, repayment start month, interest during moratorium, adjusted principal, adjusted EMI

## 2. Per-Scheme Moratorium Rules

- [x] 2.1 Define moratorium rule interface for per-scheme configuration (duration, interest accrual, any special conditions)
- [x] 2.2 Ensure scheme data model includes moratorium rules (extend `Scheme` type if needed beyond existing `moratorium` field)
- [x] 2.3 Implement rule application function that reads scheme-specific moratorium config and passes to calculator

## 3. MoratoriumTimeline Component

- [x] 3.1 Build `MoratoriumTimeline` component: simple linear visual timeline showing moratorium phase and repayment phase
- [x] 3.2 Display key milestones: loan start, moratorium end, repayment start, final repayment date
- [x] 3.3 Use distinct visual styling for moratorium phase (e.g., lighter color) vs repayment phase (e.g., primary color)
- [x] 3.4 Keep timeline simple — no complex Gantt or multi-branch visualization

## 4. MoratoriumDisplay Component

- [x] 4.1 Build `MoratoriumDisplay` component showing: moratorium duration, when repayment begins, impact on total cost
- [x] 4.2 Clearly distinguish "Interest-free moratorium" vs "Interest-accruing moratorium" with labels and explanation
- [x] 4.3 Show dollar-amount impact: "During moratorium, ₹X in interest accrues" or "No interest during moratorium"

## 5. Integration with EMI Calculator

- [x] 5.1 Extend `EMICalculator` component to automatically trigger moratorium-specific calculations when moratorium period > 0
- [x] 5.2 Render `MoratoriumTimeline` and `MoratoriumDisplay` below the main EMI results when moratorium is active
- [x] 5.3 Pass per-scheme moratorium rules from scheme data into the calculator when in scheme-aware mode
- [x] 5.4 Update total repayment display to include moratorium interest when applicable

## 6. i18n

- [x] 6.1 Add translation keys for moratorium labels, phase names, interest explanations, and timeline milestones in English and Hindi
- [x] 6.2 Ensure all user-facing strings use `useTranslation` / `t()`

## 7. Testing

- [x] 7.1 Unit test interest-free moratorium: verify principal unchanged, EMI recalculated over shorter repayment period
- [x] 7.2 Unit test interest-accruing moratorium: verify interest capitalized, EMI recalculated over adjusted principal
- [x] 7.3 Unit test per-scheme rule application with mock scheme data
- [x] 7.4 Integration test: set moratorium period in calculator, verify timeline and display render correctly
- [x] 7.5 Edge case: moratorium period equals 0 — verify moratorium components are not rendered
