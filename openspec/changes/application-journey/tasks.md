## 1. Data Model & State

- [x] 1.1 Define `JourneyStep` type with step ID, label, status (pending/in-progress/completed), and optional metadata
- [x] 1.2 Define `ApplicationJourney` type with scheme ID, current step, step states array, timestamps, and user ID
- [x] 1.3 Create Firestore document structure for journey persistence under user profile
- [x] 1.4 Implement Firestore read/write functions for saving and resuming journey state

## 2. Route & Page Setup

- [x] 2.1 Create `src/pages/Application.tsx` with route parameter `:id` extraction
- [x] 2.2 Implement journey loading from Firestore on mount, with loading skeleton
- [x] 2.3 Implement 404 state when journey ID is invalid or not found
- [x] 2.4 Register route `/application/:id` in the app router

## 3. Journey Timeline Component

- [x] 3.1 Create `ApplicationTimeline` component rendering all 8 steps vertically
- [x] 3.2 Define the 8 fixed steps: scheme identified → eligibility checked → documents prepared → partner identified → application started → application submitted → under review → decision
- [x] 3.3 Highlight current step with distinct styling; completed steps show checkmark; pending steps are dimmed
- [x] 3.4 Add progress indicator (e.g., "Step 3 of 8") at the top of the timeline

## 4. Journey Step Component

- [x] 4.1 Create `JourneyStep` component with step label, status icon, and expand/collapse for details
- [x] 4.2 Render guidance content for each step (static text initially, per-step descriptions)
- [x] 4.3 Show step-specific actions (e.g., "Check eligibility" for step 2, "Prepare documents" for step 3)

## 5. Step Progression Logic

- [x] 5.1 Implement user-driven step advancement: "Mark as Complete" button on current step
- [x] 5.2 Prevent skipping ahead (only current step can be advanced)
- [x] 5.3 Allow marking a completed step as incomplete (undo capability)
- [x] 5.4 Persist step changes to Firestore immediately on each state update

## 6. Journey Actions Component

- [x] 6.1 Create `JourneyAction` component rendering contextual actions per step
- [x] 6.2 Step 2 action: link to eligibility calculator
- [x] 6.3 Step 3 action: link to document checklist for the scheme
- [x] 6.4 Step 4 action: link to channel partner locator
- [x] 6.5 Step 5 action: external link or instructions for application submission
- [x] 6.6 Steps 6-8: status acknowledgment actions (mark as submitted, under review, decision received)

## 7. Milestone Celebrations

- [x] 7.1 Identify key milestones (documents prepared, application submitted, decision received)
- [x] 7.2 Add subtle celebration UI (confetti or congratulatory message) when milestone steps are completed

## 8. Integration with User Profile

- [x] 8.1 Save new journey to user's Firestore profile on scheme selection
- [x] 8.2 List active journeys in user dashboard (links to `/application/:id`)
- [x] 8.3 Allow users to view completed journey history
