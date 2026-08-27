## Why

Users often don't know which documents they need before approaching a channel partner. Showing a clear checklist per scheme reduces friction and failed application attempts. The PRD specifies tracking document readiness with a progress indicator.

## What Changes

- Per-scheme document checklist display
- Required documents listed with ready/pending status
- Progress indicator: "3/5 documents ready"
- Manual document readiness toggle (user marks as prepared)
- "Get from DigiLocker" CTA where integration is available
- Fallback: manual upload option
- Document checklist saved to user profile

## Capabilities

### New Capabilities
- `document-checklist`: Per-scheme required documents list with ready/pending tracking
- `document-readiness`: Progress indicator showing document preparation status
- `document-actions`: DigiLocker retrieval CTA, manual upload fallback

### Modified Capabilities

(none)

## Impact

- New `src/pages/Documents.tsx` or integrated into scheme detail
- New components: DocumentChecklist, DocumentItem, DigiLockerButton, ReadinessProgress
- Depends on: `scheme-data-model`, `firebase-architecture`, `digilocker-integration`
