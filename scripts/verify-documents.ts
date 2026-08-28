import {
  STATUTORY_DOCUMENTS,
  SCHEME_DOCUMENT_RULES,
  getAllDocuments,
  getDocumentsForScheme,
  getSchemeDocumentConfig,
  computeReadiness,
  getDocumentCategories,
} from "../src/lib/documentRules"

function assert(condition: boolean, message: string) {
  if (!condition) {
    console.error(`❌ Assertion Failed: ${message}`)
    process.exit(1)
  }
  console.log(`✓ ${message}`)
}

console.log("\n--- Testing Document Catalog & Rules ---")

// 1. Check all statutory base documents exist
const allDocs = getAllDocuments()
assert(allDocs.length >= 15, `Expected at least 15 statutory documents, got ${allDocs.length}`)

const baseDocIds = [
  "doc-aadhaar",
  "doc-address-proof",
  "doc-caste-cert",
  "doc-income-cert",
  "doc-bank-passbook",
  "doc-photos",
]

for (const id of baseDocIds) {
  const doc = STATUTORY_DOCUMENTS[id]
  assert(Boolean(doc), `Base document ${id} exists`)
  assert(doc.mandatory === true, `Base document ${id} is mandatory`)
  assert(Boolean(doc.name.en && doc.name.hi), `Document ${id} is localized in en and hi`)
  assert(Boolean(doc.issuingAuthority.en && doc.issuingAuthority.hi), `Document ${id} has issuing authority in en and hi`)
}

// 2. Test Scheme-Specific Document Generation
console.log("\n--- Testing Scheme-Specific Mappings ---")

// Micro Credit Scheme
const microDocs = getDocumentsForScheme("micro-finance")
assert(microDocs.some((d) => d.id === "doc-project-quotations"), "Micro credit includes project quotations")
assert(microDocs.some((d) => d.id === "doc-business-premises"), "Micro credit includes business premises")

// Term Loan Scheme
const termDocs = getDocumentsForScheme("term-loan")
assert(termDocs.some((d) => d.id === "doc-dpr"), "Term loan includes Detailed Project Report (DPR)")
assert(termDocs.some((d) => d.id === "doc-pollution-clearance"), "Term loan includes pollution clearance")

// Education Loan Scheme
const eduDocs = getDocumentsForScheme("education-loan")
assert(eduDocs.some((d) => d.id === "doc-admission-letter"), "Education loan includes admission letter")
assert(eduDocs.some((d) => d.id === "doc-fee-schedule"), "Education loan includes fee schedule")
assert(eduDocs.some((d) => d.id === "doc-marksheets"), "Education loan includes marksheets")

// Mahila Samriddhi
const mahilaDocs = getDocumentsForScheme("mahila-samriddhi")
assert(mahilaDocs.some((d) => d.id === "doc-shg-cert"), "Mahila Samriddhi includes SHG certificate")

// Swachhta Udyami (Sanitation)
const sanitationDocs = getDocumentsForScheme("swachhta-udyami")
assert(sanitationDocs.some((d) => d.id === "doc-ulb-cert"), "Sanitation scheme includes ULB verification cert")
assert(sanitationDocs.some((d) => d.id === "doc-sanitation-machinery-quote"), "Sanitation scheme includes machinery quote")

// Green Business (Solar/EV)
const greenDocs = getDocumentsForScheme("green-business")
assert(greenDocs.some((d) => d.id === "doc-solar-quote"), "Green business includes Solar/EV vendor technical quotation")
assert(greenDocs.some((d) => d.id === "doc-discom-approval"), "Green business includes DISCOM net-metering approval")

// PM-DAKSH Loan
const dakshDocs = getDocumentsForScheme("pm-daksh-loan")
assert(dakshDocs.some((d) => d.id === "doc-daksh-cert"), "PM-DAKSH loan includes skill completion certificate")

// 3. Test Readiness Meter Calculations
console.log("\n--- Testing Readiness Meter Engine ---")

// State 0: None checked
const emptyReadiness = computeReadiness(microDocs, {})
assert(emptyReadiness.totalCount === microDocs.length, "Total count matches microDocs count")
assert(emptyReadiness.completedCount === 0, "Initial completed count is 0")
assert(emptyReadiness.percentage === 0, "Initial percentage is 0%")
assert(emptyReadiness.status === "not_started", "Initial status is not_started")

// State 1: 3 checked
const partialChecked: Record<string, boolean> = {
  "doc-aadhaar": true,
  "doc-address-proof": true,
  "doc-caste-cert": true,
}
const partialReadiness = computeReadiness(microDocs, partialChecked)
assert(partialReadiness.completedCount === 3, "Partial completed count is 3")
assert(partialReadiness.status === "in_progress", "Partial status is in_progress")
assert(partialReadiness.percentage === Math.round((3 / microDocs.length) * 100), "Percentage calculated correctly")

// State 2: 100% checked
const allChecked: Record<string, boolean> = {}
for (const d of microDocs) {
  allChecked[d.id] = true
}
const completeReadiness = computeReadiness(microDocs, allChecked)
assert(completeReadiness.completedCount === microDocs.length, "All completed count matches total")
assert(completeReadiness.percentage === 100, "Complete percentage is 100%")
assert(completeReadiness.status === "ready_to_apply", "Complete status is ready_to_apply")

// 4. Test Scheme Config and Category Mappings
console.log("\n--- Testing Config & Categories ---")
const config = getSchemeDocumentConfig("education-loan")
assert(config.schemeType === "education", "Config type matches education")
assert(config.documents.length === eduDocs.length, "Config documents match eduDocs")

const cats = getDocumentCategories()
assert(cats.length >= 6, "Categories list contains at least 6 categories")

console.log("\n✅ All Document Checklist validation checks passed successfully!\n")
