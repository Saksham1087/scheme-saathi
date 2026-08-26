## Why

The scheme recommendation engine shows the same schemes regardless of user input because the eligibility data is incomplete. Currently, 96% of schemes are missing `states`, 100% are missing `purposes`, and 82% are missing `occupations` in their eligibility rules. This makes filtering impossible — the engine only checks fields that exist, so schemes with fewer rules automatically pass more checks. The Kaggle dataset has 3,401 schemes with rich eligibility text, but it's unstructured natural language that needs to be parsed into the structured format our engine requires.

## What Changes

- **New parsing pipeline**: A hybrid regex + LLM extraction system that converts natural language eligibility text into structured JSON fields (states, categories, income limits, age ranges, occupations, purposes, gender, disability)
- **Enriched scheme data**: All 3,401 Kaggle schemes will have structured `eligibilityRules` populated, replacing the current 50 hand-curated schemes
- **State/category mappings**: Comprehensive mapping tables for Indian state names, abbreviations, and regional groupings (e.g., "North Eastern States" → 7 states)
- **Validation layer**: Cross-check extracted data against known state lists, income thresholds, and category standards
- **Fallback handling**: Schemes with unparseable eligibility get conservative defaults (assume all India, all categories) with lower confidence scores

## Capabilities

### New Capabilities
- `scheme-data-pipeline`: The core parsing pipeline — regex extraction, LLM classification, validation, and output generation for all 3,401 schemes
- `eligibility-data-model`: Structured schema for scheme eligibility rules including states, categories, purposes, occupations, income, age, gender, disability fields

### Modified Capabilities
- `smart-scheme-recommender`: The recommendation engine needs to handle the enriched data — schemes now have more fields to filter on, and confidence scores need to reflect data completeness

## Impact

- **Data files**: `src/data/schemes/*.json` will be regenerated with enriched eligibility rules (all 8 category files)
- **Recommendation engine**: `src/services/recommendation/eligibility.ts` and `scoring.ts` will work with richer data — no code changes needed, just better data
- **New tooling**: A one-time script (`scripts/enrich-schemes.ts`) to run the parsing pipeline
- **Dependencies**: Groq API (free tier) for LLM extraction, no new npm packages needed
- **Build**: TypeScript compilation will verify the new data structures
