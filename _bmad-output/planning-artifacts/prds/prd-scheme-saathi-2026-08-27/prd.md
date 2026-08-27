---
title: SchemeSathi PRD
version: 2.0 (Expanded SIH MVP)
created: 2026-08-25
updated: 2026-08-27
status: draft
---

# PRD: SchemeSathi — AI-Driven Scheme Matching, Financial Assistance & Channel Partner Discovery Platform

## 0. Document Purpose
This Product Requirements Document (PRD) establishes the definitive functional requirements, user journeys, product guardrails, and non-functional requirements for **SchemeSathi** (Version 2.0 — Expanded SIH MVP). It serves as the primary contract for product managers, designers, architects, and developers building the platform. Technical architecture, data models, Firestore collection schemas, route maps, and execution phases are documented in [addendum.md](file:///home/rahul/saksham/scheme-saathi/_bmad-output/planning-artifacts/prds/prd-scheme-saathi-2026-08-27/addendum.md).

---

## 1. Vision & Problem Statement

### 1.1 Product Vision
Build a unified, multilingual digital companion that empowers marginalized and Scheduled Caste (SC) beneficiaries (entrepreneurs, students, artisans, farmers) to seamlessly transition from:
> *"I need financial assistance or an educational loan."*  
to:  
> *"I know exactly which government scheme fits my profile, why it fits, what my repayment and moratorium obligations look like, what documents I need, and which verified Channel Partner I must visit in my district."*

### 1.2 Tagline
**"Find the Right Scheme. Find the Right Support."**

### 1.3 Core Problem & Information Gaps
While the Government of India and State Governments provide extensive concessional financial assistance and educational loan schemes for SC beneficiaries, eligible citizens face major structural barriers:
1. **Discoverability Gap:** Fragmented information scattered across multiple ministry portals.
2. **Eligibility Understanding Gap:** Complex multi-dimensional criteria (income ceilings, age limits, caste certifications, occupational categories, project cost limits).
3. **Financial Planning Gap:** Lack of clarity around loan amounts, interest subsidies, moratorium periods, interest capitalization, and required beneficiary own-contributions.
4. **Channel Partner Connectivity & Routing Gap:** Beneficiaries do not know *which* agency processes a specific scheme (e.g., State Channelizing Agencies [SCAs], Public Sector Banks [PSBs], Regional Rural Banks [RRBs], NBFC-MFIs) or *where* the nearest authorized office is located.
5. **Document Readiness Friction:** Applications are rejected because citizens approach agencies without pre-verified documents or complete checklists.
6. **Digital & Language Inaccessibility:** Portals lack native support for regional languages (Hindi, Marathi), voice interactions, or low-bandwidth environments.

### 1.4 Product Positioning & Non-Patterns
- **SchemeSathi IS:** A decision-support, financial planning, and channel partner navigation layer for government financial assistance.
- **SchemeSathi is NOT:**
  - A resume builder or job seeker portal (all resume builder features from reference templates are explicitly eliminated).
  - A generic ungrounded chatbot.
  - A simple static directory or government logo clone.
  - A direct loan disbursement portal or payment gateway.

---

## 2. Target Users & Personas

### 2.1 Primary Users
Eligible Scheduled Caste (SC) citizens seeking concessional financial assistance or education loans across six primary categories:
- **Micro-Entrepreneurs & Small Business:** Seeking seed capital, micro-credit, or equipment finance (e.g., tailoring, retail, fabrication).
- **Students & Aspiring Scholars:** Seeking concessional higher-education or vocational training loans with interest moratoriums.
- **Livelihood & Artisan Seekers:** Seeking sanitary worker rehabilitation, traditional craft, or service equipment support.
- **Agricultural & Allied Workers:** Seeking tractor, irrigation, or small agribusiness assistance.
- **Transport Sector:** Seeking small commercial vehicle or e-rickshaw financing.
- **Manufacturing & Processing Units:** Seeking term loans for medium-scale units.

### 2.2 Secondary Users
- **Common Service Center (CSC) Operators & Village Level Entrepreneurs (VLEs)** assisting rural citizens.
- **NGO Workers & Financial Literacy Volunteers** conducting outreach.
- **Family members & Community facilitators** helping digitally low-literate relatives.

### 2.3 Jobs To Be Done (JTBD)
- **Functional:** I want to discover valid government schemes matching my exact income, caste, and business/education needs so I don't waste time applying to incompatible programs.
- **Financial:** I want to calculate my exact EMI and understand the impact of interest capitalization during my moratorium period so I can plan sustainable cash flows.
- **Navigational:** I want to pinpoint the exact authorized Channel Partner office (address, contact, distance) in my district that handles my chosen scheme.
- **Operational:** I want an interactive document checklist with DigiLocker verification to arrive at the agency fully prepared.
- **Emotional:** I want clear, transparent, and trustworthy guidance in my native language without fear of data exploitation.

---

## 3. Core User Journeys

### UJ-1: Ramesh Checks Micro-Business Eligibility and Routes to an SCA Partner
- **Persona + Context:** Ramesh, a 28-year-old SC citizen in rural Maharashtra with family income ₹1,50,000/year, wants to start a small retail shop requiring ₹1,00,000 capital. Low digital literacy, prefers Marathi.
- **Entry State:** Mobile browser landing page; unauthenticated.
- **Path:**
  1. Ramesh selects Marathi language and taps **"Find My Scheme"** (or activates Voice mode: *"Mujhe dukan ke liye 1 lakh ka loan chahiye"*).
  2. Completes the 6-question assessment (State: Maharashtra, District: Satara, Category: SC, Project Cost: ₹1,00,000, Income: ₹1,50,000, Age: 28).
  3. The Eligibility Engine matches schemes and shows **NSFDC Micro-Credit Scheme** (94% Strong Match).
  4. Ramesh taps **"Why This Scheme?"** to see plain-language matching rules in Marathi (income below ₹3.0L ceiling, SC category match, cost within ₹1.5L limit).
  5. Taps **"Find Channel Partner"**; the Leaflet/OSM map centers on Satara and displays the local **Maharashtra State Other Backward Class & SC Development Corporation (SCA)** office (3.4 km away) with phone number and address.
- **Resolution:** Ramesh downloads/prints the Document Checklist and SCA partner address, ready to visit the office.

### UJ-2: Anjali Calculates Education Loan Moratorium and Verifies Documents
- **Persona + Context:** Anjali, a 21-year-old SC engineering student in Delhi, seeks an ₹8,00,000 educational loan for college tuition.
- **Entry State:** Authenticated user dashboard on desktop/mobile.
- **Path:**
  1. Anjali explores education schemes and selects the **National Scheduled Castes Finance & Development Corporation (NSFDC) Education Loan Scheme**.
  2. She taps **"Calculate Repayment"**; the EMI calculator auto-loads the scheme's 4% concessional interest rate and 10-year tenure.
  3. She slides the Moratorium to 48 months (course duration + 6 months grace).
  4. The calculator provides a side-by-side comparison of **Capitalizing Interest** vs **Servicing Interest during Moratorium**, highlighting total repayment difference.
  5. Anjali navigates to the Document Checklist and clicks **"Get from DigiLocker"**; with user consent, the system verifies her Caste Certificate and Aadhaar metadata, updating her readiness score to 4/5.
- **Resolution:** Anjali marks stage 3 ("Documents Prepared") complete in her **Application Journey Tracker**.

### UJ-3: Community Volunteer Facilitates Voice-Driven Multi-Scheme Comparison
- **Persona + Context:** Sunita, an NGO community volunteer in Uttar Pradesh, assists an illiterate artisan group.
- **Entry State:** Tablet browser in Hindi mode.
- **Path:**
  1. Sunita taps **"Talk to SchemeSathi"** (Voice Assistant).
  2. The artisan speaks in Hindi describing a footwear manufacturing cooperative needing ₹5,00,000.
  3. Voice NLP extracts structured attributes (Purpose: Manufacturing, Cost: ₹5L, State: UP, Category: SC) and loads two top schemes.
  4. Sunita uses **Scheme Comparison** to display side-by-side interest rates, subsidies, and moratorium terms to the group.
- **Resolution:** The group selects the most favorable scheme and locates the nearest Regional Rural Bank (RRB) partner branch.

---

## 4. Glossary
- **Beneficiary:** Eligible citizen (specifically SC and marginalized target groups) seeking government financial assistance or education support.
- **Scheme:** An official government concessional loan, subsidy, or financial assistance program.
- **Match Score:** A transparent 100-point indicative score evaluating profile fit against scheme rules.
- **Channel Partner:** Authorized financial intermediary processing loans (State Channelizing Agencies [SCAs], Public Sector Banks [PSBs], Regional Rural Banks [RRBs], NBFC-MFIs).
- **Moratorium Period:** Loan grace period during which principal repayment is deferred; interest may be serviced or capitalized.
- **Capitalized Interest:** Unpaid accrued interest added to the principal balance during the moratorium.
- **DigiLocker Integration:** Secure, consent-driven retrieval of government-verified certificate metadata.
- **Application Journey:** An 8-stage milestone tracker guiding beneficiaries through the post-discovery process.

---

## 5. Functional Requirements (FR)

### Module 1: Smart Scheme Recommender & Eligibility Engine
- **FR-1 [Demographic & Financial Intake]:** The system shall collect user inputs via a 6–8 question form (State, District, Age, Gender, Category/Sub-category, Annual Family Income, Occupation, Education, Requirement Type, Project Cost, Required Assistance, Own Contribution).  
  *Consequences (testable):* Invalid or negative values produce immediate inline validation errors without page refresh.
- **FR-2 [100-Point Explainable Scoring Engine]:** The system shall evaluate user profiles against scheme eligibility rules and calculate a deterministic 100-point Match Score weighted as: Income Match (20), Category Match (20), Purpose Match (20), Loan Amount Match (20), Age Match (10), Location Match (10).  
  *Consequences (testable):* Calculation completes in  client-side. Every match includes positive "Why You Match" bullet points; rejected schemes display specific "Why Not This Scheme?" reasons alongside alternative scheme links.
- **FR-3 [Indicative Score Labeling]:** The UI shall explicitly label match scores as *"Indicative matching score"* and never as an official government approval decision.  
  *Consequences (testable):* Disclaimers are rendered alongside all recommendation badges.

### Module 2: Scheme Explorer, Details & Comparison
- **FR-4 [Faceted Scheme Explorer]:** The system shall provide search and multi-facet filtering on  (Category, State, Income limit, Amount range, Purpose, Education, Sorting).  
  *Consequences (testable):* Filtering 50+ scheme records updates the list view in .
- **FR-5 [Structured Scheme Details]:** Each scheme page () shall display 14 standardized sections (Overview, Eligibility, Financial Assistance, Interest Rate, Loan Limits, Moratorium, Repayment, Required Documents, Who Can Apply, Channel Partners, Application Process, Official Source Link, Last Updated Date, Official Disclaimer).  
  *Consequences (testable):* Missing or unverified data points display *"Information not independently verified"* or *"Not available"*.
- **FR-6 [Multi-Scheme Comparison]:** The system shall allow users to select 2 to 3 schemes and display a side-by-side comparative table of interest rates, loan caps, moratoriums, subsidies, and document lists.

### Module 3: Financial & Repayment Calculators
- **FR-7 [Standard & Scheme-Aware EMI Calculator]:** The system shall calculate monthly EMI, total interest, and total repayment using standard amortization ( = rac{P \cdot r \cdot (1+r)^n}{(1+r)^n - 1}$). When opened from a scheme page, inputs pre-fill with scheme-specific interest rates and tenure bounds.  
  *Consequences (testable):* Adjusting sliders updates EMI figures and amortization breakdown in real time.
- **FR-8 [Moratorium & Capitalization Calculator]:** The calculator shall simulate loan repayment with moratorium periods (0 to 60 months) and model both interest capitalization (adding unpaid interest to principal) and interest servicing.
- **FR-9 [Project Cost Planner & Financing Breakdown]:** The system shall allow entrepreneurs to itemize project costs (Equipment, Raw Materials, Rent, Working Capital, Other) and automatically generate the funding breakdown (Scheme Concessional Finance vs Required Beneficiary Own Contribution).

### Module 4: Geo-Spatial Channel Partner Locator
- **FR-10 [Channel Partner Locator & Map]:** The system shall render an interactive Leaflet/OpenStreetMap interface on  displaying authorized partners (SCAs, PSBs, RRBs, NBFC-MFIs) filtered by scheme compatibility, district, partner type, and availability.  
  *Consequences (testable):* Map operates fully without requiring Google Maps API keys. GPS failure falls back to manual State/District dropdown selection.
- **FR-11 [Partner Routing & Match Score]:** The system shall rank partners based on a 100% Partner Match Score: Scheme Compatibility (40%), Location Coverage (25%), Loan Category (20%), Distance (10%), Verified Availability (5%).  
  *Consequences (testable):* The closest eligible Channel Partner is highlighted with badge *"Closest eligible partner for your selected scheme"*.
- **FR-12 [Synthetic/Demo Partner Data Labeling]:** Where live real-time partner fund utilization or NPA figures are not publicly provided by government APIs, mock/demo data must be clearly tagged with *"Demo/synthetic data"* or *"Partner availability based on latest verified information"*. No fictional data may be presented as official.

### Module 5: Voice Interaction & AI Assistant
- **FR-13 [Multilingual Voice Input & Conversation]:** The system shall support voice-based interaction in English, Hindi, and Marathi via browser-native SpeechRecognition (Web Speech API) with automatic fallback to text chat.  
  *Consequences (testable):* Voice inputs extract structured parameters (Purpose, Amount, State, Category) to execute scheme recommendations.
- **FR-14 [AI Safety & Grounding Rule]:** The conversational assistant shall answer exclusively from verified scheme data. If asked ungrounded questions or policy advice, it must reply: *"I couldn't verify this information from the available official source"* and strictly avoid hallucinating loan approvals or benefits.

### Module 6: Document Checklist & DigiLocker Integration
- **FR-15 [Dynamic Document Checklist]:** The system shall present an interactive document readiness checklist for each scheme with persistent state and progress indicators (e.g., "3/5 documents ready").
- **FR-16 [DigiLocker Integration with Manual Fallback]:** The system shall support a consent-driven DigiLocker metadata connection flow. If DigiLocker is unavailable or unconfigured, the UI must seamlessly provide a *"Upload manually"* fallback without breaking the user journey.

### Module 7: Application Journey & User Dashboard
- **FR-17 [8-Stage Application Journey Tracker]:** The system shall provide an interactive milestone tracker across 8 user-managed stages: (1) Scheme Identified, (2) Eligibility Checked, (3) Documents Prepared, (4) Partner Identified, (5) Application Started, (6) Application Submitted, (7) Under Review, (8) Decision.
- **FR-18 [Personalized User Dashboard]:** Authenticated users shall have a unified dashboard () displaying Saved Schemes, Saved Partners, Calculation History, Document Readiness Status, and Active Application Journeys.

---

## 6. Non-Goals (Explicit Out of Scope)
1. **Resume Building & Job Portals:** No resume creation, ATS scoring, resume templates, or job matching.
2. **Direct Loan Disbursement:** The platform does not collect loan payments, disburse funds, or evaluate credit bureau scores.
3. **Automated Government Portal Submission:** MVP does not directly submit legal loan applications into government backends (it acts as the preparation and routing companion).
4. **Generic AI Chat:** The assistant will not engage in general banter or non-scheme domains.

---

## 7. Cross-Cutting Non-Functional Requirements (NFR)

### 7.1 Performance & Scalability
- **NFR-P1 (Eligibility Latency):** Rule-based scheme matching and scoring must execute in  client-side and  over network.
- **NFR-P2 (End-to-End Discovery):** User journey from landing page to ranked scheme and nearest partner must complete in  for a standard user session.
- **NFR-P3 (Concurrent Capacity):** Cloud backend and Firestore rules must support a minimum of 1,000 concurrent active demo users.

### 7.2 Security & Privacy Architecture
- **NFR-S1 (Minimal PII Storage):** No Aadhaar numbers, biometric data, bank credentials, or passwords shall ever be collected or stored.
- **NFR-S2 (Firestore Security):** Strict Firestore Security Rules enforcing user-scoped read/write permissions ().
- **NFR-S3 (HTTPS & Secret Hygiene):** 100% HTTPS enforcement; all API keys and secrets excluded from Git version control.

### 7.3 Accessibility & Low-Bandwidth Optimization
- **NFR-A1 (Multilingual Localization):** 100% UI string localization across English, Hindi, and Marathi via standard  translation files.
- **NFR-A2 (Accessibility Compliance):** High-contrast UI, readable typography, large touch targets (min 44x44px), screen-reader labels, and keyboard navigation.
- **NFR-A3 (Low-Bandwidth Design):** Lazy-loaded maps, zero video dependencies, compressed static assets, and text-first layouts optimized for 2G/3G mobile networks.

---

## 8. Success Metrics & Counter-Metrics

### 8.1 Primary Success Metrics
- **SM-1 (Match Precision):** >= 85% validated accuracy against manual government eligibility guidelines.
- **SM-2 (Journey Completion Rate):** >= 70% of users who start "Find My Scheme" complete the assessment and view ranked results.
- **SM-3 (Time to First Partner):** Average time from landing page to locating an authorized Channel Partner is < 30 seconds.
- **SM-4 (Document Readiness Rate):** >= 60% of users identify and check off required documents prior to agency visit.
- **SM-5 (User Satisfaction Score):** >= 4.0 / 5.0 in usability and trust feedback surveys.

### 8.2 Counter-Metrics (Do NOT Optimize)
- **CM-1 (Time-on-Site):** Do not attempt to maximize session duration. Users should find their target scheme, calculate obligations, locate their partner, and leave quickly with high clarity.
- **CM-2 (Raw Application Count):** Do not maximize indiscriminate clicks to external portals; prioritize verified eligibility alignment over volume.

---

## 9. Open Questions & Assumptions Index

### 9.1 Open Questions
1. *PWA Offline Sync:* Should offline caching (Service Workers + IndexedDB) be enabled for full offline scheme browsing in rural areas during v2.1?
2. *State-Level SC Sub-Categories:* How will complex state-level sub-caste reservations (e.g., special backward classes within SC lists) be mapped in future expansion?

### 9.2 Assumptions Index
- **[ASSUMPTION 1.1]:** Initial scheme database is seeded with 50+ curated, verified central and state schemes (NSFDC, NSKFDC, NBCFDC, Stand-Up India, DICCI programs).
- **[ASSUMPTION 1.2]:** In local development and demonstration modes, phone OTP authentication accepts mock OTP  for rapid evaluation.
- **[ASSUMPTION 1.3]:** Browser Web Speech API provides adequate client-side speech recognition for Hindi/English; cloud speech APIs remain optional plug-ins.
- **[ASSUMPTION 1.4]:** Leaflet + OpenStreetMap provides adequate tile rendering and bounding-box distance calculation without incurring commercial Google Maps API fees.

---

## 10. Definition of Done (SIH Demo Readiness)
SchemeSathi is considered complete and production-ready for SIH when:
1. Complete Homepage with Hero, How It Works, Trust Attributions, and Language Selector.
2. Scheme Explorer with search, 7 filters, and 50+ verified schemes.
3. 6–8 question Recommender with 100-pt explainable match scores and why-not-this-scheme alternatives.
4. Scheme Details view with 14 standardized sections and official source links.
5. EMI & Moratorium Calculator with interest capitalization modeling and Project Cost Planner.
6. Partner Locator map (React Leaflet/OSM) with distance calculation and partner match scoring.
7. Multilingual interface functional in English, Hindi, and Marathi.
8. Voice assistant prototype functioning with speech-to-text assessment extraction.
9. Dynamic Document Checklist and DigiLocker mock/authorized integration with manual upload fallback.
10. 8-stage Application Journey tracker and User Dashboard.
11. Admin Portal for scheme, partner, and verification management.
12. All unit and integration test suites pass; zero TypeScript compiler errors; build clean.
