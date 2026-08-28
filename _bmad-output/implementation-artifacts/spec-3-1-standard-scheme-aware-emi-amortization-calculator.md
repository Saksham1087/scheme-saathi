---
title: 'Story 3.1: Standard & Scheme-Aware EMI Amortization Calculator'
type: 'feature'
created: '2026-08-28'
status: 'done'
baseline_commit: 'd448212134594589d38ad9b3fe3b586ea53eb2bb'
review_loop_iteration: 0
context:
  - '_bmad-output/implementation-artifacts/epic-3-context.md'
  - '_bmad-output/planning-artifacts/architectures/architecture-scheme-saathi-2026-08-27/ARCHITECTURE-SPINE.md'
---

<frozen-after-approval reason="human-owned intent — do not modify unless human renegotiates">

## Intent

**Problem:** Beneficiaries considering micro-credit or term loans find standard commercial bank calculators misleading because they omit government concessional interest rates, scheme-specific tenure bounds, and year-by-year amortization visibility.

**Approach:** Implement an interactive, scheme-aware Reducing-Balance EMI Amortization Calculator at `/calculator` with fine-tuned dual slider/numerical controls for Loan Amount (₹10K to ₹50L+), Interest Rate (2% to 18%), and Tenure (6 to 120 months), immediate real-time calculations for monthly EMI, total interest paid, and total payment, automatic preset loading from scheme query parameters, and a collapsible annual/monthly amortization table with visual principal vs interest breakdown.

## Boundaries & Constraints

**Always:**
- Compute reducing-balance monthly EMI using statutory amortization formula:
  $$\text{EMI} = \frac{P \cdot r \cdot (1+r)^n}{(1+r)^n - 1}$$
- Automatically sync and populate inputs when navigated with query params (`amount`, `rate`, `tenure`, `moratorium`, `accrual`, `scheme`).
- Display a quick scheme preset picker allowing users to switch between standard schemes (e.g. Micro Credit Scheme 5%, Mahila Samriddhi 4%, Term Loan 6%, Education Loan 4%) in one click.
- Support 100% localization in English (`en`) and Hindi (`hi`).
- Maintain accessible WCAG AA touch targets (min 44x44px).

**Never:**
- Allow negative numbers or zero tenure in calculations.
- Reset user custom values without an explicit "Reset" action.

## I/O & Edge-Case Matrix

| Scenario | Input / State | Expected Output / Behavior | Error Handling |
|----------|--------------|---------------------------|----------------|
| Scheme Deep-link | Visit `/calculator?amount=120000&rate=5.0&tenure=36&scheme=Micro+Credit` | Pre-fills sliders with ₹1.2L, 5.0% p.a., 36 months; displays active banner "Loaded parameters for Micro Credit Scheme" | Gracefully falls back to default ₹5L / 9% if params missing |
| Zero Interest Calculation | Rate slider adjusted to 0% | Calculates clean $\text{EMI} = P / n$ with total interest = 0 | Avoids division by zero / NaN |
| Amortization Schedule View | User toggles "View Amortization Schedule" | Renders expandable year-by-year and monthly payment table with opening balance, EMI, principal, interest, and closing balance | Paginates or groups by year for high tenures |

</frozen-after-approval>

## Code Map

- `src/lib/emi.ts` -- Reducing balance formula, zero-interest guard, and annual/monthly schedule generator.
- `src/stores/calculatorStore.ts` -- Zustand store managing loan parameters, active scheme preset, and schedule expansion.
- `src/components/calculator/SchemePresetBar.tsx` -- Quick scheme preset pill selectors to switch parameters between national schemes in 1 tap.
- `src/components/calculator/AmortizationTable.tsx` -- Accessible, responsive table and progress bar displaying annual/monthly principal vs interest amortization breakdown.
- `src/pages/CalculatorPage.tsx` -- Redesigned `/calculator` page with interactive slider cards, metric tiles (Monthly EMI, Total Interest, Total Payable), preset loader, and print-to-PDF trigger.
- `src/i18n/en.json` & `src/i18n/hi.json` -- Localization strings for calculator controls, presets, summary metrics, and table headers.

## Tasks & Acceptance

**Execution:**
- [x] `src/lib/emi.ts` -- Verify and enhance amortization calculation with zero-rate guard and annual aggregation helper.
- [x] `src/components/calculator/SchemePresetBar.tsx` -- Build quick scheme selector pills with authentic interest rates and caps.
- [x] `src/components/calculator/AmortizationTable.tsx` -- Build annual & monthly schedule table with visual breakdown bars.
- [x] `src/pages/CalculatorPage.tsx` -- Enhance calculator page with responsive slider inputs, real-time KPI tiles, and URL preset sync.
- [x] `src/i18n/en.json` & `src/i18n/hi.json` -- Add localization strings for all calculator elements.

**Acceptance Criteria:**
- Given loan parameter adjustments, the monthly EMI, total interest, and schedule update synchronously.
- Given URL parameters from a scheme card, the calculator initializes with the scheme's concessional rate and maximum limits.
- Given "View Amortization Schedule", the user can inspect annual and monthly repayment breakdowns.

## Spec Change Log

_None._

## Design Notes

- Large, legible EMI KPI card with high contrast and currency formatting.
- Interactive sliders paired with direct number input boxes for precision and accessibility.

## Verification

**Commands:**
- `npm run lint` -- expected: zero errors across `src/`
- `npm run build` -- expected: clean TypeScript compilation and Vite build with no type errors

## Suggested Review Order

**Amortization Engine & Calculation Mathematics**

- Reducing-balance calculation with zero-rate safety and annual schedule aggregation.
  [`emi.ts:9`](../../src/lib/emi.ts#L9)

- Presets for national schemes (MCS, Mahila Samriddhi, Term Loan, Education Loan).
  [`calculatorPresets.ts:1`](../../src/lib/calculatorPresets.ts#L1)

**Calculator UI & Amortization Visualization**

- Interactive calculator page with dual sliders, numeric inputs, KPI summary cards, and URL synchronization.
  [`CalculatorPage.tsx:40`](../../src/pages/CalculatorPage.tsx#L40)

- Quick scheme selector pill buttons with rates and max caps.
  [`SchemePresetBar.tsx:15`](../../src/components/calculator/SchemePresetBar.tsx#L15)

- Annual summary and monthly breakdown amortization schedule table with visual breakdown bars.
  [`AmortizationTable.tsx:20`](../../src/components/calculator/AmortizationTable.tsx#L20)

**Types & Bilingual Localization**

- Type definitions for loan parameters, presets, and annual rows.
  [`types/calculator.ts:1`](../../src/types/calculator.ts#L1)

- English and Hindi localized calculator controls, presets, and table columns.
  [`en.json:520`](../../src/i18n/en.json#L520)
  [`hi.json:520`](../../src/i18n/hi.json#L520)
