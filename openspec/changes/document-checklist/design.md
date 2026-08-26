## Context

Users often don't know which documents they need before approaching a channel partner, leading to failed application attempts and wasted trips. A per-scheme document checklist with readiness tracking reduces friction and helps users prepare adequately. The PRD specifies tracking document readiness with a progress indicator and optional DigiLocker integration.

## Goals / Non-Goals

**Goals:**
- Display a per-scheme checklist of required documents with ready/pending status
- Show a progress indicator (e.g., "3/5 documents ready")
- Allow users to manually toggle document readiness status
- Provide "Get from DigiLocker" CTA where DigiLocker integration is available
- Fall back to manual upload option when DigiLocker is unavailable
- Save document checklist state to user profile via Firebase

**Non-Goals:**
- Actual document upload and storage (documents remain with user/DigiLocker)
- Document verification or validation by the system
- OCR or document content extraction
- DigiLocker OAuth flow implementation (assumes integration exists from `digilocker-integration` change)

## Decisions

1. **Document data model**: Each required document SHALL be represented as a checklist item with: document name, category, required/optional flag, ready/pending status, and optional DigiLocker availability flag. This data comes from the scheme-data-model.

2. **Readiness state storage**: Document readiness state SHALL be stored in Firebase under the user's profile, keyed by scheme ID and document ID. This ensures persistence across sessions.

3. **Progress indicator format**: The progress indicator SHALL display as "X/Y documents ready" with a visual progress bar. Ready count includes only documents the user has marked as prepared.

4. **DigiLocker integration boundary**: This change defines the UI and flow for DigiLocker CTA buttons. The actual DigiLocker OAuth and retrieval mechanism is provided by the `digilocker-integration` change. This change SHALL call into that integration's API.

5. **Manual fallback**: When DigiLocker is not available for a document, the system SHALL show a "Mark as Ready" button instead. The system SHALL NOT store uploaded documents — it only tracks whether the user has prepared each document.

6. **Checklist location**: The document checklist SHALL be accessible from the scheme detail page and from the partner detail page (as pre-visit preparation).

## Risks / Trade-offs

- **DigiLocker availability**: Not all documents may be available through DigiLocker. The system SHALL clearly indicate which documents support DigiLocker retrieval and which require manual preparation.
- **False readiness**: Users may mark documents as ready without actually having them. The system SHALL display a reminder that documents will be verified at the partner location.
- **Scheme data completeness**: Some schemes may not have a structured document list. The system SHALL display what is available and indicate when the list may be incomplete, suggesting users verify with the scheme authority.
