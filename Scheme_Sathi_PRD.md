# SCHEME SATHI
## AI-Driven Scheme Matching, Financial Assistance & Channel Partner Discovery Platform

**Complete Product Requirements Document (PRD) + Product Planning + Technical Architecture**

- **Version:** 2.0 — Expanded SIH MVP
- **Date:** August 25, 2026
- **Product Name:** Scheme Sathi
- **Tagline:** *Find the Right Scheme. Find the Right Support.*

---

## 1. Executive Summary

Scheme Sathi is a multilingual, AI-assisted digital platform designed to help marginalized and Scheduled Caste (SC) beneficiaries discover suitable government financial-assistance and educational schemes, understand their eligibility, estimate repayment obligations, and identify an appropriate authorized Channel Partner.

The platform addresses the information and navigation gap between beneficiaries and government financial-assistance programs.

The original PRD identifies three major problems:
- Fragmented scheme information
- Confusion around complex eligibility criteria
- Lack of transparency around official application routes

Scheme Sathi expands this into a complete journey:

**Discover → Match → Understand → Calculate → Verify Documents → Find Partner → Apply → Track**

The platform will be designed as a modern public-service application, taking inspiration from the overall UX structure and usability philosophy of myresume.gov.in, while using completely new branding, content, functionality and assets for Scheme Sathi.

> It must **NOT** be a resume website clone.
> It must **NOT** become a generic MyScheme clone.

Its primary differentiation is:

> **Intelligent financial-assistance matching + financial planning + Channel Partner discovery and routing.**

---

## 2. Problem Statement

### AI-Driven Scheme Matching for Marginalized Entrepreneurs

The government provides concessional financial assistance and educational loans to eligible Scheduled Caste beneficiaries. However, beneficiaries often face difficulties understanding:

- Which scheme is suitable
- Whether they satisfy eligibility conditions
- How much financial assistance they can receive
- What their repayment could look like
- Which Channel Partner can process the application
- Where the nearest eligible Channel Partner is located
- Which documents are required
- How to proceed after identifying a scheme

The uploaded PRD similarly identifies information gaps, eligibility confusion and trust issues as core barriers.

---

## 3. Problem Gap

Scheme Sathi specifically addresses:

**Gap 1 — Discoverability**
Users do not know which scheme matches their circumstances.

**Gap 2 — Eligibility Understanding**
Eligibility conditions may involve:
- Income
- Age
- Occupation
- Category
- State
- Project purpose
- Education
- Disability
- Documents

**Gap 3 — Financial Understanding**
Users may not understand:
- Loan amount
- Interest rate
- EMI
- Moratorium
- Repayment period
- Own contribution

**Gap 4 — Channel Partner Connectivity**
Users may know a scheme but not know: "Where do I actually go to process this?"

**Gap 5 — Partner Routing**
A beneficiary needs an eligible and geographically appropriate Channel Partner rather than simply the nearest bank.

**Gap 6 — Document Readiness**
Users often don't know which documents they need before approaching an agency.

**Gap 7 — Application Journey**
Users need guidance after scheme discovery instead of being left at an external application link.

**Gap 8 — Language & Accessibility**
Users may be more comfortable with:
- Hindi
- Marathi
- Regional languages
- Voice interaction

---

## 4. Product Vision

**Vision**

Build a single digital companion that helps an eligible beneficiary move from:

> "I need financial assistance."

to:

> "I know which scheme suits me, how much assistance I may receive, what repayment could look like, what documents I need, and which authorized Channel Partner I should approach."

---

## 5. Product Positioning

**Scheme Sathi is NOT:**
- A resume builder
- A generic chatbot
- A simple scheme directory
- A generic EMI calculator
- A generic map application

**Scheme Sathi IS:**

> A decision-support and navigation layer for government financial-assistance schemes.

---

## 6. Core Product Journey

The primary journey is:

```
LANDING PAGE
↓
Tell Us What You Need
↓
Beneficiary Assessment
↓
Eligibility Engine
↓
AI / Rule-Based Matching
↓
Ranked Scheme Recommendations
↓
Why This Scheme?
↓
Scheme Comparison
↓
Financial Planning
↓
EMI + Moratorium Calculator
↓
Document Readiness
↓
Find Eligible Channel Partner
↓
Partner Routing
↓
Application Guidance
↓
Application Journey Tracking
```

---

## 7. Target Users

### Primary Users

SC beneficiaries seeking:
- Business assistance
- Livelihood assistance
- Education loans
- Financial assistance
- Agriculture-related support
- Transport-related assistance
- Manufacturing/service-business support

The uploaded PRD identifies SC individuals as the primary audience and includes education, livelihood, housing and financial assistance use cases.

### Secondary Users

- CSC operators
- NGO workers
- Family members
- Community facilitators
- Financial-literacy volunteers

---

## 8. Branding

**Product:** SCHEME SATHI

**Tagline:** Find the Right Scheme. Find the Right Support.

**Brand Personality**
- Trustworthy
- Simple
- Inclusive
- Transparent
- Government-service oriented
- Accessible
- Modern
- Multilingual

**Design Principle**

The website should feel like:

> Modern Indian public digital infrastructure

rather than:

> generic startup dashboard.

---

## 9. Reference Website Strategy

The reference website is used only for:
- Layout inspiration
- Navigation patterns
- Form experience
- Card structures
- Spacing
- Responsive behavior
- Onboarding flow
- Overall UX familiarity

The following must **NOT** be copied:
- MyResume branding
- Logo
- Proprietary graphics
- Resume-specific text
- Resume templates
- Resume content
- Proprietary assets
- Resume workflows

Scheme Sathi must have its own:
- Brand identity
- Information architecture
- Scheme content
- Icons
- Illustrations
- Terminology
- Financial-assistance workflows

---

## 10. Features to Remove from the Reference

**Concept:** All resume-oriented features are excluded.

**Remove:**
- Resume builder
- Resume editor
- Resume templates
- Resume preview
- Resume PDF generation
- Resume download
- Resume sharing
- Resume themes
- Resume font customization
- Resume colors
- Resume layout controls
- Resume ATS checker
- Resume keyword checker
- Resume score
- Resume portfolio
- Resume public URL
- Job search
- Recruiter functionality
- Career recommendations
- Resume analytics
- Resume-specific AI
- Resume completion score
- Resume sections
- Resume objective
- Resume skills section
- Resume experience builder
- Resume-specific onboarding

These are replaced by beneficiary-centric functionality.

---

## 11. Features to Retain from the UX Pattern

The following general UX patterns can remain:
- Responsive header
- Navigation
- Mobile menu
- Onboarding
- Progress indicator
- Forms
- Cards
- Dashboard
- Search
- Filters
- Notifications
- FAQ
- Profile
- Language selector
- Accessibility controls
- Footer
- Guided workflow

---

## 12. Feature Priority

### P0 — Must Have
1. Smart Scheme Recommender
2. Eligibility Engine
3. Explainable Matching
4. Scheme Explorer
5. Scheme Details
6. Multilingual Interface
7. EMI Calculator
8. Channel Partner Locator
9. Partner Filtering
10. Nearest Eligible Partner
11. Firebase
12. User Profile
13. Document Checklist
14. Official Source Attribution
15. Mobile Responsive UI

### P1 — High Value
1. AI Scheme Assistant
2. Voice Chat / Voice Input
3. Scheme Comparison
4. Project Cost Planner
5. Loan Financing Breakdown
6. Moratorium Calculator
7. Partner Match Score
8. No-Match Alternatives
9. Application Journey
10. Saved Schemes
11. Saved Partners
12. User Dashboard

### P2 — Advanced
1. DigiLocker Integration
2. Document Verification
3. Application Status Tracking
4. Admin Portal
5. Analytics
6. Scheme Update Notifications
7. Personalized Reminders
8. Voice Output
9. Advanced AI/NLP

### P3 — Future
1. WhatsApp integration
2. IVR
3. CSC integration
4. Live partner fund utilization
5. Real-time application integration
6. Advanced predictive analytics

---

## 13. Module 1 — Smart Scheme Recommender

### Purpose

The recommender is the core of Scheme Sathi. The uploaded PRD specifies a 6–8 question input flow and ranked scheme output.

### User Assessment

Ask only information required for meaningful matching.

**Personal**
- State
- District
- Age
- Gender
- SC status/sub-category where relevant
- Annual family income

**Occupation**
- Student
- Farmer
- Worker
- Self-employed
- Unemployed
- Other

**Education**
- Below 10th
- 10th–12th
- Graduate
- Postgraduate

**Requirement**
- Business
- Education
- Agriculture
- Transport
- Manufacturing
- Services
- Livelihood
- Other

**Financial**
- Project cost
- Required assistance
- Own contribution

**Optional**
- Disability status
- Existing business
- New business
- Business experience

---

## 14. Conversational Assessment

The questionnaire should work in two modes:

**Mode A** — Traditional form.

**Mode B** — Conversational assistant.

Example:

> **Scheme Sathi:** What do you need financial assistance for?
> **User:** I want to start a tailoring business.
> **Scheme Sathi:** Approximately how much will your project cost?
> **User:** Around ₹3 lakh.

The system converts the conversation into structured fields.

---

## 15. Recommendation Engine

**Architecture:**

```
User Input
↓
Input Validation
↓
Eligibility Filtering
↓
Rule Matching
↓
Suitability Scoring
↓
Ranking
↓
Explanation Generation
```

- **Initial implementation:** Rule-based engine
- **Future:** Rule-based + ML/NLP hybrid

The original PRD also proposes a rule-based + ML hybrid architecture.

---

## 16. Matching Factors

Potential factors:
- Category
- Income
- Age
- State
- District
- Occupation
- Education
- Purpose
- Project cost
- Loan requirement
- Scheme category
- Document availability

---

## 17. Match Score

Example weighting:

| Factor | Weight |
|---|---|
| Income Match | 20 |
| Category Match | 20 |
| Purpose Match | 20 |
| Loan Amount Match | 20 |
| Age Match | 10 |
| Location Match | 10 |
| **Total** | **100** |

**Display:** `92% Strong Match`

> **Important:** The score must be described as an **Indicative matching score** and never as an official approval decision.

---

## 18. Explainable Matching

Every recommendation must answer: *Why was this recommended?*

Example:
- ✓ Your income falls within the listed range.
- ✓ Your project type matches the scheme purpose.
- ✓ Your requested amount is within the listed limit.
- ✓ Your location is covered.

---

## 19. Why Not This Scheme?

If a scheme is rejected:

> "Not recommended. Reason: Your requested loan amount exceeds the listed maximum assistance under this scheme."

Then provide alternatives where possible. This is important for transparency.

---

## 20. Recommendation Result

Display 5–10 ranked schemes where appropriate.

Each card includes:
- Scheme name
- Match score
- Ministry/authority
- Purpose
- Maximum assistance
- Interest rate where applicable
- Moratorium
- Repayment
- Eligibility
- Documents
- Official source
- Apply / Learn More
- Find Partner

The original PRD specifies ranked scheme output with benefits, matching reasons, documents and official application links.

---

## 21. Module 2 — Scheme Explorer

**Route:** `/schemes`

**Features:**
- Search
- Category filter
- State filter
- Income filter
- Amount filter
- Purpose filter
- Education/business filter
- Sorting

---

## 22. Scheme Details

**Route:** `/schemes/:id`

**Sections:**
- Overview
- Eligibility
- Financial Assistance
- Interest Rate
- Loan Limits
- Moratorium
- Repayment
- Required Documents
- Who Can Apply?
- Channel Partners
- Application Process
- Official Source
- Last Updated
- Disclaimer

---

## 23. Module 3 — Scheme Comparison

Allow users to select multiple schemes. Compare:
- Purpose
- Eligibility
- Maximum assistance
- Interest
- Repayment
- Moratorium
- Own contribution
- Required documents
- Partner availability
- Match score

---

## 24. Module 4 — EMI Calculator

**Route:** `/calculator`

**Inputs:**
- Loan amount
- Interest rate
- Tenure
- Moratorium

**Outputs:**
- EMI
- Total principal
- Total interest
- Total repayment

**Formula:**

```
EMI = P × r × (1+r)^n / [(1+r)^n − 1]
```

Where: P = principal, r = monthly interest rate, n = number of installments

---

## 25. Scheme-Aware EMI

From a scheme page: **"Calculate My EMI"**

Automatically load:
- Applicable loan amount
- Interest
- Tenure
- Moratorium

The calculator must clearly state when a calculation is illustrative.

---

## 26. Moratorium Calculator

Explain:
- Moratorium duration
- Repayment start
- Possible repayment impact

Do not assume identical repayment treatment for every scheme. Use official scheme rules where available.

---

## 27. Project Cost Planner

Entrepreneurs can construct their project budget:

| Item | Amount |
|---|---|
| Equipment | ₹1,00,000 |
| Raw Materials | ₹75,000 |
| Rent | ₹50,000 |
| Working Capital | ₹50,000 |
| Other | ₹25,000 |
| **Total** | **₹3,00,000** |

The total can be passed directly to the recommendation engine.

---

## 28. Financing Breakdown

Show:

| Item | Amount |
|---|---|
| Total Project Cost | ₹5,00,000 |
| Possible Scheme Finance | ₹4,50,000 |
| Possible Own Contribution | ₹50,000 |

Values must come from verified scheme rules.

---

## 29. Module 5 — Channel Partner Locator

**Route:** `/partners`

This is one of the major Scheme Sathi differentiators.

**Partner categories:**
- State Channelizing Agencies
- Public Sector Banks
- Regional Rural Banks
- NBFC-MFIs
- Other authorized partners

---

## 30. Partner Data

Each partner includes:
- name
- type
- address
- state
- district
- latitude
- longitude
- phone
- email
- supportedSchemes
- supportedCategories
- status
- availability
- lastUpdated
- officialSource

---

## 31. Partner Filtering

Filter by:
- Scheme
- Loan type
- State
- District
- Distance
- Partner type
- Availability

---

## 32. Partner Routing

The system should **NOT** simply return: nearest bank.

It should return: **nearest eligible Channel Partner for this scheme and requirement.**

**Process:**

```
Selected Scheme
↓
Supported Partners
↓
Location Coverage
↓
Availability
↓
Distance
↓
Partner Ranking
```

---

## 33. Partner Match Score

Example:

| Factor | Weight |
|---|---|
| Scheme compatibility | 40% |
| Location coverage | 25% |
| Loan category | 20% |
| Distance | 10% |
| Availability | 5% |

**Display:** `94% Partner Match`

---

## 34. Live Fund/NPA Data

The PS refers to partner fund utilization and NPA/overdue considerations.

> **However: Never fabricate live financial data.**

If official real-time information is unavailable, display:

> "Partner availability is based on the latest available verified information."

Include: `Last updated: [date]`

Demo/mock partner availability may be used only when clearly labelled as synthetic/demo data.

The uploaded PRD also recognizes that real-time Channel Partner data may not be publicly available and proposes mock data for demonstrations.

---

## 35. Map

Use:
- React Leaflet
- OpenStreetMap-compatible mapping

**Map features:**
- Current location
- Partner markers
- Search
- Filters
- Map/list toggle
- Distance
- Partner details
- Directions

Avoid unnecessary dependence on Google Maps API.

---

## 36. Distance Calculation

Use latitude/longitude to calculate approximate distance.

**For MVP:** nearest eligible partner = geographic distance + eligibility filters

Advanced routing can be added later.

---

## 37. Module 6 — Voice Chat

Voice interaction is a new Scheme Sathi feature.

### Voice Input

User taps: **"Talk to Scheme Sathi"**

Example:

> "Mujhe teen lakh ka business loan chahiye."

The system extracts:
- Purpose = Business
- Requested Amount = ₹3,00,000
- Language = Hindi/Hinglish

Then continues the assessment.

---

## 38. Voice Conversation

Example:

> **Scheme Sathi:** Aapka annual family income kitna hai?
> **User:** Teen lakh.
> **System:** Aap Maharashtra mein rehte hain?
> **User:** Haan.
> **System:** Aapke liye kuch suitable schemes mil gayi hain.

---

## 39. Voice Output

Optional text-to-speech:

> "Aapke profile ke according teen schemes potentially suitable hain."

**Languages:**
- English
- Hindi
- Marathi
- Future regional languages

---

## 40. Voice Architecture

Preferred architecture:

```
Microphone
↓
Speech Recognition
↓
Natural Language Processing
↓
Structured User Profile
↓
Recommendation Engine
↓
Response
↓
Text + Voice
```

Browser-native speech capabilities may be used where appropriate to minimize API cost. An external speech API should only be introduced if better multilingual reliability is required.

---

## 41. Module 7 — AI Scheme Assistant

The assistant should not be a generic chatbot. It should operate on verified Scheme Sathi data.

> **User:** "Mujhe ₹5 lakh chahiye."
> **Assistant:** "Aap loan kis purpose ke liye chahte hain?"

Then:

> **Assistant:** "Aapki annual family income kya hai?"

Then:

> **Assistant:** "Based on the information you've provided, these schemes may be relevant."

The AI should never invent:
- Scheme benefits
- Eligibility
- Interest rates
- Loan limits
- Government policies

---

## 42. AI Safety Rule

If information cannot be verified:

> "I couldn't verify this information from the available official source."

Never hallucinate government benefits.

---

## 43. Module 8 — Document Checklist

For each scheme:

**Required Documents**
- ✓ Aadhaar
- ✓ SC Certificate
- ✓ Income Certificate
- ☐ Project Report
- ☐ Bank Documents

**Show:** `3/5 documents ready`

---

## 44. Module 9 — DigiLocker Integration

DigiLocker is an important addition for Scheme Sathi because document readiness and verification are major friction points.

### Objective

Allow users, where supported and authorized, to retrieve eligible government-issued documents through DigiLocker rather than manually uploading documents.

**Potential documents may include:**
- Aadhaar-related documents where legally/API-supported
- Educational certificates
- Caste/community certificates
- Income-related certificates
- Other digitally issued documents

The exact document types available must depend on the user's DigiLocker account and the issuing authority.

---

## 45. DigiLocker User Flow

```
Scheme Sathi
↓
Required Documents
↓
Connect DigiLocker
↓
User Authentication/Consent
↓
DigiLocker
↓
Select Available Document
↓
Consent
↓
Retrieve Document Metadata/Document
↓
Scheme Sathi Document Readiness
```

---

## 46. DigiLocker Security

**Never:**
- Ask users for DigiLocker passwords
- Store DigiLocker credentials
- Bypass DigiLocker consent
- Scrape DigiLocker
- Store unnecessary documents

Use the official authorized integration mechanism. The integration should follow DigiLocker/API-setu authorization requirements and applicable policies.

---

## 47. DigiLocker Benefit

Instead of: *"Upload your caste certificate."*

Show: **"Get from DigiLocker"**

Then:
- ✓ Document found
- ✓ Issuer verified
- ✓ Available for this application

Only make a "verified" claim when the underlying source actually provides verification.

---

## 48. DigiLocker Fallback

If DigiLocker integration isn't available for a particular document:

> "DigiLocker unavailable for this document. Upload manually."

This ensures the application remains functional.

---

## 49. Module 10 — Application Journey

After selecting a scheme:

```
1. Scheme Identified
↓
2. Eligibility Checked
↓
3. Documents Prepared
↓
4. Partner Identified
↓
5. Application Started
↓
6. Application Submitted
↓
7. Under Review
↓
8. Decision
```

Unless an official application-status API is integrated, these should be treated as user-managed guidance/tracking statuses, not official government statuses.

---

## 50. Module 11 — User Dashboard

**Route:** `/dashboard`

**Show:**
- My Recommendations
- Saved Schemes
- Saved Partners
- Recent Calculations
- Document Readiness
- Application Journey
- Assessment History

---

## 51. Module 12 — Multilingual System

**Initial:** English, Hindi, Marathi

**Architecture:**

```
src/locales/
  en.json
  hi.json
  mr.json
```

Every interface string must use translation keys.

The original PRD calls for multilingual support and mobile-first accessibility.

---

## 52. Accessibility

**Target:**
- Keyboard navigation
- Readable typography
- Proper labels
- Screen-reader compatibility
- Focus states
- High contrast
- Large touch targets
- Simple language

Because users may have limited digital literacy, avoid:
- Complicated terminology
- Dense forms
- Unnecessary fields
- Technical jargon

---

## 53. Low-Bandwidth Design

The uploaded PRD explicitly requires mobile-first and low-bandwidth optimization. Therefore:
- Minimize large images
- Lazy-load maps
- Compress assets
- Use text-first layouts
- Avoid unnecessary video
- Cache static data
- Optimize JavaScript bundles

---

## 54. Home Page

**Hero**

> Find the Right Government Scheme for You

**Subheading**

> Scheme Sathi helps you discover suitable financial assistance, understand eligibility, calculate repayment and find the right Channel Partner.

- **Primary:** Find My Scheme
- **Secondary:** Explore Schemes
- **Third:** Talk to Scheme Sathi

---

## 55. Home Page Sections

1. Hero
2. How It Works
3. Smart Scheme Matching
4. Financial Calculator
5. Partner Locator
6. Voice Assistant
7. DigiLocker Document Assistance
8. Popular Schemes
9. Financial Literacy
10. FAQ
11. Trust / Official Sources
12. Footer

---

## 56. How It Works

**01 — Tell Us**
Answer a few simple questions.

**02 — Get Matched**
Scheme Sathi identifies potentially suitable schemes.

**03 — Understand**
See eligibility, assistance, documents and repayment.

**04 — Find Support**
Find an eligible Channel Partner.

**05 — Get Ready**
Prepare documents using manual upload or DigiLocker where available.

---

## 57. Admin Portal

**Route:** `/admin`

**Scheme Management**
- Add
- Edit
- Verify
- Deactivate
- Update
- Source tracking

**Partner Management**
- Add
- Edit
- Location
- Supported schemes
- Status
- Availability

**Data Management**
- Source
- Last updated
- Verification status

**Analytics**
- Scheme searches
- Recommendations
- No-match cases
- Calculator usage
- Partner searches
- Language usage
- User completion rate

---

## 58. Firebase Architecture

Use Firebase as the primary backend. Components:
- Firebase Authentication
- Firestore
- Firebase Storage where necessary
- Cloud Functions where necessary
- Firebase Hosting

---

## 59. Firestore Collections

- users
- schemes
- schemeRules
- partners
- partnerSchemes
- recommendations
- assessments
- savedSchemes
- savedPartners
- calculatorHistory
- documents
- applicationJourneys
- categories
- translations
- adminUsers

---

## 60. Scheme Document Model

```json
{
  name,
  slug,
  description,
  ministry,
  category,
  purpose,
  targetBeneficiaries,
  minIncome,
  maxIncome,
  minAge,
  maxAge,
  minLoanAmount,
  maxLoanAmount,
  interestRate,
  moratoriumMonths,
  repaymentMonths,
  eligibilityRules,
  requiredDocuments,
  channelPartnerTypes,
  officialSource,
  sourceLastUpdated,
  isVerified,
  isActive
}
```

---

## 61. Partner Model

```json
{
  name,
  type,
  address,
  state,
  district,
  latitude,
  longitude,
  phone,
  email,
  supportedSchemes,
  supportedCategories,
  status,
  availability,
  lastUpdated,
  officialSource
}
```

---

## 62. User Model

Store only information necessary for product functionality. Potential fields:

```json
{
  uid,
  preferredLanguage,
  state,
  district,
  profilePreferences,
  savedSchemes,
  savedPartners,
  createdAt
}
```

Sensitive assessment information should be handled carefully and retained only where necessary.

---

## 63. Privacy Architecture

The original PRD specifies no PII storage/session-based processing for its MVP.

The expanded Scheme Sathi dashboard requires limited persistent data for:
- Saved schemes
- Saved assessments
- Document readiness
- Application journey

**Default Principle:** Collect the minimum data required.

**Don't Collect:**
- Unnecessary Aadhaar numbers
- Passwords
- Unnecessary financial details
- Unnecessary personal documents

**For DigiLocker:** Store only what is necessary and legally permitted.

---

## 64. Security

Implement:
- Firebase Authentication
- Firestore Security Rules
- Role-based admin access
- Protected routes
- Input validation
- Rate limiting where applicable
- Secure environment variables
- No secrets in Git
- Audit-friendly admin actions
- HTTPS

---

## 65. API Strategy

**Required/Primary — Firebase**
For backend services.

**MCP / Official Government Sources**
For research/data acquisition where available.

**Leaflet + OpenStreetMap-compatible data**
For maps.

---

## 66. Optional APIs

- **AI API** — For advanced conversational AI.
- **Speech API** — Only if browser speech functionality is insufficient.
- **Routing API** — Only if advanced navigation is needed.
- **DigiLocker/API Setu** — For authorized DigiLocker integration.

---

## 67. API Key Strategy

**Minimum MVP should aim for:** 1–2 credentials/configurations

- **Potential:** Firebase, MCP/government source
- **Optional:** LLM API, DigiLocker/API Setu credentials, External maps/routing

Do not create unnecessary API dependencies.

---

## 68. Map API Strategy

Do not automatically use Google Maps.

**Preferred MVP:** React Leaflet + OpenStreetMap-compatible mapping

For simple distance calculation: No external routing API is required.

---

## 69. Government Data Architecture

The preferred data flow is:

```
Official Government Sources
↓
MCP
↓
Data Extraction
↓
Normalization
↓
Validation
↓
Admin Review
↓
Firestore
↓
Scheme Sathi
```

Do **NOT** make the frontend dependent on a live MCP request for every page load.

---

## 70. Data Trust Model

Every scheme should have: Official Source, Last Updated, Verification Status

Example:

| Field | Value |
|---|---|
| Source | Official government portal |
| Last Updated | 25 Aug 2026 |
| Status | Verified |

If not verified:

> "Information not independently verified."

---

## 71. Mock Data Policy

Synthetic data may be used for:
- Demo partner availability
- Unavailable APIs
- Prototype analytics

But every synthetic value must be labelled: **Demo data**

Never present fictional partner fund availability as real government information.

---

## 72. AI + Rule Engine Architecture

Recommended:

```
User
↓
Voice / Text / Form
↓
Profile Extraction
↓
Eligibility Rule Engine
↓
Scheme Ranking Engine
↓
Verified Scheme Data
↓
Explanation Layer
↓
User-Friendly Results
```

AI should assist the interaction. The actual eligibility logic should remain transparent.

---

## 73. Project Structure

```
scheme-sathi/
├── src/
│   ├── components/
│   ├── pages/
│   ├── layouts/
│   ├── hooks/
│   ├── services/
│   │   ├── firebase/
│   │   ├── recommendation/
│   │   ├── calculator/
│   │   ├── partners/
│   │   ├── voice/
│   │   ├── digilocker/
│   │   └── dataSources/
│   ├── data/
│   ├── locales/
│   ├── types/
│   ├── utils/
│   ├── constants/
│   ├── routes/
│   ├── App.tsx
│   └── main.tsx
├── functions/
├── public/
├── firestore.rules
├── firestore.indexes.json
├── firebase.json
├── .env.example
├── .gitignore
├── README.md
├── package.json
└── tsconfig.json
```

---

## 74. Reusable Components

- Navbar
- Footer
- SchemeCard
- SchemeFilter
- SchemeComparison
- EligibilityBadge
- MatchScore
- QuestionStep
- ProgressIndicator
- RecommendationCard
- EMICalculator
- ProjectCostPlanner
- PartnerCard
- PartnerMap
- PartnerFilter
- DocumentChecklist
- DigiLockerButton
- VoiceAssistant
- LanguageSelector
- ApplicationTimeline

---

## 75. Routes

```
/
/schemes
/schemes/:id
/recommend
/calculator
/partners
/partners/:id
/assistant
/dashboard
/documents
/application/:id
/about
/faq
/login
/register
/admin
```

---

## 76. Performance Requirements

**Original PRD Target**
- Under 3 seconds result response after input
- Support approximately 1,000 concurrent demo users

**Expanded Target**
- Recommendation result: <3 seconds for local/rule-based matching.
- Full journey: <30 seconds for assessment-to-result under normal conditions.

The original success target also specifies <30 seconds end-to-end.

---

## 77. Success Metrics

| Metric | Target |
|---|---|
| User Completion Rate | 70% |
| Match Precision | 85% (validated against manual eligibility review) |
| Time to Result | <30 seconds |
| User Satisfaction | 4/5 |

These targets are derived from the uploaded PRD.

**Additional Scheme Sathi Metrics**
- **Partner Discovery** — 80% of eligible users can identify at least one potential partner.
- **Document Readiness** — 60% of users can identify required documents.
- **Calculator Usage** — Measure users who calculate repayment after scheme recommendation.
- **Voice Completion** — Measure successful voice-based assessment completion.

---

## 78. Testing

**Recommendation Engine**
- Income exactly at limit
- Income above limit
- Project cost exactly at limit
- Project cost above limit
- Age boundary
- State mismatch
- Purpose mismatch
- Category mismatch
- Missing data

**Calculator**
- Zero loan
- Invalid rate
- Invalid tenure
- Boundary loan values
- Moratorium

**Partner**
- No partner
- One partner
- Multiple partners
- Unsupported scheme
- Location unavailable
- Partner unavailable

**Voice**
- English
- Hindi
- Hinglish
- Marathi
- Accents
- Unclear speech
- Silence
- Microphone denial

**DigiLocker**
- Successful authentication
- No documents
- Unsupported document
- User cancellation
- Consent failure
- API failure

---

## 79. Error States

Every operation must have:

| State | Message |
|---|---|
| Loading | "Finding suitable schemes..." |
| Empty | "No schemes matched your current information." |
| Error | "We couldn't retrieve the latest information. Please try again." |
| No Partner | "No eligible Channel Partner was found in the selected area." |
| Voice Error | "We couldn't understand that. You can type your answer instead." |
| DigiLocker Error | "We couldn't retrieve your document from DigiLocker. You can upload it manually." |

---

## 80. Official Disclaimer

> Scheme Sathi is an informational and decision-support platform. Scheme recommendations are indicative and do not constitute official eligibility or approval. Final eligibility, sanction, interest rates, loan limits, documentation requirements and application decisions are determined by the concerned government authority and authorized Channel Partner.

---

## 81. SIH Demonstration Flow

The primary live demo should be:

1. Landing page. Click: **Find My Scheme**
2. Choose: **Start a Business**
3. Enter: State, Income, Category, Project cost, Age
4. Scheme Sathi generates: **3 Potential Matches**
5. Open top recommendation. Show: eligibility, financing, interest, moratorium, documents.
6. Click: **Calculate My EMI**
7. Show: EMI, total interest, repayment.
8. Click: **Find My Channel Partner**
9. Map displays: eligible partners, distance, partner type.
10. Select nearest partner.
11. Show: **Document Checklist**
12. Click: **Get Documents from DigiLocker**
13. Demonstrate document retrieval/connection where the authorized integration is available, or use a clearly labelled demo flow.
14. Click: **Talk to Scheme Sathi.** Demonstrate voice interaction.

This single journey demonstrates nearly the entire PS.

---

## 82. MVP Development Phases

**Phase 1 — Reference & Design**
Analyze the reference website's: layout, navigation, forms, cards, spacing, mobile behavior. Then create the Scheme Sathi design system.

**Phase 2 — Foundation**
Build: React, Vite, TypeScript, Tailwind, routing, Firebase, project architecture.

**Phase 3 — Scheme Data**
Connect MCP/official sources. Create: normalized schema dataset, eligibility rules, source metadata, verification metadata.

**Phase 4 — Recommender**
Build: questionnaire, rule engine, scoring, ranking, explanation.

**Phase 5 — Scheme Explorer**
Build: search, filters, details, comparison.

**Phase 6 — Financial Tools**
Build: EMI, moratorium, project planner, financing breakdown.

**Phase 7 — Partner Locator**
Build: map, partner database, filtering, distance, routing.

**Phase 8 — Voice**
Build: microphone, speech recognition, structured input, voice response.

**Phase 9 — DigiLocker**
Implement authorized integration if credentials/API access are available. Otherwise: create the integration abstraction and demo-safe fallback.

**Phase 10 — Dashboard**
Build: saved schemes, saved partners, assessments, document readiness, application journey.

**Phase 11 — Admin**
Build: schemes, partners, data verification, analytics.

**Phase 12 — Testing & Polish**
Perform: mobile testing, accessibility, performance, security, edge-case testing, demo testing.

---

## 83. GitHub Development Strategy

Recommended commits:

```
feat: initialize Scheme Sathi
feat: add design system
feat: add responsive navigation
feat: add Firebase integration
feat: add scheme data model
feat: add scheme explorer
feat: add eligibility engine
feat: add scheme recommendation
feat: add explainable match score
feat: add scheme comparison
feat: add EMI calculator
feat: add project cost planner
feat: add partner locator
feat: add partner filtering
feat: add multilingual support
feat: add voice assistant
feat: add DigiLocker integration
feat: add user dashboard
feat: add admin portal
test: add recommendation tests
test: add calculator tests
fix: resolve mobile issues
docs: update README
```

---

## 84. Environment Variables

**Start with:**

```
VITE_FIREBASE_API_KEY=
VITE_FIREBASE_AUTH_DOMAIN=
VITE_FIREBASE_PROJECT_ID=
VITE_FIREBASE_STORAGE_BUCKET=
VITE_FIREBASE_MESSAGING_SENDER_ID=
VITE_FIREBASE_APP_ID=
```

**Optional:**

```
GEMINI_API_KEY=
VOICE_API_KEY=
DIGILOCKER_CLIENT_ID=
DIGILOCKER_CLIENT_SECRET=
MAPS_API_KEY=
```

Only add variables when the corresponding integration is actually used. Never commit `.env`.

---

## 85. Data Source Priority

- **Tier 1 — Official** — Government portals, official scheme sources, authorized APIs, authorized DigiLocker/API integrations
- **Tier 2** — Official open datasets
- **Tier 3** — Curated secondary datasets for development
- **Tier 4** — Synthetic demo data

Clearly identify Tier 3/4 data.

---

## 86. Important Data Rule

**Never invent:**
- Loan limits
- Interest rates
- Income limits
- Eligibility
- Partner availability
- Fund availability
- NPA status
- Government benefits

If information isn't verified:

> "Not available / Unable to verify."

---

## 87. What Makes Scheme Sathi Different

**Existing Information Discovery**

```
Search
↓
Scheme
↓
Information
```

**Scheme Sathi**

```
My Situation
↓
Smart Matching
↓
Why I Match
↓
Financial Planning
↓
Documents
↓
Eligible Partner
↓
Application Journey
```

This is the central product story.

---

## 88. Five Core Value Propositions

1. **Discover** — Find schemes you may qualify for.
2. **Understand** — Know why the scheme matches you.
3. **Calculate** — Understand potential repayment.
4. **Connect** — Find the right Channel Partner.
5. **Prepare** — Get documents and application guidance ready.

---

## 89. Final Feature Matrix

| Feature | Priority | PS Alignment |
|---|---|---|
| Scheme Recommender | P0 | High |
| Eligibility Engine | P0 | High |
| Explainable Match | P0 | High |
| Scheme Explorer | P0 | High |
| Scheme Details | P0 | High |
| EMI Calculator | P0 | High |
| Moratorium Calculator | P0 | High |
| Partner Locator | P0 | High |
| Partner Filtering | P0 | High |
| Nearest Eligible Partner | P0 | High |
| Multilingual | P0 | High |
| Firebase | P0 | Medium |
| Document Checklist | P0 | High |
| Scheme Comparison | P1 | Medium |
| AI Assistant | P1 | High |
| Voice Chat | P1 | High |
| Project Cost Planner | P1 | High |
| Financing Breakdown | P1 | High |
| No-Match Alternatives | P1 | High |
| Application Journey | P1 | Medium |
| User Dashboard | P1 | Medium |
| DigiLocker | P2/P1 if available | High |
| Admin Dashboard | P2 | Medium |
| Analytics | P2 | Low |
| Notifications | P2 | Low |
| WhatsApp | P3 | Medium |
| IVR | P3 | Medium |
| Real-time Partner Funds | P3 | High |

---

## 90. Final Architecture

```
OFFICIAL SOURCES (myScheme.gov.in + DigiLocker/API Setu)
↓
MCP
↓
DATA VALIDATION LAYER
↓
FIRESTORE
↓
RECOMMENDATION + FINANCIAL + PARTNER ENGINES
↓
SCHEME SATHI FRONTEND (Form, Voice, AI, Map, DigiLocker)
↓
USER JOURNEY: Match → Understand → Calculate → Connect → Apply
```

---

## 91. Final Product Experience

The user should be able to say:

> "Mujhe business start karna hai."

Scheme Sathi should respond:

> "Let's find the right scheme for you."

Then:

- What do you need? — Business
- Project Cost? — ₹3,00,000
- Annual Family Income? — ₹3,00,000
- State? — Maharashtra
- Category? — SC

Then: **3 potential matches found**

| Scheme | Match |
|---|---|
| Scheme A | 92% |
| Scheme B | 84% |
| Scheme C | 76% |

Then: **Why Scheme A?**
- ✓ Income matches
- ✓ Purpose matches
- ✓ Loan amount matches
- ✓ Location matches

Then: **Financial Assistance**
- Potential assistance: X ₹
- Interest: X %
- Moratorium: X months

Then: **Calculate EMI**

Then: **Required Documents**
- ✓ Aadhaar
- ✓ SC Certificate
- ☐ Income Certificate
- ☐ Project Report

`[Get from DigiLocker]`

Then: **Find Channel Partner**

| Partner | Distance |
|---|---|
| Partner A | 3.2 km |
| Partner B | 5.8 km |
| Partner C | 8.1 km |

Then: "Partner A is the closest eligible partner for your selected scheme."

Finally: **Start Application Journey**

This is the experience that Scheme Sathi should be built around.

---

## 92. Final SIH Pitch

**One-line Pitch**

> Scheme Sathi is an AI-assisted financial-assistance navigator that helps SC beneficiaries discover the right government scheme, understand their eligibility, estimate repayment, prepare documents, and connect with the right Channel Partner.

**Short Pitch**

> Government schemes exist, but finding the right scheme, understanding eligibility, arranging documents, calculating repayment and identifying the correct Channel Partner can be difficult. Scheme Sathi brings these steps into one multilingual platform — transforming fragmented scheme information into a personalized journey from discovery to financial planning to partner connectivity.

---

## 93. Final Development Principle

The project should be built around this sentence:

> "Don't just tell the citizen which schemes exist. Tell them which scheme may fit their situation, why it fits, what it could mean financially, what they need, and where they should go next."

That is the core identity of Scheme Sathi.

---

## 94. Scope Control

If development time becomes limited, do **NOT** sacrifice the core flow. Keep:

```
Scheme Match
↓
Eligibility Explanation
↓
EMI
↓
Partner Locator
↓
Documents
```

**Can temporarily defer:**
- Advanced ML
- Advanced voice
- Real-time fund data
- Application API integration
- Advanced analytics
- WhatsApp
- IVR

The uploaded original PRD intentionally recommends strict scope control because data integration and partner availability introduce significant complexity.

For the expanded Scheme Sathi version, DigiLocker should similarly be treated as integration-dependent: design the architecture now, but don't let it block the core recommendation → calculator → partner journey.

---

## 95. Definition of Done

Scheme Sathi is considered ready for the SIH demo when:

- [ ] Homepage is complete
- [ ] Scheme Explorer works
- [ ] 50+ curated/verified scheme records or an appropriately scoped verified dataset is available
- [ ] Recommendation engine works
- [ ] Match explanations work
- [ ] No-match explanation works
- [ ] Scheme details work
- [ ] EMI calculator works
- [ ] Moratorium handling is implemented appropriately
- [ ] Project cost planner works
- [ ] Partner map works
- [ ] Partner filtering works
- [ ] Nearest eligible partner works
- [ ] English/Hindi/Marathi UI works
- [ ] Firebase authentication works
- [ ] User dashboard works
- [ ] Document checklist works
- [ ] Voice input works or has a clearly documented fallback
- [ ] DigiLocker integration architecture is implemented
- [ ] DigiLocker works if authorized credentials/access are available
- [ ] Manual document upload fallback works
- [ ] Admin can manage schemes/partners
- [ ] Official sources are displayed
- [ ] Data freshness is visible
- [ ] No fake government data is presented as official
- [ ] Mobile UI works
- [ ] Build passes
- [ ] No TypeScript errors
- [ ] Firestore rules are configured
- [ ] `.env` is excluded from Git
- [ ] Demo flow works end-to-end

---

# SCHEME SATHI
### Find the Right Scheme. Find the Right Support.

**Discover → Match → Understand → Calculate → Prepare → Connect → Apply**

The platform combines: AI-assisted Scheme Matching + Explainable Eligibility + Financial Calculator + Project Planner + Voice Chat + DigiLocker Document Assistance + Geo-Spatial Channel Partner Discovery + Multilingual Accessibility + Application Journey into one unified citizen-facing experience.
