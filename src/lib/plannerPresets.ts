import type {
  BudgetCategoryKey,
  BusinessPresetTemplate,
  FinancingBreakdown,
  ProjectBudgetCategory,
  ProjectBudgetItem,
} from "@/types/planner"

export const BUDGET_CATEGORIES: ProjectBudgetCategory[] = [
  {
    key: "equipment",
    nameKey: "planner.categories.equipment.name",
    defaultName: {
      en: "Equipment & Machinery",
      hi: "उपकरण और मशीनरी",
    },
    descriptionKey: "planner.categories.equipment.desc",
    defaultDescription: {
      en: "Tools, machinery, workstations, hardware, and operational assets.",
      hi: "औजार, मशीनरी, वर्कस्टेशन, हार्डवेयर और व्यावसायिक उपकरण।",
    },
    iconName: "Wrench",
    color: "emerald",
  },
  {
    key: "rawMaterials",
    nameKey: "planner.categories.rawMaterials.name",
    defaultName: {
      en: "Raw Materials & Inventory",
      hi: "कच्चा माल और स्टॉक",
    },
    descriptionKey: "planner.categories.rawMaterials.desc",
    defaultDescription: {
      en: "Initial trade stock, wholesale goods, inputs, and consumables.",
      hi: "आरंभिक व्यापारिक स्टॉक, थोक माल, कच्चा माल और उपभोग्य वस्तुएं।",
    },
    iconName: "Boxes",
    color: "blue",
  },
  {
    key: "rent",
    nameKey: "planner.categories.rent.name",
    defaultName: {
      en: "Commercial Rent & Security Deposit",
      hi: "दुकान/परिसर किराया व सिक्योरिटी",
    },
    descriptionKey: "planner.categories.rent.desc",
    defaultDescription: {
      en: "Advance lease deposits, shop renovation, and commercial rent.",
      hi: "दुकान/वर्कशॉप का अग्रिम किराया, सिक्योरिटी डिपॉजिट और नवीनीकरण।",
    },
    iconName: "Store",
    color: "amber",
  },
  {
    key: "workingCapital",
    nameKey: "planner.categories.workingCapital.name",
    defaultName: {
      en: "Working Capital & Utilities",
      hi: "कार्यशील पूंजी और बिजली-पानी",
    },
    descriptionKey: "planner.categories.workingCapital.desc",
    defaultDescription: {
      en: "First 2-3 months utility bills, staff wages, and day-to-day liquidity.",
      hi: "शुरुआती 2-3 महीनों के बिल, वेतन और दैनिक व्यावसायिक खर्च।",
    },
    iconName: "Coins",
    color: "purple",
  },
  {
    key: "licenses",
    nameKey: "planner.categories.licenses.name",
    defaultName: {
      en: "Licenses, Certifications & Skills",
      hi: "लाइसेंस, पंजीकरण व कौशल प्रशिक्षण",
    },
    descriptionKey: "planner.categories.licenses.desc",
    defaultDescription: {
      en: "Trade licenses, GST/Udyam registrations, and skill certification.",
      hi: "व्यापार लाइसेंस, उद्यम/जीएसटी पंजीकरण और व्यावसायिक प्रशिक्षण।",
    },
    iconName: "GraduationCap",
    color: "cyan",
  },
  {
    key: "contingency",
    nameKey: "planner.categories.contingency.name",
    defaultName: {
      en: "Contingency / Miscellaneous",
      hi: "आपातकालीन व विविध खर्च",
    },
    descriptionKey: "planner.categories.contingency.desc",
    defaultDescription: {
      en: "Buffer fund for unforeseen operational repairs or price variances.",
      hi: "अप्रत्याशित परिचालन मरम्मत या मूल्य वृद्धि के लिए आपातकालीन फंड।",
    },
    iconName: "ShieldAlert",
    color: "rose",
  },
]

export const BUSINESS_PRESETS: BusinessPresetTemplate[] = [
  {
    id: "kirana_retail",
    nameKey: "planner.presets.kirana.name",
    defaultName: {
      en: "Small Retail Kirana Shop",
      hi: "किराना / जनरल स्टोर",
    },
    descriptionKey: "planner.presets.kirana.desc",
    defaultDescription: {
      en: "Complete startup budget for a neighborhood grocery and daily FMCG retail store.",
      hi: "दैनिक किराना और जनरल स्टोर शुरू करने के लिए संपूर्ण बजट योजना।",
    },
    categoryTag: "Retail & Trading",
    projectTypeKey: "shop",
    defaultLoanSharePct: 90,
    defaultPromoterMarginPct: 10,
    defaultSubsidyPct: 0,
    items: [
      {
        category: "equipment",
        nameKey: "planner.presets.kirana.items.equipment",
        defaultName: {
          en: "Display Racks, Counters & Digital Weighing Scale",
          hi: "डिस्प्ले रैक, काउंटर और डिजिटल वजन कांटा",
        },
        amount: 40000,
        notes: "Heavy-duty steel display racks, billing desk, and certified electronic scale",
      },
      {
        category: "rawMaterials",
        nameKey: "planner.presets.kirana.items.stock",
        defaultName: {
          en: "Initial FMCG & Groceries Wholesale Inventory",
          hi: "थोक किराना माल, अनाज और एफएमसीजी स्टॉक",
        },
        amount: 80000,
        notes: "Fast-moving packaged goods, pulses, grains, oils, and packaged foods",
      },
      {
        category: "rent",
        nameKey: "planner.presets.kirana.items.rent",
        defaultName: {
          en: "Shop Rental Advance & Security Deposit",
          hi: "दुकान का अग्रिम किराया व सिक्योरिटी डिपॉजिट",
        },
        amount: 20000,
        notes: "Refundable security deposit and first month advance",
      },
      {
        category: "workingCapital",
        nameKey: "planner.presets.kirana.items.workingCapital",
        defaultName: {
          en: "Initial Working Capital & Electricity Setup",
          hi: "आरंभिक कार्यशील पूंजी व बिजली कनेक्शन",
        },
        amount: 10000,
        notes: "Cash float for billing counter and initial electricity billing",
      },
    ],
  },
  {
    id: "garment_unit",
    nameKey: "planner.presets.garments.name",
    defaultName: {
      en: "Garment & Apparel Manufacturing Unit",
      hi: "रेडीमेड गारमेंट सिलाई व निर्माण इकाई",
    },
    descriptionKey: "planner.presets.garments.desc",
    defaultDescription: {
      en: "Micro-apparel production unit with industrial sewing machines, fabrics, and workshop lease.",
      hi: "औद्योगिक सिलाई मशीन, कपड़ा थान और वर्कशॉप सेटअप के साथ गारमेंट इकाई।",
    },
    categoryTag: "Manufacturing",
    projectTypeKey: "manufacturing",
    defaultLoanSharePct: 90,
    defaultPromoterMarginPct: 10,
    defaultSubsidyPct: 0,
    items: [
      {
        category: "equipment",
        nameKey: "planner.presets.garments.items.machinery",
        defaultName: {
          en: "Industrial High-Speed Sewing Machines & Overlock Unit",
          hi: "औद्योगिक हाई-स्पीड सिलाई व इंटरलॉक मशीनें (3 सेट)",
        },
        amount: 120000,
        notes: "2 lockstitch sewing machines, 1 five-thread overlock, and cutting table",
      },
      {
        category: "rawMaterials",
        nameKey: "planner.presets.garments.items.fabrics",
        defaultName: {
          en: "Fabric Rolls, Threads, Zippers & Accessories",
          hi: "कपड़ा थान, धागे, चेन, बटन और सहायक सामग्री",
        },
        amount: 80000,
        notes: "Cotton/poly fabric bolts, designer buttons, zippers, and trims",
      },
      {
        category: "rent",
        nameKey: "planner.presets.garments.items.rent",
        defaultName: {
          en: "Workshop Space Security Deposit & Lighting Setup",
          hi: "वर्कशॉप का सिक्योरिटी डिपॉजिट व वायरिंग सेटअप",
        },
        amount: 30000,
        notes: "Commercial workspace lease advance and industrial illumination",
      },
      {
        category: "workingCapital",
        nameKey: "planner.presets.garments.items.wages",
        defaultName: {
          en: "Initial Tailor Stipends & Operational Running Costs",
          hi: "कारीगर पारिश्रमिक व प्रारंभिक 2 माह का संचालन खर्च",
        },
        amount: 40000,
        notes: "Buffer for tailor wages during production cycle",
      },
      {
        category: "licenses",
        nameKey: "planner.presets.garments.items.licenses",
        defaultName: {
          en: "Udyam MSME Registration, GST & Trade License",
          hi: "उद्यम पंजीकरण, जीएसटी और स्थानीय ट्रेड लाइसेंस",
        },
        amount: 10000,
        notes: "Statutory municipal trade permit and commercial registration",
      },
      {
        category: "contingency",
        nameKey: "planner.presets.garments.items.contingency",
        defaultName: {
          en: "Machine Spares, Needles & Maintenance Buffer",
          hi: "मशीन स्पेयर पार्ट्स, सुई और मेंटेनेंस फंड",
        },
        amount: 20000,
        notes: "Unforeseen machine repairs and tooling replacements",
      },
    ],
  },
  {
    id: "mobile_repair",
    nameKey: "planner.presets.repair.name",
    defaultName: {
      en: "Mobile Repair & Electronics Service",
      hi: "मोबाइल व इलेक्ट्रॉनिक्स रिपेयर सेंटर",
    },
    descriptionKey: "planner.presets.repair.desc",
    defaultDescription: {
      en: "Service shop setup with diagnostic tools, soldering stations, replacement screens, and test kits.",
      hi: "डायग्नोस्टिक उपकरण, सोल्डरिंग स्टेशन और स्पेयर पार्ट्स के साथ रिपेयर सेंटर।",
    },
    categoryTag: "Services & Skills",
    projectTypeKey: "service",
    defaultLoanSharePct: 90,
    defaultPromoterMarginPct: 10,
    defaultSubsidyPct: 0,
    items: [
      {
        category: "equipment",
        nameKey: "planner.presets.repair.items.tools",
        defaultName: {
          en: "SMD Rework Station, Digital Multimeter & Toolkits",
          hi: "एसएमडी रीवर्क स्टेशन, मल्टीमीटर और माइक्रो सोल्डरिंग टूलकिट",
        },
        amount: 35000,
        notes: "Hot air gun, digital precision multimeter, microscope, and opening tools",
      },
      {
        category: "rawMaterials",
        nameKey: "planner.presets.repair.items.spares",
        defaultName: {
          en: "Replacement Displays, Batteries & IC Spares Inventory",
          hi: "डिस्प्ले स्क्रीन, बैटरी, चार्जिंग जैक और आईसी कंपोनेंट स्टॉक",
        },
        amount: 40000,
        notes: "Fast-selling smartphone displays, original batteries, and connector jacks",
      },
      {
        category: "rent",
        nameKey: "planner.presets.repair.items.rent",
        defaultName: {
          en: "Market Kiosk / Booth Rental Advance",
          hi: "मार्केट कियोस्क / काउंटर का अग्रिम किराया",
        },
        amount: 15000,
        notes: "Commercial counter deposit in electronics/telecom market",
      },
      {
        category: "workingCapital",
        nameKey: "planner.presets.repair.items.software",
        defaultName: {
          en: "Software Flashing Dongles & High-Speed Broadband",
          hi: "सॉफ्टवेयर फ्लैशिंग बॉक्स और इंटरनेट कनेक्शन",
        },
        amount: 10000,
        notes: "Firmware flashing dongles and 3-month high-speed internet",
      },
    ],
  },
  {
    id: "dairy_farming",
    nameKey: "planner.presets.dairy.name",
    defaultName: {
      en: "Dairy & Animal Husbandry Mini-Farm",
      hi: "डेयरी व पशुपालन मिनी फार्म",
    },
    descriptionKey: "planner.presets.dairy.desc",
    defaultDescription: {
      en: "Small dairy unit with 2 high-yield milch cattle, cattle feed stock, and milk cans.",
      hi: "2 दुधारू पशु (गाय/भैंस), पशु आहार स्टॉक और डेयरी उपकरण के साथ मिनी फार्म।",
    },
    categoryTag: "Agri-Allied",
    projectTypeKey: "agri",
    defaultLoanSharePct: 95,
    defaultPromoterMarginPct: 5,
    defaultSubsidyPct: 0,
    items: [
      {
        category: "equipment",
        nameKey: "planner.presets.dairy.items.cattle",
        defaultName: {
          en: "2 High-Yield Milch Buffaloes / Cows & Shed Fixtures",
          hi: "2 उन्नत नस्ल की दुधारू भैंस/गाय और शेड निर्माण",
        },
        amount: 160000,
        notes: "Healthy Murrah buffaloes/Gir cows with initial health certificates",
      },
      {
        category: "rawMaterials",
        nameKey: "planner.presets.dairy.items.feed",
        defaultName: {
          en: "Nutritional Cattle Feed, Silage & Mineral Mixtures",
          hi: "पशु आहार, हरा चारा, साइलेज और खनिज मिश्रण (2 माह)",
        },
        amount: 30000,
        notes: "High-protein cattle feed bags, calcium, and mineral supplements",
      },
      {
        category: "equipment",
        nameKey: "planner.presets.dairy.items.cans",
        defaultName: {
          en: "Stainless Steel Milk Cans, Chilling & Milking Buckets",
          hi: "स्टेनलेस स्टील के दूध के ड्रम, फिल्टर और नाप उपकरण",
        },
        amount: 30000,
        notes: "Food-grade stainless steel cans, strainer, and lactometer",
      },
      {
        category: "workingCapital",
        nameKey: "planner.presets.dairy.items.fodder",
        defaultName: {
          en: "Fodder Water Supply Setup & Farm Maintenance",
          hi: "पानी की व्यवस्था और शेड स्वच्छता उपकरण",
        },
        amount: 20000,
        notes: "Water piping, drinking troughs, and cleaning disinfectant",
      },
      {
        category: "contingency",
        nameKey: "planner.presets.dairy.items.vet",
        defaultName: {
          en: "Veterinary Care, Vaccination & Livestock Insurance",
          hi: "पशु चिकित्सा, टीकाकरण और पशु बीमा प्रीमियम",
        },
        amount: 10000,
        notes: "Comprehensive livestock insurance tag and initial deworming/vaccines",
      },
    ],
  },
  {
    id: "vocational_education",
    nameKey: "planner.presets.education.name",
    defaultName: {
      en: "Higher Technical Education & Skills Course",
      hi: "उच्च तकनीकी शिक्षा व कौशल विकास पाठ्यक्रम",
    },
    descriptionKey: "planner.presets.education.desc",
    defaultDescription: {
      en: "Comprehensive educational budget including tuition fees, laptop workstation, hostel, and study material.",
      hi: "ट्यूशन फीस, लैपटॉप, हॉस्टल और अध्ययन सामग्री के साथ संपूर्ण शैक्षणिक बजट।",
    },
    categoryTag: "Education",
    projectTypeKey: "higher_education",
    defaultLoanSharePct: 90,
    defaultPromoterMarginPct: 10,
    defaultSubsidyPct: 0,
    items: [
      {
        category: "licenses",
        nameKey: "planner.presets.education.items.tuition",
        defaultName: {
          en: "Degree / Polytechnic Course Tuition Fees (Annual)",
          hi: "डिग्री / डिप्लोमा पाठ्यक्रम ट्यूशन फीस (वार्षिक)",
        },
        amount: 150000,
        notes: "Approved technical college institutional fee and semester exam costs",
      },
      {
        category: "equipment",
        nameKey: "planner.presets.education.items.laptop",
        defaultName: {
          en: "Laptop Workstation & Engineering Instruments",
          hi: "लैपटॉप वर्कस्टेशन और तकनीकी अध्ययन उपकरण",
        },
        amount: 50000,
        notes: "High-performance laptop for coding, CAD, and simulations",
      },
      {
        category: "rent",
        nameKey: "planner.presets.education.items.hostel",
        defaultName: {
          en: "Campus Hostel Accommodation & Mess Deposit",
          hi: "हॉस्टल आवास और मेस सिक्योरिटी डिपॉजिट",
        },
        amount: 50000,
        notes: "Annual residential hostel fees and food allowance",
      },
      {
        category: "rawMaterials",
        nameKey: "planner.presets.education.items.books",
        defaultName: {
          en: "Reference Textbooks, Lab Kits & Software Subscriptions",
          hi: "पाठ्यपुस्तकें, प्रैक्टिकल किट और सॉफ्टवेयर लाइसेंस",
        },
        amount: 25000,
        notes: "Engineering textbooks, practical lab components, and academic software",
      },
      {
        category: "contingency",
        nameKey: "planner.presets.education.items.contingency",
        defaultName: {
          en: "Exam Fees, Medical Insurance & Contingency Allowance",
          hi: "परीक्षा शुल्क, मेडिकल व आपातकालीन छात्र फंड",
        },
        amount: 25000,
        notes: "Certification exam charges and emergency buffer",
      },
    ],
  },
]

export function calculateCategoryTotals(items: ProjectBudgetItem[]): Record<BudgetCategoryKey, number> {
  const totals: Record<BudgetCategoryKey, number> = {
    equipment: 0,
    rawMaterials: 0,
    rent: 0,
    workingCapital: 0,
    licenses: 0,
    contingency: 0,
  }

  for (const item of items) {
    if (totals[item.category] !== undefined) {
      totals[item.category] += Math.max(0, item.amount || 0)
    }
  }

  return totals
}

export function calculateFinancingBreakdown(
  items: ProjectBudgetItem[],
  loanSharePct: number = 90,
  promoterMarginPct: number = 10,
  subsidyPct: number = 0,
): FinancingBreakdown {
  const totalProjectCost = items.reduce((acc, item) => acc + Math.max(0, item.amount || 0), 0)
  const categoryBreakdown = calculateCategoryTotals(items)

  // Clamp percentages to avoid invalid math
  const safeLoanPct = Math.max(0, Math.min(100, loanSharePct))
  const safeSubsidyPct = Math.max(0, Math.min(100 - safeLoanPct, subsidyPct))
  const safeMarginPct = Math.max(
    0,
    Math.min(100 - safeLoanPct - safeSubsidyPct, promoterMarginPct),
  )

  const loanAmount = Math.round(totalProjectCost * (safeLoanPct / 100))
  const subsidyAmount = Math.round(totalProjectCost * (safeSubsidyPct / 100))
  const promoterMarginAmount = Math.max(0, totalProjectCost - loanAmount - subsidyAmount)

  return {
    totalProjectCost,
    loanSharePct: safeLoanPct,
    promoterMarginPct: safeMarginPct,
    subsidyPct: safeSubsidyPct,
    loanAmount,
    promoterMarginAmount,
    subsidyAmount,
    categoryBreakdown,
  }
}
