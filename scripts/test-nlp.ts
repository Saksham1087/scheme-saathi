import { extractVoiceEntities, parseIndianAmount } from "../src/lib/nlpExtractor"

function assert(condition: boolean, msg: string) {
  if (!condition) {
    console.error("❌ Assertion failed:", msg)
    process.exit(1)
  }
}

console.log("Testing parseIndianAmount...")

const testAmounts = [
  { input: "1.5 lakh", expected: 150000 },
  { input: "1 lakh 50 hazar", expected: 150000 },
  { input: "50 hazar", expected: 50000 },
  { input: "2.5 lakh", expected: 250000 },
  { input: "2.5 लाख", expected: 250000 },
  { input: "दीड लाख", expected: 150000 },
  { input: "अडीच लाख", expected: 250000 },
  { input: "50k", expected: 50000 },
  { input: "₹ 3,00,000", expected: 300000 },
  { input: "साडे तीन लाख", expected: 350000 },
  { input: "पावणे दोन लाख", expected: 175000 },
]

for (const t of testAmounts) {
  const res = parseIndianAmount(t.input)
  console.log(`Amount: "${t.input}" ->`, res?.amount)
  assert(res !== null && res.amount === t.expected, `Expected ${t.expected} for "${t.input}", got ${res?.amount}`)
}

console.log("\nTesting extractVoiceEntities...")

const testCases = [
  {
    input: "Mujhe kirana dukan ke liye 1 lakh 50 hazar ka loan chahiye",
    expectProjectType: "shop",
    expectCost: 150000,
  },
  {
    input: "I need an education loan of 4 lakh in Maharashtra for college fees",
    expectProjectType: "higher_education",
    expectCost: 400000,
    expectState: "Maharashtra",
  },
  {
    input: "मला शेतीसाठी आणि ट्रॅक्टरसाठी २ लाख रुपये कर्ज हवे आहे, मी महाराष्ट्रात राहतो",
    expectProjectType: "agri",
    expectCost: 200000,
    expectState: "Maharashtra",
  },
  {
    input: "Hum Uttar Pradesh se hain aur silai factory ke liye 5 lakh loan chahiye",
    expectProjectType: "manufacturing",
    expectCost: 500000,
    expectState: "Uttar Pradesh",
  },
  {
    input: "SC category se hoon, auto service ke liye 75 hazar loan chahiye, umar 28 saal hai",
    expectProjectType: "service",
    expectCost: 75000,
    expectCategory: "sc",
    expectAge: 28,
  },
]

for (const tc of testCases) {
  const extracted = extractVoiceEntities(tc.input)
  console.log(`Input: "${tc.input}"`)
  console.log("Extracted:", extracted)
  if (tc.expectProjectType) {
    assert(extracted.projectType === tc.expectProjectType, `Expected projectType ${tc.expectProjectType}, got ${extracted.projectType}`)
  }
  if (tc.expectCost) {
    assert(extracted.estimatedCost === tc.expectCost, `Expected estimatedCost ${tc.expectCost}, got ${extracted.estimatedCost}`)
  }
  if (tc.expectState) {
    assert(extracted.state === tc.expectState, `Expected state ${tc.expectState}, got ${extracted.state}`)
  }
  if (tc.expectCategory) {
    assert(extracted.category === tc.expectCategory, `Expected category ${tc.expectCategory}, got ${extracted.category}`)
  }
  if (tc.expectAge) {
    assert(extracted.age === tc.expectAge, `Expected age ${tc.expectAge}, got ${extracted.age}`)
  }
}

console.log("\n✅ All NLP extractor tests passed!")
