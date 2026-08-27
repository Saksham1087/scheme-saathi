## Context

Many government schemes include a moratorium period where beneficiaries don't need to start repaying immediately. Understanding the impact of moratorium on total repayment is critical for financial planning. The PRD requires explaining moratorium duration, repayment start, and possible repayment impact using official scheme rules. This change extends the EMI calculator with moratorium-aware calculations and a visual timeline.

## Goals / Non-Goals

**Goals:**
- Integrate moratorium explanation into the EMI calculator flow
- Calculate repayment start date, total moratorium interest (if applicable), and adjusted EMI
- Display moratorium duration, when repayment begins, and impact on total cost
- Apply per-scheme moratorium rules (not assumed identical across schemes)
- Provide a visual timeline showing moratorium → repayment phases

**Non-Goals:**
- Complex interest capitalization models (simplified calculation)
- Moratorium policy changes or regulatory compliance tracking
- Integration with bank repayment schedules
- Moratorium extension requests

## Decisions

- Moratorium calculator extends the EMI calculator rather than being a standalone tool — it's a natural part of the same flow
- Per-scheme moratorium rules are stored in the scheme data model and applied at calculation time
- The visual timeline is a simple linear representation: moratorium phase → repayment phase, with key dates
- Moratorium interest calculation is simplified: if the scheme accrues interest during moratorium, it's added to principal; if not, principal remains unchanged
- The calculator clearly distinguishes between "interest-free moratorium" and "interest-accruing moratorium" schemes
- Moratorium period input in the EMI calculator triggers the moratorium-specific calculations automatically

## Risks / Trade-offs

- **Per-scheme rules complexity**: Different schemes have different moratorium rules; storing and applying them correctly requires accurate scheme data entry
- **Interest during moratorium**: The calculation model is simplified; real-world capitalization may differ from our model
- **Timeline accuracy**: The visual timeline shows estimated dates, not exact bank-determined dates
- **Dependency on EMI calculator**: This change requires the `emi-calculator` to be implemented first
