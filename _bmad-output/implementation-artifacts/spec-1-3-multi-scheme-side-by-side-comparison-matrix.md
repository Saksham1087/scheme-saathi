---
title: 'Story 1.3: Multi-Scheme Side-by-Side Comparison Matrix'
type: 'feature'
created: '2026-08-27'
status: 'done'
baseline_commit: '6ae47bb534a00cc3745552de181bb318db535dcd'
review_loop_iteration: 0
context:
  - '_bmad-output/implementation-artifacts/epic-1-context.md'
  - '_bmad-output/implementation-artifacts/spec-1-1-faceted-scheme-catalog-multi-dimension-filtering.md'
  - '_bmad-output/implementation-artifacts/spec-1-2-standardized-14-section-scheme-details-page.md'
---

<frozen-after-approval reason="human-owned intent — do not modify unless human renegotiates">

## Intent

**Problem:** Beneficiaries and facilitators evaluating multiple schemes often struggle to compare subtle trade-offs—such as a scheme with a lower interest rate versus one with a higher subsidy percentage or longer moratorium—without flipping between multiple pages.

**Approach:** Implement a comparison system allowing users to select 2 to 4 schemes from the catalog or details pages, managed via a persistent `useCompareStore`, accompanied by a persistent floating comparison tray and a dedicated `/compare` Comparison Matrix page featuring side-by-side row-by-row comparisons, a "Highlight Differences" toggle, remove/add triggers, and deep-linkable URLs (`/compare?schemes=id1,id2,id3`).

## Boundaries & Constraints

**Always:**
- Allow selecting between 2 and 4 schemes simultaneously. Show a floating dock / tray when at least 1 scheme is selected.
- Provide a responsive side-by-side comparison table on `/compare` with horizontal scroll on small viewports and sticky scheme headers.
- Include a "Highlight Differences" toggle that applies distinct visual contrast to rows where values diverge between schemes.
- Support deep-linking `/compare?schemes=id1,id2` so comparison matrices can be shared via URL.
- Support 100% localization in English (`en`) and Hindi (`hi`).
- Maintain accessible WCAG AA touch targets (min 44x44px).

**Ask First:**
- Modifying global navigation routes beyond adding `/compare`.

**Never:**
- Allow selecting more than 4 schemes (display toast warning when user attempts a 5th).
- Lose user comparison selection when navigating between `/schemes`, `/schemes/:id`, and `/compare`.

## I/O & Edge-Case Matrix

| Scenario | Input / State | Expected Output / Behavior | Error Handling |
|----------|--------------|---------------------------|----------------|
| Add to Compare | User clicks "Compare" checkbox/button on a card | Scheme added to `useCompareStore`; floating comparison tray appears at bottom of screen with count badge | If already 4 schemes selected, toast: "You can compare up to 4 schemes" |
| Open Comparison Matrix | User clicks "Compare Now" on dock or navigates to `/compare?schemes=micro-credit,term-loan` | Displays comparison matrix with 2–4 side-by-side columns comparing 12 key financial and eligibility dimensions | If < 2 schemes, displays empty/prompt state: "Select at least 2 schemes to compare" with CTA to browse catalog |
| Difference Highlighting | User toggles "Highlight Differences" switch | Rows with differing values across schemes receive visual highlight (background accent tint); identical rows remain neutral | Toggle off resets all row backgrounds to neutral |
| Remove from Compare | User clicks "Remove (X)" on column header or dock thumbnail | Scheme is removed from comparison; matrix re-renders with remaining columns; URL params update | If count drops below 2 on `/compare`, shows add more prompt |
| Share Comparison | User clicks "Share Comparison" on `/compare` | URL copied to clipboard containing `?schemes=id1,id2` query parameter | Web Share API fallback to clipboard |

</frozen-after-approval>

## Code Map

- `src/stores/useCompareStore.ts` -- Zustand store managing selected scheme IDs (2–4), drawer visibility, add/remove/clear actions, and URL sync.
- `src/components/schemes/SchemeCompareTray.tsx` -- Floating bottom bar showing selected scheme chips, count, clear all, and "Compare Now" CTA button.
- `src/components/schemes/SchemeCard.tsx` -- Add "Compare" toggle checkbox to catalog scheme cards.
- `src/components/schemes/SchemeDetailsHeader.tsx` & `src/components/schemes/SchemeActionSidebar.tsx` -- Add "Add to Compare" button on scheme details view.
- `src/pages/ComparePage.tsx` -- Dedicated comparison matrix page at `/compare` with sticky column headers, 12 comparison dimensions, difference highlighter, print, and share.
- `src/App.tsx` & `src/components/layout/AppShell.tsx` -- Register `/compare` route in React Router and render `SchemeCompareTray` globally in `AppShell`.
- `src/i18n/en.json` & `src/i18n/hi.json` -- Localization strings for compare tray, table headers, difference toggles, and empty states.

## Tasks & Acceptance

**Execution:**
- [x] `src/stores/useCompareStore.ts` -- Implement Zustand store with max-4 constraint, local storage persistence, and URL query synchronization.
- [x] `src/components/schemes/SchemeCompareTray.tsx` -- Build floating bottom tray with thumbnail chips, remove buttons, and "Compare (N)" CTA.
- [x] `src/components/schemes/SchemeCard.tsx` -- Integrate "Compare" toggle on catalog cards.
- [x] `src/components/schemes/SchemeActionSidebar.tsx` -- Integrate "Add to Compare" button in details sidebar.
- [x] `src/pages/ComparePage.tsx` -- Build `/compare` view with 12 structured comparison rows, difference highlighting, and quick action CTAs.
- [x] `src/App.tsx` & `src/components/layout/AppShell.tsx` -- Register `/compare` route and render global `SchemeCompareTray`.
- [x] `src/i18n/en.json` & `src/i18n/hi.json` -- Add all comparison localization strings in English and Hindi.

**Acceptance Criteria:**
- Given a user on `/schemes` or `/schemes/:id`, when they click "Compare", the floating tray appears with the selected scheme.
- Given 2 to 4 schemes in comparison, when `/compare` is visited, all 12 comparison dimensions are rendered in side-by-side columns.
- Given "Highlight Differences" is toggled on, rows where values diverge across schemes are visually highlighted.
- Given a user shares `/compare?schemes=micro-credit,term-loan`, another user opening the link sees both schemes pre-loaded in comparison.

## Spec Change Log

_None._

## Design Notes

- The 12 comparison dimensions:
  1. Category & Type
  2. Ministry / Governing Corporation
  3. Max Project Cost / Assistance Cap
  4. Corporation Coverage Share %
  5. Promoter / Beneficiary Margin %
  6. Interest Rate Range (p.a.)
  7. Special Rebates & Concessions
  8. Moratorium Period & Interest Accrual
  9. Repayment Tenure Range
  10. Income Ceiling & Caste Eligibility
  11. Key Mandatory Documents
  12. Authorized Channel Partners
- Clean sticky horizontal table layout with difference highlighting for fast decision making.

## Verification

**Commands:**
- `npm run lint` -- expected: zero errors across `src/`
- `npm run build` -- expected: clean TypeScript compilation and Vite build with no type errors

## Suggested Review Order

**State Management & Tray Component**

- Zustand comparison store managing 2–4 scheme selections, local storage persistence, and limit toasts.
  [`useCompareStore.ts:16`](../../src/stores/useCompareStore.ts#L16)

- Floating compare dock with selected chips, remove buttons, and compare now action.
  [`SchemeCompareTray.tsx:13`](../../src/components/schemes/SchemeCompareTray.tsx#L13)

**Comparison Matrix Page & 12 Comparison Dimensions**

- Side-by-side comparison page with difference highlighting, shareable deep-linking URL params, print support, and 12 structured dimensions.
  [`ComparePage.tsx:55`](../../src/pages/ComparePage.tsx#L55)

**Card & Details Page Triggers**

- Scheme card compare toggle checkbox and active styling.
  [`SchemeCard.tsx:28`](../../src/components/schemes/SchemeCard.tsx#L28)

- Scheme details header and action sidebar compare toggle buttons.
  [`SchemeDetailsHeader.tsx:28`](../../src/components/schemes/SchemeDetailsHeader.tsx#L28)
  [`SchemeActionSidebar.tsx:25`](../../src/components/schemes/SchemeActionSidebar.tsx#L25)

**Routing & Bilingual Localization**

- Route registration for `/compare` and global tray rendering.
  [`App.tsx:22`](../../src/App.tsx#L22)
  [`AppShell.tsx:132`](../../src/components/layout/AppShell.tsx#L132)

- English and Hindi comparison strings and labels.
  [`en.json:406`](../../src/i18n/en.json#L406)
  [`hi.json:406`](../../src/i18n/hi.json#L406)

