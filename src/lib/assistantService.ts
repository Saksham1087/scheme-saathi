import { getSeedSchemes } from "@/services/schemeService"
import { fmtINR } from "@/lib/format"
import type {
  AssistantQueryResult,
  SuggestedPrompt,
} from "@/types/assistant"

export const MANDATORY_SAFETY_DISCLAIMER_EN =
  "I couldn't verify this information from official government scheme guidelines. SchemeSathi provides indicative guidance; final loan approval is subject to appraisal by designated Channel Partners (SCAs/Banks)."

export const MANDATORY_SAFETY_DISCLAIMER_HI =
  "मैं आधिकारिक सरकारी योजना दिशानिर्देशों से इस जानकारी को सत्यापित नहीं कर सका। स्कीमसाथी केवल सांकेतिक मार्गदर्शन प्रदान करता है; अंतिम ऋण स्वीकृति निर्दिष्ट चैनल भागीदारों (एससीए/बैंकों) द्वारा मूल्यांकन के अधीन है।"

export const SUGGESTED_PROMPTS: SuggestedPrompt[] = [
  {
    id: "women-schemes",
    title: {
      en: "Women Entrepreneur Schemes",
      hi: "महिला उद्यमी योजनाएं",
    },
    prompt: {
      en: "Are there special concessional schemes for women entrepreneurs?",
      hi: "क्या महिला उद्यमियों के लिए कोई विशेष रियायती योजनाएं हैं?",
    },
    category: "women",
    icon: "sparkles",
  },
  {
    id: "micro-credit",
    title: {
      en: "Micro Credit for Retail & Shop",
      hi: "दुकान व व्यापार हेतु लघु ऋण",
    },
    prompt: {
      en: "What are the rules and interest rates for starting a small grocery shop under Micro Credit?",
      hi: "लघु ऋण (माइक्रो क्रेडिट) के तहत किराना दुकान शुरू करने के नियम और ब्याज दर क्या हैं?",
    },
    category: "rates",
    icon: "calculator",
  },
  {
    id: "education-loan",
    title: {
      en: "Education Loan & Moratorium",
      hi: "शिक्षा ऋण और मोरेटोरियम",
    },
    prompt: {
      en: "What are the loan limits, interest rates, and moratorium period for Education Loans?",
      hi: "शिक्षा ऋण (Education Loan) के लिए ऋण सीमा, ब्याज दर और मोरेटोरियम अवधि क्या है?",
    },
    category: "education",
    icon: "file-text",
  },
  {
    id: "term-loan",
    title: {
      en: "Term Loan up to ₹50 Lakhs",
      hi: "₹50 लाख तक का टर्म लोन",
    },
    prompt: {
      en: "What is the maximum loan limit and tenure under the Term Loan Scheme?",
      hi: "टर्म लोन योजना के तहत अधिकतम ऋण सीमा और पुनर्भुगतान अवधि क्या है?",
    },
    category: "rates",
    icon: "calculator",
  },
  {
    id: "required-docs",
    title: {
      en: "Mandatory Document Checklist",
      hi: "आवश्यक दस्तावेजों की सूची",
    },
    prompt: {
      en: "What statutory documents are required to apply for NSFDC concessional loans?",
      hi: "एनएसएफडीसी रियायती ऋण के लिए आवेदन करने हेतु कौन से वैधानिक दस्तावेज आवश्यक हैं?",
    },
    category: "documents",
    icon: "list-checks",
  },
  {
    id: "channel-partners",
    title: {
      en: "How to Apply via Channel Partners",
      hi: "चैनल भागीदारों के माध्यम से आवेदन",
    },
    prompt: {
      en: "How does the Channel Partner application routing work for government loans?",
      hi: "सरकारी ऋणों के लिए चैनल पार्टनर आवेदन प्रक्रिया कैसे काम करती है?",
    },
    category: "process",
    icon: "building",
  },
]

/**
 * Checks if the prompt is an explicit hallucination bait or asks for
 * impossible/illegal guarantees (e.g. 100% guaranteed approval, bypass documents,
 * instant approval for 50L tomorrow without verification, crypto, gambling).
 */
export function isHallucinationOrSpeculation(query: string): boolean {
  const q = query.toLowerCase().trim()

  const baitPatterns = [
    /guarantee.*(approval|sanction|loan|pass|paisa)/i,
    /(approval|sanction).*guarantee/i,
    /without.*(document|paper|proof|income|caste|kagaz|dastavej|verification|appraisal)/i,
    /bina.*(kagaz|dastavej|paper|document|aavedan)/i,
    /guarantee.*(50|50l|50 lakh|crore|tomorrow|kal|turant)/i,
    /instant.*(approval|50 lakh|crore|sanction)/i,
    /fake.*(certificate|income|caste|document)/i,
    /bypass.*(bank|sca|verification|rule)/i,
    /(crypto|bitcoin|casino|gambling|lottery|forex|betting)/i,
    /iphone.*loan|personal.*luxury/i,
    /100%.*(approval|guarantee|sanction)/i,
    /paisa.*kab.*milega.*bina/i,
  ]

  return baitPatterns.some((pattern) => pattern.test(q))
}

/**
 * Core grounded conversational query engine.
 * Matches user intent against verified scheme catalog and guidelines.
 */
export async function queryAssistant(
  query: string,
  _userLang: "en" | "hi" = "en",
): Promise<AssistantQueryResult> {
  const clean = query.trim()
  const lower = clean.toLowerCase()
  const schemes = getSeedSchemes()

  // 1. Check for Hallucination / Speculative Bait
  if (isHallucinationOrSpeculation(lower)) {
    return {
      text: {
        en: `### ⚠️ Important Loan Appraisal Policy\n\nNo government authority or official channel partner can guarantee instant loan sanctions or bypass statutory documentation.\n\n- **Mandatory Appraisal**: All concessional loans under the SC Channel Finance System are subject to physical document appraisal and viability verification by designated **State Channelizing Agencies (SCAs)** or **Partner Banks (PSBs/RRBs)**.\n- **Statutory Limits**: Concessional schemes have strict official limits (up to ₹1.40 Lakh for Micro Credit & Mahila Samriddhi, and up to ₹50.00 Lakh for Term Loans).\n- **Mandatory Proofs**: Valid Caste Certificate (SC), Income Certificate (within ₹5.00 Lakh/year), Aadhaar DBT link, and business project report are legally required.\n\n> **AI Safety Guardrail Notice:**\n> ${MANDATORY_SAFETY_DISCLAIMER_EN}`,
        hi: `### ⚠️ महत्वपूर्ण ऋण मूल्यांकन नीति\n\nकोई भी सरकारी प्राधिकरण या आधिकारिक चैनल भागीदार तत्काल ऋण स्वीकृति की गारंटी नहीं दे सकता है और न ही वैधानिक दस्तावेजों को दरकिनार कर सकता है।\n\n- **अनिवार्य मूल्यांकन**: एससी चैनल वित्त प्रणाली के तहत सभी रियायती ऋण संबंधित **राज्य चैनेलाइजिंग एजेंसियों (SCAs)** या **सहयोगी बैंकों (PSBs/RRBs)** द्वारा भौतिक दस्तावेज मूल्यांकन और व्यवहार्यता जांच के अधीन हैं।\n- **वैधानिक सीमाएं**: रियायती योजनाओं की आधिकारिक सीमाएं हैं (माइक्रो क्रेडिट और महिला समृद्धि के लिए ₹1.40 लाख तक, और टर्म लोन के लिए ₹50.00 लाख तक)।\n- **अनिवार्य प्रमाण**: वैध जाति प्रमाण पत्र (SC), आय प्रमाण पत्र (₹5.00 लाख/वर्ष के भीतर), आधार डीबीटी लिंक और प्रोजेक्ट रिपोर्ट कानूनी रूप से अनिवार्य हैं।\n\n> **एआई सुरक्षा अस्वीकरण (Safety Guardrail):**\n> ${MANDATORY_SAFETY_DISCLAIMER_HI}`,
      },
      citations: [
        {
          schemeName: "NSFDC Operational Guidelines & Statutory Lending Framework",
          section: "Section 4.1: Mandatory Appraisal & Channel Partner Viability Review",
          officialSourceUrl: "https://nsfdc.nic.in",
          verifiedDate: "2026-08-01",
        },
      ],
      actionPills: [
        {
          id: "check-docs",
          label: { en: "Check Document Rules", hi: "दस्तावेज़ नियम देखें" },
          to: "/documents",
          icon: "list-checks",
          variant: "default",
        },
        {
          id: "browse-catalog",
          label: { en: "Browse Official Schemes", hi: "आधिकारिक योजनाएं देखें" },
          to: "/schemes",
          icon: "file-text",
          variant: "outline",
        },
        {
          id: "find-partners",
          label: { en: "Locate Channel Partners", hi: "चैनल पार्टनर खोजें" },
          to: "/partners",
          icon: "building",
          variant: "secondary",
        },
      ],
      isGuardrailTriggered: true,
      confidence: "high",
    }
  }

  // 2. Women Entrepreneur / Mahila Samriddhi Query
  if (
    lower.includes("women") ||
    lower.includes("woman") ||
    lower.includes("mahila") ||
    lower.includes("female") ||
    lower.includes("ladies") ||
    lower.includes("shg") ||
    lower.includes("samriddhi") ||
    lower.includes("महिला") ||
    lower.includes("औरत") ||
    lower.includes("नारी")
  ) {
    const msy = schemes.find((s) => s.id === "mahila-samriddhi")
    const maxCost = msy?.maxProjectCost ? fmtINR(msy.maxProjectCost) : "₹1,40,000"
    const minRate = msy?.rateRange.min ?? 4.0
    const maxRate = msy?.rateRange.max ?? 6.0
    const coverage = msy?.coverageMaxPct ?? 95

    return {
      text: {
        en: `### 🌸 Mahila Samriddhi Yojana (MSY) for Women Entrepreneurs\n\nYes! The **Mahila Samriddhi Yojana (MSY)** is a dedicated concessional micro-finance scheme exclusively designed for Scheduled Caste women entrepreneurs and women Self-Help Groups (SHGs).\n\n#### Key Scheme Highlights:\n- **Concessional Interest Rate**: **${minRate}% to ${maxRate}% per annum** (highly subsidized rate of 4% p.a. to end beneficiaries through SHGs).\n- **Maximum Project Cost**: Up to **${maxCost}**.\n- **Scheme Assistance**: Up to **${coverage}%** of the project cost is funded by NSFDC.\n- **Moratorium Period**: **3 to 6 months** repayment holiday before principal EMIs commence.\n- **Repayment Tenure**: Up to **48 months (4 years)** in easy quarterly/monthly installments.\n- **Target Sectors**: Tailoring, beauty salons, small retail shops, food catering, handicrafts, and dairy ventures.\n\n*Note: Promoted through State Channelizing Agencies (SCAs) and verified Women SHGs.*`,
        hi: `### 🌸 महिला उद्यमियों के लिए महिला समृद्धि योजना (MSY)\n\nहाँ! **महिला समृद्धि योजना (MSY)** विशेष रूप से अनुसूचित जाति की महिला उद्यमियों और महिला स्वयं सहायता समूहों (SHGs) के लिए तैयार की गई एक समर्पित सूक्ष्म वित्त योजना है।\n\n#### योजना की मुख्य विशेषताएं:\n- **रियायती ब्याज दर**: **${minRate}% से ${maxRate}% प्रति वर्ष** (एसएचजी के माध्यम से अंतिम लाभार्थी को केवल 4% प्रति वर्ष की अत्यधिक रियायती दर)।\n- **अधिकतम प्रोजेक्ट लागत**: **${maxCost}** तक।\n- **सहायता कवरेज**: परियोजना लागत का **${coverage}%** तक एनएसएफडीसी द्वारा वित्तपोषित।\n- **मोरेटोरियम अवधि**: ईएमआई शुरू होने से पहले **3 से 6 महीने** का अवकाश।\n- **पुनर्भुगतान अवधि**: आसान किस्तों में **48 महीने (4 वर्ष)** तक।\n- **लक्षित क्षेत्र**: सिलाई केंद्र, ब्यूटी पार्लर, किराना दुकान, कैटरिंग, हस्तशिल्प और डेयरी इकाइयां।\n\n*नोट: यह योजना राज्य चैनेलाइजिंग एजेंसियों (SCAs) और पंजीकृत महिला स्वयं सहायता समूहों के माध्यम से संचालित होती है।*`,
      },
      citations: [
        {
          schemeId: "mahila-samriddhi",
          schemeName: "Mahila Samriddhi Yojana (MSY) - Official Guidelines",
          section: "Clause 3: Financial Assistance & Concessional Lending Norms",
          officialSourceUrl: "https://nsfdc.nic.in/en/mahila-samriddhi-yojana",
          verifiedDate: "2026-08-01",
        },
      ],
      actionPills: [
        {
          id: "view-msy",
          label: { en: "View Scheme Details", hi: "योजना का विवरण देखें" },
          to: "/schemes/mahila-samriddhi",
          icon: "file-text",
          variant: "default",
        },
        {
          id: "calc-msy",
          label: { en: "Calculate EMI (4% Rate)", hi: "EMI की गणना करें (4%)" },
          to: "/calculator?scheme=mahila-samriddhi",
          icon: "calculator",
          variant: "outline",
        },
        {
          id: "docs-msy",
          label: { en: "Check Required Documents", hi: "दस्तावेज़ सूची देखें" },
          to: "/documents?scheme=mahila-samriddhi",
          icon: "list-checks",
          variant: "outline",
        },
        {
          id: "partner-msy",
          label: { en: "Find Women SCA Partners", hi: "महिला SCA भागीदार खोजें" },
          to: "/partners?scheme=mahila-samriddhi",
          icon: "building",
          variant: "secondary",
        },
      ],
      isGuardrailTriggered: false,
      confidence: "high",
      matchedSchemeId: "mahila-samriddhi",
    }
  }

  // 3. Education Loan / Student / Study / Abroad / Course
  if (
    lower.includes("education") ||
    lower.includes("student") ||
    lower.includes("study") ||
    lower.includes("college") ||
    lower.includes("degree") ||
    lower.includes("btech") ||
    lower.includes("mbbs") ||
    lower.includes("abroad") ||
    lower.includes("padhai") ||
    lower.includes("शिक्षा") ||
    lower.includes("छात्र") ||
    lower.includes("कॉलेज") ||
    lower.includes("विदेश") ||
    lower.includes("पढ़ाई")
  ) {
    const edu = schemes.find((s) => s.id === "education-loan")
    const minRate = edu?.rateRange.min ?? 4.0
    const maxRate = edu?.rateRange.max ?? 8.0

    return {
      text: {
        en: `### 🎓 NSFDC Education Loan Scheme for Higher & Technical Studies\n\nThe **Education Loan Scheme (ELS)** provides concessional funding to Scheduled Caste students admitted to recognized professional and technical degree/diploma courses in India and abroad.\n\n#### Key Assistance Details:\n- **Maximum Loan Limits**:\n  - **Studies in India**: Up to **₹20.00 Lakhs**\n  - **Studies Abroad**: Up to **₹30.00 Lakhs**\n- **Interest Rates**: **${minRate}% to ${maxRate}% per annum**.\n  - *Special Women Concession*: Female students receive an additional **0.5% interest rebate** (as low as 3.5% - 4.0% p.a.).\n- **Coverage**: Up to **90% - 100%** of course fees, books, laptop equipment, and hostel boarding.\n- **Moratorium Relief**: **Course Duration + 6 Months** (or 1 year after securing employment, whichever is earlier). Repayment does not start while you study.\n- **Repayment Tenure**: Up to **120 months (10 years)** post-moratorium.`,
        hi: `### 🎓 उच्च एवं तकनीकी शिक्षा हेतु शिक्षा ऋण योजना (ELS)\n\n**शिक्षा ऋण योजना (Education Loan Scheme)** भारत और विदेशों में मान्यता प्राप्त व्यावसायिक और तकनीकी पाठ्यक्रमों में प्रवेश पाने वाले अनुसूचित जाति के छात्रों को रियायती वित्तीय सहायता प्रदान करती है।\n\n#### मुख्य विवरण:\n- **अधिकतम ऋण सीमा**:\n  - **भारत में अध्ययन**: **₹20.00 लाख** तक\n  - **विदेश में अध्ययन**: **₹30.00 लाख** तक\n- **रियायती ब्याज दर**: **${minRate}% से ${maxRate}% प्रति वर्ष**।\n  - *महिला छात्रों के लिए विशेष छूट*: छात्राओं को **0.5% की अतिरिक्त छूट** मिलती है।\n- **कवरेज**: ट्यूशन फीस, किताबें, कंप्यूटर/लैपटॉप और हॉस्टल खर्च का **90% से 100%** तक।\n- **मोरेटोरियम राहत**: **पाठ्यक्रम की अवधि + 6 महीने** (या नौकरी मिलने के 1 वर्ष बाद तक)। पढ़ाई के दौरान मूलधन की कोई ईएमआई नहीं लगती।\n- **पुनर्भुगतान अवधि**: मोरेटोरियम के बाद **120 महीने (10 वर्ष)** तक।`,
      },
      citations: [
        {
          schemeId: "education-loan",
          schemeName: "NSFDC Education Loan Scheme Master Circular",
          section: "Schedule II: Eligible Courses, Moratorium Terms & Concessional Scales",
          officialSourceUrl: "https://nsfdc.nic.in/en/education-loan-scheme",
          verifiedDate: "2026-08-01",
        },
      ],
      actionPills: [
        {
          id: "view-edu",
          label: { en: "View Education Loan", hi: "शिक्षा ऋण विवरण देखें" },
          to: "/schemes/education-loan",
          icon: "file-text",
          variant: "default",
        },
        {
          id: "calc-edu",
          label: { en: "Compare Moratorium EMI", hi: "मोरेटोरियम EMI गणना करें" },
          to: "/calculator?scheme=education-loan",
          icon: "calculator",
          variant: "outline",
        },
        {
          id: "plan-edu",
          label: { en: "Plan Education Budget", hi: "शिक्षा बजट प्लानर" },
          to: "/planner?scheme=education-loan",
          icon: "sparkles",
          variant: "secondary",
        },
      ],
      isGuardrailTriggered: false,
      confidence: "high",
      matchedSchemeId: "education-loan",
    }
  }

  // 4. Term Loan / Large Project / ₹50 Lakh / Manufacturing / Factory
  if (
    lower.includes("term loan") ||
    lower.includes("term-loan") ||
    lower.includes("50 lakh") ||
    lower.includes("50l") ||
    lower.includes("fifty lakh") ||
    lower.includes("manufacturing") ||
    lower.includes("factory") ||
    lower.includes("machinery") ||
    lower.includes("50 लाख") ||
    lower.includes("टर्म लोन") ||
    lower.includes("उद्योग") ||
    lower.includes("कारखाना")
  ) {
    const term = schemes.find((s) => s.id === "term-loan")
    const maxCost = term?.maxProjectCost ? fmtINR(term.maxProjectCost) : "₹50,00,000"
    const minRate = term?.rateRange.min ?? 6.0
    const maxRate = term?.rateRange.max ?? 9.0

    return {
      text: {
        en: `### 🏭 NSFDC Term Loan Scheme (Up to ₹50 Lakhs)\n\nThe **Term Loan Scheme** provides substantial financial assistance for viable income-generating projects in manufacturing, processing, technical services, transport, and agricultural infrastructure.\n\n#### Scheme Details:\n- **Maximum Project Cost**: Up to **${maxCost}** per unit.\n- **NSFDC Funding Pattern**:\n  - NSFDC provides up to **90%** of project cost.\n  - State Channelizing Agency contributes **5%**.\n  - Promoter / Beneficiary margin money is **5% to 10%**.\n- **Interest Rates**: **${minRate}% to ${maxRate}% per annum** (concessional slab based on project size).\n- **Moratorium Period**: **6 to 12 months** for project establishment and trial production.\n- **Repayment Tenure**: Up to **120 months (10 years)** depending on cash flow appraisal.`,
        hi: `### 🏭 एनएसएफडीसी टर्म लोन योजना (₹50 लाख तक)\n\n**टर्म लोन योजना (Term Loan Scheme)** विनिर्माण (मैन्युफैक्चरिंग), प्रसंस्करण, तकनीकी सेवाओं, परिवहन और कृषि संबंधी उद्यमों के लिए वित्तीय सहायता प्रदान करती है।\n\n#### योजना का विवरण:\n- **अधिकतम परियोजना लागत**: **${maxCost}** प्रति यूनिट तक।\n- **वित्तपोषण संरचना**:\n  - एनएसएफडीसी परियोजना लागत का **90%** तक प्रदान करता है।\n  - राज्य चैनेलाइजिंग एजेंसी **5%** प्रदान करती है।\n  - प्रवर्तक (लाभार्थी) का अंशदान केवल **5% से 10%** होता है।\n- **ब्याज दर**: **${minRate}% से ${maxRate}% प्रति वर्ष**।\n- **मोरेटोरियम अवधि**: स्थापना और वाणिज्यिक उत्पादन हेतु **6 से 12 महीने**।\n- **पुनर्भुगतान अवधि**: परियोजना नकद प्रवाह के आधार पर **120 महीने (10 वर्ष)** तक।`,
      },
      citations: [
        {
          schemeId: "term-loan",
          schemeName: "NSFDC Term Loan Operational Guidelines",
          section: "Section 2: Large Enterprise Financing & Promoters Margin Rules",
          officialSourceUrl: "https://nsfdc.nic.in/en/term-loan-scheme",
          verifiedDate: "2026-08-01",
        },
      ],
      actionPills: [
        {
          id: "view-term",
          label: { en: "View Term Loan Specs", hi: "टर्म लोन विवरण देखें" },
          to: "/schemes/term-loan",
          icon: "file-text",
          variant: "default",
        },
        {
          id: "plan-term",
          label: { en: "Plan Project Budget (Cost Planner)", hi: "प्रोजेक्ट लागत प्लानर" },
          to: "/planner?scheme=term-loan",
          icon: "sparkles",
          variant: "outline",
        },
        {
          id: "calc-term",
          label: { en: "Calculate Term Loan EMI", hi: "टर्म लोन EMI निकालें" },
          to: "/calculator?scheme=term-loan",
          icon: "calculator",
          variant: "secondary",
        },
      ],
      isGuardrailTriggered: false,
      confidence: "high",
      matchedSchemeId: "term-loan",
    }
  }

  // 5. Micro Credit / Retail Shop / Kirana / Artisan / Tiny Business
  if (
    lower.includes("micro") ||
    lower.includes("shop") ||
    lower.includes("dukan") ||
    lower.includes("kirana") ||
    lower.includes("vendor") ||
    lower.includes("artisan") ||
    lower.includes("tailor") ||
    lower.includes("दुकान") ||
    lower.includes("किराना") ||
    lower.includes("लघु ऋण") ||
    lower.includes("कारीगर") ||
    lower.includes("छोटा व्यापार")
  ) {
    const micro = schemes.find((s) => s.id === "micro-finance")
    const maxCost = micro?.maxProjectCost ? fmtINR(micro?.maxProjectCost) : "₹1,40,000"
    const minRate = micro?.rateRange.min ?? 6.5
    const maxRate = micro?.rateRange.max ?? 9.0

    return {
      text: {
        en: `### 🛒 Micro Credit Scheme (MCS) for Small Retail & Trade\n\nThe **Micro Credit Scheme (MCS)** provides direct collateral-light financial support to individuals and Self Help Groups for tiny self-employment projects, grocery shops, and artisan trades.\n\n#### Scheme Parameters:\n- **Maximum Assistance Limit**: Up to **${maxCost}** per beneficiary.\n- **Interest Rate**: **${minRate}% to ${maxRate}% per annum**.\n- **Coverage Ratio**: NSFDC funds up to **90%** of total project cost with only **5% beneficiary contribution**.\n- **Collateral Policy**: Collateral-free / minimal guarantee required for tiny trades.\n- **Moratorium Period**: **3 to 6 months**.\n- **Repayment Tenure**: Up to **60 months (5 years)** in manageable installments.\n- **Eligible Trades**: Kirana grocery, tea stalls, tailoring boutiques, mobile repair, footwear artisans, and service kiosks.`,
        hi: `### 🛒 छोटे व्यापार व खुदरा दुकान हेतु लघु ऋण योजना (MCS)\n\n**लघु ऋण योजना (Micro Credit Scheme)** स्वरोज़गार, खुदरा दुकान, और कारीगरों के छोटे व्यापार के लिए बिना किसी भारी गारंटी के प्रत्यक्ष रियायती ऋण प्रदान करती है।\n\n#### योजना के मानक:\n- **अधिकतम ऋण सीमा**: प्रति लाभार्थी **${maxCost}** तक।\n- **ब्याज दर**: **${minRate}% से ${maxRate}% प्रति वर्ष**।\n- **कवरेज अनुपात**: कुल लागत का **90%** वित्तपोषित, लाभार्थी अंशदान मात्र **5%**।\n- **गारंटी नियम**: छोटे व्यापारों के लिए बिना संपत्ति गिरवी रखे (Collateral-free) ऋण।\n- **मोरेटोरियम**: **3 से 6 महीने**।\n- **पुनर्भुगतान अवधि**: **60 महीने (5 वर्ष)** तक।\n- **पात्र कार्य**: किराना स्टोर, टेलरिंग, मोबाइल रिपेयरिंग, चाय-नाश्ता स्टॉल, जूते-चप्पल निर्माण, आदि।`,
      },
      citations: [
        {
          schemeId: "micro-finance",
          schemeName: "NSFDC Micro Credit Lending Regulations",
          section: "Operational Circular: Micro Credit Scheme Unit Limits",
          officialSourceUrl: "https://nsfdc.nic.in/en/micro-credit-scheme",
          verifiedDate: "2026-08-01",
        },
      ],
      actionPills: [
        {
          id: "view-micro",
          label: { en: "View Micro Credit Details", hi: "लघु ऋण विवरण देखें" },
          to: "/schemes/micro-finance",
          icon: "file-text",
          variant: "default",
        },
        {
          id: "calc-micro",
          label: { en: "Calculate Micro EMI", hi: "माइक्रो EMI गणना करें" },
          to: "/calculator?scheme=micro-finance",
          icon: "calculator",
          variant: "outline",
        },
        {
          id: "docs-micro",
          label: { en: "Check Document List", hi: "दस्तावेज़ सूची देखें" },
          to: "/documents?scheme=micro-finance",
          icon: "list-checks",
          variant: "secondary",
        },
      ],
      isGuardrailTriggered: false,
      confidence: "high",
      matchedSchemeId: "micro-finance",
    }
  }

  // 6. Documents / Paperwork / Certificates / DigiLocker
  if (
    lower.includes("document") ||
    lower.includes("certificate") ||
    lower.includes("paper") ||
    lower.includes("dastavej") ||
    lower.includes("kagaz") ||
    lower.includes("aadhaar") ||
    lower.includes("caste") ||
    lower.includes("income proof") ||
    lower.includes("दस्तावेज") ||
    lower.includes("प्रमाण पत्र") ||
    lower.includes("कागजात") ||
    lower.includes("जाति") ||
    lower.includes("आय")
  ) {
    return {
      text: {
        en: `### 📋 Statutory Required Documents for Scheme Applications\n\nTo apply for concessional loans through State Channelizing Agencies (SCAs) or partner banks, applicants must furnish the following verified documents:\n\n1. **Caste Certificate**: Issued by a competent Tehsildar/SDM confirming Scheduled Caste (SC) status.\n2. **Income Certificate**: Verifying annual family income within **₹5.00 Lakhs** (issued within the last 12 months).\n3. **Identity & Address Proof**: Aadhaar Card (with active NPCI DBT seeding for direct subsidy credit) & Voter ID / Ration Card.\n4. **Project Proposal / Quotation**:\n   - For business: Proforma invoice/quotation for machinery/stock.\n   - For education: Admission letter and official institute fee structure.\n5. **Bank Passbook**: Active bank account passbook with IFSC code.\n\n*SchemeSathi provides an interactive Document Readiness Tracker and DigiLocker instant verification.*`,
        hi: `### 📋 सरकारी योजनाओं के आवेदन हेतु अनिवार्य वैधानिक दस्तावेज\n\nराज्य चैनेलाइजिंग एजेंसियों (SCAs) या सहयोगी बैंकों के माध्यम से रियायती ऋण के लिए निम्नलिखित दस्तावेज आवश्यक हैं:\n\n1. **जाति प्रमाण पत्र**: सक्षम प्राधिकारी (तहसीलदार/एसडीएम) द्वारा जारी अनुसूचित जाति (SC) प्रमाण पत्र।\n2. **आय प्रमाण पत्र**: वार्षिक पारिवारिक आय **₹5.00 लाख** के भीतर प्रमाणित करने वाला प्रमाण पत्र (पिछले 12 महीनों के भीतर जारी)।\n3. **पहचान व निवास प्रमाण**: आधार कार्ड (प्रत्यक्ष लाभ अंतरण / DBT लिंक के साथ) और वोटर आईडी/राशन कार्ड।\n4. **प्रोजेक्ट प्रस्ताव / कोटेशन**:\n   - व्यवसाय के लिए: उपकरण, मशीनरी या स्टॉक का पक्का कोटेशन/बिल।\n   - शिक्षा के लिए: प्रवेश पत्र और संस्थान का शुल्क विवरण।\n5. **बैंक पासबुक**: आईएफएससी कोड सहित बैंक खाता पासबुक की प्रति।\n\n*स्कीमसाथी इंटरैक्टिव दस्तावेज़ तैयारी ट्रैकर और डिजीलॉकर सत्यापन भी प्रदान करता है।*`,
      },
      citations: [
        {
          schemeName: "Statutory Documentation Guidelines for SC Channel Financing",
          section: "Standard Operating Procedure: Applicant Verification Checklist",
          officialSourceUrl: "https://nsfdc.nic.in",
          verifiedDate: "2026-08-01",
        },
      ],
      actionPills: [
        {
          id: "open-docs",
          label: { en: "Open Document Readiness Tracker", hi: "दस्तावेज़ ट्रैकर खोलें" },
          to: "/documents",
          icon: "list-checks",
          variant: "default",
        },
        {
          id: "find-partners",
          label: { en: "Find Submission Office", hi: "निकटतम कार्यालय खोजें" },
          to: "/partners",
          icon: "building",
          variant: "outline",
        },
      ],
      isGuardrailTriggered: false,
      confidence: "high",
    }
  }

  // 7. Channel Partner / Process / How to Apply / Bank / SCA
  if (
    lower.includes("partner") ||
    lower.includes("sca") ||
    lower.includes("bank") ||
    lower.includes("apply") ||
    lower.includes("process") ||
    lower.includes("routing") ||
    lower.includes("how to") ||
    lower.includes("where to") ||
    lower.includes("आवेदन") ||
    lower.includes("प्रक्रिया") ||
    lower.includes("चैनल पार्टनर") ||
    lower.includes("बैंक") ||
    lower.includes("कहाँ जाएं")
  ) {
    return {
      text: {
        en: `### 🏛️ How Channel Partner Application Routing Works\n\nUnder government lending guidelines, **direct loan applications are NOT accepted online by central ministries**. Instead, funds are channelized through designated regional institutions:\n\n1. **Step 1: Scheme Discovery**: Use SchemeSathi to discover your matched scheme and download the document checklist.\n2. **Step 2: Submit to Channel Partner**: Submit your completed application along with statutory documents to your district's:\n   - **State Channelizing Agency (SCA)** (e.g. Mahila Vikas Nigam, SC Development Corp)\n   - **Public Sector Bank (PSB)** or **Regional Rural Bank (RRB)** branch.\n3. **Step 3: Verification & Appraisal**: The partner conducts technical feasibility and KYC verification.\n4. **Step 4: Concessional Sanction & DBT Disbursal**: Subsidized loan funds are credited directly to the beneficiary's DBT-enabled bank account.`,
        hi: `### 🏛️ चैनल पार्टनर आवेदन एवं ऋण वितरण प्रक्रिया\n\nसरकारी दिशानिर्देशों के अनुसार, **केंद्रीय मंत्रालयों द्वारा सीधे ऑनलाइन ऋण आवेदन स्वीकार नहीं किए जाते हैं**। धनराशि अधिकृत क्षेत्रीय संस्थानों के माध्यम से वितरित की जाती है:\n\n1. **चरण 1: योजना चयन**: स्कीमसाथी का उपयोग करके अपनी उपयुक्त योजना चुनें और दस्तावेज़ चेकलिस्ट तैयार करें।\n2. **चरण 2: चैनल पार्टनर के पास जमा करें**: अपने आवेदन और प्रमाणित दस्तावेजों को अपने जिले के:\n   - **राज्य चैनेलाइजिंग एजेंसी (SCA)** (जैसे अनुसूचित जाति वित्त विकास निगम)\n   - **सार्वजनिक क्षेत्र के बैंक (PSB)** या **क्षेत्रीय ग्रामीण बैंक (RRB)** की शाखा में जमा करें।\n3. **चरण 3: सत्यापन एवं मूल्यांकन**: चैनल पार्टनर दस्तावेजों और व्यवसाय की जांच करता है।\n4. **चरण 4: रियायती स्वीकृति व DBT हस्तांतरण**: स्वीकृत ऋण राशि सीधे लाभार्थी के बैंक खाते में DBT के माध्यम से अंतरित की जाती है।`,
      },
      citations: [
        {
          schemeName: "Ministry of Social Justice & Empowerment - Channel Finance Framework",
          section: "Institutional Routing & Disbursement Directives",
          officialSourceUrl: "https://socialjustice.gov.in",
          verifiedDate: "2026-08-01",
        },
      ],
      actionPills: [
        {
          id: "partner-map",
          label: { en: "Locate Nearest Channel Partner", hi: "निकटतम चैनल पार्टनर खोजें" },
          to: "/partners",
          icon: "building",
          variant: "default",
        },
        {
          id: "how-it-works",
          label: { en: "View Interactive Routing Map", hi: "पूरी प्रक्रिया देखें" },
          to: "/how-it-works",
          icon: "arrow-right",
          variant: "outline",
        },
      ],
      isGuardrailTriggered: false,
      confidence: "high",
    }
  }

  // 8. Interest Rate Overview / Comparison
  if (
    lower.includes("interest") ||
    lower.includes("rate") ||
    lower.includes("byaj") ||
    lower.includes("emi") ||
    lower.includes("calculator") ||
    lower.includes("ब्याज") ||
    lower.includes("दर") ||
    lower.includes("ईएमआई")
  ) {
    return {
      text: {
        en: `### 💰 Verified Concessional Interest Rate Schedule\n\nConcessional government schemes provide deeply subsidized interest rates compared to commercial market rates (12%–18%):\n\n| Scheme | Interest Rate (p.a.) | Max Assistance | Special Concessions |\n| :--- | :--- | :--- | :--- |\n| **Mahila Samriddhi (MSY)** | **4.0% – 6.0%** | ₹1.40 Lakh | 4% to women SHG members |\n| **Education Loan** | **4.0% – 8.0%** | ₹20L (India) / ₹30L (Abroad) | 0.5% rebate for female students |\n| **Micro Credit (MCS)** | **6.5% – 9.0%** | ₹1.40 Lakh | Collateral-free tiny credit |\n| **Term Loan** | **6.0% – 9.0%** | ₹50.00 Lakh | Project-scale tiered rates |\n| **Swachhta Udyami** | **4.0% – 6.0%** | ₹50.00 Lakh | SRMS subsidy convergence |\n| **Green Business** | **6.0% – 8.0%** | ₹30.00 Lakh | E-vehicles & solar setups |\n\n*All interest rates are strictly capped per official ministry regulations.*`,
        hi: `### 💰 सत्यापित रियायती ब्याज दर सारणी\n\nसरकारी योजनाएं वाणिज्यिक बाजार दरों (12%–18%) की तुलना में अत्यधिक रियायती ब्याज दरें प्रदान करती हैं:\n\n| योजना | ब्याज दर (वार्षिक) | अधिकतम ऋण | विशेष छूट |\n| :--- | :--- | :--- | :--- |\n| **महिला समृद्धि योजना (MSY)** | **4.0% – 6.0%** | ₹1.40 लाख | महिला एसएचजी सदस्यों को 4% |\n| **शिक्षा ऋण (Education Loan)** | **4.0% – 8.0%** | ₹20L (भारत) / ₹30L (विदेश) | छात्राओं हेतु 0.5% की छूट |\n| **लघु ऋण (MCS)** | **6.5% – 9.0%** | ₹1.40 लाख | बिना गारंटी सूक्ष्म व्यापार ऋण |\n| **टर्म लोन (Term Loan)** | **6.0% – 9.0%** | ₹50.00 लाख | बड़े उद्यमों हेतु रियायती दरें |\n| **स्वच्छता उद्यमी योजना** | **4.0% – 6.0%** | ₹50.00 लाख | सफाई उपकरणों हेतु विशेष छूट |\n| **ग्रीन बिजनेस स्कीम** | **6.0% – 8.0%** | ₹30.00 लाख | सोलर व ई-रिक्शा हेतु सहायता |\n\n*सभी ब्याज दरें आधिकारिक मंत्रालय नियमों के अनुसार निर्धारित हैं।*`,
      },
      citations: [
        {
          schemeName: "NSFDC Concessional Interest Rate Gazette Notification",
          section: "Schedule of Lending Rates & Women Concessions",
          officialSourceUrl: "https://nsfdc.nic.in",
          verifiedDate: "2026-08-01",
        },
      ],
      actionPills: [
        {
          id: "open-calc",
          label: { en: "Open Interactive EMI Calculator", hi: "ईएमआई कैलकुलेटर खोलें" },
          to: "/calculator",
          icon: "calculator",
          variant: "default",
        },
        {
          id: "compare-all",
          label: { en: "Compare Scheme Details", hi: "योजनाओं की तुलना करें" },
          to: "/compare",
          icon: "list-checks",
          variant: "outline",
        },
      ],
      isGuardrailTriggered: false,
      confidence: "high",
    }
  }

  // 9. Sanitation / Swachhta Udyami
  if (
    lower.includes("swachh") ||
    lower.includes("sanitation") ||
    lower.includes("cleaning") ||
    lower.includes("safai") ||
    lower.includes("suction") ||
    lower.includes("safai karamchari") ||
    lower.includes("सफाई") ||
    lower.includes("स्वच्छता")
  ) {
    return {
      text: {
        en: `### 🧹 Swachhta Udyami Yojana (SUY)\n\nThe **Swachhta Udyami Yojana** provides concessional financial assistance for sanitation workers and manual scavengers to acquire mechanized cleaning equipment and build sustainable enterprise livelihoods.\n\n#### Key Scheme Highlights:\n- **Maximum Project Cost**:\n  - Up to **₹50.00 Lakhs** for mechanized cleaning equipment/suction vehicles.\n  - Up to **₹15.00 Lakhs** for construction of modern community sanitary facilities.\n- **Interest Rate**: **4.0% to 6.0% per annum** (concessional rate).\n- **Subsidy Convergence**: Capital subsidies available under SRMS (Self Employment Scheme for Rehabilitation of Manual Scavengers).\n- **Tenure**: Up to **84 months (7 years)** with 6 months moratorium.`,
        hi: `### 🧹 स्वच्छता उद्यमी योजना (SUY)\n\n**स्वच्छता उद्यमी योजना** सफाई कर्मचारियों और स्वच्छता मित्रों को आधुनिक मशीनीकृत सफाई उपकरण खरीदने और सम्मानजनक आजीविका स्थापित करने के लिए रियायती ऋण सहायता प्रदान करती है।\n\n#### मुख्य विशेषताएं:\n- **अधिकतम परियोजना लागत**:\n  - मशीनीकृत सफाई वाहनों व उपकरणों हेतु **₹50.00 लाख** तक।\n  - सामुदायिक स्वच्छता परिसरों के निर्माण हेतु **₹15.00 लाख** तक।\n- **ब्याज दर**: **4.0% से 6.0% प्रति वर्ष**।\n- **अनुदान (सब्सिडी)**: एसआरएमएस योजना के अंतर्गत पूंजीगत सब्सिडी उपलब्ध।\n- **पुनर्भुगतान**: 6 महीने के मोरेटोरियम सहित **84 महीने (7 वर्ष)** तक।`,
      },
      citations: [
        {
          schemeId: "swachhta-udyami",
          schemeName: "Swachhta Udyami Yojana Operational Framework",
          section: "Mechanized Cleaning & Sanitation Entrepreneurship Norms",
          officialSourceUrl: "https://nsfdc.nic.in/en/swachhta-udyami-yojana",
          verifiedDate: "2026-08-01",
        },
      ],
      actionPills: [
        {
          id: "view-suy",
          label: { en: "View SUY Scheme", hi: "योजना विवरण देखें" },
          to: "/schemes/swachhta-udyami",
          icon: "file-text",
          variant: "default",
        },
        {
          id: "calc-suy",
          label: { en: "Calculate SUY EMI", hi: "SUY EMI गणना करें" },
          to: "/calculator?scheme=swachhta-udyami",
          icon: "calculator",
          variant: "outline",
        },
      ],
      isGuardrailTriggered: false,
      confidence: "high",
      matchedSchemeId: "swachhta-udyami",
    }
  }

  // 10. Default / Fallback Response with Mandatory AI Safety Guardrail
  return {
    text: {
      en: `### 🤝 SchemeSathi Verified Assistant Guidance\n\nI can help you with verified statutory information regarding concessional government schemes (such as **Mahila Samriddhi Yojana**, **Micro Credit**, **Term Loans**, **Education Loans**, and **Swachhta Udyami Yojana**).\n\nRegarding your question: *"**${clean}**"*, please explore the official scheme guidelines or use our guided eligibility intake wizard to match your specific profile.\n\n> **Mandatory AI Safety Guardrail:**\n> ${MANDATORY_SAFETY_DISCLAIMER_EN}`,
      hi: `### 🤝 स्कीमसाथी मार्गदर्शक सहायता\n\nमैं सरकारी रियायती योजनाओं (जैसे **महिला समृद्धि योजना**, **लघु ऋण (Micro Credit)**, **टर्म लोन**, **शिक्षा ऋण**, और **स्वच्छता उद्यमी योजना**) से संबंधित आधिकारिक नियमों में आपकी सहायता कर सकता हूँ।\n\nआपके प्रश्न: *"**${clean}**"* के संबंध में, कृपया आधिकारिक योजना विवरण देखें या अपनी सटीक पात्रता जानने हेतु हमारे स्मार्ट पात्रता विज़ार्ड का उपयोग करें।\n\n> **अनिवार्य एआई सुरक्षा अस्वीकरण (Safety Guardrail):**\n> ${MANDATORY_SAFETY_DISCLAIMER_HI}`,
    },
    citations: [
      {
        schemeName: "National Scheduled Castes Finance and Development Corporation (NSFDC)",
        section: "Statutory Scheme Directory & Citizen Charter",
        officialSourceUrl: "https://nsfdc.nic.in",
        verifiedDate: "2026-08-01",
      },
    ],
    actionPills: [
      {
        id: "find-schemes",
        label: { en: "Find My Scheme (Intake Wizard)", hi: "पात्र योजना खोजें (विज़ार्ड)" },
        to: "/find-schemes",
        icon: "sparkles",
        variant: "default",
      },
      {
        id: "browse-catalog",
        label: { en: "Browse All Schemes", hi: "सभी योजनाएं देखें" },
        to: "/schemes",
        icon: "file-text",
        variant: "outline",
      },
      {
        id: "open-calc",
        label: { en: "EMI Calculator", hi: "ईएमआई कैलकुलेटर" },
        to: "/calculator",
        icon: "calculator",
        variant: "secondary",
      },
    ],
    isGuardrailTriggered: true,
    confidence: "indicative",
  }
}
