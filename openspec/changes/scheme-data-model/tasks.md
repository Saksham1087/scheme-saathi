## 1. TypeScript Type Definitions

- [x] 1.1 Create `src/types/scheme.ts` with complete Scheme interface (id, name, slug, description, ministry, category, financialParams, documents, source, lastUpdated, verified, officialUrl)
- [x] 1.2 Define EligibilityRule interface with field, operator, value structure
- [x] 1.3 Define SchemeRule interface linking rules to scheme ID with AND/OR logic composition
- [x] 1.4 Define FinancialParams interface (loanAmountMin, loanAmountMax, interestRate, subsidyPercentage, etc.)
- [x] 1.5 Define DocumentRequirement interface (name, type, mandatory, description)
- [x] 1.6 Define SourceMetadata interface with tier (1-4), officialUrl, lastUpdated, verified flag
- [x] 1.7 Define Category interface (id, name, icon, schemeCount)
- [x] 1.8 Export all types from `src/types/scheme.ts`

## 2. Firestore Collection Schema Design

- [x] 2.1 Document the `schemes` collection schema with all fields and data types
- [x] 2.2 Document the `schemeRules` collection schema with references to parent scheme
- [x] 2.3 Document the `categories` collection schema
- [x] 2.4 Define composite indexes needed for common queries (category + state, income range)
- [x] 2.5 Add schema documentation in `src/types/README.md` or code comments

## 3. Seed Data Creation

- [x] 3.1 Create `src/data/schemes/` directory structure
- [x] 3.2 Create `src/data/schemes/schemes.json` with 50+ curated government scheme records
- [x] 3.3 Ensure each scheme includes: name, slug, description, ministry, category, financial params, document requirements
- [x] 3.4 Create `src/data/schemes/rules.json` with eligibility rules for each scheme
- [x] 3.5 Create `src/data/schemes/categories.json` with category definitions (business, education, agriculture, transport, housing, health, etc.)
- [x] 3.6 Prioritize schemes most relevant to SC beneficiaries
- [x] 3.7 Include official source URLs and verification status for each scheme
- [x] 3.8 Label all seed data as mock/curated with appropriate metadata

## 4. Data Seeding Scripts

- [x] 4.1 Create `scripts/seed-schemes.ts` to read JSON and write to Firestore `schemes` collection
- [x] 4.2 Create `scripts/seed-rules.ts` to write eligibility rules to `schemeRules` collection
- [x] 4.3 Create `scripts/seed-categories.ts` to populate `categories` collection
- [x] 4.4 Add idempotency checks (skip if document already exists or upsert)
- [x] 4.5 Add npm scripts: `npm run seed:schemes`, `npm run seed:rules`, `npm run seed:categories`
- [x] 4.6 Test seeding against Firestore emulator

## 5. Data Validation

- [x] 5.1 Create validation functions for scheme data integrity (required fields, valid enums)
- [x] 5.2 Validate all seed data passes validation before seeding
- [x] 5.3 Add slug generation utility that creates URL-friendly slugs from scheme names
- [x] 5.4 Verify no duplicate slugs exist in the seed dataset
