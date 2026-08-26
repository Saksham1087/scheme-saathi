## Context

After selecting a scheme, users need guidance through the entire application process. Without a clear journey view, users lose track of progress, miss required steps, and abandon applications. An 8-step visual timeline provides structure and reduces cognitive load.

## Goals / Non-Goals

**Goals:**
- Provide an 8-step visual timeline from scheme identification through decision
- Show current step highlighted with progress indication
- Offer guidance content and actionable steps at each stage
- Allow user-managed status updates (not official government status unless API integrated)
- Persist journey state so users can resume where they left off
- Integrate with document checklist and partner locator steps

**Non-Goals:**
- Real-time government status tracking via API (future enhancement)
- Automated step progression (user-driven for now)
- Multi-scheme journey comparison
- Mobile push notifications for step completion

## Decisions

- 8-step fixed timeline: scheme identified → eligibility checked → documents prepared → partner identified → application started → application submitted → under review → decision
- Journey status is user-managed; each step requires explicit user action to advance
- Route design: `/application/:id` with a single page showing the full timeline
- Journey state persisted to Firebase user profile for cross-device resume
- Guidance content is static per step initially, editable later for scheme-specific variations

## Risks / Trade-offs

- **User fatigue:** 8 steps may feel long; mitigated by clear visual progress and celebrating milestones
- **Stale state:** User-managed status may not reflect real-world application state; acceptable for MVP
- **Data loss:** Firebase persistence adds complexity but prevents losing progress on refresh/navigation
- **Rigid timeline:** Fixed 8 steps may not suit all schemes; could be made configurable in future
