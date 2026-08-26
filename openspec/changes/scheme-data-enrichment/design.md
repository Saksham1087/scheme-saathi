## Context

The Scheme Sathi recommendation engine currently has 50 hand-curated schemes with incomplete eligibility rules. The Kaggle dataset contains 3,401 schemes with rich eligibility text in natural language. The engine can only filter on fields that exist in `eligibilityRules`, so missing fields (states, purposes, occupations) mean schemes pass checks they shouldn't. This makes results feel "same-y" regardless of user input.

The goal is to parse all 3,401 schemes from the Kaggle CSV into structured JSON with complete eligibility rules, then replace the current 50 schemes with the enriched dataset.

## Goals / Non-Goals

**Goals:**
- Parse eligibility text from 3,401 Kaggle schemes into structured fields
- Extract: states, categories, income limits, age ranges, occupations, purposes, gender, disability
- Validate extracted data against known Indian state lists and category standards
- Output enriched scheme JSON files that work with the existing recommendation engine
- Achieve ~90-95% coverage (remaining 5-10% get conservative defaults)

**Non-Goals:**
- Real-time parsing (this is a one-time batch job)
- Modifying the recommendation engine code (just better data)
- Adding new scheme categories beyond existing 8
- Translating scheme names/descriptions (keeping Hindi/Marathi as-is from Kaggle)
- Creating a UI for reviewing/editing parsed data

## Decisions

### Decision 1: Hybrid Regex + LLM Approach

**Choice**: Phase 1 regex extraction, Phase 2 LLM for remaining ~30-40%

**Alternatives considered:**
- Regex only: ~60-70% accuracy, misses ambiguous cases
- LLM only: ~95% accuracy but expensive and slow (3,401 API calls)
- Hybrid: Regex handles clear patterns instantly, LLM handles edge cases

**Rationale**: Regex catches ~60-70% of schemes for free. LLM (Groq free tier) handles the rest. Total cost: $0, processing time: ~7 days (batched overnight).

### Decision 2: Groq Free Tier for LLM

**Choice**: Use `llama-3.1-8b-instant` model (14,400 RPD, 500K TPD)

**Alternatives considered:**
- `llama-3.3-70b-versatile`: Better quality but only 1,000 RPD, would take 34 days
- OpenAI API: Costs ~$10-15 for 3,401 calls
- Local LLM: Requires GPU setup, slower

**Rationale**: Free tier is sufficient for this batch job. TPD (500K tokens/day) is the binding constraint — need ~9 days to process all 3,401 schemes.

### Decision 3: State Name Resolution

**Choice**: Comprehensive mapping table + fuzzy matching

**Mapping structure:**
```typescript
const STATE_MAP: Record<string, string> = {
  "GJ": "Gujarat", "Gujarat": "Gujarat",
  "AP": "Andhra Pradesh", "Andhra Pradesh": "Andhra Pradesh",
  // ... all 36 states/UTs
}

const REGION_MAP: Record<string, string[]> = {
  "North Eastern": ["Assam", "Arunachal Pradesh", "Manipur", "Mizoram", "Nagaland", "Tripura", "Meghalaya"],
  "Union Territories": ["Delhi", "Puducherry", "Chandigarh", ...]
}
```

**Rationale**: Most schemes use full state names. Regional groupings ("North Eastern states") need expansion. "All India" / "across the country" → `["ALL"]`.

### Decision 4: Category Mapping

**Choice**: Map Kaggle categories to our 8 categories

```
Kaggle → Ours:
"Social welfare & Empowerment" → social-welfare
"Education & Learning" → education
"Business & Entrepreneurship" → business
"Agriculture" → agriculture
"Rural & Environment" → agriculture (merge)
"Women and Child" → social-welfare (merge)
"Skills & Employment" → employment
"Banking" / "Financial Services" → business (merge)
"Health & Wellness" → health
"Housing & Shelter" → housing
"Transport & Infrastructure" → transport
Others → other
```

**Rationale**: Keeping existing 8 categories maintains compatibility with the recommendation engine. Merging related Kaggle categories reduces complexity.

### Decision 5: Output Format

**Choice**: Generate per-category JSON files matching existing schema

```
src/data/schemes/
├── agriculture.json     (was 7, will be ~481)
├── business.json        (was 8, will be ~515)
├── education.json       (was 8, will be ~834)
├── employment.json      (was 5, will be ~265)
├── health.json          (was 5, will be ~218)
├── housing.json         (was 6, will be ~92)
├── social-welfare.json  (was 6, will be ~1281)
├── transport.json       (was 5, will be ~54)
└── categories.json      (unchanged)
```

**Rationale**: Same file structure, same schema, just more data. The recommendation engine loads from these files — no code changes needed.

## Risks / Trade-offs

| Risk | Impact | Mitigation |
|------|--------|------------|
| LLM hallucinates state names | Wrong eligibility filtering | Validate against STATE_MAP, reject invalid |
| Regex misparses ₹ amounts | Wrong income limits | Use LLM for ambiguous income cases |
| Groq rate limits hit during processing | Delays | Batch overnight, save progress, resume |
| Some schemes have no eligibility text | False positives | Mark as `needsReview: true`, apply defaults |
| State-level schemes not available in user's state | False matches | Include `level` field, filter Central vs State |
| Category mapping loses nuance | Schemes miscategorized | Log warnings, manual review for edge cases |
| Processing takes 7+ days | Slow iteration | Can speed up with Developer tier ($0.59/M tokens) |

## Migration Plan

1. **Phase 1**: Build parsing script (`scripts/enrich-schemes.ts`)
2. **Phase 2**: Run regex extraction on all 3,401 schemes
3. **Phase 3**: Run LLM extraction on remaining unparseable schemes
4. **Phase 4**: Validate and generate output JSON files
5. **Phase 5**: Replace current 50 schemes with enriched 3,401
6. **Phase 6**: Test recommendation engine with new data

**Rollback**: Keep original 50 schemes in `archive/original-schemes/` for reference.

## Open Questions

1. Should we keep the original 50 hand-curated schemes as "verified" alongside the 3,401 Kaggle schemes?
2. How to handle duplicate schemes (same scheme appears in multiple Kaggle rows)?
3. Should the parsing script be reusable for future Kaggle dataset updates?
