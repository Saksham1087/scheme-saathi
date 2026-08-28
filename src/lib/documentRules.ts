import type {
  RequiredDocument,
  DocumentCategory,
  DocumentReadinessState,
  SchemeDocumentConfig,
  LocalizedText,
  SchemeType,
} from "@/types"

// --- Document Catalog Master Items ---

export const STATUTORY_DOCUMENTS: Record<string, RequiredDocument> = {
  // Base KYC & Social Category Documents
  "doc-aadhaar": {
    id: "doc-aadhaar",
    name: {
      en: "Identity Proof (Aadhaar / Voter ID / Passport)",
      hi: "पहचान प्रमाण (आधार कार्ड / वोटर आईडी / पासपोर्ट)",
    },
    description: {
      en: "Government-issued photo identification proof verifying applicant identity and age.",
      hi: "आवेदक की पहचान और आयु सत्यापित करने वाला सरकार द्वारा जारी फोटो पहचान प्रमाण पत्र।",
    },
    category: "identity",
    mandatory: true,
    issuingAuthority: {
      en: "UIDAI / Election Commission of India / Ministry of External Affairs",
      hi: "यूआईडीएआई (UIDAI) / भारत निर्वाचन आयोग / विदेश मंत्रालय",
    },
    guidanceNotes: {
      en: "Ensure the name and date of birth match your school certificate and bank account records exactly.",
      hi: "सुनिश्चित करें कि नाम और जन्म तिथि आपके स्कूल प्रमाण पत्र और बैंक खाते के रिकॉर्ड से बिल्कुल मेल खाती हो।",
    },
    alternativeDocs: {
      en: "Voter ID Card, Passport, Driving License, or PAN Card.",
      hi: "वोटर आईडी कार्ड, पासपोर्ट, ड्राइविंग लाइसेंस, या पैन कार्ड।",
    },
    digiLockerVerifiable: true,
  },

  "doc-address-proof": {
    id: "doc-address-proof",
    name: {
      en: "Permanent Address & Residence Proof",
      hi: "स्थायी पता एवं निवास प्रमाण पत्र",
    },
    description: {
      en: "Document verifying residential domicile within the operational jurisdiction of the Channel Partner / SCA.",
      hi: "चैनल पार्टनर / राज्य चैनेलाइजिंग एजेंसी के अधिकार क्षेत्र में निवास की पुष्टि करने वाला दस्तावेज।",
    },
    category: "address",
    mandatory: true,
    issuingAuthority: {
      en: "Revenue Department / Municipal Corporation / Gram Panchayat / Electricity Board",
      hi: "राजस्व विभाग / नगर निगम / ग्राम पंचायत / विद्युत वितरण निगम",
    },
    guidanceNotes: {
      en: "Recent electricity bill (not older than 3 months), Domicile certificate, Ration Card, or registered Rent Agreement.",
      hi: "हालिया बिजली बिल (3 माह से अधिक पुराना न हो), मूल निवास प्रमाण पत्र, राशन कार्ड या पंजीकृत किराया अनुबंध।",
    },
    alternativeDocs: {
      en: "Electricity Bill, Water Bill, Domicile Certificate, Ration Card, or Aadhaar.",
      hi: "बिजली बिल, पानी बिल, मूल निवास प्रमाण पत्र, राशन कार्ड, या आधार कार्ड।",
    },
    digiLockerVerifiable: true,
  },

  "doc-caste-cert": {
    id: "doc-caste-cert",
    name: {
      en: "Caste Certificate (SC / Priority Category)",
      hi: "जाति प्रमाण पत्र (अनुसूचित जाति / प्राथमिकता वर्ग)",
    },
    description: {
      en: "Statutory caste certificate verifying Scheduled Caste or target beneficiary category status.",
      hi: "अनुसूचित जाति या लक्षित लाभार्थी वर्ग की पुष्टि करने वाला वैधानिक जाति प्रमाण पत्र।",
    },
    category: "caste_income",
    mandatory: true,
    issuingAuthority: {
      en: "Tehsildar / Sub-Divisional Magistrate (SDM) / Revenue Officer",
      hi: "तहसीलदार / उप-विभागीय मजिस्ट्रेट (SDM) / सक्षम राजस्व अधिकारी",
    },
    guidanceNotes: {
      en: "Digital barcoded certificate is mandatory in states with online revenue portals. Ensure the certificate is issued by a competent revenue officer.",
      hi: "ऑनलाइन राजस्व पोर्टल वाले राज्यों में डिजिटल बारकोड वाला प्रमाण पत्र अनिवार्य है। सुनिश्चित करें कि यह सक्षम राजस्व अधिकारी द्वारा जारी हो।",
    },
    digiLockerVerifiable: true,
  },

  "doc-income-cert": {
    id: "doc-income-cert",
    name: {
      en: "Family Income Certificate / BPL Ration Card",
      hi: "पारिवारिक आय प्रमाण पत्र / बीपीएल राशन कार्ड",
    },
    description: {
      en: "Proof of annual family income within the concessional eligibility ceiling (₹5.00 Lakhs / BPL).",
      hi: "रियायती पात्रता सीमा (₹5.00 लाख / बीपीएल) के भीतर पारिवारिक वार्षिक आय का प्रमाण।",
    },
    category: "caste_income",
    mandatory: true,
    issuingAuthority: {
      en: "Revenue Inspector / Tehsildar / Block Development Officer (BDO)",
      hi: "राजस्व निरीक्षक / तहसीलदार / खंड विकास अधिकारी (BDO)",
    },
    guidanceNotes: {
      en: "Certificate must be valid for the current financial year (usually valid for 1 year from the date of issue). Antyodaya / BPL ration cards are also accepted.",
      hi: "प्रमाण पत्र चालू वित्तीय वर्ष के लिए वैध होना चाहिए (आमतौर पर जारी होने की तारीख से 1 वर्ष के लिए मान्य)। अंत्योदय / बीपीएल राशन कार्ड भी स्वीकार्य हैं।",
    },
    digiLockerVerifiable: true,
  },

  "doc-bank-passbook": {
    id: "doc-bank-passbook",
    name: {
      en: "Bank Account Passbook / Cancelled Cheque",
      hi: "बैंक खाता पासबुक / रद्द किया गया चेक (Cancelled Cheque)",
    },
    description: {
      en: "Active bank savings or current account proof showing account holder name, account number, and IFSC code for direct DBT disbursement.",
      hi: "प्रत्यक्ष डीबीटी ऋण संवितरण के लिए खाताधारक का नाम, खाता संख्या और आईएफएससी कोड दर्शाने वाली सक्रिय बैंक पासबुक या चेक।",
    },
    category: "statutory",
    mandatory: true,
    issuingAuthority: {
      en: "Commercial Bank / Regional Rural Bank (RRB) / Post Office Payments Bank",
      hi: "सार्वजनिक/निजी बैंक / क्षेत्रीय ग्रामीण बैंक (RRB) / डाकघर भुगतान बैंक",
    },
    guidanceNotes: {
      en: "Bank account must be Aadhaar-linked (Aadhaar-seeded) with DBT enabled for direct government subsidy and loan disbursement.",
      hi: "प्रत्यक्ष सरकारी सब्सिडी और ऋण संवितरण के लिए बैंक खाता आधार से लिंक और डीबीटी सक्षम होना चाहिए।",
    },
    alternativeDocs: {
      en: "Latest 3-month bank statement with branch seal or cancelled cheque leaf.",
      hi: "शाखा की मुहर सहित पिछले 3 महीने का बैंक स्टेटमेंट या रद्द किया गया चेक।",
    },
    digiLockerVerifiable: false,
  },

  "doc-photos": {
    id: "doc-photos",
    name: {
      en: "Passport Size Photographs (3 Recent Copies)",
      hi: "पासपोर्ट आकार के फोटो (3 हालिया प्रतियां)",
    },
    description: {
      en: "Recent color passport-size photographs of the primary applicant (and co-applicant/guarantor if applicable).",
      hi: "मुख्य आवेदक (और सह-आवेदक/गारंटर, यदि लागू हो) की हालिया रंगीन पासपोर्ट आकार की तस्वीरें।",
    },
    category: "identity",
    mandatory: true,
    issuingAuthority: {
      en: "Applicant Self / Photo Studio",
      hi: "आवेदक स्वयं / फोटो स्टूडियो",
    },
    guidanceNotes: {
      en: "Photographs must have a white or light background and be taken within the last 3 months without dark glasses.",
      hi: "फोटो का बैकग्राउंड सफेद या हल्का होना चाहिए और पिछले 3 महीनों में बिना धूप के चश्मे के खींची गई होनी चाहिए।",
    },
    digiLockerVerifiable: false,
  },

  // Project / Equipment / Micro-Credit & Term Loan Documents
  "doc-project-quotations": {
    id: "doc-project-quotations",
    name: {
      en: "Machinery / Equipment Quotations & Invoices",
      hi: "मशीनरी / उपकरण कोटेशन एवं प्रोफॉर्मा इनवॉइस",
    },
    description: {
      en: "Itemized price estimates and GST-registered vendor quotations for tools, machinery, or raw materials to be purchased.",
      hi: "खरीदे जाने वाले औजारों, मशीनरी या कच्चे माल के लिए जीएसटी-पंजीकृत विक्रेता से प्राप्त मदवार मूल्य अनुमान और कोटेशन।",
    },
    category: "project_finance",
    mandatory: true,
    issuingAuthority: {
      en: "Authorized Machinery Manufacturers / Registered Equipment Dealers (with GSTIN)",
      hi: "अधिकृत मशीनरी निर्माता / पंजीकृत उपकरण डीलर (जीएसटीआईएन सहित)",
    },
    guidanceNotes: {
      en: "Quotations must include vendor GST number, valid date, model number, specifications, warranty, and freight/taxes breakdown.",
      hi: "कोटेशन में विक्रेता का जीएसटी नंबर, वैधता तिथि, मॉडल नंबर, विवरण, वारंटी और कर/भाड़ा विवरण स्पष्ट होना चाहिए।",
    },
    digiLockerVerifiable: false,
  },

  "doc-business-premises": {
    id: "doc-business-premises",
    name: {
      en: "Business Premises Lease Agreement / Ownership Deed",
      hi: "व्यावसायिक परिसर किराया अनुबंध / स्वामित्व विलेख",
    },
    description: {
      en: "Proof of lawful possession of the commercial space, workshop, shop, or agricultural land where the enterprise operates.",
      hi: "उस व्यावसायिक स्थान, कार्यशाला, दुकान या भूमि पर वैध कब्जे का प्रमाण जहां उद्यम संचालित किया जाएगा।",
    },
    category: "project_finance",
    mandatory: true,
    issuingAuthority: {
      en: "Sub-Registrar / Land Revenue Department / Property Owner (Notarized Rent Agreement)",
      hi: "उप-पंजीयक / भू-राजस्व विभाग / संपत्ति मालिक (नोटरीकृत किराया समझौता)",
    },
    guidanceNotes: {
      en: "Rent agreement should have minimum 3 years validity or clause of renewal. For home-based work, self-declaration with property tax receipt is accepted.",
      hi: "किराया समझौता कम से कम 3 वर्ष के लिए या नवीनीकरण खंड वाला होना चाहिए। घरेलू कार्य के लिए संपत्ति कर रसीद के साथ स्व-घोषणा स्वीकार्य है।",
    },
    alternativeDocs: {
      en: "Property Tax Receipt, Gram Panchayat NOC, or Notarized Rent Agreement.",
      hi: "संपत्ति कर रसीद, ग्राम पंचायत अनापत्ति प्रमाण पत्र, या नोटरीकृत किराया अनुबंध।",
    },
    digiLockerVerifiable: false,
  },

  "doc-dpr": {
    id: "doc-dpr",
    name: {
      en: "Detailed Project Report (DPR) & Financial Projections",
      hi: "विस्तृत परियोजना रिपोर्ट (DPR) एवं वित्तीय अनुमान",
    },
    description: {
      en: "Comprehensive business project proposal including capital costs, working capital requirements, projected profit & loss, and debt service coverage.",
      hi: "पूंजीगत लागत, कार्यशील पूंजी आवश्यकता, अनुमानित लाभ-हानि और ऋण अदायगी क्षमता दर्शाने वाला व्यापक परियोजना प्रस्ताव।",
    },
    category: "project_finance",
    mandatory: true,
    issuingAuthority: {
      en: "Chartered Accountant (CA) / Certified Project Consultant / MSME Development Institute",
      hi: "चार्टर्ड एकाउंटेंट (CA) / प्रमाणित प्रोजेक्ट सलाहकार / एमएसएमई विकास संस्थान",
    },
    guidanceNotes: {
      en: "Mandatory for term loans above ₹2.00 Lakhs. State Channelizing Agency field officers or DIC can provide standardized project templates.",
      hi: "₹2.00 लाख से अधिक के मियादी ऋण (Term Loan) के लिए अनिवार्य। राज्य एजेंसी या डीआईसी मानकीकृत प्रोजेक्ट प्रारूप प्रदान कर सकते हैं।",
    },
    digiLockerVerifiable: false,
  },

  "doc-trade-license": {
    id: "doc-trade-license",
    name: {
      en: "Trade License / Local Authority Registration / Udyam MSME",
      hi: "ट्रेड लाइसेंस / स्थानीय निकाय पंजीकरण / उद्यम एमएसएमई प्रमाण पत्र",
    },
    description: {
      en: "Statutory registration allowing lawful commercial trade, manufacturing, or service operation in the local area.",
      hi: "स्थानीय क्षेत्र में वैध वाणिज्यिक व्यापार, निर्माण या सेवा संचालन की अनुमति देने वाला वैधानिक पंजीकरण।",
    },
    category: "statutory",
    mandatory: false,
    issuingAuthority: {
      en: "Urban Local Body (ULB) / Municipal Corporation / Gram Panchayat / Ministry of MSME",
      hi: "शहरी स्थानीय निकाय (ULB) / नगर निगम / ग्राम पंचायत / सूक्ष्म, लघु और मध्यम उद्यम मंत्रालय",
    },
    guidanceNotes: {
      en: "Udyam registration is free online at udyamregistration.gov.in and is highly recommended to avail priority sector lending benefits.",
      hi: "udyamregistration.gov.in पर उद्यम पंजीकरण निःशुल्क है और प्राथमिकता क्षेत्र ऋण लाभ प्राप्त करने के लिए अत्यधिक अनुशंसित है।",
    },
    alternativeDocs: {
      en: "Udyam MSME Certificate, Shop & Establishment Act License, or FSSAI License for food ventures.",
      hi: "उद्यम एमएसएमई प्रमाण पत्र, दुकान एवं स्थापना अधिनियम लाइसेंस, या खाद्य उद्यमों के लिए FSSAI लाइसेंस।",
    },
    digiLockerVerifiable: true,
  },

  "doc-pollution-clearance": {
    id: "doc-pollution-clearance",
    name: {
      en: "Pollution Control Board NOC / Factory Inspector Clearance",
      hi: "प्रदूषण नियंत्रण बोर्ड एनओसी / कारखाना निरीक्षक अनापत्ति",
    },
    description: {
      en: "Environmental clearance or consent to establish for manufacturing, processing, recycling, or fabrication industrial units.",
      hi: "विनिर्माण, प्रसंस्करण, रीसाइक्लिंग या फैब्रिकेशन औद्योगिक इकाइयों के लिए पर्यावरण मंजूरी या स्थापना की सहमति।",
    },
    category: "statutory",
    mandatory: false,
    issuingAuthority: {
      en: "State Pollution Control Board (SPCB) / District Industries Centre (DIC)",
      hi: "राज्य प्रदूषण नियंत्रण बोर्ड (SPCB) / जिला उद्योग केंद्र (DIC)",
    },
    guidanceNotes: {
      en: "Required only for manufacturing or industrial machinery projects categorized as Green/Orange under pollution board norms.",
      hi: "केवल प्रदूषण बोर्ड के नियमों के तहत ग्रीन/ऑरेंज के रूप में वर्गीकृत विनिर्माण या औद्योगिक मशीनरी परियोजनाओं के लिए आवश्यक।",
    },
    digiLockerVerifiable: false,
  },

  // Education Loan Documents
  "doc-admission-letter": {
    id: "doc-admission-letter",
    name: {
      en: "Confirmed Admission Offer Letter / Bonafide Student Certificate",
      hi: "पुष्टि प्रवेश पत्र (Admission Letter) / वास्तविक छात्र प्रमाण पत्र",
    },
    description: {
      en: "Official letter from a recognized university, college, or technical institute confirming admission to a full-time professional/higher education course.",
      hi: "मान्यता प्राप्त विश्वविद्यालय, कॉलेज या तकनीकी संस्थान से पूर्णकालिक पेशेवर/उच्च शिक्षा पाठ्यक्रम में प्रवेश की पुष्टि करने वाला आधिकारिक पत्र।",
    },
    category: "education",
    mandatory: true,
    issuingAuthority: {
      en: "University Registrar / Dean of Academic Admissions / Principal",
      hi: "विश्वविद्यालय रजिस्ट्रार / शैक्षणिक प्रवेश डीन / प्राचार्य",
    },
    guidanceNotes: {
      en: "The course must be approved by AICTE, UGC, Medical Council (NMC), or equivalent regulatory bodies in India or abroad.",
      hi: "पाठ्यक्रम भारत या विदेश में एआईसीटीई, यूजीसी, एनएमसी या समकक्ष नियामक निकायों द्वारा अनुमोदित होना चाहिए।",
    },
    digiLockerVerifiable: false,
  },

  "doc-fee-schedule": {
    id: "doc-fee-schedule",
    name: {
      en: "Institutional Fee Structure Breakdown",
      hi: "संस्थान द्वारा जारी शुल्क संरचना (Fee Schedule)",
    },
    description: {
      en: "Official year-wise / semester-wise breakdown of tuition fees, hostel/boarding charges, examination fees, library, and laboratory charges.",
      hi: "ट्यूशन फीस, हॉस्टल शुल्क, परीक्षा शुल्क, पुस्तकालय और प्रयोगशाला शुल्क का संस्थान द्वारा अधिकृत सेमेस्टर-वार विवरण।",
    },
    category: "education",
    mandatory: true,
    issuingAuthority: {
      en: "College Finance Officer / Bursar / Head of Institution",
      hi: "कॉलेज वित्त अधिकारी / कोषाध्यक्ष / संस्था प्रमुख",
    },
    guidanceNotes: {
      en: "Ensure the schedule is on official college letterhead with rubber stamp and signed by an authorized signatory.",
      hi: "सुनिश्चित करें कि शुल्क विवरण आधिकारिक कॉलेज लेटरहेड पर मोहर और अधिकृत हस्ताक्षरकर्ता द्वारा हस्ताक्षरित हो।",
    },
    digiLockerVerifiable: false,
  },

  "doc-marksheets": {
    id: "doc-marksheets",
    name: {
      en: "10th, 12th & Degree Marksheets / Certificates",
      hi: "10वीं, 12वीं एवं स्नातक अंकतालिकाएं / प्रमाण पत्र",
    },
    description: {
      en: "Academic transcripts and passing certificates proving completion of qualifying examination for the admitted course.",
      hi: "प्रवेशित पाठ्यक्रम के लिए योग्यता परीक्षा उत्तीर्ण करने का प्रमाण देने वाली शैक्षणिक अंकतालिकाएं और प्रमाण पत्र।",
    },
    category: "education",
    mandatory: true,
    issuingAuthority: {
      en: "CBSE / ICSE / State Secondary Education Board / University Registrar",
      hi: "सीबीएसई / आईसीएसई / राज्य माध्यमिक शिक्षा बोर्ड / विश्वविद्यालय",
    },
    guidanceNotes: {
      en: "Digital verified marksheets from DigiLocker are accepted by all State Channelizing Agencies and banks.",
      hi: "डिजिलॉकर से डिजिटल सत्यापित अंकतालिकाएं सभी राज्य एजेंसियों और बैंकों द्वारा स्वीकार की जाती हैं।",
    },
    digiLockerVerifiable: true,
  },

  "doc-entrance-scorecard": {
    id: "doc-entrance-scorecard",
    name: {
      en: "Entrance Examination Scorecard / Merit Rank Card",
      hi: "प्रवेश परीक्षा स्कोरकार्ड / मेरिट रैंक कार्ड",
    },
    description: {
      en: "National / State entrance test scorecard (e.g. NEET, JEE Main/Advanced, CAT, CLAT, GATE, GRE, GMAT).",
      hi: "राष्ट्रीय / राज्य स्तरीय प्रवेश परीक्षा स्कोरकार्ड (उदा. नीट, जेईई, कैट, क्लैट, गेट, जीआरई, जीमैट)।",
    },
    category: "education",
    mandatory: false,
    issuingAuthority: {
      en: "National Testing Agency (NTA) / State CET Cell / IIT / IIM Examination Bodies",
      hi: "राष्ट्रीय परीक्षा एजेंसी (NTA) / राज्य सीईटी सेल / संबंधित परीक्षा निकाय",
    },
    guidanceNotes: {
      en: "Required if admission was secured through merit quota or competitive examination ranking.",
      hi: "यदि प्रवेश मेरिट कोटे या प्रतियोगी परीक्षा रैंकिंग के माध्यम से सुरक्षित किया गया था, तो यह आवश्यक है।",
    },
    digiLockerVerifiable: true,
  },

  "doc-visa-passport": {
    id: "doc-visa-passport",
    name: {
      en: "Student Visa & Passport Copy (For Studies Abroad)",
      hi: "छात्र वीजा एवं पासपोर्ट प्रति (विदेश में अध्ययन हेतु)",
    },
    description: {
      en: "Valid passport (min 6 months validity) and approved student study visa or I-20 form / CAS letter for foreign universities.",
      hi: "वैध पासपोर्ट (न्यूनतम 6 माह की वैधता) और विदेशी विश्वविद्यालयों के लिए स्वीकृत छात्र वीजा या I-20 / CAS पत्र।",
    },
    category: "education",
    mandatory: false,
    issuingAuthority: {
      en: "Ministry of External Affairs / Foreign Embassy & Immigration Department",
      hi: "विदेश मंत्रालय / संबंधित विदेशी दूतावास एवं आव्रजन विभाग",
    },
    guidanceNotes: {
      en: "Mandatory only when applying for Education Loans for studying abroad (overseas institutions).",
      hi: "विदेश में अध्ययन (विदेशी संस्थानों) के लिए शिक्षा ऋण के लिए आवेदन करते समय ही अनिवार्य।",
    },
    digiLockerVerifiable: false,
  },

  // Mahila Samriddhi Yojana Documents
  "doc-shg-cert": {
    id: "doc-shg-cert",
    name: {
      en: "SHG Membership Certificate / Women Entrepreneur Undertaking",
      hi: "स्वयं सहायता समूह (SHG) सदस्यता प्रमाण / महिला उद्यमी घोषणा पत्र",
    },
    description: {
      en: "Proof of Self-Help Group active membership or individual woman entrepreneur undertaking for Mahila Samriddhi assistance.",
      hi: "महिला समृद्धि सहायता के लिए स्वयं सहायता समूह की सक्रिय सदस्यता का प्रमाण या व्यक्तिगत महिला उद्यमी घोषणा पत्र।",
    },
    category: "statutory",
    mandatory: true,
    issuingAuthority: {
      en: "State Rural Livelihood Mission (SRLM) / NABARD / Gram Panchayat / SCA",
      hi: "राज्य ग्रामीण आजीविका मिशन (SRLM) / नाबार्ड / ग्राम पंचायत / राज्य एजेंसी",
    },
    guidanceNotes: {
      en: "For SHG applications, at least 60% members must belong to Scheduled Caste community as per NSFDC norms.",
      hi: "एसएचजी आवेदनों के लिए, एनएसएफडीसी नियमों के अनुसार कम से कम 60% सदस्य अनुसूचित जाति समुदाय से होने चाहिए।",
    },
    digiLockerVerifiable: false,
  },

  // Sanitation Worker Scheme (Swachhta Udyami Yojana) Documents
  "doc-ulb-cert": {
    id: "doc-ulb-cert",
    name: {
      en: "Urban Local Body (ULB) / Gram Panchayat Safai Karamchari Certificate",
      hi: "शहरी स्थानीय निकाय (ULB) / ग्राम पंचायत सफाई कर्मचारी प्रमाण पत्र",
    },
    description: {
      en: "Statutory certificate confirming that applicant or their dependent is a manual scavenger, safai karamchari, or sanitary worker.",
      hi: "यह पुष्टि करने वाला प्रमाण पत्र कि आवेदक या उनके आश्रित सफाई कर्मचारी, स्वच्छता कार्यकर्ता या मैला ढोने वाले परिवार से हैं।",
    },
    category: "statutory",
    mandatory: true,
    issuingAuthority: {
      en: "Municipal Commissioner / Chief Executive Officer (CEO) / Panchayat Secretary",
      hi: "नगर निगम आयुक्त / मुख्य कार्यकारी अधिकारी (CEO) / ग्राम पंचायत सचिव",
    },
    guidanceNotes: {
      en: "Certificate issued by the Competent Authority under the Prohibition of Employment as Manual Scavengers and their Rehabilitation Act.",
      hi: "सफाई कर्मचारी पुनर्वास अधिनियम के तहत सक्षम स्थानीय प्राधिकारी द्वारा जारी प्रमाण पत्र।",
    },
    digiLockerVerifiable: false,
  },

  "doc-sanitation-machinery-quote": {
    id: "doc-sanitation-machinery-quote",
    name: {
      en: "Sanitation Vehicle / Suction Machine Technical Quotation",
      hi: "स्वच्छता वाहन / सक्शन जेटिंग मशीन तकनीकी कोटेशन",
    },
    description: {
      en: "Manufacturer quotation for mechanized sanitation equipment, suction machines, vacuum loaders, or garbage transport vehicles.",
      hi: "यंत्रीकृत स्वच्छता उपकरण, सक्शन मशीन, वैक्यूम लोडर या कचरा परिवहन वाहनों के लिए निर्माता कोटेशन।",
    },
    category: "project_finance",
    mandatory: true,
    issuingAuthority: {
      en: "Authorized Automotive / Sanitation Equipment Manufacturer or Dealer",
      hi: "अधिकृत ऑटोमोटिव / स्वच्छता उपकरण निर्माता या डीलर",
    },
    guidanceNotes: {
      en: "Quotation must specify vehicular chassis number, pump capacity, tank volume, and warranty terms.",
      hi: "कोटेशन में वाहन चेसिस नंबर, पंप क्षमता, टैंक क्षमता और वारंटी शर्तों का उल्लेख होना चाहिए।",
    },
    digiLockerVerifiable: false,
  },

  "doc-commercial-dl": {
    id: "doc-commercial-dl",
    name: {
      en: "Commercial Driving License (For Sanitation Vehicle Operators)",
      hi: "व्यावसायिक ड्राइविंग लाइसेंस (स्वच्छता वाहन चालकों हेतु)",
    },
    description: {
      en: "Valid Transport/Commercial driving license of the applicant or designated driver for operating mechanized cleaning vehicles.",
      hi: "यंत्रीकृत सफाई वाहनों के संचालन के लिए आवेदक या नामित चालक का वैध व्यावसायिक ड्राइविंग लाइसेंस।",
    },
    category: "statutory",
    mandatory: false,
    issuingAuthority: {
      en: "Regional Transport Office (RTO) / Ministry of Road Transport and Highways",
      hi: "क्षेत्रीय परिवहन कार्यालय (RTO) / सड़क परिवहन और राजमार्ग मंत्रालय",
    },
    guidanceNotes: {
      en: "Required if loan includes motorized vehicular sanitation machinery.",
      hi: "यदि ऋण में मोटर चालित वाहन स्वच्छता मशीनरी शामिल है तो यह आवश्यक है।",
    },
    digiLockerVerifiable: true,
  },

  // Green Business Scheme Documents
  "doc-solar-quote": {
    id: "doc-solar-quote",
    name: {
      en: "Solar / EV Vendor Technical Quotation & Feasibility Report",
      hi: "सोलर / ईवी वेंडर तकनीकी कोटेशन एवं व्यवहार्यता रिपोर्ट",
    },
    description: {
      en: "Itemized technical quotation and site generation feasibility report for Solar PV rooftop, battery storage, or Electric Vehicle setup.",
      hi: "सोलर पीवी रूफटॉप, बैटरी स्टोरेज या इलेक्ट्रिक वाहन सेटअप के लिए मदवार तकनीकी कोटेशन और व्यवहार्यता रिपोर्ट।",
    },
    category: "project_finance",
    mandatory: true,
    issuingAuthority: {
      en: "MNRE / State Nodal Energy Agency Approved Vendor / Channel Partner",
      hi: "नवीन एवं नवीकरणीय ऊर्जा मंत्रालय (MNRE) / राज्य ऊर्जा विकास एजेंसी अनुमोदित वेंडर",
    },
    guidanceNotes: {
      en: "Vendor must be empanelled with MNRE or the State Renewable Energy Development Agency (e.g. MEDA, UPNEDA, CREST).",
      hi: "विक्रेता को एमएनआरई या राज्य नवीकरणीय ऊर्जा विकास एजेंसी के साथ सूचीबद्ध होना चाहिए।",
    },
    digiLockerVerifiable: false,
  },

  "doc-discom-approval": {
    id: "doc-discom-approval",
    name: {
      en: "Electricity Board Rooftop Net-Metering Feasibility / Consent",
      hi: "विद्युत वितरण निगम रूफटॉप नेट-मीटरिंग सहमति / एनओसी",
    },
    description: {
      en: "Technical feasibility approval or grid connectivity consent from the local electricity distribution company (DISCOM) for solar grid tie-in.",
      hi: "सोलर ग्रिड कनेक्शन के लिए स्थानीय बिजली वितरण कंपनी (DISCOM) से तकनीकी व्यवहार्यता मंजूरी या अनापत्ति पत्र।",
    },
    category: "statutory",
    mandatory: false,
    issuingAuthority: {
      en: "State Power Distribution Company (DISCOM) / Electricity Board",
      hi: "राज्य विद्युत वितरण कंपनी (DISCOM) / बिजली बोर्ड",
    },
    guidanceNotes: {
      en: "Required for grid-connected rooftop solar plants. For standalone off-grid solar or battery e-rickshaws, DISCOM approval is not required.",
      hi: "ग्रिड-कनेक्टेड रूफटॉप सोलर प्लांट के लिए आवश्यक। स्टैंडअलोन ऑफ-ग्रिड सोलर या बैटरी ई-रिक्शा के लिए यह आवश्यक नहीं है।",
    },
    digiLockerVerifiable: false,
  },

  // PM-DAKSH Skill Loan Scheme Documents
  "doc-daksh-cert": {
    id: "doc-daksh-cert",
    name: {
      en: "PM-DAKSH / NSDC Skill Training Completion Certificate",
      hi: "पीएम-दक्ष / एनएसडीसी कौशल प्रशिक्षण पूर्णता प्रमाण पत्र",
    },
    description: {
      en: "Certificate proving completion of formal skill development, upskilling, or entrepreneurship training under PM-DAKSH, NSDC, or RSETI.",
      hi: "पीएम-दक्ष, एनएसडीसी या आरएसईटीआई के तहत औपचारिक कौशल विकास या उद्यमिता प्रशिक्षण पूरा करने का प्रमाण पत्र।",
    },
    category: "statutory",
    mandatory: true,
    issuingAuthority: {
      en: "Ministry of Social Justice & Empowerment / Sector Skill Council (SSC) / NSDC",
      hi: "सामाजिक न्याय और अधिकारिता मंत्रालय / सेक्टर स्किल काउंसिल (SSC) / एनएसडीसी",
    },
    guidanceNotes: {
      en: "Certificate contains candidate roll number and QR code for instant authentication by channelizing agency.",
      hi: "प्रमाण पत्र में एजेंसी द्वारा त्वरित सत्यापन के लिए उम्मीदवार का रोल नंबर और क्यूआर कोड होता है।",
    },
    digiLockerVerifiable: true,
  },
}

// --- Scheme-to-Document Rule Mappings ---

const BASE_MANDATORY_DOC_IDS = [
  "doc-aadhaar",
  "doc-address-proof",
  "doc-caste-cert",
  "doc-income-cert",
  "doc-bank-passbook",
  "doc-photos",
]

export const SCHEME_DOCUMENT_RULES: Record<
  string,
  {
    schemeName: LocalizedText
    schemeType: SchemeType
    docIds: string[]
    specialInstructions?: LocalizedText
  }
> = {
  "micro-finance": {
    schemeName: {
      en: "Micro Credit Scheme (MCS)",
      hi: "लघु ऋण योजना (माइक्रो क्रेडिट)",
    },
    schemeType: "micro",
    docIds: [
      ...BASE_MANDATORY_DOC_IDS,
      "doc-project-quotations",
      "doc-business-premises",
      "doc-trade-license",
    ],
    specialInstructions: {
      en: "For micro loans up to ₹1.40 Lakhs, collateral is not required. Provide vendor estimates for machinery/tools and proof of shop/trade location.",
      hi: "₹1.40 लाख तक के सूक्ष्म ऋणों के लिए किसी गारंटी (कोलैटरल) की आवश्यकता नहीं है। मशीनरी/उपकरणों के लिए विक्रेता कोटेशन और दुकान/कार्यस्थल का प्रमाण संलग्न करें।",
    },
  },

  "term-loan": {
    schemeName: {
      en: "Term Loan Scheme",
      hi: "मियादी ऋण योजना (टर्म लोन)",
    },
    schemeType: "term",
    docIds: [
      ...BASE_MANDATORY_DOC_IDS,
      "doc-dpr",
      "doc-project-quotations",
      "doc-business-premises",
      "doc-trade-license",
      "doc-pollution-clearance",
    ],
    specialInstructions: {
      en: "Term loans up to ₹50.00 Lakhs require a CA-certified Detailed Project Report (DPR), quotation from authorized machinery vendors, and land/shed lease documents.",
      hi: "₹50.00 लाख तक के टर्म लोन के लिए सीए-प्रमाणित विस्तृत परियोजना रिपोर्ट (DPR), अधिकृत मशीनरी विक्रेताओं से कोटेशन और भूमि/शेड पट्टा दस्तावेज आवश्यक हैं।",
    },
  },

  "education-loan": {
    schemeName: {
      en: "Education Loan Scheme",
      hi: "शिक्षा ऋण योजना (एजुकेशन लोन)",
    },
    schemeType: "education",
    docIds: [
      ...BASE_MANDATORY_DOC_IDS,
      "doc-admission-letter",
      "doc-fee-schedule",
      "doc-marksheets",
      "doc-entrance-scorecard",
      "doc-visa-passport",
    ],
    specialInstructions: {
      en: "Requires confirmed admission letter, official college fee schedule, previous academic marksheets, and entrance test scorecard. Student visa required for foreign study.",
      hi: "पुष्ट प्रवेश पत्र, कॉलेज का आधिकारिक शुल्क विवरण, पिछली शैक्षणिक अंकतालिकाएं और प्रवेश परीक्षा स्कोरकार्ड आवश्यक हैं। विदेश में अध्ययन के लिए छात्र वीजा अनिवार्य है।",
    },
  },

  "mahila-samriddhi": {
    schemeName: {
      en: "Mahila Samriddhi Yojana",
      hi: "महिला समृद्धि योजना",
    },
    schemeType: "micro",
    docIds: [
      ...BASE_MANDATORY_DOC_IDS,
      "doc-shg-cert",
      "doc-project-quotations",
      "doc-business-premises",
    ],
    specialInstructions: {
      en: "Tailored micro-credit for women entrepreneurs and Self-Help Groups. Submit SHG membership certification or self-declaration with equipment quotation.",
      hi: "महिला उद्यमियों और स्वयं सहायता समूहों के लिए रियायती सूक्ष्म ऋण। उपकरण कोटेशन के साथ एसएचजी सदस्यता प्रमाण या स्व-घोषणा जमा करें।",
    },
  },

  "swachhta-udyami": {
    schemeName: {
      en: "Swachhta Udyami Yojana",
      hi: "स्वच्छता उद्यमी योजना",
    },
    schemeType: "term",
    docIds: [
      ...BASE_MANDATORY_DOC_IDS,
      "doc-ulb-cert",
      "doc-sanitation-machinery-quote",
      "doc-commercial-dl",
      "doc-business-premises",
    ],
    specialInstructions: {
      en: "Targeted support for sanitation workers and safai karamcharis. Requires Urban Local Body (ULB) / Panchayat verification certificate and vehicle/machine quotation.",
      hi: "सफाई कर्मचारियों के लिए लक्षित योजना। शहरी स्थानीय निकाय (ULB) / पंचायत सत्यापन प्रमाण पत्र और स्वच्छता वाहन/मशीन कोटेशन आवश्यक है।",
    },
  },

  "green-business": {
    schemeName: {
      en: "Green Business Scheme",
      hi: "ग्रीन बिजनेस योजना (सोलर एवं ईवी)",
    },
    schemeType: "term",
    docIds: [
      ...BASE_MANDATORY_DOC_IDS,
      "doc-solar-quote",
      "doc-discom-approval",
      "doc-business-premises",
      "doc-dpr",
    ],
    specialInstructions: {
      en: "Promotes eco-friendly ventures like Solar PV, E-Rickshaws, and Bio-waste units. Requires MNRE-approved vendor technical quotation and site feasibility report.",
      hi: "सौर ऊर्जा, ई-रिक्शा और पर्यावरण-अनुकूल उद्यमों को बढ़ावा। एमएनआरई-अनुमोदित विक्रेता से तकनीकी कोटेशन और साइट व्यवहार्यता रिपोर्ट आवश्यक है।",
    },
  },

  "pm-daksh-loan": {
    schemeName: {
      en: "PM-DAKSH Business / Skill Loan",
      hi: "पीएम-दक्ष व्यवसाय एवं कौशल ऋण",
    },
    schemeType: "micro",
    docIds: [
      ...BASE_MANDATORY_DOC_IDS,
      "doc-daksh-cert",
      "doc-project-quotations",
      "doc-business-premises",
    ],
    specialInstructions: {
      en: "For beneficiaries who completed skill development courses under PM-DAKSH / NSDC. Submit skill completion certificate along with tool-kit quotation.",
      hi: "पीएम-दक्ष / एनएसडीसी के तहत कौशल विकास पूरा करने वाले लाभार्थियों के लिए। टूल-किट कोटेशन के साथ कौशल प्रमाण पत्र संलग्न करें।",
    },
  },
}

// --- Helper Functions ---

export function getDocumentById(id: string): RequiredDocument | undefined {
  return STATUTORY_DOCUMENTS[id]
}

export function getAllDocuments(): RequiredDocument[] {
  return Object.values(STATUTORY_DOCUMENTS)
}

export function getDocumentsForScheme(schemeId: string, schemeType?: string): RequiredDocument[] {
  const rule = SCHEME_DOCUMENT_RULES[schemeId]
  if (rule) {
    return rule.docIds
      .map((id) => STATUTORY_DOCUMENTS[id])
      .filter((doc): doc is RequiredDocument => Boolean(doc))
  }

  // Fallback by schemeType if specific schemeId not configured
  if (schemeType === "education") {
    return SCHEME_DOCUMENT_RULES["education-loan"].docIds
      .map((id) => STATUTORY_DOCUMENTS[id])
      .filter((doc): doc is RequiredDocument => Boolean(doc))
  }

  if (schemeType === "term") {
    return SCHEME_DOCUMENT_RULES["term-loan"].docIds
      .map((id) => STATUTORY_DOCUMENTS[id])
      .filter((doc): doc is RequiredDocument => Boolean(doc))
  }

  // Default to micro-finance base set
  return SCHEME_DOCUMENT_RULES["micro-finance"].docIds
    .map((id) => STATUTORY_DOCUMENTS[id])
    .filter((doc): doc is RequiredDocument => Boolean(doc))
}

export function getSchemeDocumentConfig(
  schemeId: string,
  customName?: LocalizedText,
  customType?: SchemeType,
): SchemeDocumentConfig {
  const rule = SCHEME_DOCUMENT_RULES[schemeId]
  const docs = getDocumentsForScheme(schemeId, customType || rule?.schemeType)

  if (rule) {
    return {
      schemeId,
      schemeType: rule.schemeType,
      schemeName: customName || rule.schemeName,
      documents: docs,
      specialInstructions: rule.specialInstructions,
    }
  }

  return {
    schemeId,
    schemeType: customType || "micro",
    schemeName: customName || { en: "Selected Scheme", hi: "चयनित योजना" },
    documents: docs,
  }
}

export function getAllSchemeConfigs(): SchemeDocumentConfig[] {
  return Object.keys(SCHEME_DOCUMENT_RULES).map((id) => getSchemeDocumentConfig(id))
}

export function getDocumentCategories(): { id: DocumentCategory; label: LocalizedText }[] {
  return [
    { id: "all", label: { en: "All Documents", hi: "सभी दस्तावेज" } },
    { id: "identity", label: { en: "Identity & Photo", hi: "पहचान व फोटो" } },
    { id: "address", label: { en: "Address & Domicile", hi: "पता एवं निवास" } },
    { id: "caste_income", label: { en: "Caste & Income", hi: "जाति एवं आय" } },
    { id: "project_finance", label: { en: "Project & Quotations", hi: "प्रोजेक्ट व कोटेशन" } },
    { id: "education", label: { en: "Education & Academic", hi: "शैक्षणिक दस्तावेज" } },
    { id: "statutory", label: { en: "Statutory & Bank", hi: "वैधानिक व बैंक" } },
  ]
}

export function computeReadiness(
  documents: RequiredDocument[],
  checkedMap: Record<string, boolean>,
): DocumentReadinessState {
  if (!documents || documents.length === 0) {
    return {
      totalCount: 0,
      completedCount: 0,
      percentage: 0,
      status: "not_started",
      mandatoryTotal: 0,
      mandatoryCompleted: 0,
    }
  }

  const totalCount = documents.length
  let completedCount = 0
  let mandatoryTotal = 0
  let mandatoryCompleted = 0

  for (const doc of documents) {
    const isChecked = Boolean(checkedMap[doc.id])
    if (isChecked) {
      completedCount++
    }
    if (doc.mandatory) {
      mandatoryTotal++
      if (isChecked) {
        mandatoryCompleted++
      }
    }
  }

  const percentage = Math.round((completedCount / totalCount) * 100)

  let status: DocumentReadinessState["status"] = "not_started"
  if (completedCount === totalCount && totalCount > 0) {
    status = "ready_to_apply"
  } else if (completedCount > 0) {
    status = "in_progress"
  }

  return {
    totalCount,
    completedCount,
    percentage,
    status,
    mandatoryTotal,
    mandatoryCompleted,
  }
}
