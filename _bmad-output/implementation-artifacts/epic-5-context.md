# Epic 5 Planning Context: Dynamic Document Checklist & DigiLocker Verification

## Executive Summary
Epic 5 empowers beneficiaries to assemble, check off, and verify the exact statutory documentation required for their target scheme with an interactive Document Readiness Checklist (`/documents` and modal on scheme details/results) and a simulated DigiLocker certificate metadata handshake with seamless manual upload fallback.

## Epic 5 Stories
1. **Story 5.1: Scheme-Specific Interactive Document Checklist (`/documents`)**
   - Dynamic document list configured by scheme type (Caste Certificate, Income Certificate / ITR / BPL card, Identity Proof Aadhaar/Voter ID, Address Proof, Project Proposal / Quotations, Education Admission Letter, Bank Account Passbook / Cancelled Cheque).
   - Real-time readiness meter ("X of Y documents ready · Z% complete").
   - Local state persistence (`useDocumentStore`) so users can check off documents across sessions.
   - Printable & downloadable offline checklist PDF/slip.

2. **Story 5.2: DigiLocker Certificate Sync with Manual Upload Fallback**
   - Direct "Sync from DigiLocker" action on verifiable document types (Caste Certificate, Income Certificate, Driving License, Educational Marksheet).
   - DigiLocker OAuth / metadata verification modal with simulated government certificate handshake (issuing authority, certificate ID, verification timestamp).
   - Green "Verified via DigiLocker" badge and document readiness auto-completion.
   - Immediate "Upload Manually (PDF/JPG)" fallback with client-side file preview and mock storage for unauthenticated/offline users.
