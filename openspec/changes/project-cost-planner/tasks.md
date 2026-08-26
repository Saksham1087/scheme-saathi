## 1. Types & Data Model

- [x] 1.1 Define `CostItem` type: `{ id: string, category: CostCategory, description: string, amount: number }`
- [x] 1.2 Define `CostCategory` union type: `"equipment" | "raw_materials" | "rent" | "working_capital" | "other"`
- [x] 1.3 Define `ProjectPlan` type: `{ id: string, items: CostItem[], total: number, createdAt: number }`

## 2. Project Cost Service

- [x] 2.1 Create `src/services/calculator/projectCost.ts` with cost calculation functions
- [x] 2.2 Implement `computeTotal(items: CostItem[]): number` — sum all item amounts
- [x] 2.3 Implement `generatePlanId(): string` for unique plan identification

## 3. Project Cost Planner Component

- [x] 3.1 Build `ProjectCostPlanner` component: itemized cost builder with add/remove line items
- [x] 3.2 Each line item renders: category dropdown (predefined 5 categories), description text input, amount number input
- [x] 3.3 Support minimum 1 and practical maximum ~20 line items
- [x] 3.4 Show running total at the top/bottom, computed client-side in real-time as items are added/edited
- [x] 3.5 Add "Add Item" button and per-item "Remove" button (with confirmation for non-empty items)

## 4. CostItem Component

- [x] 4.1 Build `CostItem` component rendering a single row: category select, description input, amount input, remove action
- [x] 4.2 Use existing `Select`, `Input`, `Button` UI components from `src/components/ui/`
- [x] 4.3 Validate amount is a positive number; show inline error for invalid amounts

## 5. CostCategory Component

- [x] 5.1 Build `CostCategory` display component showing category label with optional icon
- [x] 5.2 Map category values to human-readable labels (e.g., "raw_materials" → "Raw Materials")

## 6. Modal/Page Integration

- [x] 6.1 Implement planner as a modal (using existing `Dialog` component from `src/components/ui/dialog.tsx`)
- [x] 6.2 Accessible from the assessment flow via "Don't know your project cost? Use the planner" link
- [x] 6.3 Modal has "Save & Use" CTA that passes total to the parent (recommendation flow) and closes
- [x] 6.4 Modal has "Cancel" action that discards changes

## 7. Pass Total to Recommendation Engine

- [x] 7.1 Define data contract: planner total is passed as `estimatedCost` / `projectCost` input to the recommendation engine
- [x] 7.2 On "Save & Use", set the total in the intake/recommendation store so the next recommendation uses it
- [x] 7.3 Verify end-to-end flow: planner → total → recommendation engine receives correct value

## 8. Firebase Persistence

- [x] 8.1 Save project plans to Firebase for logged-in users (collection per user)
- [x] 8.2 Load previously saved plans on planner open, allow selecting a past plan to edit
- [x] 8.3 Handle offline gracefully: user can use planner, save happens when online

## 9. i18n

- [x] 9.1 Add English and Hindi translation keys for category labels, input labels, running total label, CTA text, and empty state messages
- [x] 9.2 Ensure all strings use `useTranslation` / `t()`

## 10. Testing

- [x] 10.1 Unit test `computeTotal` with various item combinations including zero-amount items
- [x] 10.2 Unit test add/remove item logic: item count, total updates, max item limit
- [x] 10.3 Integration test: open planner from assessment flow, add items, save, verify total passed to recommendation
- [x] 10.4 Integration test: save plan to Firebase, reload, verify plan loads correctly
