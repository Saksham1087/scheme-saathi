## Context

Beneficiaries need to understand potential repayment before committing to a scheme. The EMI calculator is P0 and a core part of the "Understand → Calculate" journey. It must be scheme-aware — auto-loading parameters from a selected scheme so users don't have to manually enter values. This is a standalone feature at `/calculator` that also integrates with scheme detail pages.

## Goals / Non-Goals

**Goals:**
- Provide a standalone EMI calculator at `/calculator`
- Accept inputs: loan amount, interest rate, tenure (months), moratorium period
- Display outputs: monthly EMI, total principal, total interest, total repayment
- Use the standard EMI formula: P × r × (1+r)^n / [(1+r)^n − 1]
- Support scheme-aware mode: auto-populate from scheme parameters via "Calculate My EMI" CTA
- Include visual disclaimer: "This is an illustrative calculation"
- Save calculation history to user profile
- Provide responsive slider/input UX for all inputs

**Non-Goals:**
- Moratorium-specific calculations (covered in `moratorium-calculator` change)
- Tax implications of loan repayment
- Comparison of EMI across schemes (covered in `scheme-comparison`)
- Loan application or pre-approval flows

## Decisions

- Standard EMI formula is used; no complex amortization scheduling in v1
- Moratorium period input is accepted but detailed moratorium logic is delegated to the `moratorium-calculator` change
- Scheme-aware mode passes scheme parameters (loan range, interest rate, tenure) to auto-fill the calculator
- Disclaimer is mandatory and always visible — prevents users from treating calculations as guarantees
- Calculation history is persisted to Firebase user profile for logged-in users
- Slider and input are dual-mode: user can use either a slider or type exact values
- Visual breakdown uses a simple bar or pie chart (principal vs interest) — no complex amortization schedule visualization in v1

## Risks / Trade-offs

- **EMI formula simplicity**: Standard formula doesn't account for varying interest rates or prepayment; acceptable for illustrative calculator
- **Moratorium integration**: Moratorium period affects total repayment but detailed logic lives in a separate change; the EMI calculator passes the period through without recomputing
- **Auto-population from scheme**: Scheme parameters may be ranges (e.g., loan ₹1L–₹10L); auto-fill uses the maximum or typical value, requiring user adjustment
- **Chart complexity**: Visual breakdown adds rendering dependencies; kept simple (bar/pie) rather than full amortization chart
