# Epic 2 Planning Context: Smart Eligibility Assessment & Explainable Recommendation Engine

## Executive Summary
Epic 2 implements a transparent, accessible, and deterministic 100-point eligibility scoring system with a 7-question guided intake wizard (`/find-schemes`) and an explainable results interface (`/results`) that highlights both qualification factors ("Why This Scheme?") and non-matching constraint explanations ("Why Not This Scheme?") with suitable alternatives.

## Architectural Invariants & Decisions
- **AD-2 (Deterministic Rules Engine)**: Recommendation scoring is purely deterministic and auditable. AI is never used for eligibility gating or match scoring.
- **100-Point Scoring Weights**:
  - Annual Family Income (20 pts)
  - Target Caste / Demographic Category (20 pts)
  - Project / Business Purpose Fit (20 pts)
  - Loan Amount / Project Cost Band (20 pts)
  - Age Eligibility (10 pts)
  - State / Geographic Eligibility (10 pts)
- **Mandatory Indicative Score Stamp**: Every recommendation badge must explicitly state "Indicative matching score" / "सांकेतिक मिलान स्कोर" to reflect statutory bank appraisal independence.
- **Offline & Cloud Function Parity**: The rule engine is shared or mirrored identically client-side and in Firebase Cloud Functions (`functions/src/engine/rules.ts` and `src/services/matchingEngine.ts`), ensuring instantaneous (< 50ms) evaluations even without internet connectivity.

## Epic 2 User Stories
- **Story 2.1**: 6–8 Question Demographic & Financial Intake Flow (`/find-schemes`)
- **Story 2.2**: 100-Point Deterministic Eligibility & Scoring Engine
- **Story 2.3**: Explainable Matching & "Why Not This Scheme?" Alternatives (`/results`)
