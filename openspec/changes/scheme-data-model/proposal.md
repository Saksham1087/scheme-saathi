## Why

The recommendation engine, scheme explorer, and scheme details all depend on a well-structured scheme data model. The PRD specifies a comprehensive schema including eligibility rules, financial parameters, document requirements, and verification metadata. This must be established before any scheme-related features can be built.

## What Changes

- Scheme Firestore document model with all PRD-specified fields
- Eligibility rules schema (income ranges, age, category, state, occupation, education, purpose)
- Required documents schema per scheme
- Channel partner type associations
- Official source attribution and verification status
- Scheme categorization (business, education, agriculture, transport, etc.)
- Seed data: 50+ curated/verified scheme records for SIH demo
- Data source priority enforcement (Tier 1-4)
- Scheme slug generation and URL routing model

## Capabilities

### New Capabilities
- `scheme-document-model`: Firestore schema for schemes with eligibility rules, financial parameters, documents, source metadata
- `eligibility-rules-schema`: Structured eligibility rule format (income, age, category, state, occupation, education, purpose, disability)
- `scheme-seed-data`: Curated dataset of 50+ verified government schemes with official source attribution
- `data-trust-model`: Source verification, last-updated tracking, mock data labelling, official source display

### Modified Capabilities

(none)

## Impact

- New `src/data/schemes/` directory with seed data
- New `src/types/scheme.ts` with full TypeScript interfaces
- Firestore collection: `schemes`, `schemeRules`, `categories`
- Seed scripts for populating Firestore with verified scheme data
- Validation schemas for scheme data integrity
