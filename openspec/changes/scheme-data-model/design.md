## Context

The recommendation engine, scheme explorer, and scheme details all depend on a well-structured scheme data model. The PRD specifies a comprehensive schema including eligibility rules, financial parameters, document requirements, and verification metadata. This must be established before any scheme-related features can be built.

## Goals / Non-Goals

**Goals:**
- Define a normalized Firestore document model for schemes with all PRD-specified fields
- Create a structured eligibility rules schema covering income, age, category, state, occupation, education, purpose, and disability
- Curate a seed dataset of 50+ verified government schemes for the SIH demo
- Implement a data trust model with source verification, last-updated tracking, and mock data labelling
- Define TypeScript interfaces matching the Firestore schema

**Non-Goals:**
- Automated scheme data scraping from government portals (manual curation for MVP)
- Complex eligibility evaluation engine (rules are stored; evaluation logic is separate)
- Versioning/history of scheme data changes
- Multi-language scheme content (scheme descriptions are in English for MVP)

## Decisions

- **Schema Design:** Two core collections — `schemes` (scheme metadata, financial params, documents) and `schemeRules` (eligibility rules as separate documents for efficient querying). This normalization allows rule-based filtering without loading full scheme documents.
- **Eligibility Rules Format:** Rules stored as structured objects with field, operator, and value. Example: `{ field: "income", operator: "<=", value: 800000 }`. Supports组合 rules with AND/OR logic.
- **Seed Data:** Curated JSON files in `src/data/schemes/` that can be imported into Firestore via a seeding script. Each scheme includes official source URLs and verification status.
- **Data Trust Model:** Every scheme record includes `source` (Tier 1-4 priority), `lastUpdated` timestamp, `verified` boolean, and `officialUrl` for user-facing attribution.
- **Slug-based Routing:** Each scheme has a URL-friendly `slug` field for clean routing at `/schemes/:slug`.

## Risks / Trade-offs

- **Manual Curation:** 50+ schemes require significant manual effort. Prioritize schemes most relevant to SC beneficiaries.
- **Data Freshness:** Government schemes change frequently. The `lastUpdated` field and disclaimer communicate staleness risk to users.
- **Schema Evolution:** As new scheme types are discovered, the schema may need extension. Design fields to be optional/nullable where possible.
