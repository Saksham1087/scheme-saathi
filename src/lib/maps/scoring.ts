import { distanceKm } from "@/lib/emi"
import { type GeoPoint } from "@/lib/maps/types"
import type { ChannelPartner, NpaFlag, PartnerType, SchemeType } from "@/types"

export type PartnerSortOption = "best_match" | "nearest" | "speed"

export type SuitabilityBadgeTier = "top" | "high" | "moderate"

export interface PartnerScoreBreakdown {
  proximity: number // max 30
  channelAlignment: number // max 25
  schemeMatch: number // max 20
  processingSpeed: number // max 15
  fundHealth: number // max 10
  npaPenalty: number // 0 or -15
}

export interface PartnerMatchScore {
  totalScore: number // 0 - 100
  breakdown: PartnerScoreBreakdown
  tier: SuitabilityBadgeTier
  distanceKm: number
  isHighNpa: boolean
}

export interface ScoredPartner extends ChannelPartner {
  score: PartnerMatchScore
}

/**
 * 1. Proximity Score (0 to 30 pts)
 * Based on Haversine distance in km from user's current or district location.
 */
export function computeProximityScore(distKm: number): number {
  if (distKm <= 5) return 30
  if (distKm <= 15) return 28
  if (distKm <= 30) return 25
  if (distKm <= 50) return 20
  if (distKm <= 100) return 15
  if (distKm <= 200) return 10
  if (distKm <= 500) return 5
  return 2
}

/**
 * 2. Partner Type Alignment Score (0 to 25 pts)
 * - SCA: 25 pts (Dedicated statutory channel for SC welfare & maximum interest subsidies)
 * - PSB: 20 pts (Public sector bank with high credit capacity)
 * - RRB: 18 pts (Regional rural bank specialized in grassroots coverage)
 * - NBFC_MFI: 15 pts (Microfinance institution for micro-credit)
 */
export function computeChannelAlignmentScore(type: PartnerType): number {
  switch (type) {
    case "SCA":
      return 25
    case "PSB":
      return 20
    case "RRB":
      return 18
    case "NBFC_MFI":
      return 15
    default:
      return 15
  }
}

/**
 * 3. Scheme Support Match Score (0 to 20 pts)
 * - If target category is specified: 20 pts if supported, 0 pts if unsupported
 * - If "all" or unspecified: based on breadth of supported scheme categories
 */
export function computeSchemeMatchScore(
  partnerCategories: SchemeType[],
  targetCategory?: SchemeType | "all",
): number {
  if (targetCategory && targetCategory !== "all") {
    return partnerCategories.includes(targetCategory) ? 20 : 0
  }

  // Broad support scoring when no single category filter is pinned
  const count = partnerCategories.length
  if (count >= 3) return 20
  if (count === 2) return 18
  if (count === 1) return 14
  return 0
}

/**
 * 4. Processing Speed / Turnaround Days Score (0 to 15 pts)
 * - Faster turnaround days receive higher score
 */
export function computeProcessingSpeedScore(avgDays?: number): number {
  if (typeof avgDays !== "number" || avgDays <= 0) return 9 // Default average assumption

  if (avgDays <= 15) return 15
  if (avgDays <= 25) return 13
  if (avgDays <= 30) return 11
  if (avgDays <= 40) return 9
  if (avgDays <= 50) return 6
  return 3
}

/**
 * 5. Fund Utilization & Health Track Record Score (0 to 10 pts)
 * - Healthy active fund deployment (50% - 85%) gets maximum points
 */
export function computeFundHealthScore(utilizationPct: number): number {
  const pct = Math.max(0, Math.min(100, utilizationPct))
  if (pct >= 50 && pct <= 85) return 10
  if (pct >= 30 && pct < 50) return 8
  if (pct > 85 && pct <= 95) return 7
  if (pct < 30) return 6
  return 4 // > 95% nearly exhausted quota
}

/**
 * NPA Penalty Adjustment (-15 pts if high)
 */
export function computeNpaPenalty(npaFlag: NpaFlag): number {
  return npaFlag === "high" ? -15 : 0
}

/**
 * Deterministic 5-Factor Partner Match Scoring Algorithm (0 - 100 points)
 */
export function calculatePartnerScore(
  partner: ChannelPartner,
  userLoc: GeoPoint,
  targetCategory?: SchemeType | "all",
): PartnerMatchScore {
  const dist = distanceKm(userLoc, partner.geo)
  const proximity = computeProximityScore(dist)
  const channelAlignment = computeChannelAlignmentScore(partner.type)
  const schemeMatch = computeSchemeMatchScore(partner.schemeCategories, targetCategory)
  const processingSpeed = computeProcessingSpeedScore(partner.avgProcessingDays)
  const fundHealth = computeFundHealthScore(partner.fundUtilizationPct)
  const npaPenalty = computeNpaPenalty(partner.npaFlag)

  const rawTotal = proximity + channelAlignment + schemeMatch + processingSpeed + fundHealth + npaPenalty
  const totalScore = Math.max(0, Math.min(100, Math.round(rawTotal)))
  const isHighNpa = partner.npaFlag === "high"

  // Suitability tier determination:
  // High-NPA partners are never classified as "top" tier
  let tier: SuitabilityBadgeTier = "moderate"
  if (!isHighNpa) {
    if (totalScore >= 85) {
      tier = "top"
    } else if (totalScore >= 70) {
      tier = "high"
    }
  }

  return {
    totalScore,
    breakdown: {
      proximity,
      channelAlignment,
      schemeMatch,
      processingSpeed,
      fundHealth,
      npaPenalty,
    },
    tier,
    distanceKm: dist,
    isHighNpa,
  }
}

/**
 * Scores and sorts channel partners based on 5-factor scoring model and sort preferences.
 */
export function scoreAndRankPartners(
  partners: ChannelPartner[],
  userLoc: GeoPoint,
  targetCategory?: SchemeType | "all",
  sortBy: PartnerSortOption = "best_match",
): ScoredPartner[] {
  const scored: ScoredPartner[] = partners.map((p) => ({
    ...p,
    score: calculatePartnerScore(p, userLoc, targetCategory),
  }))

  return scored.sort((a, b) => {
    // High-NPA partners are always deprioritized to the bottom
    const npaA = a.score.isHighNpa ? 1 : 0
    const npaB = b.score.isHighNpa ? 1 : 0
    if (npaA !== npaB) return npaA - npaB

    if (sortBy === "nearest") {
      return a.score.distanceKm - b.score.distanceKm
    }

    if (sortBy === "speed") {
      const speedA = a.avgProcessingDays ?? 999
      const speedB = b.avgProcessingDays ?? 999
      if (speedA !== speedB) return speedA - speedB
      return b.score.totalScore - a.score.totalScore
    }

    // Default: "best_match"
    if (b.score.totalScore !== a.score.totalScore) {
      return b.score.totalScore - a.score.totalScore
    }
    return a.score.distanceKm - b.score.distanceKm
  })
}

/**
 * Generates turn-by-turn navigation URL for Google Maps and OpenStreetMap
 */
export function getNavigationUrl(
  userLoc: GeoPoint,
  partnerGeo: GeoPoint,
  service: "google" | "osm" = "google",
): string {
  if (service === "osm") {
    return `https://www.openstreetmap.org/directions?engine=fossgis_osrm_car&route=${userLoc.lat}%2C${userLoc.lng}%3B${partnerGeo.lat}%2C${partnerGeo.lng}`
  }
  return `https://www.google.com/maps/dir/?api=1&origin=${userLoc.lat},${userLoc.lng}&destination=${partnerGeo.lat},${partnerGeo.lng}`
}
