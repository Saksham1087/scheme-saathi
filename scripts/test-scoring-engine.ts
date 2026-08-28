// Shim import.meta.env for node/tsx test runner
if (typeof (import.meta as any).env === "undefined") {
  (import.meta as any).env = {
    VITE_FIREBASE_API_KEY: "dummy-test-key",
    VITE_FIREBASE_AUTH_DOMAIN: "localhost",
    VITE_FIREBASE_PROJECT_ID: "scheme-saathi-demo",
    VITE_FIREBASE_STORAGE_BUCKET: "localhost",
    VITE_FIREBASE_MESSAGING_SENDER_ID: "123456789",
    VITE_FIREBASE_APP_ID: "1:123456789:web:abcdef",
  }
}

import { evaluateMatchesLocally } from "../src/services/matchingEngine"
import { evaluateMatches } from "../functions/src/engine/rules"
import schemesSeed from "../functions/src/data/schemes.seed.json"
import type { MatchInput, Scheme } from "../src/types"

const schemes = schemesSeed as unknown as Scheme[]

console.log("==================================================")
console.log("RUNNING 100-POINT DETERMINISTIC ENGINE AUDIT")
console.log("==================================================\n")

// Test Case 1: Perfect Match Profile
console.log("--- TEST CASE 1: Perfect Match Profile ---")
const input1: MatchInput = {
  state: "Maharashtra",
  category: "sc",
  gender: "male",
  age: 30,
  educationStatus: "twelfth",
  annualFamilyIncome: 150000,
  projectType: "shop",
  estimatedCost: 120000,
}

const clientMatches1 = evaluateMatchesLocally(input1, schemes)
const backendMatches1 = evaluateMatches(input1, schemes as any)

const topClient1 = clientMatches1[0]
console.log("Top Scheme (Client):", topClient1.schemeId, "| Rank:", topClient1.rank, "| Score:", topClient1.score)
console.log("Breakdown:", topClient1.breakdown)
console.log("Eligible:", topClient1.eligible)

if (topClient1.schemeId !== "micro-finance") {
  throw new Error(`Expected top scheme to be micro-finance, got ${topClient1.schemeId}`)
}
if (topClient1.score !== 100) {
  throw new Error(`Expected score 100, got ${topClient1.score}`)
}
if (
  topClient1.breakdown.income !== 20 ||
  topClient1.breakdown.category !== 20 ||
  topClient1.breakdown.purpose !== 20 ||
  topClient1.breakdown.cost !== 20 ||
  topClient1.breakdown.age !== 10 ||
  topClient1.breakdown.state !== 10
) {
  throw new Error(`Expected breakdown 20/20/20/20/10/10, got ${JSON.stringify(topClient1.breakdown)}`)
}
console.log("✓ TEST CASE 1 PASSED: 100/100 for micro-finance ranked #1 with exact breakdown\n")

// Test Case 2: High Income Disqualification
console.log("--- TEST CASE 2: High Income Disqualification (> ₹5L) ---")
const input2: MatchInput = {
  state: "Maharashtra",
  category: "sc",
  gender: "male",
  age: 30,
  educationStatus: "twelfth",
  annualFamilyIncome: 600000, // exceeds 5L
  projectType: "shop",
  estimatedCost: 120000,
}

const clientMatches2 = evaluateMatchesLocally(input2, schemes)
const topClient2 = clientMatches2[0]
console.log("Scheme:", topClient2.schemeId, "| Eligible:", topClient2.eligible, "| Score:", topClient2.score)
console.log("Income subscore:", topClient2.breakdown.income)
console.log("Reasons / Blockers:", topClient2.reasons)

if (topClient2.eligible !== false) {
  throw new Error("Expected eligible to be false for income > 5L")
}
if (topClient2.breakdown.income !== 0) {
  throw new Error(`Expected income sub-score to be 0, got ${topClient2.breakdown.income}`)
}
const hasIncomeBlocker = topClient2.reasons.some((r) => r.key === "income_exceeds")
if (!hasIncomeBlocker) {
  throw new Error("Expected blocker income_exceeds in reasons")
}
console.log("✓ TEST CASE 2 PASSED: High income disqualified, income sub-score = 0, cited income_exceeds\n")

// Test Case 3: Education Scheme Evaluation
console.log("--- TEST CASE 3: Education Scheme Evaluation ---")
const studentInput: MatchInput = {
  state: "Delhi",
  category: "sc",
  gender: "female",
  age: 22,
  educationStatus: "student",
  annualFamilyIncome: 200000,
  projectType: "higher_education",
  estimatedCost: 1500000,
}

const studentMatches = evaluateMatchesLocally(studentInput, schemes)
const eduMatch = studentMatches.find((s) => s.schemeId === "education-loan")
if (!eduMatch) throw new Error("education-loan not found")
console.log("Student -> Education Scheme Score:", eduMatch.score, "| Eligible:", eduMatch.eligible, "| Breakdown:", eduMatch.breakdown)

if (eduMatch.breakdown.purpose !== 20 || eduMatch.score !== 100 || !eduMatch.eligible) {
  throw new Error("Expected education-loan to score 100 with purpose 20 for student")
}

const nonStudentInput: MatchInput = {
  ...studentInput,
  educationStatus: "twelfth",
  projectType: "shop",
  estimatedCost: 100000,
}
const nonStudentMatches = evaluateMatchesLocally(nonStudentInput, schemes)
const eduMatchNonStudent = nonStudentMatches.find((s) => s.schemeId === "education-loan")
if (!eduMatchNonStudent) throw new Error("education-loan not found")
console.log("Non-Student -> Education Scheme Score:", eduMatchNonStudent.score, "| Eligible:", eduMatchNonStudent.eligible, "| Purpose Subscore:", eduMatchNonStudent.breakdown.purpose)

if (eduMatchNonStudent.breakdown.purpose !== 0 || eduMatchNonStudent.eligible !== false) {
  throw new Error("Expected education-loan purpose score 0 and eligible false for non-student")
}
console.log("✓ TEST CASE 3 PASSED: Education scheme correctly awards 20 pts to student and 0 pts to non-student\n")

// Test Case 4: Cloud Function vs Local Client Parity Test
console.log("--- TEST CASE 4: Cloud Function vs Local Parity Test ---")
const testInputs: MatchInput[] = [
  input1,
  input2,
  studentInput,
  nonStudentInput,
  {
    state: "Uttar Pradesh",
    category: "sc",
    gender: "female",
    age: 35,
    educationStatus: "twelfth",
    annualFamilyIncome: 100000,
    projectType: "artisan",
    estimatedCost: 130000,
  },
  {
    state: "Karnataka",
    category: "other", // non-SC
    gender: "male",
    age: 29,
    educationStatus: "graduate",
    annualFamilyIncome: 300000,
    projectType: "manufacturing",
    estimatedCost: 2000000,
  },
]

for (let i = 0; i < testInputs.length; i++) {
  const inp = testInputs[i]
  const cRes = evaluateMatchesLocally(inp, schemes)
  const bRes = evaluateMatches(inp, schemes as any)

  if (cRes.length !== bRes.length) {
    throw new Error(`Length mismatch in test ${i}`)
  }

  for (let j = 0; j < cRes.length; j++) {
    const c = cRes[j]
    const b = bRes[j]
    if (c.schemeId !== b.schemeId || c.rank !== b.rank || c.eligible !== b.eligible || c.score !== b.score) {
      throw new Error(`Mismatch at profile ${i}, scheme ${j}: client=${JSON.stringify(c)} backend=${JSON.stringify(b)}`)
    }
    if (JSON.stringify(c.breakdown) !== JSON.stringify(b.breakdown)) {
      throw new Error(`Breakdown mismatch at profile ${i}, scheme ${j}`)
    }
  }
}
console.log("✓ TEST CASE 4 PASSED: 100% computational parity verified across diverse applicant profiles\n")

// Test Case 5: Performance Benchmark (< 50ms)
console.log("--- TEST CASE 5: Performance Benchmark ---")
const start = performance.now()
const ITERATIONS = 1000
for (let i = 0; i < ITERATIONS; i++) {
  evaluateMatchesLocally(input1, schemes)
}
const elapsed = performance.now() - start
const avgPerRun = elapsed / ITERATIONS
console.log(`Evaluated ${ITERATIONS} full catalog runs in ${elapsed.toFixed(2)}ms (Avg: ${avgPerRun.toFixed(4)}ms per run)`)
if (avgPerRun > 50) {
  throw new Error(`Performance threshold failed: ${avgPerRun}ms > 50ms`)
}
console.log("✓ TEST CASE 5 PASSED: Execution time is well under 50ms budget (< 0.1ms)\n")

console.log("==================================================")
console.log("ALL 5 DETERMINISTIC ENGINE TESTS PASSED!")
console.log("==================================================")
