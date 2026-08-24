import type { MapService } from "./types"

/**
 * Google Maps adapter — intentionally a stub.
 * Leaflet + OpenStreetMap is the default (zero API cost). If the budget
 * allows Google Maps later, implement `createGoogleMapsMap` against the same
 * `MapService` interface; no UI code changes required.
 */
export function createGoogleMapsMap(): MapService {
  throw new Error(
    "Google Maps adapter not implemented — using the default Leaflet adapter",
  )
}
