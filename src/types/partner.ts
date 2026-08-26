import { Timestamp } from "firebase/firestore"

export type PartnerCategory = "bank" | "nbfc" | "ngo" | "government"

export interface GeoLocation {
  latitude: number
  longitude: number
}

export interface PartnerAvailability {
  hours?: string
  days?: string
}

export interface PartnerDocument {
  id: string
  name: string
  type: PartnerCategory
  address: string
  state: string
  district: string
  pincode?: string
  geoLocation: GeoLocation | null
  phone: string
  email?: string
  website?: string
  supportedSchemes: string[]
  availability?: PartnerAvailability
  rating?: number
  isActive: boolean
  lastUpdated: string
  officialSource?: string
  createdAt: Timestamp
  updatedAt: Timestamp
}

/** Legacy compat — minimal partner for existing routing logic */
export interface ChannelPartner {
  id: string
  name: string
  type: "SCA" | "PSB" | "RRB" | "NBFC_MFI"
  address: string
  city: string
  state: string
  geo: { lat: number; lng: number }
  phone: string
  schemeCategories: ("micro" | "term" | "education")[]
  npaFlag: "low" | "medium" | "high"
  fundUtilizationPct: number
  docsRequired: { en: string; hi: string }[]
  avgProcessingDays?: number
}
