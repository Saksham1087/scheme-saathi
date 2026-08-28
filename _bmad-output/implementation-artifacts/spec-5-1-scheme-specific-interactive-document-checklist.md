---
title: 'Story 5.1: Scheme-Specific Interactive Document Checklist'
type: 'feature'
created: '2026-08-28'
status: 'done'
baseline_commit: 'a1cccfa4d0fbbf963e639ca6708dd2d4e8b8ae02'
review_loop_iteration: 0
context:
  - '_bmad-output/implementation-artifacts/epic-5-context.md'
  - '_bmad-output/planning-artifacts/architectures/architecture-scheme-saathi-2026-08-27/ARCHITECTURE-SPINE.md'
---

<frozen-after-approval reason="human-owned intent — do not modify unless human renegotiates">

## Intent

**Problem:** Loan applications at State Channelizing Agencies and banks are most frequently rejected or stalled due to missing or non-compliant statutory documentation, such as missing caste certificates, outdated income proofs, or incomplete project estimates.

**Approach:** Implement an interactive, scheme-aware **Document Readiness Checklist** page at `/documents` (and embeddable modal on scheme details/results) that generates the exact statutory document requirements based on scheme type (Micro-Credit, Term Loan, Mahila Samriddhi, Education Loan), tracks real-time readiness progress ("X of Y documents ready · Z% Complete"), persists check states in local storage via `useDocumentStore`, and supports offline printing/PDF export.

## Boundaries & Constraints

**Always:**
- Dynamic document generator tailoring requirements per scheme type:
  - Mandatory Base Docs: Identity Proof (Aadhaar / Voter ID), Address Proof, Caste Certificate (SC/ST/OBC), Family Income Proof / BPL Ration Card, Passport Size Photographs, Bank Passbook / Cancelled Cheque.
  - Category-Specific Docs:
    - *Micro Credit & Term Loan*: Detailed Project Quotations / Machinery Invoices, Vendor Estimate, Commercial Space Rent Agreement / Land Ownership Deed.
    - *Education Loan*: Admission Offer Letter, College Fee Schedule, 10th/12th Marksheets.
    - *Sanitation Scheme*: Urban Local Body (ULB) / Gram Panchayat Verification Certificate.
    - *Green Energy*: Solar / EV Vendor Technical Quotation & Feasibility Report.
- Track checklist progress in real time with dynamic progress bar and "Readiness Status" badge (e.g. *Not Started*, *In Progress*, *Ready to Apply*).
- Persist state across page refreshes in `useDocumentStore` (Zustand + `localStorage`).
- Provide one-click "Print Document Slip / Export Checklist" (`window.print()`) with print-optimized styling.
- Support 100% localization in English (`en`) and Hindi (`hi`).
- Maintain accessible WCAG AA touch targets (min 44x44px).

**Never:**
- Ask users to upload raw original government credentials without consent.
- Lose user checked document statuses when changing tabs.

## I/O & Edge-Case Matrix

| Scenario | Input / State | Expected Output / Behavior | Error Handling |
|----------|--------------|---------------------------|----------------|
| Scheme Switch | User selects "Education Loan Scheme" | Checklist dynamically re-renders with education-specific requirements (Admission Letter, Fee Schedule); preserves generic base doc checks | Seamless recalculation |
| Check Off Document | User clicks checkbox for "Caste Certificate" | Updates progress meter (e.g. 4/6 ready $\rightarrow$ 67%); saves to store; triggers readiness celebration badge when 100% | Instant state update |
| Print Checklist | User taps "Print Document Slip" | Triggers browser print dialog with formatted document checklist, issuing authority notes, and verification instructions | Media query `print:` styles |

</frozen-after-approval>

## Code Map

- `src/types/document.ts` -- Define interfaces for `RequiredDocument`, `DocumentCategory`, `DocumentReadinessState`, and `SchemeDocumentConfig`.
- `src/stores/useDocumentStore.ts` -- Zustand store managing active scheme selection, document checklist items, check states, notes, and local storage persistence.
- `src/lib/documentRules.ts` -- Statutory document catalog and scheme configuration mapper mapping scheme types to required document sets.
- `src/components/documents/DocumentChecklistItem.tsx` -- Interactive document item row with checkbox, description, issuing authority helper, required vs optional badge, and status.
- `src/components/documents/DocumentReadinessMeter.tsx` -- Progress bar and completion status badge (*Ready to Apply* when 100%).
- `src/pages/DocumentsPage.tsx` -- Dedicated `/documents` page with scheme selector, category tabs, print button, and quick partner locator bridge.
- `src/App.tsx` -- Register `/documents` route in React Router.
- `src/i18n/en.json` & `src/i18n/hi.json` -- Complete localization for all document names, issuing authorities, guidance notes, and readiness statuses.

## Tasks & Acceptance

**Execution:**
- [x] `src/types/document.ts` & `src/stores/useDocumentStore.ts` -- Implement document types and persistent Zustand checklist store.
- [x] `src/lib/documentRules.ts` -- Build scheme-aware document mapping engine with issuing authorities and guidance notes.
- [x] `src/components/documents/DocumentChecklistItem.tsx` -- Build accessible checklist item component with touch targets.
- [x] `src/components/documents/DocumentReadinessMeter.tsx` -- Build progress bar and readiness badge.
- [x] `src/pages/DocumentsPage.tsx` -- Build dedicated `/documents` page with scheme selector and print styles.
- [x] `src/App.tsx` -- Register `/documents` route in React Router.
- [x] `src/i18n/en.json` & `src/i18n/hi.json` -- Add complete localized strings in English and Hindi.

**Acceptance Criteria:**
- Given a selected scheme, the exact statutory documents are displayed with issuing authorities.
- Given checked items, the progress meter and readiness badge update synchronously.
- Given page refresh or return visit, checklist state is preserved.
- Given print trigger, a clean printable document readiness slip is produced.

## Spec Change Log

_None._

## Design Notes

- High-contrast checkboxes with large click targets for mobile users.
- Clear issuing authority guidance (e.g. *Tehsildar / SDO for Caste Certificate*, *Bank Branch for Statement*).

## Verification

**Commands:**
- `npm run lint` -- expected: zero errors across `src/`
- `npm run build` -- expected: clean TypeScript compilation and Vite build with no type errors

## Suggested Review Order

**Types, Catalog & Rule Engine**

- Document data contracts and types.
  [`document.ts:1`](../../src/types/document.ts#L1)

- Statutory document rules engine and scheme configuration mappings.
  [`documentRules.ts:1`](../../src/lib/documentRules.ts#L1)

- Persistent Zustand checklist store with localStorage support.
  [`useDocumentStore.ts:1`](../../src/stores/useDocumentStore.ts#L1)

**Interactive UI Components**

- Checklist item component with touch targets, issuing authority notes, and custom notes editor.
  [`DocumentChecklistItem.tsx:1`](../../src/components/documents/DocumentChecklistItem.tsx#L1)

- Real-time readiness meter progress bar and status badge.
  [`DocumentReadinessMeter.tsx:1`](../../src/components/documents/DocumentReadinessMeter.tsx#L1)

- Embeddable document checklist modal for scheme details & results pages.
  [`DocumentChecklistModal.tsx:1`](../../src/components/documents/DocumentChecklistModal.tsx#L1)

**Page, Routing & Localization**

- Dedicated `/documents` page with scheme switcher, category tabs, and offline print slip layout.
  [`DocumentsPage.tsx:1`](../../src/pages/DocumentsPage.tsx#L1)

- Route registration and navbar link in AppShell.
  [`App.tsx:30`](../../src/App.tsx#L30)
  [`AppShell.tsx:35`](../../src/components/layout/AppShell.tsx#L35)

- English and Hindi localized dictionaries.
  [`en.json:800`](../../src/i18n/en.json#L800)
  [`hi.json:800`](../../src/i18n/hi.json#L800)
