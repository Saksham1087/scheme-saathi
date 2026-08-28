---
title: 'Story 4.2: 5-Factor Partner Match Scoring & Nearest Partner Routing'
type: 'feature'
created: '2026-08-28'
status: 'done'
baseline_commit: '8bd3b79da9323c21a4f00947baae4bc16f8ef1d2'
review_loop_iteration: 0
context:
  - '_bmad-output/implementation-artifacts/epic-4-context.md'
  - '_bmad-output/implementation-artifacts/spec-4-1-react-leaflet-partner-map-geo-spatial-search.md'
---

<frozen-after-approval reason="human-owned intent — do not modify unless human renegotiates">

## Intent

**Problem:** Beneficiaries visiting random bank branches are often turned away because that specific branch does not service their target scheme or has slow processing times, while superior State Channelizing Agency (SCA) offices or active rural bank branches nearby remain undiscovered.

**Approach:** Implement a deterministic 5-Factor Partner Match Scoring Algorithm (Proximity: 30 pts, Channel Alignment: 25 pts, Scheme Match: 20 pts, Processing Speed: 15 pts, Fund Health: 10 pts) that ranks channel partners by overall suitability, provides expandable criteria breakdowns, allows sorting by Best Match / Distance / Speed, and generates direct turn-by-turn routing navigation links.

## Boundaries & Constraints

**Always:**
- Strictly compute the 5-Factor Partner Score (0 to 100 points):
  - Proximity (30 pts max based on Haversine distance in km)
  - Partner Type Alignment (25 pts max)
  - Target Scheme Category Support (20 pts max)
  - Processing Speed / Turnaround Days (15 pts max)
  - Fund Utilization & Health Track Record (10 pts max, with High NPA penalty)
- Provide sort selector: "Best Match (Suitability)", "Nearest Distance", "Fastest Processing (~Days)".
- Generate one-click "Get Directions" linking user GPS coordinates directly to Google Maps navigation (`https://www.google.com/maps/dir/?api=1&origin={userLat},{userLng}&destination={partnerLat},{partnerLng}`).
- Support 100% localization in English (`en`) and Hindi (`hi`).
- Maintain accessible WCAG AA touch targets.

**Never:**
- Recommend High-NPA partners as "Top Match" without prominent warning disclosures.
- Fail if user GPS coordinates are unavailable (fall back gracefully to district/state center).

## I/O & Edge-Case Matrix

| Scenario | Input / State | Expected Output / Behavior | Error Handling |
|----------|--------------|---------------------------|----------------|
| Multi-Factor Scoring | Lucknow SCA branch vs Kanpur PSB | Lucknow SCA scores 96/100 (high proximity + direct SCA channel + fast speed); ranked #1 "Best Match" | Renders all 5 criteria sub-scores |
| High NPA Flag | Partner marked with `npaFlag: "high"` | Receives -15 pt penalty and warning pill: "High NPA Review — Possible Sanction Delays" | Deprioritized to bottom of rankings |
| Navigation Link Click | User taps "Get Directions" | Opens Google Maps with origin & destination coordinates in a new tab | Opens OpenStreetMap if Google Maps unavailable |

</frozen-after-approval>

## Code Map

- `src/lib/maps/scoring.ts` -- Pure deterministic 5-factor partner match scoring engine returning itemized sub-scores and suitability badge tier.
- `src/components/partners/PartnerScoreBadge.tsx` -- Visual score badge with color gradations (Emerald 85+, Blue 70+, Amber <70) and criteria breakdown popover.
- `src/components/partners/PartnerCard.tsx` -- Updated with 5-factor score badge, sub-score drawer, and turn-by-turn routing directions CTA.
- `src/pages/PartnersPage.tsx` -- Sort dropdown ("Best Match", "Nearest Distance", "Processing Speed") and scheme preset bridging from `/results`.
- `src/i18n/en.json` & `src/i18n/hi.json` -- Complete English and Hindi localization strings for partner match scoring factors and sort options.

## Tasks & Acceptance

**Execution:**
- [x] `src/lib/maps/scoring.ts` -- Implement 5-factor scoring algorithm with distance, type, scheme, speed, and health weights.
- [x] `src/components/partners/PartnerScoreBadge.tsx` -- Build accessible score badge and criteria popover.
- [x] `src/components/partners/PartnerCard.tsx` -- Integrate score badge and deep-linked Google Maps turn-by-turn directions.
- [x] `src/pages/PartnersPage.tsx` -- Add sorting controls and wire 5-factor scoring engine.
- [x] `src/i18n/en.json` & `src/i18n/hi.json` -- Add complete localized strings in English and Hindi.

**Acceptance Criteria:**
- Given a user location and scheme category, partners are scored out of 100 with accurate itemized points.
- Given "Get Directions", clicking launches external navigation with precise GPS coordinates.
- Given sort selection ("Nearest" / "Best Match"), list re-orders instantly.

## Spec Change Log

_None._

## Design Notes

- Emerald suitability pill for top-ranked partner ("Top Recommendation · 96% Match").
- Clear breakdown meter for each of the 5 factors.

## Verification

**Commands:**
- `npm run lint` -- expected: zero errors across `src/`
- `npm run build` -- expected: clean TypeScript compilation and Vite build with no type errors

## Suggested Review Order

**5-Factor Suitability Scoring Engine & Routing**

- Deterministic 5-factor suitability scoring engine, multi-criterion sorting, and Google Maps / OSM routing generator.
  [`scoring.ts:1`](../../src/lib/maps/scoring.ts#L1)

- Types and sub-score metrics for partner matching.
  [`types.ts:40`](../../src/lib/maps/types.ts#L40)

**Score Badge & Partner Card Integration**

- Accessible score badge with color gradations and itemized 5-factor criteria breakdown modal.
  [`PartnerScoreBadge.tsx:20`](../../src/components/partners/PartnerScoreBadge.tsx#L20)

- Updated partner card with suitability ranking, NPA warning pill, and turn-by-turn routing CTA.
  [`PartnerCard.tsx:30`](../../src/components/partners/PartnerCard.tsx#L30)

**Page Sorting & Bilingual Localization**

- Sorting controls ("Best Match", "Nearest Distance", "Fastest Processing") and URL preset bridging.
  [`PartnersPage.tsx:50`](../../src/pages/PartnersPage.tsx#L50)

- English and Hindi localized dictionaries for 5 scoring factors, sort options, and warnings.
  [`en.json:760`](../../src/i18n/en.json#L760)
  [`hi.json:760`](../../src/i18n/hi.json#L760)
