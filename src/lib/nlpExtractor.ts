import { STATES } from "./states"
import type { ApplicantCategory, EducationStatus, Gender } from "../types"

export interface ExtractedVoiceEntities {
  rawTranscript: string
  projectType?: string
  estimatedCost?: number
  state?: string
  category?: ApplicantCategory
  gender?: Gender
  age?: number
  annualFamilyIncome?: number
  educationStatus?: EducationStatus
  confidence: {
    projectType: number
    estimatedCost: number
    state: number
    category: number
    gender: number
    age: number
    annualFamilyIncome: number
    educationStatus: number
  }
  matchedKeywords: {
    projectType?: string
    estimatedCost?: string
    state?: string
    category?: string
    gender?: string
    age?: string
    annualFamilyIncome?: string
    educationStatus?: string
  }
}

// Convert Devanagari numerals to ASCII digits: ०-९ -> 0-9
function normalizeDevanagariDigits(text: string): string {
  const devanagariDigits = ["०", "१", "२", "३", "४", "५", "६", "७", "८", "९"]
  let result = text
  for (let i = 0; i <= 9; i++) {
    result = result.replaceAll(devanagariDigits[i], String(i))
  }
  return result
}

// Word-to-number mapping for Hindi/Marathi/English spoken numbers
const WORD_NUMBER_MAP: Record<string, number> = {
  // English
  zero: 0,
  one: 1,
  two: 2,
  three: 3,
  four: 4,
  five: 5,
  six: 6,
  seven: 7,
  eight: 8,
  nine: 9,
  ten: 10,
  eleven: 11,
  twelve: 12,
  thirteen: 13,
  fourteen: 14,
  fifteen: 15,
  sixteen: 16,
  seventeen: 17,
  eighteen: 18,
  nineteen: 19,
  twenty: 20,
  twentyfive: 25,
  thirty: 30,
  forty: 40,
  fifty: 50,
  sixty: 60,
  seventy: 70,
  eighty: 80,
  ninety: 90,
  hundred: 100,

  // Hindi
  एक: 1,
  दो: 2,
  तीन: 3,
  चार: 4,
  पांच: 5,
  पाँच: 5,
  छह: 6,
  सात: 7,
  आठ: 8,
  नौ: 9,
  दस: 10,
  ग्यारह: 11,
  बारह: 12,
  तेरह: 13,
  चौदह: 14,
  पंद्रह: 15,
  सोलह: 16,
  सत्रह: 17,
  अठारह: 18,
  उन्नीस: 19,
  बीस: 20,
  पच्चीस: 25,
  तीस: 30,
  चालीस: 40,
  पचास: 50,
  साठ: 60,
  सत्तर: 70,
  अस्सी: 80,
  नब्बे: 90,
  सौ: 100,

  // Marathi
  दोन: 2,
  पाच: 5,
  सहा: 6,
  दहा: 10,
  अकरा: 11,
  बारा: 12,
  तेरा: 13,
  चौदा: 14,
  पंधरा: 15,
  सोळा: 16,
  सतरा: 17,
  अठरा: 18,
  एकोणीस: 19,
  वीस: 20,
  पंचवीस: 25,
  चाळीस: 40,
  पन्नास: 50,
  ऐंशी: 80,
  नव्वद: 90,
  शंभर: 100,

  // Transliterated
  ek: 1,
  do: 2,
  don: 2,
  teen: 3,
  char: 4,
  chaar: 4,
  paanch: 5,
  panch: 5,
  pach: 5,
  chhah: 6,
  che: 6,
  saat: 7,
  aath: 8,
  ath: 8,
  nau: 9,
  das: 10,
  daha: 10,
  pandrah: 15,
  bees: 20,
  vees: 20,
  pachees: 25,
  panchvees: 25,
  tees: 30,
  chalis: 40,
  pachas: 50,
  pannas: 50,
  sau: 100,
  shambhar: 100,
}

/**
 * Parse an Indian currency/amount phrase into a number.
 * Examples:
 * - "1.5 lakh" -> 150000
 * - "1 lakh 50 hazar" -> 150000
 * - "2.5 लाख" -> 250000
 * - "50 hazar" -> 50000
 * - "दीड लाख" -> 150000
 * - "अडीच लाख" -> 250000
 * - "50k" -> 50000
 */
export function parseIndianAmount(text: string): { amount: number; matchedText: string } | null {
  if (!text) return null
  const normalized = normalizeDevanagariDigits(text.toLowerCase())

  // 1. Direct fraction words in Indian languages: "dedh / दीड" = 1.5, "dhai / adhai / अडीच / ढाई" = 2.5, "sadhe / साडे" = +0.5, "paune / पावणे" = -0.25, "sawa / सवा" = +0.25
  const fractionLakhRegex = /(?:(दीड|डेढ़|dedh|deydh)|(अडीच|ढाई|adhai|dhai)|(?:(साडे|साढ़े|sadhe)\s*([a-z\u0900-\u097f\d]+))|(?:(पावणे|पौने|paune)\s*([a-z\u0900-\u097f\d]+))|(?:(सवा|sawa)\s*([a-z\u0900-\u097f\d]+)))\s*(?:लाख|lakh|lac|lacs|lakhs|लाखांचे|l)/i
  const fractionMatch = normalized.match(fractionLakhRegex)
  if (fractionMatch) {
    let multiplierVal = 1
    if (fractionMatch[1]) {
      multiplierVal = 1.5
    } else if (fractionMatch[2]) {
      multiplierVal = 2.5
    } else if (fractionMatch[3] && fractionMatch[4]) {
      const baseWord = fractionMatch[4].trim()
      const baseNum = WORD_NUMBER_MAP[baseWord] || parseFloat(baseWord) || 0
      multiplierVal = baseNum + 0.5
    } else if (fractionMatch[5] && fractionMatch[6]) {
      const baseWord = fractionMatch[6].trim()
      const baseNum = WORD_NUMBER_MAP[baseWord] || parseFloat(baseWord) || 1
      multiplierVal = Math.max(0, baseNum - 0.25)
    } else if (fractionMatch[7] && fractionMatch[8]) {
      const baseWord = fractionMatch[8].trim()
      const baseNum = WORD_NUMBER_MAP[baseWord] || parseFloat(baseWord) || 1
      multiplierVal = baseNum + 0.25
    }

    if (multiplierVal > 0) {
      return {
        amount: Math.round(multiplierVal * 100000),
        matchedText: fractionMatch[0],
      }
    }
  }

  const numberWordToVal = (val?: string): number => {
    if (!val) return 0
    const clean = val.trim()
    if (!clean) return 0
    if (/^\d+(?:\.\d+)?$/.test(clean)) {
      return parseFloat(clean)
    }
    return WORD_NUMBER_MAP[clean] ?? 0
  }

  // 2. Formatted currency numbers e.g. "₹ 3,00,000", "Rs 50000", "150000", "₹50,000"
  const explicitNumberPattern =
    /(?:rs\.?|inr|₹|रुपये|रुपया|रु\.?)\s*(\d{1,3}(?:,\d{2,3})+|\d{4,9})|(\d{1,3}(?:,\d{2,3})+|\d{5,9})\s*(?:रुपये|रुपया|rupees|rs)?/gi
  let numMatch: RegExpExecArray | null
  while ((numMatch = explicitNumberPattern.exec(normalized)) !== null) {
    const rawVal = (numMatch[1] || numMatch[2] || "").replace(/,/g, "")
    if (rawVal) {
      const num = parseInt(rawVal, 10)
      if (num >= 5000) {
        return {
          amount: num,
          matchedText: numMatch[0].trim(),
        }
      }
    }
  }

  // 3. Multiplier expressions: e.g. "1.5 lakh", "1 lakh 50 hazar", "2.5 लाख", "50 hazar", "4 lakh", "50k"
  const multiUnitsPattern =
    /(?:(\d+(?:\.\d+)?|[a-z\u0900-\u097f]+)\s*(?:करोड़|करोड|crore|cr|कोटी))(?:\s*(?:और|and|व)?\s*(?:(\d+(?:\.\d+)?|[a-z\u0900-\u097f]+)\s*(?:लाख|lakh|lac|lacs|lakhs|लाखांचे|l)))?(?:\s*(?:और|and|व)?\s*(?:(\d+(?:\.\d+)?|[a-z\u0900-\u097f]+)\s*(?:हजार|हज़ार|hazar|hazaar|thousand|k|हजारांचे)))?|(?:(\d+(?:\.\d+)?|[a-z\u0900-\u097f]+)\s*(?:लाख|lakh|lac|lacs|lakhs|लाखांचे|l))(?:\s*(?:और|and|व)?\s*(?:(\d+(?:\.\d+)?|[a-z\u0900-\u097f]+)\s*(?:हजार|हज़ार|hazar|hazaar|thousand|k|हजारांचे)))?|(?:(\d+(?:\.\d+)?|[a-z\u0900-\u097f]+)\s*(?:हजार|हज़ार|hazar|hazaar|thousand|k|हजारांचे))/gi

  let m: RegExpExecArray | null
  while ((m = multiUnitsPattern.exec(normalized)) !== null) {
    const matchStr = m[0].trim()
    if (!matchStr) continue

    // Check crore branch (groups 1, 2, 3)
    if (m[1]) {
      const cr = numberWordToVal(m[1])
      const lk = numberWordToVal(m[2])
      const hz = numberWordToVal(m[3])
      const total = cr * 10000000 + lk * 100000 + hz * 1000
      if (total >= 1000) return { amount: Math.round(total), matchedText: matchStr }
    }

    // Check lakh branch (groups 4, 5)
    if (m[4]) {
      const lk = numberWordToVal(m[4])
      const hz = numberWordToVal(m[5])
      const total = lk * 100000 + hz * 1000
      if (total >= 1000) return { amount: Math.round(total), matchedText: matchStr }
    }

    // Check hazar branch (group 6)
    if (m[6]) {
      const hz = numberWordToVal(m[6])
      const total = hz * 1000
      if (total >= 1000) return { amount: Math.round(total), matchedText: matchStr }
    }
  }

  return null
}

// Purpose keyword mappings
const PURPOSE_MAPPINGS: Array<{
  id: string
  keywords: string[]
}> = [
  {
    id: "shop",
    keywords: [
      "shop",
      "store",
      "dukan",
      "dookan",
      "kirana",
      "grocery",
      "retail",
      "provision",
      "general store",
      "mart",
      "footwear",
      "stationery",
      "दुकान",
      "किराना",
      "परचून",
      "स्टोर",
      "जनरल स्टोर",
      "भाजीपाला",
      "व्यापार",
      "किराणा",
      "स्टोअर",
      "विक्री",
    ],
  },
  {
    id: "service",
    keywords: [
      "service",
      "auto",
      "rickshaw",
      "e-rickshaw",
      "erickshaw",
      "cab",
      "taxi",
      "driver",
      "transport",
      "garage",
      "repair",
      "mechanic",
      "electrician",
      "plumber",
      "salon",
      "parlour",
      "beauty parlour",
      "courier",
      "laundry",
      "सेवा",
      "सर्विस",
      "ऑटो",
      "रिक्शा",
      "ई-रिक्शा",
      "टैक्सी",
      "ड्राइवर",
      "चालक",
      "गैराज",
      "मरम्मत",
      "मैकेनिक",
      "प्लंबर",
      "सैलून",
      "ब्यूटी पार्लर",
      "रिक्षा",
      "गॅरेज",
      "दुरुस्ती",
      "मेकॅनिक",
      "सलून",
      "ब्युटी पार्लर",
    ],
  },
  {
    id: "manufacturing",
    keywords: [
      "manufacturing",
      "production",
      "industry",
      "factory",
      "silai",
      "tailor",
      "tailoring",
      "garment",
      "textile",
      "weaving",
      "stitching",
      "bakery",
      "packaging",
      "fabrication",
      "food processing",
      "सिलाई",
      "टेलर",
      "कारखाना",
      "उद्योग",
      "उत्पादन",
      "विनिर्माण",
      "बेकरी",
      "पैकेजिंग",
      "खाद्य",
      "मॅन्युफॅक्चरिंग",
      "शिवणकाम",
      "शिंपी",
      "कापड उद्योग",
      "प्रक्रिया",
    ],
  },
  {
    id: "agri",
    keywords: [
      "agriculture",
      "agri",
      "farming",
      "farm",
      "kheti",
      "krishi",
      "farmer",
      "tractor",
      "dairy",
      "milk",
      "buffalo",
      "cow",
      "poultry",
      "goat",
      "fishery",
      "horticulture",
      "crop",
      "खेती",
      "कृषि",
      "किसान",
      "ट्रैक्टर",
      "डेयरी",
      "पशुपालन",
      "गाय",
      "भैंस",
      "दूध",
      "मुर्गी",
      "बकरी",
      "मत्स्य",
      "शेती",
      "कृषी",
      "शेतकरी",
      "दुग्धव्यवसाय",
      "डेअरी",
      "म्हैस",
      "कुक्कुटपालन",
      "शेळीपालन",
    ],
  },
  {
    id: "higher_education",
    keywords: [
      "education",
      "study",
      "higher education",
      "college",
      "university",
      "degree",
      "course",
      "btech",
      "mtech",
      "bba",
      "mba",
      "mbbs",
      "bds",
      "engineering",
      "medical",
      "fees",
      "tuition",
      "abroad",
      "overseas",
      "scholarship",
      "padhai",
      "shiksha",
      "student",
      "videsh",
      "शिक्षा",
      "पढ़ाई",
      "उच्च शिक्षा",
      "कॉलेज",
      "विश्वविद्यालय",
      "डिग्री",
      "बीटेक",
      "एमटेक",
      "इंजीनियरिंग",
      "एमबीबीएस",
      "एमबीए",
      "विदेश",
      "फीस",
      "शिक्षण",
      "उच्च शिक्षण",
      "अभ्यास",
      "महाविद्यालय",
      "विद्यापीठ",
      "पदवी",
      "इंजिनिअरिंग",
      "परदेशी",
    ],
  },
  {
    id: "sanitation",
    keywords: [
      "sanitation",
      "safai",
      "cleanliness",
      "hygiene",
      "waste",
      "garbage",
      "toilet",
      "septic",
      "sewer",
      "drain",
      "cleaning",
      "स्वच्छता",
      "सफाई",
      "कचरा",
      "शौचालय",
      "सीवर",
      "नाली",
      "सांडपाणी",
    ],
  },
  {
    id: "artisan",
    keywords: [
      "artisan",
      "handicraft",
      "craft",
      "pottery",
      "potter",
      "weaver",
      "handloom",
      "sculptor",
      "sculpture",
      "carpenter",
      "blacksmith",
      "goldsmith",
      "embroidery",
      "karigar",
      "hastshilp",
      "kumhar",
      "vunkar",
      "murtikar",
      "हस्तशिल्प",
      "कारीगर",
      "शिल्पकार",
      "कुम्हार",
      "बुनकर",
      "हथकरघा",
      "मूर्तिकार",
      "बढ़ई",
      "लोहार",
      "सुनार",
      "हस्तकला",
      "कारागीर",
      "विणकर",
      "हातमाग",
      "सुतार",
      "सोनार",
      "कुंभार",
    ],
  },
]

// State recognition mappings
const STATE_SYNONYMS: Record<string, string[]> = {
  "Uttar Pradesh": ["uttar pradesh", "up", "यूपी", "उत्तर प्रदेश", "उत्तरप्रदेश"],
  Maharashtra: ["maharashtra", "mh", "महाराष्ट्र", "महाराष्ट्र"],
  Bihar: ["bihar", "बिहार"],
  "Madhya Pradesh": ["madhya pradesh", "mp", "एमपी", "मध्य प्रदेश", "मध्यप्रदेश"],
  Rajasthan: ["rajasthan", "राजस्थान", "राजपुताना"],
  Gujarat: ["gujarat", "गुजरात"],
  Delhi: ["delhi", "new delhi", "dilli", "दिल्ली", "नई दिल्ली"],
  Punjab: ["punjab", "पंजाब"],
  Haryana: ["haryana", "हरियाणा"],
  Jharkhand: ["jharkhand", "झारखंड", "झारखण्ड"],
  "West Bengal": ["west bengal", "bengal", "पश्चिम बंगाल", "बंगाल"],
  Karnataka: ["karnataka", "कर्नाटक"],
  "Tamil Nadu": ["tamil nadu", "tamilnadu", "तमिलनाडु", "तामिळनाडू"],
  Telangana: ["telangana", "तेलंगाना"],
  "Andhra Pradesh": ["andhra pradesh", "andhra", "ap", "आंध्र प्रदेश", "आंध्रप्रदेश"],
  Odisha: ["odisha", "orissa", "ओडिशा", "उड़ीसा"],
  Assam: ["assam", "असम", "आसाम"],
  Chhattisgarh: ["chhattisgarh", "छत्तीसगढ़", "छत्तीसगड"],
  Goa: ["goa", "गोवा"],
  "Himachal Pradesh": ["himachal pradesh", "himachal", "हिमाचल प्रदेश", "हिमाचल"],
  Kerala: ["kerala", "केरल", "केरळ"],
  Uttarakhand: ["uttarakhand", "uttaranchal", "उत्तराखंड", "उत्तरांचल"],
}

/**
 * Extract structured demographic, loan, and business parameters from raw multilingual voice transcripts.
 */
export function extractVoiceEntities(rawTranscript: string): ExtractedVoiceEntities {
  const clean = normalizeDevanagariDigits((rawTranscript || "").trim())
  const lower = clean.toLowerCase()

  const result: ExtractedVoiceEntities = {
    rawTranscript,
    confidence: {
      projectType: 0,
      estimatedCost: 0,
      state: 0,
      category: 0,
      gender: 0,
      age: 0,
      annualFamilyIncome: 0,
      educationStatus: 0,
    },
    matchedKeywords: {},
  }

  if (!clean) {
    return result
  }

  // 1. Purpose / Project Type Extraction
  for (const item of PURPOSE_MAPPINGS) {
    for (const kw of item.keywords) {
      const kwLower = kw.toLowerCase()
      // Match word boundaries or substring in devanagari
      const regex = new RegExp(`(?:^|\\s|[.,!?])${kwLower}(?:$|\\s|[.,!?])`, "i")
      if (regex.test(lower) || lower.includes(kwLower)) {
        result.projectType = item.id
        result.confidence.projectType = 0.9
        result.matchedKeywords.projectType = kw
        break
      }
    }
    if (result.projectType) break
  }

  // 2. State Extraction
  for (const [stateName, synonyms] of Object.entries(STATE_SYNONYMS)) {
    for (const syn of synonyms) {
      const synLower = syn.toLowerCase()
      const regex = new RegExp(`(?:^|\\s|[.,!?])${synLower}(?:$|\\s|[.,!?])`, "i")
      if (regex.test(lower) || lower.includes(synLower)) {
        // Verify state is in canonical STATES list
        const matchedState = STATES.find(
          (s) => s.toLowerCase() === stateName.toLowerCase(),
        )
        if (matchedState) {
          result.state = matchedState
          result.confidence.state = 0.95
          result.matchedKeywords.state = syn
          break
        }
      }
    }
    if (result.state) break
  }

  // 3. Category Extraction
  const scKeywords = [
    "sc",
    "scheduled caste",
    "schedule caste",
    "dalit",
    "अनुसूचित जाति",
    "अनुसूचित जाती",
    "दलित",
  ]
  const otherCatKeywords = [
    "general",
    "obc",
    "open category",
    "सामान्य",
    "अन्य",
    "इतर",
    "ओबीसी",
    "जनरल",
  ]

  for (const kw of scKeywords) {
    const regex = new RegExp(`(?:^|\\s|[.,!?])${kw}(?:$|\\s|[.,!?])`, "i")
    if (regex.test(lower) || lower.includes(kw)) {
      result.category = "sc"
      result.confidence.category = 0.9
      result.matchedKeywords.category = kw
      break
    }
  }

  if (!result.category) {
    for (const kw of otherCatKeywords) {
      const regex = new RegExp(`(?:^|\\s|[.,!?])${kw}(?:$|\\s|[.,!?])`, "i")
      if (regex.test(lower) || lower.includes(kw)) {
        result.category = "other"
        result.confidence.category = 0.85
        result.matchedKeywords.category = kw
        break
      }
    }
  }

  // 4. Gender Extraction
  const femaleKeywords = [
    "female",
    "woman",
    "women",
    "girl",
    "lady",
    "mahila",
    "aurat",
    "stree",
    "kanya",
    "महिला",
    "स्त्री",
    "औरत",
    "मुलगी",
  ]
  const maleKeywords = [
    "male",
    "man",
    "men",
    "boy",
    "purush",
    "aadmi",
    "पुरुष",
    "आदमी",
    "मुलगा",
  ]
  const transKeywords = [
    "transgender",
    "trans",
    "किन्नर",
    "तृतीयपंथी",
    "ट्रांसजेंडर",
  ]

  for (const kw of transKeywords) {
    if (lower.includes(kw)) {
      result.gender = "transgender"
      result.confidence.gender = 0.95
      result.matchedKeywords.gender = kw
      break
    }
  }

  if (!result.gender) {
    for (const kw of femaleKeywords) {
      if (lower.includes(kw)) {
        result.gender = "female"
        result.confidence.gender = 0.9
        result.matchedKeywords.gender = kw
        break
      }
    }
  }

  if (!result.gender) {
    for (const kw of maleKeywords) {
      if (lower.includes(kw)) {
        result.gender = "male"
        result.confidence.gender = 0.85
        result.matchedKeywords.gender = kw
        break
      }
    }
  }

  // 5. Age Extraction
  const ageRegex =
    /(?:(?:age|umra|umar|vay|उम्र|आयु|वय)\s*(?:is|hai|ahe|आहे|हो|है)?\s*(\d{2})|(\d{2})\s*(?:saal|sal|years|varsh|वर्ष|साल|years old))/i
  const ageMatch = lower.match(ageRegex)
  if (ageMatch) {
    const rawNum = parseInt(ageMatch[1] || ageMatch[2], 10)
    if (rawNum >= 18 && rawNum <= 100) {
      result.age = rawNum
      result.confidence.age = 0.9
      result.matchedKeywords.age = ageMatch[0]
    }
  }

  // 6. Annual Family Income vs Loan Amount Extraction
  // Look for specific income phrases first: e.g. "income 2 lakh", "aamdani 1.5 lakh", "वार्षिक आय 2 लाख"
  const incomePatt =
    /(?:(?:income|aamdani|kamai|utpann|वार्षिक आय|आय|आमदनी|उत्पन्न|कमाई)\s*(?:is|hai|ahe|हो|है|आहे)?\s*([^.,]+)|([^.,]+)\s*(?:income|aamdani|वार्षिक आय|उत्पन्न))/i
  const incomeMatch = lower.match(incomePatt)
  if (incomeMatch) {
    const incomePhrase = incomeMatch[1] || incomeMatch[2]
    const parsedIncome = parseIndianAmount(incomePhrase)
    if (parsedIncome && parsedIncome.amount > 0) {
      result.annualFamilyIncome = parsedIncome.amount
      result.confidence.annualFamilyIncome = 0.9
      result.matchedKeywords.annualFamilyIncome = parsedIncome.matchedText
    }
  }

  // Loan Amount / Project Cost extraction (excluding the part already parsed as income)
  let textForCost = lower
  if (result.matchedKeywords.annualFamilyIncome) {
    textForCost = textForCost.replace(
      result.matchedKeywords.annualFamilyIncome,
      "",
    )
  }

  const parsedCost = parseIndianAmount(textForCost)
  if (parsedCost && parsedCost.amount >= 10000) {
    result.estimatedCost = parsedCost.amount
    result.confidence.estimatedCost = 0.9
    result.matchedKeywords.estimatedCost = parsedCost.matchedText
  }

  // 7. Education Status Extraction
  const educationMap: Array<{ id: EducationStatus; keywords: string[] }> = [
    {
      id: "student",
      keywords: ["student", "studying", "छात्र", "विद्यार्थी", "शिकत आहे"],
    },
    {
      id: "graduate",
      keywords: [
        "graduate",
        "graduation",
        "bachelor",
        "btech",
        "bba",
        "ba",
        "bsc",
        "bcom",
        "पदवीधर",
        "ग्रेजुएट",
        "स्नातक",
      ],
    },
    {
      id: "postgraduate",
      keywords: [
        "postgraduate",
        "post graduate",
        "masters",
        "mtech",
        "mba",
        "msc",
        "mcom",
        "ma",
        "पोस्ट ग्रेजुएट",
        "परास्नातक",
        "पदव्युत्तर",
      ],
    },
    {
      id: "twelfth",
      keywords: [
        "12th",
        "twelfth",
        "12 pass",
        "barahvi",
        "बारावी",
        "12वीं",
        "12 वी",
        "hsc",
        "intermediate",
        "inter pass",
      ],
    },
    {
      id: "below_twelfth",
      keywords: [
        "10th",
        "tenth",
        "10 pass",
        "dasvi",
        "दहावी",
        "10वीं",
        "10 वी",
        "ssc",
        "below 12",
        "8th pass",
      ],
    },
  ]

  for (const edu of educationMap) {
    for (const kw of edu.keywords) {
      const isShortAscii = /^[a-z0-9\s]{1,4}$/i.test(kw)
      if (isShortAscii) {
        const regex = new RegExp(`(?:^|\\s|[.,!?])${kw}(?:$|\\s|[.,!?])`, "i")
        if (regex.test(lower)) {
          result.educationStatus = edu.id
          result.confidence.educationStatus = 0.85
          result.matchedKeywords.educationStatus = kw
          break
        }
      } else if (lower.includes(kw)) {
        result.educationStatus = edu.id
        result.confidence.educationStatus = 0.85
        result.matchedKeywords.educationStatus = kw
        break
      }
    }
    if (result.educationStatus) break
  }

  return result
}
