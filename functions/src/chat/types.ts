export interface LocalScheme {
  id: string;
  slug: string;
  name: { en: string; hi: string; mr?: string };
  ministry: string;
  department?: string;
  category: string[];
  description: { en: string; hi: string; mr?: string };
  shortDescription: { en: string; hi: string; mr?: string };
  purpose: string;
  targetBeneficiaries: string[];
  financialAssistance: {
    type: string;
    minAmount: number;
    maxAmount: number;
    interestRate?: { min: number; max: number };
    moratoriumMonths?: { min: number; max: number };
    repaymentMonths?: { min: number; max: number };
    coverageMaxPct?: number;
  };
  eligibilityRules: {
    minIncome?: number;
    maxIncome?: number;
    minAge?: number;
    maxAge?: number;
    categories?: string[];
    states?: string[];
    districts?: string[];
    occupations?: string[];
    education?: string[];
    purposes?: string[];
    disabilityRequired?: boolean;
    gender?: string;
    existingBusiness?: boolean;
    customRules?: Array<{
      field: string;
      operator: string;
      value: string | number | boolean | string[];
      description?: { en: string; hi: string };
    }>;
  };
  eligibilityRuleIds: string[];
  requiredDocuments: Array<{
    name: string;
    description: string;
    mandatory: boolean;
    format?: string;
  }>;
  applicationProcess?: string;
  channelPartnerTypes: string[];
  officialUrl?: string;
  source: string;
  lastUpdated: string;
  verified: boolean;
  isActive: boolean;
  createdAt: any;
  updatedAt: any;
}

export interface UserProfile {
  uid: string;
  state?: string;
  district?: string;
  preferredLanguage?: string;
  category?: string;
}

export interface ConversationIntent {
  purpose?: string;
  amount?: number;
  state?: string;
}

export type VoiceLanguage = "en" | "hi" | "mr";