# Epic 7 Planning Context: Application Journey Tracking & Personalized User Dashboard

## Executive Summary
Epic 7 completes the citizen journey from scheme discovery and document readiness to application submission and post-application lifecycle tracking. It delivers an interactive 8-stage post-discovery application milestone tracker and a unified user dashboard at `/dashboard` summarizing saved schemes, channel partners, recent financial plans, document readiness, and active application milestones.

## Epic 7 Stories
1. **Story 7.1: 8-Stage Post-Discovery Application Milestone Tracker (`/application/:id` and `/track`)**
   - 8-Stage physical and digital application progress journey:
     1. *Scheme Identified*
     2. *Eligibility Pre-Screened*
     3. *Documents Prepared & Verified*
     4. *Channel Partner / Branch Selected*
     5. *Physical / Digital Application Form Filled*
     6. *Application Submitted to Channel Partner*
     7. *Appraisal & Inspection Under Review*
     8. *Sanction & Disbursal Decision*
   - Interactive milestone check-off, milestone notes, timestamps, reference number tracker, and next-action guidance cards.
   - Statutory guidance disclaimer: "User-managed self-tracking guidance tool; official application status is determined directly by your Channel Partner bank branch."

2. **Story 7.2: Unified Beneficiary Dashboard & Saved Entities (`/dashboard`)**
   - Centralized personalized dashboard at `/dashboard`:
     - Active Application Journeys with 8-stage progress meters
     - Saved Schemes with quick compare & details links
     - Saved Channel Partners with direct dialer (`tel:`) and routing directions
     - Recent Financial Plans (EMI simulations, project cost budgets)
     - Document Readiness Summary (X of Y documents ready)
   - Quick navigation action hubs to `/find-schemes`, `/calculator`, `/planner`, `/documents`, `/partners`, and `/assistant`.
   - Local storage & authenticated Firestore persistence.
