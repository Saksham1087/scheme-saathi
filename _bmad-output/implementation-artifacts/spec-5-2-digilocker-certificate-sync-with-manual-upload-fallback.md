---
title: 'Story 5.2: DigiLocker Certificate Sync with Manual Upload Fallback'
type: 'feature'
created: '2026-08-28'
status: 'done'
baseline_commit: '820315fd1258673a5a40bce326da42ae87063d37'
review_loop_iteration: 0
context:
  - '_bmad-output/implementation-artifacts/epic-5-context.md'
  - '_bmad-output/implementation-artifacts/spec-5-1-scheme-specific-interactive-document-checklist.md'
---

<frozen-after-approval reason="human-owned intent — do not modify unless human renegotiates">

## Intent

**Problem:** Physical certificate verification at bank branches causes significant delays, yet relying exclusively on live government API integrations can block citizens when DigiLocker gateways experience downtime or when users carry physical papers.

**Approach:** Implement a hybrid verification engine offering simulated **DigiLocker Certificate Metadata Sync** for standard statutory credentials (Caste, Income, Identity, Marksheets) with statutory consent disclosures and verification badges, accompanied by an immediate **Manual File Upload Fallback** (PDF/JPG/PNG max 5MB) for all documents, updating document readiness in `useDocumentStore`.

## Boundaries & Constraints

**Always:**
- Provide DigiLocker sync for verifiable document types (`caste_cert`, `income_cert`, `aadhaar_identity`, `driving_license`, `marksheets`).
- Require explicit statutory consent modal before initiating simulated DigiLocker metadata retrieval.
- Store verified metadata: `certificateNo`, `issuer`, `verifiedAt`, `docType`, `verificationSource: "digilocker"`.
- Provide direct manual upload for all documents with client-side file inspection (types: PDF, JPG, PNG; max size: 5MB).
- Allow unlinking DigiLocker certificates and deleting uploaded files with confirmation.
- Support 100% localization in English (`en`) and Hindi (`hi`).
- Maintain accessible touch targets (min 44x44px).

**Never:**
- Store unencrypted PII or real biometric tokens in local storage.
- Block the user if DigiLocker simulation is canceled.

## I/O & Edge-Case Matrix

| Scenario | Input / State | Expected Output / Behavior | Error Handling |
|----------|--------------|---------------------------|----------------|
| DigiLocker Consent & Fetch | User clicks "Verify via DigiLocker" on Caste Certificate | Opens consent modal $\rightarrow$ user confirms $\rightarrow$ displays simulated fetching spinner $\rightarrow$ succeeds with "Verified via DigiLocker" green badge | User can cancel consent at any time |
| Manual File Upload | User selects a 2.5MB PDF file for Project Quotations | Validates MIME type and size $\rightarrow$ stores file record in store $\rightarrow$ displays "Uploaded: quotation_machinery.pdf (2.5 MB)" with delete CTA | Files > 5MB rejected with error toast: "File size exceeds 5MB limit" |
| Unlink / Remove | User clicks "Remove / Unlink" | Confirms action $\rightarrow$ clears verification metadata $\rightarrow$ updates readiness meter | State resets gracefully |

</frozen-after-approval>

## Code Map

- `src/types/document.ts` -- Extend document models with `VerificationMetadata`, `UploadedFileRecord`, and verification status enums (`verified_digilocker`, `uploaded_manual`, `pending`).
- `src/lib/digilockerService.ts` -- Simulated DigiLocker OAuth & certificate metadata resolver with authentic government certificate templates and mock verification signatures.
- `src/stores/useDocumentStore.ts` -- Extend store with actions: `syncDigiLockerDocument()`, `unlinkDigiLockerDocument()`, `uploadManualDocument()`, `removeManualDocument()`.
- `src/components/documents/DigiLockerConsentModal.tsx` -- Accessible DigiLocker consent modal and certificate metadata preview dialog.
- `src/components/documents/ManualUploadDialog.tsx` -- Drag-and-drop file upload dialog with file preview and size validation.
- `src/components/documents/DocumentChecklistItem.tsx` -- Update checklist items to render DigiLocker sync and manual upload triggers.
- `src/i18n/en.json` & `src/i18n/hi.json` -- Localization strings for DigiLocker consent, verified badges, upload errors, and certificate metadata.

## Tasks & Acceptance

**Execution:**
- [x] `src/types/document.ts` -- Extend document interfaces with verification metadata and upload records.
- [x] `src/lib/digilockerService.ts` -- Implement simulated DigiLocker service with authentic certificate fixtures.
- [x] `src/stores/useDocumentStore.ts` -- Add verification state management and file record storage.
- [x] `src/components/documents/DigiLockerConsentModal.tsx` -- Build consent modal and metadata handshake dialog.
- [x] `src/components/documents/ManualUploadDialog.tsx` -- Build accessible file uploader with validation.
- [x] `src/components/documents/DocumentChecklistItem.tsx` -- Integrate verification buttons and badges.
- [x] `src/i18n/en.json` & `src/i18n/hi.json` -- Add complete localized strings.

**Acceptance Criteria:**
- Given a verifiable document, user can click "Fetch via DigiLocker", consent, and receive a verified badge.
- Given any document, user can upload a file (<5MB PDF/image) as a manual fallback.
- Given verified or uploaded status, readiness meter updates automatically.

## Spec Change Log

_None._

## Design Notes

- Government-branded DigiLocker Cyan/Blue pill badges with checkmark.
- Accessible file dropzone with clear format and size indicators.

## Verification

**Commands:**
- `npm run lint` -- expected: zero errors across `src/`
- `npm run build` -- expected: clean TypeScript compilation and Vite build with no type errors

## Suggested Review Order

**Types & DigiLocker Gateway Simulation**

- Document verification models, metadata, and status enums.
  [`document.ts:25`](../../src/types/document.ts#L25)

- Simulated government DigiLocker gateway service with authentic certificate fixtures, PKI hashes, and handshake delays.
  [`digilockerService.ts:1`](../../src/lib/digilockerService.ts#L1)

- Extended document store with sync, unlink, upload, and remove actions.
  [`useDocumentStore.ts:35`](../../src/stores/useDocumentStore.ts#L35)

**Verification & Upload Modals**

- Accessible statutory DigiLocker consent disclosure and certificate metadata inspector modal.
  [`DigiLockerConsentModal.tsx:1`](../../src/components/documents/DigiLockerConsentModal.tsx#L1)

- Drag-and-drop manual file upload modal with client-side 5MB size and MIME type validation.
  [`ManualUploadDialog.tsx:1`](../../src/components/documents/ManualUploadDialog.tsx#L1)

**Checklist Item Integration & Localization**

- Checklist item component rendering DigiLocker verified badges, upload previews, and action triggers.
  [`DocumentChecklistItem.tsx:40`](../../src/components/documents/DocumentChecklistItem.tsx#L40)

- English and Hindi localized dictionaries for verification statuses, consent copy, and dropzone text.
  [`en.json:880`](../../src/i18n/en.json#L880)
  [`hi.json:880`](../../src/i18n/hi.json#L880)
