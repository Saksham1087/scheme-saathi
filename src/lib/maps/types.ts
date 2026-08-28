import type { ChannelPartner, PartnerType } from "@/types"

export interface GeoPoint {
  lat: number
  lng: number
}

export interface MapServiceOptions {
  onMarkerClick?: (partnerId: string) => void
}

export interface MapService {
  mount(container: HTMLElement, options?: MapServiceOptions): void
  setMarkers(partners: ChannelPartner[], focusId?: string | null): void
  setUserLocation(loc: GeoPoint): void
  focusPartner(partner: ChannelPartner): void
  invalidateSize(): void
  destroy(): void
}

export interface PartnerTypeVisual {
  type: PartnerType
  color: string
  borderColor: string
  bgClass: string
  textClass: string
  borderClass: string
  labelKey: string
  shortLabel: string
}

export const PARTNER_TYPE_VISUALS: Record<PartnerType, PartnerTypeVisual> = {
  SCA: {
    type: "SCA",
    color: "#7c3aed", // Purple
    borderColor: "#5b21b6",
    bgClass: "bg-purple-100 text-purple-800 dark:bg-purple-950 dark:text-purple-300",
    textClass: "text-purple-700 dark:text-purple-300",
    borderClass: "border-purple-300 dark:border-purple-800",
    labelKey: "partners.typeNames.SCA",
    shortLabel: "SCA",
  },
  PSB: {
    type: "PSB",
    color: "#2563eb", // Blue
    borderColor: "#1d4ed8",
    bgClass: "bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300",
    textClass: "text-blue-700 dark:text-blue-300",
    borderClass: "border-blue-300 dark:border-blue-800",
    labelKey: "partners.typeNames.PSB",
    shortLabel: "PSB",
  },
  RRB: {
    type: "RRB",
    color: "#16a34a", // Green
    borderColor: "#15803d",
    bgClass: "bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300",
    textClass: "text-emerald-700 dark:text-emerald-300",
    borderClass: "border-emerald-300 dark:border-emerald-800",
    labelKey: "partners.typeNames.RRB",
    shortLabel: "RRB",
  },
  NBFC_MFI: {
    type: "NBFC_MFI",
    color: "#d97706", // Amber
    borderColor: "#b45309",
    bgClass: "bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300",
    textClass: "text-amber-700 dark:text-amber-300",
    borderClass: "border-amber-300 dark:border-amber-800",
    labelKey: "partners.typeNames.NBFC_MFI",
    shortLabel: "NBFC",
  },
}
