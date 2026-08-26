import type { AssessmentInput, Explanation } from "@/types/assessment"
import type { FieldResult } from "./eligibility"

const acceptanceReasons: Record<string, Record<string, string>> = {
  en: {
    income_ok: "Your family income is within the scheme's eligibility ceiling.",
    category_match: "Your social category is eligible for this scheme.",
    location_match: "Your state is covered by this scheme.",
    district_match: "Your district is covered by this scheme.",
    purpose_match: "Your project purpose aligns with this scheme.",
    occupation_match: "Your occupation is eligible for this scheme.",
    education_match: "Your education level meets the scheme's requirements.",
    age_match: "Your age is within the eligible range.",
    existing_business_match: "Your business status matches this scheme's requirements.",
    gender_match: "This scheme is available to your gender.",
    disability_match: "This scheme matches your disability status.",
    no_rules: "No specific eligibility rules to check — open to all eligible applicants.",
  },
  hi: {
    income_ok: "आपकी पारिवारिक आय योजना की पात्रता सीमा के भीतर है।",
    category_match: "आपकी सामाजिक श्रेणी इस योजना के लिए पात्र है।",
    location_match: "आपका राज्य इस योजना द्वारा कवर किया गया है।",
    district_match: "आपका जिला इस योजना द्वारा कवर किया गया है।",
    purpose_match: "आपका प्रोजेक्ट उद्देश्य इस योजना से मेल खाता है।",
    occupation_match: "आपका व्यवसाय इस योजना के लिए पात्र है।",
    education_match: "आपकी शिक्षा का स्तर योजना की आवश्यकताओं को पूरा करता है।",
    age_match: "आपकी आयु पात्र सीमा के भीतर है।",
    existing_business_match: "आपकी व्यवसाय स्थिति इस योजना की आवश्यकताओं से मेल खाती है।",
    gender_match: "यह योजना आपके लिंग के लिए उपलब्ध है।",
    disability_match: "यह योजना आपकी विकलांगता स्थिति से मेल खाती है।",
    no_rules: "जाँचने के लिए कोई विशिष्ट पात्रता नियम नहीं — सभी पात्र आवेदकों के लिए खुला।",
  },
  mr: {
    income_ok: "तुमचा कुटुंबीय उत्पन्न योजनेच्या पात्रता मर्यादेत आहे.",
    category_match: "तुमच्या सामाजिक श्रेणीस या योजनेसाठी पात्र आहे.",
    location_match: "तुमच्या राज्याला या योजनेद्वारे कव्हर केले आहे.",
    district_match: "तुमच्या जिल्ह्याला या योजनेद्वारे कव्हर केले आहे.",
    purpose_match: "तुमचा प्रकल्प उद्देश या योजनेशी जुळतो.",
    occupation_match: "तुमचा व्यवसाय या योजनेसाठी पात्र आहे.",
    education_match: "तुमच्या शिक्षणाची पातळी योजनेच्या गरजांना पूर्ण करते.",
    age_match: "तुमचे वय पात्र मर्यादेत आहे.",
    existing_business_match: "तुमची व्यवसाय स्थिती या योजनेच्या गरजांशी जुळते.",
    gender_match: "ही योजना तुमच्या लिंगासाठी उपलब्ध आहे.",
    disability_match: "ही योजना तुमच्या अपंगत्वा स्थितीशी जुळते.",
    no_rules: "तपासण्यासाठी कोणत्याही विशिष्ट पात्रता नियम नाहीत — सर्व पात्र अर्जदारांसाठी उघडे.",
  },
}

const rejectionReasons: Record<string, Record<string, string>> = {
  en: {
    income_exceeds: "Your family income exceeds the scheme's ceiling.",
    category_note: "This scheme is restricted to specific categories.",
    category_not_match: "This scheme is restricted to specific categories.",
    location_not_match: "Your state is not currently covered by this scheme.",
    district_not_match: "Your district is not currently covered by this scheme.",
    occupation_not_match: "Your occupation is not eligible for this scheme.",
    education_not_match: "Your education level doesn't meet the requirements.",
    age_not_match: "Your age is outside the eligible range.",
    existing_business_not_match: "This scheme requires a specific business status.",
    purpose_not_match: "Your project purpose doesn't align with this scheme.",
    gender_not_match: "This scheme is restricted to a specific gender.",
    disability_not_match: "This scheme requires a specific disability status.",
  },
  hi: {
    income_exceeds: "आपकी पारिवारिक आय योजना की सीमा से अधिक है।",
    category_note: "यह योजना विशिष्ट श्रेणियों तक सीमित है।",
    category_not_match: "यह योजना विशिष्ट श्रेणियों तक सीमित है।",
    location_not_match: "आपका राज्य वर्तमान में इस योजना द्वारा कवर नहीं किया गया है।",
    district_not_match: "आपका जिला वर्तमान में इस योजना द्वारा कवर नहीं किया गया है।",
    occupation_not_match: "आपका व्यवसाय इस योजना के लिए पात्र नहीं है।",
    education_not_match: "आपकी शिक्षा का स्तर आवश्यकताओं को पूरा नहीं करता।",
    age_not_match: "आपकी आयु पात्र सीमा से बाहर है।",
    existing_business_not_match: "इस योजना के लिए विशिष्ट व्यवसाय स्थिति आवश्यक है।",
    purpose_not_match: "आपका प्रोजेक्ट उद्देश्य इस योजना से मेल नहीं खाता।",
    gender_not_match: "यह योजना एक विशिष्ट लिंग तक सीमित है।",
    disability_not_match: "इस योजना के लिए एक विशिष्ट विकलांगता स्थिति आवश्यक है।",
  },
  mr: {
    income_exceeds: "तुमचा कुटुंबीय उत्पन्न योजनेच्या मर्यादेपेक्षा जास्त आहे.",
    category_note: "ही योजना विशिष्ट श्रेणींपर्यंत मर्यादित आहे.",
    category_not_match: "ही योजना विशिष्ट श्रेणींपर्यंत मर्यादित आहे.",
    location_not_match: "तुमच्या राज्याला सध्या या योजनेद्वारे कव्हर केलेले नाही.",
    district_not_match: "तुमच्या जिल्ह्याला सध्या या योजनेद्वारे कव्हर केलेले नाही.",
    occupation_not_match: "तुमचा व्यवसाय या योजनेसाठी पात्र नाही.",
    education_not_match: "तुमच्या शिक्षणाची पातळी गरजांना पूर्ण करत नाही.",
    age_not_match: "तुमचे वय पात्र मर्यादेबाहेर आहे.",
    existing_business_not_match: "या योजनेसाठी विशिष्ट व्यवसाय स्थिती आवश्यक आहे.",
    purpose_not_match: "तुमचा प्रकल्प उद्देश या योजनेशी जुळत नाही.",
    gender_not_match: "ही योजना एका विशिष्ट लिंगापर्यंत मर्यादित आहे.",
    disability_not_match: "या योजनेसाठी एक विशिष्ट अपंगत्वा स्थिती आवश्यक आहे.",
  },
}

export function generateExplanation(
  _scheme: { name: { en: string; hi: string; mr?: string } },
  _input: AssessmentInput,
  fieldResults: FieldResult[],
  _scoreBreakdown: Array<{ field: string; score: number; weight: number }>,
  lang: string = "en",
): Explanation[] {
  const explanations: Explanation[] = []
  const reasons = lang === "hi" ? acceptanceReasons.hi : lang === "mr" ? acceptanceReasons.mr : acceptanceReasons.en
  const rejections = lang === "hi" ? rejectionReasons.hi : lang === "mr" ? rejectionReasons.mr : rejectionReasons.en

  for (const result of fieldResults) {
    if (result.passed) {
      const text = reasons[result.reason] || reasons.no_rules
      explanations.push({
        type: "acceptance",
        field: result.field,
        reasonKey: result.reason,
        text,
      })
    } else {
      const text = rejections[result.reason] || `Not eligible: ${result.field}`
      explanations.push({
        type: "rejection",
        field: result.field,
        reasonKey: result.reason,
        text,
      })
    }
  }

  return explanations
}
