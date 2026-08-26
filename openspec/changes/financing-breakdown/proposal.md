## Why

After selecting a scheme, users need to understand how their project will be financed — what portion the scheme covers and what they contribute. This transparency is critical for financial decision-making.

## What Changes

- Financing breakdown display showing: total project cost, possible scheme finance, possible own contribution
- Values sourced from verified scheme rules (not fabricated)
- Integration with project cost planner for total cost input
- Visual breakdown (pie/bar chart or table)
- Disclaimer when values are illustrative vs official

## Capabilities

### New Capabilities
- `financing-breakdown`: Display project cost, scheme finance, and own contribution breakdown
- `financing-visualization`: Visual representation of financing split

### Modified Capabilities

(none)

## Impact

- New `src/services/calculator/financing.ts`
- New component: FinancingBreakdown, FinancingVisual
- Extends scheme detail and calculator pages
- Depends on: `scheme-data-model`, `project-cost-planner`
