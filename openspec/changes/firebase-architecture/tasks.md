## 1. Firebase Project Setup

- [x] 1.1 Create Firebase project and enable Authentication (Email/Password + Google)
- [x] 1.2 Enable Firestore database in production mode
- [x] 1.3 Install `firebase` npm package
- [x] 1.4 Create `.env.example` with all required Firebase config variables
- [x] 1.5 Create `src/services/firebase/config.ts` to initialize Firebase app from env vars
- [x] 1.6 Verify `.env` is in `.gitignore` and never committed

## 2. TypeScript Type Definitions

- [x] 2.1 Create `src/types/scheme.ts` with Scheme and SchemeRule interfaces
- [x] 2.2 Create `src/types/partner.ts` with Partner and PartnerScheme interfaces
- [x] 2.3 Create `src/types/user.ts` with UserProfile, SavedScheme, SavedPartner interfaces
- [x] 2.4 Create `src/types/assessment.ts` with Assessment and Recommendation interfaces
- [x] 2.5 Create `src/types/application.ts` with ApplicationJourney interface
- [x] 2.6 Create `src/types/index.ts` to re-export all types

## 3. Authentication Service

- [x] 3.1 Create `src/services/firebase/auth.ts` with email/password sign-up and sign-in
- [x] 3.2 Implement Google OAuth sign-in flow
- [x] 3.3 Add session state listener (`onAuthStateChanged`)
- [x] 3.4 Create sign-out function
- [x] 3.5 Create a React auth context/hook for components to consume auth state
- [x] 3.6 Implement protected route wrapper component

## 4. Firestore Service Layer

- [x] 4.1 Create `src/services/firebase/firestore.ts` as the main Firestore service module
- [x] 4.2 Implement typed CRUD operations for `schemes` collection (get, list, query)
- [x] 4.3 Implement typed CRUD operations for `schemeRules` collection
- [x] 4.4 Implement typed CRUD operations for `partners` and `partnerSchemes` collections
- [x] 4.5 Implement typed CRUD operations for `users` collection (profile read/update)
- [x] 4.6 Implement typed CRUD operations for `savedSchemes`, `savedPartners` sub-collections
- [x] 4.7 Implement typed CRUD for `assessments`, `recommendations` collections
- [x] 4.8 Implement typed CRUD for `applicationJourneys`, `documents` collections
- [x] 4.9 Add real-time subscription helper functions (`onSnapshot` wrappers) for key collections
- [x] 4.10 Implement pagination utilities using cursor-based pagination

## 5. Firestore Security Rules

- [x] 5.1 Create `firestore.rules` at project root
- [x] 5.2 Define public read rules for `schemes`, `schemeRules`, `categories`, `partners` collections
- [x] 5.3 Define authenticated read/write rules for `users`, `savedSchemes`, `savedPartners`, `assessments`, `applicationJourneys` collections
- [x] 5.4 Define admin-only rules for scheme management and admin collections
- [x] 5.5 Create `firestore.indexes.json` with required composite indexes
- [x] 5.6 Document security rules with comments explaining each rule block

## 6. Firebase Hosting & Config

- [x] 6.1 Create `firebase.json` with hosting configuration (public dir, rewrites for SPA)
- [x] 6.2 Configure deploy scripts in `package.json`
- [x] 6.3 Add `.firebaserc` for project alias binding
- [x] 6.4 Test local serving with `firebase emulators:start`

## 7. Data Seeding

- [x] 7.1 Create `scripts/seed-schemes.ts` to import seed data into Firestore
- [x] 7.2 Create `scripts/seed-partners.ts` for partner data seeding
- [x] 7.3 Create `scripts/seed-categories.ts` for category data
- [x] 7.4 Add npm scripts to run seeding (`npm run seed:schemes`, etc.)
- [x] 7.5 Test seeding against Firestore emulator before production
