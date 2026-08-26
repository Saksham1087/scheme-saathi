## Context

Entrepreneurs often don't know the total cost of their project when seeking scheme recommendations. The project cost planner lets them itemize expenses by category, calculate a running total, and pass that total directly to the recommendation engine for better matching. It bridges the gap between "I have an idea" and "I know what I need financially."

## Goals / Non-Goals

**Goals:**
- Provide an itemized project cost builder with add/remove line items
- Support predefined categories: equipment, raw materials, rent, working capital, other
- Show a running total as items are added/edited
- Pass the total project cost directly to the recommendation engine
- Link from the assessment flow: "Don't know your project cost? Use the planner"
- Save project plans to user profile (Firebase)

**Non-Goals:**
- Detailed accounting or bookkeeping features
- Integration with accounting software
- Invoice or receipt generation
- Project timeline or Gantt chart features
- Currency conversion (assumed INR)

## Decisions

- The planner is accessible as a modal or dedicated page from the assessment flow, not a standalone tool
- Running total is computed client-side in real-time as line items are added/edited
- Each line item has: category (dropdown), description (text), and amount (number)
- Predefined categories are fixed in code; custom categories are not supported in v1
- The total is passed to the recommendation engine as the "project cost" input for scheme matching
- Project plans are saved to Firebase for logged-in users, allowing reuse across sessions
- The planner supports a minimum of 1 and a practical maximum of ~20 line items

## Risks / Trade-offs

- **Category limitations**: Fixed categories may not cover all project types; "other" serves as a catch-all
- **Accuracy of user-entered amounts**: Users may estimate inaccurately; the planner is a planning tool, not an accounting tool
- **Integration with recommendation engine**: Passing total cost to the engine requires the recommendation flow to accept this input; both changes must coordinate on the data contract
- **Saving plans**: Requires Firebase write; offline users can use the planner but can't persist until online
