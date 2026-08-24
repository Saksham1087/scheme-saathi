import type { ChannelPartner } from "@/types"

export interface GeoPoint {
  lat: number
  lng: number
}

/**
 * Map abstraction so the provider can be swapped (Leaflet today, Google Maps
 * or any other tomorrow) without touching the partner locator UI.
 */
export interface MapService {
  mount(container: HTMLElement): void
  setMarkers(partners: ChannelPartner[], focusId?: string | null): void
  setUserLocation(loc: GeoPoint): void
  destroy(): void
}
