## 1. Route & Auth Guard

- [x] 1.1 Create `src/pages/Dashboard.tsx` as the main dashboard page component
- [x] 1.2 Register route `/dashboard` in the app router
- [x] 1.3 Implement authentication guard: redirect unauthenticated users to login with return-to-dashboard URL
- [x] 1.4 Show login prompt CTA for unauthenticated visitors instead of dashboard content

## 2. Dashboard Layout

- [x] 2.1 Create responsive grid layout for dashboard sections (2-column on desktop, single column on mobile)
- [x] 2.2 Implement `DashboardSection` wrapper component with section title, content area, and consistent spacing
- [x] 2.3 Add page header with user greeting and quick action buttons (recalculate, find partner, new assessment)

## 3. My Recommendations Section

- [x] 3.1 Fetch user's recommended schemes from Firebase (from assessment history or saved recommendations)
- [x] 3.2 Display top 3-5 recommended schemes with name, category, and eligibility indicator
- [x] 3.3 Implement empty state: "No recommendations yet. Take an assessment to get started." with CTA
- [x] 3.4 Add "View All" link if more than 5 recommendations exist

## 4. Saved Schemes Section

- [x] 4.1 Fetch user's saved/bookmarked schemes from Firestore
- [x] 4.2 Display saved schemes as a list with scheme name, category, and quick-action buttons (apply, remove)
- [x] 4.3 Implement empty state: "No saved schemes yet. Explore schemes to find ones that fit." with CTA
- [x] 4.4 Implement remove from saved with confirmation

## 5. Saved Partners Section

- [x] 5.1 Fetch user's saved channel partners from Firestore
- [x] 5.2 Display saved partners with name, location, supported schemes, and contact action
- [x] 5.3 Implement empty state: "No saved partners. Find a partner to help with your application." with CTA

## 6. Recent Calculations Section

- [x] 6.1 Fetch recent EMI/affordability calculator results from user profile
- [x] 6.2 Display last 3-5 calculations with scheme name, calculated amount, and date
- [x] 6.3 Add "Recalculate" quick action on each entry
- [x] 6.4 Implement empty state: "No recent calculations. Try our calculators to plan your project." with CTA

## 7. Document Readiness Section

- [x] 7.1 Aggregate document upload status across all active application journeys
- [x] 7.2 Display overall readiness percentage and per-scheme document completion status
- [x] 7.3 Link each scheme's document status to its document checklist
- [x] 7.4 Implement empty state: "No document tracking yet. Start an application to track your documents." with CTA

## 8. Application Journey Section

- [x] 8.1 Fetch active application journeys from Firestore
- [x] 8.2 Display each journey with scheme name, current step, and progress bar
- [x] 8.3 Link each journey to its `/application/:id` detail page
- [x] 8.4 Implement empty state: "No active applications. Choose a scheme and start your journey." with CTA

## 9. Assessment History Section

- [x] 9.1 Fetch past assessment results from Firestore
- [x] 9.2 Display assessment history with date, input summary, and top result
- [x] 9.3 Add "Retake Assessment" quick action
- [x] 9.4 Implement empty state: "No assessment history. Take your first assessment to get personalized recommendations." with CTA

## 10. Performance & Loading

- [x] 10.1 Implement skeleton loading states for each section during data fetch
- [x] 10.2 Parallelize all section data fetches to minimize total load time
- [x] 10.3 Implement error states for failed data fetches with retry option
- [x] 10.4 Consider lazy loading sections below the fold on mobile
