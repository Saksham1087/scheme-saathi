---
title: 'Story 3.2: Moratorium & Interest Capitalization Simulation'
type: 'feature'
created: '2026-08-28'
status: 'done'
baseline_commit: 'edff07f35b4fc2a7a40ecff1b17b686373b9e4a3'
review_loop_iteration: 0
context:
  - '_bmad-output/implementation-artifacts/epic-3-context.md'
  - '_bmad-output/implementation-artifacts/spec-3-1-standard-scheme-aware-emi-amortization-calculator.md'
---

<frozen-after-approval reason="human-owned intent — do not modify unless human renegotiates">

## Intent

**Problem:** Beneficiaries and students entering education or business gestation periods often do not understand that "deferring repayments" via interest capitalization inflates the principal loan balance and results in substantially higher lifetime interest costs compared to servicing simple interest monthly during the moratorium.

**Approach:** Implement a dedicated, side-by-side **Moratorium & Interest Capitalization Simulator** integrated into `/calculator` that models Scenario A (Capitalizing Interest into Principal) vs Scenario B (Servicing Simple Interest Monthly), clearly highlighting the net financial difference in lifetime interest paid ("Cost of Capitalization"), providing an interactive moratorium slider (0 to 60 months), schedule toggles for both scenarios, and plain-language financial literacy guidance.

## Boundaries & Constraints

**Always:**
- Accurately calculate both moratorium pathways:
  - **Scenario A (Capitalize)**: $P_{\text{eff}} = P \cdot (1 + r)^{m_{\text{mor}}}$, post-moratorium $\text{EMI}_A$ computed on $P_{\text{eff}}$, zero payment during moratorium months.
  - **Scenario B (Service Monthly)**: Pay simple interest $I_{\text{month}} = P \cdot r$ each month during moratorium ($m_{\text{mor}}$ payments of $I_{\text{month}}$), principal remains $P$, post-moratorium $\text{EMI}_B$ computed on $P$.
- Highlight the lifetime interest difference: $\Delta \text{Interest} = \text{TotalPaid}_A - \text{TotalPaid}_B$.
- When moratorium is 0 months, cleanly present standard amortization without unnecessary comparison alerts.
- Support 100% localization in English (`en`) and Hindi (`hi`).

**Never:**
- Allow moratorium months to exceed total loan tenure.
- Show negative interest difference.

## I/O & Edge-Case Matrix

| Scenario | Input / State | Expected Output / Behavior | Error Handling |
|----------|--------------|---------------------------|----------------|
| Moratorium Active (e.g. 6 Months on ₹5L @ 6% 60mo) | User sets moratorium slider to 6 months | Renders side-by-side comparison cards: Scenario A (Cap) vs Scenario B (Service); shows exact ₹ difference in total interest and monthly EMI | Clear visual delta badge |
| Zero Moratorium | User sets moratorium to 0 | Hides comparative simulation cards; displays standard single EMI view | Seamless transition |
| Education Loan Grace Period (12 Months on ₹4L @ 4%) | Education preset selected with 12 mo moratorium | Compares ₹0 payment during college vs ₹1,333/mo simple interest during college; highlights how servicing interest saves money | Tailored educational advisory note |

</frozen-after-approval>

## Code Map

- `src/lib/emi.ts` -- Add `computeMoratoriumComparison()` returning metrics and schedules for both Scenario A (capitalizing) and Scenario B (servicing).
- `src/components/calculator/MoratoriumComparisonCard.tsx` -- Side-by-side comparison cards highlighting EMI differences, moratorium payments, total lifetime interest, and net savings.
- `src/components/calculator/AmortizationTable.tsx` -- Update table to support switching between Scenario A and Scenario B schedules with moratorium phase badges.
- `src/pages/CalculatorPage.tsx` -- Mount `MoratoriumComparisonCard` directly beneath the moratorium slider controls.
- `src/i18n/en.json` & `src/i18n/hi.json` -- Complete English and Hindi localization for moratorium simulation copy and educational explanations.

## Tasks & Acceptance

**Execution:**
- [x] `src/lib/emi.ts` -- Implement `computeMoratoriumComparison` mathematical simulation.
- [x] `src/components/calculator/MoratoriumComparisonCard.tsx` -- Build side-by-side comparison component with cost delta badge.
- [x] `src/components/calculator/AmortizationTable.tsx` -- Add Scenario A / Scenario B schedule selector tabs.
- [x] `src/pages/CalculatorPage.tsx` -- Integrate simulator into the main calculator flow.
- [x] `src/i18n/en.json` & `src/i18n/hi.json` -- Add complete localized strings.

**Acceptance Criteria:**
- Given a non-zero moratorium, the user sees side-by-side cards comparing Capitalize vs Service Monthly.
- Given Scenario A, the post-moratorium EMI is higher and the total cost difference is calculated accurately.
- Given schedule view, user can switch between Capitalizing and Servicing schedules.

## Spec Change Log

_None._

## Design Notes

- Emerald highlight for Scenario B savings and clear Amber badge for Scenario A extra interest cost.
- Plain-language explanation: "What does Moratorium mean for your pocket?".

## Verification

**Commands:**
- `npm run lint` -- expected: zero errors across `src/`
- `npm run build` -- expected: clean TypeScript compilation and Vite build with no type errors

## Suggested Review Order

**Mathematical Simulation Engine**

- Dual scenario moratorium simulation (`Scenario A: Capitalize` vs `Scenario B: Service Monthly`) and exact interest delta calculations.
  [`emi.ts:115`](../../src/lib/emi.ts#L115)

- Data contracts for moratorium scenario metrics and comparison results.
  [`types/calculator.ts:46`](../../src/types/calculator.ts#L46)

**Comparative Visualizer & Schedule Integration**

- Side-by-side comparison cards with Cost of Capitalization callout banner and financial literacy guidance.
  [`MoratoriumComparisonCard.tsx:16`](../../src/components/calculator/MoratoriumComparisonCard.tsx#L16)

- Amortization table with Scenario A vs Scenario B schedule toggle pills and moratorium phase indicators.
  [`AmortizationTable.tsx:33`](../../src/components/calculator/AmortizationTable.tsx#L33)

**Calculator Page & Bilingual Localization**

- Integration into the main `/calculator` workflow.
  [`CalculatorPage.tsx:205`](../../src/pages/CalculatorPage.tsx#L205)

- Complete English and Hindi localization strings for moratorium metrics and educational notes.
  [`en.json:295`](../../src/i18n/en.json#L295)
  [`hi.json:295`](../../src/i18n/hi.json#L295)
