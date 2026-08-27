# Epic 1 Context: Scheme Discovery & Faceted Explorer

<!-- Compiled from planning artifacts. Edit freely. Regenerate with compile-epic-context if planning docs change. -->

## Goal

Enable citizens and community volunteers to discover, search, filter across multi-dimensional criteria, inspect comprehensive 14-section standardized scheme details pages, and compare multiple schemes side-by-side on `/schemes` without cognitive overload or fragmented government navigation.

## Stories

- Story 1.1: Faceted Scheme Catalog & Multi-Dimension Filtering
- Story 1.2: Standardized 14-Section Scheme Details Page
- Story 1.3: Multi-Scheme Side-by-Side Comparison Matrix

## Requirements & Constraints

- Scheme catalog on `/schemes` must support 7 filter dimensions: Category, State, Annual Family Income, Loan/Assistance Amount range, Purpose, Education, and Sorting (Alphabetical, Max Assistance, Interest Rate, Lowest Income Limit).
- Dynamic client-side filtering and keyword text search must execute in < 100ms.
- Scheme cards must clearly display: Scheme Name, Ministry/Department, Purpose, Max Assistance Amount, Interest Rate, and Category badge.
- Scheme Details page (`/schemes/:id`) must render 14 standardized sections: Overview, Eligibility, Financial Assistance, Interest Rate, Loan Limits, Moratorium, Repayment, Required Documents, Who Can Apply, Channel Partners, Application Process, Official Source Link, Last Updated Date, and Official Disclaimer.
- If any scheme field or data point is unverified, UI must render: "Information not independently verified".
- Quick CTAs on scheme details must navigate to "Calculate EMI" (`/calculator`) or "Find Partner" (`/partners`) pre-populated with the scheme's context.
- Comparison matrix on `/compare` or floating tray must support 2 to 3 selected schemes with sticky-header table rows comparing Purpose, Max Assistance, Interest Rate Range, Moratorium, and Required Documents.

## Technical Decisions

- Pure TypeScript schema types for `Scheme` and `SchemeFilterState` matching the Firestore `schemes` collection schema.
- Data fetching from Cloud Firestore `schemes` collection with offline-first caching and fallback mock seed data (`scripts/seed.ts` / local seed datasets) when running unauthenticated or offline.
- Reactive filter and comparison state managed via Zustand store (`src/stores/useSchemeStore.ts` / `useComparisonStore.ts`).
- Routing structure via React Router v6: `/schemes` (catalog), `/schemes/:id` (details), `/compare` (side-by-side matrix).
- Full localization keys across English, Hindi, and Marathi (`src/locales/en.json`, `hi.json`, `mr.json`) with `react-i18next`.
- High contrast, accessible WCAG AA touch targets (min 44x44px) styled with Tailwind CSS v4 and Lucide React icons.

## UX & Interaction Patterns

- High-contrast responsive layout (single-column collapsible filter drawer on mobile, persistent left sidebar on desktop).
- Instant live search input with clear button and active filter pills with one-click removal.
- Floating comparison bar appearing at the bottom of the viewport when >= 1 scheme is selected for comparison, with a badge counter (e.g., "Compare 2/3 schemes") and "Compare Now" button.
- Clean typography and visual hierarchy using badge tags for categories and government ministries.

## Cross-Story Dependencies

- Story 1.1 establishes the primary `Scheme` data models, mock/Firestore scheme services, and catalog listing UI.
- Story 1.2 deep-links from cards in Story 1.1 to the 14-section details view (`/schemes/:id`).
- Story 1.3 consumes selected scheme IDs from Story 1.1 & 1.2 into the comparison matrix.
