## Context

Users need to browse and discover schemes independently, not just through the recommender. The scheme explorer provides search, filtering, and detailed scheme information — enabling users who already know what they're looking for to find it quickly. It depends on the scheme data model and Firebase architecture.

## Goals / Non-Goals

**Goals:**
- Build a scheme listing page at `/schemes` with search and multi-faceted filters
- Create a scheme detail page at `/schemes/:id` with comprehensive information sections
- Implement text search across scheme name, ministry, and purpose
- Support filters: category, state, income range, loan amount, purpose, education
- Sort by relevance, match score, and loan amount
- Design a reusable SchemeCard component with match score display
- Add CTAs for "Calculate My EMI" and "Find Partner"

**Non-Goals:**
- Advanced full-text search (use Firestore basic query for MVP)
- Map-based scheme visualization
- User reviews or ratings on schemes
- Batch compare multiple schemes side-by-side

## Decisions

- **Listing Architecture:** Paginated list with Firestore queries. Use cursor-based pagination for efficient infinite scroll or "Load More" pattern.
- **Search Implementation:** Client-side filtering for MVP with Firestore `where` clauses for structured filters. Text search uses Firestore `>=` and `<=` range queries on lowercased scheme name.
- **Filter State:** URL query parameters encode filter state for shareability and back-button support. Filters read from and written to URL search params.
- **Detail Page Sections:** Organized into collapsible sections: Overview, Eligibility, Financial Assistance, Documents, Channel Partners, Application Process, Source & Trust.
- **SchemeCard Design:** Shows scheme name, ministry, category badge, brief description, loan amount range, and optional match score. Compact for listing, expandable on hover/tap.
- **Route Structure:** `/schemes` for listing, `/schemes/:slug` for detail (using slug not ID for SEO and readability).

## Risks / Trade-offs

- **Search Quality:** Firestore lacks full-text search. Basic prefix matching is a compromise. Can upgrade to Algolia/Elasticsearch later if needed.
- **Filter Complexity:** Many filter dimensions increase query complexity. Start with the most impactful filters (category, state, income) and add more iteratively.
- **Performance:** Loading 50+ scheme cards may be slow. Use virtual scrolling or pagination to maintain performance.
- **Mobile UX:** Filter UI must work well on mobile. Use a slide-out filter panel or bottom sheet pattern.
