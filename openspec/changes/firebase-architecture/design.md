## Context

Scheme Sathi requires a backend for user authentication, data storage, and real-time updates. Firebase provides the fastest path to a working backend for an MVP/SIH demo, with built-in auth, Firestore NoSQL database, and hosting. The architecture must support role-based access, multiple data collections, and real-time subscriptions for a responsive user experience.

## Goals / Non-Goals

**Goals:**
- Set up Firebase Authentication with email and Google sign-in
- Design Firestore collections for users, schemes, schemeRules, partners, and all associated sub-collections
- Implement Firestore security rules for role-based access control
- Provide CRUD operations and real-time subscriptions via a service layer
- Configure environment variables for Firebase credentials
- Support Firebase hosting for deployment

**Non-Goals:**
- Complex Cloud Functions or serverless backend logic (keep MVP simple)
- Firebase Analytics or Crashlytics integration
- Multi-region Firestore deployment
- Complex data migration pipelines beyond basic seeding

## Decisions

- **Database Choice:** Firestore over Realtime Database for better querying, security rules, and scaling.
- **Auth Providers:** Email/password + Google sign-in only for MVP. Additional providers can be added later.
- **Service Layer Pattern:** All Firestore access goes through a typed service layer (`src/services/firebase/`) that abstracts collection references, queries, and security rules. Components never access Firestore directly.
- **Type Safety:** All Firestore documents are backed by TypeScript interfaces in `src/types/`. Service methods return typed results.
- **Security Rules:** Role-based rules区分 public read (schemes), authenticated read/write (user data), and admin-only (scheme management). Rules are version-controlled in `firestore.rules`.
- **Environment Config:** Firebase config via `.env` variables with `.env.example` committed. Never commit actual credentials.

## Risks / Trade-offs

- **Vendor Lock-in:** Firebase-specific SDK and rules create migration cost. Acceptable for MVP; abstraction layer in service module reduces coupling.
- **Security Rules Complexity:** Firestore rules can become complex. Keep rules simple and well-documented; iterate as new collections are added.
- **Cost:** Firestore pricing is per operation. Pagination and efficient queries are critical to avoid unexpected costs at scale.
- **Offline Support:** Firestore provides offline persistence by default on mobile. Enable it but test thoroughly for data consistency.
