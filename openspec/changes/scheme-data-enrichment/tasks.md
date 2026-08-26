## 1. Setup and Data Model

- [x] 1.1 Create state mapping file `scripts/data/state-map.ts` with all 36 Indian states/UTs and abbreviations
- [x] 1.2 Create category mapping file `scripts/data/category-map.ts` mapping 19 Kaggle categories to 8 app categories
- [x] 1.3 Create occupation mapping file `scripts/data/occupation-map.ts` with common occupation variations
- [x] 1.4 Create purpose mapping file `scripts/data/purpose-map.ts` with common purpose keywords
- [x] 1.5 Define TypeScript interfaces for `ParsedEligibility` and `ExtractionMetadata`

## 2. Regex Extraction Engine

- [x] 2.1 Create regex patterns for state name extraction (full names, abbreviations, regional groups)
- [x] 2.2 Create regex patterns for income extraction (₹ amounts, "not exceeding", "up to")
- [x] 2.3 Create regex patterns for age extraction (ranges, "above X", "below Y")
- [x] 2.4 Create regex patterns for category extraction (SC, ST, OBC, General)
- [x] 2.5 Create regex patterns for occupation extraction (farmer, student, self-employed)
- [x] 2.6 Create regex patterns for purpose extraction (dairy, processing, agriculture)
- [x] 2.7 Create regex patterns for gender extraction (male, female)
- [x] 2.8 Create regex patterns for disability extraction (disabled, handicapped)
- [x] 2.9 Implement `extractWithRegex(eligibilityText: string): ParsedEligibility` function
- [x] 2.10 Add confidence scoring based on fields extracted (0.0-1.0)

## 3. LLM Extraction Engine

- [x] 3.1 Create Groq API client wrapper with rate limiting
- [x] 3.2 Design extraction prompt template for eligibility text
- [x] 3.3 Implement `extractWithLLM(eligibilityText: string): Promise<ParsedEligibility>` function
- [x] 3.4 Add retry logic for rate limits (429 responses)
- [x] 3.5 Add daily token tracking to stay within 500K TPD limit
- [x] 3.6 Implement batch processing with progress saving

## 4. Validation Layer

- [x] 4.1 Implement state validation against STATE_MAP
- [x] 4.2 Implement category validation against valid category list
- [x] 4.3 Implement income range validation (min < max)
- [x] 4.4 Implement age range validation (min < max)
- [x] 4.5 Implement deduplication logic (keep most complete entry)
- [x] 4.6 Add warning logging for invalid/ambiguous extractions

## 5. Output Generation

- [x] 5.1 Create output schema matching existing `SchemeEligibilityRules` interface
- [x] 5.2 Implement per-category JSON file generation
- [x] 5.3 Add `level` field (Central/State) from Kaggle data
- [x] 5.4 Add `needsReview` flag for low-confidence extractions
- [x] 5.5 Add `extractionMetadata` with confidence and source

## 6. Main Pipeline Script

- [x] 6.1 Create `scripts/enrich-schemes.ts` main entry point
- [x] 6.2 Implement CSV parsing for Kaggle dataset
- [x] 6.3 Implement Phase 1: Regex extraction for all 3,401 schemes
- [x] 6.4 Implement Phase 2: LLM extraction for remaining unparseable schemes
- [x] 6.5 Implement Phase 3: Default application for still-unparseable schemes
- [x] 6.6 Add progress reporting and resumability
- [x] 6.7 Add summary statistics (coverage, confidence distribution)

## 7. Integration and Testing

- [x] 7.1 Backup original 50 schemes to `archive/original-schemes/`
- [x] 7.2 Run pipeline and generate enriched scheme files
- [x] 7.3 Verify TypeScript compilation with new data
- [x] 7.4 Test recommendation engine with enriched data
- [x] 7.5 Verify filtering works correctly for sample user profiles
- [x] 7.6 Check that confidence scores are reasonable

## 8. Cleanup and Documentation

- [x] 8.1 Remove or archive parsing scripts after use
- [x] 8.2 Update any references to old scheme count (50 → 3,401)
- [x] 8.3 Verify all existing features still work with new data
