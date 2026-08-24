import L from "leaflet"
import "leaflet/dist/leaflet.css"
import type { GeoPoint, MapService } from "./types"

function partnerIcon(highNpa: boolean): L.DivIcon {
  return L.divIcon({
    className: "",
    html:
      `<span style="display:block;width:18px;height:18px;border-radius:50%;` +
      `background:${highNpa ? "#b3261e" : "#4636c7"};border:3px solid #fffdf8;` +
      `box-shadow:0 1px 4px rgba(38,32,90,.45)"></span>`,
    iconSize: [18, 18],
    iconAnchor: [9, 9],
  })
}

function userIcon(): L.DivIcon {
  return L.divIcon({
    className: "",
    html:
      `<span style="display:block;width:14px;height:14px;border-radius:50%;` +
      `background:#e8a013;border:3px solid #fffdf8;` +
      `box-shadow:0 1px 6px rgba(232,160,19,.7)"></span>`,
    iconSize: [14, 14],
    iconAnchor: [7, 7],
  })
}

export function createLeafletMap(): MapService {
  let map: L.Map | null = null
  let markerLayer: L.LayerGroup | null = null
  let userMarker: L.Marker | null = null

  return {
    mount(container) {
      map = L.map(container, {
        center: [22.9734, 78.6569],
        zoom: 5,
        scrollWheelZoom: true,
      })
      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: "&copy; OpenStreetMap contributors",
        maxZoom: 18,
      }).addTo(map)
      markerLayer = L.layerGroup().addTo(map)
    },

    setMarkers(partners, focusId) {
      if (!map || !markerLayer) return
      markerLayer.clearLayers()
      const bounds: L.LatLngExpression[] = []

      for (const p of partners) {
        const highNpa = p.npaFlag === "high"
        const marker = L.marker([p.geo.lat, p.geo.lng], {
          icon: partnerIcon(highNpa),
          title: p.name,
        })
        marker.bindPopup(
          `<strong>${p.name}</strong><br/>${p.city}<br/>` +
            (p.phone ? `<a href="tel:${p.phone}">${p.phone}</a>` : ""),
        )
        marker.addTo(markerLayer)
        bounds.push([p.geo.lat, p.geo.lng])
        if (focusId && p.id === focusId) {
          map.setView([p.geo.lat, p.geo.lng], 13, { animate: true })
        }
      }

      if (bounds.length > 0 && !focusId) {
        map.fitBounds(L.latLngBounds(bounds), { padding: [36, 36], maxZoom: 11 })
      }
    },

    setUserLocation(loc: GeoPoint) {
      if (!map) return
      userMarker?.remove()
      userMarker = L.marker([loc.lat, loc.lng], { icon: userIcon() })
        .addTo(map)
        .bindPopup("📍")
      map.setView([loc.lat, loc.lng], 11, { animate: true })
    },

    destroy() {
      map?.remove()
      map = null
      markerLayer = null
      userMarker = null
    },
  }
}
