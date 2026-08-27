## 1. Data Layer

- [x] 1.1 Define document checklist item type: document name, category, required/optional flag, ready/pending status, DigiLocker availability flag
- [x] 1.2 Implement Firebase read/write for document readiness state — keyed by scheme ID + document ID under user profile
- [x] 1.3 Handle schemes with missing/incomplete document lists — display available docs, show "list may be incomplete" notice

## 2. UI Components

- [x] 2.1 Create `DocumentChecklist` component — per-scheme list of required documents with ready/pending status
- [x] 2.2 Create `DocumentItem` component — individual document row with name, required/optional badge, ready toggle
- [x] 2.3 Create `ReadinessProgress` component — progress bar with "X/Y documents ready" text
- [x] 2.4 Create `DigiLockerButton` component — "Get from DigiLocker" CTA (calls into digilocker-integration API)
- [x] 2.5 Implement manual fallback — "Mark as Ready" button when DigiLocker unavailable for a document
- [x] 2.6 Add reminder notice: "Documents will be verified at the partner location"

## 3. Integration

- [x] 3.1 Add document checklist section to scheme detail page
- [x] 3.2 Add document checklist section to partner detail page (pre-visit preparation)
- [x] 3.3 Wire document readiness toggle to Firebase persistence
- [x] 3.4 Initialize checklist state from Firebase on page load (sync across sessions)

## 4. Testing & Polish

- [x] 4.1 Test checklist with schemes that have structured document lists
- [x] 4.2 Test checklist with schemes that have missing/incomplete document data
- [x] 4.3 Test readiness toggle persistence across page refreshes
- [x] 4.4 Test DigiLocker CTA rendering vs manual "Mark as Ready" fallback
- [x] 4.5 Test progress indicator accuracy with mixed ready/pending states
