---
title: 'Story 3.3: Project Cost Planner & Financing Breakdown'
type: 'feature'
created: '2026-08-28'
status: 'done'
baseline_commit: '622a2ccbe44ef6e5e89d1b09b5523a5ba8292868'
review_loop_iteration: 0
context:
  - '_bmad-output/implementation-artifacts/epic-3-context.md'
  - '_bmad-output/implementation-artifacts/spec-3-1-standard-scheme-aware-emi-amortization-calculator.md'
  - '_bmad-output/implementation-artifacts/spec-3-2-moratorium-interest-capitalization-simulation.md'
---

<frozen-after-approval reason="human-owned intent — do not modify unless human renegotiates">

## Intent

**Problem:** First-time entrepreneurs frequently underestimate business startup costs by failing to itemize machinery, inventory, and working capital, and are confused about how much capital the government scheme will finance versus how much own equity (promoter margin) they must contribute.

**Approach:** Implement a responsive, itemized **Project Cost Planner & Financing Breakdown** tool accessible at `/planner` (and tabbed on `/calculator`) that allows users to itemize startup costs across 6 essential business categories, automatically calculates the Concessional Scheme Loan Share (85%–95%) vs Beneficiary Own Contribution (5%–15%), displays a visual stacked breakdown bar with subsidy grants, and provides a direct CTA to port the total budget into the `/find-schemes` intake wizard.

## Boundaries & Constraints

**Always:**
- Provide itemized budgeting across 6 core categories:
  1. Equipment & Machinery
  2. Raw Materials & Inventory
  3. Commercial Rent & Security Deposit
  4. Working Capital & Utilities
  5. Licenses, Certifications & Skills Training
  6. Contingency / Miscellaneous
- Calculate verified statutory financing ratios:
  - Concessional Loan Share: 90% (or scheme-configured up to 95%)
  - Promoter / Beneficiary Contribution: 10% (or 5% for special categories)
- Provide one-click preset templates (e.g. *Small Retail Kirana Shop*, *Garment Manufacturing Unit*, *Mobile Repair & Service*, *Dairy & Animal Husbandry*).
- Include direct CTA: "Find Schemes For This Budget" which loads `estimatedCost` and `projectType` into `useIntakeStore` and navigates to `/find-schemes`.
- Support 100% localization in English (`en`) and Hindi (`hi`).

**Never:**
- Allow negative line item values.
- Lose user itemized budget during tab switches.

## I/O & Edge-Case Matrix

| Scenario | Input / State | Expected Output / Behavior | Error Handling |
|----------|--------------|---------------------------|----------------|
| Select Business Preset | User selects "Small Retail Kirana Shop" | Pre-populates itemized rows (Equipment ₹40k, Stock ₹80k, Rent ₹20k, Working Capital ₹10k = Total ₹1.5L) | User can add/edit/delete rows freely |
| Custom Line Item Addition | User adds custom line item with title and amount | Automatically recalculates total project cost, 90% loan share (₹1.35L), and 10% own contribution (₹15K) | Non-numeric entries blocked |
| Port Budget to Intake | User clicks "Find Schemes for this Budget (₹1.5L)" | Sets `estimatedCost: 150000` in `useIntakeStore` and navigates to `/find-schemes` | Pre-fills step values seamlessly |

</frozen-after-approval>

## Code Map

- `src/types/planner.ts` -- Define interfaces for `ProjectBudgetItem`, `ProjectBudgetCategory`, `FinancingBreakdown`, and `BusinessPresetTemplate`.
- `src/stores/plannerStore.ts` -- Zustand store managing itemized budget rows, category totals, active template, and financing ratios.
- `src/lib/plannerPresets.ts` -- Authentic enterprise starter templates (Kirana, Garments, Repair, Dairy, Higher Education).
- `src/components/planner/ProjectCostPlanner.tsx` -- Interactive itemized cost builder with category selectors, preset loader, and real-time total sum.
- `src/components/planner/FinancingBreakdownCard.tsx` -- Visual stacked bar showing Concessional Scheme Loan Share vs Promoter Margin Contribution with EMI quick link.
- `src/pages/PlannerPage.tsx` -- Dedicated `/planner` page and integrated tab within `/calculator`.
- `src/App.tsx` -- Register `/planner` route in React Router.
- `src/i18n/en.json` & `src/i18n/hi.json` -- Localization strings for all planner categories, templates, and financing breakdown metrics.

## Tasks & Acceptance

**Execution:**
- [x] `src/types/planner.ts` & `src/stores/plannerStore.ts` -- Define types and Zustand store for project cost planning.
- [x] `src/lib/plannerPresets.ts` -- Build realistic business templates for Indian micro-enterprises.
- [x] `src/components/planner/ProjectCostPlanner.tsx` -- Build interactive itemized expense table with add/remove/edit actions.
- [x] `src/components/planner/FinancingBreakdownCard.tsx` -- Build visual financing ratio card with promoter margin calculator.
- [x] `src/pages/PlannerPage.tsx` & `src/pages/CalculatorPage.tsx` -- Create dedicated `/planner` route and tabbed integration in `/calculator`.
- [x] `src/App.tsx` -- Register `/planner` route.
- [x] `src/i18n/en.json` & `src/i18n/hi.json` -- Add complete localized strings in English and Hindi.

**Acceptance Criteria:**
- Given a user editing project costs, total cost and 90/10 financing breakdown recalculate in real time.
- Given selecting a business preset, realistic line items populate automatically.
- Given clicking "Find Matching Schemes", the total budget is ported into `/find-schemes`.

## Spec Change Log

_None._

## Design Notes

- High-contrast visual breakdown card with emerald (Loan), violet (Promoter Equity), and cyan (Subsidy) colors.
- Mobile-friendly line item inputs with quick category icon badges.

## Verification

**Commands:**
- `npm run lint` -- expected: zero errors across `src/`
- `npm run build` -- expected: clean TypeScript compilation and Vite build with no type errors

## Suggested Review Order

**Types, Presets & Store**
- Data models for 6 budget categories, financing breakdown, and business presets: [`planner.ts:1`](../../src/types/planner.ts#L1)
- Realistic Indian micro-enterprise starter templates (Kirana, Garments, Mobile Repair, Dairy Mini-Farm, Higher Education): [`plannerPresets.ts:9`](../../src/lib/plannerPresets.ts#L9)
- Persistent Zustand budget and financing store: [`plannerStore.ts:19`](../../src/stores/plannerStore.ts#L19)

**Components & Visual Breakdown**
- Interactive itemized cost builder with categories and preset picker: [`ProjectCostPlanner.tsx:48`](../../src/components/planner/ProjectCostPlanner.tsx#L48)
- Visual stacked capital breakdown card with statutory ratio switcher & porting CTA: [`FinancingBreakdownCard.tsx:27`](../../src/components/planner/FinancingBreakdownCard.tsx#L27)

**Pages, Routing & Localization**
- Dedicated `/planner` page with cross-tab switcher to `/calculator`: [`PlannerPage.tsx:14`](../../src/pages/PlannerPage.tsx#L14)
- Route registration: [`App.tsx:28`](../../src/App.tsx#L28)
- Complete English and Hindi localized dictionaries: [`en.json:653`](../../src/i18n/en.json#L653) & [`hi.json:653`](../../src/i18n/hi.json#L653)
