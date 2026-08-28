# Epic 4 Planning Context: Geo-Spatial Channel Partner Discovery & Routing

## Executive Summary
Epic 4 empowers beneficiaries to discover, filter, score, and navigate to authorized government channel partners (State Channelizing Agencies - SCAs, Public Sector Banks - PSBs, Regional Rural Banks - RRBs, and Microfinance NBFCs) on an interactive Leaflet OpenStreetMap interface at `/partners` with a 5-factor suitability scoring model and turn-by-turn routing links.

## Epic 4 Stories
1. **Story 4.1: React Leaflet Partner Map & Geo-Spatial Search (`/partners`)**
   - Interactive Leaflet OpenStreetMap with custom branded map pins (SCA, PSB, RRB, NBFC-MFI) and cluster zoom.
   - Geo-location detection ("Find Nearest Partners / Use My Location") with fallback to state capital coordinates.
   - Text search filter by state, district, city, pin code, or partner name.
   - Scheme category filter chips (Micro-Credit, Term Loan, Education Loan, All).

2. **Story 4.2: 5-Factor Partner Match Scoring & Nearest Partner Routing**
   - 5-Factor Suitability Scoring algorithm:
     1. Proximity / Distance (30 pts)
     2. Partner Type Alignment (25 pts - SCAs direct channel, PSBs high capacity)
     3. Scheme Category Breadth (20 pts)
     4. Sanction Speed / Processing Days (15 pts)
     5. Fund Utilization & Operational Track Record (10 pts)
   - Real-time distance calculation in kilometers using Haversine formula.
   - "Get Directions" linking directly to Google Maps & OpenStreetMap navigation coordinates.

3. **Story 4.3: Partner Profile Details & Synthetic Data Guardrails**
   - Comprehensive Partner Detail Modal / Drawer: Full address, nodal officer contact info, phone calling trigger (`tel:`), supported scheme list with interest rates, operating hours, and required pre-screening document checklist.
   - Prominent Synthetic Data Disclaimer badge on demonstration records with privacy guardrails.
   - 100% localization in English (`en`) and Hindi (`hi`).
