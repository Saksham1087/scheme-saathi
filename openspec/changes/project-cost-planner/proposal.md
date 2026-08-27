## Why

Entrepreneurs often don't know the total cost of their project. The project cost planner lets them itemize expenses, calculate total project cost, and pass it directly to the recommendation engine for better matching.

## What Changes

- Itemized project cost builder with add/remove line items
- Categories: equipment, raw materials, rent, working capital, other
- Running total calculation
- Pass total directly to recommendation engine
- Link from assessment flow: "Don't know your project cost? Use the planner"
- Save project plans to user profile

## Capabilities

### New Capabilities
- `project-cost-planner`: Itemized cost builder with categories, amounts, and running total
- `cost-categories`: Predefined project cost categories (equipment, materials, rent, working capital, other)
- `cost-to-recommendation`: Pass planner total directly to recommendation engine as project cost input

### Modified Capabilities

(none)

## Impact

- New `src/services/calculator/projectCost.ts`
- New components: ProjectCostPlanner, CostItem, CostCategory
- Modal or dedicated page accessible from assessment flow
- Depends on: `firebase-architecture` (for saving plans)
