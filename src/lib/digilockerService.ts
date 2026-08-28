import type { VerificationMetadata } from "@/types"

export interface DigiLockerCertificateTemplate {
  docType: string
  issuerNameEn: string
  issuerNameHi: string
  certPrefix: string
  defaultIssuedTo: string
  validityYears?: number // undefined for permanent
  authorityCode: string
}

/**
 * Authentic government certificate templates mapped by document ID pattern / type.
 */
export const DIGILOCKER_CERT_TEMPLATES: Record<string, DigiLockerCertificateTemplate> = {
  "doc-caste-cert": {
    docType: "Caste Certificate",
    issuerNameEn: "Revenue Department, Govt. of NCT of Delhi / State Revenue Administration",
    issuerNameHi: "राजस्व विभाग, दिल्ली सरकार / राज्य राजस्व प्रशासन",
    certPrefix: "CC/DL/2024/",
    defaultIssuedTo: "Verified SC/ST/OBC Citizen",
    authorityCode: "in.gov.edistrict.revenue.caste",
  },
  "doc-income-cert": {
    docType: "Income Certificate",
    issuerNameEn: "Office of the Tehsildar & Sub-Divisional Magistrate (SDM)",
    issuerNameHi: "कार्यालय तहसीलदार एवं उप-विभागीय मजिस्ट्रेट (SDM)",
    certPrefix: "INC/REV/2024/",
    defaultIssuedTo: "Applicant & Family",
    validityYears: 1,
    authorityCode: "in.gov.edistrict.revenue.income",
  },
  "doc-aadhaar": {
    docType: "Aadhaar Card (e-KYC Identity Verification)",
    issuerNameEn: "Unique Identification Authority of India (UIDAI), Govt. of India",
    issuerNameHi: "भारतीय विशिष्ट पहचान प्राधिकरण (UIDAI), भारत सरकार",
    certPrefix: "UIDAI-VER-",
    defaultIssuedTo: "Resident of India",
    authorityCode: "in.gov.uidai.aadhaar",
  },
  "doc-address-proof": {
    docType: "Domicile & Residence Certificate",
    issuerNameEn: "Department of Revenue & Civil Administration",
    issuerNameHi: "राजस्व एवं नागरिक प्रशासन विभाग",
    certPrefix: "DOM/ST/2023/",
    defaultIssuedTo: "Registered Domicile Resident",
    authorityCode: "in.gov.state.domicile",
  },
  "doc-marksheets": {
    docType: "Senior School Certificate Examination (Class XII Marksheet)",
    issuerNameEn: "Central Board of Secondary Education (CBSE), New Delhi",
    issuerNameHi: "केन्द्रीय माध्यमिक शिक्षा बोर्ड (CBSE), नई दिल्ली",
    certPrefix: "CBSE/XII/2022/",
    defaultIssuedTo: "Verified Student Candidate",
    authorityCode: "in.gov.cbse.marksheet",
  },
  "doc-commercial-dl": {
    docType: "Driving License (Commercial / Transport)",
    issuerNameEn: "Ministry of Road Transport and Highways (MoRTH) & State RTO",
    issuerNameHi: "सड़क परिवहन एवं राजमार्ग मंत्रालय (MoRTH) व राज्य आरटीओ",
    certPrefix: "DL-04202100",
    defaultIssuedTo: "Licensed Transport Driver",
    validityYears: 10,
    authorityCode: "in.gov.morth.sarathi.dl",
  },
  "doc-trade-license": {
    docType: "Udyam Registration Certificate",
    issuerNameEn: "Ministry of Micro, Small and Medium Enterprises (MoMSME)",
    issuerNameHi: "सूक्ष्म, लघु एवं मध्यम उद्यम मंत्रालय (MoMSME)",
    certPrefix: "UDYAM-DL-03-",
    defaultIssuedTo: "Registered Micro Enterprise",
    authorityCode: "in.gov.msme.udyam",
  },
  "doc-entrance-scorecard": {
    docType: "National Eligibility & Entrance Scorecard",
    issuerNameEn: "National Testing Agency (NTA), Department of Higher Education",
    issuerNameHi: "राष्ट्रीय परीक्षा एजेंसी (NTA), उच्च शिक्षा विभाग",
    certPrefix: "NTA/SCORE/2024/",
    defaultIssuedTo: "Eligible Entrance Candidate",
    validityYears: 1,
    authorityCode: "in.gov.nta.scorecard",
  },
  "doc-daksh-cert": {
    docType: "Skill Development & Entrepreneurship Certificate",
    issuerNameEn: "National Skill Development Corporation (NSDC) & MSJE",
    issuerNameHi: "राष्ट्रीय कौशल विकास निगम (NSDC) एवं सामाजिक न्याय मंत्रालय",
    certPrefix: "NSDC/DAKSH/2024/",
    defaultIssuedTo: "Certified Skill Trainee",
    authorityCode: "in.gov.nsdc.pmdaksh",
  },
}

/**
 * Generate a pseudo-random cryptographic-style verification hash
 */
function generateVerificationHash(): string {
  const chars = "0123456789ABCDEF"
  let hash = "SHA256:"
  for (let i = 0; i < 16; i++) {
    hash += chars[Math.floor(Math.random() * chars.length)]
  }
  return hash
}

/**
 * Generate a simulated serial / certificate number
 */
function generateCertificateNumber(prefix: string): string {
  const randomDigits = Math.floor(100000 + Math.random() * 900000)
  return `${prefix}${randomDigits}`
}

/**
 * Checks if a given document ID has DigiLocker verification support.
 */
export function isDigiLockerSupported(docId: string): boolean {
  return docId in DIGILOCKER_CERT_TEMPLATES
}

/**
 * Generates mock metadata for a verifiable document.
 */
export function generateMockCertificateData(
  docId: string,
  customDocName?: string,
  applicantName?: string,
): VerificationMetadata {
  const template = DIGILOCKER_CERT_TEMPLATES[docId] || {
    docType: customDocName || "Statutory Document",
    issuerNameEn: "Government of India Competent Authority",
    issuerNameHi: "भारत सरकार सक्षम प्राधिकारी",
    certPrefix: "GOI/VER/2024/",
    defaultIssuedTo: applicantName || "Verified Citizen",
    authorityCode: "in.gov.digilocker.doc",
  }

  const certificateNo = generateCertificateNumber(template.certPrefix)
  const now = new Date()
  const verifiedAt = now.toISOString()
  
  let validUntil: string | undefined
  if (template.validityYears) {
    const validDate = new Date(now)
    validDate.setFullYear(validDate.getFullYear() + template.validityYears)
    validUntil = validDate.toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    })
  } else {
    validUntil = "Permanent / Life-long"
  }

  const hash = generateVerificationHash()
  const uri = `${template.authorityCode}:${certificateNo.replace(/[^a-zA-Z0-9]/g, "").toLowerCase()}`

  return {
    certificateNo,
    issuer: template.issuerNameEn,
    verifiedAt,
    docType: template.docType,
    verificationSource: "digilocker",
    issuedTo: applicantName || template.defaultIssuedTo,
    validUntil,
    uri,
    hash,
    additionalFields: {
      "Digital Signature Status": "Cryptographically Validated (PKI)",
      "National Identity Gateway": "DigiLocker (MeitY - Govt. of India)",
      "Statutory Authority Code": template.authorityCode,
      "Compliance Standard": "Rule 9A of Information Technology Rules 2016",
    },
  }
}

/**
 * Simulates the async OAuth / consent handshake and digital certificate fetch from DigiLocker.
 * Resolves after a realistic network delay (1.2s - 1.6s).
 */
export async function simulateDigiLockerFetch(
  docId: string,
  customDocName?: string,
  applicantName?: string,
): Promise<VerificationMetadata> {
  const delayMs = 1200 + Math.floor(Math.random() * 400)
  
  return new Promise((resolve) => {
    setTimeout(() => {
      const data = generateMockCertificateData(docId, customDocName, applicantName)
      resolve(data)
    }, delayMs)
  })
}
