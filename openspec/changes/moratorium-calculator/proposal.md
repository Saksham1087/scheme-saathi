## Why

Many government schemes include a moratorium period where the beneficiary doesn't need to start repaying immediately. Understanding moratorium impact on total repayment is critical for financial planning. The PRD requires explaining moratorium duration, repayment start, and possible repayment impact using official scheme rules.

## What Changes

- Moratorium explanation integrated into EMI calculator flow
- Moratorium-specific calculations: repayment start date, total moratorium interest (if applicable), adjusted EMI
- Display: moratorium duration, when repayment begins, impact on total cost
- Per-scheme moratorium rules (not assumed identical across schemes)
- Visual timeline showing moratorium → repayment phases

## Capabilities

### New Capabilities
- `moratorium-calculator`: Calculate repayment impact during moratorium period
- `moratorium-timeline`: Visual timeline showing moratorium and repayment phases
- `scheme-moratorium-rules`: Per-scheme moratorium rule application

### Modified Capabilities

(none)

## Impact

- New `src/services/calculator/moratorium.ts`
- New component: MoratoriumTimeline, MoratoriumDisplay
- Extends: `emi-calculator` with moratorium-aware calculations
- Depends on: `scheme-data-model`, `emi-calculator`
