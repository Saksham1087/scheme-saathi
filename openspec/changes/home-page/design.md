## Context

Scheme Sathi needs a landing page as the primary entry point for SC beneficiaries seeking government schemes. The page must communicate the value proposition instantly, establish trust through official attribution, and guide users toward the "Find My Scheme" flow. Users have limited digital literacy, so the design must be clear, accessible, and supportive of multiple languages (Hindi, Marathi, English).

## Goals / Non-Goals

**Goals:**
- Deliver a hero section with primary CTA "Find My Scheme" and secondary CTAs
- Explain the product journey via a 5-step visual "How It Works" flow
- Showcase core features (Smart Matching, Financial Calculator, Partner Locator, Voice Assistant, DigiLocker)
- Display popular/featured schemes and a financial literacy section
- Provide FAQ, trust attribution, and a responsive footer
- Support mobile-first responsive design with Tailwind CSS
- Integrate language selector in the header

**Non-Goals:**
- Building the scheme recommendation engine (covered by other changes)
- Implementing the financial calculator logic (existing feature)
- Partner locator map implementation (separate change)
- Backend integration for dynamic scheme data on home page

## Decisions

- **Component Architecture:** Each section (Hero, HowItWorks, FeatureShowcase, PopularSchemes, FAQ, TrustSection) will be a separate React component composed into a `Home.tsx` page component.
- **Styling:** Tailwind CSS with Scheme Sathi design tokens for consistent theming and easy dark mode / accessibility support later.
- **State Management:** Home page is primarily static/compositional; no complex state management needed. Language selection triggers re-render via i18n context.
- **Routing:** Home page at route `/` with React Router. Navbar and Footer shared across all pages.
- **Accessibility:** Semantic HTML, ARIA labels, keyboard navigation, and sufficient color contrast ratios. Font size controls integrated via i18n/accessibility system.

## Risks / Trade-offs

- **Static vs Dynamic Content:** Popular schemes section may initially use hardcoded seed data before Firebase integration is complete. This is acceptable for MVP.
- **Performance:** Multiple above-the-fold sections may impact load time. Mitigate with lazy loading for below-fold sections and optimized images.
- **Language Completeness:** Home page strings will be in English first, with Hindi/Marathi translations added incrementally via the multilingual system.
