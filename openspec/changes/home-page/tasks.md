## 1. Project Setup & Layout

- [x] 1.1 Create `src/pages/Home.tsx` as the composed home page component
- [x] 1.2 Set up route `/` in React Router for the home page
- [x] 1.3 Create shared Navbar component with mobile hamburger menu
- [x] 1.4 Create shared Footer component with links and accessibility controls
- [x] 1.5 Integrate language selector dropdown in the Navbar header
- [x] 1.6 Verify responsive layout works across mobile and desktop breakpoints

## 2. Hero Section

- [x] 2.1 Create `Hero.tsx` component with primary CTA "Find My Scheme"
- [x] 2.2 Add secondary CTAs (e.g. "How It Works", "View Schemes")
- [x] 2.3 Add hero background imagery or illustration with alt text
- [x] 2.4 Ensure hero section meets color contrast and ARIA label requirements
- [x] 2.5 Extract all hero strings to translation keys (`home.hero.*`)

## 3. How It Works Section

- [x] 3.1 Create `HowItWorks.tsx` component with 5-step visual flow
- [x] 3.2 Design step cards with icons/illustrations and short descriptions
- [x] 3.3 Ensure steps are displayed as a responsive horizontal/vertical flow
- [x] 3.4 Extract all How It Works strings to translation keys (`home.howItWorks.*`)

## 4. Feature Showcase Section

- [x] 4.1 Create `FeatureShowcase.tsx` component with feature cards
- [x] 4.2 Add cards for Smart Matching, Financial Calculator, Partner Locator, Voice Assistant, DigiLocker
- [x] 4.3 Link each feature card to its respective route or CTA
- [x] 4.4 Extract all feature showcase strings to translation keys (`home.features.*`)

## 5. Popular Schemes Section

- [x] 5.1 Create `PopularSchemes.tsx` component with scheme card grid
- [x] 5.2 Use hardcoded seed data for MVP before Firebase integration
- [x] 5.3 Each scheme card shows name, ministry, brief description, and category badge
- [x] 5.4 Add "View All Schemes" CTA linking to `/schemes`
- [x] 5.5 Extract all strings to translation keys (`home.popularSchemes.*`)

## 6. Financial Literacy & FAQ Sections

- [x] 6.1 Create `FinancialLiteracy.tsx` section with educational content
- [x] 6.2 Create `FAQ.tsx` component with collapsible accordion items
- [x] 6.3 Ensure FAQ items are keyboard accessible with ARIA attributes
- [x] 6.4 Extract all strings to translation keys (`home.faq.*`, `home.financialLiteracy.*`)

## 7. Trust Section

- [x] 7.1 Create `TrustSection.tsx` with official attribution and sources
- [x] 7.2 Display government logo or official badge with appropriate alt text
- [x] 7.3 Extract all trust section strings to translation keys (`home.trust.*`)

## 8. Performance & Accessibility

- [x] 8.1 Implement lazy loading for below-fold sections (FeatureShowcase, PopularSchemes, FAQ)
- [x] 8.2 Optimize images with proper sizing and WebP format where possible
- [x] 8.3 Add semantic HTML elements (`<main>`, `<section>`, `<article>`) throughout
- [x] 8.4 Verify all interactive elements support keyboard navigation
- [x] 8.5 Run accessibility audit and fix any contrast or ARIA issues
