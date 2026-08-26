## 1. Calculator Service

- [x] 1.1 Create `src/services/calculator/emi.ts` with `computeEMI(principal, annualRatePct, tenureMonths)` function implementing the standard EMI formula
- [x] 1.2 Return structured result: monthly EMI, total principal, total interest, total repayment
- [x] 1.3 Add input validation: principal > 0, rate > 0, tenure > 0
- [x] 1.4 Integrate with existing `computeLoan` in `src/lib/emi.ts` or refactor to use the new service

## 2. Calculator Store

- [x] 2.1 Review and extend existing `src/stores/calculatorStore.ts` to support scheme-aware mode
- [x] 2.2 Add `schemeId` and `schemeParams` state fields for auto-population from scheme data
- [x] 2.3 Add `reset()` action to clear all inputs back to defaults
- [x] 2.4 Persist calculator history to Firebase user profile for logged-in users

## 3. EMICalculator Component

- [x] 3.1 Build standalone `EMICalculator` component with input controls: loan amount, interest rate, tenure (months), moratorium period
- [x] 3.2 Implement slider + numeric input dual-mode for each parameter (reuse `SliderRow` pattern from existing `CalculatorPage`)
- [x] 3.3 Display outputs: monthly EMI (prominent), total principal, total interest, total repayment
- [x] 3.4 Add mandatory disclaimer: "This is an illustrative calculation" using `InfoNote` component

## 4. Visual Breakdown

- [x] 4.1 Add a bar or pie chart component showing principal vs interest proportion of total repayment
- [x] 4.2 Keep visualization simple — no full amortization schedule chart in v1
- [x] 4.3 Ensure chart updates reactively as inputs change

## 5. Scheme-Aware Mode

- [x] 5.1 Implement `SchemeAwareCalculator` wrapper that accepts scheme parameters (loan range, interest rate, tenure, moratorium) as props
- [x] 5.2 Auto-populate calculator inputs from scheme parameters on mount
- [x] 5.3 For range values (e.g., loan ₹1L–₹10L), auto-fill with maximum or typical value
- [x] 5.4 Show "Calculating for: [Scheme Name]" banner when in scheme-aware mode (reuse existing pattern from `CalculatorPage.tsx`)
- [x] 5.5 Implement "Calculate My EMI" CTA handler that navigates to calculator with scheme params via URL query or store

## 6. Moratorium Input (Basic)

- [x] 6.1 Add moratorium period slider/input (0–12 months) accepting period value
- [x] 6.2 Pass moratorium period through to `computeLoan` for schedule generation
- [x] 6.3 Detailed moratorium interest logic delegated to moratorium-calculator change; this change only passes the value

## 7. Route & Page

- [x] 7.1 Update `/calculator` route in `src/App.tsx` to use refactored `EMICalculator` or keep existing `CalculatorPage.tsx`
- [x] 7.2 Ensure backward compatibility: existing calculator behavior is preserved or improved

## 8. i18n

- [x] 8.1 Add English and Hindi translation keys for all input labels, output labels, disclaimer text, and scheme-aware mode banner
- [x] 8.2 Ensure all strings use `useTranslation` / `t()`

## 9. Testing

- [x] 9.1 Unit test EMI formula with known values (verify against hand-calculated results)
- [x] 9.2 Unit test input validation: boundary values, zero, negative inputs
- [x] 9.3 Unit test scheme-aware auto-population with mock scheme parameters
- [x] 9.4 Integration test: render calculator, adjust sliders, verify outputs update correctly
