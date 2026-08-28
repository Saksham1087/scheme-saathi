import {
  calculatePartnerScore,
  computeChannelAlignmentScore,
  computeFundHealthScore,
  computeNpaPenalty,
  computeProcessingSpeedScore,
  computeProximityScore,
  computeSchemeMatchScore,
  getNavigationUrl,
  scoreAndRankPartners,
} from "../src/lib/maps/scoring"
import type { ChannelPartner } from "../src/types"

function assert(condition: boolean, msg: string) {
  if (!condition) {
    console.error(`❌ ASSERTION FAILED: ${msg}`)
    process.exit(1)
  }
  console.log(`✅ ${msg}`)
}

console.log("\n--- Testing 5-Factor Sub-Scores ---")

// 1. Proximity
assert(computeProximityScore(3) === 30, "Proximity <= 5km gives 30 pts")
assert(computeProximityScore(12) === 28, "Proximity <= 15km gives 28 pts")
assert(computeProximityScore(25) === 25, "Proximity <= 30km gives 25 pts")
assert(computeProximityScore(45) === 20, "Proximity <= 50km gives 20 pts")
assert(computeProximityScore(80) === 15, "Proximity <= 100km gives 15 pts")
assert(computeProximityScore(150) === 10, "Proximity <= 200km gives 10 pts")
assert(computeProximityScore(350) === 5, "Proximity <= 500km gives 5 pts")
assert(computeProximityScore(800) === 2, "Proximity > 500km gives 2 pts")

// 2. Channel Alignment
assert(computeChannelAlignmentScore("SCA") === 25, "SCA gets 25 pts")
assert(computeChannelAlignmentScore("PSB") === 20, "PSB gets 20 pts")
assert(computeChannelAlignmentScore("RRB") === 18, "RRB gets 18 pts")
assert(computeChannelAlignmentScore("NBFC_MFI") === 15, "NBFC_MFI gets 15 pts")

// 3. Scheme Support
assert(computeSchemeMatchScore(["micro", "term"], "micro") === 20, "Target category match gives 20 pts")
assert(computeSchemeMatchScore(["micro", "term"], "education") === 0, "Target category mismatch gives 0 pts")
assert(computeSchemeMatchScore(["micro", "term", "education"], "all") === 20, "3 categories in all mode gives 20 pts")
assert(computeSchemeMatchScore(["micro", "term"], "all") === 18, "2 categories in all mode gives 18 pts")
assert(computeSchemeMatchScore(["micro"], "all") === 14, "1 category in all mode gives 14 pts")

// 4. Processing Speed
assert(computeProcessingSpeedScore(15) === 15, "Speed <= 15 days gives 15 pts")
assert(computeProcessingSpeedScore(25) === 13, "Speed <= 25 days gives 13 pts")
assert(computeProcessingSpeedScore(30) === 11, "Speed <= 30 days gives 11 pts")
assert(computeProcessingSpeedScore(40) === 9, "Speed <= 40 days gives 9 pts")
assert(computeProcessingSpeedScore(50) === 6, "Speed <= 50 days gives 6 pts")
assert(computeProcessingSpeedScore(60) === 3, "Speed > 50 days gives 3 pts")

// 5. Fund Health & NPA Penalty
assert(computeFundHealthScore(62) === 10, "Fund 62% gives 10 pts")
assert(computeFundHealthScore(48) === 8, "Fund 48% gives 8 pts")
assert(computeFundHealthScore(88) === 7, "Fund 88% gives 7 pts")
assert(computeFundHealthScore(20) === 6, "Fund 20% gives 6 pts")
assert(computeFundHealthScore(98) === 4, "Fund 98% gives 4 pts")
assert(computeNpaPenalty("high") === -15, "High NPA penalty is -15 pts")
assert(computeNpaPenalty("low") === 0, "Low NPA penalty is 0 pts")

console.log("\n--- Testing Edge Case Scenarios ---")

const userLoc = { lat: 26.8467, lng: 80.9462 } // Lucknow

const lucknowSca: ChannelPartner = {
  id: "bsc-lucknow",
  name: "Bhartiya SC Development Corp (SCA)",
  type: "SCA",
  address: "12, Ashok Marg",
  city: "Lucknow",
  state: "Uttar Pradesh",
  geo: { lat: 26.8497, lng: 80.9409 },
  phone: "+91-522-400-1100",
  schemeCategories: ["micro", "term"],
  npaFlag: "low",
  fundUtilizationPct: 62,
  docsRequired: [{ en: "Income", hi: "आय" }],
  avgProcessingDays: 30,
}

const kanpurPsb: ChannelPartner = {
  id: "sbi-kanpur-main",
  name: "State Bank of India — Kanpur Main",
  type: "PSB",
  address: "Mall Road",
  city: "Kanpur",
  state: "Uttar Pradesh",
  geo: { lat: 26.4609, lng: 80.3219 },
  phone: "+91-512-250-2200",
  schemeCategories: ["micro", "term", "education"],
  npaFlag: "low",
  fundUtilizationPct: 48,
  docsRequired: [{ en: "Income", hi: "आय" }],
  avgProcessingDays: 45,
}

const sarthakHighNpa: ChannelPartner = {
  id: "nbfc-sarthak-mfi",
  name: "Sarthak Micro Finance Ltd",
  type: "NBFC_MFI",
  address: "Shop 4, Kalyan Complex",
  city: "Pune",
  state: "Maharashtra",
  geo: { lat: 18.5913, lng: 73.7389 },
  phone: "+91-20-6789-6600",
  schemeCategories: ["micro"],
  npaFlag: "high",
  fundUtilizationPct: 88,
  docsRequired: [{ en: "Income", hi: "आय" }],
  avgProcessingDays: 15,
}

const scaScore = calculatePartnerScore(lucknowSca, userLoc, "micro")
console.log("Lucknow SCA Score:", scaScore)
assert(scaScore.totalScore === 96, "Lucknow SCA scores 96/100 (30 + 25 + 20 + 11 + 10 = 96)")
assert(scaScore.tier === "top", "Lucknow SCA is 'top' tier")

const psbScore = calculatePartnerScore(kanpurPsb, userLoc, "micro")
console.log("Kanpur PSB Score:", psbScore)
assert(psbScore.totalScore < scaScore.totalScore, "Kanpur PSB scores lower due to distance, PSB type, and slower speed")

const npaScore = calculatePartnerScore(sarthakHighNpa, userLoc, "micro")
console.log("High NPA NBFC Score:", npaScore)
assert(npaScore.breakdown.npaPenalty === -15, "High NPA has -15 pt penalty")
assert(npaScore.tier !== "top", "High NPA partner is never recommended as 'top' tier")

console.log("\n--- Testing Ranking & Sorting ---")
const ranked = scoreAndRankPartners([kanpurPsb, sarthakHighNpa, lucknowSca], userLoc, "micro", "best_match")
assert(ranked[0].id === "bsc-lucknow", "Lucknow SCA ranked #1 Best Match")
assert(ranked[ranked.length - 1].id === "nbfc-sarthak-mfi", "High NPA partner deprioritized to the bottom")

console.log("\n--- Testing Navigation Links ---")
const navUrl = getNavigationUrl(userLoc, lucknowSca.geo, "google")
assert(
  navUrl.includes("origin=26.8467,80.9462") && navUrl.includes("destination=26.8497,80.9409"),
  "Google Maps navigation link includes exact origin and destination GPS coordinates",
)

const osmUrl = getNavigationUrl(userLoc, lucknowSca.geo, "osm")
assert(
  osmUrl.includes("openstreetmap.org/directions"),
  "OpenStreetMap navigation link generated correctly",
)

console.log("\n✨ ALL 5-FACTOR MATCH SCORING & ROUTING TESTS PASSED! ✨\n")
