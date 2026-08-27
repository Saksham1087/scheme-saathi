## Why

Beneficiaries need to understand potential repayment before committing to a scheme. The EMI calculator is P0 and a core part of the "Understand → Calculate" journey. It must be scheme-aware — auto-loading parameters from a selected scheme.

## What Changes

- Standalone EMI calculator at `/calculator`
- Inputs: loan amount, interest rate, tenure (months), moratorium period
- Outputs: monthly EMI, total principal, total interest, total repayment
- EMI formula: P × r × (1+r)^n / [(1+r)^n − 1]
- Scheme-aware mode: auto-populate from scheme page with "Calculate My EMI" CTA
- Visual disclaimer: "This is an illustrative calculation"
- Calculation history saved to user profile
- Responsive slider/input UX

## Capabilities

### New Capabilities
- `emi-calculator`: EMI calculation with standard formula, input validation, output display
- `scheme-aware-emi`: Auto-populate calculator from scheme parameters (loan amount, interest, tenure, moratorium)
- `emi-visualization`: Visual breakdown of principal vs interest over time

### Modified Capabilities

(none)

## Impact

- New `src/pages/Calculator.tsx`
- New `src/services/calculator/emi.ts`
- New components: EMICalculator, EMIDisplay, SchemeAwareCalculator
- Route: `/calculator`
- Depends on: `scheme-data-model`
