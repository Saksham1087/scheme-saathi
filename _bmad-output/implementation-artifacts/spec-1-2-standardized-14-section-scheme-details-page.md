---
title: 'Story 1.2: Standardized 14-Section Scheme Details Page'
type: 'feature'
created: '2026-08-27'
status: 'done'
baseline_commit: '4a6b17ebc162be4efd9d4dc84fed260d06eaf625'
review_loop_iteration: 0
context:
  - '_bmad-output/implementation-artifacts/epic-1-context.md'
  - '_bmad-output/implementation-artifacts/spec-1-1-faceted-scheme-catalog-multi-dimension-filtering.md'
---

<frozen-after-approval reason="human-owned intent — do not modify unless human renegotiates">

## Intent

**Problem:** Beneficiaries and community volunteers who click on a scheme from the catalog currently encounter no details page or inconsistent information formats across ministry websites, causing confusion about loan limits, interest moratoriums, and required paperwork.

**Approach:** Implement a comprehensive, standardized 14-section Scheme Details page on `/schemes/:id` rendering all statutory scheme information (Overview, Eligibility, Financial Assistance, Interest Rate, Loan Limits, Moratorium, Repayment, Required Documents, Who Can Apply, Channel Partners, Application Process, Official Source Link, Last Updated Date, Official Disclaimer) with unverified data guardrails and direct pre-fill CTAs to EMI calculators and partner locators.

## Boundaries & Constraints

**Always:**
- Render all 14 standardized sections explicitly or show clear section fallback states.
- If any data field or scheme is unverified, prominently display "Information not independently verified" / "यह जानकारी स्वतंत्र रूप से सत्यापित नहीं है".
- Support deep-linking action CTAs that navigate to `/calculator` and `/partners` with full pre-filled scheme parameters.
- Ensure 100% localization in English (`en`) and Hindi (`hi`).
- Maintain accessible WCAG AA touch targets (min 44x44px) and responsive single-column to 2-column layouts with a sticky table-of-contents / quick-actions card on desktop.

**Ask First:**
- Adding external tracking scripts or modifying global authentication guard behavior for public scheme browsing.

**Never:**
- Hardcode private ministerial API endpoints without fallback to Firestore/seed datasets.
- Omit the mandatory official government disclaimer on any scheme detail view.

## I/O & Edge-Case Matrix

| Scenario | Input / State | Expected Output / Behavior | Error Handling |
|----------|--------------|---------------------------|----------------|
| Known Scheme URL | Navigate to `/schemes/micro-finance` or `/schemes/mahila-samriddhi` | Renders full 14-section details view with financial metrics, document checklist, partner types, and official source link | If network fails, loads cached/seed scheme seamlessly |
| Unknown Scheme ID | Navigate to `/schemes/non-existent-id` | Displays clean "Scheme Not Found" card with "Browse All Schemes" CTA | Returns HTTP-compatible 404 UI state without crashing |
| Action Navigation | User clicks "Calculate EMI" or "Find Channel Partners" | Routes to `/calculator?amount=...&rate=...` or `/partners?type=...` with scheme context pre-filled | Retains active values in target page |
| Unverified Field Fallback | Scheme document has missing officialSource or isVerified=false | Renders warning badge "Information not independently verified" and safe fallback copy | Avoids throwing null reference errors |

</frozen-after-approval>

## Code Map

- `src/types/index.ts` -- Extend `Scheme` interface with 14-section detailed fields: `eligibilityCriteria`, `financialAssistance`, `loanLimits`, `moratoriumDetails`, `repaymentTerms`, `requiredDocumentsList`, `whoCanApply`, `channelPartnersInfo`, `applicationProcessSteps`, `officialSourceUrl`, `sourceLastUpdated`, `disclaimerText`.
- `src/services/schemeService.ts` -- Ensure `fetchSchemeById(id)` resolves extended 14-section schema with offline seed dataset enrichment.
- `src/components/schemes/SchemeSectionCard.tsx` -- Accessible section container component with icon, title, badge, and content slot.
- `src/components/schemes/SchemeDetailsHeader.tsx` -- Hero header displaying Ministry, Scheme Name, Verified Badge, Category, and quick stats ribbon.
- `src/components/schemes/SchemeActionSidebar.tsx` -- Sticky quick-actions card with "Calculate EMI", "Find Partners", "Print / Share", and Document checklist jump link.
- `src/pages/SchemeDetailsPage.tsx` -- Main `/schemes/:id` page composing header, 14 structured sections, table of contents navigation, and action sidebar.
- `src/App.tsx` -- Register route `/schemes/:id` mapped to `SchemeDetailsPage`.
- `src/i18n/en.json` & `src/i18n/hi.json` -- Add localization strings for all 14 sections, labels, unverified notices, and action buttons.

## Tasks & Acceptance

**Execution:**
- [x] `src/types/index.ts` -- Add 14-section structured properties to `Scheme` interface and supporting sub-types.
- [x] `functions/src/data/schemes.seed.json` & `src/services/schemeService.ts` -- Enrich scheme records with complete 14-section details and update `fetchSchemeById`.
- [x] `src/components/schemes/SchemeDetailsHeader.tsx` -- Build responsive header with government verification badge and key metric cards.
- [x] `src/components/schemes/SchemeSectionCard.tsx` -- Build reusable section card component with accessible anchors.
- [x] `src/components/schemes/SchemeActionSidebar.tsx` -- Build desktop sticky action card with pre-filled EMI calculator, Partner locator, and print button.
- [x] `src/pages/SchemeDetailsPage.tsx` -- Assemble 14 standardized sections with smooth scroll TOC and responsive layout.
- [x] `src/App.tsx` -- Register `/schemes/:id` route in React Router.
- [x] `src/i18n/en.json` & `src/i18n/hi.json` -- Add all 14-section localization keys in English and Hindi.

**Acceptance Criteria:**
- Given a user clicks a scheme card on `/schemes` or visits `/schemes/:id`, when the page loads, all 14 standardized sections are rendered with verified government metadata.
- Given an unverified data field, when rendered, the badge "Information not independently verified" is displayed.
- Given a user clicks "Calculate EMI", the browser navigates to `/calculator` with pre-filled loan amount, interest rate, tenure, and moratorium.
- Given a user clicks "Find Partners", the browser navigates to `/partners` filtered by the scheme's compatible channel partner types.
- Given an invalid scheme ID, a graceful "Scheme Not Found" card with a link back to `/schemes` is shown.

## Spec Change Log

_None._

## Design Notes

- The 14 sections are grouped logically:
  1. Overview & Objectives
  2. Who Can Apply & Target Beneficiaries
  3. Eligibility Criteria Matrix (Caste, Income ceiling, Age, Gender, Education)
  4. Financial Assistance & Coverage %
  5. Interest Rate & Concessions
  6. Loan Limits & Project Cost Caps
  7. Moratorium Period & Interest Accrual Policy
  8. Repayment Schedule & Tenure
  9. Required Documents Checklist Preview
  10. Authorized Channel Partners (SCAs, PSBs, RRBs, NBFC-MFIs)
  11. Step-by-Step Application Process
  12. Official Source Attribution Link
  13. Last Updated & Verification Timestamp
  14. Statutory Disclaimer
- High contrast, accessible typography with sticky quick-navigation bar on desktop.

## Verification

**Commands:**
- `npm run lint` -- expected: zero errors across `src/`
- `npm run build` -- expected: clean TypeScript compilation and Vite build with no type errors

## Suggested Review Order

**Details Page Layout & 14 Standardized Sections**

- Main Scheme Details page composing all 14 statutory sections, smooth scrollspy TOC, and unverified warning banners.
  [`SchemeDetailsPage.tsx:37`](../../src/pages/SchemeDetailsPage.tsx#L37)

- Application routing registering `/schemes/:id` route.
  [`App.tsx:22`](../../src/App.tsx#L22)

**Scheme Details UI Components & Sticky Action Navigation**

- Hero header with ministry breadcrumbs, government verification badges, and 4-metric summary ribbon.
  [`SchemeDetailsHeader.tsx:24`](../../src/components/schemes/SchemeDetailsHeader.tsx#L24)

- Accessible section card container component with numbered badges and unverified indicators.
  [`SchemeSectionCard.tsx:16`](../../src/components/schemes/SchemeSectionCard.tsx#L16)

- Sticky quick actions card with pre-filled EMI Calculator link, Channel Partner locator, print trigger, and scrollspy TOC.
  [`SchemeActionSidebar.tsx:24`](../../src/components/schemes/SchemeActionSidebar.tsx#L24)

**Extended Schema, Resilient Data Service & Localization**

- Extended 14-section TypeScript interfaces and models.
  [`types/index.ts:51`](../../src/types/index.ts#L51)

- Resilient scheme data retrieval with deep-merge Firestore snapshot and offline seed fallback.
  [`schemeService.ts:33`](../../src/services/schemeService.ts#L33)

- Complete bilingual localization strings for 14 sections, unverified badges, and action labels.
  [`en.json:302`](../../src/i18n/en.json#L302)
  [`hi.json:302`](../../src/i18n/hi.json#L302)
