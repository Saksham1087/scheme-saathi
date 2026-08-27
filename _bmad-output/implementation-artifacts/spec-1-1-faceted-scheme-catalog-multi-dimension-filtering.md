---
title: 'Story 1.1: Faceted Scheme Catalog & Multi-Dimension Filtering'
type: 'feature'
created: '2026-08-27'
status: 'done'
baseline_commit: '68181b46d677c488347ef6b4bfb14a344e78b5d8'
review_loop_iteration: 0
context:
  - '_bmad-output/implementation-artifacts/epic-1-context.md'
---

<frozen-after-approval reason="human-owned intent — do not modify unless human renegotiates">

## Intent

**Problem:** Eligible citizens and community facilitators cannot easily discover or explore central and state financial assistance programs because existing schemes lack a unified, multi-dimensional search and faceted filtering interface.

**Approach:** Implement a high-performance, client-side faceted catalog on `/schemes` with 7 filter dimensions (Category, State, Income, Amount Range, Purpose, Education, Sorting), instant keyword search, and responsive scheme cards with clear assistance metadata and category badges.

## Boundaries & Constraints

**Always:**
- Keep filter response times strictly under 100ms for instant client-side interaction.
- Display verified scheme cards showing Scheme Name, Ministry/Department, Purpose, Max Assistance Amount, Interest Rate, and Category badge.
- Support full localization across English and Hindi (`en`, `hi`) and prepare Marathi keys in `react-i18next`.
- Provide high-contrast, accessible touch targets (min 44x44px) and responsive layouts (mobile filter drawer / desktop sidebar).
- Support fallback to local enriched seed datasets when Firestore is offline or unauthenticated.

**Ask First:**
- Modifying core shared types in `src/types/index.ts` that could break existing intake or calculator stores.

**Never:**
- Hardcode external Google Maps or proprietary API keys.
- Store or request user PII (Aadhaar, biometric, or bank details) during scheme browsing.
- Use non-deterministic AI generation for catalog filtering or sorting.

## I/O & Edge-Case Matrix

| Scenario | Input / State | Expected Output / Behavior | Error Handling |
|----------|--------------|---------------------------|----------------|
| Active Multi-Filter | Category="Business", State="Maharashtra", MaxCost=₹2,00,000 | Displays only schemes matching all active dimensions; shows count (e.g., "3 schemes found") | If 0 results, show "No matching schemes found" with a "Reset Filters" button |
| Live Keyword Search | Query="tailoring" or "micro" | Dynamically filters schemes matching name, description, or purpose in < 50ms | Clear button resets query immediately |
| Sorting Switch | SortBy="max_amount_desc" / "rate_asc" | Reorders scheme cards instantly according to numerical criteria | Retains active filter state |
| Category Quick Pills | User taps "Education" pill at top | Sets category filter to "Education" and updates URL search params and catalog list | Toggle off resets category filter |

</frozen-after-approval>

## Code Map

- `src/types/index.ts` -- Extend `Scheme` schema with ministry, state, purpose tags, category definitions, and create `SchemeFilterState` interface.
- `src/stores/useSchemeStore.ts` -- Zustand store managing cached schemes, active filter dimensions, search query, sorting order, and derived filtered scheme list.
- `src/services/schemeService.ts` -- Data service to fetch schemes from Firestore `schemes` collection with offline fallback to enriched seed data.
- `src/components/schemes/SchemeFilterSidebar.tsx` -- Desktop sidebar and mobile sheet/drawer with sliders, checkboxes, and select dropdowns for 7 filter dimensions.
- `src/components/schemes/SchemeCard.tsx` -- Accessible, high-contrast card component displaying scheme metadata, category badge, and action CTAs.
- `src/components/schemes/SchemeSearchBar.tsx` -- Search input with debounce/instant filtering, active filter tags/pills, and clear action.
- `src/pages/SchemesCatalog.tsx` -- Main catalog view at `/schemes` composing search bar, filters, scheme grid, and empty state.
- `src/App.tsx` & `src/components/layout/AppShell.tsx` -- Add `/schemes` route and header navigation link.
- `src/i18n/en.json` & `src/i18n/hi.json` -- Localization strings for scheme filters, categories, and catalog copy.

## Tasks & Acceptance

**Execution:**
- [x] `src/types/index.ts` -- Define comprehensive `Scheme`, `SchemeCategory`, `SchemeFilterState`, and sort types.
- [x] `src/services/schemeService.ts` -- Create scheme retrieval service with Firestore read and enriched local dataset fallback.
- [x] `src/stores/useSchemeStore.ts` -- Create Zustand store with faceted filtering, multi-dimension match logic, and sort actions.
- [x] `src/components/schemes/SchemeCard.tsx` -- Build accessible scheme card with badges, financial highlights, and link to details.
- [x] `src/components/schemes/SchemeFilterSidebar.tsx` -- Implement multi-facet filtering controls (Category, State, Income, Amount, Purpose, Education, Sort).
- [x] `src/components/schemes/SchemeSearchBar.tsx` -- Implement search input with active filter pills and clear all button.
- [x] `src/pages/SchemesCatalog.tsx` -- Build `/schemes` catalog page with responsive layout, count indicator, and zero-state handling.
- [x] `src/App.tsx` & `src/components/layout/AppShell.tsx` -- Register `/schemes` route and add "Browse Schemes" to desktop and mobile navigation.
- [x] `src/i18n/en.json` & `src/i18n/hi.json` -- Add localization strings for all new catalog and filter elements.

**Acceptance Criteria:**
- Given a user visits `/schemes`, when the page loads, all verified schemes are rendered with badges and metadata.
- Given active filters (e.g., Category: "Business", Amount: "Up to ₹1.5L"), when applied, the list updates in < 100ms.
- Given a text search keyword, when entered, cards match dynamically across title, description, and keywords.
- Given responsive viewports, when on mobile, filters collapse into an accessible drawer with clear touch targets.

## Spec Change Log

_None._

## Design Notes

- Filter evaluation is executed purely client-side on the loaded scheme array to guarantee < 100ms response.
- Color coding and badges follow the design system with WCAG AA compliance (Tailwind v4 tokens).

## Verification

**Commands:**
- `npm run lint` -- expected: zero errors across `src/`
- `npm run build` -- expected: clean TypeScript compilation and Vite build with no type errors

## Suggested Review Order

**Catalog View & Entry Point**

- Main catalog view composing search bar, responsive sidebar drawer, and scheme grid.
  [`SchemesCatalog.tsx:25`](../../src/pages/SchemesCatalog.tsx#L25)

- Application routes registering `/schemes` endpoint.
  [`App.tsx:18`](../../src/App.tsx#L18)

- Header navigation bar link for Scheme Catalog.
  [`AppShell.tsx:54`](../../src/components/layout/AppShell.tsx#L54)

**State Management & Multi-Dimension Filtering Engine**

- Zustand store managing 7 filter dimensions, keyword search, and sub-millisecond client filtering.
  [`useSchemeStore.ts:40`](../../src/stores/useSchemeStore.ts#L40)

- Pure selector helper function executing multi-token search, criteria matching, and sorting.
  [`useSchemeStore.ts:176`](../../src/stores/useSchemeStore.ts#L176)

**UI Components & Interaction**

- Accessible WCAG AA Scheme Card with badges, financial highlights, and deep-link CTAs.
  [`SchemeCard.tsx:24`](../../src/components/schemes/SchemeCard.tsx#L24)

- Multi-facet filter controls with sliders, checkboxes, and select dropdowns.
  [`SchemeFilterSidebar.tsx:14`](../../src/components/schemes/SchemeFilterSidebar.tsx#L14)

- Search bar with instant tokenized keyword filtering and active filter dismiss pills.
  [`SchemeSearchBar.tsx:20`](../../src/components/schemes/SchemeSearchBar.tsx#L20)

**Data Services, Types & Localization**

- Firestore service with offline-resilient seed dataset fallback.
  [`schemeService.ts:16`](../../src/services/schemeService.ts#L16)

- Extended Scheme data models, filter states, and sort options.
  [`types/index.ts:23`](../../src/types/index.ts#L23)

- Localized strings for catalog, categories, and filter dimensions in English and Hindi.
  [`en.json:245`](../../src/i18n/en.json#L245)
  [`hi.json:245`](../../src/i18n/hi.json#L245)
