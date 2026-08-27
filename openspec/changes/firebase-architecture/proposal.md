## Why

Scheme Sathi requires a backend for user authentication, scheme/partner data storage, user preferences, saved schemes, and application journey tracking. Firebase provides the fastest path to a working backend for an MVP/SIH demo, with built-in auth, real-time database, and hosting.

## What Changes

- Firebase project setup with Authentication (email/Google sign-in)
- Firestore database with all collections: users, schemes, schemeRules, partners, partnerSchemes, recommendations, assessments, savedSchemes, savedPartners, calculatorHistory, documents, applicationJourneys, categories, translations, adminUsers
- Firestore security rules for role-based access
- Environment variable configuration for Firebase credentials
- Firebase hosting configuration
- Data models for scheme, partner, and user documents
- Scheme data seeding/migration scripts

## Capabilities

### New Capabilities
- `firebase-auth`: Firebase Authentication with email/Google sign-in, session management, protected routes
- `firestore-data-layer`: Firestore collections, CRUD operations, security rules, real-time subscriptions
- `scheme-data-model`: Normalized Firestore schema for schemes, eligibility rules, source metadata, verification status
- `partner-data-model`: Firestore schema for channel partners with geo data, supported schemes, availability
- `user-data-model`: User profile, saved schemes/partners, assessment history, application journey

### Modified Capabilities

(none)

## Impact

- New `src/services/firebase/` directory with config, auth, firestore modules
- New `src/types/` for Scheme, Partner, User, Assessment, ApplicationJourney
- `firestore.rules` and `firestore.indexes.json` at project root
- `firebase.json` configuration
- `.env.example` with Firebase variables
- New dependency: `firebase` npm package
