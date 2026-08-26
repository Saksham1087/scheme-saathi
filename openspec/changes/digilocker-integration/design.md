## Context

Document readiness is a major friction point in the application journey. Users must manually upload government-issued documents (Aadhaar, caste certificates, income certificates), which is error-prone and slow. DigiLocker integration via India's API Setu provides an authorized mechanism to retrieve verified documents directly, improving completion rates and data accuracy.

## Goals / Non-Goals

**Goals:**
- Enable users to connect their DigiLocker account and retrieve document metadata
- Provide a "Get from DigiLocker" CTA in the document checklist
- Ensure graceful fallback to manual upload when DigiLocker is unavailable
- Maintain strict security: no credential storage, consent-only access, authorized integration
- Design the architecture now without blocking the core journey

**Non-Goals:**
- Building the full DigiLocker integration end-to-end (P2 priority, architecture-first)
- Storing any DigiLocker passwords or credentials in our system
- Bypassing user consent at any point
- Scraping or unauthorized document access
- Real-time document sync from DigiLocker

## Decisions

- Use DigiLocker's official API Setu integration rather than unofficial mechanisms
- Separate concerns into four modules: auth, retrieval, fallback, security
- Never persist DigiLocker credentials; use OAuth token-based access with user consent
- Design fallback UX as a first-class citizen: "DigiLocker unavailable for this document. Upload manually."
- Keep DigiLocker as an optional enhancement to the existing document checklist, not a replacement

## Risks / Trade-offs

- **API Setu availability:** DigiLocker API may have downtime or rate limits; fallback to manual upload mitigates this
- **User adoption:** Users may not have DigiLocker accounts; manual upload remains the primary path
- **Token expiry:** OAuth tokens expire; re-authentication flow must be smooth
- **Scope creep:** Integration complexity could delay core features; architecture-first approach keeps this bounded
