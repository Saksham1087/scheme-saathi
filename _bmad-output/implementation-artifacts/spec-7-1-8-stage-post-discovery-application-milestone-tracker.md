---
title: 'Story 7.1: 8-Stage Post-Discovery Application Milestone Tracker'
type: 'feature'
created: '2026-08-28'
status: 'done'
baseline_commit: 'b820539c3cb5352611e04135e6c7104b2b2b1016'
review_loop_iteration: 0
context:
  - '_bmad-output/implementation-artifacts/epic-7-context.md'
  - '_bmad-output/planning-artifacts/architectures/architecture-scheme-saathi-2026-08-27/ARCHITECTURE-SPINE.md'
---

<frozen-after-approval reason="human-owned intent — do not modify unless human renegotiates">

## Intent

**Problem:** After discovering a scheme, applicants have no structured way to track their progress through physical branch submission, document verification, field appraisal, and final disbursal, leading to confusion about what to do next.

**Approach:** Implement an interactive **8-Stage Post-Discovery Application Milestone Tracker** at `/track` (and `/application/:id`) that models the complete citizen journey: (1) Scheme Identified, (2) Eligibility Checked, (3) Documents Prepared, (4) Partner Branch Selected, (5) Application Form Filled, (6) Application Submitted, (7) Appraisal & Inspection, (8) Sanction & Disbursal, with interactive milestone completion checkboxes, application reference number tracking, physical visit notes, date stamps, and next-step advisory cards.

## Boundaries & Constraints

**Always:**
- Strictly model all 8 statutory milestone stages:
  1. `scheme_identified` -- Scheme selected and benefits understood
  2. `eligibility_checked` -- Criteria pre-screened & 100-pt match score evaluated
  3. `docs_prepared` -- Statutory certificates verified & printed
  4. `partner_selected` -- Authorized branch & nodal officer identified
  5. `form_filled` -- Physical/digital application completed
  6. `submitted` -- Application submitted at branch with acknowledgment receipt
  7. `under_review` -- Pre-sanction field visit & credit appraisal by bank
  8. `sanction_decision` -- Sanction letter issued & subsidy/loan disbursed
- Allow beneficiaries to mark stages complete, log acknowledgment receipt numbers, and add notes.
- Display the mandatory statutory tracking disclaimer:
  *"This is a citizen self-tracking guidance tool. Official application processing and sanction decisions are made directly by your designated Channel Partner bank branch."*
- Provide one-click "New Application Journey" creator allowing users to start tracking any scheme and partner.
- Support 100% localization in English (`en`) and Hindi (`hi`).
- Maintain accessible WCAG AA touch targets (min 44x44px).

**Never:**
- Present self-tracked milestones as binding government approval guarantees.
- Lose application journeys when refreshing the page.

## I/O & Edge-Case Matrix

| Scenario | Input / State | Expected Output / Behavior | Error Handling |
|----------|--------------|---------------------------|----------------|
| Mark Stage Complete | User marks "Documents Prepared" as complete | Progress advances to 3/8 (38%); shows timestamp and next-action prompt: "Visit your selected Channel Partner branch" | Stage can be unchecked if needed |
| Add Acknowledgment No | User inputs physical receipt no: "UP-SCA-2026-889" | Saves reference number to application record; displays in header | Validates non-empty string |
| Start New Journey | User selects Micro Credit Scheme + Lucknow SCA | Initializes new 8-stage tracking card with pre-filled scheme rules and partner address | Graceful fallback for unauthenticated users using localStorage |

</frozen-after-approval>

## Code Map

- `src/types/application.ts` -- Define interfaces for `ApplicationJourney`, `MilestoneStage`, `MilestoneRecord`, and `ApplicationStageKey`.
- `src/stores/useApplicationStore.ts` -- Zustand store managing active applications, milestone progress, notes, reference numbers, and local storage / Firestore sync.
- `src/components/tracking/MilestoneTracker.tsx` -- 8-stage visual timeline stepper with completion toggles, status pills, and date stamps.
- `src/components/tracking/NextActionCard.tsx` -- Contextual guidance card offering specific actionable advice for the current milestone stage.
- `src/components/tracking/NewJourneyModal.tsx` -- Modal allowing users to launch an application tracker for any scheme and channel partner.
- `src/pages/TrackApplication.tsx` -- Redesigned `/track` page with active application switcher, 8-stage timeline, reference number editor, and printable application summary.
- `src/App.tsx` -- Register `/track` and `/application/:id` routes.
- `src/i18n/en.json` & `src/i18n/hi.json` -- Localization strings for all 8 milestones, next-action guides, reference labels, and disclaimers.

## Tasks & Acceptance

**Execution:**
- [x] `src/types/application.ts` & `src/stores/useApplicationStore.ts` -- Implement 8-stage application models and Zustand store.
- [x] `src/components/tracking/MilestoneTracker.tsx` -- Build 8-stage interactive stepper component.
- [x] `src/components/tracking/NextActionCard.tsx` -- Build contextual next-action guidance cards for all 8 stages.
- [x] `src/components/tracking/NewJourneyModal.tsx` -- Build new application launcher modal.
- [x] `src/pages/TrackApplication.tsx` -- Redesign `/track` page with timeline, notes, and print summary.
- [x] `src/App.tsx` -- Register route aliases.
- [x] `src/i18n/en.json` & `src/i18n/hi.json` -- Add complete localized strings.

**Acceptance Criteria:**
- Given an application journey, all 8 milestone stages are displayed with completion toggles.
- Given checking off a milestone, progress percentage and next-action guide update synchronously.
- Given the tracking page, the mandatory self-tracking disclaimer is clearly shown.

## Spec Change Log

_None._

## Design Notes

- High-contrast emerald completed checkmarks and pulsing blue current stage indicator.
- Actionable next steps (e.g. "Take 2 physical passport photos and visit Counter #3 at Hazratganj branch").

## Verification

**Commands:**
- `npm run lint` -- expected: zero errors across `src/`
- `npm run build` -- expected: clean TypeScript compilation and Vite build with no type errors

## Suggested Review Order

**Application Data Contracts & Persistence Store**

- 8-stage milestone domain models, stages, and definitions.
  [`application.ts:1`](../../src/types/application.ts#L1)

- Persistent application store with localStorage fallback and demo seed.
  [`useApplicationStore.ts:1`](../../src/stores/useApplicationStore.ts#L1)

**Milestone Timeline & Next Action Cards**

- Interactive 8-stage visual timeline stepper with date stamps, note editors, and receipt tracker.
  [`MilestoneTracker.tsx:1`](../../src/components/tracking/MilestoneTracker.tsx#L1)

- Contextual next-action guidance card with tool quick links and statutory disclaimer.
  [`NextActionCard.tsx:1`](../../src/components/tracking/NextActionCard.tsx#L1)

- Journey launcher modal for any scheme and partner.
  [`NewJourneyModal.tsx:1`](../../src/components/tracking/NewJourneyModal.tsx#L1)

**Tracking Hub Page & Localization**

- Redesigned tracking page with switcher, acknowledgment editor, and print summary.
  [`TrackApplication.tsx:1`](../../src/pages/TrackApplication.tsx#L1)

- Route aliases `/track` and `/application/:id`.
  [`App.tsx:34`](../../src/App.tsx#L34)

- English and Hindi localized dictionaries.
  [`en.json:1100`](../../src/i18n/en.json#L1100)
  [`hi.json:1100`](../../src/i18n/hi.json#L1100)
