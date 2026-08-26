## 1. Service Layer Setup

- [x] 1.1 Create `src/services/digilocker/` directory structure with `auth.ts`, `retrieval.ts`, `fallback.ts`, `security.ts`, and `index.ts` barrel export
- [x] 1.2 Define TypeScript interfaces for DigiLocker OAuth tokens, document metadata, retrieval responses, and consent records in `security.ts`
- [x] 1.3 Implement `security.ts`: consent management functions, token storage (session-only, never persisted to Firestore), and credential-safety guards

## 2. OAuth Connection Flow

- [x] 2.1 Implement `auth.ts`: initiate DigiLocker OAuth redirect via API Setu authorization endpoint
- [x] 2.2 Implement OAuth callback handler to capture authorization code and exchange for access token
- [x] 2.3 Implement token refresh logic for expired OAuth tokens with smooth re-authentication UX
- [x] 2.4 Build connection status check function to determine if user currently has an active DigiLocker session

## 3. Document Retrieval

- [x] 3.1 Implement `retrieval.ts`: fetch available document list from user's DigiLocker via API Setu
- [x] 3.2 Implement individual document metadata retrieval (issuer, document type, verification status)
- [x] 3.3 Implement document content retrieval for specific document types (Aadhaar, caste certificate, income certificate)
- [x] 3.4 Map DigiLocker document types to the application's document requirement types

## 4. Fallback Module

- [x] 4.1 Implement `fallback.ts`: detection function for when DigiLocker is unavailable (API down, document not available, user has no DigiLocker account)
- [x] 4.2 Define fallback message: "DigiLocker unavailable for this document. Upload manually."
- [x] 4.3 Implement fallback trigger on API errors, timeouts, or missing document types

## 5. UI Components

- [x] 5.1 Create `DigiLockerButton` component: "Get from DigiLocker" CTA with connection status indicator
- [x] 5.2 Create `DigiLockerFlow` component: connection → authenticate → consent → retrieve multi-step flow
- [x] 5.3 Create `DocumentRetrieved` component: display retrieved document metadata with issuer-verified badge
- [x] 5.4 Implement consent screen within the flow: show what documents will be accessed, require explicit user approval

## 6. Integration with Document Checklist

- [x] 6.1 Add "Get from DigiLocker" button to each applicable document entry in the document checklist
- [x] 6.2 Wire retrieved documents into the checklist's document state so they count as "uploaded"
- [x] 6.3 Show DigiLocker-sourced documents with a verified badge and source indicator
- [x] 6.4 Ensure manual upload remains fully functional as the primary path when DigiLocker is skipped

## 7. Environment & Configuration

- [x] 7.1 Add DigiLocker/API Setu environment variables to `.env.example` (client ID, redirect URI, API endpoint)
- [x] 7.2 Create configuration module to read DigiLocker credentials and gracefully disable feature when unconfigured
- [x] 7.3 Add feature flag to conditionally show/hide DigiLocker UI based on environment configuration

## 8. Error Handling & Edge Cases

- [x] 8.1 Handle OAuth errors (denied consent, expired tokens, network failures) with user-friendly messages
- [x] 8.2 Handle partial retrieval: some documents available, others not — show per-document fallback
- [x] 8.3 Handle concurrent DigiLocker sessions and token race conditions
- [x] 8.4 Ensure no DigiLocker credentials or tokens are logged or stored in Firestore
