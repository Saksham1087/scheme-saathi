---
stepsCompleted:
  - step-01-validate-prerequisites
  - step-02-design-epics
  - step-03-create-stories
  - step-04-final-validation
inputDocuments:
  - _bmad-output/planning-artifacts/prds/prd-scheme-saathi-2026-08-27/prd.md
  - _bmad-output/planning-artifacts/prds/prd-scheme-saathi-2026-08-27/addendum.md
  - _bmad-output/planning-artifacts/architectures/architecture-scheme-saathi-2026-08-27/ARCHITECTURE-SPINE.md
---

# SchemeSathi - Epic Breakdown

## Overview

This document provides the complete epic and story breakdown for **SchemeSathi**, decomposing the requirements from the PRD v2.0, Architecture Spine, and UX design specifications into implementable stories for autonomous development loops and engineering sprints.

## Requirements Inventory

### Functional Requirements

- **FR-1 [Demographic & Financial Intake]:** The system shall collect user inputs via a 6–8 question form (State, District, Age, Gender, Category/Sub-category, Annual Family Income, Occupation, Education, Requirement Type, Project Cost, Required Assistance, Own Contribution) with immediate inline validation.
- **FR-2 [100-Point Explainable Scoring Engine]:** The system shall evaluate user profiles against scheme eligibility rules and calculate a deterministic 100-point Match Score weighted as: Income Match (20), Category Match (20), Purpose Match (20), Loan Amount Match (20), Age Match (10), Location Match (10) in < 50ms with positive and negative ("Why Not This Scheme?") reasoning.
- **FR-3 [Indicative Score Labeling]:** The UI shall explicitly label match scores as "Indicative matching score" and never as an official government approval decision.
- **FR-4 [Faceted Scheme Explorer]:** The system shall provide search and multi-facet filtering on `/schemes` (Category, State, Income limit, Amount range, Purpose, Education, Sorting).
- **FR-5 [Structured Scheme Details]:** Each scheme page (`/schemes/:id`) shall display 14 standardized sections (Overview, Eligibility, Financial Assistance, Interest Rate, Loan Limits, Moratorium, Repayment, Required Documents, Who Can Apply, Channel Partners, Application Process, Official Source Link, Last Updated Date, Official Disclaimer).
- **FR-6 [Multi-Scheme Comparison]:** The system shall allow users to select 2 to 3 schemes and display a side-by-side comparative table of interest rates, loan caps, moratoriums, subsidies, and document lists.
- **FR-7 [Standard & Scheme-Aware EMI Calculator]:** The system shall calculate monthly EMI, total interest, and total repayment using standard amortization. When opened from a scheme page, inputs pre-fill with scheme-specific interest rates and tenure bounds.
- **FR-8 [Moratorium & Capitalization Calculator]:** The calculator shall simulate loan repayment with moratorium periods (0 to 60 months) and model both interest capitalization (adding unpaid interest to principal) and interest servicing.
- **FR-9 [Project Cost Planner & Financing Breakdown]:** The system shall allow entrepreneurs to itemize project costs (Equipment, Raw Materials, Rent, Working Capital, Other) and automatically generate the funding breakdown (Scheme Concessional Finance vs Required Beneficiary Own Contribution).
- **FR-10 [Channel Partner Locator & Map]:** The system shall render an interactive Leaflet/OpenStreetMap interface on `/partners` displaying authorized partners (SCAs, PSBs, RRBs, NBFC-MFIs) filtered by scheme compatibility, district, partner type, and availability without Google Maps API keys.
- **FR-11 [Partner Routing & Match Score]:** The system shall rank partners based on a 100% Partner Match Score: Scheme Compatibility (40%), Location Coverage (25%), Loan Category (20%), Distance (10%), Verified Availability (5%) and highlight the nearest partner.
- **FR-12 [Synthetic/Demo Partner Data Labeling]:** Where live real-time partner fund utilization or NPA figures are not publicly provided by government APIs, mock/demo data must be clearly tagged with "Demo/synthetic data".
- **FR-13 [Multilingual Voice Input & Conversation]:** The system shall support voice-based interaction in English, Hindi, and Marathi via browser-native SpeechRecognition (Web Speech API) with automatic fallback to text chat.
- **FR-14 [AI Safety & Grounding Rule]:** The conversational assistant shall answer exclusively from verified scheme data, strictly avoid hallucinating loan approvals, and output "I couldn't verify this information from the available official source" for ungrounded queries.
- **FR-15 [Dynamic Document Checklist]:** The system shall present an interactive document readiness checklist for each scheme with persistent state and progress indicators ("3/5 documents ready").
- **FR-16 [DigiLocker Integration with Manual Fallback]:** The system shall support a consent-driven DigiLocker metadata connection flow with a seamless "Upload manually" fallback.
- **FR-17 [8-Stage Application Journey Tracker]:** The system shall provide an interactive milestone tracker across 8 user-managed stages (Scheme Identified -> Eligibility Checked -> Documents Prepared -> Partner Identified -> Application Started -> Application Submitted -> Under Review -> Decision).
- **FR-18 [Personalized User Dashboard]:** Authenticated users shall have a unified dashboard (`/dashboard`) displaying Saved Schemes, Saved Partners, Calculation History, Document Readiness Status, and Active Application Journeys.

### NonFunctional Requirements

- **NFR-P1 (Eligibility Latency):** Rule-based scheme matching and scoring must execute in < 100ms client-side and < 1.5s over network.
- **NFR-P2 (End-to-End Discovery):** User journey from landing page to ranked scheme and nearest partner must complete in < 30 seconds for a standard user session.
- **NFR-P3 (Concurrent Capacity):** Cloud backend and Firestore rules must support a minimum of 1,000 concurrent active demo users.
- **NFR-S1 (Minimal PII Storage):** No Aadhaar numbers, biometric data, bank credentials, or passwords shall ever be collected or stored.
- **NFR-S2 (Firestore Security):** Strict Firestore Security Rules enforcing user-scoped read/write permissions (`request.auth.uid == resource.data.userId`).
- **NFR-S3 (HTTPS & Secret Hygiene):** 100% HTTPS enforcement; all API keys and secrets excluded from Git version control.
- **NFR-A1 (Multilingual Localization):** 100% UI string localization across English, Hindi, and Marathi via standard `src/locales/{en,hi,mr}.json` translation files.
- **NFR-A2 (Accessibility Compliance):** High-contrast UI, readable typography, large touch targets (min 44x44px), screen-reader labels, and keyboard navigation.
- **NFR-A3 (Low-Bandwidth Design):** Lazy-loaded maps, zero video dependencies, compressed static assets, and text-first layouts optimized for 2G/3G mobile networks.

### Additional Requirements (Architecture)

- **AD-1 [Firestore 15-Collection Partitioning]:** Normalize entities across 15 typed collections with user-scoped security rules.
- **AD-2 [Leaflet + OSM Mapping]:** React Leaflet with OpenStreetMap tiles and Haversine distance calculations (no Google Maps API).
- **AD-3 [Pure TypeScript Rule Engine]:** Pure deterministic TypeScript functions for instant sub-50ms matching and full testability.
- **AD-4 [Grounded Conversational AI]:** Web Speech API integration with Groq/Gemini context injection and strict safety guardrails.
- **AD-5 [DigiLocker & Upload Fallback]:** Consent-based metadata retrieval with resilient manual document upload fallback.
- **AD-6 [Zustand & i18n]:** Global state managed via Zustand and localization via `react-i18next`.
- **AD-7 [Zero-PII Policy]:** Session-only processing for unauthenticated users; zero sensitive credential storage.

### UX Design Requirements

- **UX-DR1 [Design System & High-Contrast Typography]:** Clean public digital infrastructure design with large touch targets (min 44x44px) and WCAG AA contrast.
- **UX-DR2 [Reusable Component Library]:** Navbar, Footer, SchemeCard, SchemeFilter, SchemeComparison, MatchScore, ProgressIndicator, EMICalculator, ProjectCostPlanner, PartnerCard, PartnerMap, DocumentChecklist, VoiceAssistantModal, DigiLockerButton.
- **UX-DR3 [Dynamic Readiness & Status Badges]:** Progress badges ("3/5 documents ready", "Closest eligible partner", "Indicative matching score").
- **UX-DR4 [Responsive Mobile-First Layouts]:** Optimized layout transitions from mobile single-column to desktop multi-column dashboards.
- **UX-DR5 [Visual Comparison Matrix]:** Side-by-side sticky column comparison table for 2–3 selected schemes.
- **UX-DR6 [Low-Literacy Voice Staging]:** Prominent microphone trigger and conversational assistant drawer with live speech-to-text transcript bubbles.

### FR Coverage Map

- **FR-1:** Epic 2 — Smart Eligibility Assessment & Explainable Recommendation Engine
- **FR-2:** Epic 2 — Smart Eligibility Assessment & Explainable Recommendation Engine
- **FR-3:** Epic 2 — Smart Eligibility Assessment & Explainable Recommendation Engine
- **FR-4:** Epic 1 — Scheme Discovery & Faceted Explorer
- **FR-5:** Epic 1 — Scheme Discovery & Faceted Explorer
- **FR-6:** Epic 1 — Scheme Discovery & Faceted Explorer
- **FR-7:** Epic 3 — Financial Planning, Moratorium & Project Cost Calculators
- **FR-8:** Epic 3 — Financial Planning, Moratorium & Project Cost Calculators
- **FR-9:** Epic 3 — Financial Planning, Moratorium & Project Cost Calculators
- **FR-10:** Epic 4 — Geo-Spatial Channel Partner Discovery & Routing
- **FR-11:** Epic 4 — Geo-Spatial Channel Partner Discovery & Routing
- **FR-12:** Epic 4 — Geo-Spatial Channel Partner Discovery & Routing
- **FR-13:** Epic 6 — Multilingual Voice Assistant & Grounded Conversational Support
- **FR-14:** Epic 6 — Multilingual Voice Assistant & Grounded Conversational Support
- **FR-15:** Epic 5 — Dynamic Document Checklist & DigiLocker Verification
- **FR-16:** Epic 5 — Dynamic Document Checklist & DigiLocker Verification
- **FR-17:** Epic 7 — Application Journey Tracking & Personalized User Dashboard
- **FR-18:** Epic 7 — Application Journey Tracking & Personalized User Dashboard

## Epic List

### Epic 1: Scheme Discovery & Faceted Explorer
Enable citizens to browse, search, filter across 7 dimensions (Category, State, Income, Amount, Purpose, Education, Sorting), view standardized 14-section Scheme Details pages with official source attribution, and compare multiple schemes side-by-side.
**FRs covered:** FR-4, FR-5, FR-6

### Epic 2: Smart Eligibility Assessment & Explainable Recommendation Engine
Provide an intuitive 6–8 question demographic and financial intake flow backed by a pure, deterministic 100-point scoring algorithm (Income 20, Category 20, Purpose 20, Loan Amount 20, Age 10, Location 10) that returns ranked matches in < 50ms with positive and negative ("Why Not This Scheme?") explanations and indicative score disclaimers.
**FRs covered:** FR-1, FR-2, FR-3

### Epic 3: Financial Planning, Moratorium & Project Cost Calculators
Empower beneficiaries to simulate monthly EMI obligations, model the financial impact of interest capitalization versus servicing during moratorium periods, and construct itemized project budgets with automatic loan-to-own-contribution financing splits.
**FRs covered:** FR-7, FR-8, FR-9

### Epic 4: Geo-Spatial Channel Partner Discovery & Routing
Enable users to locate verified Channel Partners (State Channelizing Agencies, Public Sector Banks, Regional Rural Banks, NBFC-MFIs) on an interactive Leaflet/OpenStreetMap interface, ranked by a 5-factor Partner Match Score with distance routing and synthetic data labeling.
**FRs covered:** FR-10, FR-11, FR-12

### Epic 5: Dynamic Document Checklist & DigiLocker Verification
Provide an interactive, persistent document checklist tailored to each scheme with visual progress indicators, instant DigiLocker certificate metadata verification, and a seamless manual upload fallback.
**FRs covered:** FR-15, FR-16

### Epic 6: Multilingual Voice Assistant & Grounded Conversational Support
Enable low-literacy citizens to interact in Hindi, Marathi, and English via browser-native Web Speech API, with an always-accessible conversational assistant strictly grounded in verified Firestore scheme data to prevent hallucinations.
**FRs covered:** FR-13, FR-14

### Epic 7: Application Journey Tracking & Personalized User Dashboard
Provide authenticated beneficiaries with an 8-stage post-discovery application milestone tracker and a centralized dashboard managing saved schemes, partners, calculations, and document readiness.
**FRs covered:** FR-17, FR-18

---

## Epic 1: Scheme Discovery & Faceted Explorer

Enable citizens to browse, search, filter across 7 dimensions, inspect structured 14-section Scheme Details pages, and compare schemes side-by-side.

### Story 1.1: Faceted Scheme Catalog & Multi-Dimension Filtering
As a citizen looking for government financial support,
I want to search and filter schemes across Category, State, Income, Amount, and Purpose on `/schemes`,
So that I can quickly discover applicable central and state programs.

**Acceptance Criteria:**
- **Given** a user navigates to `/schemes`
- **When** the catalog loads
- **Then** all verified schemes are displayed as cards showing Scheme Name, Ministry, Purpose, Max Assistance, and Category badge
- **And** applying filters (e.g., Category: "Business", State: "Maharashtra") updates the displayed list in < 100ms
- **And** text search filters dynamically by scheme name or keywords

### Story 1.2: Standardized 14-Section Scheme Details Page
As a beneficiary evaluating a specific scheme,
I want to view a comprehensive details page on `/schemes/:id` with 14 standardized sections and official source links,
So that I can thoroughly understand the terms, benefits, documents, and rules without ambiguity.

**Acceptance Criteria:**
- **Given** a user clicks on a scheme card
- **When** the page `/schemes/:id` loads
- **Then** all 14 standardized sections are rendered (Overview, Eligibility, Financial Assistance, Interest Rate, Loan Limits, Moratorium, Repayment, Required Documents, Who Can Apply, Channel Partners, Application Process, Official Source Link, Last Updated Date, Official Disclaimer)
- **And** if any field is unverified, the UI displays "Information not independently verified"
- **And** clicking "Calculate EMI" or "Find Partner" navigates to the respective tool pre-filled with this scheme context

### Story 1.3: Multi-Scheme Side-by-Side Comparison Matrix
As a user choosing between multiple loan options,
I want to select 2 to 3 schemes and compare their interest rates, loan limits, moratorium terms, and documents side-by-side,
So that I can select the most financially beneficial scheme for my venture.

**Acceptance Criteria:**
- **Given** a user is browsing the scheme explorer
- **When** the user clicks "Add to Compare" on 2 or 3 schemes
- **Then** a floating comparison bar appears with an "Open Comparison" CTA
- **When** the user opens comparison
- **Then** a responsive table displays side-by-side rows comparing Purpose, Max Assistance, Interest Rate Range, Moratorium Period, and Required Documents

---

## Epic 2: Smart Eligibility Assessment & Explainable Recommendation Engine

Provide an intuitive demographic and financial intake flow backed by a pure deterministic 100-point scoring algorithm with explainable reasoning.

### Story 2.1: 6–8 Question Demographic & Financial Intake Flow
As an aspiring entrepreneur or student,
I want to answer a short 6–8 question assessment form (State, Category, Age, Income, Purpose, Project Cost),
So that the platform can accurately evaluate my eligibility.

**Acceptance Criteria:**
- **Given** a user opens `/find-schemes` (or `/recommend`)
- **When** the assessment form renders
- **Then** questions are presented with high-contrast inputs, step progress indicators, and inline validation
- **And** entering negative income or invalid numbers produces immediate inline errors
- **When** all questions are answered and submitted, the profile is passed to the scoring engine

### Story 2.2: 100-Point Deterministic Eligibility & Scoring Engine
As a beneficiary seeking assistance,
I want the system to compute a transparent, weighted match score for each scheme,
So that I can see the best-fitting schemes ranked by suitability.

**Acceptance Criteria:**
- **Given** a submitted user profile
- **When** the Eligibility Engine evaluates available schemes
- **Then** a 100-point score is calculated as: Income (20), Category (20), Purpose (20), Loan Amount (20), Age (10), Location (10) in < 50ms
- **And** all recommendation badges display the mandatory label "Indicative matching score"
- **And** the top 5–10 schemes are returned ranked in descending order of suitability

### Story 2.3: Explainable Matching & "Why Not This Scheme?" Alternatives
As a citizen reviewing recommendations,
I want to see plain-language reasons for why each scheme was recommended or rejected,
So that I understand the government criteria and know what alternatives exist if I don't qualify.

**Acceptance Criteria:**
- **Given** a ranked recommendation card
- **When** the user inspects "Why This Scheme?"
- **Then** bullet points display exact matching conditions (e.g., "Your annual family income ₹1.5L is below the ₹3.0L ceiling")
- **And** for rejected schemes, specific non-matching constraints are displayed (e.g., "Requested loan exceeds maximum ₹1.5L limit") along with links to suitable alternative schemes

---

## Epic 3: Financial Planning, Moratorium & Project Cost Calculators

Empower beneficiaries to simulate monthly EMI obligations, model moratorium interest capitalization, and plan itemized project budgets.

### Story 3.1: Standard & Scheme-Aware EMI Amortization Calculator
As a loan applicant,
I want to calculate my monthly EMI and total interest using sliders for loan amount, interest rate, and tenure,
So that I can plan my monthly cash flow before applying.

**Acceptance Criteria:**
- **Given** a user navigates to `/calculator`
- **When** the user adjusts Loan Amount, Interest Rate, or Tenure
- **Then** monthly EMI, total interest, and total repayment update in real time using standard amortization formulas
- **And** when opened from a specific scheme, inputs auto-populate with the scheme's concessional rate and tenure limits

### Story 3.2: Moratorium & Interest Capitalization Simulation
As a student or new entrepreneur,
I want to simulate loan repayment under moratorium grace periods and compare capitalizing vs servicing interest,
So that I understand the total financial cost of deferring repayments during my study or business gestation.

**Acceptance Criteria:**
- **Given** a loan amount and tenure in the calculator
- **When** the user adjusts the Moratorium slider (0 to 60 months)
- **Then** the calculator presents a side-by-side comparison:
  - Scenario A: Capitalizing Interest (unpaid accrued interest added to principal)
  - Scenario B: Servicing Interest monthly during moratorium
- **And** the total difference in lifetime interest paid is clearly highlighted

### Story 3.3: Project Cost Planner & Financing Breakdown
As a small business applicant,
I want to itemize my startup costs (Equipment, Raw Materials, Rent, Working Capital, Other),
So that the system calculates my total project cost and breaks down the Scheme Concessional Loan vs Required Own Contribution.

**Acceptance Criteria:**
- **Given** the Project Cost Planner tool
- **When** the user adds line items for Equipment, Materials, Rent, and Working Capital
- **Then** the total project cost is automatically summed
- **And** the system generates the Financing Breakdown (e.g., Scheme Concessional Finance 90% vs Beneficiary Own Contribution 10%) based on verified scheme rules
- **And** a CTA allows passing the total budget directly into the scheme recommendation intake

---

## Epic 4: Geo-Spatial Channel Partner Discovery & Routing

Enable users to locate verified Channel Partners on an interactive OpenStreetMap interface with 5-factor Partner Match Scoring and distance routing.

### Story 4.1: React Leaflet Partner Map & Geo-Spatial Search
As a beneficiary ready to apply,
I want to view authorized Channel Partner offices (SCAs, PSBs, RRBs, NBFC-MFIs) on an interactive map at `/partners`,
So that I know where to go in my district.

**Acceptance Criteria:**
- **Given** a user opens `/partners`
- **When** the map loads
- **Then** it renders using React Leaflet and OpenStreetMap tiles without any Google Maps API dependency
- **And** partner markers display across the user's state and district with address, phone number, and operating hours
- **And** if browser geolocation is unavailable or denied, a manual State & District dropdown allows instant centering

### Story 4.2: 5-Factor Partner Match Scoring & Nearest Partner Routing
As a citizen with a chosen scheme,
I want to find the nearest authorized Channel Partner that specifically processes my scheme,
So that I do not visit an incompatible bank branch.

**Acceptance Criteria:**
- **Given** a selected scheme
- **When** the user clicks "Find My Channel Partner"
- **Then** the system computes a Partner Match Score: Compatibility (40%), Location (25%), Loan Category (20%), Distance (10%), Availability (5%)
- **And** the closest eligible Channel Partner is highlighted with the badge "Closest eligible partner for your selected scheme"
- **And** incompatible partner branches are visually dimmed with an explanatory tooltip

### Story 4.3: Partner Profile Details & Synthetic Data Guardrails
As a user inspecting a partner,
I want to view verified contact details, supported categories, and data freshness timestamps,
So that I know the information is authentic and up to date.

**Acceptance Criteria:**
- **Given** a partner card on map or list view
- **When** the user views partner details
- **Then** official source attribution, phone, email, and supported scheme categories are displayed
- **And** where real-time live NPA or fund utilization figures are simulated, they are clearly tagged with "Demo/synthetic data"
- **And** no synthetic data is ever presented as official government confirmation

---

## Epic 5: Dynamic Document Checklist & DigiLocker Verification

Provide an interactive document checklist with DigiLocker certificate metadata verification and manual upload fallback.

### Story 5.1: Scheme-Specific Interactive Document Checklist
As an applicant preparing my documents,
I want an interactive checklist of required certificates (Aadhaar, Caste, Income, Project Report) with a readiness progress counter,
So that I can assemble all documents before visiting the Channel Partner.

**Acceptance Criteria:**
- **Given** a selected scheme
- **When** the user views the Document Checklist
- **Then** the dynamic list of required certificates for that scheme is displayed
- **And** checking off items updates the visual progress counter (e.g., "3/5 documents ready") and persists in state
- **And** the checklist can be printed or saved locally for offline reference

### Story 5.2: DigiLocker Certificate Sync with Manual Upload Fallback
As an applicant with digital government certificates,
I want to connect DigiLocker to automatically verify my Caste and Income certificates, with an instant fallback to upload manually,
So that I can verify my document readiness with minimal friction.

**Acceptance Criteria:**
- **Given** the Document Checklist
- **When** the user clicks "Get from DigiLocker"
- **Then** a consent modal initiates the certificate metadata handshake
- **And** verified certificates are marked with a green "Verified via DigiLocker" badge
- **And** if DigiLocker is unconfigured or offline, an immediate "Upload manually" option is presented without disrupting the user flow

---

## Epic 6: Multilingual Voice Assistant & Grounded Conversational Support

Enable low-literacy citizens to interact via voice in Hindi, Marathi, and English with strict zero-hallucination official source grounding.

### Story 6.1: Web Speech API Multilingual Voice Intake
As a citizen who prefers speaking over typing,
I want to tap a microphone and speak my requirements in Hindi, Marathi, or English,
So that SchemeSathi fills out my assessment without complex form typing.

**Acceptance Criteria:**
- **Given** any page with the "Talk to SchemeSathi" voice button
- **When** the user taps the mic and speaks (e.g., "Mujhe dukan ke liye 1 lakh ka loan chahiye")
- **Then** browser-native Web Speech API captures speech and extracts parameters (Purpose: Business, Amount: ₹1,00,000, Language: Hindi)
- **And** extracted parameters populate the recommendation intake flow
- **And** if microphone permissions are denied or speech recognition fails, an immediate text chat fallback is provided

### Story 6.2: Grounded Conversational Scheme Assistant
As a citizen asking questions about government schemes,
I want to ask the assistant for advice and receive answers grounded strictly in official scheme data,
So that I never receive misleading or fabricated loan approval promises.

**Acceptance Criteria:**
- **Given** an open conversational assistant session
- **When** the user asks a question about loan terms or eligibility
- **Then** the assistant injects verified Firestore scheme data into the context and replies accurately
- **And** if the user asks ungrounded or speculative questions, the assistant adheres to the AI Safety Rule: "I couldn't verify this information from the available official source"
- **And** the assistant strictly avoids fabricating government policies or loan sanctions

---

## Epic 7: Application Journey Tracking & Personalized User Dashboard

Provide authenticated beneficiaries with an 8-stage post-discovery milestone tracker and unified user dashboard.

### Story 7.1: 8-Stage Post-Discovery Application Milestone Tracker
As a beneficiary who has chosen a scheme and partner,
I want to track my progress across 8 milestone stages,
So that I know what action to take next in my application journey.

**Acceptance Criteria:**
- **Given** an authenticated user who selects a scheme
- **When** the user starts an application journey (`/application/:id`)
- **Then** an 8-stage visual milestone tracker is displayed: (1) Scheme Identified, (2) Eligibility Checked, (3) Documents Prepared, (4) Partner Identified, (5) Application Started, (6) Application Submitted, (7) Under Review, (8) Decision
- **And** users can mark stages complete, add notes, and view next-step guidance
- **And** stages are clearly labeled as user-managed tracking guidance rather than official government status

### Story 7.2: Unified Beneficiary Dashboard & Saved Entities
As a returning citizen,
I want a personalized dashboard at `/dashboard` displaying my saved schemes, partners, calculations, and active application journeys,
So that I can resume my process across multiple visits.

**Acceptance Criteria:**
- **Given** an authenticated user navigating to `/dashboard`
- **When** the dashboard renders
- **Then** cards show Saved Schemes, Saved Channel Partners, Recent EMI/Moratorium Calculations, Document Readiness Status, and Active Application Journeys
- **And** clicking any card opens the detailed view with full preserved state
- **And** user data is securely scoped to `request.auth.uid`
