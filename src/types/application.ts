import type { LocalizedText, SchemeType } from "./index"

export type ApplicationStageKey =
  | "scheme_identified"
  | "eligibility_checked"
  | "docs_prepared"
  | "partner_selected"
  | "form_filled"
  | "submitted"
  | "under_review"
  | "sanction_decision"

export const APPLICATION_STAGE_KEYS: ApplicationStageKey[] = [
  "scheme_identified",
  "eligibility_checked",
  "docs_prepared",
  "partner_selected",
  "form_filled",
  "submitted",
  "under_review",
  "sanction_decision",
]

export interface MilestoneRecord {
  stageKey: ApplicationStageKey
  order: number
  completed: boolean
  completedAt?: string
  notes?: string
  referenceNumber?: string
  updatedAt?: number
}

export interface MilestoneStage {
  key: ApplicationStageKey
  order: number
  title: LocalizedText
  shortTitle: LocalizedText
  description: LocalizedText
  actionPrompt: LocalizedText
  actionDetails: LocalizedText
  statutoryChecklist?: LocalizedText[]
  estimatedDays?: number
  badgeLabel?: LocalizedText
}

export interface ApplicationJourney {
  id: string
  userId?: string
  schemeId: string
  schemeName: LocalizedText
  schemeType: SchemeType
  partnerId: string
  partnerName: string
  partnerBranch?: string
  partnerAddress?: string
  partnerPhone?: string
  nodalOfficerName?: string
  nodalOfficerPhone?: string
  requestedAmount: number
  acknowledgmentNumber?: string
  currentStage: ApplicationStageKey
  currentStageIndex: number
  stages: MilestoneRecord[]
  notes?: string
  isSynthetic?: boolean
  createdAt: number
  updatedAt: number
}

export const DEFAULT_MILESTONE_DEFINITIONS: MilestoneStage[] = [
  {
    key: "scheme_identified",
    order: 1,
    title: {
      en: "Scheme Identified & Evaluated",
      hi: "योजना की पहचान और मूल्यांकन",
    },
    shortTitle: {
      en: "Scheme Identified",
      hi: "योजना चयनित",
    },
    description: {
      en: "Scheme selected matching your project profile, loan requirements, and concessional interest benefits.",
      hi: "आपकी परियोजना, ऋण आवश्यकता और रियायती ब्याज लाभ के अनुरूप योजना का चयन किया गया।",
    },
    actionPrompt: {
      en: "Review scheme terms, interest subvention, and max project cost ceiling.",
      hi: "योजना के नियम, ब्याज सब्सिडी और अधिकतम परियोजना लागत सीमा की समीक्षा करें।",
    },
    actionDetails: {
      en: "Ensure your proposed business or course aligns with statutory project cost limits and promoter contribution guidelines.",
      hi: "सुनिश्चित करें कि आपका व्यवसाय या पाठ्यक्रम सांविधिक लागत सीमा और प्रमोटर अंशदान नियमों के अनुरूप है।",
    },
    estimatedDays: 1,
  },
  {
    key: "eligibility_checked",
    order: 2,
    title: {
      en: "Eligibility Criteria Pre-Screened",
      hi: "पात्रता मानदंडों की पूर्व-जांच",
    },
    shortTitle: {
      en: "Eligibility Checked",
      hi: "पात्रता जाँची गई",
    },
    description: {
      en: "Demographics, caste category, annual income ceiling (< ₹5.00 Lakhs), and age criteria confirmed.",
      hi: "जनसांख्यिकी, जाति वर्ग, वार्षिक पारिवारिक आय सीमा (< ₹5.00 लाख) और आयु मानदंडों की पुष्टि की गई।",
    },
    actionPrompt: {
      en: "Verify that your annual family income and caste certificate match statutory guidelines.",
      hi: "जांचें कि आपकी पारिवारिक आय और जाति प्रमाण पत्र सरकारी दिशा-निर्देशों के अनुरूप हैं।",
    },
    actionDetails: {
      en: "Confirm 100-point eligibility match score and resolve any potential category or documentation discrepancies.",
      hi: "100-अंक पात्रता स्कोर की पुष्टि करें और किसी भी श्रेणी या दस्तावेज़ विसंगति का समाधान करें।",
    },
    estimatedDays: 1,
  },
  {
    key: "docs_prepared",
    order: 3,
    title: {
      en: "Statutory Documents Prepared & Verified",
      hi: "सांविधिक दस्तावेज तैयार और सत्यापित",
    },
    shortTitle: {
      en: "Documents Prepared",
      hi: "दस्तावेज तैयार",
    },
    description: {
      en: "Caste certificate, income proof, project report / quotation, identity cards, and photos compiled in physical/digital folders.",
      hi: "जाति प्रमाण पत्र, आय प्रमाण, प्रोजेक्ट रिपोर्ट/कोटेशन, पहचान पत्र और पासपोर्ट फोटो तैयार कर लिए गए हैं।",
    },
    actionPrompt: {
      en: "Print 2 physical copies of each statutory document and keep original certificates ready for verification.",
      hi: "प्रत्येक दस्तावेज की 2 प्रतियां प्रिंट करें और सत्यापन के लिए मूल प्रमाण पत्र तैयार रखें।",
    },
    actionDetails: {
      en: "Use SchemeSathi Document Checklist to ensure zero omissions before visiting the branch.",
      hi: "शाखा जाने से पहले किसी भी कमी से बचने के लिए स्कीमसाथी दस्तावेज़ चेकलिस्ट का उपयोग करें।",
    },
    estimatedDays: 3,
  },
  {
    key: "partner_selected",
    order: 4,
    title: {
      en: "Authorized Channel Partner Branch Selected",
      hi: "अधिकृत चैनल पार्टनर शाखा का चयन",
    },
    shortTitle: {
      en: "Partner Selected",
      hi: "पार्टनर चुना गया",
    },
    description: {
      en: "Designated State Channelizing Agency (SCA), PSB, or RRB branch identified with active fund allocation and low NPA status.",
      hi: "सक्रिय फंड आवंटन और कम एनपीए वाली अधिकृत राज्य चैनेलाइजिंग एजेंसी (SCA) या बैंक शाखा की पहचान की गई।",
    },
    actionPrompt: {
      en: "Note branch operating hours and connect with the designated Nodal Officer.",
      hi: "शाखा के कार्य समय को नोट करें और नामित नोडल अधिकारी से संपर्क करें।",
    },
    actionDetails: {
      en: "Check distance, office location, and contact numbers before your physical visit.",
      hi: "अपनी भौतिक यात्रा से पहले दूरी, कार्यालय का पता और संपर्क नंबर जांच लें।",
    },
    estimatedDays: 1,
  },
  {
    key: "form_filled",
    order: 5,
    title: {
      en: "Physical / Digital Application Form Completed",
      hi: "आवेदन पत्र पूर्ण रूप से भरा गया",
    },
    shortTitle: {
      en: "Form Filled",
      hi: "फॉर्म भरा गया",
    },
    description: {
      en: "Formal application form filled with enterprise details, cost breakup, promoter margin, and personal particulars.",
      hi: "उद्यम विवरण, लागत विवरण, प्रमोटर मार्जिन और व्यक्तिगत जानकारी के साथ औपचारिक आवेदन पत्र भरा गया।",
    },
    actionPrompt: {
      en: "Carefully cross-check loan amount, guarantor / co-applicant details, and sign all declaration pages.",
      hi: "ऋण राशि, गारंटर विवरण की सावधानीपूर्वक जांच करें और सभी घोषणा प्रपत्रों पर हस्ताक्षर करें।",
    },
    actionDetails: {
      en: "Attach detailed project cost plan and quotations from certified vendors.",
      hi: "विस्तृत परियोजना लागत योजना और प्रमाणित विक्रेताओं के कोटेशन संलग्न करें।",
    },
    estimatedDays: 2,
  },
  {
    key: "submitted",
    order: 6,
    title: {
      en: "Application Submitted with Official Acknowledgment",
      hi: "आधिकारिक पावती के साथ आवेदन जमा किया गया",
    },
    shortTitle: {
      en: "Application Submitted",
      hi: "आवेदन जमा",
    },
    description: {
      en: "Dossier physically handed over at the branch counter; official stamped receipt and reference number collected.",
      hi: "शाखा काउंटर पर आवेदन डोजियर जमा किया गया; आधिकारिक मुहर लगी पावती और संदर्भ संख्या प्राप्त की गई।",
    },
    actionPrompt: {
      en: "Obtain stamped acknowledgment receipt and enter your physical receipt reference number below.",
      hi: "मुहर लगी पावती रसीद प्राप्त करें और नीचे अपनी भौतिक रसीद संदर्भ संख्या दर्ज करें।",
    },
    actionDetails: {
      en: "Keep the signed receipt safe. You will need this reference number for all future inquiries at the branch.",
      hi: "हस्ताक्षरित रसीद को सुरक्षित रखें। शाखा में आगे की सभी पूछताछ के लिए आपको इस संदर्भ संख्या की आवश्यकता होगी।",
    },
    estimatedDays: 1,
  },
  {
    key: "under_review",
    order: 7,
    title: {
      en: "Pre-Sanction Field Appraisal & Inspection",
      hi: "स्वीकृति-पूर्व फील्ड मूल्यांकन और निरीक्षण",
    },
    shortTitle: {
      en: "Appraisal & Review",
      hi: "मूल्यांकन व समीक्षा",
    },
    description: {
      en: "Branch credit officer and field inspector verify project site, enterprise feasibility, and applicant credentials.",
      hi: "शाखा ऋण अधिकारी और फील्ड निरीक्षक द्वारा परियोजना स्थल, व्यावसायिक व्यवहार्यता और साख का सत्यापन।",
    },
    actionPrompt: {
      en: "Be available at proposed enterprise location for official site inspection and keep land / rental proofs ready.",
      hi: "आधिकारिक साइट निरीक्षण के लिए उद्यम स्थल पर उपस्थित रहें और भूमि/किराया प्रमाण पत्र तैयार रखें।",
    },
    actionDetails: {
      en: "Field officers may interview you regarding technical skills, supplier network, and expected business turnover.",
      hi: "फील्ड अधिकारी आपके तकनीकी कौशल, सप्लायर नेटवर्क और अपेक्षित व्यापार टर्नओवर के संबंध में जानकारी ले सकते हैं।",
    },
    estimatedDays: 15,
  },
  {
    key: "sanction_decision",
    order: 8,
    title: {
      en: "Sanction Letter Issued & Loan / Subsidy Disbursed",
      hi: "स्वीकृति पत्र जारी और ऋण/सब्सिडी वितरित",
    },
    shortTitle: {
      en: "Sanction & Disbursal",
      hi: "स्वीकृति व वितरण",
    },
    description: {
      en: "Formal credit sanction approved, loan agreement executed, and funds disbursed directly to vendor / beneficiary account.",
      hi: "ऋण स्वीकृति को मंजूरी, ऋण समझौते पर हस्ताक्षर और सीधे विक्रेता/लाभार्थी के बैंक खाते में राशि वितरित।",
    },
    actionPrompt: {
      en: "Review sanction terms, execute loan hypothecation/agreement, and confirm bank account credit.",
      hi: "स्वीकृति की शर्तों की समीक्षा करें, ऋण समझौते पर हस्ताक्षर करें और बैंक खाते में राशि की पुष्टि करें।",
    },
    actionDetails: {
      en: "Ensure you obtain the repayment schedule with exact EMI dates and interest subvention credits.",
      hi: "ईएमआई तिथियों और ब्याज छूट विवरण के साथ पुनर्भुगतान अनुसूची प्राप्त करना सुनिश्चित करें।",
    },
    estimatedDays: 7,
  },
]
