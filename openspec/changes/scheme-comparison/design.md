## Context

After receiving scheme recommendations, users need to compare schemes side-by-side to make informed decisions. The PRD specifies comparing purpose, eligibility, assistance, interest, repayment, moratorium, documents, and match scores. This change implements the comparison feature as a secondary action on recommendation cards and scheme explorer results.

## Goals / Non-Goals

**Goals:**
- Allow users to select 2-4 schemes for side-by-side comparison
- Display a responsive comparison table covering all PRD comparison dimensions
- Support adding/removing schemes from comparison via scheme cards
- Highlight differences between compared schemes
- Persist comparison selections within a session

**Non-Goals:**
- Multi-user collaborative comparison
- Exporting comparison to PDF or sharing (future enhancement)
- Integration with application workflow (covered in other changes)
- Scoring or ranking within comparison (that's the recommender's job)

## Decisions

- Comparison supports 2-4 schemes — enough for decision-making without overwhelming the layout
- Comparison is accessible from recommendation results and scheme explorer via an "Add to comparison" action
- A persistent comparison bar/toolbar shows selected schemes and provides a "Compare" CTA
- Comparison table is responsive: horizontal scroll on mobile, full grid on desktop
- Differences between schemes are visually highlighted (e.g., color coding or bold) to aid quick scanning
- Comparison state is held in session (React state / context) rather than persisted to Firebase — it's ephemeral by nature
- The comparison page/modal is a standalone view at `/compare` or as a modal overlay

## Risks / Trade-offs

- **4-scheme limit** may frustrate users wanting to compare more; 4 is the practical limit for readable side-by-side layout
- **Session-only persistence** means comparison is lost on page refresh; acceptable for an ephemeral decision-making tool
- **Responsive comparison table** on mobile requires careful design — horizontal scroll with sticky first column is the pragmatic approach
- **Schema differences**: Some schemes may not have values for all comparison dimensions; the table must handle missing data gracefully with "N/A" or dashes
