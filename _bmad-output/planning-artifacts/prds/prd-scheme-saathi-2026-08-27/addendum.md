# SchemeSathi Technical Architecture & Product Planning Addendum (v2.0)

This addendum preserves structural and technical depth from the `Scheme_Sathi_PRD.pdf` (Version 2.0 — Expanded SIH MVP), serving as the engineering spine for architecture, data engineering, and sprint planning.

---

## 1. Firebase Backend Architecture & Firestore Data Models

### 1.1 Core Backend Components
- **Firebase Authentication:** Phone OTP authentication (mocked in dev with test code `123456`, production-ready SMS gateway integration).
- **Cloud Firestore:** Primary NoSQL database partitioned across 15 collections with strict document schemas and security rules.
- **Firebase Storage:** Encrypted blob storage for user-uploaded documents (manual fallback mode).
- **Cloud Functions:** Serverless handlers for DigiLocker OAuth handshakes, AI scheme recommendation scoring, and scheduled data verification checks.
- **Firebase Hosting:** Global CDN deployment for single-page React client application.

### 1.2 Firestore 15-Collection Architecture
```
firestore/
├── users/                # User accounts, preferences, language, saved refs
├── schemes/              # 50+ central & state concessional loan programs
├── schemeRules/          # Deterministic rule definitions for eligibility evaluation
├── partners/             # Channel Partners (SCAs, PSBs, RRBs, NBFC-MFIs)
├── partnerSchemes/       # Join collection mapping partners to supported schemes
├── recommendations/      # Stored recommendation snapshots with score breakdowns
├── assessments/          # Beneficiary questionnaire submission history
├── savedSchemes/         # User bookmarked schemes
├── savedPartners/        # User bookmarked channel partners
├── calculatorHistory/    # Saved EMI & moratorium calculations
├── documents/            # User document readiness records & DigiLocker refs
├── applicationJourneys/  # 8-stage progress tracker per user scheme
├── categories/           # Scheme categories (Business, Education, Agriculture, etc.)
├── translations/         # Dynamic localized copy updates
└── adminUsers/           # Role-based admin access control
```

### 1.3 JSON Document Schemas

#### Scheme Document Schema (`schemes/{schemeId}`)
```json
{
  "name": "NSFDC Micro-Credit Scheme",
  "slug": "nsfdc-micro-credit",
  "description": "Financial assistance for small business units for target SC beneficiaries.",
  "ministry": "Ministry of Social Justice and Empowerment",
  "category": "Business",
  "purpose": "Retail, tailoring, artisan shops, small trade",
  "targetBeneficiaries": ["SC Individuals", "SHGs"],
  "minIncome": 0,
  "maxIncome": 300000,
  "minAge": 18,
  "maxAge": 60,
  "minLoanAmount": 10000,
  "maxLoanAmount": 150000,
  "interestRate": 5.0,
  "moratoriumMonths": 6,
  "repaymentMonths": 36,
  "eligibilityRules": {
    "casteRequired": ["SC"],
    "incomeCeilingAnnual": 300000,
    "maxProjectCost": 150000,
    "minAge": 18
  },
  "requiredDocuments": [
    "Aadhaar Card",
    "Caste Certificate",
    "Income Certificate",
    "Project Quotation/Cost Plan"
  ],
  "channelPartnerTypes": ["SCA", "RRB", "NBFC-MFI"],
  "officialSource": "https://nsfdc.nic.in/schemes",
  "sourceLastUpdated": "2026-08-25T00:00:00Z",
  "isVerified": true,
  "isActive": true
}
```

#### Channel Partner Document Schema (`partners/{partnerId}`)
```json
{
  "name": "Maharashtra State Other Backward Class & SC Dev Corp",
  "type": "SCA",
  "address": "Administrative Building, District Collectorate, Satara",
  "state": "Maharashtra",
  "district": "Satara",
  "latitude": 17.6805,
  "longitude": 73.9930,
  "phone": "+91-2162-234567",
  "email": "satara.sca@maharashtra.gov.in",
  "supportedSchemes": ["nsfdc-micro-credit", "nsfdc-term-loan"],
  "supportedCategories": ["Business", "Transport", "Livelihood"],
  "status": "Active",
  "availability": "Available",
  "lastUpdated": "2026-08-25T00:00:00Z",
  "officialSource": "Official State Agency Directory"
}
```

#### User Document Schema (`users/{userId}`)
```json
{
  "uid": "usr_99812",
  "preferredLanguage": "mr",
  "state": "Maharashtra",
  "district": "Satara",
  "profilePreferences": {
    "age": 28,
    "gender": "Male",
    "annualFamilyIncome": 150000,
    "category": "SC"
  },
  "savedSchemes": ["nsfdc-micro-credit"],
  "savedPartners": ["partner_satara_sca_01"],
  "createdAt": "2026-08-27T19:30:00Z"
}
```

---

## 2. Geo-Spatial Mapping & Partner Routing Engine

### 2.1 Technology Choice & Zero-Cost Infrastructure
- **Renderer:** React Leaflet (`react-leaflet`) with OpenStreetMap tile layer (`https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png`).
- **Zero API Dependency:** No Google Maps billing or quota dependencies.
- **Distance Calculation:** Standard Great-Circle Haversine Formula:
  $$d = 2R rcsin\left(\sqrt{\sin^2\left(rac{\Delta \phi}{2}ight) + \cos(\phi_1)\cos(\phi_2)\sin^2\left(rac{\Delta \lambda}{2}ight)}ight)$$
  Where $R = 6371	ext{ km}$.

### 2.2 Partner Ranking Algorithm (100% Score)
| Weight | Metric | Evaluation Rule |
| :--- | :--- | :--- |
| **40%** | Scheme Compatibility | Partner officially supports the user's selected scheme ID |
| **25%** | Location Coverage | Same District (25%), Same State (15%), Neighboring State (5%) |
| **20%** | Loan Category | Partner authorizes the requested loan size (e.g. Micro vs Term) |
| **10%** | Proximity Distance | Linearly normalized score from 0 km (100%) to 50 km (0%) |
| **5%** | Verified Availability | Active status and verified operating hours |

---

## 3. Conversational AI, Voice Architecture & Safety Guardrails

### 3.1 Voice Interaction Pipeline
```
[User Audio Input (Hindi/Marathi/English)]
                   │
                   ▼
       [Web Speech API Recognition]
                   │
                   ▼
         [Natural Language Parser]
  (Extracts: State, Category, Cost, Income)
                   │
                   ▼
       [Structured Beneficiary Profile]
                   │
                   ▼
     [Deterministic Eligibility Engine]
                   │
                   ▼
       [Verified Scheme Matches & Cards]
                   │
                   ▼
  [Text-to-Speech Response / Screen UI Updates]
```

### 3.2 Strict AI Safety Grounding Policy
- **Zero Hallucination Directive:** The assistant operates strictly as an interface over verified Firestore scheme tables.
- If user inquiries exceed verified database fields (e.g. *"Will my loan definitely get approved?"* or *"Can you waive my interest?"*), the system outputs:
  > *"SchemeSathi is an informational decision-support platform. Scheme recommendations are indicative and do not constitute official approval. Final terms and sanctions are determined by the authorized Channel Partner."*

---

## 4. UI Architecture & Reusable Component Hierarchy

```
scheme-sathi/
├── src/
│   ├── components/
│   │   ├── common/             # Navbar, Footer, LanguageSelector, ProgressIndicator
│   │   ├── schemes/            # SchemeCard, SchemeFilter, SchemeComparison, MatchScore
│   │   ├── calculator/         # EMICalculator, MoratoriumSlider, ProjectCostPlanner
│   │   ├── partners/           # PartnerMap, PartnerCard, PartnerFilter, DistanceBadge
│   │   ├── voice/              # VoiceAssistantModal, MicButton, SpeechBubble
│   │   ├── digilocker/         # DigiLockerButton, CertificateVerifier, UploadFallback
│   │   └── journey/            # ApplicationTimeline, StageCard, MilestoneChecklist
│   ├── pages/                  # Home, SchemeExplorer, SchemeDetails, CalculatorPage,
│   │                           # PartnersPage, VoiceAssistantPage, Dashboard, AdminPortal
│   ├── layouts/                # PublicLayout, DashboardLayout, AdminLayout
│   ├── services/               # firebase, recommendation, calculator, partners, voice, digilocker
│   ├── data/                   # Seeded 50+ scheme definitions and partner directories
│   ├── locales/                # en.json, hi.json, mr.json
│   └── types/                  # TypeScript interfaces for Scheme, Partner, User, Assessment
```

---

## 5. Complete Application Route Map
| Route | Access | Purpose |
| :--- | :--- | :--- |
| `/` | Public | Landing page with Hero, How It Works, Trust attributions |
| `/recommend` | Public/Auth | 6–8 question interactive scheme assessment & results |
| `/schemes` | Public | Faceted Scheme Explorer with search and 7 filters |
| `/schemes/:id` | Public | 14-section Scheme Details page with official links |
| `/calculator` | Public | EMI, Moratorium & Project Cost Planning tools |
| `/partners` | Public | Geo-spatial Channel Partner Locator with Leaflet map |
| `/assistant` | Public/Auth | Voice and conversational AI scheme assistant |
| `/dashboard` | Authenticated | User dashboard: saved schemes, partners, calculations, journey |
| `/documents` | Authenticated | Document checklist and DigiLocker sync management |
| `/application/:id`| Authenticated | 8-stage Application Journey milestone tracker |
| `/admin` | Admin Role | Scheme & partner CRUD, data freshness verification, analytics |
| `/about`, `/faq` | Public | Mission details, FAQ, methodology, and legal disclaimers |

---

## 6. Smart India Hackathon (SIH) 14-Step Live Demo Flow

1. **Step 1:** Open Landing Page (`/`); demonstrate English/Hindi/Marathi language toggle. Click **"Find My Scheme"**.
2. **Step 2:** Select primary goal: **"Start a Business"**.
3. **Step 3:** Enter assessment inputs: State: *Maharashtra*, District: *Satara*, Category: *SC*, Project Cost: *₹1,00,000*, Annual Family Income: *₹1,50,000*, Age: *28*.
4. **Step 4:** SchemeSathi generates ranked recommendations (e.g., *NSFDC Micro-Credit Scheme* at 94% Match).
5. **Step 5:** Open top scheme card; demonstrate **"Why This Scheme?"** explainable match breakdown.
6. **Step 6:** Click **"Calculate My EMI"**; inputs pre-fill with scheme rate (5%) and tenure (36 months).
7. **Step 7:** Slide Moratorium to 6 months; demonstrate impact of interest capitalization.
8. **Step 8:** Click **"Find My Channel Partner"**; map automatically centers on Satara district.
9. **Step 9:** View nearest partner: *Maharashtra State SC Dev Corp (3.4 km away)* with Partner Match Score.
10. **Step 10:** Select partner; view contact numbers and operating schedule.
11. **Step 11:** Open **Document Checklist**; view required certificates (Aadhaar, Caste, Income, Cost Plan).
12. **Step 12:** Click **"Get Documents from DigiLocker"**; demonstrate instant metadata verification.
13. **Step 13:** Switch to manual upload fallback to demonstrate graceful offline resiliency.
14. **Step 14:** Click **"Talk to SchemeSathi"**; speak query in Hindi (*"Mujhe 1 lakh ka loan chahiye"*) to demonstrate voice parsing.

---

## 7. 12-Phase Development Plan & GitHub Commit Strategy

### 7.1 Development Phases
- **Phase 1 (Reference & Design):** Establish design tokens, typography, and mobile layout inspired by modern public digital infrastructure.
- **Phase 2 (Foundation):** React 18, Vite, TypeScript, Tailwind CSS, React Router v6, Firebase initialization.
- **Phase 3 (Scheme Data & Rules):** Seed 50+ verified schemes and compile deterministic eligibility rule definitions.
- **Phase 4 (Recommender Engine):** Build 6–8 question intake, 100-pt scoring algorithm, and explainable match generator.
- **Phase 5 (Scheme Explorer):** Build search, 7 filters, 14-section details view, and comparison matrix.
- **Phase 6 (Financial Calculators):** Implement EMI formulas, moratorium interest capitalization, and project cost planner.
- **Phase 7 (Partner Locator):** Integrate React Leaflet, OpenStreetMap, Haversine distance, and partner scoring.
- **Phase 8 (Voice Assistant):** Implement Web Speech API recognition, intent parser, and multilingual synthesis.
- **Phase 9 (DigiLocker Integration):** Build OAuth consent flow abstraction and manual file upload fallback.
- **Phase 10 (User Dashboard & Journey):** Implement saved state, assessment history, and 8-stage Application Journey tracker.
- **Phase 11 (Admin Portal):** Build scheme/partner management console, data freshness audits, and analytics.
- **Phase 12 (Testing, Hardening & SIH Polish):** Edge-case testing, accessibility audit, performance optimization, and dry runs.

### 7.2 GitHub Commit History Blueprint
```
feat: initialize SchemeSathi project architecture and design system
feat: add responsive public navigation, layout and multilingual localization
feat: add Firebase integration (Auth, Firestore, Security Rules)
feat: add scheme data models and seed 50+ verified central/state schemes
feat: add faceted scheme explorer, search and structured details view
feat: add deterministic eligibility engine and 100-point explainable match scoring
feat: add multi-scheme comparative matrix
feat: add EMI, moratorium capitalization calculator and project cost planner
feat: add React Leaflet OpenStreetMap partner locator and distance routing
feat: add partner filtering and partner match score
feat: add Web Speech API voice assistant and multilingual NLP intent extractor
feat: add dynamic document checklist and DigiLocker verification with manual fallback
feat: add 8-stage application journey tracker and user dashboard
feat: add administrative management portal and data freshness audit
test: add comprehensive test suites for eligibility matching and EMI amortization
fix: optimize mobile touch targets, low-bandwidth asset loading and accessibility
docs: update complete README and architectural addendum
```
