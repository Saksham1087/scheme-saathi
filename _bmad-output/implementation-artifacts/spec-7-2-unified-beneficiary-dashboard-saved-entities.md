---
title: 'Story 7.2: Unified Beneficiary Dashboard & Saved Entities'
type: 'feature'
created: '2026-08-28'
status: 'done'
baseline_commit: 'c88c77d2427a1e0b5773177894a7378dbe0ebc36'
review_loop_iteration: 0
context:
  - '_bmad-output/implementation-artifacts/epic-7-context.md'
  - '_bmad-output/implementation-artifacts/spec-7-1-8-stage-post-discovery-application-milestone-tracker.md'
---

<frozen-after-approval reason="human-owned intent — do not modify unless human renegotiates">

## Intent

**Problem:** Returning users and facilitators have to re-search schemes, re-calculate EMIs, re-find partner addresses, and recreate application trackers because information is fragmented across disconnected pages without a unified home.

**Approach:** Implement a personalized **Unified Beneficiary Dashboard** at `/dashboard` that consolidates Active Application Journeys, Saved Schemes, Bookmarked Channel Partners, Recent Financial Calculations, and Document Readiness Status into a single responsive hub with quick-action launchpads, bookmark toggles across scheme cards and partner cards, and persistent state storage in `useSavedStore`.

## Boundaries & Constraints

**Always:**
- Provide a unified `/dashboard` displaying 6 key sections:
  1. *Active Application Journeys* (with 8-stage progress meters and "Continue Journey" CTAs)
  2. *Saved Schemes & Bookmarks* (with remove, compare, and details actions)
  3. *Saved Channel Partners* (with direct dial `tel:`, directions, and profile modals)
  4. *Recent Financial Calculations & Budgets* (with one-click reload into calculator/planner)
  5. *Document Readiness Status* (aggregate document readiness meter with direct link to `/documents`)
  6. *Quick Discovery Action Launchpad* (`/find-schemes`, `/calculator`, `/planner`, `/documents`, `/partners`, `/assistant`)
- Integrate bookmark / save toggle buttons on `SchemeCard.tsx`, `SchemeDetailsHeader.tsx`, and `PartnerCard.tsx`.
- Persist saved entities in local storage via `useSavedStore` with automatic sync.
- Support 100% localization in English (`en`) and Hindi (`hi`).
- Maintain accessible WCAG AA touch targets (min 44x44px).

**Never:**
- Require mandatory cloud authentication to view local saved dashboard items (support guest persistence).
- Delete user saved entities without explicit user action.

## I/O & Edge-Case Matrix

| Scenario | Input / State | Expected Output / Behavior | Error Handling |
|----------|--------------|---------------------------|----------------|
| Bookmark Scheme | User clicks bookmark icon on Micro Credit card | Saves scheme ID to `useSavedStore`; shows toast: "Scheme saved to your dashboard" | Icon updates to filled state |
| Open Dashboard | User navigates to `/dashboard` | Displays all saved schemes, partners, active application journeys, and document readiness score | If empty, displays friendly starter prompts and CTA to browse catalog |
| Resume Calculation | User clicks "Resume Calculation (₹5L @ 6%)" | Navigates to `/calculator` with stored parameters pre-filled | Loads store parameters instantly |

</frozen-after-approval>

## Code Map

- `src/types/saved.ts` -- Define interfaces for `SavedEntityState`, `SavedCalculationRecord`, and bookmark types.
- `src/stores/useSavedStore.ts` -- Zustand store managing saved scheme IDs, saved partner IDs, and recent calculation records with `localStorage` persistence.
- `src/components/dashboard/ActiveJourneysCard.tsx` -- Summary component displaying active 8-stage application cards and milestone indicators.
- `src/components/dashboard/SavedSchemesCard.tsx` -- Grid of bookmarked schemes with quick compare and view triggers.
- `src/components/dashboard/SavedPartnersCard.tsx` -- Grid of saved partner branches with direct call and navigation actions.
- `src/components/dashboard/DocumentStatusCard.tsx` -- Readiness progress widget linking to `/documents`.
- `src/components/dashboard/RecentCalculationsCard.tsx` -- Preserved EMI and project cost budgets.
- `src/pages/DashboardPage.tsx` -- Central `/dashboard` page uniting all 6 cards and quick discovery launchpads.
- `src/components/schemes/SchemeCard.tsx` & `src/components/partners/PartnerCard.tsx` -- Integrate bookmark buttons.
- `src/App.tsx` & `src/components/layout/AppShell.tsx` -- Register `/dashboard` route and add navbar links.
- `src/i18n/en.json` & `src/i18n/hi.json` -- Localization strings for all dashboard sections, empty states, and bookmark notifications.

## Tasks & Acceptance

**Execution:**
- [x] `src/types/saved.ts` & `src/stores/useSavedStore.ts` -- Implement saved entity types and persistent Zustand store.
- [x] `src/components/schemes/SchemeCard.tsx` & `src/components/partners/PartnerCard.tsx` -- Add save/bookmark buttons.
- [x] `src/components/dashboard/` -- Build all 5 dashboard widget cards and quick launchpad.
- [x] `src/pages/DashboardPage.tsx` -- Build unified `/dashboard` page.
- [x] `src/App.tsx` & `src/components/layout/AppShell.tsx` -- Register route and navbar links.
- [x] `src/i18n/en.json` & `src/i18n/hi.json` -- Add complete localized strings in English and Hindi.

**Acceptance Criteria:**
- Given a user bookmarking schemes or partners, they appear instantly on `/dashboard`.
- Given active application journeys in progress, the dashboard displays current stage progress.
- Given empty states, helpful discovery guides and links to catalog/intake are shown.

## Spec Change Log

_None._

## Design Notes

- Clean grid layout with government trust styling, visual stats counters, and high contrast typography.
- One-click shortcuts to key portal workflows.

## Verification

**Commands:**
- `npm run lint` -- expected: zero errors across `src/`
- `npm run build` -- expected: clean TypeScript compilation and Vite build with no type errors

## Suggested Review Order

**Saved Entity Models & Zustand Store**

- Saved types for bookmarking schemes, partners, and calculations.
  [`saved.ts:1`](../../src/types/saved.ts#L1)

- Persistent Zustand store with localStorage support and reactive bookmarks.
  [`useSavedStore.ts:1`](../../src/stores/useSavedStore.ts#L1)

**Dashboard Widgets & Cards**

- Active application journey tracking summary card with 8-stage progress.
  [`ActiveJourneysCard.tsx:1`](../../src/components/dashboard/ActiveJourneysCard.tsx#L1)

- Bookmarked schemes card with quick compare & details actions.
  [`SavedSchemesCard.tsx:1`](../../src/components/dashboard/SavedSchemesCard.tsx#L1)

- Saved channel partners card with direct dial (`tel:`) and directions.
  [`SavedPartnersCard.tsx:1`](../../src/components/dashboard/SavedPartnersCard.tsx#L1)

- Document readiness and recent financial calculations cards.
  [`DocumentStatusCard.tsx:1`](../../src/components/dashboard/DocumentStatusCard.tsx#L1)
  [`RecentCalculationsCard.tsx:1`](../../src/components/dashboard/RecentCalculationsCard.tsx#L1)

- Quick discovery action launchpad.
  [`QuickLaunchpad.tsx:1`](../../src/components/dashboard/QuickLaunchpad.tsx#L1)

**Dashboard Page & AppShell Navigation**

- Central `/dashboard` page uniting all 6 sections.
  [`DashboardPage.tsx:1`](../../src/pages/DashboardPage.tsx#L1)

- Route registration and navbar links in AppShell.
  [`App.tsx:36`](../../src/App.tsx#L36)
  [`AppShell.tsx:36`](../../src/components/layout/AppShell.tsx#L36)

- English and Hindi localized dictionaries.
  [`en.json:1180`](../../src/i18n/en.json#L1180)
  [`hi.json:1180`](../../src/i18n/hi.json#L1180)
