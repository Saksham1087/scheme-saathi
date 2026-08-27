## Why

After selecting a scheme, users need guidance through the entire application process. The application journey tracks progress from scheme identification through decision, keeping users informed and reducing abandonment.

## What Changes

- Application journey tracker at `/application/:id`
- 8-step journey: scheme identified → eligibility checked → documents prepared → partner identified → application started → application submitted → under review → decision
- Visual timeline with current step highlighted
- Each step has guidance content and actions
- Status is user-managed (not official government status unless API integrated)
- Integration with document checklist and partner locator steps
- Journey saved to user profile

## Capabilities

### New Capabilities
- `application-journey`: 8-step visual timeline tracking application progress
- `journey-guidance`: Guidance content and actions for each journey step
- `journey-persistence`: Save and resume application journey in user profile

### Modified Capabilities

(none)

## Impact

- New `src/pages/Application.tsx`
- New components: ApplicationTimeline, JourneyStep, JourneyAction
- Route: `/application/:id`
- Depends on: `firebase-architecture`, `scheme-data-model`
