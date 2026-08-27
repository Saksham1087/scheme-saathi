## Why

Document readiness is a major friction point. DigiLocker integration lets users retrieve government-issued documents (Aadhaar, caste certificates, income certificates) instead of manually uploading them. The PRD specifies this as integration-dependent — design the architecture now, but don't block the core journey.

## What Changes

- DigiLocker connection flow: connect → authenticate → consent → retrieve
- Document retrieval: get available documents from user's DigiLocker
- Document metadata display: issuer verified, available for application
- Security: never store DigiLocker passwords, never bypass consent, never scrape
- Official authorized integration mechanism (API Setu)
- Fallback: "DigiLocker unavailable for this document. Upload manually."
- "Get from DigiLocker" CTA in document checklist

## Capabilities

### New Capabilities
- `digilocker-auth`: DigiLocker OAuth/connection flow with user consent
- `digilocker-retrieval`: Retrieve document metadata and documents from DigiLocker
- `digilocker-fallback`: Graceful fallback to manual upload when DigiLocker unavailable
- `digilocker-security`: Consent management, no credential storage, authorized integration only

### Modified Capabilities

(none)

## Impact

- New `src/services/digilocker/` directory with auth, retrieval, fallback modules
- New component: DigiLockerButton, DigiLockerFlow, DocumentRetrieved
- Optional dependency: DigiLocker/API Setu credentials
- Integration point with: `document-checklist`
