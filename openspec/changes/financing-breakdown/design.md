## Context

After a user selects a scheme, they need to understand how their project will be financed — what portion the scheme covers and what they contribute. Without this breakdown, users cannot make informed financial decisions about whether to proceed with an application. The financing data comes from verified scheme rules and user-provided project cost inputs.

## Goals / Non-Goals

**Goals:**
- Display a clear breakdown of total project cost, scheme finance portion, and own contribution
- Source all financing values from verified scheme rules, never fabricated
- Integrate with the project cost planner for total cost input
- Provide visual representation (chart or table) of the financing split
- Clearly label values as illustrative vs official with appropriate disclaimers

**Non-Goals:**
- Real-time loan approval or commitment
- Integration with banking APIs for actual loan processing
- Financial advice or recommendations beyond scheme coverage display
- Multi-currency support (INR only)

## Decisions

1. **Data sourcing**: Financing values SHALL be derived from scheme rule data in the scheme-data-model, not hardcoded. When a scheme defines percentage-based coverage, the system SHALL calculate absolute values from the user's project cost input.

2. **Component architecture**: A `FinancingBreakdown` component SHALL render the textual breakdown and a `FinancingVisual` component SHALL render the chart/table visualization. Both are independent and composable.

3. **Disclaimer strategy**: The system SHALL display a disclaimer when values are illustrative (calculated from user input + scheme rules) vs when they come from official fixed-value scheme data. The disclaimer text SHALL include the source of the values.

4. **Visualization format**: The system SHALL use a bar chart as primary visualization with a table as fallback/alternative. The choice avoids pie chart accessibility issues for color-blind users.

5. **Integration points**: The financing breakdown SHALL appear on the scheme detail page and within the calculator page. It SHALL read project cost from the project-cost-planner context.

## Risks / Trade-offs

- **Scheme data completeness**: Not all schemes will have structured financing rules. When rules are missing, the system SHALL display what is available and mark missing fields as "Not specified in scheme data" rather than fabricating values.
- **Stale data**: Scheme financing terms may change. The system SHALL attribute data to its source and encourage users to verify with official channels.
- **Calculation accuracy**: Percentage-based calculations may produce rounding differences. The system SHALL round to nearest rupee and note that values are approximate.
