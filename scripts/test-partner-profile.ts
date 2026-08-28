import { readFileSync } from "node:fs"
import { resolve, dirname } from "node:path"
import { fileURLToPath } from "node:url"
import type { ChannelPartner } from "../src/types"

const here = dirname(fileURLToPath(import.meta.url))
const dataDir = resolve(here, "../functions/src/data")
const i18nDir = resolve(here, "../src/i18n")

const partners = JSON.parse(
  readFileSync(resolve(dataDir, "partners.seed.json"), "utf8")
) as ChannelPartner[]

const en = JSON.parse(readFileSync(resolve(i18nDir, "en.json"), "utf8"))
const hi = JSON.parse(readFileSync(resolve(i18nDir, "hi.json"), "utf8"))

function assert(condition: boolean, msg: string) {
  if (!condition) {
    console.error(`❌ ASSERTION FAILED: ${msg}`)
    process.exit(1)
  }
  console.log(`✅ ${msg}`)
}

console.log("\n--- Testing Partner Seed Data Enrichment & Guardrails ---")

assert(partners.length === 9, "Loaded 9 partner seed records")

for (const p of partners) {
  assert(p.isSynthetic === true, `Partner ${p.id} has isSynthetic = true flag`)
  assert(typeof p.email === "string" && p.email.includes("@"), `Partner ${p.id} has valid email (${p.email})`)
  assert(typeof p.phone === "string" && p.phone.startsWith("+91-"), `Partner ${p.id} has valid sanitized phone (${p.phone})`)
  assert(p.nodalOfficer !== undefined, `Partner ${p.id} has nodalOfficer defined`)
  assert(typeof p.nodalOfficer?.name === "string" && p.nodalOfficer.name.length > 3, `Partner ${p.id} has valid nodal officer name (${p.nodalOfficer?.name})`)
  assert(typeof p.nodalOfficer?.designation?.en === "string" && typeof p.nodalOfficer?.designation?.hi === "string", `Partner ${p.id} has bilingual designation`)
  assert(typeof p.nodalOfficer?.email === "string" && p.nodalOfficer.email.includes("@"), `Partner ${p.id} has valid nodal officer email`)
  assert(typeof p.nodalOfficer?.phone === "string" && p.nodalOfficer.phone.startsWith("+91-"), `Partner ${p.id} has valid nodal officer phone`)

  assert(p.operatingHours !== undefined, `Partner ${p.id} has operatingHours defined`)
  assert(typeof p.operatingHours?.en === "string" && p.operatingHours.en.includes("Mon"), `Partner ${p.id} has English operating hours`)
  assert(typeof p.operatingHours?.hi === "string" && p.operatingHours.hi.includes("सोम"), `Partner ${p.id} has Hindi operating hours`)

  assert(Array.isArray(p.supportedSchemeDetails) && p.supportedSchemeDetails.length > 0, `Partner ${p.id} has supportedSchemeDetails array`)
  for (const s of p.supportedSchemeDetails!) {
    assert(typeof s.schemeName.en === "string" && typeof s.schemeName.hi === "string", `Scheme in ${p.id} has bilingual name`)
    assert(typeof s.interestRate === "string" && s.interestRate.includes("%"), `Scheme in ${p.id} has interest rate (${s.interestRate})`)
    assert(s.maxLimit !== undefined, `Scheme in ${p.id} has max limit (${s.maxLimit})`)
    assert(["micro", "term", "education"].includes(s.category), `Scheme in ${p.id} has valid category (${s.category})`)
  }

  assert(Array.isArray(p.docsRequired) && p.docsRequired.length >= 2, `Partner ${p.id} has required docs checklist`)
  for (const d of p.docsRequired) {
    assert(typeof d.en === "string" && typeof d.hi === "string", `Doc item in ${p.id} is localized`)
  }
}

console.log("\n--- Testing Specific Partner Fixtures ---")

const lucknow = partners.find(p => p.id === "bsc-lucknow")
assert(lucknow !== undefined, "Found bsc-lucknow partner")
assert(lucknow!.type === "SCA", "Lucknow partner is SCA")
assert(lucknow!.nodalOfficer!.name === "Shri Rajesh Kumar Verma", "Lucknow nodal officer matches")
assert(lucknow!.supportedSchemeDetails!.some(s => s.schemeId === "micro-finance"), "Lucknow supports micro-finance scheme")

const kanpur = partners.find(p => p.id === "sbi-kanpur-main")
assert(kanpur !== undefined, "Found sbi-kanpur-main partner")
assert(kanpur!.type === "PSB", "Kanpur partner is PSB")
assert(kanpur!.nodalOfficer!.name === "Smt. Sunita Sharma", "Kanpur nodal officer matches")
assert(kanpur!.supportedSchemeDetails!.some(s => s.schemeId === "education-loan"), "Kanpur supports education-loan scheme")

console.log("\n--- Testing English & Hindi Localization Keys ---")

const requiredProfileKeys = [
  "dialogTitle",
  "dialogSubtitle",
  "syntheticBadge",
  "syntheticDisclaimer",
  "tabOverview",
  "tabSchemes",
  "tabDocuments",
  "nodalOfficerTitle",
  "nodalOfficerRole",
  "officerName",
  "designation",
  "operatingHours",
  "officeHours",
  "contactInfo",
  "branchAddress",
  "coordinates",
  "callDesk",
  "emailDesk",
  "callBranch",
  "emailBranch",
  "getDirections",
  "shareBranch",
  "shareTitle",
  "shareSuccess",
  "shareError",
  "supportedSchemesTitle",
  "supportedSchemesSubtitle",
  "interestRate",
  "maxLimit",
  "viewScheme",
  "noSchemes",
  "documentsTitle",
  "documentsSubtitle",
  "docMandatory",
  "docNote",
  "operationalStats",
  "fundUtilization",
  "avgTurnaround",
  "suitabilityScore",
  "close"
]

assert(en.partners.viewProfile !== undefined, "en.json has partners.viewProfile")
assert(hi.partners.viewProfile !== undefined, "hi.json has partners.viewProfile")

for (const key of requiredProfileKeys) {
  assert(typeof en.partners.profile[key] === "string" && en.partners.profile[key].length > 0, `en.json has non-empty partners.profile.${key}`)
  assert(typeof hi.partners.profile[key] === "string" && hi.partners.profile[key].length > 0, `hi.json has non-empty partners.profile.${key}`)
}

console.log("\n✨ ALL PARTNER PROFILE & SYNTHETIC DATA GUARDRAIL TESTS PASSED! ✨\n")
