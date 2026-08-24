# SchemeSathi

**Your Guide to the Right Scheme.**
AI-assisted (rule-based, ML-swappable) scheme matching for SC entrepreneurs and
students seeking concessional loans under India's Channel Finance System
(SCAs, PSBs, RRBs, NBFC-MFIs).

Original product — distinct branding, no government emblems or mastheads.

## Stack

React 19 + Vite + TypeScript + TailwindCSS v4 + shadcn/ui · Zustand ·
Firebase (Auth phone-OTP primary + email fallback, Firestore, Cloud Functions,
Storage, Hosting) · Leaflet/OpenStreetMap partner locator (Google Maps adapter
stub behind the same `MapService` interface) · react-i18next (EN + HI).

## Local development

```bash
npm install
npm i --prefix functions        # cloud functions deps

# Terminal 1 — emulator suite (auth :9099, firestore :8080, functions :5001,
#               storage :9199, pubsub :8085, UI :4000)
npm run emulators

# Terminal 2 — seed schemes + partners into the emulator
FIRESTORE_EMULATOR_HOST=127.0.0.1:8080 npm run seed

# Terminal 3 — app on http://localhost:5173
npm run dev
```

No Firebase project needed: without env credentials the app auto-connects to
emulators under the demo project `scheme-saathi-demo`. Phone OTP login accepts
any number with code `123456` on the emulator.

## Production deploy

```bash
cp .env.example .env             # fill real Firebase web config
cp functions/.env.example functions/.env   # set MCP_SCHEMES_URL when ready
npm run build && firebase deploy # hosting + firestore rules + storage rules + functions
```

Deploy Firestore/Storage rules before enabling signups.

## Architecture notes

- **Rule engine** (`functions/src/engine/rules.ts`) is a pure function:
  scheme tiers (micro ₹1.40 L / term ₹50 L / education course-cost), the
  ₹5,00,000 family-income ceiling, and ≤90% funding coverage are plain data.
  Swap in an ML classifier by implementing the same signature; UI unchanged.
- **Misrouting prevention**: the Track page disables partners that don't handle
  a matched scheme's category; `submitApplication` callable re-validates
  server-side and refuses incompatible routing.
- **Moratorium is per-scheme configuration** (`moratorium.interestAccrues`),
  never hardcoded. The EMI calculator capitalizes interest during moratorium
  only when the flag says so, and labels both cases honestly.
- **Privacy**: consent gate before income/category intake (timestamp stored in
  `users/{uid}.consent.demographicAt`); Firestore rules restrict applications
  to owner read/create only (status transitions server-side); Storage keeps
  documents private per-user (`documents/{uid}/…`, size+type limited); no
  analytics anywhere near intake flows.
- **MCP sync** (`functions/src/mcpSync/scheduledSync.ts`): daily scheduled pull
  from `MCP_SCHEMES_URL`, defensive normalization into the `schemes` collection
  tagged `source:"mcp"`. Connector down → seeded data stays live; demo never
  breaks. MCP data never touches rule-engine constants.

### Firestore schema

| Collection | Doc shape (abridged) |
|---|---|
| `schemes/{id}` | name/description (en·hi), type micro\|term\|education, maxProjectCost, incomeCeiling 500000, coverageMaxPct ≤90, rateRange{min,max}, tenureRangeMonths{min,max}, moratorium{minMonths,maxMonths,interestAccrues}, source seed\|mcp |
| `partners/{id}` | name, type SCA\|PSB\|RRB\|NBFC_MFI, address, city, state, geo{lat,lng}, phone, schemeCategories[], npaFlag low\|medium\|high, fundUtilizationPct, docsRequired[{en,hi}], avgProcessingDays |
| `applications/{id}` | uid, schemeId, schemeType, partnerId, requestedAmount, status submitted→under_review→disbursed, routingCheck{ok,reasonKey}, createdAt/updatedAt |
| `users/{uid}` | consent.demographicAt |

Seed JSONs live in `functions/src/data/` — single source used by the seed
script, the functions' offline fallback, and the client demo fallback.

## TODOs

- [ ] Voice intake (`src/lib/voice.ts`): Web Speech API hi-IN/en-IN wiring;
      hook signature + mic button slot already in the wizard.
- [ ] Real MCP connector payload mapping in `normalizeMcpEntry`.
- [ ] More locales: add `src/i18n/{mr,ta,bn,te}.json`, register in i18n/index.
- [ ] Signed-URL flow granting channel partners scoped document access.
- [ ] Replace seed moratorium/rate values with verified scheme rules once
      myscheme.gov.in reference data lands via MCP.
